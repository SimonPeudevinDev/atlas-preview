/* ==========================================================================
   ATLAS — Variantes de cartes (page de test #/variantes)
   --------------------------------------------------------------------------
   Pistes pour un design plus « TCG » : 5 propositions par rareté.
   Chaque proposition = une mise en page (V1 à V5) + la finition de la rareté
   (papier, argent brossé, prisme violet, feuille d’or, braise, noir et or).
   Les cartes gardent la classe .card[data-tilt] : inclinaison et reflets
   viennent du gestionnaire commun (ui.js). Le choix préféré de chaque rareté
   est gardé sur l’appareil (localStorage), pour en discuter ensuite.
   ========================================================================== */
(function (A) {
  'use strict';
  var U = A.ui, P = A.pages;
  var ST = { ch: 'grece-zeus', bg: 'page' };
  var PICK_KEY = 'atlas-variantes-choix';
  var uid = 0;

  /* Mises en page : même ordre pour toutes les raretés */
  var LAYOUTS = [
    { id: 1, name: 'Arène', note: 'Bandeau du nom, puissance en pastille, encadré de texte et trois gemmes de stats.' },
    { id: 2, name: 'Plein art', note: 'L’illustration occupe toute la carte, le texte flotte sur un voile.' },
    { id: 3, name: 'Blason', note: 'Arche de musée, joyaux aux coins, stats en hexagones, nom sur ruban.' },
    { id: 4, name: 'Éclat', note: 'Coupe en biais, grand chiffre de puissance, jauges de stats.' },
    { id: 5, name: 'Médaillon', note: 'Portrait en médaillon sur rayons, nom en arc, plaques gravées.' }
  ];
  /* Finition de chaque rareté (rappel en tête de section) */
  var FINISH = {
    base: 'Papier ivoire mat, encre sépia, filets gravés.',
    rare: 'Argent brossé, bleu ardoise, reflet froid qui balaie la carte.',
    epic: 'Fond violet profond, cadre et reflets prismatiques.',
    legendary: 'Feuille d’or, rayons solaires, paillettes.',
    mythic: 'Obsidienne et rouge braise, lueur qui pulse.',
    unique: 'Noir et or, holographie galaxie, tampon 1/1.'
  };
  var LETTER = { base: 'B', rare: 'R', epic: 'E', legendary: 'L', mythic: 'M', unique: 'U' };

  function picks(v) {
    try {
      if (v) localStorage.setItem(PICK_KEY, JSON.stringify(v));
      return JSON.parse(localStorage.getItem(PICK_KEY) || '{}') || {};
    } catch (e) { return v || {}; }
  }
  var MAX = null;
  function maxStats() {
    if (MAX) return MAX;
    MAX = { atk: 1, def: 1, esp: 1 };
    A.CHARS.forEach(function (c) { ['atk', 'def', 'esp'].forEach(function (k) { if (c[k] > MAX[k]) MAX[k] = c[k]; }); });
    return MAX;
  }
  function chars() { return A.CHARS.filter(function (c) { return c.editions.length === A.RARITIES.length; }); }
  function serialOf(ed) {
    if (ed.supply == null) return 'Tirage libre';
    if (ed.supply === 1) return '1/1';
    var n = Math.max(1, Math.round(ed.supply * 0.07));
    return String(n).padStart(String(ed.supply).length, '0') + '/' + ed.supply;
  }
  var STATS = [['atk', 'ATQ', 'swords'], ['def', 'DÉF', 'shield'], ['esp', 'ESP', 'sparkle']];
  function gem(r) { return '<span class="vx-gem" aria-hidden="true"><i></i></span>'; }
  function art(ed) { return '<div class="vx-art">' + A.editionArt(ed, { ctx: 'card' }) + '</div>'; }

  /* ---------- Les cinq mises en page ---------- */
  function L1(d) {
    return '<header class="vx-head"><h3 class="vx-name">' + d.name + '</h3><span class="vx-pow"><b>' + d.pow + '</b><small>PUI</small></span></header>' +
      '<div class="vx-win">' + art(d.ed) + '<span class="vx-holo"></span><span class="vx-sym">' + gem() + '</span></div>' +
      '<div class="vx-type"><span>' + d.title + '</span><span>' + d.coll + '</span></div>' +
      '<div class="vx-box"><p>' + d.bio + '</p></div>' +
      '<footer class="vx-foot">' + STATS.map(function (s) {
        return '<span class="vx-st"><i>' + U.icon(s[2]) + '</i><b>' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>';
      }).join('') + '<span class="vx-ser">' + d.serial + '</span></footer>';
  }
  function L2(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span><span class="vx-ser">' + d.serial + '</span>' +
      '<div class="vx-low"><p class="vx-kick">' + d.coll + '</p><h3 class="vx-name">' + d.name + '</h3><p class="vx-title">' + d.title + '</p>' +
        '<div class="vx-chips">' + STATS.map(function (s) { return '<span><small>' + s[1] + '</small><b>' + d.ch[s[0]] + '</b></span>'; }).join('') +
        '<span class="is-pow"><small>PUI</small><b>' + d.pow + '</b></span></div></div>';
  }
  function L3(d) {
    return '<div class="vx-arch">' + art(d.ed) + '<span class="vx-holo"></span></div>' +
      '<i class="vx-j j1"></i><i class="vx-j j2"></i><i class="vx-j j3"></i><i class="vx-j j4"></i>' +
      '<div class="vx-hex">' + STATS.map(function (s) { return '<span><b>' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>'; }).join('') + '</div>' +
      '<div class="vx-ribbon"><h3 class="vx-name">' + d.name + '</h3></div>' +
      '<p class="vx-title">' + d.title + '</p>' +
      '<footer class="vx-foot"><span>' + d.coll + '</span><span class="vx-mid">' + gem() + '</span><span class="vx-ser">' + d.serial + '</span></footer>';
  }
  function L4(d) {
    var M = maxStats();
    return '<div class="vx-cut">' + art(d.ed) + '<span class="vx-holo"></span></div>' +
      '<span class="vx-letter" aria-hidden="true">' + d.letter + '</span>' +
      '<div class="vx-power"><b>' + d.pow + '</b><small>Puissance</small></div>' +
      '<div class="vx-panel"><h3 class="vx-name">' + d.name + '</h3><p class="vx-title">' + d.title + '</p>' +
        '<div class="vx-bars">' + STATS.map(function (s) {
          return '<span><small>' + s[1] + '</small><i style="--w:' + Math.round(d.ch[s[0]] / M[s[0]] * 100) + '%"></i><b>' + d.ch[s[0]] + '</b></span>';
        }).join('') + '</div>' +
        '<p class="vx-meta"><span>' + d.coll + '</span><span class="vx-ser">' + d.serial + '</span></p></div>';
  }
  function L5(d) {
    var id = 'vxarc' + (++uid);
    return '<span class="vx-rays" aria-hidden="true"></span>' +
      '<svg class="vx-arc" viewBox="0 0 200 46" aria-hidden="true"><path id="' + id + '" d="M14 42 Q100 -6 186 42" fill="none"/>' +
        '<text><textPath href="#' + id + '" startOffset="50%" text-anchor="middle">' + d.name + '</textPath></text></svg>' +
      '<div class="vx-medal">' + art(d.ed) + '<span class="vx-holo"></span></div>' +
      '<p class="vx-title">' + d.title + '</p>' +
      '<div class="vx-plaq">' + STATS.map(function (s) { return '<span><small>' + s[1] + '</small><b>' + d.ch[s[0]] + '</b></span>'; }).join('') + '</div>' +
      '<footer class="vx-foot"><span>' + d.coll + '</span><span class="vx-mid">' + gem() + d.rlabel + '</span><span class="vx-ser">' + d.serial + '</span></footer>';
  }
  /* ---------- Piste B2 poussée : cinq cartes « plein art » (2A à 2E) ---------- */
  var B2 = [
    { id: '2a', name: 'Vitrine', note: 'La B2 affinée : filet intérieur, nom en métal, puissance en médaillon, stats à pictogrammes.' },
    { id: '2b', name: 'Tranche', note: 'Le nom court à la verticale dans une bande à la couleur de la rareté.' },
    { id: '2c', name: 'Affiche', note: 'Grand titre en capitales en haut, barre de stats pleine largeur, numéro en fanion.' },
    { id: '2d', name: 'Sans bord', note: 'Illustration bord à bord, plaque gravée aux coins coupés, gemme au centre.' },
    { id: '2e', name: 'Gravure', note: 'Illustration striée de cercles gravés, chiffres en métal, aucune boîte.' }
  ];
  function chipsIco(d) {
    return STATS.map(function (s) { return '<span><i>' + U.icon(s[2]) + '</i><b>' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>'; }).join('');
  }
  function P2a(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span><span class="vx-filet"></span>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span><span class="vx-ser">' + d.serial + '</span>' +
      '<div class="vx-low"><p class="vx-kick">' + d.coll + '</p><h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p>' +
        '<div class="vx-chips">' + chipsIco(d) + '</div></div>' +
      '<span class="vx-medal-pow"><b>' + d.pow + '</b><small>PUI</small></span>';
  }
  function P2b(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span>' +
      '<div class="vx-band"><h3 class="vx-name">' + d.name + '</h3>' + gem() + '</div>' +
      '<span class="vx-ser">' + d.serial + '</span>' +
      '<div class="vx-low"><p class="vx-kick">' + d.coll + ' · ' + d.rlabel + '</p><p class="vx-title">' + d.title + '</p>' +
        '<div class="vx-stack">' + STATS.map(function (s) { return '<span><small>' + s[1] + '</small><b>' + d.ch[s[0]] + '</b></span>'; }).join('') +
        '<span class="is-pow"><small>PUI</small><b>' + d.pow + '</b></span></div></div>';
  }
  function P2c(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<div class="vx-top"><p class="vx-kick">' + d.coll + '</p><h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p></div>' +
      '<span class="vx-pennant">' + gem() + '<b>' + d.serial + '</b></span>' +
      '<div class="vx-strip">' + STATS.map(function (s) { return '<span><i>' + U.icon(s[2]) + '</i><b>' + d.ch[s[0]] + '</b></span>'; }).join('') +
        '<span class="is-pow"><b>' + d.pow + '</b><small>' + d.rlabel + '</small></span></div>';
  }
  function P2d(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span>' +
      '<span class="vx-ser">' + d.serial + '</span>' +
      '<div class="vx-plate"><span class="vx-plate-gem">' + gem() + '</span><h3 class="vx-name">' + d.name + '</h3><p class="vx-title">' + d.title + ' · ' + d.coll + '</p>' +
        '<div class="vx-row3">' + STATS.map(function (s) { return '<span><small>' + s[1] + '</small><b>' + d.ch[s[0]] + '</b></span>'; }).join('') +
        '<span class="is-pow"><small>PUI</small><b>' + d.pow + '</b></span></div></div>';
  }
  function P2e(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<div class="vx-top is-left"><h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p></div>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span>' +
      '<div class="vx-low"><div class="vx-nums">' + STATS.map(function (s) { return '<span><b class="vx-metal">' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>'; }).join('') +
        '<span class="is-pow"><b class="vx-metal">' + d.pow + '</b><small>Puissance</small></span></div>' +
        '<p class="vx-meta"><span>' + d.coll + '</span><span class="vx-ser">' + d.serial + '</span></p></div>';
  }

  /* ---------- Brillances : la même carte, plusieurs finitions de reflet ----------
     Chaque brillance = un calque .vx-sh (deux pseudo-éléments) piloté par la position de la lumière
     (--lx/--ly : animées au repos, sinon le doigt ou la souris). Le cadre métallique suit aussi la lumière. */
  /* Finitions holographiques façon cartes de jeu (couches d’arc-en-ciel en color-dodge + reflet qui suit la lumière) */
  /* Finitions texturées : un motif en relief, léger partout, dont les sillons s’irisent sous la lumière */
  var SHINES = [
    { id: 'grave', name: 'Gravure', note: 'Stries fines obliques, comme une plaque gravée au burin.' },
    { id: 'empreinte', name: 'Empreinte', note: 'Ondes concentriques qui partent du bas de la carte, façon empreinte.' },
    { id: 'soleil', name: 'Éclat solaire', note: 'Rayons très fins qui partent du sujet, reflet au métal de la rareté.' },
    { id: 'ecailles', name: 'Écailles', note: 'Petites écailles en relief, irisées comme une peau de dragon.' },
    { id: 'guilloche', name: 'Guilloché', note: 'Lignes ondulées entrelacées, comme sur un billet de banque.' },
    { id: 'topo', name: 'Courbes de niveau', note: 'Lignes de relief d’une carte topographique, organiques.' },
    { id: 'craquele', name: 'Craquelé', note: 'Fines veines de glace brisée qui s’allument dans le reflet.' },
    { id: 'martele', name: 'Métal martelé', note: 'Vrai relief de métal battu, éclats au métal de la rareté.' }
  ];
  var SHINE = { actuel: { id: 'actuel', name: 'Actuelle' } };
  SHINES.forEach(function (s) { SHINE[s.id] = s; });

  var BUILD = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, '2a': P2a, '2b': P2b, '2c': P2c, '2d': P2d, '2e': P2e };
  var KIND = {};
  LAYOUTS.forEach(function (L) { KIND[L.id] = L; });
  B2.forEach(function (L) { KIND[L.id] = L; L.full = true; });

  /** Carte variante : rareté r, mise en page k (1 à 5, ou 2a à 2e pour la piste B2) */
  function vcard(r, k, shine) {
    var ch = A.CHAR[ST.ch], ed = A.ED[ch.id + '-' + r], R = A.R[r], co = A.COLL[ch.coll], K = KIND[k];
    var sh = shine || ST.sh || 'actuel', shCls = sh !== 'actuel' ? ' has-sh sh-' + sh : '';
    var d = {
      ch: ch, ed: ed, name: U.esc(ch.name), title: U.esc(ch.title), coll: U.esc(co.name), bio: U.esc(ch.bio || ch.title),
      pow: ch.atk + ch.def + ch.esp, serial: serialOf(ed), rlabel: R.label, letter: LETTER[r]
    };
    var code = K.full ? k.toUpperCase() + ' · ' + K.name + ' · ' + R.label : LETTER[r] + k + ' · ' + K.name + ' · ' + R.label;
    if (sh !== 'actuel') code += ' · ' + SHINE[sh].name;
    return '<article class="card vx vx-r-' + r + ' vx-L' + k + (K.full ? ' vx-full' : '') + shCls + (ch.name.length > 12 ? ' is-long' : '') + '"' + (shCls ? '' : ' data-tilt') + ' data-vx="' + r + ':' + k + '" data-code="' + code + '" tabindex="0" aria-label="' + d.name + ', ' + R.label + ', ' + K.name + '">' +
      '<div class="card-inner"><div class="vx-in">' + BUILD[k](d) + '</div><span class="vx-foil"></span><span class="vx-glare"></span>' +
      (shCls ? '<span class="vx-sh"></span><span class="vx-gl"></span>' : '') + '</div></article>';
  }

  /* Section Brillances : la déclinaison B2 retenue, dans la rareté choisie, avec chaque brillance */
  function shineHTML() {
    var pk = picks(), k = pk.b2 || '2a', r = ST.shr || 'unique', sel = ST.sh;
    return '<section class="vx-sec vx-b2 vx-shines" id="vx-brillance">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Brillances</h2>' +
        '<p>La carte ' + k.toUpperCase() + ' avec huit finitions texturées. La lumière bouge seule ; survolez une carte, ou ouvrez-la en grand et glissez le doigt dessus. La brillance choisie s’applique à toute la page.</p>' +
        '<span class="vx-chosen">Votre choix : ' + SHINE[sel].name + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Rareté">' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-shr="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row">' + SHINES.map(function (s) {
        var on = sel === s.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, k, s.id) +
          '<figcaption><p class="vx-code">' + s.name + '</p><p class="vx-note">' + s.note + '</p>' +
          '<button class="vx-pick" data-vx-pick="shine:' + s.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button></figcaption></figure>';
      }).join('') + '</div></section>';
  }

  /* Atelier B2 : cinq déclinaisons dans la rareté choisie, puis la gamme complète de la déclinaison retenue */
  function b2HTML() {
    var pk = picks(), sel = pk.b2 || '2a', r = ST.b2r || 'legendary';
    return '<section class="vx-sec vx-b2" id="vx-b2">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Piste B2 · Plein art, poussé</h2>' +
        '<p>Cinq façons d’aller plus loin avec l’illustration pleine carte. Changez de rareté pour comparer.</p>' +
        '<span class="vx-chosen">Votre choix : ' + sel.toUpperCase() + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Rareté">' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-b2r="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row">' + B2.map(function (L) {
        var on = sel === L.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, L.id) +
          '<figcaption><p class="vx-code"><b>' + L.id.toUpperCase() + '</b> ' + L.name + '</p><p class="vx-note">' + L.note + '</p>' +
          '<button class="vx-pick" data-vx-pick="b2:' + L.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button></figcaption></figure>';
      }).join('') + '</div>' +
      '<h3 class="vx-sub">La gamme ' + sel.toUpperCase() + ' · ' + KIND[sel].name + ', de Base à Unique</h3>' +
      '<div class="vx-row is-range">' + A.RARITIES.map(function (R) {
        return '<figure class="vx-cell">' + vcard(R.id, sel) + '<figcaption><p class="vx-code"><b>' + LETTER[R.id] + '</b> ' + R.label + '</p></figcaption></figure>';
      }).join('') + '</div></section>';
  }

  function board() {
    var pk = picks();
    ST.sh = SHINE[pk.shine] ? pk.shine : 'actuel';
    return b2HTML() + shineHTML() + A.RARITIES.map(function (R) {
      return '<section class="vx-sec" id="vx-' + R.id + '">' +
        '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot r-' + R.id + '"></i>' + R.label + '</h2>' +
          '<p>' + FINISH[R.id] + '</p>' +
          '<span class="vx-chosen" data-vx-chosen="' + R.id + '">' + (pk[R.id] ? 'Votre choix : ' + LETTER[R.id] + pk[R.id] : 'Aucun choix') + '</span></header>' +
        '<div class="vx-row">' + LAYOUTS.map(function (L) {
          var on = +pk[R.id] === L.id;
          return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(R.id, L.id) +
            '<figcaption><p class="vx-code"><b>' + LETTER[R.id] + L.id + '</b> ' + L.name + '</p><p class="vx-note">' + L.note + '</p>' +
            '<button class="vx-pick" data-vx-pick="' + R.id + ':' + L.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button></figcaption></figure>';
        }).join('') + '</div></section>';
    }).join('');
  }

  P.variants = {
    title: 'Variantes de cartes',
    render: function (ctx) {
      if (ctx.query.perso && A.CHAR[ctx.query.perso] && A.CHAR[ctx.query.perso].editions.length === A.RARITIES.length) ST.ch = ctx.query.perso;
      if (!A.CHAR[ST.ch]) ST.ch = chars()[0].id;
      return '<section class="page-head"><div class="container"><p class="eyebrow">Atelier de design · test</p><h1 class="h1">Variantes de cartes</h1>' +
        '<p class="lead">Cinq propositions par rareté pour des cartes plus « jeu de cartes ». Touchez une carte pour la voir en grand, puis choisissez votre préférée dans chaque rareté.</p></div></section>' +
        '<section class="section-tight"><div class="container">' +
        '<div class="sticky-bar vx-bar">' +
          '<label class="select is-compact" title="Personnage"><select data-vx-ch aria-label="Personnage">' + A.COLLECTIONS.map(function (co) {
            var list = chars().filter(function (c) { return c.coll === co.id; });
            return list.length ? '<optgroup label="' + U.esc(co.name) + '">' + list.map(function (c) {
              return '<option value="' + c.id + '"' + (c.id === ST.ch ? ' selected' : '') + '>' + U.esc(c.name) + '</option>';
            }).join('') + '</optgroup>' : '';
          }).join('') + '</select></label>' +
          '<div class="vx-bgs" role="group" aria-label="Fond">' + [['page', 'Page'], ['nuit', 'Nuit'], ['table', 'Tapis']].map(function (b) {
            return '<button class="chip' + (ST.bg === b[0] ? ' is-active' : '') + '" data-vx-bg="' + b[0] + '">' + b[1] + '</button>';
          }).join('') + '</div>' +
          '<nav class="vx-jump" aria-label="Aller à une rareté">' + [{ id: 'b2', label: 'Piste B2' }, { id: 'brillance', label: 'Brillances' }].concat(A.RARITIES).map(function (r) {
            return '<a class="chip chip-r r-' + r.id + '" href="#/variantes" data-vx-go="' + r.id + '"><i></i>' + r.label + '</a>';
          }).join('') + '</nav>' +
        '</div>' +
        '<div class="vx-board bg-' + ST.bg + '" data-vx-board>' + board() + '</div></div></section>';
    },
    mount: function (root) {
      var boardEl = root.querySelector('[data-vx-board]'), io = null;
      // Animations de finition seulement pour les cartes visibles (économie de batterie sur iPhone)
      function watch() {
        if (io) io.disconnect();
        if (!('IntersectionObserver' in window)) { root.querySelectorAll('.vx').forEach(function (c) { c.classList.add('is-vis'); }); return; }
        io = new IntersectionObserver(function (en) { en.forEach(function (e) { e.target.classList.toggle('is-vis', e.isIntersecting); }); }, { rootMargin: '80px' });
        root.querySelectorAll('.vx-row .vx').forEach(function (c) { io.observe(c); });
      }
      watch();
      /* Lumière des cartes holographiques : --tx/--ty (0 à 1) et --hyp (distance au centre).
         Au repos, une animation CSS la promène ; sous la souris ou le doigt, elle suit le pointeur. */
      function setLight(c, x, y) {
        x = Math.max(0, Math.min(1, x)); y = Math.max(0, Math.min(1, y));
        c.style.setProperty('--tx', x.toFixed(3)); c.style.setProperty('--ty', y.toFixed(3));
        c.style.setProperty('--hyp', Math.min(1, Math.hypot(x - 0.5, y - 0.5) / 0.7).toFixed(3));
      }
      function unlive(c) { if (!c) return; c.classList.remove('is-live'); ['--tx', '--ty', '--hyp'].forEach(function (p) { c.style.removeProperty(p); }); }
      var live = null;
      root.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var c = e.target.closest('.vx.has-sh');
        if (c !== live) { unlive(live); live = c; }
        if (!c) return;
        var b = c.getBoundingClientRect();
        c.classList.add('is-live');
        setLight(c, (e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height);
      }, { passive: true });
      root.addEventListener('pointerleave', function () { unlive(live); live = null; });
      function redraw() {
        var y = window.scrollY, xs = [].map.call(root.querySelectorAll('.vx-row'), function (r) { return r.scrollLeft; });
        boardEl.innerHTML = board();
        root.querySelectorAll('.vx-row').forEach(function (r, i) { r.scrollLeft = xs[i] || 0; });
        window.scrollTo({ top: y, behavior: 'instant' });
        watch();
      }
      function zoom(card) {
        var box = document.createElement('div');
        box.className = 'vx-zoom';
        box.innerHTML = '<button class="cv-close" aria-label="Fermer">' + U.icon('close') + '</button><div class="vx-zoom-stage">' + card.outerHTML + '</div><p class="cv-hint">' + U.esc(card.getAttribute('data-code') || '') + '</p>';
        var c = box.querySelector('.vx'), stage = box.querySelector('.vx-zoom-stage');
        c.classList.add('is-vis'); c.removeAttribute('tabindex');
        c.classList.remove('is-live', 'is-hover'); ['--tx', '--ty', '--hyp', '--rx', '--ry', '--mx', '--my', '--px', '--py', '--fa'].forEach(function (p) { c.style.removeProperty(p); });
        if (c.classList.contains('has-sh')) {
          // En grand : la carte s’incline et la lumière suit le doigt, avec un léger amorti
          var tgt = null, cur = null, raf = 0;
          var step = function () {
            raf = 0;
            if (!tgt) return;
            cur = cur || { x: 0.5, y: 0.5 };
            cur.x += (tgt.x - cur.x) * 0.2; cur.y += (tgt.y - cur.y) * 0.2;
            setLight(c, cur.x, cur.y);
            if (Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) > 0.002) raf = requestAnimationFrame(step);
          };
          var move = function (e) {
            var b = c.getBoundingClientRect();
            tgt = { x: (e.clientX - b.left) / b.width, y: (e.clientY - b.top) / b.height };
            c.classList.add('is-live');
            if (!raf) raf = requestAnimationFrame(step);
          };
          var rest = function () { tgt = null; cur = null; unlive(c); };
          stage.addEventListener('pointerdown', move);
          stage.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.buttons || e.pressure) move(e); });
          stage.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') rest(); });
          stage.addEventListener('pointerleave', rest);
          stage.addEventListener('pointercancel', rest);
        }
        document.body.appendChild(box);
        requestAnimationFrame(function () { box.classList.add('is-in'); });
        function close() { document.removeEventListener('keydown', key); box.classList.remove('is-in'); setTimeout(function () { box.remove(); }, 300); }
        function key(e) { if (e.key === 'Escape') close(); }
        document.addEventListener('keydown', key);
        box.addEventListener('click', function (e) { if (!e.target.closest('.vx') || e.target.closest('.cv-close')) close(); });
      }
      root.addEventListener('change', function (e) { if (e.target.matches('[data-vx-ch]')) { ST.ch = e.target.value; redraw(); } });
      root.addEventListener('keydown', function (e) {
        var c = e.target.closest && e.target.closest('.vx-row .vx');
        if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); zoom(c); }
      });
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-vx-pick]');
        if (b) {
          var v = b.getAttribute('data-vx-pick').split(':'), pk = picks();
          if (v[0] === 'shine') {
            pk.shine = v[1]; picks(pk); redraw();
            U.toast('Brillance « ' + SHINE[v[1]].name + ' » appliquée à toute la page');
            return;
          }
          if (v[0] === 'b2') {   // piste B2 : toujours une déclinaison retenue (sa gamme est affichée dessous)
            pk.b2 = v[1]; picks(pk); redraw();
            U.toast('Piste ' + v[1].toUpperCase() + ' retenue · gamme mise à jour');
            return;
          }
          if (+pk[v[0]] === +v[1]) delete pk[v[0]]; else pk[v[0]] = +v[1];
          picks(pk); redraw();
          U.toast(pk[v[0]] ? 'Choix ' + LETTER[v[0]] + v[1] + ' retenu pour ' + A.R[v[0]].label : 'Choix retiré');
          return;
        }
        var br = e.target.closest('[data-vx-b2r]');
        if (br) { ST.b2r = br.getAttribute('data-vx-b2r'); redraw(); return; }
        var shr = e.target.closest('[data-vx-shr]');
        if (shr) { ST.shr = shr.getAttribute('data-vx-shr'); redraw(); return; }
        var bg = e.target.closest('[data-vx-bg]');
        if (bg) {
          ST.bg = bg.getAttribute('data-vx-bg');
          boardEl.className = 'vx-board bg-' + ST.bg;
          root.querySelectorAll('[data-vx-bg]').forEach(function (x) { x.classList.toggle('is-active', x === bg); });
          return;
        }
        var g = e.target.closest('[data-vx-go]');
        if (g) {
          e.preventDefault();
          var t = root.querySelector('#vx-' + g.getAttribute('data-vx-go')), bar = root.querySelector('.vx-bar');
          if (t) window.scrollTo({ top: window.scrollY + t.getBoundingClientRect().top - bar.getBoundingClientRect().bottom - 8, behavior: 'smooth' });
          return;
        }
        var c = e.target.closest('.vx-row .vx');
        if (c) zoom(c);
      });
    }
  };
})(window.ATLAS);
