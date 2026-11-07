/* ATLAS — page temporaire #/sachets : 4 propositions de design pour le Booster Atlas (sans illustration de collection).
   À supprimer une fois le choix fait. */
(function (A) {
  'use strict';
  var U = A.ui;
  var V = [   // motif Astrolabe, du plus simple au plus chic
    ['1', 'astrolabe', 'c-ciel', 'Bleu ciel', 'Basique et doux, motif bleu marine.'],
    ['2', 'astrolabe', 'c-sauge', 'Sauge', 'Vert tendre, motif doré pâle.'],
    ['3', 'astrolabe', 'c-lavande', 'Lavande', 'Lilas poudré, motif doré.'],
    ['4', 'astrolabe', 'c-terracotta', 'Terracotta', 'Argile chaude, très tendance.'],
    ['5', 'astrolabe', 'c-mocha', 'Mocha', 'Brun café crème, couleur de l’année 2025.'],
    ['6', 'astrolabe', 'c-chrome', 'Chrome', 'Argent métallisé, motif graphite.'],
    ['7', 'astrolabe', 'c-nuit', 'Bleu nuit', 'Le classique, motif or.'],
    ['8', 'astrolabe', 'c-emeraude', 'Émeraude', 'Vert profond et or.'],
    ['9', 'astrolabe', 'c-bordeaux', 'Bordeaux', 'Rouge vin et or.'],
    ['10', 'astrolabe', 'c-noir', 'Noir & or', 'Le plus chic : noir laqué et or vif.']
  ];
  function packs() {
    return V.map(function (v) {
      var id = 'demo-' + v[2];
      if (!A.PACK[id]) A.PACK[id] = Object.assign({}, A.PACK.standard, { id: id, design: v[1], theme: v[2] });
      return A.PACK[id];
    });
  }
  A.pages.sachets = {
    title: 'Propositions de sachet',
    mount: function (root) { A.pack.mountAll(root); },   // pas d’animation permanente : 10 sachets à l’écran
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
        '<section class="page-head"><div class="container"><p class="eyebrow">Choix en cours</p><h1 class="h1">Booster Atlas : les coloris</h1>' +
        '<p class="lead">Le motif Astrolabe en dix coloris, du plus simple au plus chic. Faites-les tourner du doigt, puis dites-moi le numéro.</p></div></section>' +
        '<section class="section-tight"><div class="container"><div class="sc-grid">' + P.map(function (p, i) {
          var v = V[i];
          return '<div class="sc-item">' + A.pack.html(p, { tilt: true }) + '<b>' + v[0] + '</b><h3>' + v[3] + '</h3><p>' + v[4] + '</p></div>';
        }).join('') + '</div></div></section>';
    }
  };
})(window.ATLAS);
