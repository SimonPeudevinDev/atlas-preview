/* ATLAS — Défi entre amis par Internet (Duel tactique).
   Aucun serveur à nous : les deux navigateurs se parlent par un broker MQTT public (WebSocket sécurisé).
   Même interface que tools/lan/serve.py : A.relay.call('salle', …), ('salle/ID'), ('salle/ID/rejoindre'|'coup'|'quitter').
   L’état d’une salle est reconstruit à partir de messages « retenus » (retained) : un joueur qui se reconnecte
   (téléphone mis en veille, réseau qui change) se réabonne et retrouve tout. Chaque navigateur calcule le duel
   lui-même avec la graine de la salle, comme en réseau local.
   Sujets : atlas-duel/v1/<ID>/host · join/<jeton> · guest · m/<0|1>/<n> · left */
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

  var conn = null;          // { ws, ix, up, buf, ping, pid }
  var prefer = 0;           // broker indiqué par le lien (&r=1)
  var subs = {};            // filtres à rétablir après reconnexion
  var rooms = {};
  var pending = [];        // paquets écrits pendant une coupure
  var log = [];            // derniers événements de connexion (debug)
  function note(m) { log.push(new Date().toISOString().slice(11, 23) + ' ' + m); if (log.length > 60) log.shift(); }

  function open(ix) {
    return new Promise(function (resolve, reject) {
      var ws, done = false;
      try { ws = new WebSocket(BROKERS[ix], 'mqtt'); } catch (e) { reject(e); return; }
      ws.binaryType = 'arraybuffer';
      var c = { ws: ws, ix: ix, up: false, buf: new Uint8Array(0), pid: 1, ping: null };
      var t = setTimeout(function () { if (!done) { done = true; try { ws.close(); } catch (e) { /* ignore */ } reject(new Error('délai')); } }, 6000);
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
          if (type === 2) {   // CONNACK
            if (done) continue;
            done = true; clearTimeout(t);
            if (body[1] !== 0) { try { ws.close(); } catch (e) { /* ignore */ } reject(new Error('refus')); return; }
            c.up = true; note('connecté ' + BROKERS[ix]);
            c.ping = setInterval(function () { if (ws.readyState === 1) ws.send(new Uint8Array([0xC0, 0])); }, 25000);
            resolve(c);
          } else if (type === 3) {   // PUBLISH
            var tl = (body[0] << 8) | body[1], p = 2 + tl, qos = (flags >> 1) & 3;
            var topic = dec.decode(body.subarray(2, p));
            if (qos) { var hi = body[p], lo = body[p + 1]; p += 2; if (qos === 1) ws.send(new Uint8Array([0x40, 2, hi, lo])); }
            receive(topic, dec.decode(body.subarray(p)));
          }
        }
      };
      ws.onerror = function () { /* onclose suit */ };
      ws.onclose = function (ev) {
        note('fermé ' + BROKERS[ix] + ' code ' + (ev && ev.code));
        clearInterval(c.ping);
        var was = c.up; c.up = false;
        if (!done) { done = true; clearTimeout(t); reject(new Error('fermé')); }
        if (conn === c) { conn = null; if (was) setTimeout(revive, 800); }
      };
    });
  }
  /** Connexion au broker voulu (ou au premier qui répond) */
  var opening = null;
  function ensure(ix) {
    if (conn && conn.up && (ix == null || conn.ix === ix)) return Promise.resolve(conn);
    if (opening && (ix == null || opening.ix === ix)) return opening.p;
    if (conn) { var old = conn; conn = null; try { old.ws.close(); } catch (e) { /* ignore */ } }
    var list = ix != null ? [ix] : [prefer].concat([0, 1, 2].filter(function (k) { return k !== prefer; }));
    var p = list.reduce(function (acc, k) {
      return acc.catch(function () { return open(k); });
    }, Promise.reject(new Error('aucun'))).then(function (c) {
      conn = c; opening = null;
      Object.keys(subs).forEach(function (f) { sub(c, f); });
      var q = pending; pending = []; q.forEach(function (pk) { c.ws.send(pk); });   // messages écrits pendant la coupure
      return c;
    }, function (e) { opening = null; throw e; });
    opening = { ix: ix, p: p };
    return p;
  }
  /** Reconnexion après une coupure (veille du téléphone…) : on se réabonne, les messages retenus reviennent */
  function revive() {
    if (conn || !Object.keys(subs).length) return;
    var ix = Object.keys(rooms).map(function (k) { return rooms[k].ix; })[0];
    ensure(ix == null ? null : ix).catch(function () { setTimeout(revive, 3000); });
  }
  function sub(c, filter) {
    var id = c.pid = (c.pid % 65000) + 1;
    c.ws.send(packet(0x82, [id >> 8, id & 255].concat(str(filter), [0])));
  }
  function publish(topic, value, retain) {
    var payload = value == null ? [] : bytes(JSON.stringify(value));
    var pk = packet(0x30 | (retain ? 1 : 0), str(topic).concat(payload));
    if (conn && conn.up && conn.ws.readyState === 1) conn.ws.send(pk);
    else { pending.push(pk); revive(); }
  }

  /* ---------- Salles ---------- */
  function room(id, ix) {
    return rooms[id] || (rooms[id] = { id: id, ix: ix, host: null, joins: {}, guest: null, moves: [{}, {}], left: null, me: null, role: null, claimed: false, waiters: [] });
  }
  function receive(topic, payload) {
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
    var moves = {}, played = {}, keys = {};
    Object.keys(r.moves[0]).concat(Object.keys(r.moves[1])).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (n) {
      var a = r.moves[0][n], b = r.moves[1][n];
      if (a && b) moves[n] = [a, b]; else played[n] = [!!a, !!b];
    });
    var players = r.host ? [{ name: r.host.name, team: r.host.team }] : [];
    if (r.host && r.guest) players.push({ name: r.guest.name, team: r.guest.team });
    return { id: r.id, seed: r.host ? r.host.seed : 0, left: r.left, moves: moves, played: played, players: players };
  }
  function watch(id, ix) {
    var r = room(id, ix);
    if (r.ready) return r.ready;
    var filter = ROOT + id + '/#';
    subs[filter] = 1;
    r.ready = ensure(ix).then(function (c) {
      r.ix = c.ix;
      sub(c, filter);
      return until(r, function () { return !!r.host; }, 6000).then(function () {
        return new Promise(function (ok) { setTimeout(ok, 350); });   // laisse arriver les autres messages retenus
      }, function () { /* salle vide */ });
    }).then(function () {
      if (!r.host && !r.role) { delete rooms[id]; delete subs[filter]; }
      return r;
    }, function (e) { delete rooms[id]; delete subs[filter]; throw e; });
    return r.ready;
  }
  function link(r) {
    var h = location.hostname || '';
    var local = location.protocol === 'file:' || h.indexOf('.') < 0 || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h);
    var base = local ? PUBLIC : location.origin + location.pathname;
    return base + '#/combat?salle=' + r.id + (r.ix ? '&r=' + r.ix : '');
  }
  function fail(msg) { return Promise.reject(new Error(msg)); }

  function create(body) {
    return ensure(null).then(function (c) {
      var id = rnd(6, LETTERS);
      var r = room(id, c.ix), tok = token();
      r.role = 'host'; r.me = { p: 0, tok: tok, name: body.name };
      subs[ROOT + id + '/#'] = 1; sub(c, ROOT + id + '/#');
      r.ready = Promise.resolve(r);
      publish(ROOT + id + '/host', { name: body.name, team: body.team, seed: Math.floor(Math.random() * 2147483647), tok: tok }, true);
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

  A.relay = {
    /** Disponible si le navigateur sait ouvrir un WebSocket */
    ok: function () { return !!(window.WebSocket && enc && dec && window.Promise); },
    /** Broker indiqué par le lien reçu (&r=1) */
    prefer: function (ix) { ix = +ix; if (ix >= 0 && ix < BROKERS.length) prefer = ix; },
    call: function (path, body) {
      body = body || {};
      if (path === 'salle') return create(body);
      var parts = path.split('/'), id = String(parts[1] || '').toUpperCase(), act = parts[2] || '';
      if (!act) return watch(id, rooms[id] ? rooms[id].ix : prefer).then(function (r) { if (!r.host) throw new Error('Salle introuvable'); return pub(r); });
      var r = rooms[id];
      if (!r || !r.host) return fail('Salle introuvable');
      if (act === 'rejoindre') return join(r, body);
      if (!r.me) return fail('Joueur inconnu');
      if (act === 'coup') {
        var n = parseInt(body.n, 10), a = body.act;
        if (!(n >= 0) || ['A', 'D', 'C'].indexOf(a) < 0) return fail('Coup invalide');
        if (!r.moves[r.me.p][n]) publish(ROOT + id + '/m/' + r.me.p + '/' + n, a, true);
        return Promise.resolve(pub(r));
      }
      if (act === 'quitter') { publish(ROOT + id + '/left', { name: r.me.name }, true); sweep(id); return Promise.resolve({ ok: true }); }
      return fail('Action inconnue');
    },
    /** Fermeture de la page : prévenir l’adversaire (envoi immédiat si la connexion est ouverte) */
    leave: function (id) { var r = rooms[id]; if (r && r.me && !r.left) publish(ROOT + id + '/left', { name: r.me.name }, true); },
    done: sweep,
    /** État du relais (pour les tests) */
    debug: function () {
      return { broker: conn ? BROKERS[conn.ix] : null, up: !!(conn && conn.up), ws: conn ? conn.ws.readyState : -1, pending: pending.length, log: log.slice(-20),
        rooms: Object.keys(rooms).map(function (k) { var r = rooms[k]; return { id: k, role: r.role, me: r.me && r.me.p, guest: !!r.guest, left: r.left, moves: r.moves }; }) };
    }
  };
})();
