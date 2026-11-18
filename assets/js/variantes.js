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
    MAX = { atk: 1, def: 1, esp: 1, pow: 1 };
    A.CHARS.forEach(function (c) { ['atk', 'def', 'esp'].forEach(function (k) { if (c[k] > MAX[k]) MAX[k] = c[k]; }); });
    A.CHARS.forEach(function (c) { MAX.pow = Math.max(MAX.pow, c.atk + c.def + c.esp); });
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
  /* ---------- Piste B2 poussée : cartes « plein art » ----------
     2A (Vitrine) et 2E (Gravure) sont gardées ; 2F à 2K sont leurs cousines (gravure, chiffres en métal, médaillon, filet). */
  var B2 = [
    { id: '2a', name: 'Vitrine', ref: true, note: 'La B2 affinée : filet intérieur, nom en métal, puissance en médaillon, stats à pictogrammes.' },
    { id: '2e', name: 'Gravure', ref: true, note: 'Illustration striée de cercles gravés, chiffres en métal, aucune boîte.' },
    { id: '2f', name: 'Vitrine gravée', note: '2A sur la gravure de 2E : les stats perdent leurs boîtes, le médaillon est gravé de cercles.' },
    { id: '2g', name: 'Frontispice', note: 'Nom centré sur un filet orné, chiffres en métal surmontés de leur pictogramme.' },
    { id: '2h', name: 'Sceau', note: '2E avec la puissance frappée dans un grand sceau gravé, cerclé de métal.' },
    { id: '2i', name: 'Taille-douce', note: 'Hachures de gravure sur les bords, puissance en coin façon points de vie, stats en une ligne.' },
    { id: '2j', name: 'Écrin', note: 'Coins de métal au lieu du filet, nom en haut, pictogrammes de 2A et médaillon en bas.' },
    { id: '2k', name: 'Rayons', note: 'Rayons gravés autour du sujet, médaillon posé au centre, trois stats dessous.' }
  ];
  function chipsIco(d) {
    return STATS.map(function (s) { return '<span><i>' + U.icon(s[2]) + '</i><b>' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>'; }).join('');
  }
  /* Chiffres en métal ; opt.ico = pictogramme au-dessus (top) ou dans une gemme (gem) */
  function numsMetal(d, ico) {
    return STATS.map(function (s) {
      var i = ico === 'gem' ? '<i class="vx-ico-gem">' + U.icon(s[2]) + '</i>' : ico ? '<i class="vx-ico">' + U.icon(s[2]) + '</i>' : '';
      return '<span>' + i + '<b class="vx-metal">' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>';
    }).join('');
  }
  function medal(d, etched) {
    return '<span class="vx-medal-pow' + (etched ? ' is-etched' : '') + '"><b>' + d.pow + '</b><small>PUI</small></span>';
  }
  function meta(a, b) { return '<p class="vx-meta"><span>' + a + '</span><span>' + b + '</span></p>'; }
  function rk(d) { return '<span class="vx-rk">' + gem() + d.rlabel + '</span>'; }
  function P2a(d) {
    return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span><span class="vx-filet"></span>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span><span class="vx-ser">' + d.serial + '</span>' +
      '<div class="vx-low"><p class="vx-kick">' + d.coll + '</p><h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p>' +
        '<div class="vx-chips">' + chipsIco(d) + '</div></div>' +
      '<span class="vx-medal-pow"><b>' + d.pow + '</b><small>PUI</small></span>';
  }
  function P2e(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<div class="vx-top is-left"><h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p></div>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span>' +
      '<div class="vx-low"><div class="vx-nums">' + STATS.map(function (s) { return '<span><b class="vx-metal">' + d.ch[s[0]] + '</b><small>' + s[1] + '</small></span>'; }).join('') +
        '<span class="is-pow"><b class="vx-metal">' + d.pow + '</b><small>Puissance</small></span></div>' +
        '<p class="vx-meta"><span>' + d.coll + '</span><span class="vx-ser">' + d.serial + '</span></p></div>';
  }
  var SER = function (d) { return '<span class="vx-ser">' + d.serial + '</span>'; };
  var NAME = function (d) { return '<h3 class="vx-name vx-metal">' + d.name + '</h3><p class="vx-title">' + d.title + '</p>'; };
  /* 2F · Vitrine gravée : 2A + gravure, stats sans boîtes */
  function P2f(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil"></span><span class="vx-filet"></span>' +
      '<span class="vx-badge">' + gem() + d.rlabel + '</span>' + SER(d) +
      '<div class="vx-low"><p class="vx-kick">' + d.coll + '</p>' + NAME(d) +
        '<div class="vx-stats">' + numsMetal(d, 'gem') + '</div></div>' + medal(d, true);
  }
  /* 2G · Frontispice : nom centré sur filet orné */
  function P2g(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span><span class="vx-filet"></span>' +
      '<div class="vx-top"><h3 class="vx-name vx-metal">' + d.name + '</h3><span class="vx-orn"><i></i>' + gem() + '<i></i></span><p class="vx-title">' + d.title + '</p></div>' +
      '<div class="vx-low"><div class="vx-nums">' + numsMetal(d, 'top') +
        '<span class="is-pow"><i class="vx-ico">' + U.icon('star') + '</i><b class="vx-metal">' + d.pow + '</b><small>Puissance</small></span></div>' +
        meta(d.coll + ' · ' + d.rlabel, SER(d)) + '</div>';
  }
  /* 2H · Sceau : 2E + puissance dans un sceau gravé */
  function P2h(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<div class="vx-top is-left">' + NAME(d) + '</div>' + rk(d) +
      '<span class="vx-seal"><span><b class="vx-metal">' + d.pow + '</b><small>Puissance</small></span></span>' +
      '<div class="vx-low"><div class="vx-nums">' + numsMetal(d) + '</div>' + meta(d.coll, SER(d)) + '</div>';
  }
  /* 2I · Taille-douce : hachures, puissance en coin */
  function P2i(d) {
    return art(d.ed) + '<span class="vx-etch is-hatch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<div class="vx-hd">' + rk(d) + '<span class="vx-hp"><small>PUI</small><b class="vx-metal">' + d.pow + '</b></span></div>' +
      '<div class="vx-low">' + NAME(d) +
        '<div class="vx-line">' + numsMetal(d).replace(/<\/span><span>/g, '</span><em></em><span>') + '</div>' +
        meta(d.coll, SER(d)) + '</div>';
  }
  /* 2J · Écrin : coins de métal, pictogrammes de 2A, médaillon */
  function P2j(d) {
    return art(d.ed) + '<span class="vx-etch"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<i class="vx-cn c1"></i><i class="vx-cn c2"></i><i class="vx-cn c3"></i><i class="vx-cn c4"></i>' +
      '<div class="vx-top is-left">' + NAME(d) + '</div><span class="vx-corner-ser">' + SER(d) + '</span>' +
      '<div class="vx-low"><div class="vx-stats">' + numsMetal(d, 'gem') + '</div>' + meta(d.coll, rk(d)) + '</div>' + medal(d, false);
  }
  /* 2K · Rayons : rayons gravés, médaillon au centre */
  function P2k(d) {
    return art(d.ed) + '<span class="vx-etch is-rays"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span><span class="vx-filet"></span>' +
      '<div class="vx-top"><p class="vx-kick">' + d.coll + '</p>' + NAME(d) + '</div>' +
      '<div class="vx-low">' + medal(d, true) + '<div class="vx-trio">' + numsMetal(d, 'top') + '</div>' + meta(rk(d), SER(d)) + '</div>';
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

  /* ---------- Puissance, repensée : six idées où le chiffre a un sens (base 2A, Q1 à Q6) ----------
     Le total ATQ + DÉF + ESP change de nom selon l’idée : Envergure, Note, Sommet, Magnitude, Tranche, Rang. */
  var POW = [
    { id: 'q1', name: 'Rose des forces', term: 'Envergure', note: 'La boussole d’ATLAS : chaque branche s’allonge selon sa stat. Sa forme dit le style du personnage d’un coup d’œil.' },
    { id: 'q2', name: 'Note et style', term: 'Note', note: 'Une note sur 100 (la moyenne des stats) et le style de jeu du Duel, en tête de carte, sans cadre.' },
    { id: 'q3', name: 'Sommet', term: 'Sommet', note: 'Comme l’altitude d’un sommet sur une carte : un repère ▲ posé sur l’illustration, cerné de courbes de niveau.' },
    { id: 'q4', name: 'Constellation', term: 'Magnitude', note: 'Les trois stats sont trois étoiles reliées ; plus la stat est forte, plus l’étoile brille.' },
    { id: 'q5', name: 'Tranche graduée', term: 'Puissance', note: 'Le filet du cadre devient une règle graduée de 0 à 300 ; un curseur doré marque la carte.' },
    { id: 'q6', name: 'Rang', term: 'Rang', note: 'Le classement du personnage dans sa collection (selon ses stats), écrit comme un numéro d’inventaire de musée.' },
    { id: 'q7', name: 'Cap', term: 'Cap', note: 'Un ruban de boussole en haut de carte : le total devient un cap en degrés (255° = ouest-sud-ouest).' },
    { id: 'q8', name: 'Échelle', term: 'Échelle', note: 'L’échelle noire et blanche des cartes anciennes, de 0 à 300, avec un repère sur la carte.' },
    { id: 'q9', name: 'Fronton', term: 'Puissance', note: 'Le haut de la carte devient un fronton de temple grec, chiffre gravé dans le tympan.' },
    { id: 'q10', name: 'Triangle', term: 'Force', note: 'Le triangle des trois stats, tracé comme un relevé : sa surface est la force du personnage.' },
    { id: 'q11', name: 'Phase de lune', term: 'Phase', note: 'Une lune qui se remplit avec la puissance : croissant, quartier, gibbeuse, pleine lune pour les plus forts.' },
    { id: 'q12', name: 'Inscription', term: 'Puissance', note: 'Le total en chiffres romains, gravé sur une frise de pierre au-dessus du nom.' },
    { id: 'q13', name: 'Gloire', term: 'Gloire', note: 'Cinq feuilles de laurier : le niveau de gloire du personnage parmi tous ceux du jeu.' },
    { id: 'q14', name: 'Aura', term: 'Aura', note: 'Un halo autour du sujet, plus large et plus lumineux selon la puissance ; le chiffre flotte au-dessus.' },
    { id: 'q15', name: 'Addition', term: 'Total', note: 'L’addition posée comme dans un registre : 92 + 78 + 85, double trait, 255. On comprend d’où vient le chiffre.' }
  ];
  function chips2a(d) { return '<div class="vx-chips">' + chipsIco(d) + '</div>'; }
  function head2a(d, noSer) { return '<span class="vx-badge">' + gem() + d.rlabel + '</span>' + (noSer ? '' : SER(d)); }
  function kick(d, extra) { return '<p class="vx-kick' + (extra ? ' has-ser' : '') + '"><span>' + d.coll + '</span>' + (extra || '') + '</p>'; }
  var BASE2A = function (d) { return art(d.ed) + '<span class="vx-holo"></span><span class="vx-veil"></span>'; };
  function styleOf(d) {
    var C = A.combat && A.combat.duel;
    if (!C) return null;
    var k = C.style(d.ch.id), S = C.styles()[k];
    return S ? { id: k, label: S.label, icon: S.icon } : null;
  }
  var RANKS = null;
  /* Rang dans sa collection (selon ATQ + DÉF + ESP) : « Nº 3 des Olympiens » parle plus qu’un rang sur tout le jeu */
  function rankOf(ch) {
    if (!RANKS) {
      RANKS = {};
      A.COLLECTIONS.forEach(function (co) {
        var all = A.CHARS.filter(function (c) { return c.coll === co.id; }).map(function (c) { return { id: c.id, p: c.atk + c.def + c.esp }; }).sort(function (a, b) { return b.p - a.p; });
        all.forEach(function (c, i) { RANKS[c.id] = { n: i && c.p === all[i - 1].p ? RANKS[all[i - 1].id].n : i + 1, of: all.length }; });
      });
    }
    return RANKS[ch.id] || { n: 1, of: 1 };
  }
  function f1(x) { return Math.round(x * 10) / 10; }
  /* Pointe de rose (deux moitiés, claire et sombre, comme le logo ATLAS) */
  function kite(a, L, w, cls) {
    var r = a * Math.PI / 180, cx = Math.cos(r), sy = Math.sin(r), px = -sy, py = cx, b = L * 0.24;
    var tip = f1(cx * L) + ' ' + f1(sy * L), s1 = f1(cx * b + px * w) + ' ' + f1(sy * b + py * w), s2 = f1(cx * b - px * w) + ' ' + f1(sy * b - py * w);
    return '<path class="rs-l' + cls + '" d="M0 0L' + s1 + 'L' + tip + 'Z"/><path class="rs-d' + cls + '" d="M0 0L' + s2 + 'L' + tip + 'Z"/>';
  }
  function roseSVG(d) {
    var M = maxStats(), R = 38, ax = [['atk', -90, 'ATQ'], ['def', 30, 'DÉF'], ['esp', 150, 'ESP']], g = '', t = '';
    [-30, 90, 210].forEach(function (a) { g += kite(a, 15, 2.6, ' rs-s'); });
    ax.forEach(function (x) {
      var L = R * (0.42 + 0.58 * d.ch[x[0]] / M[x[0]]), r = x[1] * Math.PI / 180, lx = f1(Math.cos(r) * (L + 10)), ly = f1(Math.sin(r) * (L + 10));
      g += kite(x[1], L, 6.2, '');
      t += '<text class="rs-n" x="' + lx + '" y="' + f1(ly + (x[1] < 0 ? -1 : 4)) + '">' + d.ch[x[0]] + '</text>' +
        '<text class="rs-k" x="' + lx + '" y="' + f1(ly + (x[1] < 0 ? -11 : 11)) + '">' + x[2] + '</text>';
    });
    return '<svg class="vx-rose" viewBox="-64 -66 128 120" aria-hidden="true"><circle class="rs-ring" r="' + R + '"/><circle class="rs-ring is-in" r="' + (R * 0.42) + '"/>' + g +
      '<circle class="rs-c" r="2.6"/>' + t + '</svg>';
  }
  /* Étoile à quatre branches */
  function star(x, y, s) {
    var a = f1(s), b = f1(s * 0.22);
    return '<path class="cs-st" d="M' + x + ' ' + f1(y - a) + 'Q' + f1(x + b) + ' ' + f1(y - b) + ' ' + f1(x + a) + ' ' + y + 'Q' + f1(x + b) + ' ' + f1(y + b) + ' ' + x + ' ' + f1(y + a) +
      'Q' + f1(x - b) + ' ' + f1(y + b) + ' ' + f1(x - a) + ' ' + y + 'Q' + f1(x - b) + ' ' + f1(y - b) + ' ' + x + ' ' + f1(y - a) + 'Z"/>';
  }
  function constSVG(d) {
    var M = maxStats(), P = { atk: [74, 20], def: [18, 52], esp: [92, 82] }, lab = { atk: 'ATQ', def: 'DÉF', esp: 'ESP' };
    var s = '<path class="cs-ln" d="M18 52L74 20L92 82Z"/><path class="cs-ln is-f" d="M74 20L50 44M18 52L50 44M92 82L50 44"/>';
    ['atk', 'def', 'esp'].forEach(function (k) {
      var v = d.ch[k] / M[k], p = P[k], r = 5.5 + v * 7;
      s += '<circle class="cs-glow" cx="' + p[0] + '" cy="' + p[1] + '" r="' + f1(r * 1.15) + '" style="opacity:' + f1(0.12 + v * 0.3) + '"/>' + star(p[0], p[1], r);
      var lx = k === 'def' ? p[0] : p[0], ly = k === 'atk' ? p[1] - r - 5 : p[1] + r + 11;
      if (k === 'esp') { lx = p[0] - r - 4; ly = p[1] + 4; }
      s += '<text class="cs-n' + (k === 'esp' ? ' is-r' : '') + '" x="' + f1(lx) + '" y="' + f1(ly) + '">' + d.ch[k] + '<tspan class="cs-k" dx="1.6">' + lab[k] + '</tspan></text>';
    });
    s += '<circle class="cs-dot" cx="50" cy="44" r="1.3"/>';
    return '<svg class="vx-const" viewBox="0 0 110 100" aria-hidden="true">' + s + '</svg>';
  }
  function termLine(term, v) { return '<p class="vx-term"><small>' + term + '</small><b class="vx-metal">' + v + '</b></p>'; }

  /* Q1 · Rose des forces */
  function Pq1(d) {
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) + termLine('Envergure', d.pow) + '</div>' + roseSVG(d);
  }
  /* Q2 · Note et style */
  function Pq2(d) {
    var st = styleOf(d), note = Math.round(d.pow / 3);
    return BASE2A(d) + '<span class="vx-corner-veil is-left"></span><span class="vx-filet"></span>' + SER(d) +
      '<div class="vx-ovr"><b class="vx-metal">' + note + '</b><small>Note</small><i></i>' +
        (st ? '<span class="vx-ovr-st">' + U.icon(st.icon) + st.label + '</span>' : '') + '</div>' +
      '<div class="vx-low">' + kick(d, '<span class="vx-rk-t">' + gem() + d.rlabel + '</span>') + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q3 · Sommet */
  function Pq3(d) {
    var id = 'vxtopo' + (++uid), c = '';
    for (var r = 4; r < 80; r += 5) c += '<ellipse cx="74" cy="30" rx="' + r + '" ry="' + f1(r * 0.78) + '"/>';
    var topo = '<svg class="vx-contours" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter></defs>' +
      '<g filter="url(#' + id + ')">' + c + '</g></svg>';
    return BASE2A(d) + topo + '<span class="vx-filet"></span>' + head2a(d) +
      '<span class="vx-summit"><i class="vx-tri"></i><span><b class="vx-metal">' + d.pow + '</b><small>Sommet</small></span></span>' +
      '<div class="vx-low">' + kick(d) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q4 · Constellation */
  function Pq4(d) {
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) + termLine('Magnitude', d.pow) + '</div>' + constSVG(d);
  }
  /* Q5 · Tranche graduée */
  function Pq5(d) {
    var top = 300, h = Math.min(100, d.pow / top * 100);
    return BASE2A(d) + '<span class="vx-filet is-ruled"></span>' + head2a(d) +
      '<span class="vx-ruler" style="--h:' + f1(h) + '%"><i class="vx-ruler-fill"></i>' +
        [100, 200, 300].map(function (v) { return '<em style="bottom:' + f1(v / top * 100) + '%">' + v + '</em>'; }).join('') +
        '<span class="vx-cursor"><b class="vx-metal">' + d.pow + '</b><small>Puissance</small></span></span>' +
      '<div class="vx-low">' + kick(d) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q6 · Rang */
  function Pq6(d) {
    var rk = rankOf(d.ch);
    return BASE2A(d) + '<span class="vx-corner-veil"></span><span class="vx-filet"></span>' + head2a(d, true) +
      '<span class="vx-rank"><small>Rang · ' + d.coll + '</small><b class="vx-metal"><sup>Nº</sup>' + rk.n + '</b><em>sur ' + rk.of + ' · ' + d.pow + ' de puissance</em></span>' +
      '<div class="vx-low">' + kick(d, SER(d)) + NAME(d) + chips2a(d) + '</div>';
  }
  var POWS = null;
  /** Place de la puissance dans tout le jeu, de 0 (la plus faible) à 1 (la plus forte) */
  function pctOf(p) {
    if (!POWS) POWS = A.CHARS.map(function (c) { return c.atk + c.def + c.esp; }).sort(function (a, b) { return a - b; });
    return POWS.filter(function (x) { return x < p; }).length / Math.max(1, POWS.length - 1);
  }
  function roman(n) {
    var r = '', T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    T.forEach(function (t) { while (n >= t[0]) { r += t[1]; n -= t[0]; } });
    return r;
  }
  /* Q7 · Cap : ruban de boussole */
  function Pq7(d) {
    var deg = d.pow % 360, a0 = deg - 60, t = '', L = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SO', 270: 'O', 315: 'NO' };
    var P16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    for (var a = Math.ceil(a0 / 5) * 5; a <= a0 + 120; a += 5) {
      var x = f1((a - a0) / 120 * 120), m = ((a % 360) + 360) % 360, big = m % 45 === 0, mid = m % 15 === 0;
      t += '<line x1="' + x + '" x2="' + x + '" y1="15" y2="' + (big ? 7 : mid ? 10 : 12) + '"' + (big ? ' class="is-b"' : '') + '/>';
      if (big) t += '<text x="' + x + '" y="4.5">' + L[m] + '</text>';
    }
    return BASE2A(d) + '<span class="vx-veil-top"></span><span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-cap"><svg viewBox="0 -2 120 22" aria-hidden="true"><g>' + t + '</g><path class="ct-m" d="M60 15.5l-2.8 4.5h5.6z"/></svg>' +
        '<p><b class="vx-metal">' + deg + '°</b><small>Cap · ' + P16[Math.round(deg / 22.5) % 16] + '</small></p></div>' +
      '<div class="vx-low">' + kick(d) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q8 · Échelle de carte */
  function Pq8(d) {
    var pct = f1(Math.min(100, d.pow / 300 * 100));
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) +
        '<div class="vx-scale"><div class="vx-scale-c"><span class="vx-scale-bar"><i></i><i></i><i></i><i></i><i></i><i></i><em style="left:' + pct + '%"></em></span>' +
          '<span class="vx-scale-l"><small>0</small><small>100</small><small>200</small><small>300</small></span></div>' +
          '<span class="vx-scale-v"><b class="vx-metal">' + d.pow + '</b><small>Échelle</small></span></div>' +
        chips2a(d) + '</div>';
  }
  /* Q9 · Fronton */
  function Pq9(d) {
    var dent = '';
    for (var x = 4; x < 96; x += 4) dent += '<rect x="' + x + '" y="21" width="2" height="1.6"/>';
    return BASE2A(d) + '<span class="vx-veil-top"></span><span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-front"><svg viewBox="0 0 100 24" aria-hidden="true"><path class="fr-o" d="M2 18.5L50 2L98 18.5Z"/><path class="fr-i" d="M11 17L50 5.2L89 17Z"/>' +
        '<rect class="fr-c" x="1" y="18.5" width="98" height="1.6"/><g class="fr-d">' + dent + '</g>' +
        '<text x="50" y="15.4">' + d.pow + '</text></svg><small>Puissance</small></div>' +
      '<div class="vx-low">' + kick(d) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q10 · Triangle des stats */
  function Pq10(d) {
    var M = maxStats(), R = 34, ax = [['atk', -90, 'ATQ'], ['def', 30, 'DÉF'], ['esp', 150, 'ESP']];
    function pt(a, r) { var t = a * Math.PI / 180; return f1(Math.cos(t) * r) + ' ' + f1(Math.sin(t) * r); }
    var grid = [1, 2 / 3, 1 / 3].map(function (k) { return '<path class="tr-g" d="M' + ax.map(function (x) { return pt(x[1], R * k); }).join('L') + 'Z"/>'; }).join('');
    var axes = ax.map(function (x) { return '<path class="tr-a" d="M0 0L' + pt(x[1], R) + '"/>'; }).join('');
    var poly = ax.map(function (x) { return pt(x[1], R * Math.max(0.2, d.ch[x[0]] / M[x[0]])); });
    var lab = ax.map(function (x) {
      var p = pt(x[1], R + 9).split(' '), y = +p[1] + (x[1] < 0 ? -1 : 4);
      return '<text class="rs-n" x="' + p[0] + '" y="' + y + '">' + d.ch[x[0]] + '</text><text class="rs-k" x="' + p[0] + '" y="' + (x[1] < 0 ? y - 10 : y + 6.5) + '">' + x[2] + '</text>';
    }).join('');
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) + termLine('Force', d.pow) + '</div>' +
      '<svg class="vx-tri3" viewBox="-60 -62 120 104" aria-hidden="true">' + grid + axes + '<path class="tr-p" d="M' + poly.join('L') + 'Z"/>' +
        poly.map(function (p) { var q = p.split(' '); return '<circle class="tr-v" cx="' + q[0] + '" cy="' + q[1] + '" r="1.8"/>'; }).join('') + lab + '</svg>';
  }
  /* Q11 · Phase de lune */
  function Pq11(d) {
    var f = Math.max(0.08, Math.min(1, d.pow / maxStats().pow)), R = 20, rx = f1(Math.abs(1 - 2 * f) * R);
    var name = f > 0.97 ? 'Pleine lune' : f > 0.6 ? 'Gibbeuse' : f > 0.4 ? 'Quartier' : 'Croissant';
    var lit = f > 0.97 ? '<circle class="mn-l" r="' + R + '"/>' : '<path class="mn-l" d="M0 -' + R + 'A' + R + ' ' + R + ' 0 0 1 0 ' + R + 'A' + rx + ' ' + R + ' 0 0 ' + (f > 0.5 ? 1 : 0) + ' 0 -' + R + 'Z"/>';
    return BASE2A(d) + '<span class="vx-corner-veil"></span><span class="vx-filet"></span>' + head2a(d, true) +
      '<div class="vx-moon"><svg viewBox="-24 -24 48 48" aria-hidden="true"><circle class="mn-h" r="23"/><circle class="mn-d" r="' + R + '"/>' + lit +
        '<circle class="mn-c" cx="-6" cy="-5" r="3.2"/><circle class="mn-c" cx="7" cy="6" r="2.4"/><circle class="mn-c" cx="4" cy="-9" r="1.6"/></svg>' +
        '<p><b class="vx-metal">' + d.pow + '</b><small>' + name + '</small></p></div>' +
      '<div class="vx-low">' + kick(d, SER(d)) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q12 · Inscription en chiffres romains */
  function Pq12(d) {
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) +
        '<div class="vx-insc"><b class="vx-metal">' + roman(d.pow) + '</b><small>' + d.pow + ' · Puissance</small></div>' + chips2a(d) + '</div>';
  }
  /* Q13 · Gloire : cinq feuilles de laurier */
  function Pq13(d) {
    var n = 1 + Math.min(4, Math.floor(pctOf(d.pow) * 5)), leaves = '';
    for (var i = 0; i < 5; i++) leaves += '<i' + (i < n ? ' class="on"' : '') + '></i>';
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) +
        '<div class="vx-glory"><small>Gloire</small><span class="vx-leaves">' + leaves + '</span><b class="vx-metal">' + d.pow + '</b></div>' + chips2a(d) + '</div>';
  }
  /* Q14 · Aura */
  function Pq14(d) {
    var k = f1(0.35 + pctOf(d.pow) * 0.65);
    return BASE2A(d) + '<span class="vx-aura" style="--k:' + k + '"></span><span class="vx-filet"></span>' + head2a(d) +
      '<span class="vx-aura-n"><b class="vx-metal">' + d.pow + '</b><small>Aura</small></span>' +
      '<div class="vx-low">' + kick(d) + NAME(d) + chips2a(d) + '</div>';
  }
  /* Q15 · Addition posée */
  function Pq15(d) {
    return BASE2A(d) + '<span class="vx-filet"></span>' + head2a(d) +
      '<div class="vx-low">' + kick(d) + NAME(d) + '</div>' +
      '<div class="vx-sum">' + STATS.map(function (s, i) {
        return '<span><em>' + (i ? '+' : '') + '</em><small>' + s[1] + '</small><b>' + d.ch[s[0]] + '</b></span>';
      }).join('') + '<i></i><span class="is-tot"><small>Total</small><b class="vx-metal">' + d.pow + '</b></span></div>';
  }

  /* ---------- Piste 2K : nom à gauche, puissance à droite, même taille et même typo (K1 à K9) ----------
     Même corps que 2K (rayons gravés, filet, trois stats, ligne rareté / numéro) ; l’en-tête change :
     trois rangées (petit libellé · nom et chiffre · titre), le chiffre dans la typo et la taille du nom. */
  var K2 = [
    { id: '2k', name: 'Rayons', ref: true, note: 'La carte de départ : nom centré, médaillon au-dessus des stats.' },
    { id: 'k1', name: 'Face à face', note: 'Le nom à gauche, la puissance à droite, même ligne ; « Puissance » en italique sous le chiffre, comme le titre.' },
    { id: 'k2', name: 'Libellés en tête', note: 'La collection au-dessus du nom, « Puissance » au-dessus du chiffre : les deux côtés se répondent.' },
    { id: 'k3', name: 'Note', note: 'La note sur 100 (85) au lieu du total, le style de Duel en italique dessous.' },
    { id: 'k4', name: 'Filet de liaison', note: 'Un trait doré relie le nom au chiffre, comme sur une table des matières.' },
    { id: 'k5', name: 'Gemme centrale', note: 'Entre le nom et le chiffre, deux traits et la gemme de la rareté.' },
    { id: 'k6', name: 'Soleil', note: 'Les rayons gravés partent du chiffre, en haut à droite.' },
    { id: 'k7', name: 'Filet ouvert', note: 'Le filet doré s’ouvre en haut à droite pour laisser passer le chiffre.' },
    { id: 'k8', name: 'Bandeau', note: 'Le nom et le chiffre posés sur un bandeau clair, souligné d’un trait de métal.' },
    { id: 'k9', name: 'Note et pictogramme', note: 'La note sur 100, précédée du pictogramme de son style de Duel.' }
  ];
  function kBody(d, o) {
    o = o || {};
    var hd = '<div class="vx-hdr' + (o.cls ? ' ' + o.cls : '') + '">' +
      '<div class="vx-hr is-k"><span class="vx-kick">' + d.coll + '</span>' + (o.kr ? '<span class="vx-kick">' + o.kr + '</span>' : '') + '</div>' +
      '<div class="vx-hr is-n"><h3 class="vx-name vx-metal">' + d.name + '</h3>' + (o.mid || '') + '<b class="vx-hn">' + (o.pre || '') + '<span class="vx-metal">' + (o.n || d.pow) + '</span></b></div>' +
      '<div class="vx-hr is-t"><span class="vx-title">' + d.title + '</span>' + (o.sub ? '<span class="vx-title">' + o.sub + '</span>' : '') + '</div></div>';
    return art(d.ed) + '<span class="vx-etch is-rays' + (o.sun ? ' is-sun' : '') + '"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span>' +
      '<span class="vx-filet' + (o.notch ? ' is-notch-r' : '') + '"></span>' + (o.extra || '') + hd +
      '<div class="vx-low"><div class="vx-trio">' + numsMetal(d, 'top') + '</div>' + meta(rk(d), SER(d)) + '</div>';
  }
  function note(d) { return Math.round(d.pow / 3); }
  var KB = {
    k1: function (d) { return kBody(d, { sub: 'Puissance' }); },
    k2: function (d) { return kBody(d, { kr: 'Puissance' }); },
    k3: function (d) { var st = styleOf(d); return kBody(d, { n: note(d), kr: 'Note', sub: st ? st.label : '' }); },
    k4: function (d) { return kBody(d, { mid: '<i class="vx-lead"></i>', sub: 'Puissance' }); },
    k5: function (d) { return kBody(d, { mid: '<i class="vx-lead is-gem"><i></i>' + gem() + '<i></i></i>', sub: 'Puissance' }); },
    k6: function (d) { return kBody(d, { sun: true, sub: 'Puissance' }); },
    k7: function (d) { return kBody(d, { notch: true, sub: 'Puissance', extra: '<i class="vx-cap2 c-a"></i><i class="vx-cap2 c-b"></i>' }); },
    k8: function (d) { return kBody(d, { cls: 'is-band', kr: 'Puissance' }); },
    k9: function (d) {
      var st = styleOf(d);
      return kBody(d, { n: note(d), pre: st ? '<i class="vx-hico">' + U.icon(st.icon) + '</i>' : '', kr: 'Note', sub: st ? st.label : '' });
    }
  };

  /* ---------- Textes de la carte K2 / K3 (T1 à T14) ----------
     Même carte (nom à gauche, chiffre à droite, rayons, trois stats) ; seuls les petits textes changent :
     collection, titre, libellé du chiffre, style de Duel, et la description (bio d’une phrase).
     L’en-tête est une grille 2 colonnes × 3 rangées : les lignes de gauche et de droite partagent la même ligne de base. */
  var TX = [
    { id: 't1', name: 'Lisible', note: 'Même place qu’aujourd’hui, mais textes plus grands et plus foncés ; le style en italique répond au titre. Description centrée en italique au-dessus des stats.',
      kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'it' },
    { id: 't2', name: 'Petites capitales', note: 'Titre et style en petites capitales espacées, comme une inscription gravée. Description en romain, centrée.',
      cls: 'is-caps', kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'rm' },
    { id: 't3', name: 'Pictogramme du style', note: 'Le style de Duel avec son pictogramme, en capitales de couleur. Pas de description : l’illustration respire.',
      kl: 'coll', kr: 'nl', sl: 'title', sr: 'styleIco' },
    { id: 't4', name: 'Filet sous le nom', note: 'Un filet doré avec la gemme sépare le nom des petits textes ; titre et style se répondent dessous.',
      rule: true, kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'it' },
    { id: 't5', name: 'Épithète en tête', note: 'Le titre passe au-dessus du nom, le style au-dessus du chiffre. La collection descend sur la ligne de rareté. Description alignée à gauche.',
      kl: 'titleK', kr: 'styleIco', sl: '', sr: 'nl', bio: 'left', meta: 'rkColl' },
    { id: 't6', name: 'Cartouche', note: 'Le chiffre dans sa colonne, séparé par un trait vertical : libellé, chiffre et style centrés.',
      cls: 'is-cart', kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'it' },
    { id: 't7', name: 'Or et encre', note: 'Collection, libellé et style dans le métal de la rareté ; titre à l’encre. Description entre guillemets, avec une lettrine dorée.',
      cls: 'is-gold', kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'quote' },
    { id: 't8', name: 'Sur 100', note: 'Le chiffre porte son barème (« /100 ») : plus besoin du mot. Le style prend sa place en tête, avec son pictogramme.',
      kl: 'coll', kr: 'styleIco', sl: 'title', sr: '', suf: true },
    { id: 't9', name: 'Numéro de collection', note: 'La collection suivie du rang du personnage (ici Nº 3 des Olympiens, selon ses stats), comme un numéro d’inventaire de musée.',
      kl: 'collNo', kr: 'nl', sl: 'title', sr: 'style', bio: 'it' },
    { id: 't10', name: 'Pastilles fines', note: 'Collection et style dans des pastilles au trait fin, sans fond plein. Le reste en texte simple.',
      cls: 'is-pill', kl: 'coll', kr: 'styleIco', sl: 'title', sr: 'nl', bio: 'it' },
    { id: 't11', name: 'Cartel de musée', note: 'La description posée comme le cartel d’une œuvre : entre deux filets, petite et centrée, avec le nom et le titre en tête.',
      kl: 'coll', kr: 'nl', sl: 'title', sr: 'style', bio: 'cartel' },
    { id: 't12', name: 'Épuré', note: 'En tête, seulement le nom, le chiffre, le titre et le style. La collection rejoint la ligne de rareté ; pas de description.',
      kl: '', kr: '', sl: 'title', sr: 'style', meta: 'rkColl' },
    { id: 't13', name: 'Rareté en tête', note: 'La rareté et sa gemme en haut à gauche, la collection en bas à la place de la rareté.',
      kl: 'rk', kr: 'nl', sl: 'title', sr: 'style', bio: 'it', meta: 'collSer' },
    { id: 't14', name: 'Une ligne', note: 'Titre et style réunis sur une seule ligne sous le nom. Description à gauche, avec un trait doré.',
      kl: 'coll', kr: 'nl', sl: 'titleStyle', sr: null, bio: 'left' }
  ];
  function tBody(d, L) {
    var st = styleOf(d), isNote = ST.tm !== 'pow', rkC = rankOf(d.ch);
    var x = { n: isNote ? note(d) : d.pow, nl: isNote ? 'Note' : 'Puissance', of: isNote ? 100 : 300 };
    var stIco = st ? '<i class="th-ico">' + U.icon(st.icon) + '</i>' : '';
    var S = {
      '': '', coll: d.coll, nl: x.nl, title: d.title, rk: gem() + d.rlabel,
      style: st ? st.label : '', styleIco: st ? stIco + st.label : '',
      titleK: d.title, collNo: d.coll + ' · Nº ' + rkC.n,
      titleStyle: d.title + (st ? '<em class="th-dot"></em>' + st.label : '')
    };
    function cell(k, c) { return '<span class="' + c + (k ? ' s-' + k : '') + '">' + (k ? S[k] : '') + '</span>'; }
    var hd = '<div class="vx-hdr vx-th">' +
      cell(L.kl, 'th-kl') + cell(L.kr, 'th-kr') +
      '<h3 class="vx-name vx-metal">' + d.name + '</h3>' +
      '<b class="th-n"><span class="vx-metal">' + x.n + '</span>' + (L.suf ? '<small>/' + x.of + '</small>' : '') + '</b>' +
      (L.rule ? '<i class="th-rule"><i></i>' + gem() + '<i></i></i>' : '') +
      (L.sr === null ? cell(L.sl, 'th-sl is-wide') : cell(L.sl, 'th-sl') + cell(L.sr, 'th-sr')) + '</div>';
    var bio = '';
    if (L.bio === 'cartel') bio = '<div class="th-bio is-cartel"><b>' + d.name + ', <i>' + d.title.charAt(0).toLowerCase() + d.title.slice(1) + '</i></b><p>' + d.bio + '</p></div>';
    else if (L.bio === 'quote') bio = '<p class="th-bio is-quote">« ' + d.bio + ' »</p>';
    else if (L.bio) bio = '<p class="th-bio is-' + L.bio + '">' + d.bio + '</p>';
    var m = L.meta === 'rkColl' ? meta(rk(d) + '<em class="th-dot"></em>' + d.coll, SER(d)) : L.meta === 'collSer' ? meta(d.coll, SER(d)) : meta(rk(d), SER(d));
    return art(d.ed) + '<span class="vx-etch is-rays"></span><span class="vx-holo"></span><span class="vx-veil-top"></span><span class="vx-veil"></span><span class="vx-filet"></span>' + hd +
      '<div class="vx-low">' + bio + '<div class="vx-trio">' + numsMetal(d, 'top') + '</div>' + m + '</div>';
  }

  var BUILD = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, '2a': P2a, '2e': P2e, '2f': P2f, '2g': P2g, '2h': P2h, '2i': P2i, '2j': P2j, '2k': P2k,
    q1: Pq1, q2: Pq2, q3: Pq3, q4: Pq4, q5: Pq5, q6: Pq6, q7: Pq7, q8: Pq8, q9: Pq9, q10: Pq10, q11: Pq11, q12: Pq12, q13: Pq13, q14: Pq14, q15: Pq15 };
  var KIND = {};
  LAYOUTS.forEach(function (L) { KIND[L.id] = L; });
  B2.forEach(function (L) { KIND[L.id] = L; L.full = true; });
  POW.forEach(function (L) { KIND[L.id] = L; L.full = true; L.cls = 'vx-L2a'; });
  K2.forEach(function (L) { if (L.ref) return; KIND[L.id] = L; L.full = true; L.cls = 'vx-L2k vx-K'; BUILD[L.id] = KB[L.id]; });
  TX.forEach(function (L) {
    KIND[L.id] = L; L.full = true;
    L.cls = 'vx-L2k vx-K vx-T' + (L.cls ? ' ' + L.cls : '') + (L.bio ? ' has-bio' : '');
    BUILD[L.id] = function (d) { return tBody(d, L); };
  });

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
    return '<article class="card vx vx-r-' + r + ' vx-L' + k + (K.full ? ' vx-full' : '') + (K.cls ? ' ' + K.cls : '') + shCls + (ch.name.length > 12 ? ' is-long' : '') + '"' + (shCls ? '' : ' data-tilt') + ' data-vx="' + r + ':' + k + '" data-code="' + code + '" tabindex="0" aria-label="' + d.name + ', ' + R.label + ', ' + K.name + '">' +
      '<div class="card-inner"><div class="vx-in">' + BUILD[k](d) + '</div><span class="vx-foil"></span><span class="vx-glare"></span>' +
      (shCls ? '<span class="vx-sh"></span><span class="vx-gl"></span>' : '') + '</div></article>';
  }

  /* Section Brillances : la déclinaison B2 retenue, dans la rareté choisie, avec chaque brillance */
  function shineHTML() {
    var pk = picks(), k = b2Pick(pk), r = ST.shr || 'unique', sel = ST.sh;
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
  function b2Pick(pk) { return B2.some(function (L) { return L.id === pk.b2; }) ? pk.b2 : '2a'; }   // une piste retirée (2B à 2D) revient à 2A

  /* Atelier 2K : la carte retenue, puis neuf façons de placer la puissance en haut à gauche */
  function kHTML() {
    var pk = picks(), sel = pk.k, r = ST.kr || ST.b2r || 'legendary';
    return '<section class="vx-sec vx-b2" id="vx-2k">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Piste 2K · Nom à gauche, puissance à droite</h2>' +
        '<p>La carte 2K (Rayons), avec le nom à gauche et la puissance à droite, sur la même ligne, même taille et même typo. Neuf variantes de détail ; changez de rareté pour comparer.</p>' +
        '<span class="vx-chosen">' + (KIND[sel] ? 'Votre choix : ' + sel.toUpperCase() + ' · ' + KIND[sel].name : 'Aucun choix') + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Rareté">' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-kr="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row is-pow">' + K2.map(function (L) {
        var on = sel === L.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, L.id) +
          '<figcaption><p class="vx-code"><b>' + L.id.toUpperCase() + '</b> ' + L.name + (L.ref ? ' <span class="vx-ref">Départ</span>' : '') + '</p><p class="vx-note">' + L.note + '</p>' +
          '<button class="vx-pick" data-vx-pick="k:' + L.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button></figcaption></figure>';
      }).join('') + '</div></section>';
  }

  /* Atelier Textes : la carte K2 / K3 avec quatorze traitements des petits textes */
  function tHTML() {
    var pk = picks(), sel = pk.t, r = ST.tr || ST.kr || 'legendary', ref = ST.tm === 'pow' ? 'k2' : 'k3';
    var all = [{ id: ref, name: KIND[ref].name, note: 'La ' + ref.toUpperCase() + ' telle qu’aujourd’hui, pour comparer.', ref: true }].concat(TX);
    return '<section class="vx-sec vx-b2" id="vx-textes">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Textes · base K2 / K3</h2>' +
        '<p>La carte retenue, avec quatorze façons d’écrire la collection, le titre, le style de Duel (Assaut…), le libellé du chiffre et la description. Basculez Note (K3) ou Puissance (K2), et changez de rareté pour vérifier la lisibilité.</p>' +
        '<span class="vx-chosen">' + (KIND[sel] && sel.charAt(0) === 't' ? 'Votre choix : ' + sel.toUpperCase() + ' · ' + KIND[sel].name : 'Aucun choix') + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Chiffre">' + [['note', 'Note · K3'], ['pow', 'Puissance · K2']].map(function (m) {
        return '<button class="chip' + ((ST.tm || 'note') === m[0] ? ' is-active' : '') + '" data-vx-tm="' + m[0] + '">' + m[1] + '</button>';
      }).join('') + '<span class="vx-sep"></span>' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-tr="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row is-pow">' + all.map(function (L) {
        var on = sel === L.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, L.id) +
          '<figcaption><p class="vx-code"><b>' + L.id.toUpperCase() + '</b> ' + L.name + (L.ref ? ' <span class="vx-ref">Actuelle</span>' : '') + '</p><p class="vx-note">' + L.note + '</p>' +
          (L.ref ? '' : '<button class="vx-pick" data-vx-pick="t:' + L.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button>') + '</figcaption></figure>';
      }).join('') + '</div></section>';
  }

  /* Atelier Puissance : quinze mises en avant sur la base 2A, dans la rareté choisie */
  function powHTML() {
    var pk = picks(), sel = pk.pow, r = ST.pwr || ST.b2r || 'legendary';
    return '<section class="vx-sec vx-b2" id="vx-puissance">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Puissance · quinze idées</h2>' +
        '<p>Le total des trois stats, repensé : chaque idée lui donne un sens, une place et souvent un nom (Envergure, Note, Sommet, Cap, Gloire…). Base 2A ; changez de rareté pour comparer.</p>' +
        '<span class="vx-chosen">' + (KIND[sel] ? 'Votre choix : ' + sel.toUpperCase() + ' · ' + KIND[sel].name : 'Aucun choix') + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Rareté">' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-pwr="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row is-pow">' + POW.map(function (L) {
        var on = sel === L.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, L.id) +
          '<figcaption><p class="vx-code"><b>' + L.id.toUpperCase() + '</b> ' + L.name + ' <span class="vx-ref">« ' + L.term + ' »</span></p><p class="vx-note">' + L.note + '</p>' +
          '<button class="vx-pick" data-vx-pick="pow:' + L.id + '" aria-pressed="' + on + '">' + U.icon('star') + (on ? 'Mon choix' : 'Choisir') + '</button></figcaption></figure>';
      }).join('') + '</div></section>';
  }
  function b2HTML() {
    var pk = picks(), sel = b2Pick(pk), r = ST.b2r || 'legendary';
    return '<section class="vx-sec vx-b2" id="vx-b2">' +
      '<header class="vx-sec-head"><h2 class="h3"><i class="vx-dot is-b2"></i>Piste B2 · Autour de 2A et 2E</h2>' +
        '<p>2A et 2E sont gardées ; six cousines piochent dans les deux (gravure, chiffres en métal, médaillon, filet). Changez de rareté pour comparer.</p>' +
        '<span class="vx-chosen">Votre choix : ' + sel.toUpperCase() + '</span></header>' +
      '<div class="vx-b2r" role="group" aria-label="Rareté">' + A.RARITIES.map(function (R) {
        return '<button class="chip chip-r r-' + R.id + (R.id === r ? ' is-active' : '') + '" data-vx-b2r="' + R.id + '"><i></i>' + R.label + '</button>';
      }).join('') + '</div>' +
      '<div class="vx-row is-b2">' + B2.map(function (L) {
        var on = sel === L.id;
        return '<figure class="vx-cell' + (on ? ' is-picked' : '') + '">' + vcard(r, L.id) +
          '<figcaption><p class="vx-code"><b>' + L.id.toUpperCase() + '</b> ' + L.name + (L.ref ? ' <span class="vx-ref">Gardée</span>' : '') + '</p><p class="vx-note">' + L.note + '</p>' +
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
    return tHTML() + kHTML() + powHTML() + b2HTML() + shineHTML() + A.RARITIES.map(function (R) {
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
      if (ctx.query.rar && A.R[ctx.query.rar]) ST.b2r = ctx.query.rar;   // ex. #/variantes?rar=unique
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
          '<nav class="vx-jump" aria-label="Aller à une rareté">' + [{ id: 'textes', label: 'Textes' }, { id: '2k', label: 'Piste 2K' }, { id: 'puissance', label: 'Puissance' }, { id: 'b2', label: 'Piste B2' },{ id: 'brillance', label: 'Brillances' }].concat(A.RARITIES).map(function (r) {
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
          if (v[0] === 't') {
            if (pk.t === v[1]) delete pk.t; else pk.t = v[1];
            picks(pk); redraw();
            U.toast(pk.t ? 'Textes ' + v[1].toUpperCase() + ' retenus' : 'Choix retiré');
            return;
          }
          if (v[0] === 'k') {
            if (pk.k === v[1]) delete pk.k; else pk.k = v[1];
            picks(pk); redraw();
            U.toast(pk.k ? 'Version ' + v[1].toUpperCase() + ' retenue' : 'Choix retiré');
            return;
          }
          if (v[0] === 'pow') {
            if (pk.pow === v[1]) delete pk.pow; else pk.pow = v[1];
            picks(pk); redraw();
            U.toast(pk.pow ? 'Puissance « ' + KIND[v[1]].name + ' » retenue' : 'Choix retiré');
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
        var tr = e.target.closest('[data-vx-tr]');
        if (tr) { ST.tr = tr.getAttribute('data-vx-tr'); redraw(); return; }
        var tm = e.target.closest('[data-vx-tm]');
        if (tm) { ST.tm = tm.getAttribute('data-vx-tm'); redraw(); return; }
        var kr = e.target.closest('[data-vx-kr]');
        if (kr) { ST.kr = kr.getAttribute('data-vx-kr'); redraw(); return; }
        var pr = e.target.closest('[data-vx-pwr]');
        if (pr) { ST.pwr = pr.getAttribute('data-vx-pwr'); redraw(); return; }
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
