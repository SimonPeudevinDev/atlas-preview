/* ATLAS — Défi entre amis par Internet (Duel tactique).
   Aucun serveur à nous : les deux navigateurs se parlent par des brokers MQTT publics (WebSocket sécurisé), plusieurs à la fois.
   Même interface que tools/lan/serve.py : A.relay.call('salle', …), ('salle/ID'), ('salle/ID/rejoindre'|'coup'|'quitter').
   L’état d’une salle est reconstruit à partir de messages « retenus » (retained) : un joueur qui se reconnecte
   (téléphone mis en veille, réseau qui change) se réabonne et retrouve tout. Chaque navigateur calcule le duel
   lui-même avec la graine de la salle, comme en réseau local.
   Sujets : atlas-duel/v1/<ID>/host · join/<jeton> · guest · m/<0|1>/<n> · left
   Combat d’essai (deux liens fixes, Joueur 1 / Joueur 2) : <ID>/seat/<1|2> (présence, équipe, jeton « prêt »),
   puis une partie par paire de jetons prêts : <ID>/x/<partie>/m/<0|1>/<n>. Les liens se réutilisent indéfiniment. */
(function () {
  'use strict';
  var A = window.ATLAS = window.ATLAS || {};
  var BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081/mqtt'];
  var ROOT = 'atlas-duel/v1/';
  var PUBLIC = 'https://simonpeudevindev.github.io/atlas-preview/';   // adresse du lien quand le site tourne en local
  var LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';   // sans I ni O
  var enc = window.TextEncoder ? new TextEncoder() : null, dec = window.TextDecoder ? new TextDecoder() : null;

  function rnd(n, chars) { var s = ''; for (var i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)]; return s; }
  function token() { return rnd(16, '0123456789abcdef'); }

  /* ---------- Client MQTT 3.1.1 minimal (QoS 0, retained) ---------- */
  function bytes(s) { return Array.prototype.slice.call(enc.encode(s)); }
  function str(s) { var b = bytes(s); return [b.length >> 8, b.length & 255].concat(b); }
  function packet(head, body) {
    var len = body.length, out = [head];
    do { var d = len & 127; len = Math.floor(len / 128); out.push(len ? d | 128 : d); } while (len);
    return new Uint8Array(out.concat(body));
  }

  /* Plusieurs brokers à la fois : chaque message part sur tous ceux qui sont connectés, et chacun livre ce qu’il reçoit.
     L’état d’une salle n’est fait que d’ensembles (coups, places…) : recevoir deux fois le même message ne change rien.
     Un broker public qui flanche (réception coupée, abonnement refusé) ne bloque donc pas la partie. */
  var conns = [];           // par broker : { ws, ix, up, buf, ping, pid, last, lastPub, rx, kicked }
  var opening = {};         // connexions en cours d’ouverture (par broker)
  var fails = {};           // échecs successifs (par broker), pour espacer les essais
  var subs = {};            // filtres suivis (rétablis à chaque connexion)
  var rooms = {};
  var pending = [];         // paquets écrits quand aucun broker n’est joignable
  var log = [];             // derniers événements de connexion (debug)
  function note(m) { log.push(new Date().toISOString().slice(11, 23) + ' ' + m); if (log.length > 60) log.shift(); }
  function short(ix) { return BROKERS[ix].replace(/^wss:\/\/|:\d+\/mqtt$/g, ''); }
  function upConns() { return conns.filter(function (c) { return c && c.up && c.ws.readyState === 1; }); }
  function wanted() { return Object.keys(subs).length > 0; }

  function open(ix) {
    return new Promise(function (resolve, reject) {
      var ws, done = false;
      try { ws = new WebSocket(BROKERS[ix], 'mqtt'); } catch (e) { reject(e); return; }
      ws.binaryType = 'arraybuffer';
      var c = { ws: ws, ix: ix, up: false, buf: new Uint8Array(0), pid: 1, ping: null, last: Date.now(), lastPub: 0, rx: 0, kicked: 0 };
      var t = setTimeout(function () { if (!done) { done = true; try { ws.close(); } catch (e) { /* ignore */ } reject(new Error('délai')); } }, 7000);
      ws.onopen = function () {
        ws.send(packet(0x10, str('MQTT').concat([4, 0x02, 0, 60], str('atlas-' + token()))));   // CONNECT, session propre, 60 s
      };
      ws.onmessage = function (ev) {
        var chunk = new Uint8Array(ev.data), b = new Uint8Array(c.buf.length + chunk.length);
        b.set(c.buf); b.set(chunk, c.buf.length); c.buf = b;
        for (;;) {
          b = c.buf;
          if (b.length < 2) return;
          var mul = 1, len = 0, i = 1, d;
          do { if (i >= b.length) return; d = b[i++]; len += (d & 127) * mul; mul *= 128; } while (d & 128);
          if (b.length < i + len) return;
          var type = b[0] >> 4, flags = b[0] & 15, body = b.subarray(i, i + len);
          c.buf = b.slice(i + len);
          c.last = Date.now(); c.rx++;
          if (type === 2) {   // CONNACK
            if (done) continue;
            done = true; clearTimeout(t);
            if (body[1] !== 0) { try { ws.close(); } catch (e) { /* ignore */ } reject(new Error('refus')); return; }
            c.up = true; note('connecté ' + short(ix));
            // Ping toutes les 15 s ; sans aucune réponse depuis 50 s, la connexion est morte sans le dire : on la rouvre
            c.ping = setInterval(function () {
              if (ws.readyState !== 1) return;
              if (Date.now() - c.last > 50000) { kick(c, 'silence'); return; }
              ws.send(new Uint8Array([0xC0, 0]));
            }, 15000);
            resolve(c);
          } else if (type === 3) {   // PUBLISH
            var tl = (body[0] << 8) | body[1], p = 2 + tl, qos = (flags >> 1) & 3;
            var topic = dec.decode(body.subarray(2, p));
            if (qos) { var hi = body[p], lo = body[p + 1]; p += 2; if (qos === 1) ws.send(new Uint8Array([0x40, 2, hi, lo])); }
            c.lastPub = Date.now();
            receive(topic, dec.decode(body.subarray(p)), !!(flags & 1));
          } else if (type === 9) {   // SUBACK : 0x80 = abonnement refusé
            if (body[2] === 0x80) kick(c, 'abonnement refusé');
          }
        }
      };
      ws.onerror = function () { /* onclose suit */ };
      ws.onclose = function (ev) {
        clearInterval(c.ping);
        var was = c.up; c.up = false;
        if (!done) { done = true; clearTimeout(t); reject(new Error('fermé')); }
        if (conns[c.ix] === c) {
          conns[c.ix] = null;
          if (was) { note('fermé ' + short(ix) + ' (' + (ev && ev.code) + ')'); later(ix, 1000); }
        }
      };
    });
  }
  /** Ouvre (ou rouvre) la connexion à un broker ; une fois connectée : abonnements, « qui est là ? », messages en attente */
  function openOne(ix) {
    if (conns[ix]) return Promise.resolve(conns[ix]);
    if (opening[ix]) return opening[ix];
    var p = opening[ix] = open(ix).then(function (c) {
      delete opening[ix]; fails[ix] = 0; conns[ix] = c;
      Object.keys(subs).forEach(function (f) { sub(c, f); });
      Object.keys(rooms).forEach(function (k) { if (rooms[k].me) c.ws.send(packet(0x30, str(ROOT + k + '/ask').concat(bytes(JSON.stringify({ tok: token() }))))); });
      var q = pending; pending = []; q.forEach(function (pk) { c.ws.send(pk); });
      return c;
    }, function (e) {
      delete opening[ix]; fails[ix] = (fails[ix] || 0) + 1;
      later(ix, Math.min(30000, 2000 * Math.pow(2, fails[ix])));
      throw e;
    });
    return p;
  }
  function later(ix, ms) { setTimeout(function () { if (wanted() && !conns[ix]) openOne(ix).catch(function () { /* nouvel essai prévu */ }); }, ms); }
  /** Au moins un broker connecté (on ouvre tous les autres en parallèle) */
  function ensure() {
    var ps = BROKERS.map(function (_, ix) { return openOne(ix); });
    var up = upConns(); if (up.length) return Promise.resolve(up[0]);
    return new Promise(function (ok, ko) {
      var bad = 0;
      ps.forEach(function (p) { p.then(ok, function () { if (++bad === ps.length) ko(new Error('aucun broker')); }); });
    });
  }
  function sub(c, filter) {
    var id = c.pid = (c.pid % 65000) + 1;
    c.ws.send(packet(0x82, [id >> 8, id & 255].concat(str(filter), [0])));
  }
  function subscribe(filter) { subs[filter] = 1; upConns().forEach(function (c) { sub(c, filter); }); }
  /** Ferme une connexion qui ne livre plus rien ; elle se rouvre aussitôt (réabonnement, les messages retenus reviennent) */
  function kick(c, why) {
    if (Date.now() - c.kicked < 8000) return;
    c.kicked = Date.now(); note(why + ' sur ' + short(c.ix) + ', reconnexion');
    try { c.ws.close(); } catch (e) { /* ignore */ }
    if (conns[c.ix] === c) { conns[c.ix] = null; c.up = false; later(c.ix, 500); }
  }
  /** Ses propres coups doivent revenir en écho : un broker qui n’a rien livré depuis l’envoi est relancé */
  function echoCheck(r, mv) {
    var now = Date.now(), since = 0;
    Object.keys(r.sent).forEach(function (k) {
      var q = k.split('/');   // partie/joueur/n
      if (q[0] !== String(r.mid || '')) { delete r.sent[k]; return; }
      if (mv[+q[1]][q[2]]) { delete r.sent[k]; return; }
      if (now - r.sent[k] > 5000 && (!since || r.sent[k] < since)) since = r.sent[k];
    });
    if (since) upConns().forEach(function (c) { if (c.lastPub < since) kick(c, 'écho manquant'); });
  }
  function sent(r, p, n) { var k = (r.mid || '') + '/' + p + '/' + n; if (!r.sent[k]) r.sent[k] = Date.now(); }
  function publish(topic, value, retain) {
    var payload = value == null ? [] : bytes(JSON.stringify(value));
    var pk = packet(0x30 | (retain ? 1 : 0), str(topic).concat(payload));
    var up = upConns();
    if (up.length) up.forEach(function (c) { c.ws.send(pk); });
    else { pending.push(pk); ensure().catch(function () { /* nouvel essai prévu */ }); }
  }

  /* ---------- Salles ---------- */
  function room(id) {
    return rooms[id] || (rooms[id] = { id: id, host: null, joins: {}, guest: null, moves: [{}, {}], left: null, me: null, role: null, claimed: false, waiters: [],
      seats: {}, seen: {}, xm: {}, mid: null, sent: {} });
  }
  function receive(topic, payload, retained) {
    if (topic.indexOf(ROOT) !== 0) return;
    var parts = topic.slice(ROOT.length).split('/'), r = rooms[parts[0]];
    if (!r) return;
    var v = null;
    if (payload) { try { v = JSON.parse(payload); } catch (e) { return; } }
    var k = parts[1];
    if (k === 'host') r.host = v && v.team ? v : r.host;
    else if (k === 'join' && parts[2]) { if (v) r.joins[parts[2]] = v; }
    else if (k === 'guest') { if (v) r.guest = v; }
    else if (k === 'm' && (parts[2] === '0' || parts[2] === '1') && parts[3]) { if (v === 'A' || v === 'D' || v === 'C') r.moves[+parts[2]][parts[3]] = v; }
    else if (k === 'left') { if (v && v.name) r.left = v.name; }
    else if (k === 'ask') {
      if (!v || (r.me && v.tok === r.me.tok)) return;
      if (r.role === 'seat' && r.me) seatSend(r);
      else if (r.role === 'host' && r.host && r.me) { publish(ROOT + r.id + '/host', r.host, true); if (r.guest) publish(ROOT + r.id + '/guest', r.guest, true); }
      return;
    }
    else if (k === 'seat' && (parts[2] === '1' || parts[2] === '2')) {
      var cur = r.seats[parts[2]];
      if (cur && v && cur.at && v.at && v.at < cur.at) return;
      r.seats[parts[2]] = v; r.seen[parts[2]] = { live: !retained, t: Date.now() }; }
    else if (k === 'x' && parts[2] && parts[3] === 'm' && (parts[4] === '0' || parts[4] === '1') && parts[5]) {
      var xm = r.xm[parts[2]] || (r.xm[parts[2]] = [{}, {}]);
      if (v === 'A' || v === 'D' || v === 'C') xm[+parts[4]][parts[5]] = v;
    }
    // L’hôte accepte le premier adversaire qui se présente
    if (r.role === 'host' && !r.guest && !r.claimed && k === 'join' && v && v.team) {
      r.claimed = true;
      publish(ROOT + r.id + '/guest', { name: v.name, team: v.team, tok: v.tok }, true);
    }
    r.waiters = r.waiters.filter(function (w) { if (w.test()) { clearTimeout(w.t); w.ok(); return false; } return true; });
  }
  function until(r, test, ms) {
    if (test()) return Promise.resolve();
    return new Promise(function (ok, ko) {
      var w = { test: test, ok: ok };
      w.t = setTimeout(function () { r.waiters = r.waiters.filter(function (x) { return x !== w; }); ko(new Error('délai')); }, ms);
      r.waiters.push(w);
    });
  }
  /** État public (même forme que serve.py) : un coup n’apparaît qu’une fois les deux joués */
  function pub(r) {
    if (r.me) echoCheck(r, r.role === 'seat' ? (r.xm[r.mid] || [{}, {}]) : r.moves);
    if (r.role === 'seat') return seatPub(r, r.xm[r.mid] || [{}, {}]);
    var moves = {}, played = {}, keys = {};
    Object.keys(r.moves[0]).concat(Object.keys(r.moves[1])).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (n) {
      var a = r.moves[0][n], b = r.moves[1][n];
      if (a && b) moves[n] = [a, b]; else played[n] = [!!a, !!b];
    });
    var players = r.host ? [{ name: r.host.name, team: r.host.team }] : [];
    if (r.host && r.guest) players.push({ name: r.guest.name, team: r.guest.team });
    return { id: r.id, seed: r.host ? r.host.seed : 0, left: r.left, moves: moves, played: played, players: players, v: r.host && r.host.v ? String(r.host.v) : '' };
  }
  function watch(id, seat) {
    var r = room(id);
    if (r.ready) return r.ready;
    var filter = ROOT + id + '/#';
    subscribe(filter);
    r.ready = ensure().then(function () {
      if (seat) {   // places : on demande aux présents de se signaler, puis on laisse 2 s aux réponses
        r.role = 'seat';
        publish(ROOT + id + '/ask', { tok: token() }, false);
        return new Promise(function (ok) { setTimeout(ok, 2000); });
      }
      return until(r, function () { return !!r.host; }, 6000).then(function () {
        return new Promise(function (ok) { setTimeout(ok, 350); });   // laisse arriver les autres messages retenus
      }, function () { /* salle vide */ });
    }).then(function () {
      if (!r.host && !r.role) { delete rooms[id]; delete subs[filter]; }   // (une salle à places reste suivie)
      return r;
    }, function (e) { delete rooms[id]; delete subs[filter]; throw e; });
    return r.ready;
  }
  /** Adresse du site à mettre dans les liens : la page courante, ou le site public quand on tourne en local */
  function base() {
    var h = location.hostname || '';
    var local = location.protocol === 'file:' || h.indexOf('.') < 0 || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h);
    return local ? PUBLIC : location.origin + location.pathname;
  }
  function link(r) { return base() + '#/combat?salle=' + r.id; }
  function fail(msg) { return Promise.reject(new Error(msg)); }

  function create(body) {
    return ensure().then(function () {
      var id = rnd(6, LETTERS);
      var r = room(id), tok = token();
      r.role = 'host'; r.me = { p: 0, tok: tok, name: body.name };
      subscribe(ROOT + id + '/#');
      r.ready = Promise.resolve(r);
      publish(ROOT + id + '/host', { name: body.name, team: body.team, seed: Math.floor(Math.random() * 2147483647), tok: tok, v: appV() }, true);
      return until(r, function () { return !!r.host; }, 8000).then(function () {
        return { id: id, p: 0, token: tok, link: link(r), room: pub(r) };
      });
    });
  }
  function join(r, body) {
    if (r.guest) return fail('Salle complète');
    var tok = token();
    r.role = 'guest'; r.me = { p: 1, tok: tok, name: body.name };
    publish(ROOT + r.id + '/join/' + tok, { name: body.name, team: body.team, tok: tok }, true);
    // L’hôte peut être parti envoyer le lien depuis une autre appli : on l’attend un moment
    return until(r, function () { return !!r.guest || !!r.left; }, 180000).then(function () {
      if (r.left) throw new Error(r.left + ' a annulé le défi');
      if (r.guest.tok !== tok) { r.role = null; r.me = null; throw new Error('Salle complète'); }
      return { id: r.id, p: 1, token: tok, room: pub(r) };
    }, function () { throw new Error(r.host.name + ' ne répond pas'); });
  }
  /** Fin de partie : on efface ses propres messages retenus (après un délai, le temps que l’autre les ait lus) */
  function sweep(id) {
    var r = rooms[id]; if (!r || !r.me || r.swept) return;
    r.swept = true;
    setTimeout(function () {
      var base = ROOT + id + '/', p = r.me.p;
      Object.keys(r.moves[p]).forEach(function (n) { publish(base + 'm/' + p + '/' + n, null, true); });
      if (r.role === 'host') { publish(base + 'host', null, true); publish(base + 'guest', null, true); Object.keys(r.joins).forEach(function (t) { publish(base + 'join/' + t, null, true); }); }
      else publish(base + 'join/' + r.me.tok, null, true);
      setTimeout(function () { delete subs[base + '#']; delete rooms[id]; }, 2000);
    }, 30000);
  }

  /* ---------- Combat d’essai : places fixes ---------- */
  var FRESH = 150000;   // une place sans signe de vie depuis 2 min 30 est libre
  function seatTok(id, n) {
    var key = 'atlas-essai-' + id + '-' + n, t = null;
    try { t = sessionStorage.getItem(key); } catch (e) { /* ignore */ }
    if (!t) { t = token(); try { sessionStorage.setItem(key, t); } catch (e) { /* ignore */ } }
    return t;
  }
  /** Place occupée par quelqu’un de vivant (message reçu en direct récemment, ou horodatage récent) */
  function alive(r, n) {
    var v = r.seats[n], s = r.seen[n];
    if (!v || v.gone || !s) return false;
    return s.live ? Date.now() - s.t < FRESH : Date.now() - (v.at || 0) < FRESH;
  }
  /** Version du site (le ?v= des scripts) : deux navigateurs qui ne calculent pas le duel pareil ne doivent pas jouer ensemble */
  function appV() { return String((A.combat && A.combat.version) || '0'); }
  function seatSend(r) {
    var m = r.me;
    publish(ROOT + r.id + '/seat/' + r.seat, { tok: m.tok, name: m.name, at: Date.now(), team: m.team || null, ready: m.ready || null, v: appV() }, true);
  }
  /** Partie : les deux places prêtes ; identifiant = les deux jetons « prêt » (Joueur 1 d’abord) */
  function seatMatch(r) {
    var a = r.seats[1], b = r.seats[2];
    if (!alive(r, 1) || !alive(r, 2) || !a.ready || !b.ready || !a.team || !b.team) return null;
    if (String(a.v) !== String(b.v)) return null;   // versions différentes : pas de partie (l’un doit recharger)
    return { mid: a.ready + '-' + b.ready, players: [{ name: a.name, team: a.team }, { name: b.name, team: b.team }] };
  }
  function seatPub(r, mv) {
    var moves = {}, played = {}, keys = {};
    Object.keys(mv[0]).concat(Object.keys(mv[1])).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (n) { var a = mv[0][n], b = mv[1][n]; if (a && b) moves[n] = [a, b]; else played[n] = [!!a, !!b]; });
    var o = r.seats[r.seat === 1 ? 2 : 1], m = seatMatch(r);
    // L’adversaire est parti : il a quitté, ou sa place ne porte plus les jetons de cette partie
    var left = r.mid && (!m || m.mid !== r.mid) ? ((o && o.name) || 'Votre adversaire') : null;
    return { id: r.id, seed: r.mid, left: left, moves: moves, played: played, players: m ? m.players : [] };
  }
  function clearMoves(r, mid, p) {
    setTimeout(function () {
      var xm = r.xm[mid]; if (!xm) return;
      Object.keys(xm[p]).forEach(function (n) { publish(ROOT + r.id + '/x/' + mid + '/m/' + p + '/' + n, null, true); });
    }, 30000);
  }
  var beat = null;
  function heartbeat() {
    clearInterval(beat);
    beat = setInterval(function () {
      var any = false;
      Object.keys(rooms).forEach(function (k) { var r = rooms[k]; if (r.role === 'seat' && r.me) { any = true; seatSend(r); } });
      if (!any) clearInterval(beat);
    }, 45000);
  }
  var SEAT = {
    /** Ouvre la salle et dit si la place est prise par quelqu’un d’autre */
    open: function (id, n) {
      return watch(id, true).then(function (r) {
        var v = r.seats[n];
        return { taken: alive(r, n) && v.tok !== seatTok(id, n), by: v && v.name };
      });
    },
    take: function (id, n, name) {
      var r = rooms[id]; if (!r) return;
      r.role = 'seat'; r.seat = n; r.me = { p: n - 1, tok: seatTok(id, n), name: name, team: null, ready: null };
      r.mid = null; seatSend(r); heartbeat();
    },
    rename: function (id, name) { var r = rooms[id]; if (r && r.me && r.me.name !== name) { r.me.name = name; seatSend(r); } },
    ready: function (id, team, name) {
      var r = rooms[id]; if (!r || !r.me) return;
      r.me.team = team; r.me.ready = token().slice(0, 8); if (name) r.me.name = name; r.mid = null; seatSend(r);
    },
    /** Retour au salon : plus prêt (l’équipe est gardée) */
    reset: function (id) { var r = rooms[id]; if (!r || !r.me) return; r.me.ready = null; r.mid = null; seatSend(r); },
    /** Partie trouvée : on la fixe (les coups vont sous x/<partie>/) */
    begin: function (id, mid) { var r = rooms[id]; if (r) r.mid = mid; },
    state: function (id) {
      var r = rooms[id]; if (!r) return null;
      // Place reprise par quelqu’un d’autre (« Reprendre la place » depuis un autre appareil) : on la lui laisse
      var mine = r.me && r.seats[r.seat];
      if (mine && !mine.gone && mine.tok !== r.me.tok) { r.me = null; r.mid = null; return { lost: true, by: mine.name }; }
      if (!r.me) return null;
      var on = r.seat === 1 ? 2 : 1, o = r.seats[on];
      return { seat: r.seat, tok: r.me.tok, v: appV(), other: { seat: on, here: alive(r, on), name: o && o.name, ready: !!(alive(r, on) && o.ready && o.team), v: o && o.v ? String(o.v) : '' }, match: seatMatch(r) };
    },
    leave: function (id) {
      var r = rooms[id]; if (!r || !r.me) return;
      publish(ROOT + id + '/seat/' + r.seat, { tok: r.me.tok, name: r.me.name, at: Date.now(), gone: true }, true);
      if (r.mid) clearMoves(r, r.mid, r.me.p);
      r.me = null; r.mid = null;
    }
  };

  A.relay = {
    seat: SEAT,
    base: base,
    /** Salle suivie par le relais (et non par le serveur du réseau local) */
    has: function (id) { return !!rooms[String(id || '').toUpperCase()]; },
    /** Disponible si le navigateur sait ouvrir un WebSocket */
    ok: function () { return !!(window.WebSocket && enc && dec && window.Promise); },
    /** Broker indiqué par le lien reçu (&r=1) */
    prefer: function () { /* anciens liens (&r=N) : tous les brokers sont utilisés à la fois */ },
    call: function (path, body) {
      body = body || {};
      if (path === 'salle') return create(body);
      var parts = path.split('/'), id = String(parts[1] || '').toUpperCase(), act = parts[2] || '';
      if (!act) return watch(id).then(function (r) { if (!r.host && r.role !== 'seat') throw new Error('Salle introuvable'); return pub(r); });
      var r = rooms[id];
      if (!r || (!r.host && r.role !== 'seat')) return fail('Salle introuvable');
      if (r.role === 'seat') {
        if (act === 'quitter') { SEAT.leave(id); return Promise.resolve({ ok: true }); }
        if (!r.me || !r.mid) return fail('Joueur inconnu');
        if (act === 'coup') {
          var sn = parseInt(body.n, 10), sa = body.act, sx = r.xm[r.mid];
          if (!(sn >= 0) || ['A', 'D', 'C'].indexOf(sa) < 0) return fail('Coup invalide');
          if (!(sx && sx[r.me.p][sn])) { publish(ROOT + id + '/x/' + r.mid + '/m/' + r.me.p + '/' + sn, sa, true); sent(r, r.me.p, sn); }
          return Promise.resolve(pub(r));
        }
        return fail('Action inconnue');
      }
      if (act === 'rejoindre') return join(r, body);
      if (!r.me) return fail('Joueur inconnu');
      if (act === 'coup') {
        var n = parseInt(body.n, 10), a = body.act;
        if (!(n >= 0) || ['A', 'D', 'C'].indexOf(a) < 0) return fail('Coup invalide');
        if (!r.moves[r.me.p][n]) { publish(ROOT + id + '/m/' + r.me.p + '/' + n, a, true); sent(r, r.me.p, n); }
        return Promise.resolve(pub(r));
      }
      if (act === 'quitter') { publish(ROOT + id + '/left', { name: r.me.name }, true); sweep(id); return Promise.resolve({ ok: true }); }
      return fail('Action inconnue');
    },
    /** Fermeture de la page : prévenir l’adversaire (envoi immédiat si la connexion est ouverte) */
    leave: function (id) { var r = rooms[id]; if (r && r.role === 'seat') { SEAT.leave(id); return; } if (r && r.me && !r.left) publish(ROOT + id + '/left', { name: r.me.name }, true); },
    /** Fin de partie : on efface ses coups un peu plus tard (la place d’essai, elle, reste) */
    done: function (id) {
      var r = rooms[id];
      if (r && r.role === 'seat') { if (r.mid && r.me) clearMoves(r, r.mid, r.me.p); return; }
      sweep(id);
    },
    /** État du relais (pour les tests) */
    debug: function () {
      return { brokers: conns.map(function (c, ix) { return c ? short(ix) + (c.up ? ' up' : ' …') + ' rx ' + c.rx + ' calme ' + Math.round((Date.now() - c.lastPub) / 1000) + 's' : null; }).filter(Boolean),
        pending: pending.length, log: log.slice(-20),
        rooms: Object.keys(rooms).map(function (k) { var r = rooms[k]; return { id: k, role: r.role, me: r.me && r.me.p, guest: !!r.guest, left: r.left, moves: r.role === 'seat' ? r.xm[r.mid] : r.moves, mid: r.mid, seats: r.seats }; }) };
    }
  };
})();
