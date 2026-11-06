/* ==========================================================================
   ATLAS — Atelier (administration du catalogue)   →  #/atelier
   --------------------------------------------------------------------------
   · État des illustrations : couverture par collection, rareté par rareté
   · Préparation d’une nouvelle carte : identifiant, ligne de catalogue,
     emplacements des fichiers à déposer pour la chaîne d’images
   Dans le prototype statique, l’atelier prépare les données à coller ; avec
   l’API (db/schema.sql) les mêmes formulaires écriront directement en base.
   ========================================================================== */
(function (A) {
  'use strict';
  var U = A.ui, P = A.pages;
  var RIDS = ['base', 'rare', 'epic', 'legendary', 'mythic', 'unique'];
  var LETTER = { base: 'B', rare: 'R', epic: 'E', legendary: 'L', mythic: 'M', unique: 'U' };

  function slugify(t) {
    return (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);
  }
  function q(t) { return "'" + String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
  function pathOf(edId) {
    var ed = A.ED[edId], ch = A.CHAR[ed.charId];
    return 'media/originals/' + ch.coll + '/' + ch.id.slice(ch.coll.length + 1) + '/' + ed.rarity + '.png';
  }

  function coverage() {
    var M = A.media;
    var groups = A.GROUPS.map(function (g) { return { name: g.name, subs: g.subs }; });
    var inGroup = {};
    A.GROUPS.forEach(function (g) { g.subs.forEach(function (s) { inGroup[s] = 1; }); });
    A.COLLECTIONS.forEach(function (c) { if (!inGroup[c.id]) groups.push({ name: c.name, subs: [c.id] }); });
    return groups.map(function (g) {
      return '<div class="at-group"><p class="eyebrow">' + U.esc(g.name) + '</p>' + g.subs.map(function (cid) {
        var c = A.COLL[cid];
        if (!c) return '';
        var eds = [], done = 0;
        c.chars.forEach(function (id) { A.CHAR[id].editions.forEach(function (r) { eds.push(id + '-' + r); if (M.has(id + '-' + r)) done++; }); });
        var pct = eds.length ? Math.round(done / eds.length * 100) : 0;
        var secret = A.SECRET && A.SECRET[cid];
        return '<details class="at-coll"><summary><span class="at-name">' + U.esc(c.name) + '</span>' +
          '<span class="at-bar"><i style="width:' + pct + '%"></i></span><span class="at-num">' + done + '/' + eds.length + '</span></summary>' +
          '<div class="at-rows">' + c.chars.map(function (id) {
            var ch = A.CHAR[id];
            return '<div class="at-row"><span class="at-char">' + U.esc(ch.name) + '</span><span class="at-cells">' + RIDS.map(function (r) {
              var ed = id + '-' + r;
              if (ch.editions.indexOf(r) === -1) return '<span class="at-cell is-none"></span>';
              return M.has(ed)
                ? '<span class="at-cell is-ok r-' + r + '" title="' + ed + '">' + M.picture(ed, { ctx: 'duel' }) + '</span>'
                : '<button class="at-cell r-' + r + '" data-path="' + pathOf(ed) + '" title="À déposer : ' + pathOf(ed) + '">' + LETTER[r] + '</button>';
            }).join('') + '</span></div>';
          }).join('') +
          (secret ? '<div class="at-row"><span class="at-char">' + U.esc(secret.name) + ' <small>secret</small></span><span class="at-cells">' +
            (M.has('secret-' + cid) ? '<span class="at-cell is-ok">' + M.picture('secret-' + cid, { ctx: 'duel' }) + '</span>'
              : '<button class="at-cell" data-path="media/originals/secrets/' + cid + '.png">S</button>') + '</span></div>' : '') +
          '</div></details>';
      }).join('') + '</div>';
    }).join('');
  }

  P.atelier = {
    title: 'Atelier',
    render: function () {
      var M = A.media, total = A.EDITIONS.length, n = 0;
      A.EDITIONS.forEach(function (e) { if (M.has(e.id)) n++; });
      var lods = (A.MEDIA_MANIFEST.lods || []).map(function (l) { return l.width + ' px'; }).join(' · ');
      return '<section class="page-head"><div class="container"><p class="eyebrow">Administration</p><h1 class="h1">Atelier</h1>' +
        '<p class="lead">Illustrations, cartes et collections : ce qui est en place, ce qui reste à peindre.</p>' +
        '<p><a class="btn btn-ghost btn-sm" href="#/infos">Style de la description en ouverture ' + U.icon('arrow') + '</a></p></div></section>' +
        '<section class="section-tight"><div class="container ds">' +
          '<div class="ds-block"><p class="eyebrow">Illustrations définitives</p><div class="at-stats">' +
            '<div><b>' + n + '</b><span>sur ' + U.num(total) + ' éditions</span></div>' +
            '<div><b>' + Math.round(n / total * 1000) / 10 + ' %</b><span>du catalogue</span></div>' +
            '<div><b>' + M.fmt.toUpperCase() + '</b><span>format servi ici</span></div>' +
            '<div><b>3 LOD</b><span>' + lods + '</span></div>' +
          '</div><p class="muted small">Les autres cartes utilisent l’aquarelle générée, sans téléchargement. Source des images : <code>' + U.esc(M.base) + '</code></p></div>' +

          '<div class="ds-block"><p class="eyebrow">Ajouter des illustrations</p><ol class="at-steps">' +
            '<li>Déposer l’original sans perte (PNG ou TIFF, 2048 px conseillés) à l’emplacement indiqué : touchez une case vide ci-dessous pour copier son chemin.</li>' +
            '<li>Lancer <code>cd tools/media && npm run build</code> : 3 niveaux (256, 768, 2048 px) en AVIF et WebP, seulement pour les fichiers nouveaux.</li>' +
            '<li>Publier : <code>npm run upload</code> vers Cloudflare R2, ou commiter <code>media/dist</code>. Détails : <code>docs/images.md</code>.</li>' +
          '</ol></div>' +

          '<div class="ds-block"><p class="eyebrow">Couverture par collection</p><div class="at-legend">' +
            RIDS.map(function (r) { return '<span class="at-lg"><span class="at-cell">' + LETTER[r] + '</span>' + A.R[r].label + '</span>'; }).join('') + '</div>' + coverage() + '</div>' +

          '<div class="ds-block"><p class="eyebrow">Nouvelle carte</p><form class="at-form" data-new autocomplete="off">' +
            '<label>Collection<span class="select"><select name="coll">' + A.COLLECTIONS.map(function (c) { return '<option value="' + c.id + '">' + U.esc(c.name) + '</option>'; }).join('') + '</select></span></label>' +
            '<label>Nom<input name="name" placeholder="Ex. Héphaïstos" required></label>' +
            '<label>Titre<input name="title" placeholder="Ex. Forgeron des dieux"></label>' +
            '<div class="at-3"><label>Attaque<input name="atk" type="number" min="1" max="99" value="60"></label><label>Défense<input name="def" type="number" min="1" max="99" value="60"></label><label>Esprit<input name="esp" type="number" min="1" max="99" value="60"></label></div>' +
            '<fieldset><legend>Éditions</legend>' + RIDS.map(function (r) { return '<label class="at-check"><input type="checkbox" name="ed" value="' + r + '"' + (r !== 'unique' ? ' checked' : '') + '>' + A.R[r].label + '</label>'; }).join('') + '</fieldset>' +
            '<label class="at-wide">Notice<textarea name="notice" rows="3" placeholder="Deux ou trois phrases. Liens : [[slug]] ou [[collection:slug|texte]]"></textarea></label>' +
          '</form><pre class="at-out" data-out></pre><button class="btn btn-ghost btn-sm" data-copy-out>Copier</button></div>' +
        '</div></section>';
    },
    mount: function (root) {
      var form = root.querySelector('[data-new]'), out = root.querySelector('[data-out]');
      function update() {
        var f = form.elements, name = f.name.value.trim(), slug = slugify(name) || 'slug', coll = f.coll.value;
        var eds = [].filter.call(f.ed, function (i) { return i.checked; }).map(function (i) { return i.value; });
        var taken = A.CHAR[coll + '-' + slug];
        var row = '[' + [q(slug), q(name || 'Nom'), q(f.title.value.trim() || 'Titre'), +f.atk.value || 0, +f.def.value || 0, +f.esp.value || 0,
          q(eds.map(function (r) { return LETTER[r]; }).join('')), q(f.notice.value.trim())].join(', ') + ']';
        out.textContent =
          (taken ? '⚠ « ' + coll + '-' + slug + ' » existe déjà\n\n' : '') +
          '// data.js → RAW.' + coll + '\n' + row + ',\n\n' +
          '# Illustrations à déposer, puis : cd tools/media && npm run build\n' +
          eds.map(function (r) { return 'media/originals/' + coll + '/' + slug + '/' + r + '.png'; }).join('\n');
      }
      form.addEventListener('input', update);
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      update();
      function copy(t, msg) {
        var done = function () { U.toast(msg); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { U.toast(t); });
        else U.toast(t);
      }
      root.querySelector('[data-copy-out]').addEventListener('click', function () { copy(out.textContent, 'Copié'); });
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-path]');
        if (b) copy(b.getAttribute('data-path'), 'Chemin copié : ' + b.getAttribute('data-path'));
      });
    }
  };

  /* ---------- #/infos : choix de la mise en forme de la description (appui long en ouverture) ---------- */
  P.infos = {
    title: 'Description des cartes',
    render: function () {
      var cur = U.infoStyle(), ed = 'grece-zeus-legendary';
      return '<section class="page-head"><div class="container"><p class="eyebrow">Ouverture de booster</p><h1 class="h1">Description des cartes</h1>' +
        '<p class="lead">Ce qui s’affiche quand on maintient le doigt sur une carte. Touchez une carte pour rejouer l’animation, puis choisissez votre style.</p></div></section>' +
        '<section class="section-tight"><div class="container info-grid">' + U.INFO_STYLES.map(function (st) {
          return '<div class="info-opt' + (st.id === cur ? ' is-current' : '') + '" data-style="' + st.id + '">' +
            '<div class="info-face r-' + A.ED[ed].rarity + '">' + U.card(ed, { serial: 18, open: false, tilt: false }) + U.cardInfo(ed, st.id).replace('class="rv-info ', 'class="rv-info is-on ') + '</div>' +
            '<h3 class="h3">' + st.label + '</h3><p class="muted small">' + st.desc + '</p>' +
            '<button class="btn btn-sm ' + (st.id === cur ? 'btn-primary' : 'btn-ghost') + '" data-pick="' + st.id + '">' + (st.id === cur ? 'Style choisi' : 'Choisir ce style') + '</button></div>';
        }).join('') + '</div></section>';
    },
    mount: function (root) {
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pick]');
        if (b) { U.infoStyle(b.getAttribute('data-pick')); U.toast('Style « ' + b.closest('.info-opt').querySelector('.h3').textContent + ' » choisi pour vos prochaines ouvertures'); A.app.rerender(); return; }
        var f = e.target.closest('.info-face');
        if (f) {
          var box = f.querySelector('.rv-info');
          box.classList.remove('is-on');
          setTimeout(function () { box.classList.add('is-on'); }, 450);
        }
      });
    }
  };
})(window.ATLAS);
