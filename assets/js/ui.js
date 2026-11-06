/* ==========================================================================
   ATLAS — Composants d’interface
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store;
  var U = A.ui = {};

  /* ---------- Formatage ---------- */
  U.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.num = function (x) { return x === Infinity ? '∞' : Number(x).toLocaleString('fr-FR'); };
  U.pct = function (p) {
    var v = p * 100;
    var d = v >= 10 ? 1 : v >= 1 ? 2 : v >= 0.1 ? 2 : 3;
    return v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' %';
  };
  U.date = function (t) { return new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); };
  U.ago = function (t) {
    var s = (Date.now() - t) / 1000;
    if (s < 60) return 'à l’instant';
    if (s < 3600) return 'il y a ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'il y a ' + Math.floor(s / 3600) + ' h';
    if (s < 86400 * 30) return 'il y a ' + Math.floor(s / 86400) + ' j';
    return U.date(t);
  };
  U.duration = function (ms) {
    var h = Math.floor(ms / 3600000), d = Math.floor(h / 24), m = Math.floor((ms % 3600000) / 60000);
    if (d > 0) return d + ' j ' + (h % 24) + ' h';
    return h + ' h ' + String(m).padStart(2, '0') + ' min';
  };
  U.serial = function (serial, supply) {
    if (supply == null) return '';
    if (supply === 1) return '1/1';
    if (serial == null) return '/' + supply;
    // Autant de chiffres que le tirage : 04/25, 018/250, 0007/1000.
    return String(serial).padStart(String(supply).length, '0') + '/' + supply;
  };

  /* ---------- Icônes ---------- */
  var IC = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
    pack: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 8h14"/><circle cx="12" cy="14" r="2.2"/>',
    cards: '<rect x="8" y="3" width="12" height="16" rx="1.5"/><path d="M5 6.5v12A2.5 2.5 0 0 0 7.5 21H16"/>',
    market: '<path d="M3.5 9 5 4h14l1.5 5"/><path d="M4.5 9v11h15V9"/><path d="M3.5 9a2.8 2.8 0 0 0 5.5 0 2.8 2.8 0 0 0 5.5 0 2.8 2.8 0 0 0 5.5 0"/><path d="M10 20v-5h4v5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    swap: '<path d="M4 8h15l-4-4M20 16H5l4 4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    tag: '<path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-7.1 7.1a1.4 1.4 0 0 1-2 0z"/><circle cx="8" cy="8" r="1.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.8 4.3-5.6 7.5-5.6s6.1 1.8 7.5 5.6"/>',
    shield: '<path d="M12 3.2 19.5 6v5.6c0 4.6-3.2 7.8-7.5 9.2-4.3-1.4-7.5-4.6-7.5-9.2V6z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sparkle: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><circle cx="12" cy="12" r="1.6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    expand: '<path d="M14.5 4H20v5.5M9.5 20H4v-5.5M20 4l-6.5 6.5M4 20l6.5-6.5"/>',
    logout: '<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="m10 8-4 4 4 4M6 12h10"/>',
    sound: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    chevL: '<path d="m14.5 6-6 6 6 6"/>',
    chevR: '<path d="m9.5 6 6 6-6 6"/>',
    reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>'
  };
  U.icon = function (name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[name] || '') + '</svg>';
  };
  /* Logo : rose des vents à 4 branches à facettes (une moitié pleine, l’autre plus claire) dans un double cercle.
     Géométrie partagée (U.MARK) : le SVG et la texture 3D des boosters (pack3d.js) tracent la même chose. */
  U.MARK = {
    dark: 'M16 16L16 2.5L14.59 14.59Z M16 16L29.5 16L17.41 14.59Z M16 16L16 29.5L17.41 17.41Z M16 16L2.5 16L14.59 17.41Z',
    light: 'M16 16L16 2.5L17.41 14.59Z M16 16L29.5 16L17.41 17.41Z M16 16L16 29.5L14.59 17.41Z M16 16L2.5 16L14.59 14.59Z'
  };
  U.mark = function (cls) {
    return '<svg class="mark ' + (cls || '') + '" viewBox="0 0 32 32" aria-hidden="true">' +
      '<circle cx="16" cy="16" r="14.6" fill="none" stroke="currentColor" stroke-width=".9"/>' +
      '<circle cx="16" cy="16" r="10.6" fill="none" stroke="currentColor" stroke-width=".5" opacity=".6"/>' +
      '<path d="' + U.MARK.dark + '" fill="currentColor"/><path d="' + U.MARK.light + '" fill="currentColor" opacity=".45"/></svg>';
  };
  U.price = function (n, cls) {
    return '<span class="price ' + (cls || '') + '">' + U.icon('coin', 'coin') + '<span>' + U.num(n) + '</span></span>';
  };

  /* ---------- Carte ---------- */
  /**
   * @param {string} edId
   * @param {object} o { serial, uid, missing, open (bool), tilt (bool), badge, fav, show, select, selected, newBadge }
   */
  U.card = function (edId, o) {
    o = o || {};
    var ed = A.ED[edId], ch = A.CHAR[ed.charId], coll = A.COLL[ch.coll], R = A.R[ed.rarity];
    var serialTxt = U.serial(o.serial, ed.supply);
    var cls = 'card r-' + ed.rarity + (o.missing ? ' is-missing' : '') + (o.selected ? ' is-selected' : '') + (o.cls ? ' ' + o.cls : '');
    var attrs = ' data-ed="' + ed.id + '"' + (o.uid ? ' data-uid="' + o.uid + '"' : '') +
      (o.open !== false ? ' data-open' : '') + (o.tilt !== false ? ' data-tilt' : '') + (o.select ? ' data-select' : '');
    var longName = ch.name.length > 15 ? ' long' : '';
    var flags = '';
    if (o.badge) flags += '<span class="card-flag">' + o.badge + '</span>';
    if (o.newBadge) flags += '<span class="card-flag is-new">Nouveau</span>';
    var corner = '';
    if (o.fav || o.show) corner = '<span class="card-corner">' + (o.fav ? U.icon('star', 'fav') : '') + (o.show ? U.icon('eye') : '') + '</span>';
    if (o.select) corner = '<span class="card-check">' + U.icon('check') + '</span>';
    return '<article class="' + cls + '"' + attrs + ' tabindex="0" aria-label="' + U.esc(ch.name + ', ' + R.label + (serialTxt ? ' ' + serialTxt : '')) + '">' +
      '<div class="card-inner">' +
        '<div class="card-art">' + A.editionArt(ed, { scale: o.artScale }) + '<span class="card-glitter"></span>' + (o.missing ? '<span class="card-missing">Non possédée</span>' : '') + flags + corner + '</div>' +
        '<div class="card-body">' +
          '<div class="card-row"><h3 class="card-name' + longName + '">' + U.esc(ch.name) + '</h3>' + (serialTxt ? '<span class="card-serial">' + serialTxt + '</span>' : '') + '</div>' +
          '<div class="card-row card-sub"><span class="card-title">' + U.esc(ch.title) + '</span><span class="card-coll">' + U.esc(coll.name) + '</span></div>' +
          '<div class="card-row card-foot"><span class="card-stats"><span>ATQ<b>' + ch.atk + '</b></span><span>DÉF<b>' + ch.def + '</b></span><span>ESP<b>' + ch.esp + '</b></span></span>' +
          '<span class="card-rar"><i></i>' + R.label + '</span></div>' +
        '</div>' +
        '<span class="card-holo"></span><span class="card-sheen"></span><span class="card-shine"></span>' +
      '</div></article>';
  };

  U.cardBack = function (theme) {
    return '<div class="card-back' + (theme ? ' t-' + theme : '') + '"><div class="cb-frame">' + U.mark('cb-mark') +
      '<span class="cb-name">ATLAS</span><span class="cb-sub">Édition I</span></div></div>';
  };

  U.editionDots = function (charId) {
    var ch = A.CHAR[charId];
    return '<div class="ed-dots" title="Éditions possédées">' + A.RARITIES.map(function (r) {
      if (ch.editions.indexOf(r.id) === -1) return '<i class="ed-dot is-none"></i>';
      var own = S.ownedOf(charId + '-' + r.id).length > 0;
      return '<i class="ed-dot r-' + r.id + (own ? ' is-own' : '') + '" title="' + r.label + (own ? ' — possédée' : '') + '"></i>';
    }).join('') + '</div>';
  };

  U.progress = function (p, label) {
    return '<div class="progress"><span style="width:' + Math.round(p * 100) + '%"></span></div>' + (label ? '<p class="progress-label">' + label + '</p>' : '');
  };

  /* ---------- Toasts ---------- */
  U.toast = function (msg, kind) {
    var root = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' is-' + kind : '');
    el.innerHTML = (kind === 'error' ? U.icon('close') : U.icon('check')) + '<span>' + msg + '</span>';
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    setTimeout(function () { el.classList.remove('is-in'); setTimeout(function () { el.remove(); }, 400); }, 3200);
  };

  /* ---------- Modale ---------- */
  var modalClose = null;
  U.modal = function (html, o) {
    o = o || {};
    if (modalClose) modalClose(true);
    var root = document.getElementById('modal-root');
    var wrap = document.createElement('div');
    wrap.className = 'modal' + (o.cls ? ' ' + o.cls : '');
    wrap.innerHTML = '<div class="modal-backdrop" data-close></div><div class="modal-panel" role="dialog" aria-modal="true">' +
      '<button class="modal-x" data-close aria-label="Fermer">' + U.icon('close') + '</button><div class="modal-content">' + html + '</div></div>';
    root.appendChild(wrap);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () { wrap.classList.add('is-in'); });
    function onKey(e) { if (e.key === 'Escape') close(); }
    function close(instant) {
      document.removeEventListener('keydown', onKey);
      modalClose = null;
      document.body.classList.remove('no-scroll');
      if (o.onClose) o.onClose();
      if (instant) { wrap.remove(); return; }
      wrap.classList.remove('is-in');
      setTimeout(function () { wrap.remove(); }, 300);
    }
    wrap.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    modalClose = close;
    var content = wrap.querySelector('.modal-content');
    if (o.mount) o.mount(content, close);
    return { el: content, close: close };
  };
  U.closeModal = function () { if (modalClose) modalClose(); };

  U.confirm = function (o) {
    U.modal('<div class="dialog"><p class="eyebrow">' + (o.eyebrow || 'Confirmation') + '</p><h2 class="h3">' + o.title + '</h2>' +
      (o.body ? '<div class="dialog-body">' + o.body + '</div>' : '') +
      '<div class="dialog-actions"><button class="btn btn-ghost" data-close>Annuler</button><button class="btn btn-primary" data-ok>' + (o.ok || 'Confirmer') + '</button></div></div>',
      { cls: 'is-small', mount: function (el, close) { el.querySelector('[data-ok]').addEventListener('click', function () { close(true); o.onOk(); }); } });
  };

  /* ---------- Fiche détaillée d’une carte ---------- */
  function statRow(label, v) {
    return '<div class="stat"><span class="stat-l">' + label + '</span><span class="stat-bar"><i style="width:' + v + '%"></i></span><b>' + v + '</b></div>';
  }
  function detailHTML(edId, itemUid, more) {
    var ed = A.ED[edId], ch = A.CHAR[ed.charId], coll = A.COLL[ch.coll], R = A.R[ed.rarity];
    var item = itemUid ? S.item(itemUid) : null;
    if (item && item.ed !== edId) item = null;
    var owned = S.ownedOf(edId);
    var shown = item || owned[0];
    var minted = S.minted(edId), rem = S.remaining(edId);
    var floor = S.floor(edId);

    var tabs = ch.editions.map(function (rid) {
      var id = ch.id + '-' + rid, own = S.ownedOf(id).length;
      return '<button class="ed-tab r-' + rid + (id === edId ? ' is-active' : '') + '" data-ed-tab="' + id + '"><i></i>' + A.R[rid].label + (own ? '<span class="ed-own">' + own + '</span>' : '') + '</button>';
    }).join('');

    // Éditions Base (non numérotées) : les exemplaires sont interchangeables, on affiche juste leur nombre.
    var isBase = !ed.supply;
    var copies = !owned.length ? '<p class="muted small">Vous ne possédez pas encore cette édition.</p>' : isBase ? (function () {
      var ats = owned.map(function (it) { return it.at; }), first = Math.min.apply(null, ats), last = Math.max.apply(null, ats);
      return '<div class="copy is-active is-static">' + U.num(owned.length) + ' exemplaire' + (owned.length > 1 ? 's' : '') +
        '<small>' + (owned.length > 1 ? 'Du ' + U.date(first) + ' au ' + U.date(last) : 'Obtenu le ' + U.date(first)) + '</small></div>';
    })() : owned.map(function (it) {
      return '<button class="copy' + (item && it.uid === item.uid ? ' is-active' : '') + '" data-copy="' + it.uid + '">N° ' + U.serial(it.serial, ed.supply) + '<small>' + U.date(it.at) + '</small></button>';
    }).join('');

    // Provenance : les 2 événements les plus récents (hauteur fixe), le total en pastille.
    var prov = item ? '<div class="detail-prov"><p class="eyebrow">Provenance' + (item.hist.length > 2 ? ' <span class="eyebrow-count" title="' + item.hist.length + ' événements au total">' + item.hist.length + '</span>' : '') + '</p><ol class="timeline">' + item.hist.slice(0, 2).map(function (h) {
      return '<li><span>' + U.esc(h.t) + '</span><time>' + U.date(h.at) + '</time></li>';
    }).join('') + '</ol></div>' : '';

    var marketLink = '<a class="btn btn-ghost btn-sm market-btn" href="#/marketplace?q=' + encodeURIComponent(ch.name) + '" data-close title="Voir sur la marketplace">Marketplace' + U.icon('arrow') + '</a>';
    var actions = item ?
      '<div class="detail-actions">' +
        // Libellés constants (l’état actif se lit à la couleur) : les boutons gardent la même largeur.
        '<button class="btn btn-ghost btn-sm' + (item.fav ? ' is-on' : '') + '" data-act="fav" aria-pressed="' + !!item.fav + '" title="' + (item.fav ? 'Retirer des favoris' : 'Ajouter aux favoris') + '">' + U.icon('star') + '<span class="btn-l">Favori</span></button>' +
        '<button class="btn btn-ghost btn-sm' + (item.show ? ' is-on' : '') + '" data-act="show" aria-pressed="' + !!item.show + '" title="' + (item.show ? 'Retirer de la vitrine' : 'Exposer en vitrine') + '">' + U.icon('eye') + '<span class="btn-l">Vitrine</span></button>' +
        '<button class="btn btn-primary btn-sm" data-act="sell">' + U.icon('tag') + 'Mettre en vente</button>' +
        marketLink +
      '</div><div class="sell-form" hidden>' +
        '<div class="sell-row"><label class="input-unit"><span class="sell-l">Prix</span><input type="number" min="1" step="5" value="' + (floor || suggestPrice(ed.rarity)) + '" data-price aria-label="Prix de vente"><span>' + A.CURRENCY.name + '</span></label>' +
        '<button class="btn btn-ghost btn-sm" data-act="sell-cancel">Annuler</button><button class="btn btn-primary btn-sm" data-act="sell-ok" title="La carte est placée sous séquestre pendant la mise en vente">Confirmer la mise en vente</button></div>' +
      '</div>' : '';

    return '<div class="detail r-' + ed.rarity + '">' +
      '<div class="detail-visual">' +
        '<div class="detail-card" data-act="zoom" title="Voir en grand">' + U.card(edId, { serial: shown && shown.serial, open: false, missing: !owned.length }) + '</div>' +
        '<div class="ed-tabs" role="tablist">' + tabs + '</div>' +
        '<p class="placeholder-note">' + U.icon('sparkle') + 'Illustration provisoire — emplacement remplaçable</p>' +
      '</div>' +
      (more && ch.lore ? loreHTML(ch, coll) :
      '<div class="detail-info">' +
        '<p class="eyebrow">' + U.esc(coll.family) + ' · ' + U.esc(coll.name) + '</p>' +
        '<h2 class="detail-name">' + U.esc(ch.name) + '</h2>' +
        '<p class="detail-title">' + U.esc(ch.title) + '</p>' +
        '<p class="detail-bio">' + bioHTML(ch, ch.story || ch.bio) +
          (ch.more || ch.lore ? ' <button type="button" class="bio-more" data-act="bio-more" aria-expanded="' + !!more + '">' + (more ? 'Voir moins' : 'Voir plus') + '</button>' : '') + '</p>' +
        // « Voir plus » : le complément prend la place des statistiques (la fiche garde sa hauteur, sans défilement)
        (more && ch.more
          ? '<div class="detail-block detail-more"><p>' + bioHTML(ch, ch.more) + '</p></div>'
          : '<div class="detail-block"><div class="stats">' + statRow('Attaque', ch.atk) + statRow('Défense', ch.def) + statRow('Esprit', ch.esp) + '</div>' +
            '<p class="muted small">Statistiques identiques pour toutes les éditions : la rareté n’accorde aucun avantage.</p></div>') +
        '<div class="detail-block"><p class="eyebrow">Édition ' + R.label + '</p><dl class="facts">' +
          '<div><dt>Identité</dt><dd><span class="rar-chip r-' + ed.rarity + '"><i></i>' + R.identity + '</span></dd></div>' +
          '<div><dt>Tirage</dt><dd>' + (ed.supply ? U.num(ed.supply) + ' exemplaire' + (ed.supply > 1 ? 's' : '') : 'Illimité') + '</dd></div>' +
          '<div><dt>Émis</dt><dd>' + U.num(minted) + '</dd></div>' +
          '<div><dt>Disponibles</dt><dd>' + (ed.supply ? (rem > 0 ? U.num(rem) : '<span class="sold">Épuisée</span>') : '—') + '</dd></div>' +
          '<div><dt>Prix plancher</dt><dd>' + (floor ? U.price(floor) : '<span class="muted">Aucune annonce</span>') + '</dd></div>' +
        '</dl></div>' +
        '<div class="detail-block detail-split' + (prov ? '' : ' is-single') + '"><div class="detail-copies"><p class="eyebrow">Vos exemplaires' + (owned.length > 1 && !isBase ? ' <span class="eyebrow-count">' + owned.length + '</span>' : '') +
          '<span class="copies-nav" hidden><button class="cn-btn" data-cn="-1" aria-label="Exemplaires précédents">' + U.icon('chevL') + '</button><span class="cn-count"></span><button class="cn-btn" data-cn="1" aria-label="Exemplaires suivants">' + U.icon('chevR') + '</button></span></p><div class="copies is-row">' + copies + '</div></div>' + prov + '</div>' +
        (item ? actions : '<div class="detail-actions">' + marketLink + '</div>') +
      '</div>') + '</div>';
  }

  /* « Voir plus » d’un personnage qui a une chronique (lore.js) : la colonne d’infos laisse place
     au récit complet, à ses repères et à ses liens avec les autres figures. */
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  function loreHTML(ch, coll) {
    var L = ch.lore;
    var chapters = L.chapitres.map(function (c, i) {
      return '<section class="lore-ch"><h3 class="lore-h"><span class="lore-num">' + ROMAN[i] + '</span>' + U.esc(c.t) + '</h3>' +
        c.p.map(function (t) { return '<p>' + bioHTML(ch, t) + '</p>'; }).join('') + '</section>';
    }).join('');
    var reperes = '<dl class="lore-facts">' + L.reperes.map(function (r) {
      return '<div><dt>' + U.esc(r[0]) + '</dt><dd>' + U.esc(r[1]) + '</dd></div>';
    }).join('') + '</dl>';
    var liens = L.liens.map(function (grp) {
      return '<div class="lore-group"><p class="lore-gname">' + U.esc(grp.g) + '</p><ul class="lore-links">' + grp.items.map(function (it) {
        var o = it.c && A.CHAR[ch.coll + '-' + it.c];
        var name = o
          ? '<button type="button" class="lore-name is-in" data-bio-char="' + o.id + '" title="Voir la fiche de ' + U.esc(o.name) + '">' + U.esc(o.name) + U.icon('arrow') + '</button>'
          : '<span class="lore-name">' + U.esc(it.n || it.c) + '</span>';
        return '<li class="' + (o ? 'is-in' : 'is-out') + '"><span class="lore-rel">' + U.esc(it.rel) + '</span>' + name + '<span class="lore-note">' + U.esc(it.note) + '</span></li>';
      }).join('') + '</ul></div>';
    }).join('');
    return '<div class="detail-info lore">' +
      '<button type="button" class="lore-back" data-act="bio-more">' + U.icon('chevL') + 'Retour à la fiche</button>' +
      '<p class="eyebrow">Chronique · ' + U.esc(coll.family) + '</p>' +
      '<h2 class="detail-name">' + U.esc(ch.name) + '</h2>' +
      '<p class="detail-title">' + U.esc(ch.title) + '</p>' +
      '<p class="lore-intro">' + bioHTML(ch, L.intro) + '</p>' +
      '<div class="lore-body">' + chapters + '</div>' +
      '<div class="lore-block"><p class="eyebrow">Repères</p>' + reperes + '</div>' +
      '<div class="lore-block"><p class="eyebrow">Ses liens</p><p class="lore-hint muted small">Les noms soulignés d’une flèche sont dans la collection : touchez-les pour ouvrir leur fiche.</p>' + liens + '</div>' +
      '<button type="button" class="lore-back is-end" data-act="bio-more">' + U.icon('chevL') + 'Retour à la fiche</button>' +
    '</div>';
  }
  function suggestPrice(rid) { return { base: 30, rare: 180, epic: 520, legendary: 1600, mythic: 4500, unique: 25000 }[rid]; }

  /* ---------- Visionneuse plein écran ----------
     La carte s’affiche en très grand sur fond sombre ; inclinaison, reflets et
     relief suivent la souris. Fermeture : clic sur le fond, bouton ou Échap. */
  U.viewCard = function (edId, serial) {
    var root = document.getElementById('overlay-root') || document.body;
    var el = document.createElement('div');
    el.className = 'card-viewer';
    el.innerHTML = '<button class="cv-close" aria-label="Fermer">' + U.icon('close') + '</button>' +
      '<div class="cv-stage"><div class="cv-card">' + U.card(edId, { serial: serial, open: false, artScale: 3 }) + '</div></div>' +
      '<p class="cv-hint">Bougez la souris pour faire jouer la lumière · Échap pour fermer</p>';
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    function close() {
      document.removeEventListener('keydown', onKey, true);
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 380);
    }
    function onKey(e) { if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    el.addEventListener('click', function (e) { if (e.target.closest('.cv-close') || !e.target.closest('.cv-card')) close(); });
  };

  /* La fiche ouverte est notée dans l’URL (#/page?carte=…&ex=…) sans recharger la page :
     une actualisation la rouvre au même endroit. history.replaceState ne déclenche pas hashchange. */
  function setHashParams(set) {
    var h = location.hash.replace(/^#/, '') || '/', parts = h.split('?'), q = {};
    (parts[1] || '').split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    Object.keys(set).forEach(function (k) { if (set[k] == null) delete q[k]; else q[k] = set[k]; });
    var qs = Object.keys(q).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }).join('&');
    try { history.replaceState(history.state, '', '#' + parts[0] + (qs ? '?' + qs : '')); } catch (e) { /* file:// restreint */ }
  }
  /* Notice : [[slug]] ou [[slug|texte]] → lien vers la fiche d’un autre personnage de la collection */
  function bioHTML(ch, text) {
    return U.esc(text).replace(/\[\[([a-z0-9]+)(?:\|([^\]]+))?\]\]/g, function (m, slug, label) {
      var o = A.CHAR[ch.coll + '-' + slug];
      if (!o) return label || slug;
      return '<button type="button" class="bio-link" data-bio-char="' + o.id + '" title="Voir la fiche de ' + U.esc(o.name) + '">' + (label || U.esc(o.name)) + '</button>';
    });
  }
  U.openCard = function (edId, itemUid) {
    if (!A.ED[edId]) return;
    var cur = { ed: edId, uid: itemUid };
    U.modal('', {
      cls: 'is-detail',
      onClose: function () { setHashParams({ carte: null, ex: null }); },
      mount: function (el, close) {
        // Flèches de la rangée d’exemplaires : visibles seulement si ça déborde, grisées en bout de course.
        function updateNav() {
          var row = el.querySelector('.copies.is-row'), nav = el.querySelector('.copies-nav');
          if (!row || !nav) return;
          var max = row.scrollWidth - row.clientWidth, tiles = row.querySelectorAll('.copy');
          nav.hidden = max <= 1;
          if (nav.hidden) return;
          var btns = nav.querySelectorAll('.cn-btn'), unit = tiles[0].offsetWidth + 8;
          btns[0].disabled = row.scrollLeft <= 1;
          btns[1].disabled = row.scrollLeft >= max - 1;
          // Indicateur de page : des points (● ○) jusqu’à 6 pages, sinon « 2 / 13 ».
          var per = Math.max(1, Math.round(row.clientWidth / unit)), pages = Math.ceil(tiles.length / per);
          var page = row.scrollLeft >= max - 1 ? pages - 1 : Math.min(pages - 1, Math.round(row.scrollLeft / (per * unit)));
          var box = nav.querySelector('.cn-count');
          if (pages <= 6) {
            if (box.children.length !== pages) box.innerHTML = new Array(pages + 1).join('<button class="cn-dot" tabindex="-1"></button>');
            [].forEach.call(box.children, function (d, i) { d.classList.toggle('is-on', i === page); d.setAttribute('data-cn-page', i); d.setAttribute('aria-label', 'Page ' + (i + 1) + ' sur ' + pages); });
          } else box.textContent = (page + 1) + ' / ' + pages;
          box.title = 'Page ' + (page + 1) + ' sur ' + pages;
        }
        function draw() {
          var prev = el.querySelector('.copies.is-row'), keep = prev ? prev.scrollLeft : 0;
          setHashParams({ carte: cur.ed, ex: cur.uid || null });
          el.innerHTML = detailHTML(cur.ed, cur.uid, cur.more);
          var row = el.querySelector('.copies.is-row'), active = row && row.querySelector('.copy.is-active');
          if (row) {
            row.scrollLeft = keep;
            // L’exemplaire sélectionné reste visible.
            if (active) {
              var rr = row.getBoundingClientRect(), ar = active.getBoundingClientRect();
              if (ar.left < rr.left || ar.right > rr.right) row.scrollLeft += ar.left - rr.left - 2;
            }
          }
          updateNav();
        }
        draw();
        el.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('is-row')) updateNav(); }, true);
        // Molette verticale → défilement horizontal de la rangée d’exemplaires.
        el.addEventListener('wheel', function (e) {
          var row = e.target.closest && e.target.closest('.copies.is-row');
          if (!row || row.scrollWidth <= row.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          row.scrollLeft += e.deltaY; e.preventDefault();
        }, { passive: false });
        el.addEventListener('click', function (e) {
          var t;
          if ((t = e.target.closest('[data-ed-tab]'))) {
            cur.ed = t.getAttribute('data-ed-tab');
            var own = S.ownedOf(cur.ed);
            cur.uid = own[0] ? own[0].uid : null;
            draw(); return;
          }
          if ((t = e.target.closest('[data-cn-page]'))) {
            var rp = el.querySelector('.copies.is-row'), u = rp.querySelector('.copy').offsetWidth + 8;
            rp.scrollTo({ left: +t.getAttribute('data-cn-page') * Math.max(1, Math.round(rp.clientWidth / u)) * u, behavior: 'smooth' });
            return;
          }
          if ((t = e.target.closest('[data-cn]'))) {
            var r = el.querySelector('.copies.is-row');
            // Avance d’une page entière (2 tuiles + leurs écarts).
            var unit = r.querySelector('.copy').offsetWidth + 8;
            r.scrollBy({ left: +t.getAttribute('data-cn') * Math.max(1, Math.round(r.clientWidth / unit)) * unit, behavior: 'smooth' });
            return;
          }
          if ((t = e.target.closest('[data-copy]'))) { cur.uid = t.getAttribute('data-copy'); draw(); return; }
          if ((t = e.target.closest('[data-bio-char]'))) {
            // Lien de la notice : on passe à la fiche de ce personnage (meilleur exemplaire possédé, sinon édition Base)
            var cid = t.getAttribute('data-bio-char'), best = S.bestOwned(cid);
            cur.ed = best ? best.ed : cid + '-base';
            cur.uid = best ? best.uid : null;
            cur.more = false;
            draw(); return;
          }
          if ((t = e.target.closest('[data-act]'))) {
            var act = t.getAttribute('data-act');
            if (act === 'bio-more') {
              cur.more = !cur.more; draw();
              var A0 = A.CHAR[A.ED[cur.ed].charId];
              if (A0.lore) {
                var panel = el.closest('.modal-panel') || el, info = el.querySelector('.detail-info');
                var single = window.matchMedia('(max-width: 900px)').matches;
                var top = single && info ? info.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - 8 : 0;
                panel.scrollTo({ top: Math.max(0, top), behavior: cur.more ? 'smooth' : 'auto' });
              }
              return;
            }
            if (act === 'zoom') { var it = cur.uid && S.item(cur.uid); U.viewCard(cur.ed, it ? it.serial : null); return; }
            if (act === 'fav') { S.toggleFav(cur.uid); draw(); }
            if (act === 'show') { S.toggleShow(cur.uid); draw(); }
            if (act === 'sell') { el.querySelector('.sell-form').hidden = false; t.parentNode.hidden = true; el.querySelector('[data-price]').focus(); }
            if (act === 'sell-cancel') draw();
            if (act === 'sell-ok') {
              var price = parseInt(el.querySelector('[data-price]').value, 10);
              var res = S.list(cur.uid, price);
              if (res.ok) { close(); U.toast('Carte mise en vente pour ' + U.num(price) + ' ' + A.CURRENCY.name + ' · placée sous séquestre'); }
              else U.toast(res.error, 'error');
            }
          }
        });
      }
    });
  };

  /* ---------- Interactions globales des cartes ---------- */
  U.bindGlobal = function () {
    // Ouverture de la fiche
    document.addEventListener('click', function (e) {
      var c = e.target.closest('.card[data-open]');
      if (!c || e.target.closest('[data-stop]')) return;
      U.openCard(c.getAttribute('data-ed'), c.getAttribute('data-uid'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var c = e.target.closest && e.target.closest('.card[data-open]');
      if (c) U.openCard(c.getAttribute('data-ed'), c.getAttribute('data-uid'));
    });
    // Inclinaison douce au survol (pointeur fin uniquement)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    // (effet déclenché par la souris : conservé même en « animations réduites », sinon il disparaît sur beaucoup de PC Windows)
    var active = null;
    function reset(c) { if (!c) return; ['--rx', '--ry', '--px', '--py', '--fa'].forEach(function (p) { c.style.removeProperty(p); }); c.classList.remove('is-hover'); }
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card[data-tilt]');
      if (c !== active) { reset(active); active = c; }
      if (!c) return;
      var b = c.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      c.classList.add('is-hover');
      c.style.setProperty('--rx', ((0.5 - y) * 13).toFixed(2) + 'deg');
      c.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg');
      c.style.setProperty('--fa', (Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI + 64).toFixed(1) + 'deg');
      c.style.setProperty('--px', (0.5 - x).toFixed(3));
      c.style.setProperty('--py', (0.5 - y).toFixed(3));
      c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { reset(active); active = null; });
  };
})(window.ATLAS);
