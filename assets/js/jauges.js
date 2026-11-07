/* ATLAS — page temporaire #/jauges : 6 propositions de jauge pour les étagères de la page Collections.
   À supprimer une fois le choix fait. */
(function (A) {
  'use strict';
  var U = A.ui, I = function (n) { return U.icon(n); };

  // Données de démonstration : 4 collections à 40 %, 29 %, 0 % et 100 %
  var DEMO = [
    { name: 'Mythologie grecque', subs: [[7, 6], [9, 9], [8, 0], [8, 1], [8, 0]] },
    { name: 'Égypte ancienne', subs: [[8, 5], [9, 0]] },
    { name: 'L’Espace', subs: [[9, 0], [9, 0], [9, 0], [8, 0], [8, 0]] },
    { name: 'Contes et légendes', subs: [[8, 8], [8, 8], [8, 8]] }
  ];
  DEMO.forEach(function (d) {
    d.total = 0; d.owned = 0; d.done = 0;
    d.subs.forEach(function (s) { d.total += s[0]; d.owned += s[1]; if (s[1] >= s[0]) d.done++; });
    d.pct = d.owned / d.total; d.p = Math.round(d.pct * 100); d.full = d.p >= 100;
  });
  function meta(d) { return '<p class="sh-meta">' + d.owned + '/' + d.total + ' personnages · ' + d.done + '/' + d.subs.length + ' complètes</p>'; }
  function head(d, right, below) {
    return '<div class="jg-row"><div class="shelf-head"><div class="sh-copy"><h2 class="sh-name">' + d.name + '</h2>' + meta(d) + '</div>' + (right || '') + I('chevR') + '</div>' + (below || '') + '</div>';
  }

  var V = [
    ['A', 'Barre fine', 'Un fil doré sous le titre, le pourcentage discret à droite.', function (d) {
      return head(d, '<span class="jA-p">' + (d.full ? I('check') : d.p + ' %') + '</span>', '<div class="jA-bar' + (d.full ? ' is-full' : '') + '"><i style="width:' + d.p + '%"></i></div>');
    }],
    ['B', 'Pastilles', 'Un rond par sous-collection : plein si complète, en partie rempli si commencée.', function (d) {
      return head(d, '<span class="jB">' + d.subs.map(function (s) {
        var p = Math.round(s[1] / s[0] * 100);
        return '<i class="' + (p >= 100 ? 'is-full' : p > 0 ? 'is-part' : '') + '" style="--p:' + p + '%">' + (p >= 100 ? I('check') : '') + '</i>';
      }).join('') + '</span>');
    }],
    ['C', 'Chiffre seul', 'Pas de jauge : le pourcentage en grand, et un laurier à 100 %.', function (d) {
      return head(d, d.full ? '<span class="jC is-full">' + I('laurel') + '<small>Complète</small></span>' : '<span class="jC"><b>' + d.p + '<em> %</em></b><small>complété</small></span>');
    }],
    ['D', 'Barre de jeu', 'Barre épaisse façon expérience, avec reflet et compteur.', function (d) {
      return head(d, '', '<div class="jD' + (d.full ? ' is-full' : '') + '"><div class="jD-bar"><i style="width:' + Math.max(d.p, 0) + '%"></i></div><span>' + (d.full ? 'Complète' : d.owned + ' / ' + d.total) + '</span></div>');
    }],
    ['E', 'Médaille de rang', 'Un rang qui monte avec la progression : Bronze, Argent, Or, puis Complète.', function (d) {
      var t = d.full ? ['full', 'Complète'] : d.p >= 67 ? ['or', 'Or'] : d.p >= 34 ? ['argent', 'Argent'] : d.p > 0 ? ['bronze', 'Bronze'] : ['none', 'À commencer'];
      return head(d, '<span class="jE is-' + t[0] + '">' + I(d.full ? 'laurel' : 'medal') + '<span><b>' + t[1] + '</b>' + (d.full || !d.p ? '' : '<small>' + d.p + ' %</small>') + '</span></span>');
    }],
    ['F', 'Étoiles de palier', 'Trois étoiles : un tiers, deux tiers, collection complète.', function (d) {
      var n = d.full ? 3 : d.p >= 67 ? 2 : d.p >= 34 ? 1 : 0;
      return head(d, '<span class="jF">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < n ? 'is-on' : '') + '">' + I('star') + '</i>'; }).join('') + '</span>');
    }]
  ];

  var CSS = '<style>' +
    '.jg-v { padding: 26px 0 10px; border-top: 2px solid var(--ink); }' +
    '.jg-v:first-child { border-top: 0; }' +
    '.jg-t { display: flex; align-items: baseline; gap: 10px; margin: 0 0 2px; }' +
    '.jg-t b { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--ink); color: #fff; font-family: var(--serif); font-size: 18px; }' +
    '.jg-t span { font-family: var(--serif); font-weight: 600; font-size: 22px; }' +
    '.jg-d { margin: 0 0 8px; font-size: 13px; color: var(--ink-3); }' +
    '.jg-row { padding: 12px 0 10px; border-top: 1px solid var(--line); }' +
    '.jg-row .shelf-head { padding: 0; align-items: center; }' +
    '.jg-row .sh-name { font-size: 20px; }' +
    /* A */
    '.jA-p { flex: none; font-size: 13px; font-weight: 600; color: var(--ink-3); font-variant-numeric: tabular-nums; }' +
    '.jA-p .ic { width: 16px; height: 16px; color: var(--ok); }' +
    '.jA-bar { height: 2px; margin-top: 10px; background: var(--line-2); border-radius: 1px; }' +
    '.jA-bar i { display: block; height: 100%; background: var(--gold); border-radius: 1px; }' +
    '.jA-bar.is-full i { background: var(--ok); }' +
    /* B */
    '.jB { flex: none; display: flex; gap: 5px; }' +
    '.jB i { width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1.5px var(--line-2); }' +
    '.jB i.is-part { background: radial-gradient(closest-side, var(--bg) 52%, transparent 54%), conic-gradient(var(--gold) var(--p), var(--line-2) 0); box-shadow: none; }' +
    '.jB i.is-full { background: linear-gradient(135deg, #D9B871, #A9823F); box-shadow: 0 1px 3px rgba(169,130,63,.4); color: #fff; }' +
    '.jB i .ic { width: 10px; height: 10px; stroke-width: 3; }' +
    /* C */
    '.jC { flex: none; display: flex; flex-direction: column; align-items: flex-end; line-height: 1; }' +
    '.jC b { font-family: var(--serif); font-size: 30px; font-weight: 600; color: var(--gold); }' +
    '.jC small { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-top: 3px; }' +
    '.jC b em { font-style: normal; font-size: 16px; color: var(--ink-3); }' + '.jC.is-full { color: var(--gold); }' +
    '.jC.is-full .ic { width: 30px; height: 30px; }' +
    /* D */
    '.jD { display: flex; align-items: center; gap: 10px; margin-top: 10px; }' +
    '.jD-bar { flex: 1; height: 12px; border-radius: 6px; background: #E6DFD2; box-shadow: inset 0 1px 2px rgba(0,0,0,.12); overflow: hidden; }' +
    '.jD-bar i { display: block; height: 100%; border-radius: 6px; background: linear-gradient(180deg, #E7CB8A, #B08A44); box-shadow: inset 0 1px 0 rgba(255,255,255,.55); }' +
    '.jD.is-full .jD-bar i { background: linear-gradient(180deg, #8FCB8A, #4E8F48); }' +
    '.jD span { flex: none; min-width: 58px; text-align: right; font-size: 12px; font-weight: 600; color: var(--ink-2); font-variant-numeric: tabular-nums; }' +
    /* E */
    '.jE { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px 5px 6px; border-radius: 999px; border: 1px solid; }' +
    '.jE .ic { width: 22px; height: 22px; }' +
    '.jE > span { display: flex; flex-direction: column; line-height: 1.05; }' +
    '.jE b { font-size: 12px; font-weight: 600; }' +
    '.jE small { font-size: 10px; opacity: .75; }' +
    '.jE.is-none { color: var(--ink-3); border-color: var(--line-2); }' +
    '.jE.is-bronze { color: #9A5B2E; border-color: #D9B096; background: #FBF1EA; }' +
    '.jE.is-argent { color: #6B7480; border-color: #C9CFD6; background: #F3F5F7; }' +
    '.jE.is-or { color: #9A7426; border-color: #E2C887; background: #FCF5E3; }' +
    '.jE.is-full { color: #fff; border-color: transparent; background: linear-gradient(135deg, #D9B871, #A9823F); box-shadow: 0 2px 8px rgba(169,130,63,.35); }' +
    /* F */
    '.jF { flex: none; display: flex; gap: 2px; }' +
    '.jF i { color: var(--line-2); }' +
    '.jF i .ic { width: 22px; height: 22px; }' +
    '.jF i.is-on { color: var(--gold); }' +
    '.jF i.is-on .ic { fill: currentColor; filter: drop-shadow(0 1px 2px rgba(169,130,63,.4)); }' +
    '</style>';

  A.pages.jauges = {
    title: 'Propositions de jauges',
    render: function () {
      return CSS + '<section class="page-head"><div class="container"><p class="eyebrow">Choix en cours</p><h1 class="h1">Jauges de collection</h1>' +
        '<p class="lead">Six propositions, chacune sur les mêmes collections (40 %, 29 %, 0 %, 100 %). Dites-moi la lettre retenue.</p></div></section>' +
        '<section class="section-tight"><div class="container">' + V.map(function (v) {
          return '<div class="jg-v"><p class="jg-t"><b>' + v[0] + '</b><span>' + v[1] + '</span></p><p class="jg-d">' + v[2] + '</p>' + DEMO.map(v[3]).join('') + '</div>';
        }).join('') + '</div></section>';
    }
  };
})(window.ATLAS);
