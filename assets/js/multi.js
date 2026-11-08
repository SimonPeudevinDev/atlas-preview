/* ATLAS — Ouverture multiple, façon jeu de cartes :
   1. la pile : le sachet en 3D posé sur la pile des autres, « ×10 » ;
   2. un glissement du doigt : les sachets éclatent l’un après l’autre, très vite, chacun avec
      un flash à la couleur de sa meilleure carte et une gerbe de cartes ; plus long pour les grandes raretés ;
   3. l’écran récapitulatif : toutes les cartes, de la plus rare à la plus commune ; un toucher ouvre la fiche.
   Les tirages se font comme d’habitude (store.openPack), au moment du glissement. */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui, SFX = A.sfx;
  var M = A.multi = {};
  var GLOW = { base: '#F4E7C8', rare: '#58A6FF', epic: '#A866FF', legendary: '#FFC23A', mythic: '#FF3B2F', unique: '#FFE6A0' };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Combien de boosters de ce type peuvent être ouverts d’affilée maintenant (au plus 10) */
  M.count = function (packId) {
    var p = A.PACK[packId]; if (!p || p.daily) return 0;
    if (p.test) return 10;
    return Math.min(10, S.tokens(packId) + (p.timer ? S.charges().n : 0));
  };
  function rankOf(it) { return A.R[A.ED[it.ed].rarity].rank; }

  M.open = function (packId, n) {
    var pack = A.PACK[packId];
    n = Math.min(n || M.count(packId), M.count(packId));
    if (n < 1) { U.toast('Aucun booster à ouvrir', 'error'); return; }

    // La file : les n sachets alignés en perspective, le premier devant ; images plates du vrai sachet (légères)
    var el = document.createElement('div');
    el.className = 'multi is-stage t-' + pack.theme;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Ouverture multiple');
    // Le sachet de devant est le vrai sachet 3D ; les autres sont empilés derrière, chacun un peu plus haut
    var q = '';
    for (var k = n - 1; k >= 1; k--) q += '<div class="mu-pack" style="--q:' + k + '"><i class="mp-tab"></i></div>';   // derrière : seule la languette dépasse
    el.innerHTML =
      '<div class="mu-top"><button class="op-icon" data-mu-close aria-label="Fermer">' + U.icon('close') + '</button></div>' +
      '<div class="mu-head"><p class="eyebrow">' + pack.kicker + '</p><h2 class="op-title">' + pack.name + '</h2>' +
        '<p class="mu-count"><b>' + n + '</b> booster' + (n > 1 ? 's' : '') + '</p></div>' +
      '<div class="mu-stage"><div class="mu-queue" style="--ty:' + ((A.pack3d && A.pack3d.tearRatio) || 0.12).toFixed(4) + ';--cr:' + ((A.pack3d && A.pack3d.crimpRatio) || 0.075).toFixed(4) + '">' +
        '<div class="mu-behind">' + q + '</div><div class="mu-front">' + A.pack.html(pack, { tilt: true }) + '</div><div class="mu-fly"></div></div></div>' +
      '<p class="mu-hint">Glissez pour ouvrir les ' + n + '</p>';
    document.body.appendChild(el);
    var html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    var queue = el.querySelector('.mu-queue'), front = el.querySelector('.mu-front'), pk = front.querySelector('.pk');
    pk.setAttribute('data-pk-direct', '');
    pk.setAttribute('data-pk-still', '');   // aligné sur la pile : pas de flottement ni de rotation
    A.pack.mountAll(el);
    if (A.pack3d && A.pack3d.faceURL) A.pack3d.faceURL(pack).then(function (u) { queue.style.setProperty('--face', 'url("' + u + '")'); queue.classList.add('has-face'); });
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    setTimeout(function () { if (el.isConnected) SFX.land(); }, 200);

    var started = false, closed = false;
    function close(again) {
      if (closed) return; closed = true;
      html.style.overflow = prev;
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); A.app.rerender(); if (again) M.open(packId, M.count(packId)); }, 260);
    }

    // Le doigt déchire le premier sachet comme à l’ouverture simple ; au bout (ou d’un toucher), la rafale part
    var stage = el.querySelector('.mu-stage'), drag = null, dir = 0, chain = false, curTp = 0, anim = 0;
    function clamp01(v) { return Math.max(0, Math.min(1, v)); }
    function setDir(d) {
      dir = d;
      pk.classList.remove('dir-l', 'dir-r', 'is-tearing');
      if (d) pk.classList.add(d > 0 ? 'dir-r' : 'dir-l', 'is-tearing');
    }
    stage.addEventListener('pointerdown', function (e) {
      if (chain || closed) return;
      cancelAnimationFrame(anim);
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), v: 0, half: curTp > 0.5 };
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!dir && Math.abs(dx) > 8) {
        if (!draw()) { drag = null; return; }
        setDir(dx > 0 ? 1 : -1);
        el.querySelector('.mu-hint').textContent = '';
        SFX.grain(0.2);
      }
      if (!dir) return;
      var w = pk.getBoundingClientRect().width;
      setTp(clamp01(dx * dir / (w * 0.85)));
      if (!drag.half && curTp > 0.5) { drag.half = true; SFX.grain(0.7); }
      var now = performance.now();
      drag.v = (e.clientX - drag.lx) * dir / Math.max(1, now - drag.lt);
      drag.lx = e.clientX; drag.lt = now;
    });
    function endDrag(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (chain || closed) return;
      if (!dir) {                                          // un simple toucher n’ouvre pas : il faut glisser
        if (Math.abs(e.clientX - d.x) < 10 && Math.abs(e.clientY - d.y) < 10) el.querySelector('.mu-hint').textContent = 'Glissez le doigt sur le sachet pour l’ouvrir';
        return;
      }
      if (curTp > 0.55 || (curTp > 0.2 && d.v > 0.5)) { run(curTp); return; }
      var from = curTp, t0 = performance.now();          // pas assez loin : le bout se recolle
      (function back(now) {
        var k = Math.min(1, (now - t0) / 260), e2 = 1 - Math.pow(1 - k, 3);
        setTp(from * (1 - e2));
        if (k < 1) anim = requestAnimationFrame(back);
        else { setDir(0); el.querySelector('.mu-hint').textContent = 'Encore un peu… glissez jusqu’au bout'; }
      })(t0);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-mu-close]') && !started) { close(false); return; }
      if (e.target.closest('[data-mu-skip]')) { skip = true; return; }
      if (e.target.closest('[data-mu-all]')) { revealAll = true; return; }
      if (e.target.closest('[data-mu-done]')) { close(false); return; }
      if (e.target.closest('[data-mu-again]')) { close(true); return; }
      var it = e.target.closest('.mu-item');
      if (!it || moved) return;                           // un défilement n’ouvre rien
      if (!it.classList.contains('is-shown')) { show(it); return; }
      if (el.classList.contains('is-revealed')) U.openCard(it.getAttribute('data-ed'), it.getAttribute('data-uid'));   // la fiche seulement une fois tout révélé
    });
    var moved = false, px = 0, py = 0;
    el.addEventListener('pointerdown', function (e) { moved = false; px = e.clientX; py = e.clientY; });
    el.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - px) + Math.abs(e.clientY - py) > 10) moved = true; });
    el.addEventListener('scroll', function () { moved = true; }, true);
    document.addEventListener('keydown', function key(e) {
      if (!el.isConnected) { document.removeEventListener('keydown', key); return; }
      if (e.key === 'Escape' && !started) close(false);
    });

    var packs = [], skip = false, revealAll = false;
    // Les tirages, dès que la déchirure commence (on ne peut plus revenir en arrière)
    function draw() {
      if (started) return packs.length > 0; started = true;
      for (var i = 0; i < n; i++) {
        var r = S.openPack(packId);
        if (!r.ok) break;
        packs.push(r.items);
      }
      if (!packs.length) { U.toast('Aucun booster à ouvrir', 'error'); close(false); return false; }
      [].forEach.call(el.querySelectorAll('.mu-behind .mu-pack'), function (p) {   // stock épuisé entre-temps
        if (+p.style.getPropertyValue('--q') > packs.length - 1) p.remove();
      });
      var best = Math.max.apply(null, packs[0].map(rankOf));
      pk.setAttribute('data-glow', GLOW[A.RARITIES[best].id]);
      el.classList.add('is-going');
      return true;
    }
    function run(from) {
      if (chain) return; chain = true;
      el.querySelector('.mu-hint').innerHTML = '<button class="mu-skip" data-mu-skip>Passer</button>';
      tearAt(0, from);
    }

    // Rafale : sur le vrai sachet 3D, la lumière file le long de la ligne, le bout s’arrache ; le sachet ouvert
    // part à gauche (copie plate) pendant que celui de derrière descend prendre sa place et se déchire déjà.
    function setTp(p) { curTp = p; if (pk._gl && pk._gl.setTp) pk._gl.setTp(p); else pk.style.setProperty('--tp', p.toFixed(3)); }
    function tear(ms, from, done) {
      var t0 = performance.now(); from = from || 0;
      (function step(now) {
        if (closed) return;
        var k = Math.min(1, ((now || performance.now()) - t0) / ms), e = k * k * (3 - 2 * k);
        setTp(from + (1 - from) * e);
        if (k < 1) requestAnimationFrame(step); else done();
      })();
    }
    function tearAt(i, from) {
      if (closed) return;
      if (i >= packs.length || skip) { setTimeout(grid, skip ? 0 : 260); return; }
      var items = packs[i], best = Math.max.apply(null, items.map(rankOf)), big = best >= 3;
      var tt = reduce ? 40 : 75;                         // même vitesse pour tous : rythme linéaire
      pk.setAttribute('data-glow', GLOW[A.RARITIES[best].id]);   // la lueur de l’ouverture trahit la meilleure carte
      pk.classList.remove('is-torn');
      if (from) tt = Math.max(30, tt * (1 - from) * 1.6);   // le premier finit de s’ouvrir depuis où le doigt l’a laissé
      else { setDir(1); setTp(0); SFX.grain(0.2); setTimeout(function () { if (!closed) SFX.grain(0.7); }, tt * 0.55); }
      tear(tt, from, function () {
        if (closed) return;
        pk.classList.add('is-torn');
        SFX.rip(best); A.haptic(big ? [16, 30, 20] : 8);
        if (big) SFX.numbered(best);
        var c = el.querySelector('.mu-count b'); if (c) c.textContent = packs.length - i - 1;
        setTimeout(function () {
          if (closed) return;
          // le sachet ouvert s’en va à gauche (copie plate, avec sa lueur)
          var g = document.createElement('div');
          g.className = 'mu-gone' + (big ? ' is-big' : '');
          g.style.setProperty('--fc', GLOW[A.RARITIES[best].id]);
          g.innerHTML = '<i class="mp-body"></i><i class="mp-line"></i>';
          el.querySelector('.mu-fly').appendChild(g);
          setTimeout(function () { g.remove(); }, 400);
          if (i + 1 >= packs.length) { front.classList.add('is-empty'); tearAt(i + 1); return; }
          // celui de derrière descend à la place du premier : le vrai sachet repart neuf depuis sa position
          var b = el.querySelectorAll('.mu-behind .mu-pack');
          b.forEach(function (p) { p.style.setProperty('--q', +p.style.getPropertyValue('--q') - 1); });
          var first = [].filter.call(b, function (p) { return +p.style.getPropertyValue('--q') <= 0; })[0];
          if (first) first.remove();
          pk.classList.remove('is-torn'); setDir(0); setTp(0);
          front.classList.remove('is-rise'); void front.offsetWidth; front.classList.add('is-rise');
          setTimeout(function () { tearAt(i + 1); }, reduce ? 20 : 45);
        }, reduce ? 30 : 25);
      });
    }

    // Révélation en cascade : les cartes apparaissent face visible une à une, des plus communes aux plus rares,
    // la grille défile pour suivre ; une Légendaire ou mieux surgit d'abord en grand au centre, puis va se ranger.
    function show(it, quiet) {
      if (it.classList.contains('is-shown')) return;
      it.classList.add('is-shown');
      if (quiet) return;
      var r = A.R[A.ED[it.getAttribute('data-ed')].rarity].rank;
      if (r === 2) { SFX.reveal(2); A.haptic(8); } else if (r === 1) SFX.flip();
    }
    function follow(node) {
      var g = el.querySelector('.mu-grid'); if (!g) return;
      var y = node.offsetTop - g.clientHeight * 0.45;
      if (y > g.scrollTop + 8) g.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Légendaire ou mieux : la carte apparaît sur place en grand, avec sa lueur, puis reprend sa taille
    function spotlight(node, done) {
      var r = A.R[A.ED[node.getAttribute('data-ed')].rarity].rank;
      follow(node);
      node.style.setProperty('--fc', GLOW[A.RARITIES[r].id]);
      setTimeout(function () {
        if (closed) return;
        node.classList.add('is-spot'); show(node, true);
        SFX.reveal(r); A.haptic([18, 40, 26]);
        setTimeout(function () { node.classList.remove('is-spot'); done(); }, reduce ? 150 : 650);
      }, 180);
    }
    function flips(items) {
      var nodes = [].slice.call(el.querySelectorAll('.mu-item'));   // grille triée des plus communes aux plus rares
      var k = 0;
      function next() {
        if (closed) return;
        if (revealAll) { nodes.forEach(function (n) { show(n, true); }); var g = el.querySelector('.mu-grid'); if (g) g.scrollTo({ top: g.scrollHeight }); done(); return; }
        while (k < nodes.length && nodes[k].classList.contains('is-shown')) k++;
        if (k >= nodes.length) { done(); return; }
        var n = nodes[k++], r = A.R[A.ED[n.getAttribute('data-ed')].rarity].rank;
        if (r >= 3 && !reduce) { spotlight(n, function () { setTimeout(next, 120); }); return; }
        show(n, r === 0); if (r === 0 && k % 3 === 0) SFX.deal(0.12, 0.7 + Math.random() * 0.4);
        if (k % 3 === 1) follow(n);
        setTimeout(next, r === 2 ? 220 : r === 1 ? 70 : 34);
      }
      function done() { var f = el.querySelector('.mu-foot'); if (f) f.classList.remove('is-revealing'); el.classList.add('is-revealed'); }
      setTimeout(next, 250);
    }

    // Écran récapitulatif
    function grid() {
      if (closed || el.classList.contains('is-grid')) return;
      var items = [].concat.apply([], packs);
      items.sort(function (a, b) { return rankOf(a) - rankOf(b) || (a._new ? 1 : 0) - (b._new ? 1 : 0); });   // des plus communes aux plus rares
      var best = rankOf(items[items.length - 1]), counts = {}, fresh = 0;
      items.forEach(function (it) { var r = A.ED[it.ed].rarity; counts[r] = (counts[r] || 0) + 1; if (it._new) fresh++; });
      var chips = A.RARITIES.slice().reverse().filter(function (r) { return counts[r.id]; }).map(function (r) {
        return '<span class="rar-chip r-' + r.id + '"><i></i>' + counts[r.id] + ' ' + r.label + '</span>';
      }).join('');
      var again = M.count(packId);
      el.classList.remove('is-stage', 'is-going'); el.classList.add('is-grid');
      el.innerHTML =
        '<div class="mu-head"><p class="eyebrow">' + pack.name + ' × ' + packs.length + '</p>' +
          '<h2 class="op-title">' + items.length + ' cartes obtenues</h2>' +
          '<p class="mu-wait">Révélation…</p>' +
          '<p class="mu-sub">' + (fresh ? fresh + (fresh > 1 ? ' nouveaux personnages · ' : ' nouveau personnage · ') : '') + 'Meilleure carte : ' + A.R[A.ED[items[items.length - 1].ed].rarity].label + '</p>' +
          '<div class="mu-chips">' + chips + '</div></div>' +
        '<div class="mu-grid">' + items.map(function (it, i) {
          var ed = A.ED[it.ed];
          return '<button class="mu-item r-' + ed.rarity + (A.R[ed.rarity].rank >= 3 ? ' is-big' : '') + '" data-ed="' + it.ed + '" data-uid="' + it.uid + '" style="--d:' + (i * 12) + 'ms;--r:' + (Math.random() * 30 - 15).toFixed(1) + 'deg">' +
            '<span class="mu-card">' + U.card(it.ed, { serial: it.serial, open: false, newBadge: it._new, firstBadge: it.first }) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="mu-foot is-revealing"><button class="btn btn-ghost-light btn-lg mu-all" data-mu-all>Tout révéler</button>' +
          '<button class="btn btn-gold btn-lg" data-mu-done>Ajouter à l’inventaire</button>' +
          (again >= 1 ? '<button class="btn btn-ghost-light btn-lg" data-mu-again>Encore ×' + again + '</button>' : '') + '</div>';
      flips(items);


    }
  };
})(window.ATLAS);
