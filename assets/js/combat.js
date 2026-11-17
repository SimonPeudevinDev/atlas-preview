/* ==========================================================================
   ATLAS — Combat (arène)
   Trois modes contre une IA, en attendant les comptes joueurs et le serveur.
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui, P = A.pages, I = U.icon;
  var NB = ' ';   // espace insécable (typographie française)

  /* ---------- Règles ---------- */
  // Duel : chaque manche se joue jusqu’au KO, deux manches gagnées remportent le match.
  var MANCHES = 3, WIN_MANCHES = 2;
  var ACTIONS = {
    A: { label: 'Attaquer', verb: 'attaque', icon: 'swords', hint: 'Dégâts directs' },
    D: { label: 'Défendre', verb: 'se défend', icon: 'shield', hint: 'Pare et riposte' },
    C: { label: 'Charger', verb: 'charge', icon: 'flame', hint: 'Prochain coup ×2' }
  };
  /** Multiplicateur de la prochaine attaque : chaque charge ajoute ×1 (×2, puis ×3 au plus, MAX_CHARGE). */
  function mult(f) { return 1 + (f.charge || 0); }
  var RIVALS = ['Ariane', 'Hector_77', 'Nephtys', 'Le Cartographe', 'Sigrid', 'Ulysse_88', 'Mme Lune', 'Kenji', 'Basile', 'Inès_du_Nil', 'Ragnhild', 'Orphée_404'];
  var MODES = {
    duel: { name: 'Duel tactique', icon: 'swords', hint: 'Une carte par manche, dans l’ordre choisi. La rareté donne plus de PV et de puissance.' },
    quiz: { name: 'Quiz des légendes', icon: 'scroll', hint: 'Vos cartes face à face, une question éclair à la fois : portraits, titres, univers, savoir. Le premier qui répond juste fait frapper sa carte.' },
    terrains: { name: 'Trois terrains', icon: 'laurel', hint: 'Formez une réserve complémentaire en ATQ, DÉF et ESP. Déployez une carte par tour, renforcez vos fronts et gardez votre bannière pour le bon moment. Aucun bonus de rareté.' }
  };
  var G = A.terrains, TERRAINS = G.fields;

  /* Règles partagées par les écrans et les vérifications, sans état de partie. */
  var C = A.combat = {};
  C.conquest = G;
  C.question = A.quiz.question;
  C.duel = { fighter: fighter, stats: function (e) { return duelStats(e); }, resolve: resolve, choose: botMove, mult: mult, manches: MANCHES, toWin: WIN_MANCHES, seed: function (x) { seedRng(x); }, rand: function () { return RNG(); } };
  C.roster = function () { return roster(); };   // meilleurs exemplaires, du plus fort au plus faible (bloc Combat de l’accueil)

  /** Combattant : statistiques du personnage + bonus de rareté */
  function fighter(edId, uid) {
    var ed = A.ED[edId], ch = A.CHAR[ed.charId], rank = A.R[ed.rarity].rank;
    var hp = Math.round(70 + ch.def * 0.4 + rank * 6);
    // Valeurs fixes, affichées telles quelles sur la carte (ATQ = dégâts, DÉF = riposte, PV = vie)
    return {
      ed: edId, uid: uid, name: ch.name, rank: rank, hp: hp, max: hp, charge: 0,
      pow: Math.round(ch.atk * 0.28 * (1 + rank * 0.04)),
      // Riposte quand on pare (DÉF affichée) : de 5 à 25 selon l’Esprit et la rareté, pour de vrais profils (attaquants / contreurs)
      spirit: Math.max(5, Math.min(25, Math.round(4 + (ch.esp - 60) * 0.35 + rank))),
      guard: 0                                                  // 1 si la carte vient de se défendre
    };
  }
  /** Stats du Duel montrées sur les cartes : PV (vie), ATQ (dégâts d’une attaque), DÉF (riposte quand on pare). */
  function duelStats(edId) { var f = fighter(edId); return { atk: f.pow, pv: f.max, def: f.spirit }; }
  var DUEL_MAX = null;   // plus hautes stats de combat d’une carte (échelle des barres de l’équipe)
  function duelMax() {
    if (!DUEL_MAX) { DUEL_MAX = { atk: 1, pv: 1, def: 1 }; A.EDITIONS.forEach(function (e) { var s = duelStats(e.id); for (var k in DUEL_MAX) DUEL_MAX[k] = Math.max(DUEL_MAX[k], s[k]); }); }
    return DUEL_MAX;
  }
  function duelCard(edId, opts) {
    var s = duelStats(edId);
    return U.card(edId, opts).replace(/<span class="card-stats">(?:<span>[^<]*<b>[^<]*<\/b><\/span>){3}<\/span>/,
      '<span class="card-stats is-duel"><span>PV<b>' + s.pv + '</b></span><span>ATQ<b>' + s.atk + '</b></span><span>DÉF<b>' + s.def + '</b></span></span>');
  }
  /** Défendre : blocage total + riposte, mais jamais deux fois de suite. */
  var MAX_GUARD = 1;
  function canDefend(f) { return (f.guard || 0) < MAX_GUARD; }
  /** Charge plafonnée : prochaine attaque ×3 au plus (deux charges). */
  var MAX_CHARGE = 2;
  function canCharge(f) { return (f.charge || 0) < MAX_CHARGE; }
  function power(edId) { var ed = A.ED[edId], ch = A.CHAR[ed.charId]; return ch.atk + ch.def + ch.esp + A.R[ed.rarity].rank * 12; }
  var RNG = Math.random;
  function rnd(a, b) { return a + RNG() * (b - a); }
  /** Graine (texte) : même suite de nombres sur les deux appareils d’un duel entre amis ; null : retour au hasard. */
  function seedRng(seed) {
    if (seed == null) { RNG = Math.random; return; }
    var h = 1779033703 ^ String(seed).length;
    for (var i = 0; i < String(seed).length; i++) { h = Math.imul(h ^ String(seed).charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    var a = h >>> 0;
    RNG = function () { a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  /** Résout un tour : renvoie les dégâts subis par chacun et le récit */
  function resolve(me, foe, a, b) {
    var out = { me: 0, foe: 0, lines: [] };
    function strike(att, def, act, defAct, key) {
      if (act !== 'A') return;
      var dmg = att.pow * mult(att);
      if (defAct === 'D') {
        var rip = def.spirit;   // blocage total, la DÉF revient à l’attaquant
        out[key === 'foe' ? 'me' : 'foe'] += rip;
        out.lines.push(def.name + ' pare et riposte (−' + rip + ')');
        return;
      }
      var txt = att.name + (att.charge ? ' lance une attaque ×' + mult(att) : ' frappe');
      out[key] += dmg;
      out.lines.push(txt + ' (−' + dmg + ')');
    }
    strike(me, foe, a, b, 'foe');
    strike(foe, me, b, a, 'me');
    // Seule l’action Attaquer consomme la charge, même si cette attaque est parée.
    [[me, a], [foe, b]].forEach(function (x) {
      var f = x[0], act = x[1];
      f.guard = act === 'D' ? (f.guard || 0) + 1 : 0;
      if (act === 'A') f.charge = 0;
      else if (act === 'C') {
        f.charge = Math.min(MAX_CHARGE, f.charge + 1);
        out.lines.push(f.name + (f.charge > 1 ? ' accumule sa charge : prochaine attaque ×' : ' prépare sa prochaine attaque ×') + mult(f));
      }
    });
    if (a === 'D' && b === 'D') out.lines.push('Les deux combattants restent sur leurs gardes');
    return out;
  }

  /** IA : lit la charge, puis contre le coup favori du joueur, avec une part de hasard */
  function botMove(st) {
    var me = st.mine[st.manche], foe = st.foes[st.manche], w = { A: 1, D: 1, C: 1 };
    var h = st.hist, fav = 'A';
    ['A', 'D', 'C'].forEach(function (k) { if (h[k] > h[fav]) fav = k; });
    if (st.last && Math.random() < 0.4) fav = st.last;
    w[{ A: 'D', D: 'C', C: 'A' }[fav]] += 1.3;
    // Charge adverse : plus elle grossit, plus l’IA se protège… sans oublier de frapper un joueur qui ne fait que charger.
    if (me.charge) { w.D += 0.6 + me.charge * 0.4; w.A += 0.8 + me.charge * 0.3; w.C *= 0.5; }
    // Charge au maximum : le joueur ne peut plus que frapper (ou parer) ; l’IA lève son bouclier si elle le peut.
    if (!canCharge(me)) w.D += 2.5;
    if (!canCharge(foe)) w.C = 0;
    // Sa propre charge : l’envie de la lâcher grandit, l’envie d’en rajouter diminue.
    if (foe.charge) { w.A += 1 + foe.charge * 0.8; w.C /= 1 + foe.charge; }
    // Coup de grâce : si une attaque simple suffit à finir le joueur, l’IA tente sa chance.
    if (foe.pow * mult(foe) >= me.hp) w.A += 1.5;
    // Pas deux défenses de suite : l’IA ne défend pas juste après s’être défendue et frappe un joueur qui vient de le faire
    if (!canDefend(foe)) w.D = 0; else if (foe.guard) w.D *= 0.4;
    if (!canDefend(me)) { w.A += 2.2; w.D *= 0.3; } else if (me.guard) w.A += 0.7;
    var tot = w.A + w.D + w.C, r = Math.random() * tot;
    return r < w.A ? 'A' : r < w.A + w.D ? 'D' : 'C';
  }

  /* ---------- Équipe ---------- */
  var team = [];   // uids choisis (gardés le temps de la session)
  function roster() {
    // Le meilleur exemplaire de chaque personnage possédé
    var best = {};
    S.items().forEach(function (i) {
      var ed = A.ED[i.ed]; if (!ed) return;
      var b = best[ed.charId];
      if (!b || A.R[ed.rarity].rank > A.R[A.ED[b.ed].rarity].rank) best[ed.charId] = i;
    });
    return Object.keys(best).map(function (k) { return best[k]; }).sort(function (a, b) { return power(b.ed) - power(a.ed); });
  }
  function validTeam(limit) {
    var seen = {};
    team = team.filter(function (u) {
      var it = S.item(u), ed = it && A.ED[it.ed];
      if (!ed || seen[ed.charId]) return false;
      seen[ed.charId] = true; return true;
    }).slice(0, limit || 3);
    return team;
  }

  function rivalTeam(mine, kind) {
    var ranks = mine.map(function (u) { return A.R[A.ED[S.item(u).ed].rarity].rank; });
    var used = {}, out = [];
    mine.forEach(function (u) { used[A.ED[S.item(u).ed].charId] = 1; });
    ranks.forEach(function (rk, index) {
      if (kind === 'terrains') {
        var own = A.CHAR[A.ED[S.item(mine[index]).ed].charId], target = own.atk + own.def + own.esp;
        var available = A.CHARS.filter(function (ch) { return !used[ch.id]; });
        var nearest = available.sort(function (a, b) { return Math.abs(a.atk + a.def + a.esp - target) - Math.abs(b.atk + b.def + b.esp - target); }).slice(0, 16);
        var chosen = pick(nearest);
        var editions = A.EDITIONS.filter(function (ed) { return ed.charId === chosen.id; });
        editions.sort(function (a, b) { return Math.abs(A.R[a.rarity].rank - rk) - Math.abs(A.R[b.rarity].rank - rk); });
        used[chosen.id] = 1; out.push(editions[0].id); return;
      }
      var tries = 0, ed = null;
      while (!ed && tries++ < 200) {
        var ch = pick(A.CHARS); if (used[ch.id]) continue;
        var eds = A.EDITIONS.filter(function (e) { return e.charId === ch.id && Math.abs(A.R[e.rarity].rank - rk) <= 1; });
        if (eds.length) { ed = pick(eds); used[ch.id] = 1; }
      }
      out.push(ed ? ed.id : A.EDITIONS[0].id);
    });
    return out;
  }

  /** Trois personnages au hasard, de rareté proche de l’équipe donnée (éditions) */
  function teamLike(eds) {
    var used = {}, out = [];
    eds.forEach(function (rkEd) {
      var rk = A.R[A.ED[rkEd].rarity].rank, ed = null, tries = 0;
      while (!ed && tries++ < 300) {
        var ch = pick(A.CHARS); if (used[ch.id]) continue;
        var c = A.EDITIONS.filter(function (x) { return x.charId === ch.id && Math.abs(A.R[x.rarity].rank - rk) <= 1; });
        if (c.length) { ed = pick(c); used[ch.id] = 1; }
      }
      out.push(ed ? ed.id : A.EDITIONS[0].id);
    });
    return out;
  }

  /* ---------- Duel entre amis : réseau local (tools/lan/serve.py) ou Internet (relay.js, broker public) ---------- */
  var NET = {
    call: function (path, body) {
      return NET.ping().then(function (ok) {
        if (ok && ok.online) return A.relay.call(path, body);
        return NET.lan(path, body);
      });
    },
    lan: function (path, body) {
      return fetch('api/' + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || r.status); return j; }); });
    },
    /** Serveur du réseau local s’il répond, sinon le relais Internet */
    ping: function () {
      if (NET.ok !== undefined) return Promise.resolve(NET.ok);
      if (NET.wait) return NET.wait;
      function online() { return (NET.ok = A.relay && A.relay.ok() ? { online: true } : null); }
      if (location.protocol === 'file:') return Promise.resolve(online());
      var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 1500);
      return (NET.wait = fetch('api/ping', { cache: 'no-store', signal: ctl && ctl.signal }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { clearTimeout(t); return j && j.ok ? (NET.ok = j) : online(); }, function () { clearTimeout(t); return online(); }));
    },
    online: function () { return !!(NET.ok && NET.ok.online); },
    /** Page fermée en pleine partie : prévenir l’adversaire */
    leave: function (g) {
      if (NET.online()) A.relay.leave(g.id);
      else if (NET.ok && navigator.sendBeacon) navigator.sendBeacon('api/salle/' + g.id + '/quitter', new Blob([JSON.stringify({ token: g.token })], { type: 'application/json' }));
    },
    done: function (id) { if (NET.online()) A.relay.done(id); }
  };
  /** Nom affiché chez l’adversaire : celui saisi pour les défis, sinon celui du profil (sauf « Vous ») */
  function myName() {
    var v = ''; try { v = localStorage.getItem('atlas-pvp-name') || ''; } catch (e) { /* ignore */ }
    var u = (S.get().user || {}).name || '';
    return (v || (u && u !== 'Vous' ? u : '') || 'Joueur').slice(0, 24);
  }
  function nameField() {
    var v = ''; try { v = localStorage.getItem('atlas-pvp-name') || ''; } catch (e) { /* ignore */ }
    var u = (S.get().user || {}).name || '';
    return '<label class="search cb-pvp-name">' + I('user') + '<input data-pvp-name maxlength="24" placeholder="Votre nom" aria-label="Votre nom pour ce défi" value="' + U.esc(v || (u !== 'Vous' ? u : '')) + '"></label>';
  }

  /* ---------- Rendu ---------- */
  /** Barre de vie : or, rouge sous 30 %. hp : valeur affichée (l’ancienne pendant l’animation d’un tour). */
  function hpBar(f, hp) {
    hp = Math.max(0, hp == null ? f.hp : hp);
    var p = hp / f.max;
    return '<div class="cb-hp' + (p < 0.3 ? ' is-low' : '') + '"><i style="width:' + (p * 100).toFixed(1) + '%"></i></div>' +
      '<p class="cb-hp-n"><b>' + hp + '</b> / ' + f.max + ' PV</p>';
  }
  function setHp(el, f) {
    var hp = Math.max(0, f.hp), p = hp / f.max, bar = el && el.querySelector('.cb-hp'), n = el && el.querySelector('.cb-hp-n b');
    if (!bar) return;
    bar.classList.toggle('is-low', p < 0.3);
    bar.firstChild.style.width = (p * 100).toFixed(1) + '%';
    if (n) n.textContent = hp;
  }
  /** Un combattant de l’arène : qui joue, la carte (liseré or pour vous, rouge pour l’adversaire), nom, stats, vie,
      charge et dernière action. shown : PV affichés (avant l’impact du tour en cours). */
  function fighterHTML(f, side, act, shown, who) {
    var hp = shown == null ? f.hp : shown;
    return '<div class="cb-fighter is-' + side + (hp <= 0 ? ' is-ko' : '') + '" data-side="' + side + '">' +
      '<p class="cb-who">' + (side === 'me' ? 'Vous' : U.esc(who || currentRival)) + '</p>' +
      '<div class="cb-card">' + duelCard(f.ed, { open: false, tilt: false, ctx: 'fighter', priority: true }) + '<div class="cb-card-back" aria-hidden="true">' + atlasBack() + '</div>' +
        // Charge en réserve : sceau gravé au coin de la carte (il apparaît après l’animation quand on vient de charger)
        (f.charge ? '<b class="cb-seal' + (act === 'C' ? ' is-new' : '') + '" title="Prochaine attaque ×' + mult(f) + '"><span><i>×</i>' + mult(f) + '</span></b>' : '') + '</div>' +
      '<div class="cb-info">' + hpBar(f, hp) + '</div></div>';
  }
  /** Les deux cartes face à face (vous à gauche), « vs » entre elles, récit du tour dessous. */
  function stageHTML(me, foe, acts, shown, log, who, turns) {
    acts = acts || {}; shown = shown || {};
    return fighterHTML(me, 'me', acts.a, shown.me) +
      '<div class="cb-vs" aria-hidden="true"><i></i><span>vs</span><i></i></div>' +
      fighterHTML(foe, 'foe', acts.b, shown.foe, who) +
      '<div class="cb-log' + (acts.a ? ' is-turn' : '') + '" aria-live="polite">' + log + '</div>';
  }
  /** Dos de carte du Booster Atlas (celui de l’ouverture des sachets) */
  var ATLAS_BACK = '';
  function atlasBack() { if (!ATLAS_BACK) { var pk = A.PACKS.filter(function (x) { return x.id === 'standard'; })[0] || A.PACKS[0]; ATLAS_BACK = U.cardBack(pk && pk.theme); } return ATLAS_BACK; }
  /** Le tour en une phrase : « Vous attaquez, Ragnhild se défend : −8 pour vous. » */
  function turnLine(t, who) {
    var name = U.esc(who || currentRival);
    var V = { A: 'attaquez', D: 'vous défendez', C: 'chargez' }, F = { A: 'attaque', D: 'se défend', C: 'charge' };
    var d = [];
    if (t.foe) d.push('<b class="is-good">−' + t.foe + ' pour ' + name + '</b>');
    if (t.me) d.push('<b class="is-bad">−' + t.me + ' pour vous</b>');
    return '<p class="cb-reveal">Vous ' + V[t.a] + ', ' + name + ' ' + F[t.b] + (d.length ? ' : ' + d.join(', ') : '') + '.</p>';
  }
  /** Effet annoncé sur chaque bouton d’action (valeurs moyennes) */
  function actHints(me) {
    return {
      A: me.pow * mult(me) + ' dégâts',
      D: !canDefend(me) ? 'Pas deux fois de suite' : 'Riposte ' + me.spirit,
      C: canCharge(me) ? 'Attaque ×' + (mult(me) + 1) : 'Charge au maximum'
    };
  }
  /** Conseil sous le récit : la charge adverse est la menace à surveiller */
  function threatHTML(me, foe, who) {
    if (me.hp <= 0 || foe.hp <= 0) return '';
    var name = U.esc(who || currentRival);
    if (!canDefend(foe)) return '<p class="cb-tip">' + name + ' vient de se défendre : pas de bouclier ce tour, frappez.</p>';
    if (!canDefend(me)) return '<p class="cb-warn">Vous venez de vous défendre : attaquez ou chargez.</p>';
    if (foe.charge) return '<p class="cb-warn">' + U.esc(who || currentRival) + ' a chargé : sa prochaine attaque fera ×' + mult(foe) + '. Défendre la pare.</p>';
    if (me.charge) return '<p class="cb-tip">Votre prochaine attaque fera ×' + mult(me) + '.</p>';
    return '';
  }

  /* Symboles gravés (SVG en ligne) : épée (boutons), bouclier (bouton, sceau de garde),
     rose des vents (bouton Charger), étoile d’impact. Classes communes .o contour, .d détail, .g filet doré, .gf point doré — styles dans atlas.css (.atl-prop). */
  var SWORD = '<svg class="atl-prop" viewBox="0 0 30 120" aria-hidden="true">' +
    '<path class="o" d="M15 3 L19.5 14 L18.6 82 L11.4 82 L10.5 14 Z"/><path class="d" d="M15 17 V78"/><path class="d f" d="M12.4 19 L12.8 78 M17.6 19 L17.2 78"/>' +
    '<path class="o g" d="M3 85 Q3 81.5 7 82 L23 82 Q27 81.5 27 85 Q27 88.5 23 88 L7 88 Q3 88.5 3 85 Z"/>' +
    '<rect class="o" x="12.5" y="88" width="5" height="20" rx="1.5"/><path class="d" d="M12.5 92.5 L17.5 90.5 M12.5 96.5 L17.5 94.5 M12.5 100.5 L17.5 98.5 M12.5 104.5 L17.5 102.5"/>' +
    '<circle class="o g" cx="15" cy="112" r="4.5"/><circle class="gf" cx="15" cy="112" r="1.5"/></svg>';
  var SHIELD = '<svg class="atl-prop" viewBox="0 0 80 96" aria-hidden="true">' +
    '<path class="o g w" d="M40 4 L74 13 L72 48 Q68 77 40 92 Q12 77 8 48 L6 13 Z"/>' +
    '<path class="d" d="M40 11 L67 18 L65.5 48 Q62 71 40 84 Q18 71 14.5 48 L13 18 Z"/>' +
    '<path class="d f" d="M20 24 L30 21 M18 32 L33 27 M17 40 L35 34 M17 48 L36 41"/>' +
    '<path class="g" d="M40 30 L44 44 L58 48 L44 52 L40 66 L36 52 L22 48 L36 44 Z"/><circle class="gf" cx="40" cy="48" r="2.6"/></svg>';
  function polar(r, d) { var a = d * Math.PI / 180; return (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1); }
  var COMPASS = '<svg class="atl-prop" viewBox="-50 -50 100 100" aria-hidden="true">' +
    '<path class="o" transform="rotate(45)" d="M0 -30 L4 -4 L30 0 L4 4 L0 30 L-4 4 L-30 0 L-4 -4 Z"/>' +
    '<path class="o g" d="M0 -46 L6 -6 L46 0 L6 6 L0 46 L-6 6 L-46 0 L-6 -6 Z"/>' +
    '<path class="d" d="M0 -44 V44 M-44 0 H44"/><circle class="d" r="12"/><circle class="gf" r="2.6"/></svg>';
  /* Bouclier rond grec (aspis) : anneaux concentriques, rivets, umbo au centre */
  var ASPIS = '<svg class="atl-prop" viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle class="o g w" cx="50" cy="50" r="45"/><circle class="d" cx="50" cy="50" r="38"/><circle class="d f" cx="50" cy="50" r="31"/>' +
    '<circle class="g" cx="50" cy="50" r="24"/><circle class="o g" cx="50" cy="50" r="10"/><circle class="gf" cx="50" cy="50" r="3"/>' +
    Array.from({ length: 12 }, function (_, k) { var a = k * 30 * Math.PI / 180; return '<circle class="gf" cx="' + (50 + 41.5 * Math.cos(a)).toFixed(1) + '" cy="' + (50 + 41.5 * Math.sin(a)).toFixed(1) + '" r="1.5"/>'; }).join('') + '</svg>';
  /* Brasero grec gravé (la charge) : vasque sur pied et trois langues de feu, au trait d’or comme l’épée et le bouclier */
  var BRAZIER = '<svg class="atl-prop" viewBox="0 0 80 100" aria-hidden="true">' +
    // une seule flamme d’un tenant : pointe haute qui lèche vers la droite, langues de côté, cœur au trait
    '<path class="o g w" d="M19 62 C13 53 15 44 22 38 C22 44 24 48 28 49 C25 40 28 30 35 22 C35 30 37 34 40 36 C38 25 41 14 48 5 C47 15 51 22 55 28 C59 34 60 42 56 49 C59 47 61 43 61 38 C66 45 67 55 62 62 Z"/>' +
    '<path class="g" d="M30 62 C26 56 27 50 32 45 C32 49 34 52 37 52 C35 46 37 40 43 33 C43 40 46 44 48 48 C50 53 50 58 47 62"/>' +
    '<path class="d f" d="M40 36 C43 42 44 48 42 54 M22 46 C21 51 22 56 24 60"/><circle class="gf" cx="40" cy="57" r="2"/>' +
    '<path class="o g w" d="M12 62 H68 Q66 77 40 79 Q14 77 12 62 Z"/><path class="g" d="M8 62 H72"/><path class="d f" d="M18 67 H62 M21 71 H59"/>' +
    '<path class="g" d="M40 79 V88"/><path class="o g" d="M27 94 Q40 86 53 94 Z"/><circle class="gf" cx="40" cy="83.5" r="1.8"/></svg>';
  /* Symboles gravés des boutons d’action. Plusieurs jeux à l’essai (Studio combat) ; le choix est gardé
     dans localStorage (atlas-act-icons). Tous les nouveaux jeux sont dessinés dans un carré 0–100. */
  function pc(r, d) { var a = (d - 90) * Math.PI / 180; return (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); }
  function svg100(body) { return '<svg class="atl-prop" viewBox="0 0 100 100" aria-hidden="true">' + body + '</svg>'; }
  function star4(cx, cy, R, r, cls, rot) {
    var d = ''; for (var k = 0; k < 8; k++) { var a = (k * 45 + (rot || 0) - 90) * Math.PI / 180, q = k % 2 ? r : R; d += (k ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1) + ' '; }
    return '<path class="' + cls + '" d="' + d + 'Z"/>';
  }
  /* Formes des jeux « pleins » : épée (dessinée droite, tournée à 45°) et trois chevrons */
  function P_SWORD(c) { return '<path class="' + c + '" d="M50 6 L57 18 V62 H43 V18 Z"/><rect class="' + c + '" x="33" y="64" width="34" height="6" rx="3"/><rect class="' + c + '" x="46.5" y="72" width="7" height="15" rx="2"/><circle class="' + c + '" cx="50" cy="92" r="4.5"/>'; }
  /** Chevrons qui progressent (Charger) : du bas au haut, chacun plus large et plus lumineux, comme une flèche qui monte.
      draw(path, row) dessine un chevron ; th = épaisseur (7 fin, 11 plein). */
  function chevProg(draw, th) {
    th = th || 7;
    var rows = th > 8 ? [[12, 28, 1], [35, 25, .6], [57, 22, .3]] : [[7, 28, 1], [35, 25, .6], [61, 22, .3]];   // espacés : les filets ne se touchent pas
    return rows.map(function (r) {
      var y = r[0], h = r[1], rise = h * 23 / 28, f = function (n) { return +n.toFixed(1); };
      var d = 'M50 ' + y + ' L' + (50 + h) + ' ' + f(y + rise) + ' V' + f(y + rise + th) + ' L50 ' + (y + th) + ' L' + (50 - h) + ' ' + f(y + rise + th) + ' V' + f(y + rise) + ' Z';
      var k = (h - 5) * 23 / 28, mid = 'M' + (55 - h) + ' ' + f(y + 7.5 + k) + ' L50 ' + f(y + 7.5) + ' L' + (h + 45) + ' ' + f(y + 7.5 + k);
      var cut = 'M54 ' + f(y + 3.5 + 4 * 23 / 28) + ' L' + (46 + h) + ' ' + f(y + 3.5 + (h - 4) * 23 / 28);
      return '<g opacity="' + r[2] + '">' + draw(d, { mid: mid, cut: cut }) + '</g>';
    }).join('');
  }
  var ICON_SETS = {
    actuel: { name: 'Actuel', desc: 'Épée, bouclier rond, brasero.', A: SWORD, D: ASPIS, C: BRAZIER, legacy: true },
    trait: { name: 'Trait', desc: 'Le plus simple : une épée en trois traits, un cercle, trois chevrons.',
      A: svg100('<path class="b" d="M80 20 L36 64 M27 55 L45 73 M36 64 L22 78"/>'),
      D: svg100('<circle class="b" cx="50" cy="50" r="32"/><circle class="gf" cx="50" cy="50" r="4"/>'),
      C: svg100('<path class="b" d="M28 80 L50 62 L72 80 M28 60 L50 42 L72 60 M28 40 L50 22 L72 40"/>') },
    fleches: { name: 'Flèches', desc: 'Tout en flèches : on avance, on renvoie, on monte.',
      A: svg100('<path class="b" d="M28 26 L52 50 L28 74 M50 26 L74 50 L50 74"/>'),
      D: svg100('<path class="b" d="M66 18 V82"/><path class="b" d="M48 30 L28 50 L48 70"/>'),
      C: svg100('<path class="d" d="M28 80 L50 62 L72 80"/><path class="g w" d="M28 60 L50 42 L72 60"/><path class="b" d="M28 40 L50 22 L72 40"/>') },
    geometrie: { name: 'Géométrie · épée', desc: 'L’épée au contour, comme l’écu ; puis l’écu et les chevrons.',
      A: svg100('<g transform="rotate(45 50 50)"><path class="b" d="M50 6 L57 18 V62 H43 V18 Z"/><path class="b" d="M32 66 H68 M50 66 V82"/><circle class="b" cx="50" cy="88" r="4.5"/></g>'),
      D: svg100('<path class="b" d="M50 14 L80 26 V52 C80 70 66 80 50 87 C34 80 20 70 20 52 V26 Z"/>'),
      C: svg100('<path class="b" d="M28 80 L50 62 L72 80 M28 60 L50 42 L72 60 M28 40 L50 22 L72 40"/>') },
    geometrie2: { name: 'Géométrie · lance', desc: 'La pointe de lance en losange ; puis l’écu et les chevrons.',
      A: svg100('<g transform="rotate(45 50 50)"><path class="b" d="M50 6 L61 30 L50 44 L39 30 Z"/><path class="b" d="M50 44 V94"/></g>'),
      D: svg100('<path class="b" d="M50 14 L80 26 V52 C80 70 66 80 50 87 C34 80 20 70 20 52 V26 Z"/>'),
      C: svg100('<path class="b" d="M28 80 L50 62 L72 80 M28 60 L50 42 L72 60 M28 40 L50 22 L72 40"/>') },
    geometrie3: { name: 'Géométrie · entailles', desc: 'Trois entailles, le coup porté ; puis l’écu et les chevrons.',
      A: svg100('<path class="b" d="M22 62 L58 24 M32 80 L76 34 M52 84 L80 54"/>'),
      D: svg100('<path class="b" d="M50 14 L80 26 V52 C80 70 66 80 50 87 C34 80 20 70 20 52 V26 Z"/>'),
      C: svg100('<path class="b" d="M28 80 L50 62 L72 80 M28 60 L50 42 L72 60 M28 40 L50 22 L72 40"/>') },
    pleins: { name: 'Pleins', desc: 'Silhouettes pleines, sans contour : épée, bouclier, chevrons.',
      A: svg100('<g transform="rotate(45 50 50)">' + P_SWORD('bf') + '</g>'),
      D: svg100('<circle class="bf" cx="50" cy="50" r="36"/><circle class="cut" cx="50" cy="50" r="25"/><circle class="bf" cx="50" cy="50" r="9"/>'),
      C: svg100(chevProg(function (d) { return '<path class="bf" d="' + d + '"/>'; }, 11)) },
    pleinsContour: { name: 'Pleins · contour', desc: 'Les formes des Pleins au simple contour, une seule couleur, sans remplissage.',
      A: svg100('<g transform="rotate(45 50 50)">' + P_SWORD('ln') + '</g>'),
      D: svg100('<circle class="ln" cx="50" cy="50" r="36"/><circle class="ln" cx="50" cy="50" r="11"/>'),
      C: svg100(chevProg(function (d) { return '<path class="ln" d="' + d + '"/>'; })) },
    pleinsFin: { name: 'Pleins · trait fin', desc: 'Les formes des Pleins, dessinées comme l’Actuel : contour fin, intérieur à peine teinté, détails gravés.',
      A: svg100('<g transform="rotate(45 50 50)"><path class="o g w" d="M50 6 L57 18 V62 H43 V18 Z"/><path class="d" d="M50 14 V58"/><rect class="o g" x="33" y="64" width="34" height="6" rx="3"/><rect class="o g" x="46.5" y="72" width="7" height="15" rx="2"/><path class="d" d="M46.5 76 L53.5 74 M46.5 80 L53.5 78 M46.5 84 L53.5 82"/><circle class="o g" cx="50" cy="92" r="4.5"/><circle class="gf" cx="50" cy="92" r="1.4"/></g>'),
      D: svg100('<circle class="o g w" cx="50" cy="50" r="36"/><circle class="d" cx="50" cy="50" r="30.5"/><circle class="o g" cx="50" cy="50" r="23"/><circle class="o g" cx="50" cy="50" r="9"/><circle class="gf" cx="50" cy="50" r="2.4"/>'),
      C: svg100(chevProg(function (d, x) { return '<path class="o g w" d="' + d + '"/><path class="d" d="' + x.mid + '"/>'; })) },
    pleinsFinOr: { name: 'Pleins · trait fin, doré', desc: 'Même dessin, intérieur plus doré : à mi-chemin entre les Pleins et l’Actuel.',
      A: svg100('<g transform="rotate(45 50 50)"><path class="o2 g w" d="M50 6 L57 18 V62 H43 V18 Z"/><path class="d" d="M50 14 V58"/><rect class="o2 g" x="33" y="64" width="34" height="6" rx="3"/><rect class="o2 g" x="46.5" y="72" width="7" height="15" rx="2"/><path class="d" d="M46.5 76 L53.5 74 M46.5 80 L53.5 78 M46.5 84 L53.5 82"/><circle class="o2 g" cx="50" cy="92" r="4.5"/><circle class="gf" cx="50" cy="92" r="1.4"/></g>'),
      D: svg100('<circle class="o2 g w" cx="50" cy="50" r="36"/><circle class="d" cx="50" cy="50" r="30.5"/><circle class="o2 g" cx="50" cy="50" r="23"/><circle class="o2 g" cx="50" cy="50" r="9"/><circle class="gf" cx="50" cy="50" r="2.4"/>'),
      C: svg100(chevProg(function (d, x) { return '<path class="o2 g w" d="' + d + '"/><path class="d" d="' + x.mid + '"/>'; })) },
    pleinsFilet: { name: 'Pleins · filet', desc: 'Les mêmes silhouettes, cernées d’un filet fin à distance, comme une gravure.',
      A: svg100('<g transform="rotate(45 50 50)">' + P_SWORD('ol') + P_SWORD('gap') + P_SWORD('bf') + '</g>'),
      D: svg100('<circle class="ol" cx="50" cy="50" r="34"/><circle class="gap" cx="50" cy="50" r="34"/><circle class="bf" cx="50" cy="50" r="34"/><circle class="cut" cx="50" cy="50" r="24"/><circle class="bf" cx="50" cy="50" r="8.5"/>'),
      C: svg100(chevProg(function (d) { return '<path class="ol" d="' + d + '"/><path class="gap" d="' + d + '"/><path class="bf" d="' + d + '"/>'; })) },
    pleinsGrave: { name: 'Pleins · gravés', desc: 'Filet fin autour, et quelques traits gravés dans la forme : fil de la lame, rivets, arêtes.',
      A: svg100('<g transform="rotate(45 50 50)">' + P_SWORD('ol') + P_SWORD('gap') + P_SWORD('bf') + '<path class="cut t" d="M50 15 V58 M47.5 76 H52.5 M47.5 80 H52.5"/></g>'),
      D: svg100('<circle class="ol" cx="50" cy="50" r="34"/><circle class="gap" cx="50" cy="50" r="34"/><circle class="bf" cx="50" cy="50" r="34"/><circle class="cut" cx="50" cy="50" r="24"/><circle class="bf" cx="50" cy="50" r="8.5"/>' +
        Array.from({ length: 8 }, function (_, k) { var q = pc(29, k * 45).split(' '); return '<circle class="cutf" cx="' + q[0] + '" cy="' + q[1] + '" r="1.5"/>'; }).join('')),
      C: svg100(chevProg(function (d, x) { return '<path class="ol" d="' + d + '"/><path class="gap" d="' + d + '"/><path class="bf" d="' + d + '"/><path class="cut t" d="' + x.cut + '"/>'; })) },
    hoplite: { name: 'Hoplite', desc: 'La lance (dory), le bouclier au lambda de Sparte, la trompette (salpinx) qui sonne la charge.',
      A: svg100('<g transform="rotate(40 50 50)"><path class="o g w" d="M50 3 C57 13 58 22 50 33 C42 22 43 13 50 3 Z"/><path class="d" d="M50 8 V30"/>' +
        '<rect class="o g" x="47.6" y="33" width="4.8" height="6" rx="1"/><rect class="o" x="48.5" y="39" width="3" height="47"/><path class="d" d="M48.5 60 H51.5 M48.5 63 H51.5 M48.5 66 H51.5"/>' +
        '<path class="o g" d="M47.6 86 H52.4 L50 98 Z"/></g>'),
      D: svg100('<circle class="o g w" cx="50" cy="50" r="44"/><circle class="d" cx="50" cy="50" r="37"/>' +
        '<path class="g w" d="M33 70 L50 29 L67 70"/><path class="d f" d="M38 70 L50 41 L62 70"/>' +
        Array.from({ length: 8 }, function (_, k) { return '<circle class="gf" cx="' + pc(40.5, k * 45 + 22.5).split(' ')[0] + '" cy="' + pc(40.5, k * 45 + 22.5).split(' ')[1] + '" r="1.4"/>'; }).join('')),
      C: svg100('<g transform="rotate(38 50 50)"><path class="o g w" d="M36 6 Q50 1 64 6 C58 14 53 22 52 32 L48 32 C47 22 42 14 36 6 Z"/><path class="g" d="M36 6 Q50 11 64 6"/>' +
        '<rect class="o" x="48.4" y="32" width="3.2" height="56"/><path class="d" d="M48.4 52 H51.6 M48.4 70 H51.6"/><path class="o g" d="M46 88 H54 L53 95 H47 Z"/></g>' +
        '<path class="d" d="M68 8 Q76 12 80 20 M74 2 Q86 8 90 20"/>')
    },
    olympe: { name: 'Olympe', desc: 'La foudre de Zeus, le temple qui protège, le soleil d’Hélios qui monte en puissance.',
      A: svg100('<path class="o g w" d="M60 4 L30 54 L47 54 L37 96 L72 40 L54 40 L68 4 Z"/><path class="d" d="M58 12 L40 46 M60 48 L46 80"/>'),
      D: svg100('<path class="o g w" d="M12 34 L50 11 L88 34 Z"/><path class="d" d="M26 30 L50 17 L74 30"/><circle class="gf" cx="50" cy="26" r="2.2"/>' +
        '<rect class="o g" x="14" y="36" width="72" height="6" rx="1"/>' +
        [20, 36, 56, 72].map(function (x) { return '<rect class="o" x="' + x + '" y="44" width="8" height="36"/><path class="d f" d="M' + (x + 4) + ' 47 V77"/>'; }).join('') +
        '<rect class="o g" x="11" y="82" width="78" height="5" rx="1"/><rect class="o g" x="6" y="89" width="88" height="5" rx="1"/>'),
      C: svg100('<circle class="d f" cx="50" cy="50" r="46"/>' +
        Array.from({ length: 12 }, function (_, k) { var a = k * 30; return k % 2 ? '<path class="d" d="M' + pc(21, a) + ' L' + pc(34, a) + '"/>' : '<path class="g w" d="M' + pc(21, a) + ' L' + pc(42, a) + '"/>'; }).join('') +
        '<circle class="o g w" cx="50" cy="50" r="14"/><circle class="d" cx="50" cy="50" r="8"/><circle class="gf" cx="50" cy="50" r="2.6"/>')
    },
    epure: { name: 'Épure', desc: 'Trois signes au trait, sans décor : la pointe, la garde, la montée en puissance.',
      A: svg100('<path class="g w" d="M18 82 L74 26"/><path class="o g w" d="M82 18 L60 24 L76 40 Z"/><path class="d" d="M18 82 L12 76 M18 82 L24 88"/>'),
      D: svg100('<path class="o g w" d="M58 10 C84 24 84 76 58 90 C68 72 68 28 58 10 Z"/><circle class="d" cx="34" cy="50" r="13"/><circle class="gf" cx="34" cy="50" r="5"/>'),
      C: svg100('<path class="d" d="M26 80 L50 62 L74 80"/><path class="g w" d="M26 60 L50 42 L74 60"/><path class="g w" d="M26 40 L50 22 L74 40"/><circle class="gf" cx="50" cy="12" r="2.6"/>')
    },
    atlas: { name: 'Atlas', desc: 'Les motifs du site : l’étoile filante qui frappe, la sphère armillaire qui protège, la rose des vents qui s’ouvre.',
      A: svg100(star4(68, 32, 18, 5, 'o g w') + '<circle class="gf" cx="68" cy="32" r="2.2"/><path class="g" d="M58 42 L16 84"/><path class="d" d="M54 36 L24 66 M64 46 L34 76"/>'),
      D: svg100('<circle class="o g w" cx="50" cy="50" r="42"/><ellipse class="d" cx="50" cy="50" rx="42" ry="15"/><ellipse class="d" cx="50" cy="50" rx="15" ry="42"/>' +
        '<ellipse class="d f" cx="50" cy="50" rx="30" ry="42"/><path class="g" d="M8 50 H92"/><circle class="gf" cx="50" cy="50" r="2.6"/>'),
      C: svg100(star4(50, 50, 30, 7, 'o', 45) + star4(50, 50, 46, 8, 'o g w') + '<circle class="d" cx="50" cy="50" r="13"/><circle class="gf" cx="50" cy="50" r="2.6"/>')
    },
    drachme: { name: 'Drachmes', desc: 'Chaque action frappée sur une pièce antique à bord perlé : même cadre, symbole au centre.',
      A: svg100('<circle class="o g w" cx="50" cy="50" r="44"/><circle class="d" cx="50" cy="50" r="38" stroke-dasharray="1 3.2"/>' +
        '<g transform="rotate(40 50 50)"><path class="o g" d="M50 18 L54 28 L53 64 L47 64 L46 28 Z"/><path class="d" d="M50 30 V61"/><path class="g w" d="M39 66 H61"/><path class="g" d="M50 68 V78"/><circle class="gf" cx="50" cy="81" r="2.6"/></g>'),
      D: svg100('<circle class="o g w" cx="50" cy="50" r="44"/><circle class="d" cx="50" cy="50" r="38" stroke-dasharray="1 3.2"/>' +
        '<circle class="o g" cx="50" cy="50" r="22"/><circle class="d" cx="50" cy="50" r="15"/><circle class="o g" cx="50" cy="50" r="6"/><circle class="gf" cx="50" cy="50" r="2"/>'),
      C: svg100('<circle class="o g w" cx="50" cy="50" r="44"/><circle class="d" cx="50" cy="50" r="38" stroke-dasharray="1 3.2"/>' +
        '<path class="o g" d="M50 20 C58 30 64 40 61 52 C59 60 55 64 50 66 C45 64 41 60 39 52 C37 44 42 38 45 31 C47 37 49 40 52 40 C53 33 52 26 50 20 Z"/>' +
        '<path class="g" d="M38 72 H62"/><path class="d" d="M43 77 H57"/>')
    }
  };
  function iconSet() { var v = ''; try { v = localStorage.getItem('atlas-act-icons') || ''; } catch (e) { /* ignore */ } return ICON_SETS[v] ? v : 'actuel'; }
  function actArt(k, setId) {
    var set = ICON_SETS[setId || iconSet()];
    return '<span class="cb-act-art is-' + k + (set.legacy ? '' : ' is-set') + '">' + set[k] + '</span>';
  }

  /** Issue d’un tour, en une ligne (légende sous les cartes). */
  function outcome(a, b, xa, r) {
    var dealt = r.foe, taken = r.me;
    if (b === 'A' && a === 'D') return taken ? ['Garde usée · −' + taken, 'bad'] : ['Paré' + NB + '!' + (dealt ? ' Riposte −' + dealt : ''), 'good'];
    if (b === 'A' && a === 'A') return ['Échange de coups', dealt >= taken ? 'good' : 'bad'];
    if (b === 'A') return ['Touché' + NB + '! −' + taken, 'bad'];
    if (b === 'D' && a === 'A') return dealt ? ['Garde percée · −' + dealt, 'good'] : ['Bloqué' + (taken ? ' · riposte −' + taken : ''), 'bad'];
    if (b === 'D' && a === 'C') return ['Vous chargez · ×' + (xa + 1), 'good'];
    if (b === 'D') return ['Gardes levées', ''];
    if (a === 'A') return ['Coup porté' + NB + '! −' + dealt, 'good'];
    if (a === 'C') return ['Double charge', ''];
    return ['Il prend son élan', ''];
  }
  /** Effets posés sur la carte d’un camp pendant un tour, dans un calque à la taille d’une carte de 136 px (mis à
      l’échelle par --ps). Ce sont les cartes qui bougent (élan, frappe, garde, élévation) ; le calque ajoute :
      bouclier rond levé devant la carte (Défendre), éclats d’or qui convergent puis éclatent et « ×N » (Charger), entaille rouge et
      dégâts (coup reçu), étoile d’impact sur le bord frappé (côté adversaire). */
  var SLASH = '<svg class="cb-slash" viewBox="0 0 136 190" aria-hidden="true">' +
    ['M118 34 L26 150', 'M128 58 L42 172', 'M104 18 L22 118'].map(function (d, k) { return '<path pathLength="100" style="--k:' + k + '" d="' + d + '"/>'; }).join('') + '</svg>';
  function propsHTML(act, x, chargeAfter, taken, struck) {
    var prop = act === 'D'
      // le bouclier du bouton Défendre (même jeu d’icônes), translucide, levé au bord de la carte côté adversaire ;
      // s’il pare : onde d’or et riposte
      ? '<div class="cb-aspis">' + ICON_SETS[iconSet()].D + '<i class="cb-aspis-ring"></i></div><i class="cb-aspis-rip"></i>'
      : act === 'C'
      // l’énergie se rassemble : de fines étincelles d’or montent du bas de la carte en ondulant, puis filent toutes vers
      // le coin où le sceau « ×N » se frappe (.cb-seal.is-new) ; un liseré d’or fait le tour de la carte comme une jauge
      ? '<i class="cb-ch-trace"></i>' + Array.from({ length: 16 }, function (_, k) {
          return '<i class="cb-spark" style="--sx:' + (10 + (k * 37 % 116)) + 'px;--sy:' + (118 + (k * 53 % 64)) + 'px;--dx:' + ((k * 29 % 34) - 17) + 'px;--dy:' + (-28 - (k * 13 % 36)) + 'px;--sz:' + (2.5 + (k * 7 % 5) * 0.6).toFixed(1) + 'px;animation-delay:' + (k * 0.016).toFixed(3) + 's"></i>';
        }).join('')
      : '';
    return '<div class="cb-vs-props" data-props aria-hidden="true"><i class="cb-vs-flash"></i>' + prop +
      (taken ? '<i class="cb-hit-veil"></i>' + SLASH : '') +
      (struck ? '<i class="cb-vs-wave"></i><i class="cb-vs-wave is-2"></i>' : '') +
      (act === 'A' && x > 1 ? '<b class="cb-vs-x"><span><i>×</i>' + x + '</span></b>' : '') +
      (taken ? '<b class="cb-vs-dmg">−' + taken + '</b>' : '') + '</div>';
  }
  /** Joue un tour sur les deux cartes de l’arène : l’attaquant fonce frapper la carte adverse (--reach : distance jusqu’au
      contact, la moitié si les deux attaquent), le défenseur lève sa garde, celui qui charge s’élève
      (choc à 0,76 s, fin à 1,9 s, synchronisés avec duelSounds). t : { a, b, xa, xb, r, foeCharge }.
      on.impact() au choc, on.done() à la fin. Renvoie une fonction qui termine tout de suite (toucher pour passer). */
  var FX_CLASSES = ['is-fx', 'is-A', 'is-D', 'is-C', 'is-hit', 'is-guard', 'is-blocked', 'is-heavy', 'is-soft'];
  function playTurn(scope, t, on) {
    on = on || {};
    var soft = t.a !== 'A' && t.b !== 'A';
    var sides = [
      { side: 'me', act: t.a, x: t.xa, after: t.xa, taken: t.r.me, guard: t.a === 'D' && t.b === 'A' && !t.r.me, blocked: t.a === 'A' && t.b === 'D' && !t.r.foe, struck: t.b === 'A' },
      { side: 'foe', act: t.b, x: t.xb, after: t.foeCharge, taken: t.r.foe, guard: t.b === 'D' && t.a === 'A' && !t.r.foe, blocked: t.b === 'A' && t.a === 'D' && !t.r.me, struck: t.a === 'A' }
    ];
    // Distance d’une frappe : d’un centre de carte à l’autre, moins une largeur de carte (contact au bord)
    var cards = ['me', 'foe'].map(function (sd) { var c = scope.querySelector('.cb-fighter[data-side="' + sd + '"] .cb-card'); return c && c.getBoundingClientRect(); });
    var reach = 30;
    if (cards[0] && cards[1]) {
      var gap = Math.abs((cards[1].left + cards[1].width / 2) - (cards[0].left + cards[0].width / 2)) - cards[0].width * 0.94;
      reach = Math.max(14, Math.round(t.a === 'A' && t.b === 'A' ? gap / 2 : gap));
    }
    function clean(f) {
      FX_CLASSES.forEach(function (c) { f.classList.remove(c); });
      var p = f.querySelector('[data-props]'); if (p) p.parentNode.removeChild(p);
    }
    var els = sides.map(function (s) {
      var f = scope.querySelector('.cb-fighter[data-side="' + s.side + '"]'); if (!f) return null;
      var card = f.querySelector('.cb-card');
      clean(f);
      card.style.setProperty('--ps', ((card.offsetWidth || 136) / 136).toFixed(3));
      card.style.setProperty('--reach', reach + 'px');
      card.insertAdjacentHTML('beforeend', propsHTML(s.act, s.x, s.after, s.taken, s.struck));
      void f.offsetWidth;   // relance les animations
      f.classList.add('is-fx', 'is-' + s.act);
      if (s.taken) f.classList.add('is-hit'); else if (s.guard) f.classList.add('is-guard');
      if (s.blocked) f.classList.add('is-blocked');
      if (s.act === 'A' && s.x > 1) f.classList.add('is-heavy');
      if (soft) f.classList.add('is-soft');
      return f;
    }).filter(Boolean);
    var hit = false, ended = false;
    function impact() { if (hit) return; hit = true; if (on.impact) on.impact(); }
    function done() {
      if (ended) return; ended = true; clearTimeout(t1); clearTimeout(t2);
      impact(); els.forEach(clean);
      if (on.done) on.done();
    }
    var t1 = setTimeout(impact, 760), t2 = setTimeout(done, 1900);
    return done;
  }

  /** Les overlays du combat commencent sous la barre de navigation du haut (elle reste visible). */
  function placeUnderHeader(el) {
    var h = document.querySelector('.site-header, header');
    if (el && h) el.style.top = Math.max(0, Math.round(h.getBoundingClientRect().bottom)) + 'px';
  }
  /** Intro « VS » plein écran, façon musée : fond sombre, les deux cartes entières (liseré et halo or / rouge)
      de part et d’autre d’un « vs » en italique, le nom du joueur sous chaque carte (le personnage est déjà écrit dessus),
      « Manche N » en haut. Empilé sur mobile, côte à côte sur grand écran.
      Durée 2,4 s (« vs » à 0,55 s), synchronisée avec playIntro() et A.sfx.duel.versus. */
  function introHTML(meEd, foeEd, meName, foeName, title) {
    var meLabel = (meName && meName !== 'Vous') ? U.esc(meName) : 'Vous', foeLabel = foeName ? U.esc(foeName) : 'Adversaire';
    function side(who, ed, label) {
      return '<div class="cb-in-side is-' + who + '"><div class="cb-in-card">' + U.card(ed, { open: false, tilt: false, ctx: 'versus', priority: true }) + '</div>' +   // illustration au format de l’intro (nette)
        '<p class="cb-in-who"><b>' + label + '</b>' + (who === 'foe' ? '<small>IA</small>' : '') + '</p></div>';
    }
    // « Manche 1 · Jusqu’au KO » : la manche en grand, la précision en sous-titre
    var t = String(title).split(' · ');
    return '<div class="cb-intro-fx" data-intro aria-hidden="true"><i class="cb-in-backdrop"></i><div class="cb-in-wrap">' +
      '<p class="cb-in-title"><b>' + t[0] + '</b>' + (t[1] ? '<span>' + t.slice(1).join(' · ') + '</span>' : '') + '</p>' +
      '<div class="cb-in-stage">' + side('me', meEd, meLabel) +
        '<div class="cb-in-mid"><i class="cb-in-flash"></i><span class="cb-in-vs">vs</span></div>' + side('foe', foeEd, foeLabel) + '</div>' +
      '</div></div>';
  }

  /** Bouclier rond gravé (bord, rivets, cercle intérieur, umbo), fendu en deux le long d’une fêlure en zigzag. */
  var BROKEN_SHIELD = (function () {
    var crack = 'L98 62 L112 84 L96 108 L108 130 L94 168';
    var rivets = '';
    for (var k = 0; k < 12; k++) { var t = k / 12 * Math.PI * 2; rivets += '<circle class="gf" cx="' + (100 + 59 * Math.cos(t)).toFixed(1) + '" cy="' + (100 + 59 * Math.sin(t)).toFixed(1) + '" r="1.8"/>'; }
    var shield = '<circle class="o g w" cx="100" cy="100" r="66"/><circle class="d" cx="100" cy="100" r="53"/>' + rivets +
      '<circle class="d f" cx="100" cy="100" r="36"/><circle class="d" cx="100" cy="100" r="22"/><circle class="o g" cx="100" cy="100" r="9"/>';
    return '<svg class="atl-prop" viewBox="0 0 200 200"><defs>' +
      '<clipPath id="cbsh-l"><path d="M0 0 H108 L108 30 ' + crack + ' L94 200 H0 Z"/></clipPath>' +
      '<clipPath id="cbsh-r"><path d="M200 0 H108 L108 30 ' + crack + ' L94 200 H200 Z"/></clipPath></defs>' +
      '<g class="cb-shatter-all"><g class="cb-shatter-l" clip-path="url(#cbsh-l)">' + shield + '</g>' +
      '<g class="cb-shatter-r" clip-path="url(#cbsh-r)">' + shield + '</g>' +
      '<path class="cb-shatter-crack" d="M108 30 ' + crack + '"/></g></svg>';
  })();
  /** Haut de l’écran de fin : médaille de victoire (anneaux, étoiles, titre qui brille), bouclier brisé de la défaite,
      ou épées croisées de l’égalité. Les lettres du titre entrent une à une. */
  function endHero(res) {
    var title = { win: 'Victoire', loss: 'Défaite', draw: 'Égalité' }[res];
    var letters = title.split('').map(function (l, k) { return '<span style="--i:' + k + '">' + l + '</span>'; }).join('');
    // Victoire et égalité : médaillon gravé au trait d’or (même DA que les cartes de mode) ; défaite : bouclier brisé
    var STAR = '<g class="cb-end-starmark"><path class="o g" d="M100 70 L106 94 L130 100 L106 106 L100 130 L94 106 L70 100 L94 94 Z"/>' +
      '<path class="d" d="M100 70 V130 M70 100 H130"/><circle class="gf" cx="100" cy="100" r="2.6"/></g>';
    var emblem = res === 'win'
      ? '<i class="cb-end-glow"></i><i class="cb-end-ring"></i>' + GLOBE +
        '<svg class="cb-end-medal atl-prop" viewBox="0 0 200 200"><g class="cb-end-laurel">' + MEDAL.branch(-1) + MEDAL.branch(1) + '</g>' + STAR + '</svg>'
      : res === 'loss'
      ? '<div class="cb-shatter">' + BROKEN_SHIELD + '<i class="cb-broken-chip"></i><i class="cb-broken-chip is-2"></i><i class="cb-broken-chip is-3"></i></div>'
      : GLOBE + '<svg class="cb-end-medal is-draw atl-prop" viewBox="0 0 200 200">' +
        '<g class="cbm-sabre is-l">' + MEDAL.sabre + '</g><g class="cbm-sabre is-r">' + MEDAL.sabre + '</g></svg>';
    return '<div class="cb-end-hero is-' + res + '" aria-hidden="true">' + emblem + '</div>' +
      '<h2 class="h1 cb-end-title" aria-label="' + title + '">' + letters + '</h2>';
  }

  /* Bande-son d’un tour, calée sur l’animation (entrée 0 s, armement ~0,4 s, choc 0,76 s) ; aussi utilisée par le Studio combat */
  function duelSounds(a, b, xa, xb, r, me, foe) {
    var D = A.sfx && A.sfx.duel; if (!D || A.sfx.muted) return;
    try {
      var T = 0.76, heavy = (a === 'A' && xa > 1) || (b === 'A' && xb > 1);
      A.sfx.whoosh(0.8);
      if (a === 'C' || b === 'C') D.power(0.12, Math.max(a === 'C' ? me.charge : 0, b === 'C' ? foe.charge : 0));
      if (a === 'D' || b === 'D') D.shield(0.3);
      if (a === 'A') D.swing(T - 0.16, a === 'A' && xa > 1);
      if (b === 'A') D.swing(T - 0.13, xb > 1);
      if (a === 'A' && b === 'A') D.cross(T, heavy);
      else if (a === 'A' && b === 'D' || b === 'A' && a === 'D') D.clang(T, heavy);
      else if (a === 'A' || b === 'A') D.strike(T, heavy);
      else D.knock(T);
      // La charge éclate si personne ne vient l’interrompre d’un coup
      if (a === 'C' && !r.me || b === 'C' && !r.foe) D.burst(T + 0.04, Math.max(a === 'C' ? me.charge : 0, b === 'C' ? foe.charge : 0));
    } catch (e) { /* audio indisponible */ }
  }
  function endSound(res) {
    try { var D = A.sfx && A.sfx.duel; if (D && !A.sfx.muted) D[res === 'win' ? 'victory' : res === 'loss' ? 'defeat' : 'draw'](0.05); } catch (e) { /* audio indisponible */ }
  }
  function versusSound() { try { if (A.sfx && A.sfx.duel && !A.sfx.muted) A.sfx.duel.versus(0); } catch (e) { /* audio indisponible */ } }

  var currentRival = '';

  P.combat = {
    title: 'Combat',
    render: function () {
      var c = S.combat();
      return '<section class="page-head cb-head"><div class="container">' +
        '<p class="eyebrow">Arène</p><h1 class="h1">Combat</h1>' +
        '<div class="kpis">' +
          '<div><span>Victoires</span><b>' + c.w + '</b></div>' +
          '<div><span>Défaites</span><b>' + c.l + '</b></div>' +
          '<div><span>Série</span><b>' + c.streak + '</b></div>' +
          '<div><span>Record de dégâts · Duel</span><b>' + c.best + '</b></div>' +
        '</div></div></section>' +
        '<section class="section-tight"><div class="container" data-cb>' + hubHTML() + '</div></section>';
    },
    mount: function (root, ctx) {
      var box = root.querySelector('[data-cb]'), st = null, busy = false, mode = 'duel', actionTimer = null, skipTurn = null;
      function sfx(n, a) { try { if (A.sfx && A.sfx[n]) A.sfx[n](a); } catch (e) { /* ignore */ } }
      function show(html, keepScroll) {
        box.innerHTML = html;
        var head = root.querySelector('.page-head'); if (head) head.hidden = true;
        if (!keepScroll) {
          window.scrollTo(0, 0);
          var title = box.querySelector('h2');
          if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
        }
      }
      /* Duel entre amis : pvp = intention (hôte ou invité, avant la partie) ; st.pvp = la partie en cours */
      var pvp = null, pollT = null;
      function poll(id, fn, ms) {
        clearTimeout(pollT);
        (function loop() {
          if (!box.isConnected) return;
          NET.call('salle/' + id).then(function (room) {
            if (!box.isConnected) return;
            if (fn(room) !== false) pollT = setTimeout(loop, ms);
          }, function (e) {
            if (/introuvable/i.test(e.message)) { U.toast('Salle introuvable ou expirée'); pvpQuit(); return; }
            pollT = setTimeout(loop, ms * 2);
          });
        })();
      }
      function pvpToken() { return (st && st.pvp) || (pvp && pvp.room) || null; }
      function pvpQuit(silent) {
        var g = pvpToken();
        if (g && g.token) NET.call('salle/' + g.id + '/quitter', { token: g.token }).catch(function () {});
        pvp = null; resetMatch();
        if (!silent) A.app.rerender();
      }
      function pvpLeft(name) { U.toast(name + ' a quitté le duel'); pvp = null; resetMatch(); A.app.rerender(); }
      window.addEventListener('pagehide', function () { var g = pvpToken(); if (g && g.token) NET.leave(g); });
      /** Début de la partie entre amis : vos cartes contre les siennes, puis l’écran du programme habituel */
      function pvpBegin(info, room, mineEds) {
        resetMatch();
        var o = room.players[1 - info.p];
        currentRival = o.name;
        var uids = info.p === 0 || team.length === 3 && mineEds.every(function (e, k) { var it = S.item(team[k]); return it && it.ed === e; }) ? team.slice() : [];
        st = {
          manche: 0, tour: 0, score: { me: 0, foe: 0 }, wins: { me: 0, foe: 0 }, per: [], hist: { A: 0, D: 0, C: 0 }, last: null,
          mine: mineEds.map(function (e, k) { return fighter(e, uids[k]); }),
          foes: o.team.map(function (e) { return fighter(e); }),
          pvp: { id: info.id, token: info.token, p: info.p, seed: room.seed, n: 0, wait: null }
        };
        pvp = null;
        sfx('unlock'); matchIntro(o.team);
      }
      /** Hôte : crée la salle avec son équipe, affiche le lien et attend l’adversaire */
      function pvpHost() {
        var eds = team.map(function (u) { return S.item(u).ed; });
        NET.call('salle', { name: myName(), team: eds }).then(function (info) {
          pvp = { role: 'host', room: info };
          var link = info.link || info.lan + '/#/combat?salle=' + info.id, web = NET.online();
          show('<div class="cb-intro cb-lobby"><p class="eyebrow">Duel tactique · Défi entre amis</p>' +
            '<h2 class="cb-intro-name">Salle ' + info.id + '</h2>' +
            '<p class="cb-intro-rules">' + (web ? 'Envoyez ce lien à votre adversaire (message, WhatsApp, e-mail…)' : 'Envoyez ce lien à une personne connectée au même réseau') + NB + ':</p>' +
            '<div class="cb-link"><input readonly value="' + U.esc(link) + '" aria-label="Lien du défi" data-link><button class="btn btn-gold btn-sm" data-copy>Copier</button>' +
              (web && navigator.share ? '<button class="btn btn-ghost btn-sm" data-share>Partager</button>' : '') + '</div>' +
            (web ? '<p class="muted small">Gardez cette page ouverte : le duel commence dès que votre adversaire a choisi son équipe.</p>' : '') +
            '<p class="cb-wait"><i></i>En attente de votre adversaire…</p>' +
            '<div class="cb-intro-actions"><button class="btn btn-ghost btn-lg" data-pvp-quit>Annuler</button></div></div>');
          poll(info.id, function (room) {
            if (!pvp || pvp.room !== info) return false;
            if (room.players[1] && room.players[1].team) { pvpBegin(info, room, eds); return false; }
          }, 700);
        }, function () { U.toast(NET.online() ? 'Connexion au relais impossible, réessayez' : 'Le serveur du réseau local ne répond pas'); });
      }
      /** Invité : arrive par le lien (#/combat?salle=ABCD) */
      function pvpGuest(id) {
        NET.call('salle/' + id).then(function (room) {
          if (room.left || room.players.length > 1) { show('<div class="cb-intro cb-lobby"><p class="eyebrow">Défi entre amis</p><h2 class="cb-intro-name">Salle ' + U.esc(id) + '</h2><p class="cb-intro-rules">' + (room.left ? 'Ce défi a été annulé.' : 'Ce duel a déjà commencé.') + '</p><div class="cb-intro-actions"><button class="btn btn-ghost btn-lg" data-hub>Arène</button></div></div>'); return; }
          var host = room.players[0];
          pvp = { role: 'guest', id: room.id, host: host };
          mode = 'duel';
          var can = roster().length >= 3;
          show('<div class="cb-intro cb-lobby"><p class="eyebrow">Duel tactique · Défi entre amis</p>' +
            '<h2 class="cb-intro-name">' + U.esc(host.name) + ' vous défie</h2>' +
            '<p class="cb-intro-rules">3 cartes · Chaque manche se joue jusqu’au KO · ' + WIN_MANCHES + ' manches gagnées l’emportent</p>' + nameField() +
            '<div class="cb-intro-actions">' + (can ? '<button class="btn btn-gold btn-lg" data-pvp-pick>' + I('swords') + 'Choisir mon équipe</button>' : '') +
              '<button class="btn ' + (can ? 'btn-ghost' : 'btn-gold') + ' btn-lg" data-pvp-random>Équipe au hasard</button></div>' +
            (can ? '' : '<p class="muted small">Votre collection compte moins de trois personnages : une équipe de niveau proche vous est prêtée.</p>') + '</div>');
        }, function () {
          show('<div class="cb-intro cb-lobby"><p class="eyebrow">Défi entre amis</p><h2 class="cb-intro-name">Salle introuvable</h2><p class="cb-intro-rules">' + (NET.online() ? 'Le lien a expiré ou le défi a été annulé.' : 'Le lien a expiré, ou le serveur du réseau local n’est pas lancé.') + '</p><div class="cb-intro-actions"><button class="btn btn-ghost btn-lg" data-hub>Arène</button></div></div>');
        });
      }
      function pvpJoin(eds) {
        var g = pvp; if (!g || g.role !== 'guest' || g.joining) return;
        g.joining = true;
        show('<div class="cb-intro cb-lobby"><p class="eyebrow">Duel tactique · Défi entre amis</p><h2 class="cb-intro-name">' + U.esc(g.host.name) + ' vous défie</h2>' +
          '<p class="cb-wait"><i></i>En attente de ' + U.esc(g.host.name) + '…</p>' +
          '<div class="cb-intro-actions"><button class="btn btn-ghost btn-lg" data-hub>Arène</button></div></div>');
        NET.call('salle/' + g.id + '/rejoindre', { name: myName(), team: eds }).then(function (info) {
          if (pvp !== g) { NET.call('salle/' + g.id + '/quitter', { token: info.token }).catch(function () {}); return; }   // parti entre-temps
          pvpBegin(info, info.room, eds);
        },
          function (e) { if (pvp !== g) return; U.toast(e.message || 'Impossible de rejoindre'); pvp = null; A.app.rerender(); });
      }
      function resetMatch() { qzClear(); clearTimeout(pollT); swapIn = false; if (skipTurn) { var sk = skipTurn; skipTurn = null; sk(); } clearTimeout(actionTimer); clearTimeout(introTimer); clearOverlays(); busy = false; st = null; }
      function clearOverlays() { document.querySelectorAll('body > [data-fx], body > [data-intro]').forEach(function (n) { n.parentNode.removeChild(n); }); }
      /* Intro VS par-dessus l’écran déjà affiché (un toucher la passe) */
      var introTimer = null;
      function playIntro(meEd, foeEd, title, then) {
        clearTimeout(introTimer);
        var user = (S.get().user || {}).name || 'Vous';
        clearOverlays();
        document.body.insertAdjacentHTML('beforeend', introHTML(meEd, foeEd, user, currentRival, title));   // sur body, sous la barre de navigation du haut
        var el = document.body.querySelector('[data-intro]');
        placeUnderHeader(el);
        var fired = false;
        function close() { clearTimeout(introTimer); if (el && el.parentNode) el.parentNode.removeChild(el); if (!fired && then) { fired = true; then(); } }
        if (el) el.addEventListener('click', close);
        introTimer = setTimeout(close, 2400);
        try { if (A.sfx && A.sfx.duel && !A.sfx.muted) A.sfx.duel.versus(0); } catch (e) { /* audio indisponible */ }
      }

      /* Choix de l’équipe */
      var pickLimit = 30;
      function teamSize() { return mode === 'terrains' ? Math.min(5, roster().length) : 3; }
      /* Choix de l’équipe : banc (un socle par manche), forces de l’équipe, barre d’actions, filtres et grille.
         Les filtres (pf) restent le temps de la session ; changer un filtre ne redessine que la grille. */
      var pf = { q: '', rar: '', coll: '', sort: 'power' }, justAdded = null;
      var SORTS = { power: 'Puissance', atk: 'Attaque', def: 'Défense', esp: 'Esprit', rar: 'Rareté', name: 'Nom' };
      var DUEL_SORTS = { power: 'Puissance', pv: 'PV', atk: 'Attaque', def: 'Défense', rar: 'Rareté', name: 'Nom' };
      function sorts() { return mode === 'duel' ? DUEL_SORTS : SORTS; }
      function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
      function filtered(list) {
        var q = norm(pf.q);
        var out = list.filter(function (i) {
          var ed = A.ED[i.ed], ch = A.CHAR[ed.charId], co = A.COLL[ch.coll];
          if (pf.rar && ed.rarity !== pf.rar) return false;
          if (pf.coll && ch.coll !== pf.coll) return false;
          return !q || norm(ch.name + ' ' + (ch.title || '') + ' ' + (co ? co.name : '')).indexOf(q) !== -1;
        });
        function key(i) { var ed = A.ED[i.ed], ch = A.CHAR[ed.charId];
          if (mode === 'duel' && /^(atk|pv|def)$/.test(pf.sort)) return duelStats(i.ed)[pf.sort];
          return pf.sort === 'atk' ? ch.atk : pf.sort === 'def' ? ch.def : pf.sort === 'esp' ? ch.esp : pf.sort === 'rar' ? A.R[ed.rarity].rank * 1000 + power(i.ed) : power(i.ed); }
        out.sort(pf.sort === 'name' ? function (a, b) { return A.CHAR[A.ED[a.ed].charId].name.localeCompare(A.CHAR[A.ED[b.ed].charId].name, 'fr'); } : function (a, b) { return key(b) - key(a); });
        return out;
      }
      function rosterHTML(list) {
        var size = teamSize(), full = team.length >= size, rows = filtered(list);
        var cnt = box.querySelector('[data-pick-count]'); if (cnt) cnt.textContent = rows.length + (rows.length > 1 ? ' cartes' : ' carte');
        if (!rows.length) return '<p class="cb-pick-none">Aucune carte ne correspond à ces filtres.</p>';
        return rows.slice(0, pickLimit).map(function (i, n) {
          var k = team.indexOf(i.uid);
          return '<div class="cg-item cb-pick-item' + (k !== -1 ? ' is-picked' : full ? ' is-dim' : '') + '" style="--n:' + Math.min(n, 14) + '">' +
            (mode === 'duel' ? duelCard : U.card)(i.ed, { uid: i.uid, open: false, tilt: false, select: true, selected: k !== -1, badge: k !== -1 ? (mode === 'duel' ? 'Manche ' : 'Carte ') + (k + 1) : '' }) + '</div>';
        }).join('') + (rows.length > pickLimit ? '<div class="cb-more"><button class="btn btn-ghost btn-sm" data-more>Afficher plus (' + (rows.length - pickLimit) + ')</button></div>' : '');
      }
      /** Menu déroulant dans la DA (remplace le select natif) : pastille, panneau sombre à filet, option choisie en or. */
      function dropdown(key, label, opts, prefix) {
        var cur = opts.filter(function (o) { return o[0] === pf[key]; })[0] || opts[0];
        return '<div class="cb-dd" data-dd="' + key + '"><button type="button" class="select cb-dd-btn" data-dd-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="' + label + '">' +
          '<span data-dd-label>' + (prefix || '') + U.esc(cur[1]) + '</span></button>' +
          '<div class="cb-dd-menu" role="listbox">' + opts.map(function (o) {
            return '<button type="button" class="cb-dd-opt' + (o[0] === cur[0] ? ' is-on' : '') + '" role="option" aria-selected="' + (o[0] === cur[0]) + '" data-dd-opt="' + o[0] + '" data-dd-text="' + U.esc((prefix || '') + o[1]) + '">' + U.esc(o[1]) + '</button>';
          }).join('') + '</div></div>';
      }
      function closeDropdowns(except) { box.querySelectorAll('.cb-dd.is-open').forEach(function (d) { if (d !== except) { d.classList.remove('is-open'); var b = d.querySelector('[data-dd-toggle]'); b.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); } }); }
      function renderRoster() { var g = box.querySelector('[data-roster]'); if (g) g.innerHTML = rosterHTML(roster()); }
      function pickScreen() {
        resetMatch();
        if (!sorts()[pf.sort]) pf.sort = 'power';
        var list = roster(), size = teamSize(); validTeam(size);
        if (list.length < 3) {
          show('<button class="back link-btn" data-hub>← Arène</button><div class="empty">Il vous faut au moins trois personnages différents pour combattre.<a class="btn btn-gold btn-sm" href="#/">Ouvrir un booster</a></div>');
          return;
        }
        // Banc : un socle par manche, la carte choisie y tombe ; × pour la retirer
        var seats = Array.from({ length: size }, function (_, k) {
          var it = team[k] && S.item(team[k]);
          return '<div class="cb-seat' + (it ? ' is-full' : '') + (it && (team[k] === justAdded || justAdded === 'all') ? ' is-new' : '') + '" style="--i:' + k + '">' +
            '<p class="cb-seat-n">' + (mode === 'duel' ? 'Manche ' : 'Carte ') + (k + 1) + '</p>' +
            '<div class="cb-seat-card">' + (it ? (mode === 'duel' ? duelCard : U.card)(it.ed, { open: false, tilt: false, ctx: 'mini' }) +
              '<button class="cb-seat-x" data-unseat="' + it.uid + '" aria-label="Retirer ' + U.esc(A.CHAR[A.ED[it.ed].charId].name) + '">×</button><i class="cb-seat-ring"></i>'
              : '<span class="cb-seat-empty">' + (k + 1) + '</span>') + '</div></div>';
        }).join('');
        justAdded = null;
        // Forces de l’équipe : totaux (barres sur le maximum par carte) et puissance.
        // En Duel, les stats de combat des cartes (ATQ, PV, DÉF) ; sinon ATQ / DÉF / ESP.
        var duel = mode === 'duel', keys = duel ? [['pv', 'PV'], ['atk', 'ATQ'], ['def', 'DÉF']] : [['atk', 'ATQ'], ['def', 'DÉF'], ['esp', 'ESP']];
        var cap = duel ? duelMax() : { atk: 100, def: 100, esp: 100 };
        var tot = { atk: 0, def: 0, esp: 0, pv: 0 }, pw = 0;
        team.forEach(function (u) { var it = S.item(u); if (!it) return; var ch = duel ? duelStats(it.ed) : A.CHAR[A.ED[it.ed].charId]; keys.forEach(function (x) { tot[x[0]] += ch[x[0]]; }); pw += power(it.ed); });
        var stats = '<div class="cb-team-stats">' + keys.map(function (x) {
          return '<p><span>' + x[1] + '</span><i><b style="width:' + Math.min(100, tot[x[0]] / (size * cap[x[0]]) * 100).toFixed(1) + '%"></b></i><em>' + tot[x[0]] + '</em></p>';
        }).join('') + '<p class="cb-team-pw"><span>Puissance</span><em>' + pw + '</em></p></div>';
        // Filtres : rareté (seulement celles présentes), univers présents, tri
        var rars = Object.keys(A.R).filter(function (r) { return list.some(function (i) { return A.ED[i.ed].rarity === r; }); });
        var colls = []; list.forEach(function (i) { var c = A.CHAR[A.ED[i.ed].charId].coll; if (colls.indexOf(c) === -1) colls.push(c); });
        colls.sort(function (a, b) { return (A.COLL[a] ? A.COLL[a].name : a).localeCompare(A.COLL[b] ? A.COLL[b].name : b, 'fr'); });
        // Mêmes composants que la page Collection : raretés en pastilles (1re ligne), recherche et menus (2e ligne)
        var filters = '<div class="cb-filters">' +
          '<div class="chips scroll-x cb-chips" role="group" aria-label="Rareté"><button class="chip' + (!pf.rar ? ' is-active' : '') + '" data-pf-rar="">Toutes</button>' +
            rars.map(function (r) { return '<button class="chip chip-r r-' + r + (pf.rar === r ? ' is-active' : '') + '" data-pf-rar="' + r + '"><i></i>' + A.R[r].label + '</button>'; }).join('') + '</div>' +
          '<label class="search cb-search">' + I('search') + '<input type="search" data-pf="q" placeholder="Rechercher un personnage…" value="' + U.esc(pf.q) + '" aria-label="Rechercher un personnage"></label>' +
          dropdown('coll', 'Univers', [['', 'Tous les univers']].concat(colls.map(function (c) { return [c, A.COLL[c] ? A.COLL[c].name : c]; }))) +
          dropdown('sort', 'Trier', Object.keys(sorts()).map(function (k) { return [k, sorts()[k]]; }), 'Trier : ') +
          '<span class="cb-pick-count" data-pick-count></span></div>';
        show('<div class="cb-pick">' +
          '<button class="back link-btn" data-hub>← Arène</button>' +
          '<div class="cb-pick-head"><p class="eyebrow">' + MODES[mode].name + (pvp ? ' · Défi entre amis' : ' · Équipe') + '</p><h2 class="cb-pick-title">Composez votre équipe</h2>' +
            '<p class="cb-pick-hint">' + MODES[mode].hint + '</p>' + (pvp ? nameField() : '') + '</div>' +
          '<div class="cb-bench" style="--cb-team-size:' + size + '">' + seats + '</div>' + stats +
          '<div class="cb-pick-bar"><button class="btn btn-ghost btn-sm" data-auto title="Équipe conseillée">' + I('sparkle') + '<span class="cb-lbl">Équipe conseillée</span></button>' +
            (team.length ? '<button class="btn btn-ghost btn-sm" data-clear title="Vider l’équipe">×<span class="cb-lbl"> Vider</span></button>' : '') +
            '<button class="btn btn-gold btn-sm cb-pick-go" data-go' + (team.length === size ? '' : ' disabled') + '>' + I('swords') + (pvp ? (pvp.role === 'guest' ? 'Rejoindre le duel' : 'Créer le défi') : 'Trouver un adversaire') + ' <span>' + team.length + '/' + size + '</span></button></div>' +
          filters +
          '<div class="card-grid cb-roster" data-roster></div>' +
        '</div>');
        renderRoster();
      }

      /* Arène */
      function start() {
        resetMatch();
        var foes = rivalTeam(team, mode);
        currentRival = pick(RIVALS);
        if (mode !== 'duel') {
          st = { mode: mode, mine: team.map(function (u) { return S.item(u).ed; }), foes: foes, finished: false };
          if (mode === 'quiz') {
            st.manche = 0; st.wins = { me: 0, foe: 0 }; st.per = []; st.used = {}; st.dealt = 0; st.joker = 1; st.streak = { me: 0, foe: 0 }; st.phase = 'intro';
            st.fm = st.mine.map(function (e) { return fighter(e); }); st.ff = foes.map(function (e) { return fighter(e); });
          } else { st.game = G.create(st.mine, foes); st.selectedEd = null; st.selectedLane = null; st.useBanner = false; }
          sfx('unlock'); matchIntro(foes); return;
        }
        st = {
          manche: 0, tour: 0, score: { me: 0, foe: 0 }, wins: { me: 0, foe: 0 }, per: [], hist: { A: 0, D: 0, C: 0 }, last: null,
          mine: team.map(function (u) { return fighter(S.item(u).ed, u); }),
          foes: foes.map(function (e) { return fighter(e); })
        };
        sfx('unlock');
        matchIntro(foes);
      }
      function matchIntro(foes) {
        var rules = mode === 'duel' ? 'Chaque manche se joue jusqu’au KO · ' + WIN_MANCHES + ' manches gagnées l’emportent'
          : mode === 'quiz' ? 'Questions éclair · le premier qui répond juste fait frapper sa carte · ' + WIN_MANCHES + ' manches gagnées l’emportent'
          : st.mine.length + ' déploiements · Une bannière de +20 · Contrôlez le plus de terrains';
        // Programme : en Duel, une colonne par manche (votre carte contre la sienne) ; sinon les deux équipes l’une sous l’autre
        var mineEds = mode === 'duel' && st.mine && st.mine[0] && st.mine[0].ed ? st.mine.map(function (f) { return f.ed; }) : team.map(function (u) { return S.item(u).ed; });
        // Chaque carte arrive face cachée (le dos du Booster Atlas, comme à l’ouverture des sachets) puis se retourne ; --i : rang d’apparition
        var pack = A.PACKS.filter(function (x) { return x.id === 'standard'; })[0] || A.PACKS[0];
        var back = U.cardBack(pack && pack.theme);
        function cell(ed, side, k) {
          return ed ? '<div class="cb-pg-card is-' + side + '"' + (k != null ? ' style="--i:' + k + '"' : '') + '><div class="cb-pg-flip">' +
            '<div class="cb-pg-face">' + (mode === 'duel' ? duelCard : U.card)(ed, { open: false, tilt: false, ctx: 'mini' }) + '</div>' +
            '<div class="cb-pg-back">' + back + '</div></div></div>' : '<div></div>';
        }
        var prog;
        if (mode === 'duel') {
          prog = '<div class="cb-pg is-duel">' + foes.map(function (e, k) {
            return '<div class="cb-pg-col" style="--i:' + k + '"><p class="cb-pg-n">Manche ' + (k + 1) + '</p>' + cell(mineEds[k], 'me') + '<span class="cb-pg-vs">vs</span>' + cell(e, 'foe') + '</div>';
          }).join('') + '</div>';
        } else {
          prog = '<div class="cb-pg is-rows">' +
            '<p class="cb-pg-who is-me">Vous</p><div class="cb-pg-row">' + mineEds.map(function (e, k) { return cell(e, 'me', k); }).join('') + '</div>' +
            '<span class="cb-pg-vs">vs</span>' +
            '<p class="cb-pg-who">' + U.esc(currentRival) + '</p><div class="cb-pg-row">' + foes.map(function (e, k) { return cell(e, 'foe', k); }).join('') + '</div></div>';
        }
        show('<div class="cb-intro"><p class="eyebrow">' + MODES[mode].name + (st.pvp ? ' · Défi entre amis' : ' · Adversaire trouvé') + '</p>' +
          '<h2 class="cb-intro-name">' + U.esc(currentRival) + ' <span class="cb-ai">' + (st.pvp ? 'Ami' : 'IA') + '</span></h2>' +
          '<p class="cb-intro-rules">' + rules + '</p>' + prog +
          (mode === 'terrains' ? '<p class="muted small">La réserve adverse est visible. Chaque ordre reste secret jusqu’à sa résolution. Vous pouvez renforcer plusieurs fois le même terrain.</p>' : '') +
          '<div class="cb-intro-actions"><button class="btn btn-ghost btn-lg" data-pick>Annuler</button>' +
          '<button class="btn btn-gold btn-lg cb-intro-go" data-begin>' + I(MODES[mode].icon) + 'Commencer</button></div></div>');
        // Bruits de la distribution, calés sur l’animation : élan, cartes posées, retournements
        try {
          var X = A.sfx; if (X && !X.muted) {
            var n = Math.max(mineEds.length, foes.length);
            for (var k = 0; k < n; k++) { X.deal(0.5 + k * 0.14); X.deal(0.6 + k * 0.14, 0.8); }   // cartes posées ; ses cartes restent face cachée
          }
        } catch (e) { /* ignore */ }
      }
      /* Repères des manches : or gagnée, rouge perdue, cercle pour la manche en cours */
      function pips() {
        var s = '';
        for (var k = 0; k < MANCHES; k++) { var p = st.per[k], w = p && p.win; s += '<i class="' + (w ? 'is-' + w : k === st.manche ? 'is-now' : '') + '"></i>'; }
        return '<span class="cb-pips" aria-hidden="true">' + s + '</span>';
      }
      /** Arène du Duel : les deux cartes face à face, récit du tour, actions. shown : PV affichés avant l’impact. */
      function arena(msg, acts, shown) {
        var me = st.mine[st.manche], foe = st.foes[st.manche];
        var over = me.hp <= 0 || foe.hp <= 0;
        var keep = !!box.querySelector('.cb-arena');
        show('<div class="cb-arena' + (swapIn ? ' is-swap-in' : '') + (enterIn ? ' is-enter' : '') + '">' +
          '<div class="cb-top"><p class="cb-round" aria-label="Manche ' + (st.manche + 1) + ' sur ' + MANCHES + ', ' + st.wins.me + ' – ' + st.wins.foe + '">' + pips() + '<span>Manche <b>' + (st.manche + 1) + '</b> sur ' + MANCHES + '</span></p></div>' +
          stageHTML(me, foe, acts, shown, (msg || '<p>Choisissez votre action. L’adversaire choisit en même temps que vous. La manche dure jusqu’au KO.</p>') + threatHTML(me, foe), null, (st.turns || {})[st.manche]) +
          // Manche finie : pas de bouton, une barre d’or se remplit puis les cartes s’élèvent et l’écran suivant arrive (un toucher l’avance)
          (over ? '<div class="cb-next" data-next role="button" tabindex="0"><i class="cb-next-bar"></i><small>' + (matchOver() ? 'Résultat du duel' : 'Manche ' + (st.manche + 2)) + '</small></div>'
            : '<div class="cb-actions">' + ['A', 'D', 'C'].map(function (k) {
              var hint = actHints(me)[k];
              return '<button class="cb-act is-' + k + '" data-act="' + k + '"' + ((k === 'D' && !canDefend(me)) || (k === 'C' && !canCharge(me)) ? ' disabled data-worn' : '') + '>' + actArt(k) + '<b>' + ACTIONS[k].label + '</b><small>' + hint + '</small></button>';
            }).join('') + '</div>') +
          '<details class="cb-rules"><summary>Règles</summary><ul>' +
            '<li><b>Attaquer</b> inflige des dégâts, multipliés par la charge accumulée.</li>' +
            '<li><b>Défendre</b> bloque toute attaque, même chargée, et renvoie la <b>DÉF</b> de votre carte en dégâts. Jamais deux fois de suite.</li>' +
            '<li><b>Charger</b> rend votre prochaine attaque plus forte : ×2, puis ×3 au maximum. Aucun dégât immédiat ; subir une attaque n’annule pas la charge.</li>' +
            '<li>La charge reste prête si vous défendez. Elle est consommée dès votre prochaine attaque, même si celle-ci est bloquée.</li>' +
            '<li>Maintenez le doigt (ou le clic) sur une carte pour lire son histoire.</li>' +
            '<li>Chaque manche se joue jusqu’au KO. Si les deux combattants tombent en même temps, la plus haute ATQ frappe la première et reste debout avec 1' + NB + 'PV. ' + WIN_MANCHES + ' manches gagnées remportent le duel.</li></ul></details>' +
        '</div>', keep);
      }
      function matchOver() { return st.wins.me >= WIN_MANCHES || st.wins.foe >= WIN_MANCHES || st.manche + 1 >= MANCHES; }
      function play(a) {
        if (!st || mode !== 'duel' || busy || !ACTIONS[a]) return;
        if ((a === 'D' && !canDefend(st.mine[st.manche])) || (a === 'C' && !canCharge(st.mine[st.manche]))) return;
        var me = st.mine[st.manche], foe = st.foes[st.manche];
        if (me.hp <= 0 || foe.hp <= 0) return;
        if (st.pvp) { pvpMove(a); return; }
        turn(a, C.duel.choose(st));
      }
      /** Duel entre amis : le coup part au serveur ; l’arène attend celui de l’adversaire (révélés ensemble). */
      function pvpMove(a) {
        var g = st.pvp; if (g.wait) return;
        g.wait = a;
        box.querySelectorAll('.cb-act').forEach(function (el) { el.disabled = true; el.classList.toggle('is-chosen', el.getAttribute('data-act') === a); });
        var log = box.querySelector('.cb-log');
        if (log) log.innerHTML = '<p class="cb-out">' + ACTIONS[a].label + '</p><p class="cb-wait"><i></i>En attente de ' + U.esc(currentRival) + '…</p>';
        var n = g.n, cur = st;
        NET.call('salle/' + g.id + '/coup', { token: g.token, n: n, act: a }).catch(function () { /* l’interrogation réessaie */ });
        poll(g.id, function (room) {
          if (st !== cur) return false;
          if (room.left) { pvpLeft(room.left); return false; }
          var pair = room.moves[String(n)];
          if (!pair) { if (!(room.played[String(n)] || [])[g.p]) NET.call('salle/' + g.id + '/coup', { token: g.token, n: n, act: a }).catch(function () {}); return; }
          g.wait = null; g.n++;
          turn(a, pair[1 - g.p]);
          return false;
        }, 450);
      }
      function turn(a, b) {
        var me = st.mine[st.manche], foe = st.foes[st.manche];
        var hp0 = { me: me.hp, foe: foe.hp };   // PV affichés jusqu’au choc
        st.hist[a]++; st.last = a;
        var xa = mult(me), xb = mult(foe);
        // Entre amis : les deux appareils calculent le tour dans le même ordre (l’hôte d’abord) avec le même tirage
        var r, g = st.pvp;
        if (g) {
          C.duel.seed(g.seed + ':' + (g.n - 1));
          if (g.p === 0) r = C.duel.resolve(me, foe, a, b);
          else { var q = C.duel.resolve(foe, me, b, a); r = { me: q.foe, foe: q.me, lines: q.lines }; }
        } else r = C.duel.resolve(me, foe, a, b);
        me.hp -= r.me; foe.hp -= r.foe;
        // Coups simultanés qui mettraient les deux KO : la plus haute ATQ frappe la première et tient debout à 1 PV.
        if (me.hp <= 0 && foe.hp <= 0) {
          var em = me.pow, ef = foe.pow;
          var coin = g ? (C.duel.rand() < 0.5) === (g.p === 0) : Math.random() < 0.5;
          var first = em !== ef ? (em > ef ? me : foe) : coin ? me : foe;
          first.hp = 1;
          r.lines.push(first.name + ' frappe le premier (ATQ) et tient debout');
        }
        if (g) C.duel.seed(null);
        st.score.me += r.foe; st.score.foe += r.me;
        var per = st.per[st.manche] || (st.per[st.manche] = { me: 0, foe: 0, win: null });
        per.me += r.foe; per.foe += r.me;
        var ko = '';
        if (foe.hp <= 0 && me.hp > 0) { st.wins.me++; per.win = 'me'; ko = '<p class="cb-ko">' + U.esc(foe.name) + ' est KO' + NB + '! Manche gagnée.</p>'; }
        else if (me.hp <= 0 && foe.hp > 0) { st.wins.foe++; per.win = 'foe'; ko = '<p class="cb-ko is-bad">' + U.esc(me.name) + ' est KO… Manche perdue.</p>'; }
        else if (me.hp <= 0 && foe.hp <= 0) { per.win = 'draw'; ko = '<p class="cb-ko is-bad">Double KO' + NB + ': manche nulle.</p>'; }
        st.tour++;
        var turns = st.turns || (st.turns = {});
        (turns[st.manche] = turns[st.manche] || []).push({ n: st.tour, a: a, b: b, me: r.me, foe: r.foe });
        var oc = outcome(a, b, xa, r);
        var head = '<p class="cb-out' + (oc[1] ? ' is-' + oc[1] : '') + '">' + oc[0] + '</p>' + turnLine(turns[st.manche][turns[st.manche].length - 1]);
        var esp = r.lines.filter(function (l) { return / \(ATQ\) /.test(l); });   // double KO départagé par l’ATQ
        arena(head + esp.map(function (l) { return '<p>' + U.esc(l) + '</p>'; }).join('') + ko, { a: a, b: b }, hp0);
        // Le tour se joue sur les deux cartes : elles s’élancent l’une vers l’autre avec épée, bouclier ou rose des vents
        // (choc à 0,76 s, fin à 1,9 s). Les PV baissent au choc. Un toucher sur l’arène passe l’animation.
        busy = true;
        box.querySelectorAll('.cb-act, [data-next]').forEach(function (el) { el.disabled = true; });
        duelSounds(a, b, xa, xb, r, me, foe);
        skipTurn = playTurn(box, { a: a, b: b, xa: xa, xb: xb, r: r, foeCharge: foe.charge }, {
          impact: function () {
            setHp(box.querySelector('.cb-fighter[data-side="me"]'), me);
            setHp(box.querySelector('.cb-fighter[data-side="foe"]'), foe);
            try { if (r.me && navigator.vibrate) navigator.vibrate(30); } catch (e) { /* ignore */ }
          },
          done: function () {
            busy = false; skipTurn = null;
            [['me', me], ['foe', foe]].forEach(function (x) {
              var el = box.querySelector('.cb-fighter[data-side="' + x[0] + '"]');
              if (el && x[1].hp <= 0) el.classList.add('is-ko');
            });
            box.querySelectorAll('.cb-act, [data-next]').forEach(function (el) { if (!el.hasAttribute('data-worn')) el.disabled = false; });
            if (me.hp <= 0 || foe.hp <= 0) {
              var nb = box.querySelector('.cb-next'); if (nb) nb.classList.add('is-running');
              clearTimeout(actionTimer); actionTimer = setTimeout(leaveArena, 1500);   // le temps de lire « Manche gagnée »
            }
          }
        });
      }
      /** Transition de fin de manche : les deux cartes s’élèvent et s’effacent vers le haut, puis l’écran suivant
          (intro de la manche suivante, dont les cartes montent depuis le bas, ou écran de fin). */
      var swapIn = false, enterIn = false;
      /** Copie d’une carte de l’arène, posée exactement par-dessus (calque fixe sur body) : elle peut finir sa sortie
          pendant que l’arène suivante est déjà dessinée, sans trou ni saut. */
      function ghostCard(side) {
        var f = box.querySelector('.cb-fighter[data-side="' + side + '"]'), c = f && f.querySelector('.cb-card');
        if (!c) return;
        var r = c.getBoundingClientRect();
        var g = document.createElement('div');
        g.className = 'cb-ghost cb-fighter is-' + side + (f.classList.contains('is-ko') ? ' is-ko' : ' is-win');
        g.setAttribute('data-fx', ''); g.setAttribute('aria-hidden', 'true');
        g.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;--face:' + (side === 'me' ? 1 : -1);
        var cl = c.cloneNode(true); cl.removeAttribute('style');
        g.appendChild(cl); document.body.appendChild(g);
        setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 1500);
      }
      function leaveArena() {
        var ar = box.querySelector('.cb-arena');
        if (!st || busy || !ar || ar.classList.contains('is-swap-out')) return;
        clearTimeout(actionTimer);
        // Les cartes de la manche finie deviennent des copies qui se retournent sur leur dos et glissent hors de l’écran
        ghostCard('me'); ghostCard('foe');
        ar.classList.add('is-swap-out');   // le reste de l’arène s’efface
        try { if (A.sfx && !A.sfx.muted) { A.sfx.snap(0.12, 0.9); A.sfx.whoosh(0.5); } } catch (e) { /* ignore */ }
        actionTimer = setTimeout(next, 280);
      }
      /** Vol d’une carte (FLIP) : elle part de l’endroit où on la voyait sur l’écran précédent et rejoint sa place dans
          l’arène en arc, un peu agrandie au sommet. */
      function flyFrom(el, from, delay, dur) {
        if (!el || !from || !from.width || !el.animate) return;
        var to = el.getBoundingClientRect(); if (!to.width) return;
        var dx = (from.left + from.width / 2) - (to.left + to.width / 2), dy = (from.top + from.height / 2) - (to.top + to.height / 2), k = from.width / to.width;
        el.animate([
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')', easing: 'cubic-bezier(.4,0,.3,1)' },
          { transform: 'translate(' + (dx * 0.3).toFixed(1) + 'px,' + (dy * 0.3 - 26).toFixed(1) + 'px) scale(' + (1.06 + (k - 1) * 0.3).toFixed(3) + ') rotate(' + (dx > 0 ? -3 : 3) + 'deg)', offset: 0.6, easing: 'cubic-bezier(.3,1.3,.5,1)' },
          { transform: 'none' }
        ], { duration: dur, delay: delay, fill: 'backwards' });
      }
      /** Commencer (Duel) : le reste de l’écran s’efface, les deux cartes de la manche 1 quittent le programme et volent
          à leur place dans l’arène ; le « vs » claque quand elles se posent, puis l’arène apparaît. */
      function enterArena() {
        var col = box.querySelector('.cb-pg-col');
        var from = {
          me: col && col.querySelector('.cb-pg-card.is-me .cb-pg-flip'),
          foe: col && col.querySelector('.cb-pg-card.is-foe .cb-pg-flip')
        };
        from.me = from.me && from.me.getBoundingClientRect(); from.foe = from.foe && from.foe.getBoundingClientRect();
        enterIn = true;
        arena('<p class="cb-out">Manche 1</p><p class="cb-reveal">' + U.esc(st.mine[0].name) + ' contre ' + U.esc(st.foes[0].name) + '. Jusqu’au KO' + NB + '!</p>' + '<p class="cb-hint">Maintenez une carte pour lire son histoire.</p>');
        enterIn = false;
        flyFrom(box.querySelector('.cb-fighter[data-side="me"] .cb-card'), from.me, 0, 820);
        flyFrom(box.querySelector('.cb-fighter[data-side="foe"] .cb-card'), from.foe, 70, 820);
        try { if (A.sfx && !A.sfx.muted) { A.sfx.whoosh(0.85); if (A.sfx.duel) A.sfx.duel.versus(0.62); } } catch (e) { /* ignore */ }
        busy = true; box.querySelectorAll('.cb-act').forEach(function (el) { el.disabled = true; });
        clearTimeout(actionTimer);
        actionTimer = setTimeout(function () { busy = false; box.querySelectorAll('.cb-act').forEach(function (el) { if (!el.hasAttribute('data-worn')) el.disabled = false; }); }, 1300);
      }
      function next() {
        if (!st || mode !== 'duel' || busy) return;
        if (st.mine[st.manche].hp > 0 && st.foes[st.manche].hp > 0) return;
        clearTimeout(actionTimer); busy = false;
        if (!matchOver()) {
          st.manche++; st.tour = 0; st.last = null;
          // Les nouvelles cartes entrent face cachée de chaque côté, se posent et se retournent ; « Manche N » au centre
          swapIn = true;
          arena('<p class="cb-out">Manche ' + (st.manche + 1) + '</p><p class="cb-reveal">' + U.esc(st.mine[st.manche].name) + ' contre ' + U.esc(st.foes[st.manche].name) + '. Jusqu’au KO' + NB + '!</p>');
          swapIn = false;
          busy = true; box.querySelectorAll('.cb-act').forEach(function (el) { el.disabled = true; });
          try { if (A.sfx && !A.sfx.muted) { A.sfx.deal(0.3); A.sfx.deal(0.38, 0.8); A.sfx.snap(0.98, 0.9); A.sfx.snap(1.06, 0.9); } } catch (e) { /* ignore */ }
          clearTimeout(actionTimer);
          actionTimer = setTimeout(function () { busy = false; box.querySelectorAll('.cb-act').forEach(function (el) { if (!el.hasAttribute('data-worn')) el.disabled = false; }); }, 1350);
          return;
        }
        finish();
      }
      function finish() {
        // Manches gagnées d’abord ; en cas d’égalité (double KO), les dégâts infligés départagent.
        var w = st.wins, s = st.score;
        var res = w.me !== w.foe ? (w.me > w.foe ? 'win' : 'loss') : s.me > s.foe ? 'win' : s.me < s.foe ? 'loss' : 'draw';
        var gain = S.recordCombat(res, st.score.me, currentRival);
        endSound(res);
        var rows = st.per.map(function (p, k) {
          var tag = p.win === 'me' ? 'KO pour vous' : p.win === 'foe' ? (st.pvp ? 'KO pour ' + U.esc(currentRival) : 'KO pour l’IA') : 'Double KO';
          return '<li><span>Manche ' + (k + 1) + '<small>' + U.esc(st.mine[k].name) + ' contre ' + U.esc(st.foes[k].name) + ' · ' + tag + '</small></span><b class="' + (p.win === 'me' ? 'pos' : p.win === 'foe' ? 'neg' : '') + '">' + p.me + ' – ' + p.foe + '</b></li>';
        }).join('');
        var tot = st.wins, pvpDone = !!st.pvp;
        if (pvpDone) { pvp = null; NET.done(st.pvp.id); }
        st = null;
        show('<div class="cb-end is-' + res + '">' + endHero(res) + '<p class="eyebrow">Duel tactique contre ' + U.esc(currentRival) + (pvpDone ? ' · entre amis' : '') + '</p>' +
          '<p class="cb-final"><b>' + tot.me + '</b><em>–</em><b>' + tot.foe + '</b></p>' +
          '<p class="muted small">Manches gagnées · dégâts par manche ci-dessous</p>' +
          '<ul class="cb-sum">' + rows + '</ul>' +
          (gain ? '<p class="cb-gain">' + I('coin', 'coin') + '+' + gain + ' Éclats</p>' : '') +
          (pvpDone
            ? '<div class="cb-end-actions"><button class="btn btn-gold" data-pvp-new>' + I('swords') + 'Nouveau défi</button><button class="btn btn-ghost" data-hub>Arène</button></div></div>'
            : '<div class="cb-end-actions"><button class="btn btn-gold" data-again>' + I('swords') + 'Nouvel adversaire</button>' +
            '<button class="btn btn-ghost" data-pick>Changer d’équipe</button><button class="btn btn-ghost" data-hub>Arène</button></div></div>'));
      }

      /* Quiz des légendes · joute du savoir : les deux cartes face à face, une question éclair à la fois (portrait flouté,
         titre, univers, savoir des fiches). Les deux camps répondent en même temps ; le premier qui répond juste fait frapper
         sa carte (ATQ × 1,3). Éclair (moins de 3 s) ×1,5 ; série (3e coup d’affilée et plus) ×1,5 ; un 50/50 par manche.
         Chaque manche se joue jusqu’au KO, 2 manches gagnées l’emportent. Un toucher sur l’arène passe l’animation. */
      var QZ_ECLAIR = 3000, QZ_POW = 1.3, qzT = [];
      function gameHead(title, sub) {
        return '<button class="back link-btn" data-hub>← Arène</button><p class="eyebrow">' + MODES[mode].name + ' · Contre ' + U.esc(currentRival) + ' (IA)</p>' +
          '<h2 class="h2">' + title + '</h2><p class="muted small">' + sub + '</p>';
      }
      function qzClear() { qzT.forEach(clearTimeout); qzT = []; }
      function qzLater(fn, ms) { qzT.push(setTimeout(function () { if (box.isConnected && st && st.mode === 'quiz') fn(); }, ms)); }
      function qzSec(ms) { return (ms / 1000).toFixed(1).replace('.', ',') + NB + 's'; }
      function qzPips() {
        var s = '';
        for (var k = 0; k < MANCHES; k++) { var p = st.per[k], w = p && p.win; s += '<i class="' + (w ? 'is-' + w : k === st.manche ? 'is-now' : '') + '"></i>'; }
        return '<span class="cb-pips" aria-hidden="true">' + s + '</span>';
      }
      function qzSide(side) { return box.querySelector('.qz-stage .cb-fighter[data-side="' + side + '"]'); }
      /** Série en cours sous chaque carte : à partir de 2 coups d’affilée, le prochain vaut ×1,5 */
      function qzStreak() {
        ['me', 'foe'].forEach(function (side) {
          var el = box.querySelector('[data-qz-streak="' + side + '"]'), n = st.streak[side];
          if (el) { el.textContent = n >= 2 ? 'Série ' + n + ' · prochain coup ×1,5' : ''; el.classList.toggle('is-on', n >= 2); }
        });
      }
      function quizArena() {
        var me = st.fm[st.manche], foe = st.ff[st.manche];
        show('<div class="cb-quiz qz">' +
          '<div class="cb-top"><p class="cb-round" aria-label="Manche ' + (st.manche + 1) + ' sur ' + MANCHES + '">' + qzPips() + '<span>Manche <b>' + (st.manche + 1) + '</b> sur ' + MANCHES + '</span></p></div>' +
          '<div class="qz-stage">' + fighterHTML(me, 'me') + '<div class="cb-vs" aria-hidden="true"><i></i><span>vs</span><i></i></div>' + fighterHTML(foe, 'foe') + '</div>' +
          '<section class="qz-q" data-qz aria-live="polite"></section></div>');
        ['me', 'foe'].forEach(function (side) {
          var info = qzSide(side) && qzSide(side).querySelector('.cb-info');
          if (info) info.insertAdjacentHTML('beforeend', (side === 'foe' ? '<span class="qz-buzz" data-qz-buzz>A répondu</span>' : '') + '<span class="qz-streak" data-qz-streak="' + side + '"></span>');
        });
        qzStreak();
      }
      function quizAsk() {
        if (!st || st.mode !== 'quiz') return;
        qzClear();
        var me = st.fm[st.manche], foe = st.ff[st.manche], eds = [me.ed, foe.ed].concat(st.mine, st.foes);
        var q = A.quiz.next(eds, st.used);
        if (!q) { st.used = { kinds: st.used.kinds }; q = A.quiz.next(eds, st.used); }
        if (!q) { quizNextManche(); return; }
        var T = q.time * 1000, buzz = box.querySelector('[data-qz-buzz]');
        st.q = q; st.phase = 'ask';
        st.ai = { ok: Math.random() < q.ai, t: Math.round(T * (0.3 + Math.random() * 0.55)) };
        st.ai.choice = st.ai.ok ? q.answer : pick(q.options.filter(function (v) { return v !== q.answer; }));
        if (buzz) buzz.classList.remove('is-on');
        var long = q.options.some(function (v) { return v.length > 26; });
        var panel = box.querySelector('[data-qz]'); if (!panel) return;
        panel.className = 'qz-q is-' + q.kind;
        panel.innerHTML = '<div class="qz-head"><span class="qz-kind">' + q.label + '</span><span class="qz-coll">' + U.esc((A.COLL[q.coll] || {}).name || '') + '</span></div>' +
          (q.art ? '<div class="qz-art" style="--t:' + q.time + 's">' + A.editionArt(A.ED[q.art], { ctx: 'card' }) + '</div>' : '') +
          '<h3 class="qz-text">' + U.esc(q.text) + '</h3>' +
          (q.clue ? '<blockquote class="qz-clue">' + U.esc(q.clue) + '</blockquote>' : '') +
          // Qui suis-je ? : les indices tombent un par un pendant le temps de réponse
          (q.clues ? '<ol class="qz-clues">' + q.clues.map(function (c, i) { return '<li style="animation-delay:' + (i * q.time / q.clues.length).toFixed(2) + 's">' + U.esc(c) + '</li>'; }).join('') + '</ol>' : '') +
          '<div class="qz-timer" style="--t:' + q.time + 's"><i></i></div>' +
          '<div class="qz-answers' + (long ? ' is-long' : '') + '">' + q.options.map(function (v, k) {
            return '<button class="qz-ans" data-qz-ans="' + k + '"><span class="qz-key">' + (k + 1) + '</span><span class="qz-v">' + U.esc(v) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="qz-foot"><button class="qz-joker" data-qz-joker' + (st.joker ? '' : ' disabled') + '>50/50<small>' + (st.joker ? '1 par manche' : 'utilisé') + '</small></button>' +
          '<p class="qz-rule">Le premier qui répond juste frappe · moins de 3' + NB + 's' + NB + ': Éclair ×1,5</p></div>';
        try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }   // l’arène et la question tiennent dans l’écran : on remonte en haut
        st.t0 = performance.now();
        qzLater(function () { var b = box.querySelector('[data-qz-buzz]'); if (b && st.phase === 'ask') { b.classList.add('is-on'); try { if (A.sfx && !A.sfx.muted) A.sfx.snap(0, 0.6); } catch (e) { /* ignore */ } } }, st.ai.t);
        qzLater(function () { quizResolve(null); }, T);
      }
      function quizJoker() {
        if (!st || st.phase !== 'ask' || !st.joker) return;
        st.joker = 0;
        var wrong = [];
        box.querySelectorAll('[data-qz-ans]').forEach(function (b) { if (st.q.options[+b.getAttribute('data-qz-ans')] !== st.q.answer) wrong.push(b); });
        wrong.sort(function () { return Math.random() - 0.5; }).slice(0, 2).forEach(function (b) { b.disabled = true; b.classList.add('is-out'); });
        var j = box.querySelector('[data-qz-joker]'); if (j) { j.disabled = true; j.querySelector('small').textContent = 'utilisé'; }
      }
      function quizResolve(k) {
        if (!st || st.mode !== 'quiz' || st.phase !== 'ask') return;
        qzClear(); st.phase = 'reveal';
        var q = st.q, T = q.time * 1000, tp = k == null ? Infinity : performance.now() - st.t0, ai = st.ai;
        var me = st.fm[st.manche], foe = st.ff[st.manche];
        var mine = k != null && q.options[k] === q.answer, aiOk = ai.ok && ai.t < T, aiIn = ai.t < T;
        var who = mine && (!aiOk || tp < ai.t) ? 'me' : aiOk ? 'foe' : null;
        var per = st.per[st.manche] || (st.per[st.manche] = { me: 0, foe: 0, win: null });
        if (mine) per.me++;
        if (aiOk) per.foe++;
        if (!mine) st.streak.me = 0;
        if (!aiOk) st.streak.foe = 0;
        if (who) { st.streak[who]++; st.streak[who === 'me' ? 'foe' : 'me'] = 0; }
        var t = who === 'me' ? tp : who === 'foe' ? ai.t : 0, fast = !!who && t < QZ_ECLAIR, serie = !!who && st.streak[who] >= 3;
        var att = who === 'me' ? me : foe, def = who === 'me' ? foe : me;
        var dmg = who ? Math.round(att.pow * QZ_POW * (fast ? 1.5 : 1) * (serie ? 1.5 : 1)) : 0;
        if (who) { def.hp = Math.max(0, def.hp - dmg); if (who === 'me') st.dealt += dmg; }
        // Réponses dévoilées : la bonne en or, la vôtre (fausse) en rouge, celle de l’adversaire marquée de son nom
        var panel = box.querySelector('[data-qz]'); if (!panel) return;
        panel.classList.add('is-reveal');
        var tm = panel.querySelector('.qz-timer'); if (tm) tm.classList.add('is-stopped');
        panel.querySelectorAll('[data-qz-ans]').forEach(function (b) {
          var i = +b.getAttribute('data-qz-ans'), v = q.options[i];
          b.disabled = true;
          if (v === q.answer) b.classList.add('is-correct'); else if (i === k) b.classList.add('is-wrong');
          var tags = '';
          if (i === k) tags += '<em class="qz-tag is-me">Vous · ' + qzSec(tp) + '</em>';
          if (aiIn && v === ai.choice) tags += '<em class="qz-tag">' + U.esc(currentRival) + ' · ' + qzSec(ai.t) + '</em>';
          if (tags) b.insertAdjacentHTML('beforeend', '<span class="qz-tags">' + tags + '</span>');
        });
        var art = panel.querySelector('.qz-art'); if (art) art.classList.add('is-shown');
        var bonus = (fast ? ' · Éclair ×1,5' : '') + (serie ? ' · Série ×1,5' : '');
        var line = who === 'me' ? ['Juste en ' + qzSec(tp) + bonus, U.esc(me.name) + ' frappe' + NB + ': −' + dmg, 'good']
          : who === 'foe' ? [(mine ? U.esc(currentRival) + ' a été plus rapide (' + qzSec(ai.t) + ')' : (k == null ? 'Temps écoulé' : 'Raté') + ' · ' + U.esc(currentRival) + ' trouve en ' + qzSec(ai.t)) + bonus, U.esc(foe.name) + ' frappe' + NB + ': −' + dmg, 'bad']
          : [(k == null ? 'Temps écoulé' : 'Raté') + ' · personne ne trouve', 'Aucun coup ce tour', ''];
        panel.querySelector('.qz-foot').outerHTML = '<div class="qz-foot is-result"><p class="qz-out' + (line[2] ? ' is-' + line[2] : '') + '"><b>' + line[0] + '</b><span>' + line[1] + '</span></p>' +
          (q.explanation ? '<details class="qz-more" data-qz-more><summary>Le saviez-vous' + NB + '?</summary><p>' + U.esc(q.explanation) + '</p></details>' : '') +
          '<button class="qz-next" data-qz-next><i></i><span>Question suivante</span></button></div>';
        sfx(mine ? 'unlock' : 'snap');
        qzStreak();
        function after() {
          skipTurn = null;
          if (who && def.hp <= 0) {
            per.win = who; st.wins[who]++;
            var f = qzSide(who === 'me' ? 'foe' : 'me'); if (f) f.classList.add('is-ko');
            var nx = panel.querySelector('[data-qz-next]');
            if (nx) { nx.classList.add('is-ko', 'is-running'); nx.querySelector('span').textContent = who === 'me' ? foe.name + ' est KO' + NB + '! Manche gagnée' : me.name + ' est KO… Manche perdue'; }
            st.phase = 'ko'; qzLater(quizNextManche, 2400);
            return;
          }
          st.phase = 'next';
          var nb = panel.querySelector('[data-qz-next]'); if (nb) nb.classList.add('is-running');
          qzLater(quizAsk, 3200);
        }
        if (who) {
          var r = { me: who === 'foe' ? dmg : 0, foe: who === 'me' ? dmg : 0 };
          duelSounds(who === 'me' ? 'A' : '-', who === 'foe' ? 'A' : '-', 1, 1, r, me, foe);
          skipTurn = playTurn(box.querySelector('.qz-stage'), { a: who === 'me' ? 'A' : '-', b: who === 'foe' ? 'A' : '-', xa: 1, xb: 1, r: r, foeCharge: 0 }, {
            impact: function () { setHp(qzSide('me'), me); setHp(qzSide('foe'), foe); },
            done: after
          });
        } else qzLater(after, 500);
      }
      function quizNextManche() {
        if (!st || st.mode !== 'quiz') return;
        qzClear();
        if (st.wins.me >= WIN_MANCHES || st.wins.foe >= WIN_MANCHES || st.manche + 1 >= MANCHES) { quizFinish(); return; }
        st.manche++; st.joker = 1; st.streak = { me: 0, foe: 0 }; st.phase = 'intro';
        quizArena();
        playIntro(st.fm[st.manche].ed, st.ff[st.manche].ed, 'Manche ' + (st.manche + 1) + ' · Le premier qui répond juste frappe', quizAsk);
      }
      function quizFinish() {
        var res = st.wins.me > st.wins.foe ? 'win' : st.wins.me < st.wins.foe ? 'loss' : 'draw';
        var rows = st.per.map(function (p, k) {
          return '<li><span>Manche ' + (k + 1) + '<small>' + U.esc(st.fm[k].name) + ' contre ' + U.esc(st.ff[k].name) + ' · ' + (p.win === 'me' ? 'KO pour vous' : p.win === 'foe' ? 'KO pour l’IA' : 'sans KO') + '</small></span><b>' + p.me + ' – ' + p.foe + '</b></li>';
        }).join('');
        finishGame(res, st.wins, 'Manches gagnées · bonnes réponses par manche ci-dessous', rows, st.dealt);
      }
      // Clavier : 1 à 4 pour répondre, Espace ou Entrée pour la question suivante
      document.addEventListener('keydown', function (e) {
        if (!box.isConnected || !st || st.mode !== 'quiz' || e.altKey || e.ctrlKey || e.metaKey) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')) return;
        if (st.phase === 'ask' && /^[1-4]$/.test(e.key)) { var b = box.querySelector('[data-qz-ans="' + (+e.key - 1) + '"]'); if (b && !b.disabled) { e.preventDefault(); quizResolve(+e.key - 1); } }
        else if ((st.phase === 'next' || st.phase === 'read') && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); quizAsk(); }
      });

      /* Trois terrains : fronts persistants, un ordre simultané à chaque déploiement. */
      function reserveCard(edId, selectable, selected) {
        var ed = A.ED[edId], ch = A.CHAR[ed.charId];
        return '<button type="button" class="ct-card r-' + ed.rarity + (selected ? ' is-selected' : '') + '"' + (selectable ? ' data-conquest-card="' + edId + '" aria-pressed="' + selected + '"' : ' disabled') + '>' +
          '<span class="ct-art">' + A.editionArt(ed, { w: 240, h: 160, ctx: 'mini' }) + '</span><span class="ct-card-name">' + U.esc(ch.name) + '</span>' +
          '<span class="ct-card-stats">' + TERRAINS.map(function (t, k) { return '<span' + (st.selectedLane === k ? ' class="is-active"' : '') + '>' + t.label + ' <b>' + ch[t.stat] + '</b></span>'; }).join('') + '</span></button>';
      }
      function terrainScreen(keepScroll) {
        if (!st || st.mode !== 'terrains' || !st.game) return;
        var game = st.game, choosing = game.phase === 'orders', result = G.score(game.board);
        var intel = box.querySelector('[data-enemy-reserve]'), intelOpen = intel && intel.open;
        var oldHand = box.querySelector('[data-conquest-hand]'), handScroll = oldHand ? oldHand.scrollLeft : 0;
        var turn = choosing ? game.turn + 1 : game.turn;
        var html = gameHead('Déploiement ' + turn + ' sur ' + game.limit, 'Chaque carte renforce un front. Contrôlez le plus de terrains au dernier tour.') +
          '<div class="ct-match-status"><span class="ct-control-score">Terrains <b><small>Vous</small>' + result.score.me + ' <span>–</span> ' + result.score.foe + '<small>IA</small></b></span><span class="ct-order-lock">' + I(choosing ? 'lock' : 'check') + (choosing ? 'Ordre adverse verrouillé' : 'Ordres révélés') + '</span></div>' +
          '<div class="ct-board">' + TERRAINS.map(function (t, lane) {
            var row = result.rows[lane], selected = st.selectedLane === lane;
            return '<section class="ct-lane is-' + row.result + (selected ? ' is-selected' : '') + '" data-conquest-field="' + lane + '"><button type="button" class="ct-target" data-conquest-lane="' + lane + '" aria-pressed="' + selected + '"' + (choosing ? '' : ' disabled') + '>' +
              '<span class="ct-lane-name">' + I(t.icon) + t.name + '</span><span class="ct-lane-stat">' + t.label + (selected ? ' · Cible' : '') + '</span><span class="ct-forces"><b aria-label="Vos forces">' + row.me + '</b><span>–</span><b aria-label="Forces adverses">' + row.foe + '</b></span><span class="ct-leader">' + (row.result === 'win' ? 'Vous menez' : row.result === 'loss' ? 'L’IA mène' : 'À égalité') + '</span></button>' +
              ['me', 'foe'].map(function (side) {
                return '<div class="ct-side' + (game.board[side][lane].length ? '' : ' is-empty') + '"><p>' + (side === 'me' ? 'Vous' : 'Adversaire') + '</p><ul>' + (game.board[side][lane].length ? game.board[side][lane].map(function (unit) {
                  var ch = A.CHAR[A.ED[unit.ed].charId], value = G.value(unit.ed, lane, unit.banner);
                  return '<li title="' + U.esc(ch.name + ' · ' + value + (unit.banner ? ' avec bannière' : '')) + '"><span>' + U.esc(ch.name) + '</span><b>' + value + (unit.banner ? ' ✦' : '') + '</b></li>';
                }).join('') : '<li class="ct-no-troops" aria-label="Aucun renfort">—</li>') + '</ul></div>';
              }).join('') + '</section>';
          }).join('') + '</div>';
        if (!choosing) {
          html += '<div class="ct-report cb-reveal-pane" role="status">' + ['me', 'foe'].map(function (side) {
            var order = game.last[side];
            return '<p><b>' + (side === 'me' ? 'Vous' : U.esc(currentRival)) + '</b> · ' + U.esc(A.CHAR[A.ED[order.ed].charId].name) + ' sur ' + TERRAINS[order.lane].name + ' <strong>+' + order.value + '</strong>' + (order.banner ? '<span class="ct-banner-note">Bannière utilisée</span>' : '') + '</p>';
          }).join('') + '</div><div class="ct-next"><button class="btn btn-gold" data-conquest-next>' + (game.turn < game.limit ? 'Déploiement suivant' : 'Voir le résultat') + I('arrow') + '</button></div>';
        }
        if (game.hands.me.length) {
          html += '<div class="ct-reserve-title"><h3>Votre réserve</h3><span>' + game.hands.me.length + (game.hands.me.length > 1 ? ' cartes' : ' carte') + (choosing ? ' · Choisissez votre renfort' : '') + '</span></div><div class="ct-hand" data-conquest-hand>' + game.hands.me.map(function (ed) { return reserveCard(ed, choosing, st.selectedEd === ed); }).join('') + '</div>';
        }
        if (choosing) {
          var ready = st.selectedEd && st.selectedLane !== null;
          var preview = ready ? TERRAINS[st.selectedLane].name + ' · ' + result.rows[st.selectedLane].me + ' → ' + (result.rows[st.selectedLane].me + G.value(st.selectedEd, st.selectedLane, st.useBanner)) + ' avant la réponse adverse'
            : 'Choisissez une carte, puis son terrain.';
          html += '<div class="ct-order-bar"><button type="button" class="ct-banner' + (st.useBanner ? ' is-selected' : '') + '" data-conquest-banner aria-pressed="' + st.useBanner + '"' + (game.banners.me ? '' : ' disabled') + '>' + I('laurel') + '<span>Bannière +20<small>' + (game.banners.me ? 'Une seule utilisation' : 'Déjà utilisée') + '</small></span></button><p class="ct-preview" role="status">' + preview + '</p><button class="btn btn-gold" data-conquest-commit' + (ready ? '' : ' disabled') + '>Déployer ' + I('arrow') + '</button></div>';
        }
        html += '<details class="ct-intel" data-enemy-reserve' + (intelOpen ? ' open' : '') + '><summary>Réserve adverse · ' + game.hands.foe.length + (game.hands.foe.length > 1 ? ' cartes' : ' carte') + ' · Bannière ' + (game.banners.foe ? 'disponible' : 'utilisée') + '</summary><div class="ct-hand">' + game.hands.foe.map(function (ed) { return reserveCard(ed, false, false); }).join('') + '</div></details>' +
          '<details class="cb-rules"><summary>Règles de la conquête</summary><ul><li>Une carte est jouée une seule fois. Vous pouvez envoyer plusieurs renforts sur le même terrain.</li><li>Bataille additionne l’ATQ, Rempart la DÉF et Oracle l’ESP. La rareté n’ajoute aucun bonus.</li><li>La bannière ajoute +20 au renfort choisi. Chaque joueur n’en possède qu’une pour toute la partie.</li><li>Les réserves sont visibles. L’IA verrouille son ordre avant votre choix ; les deux ordres sont révélés ensemble.</li><li>Le plus de terrains contrôlés à la fin l’emporte. Un terrain à égalité ne donne aucun point.</li></ul></details>';
        show('<div class="cb-game ct-game">' + html + '</div>', keepScroll);
        var hand = box.querySelector('[data-conquest-hand]'); if (hand) hand.scrollLeft = handScroll;
      }
      function terrainChoose(kind, value) {
        if (!st || st.mode !== 'terrains' || st.game.phase !== 'orders') return;
        var selector;
        if (kind === 'card' && st.game.hands.me.indexOf(value) !== -1) { st.selectedEd = value; selector = '[data-conquest-card="' + value + '"]'; }
        else if (kind === 'lane' && Number.isInteger(value) && value >= 0 && value < 3) { st.selectedLane = value; selector = '[data-conquest-lane="' + value + '"]'; }
        else if (kind === 'banner' && st.game.banners.me) { st.useBanner = !st.useBanner; selector = '[data-conquest-banner]'; }
        else return;
        terrainScreen(true); box.querySelector(selector).focus({ preventScroll: true });
      }
      function terrainCommit() {
        if (!st || st.mode !== 'terrains') return;
        var next = G.resolve(st.game, { ed: st.selectedEd, lane: st.selectedLane, banner: st.useBanner });
        if (!next) return;
        st.game = next; st.selectedEd = null; st.selectedLane = null; st.useBanner = false;
        sfx('reveal'); terrainScreen();
      }
      function terrainNext() {
        if (!st || st.mode !== 'terrains' || st.game.phase !== 'reveal') return;
        if (st.game.turn < st.game.limit) { st.game = G.next(st.game); terrainScreen(); return; }
        var r = G.score(st.game.board);
        var rows = r.rows.map(function (row, k) {
          var count = st.game.board.me[k].length;
          return '<li><span>' + TERRAINS[k].name + '<small>' + count + ' renfort' + (count > 1 ? 's' : '') + ' contre ' + st.game.board.foe[k].length + ' · ' + TERRAINS[k].label + '</small></span><b class="' + (row.result === 'win' ? 'pos' : row.result === 'loss' ? 'neg' : '') + '">' + row.me + ' – ' + row.foe + '</b></li>';
        }).join('');
        finishGame(r.result, r.score, 'Terrains gagnés', rows, 0);
      }
      function finishGame(res, score, label, rows, dealt) {
        if (!st || st.finished) return;
        st.finished = true;
        var gain = S.recordCombat(res, dealt, currentRival, mode);
        endSound(res);
        st = null;
        show('<div class="cb-end is-' + res + '">' + endHero(res) + '<p class="eyebrow">' + MODES[mode].name + ' contre ' + U.esc(currentRival) + '</p><p class="muted small">' + label + '</p><p class="cb-final"><b>' + score.me + '</b><em>–</em><b>' + score.foe + '</b></p><ul class="cb-sum">' + rows + '</ul>' +
          (gain ? '<p class="cb-gain">' + I('coin') + '+' + gain + ' Éclats</p>' : '') + '<div class="cb-end-actions"><button class="btn btn-gold" data-again>' + I(MODES[mode].icon) + 'Nouvel adversaire</button><button class="btn btn-ghost" data-pick>Changer d’équipe</button><button class="btn btn-ghost" data-hub>Arène</button></div></div>');
      }

      // Défi reçu par lien (#/combat?salle=ABCD)
      var salle = ctx && ctx.query.salle;
      if (salle && A.relay && ctx.query.r) A.relay.prefer(ctx.query.r);
      if (salle) { try { history.replaceState(null, '', '#/combat'); } catch (er) { /* ignore */ } setTimeout(function () { pvpGuest(String(salle).toUpperCase()); }, 0); }
      // « Défier un ami » : actif quand le site est servi par tools/lan/serve.py
      NET.ping().then(function (ok) {
        var f = ok && box.querySelector('.cb-friends'); if (!f) return;
        f.classList.add('is-on');
        f.innerHTML = '<div>' + I('user') + '</div><p><b>Défier un ami</b><span class="muted small">' + (ok.online ? 'Composez votre équipe, puis envoyez le lien à un ami, où qu’il soit. Duel tactique.' : 'Sur le même réseau' + NB + ': composez votre équipe, puis envoyez le lien. Duel tactique.') + '</span></p>' +
          '<button class="btn btn-gold btn-sm" data-pvp-new>' + I('swords') + 'Défier</button>';
      });
      // Mode choisi depuis l’accueil (#/combat?mode=duel) : on passe directement au choix de l’équipe
      var asked = ctx && ctx.query.mode;
      if (asked && MODES[asked]) {
        try { history.replaceState(null, '', '#/combat'); } catch (er) { /* ignore */ }
        setTimeout(function () { mode = asked; pickScreen(); }, 0);   // après la fin du montage (équipe, minuteurs)
      }
      /* Appui long sur une carte de l’arène : son histoire monte dans la carte (notice « cartel »), relâcher la referme */
      var hold = null, heldAt = 0;
      function release() {
        if (!hold) return;
        clearTimeout(hold.t);
        if (hold.on) { U.infoToggle(hold.face, hold.ed, false, 'cartel'); heldAt = Date.now(); }
        hold = null;
      }
      box.addEventListener('pointerdown', function (e) {
        var face = e.target.closest && e.target.closest('.cb-arena .cb-fighter .cb-card');
        if (!face || busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
        var side = face.closest('.cb-fighter').getAttribute('data-side'), f = st && st[side === 'me' ? 'mine' : 'foes'][st.manche];
        if (!f) return;
        release();
        hold = { face: face, ed: f.ed, x: e.clientX, y: e.clientY, on: false };
        hold.t = setTimeout(function () { if (!hold || busy) return; hold.on = true; U.infoToggle(face, f.ed, true, 'cartel'); try { if (A.haptic) A.haptic(8); } catch (er) { /* ignore */ } }, 380);
      });
      box.addEventListener('pointermove', function (e) { if (hold && !hold.on && Math.abs(e.clientX - hold.x) + Math.abs(e.clientY - hold.y) > 12) release(); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { box.addEventListener(n, release); });
      window.addEventListener('blur', release);
      box.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('.cb-arena .cb-card')) e.preventDefault(); });
      // le clic qui suit un appui long ne déclenche rien (ni passer l’animation, ni la manche suivante)
      box.addEventListener('click', function (e) { if (Date.now() - heldAt < 400) { e.stopPropagation(); e.preventDefault(); heldAt = 0; } }, true);
      box.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-mode]'))) { var chosen = t.getAttribute('data-mode'); if (MODES[chosen]) { mode = chosen; pickLimit = 30; pickScreen(); } return; }
        if (e.target.closest('[data-hub]')) { if (pvpToken()) { pvpQuit(); return; } pvp = null; resetMatch(); A.app.rerender(); return; }
        if (e.target.closest('[data-pvp-new]')) { pvp = { role: 'host' }; mode = 'duel'; pickLimit = 30; pickScreen(); return; }
        if (e.target.closest('[data-pvp-quit]')) { pvpQuit(); return; }
        if (e.target.closest('[data-pvp-pick]')) { pickLimit = 30; pickScreen(); return; }
        if (e.target.closest('[data-pvp-random]')) { pvpJoin(teamLike(pvp && pvp.host && pvp.host.team || [A.EDITIONS[0].id, A.EDITIONS[1].id, A.EDITIONS[2].id])); return; }
        if (e.target.closest('[data-share]')) {
          var sh = box.querySelector('[data-link]');
          if (sh && navigator.share) navigator.share({ title: 'ATLAS · Duel tactique', text: myName() + ' vous défie en Duel tactique sur ATLAS', url: sh.value }).catch(function () { /* annulé */ });
          return;
        }
        if (e.target.closest('[data-copy]')) {
          var inp = box.querySelector('[data-link]'), val = inp ? inp.value : '';
          (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(val) : Promise.reject()).then(function () { U.toast('Lien copié'); }, function () { if (inp) { inp.select(); try { document.execCommand('copy'); U.toast('Lien copié'); } catch (er) { /* sélectionné */ } } });
          return;
        }
        if (e.target.closest('[data-pick]')) { if (st && st.pvp) { pvpQuit(); return; } pickScreen(); return; }
        if (e.target.closest('[data-more]')) { pickLimit += 60; renderRoster(); return; }
        if ((t = e.target.closest('[data-unseat]'))) { var ui = team.indexOf(t.getAttribute('data-unseat')); if (ui !== -1) team.splice(ui, 1); var y0 = window.scrollY; pickScreen(); window.scrollTo(0, y0); return; }
        if (e.target.closest('[data-clear]')) { team = []; var y1 = window.scrollY; pickScreen(); window.scrollTo(0, y1); return; }
        if ((t = e.target.closest('[data-dd-toggle]'))) {
          var dd = t.closest('.cb-dd'), open = !dd.classList.contains('is-open');
          closeDropdowns(dd); dd.classList.toggle('is-open', open); t.classList.toggle('is-open', open); t.setAttribute('aria-expanded', String(open));
          if (open) { var on = dd.querySelector('.cb-dd-opt.is-on'); if (on) on.scrollIntoView({ block: 'nearest' }); }
          return;
        }
        if ((t = e.target.closest('[data-dd-opt]'))) {
          var d2 = t.closest('.cb-dd'), key = d2.getAttribute('data-dd');
          pf[key] = t.getAttribute('data-dd-opt'); pickLimit = 30;
          d2.querySelectorAll('.cb-dd-opt').forEach(function (o) { o.classList.toggle('is-on', o === t); o.setAttribute('aria-selected', String(o === t)); });
          d2.querySelector('[data-dd-label]').textContent = t.getAttribute('data-dd-text');
          closeDropdowns(); renderRoster(); return;
        }
        if (!e.target.closest('.cb-dd')) closeDropdowns();
        if ((t = e.target.closest('[data-pf-rar]'))) {
          pf.rar = t.getAttribute('data-pf-rar'); pickLimit = 30;
          box.querySelectorAll('[data-pf-rar]').forEach(function (c) { c.classList.toggle('is-active', c === t); });
          renderRoster(); return;
        }
        if (e.target.closest('[data-auto]')) {
          var candidates = roster();
          if (mode === 'terrains') candidates.sort(function (a, b) { var x = A.CHAR[A.ED[a.ed].charId], y = A.CHAR[A.ED[b.ed].charId]; return y.atk + y.def + y.esp - x.atk - x.def - x.esp; });
          team = candidates.slice(0, teamSize()).map(function (i) { return i.uid; }); justAdded = 'all'; var y3 = window.scrollY; pickScreen(); window.scrollTo(0, y3); return;
        }
        if ((t = e.target.closest('.cb-roster .card[data-select]'))) {
          var u = t.getAttribute('data-uid'), k = team.indexOf(u);
          if (k !== -1) team.splice(k, 1); else if (team.length < teamSize()) { team.push(u); justAdded = u; try { if (A.sfx && !A.sfx.muted) A.sfx.deal(0); } catch (er) { /* ignore */ } } else { U.toast('Équipe complète : retirez une carte d’abord'); return; }
          var y2 = window.scrollY; pickScreen(); window.scrollTo(0, y2);
          var selected = box.querySelector('.cb-roster [data-uid="' + u + '"]'); if (selected) selected.focus({ preventScroll: true }); return;
        }
        if (e.target.closest('[data-go]') || e.target.closest('[data-again]')) {
          if (validTeam(teamSize()).length !== teamSize() || teamSize() < 3) { pickScreen(); return; }
          if (pvp && e.target.closest('[data-go]')) { var eds = team.map(function (u) { return S.item(u).ed; }); if (pvp.role === 'guest') pvpJoin(eds); else pvpHost(); return; }
          start(); return;
        }
        if (e.target.closest('[data-begin]')) {
          if (!st) return;
          // Ses cartes, restées face cachée, se retournent une à une ; la partie démarre ensuite
          var prog = box.querySelector('.cb-pg');
          if (prog && !prog.classList.contains('is-reveal')) {
            prog.classList.add('is-reveal');
            box.querySelectorAll('[data-begin], [data-pick]').forEach(function (b) { b.disabled = true; });
            try { if (A.sfx && !A.sfx.muted) prog.querySelectorAll('.cb-pg-card.is-foe').forEach(function (_, k) { A.sfx.snap(k * 0.14, 0.9); }); } catch (er) { /* ignore */ }
            clearTimeout(actionTimer);
            actionTimer = setTimeout(function () { var b = box.querySelector('[data-begin]'); if (b) { b.disabled = false; b.click(); } }, 1000);
            return;
          }
          if (mode === 'duel') {
            var intro = box.querySelector('.cb-intro');
            if (intro && !intro.classList.contains('is-go')) {
              intro.classList.add('is-go');   // tout s’efface sauf les deux cartes de la manche 1
              box.querySelectorAll('[data-begin], [data-pick]').forEach(function (b) { b.disabled = true; });
              clearTimeout(actionTimer); actionTimer = setTimeout(enterArena, 380);
            }
            return;
          }
          if (mode === 'quiz') { quizArena(); playIntro(st.mine[0], st.foes[0], 'Manche 1 · Le premier qui répond juste frappe', quizAsk); return; }
          terrainScreen();
          // Intro VS : le premier combattant de chaque camp (Duel : celui de la manche 1)
          var m0 = mode === 'duel' ? st.mine[0].ed : st.mine[0], f0 = mode === 'duel' ? st.foes[0].ed : st.foes[0];
          playIntro(m0, f0, mode === 'duel' ? 'Manche 1 · Jusqu’au KO' : MODES[mode].name);
          return;
        }
        if ((t = e.target.closest('[data-qz-ans]'))) { quizResolve(Number(t.getAttribute('data-qz-ans'))); return; }
        if (e.target.closest('[data-qz-joker]')) { quizJoker(); return; }
        if (e.target.closest('[data-qz-more]')) { if (st && st.phase === 'next') { qzClear(); st.phase = 'read'; var nq = box.querySelector('[data-qz-next]'); if (nq) nq.classList.remove('is-running'); } return; }
        if (e.target.closest('[data-qz-next]')) { if (st && (st.phase === 'next' || st.phase === 'read')) quizAsk(); else if (st && st.phase === 'ko') quizNextManche(); return; }
        if (st && st.mode === 'quiz' && skipTurn && e.target.closest('.qz-stage')) { skipTurn(); return; }
        if ((t = e.target.closest('[data-conquest-card]'))) { terrainChoose('card', t.getAttribute('data-conquest-card')); return; }
        if ((t = e.target.closest('[data-conquest-lane]'))) { terrainChoose('lane', Number(t.getAttribute('data-conquest-lane'))); return; }
        if (e.target.closest('[data-conquest-banner]')) { terrainChoose('banner'); return; }
        if (e.target.closest('[data-conquest-commit]')) { terrainCommit(); return; }
        if (e.target.closest('[data-conquest-next]')) { terrainNext(); return; }
        if (busy && skipTurn && e.target.closest('.cb-fighter, .cb-vs, .cb-log')) { skipTurn(); return; }   // toucher : passe l’animation du tour
        if ((t = e.target.closest('[data-act]'))) { play(t.getAttribute('data-act')); return; }
        if (e.target.closest('[data-next]') || (st && mode === 'duel' && !busy && e.target.closest('.cb-arena .cb-fighter, .cb-arena .cb-log') && box.querySelector('.cb-next'))) { leaveArena(); return; }
      });
      // Filtres de l’équipe : recherche à la frappe, univers et tri au changement (seule la grille est redessinée)
      box.addEventListener('input', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-pvp-name')) { try { localStorage.setItem('atlas-pvp-name', e.target.value.trim()); } catch (er) { /* ignore */ } return; } var f = e.target.getAttribute && e.target.getAttribute('data-pf'); if (f === 'q') { pf.q = e.target.value; pickLimit = 30; renderRoster(); } });
      // Menus déroulants : fermés au clic ailleurs sur la page et avec Échap
      function outside(e) { if (!box.isConnected) { document.removeEventListener('click', outside, true); document.removeEventListener('keydown', esc); return; } if (!e.target.closest || !e.target.closest('.cb-dd')) closeDropdowns(); }
      function esc(e) { if (e.key === 'Escape') closeDropdowns(); }
      document.addEventListener('click', outside, true); document.addEventListener('keydown', esc);
      box.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.cb-roster .card[data-select]')) { e.preventDefault(); e.target.click(); }
      });
    }
  };

  /* ---------- Studio combat (outil de test, lien dans le pied de page) ----------
     Rejoue chaque animation et chaque écran du Duel sans lancer de partie : intro VS, les 9 face-à-face
     (attaque chargée en option), écrans de fin, aperçu de l’arène (coups, KO). Dégâts fictifs mais cohérents. */
  /** Studio : chaque jeu d’icônes monté dans les vrais boutons d’action, pour comparer et choisir */
  function iconsLab() {
    var cur = iconSet();
    return '<h2 class="h3">Icônes des actions · propositions</h2><p class="muted small">Le jeu choisi s’applique tout de suite aux boutons de l’arène.</p>' +
      '<div class="cb-icons">' + Object.keys(ICON_SETS).map(function (id) {
        var set = ICON_SETS[id];
        return '<div class="cb-icons-set' + (id === cur ? ' is-on' : '') + '"><div class="cb-icons-head"><p><b>' + set.name + '</b><span class="muted small">' + set.desc + '</span></p>' +
          '<button class="btn btn-sm ' + (id === cur ? 'btn-gold' : 'btn-ghost') + '" data-lab-icons="' + id + '">' + (id === cur ? 'Utilisé' : 'Utiliser') + '</button></div>' +
          '<div class="cb-actions">' + ['A', 'D', 'C'].map(function (k) { return '<div class="cb-act is-' + k + '">' + actArt(k, id) + '<b>' + ACTIONS[k].label + '</b><small>' + { A: '31 dégâts', D: 'Riposte 18', C: 'Attaque ×2' }[k] + '</small></div>'; }).join('') + '</div></div>';
      }).join('') + '</div>';
  }

  P.combatLab = {
    title: 'Studio combat',
    render: function () {
      var acts = ['A', 'D', 'C'];
      var grid = acts.map(function (a) {
        return acts.map(function (b) {
          return '<button class="cb-lab-fx" data-lab-fx="' + a + b + '"><span>' + I(ACTIONS[a].icon) + 'Vous · ' + ACTIONS[a].label + '</span><small>contre</small><span>' + I(ACTIONS[b].icon) + 'IA · ' + ACTIONS[b].label + '</span></button>';
        }).join('');
      }).join('');
      return '<section class="page-head"><div class="container"><p class="eyebrow">Projet (test)</p><h1 class="h1">Studio combat</h1>' +
        '<p class="lead">Chaque animation et chaque écran du Duel, à rejouer à volonté (avec le son), sans lancer de partie.</p></div></section>' +
        '<section class="section-tight"><div class="container cb-lab">' +
          '<div class="cb-lab-block" data-lab-icons-block>' + iconsLab() + '</div>' +
          '<div class="cb-lab-block"><h2 class="h3">Intro « VS »</h2><p class="muted small">Au début de chaque manche. Un toucher la passe.</p>' +
            '<div class="cb-lab-row"><button class="btn btn-gold" data-lab-intro="1">Manche 1</button><button class="btn btn-ghost" data-lab-intro="2">Manche 2 · 1 – 0</button><button class="btn btn-ghost" data-lab-intro="3">Manche 3 · 1 – 1</button></div></div>' +
          '<div class="cb-lab-block"><h2 class="h3">Arène · tours</h2><p class="muted small">Les 9 combinaisons d’un tour, jouées sur les deux cartes. Choc à 0,76 s, fin à 1,9 s. Un toucher sur l’arène passe l’animation.</p>' +
            '<div class="cb-lab-stage" data-lab-arena></div>' +
            '<label class="cb-lab-opt"><input type="checkbox" data-lab-heavy> Attaques chargées (×3) et charges déjà accumulées</label>' +
            '<div class="cb-lab-grid">' + grid + '</div>' +
            '<div class="cb-lab-row"><button class="btn btn-ghost" data-lab-ko>KO de l’adversaire</button><button class="btn btn-ghost" data-lab-reset>Réinitialiser</button></div></div>' +
          '<div class="cb-lab-block"><h2 class="h3">Fin de partie</h2>' +
            '<div class="cb-lab-row"><button class="btn btn-gold" data-lab-end="win">Victoire</button><button class="btn btn-ghost" data-lab-end="loss">Défaite</button><button class="btn btn-ghost" data-lab-end="draw">Égalité</button></div>' +
            '<div class="cb-lab-stage" data-lab-end-stage><p class="muted small">Choisissez un écran.</p></div></div>' +
        '</div></section>';
    },
    mount: function (root) {
      // Cartes de démonstration : vos deux meilleures, sinon les premières éditions du catalogue
      var mine = roster().map(function (i) { return i.ed; });
      var meEd = mine[0] || A.EDITIONS[0].id, me2 = mine[1] || A.EDITIONS[1].id;
      var foeEd = (A.EDITIONS.filter(function (e) { return e.charId !== A.ED[meEd].charId && A.R[e.rarity].rank >= 3; })[7] || A.EDITIONS[5]).id;
      var rival = 'Ariane', timer = null, skip = null, labTurns = [];
      currentRival = rival;
      function clear() { clearTimeout(timer); document.querySelectorAll('body > [data-fx], body > [data-intro]').forEach(function (n) { n.parentNode.removeChild(n); }); }
      function overlay(html, ms) {
        clear(); document.body.insertAdjacentHTML('beforeend', html);
        var el = document.body.lastElementChild;
        placeUnderHeader(el);
        el.addEventListener('click', clear);
        timer = setTimeout(clear, ms);
      }
      function intro(n) {
        var titles = { 1: 'Manche 1 · Jusqu’au KO', 2: 'Manche 2 · 1 – 0', 3: 'Manche 3 · 1 – 1' };
        overlay(introHTML(n === 2 ? me2 : meEd, foeEd, (S.get().user || {}).name || 'Vous', rival, titles[n]), 2400);
        versusSound();
      }
      function fx(a, b) {
        var heavy = !!root.querySelector('[data-lab-heavy]:checked');
        var xa = heavy && a !== 'D' ? (a === 'C' ? 2 : 3) : 1, xb = heavy && b !== 'D' ? (b === 'C' ? 2 : 3) : 1;
        var hitA = a === 'A' ? 24 * xa : 0, hitB = b === 'A' ? 22 * xb : 0, r = { me: 0, foe: 0 };
        if (a === 'A' && b === 'D') r.me = 12; else if (b === 'A' && a === 'D') r.foe = 13;
        else { r.foe = hitA; r.me = hitB; }
        var foeCharge = b === 'C' ? xb : 0;
        if (skip) skip();
        // Vie remise à plein si le coup mettrait KO (démo sans fin)
        if (fMe.hp - r.me <= 0) fMe.hp = fMe.max;
        if (fFoe.hp - r.foe <= 0) fFoe.hp = fFoe.max;
        var hp0 = { me: fMe.hp, foe: fFoe.hp };
        fMe.hp -= r.me; fFoe.hp -= r.foe;
        fMe.charge = a === 'C' ? fMe.charge + 1 : a === 'A' ? 0 : fMe.charge;
        fFoe.charge = b === 'C' ? fFoe.charge + 1 : b === 'A' ? 0 : fFoe.charge;
        labTurns.push({ n: labTurns.length + 1, a: a, b: b, me: r.me, foe: r.foe });
        var oc = outcome(a, b, xa, r);
        arena('<p class="cb-out' + (oc[1] ? ' is-' + oc[1] : '') + '">' + oc[0] + '</p>' + turnLine(labTurns[labTurns.length - 1], rival), { a: a, b: b }, hp0);
        var stage = root.querySelector('[data-lab-arena]');
        skip = playTurn(stage, { a: a, b: b, xa: xa, xb: xb, r: r, foeCharge: foeCharge }, {
          impact: function () { setHp(stage.querySelector('[data-side="me"]'), fMe); setHp(stage.querySelector('[data-side="foe"]'), fFoe); },
          done: function () { skip = null; }
        });
        duelSounds(a, b, xa, xb, r, { charge: a === 'C' ? xa : 0 }, { charge: foeCharge });
      }
      function end(res) {
        var stage = root.querySelector('[data-lab-end-stage]');
        var w = { win: [2, 0], loss: [0, 2], draw: [1, 1] }[res];
        var rows = [['Zeus', 'Capitaine Blood', w[0] > 0 ? 'me' : 'foe'], ['Anubis', 'La Méduse', res === 'win' ? 'me' : res === 'loss' ? 'foe' : 'draw']].map(function (m, k) {
          var tag = m[2] === 'me' ? 'KO pour vous' : m[2] === 'foe' ? 'KO pour l’IA' : 'Double KO';
          return '<li><span>Manche ' + (k + 1) + '<small>' + m[0] + ' contre ' + m[1] + ' · ' + tag + '</small></span><b class="' + (m[2] === 'me' ? 'pos' : m[2] === 'foe' ? 'neg' : '') + '">' + (m[2] === 'me' ? '126 – 40' : '38 – 131') + '</b></li>';
        }).join('');
        stage.innerHTML = '<div class="cb-end is-' + res + '">' + endHero(res) + '<p class="eyebrow">Duel tactique contre ' + rival + '</p>' +
          '<p class="cb-final"><b>' + w[0] + '</b><em>–</em><b>' + w[1] + '</b></p><p class="muted small">Manches gagnées · dégâts par manche ci-dessous</p>' +
          '<ul class="cb-sum">' + rows + '</ul>' + (res === 'win' ? '<p class="cb-gain">' + I('coin', 'coin') + '+30 Éclats</p>' : '') + '</div>';
        endSound(res);
      }
      var fMe, fFoe;
      function arena(msg, acts, shown) {
        root.querySelector('[data-lab-arena]').innerHTML = '<div class="cb-arena">' +
          '<div class="cb-top"><p class="cb-round"><span class="cb-pips" aria-hidden="true"><i class="is-me"></i><i class="is-now"></i><i></i></span><span>Manche <b>2</b> sur 3</span></p></div>' +
          stageHTML(fMe, fFoe, acts, shown, (msg || '<p>Aperçu de l’arène : jouez une action (l’IA répond au hasard) ou une combinaison ci-dessous.</p>') + threatHTML(fMe, fFoe, rival), rival, labTurns) +
          '<div class="cb-actions">' + ['A', 'D', 'C'].map(function (k) {
            return '<button class="cb-act is-' + k + '" data-lab-act="' + k + '">' + actArt(k) + '<b>' + ACTIONS[k].label + '</b><small>' + actHints(fMe)[k] + '</small></button>';
          }).join('') + '</div></div>';
      }
      function resetArena() {
        if (skip) skip(); fMe = fighter(meEd); fFoe = fighter(foeEd); fMe.charge = 1; fFoe.charge = 2;
        labTurns = [{ n: 1, a: 'C', b: 'D', me: 0, foe: 0 }, { n: 2, a: 'A', b: 'C', me: 0, foe: 26 }, { n: 3, a: 'C', b: 'C', me: 0, foe: 0 }];   // démo
        arena();
      }
      resetArena();
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-lab-intro]'))) intro(Number(t.getAttribute('data-lab-intro')));
        else if ((t = e.target.closest('[data-lab-fx]'))) { var k = t.getAttribute('data-lab-fx'); fx(k[0], k[1]); }
        else if ((t = e.target.closest('[data-lab-end]'))) end(t.getAttribute('data-lab-end'));
        else if ((t = e.target.closest('[data-lab-icons]'))) {
          try { localStorage.setItem('atlas-act-icons', t.getAttribute('data-lab-icons')); } catch (er) { /* ignore */ }
          var blk = root.querySelector('[data-lab-icons-block]'); if (blk) blk.innerHTML = iconsLab();
          var ar = root.querySelector('[data-lab-arena] .cb-actions'); if (ar) ar.querySelectorAll('.cb-act').forEach(function (b) { var k = b.getAttribute('data-lab-act'), old = b.querySelector('.cb-act-art'); if (k && old) old.outerHTML = actArt(k); });
        }
        else if ((t = e.target.closest('[data-lab-act]'))) fx(t.getAttribute('data-lab-act'), 'ADC'[Math.floor(Math.random() * 3)]);
        else if (skip && e.target.closest('[data-lab-arena]')) skip();
        else if (e.target.closest('[data-lab-ko]')) { if (skip) skip(); fFoe.hp = 0; arena('<p class="cb-ko">' + U.esc(fFoe.name) + ' est KO' + NB + '! Manche gagnée.</p>'); }
        else if (e.target.closest('[data-lab-reset]')) resetArena();
      });
    }
  };

  /* Accueil de l’arène : trois grandes cartes de mode, chacune avec son illustration animée (SVG en ligne). */
  /* Médaillons gravés des trois modes, dans l’esprit de l’emblème du sachet Atlas : double anneau doré, couronne graduée
     qui tourne lentement, symbole au trait fin au centre (repère 200×200, centre 100,100). */
  var MEDAL = {};   // pièces partagées avec l’écran de fin (anneau gradué, laurier, épée)
  var MODE_ART = (function () {
    function ring() {
      var ticks = '';
      for (var k = 0; k < 72; k++) {
        var a = k * 5 * Math.PI / 180, big = k % 18 === 0, mid = k % 6 === 0, r1 = big ? 80 : mid ? 83 : 85;
        ticks += 'M' + (100 + r1 * Math.sin(a)).toFixed(1) + ' ' + (100 - r1 * Math.cos(a)).toFixed(1) + ' L' + (100 + 89 * Math.sin(a)).toFixed(1) + ' ' + (100 - 89 * Math.cos(a)).toFixed(1) + ' ';
      }
      return '<circle class="g" cx="100" cy="100" r="94"/><circle class="d" cx="100" cy="100" r="89"/>' +
        '<g class="cbm-ticks"><path class="d" d="' + ticks + '"/>' +
        [0, 90, 180, 270].map(function (deg) { return '<path class="gf" transform="rotate(' + deg + ' 100 100)" d="M100 2 L102.6 6 L100 10 L97.4 6 Z"/>'; }).join('') + '</g>' +
        '<circle class="d" cx="100" cy="100" r="66"/><circle class="d f" cx="100" cy="100" r="62" stroke-dasharray="1 3"/>';
    }
    // Sans couronne de boussole : le symbole seul, posé dans la sphère de méridiens (GLOBE) resserrée autour de lui
    function wrap(id, inner) { return '<svg class="cbm-medal atl-prop is-' + id + '" viewBox="0 0 200 200" aria-hidden="true">' + inner + '</svg>'; }
    // Épée droite héraldique (lame à contour et gouttière, garde à quillons, poignée filetée, pommeau) ; croisement au milieu des lames
    var SABRE = '<path class="o" d="M100 32 L104.6 42 L103.6 118 L96.4 118 L95.4 42 Z"/><path class="d" d="M100 46 V112"/>' +
      '<path class="o g" d="M82 121 Q84 116.5 88.5 118.5 H111.5 Q116 116.5 118 121 Q116 125.5 111.5 123.5 H88.5 Q84 125.5 82 121 Z"/>' +
      '<rect class="o" x="97.4" y="124" width="5.2" height="20" rx="1.4"/><path class="d" d="M97.4 128.5 L102.6 126.5 M97.4 133 L102.6 131 M97.4 137.5 L102.6 135.5 M97.4 142 L102.6 140"/>' +
      '<circle class="o g" cx="100" cy="148.5" r="4.4"/><circle class="gf" cx="100" cy="148.5" r="1.4"/>';
    // Laurier : deux branches en arc, feuilles en amande le long de la tige
    /* Laurier : la branche gauche est calculée une fois, la droite en est le reflet exact (symétrie parfaite).
       Tige en arc (centre 100,102, rayon 52) du bas vers le haut à gauche ; paires de feuilles en amande qui rapetissent
       vers la pointe, une feuille terminale ; petit nœud doré qui relie les deux tiges en bas. */
    var LAUREL_L = (function () {
      /* D’après les couronnes de laurier gréco-romaines (couronne olympique, sceaux, gravures) :
         – tige en arc (centre 100,100, rayon 50) du bas (82°, un peu à droite : les deux tiges se croisent) jusqu’au
           sommet gauche (250°), ouverture étroite en haut ;
         – feuilles lancéolates (longues, étroites, pointues, nervure centrale), alternées par paires, couchées vers la
           pointe (~30°), qui se chevauchent comme sur une gravure (fond plein, dessinées de la base vers la pointe) ;
         – petites grappes de baies côté intérieur ; bouquet de trois feuilles à la pointe. */
      var R = 50, CX = 100, CY = 100, s = '';
      function pt(deg, r) { var a = deg * Math.PI / 180; r = r || R; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
      function leaf(p, rot, L) {
        var w = L * 0.27, f = function (n) { return n.toFixed(1); };
        return '<g transform="translate(' + f(p[0]) + ' ' + f(p[1]) + ') rotate(' + f(rot) + ')">' +
          '<path class="o" d="M0 0 C' + f(L * .18) + ' ' + f(-w) + ' ' + f(L * .55) + ' ' + f(-w * 1.05) + ' ' + f(L) + ' 0 C' + f(L * .55) + ' ' + f(w * 1.05) + ' ' + f(L * .18) + ' ' + f(w) + ' 0 0 Z"/>' +
          '<path class="d" d="M' + f(L * .1) + ' 0 L' + f(L * .8) + ' 0"/></g>';
      }
      var a0 = pt(82), a1 = pt(250);
      s += '<path class="d" d="M' + a0[0].toFixed(1) + ' ' + a0[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 0 1 ' + a1[0].toFixed(1) + ' ' + a1[1].toFixed(1) + '"/>';
      // baies (sous les feuilles) : grappes de deux, côté intérieur
      [128, 166, 204].forEach(function (deg) {
        var b1 = pt(deg + 2, R - 7), b2 = pt(deg + 6, R - 9.5);
        s += '<path class="d" d="M' + pt(deg, R).map(function (n) { return n.toFixed(1); }).join(' ') + ' L' + b1[0].toFixed(1) + ' ' + b1[1].toFixed(1) + ' M' + pt(deg + 3, R - 1).map(function (n) { return n.toFixed(1); }).join(' ') + ' L' + b2[0].toFixed(1) + ' ' + b2[1].toFixed(1) + '"/>' +
          '<circle class="o g" cx="' + b1[0].toFixed(1) + '" cy="' + b1[1].toFixed(1) + '" r="1.9"/><circle class="o g" cx="' + b2[0].toFixed(1) + '" cy="' + b2[1].toFixed(1) + '" r="1.7"/>';
      });
      // feuilles alternées, de la base vers la pointe (les suivantes recouvrent les précédentes)
      for (var i = 0; i < 14; i++) {
        var t = i / 13, deg = 104 + i * 10, L = 15.5 - t * 6;
        s += leaf(pt(deg), deg + 90 - 30, L);              // extérieure
        s += leaf(pt(deg + 5), deg + 5 + 90 + 30, L * 0.88);   // intérieure, décalée vers la pointe
      }
      // bouquet terminal
      s += leaf(pt(250), 250 + 90 - 20, 8) + leaf(pt(250), 250 + 90 + 20, 7.5) + leaf(pt(250), 250 + 90, 9.5);
      return s;
    })();
    function branch(side) {
      return side < 0 ? '<g>' + LAUREL_L + '</g>'
        : '<g transform="matrix(-1 0 0 1 200 0)">' + LAUREL_L + '</g>' +
          // ruban noué au croisement des tiges (dessiné une seule fois)
          '<path class="o g" d="M100 151 Q91 144.5 87.5 150 Q91 155.5 100 151 Z M100 151 Q109 144.5 112.5 150 Q109 155.5 100 151 Z"/>' +
          '<path class="g" d="M99 152.5 Q96 158 93 162 M101 152.5 Q104 158 107 162"/><circle class="gf" cx="100" cy="151" r="2"/>';
    }
    MEDAL.ring = ring; MEDAL.branch = branch; MEDAL.sabre = SABRE;
    var SECT = [['A', 'M100 100 L100 44 A56 56 0 0 1 148.5 128 Z', 127.7, 86, 'ATQ'], ['D', 'M100 100 L148.5 128 A56 56 0 0 1 51.5 128 Z', 100, 136, 'DÉF'], ['E', 'M100 100 L51.5 128 A56 56 0 0 1 100 44 Z', 72.3, 86, 'ESP']];
    return {
      duel: wrap('duel', '<g class="cbm-sabre is-l">' + SABRE + '</g><g class="cbm-sabre is-r">' + SABRE + '</g>'),
      quiz: wrap('quiz', branch(-1) + branch(1) + '<text class="cbm-qmark" x="100" y="120" text-anchor="middle">?</text>'),
      terrains: wrap('terrains', SECT.map(function (s, i) { return '<path class="cbm-sect is-' + s[0] + '" style="animation-delay:' + (i * 1.2) + 's" d="' + s[1] + '"/>'; }).join('') +
        '<path class="d" d="M100 100 L100 44 M100 100 L148.5 128 M100 100 L51.5 128"/><circle class="g" cx="100" cy="100" r="56"/>' +
        SECT.map(function (s) { return '<text x="' + s[2] + '" y="' + s[3] + '" text-anchor="middle">' + s[4] + '</text>'; }).join('') +
        '<path class="gf" d="M100 95 L104 100 L100 105 L96 100 Z"/>')
    };
  })();
  // Globe de méridiens au trait d’or (même motif que derrière le sachet de l’accueil) ; deux méridiens tournent lentement
  var GLOBE = '<svg class="cbm-globe" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="80" stroke-dasharray="1 4"/>' +
    '<ellipse cx="100" cy="100" rx="96" ry="34"/><ellipse cx="100" cy="100" rx="96" ry="70"/><path d="M4 100 H196"/>' +
    '<ellipse class="m" cx="100" cy="100" rx="44" ry="96"/><ellipse class="m" cx="100" cy="100" rx="78" ry="96" style="animation-delay:-4.5s"/><path d="M100 4 V196"/></svg>';
  function hubHTML() {
    function mode(id, n, icon, title, desc, facts) {
      return '<article class="cb-mode is-' + id + '" data-mode="' + id + '">' +
        '<div class="cb-mode-art" aria-hidden="true"><i class="cbm-glow"></i>' + GLOBE + MODE_ART[id] + '</div>' +
        '<div class="cb-mode-body"><p class="eyebrow">Mode ' + n + ' · Contre l’IA</p><h2 class="cb-mode-title">' + title + '</h2>' +
          '<p class="cb-mode-desc">' + desc + '</p>' +
          '<ul class="cb-mode-facts">' + facts.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
          '<button class="btn btn-gold btn-lg" data-mode="' + id + '">' + I(icon) + 'Jouer</button></div></article>';
    }
    return '<div class="cb-modes">' +
      mode('duel', 1, 'swords', 'Duel tactique', 'Attaquer, défendre ou charger' + NB + ': devinez le coup de l’adversaire et frappez au bon moment.', ['3 cartes', 'Jusqu’au KO', 'Charge sans limite']) +
      mode('quiz', 2, 'scroll', 'Quiz des légendes', 'Questions éclair face à face : le premier qui répond juste fait frapper sa carte. Répondez vite, enchaînez les séries.', ['Le plus rapide frappe', 'Éclair ×1,5', '2 manches gagnées']) +
      mode('terrains', 3, 'laurel', 'Trois terrains', 'Déployez vos renforts sur trois fronts et gardez votre bannière pour renverser la bataille.', ['5 cartes', 'ATQ · DÉF · ESP', 'Bannière +20']) +
    '</div>' +
    '<div class="cb-friends"><div>' + I('user') + '</div><p><b>Défier un ami</b><span class="muted small">Arrive avec les comptes joueurs. En attendant, vous affrontez des adversaires IA.</span></p></div>';
  }
})(window.ATLAS);
