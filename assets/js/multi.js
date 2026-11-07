/* ATLAS — Ouverture multiple : plusieurs boosters d’un coup, toutes les cartes sur un seul écran.
   Les cartes sont triées de la plus rare à la plus commune et distribuées une à une ;
   un toucher ouvre la fiche. Les boosters sont tirés comme d’habitude (store.openPack). */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui, SFX = A.sfx;
  var M = A.multi = {};

  /** Combien de boosters de ce type peuvent être ouverts d’affilée maintenant (au plus 10) */
  M.count = function (packId) {
    var p = A.PACK[packId]; if (!p || p.daily) return 0;
    if (p.test) return 10;
    var n = S.tokens(packId) + (p.timer ? S.charges().n : 0);
    return Math.min(10, n);
  };

  M.open = function (packId, n) {
    var pack = A.PACK[packId], items = [], opened = 0;
    for (var i = 0; i < n; i++) {
      var r = S.openPack(packId);
      if (!r.ok) break;
      opened++;
      r.items.forEach(function (it) { items.push(it); });
    }
    if (!opened) { U.toast('Aucun booster à ouvrir', 'error'); return; }
    var rank = function (it) { return A.R[A.ED[it.ed].rarity].rank; };
    items.sort(function (a, b) { return rank(b) - rank(a) || (b._new ? 1 : 0) - (a._new ? 1 : 0); });
    var best = rank(items[0]), counts = {}, fresh = 0;
    items.forEach(function (it) { var r = A.ED[it.ed].rarity; counts[r] = (counts[r] || 0) + 1; if (it._new) fresh++; });
    var chips = A.RARITIES.slice().reverse().filter(function (r) { return counts[r.id]; }).map(function (r) {
      return '<span class="rar-chip r-' + r.id + '"><i></i>' + counts[r.id] + ' ' + r.label + '</span>';
    }).join('');

    var el = document.createElement('div');
    el.className = 'multi t-' + pack.theme;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Ouverture multiple');
    el.innerHTML =
      '<div class="mu-head"><p class="eyebrow">' + pack.name + ' × ' + opened + '</p>' +
        '<h2 class="op-title">' + items.length + ' cartes obtenues</h2>' +
        '<p class="mu-sub">' + (fresh ? fresh + (fresh > 1 ? ' nouveaux personnages · ' : ' nouveau personnage · ') : '') + 'Meilleure carte : ' + A.R[A.ED[items[0].ed].rarity].label + '</p>' +
        '<div class="mu-chips">' + chips + '</div></div>' +
      '<div class="mu-grid">' + items.map(function (it, i) {
        var ed = A.ED[it.ed];
        return '<button class="mu-item r-' + ed.rarity + (A.R[ed.rarity].rank >= 3 ? ' is-big' : '') + '" data-ed="' + it.ed + '" data-uid="' + it.uid + '" style="--d:' + (i * 45) + 'ms">' +
          U.card(it.ed, { serial: it.serial, open: false, newBadge: it._new, firstBadge: it.first }) + '</button>';
      }).join('') + '</div>' +
      '<div class="mu-foot"><button class="btn btn-gold btn-lg" data-mu-done>Ajouter à l’inventaire</button>' +
        (M.count(packId) >= 2 ? '<button class="btn btn-ghost-light btn-lg" data-mu-again>Encore ×' + M.count(packId) + '</button>' : '') + '</div>';
    document.body.appendChild(el);
    var html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    requestAnimationFrame(function () { el.classList.add('is-in'); });

    // Son : une petite distribution, puis l’effet de la meilleure rareté
    var deal = 0, tick = setInterval(function () {
      if (!el.isConnected || deal > Math.min(items.length, 14)) { clearInterval(tick); return; }
      SFX.deal(0.16, 0.7 + Math.random() * 0.4); deal++;
    }, 70);
    setTimeout(function () { if (el.isConnected && best >= 1) { SFX.reveal(best); A.haptic(best >= 3 ? [20, 40, 30] : 12); } }, 250);

    function close(again) {
      html.style.overflow = prev;
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); A.app.rerender(); if (again) M.open(packId, M.count(packId)); }, 260);
    }
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-mu-done]')) { close(false); return; }
      if (e.target.closest('[data-mu-again]')) { close(true); return; }
      var it = e.target.closest('.mu-item');
      if (it) U.openCard(it.getAttribute('data-ed'), it.getAttribute('data-uid'));
    });
  };
})(window.ATLAS);
