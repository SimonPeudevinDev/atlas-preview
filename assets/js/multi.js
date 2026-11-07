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
    var q = '';
    for (var k = 0; k < n; k++) q += '<div class="mu-pack" style="--q:' + k + '"><i class="mp-body"></i><i class="mp-cap"></i><i class="mp-line"></i><i class="mp-gloss"></i></div>';
    el.innerHTML =
      '<div class="mu-top"><button class="op-icon" data-mu-close aria-label="Fermer">' + U.icon('close') + '</button></div>' +
      '<div class="mu-head"><p class="eyebrow">' + pack.kicker + '</p><h2 class="op-title">' + pack.name + '</h2>' +
        '<p class="mu-count"><b>' + n + '</b> booster' + (n > 1 ? 's' : '') + '</p></div>' +
      '<div class="mu-stage"><div class="mu-queue" style="--ty:' + ((A.pack3d && A.pack3d.tearRatio) || 0.12).toFixed(4) + '">' + q + '</div></div>' +
      '<p class="mu-hint">Glissez pour ouvrir les ' + n + '</p>';
    document.body.appendChild(el);
    var html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    var queue = el.querySelector('.mu-queue'), packEls = [].slice.call(el.querySelectorAll('.mu-pack'));
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

    // Glisser (ou toucher) : tout s’ouvre
    var sx = null, stage = el.querySelector('.mu-stage');
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointermove', function (e) { if (sx != null && Math.abs(e.clientX - sx) > 40) { sx = null; go(); } });
    stage.addEventListener('pointerup', function () { if (sx != null) { sx = null; go(); } });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-mu-close]') && !started) { close(false); return; }
      if (e.target.closest('[data-mu-skip]')) { skip = true; return; }
      if (e.target.closest('[data-mu-all]')) { revealAll = true; return; }
      if (e.target.closest('[data-mu-done]')) { close(false); return; }
      if (e.target.closest('[data-mu-again]')) { close(true); return; }
      var it = e.target.closest('.mu-item');
      if (it && !it.classList.contains('is-shown')) { show(it); return; }
      if (it) U.openCard(it.getAttribute('data-ed'), it.getAttribute('data-uid'));
    });
    document.addEventListener('keydown', function key(e) {
      if (!el.isConnected) { document.removeEventListener('keydown', key); return; }
      if (e.key === 'Escape' && !started) close(false);
    });

    var packs = [], skip = false, revealAll = false;
    function go() {
      if (started) return; started = true;
      for (var i = 0; i < n; i++) {               // les tirages
        var r = S.openPack(packId);
        if (!r.ok) break;
        packs.push(r.items);
      }
      if (!packs.length) { U.toast('Aucun booster à ouvrir', 'error'); close(false); return; }
      for (var j = packs.length; j < packEls.length; j++) packEls[j].remove();   // stock épuisé entre-temps
      el.classList.add('is-going');
      el.querySelector('.mu-hint').innerHTML = '<button class="mu-skip" data-mu-skip>Passer</button>';
      tearAt(0);
    }

    // Rafale : le trait de lumière file le long de la ligne, le bout s’envole, le sachet glisse à gauche
    // et toute la file avance d’un cran ; le suivant commence déjà sa déchirure (enchaînement continu).
    function advance(cur) { packEls.forEach(function (p, k) { p.style.setProperty('--q', Math.max(0, k - cur)); p.classList.toggle('is-gone', k < cur); }); }
    function tearAt(i) {
      if (closed) return;
      if (i >= packs.length || skip) { advance(packs.length); setTimeout(grid, skip ? 0 : 380); return; }
      var items = packs[i], best = Math.max.apply(null, items.map(rankOf)), big = best >= 3, p = packEls[i];
      var tt = reduce ? 40 : big ? 170 : 95;
      p.style.setProperty('--fc', GLOW[A.RARITIES[best].id]);
      p.style.setProperty('--tt', tt + 'ms');
      p.classList.add('is-tear');
      SFX.grain(0.2); setTimeout(function () { if (!closed) SFX.grain(0.7); }, tt * 0.55);
      setTimeout(function () {
        if (closed) return;
        p.classList.add('is-torn'); if (big) p.classList.add('is-big');
        SFX.rip(best); A.haptic(big ? [16, 30, 20] : 8);
        if (big) SFX.numbered(best);
        var c = el.querySelector('.mu-count b'); if (c) c.textContent = packs.length - i - 1;
        setTimeout(function () { if (closed) return; advance(i + 1); tearAt(i + 1); }, reduce ? 30 : big ? 300 : 45);
      }, tt);
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
    function spotlight(node, done) {
      var r = A.R[A.ED[node.getAttribute('data-ed')].rarity].rank;
      var sp = document.createElement('div');
      sp.className = 'mu-spot r-' + A.ED[node.getAttribute('data-ed')].rarity;
      sp.style.setProperty('--fc', GLOW[A.RARITIES[r].id]);
      sp.innerHTML = '<div class="mu-spot-card">' + node.querySelector('.mu-front').innerHTML + '</div>';
      el.appendChild(sp);
      SFX.reveal(r); A.haptic([18, 40, 26]);
      requestAnimationFrame(function () { sp.classList.add('is-in'); });
      setTimeout(function () {
        if (closed) return;
        follow(node);
        setTimeout(function () {                        // la carte rejoint sa place dans la grille
          var c = sp.querySelector('.mu-spot-card'), a = c.getBoundingClientRect(), b = node.getBoundingClientRect();
          c.style.transform = 'translate(' + (b.left + b.width / 2 - (a.left + a.width / 2)) + 'px,' + (b.top + b.height / 2 - (a.top + a.height / 2)) + 'px) scale(' + (b.width / a.width) + ')';
          sp.classList.add('is-out');
          setTimeout(function () { show(node, true); sp.remove(); done(); }, 380);
        }, 220);
      }, reduce ? 200 : 900);
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
            '<span class="mu-front">' + U.card(it.ed, { serial: it.serial, open: false, newBadge: it._new, firstBadge: it.first }) + '</span></button>';
        }).join('') + '</div>' +
        '<div class="mu-foot is-revealing"><button class="btn btn-ghost-light btn-lg mu-all" data-mu-all>Tout révéler</button>' +
          '<button class="btn btn-gold btn-lg" data-mu-done>Ajouter à l’inventaire</button>' +
          (again >= 1 ? '<button class="btn btn-ghost-light btn-lg" data-mu-again>Encore ×' + again + '</button>' : '') + '</div>';
      flips(items);


    }
  };
})(window.ATLAS);
