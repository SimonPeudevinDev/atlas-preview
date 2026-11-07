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

    var el = document.createElement('div');
    el.className = 'multi is-stage t-' + pack.theme;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Ouverture multiple');
    var ghosts = '';
    for (var g = 1; g < n; g++) ghosts += '<i style="--g:' + g + '"></i>';
    el.innerHTML =
      '<div class="mu-top"><button class="op-icon" data-mu-close aria-label="Fermer">' + U.icon('close') + '</button></div>' +
      '<div class="mu-head"><p class="eyebrow">' + pack.kicker + '</p><h2 class="op-title">' + pack.name + '</h2></div>' +
      '<div class="mu-stage"><div class="mu-pile">' + '<div class="mu-ghosts">' + ghosts + '</div>' +
        '<div class="mu-pk">' + A.pack.html(pack, { tilt: true }) + '</div>' +
        '<span class="mu-badge">×<b>' + n + '</b></span><div class="mu-flash"></div><div class="mu-shards"></div></div></div>' +
      '<p class="mu-hint">Glissez sur le sachet pour ouvrir les ' + n + '</p>';
    document.body.appendChild(el);
    var html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    A.pack.mountAll(el);
    var pk = el.querySelector('.mu-pk .pk');
    if (pk && pk._rig) pk._rig.idle(true);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    SFX.land && setTimeout(function () { if (el.isConnected) SFX.land(); }, 200);

    var started = false, closed = false;
    function close(again) {
      if (closed) return; closed = true;
      html.style.overflow = prev;
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); A.app.rerender(); if (again) M.open(packId, M.count(packId)); }, 260);
    }

    // Glisser (ou toucher) le sachet : tout s’ouvre
    var sx = null;
    var stage = el.querySelector('.mu-stage');
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointermove', function (e) { if (sx != null && Math.abs(e.clientX - sx) > 50) { sx = null; go(); } });
    stage.addEventListener('pointerup', function () { if (sx != null) { sx = null; go(); } });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-mu-close]') && !started) { close(false); return; }
      if (e.target.closest('[data-mu-skip]')) { skip = true; return; }
      if (e.target.closest('[data-mu-done]')) { close(false); return; }
      if (e.target.closest('[data-mu-again]')) { close(true); return; }
      var it = e.target.closest('.mu-item');
      if (it) U.openCard(it.getAttribute('data-ed'), it.getAttribute('data-uid'));
    });
    document.addEventListener('keydown', function key(e) {
      if (!el.isConnected) { document.removeEventListener('keydown', key); return; }
      if (e.key === 'Escape' && !started) close(false);
    });

    var packs = [], skip = false;
    function go() {
      if (started) return; started = true;
      for (var i = 0; i < n; i++) {               // les tirages
        var r = S.openPack(packId);
        if (!r.ok) break;
        packs.push(r.items);
      }
      if (!packs.length) { U.toast('Aucun booster à ouvrir', 'error'); close(false); return; }
      el.classList.add('is-going');
      el.querySelector('.mu-hint').innerHTML = '<button class="mu-skip" data-mu-skip>Passer</button>';
      if (pk && pk._rig) pk._rig.idle(false);
      burst(0);
    }

    // Un sachet qui éclate : flash à la couleur de sa meilleure carte, gerbe de cartes, compteur qui descend
    function burst(i) {
      if (closed) return;
      if (i >= packs.length || skip) { grid(); return; }
      var items = packs[i], best = Math.max.apply(null, items.map(rankOf)), rid = A.RARITIES[best].id;
      var big = best >= 3, dur = reduce ? 120 : big ? 620 : 300;
      var pile = el.querySelector('.mu-pile');
      pile.style.setProperty('--fc', GLOW[rid]);
      pile.style.setProperty('--dur', dur + 'ms');
      pile.classList.remove('is-burst', 'is-back', 'is-big'); void pile.offsetWidth;
      pile.classList.add('is-burst'); if (big) pile.classList.add('is-big');
      SFX.rip(Math.min(best, 3));
      if (big) setTimeout(function () { if (!closed) SFX.reveal(best); }, dur * 0.5);
      A.haptic(big ? [18, 30, 24] : 8);
      // gerbe de cartes
      var sh = el.querySelector('.mu-shards'), frag = '';
      items.forEach(function (it, k) {
        var a = -90 + (k - (items.length - 1) / 2) * 26 + (Math.random() * 10 - 5);
        frag += '<i class="r-' + A.ED[it.ed].rarity + '" style="--a:' + a + 'deg;--k:' + k + ';--c:' + GLOW[A.ED[it.ed].rarity] + '"></i>';
      });
      sh.innerHTML = frag;
      // pile et compteur
      var left = packs.length - i - 1;
      var gh = el.querySelectorAll('.mu-ghosts i');
      if (gh.length) gh[gh.length - 1].remove();
      el.querySelector('.mu-badge b').textContent = left;
      setTimeout(function () {
        if (closed) return;
        if (left <= 0) { grid(); return; }
        pile.classList.remove('is-burst', 'is-big'); void pile.offsetWidth; pile.classList.add('is-back');
        setTimeout(function () { burst(i + 1); }, reduce ? 40 : 110);
      }, dur);
    }

    // Écran récapitulatif
    function grid() {
      if (closed || el.classList.contains('is-grid')) return;
      var items = [].concat.apply([], packs);
      items.sort(function (a, b) { return rankOf(b) - rankOf(a) || (b._new ? 1 : 0) - (a._new ? 1 : 0); });
      var best = rankOf(items[0]), counts = {}, fresh = 0;
      items.forEach(function (it) { var r = A.ED[it.ed].rarity; counts[r] = (counts[r] || 0) + 1; if (it._new) fresh++; });
      var chips = A.RARITIES.slice().reverse().filter(function (r) { return counts[r.id]; }).map(function (r) {
        return '<span class="rar-chip r-' + r.id + '"><i></i>' + counts[r.id] + ' ' + r.label + '</span>';
      }).join('');
      var again = M.count(packId);
      el.classList.remove('is-stage', 'is-going'); el.classList.add('is-grid');
      el.innerHTML =
        '<div class="mu-head"><p class="eyebrow">' + pack.name + ' × ' + packs.length + '</p>' +
          '<h2 class="op-title">' + items.length + ' cartes obtenues</h2>' +
          '<p class="mu-sub">' + (fresh ? fresh + (fresh > 1 ? ' nouveaux personnages · ' : ' nouveau personnage · ') : '') + 'Meilleure carte : ' + A.R[A.ED[items[0].ed].rarity].label + '</p>' +
          '<div class="mu-chips">' + chips + '</div></div>' +
        '<div class="mu-grid">' + items.map(function (it, i) {
          var ed = A.ED[it.ed];
          return '<button class="mu-item r-' + ed.rarity + (A.R[ed.rarity].rank >= 3 ? ' is-big' : '') + '" data-ed="' + it.ed + '" data-uid="' + it.uid + '" style="--d:' + Math.min(i * 40, 1600) + 'ms">' +
            U.card(it.ed, { serial: it.serial, open: false, newBadge: it._new, firstBadge: it.first }) + '</button>';
        }).join('') + '</div>' +
        '<div class="mu-foot"><button class="btn btn-gold btn-lg" data-mu-done>Ajouter à l’inventaire</button>' +
          (again >= 1 ? '<button class="btn btn-ghost-light btn-lg" data-mu-again>Encore ×' + again + '</button>' : '') + '</div>';
      var deal = 0, tick = setInterval(function () {
        if (!el.isConnected || deal > Math.min(items.length, 12)) { clearInterval(tick); return; }
        SFX.deal(0.16, 0.7 + Math.random() * 0.4); deal++;
      }, 70);
      if (best >= 1 && !packs.some(function (its) { return Math.max.apply(null, its.map(rankOf)) >= 3; })) setTimeout(function () { if (!closed) SFX.reveal(best); }, 200);
    }
  };
})(window.ATLAS);
