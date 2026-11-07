/* ATLAS — page temporaire #/sachets : 4 propositions de design pour le Booster Atlas (sans illustration de collection).
   À supprimer une fois le choix fait. */
(function (A) {
  'use strict';
  var U = A.ui;
  var V = [   // Booster quotidien : motif Cadran (soleil), tons profonds
    ['1', 'cadran', 'd-amethyste', 'Améthyste', 'Prune profond et or.'],
    ['2', 'cadran', 'd-petrole', 'Pétrole', 'Bleu-vert sombre et or.'],
    ['3', 'cadran', 'd-cognac', 'Cognac', 'Ambre brun et or.'],
    ['4', 'cadran', 'd-anthracite', 'Anthracite', 'Gris graphite et argent.']
  ];
  function packs() {
    return V.map(function (v) {
      var id = 'demo-' + v[2];
      if (!A.PACK[id]) A.PACK[id] = Object.assign({}, A.PACK.daily, { id: id, design: v[1], theme: v[2] });
      return A.PACK[id];
    });
  }
  A.pages.sachets = {
    title: 'Propositions de sachet',
    mount: function (root) { A.pack.mountAll(root); },
    render: function () {
      var P = packs();
      return '<style>' +
        '.sc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 14px; }' +
        '.sc-item { display: flex; flex-direction: column; align-items: center; text-align: center; }' +
        '.sc-item .pk { --pk-w: min(150px, 38vw); margin: 10px 0 18px; }' +
        '.sc-item b { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--ink); color: #fff; font-family: var(--serif); font-size: 16px; margin-bottom: 4px; }' +
        '.sc-item h3 { margin: 0; font-family: var(--serif); font-size: 20px; }' +
        '.sc-item p { margin: 2px 0 0; font-size: 12px; color: var(--ink-3); line-height: 1.45; }' +
        '@media (min-width: 900px) { .sc-grid { grid-template-columns: repeat(4, 1fr); } .sc-item .pk { --pk-w: 190px; } }' +
        '</style>' +
        '<section class="page-head"><div class="container"><p class="eyebrow">Choix en cours</p><h1 class="h1">Le Booster quotidien</h1>' +
        '<p class="lead">Un motif à lui : un soleil gravé, comme un cadran solaire, pour le booster de chaque jour. Quatre tons profonds, dans la famille du Booster Atlas (émeraude), du Coffret (bordeaux), de la Saga (bleu nuit) et du Pack Ultime (noir). Dites-moi le numéro.</p></div></section>' +
        '<section class="section-tight"><div class="container"><div class="sc-grid">' + P.map(function (p, i) {
          var v = V[i];
          return '<div class="sc-item">' + A.pack.html(p, { tilt: true }) + '<b>' + v[0] + '</b><h3>' + v[3] + '</h3><p>' + v[4] + '</p></div>';
        }).join('') + '</div></div></section>';
    }
  };
})(window.ATLAS);
