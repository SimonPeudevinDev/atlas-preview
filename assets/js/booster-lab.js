/* ==========================================================================
   ATLAS — Design des boosters (page admin, mode test)   →  #/design-booster
   La forme du sachet en grand, tous les boosters et les anciennes versions du modèle 3D.
   Chaque version s’affiche dans une petite fenêtre du site (iframe « ?shape=…#/booster-solo ») :
   un modèle par fenêtre, sans toucher au moteur 3D (pack3d.js ne charge qu’un modèle à la fois).
   Les modèles : pack-model.js (classique, tools/blender/build_pack.py), pack-model-pillow.js (référence) et les essais
   pack-model-<variante>.js, construits par tools/blender/build_pack_ref.py --variant <variante> (réglages dans VARIANTS).
   ========================================================================== */
(function (A) {
  'use strict';
  var U = A.ui, P = A.pages;

  var SHAPES = [
    { id: 'strie', name: 'Strié', tag: 'Actuelle', ver: 'v511', date: '18 nov. 2026',
      desc: 'La forme retenue : la référence avec les stries brossées du classique à moitié, les bords en dents de scie et l’image qui suit la largeur réelle du sachet.' },
    { id: 'ref', name: 'Référence', tag: 'Base', ver: 'v495', date: '18 nov. 2026',
      desc: 'Coussin d’après la photo : taille de guêpe, coins décalés, soudures à nervures, film lisse, froissures et leurs variantes.' },
    { id: 'strie2', name: 'Strié satiné', tag: 'Essai', ver: 'v509', date: '18 nov. 2026',
      desc: 'Déchirure sous la languette, brossage plus fin et plus marqué, larges bandes de reflet comme un métal satiné.' },
    { id: 'tendu', name: 'Tendu', tag: 'Essai', ver: 'v510', date: '18 nov. 2026',
      desc: 'Son propre modèle : la pile de cartes sous un film tiré presque sous vide, tendu en ligne droite jusqu’aux soudures, plis de tension aux coins de la pile.' },
    { id: 'gonfle', name: 'Gonflé', tag: 'Essai', ver: 'v510', date: '18 nov. 2026',
      desc: 'Son propre modèle, par simulation de tissu : deux films soudés, gonflés d’air. Les côtés rentrent et les plis se forment d’eux-mêmes.' },
    { id: 'bordure', name: 'Bordures pliées', tag: 'Essai', ver: 'v510', date: '18 nov. 2026',
      desc: 'Son propre modèle, construit en coupe : face plate, pli arrondi autour de la pile, soufflet jusqu’au bord, coins repliés en onglet.' },
    { id: 'fronce', name: 'Fronces aux soudures', tag: 'Essai', ver: 'v510', date: '18 nov. 2026',
      desc: 'Son propre modèle : le film est froncé dans les soudures, une trentaine de plis qui partent des soudures et s’effacent dans le coussin.' },
    { id: 'coins', name: 'Coins tirés', tag: 'Essai', ver: 'v510', date: '18 nov. 2026',
      desc: 'Son propre modèle, par simulation de tissu : gonflé pendant que les coins des soudures sont tirés en diagonale ; le film se tend entre les coins.' },
    { id: 'classic', name: 'Classique', tag: 'Secours', ver: 'v444', date: '5 nov. 2026',
      desc: 'Le premier sachet : soudures à dents de scie, film brossé, plis tirés au hasard à l’ouverture.' }
  ];
  var BY = {}; SHAPES.forEach(function (s) { BY[s.id] = s; });
  var lab = { shape: null, pack: 'standard' };
  var SHORT = { daily: 'Quotidien', standard: 'Atlas', saga: 'Nord', soleil: 'Japon', nil: 'Égypte', nuit: 'Nuit', ultime: 'Ultime' };

  /* Propositions de visuel pour les sagas : un emblème et un coloris chacune (pack3d.js : DESIGN, THEMES).
     Choisir une proposition l’applique au vrai booster (accueil, ouverture) ; le choix est gardé sur l’appareil. */
  var PROPS = {
    soleil: [
      { key: 'torii', name: 'Torii', col: 'Vermillon', theme: 'e-vermillon', design: 'torii' },
      { key: 'fuji', name: 'Mont Fuji', col: 'Laque noire', theme: 'p-laque', design: 'fuji' },
      { key: 'vague', name: 'Grande vague', col: 'Indigo', theme: 'p-indigo', design: 'vague' },
      { key: 'sakura', name: 'Sakura', col: 'Rose poudré', theme: 'p-sakura', design: 'sakura' },
      { key: 'tomoe', name: 'Tomoe', col: 'Feuille d’or', theme: 'p-or', design: 'tomoe' },
      { key: 'pagode', name: 'Pagode', col: 'Encre sumi', theme: 'p-sumi', design: 'pagode' }
    ],
    saga: [
      { key: 'yggdrasil', name: 'Yggdrasil', col: 'Glacier', theme: 'e-glacier', design: 'runes' },
      { key: 'drakkar', name: 'Drakkar', col: 'Nuit polaire', theme: 'p-polaire', design: 'drakkar' },
      { key: 'aurore', name: 'Aurore boréale', col: 'Fjord vert', theme: 'p-aurore', design: 'aurore' },
      { key: 'mjolnir', name: 'Mjölnir', col: 'Acier', theme: 'p-acier', design: 'mjolnir' },
      { key: 'bouclier', name: 'Bouclier', col: 'Sang', theme: 'p-sang', design: 'bouclier' },
      { key: 'entrelacs', name: 'Entrelacs', col: 'Fjord', theme: 'p-fjord', design: 'entrelacs' }
    ],
    nil: [
      { key: 'ailes', name: 'Soleil ailé', col: 'Feuille d’or', theme: 'e-or', design: 'ailes' },
      { key: 'oudjat', name: 'Œil d’Horus', col: 'Lapis-lazuli', theme: 'p-lapis', design: 'oudjat' },
      { key: 'scarabee', name: 'Scarabée', col: 'Faïence turquoise', theme: 'p-faience', design: 'scarabee' },
      { key: 'ankh', name: 'Ankh', col: 'Obsidienne', theme: 'p-obsidienne', design: 'ankh' },
      { key: 'barque', name: 'Barque solaire', col: 'Cuivre', theme: 'p-cuivre', design: 'barque' },
      { key: 'lotus', name: 'Lotus', col: 'Malachite', theme: 'p-malachite', design: 'lotus' }
    ]
  };
  function looks() { try { return JSON.parse(localStorage.getItem('atlas-pack-look') || '{}') || {}; } catch (e) { return {}; } }
  function lookOf(pack) { var k = looks()[pack]; return PROPS[pack].some(function (o) { return o.key === k; }) ? k : PROPS[pack][0].key; }
  function applyLook(pack, key) {
    var o = PROPS[pack].filter(function (v) { return v.key === key; })[0]; if (!o) return;
    A.PACK[pack].theme = o.theme; A.PACK[pack].design = o.design;
    if (A.pack3d && A.pack3d.forget) A.pack3d.forget(pack);
  }
  // Un sachet par proposition (hors de A.PACKS : il n’apparaît nulle part ailleurs) ; puis le choix gardé sur l’appareil
  Object.keys(PROPS).forEach(function (pack) {
    PROPS[pack].forEach(function (o) {
      A.PACK['x-' + pack + '-' + o.key] = Object.assign({}, A.PACK[pack], { id: 'x-' + pack + '-' + o.key, theme: o.theme, design: o.design });
    });
    applyLook(pack, lookOf(pack));
  });

  function active() { try { var v = localStorage.getItem('atlas-pack-shape') || 'strie'; return BY[v] ? v : 'classic'; } catch (e) { return 'strie'; } }   // par défaut : le Strié
  function frameSrc(shape, pack) { return './?shape=' + shape + '#/booster-solo?pack=' + pack; }
  function tagCls(t) { return t === 'Actuelle' ? 'is-on' : t === 'Secours' || t === 'Essai' || t === 'Base' ? 'is-alt' : 'is-off'; }
  function status(p) {
    if (p.test) return 'Test';
    if (p.daily) return 'Chaque jour';
    if (p.timer) return 'Toutes les 15 min';
    if (p.event) { var d = Math.ceil(A.store.eventRemaining(p.id) / 864e5); return d > 0 ? 'Événement · encore ' + d + ' j' : 'Événement terminé'; }
    return 'À gagner';
  }

  P.boosterLab = {
    title: 'Design des boosters',
    render: function () {
      var cur = active(), sel = lab.shape || cur;
      return '<section class="page-head"><div class="container">' +
          '<p class="eyebrow">Atelier · test</p><h1 class="h1">Design des boosters</h1>' +
          '<p class="lead">La forme du sachet en grand, tous les boosters et les deux formes du modèle 3D côte à côte.</p>' +
        '</div></section>' +
        '<section class="section-tight"><div class="container bl-main">' +
          '<div class="bl-stage"><iframe class="bl-frame" data-bl-big src="' + frameSrc(sel, lab.pack) + '" title="Sachet en grand"></iframe>' +
            '<p class="bl-hint">Survolez le sachet pour le faire tourner</p></div>' +
          '<div class="bl-side">' +
            U.secHead('Forme', 'Version du modèle') +
            '<div class="bl-versions">' + SHAPES.map(function (s) {
              return '<button type="button" class="bl-v' + (s.id === sel ? ' is-on' : '') + '" data-bl-shape="' + s.id + '">' +
                '<span class="bl-v-top"><b>' + s.name + '</b><span class="bl-tag ' + tagCls(s.tag) + '">' + s.tag + '</span></span>' +
                '<span class="bl-v-meta">' + s.ver + ' · ' + s.date + '</span>' +
                '<span class="bl-v-desc">' + s.desc + '</span></button>';
            }).join('') + '</div>' +
            '<p class="eyebrow bl-lab">Booster affiché</p>' +
            '<div class="chips bl-chips">' + A.PACKS.map(function (p) {
              return '<button type="button" class="chip' + (p.id === lab.pack ? ' is-active' : '') + '" data-bl-pack="' + p.id + '">' + (SHORT[p.id] || p.name) + '</button>';
            }).join('') + '</div>' +
            '<div class="bl-actions"><button type="button" class="btn btn-primary" data-bl-use>Voir sur l’accueil</button><span class="muted small" data-bl-state></span></div>' +
          '</div>' +
        '</div></section>' +
        '<section class="section bl-sec"><div class="container">' + U.secHead('Collection', 'Tous les boosters') +
          '<p class="bl-note">Avec la forme chargée à l’ouverture de la page (' + (BY[window.ATLAS_SHAPE] || BY[cur]).name + ').</p>' +
          '<div class="bl-grid">' + A.PACKS.map(function (p) {
            return '<article class="bl-pack"><div class="bl-pack-art">' + A.pack.html(p, { tilt: true }) + '</div>' +
              '<div class="bl-pack-info"><p class="eyebrow">' + status(p) + '</p><h3>' + p.name + '</h3>' +
              '<p class="muted small">' + p.size + ' cartes · ' + p.collections.length + ' collection' + (p.collections.length > 1 ? 's' : '') + '</p>' +
              '<button type="button" class="link-btn small" data-bl-pick="' + p.id + '">Voir en grand</button></div></article>';
          }).join('') + '</div></div></section>' +
        Object.keys(PROPS).map(function (pack) {
          var on = lookOf(pack);
          return '<section class="section bl-sec"><div class="container">' + U.secHead('Propositions', A.PACK[pack].name) +
            '<p class="bl-note">Six visuels possibles. « Choisir » l’applique au booster, sur l’accueil et à l’ouverture.</p>' +
            '<div class="bl-props">' + PROPS[pack].map(function (o, i) {
              var id = 'x-' + pack + '-' + o.key;
              return '<article class="bl-prop' + (o.key === on ? ' is-on' : '') + '"><div class="bl-pack-art">' + A.pack.html(A.PACK[id], { tilt: true }) + '</div>' +
                '<div class="bl-pack-info"><p class="eyebrow">' + (i ? 'Proposition ' + i : 'Visuel d’origine') + '</p><h3>' + o.name + '</h3>' +
                '<p class="muted small">' + o.col + '</p>' +
                '<button type="button" class="btn btn-sm ' + (o.key === on ? 'btn-primary' : 'btn-ghost') + '" data-bl-look="' + pack + ':' + o.key + '">' + (o.key === on ? 'Choisi' : 'Choisir') + '</button></div></article>';
            }).join('') + '</div></div></section>';
        }).join('') +
        '<section class="section"><div class="container">' + U.secHead('Comparer', 'Toutes les formes') +
          '<div class="bl-hist is-two">' + SHAPES.map(function (s) {
            return '<article class="bl-h"><div class="bl-h-frame"><iframe loading="lazy" src="' + frameSrc(s.id, 'standard') + '" title="' + s.name + '"></iframe></div>' +
              '<div class="bl-h-info"><span class="bl-tag ' + tagCls(s.tag) + '">' + s.tag + '</span><h3>' + s.name + '</h3>' +
              '<p class="muted small">' + s.ver + ' · ' + s.date + '</p><p class="bl-h-desc">' + s.desc + '</p>' +
              '<button type="button" class="link-btn small" data-bl-show="' + s.id + '">Voir en grand</button></div></article>';
          }).join('') + '</div></div></section>';
    },
    mount: function (root) {
      A.pack.mountAll(root);
      var big = root.querySelector('[data-bl-big]'), cur = active();
      function sync() {
        var sel = lab.shape || cur;
        var src = frameSrc(sel, lab.pack);
        if (big.getAttribute('src') !== src) big.setAttribute('src', src);
        root.querySelectorAll('[data-bl-shape]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-bl-shape') === sel); });
        root.querySelectorAll('[data-bl-pack]').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-bl-pack') === lab.pack); });
        root.querySelector('[data-bl-state]').textContent = 'Sur l’accueil : ' + BY[active()].name;
        root.querySelectorAll('[data-bl-shape] .bl-v-meta em').forEach(function (em) { em.remove(); });
        var on = root.querySelector('[data-bl-shape="' + active() + '"] .bl-v-meta');
        if (on) on.insertAdjacentHTML('beforeend', '<em> · sur l’accueil</em>');
      }
      // La forme choisie devient celle du site (accueil, ouvertures) : app.js recharge en quittant la page
      function apply(id) { try { localStorage.setItem('atlas-pack-shape', id); } catch (er) { /* stockage indisponible */ } }
      function toStage() { var top = root.querySelector('.bl-main').getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' }); }
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-bl-shape]'))) { lab.shape = t.getAttribute('data-bl-shape'); apply(lab.shape); sync(); return; }
        if ((t = e.target.closest('[data-bl-pack]'))) { lab.pack = t.getAttribute('data-bl-pack'); sync(); return; }
        if ((t = e.target.closest('[data-bl-look]'))) {
          var pl = t.getAttribute('data-bl-look').split(':'), all = looks();
          all[pl[0]] = pl[1];
          try { localStorage.setItem('atlas-pack-look', JSON.stringify(all)); } catch (er) { /* stockage indisponible */ }
          applyLook(pl[0], pl[1]);
          root.querySelectorAll('[data-bl-look^="' + pl[0] + ':"]').forEach(function (b) {
            var me = b === t;
            b.textContent = me ? 'Choisi' : 'Choisir';
            b.classList.toggle('btn-primary', me); b.classList.toggle('btn-ghost', !me);
            b.closest('.bl-prop').classList.toggle('is-on', me);
          });
          U.toast(A.PACK[pl[0]].name + ' : ' + t.closest('.bl-prop').querySelector('h3').textContent);
          return;
        }
        if ((t = e.target.closest('[data-bl-pick]'))) { lab.pack = t.getAttribute('data-bl-pick'); sync(); toStage(); return; }
        if ((t = e.target.closest('[data-bl-show]'))) { lab.shape = t.getAttribute('data-bl-show'); apply(lab.shape); sync(); toStage(); return; }
        if (e.target.closest('[data-bl-use]')) location.hash = '#/';   // l’accueil se recharge avec la forme choisie (app.js)
      });
      sync();
    }
  };

  /* Un sachet seul, en grand, sur fond transparent : contenu des fenêtres de la page ci-dessus */
  P.boosterSolo = {
    title: 'Sachet',
    render: function (ctx) {
      var p = A.PACK[ctx.query.pack] || A.PACK.standard;
      return '<div class="bsolo">' + A.pack.html(p, { tilt: true }) + '</div>';
    },
    mount: function (root) {
      A.pack.mountAll(root);
      var pk = root.querySelector('.pk');
      if (pk && pk._rig) pk._rig.idle(true);
    }
  };
})(window.ATLAS);
