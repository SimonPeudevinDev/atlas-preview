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
    reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
    // Pictogrammes des récompenses et missions (même trait que le reste de l’interface)
    key: '<circle cx="7.5" cy="12" r="3.8"/><circle cx="7.5" cy="12" r="1.2"/><path d="M11.3 12h9.2M17.5 12v3.2M20.5 12v2.4"/>',
    laurel: '<path d="M9 20.5c-3.4-2.2-5.4-6.2-4.6-11"/><path d="M15 20.5c3.4-2.2 5.4-6.2 4.6-11"/><path d="M4.6 12.4c1.6 0 2.7.7 3.3 2M4.5 9.2c1.4.3 2.3 1.1 2.7 2.4M5.9 15.8c1.5-.3 2.8.1 3.7 1.2"/><path d="M19.4 12.4c-1.6 0-2.7.7-3.3 2M19.5 9.2c-1.4.3-2.3 1.1-2.7 2.4M18.1 15.8c-1.5-.3-2.8.1-3.7 1.2"/><path d="m12 4 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5L11 6z"/>',
    gift: '<rect x="4.5" y="10" width="15" height="10" rx="1"/><path d="M3.5 7.5h17V10h-17zM12 7.5V20"/><path d="M12 7.5C10.6 4.6 7.5 4.3 7.5 6c0 1.3 2 1.5 4.5 1.5zM12 7.5c1.4-2.9 4.5-3.2 4.5-1.5 0 1.3-2 1.5-4.5 1.5z"/>',
    swords: '<path d="M4.5 4.5 15 15M4.5 4.5h2.8M4.5 4.5v2.8"/><path d="M19.5 4.5 9 15M19.5 4.5h-2.8M19.5 4.5v2.8"/><path d="M12.6 17.4l4.8-4.8M11.4 17.4l-4.8-4.8M16.5 16.5l3 3M7.5 16.5l-3 3"/>',
    flame: '<path d="M12 21c-3.6 0-6-2.5-6-5.8 0-3.6 3-5.4 3.6-9.2 2.2 1.4 3.2 3.4 3.2 5.2 1-.6 1.6-1.7 1.8-3 1.9 1.6 3.4 4 3.4 6.9 0 3.4-2.4 5.9-6 5.9z"/><path d="M12 21c-1.5 0-2.6-1.1-2.6-2.6 0-1.7 1.4-2.6 2.6-4.2 1.2 1.6 2.6 2.5 2.6 4.2 0 1.5-1.1 2.6-2.6 2.6z"/>',
    frame: '<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><rect x="7.2" y="6.7" width="9.6" height="10.6" rx=".6"/>',
    scroll: '<path d="M8 4h10.5a2 2 0 0 1 0 4H8"/><path d="M8 4a2 2 0 0 0-2 2v12.5A1.5 1.5 0 0 0 7.5 20H17a2 2 0 0 0 2-2V8"/><path d="M9.5 11.5h6M9.5 15h4"/>',
    medal: '<circle cx="12" cy="15" r="5.2"/><path d="M8.6 3.5l2.4 6.7M15.4 3.5 13 10.2"/><path d="m12 12.6.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z"/>'
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

  /* ---------- Description d’une carte (appui long pendant l’ouverture d’un booster) ----------
     Plusieurs mises en forme possibles (page #/infos) ; le choix est mémorisé sur l’appareil. */
  U.INFO_STYLES = [
    { id: 'cartel', label: 'Le cartel', desc: 'On fait défiler la carte : l’illustration remonte et la notice apparaît en dessous, sur le même papier.' },
    { id: 'verso', label: 'Le verso', desc: 'La carte se retourne : son dos imprimé, comme une vraie carte de collection.' },
    { id: 'voile', label: 'Le voile', desc: 'Un voile de papier recouvre l’illustration et le texte apparaît à l’encre.' },
    { id: 'ombre', label: 'L’ombre (actuel)', desc: 'Un dégradé sombre monte sur la carte, texte clair.' }
  ];
  U.infoStyle = function (v) {
    try { if (v) localStorage.setItem('atlas-info', v); return localStorage.getItem('atlas-info') || 'cartel'; } catch (e) { return v || 'cartel'; }
  };
  function plain(ch, text) {            // texte sans liens [[…]] (noms résolus)
    return U.esc(text).replace(/\[\[([a-z0-9:]+)(?:\|([^\]]+))?\]\]/g, function (m, slug, label) { var o = U.charRef(ch, slug); return label || (o ? U.esc(o.name) : slug); });
  }
  /* Affiche ou masque la description sur une carte (face = élément qui contient la .card).
     Style « cartel » : la notice est glissée DANS la carte (sous le cadre de rareté) et le contenu
     de la carte remonte exactement de sa hauteur, comme si l’on faisait défiler la carte. */
  U.infoToggle = function (face, edId, on, style) {
    style = style || U.infoStyle();
    var box = face.querySelector('.rv-info');
    if (on && !box) {
      var tmp = document.createElement('div');
      tmp.innerHTML = U.cardInfo(edId, style);
      box = tmp.firstChild;
      (style === 'cartel' ? face.querySelector('.card-inner') : face).appendChild(box);
    }
    if (!box) return;
    if (style === 'cartel' && on) face.style.setProperty('--rd', box.querySelector('.ri-in').offsetHeight + 'px');
    void box.offsetWidth;
    box.classList.toggle('is-on', on);
    face.classList.toggle('is-reading', on && style === 'cartel');
  };
  U.cardInfo = function (edId, style) {
    var ed = A.ED[edId], ch = A.CHAR[ed.charId], R = A.R[ed.rarity];
    return '<div class="rv-info v-' + (style || U.infoStyle()) + '"><div class="ri-in">' +
      '<span class="ri-mark">' + U.mark() + '</span>' +
      '<p class="rv-info-k">' + U.esc(A.COLL[ch.coll].name) + '</p>' +
      '<p class="rv-info-n">' + U.esc(ch.name) + '</p>' +
      '<p class="rv-info-t">' + U.esc(ch.title) + '</p>' +
      '<span class="ri-rule"></span>' +
      '<p class="rv-info-b">' + U.esc(ch.bio) + '</p>' +
      (ch.story ? '<p class="ri-story">' + plain(ch, ch.story) + '</p>' : '') +
      '<span class="ri-bar"></span>' +
      '<p class="ri-foot"><span>ATQ <b>' + ch.atk + '</b></span><span>DÉF <b>' + ch.def + '</b></span><span>ESP <b>' + ch.esp + '</b></span><span class="ri-rar"><i></i>' + R.label + '</span></p>' +
    '</div></div>';
  };

  /* ---------- Carte ---------- */
  /**
   * @param {string} edId
   * @param {object} o { serial, uid, missing, open (bool), tilt (bool), badge, fav, show, select, selected, newBadge }
   */
  U.card = function (edId, o) {
    o = o || {};
    var ed = A.ED[edId], ch = A.CHAR[ed.charId], coll = A.COLL[ch.coll], R = A.R[ed.rarity];
    // Personne ne l’a encore trouvée : on ne montre que la rareté, comme une case vide du catalogue
    if (o.unknown) return '<article class="card card-unknown r-' + ed.rarity + '" tabindex="0" aria-label="Carte ' + R.label + ' non découverte">' +
      '<div class="card-inner"><div class="card-art"><span class="cu-mark" aria-hidden="true">?</span><span class="cu-k">Non découverte</span></div>' +
      '<div class="card-body"><div class="card-row"><h3 class="card-name">? ? ?</h3></div>' +
        '<div class="card-row card-sub"><span class="card-title">Personne ne l’a encore trouvée</span><span class="card-coll">' + U.esc(coll.name) + '</span></div>' +
        '<div class="card-row card-foot"><span class="card-stats"><span>ATQ<b>?</b></span><span>DÉF<b>?</b></span><span>ESP<b>?</b></span></span><span class="card-rar"><i></i>' + R.label + '</span></div>' +
      '</div></div></article>';
    var serialTxt = U.serial(o.serial, ed.supply);
    var cls = 'card r-' + ed.rarity + (o.missing ? ' is-missing' : '') + (o.selected ? ' is-selected' : '') + (o.cls ? ' ' + o.cls : '');
    var attrs = ' data-ed="' + ed.id + '"' + (o.uid ? ' data-uid="' + o.uid + '"' : '') +
      (o.open !== false ? ' data-open' : '') + (o.tilt !== false ? ' data-tilt' : '') + (o.select ? ' data-select' : '');
    var longName = ch.name.length > 15 ? ' long' : '';
    var flags = '';
    if (o.badge) flags += '<span class="card-flag">' + o.badge + '</span>';
    if (o.firstBadge) flags += '<span class="card-flag is-first">Première mondiale</span>';
    if (o.newBadge) flags += '<span class="card-flag is-new">Nouveau</span>';
    var corner = '';
    if (o.fav || o.show) corner = '<span class="card-corner">' + (o.fav ? U.icon('star', 'fav') : '') + (o.show ? U.icon('eye') : '') + '</span>';
    if (o.select) corner = '<span class="card-check">' + U.icon('check') + '</span>';
    return '<article class="' + cls + '"' + attrs + ' tabindex="0" aria-label="' + U.esc(ch.name + ', ' + R.label + (serialTxt ? ' ' + serialTxt : '')) + '">' +
      '<div class="card-inner">' +
        '<div class="card-art">' + A.editionArt(ed, { scale: o.artScale, ctx: o.ctx || (o.artScale > 1 ? 'viewer' : 'card'), priority: o.priority }) + '<span class="card-glitter"></span>' + (o.missing ? '<span class="card-missing">Non possédée</span>' : '') + flags + corner + '</div>' +
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

  /* ---------- Récompenses de collection ---------- */
  U.rewardText = function (r) {
    var out = [];
    if (r.eclats) out.push(U.num(r.eclats) + ' ' + A.CURRENCY.name);
    if (r.booster) out.push('1 ' + A.PACK[r.booster].name + ' offert');
    if (r.trophee) out.push('Personnage secret');
    if (r.avatar) out.push('Photo de profil');
    if (r.titre) out.push('Titre « ' + r.titre + ' »');
    if (r.cadre) out.push('Cadre doré');
    return out.join(' + ');
  };
  U.scopeHref = function (key) { return key.charAt(0) === '@' ? '#/saga/' + key.slice(1) : '#/collection/' + key; };
  U.rewardIcon = function (r, cls) { return U.icon(r.trophee ? 'key' : r.titre ? 'laurel' : r.booster ? 'pack' : r.cadre ? 'frame' : 'coin', cls); };
  // Récompense détaillée en pastilles (pictogramme + libellé)
  U.rewardChips = function (r) {
    var out = [];
    if (r.eclats) out.push(['coin', U.num(r.eclats) + ' ' + A.CURRENCY.name]);
    if (r.booster) out.push(['pack', A.PACK[r.booster].name]);
    if (r.trophee) out.push(['key', 'Personnage secret']);
    if (r.avatar) out.push(['user', 'Portrait de profil']);
    if (r.titre) out.push(['laurel', 'Titre « ' + r.titre + ' »']);
    if (r.cadre) out.push(['frame', 'Cadre doré']);
    return '<ul class="rw-gifts">' + out.map(function (x) { return '<li>' + U.icon(x[0]) + '<span>' + U.esc(x[1]) + '</span></li>'; }).join('') + '</ul>';
  };

  /* Portrait de profil débloqué par une collection : l’emblème de sa première figure */
  U.avatarArt = function (cid) {
    var ch = A.CHAR[A.COLL[cid].chars[0]], ed = A.ED[ch.id + '-legendary'] || A.ED[ch.id + '-base'];
    return A.editionArt(ed, { w: 200, h: 200, ctx: 'avatar' });
  };
  U.avatarInner = function () {
    var cid = A.store.avatar();
    return cid ? U.avatarArt(cid) : A.app.initial();
  };
  U.avatarCls = function () { return (A.store.avatar() ? ' has-pic' : '') + (A.store.hasFrame() ? ' has-frame' : ''); };

  /* Personnage secret de fin de collection : jamais en booster. Son illustration se révèle
     fragment par fragment (un fragment par personnage obtenu), il est remis quand la collection est complète. */
  U.secretCard = function (cid) {
    var c = A.COLL[cid], sc = A.SECRET[cid], t = A.store.trophy(cid), n = c.chars.length;
    if (!sc) return '';
    // Illustration définitive (manifeste « secret-<collection> », sinon sc.image), sinon illustration provisoire générée
    var art = A.media && A.media.has('secret-' + cid) ? A.media.picture('secret-' + cid, { sizes: '(max-width: 600px) 80vw, 360px' })
      : sc.image ? '<img class="art" src="' + sc.image + '" alt="" loading="lazy" draggable="false">' : A.artImg({ seed: 'secret-' + cid, coll: cid, rarity: 'mythic', w: 600, h: 780 });
    if (!t) {
      var got = c.chars.filter(function (id) { return A.store.ownsChar(id); }).length, cols = n % 3 === 0 ? 3 : 4;
      var tiles = c.chars.map(function (id, i) {
        var on = A.store.ownsChar(id);
        return '<i class="sp-t' + (on ? ' is-on' : '') + '" style="--d:' + (i * 0.04).toFixed(2) + 's" title="' + (on ? 'Fragment révélé par ' : 'Obtenez ') + U.esc(A.CHAR[id].name) + '">' + (on ? '' : '?') + '</i>';
      }).join('');
      var ready = got === n;
      return '<article class="card card-trophy card-secret is-locked" aria-label="Personnage secret, ' + got + ' fragments sur ' + n + '"><div class="card-inner">' +
        '<div class="card-art">' + art + '<div class="sp-grid" style="--cols:' + cols + '">' + tiles + '</div>' + (ready ? '<span class="card-flag is-first">Prêt à révéler</span>' : '') + '</div>' +
        '<div class="card-body"><div class="card-row"><h3 class="card-name">' + (A.store.SHOW_SECRETS ? U.esc(sc.name) : '? ? ?') + '</h3><span class="card-serial">' + got + ' / ' + n + '</span></div>' +
          '<div class="card-row card-sub"><span class="card-title">' + (ready ? 'Récupérez la récompense pour le révéler' : 'Personnage secret · ' + got + ' fragment' + (got > 1 ? 's' : '') + ' sur ' + n) + '</span></div>' +
          '<div class="card-row card-foot"><span class="card-stats"><span>ATQ<b>?</b></span><span>DÉF<b>?</b></span><span>ESP<b>?</b></span></span><span class="card-rar"><i></i>Secret</span></div></div></div></article>';
    }
    var no = (t.no < 10 ? '00' : '0') + t.no;
    return '<article class="card card-trophy card-secret" data-secret="' + cid + '" tabindex="0" aria-label="' + U.esc(sc.name) + ', personnage secret de ' + U.esc(c.name) + '"><div class="card-inner">' +
      '<div class="card-art">' + art + '<span class="ct-seal" aria-hidden="true">' + U.mark('ct-mark') + '</span><span class="card-flag is-first">Personnage secret</span></div>' +
      '<div class="card-body"><div class="card-row"><h3 class="card-name">' + U.esc(sc.name) + '</h3><span class="card-serial">N° ' + no + '</span></div>' +
        '<div class="card-row card-sub"><span class="card-title">' + U.esc(sc.title) + '</span><span class="card-coll">' + U.esc(c.name) + '</span></div>' +
        '<div class="card-row card-foot"><span class="card-stats"><span>ATQ<b>' + sc.atk + '</b></span><span>DÉF<b>' + sc.def + '</b></span><span>ESP<b>' + sc.esp + '</b></span></span><span class="card-rar"><i></i>Secret</span></div></div>' +
      '<span class="card-holo"></span><span class="card-sheen"></span><span class="card-shine"></span></div></article>';
  };
  /* Duels héros contre monstre : les deux cartes réunies débloquent le récit de l’exploit */
  var DUEL_SETS = {
    grecque: { head: 'Duels · héros contre monstres', intro: 'Réunissez un héros et son monstre pour débloquer le récit de leur affrontement.', k: 'Exploit', ok: 'débloqué', x: 'swords', unit: 'exploits' },
    ragnarok: { head: 'Ragnarök · les combats de la fin du monde', intro: 'Réunissez les deux adversaires pour lire la prophétie de leur dernier combat.', k: 'Prophétie', ok: 'débloquée', x: 'flame', unit: 'prophéties' }
  };
  // Jeux de duels qui concernent une collection (ou une collection globale, « @id »)
  U.duelSetsFor = function (key) {
    var colls = key.charAt(0) === '@' ? A.GROUP[key.slice(1)].subs : [key], out = [];
    A.store.duels().forEach(function (d) {
      if (out.indexOf(d.set) === -1 && (colls.indexOf(A.CHAR[d.hero].coll) !== -1 || colls.indexOf(A.CHAR[d.monster].coll) !== -1)) out.push(d.set);
    });
    return out;
  };
  U.duelsHTML = function (set) {
    set = set || 'grecque';
    var T = DUEL_SETS[set] || DUEL_SETS.grecque;
    var list = A.store.duels().filter(function (d) { return d.set === set; }), done = list.filter(function (d) { return d.done; }).length;
    function side(id, own) {
      var ch = A.CHAR[id], best = A.store.bestOwned(id), ed = A.ED[best ? best.ed : id + '-base'];
      return '<button type="button" class="du-side' + (own ? ' is-own' : '') + '" data-bio-open="' + ed.id + '"' + (best ? ' data-bio-uid="' + best.uid + '"' : '') + '>' +
        '<span class="du-pic">' + A.editionArt(ed, { w: 160, h: 160, ctx: 'duel' }) + '</span><span class="du-name">' + U.esc(ch.name) + '</span>' +
        '<span class="du-own">' + (own ? 'À vous' : 'Manquant') + '</span></button>';
    }
    return '<div class="du"><div class="rw-head"><p class="eyebrow">' + T.head + '</p><span class="rw-count">' + done + ' / ' + list.length + ' ' + T.unit + '</span></div>' +
      '<p class="du-intro muted small">' + T.intro + '</p>' +
      '<div class="du-list">' + list.map(function (d, i) {
        return '<article class="du-item' + (d.done ? ' is-done' : '') + '">' +
          '<div class="du-vs">' + side(d.hero, d.heroOwned) + '<span class="du-x" aria-hidden="true">' + U.icon(T.x) + '</span>' + side(d.monster, d.monsterOwned) + '</div>' +
          '<p class="du-k">' + T.k + ' ' + (i < 9 ? '0' : '') + (i + 1) + (d.done ? ' · ' + T.ok : '') + '</p>' +
          '<h3 class="du-title">' + U.esc(d.title) + '</h3>' +
          (d.done ? '<p class="du-text">' + U.esc(d.text) + '</p>'
            : '<p class="du-lock">' + U.icon('lock') + 'Il vous manque ' + U.esc([!d.heroOwned && A.CHAR[d.hero].name, !d.monsterOwned && A.CHAR[d.monster].name].filter(Boolean).join(' et ')) + '.</p>') +
        '</article>';
      }).join('') + '</div></div>';
  };
  // Fiche du personnage secret (une fois révélé)
  U.openSecret = function (cid) {
    var c = A.COLL[cid], sc = A.SECRET[cid], t = A.store.trophy(cid);
    if (!sc || !t) return;
    var ref = { coll: cid };
    U.modal('<div class="detail secret-detail"><div class="detail-visual"><div class="detail-card">' + U.secretCard(cid) + '</div>' +
      '<p class="placeholder-note">Remis le ' + U.date(t.at) + ' · hors booster</p></div>' +
      '<div class="detail-info"><p class="eyebrow">Personnage secret · ' + U.esc(c.name) + '</p>' +
        '<h2 class="detail-name">' + U.esc(sc.name) + '</h2><p class="detail-title">' + U.esc(sc.title) + '</p>' +
        '<p class="detail-bio">' + bioHTML(ref, sc.bio) + '</p>' +
        '<div class="detail-block"><p class="detail-more-p">' + bioHTML(ref, sc.more) + '</p></div>' +
        '<div class="detail-block"><div class="stats">' + statRow('Attaque', sc.atk) + statRow('Défense', sc.def) + statRow('Esprit', sc.esp) + '</div></div>' +
      '</div></div>', {
      cls: 'is-detail',
      mount: function (el, close) {
        el.addEventListener('click', function (e) {
          var b = e.target.closest('[data-bio-char]');
          if (b) { close(true); var best = A.store.bestOwned(b.getAttribute('data-bio-char')); U.openCard(best ? best.ed : b.getAttribute('data-bio-char') + '-base', best && best.uid); }
        });
      }
    });
  };

  // Parcours des paliers d’une collection (ou d’une collection globale « @id ») :
  // médaillons reliés par un fil d’or, pastilles de récompense, un seul bouton quand un palier est prêt.
  U.rewardTrack = function (cid) {
    var steps = A.store.rewards(cid), got = steps.filter(function (s) { return s.state === 'claimed'; }).length;
    var UNITS = { chars: ['personnage', 'personnages'], eds: ['édition', 'éditions'], started: ['collection entamée', 'collections entamées'], done: ['collection complète', 'collections complètes'] };
    return '<div class="rw"><div class="rw-head"><p class="eyebrow">' + (cid.charAt(0) === '@' ? 'Récompenses de la collection globale' : 'Récompenses de collection') + '</p>' +
      '<span class="rw-count">' + got + ' / ' + steps.length + '</span></div>' +
      '<ol class="rw-path" style="--n:' + steps.length + '">' + steps.map(function (s, i) {
        var U2 = UNITS[s.of], left = s.goal - s.have, next = steps[i + 1];
        var action = s.state === 'ready'
          ? '<button type="button" class="btn btn-gold btn-sm rw-btn" data-claim="' + s.id + '">Récupérer</button>'
          : s.state === 'claimed' ? '<p class="rw-done">' + U.icon('check') + 'Récupérée</p>'
          : '<p class="rw-left"><span class="rw-bar"><i style="width:' + Math.round(s.have / Math.max(1, s.goal) * 100) + '%"></i></span>' + s.have + ' / ' + s.goal + '<small> · encore ' + left + ' ' + U2[left > 1 ? 1 : 0] + '</small></p>';
        return '<li class="rw-m is-' + s.state + (next && next.state !== 'locked' ? ' is-linked' : '') + '">' +
          '<span class="rw-medal" aria-hidden="true">' + U.rewardIcon(s.reward) + (s.state === 'claimed' ? '<i class="rw-tick">' + U.icon('check') + '</i>' : '') + '</span>' +
          '<div class="rw-body"><p class="rw-k">Palier ' + ['I', 'II', 'III', 'IV', 'V'][i] + ' · ' + s.goal + ' ' + U2[s.goal > 1 ? 1 : 0] + '</p>' +
            '<p class="rw-label">' + s.label + '</p>' + U.rewardChips(s.reward) + action + '</div></li>';
      }).join('') + '</ol></div>';
  };

  // Missions d’une collection : réunir des personnages liés, partir à la chasse d’une rareté…
  U.missionsHTML = function (cid) {
    var list = A.store.missions(cid);
    if (!list.length) return '';
    var got = list.filter(function (m) { return m.state === 'claimed'; }).length;
    var HICON = { rare: 'medal', epic: 'medal', legendary: 'medal', trio: 'cards', numerotes: 'tag', eventail: 'sparkle' };
    return '<div class="ms"><div class="rw-head"><p class="eyebrow">Missions</p><span class="rw-count">' + got + ' / ' + list.length + '</span></div>' +
      '<div class="ms-grid">' + list.map(function (m) {
        var body = m.kind === 'set'
          ? '<ul class="ms-chars">' + m.chars.map(function (id) {
              var own = m.owned.indexOf(id) !== -1, best = A.store.bestOwned(id), ed = A.ED[best ? best.ed : id + '-base'];
              return '<li><button type="button" class="ms-char du-side' + (own ? ' is-own' : '') + '" data-bio-open="' + ed.id + '"' + (best ? ' data-bio-uid="' + best.uid + '"' : '') + '>' +
                '<span class="du-pic">' + A.editionArt(ed, { w: 120, h: 120, ctx: 'duel' }) + '</span><span class="du-name">' + U.esc(A.CHAR[id].name) + '</span></button></li>';
            }).join('') + '</ul>'
          : '<div class="ms-prog"><span class="rw-bar"><i style="width:' + Math.round(m.have / m.goal * 100) + '%"></i></span><span>' + m.have + ' / ' + m.goal + '</span></div>';
        var action = m.state === 'ready' ? '<button type="button" class="btn btn-gold btn-sm" data-claim="' + m.id + '">Récupérer</button>'
          : m.state === 'claimed' ? '<p class="rw-done">' + U.icon('check') + 'Accomplie</p>'
          : '<p class="ms-left">' + m.have + ' / ' + m.goal + '</p>';
        return '<article class="ms-card is-' + m.state + ' is-' + m.kind + '">' +
          '<div class="ms-top"><span class="ms-ico">' + U.icon(m.kind === 'set' ? 'scroll' : HICON[m.hunt]) + '</span>' +
            '<div class="ms-head"><p class="ms-k">' + (m.kind === 'set' ? 'Réunir' : 'Chasse') + '</p><h4 class="ms-label">' + U.esc(m.label) + '</h4></div></div>' +
          '<p class="ms-desc">' + U.esc(m.desc) + '</p>' + body +
          '<div class="ms-foot">' + U.rewardChips(m.reward) + action + '</div></article>';
      }).join('') + '</div></div>';
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
    // Accès direct à la collection de la carte (depuis l’inventaire, une recherche, la marketplace…)
    var collLink = '<a class="btn btn-ghost btn-sm coll-btn" href="#/collection/' + coll.id + '" data-close title="Voir la collection ' + U.esc(coll.name) + '">' + U.icon('grid') + '<span class="btn-l">Collection</span></a>';
    var actions = item ?
      '<div class="detail-actions">' +
        // Libellés constants (l’état actif se lit à la couleur) : les boutons gardent la même largeur.
        '<button class="btn btn-ghost btn-sm' + (item.fav ? ' is-on' : '') + '" data-act="fav" aria-pressed="' + !!item.fav + '" title="' + (item.fav ? 'Retirer des favoris' : 'Ajouter aux favoris') + '">' + U.icon('star') + '<span class="btn-l">Favori</span></button>' +
        '<button class="btn btn-ghost btn-sm' + (item.show ? ' is-on' : '') + '" data-act="show" aria-pressed="' + !!item.show + '" title="' + (item.show ? 'Retirer de la vitrine' : 'Exposer en vitrine') + '">' + U.icon('eye') + '<span class="btn-l">Vitrine</span></button>' +
        '<button class="btn btn-primary btn-sm" data-act="sell">' + U.icon('tag') + 'Mettre en vente</button>' +
        collLink + marketLink +
      '</div><div class="sell-form" hidden>' +
        '<div class="sell-row"><label class="input-unit"><span class="sell-l">Prix</span><input type="number" min="1" step="5" value="' + (floor || suggestPrice(ed.rarity)) + '" data-price aria-label="Prix de vente"><span>' + A.CURRENCY.name + '</span></label>' +
        '<button class="btn btn-ghost btn-sm" data-act="sell-cancel">Annuler</button><button class="btn btn-primary btn-sm" data-act="sell-ok" title="La carte est placée sous séquestre pendant la mise en vente">Confirmer la mise en vente</button></div>' +
      '</div>' : '';

    return '<div class="detail r-' + ed.rarity + '">' +
      '<div class="detail-visual">' +
        '<div class="detail-card" data-act="zoom" title="Voir en grand">' + U.card(edId, { serial: shown && shown.serial, open: false, missing: !owned.length, ctx: 'detail', priority: true }) + '</div>' +
        '<div class="ed-tabs" role="tablist">' + tabs + '</div>' +
        (ed.media ? '' : '<p class="placeholder-note">' + U.icon('sparkle') + 'Illustration provisoire — emplacement remplaçable</p>') +
      '</div>' +
      (more && (ch.lore || ch.more) ? loreHTML(ch, coll) :
      '<div class="detail-info">' +
        '<p class="eyebrow">' + U.esc(coll.family) + ' · <a class="eyebrow-link" href="#/collection/' + coll.id + '" data-close>' + U.esc(coll.name) + '</a></p>' +
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
        (item ? actions : '<div class="detail-actions">' + collLink + marketLink + '</div>') +
      '</div>') + '</div>';
  }

  /* « Voir plus » d’un personnage qui a une chronique (lore.js) : la colonne d’infos laisse place
     au récit complet, à ses repères et à ses liens avec les autres figures. */
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  /* Chronique de chaque carte : écrite à la main (lore.js) quand elle existe, sinon composée
     à partir de sa notice, de son « Voir plus », de ses liens et de ses duels. */
  var LINKS = null;
  function linkIndex() {
    if (LINKS) return LINKS;
    LINKS = {};
    A.CHARS.forEach(function (c) {
      [c.story || '', c.more || ''].join(' ').replace(/\[\[([a-z0-9:]+)/g, function (m, r) {
        var o = charRef(c, r);
        if (!o || o.id === c.id) return m;
        (LINKS[c.id] = LINKS[c.id] || { out: {}, inn: {} }).out[o.id] = 1;
        (LINKS[o.id] = LINKS[o.id] || { out: {}, inn: {} }).inn[c.id] = 1;
        return m;
      });
    });
    return LINKS;
  }
  function autoLore(ch, coll) {
    var g = coll.group && A.GROUP[coll.group], ix = linkIndex()[ch.id] || { out: {}, inn: {} };
    var ids = Object.keys(ix.out).concat(Object.keys(ix.inn).filter(function (k) { return !ix.out[k]; }));
    var duel = (A.DUELS || []).filter(function (d) { return d.hero === ch.id || d.monster === ch.id; });
    var autres = duel.map(function (d) {
      var other = d.hero === ch.id ? d.monster : d.hero;
      return { c: other.replace('-', ':'), rel: d.set === 'ragnarok' ? 'Adversaire au Ragnarök' : 'Adversaire en duel', note: d.title };
    });
    ids.forEach(function (id) {
      if (autres.some(function (a) { return a.c === id.replace('-', ':'); })) return;
      var o = A.CHAR[id], same = o.coll === ch.coll;
      autres.push({ c: id.replace('-', ':'), rel: same ? (ix.out[id] ? 'Dans son histoire' : 'Le cite') : A.COLL[o.coll].name, note: o.bio });
    });
    var eds = ch.editions.map(function (r) { return A.R[r].label; }).join(', ');
    return {
      intro: ch.bio,
      chapitres: [{ t: 'Son histoire', p: [ch.story || ch.bio] }].concat(ch.more ? [{ t: 'Pour aller plus loin', p: [ch.more] }] : []),
      reperes: [['Collection', coll.name]].concat(g ? [['Collection globale', g.name]] : []).concat([
        ['Titre', ch.title], ['Éditions', eds], ['Caractéristiques', 'ATQ ' + ch.atk + ' · DÉF ' + ch.def + ' · ESP ' + ch.esp]]),
      autres: autres, linksTitle: 'Ses liens', autresTitle: autres.length ? 'Personnages liés' : ''
    };
  }
  function loreHTML(ch, coll) {
    var L = ch.lore || autoLore(ch, coll), n = L.chapitres.length;
    // Chapitres découpés en pages (un paragraphe par page) pour tenir sur un écran de téléphone
    var pages = [], starts = [];
    L.chapitres.forEach(function (c, ci) {
      starts.push(pages.length);
      c.p.forEach(function (t, pi) { pages.push({ ci: ci, pi: pi, pn: c.p.length, c: c, t: t }); });
    });
    var slides = pages.map(function (pg, k) {
      var nx = pages[k + 1];
      var next = !nx ? '' : nx.ci === pg.ci
        ? '<button type="button" class="lore-next" data-lore-to="' + (k + 1) + '">Suite' + U.icon('arrow') + '</button>'
        : '<button type="button" class="lore-next" data-lore-to="' + (k + 1) + '"><span><small>Chapitre ' + ROMAN[nx.ci] + '</small>' + U.esc(nx.c.t) + '</span>' + U.icon('arrow') + '</button>';
      return '<section class="lore-ch" data-ci="' + pg.ci + '" data-pi="' + pg.pi + '" data-pn="' + pg.pn + '" aria-roledescription="page" aria-label="Chapitre ' + (pg.ci + 1) + ', page ' + (pg.pi + 1) + ' sur ' + pg.pn + '">' +
        '<p class="lore-num">Chapitre ' + ROMAN[pg.ci] + '<span> / ' + ROMAN[n - 1] + '</span><em>' + (pg.pi + 1) + ' / ' + pg.pn + '</em></p>' +
        '<h3 class="lore-h">' + U.esc(pg.c.t) + '</h3>' +
        '<p class="lore-p">' + bioHTML(ch, pg.t) + '</p>' + next +
      '</section>';
    }).join('');
    var dots = L.chapitres.map(function (c, i) {
      return '<button type="button" class="lore-dot' + (i ? '' : ' is-on') + '" data-lore-to="' + starts[i] + '" aria-label="Chapitre ' + (i + 1) + ' : ' + U.esc(c.t) + '"><i></i></button>';
    }).join('');
    var slider = '<div class="lore-slider">' +
      '<div class="lore-bar"><div class="lore-dots">' + dots + '</div></div>' +
      '<div class="lore-track">' + slides + '</div></div>';

    var reperes = '<dl class="lore-facts">' + L.reperes.map(function (r) {
      return '<div><dt>' + U.esc(r[0]) + '</dt><dd>' + U.esc(r[1]) + '</dd></div>';
    }).join('') + '</dl>';

    // Arbre généalogique : une colonne de générations reliées par un fil doré
    function node(x, cls) {
      var o = charRef(ch, x.c);
      var tag = x.tag ? '<small>' + U.esc(x.tag) + '</small>' : '';
      if (o) return '<button type="button" class="tn is-in' + (cls ? ' ' + cls : '') + '" data-bio-char="' + o.id + '" title="Voir la fiche de ' + U.esc(o.name) + '">' + U.esc(o.name) + tag + U.icon('arrow') + '</button>';
      return '<span class="tn' + (cls ? ' ' + cls : '') + '">' + U.esc(x.n || x.c) + tag + '</span>';
    }
    var T = L.arbre, tree = '';
    if (T) {
      tree = '<ol class="tree">' +
        '<li class="tg"><p class="tg-k">' + U.esc(T.parents.label) + '</p><div class="tg-row">' + node(T.parents.a) + '<span class="tn-union" aria-label="unis à">⚭</span>' + node(T.parents.b) + '</div></li>' +
        '<li class="tg is-self"><p class="tg-k">Ses frères et sœurs</p><div class="tg-row">' +
          '<span class="tn is-self">' + U.esc(ch.name) + '</span>' + T.fratrie.map(function (x) { return node(x); }).join('') + '</div></li>' +
        '<li class="tg"><p class="tg-k">Ses enfants, selon leur mère</p><div class="tg-kids">' + T.enfants.map(function (g) {
          var mo = charRef(ch, g.mere.c);
          return '<div class="tk"><p class="tk-m">avec ' + (mo ? '<button type="button" class="tk-link" data-bio-char="' + mo.id + '">' + U.esc(mo.name) + '</button>' : U.esc(g.mere.n)) +
            (g.mortelle ? ' <span class="tk-mortal">mortelle</span>' : '') + '</p><div class="tg-row">' + g.enf.map(function (x) { return node(x); }).join('') + '</div></div>';
        }).join('') + '</div></li>' +
      '</ol>';
    }
    var autres = (L.autres || []).length ? '<p class="lore-sub">' + (L.autresTitle || 'Adversaires et liens indirects') + '</p><ul class="lore-links">' + L.autres.map(function (it) {
      var o = charRef(ch, it.c);
      var name = o
        ? '<button type="button" class="lore-name is-in" data-bio-char="' + o.id + '">' + U.esc(o.name) + U.icon('arrow') + '</button>'
        : '<span class="lore-name">' + U.esc(it.n) + '</span>';
      return '<li class="' + (o ? 'is-in' : 'is-out') + '"><span class="lore-rel">' + U.esc(it.rel) + '</span>' + name + '<span class="lore-note">' + U.esc(it.note) + '</span></li>';
    }).join('') + '</ul>' : '';

    return '<div class="detail-info lore">' +
      '<button type="button" class="lore-back" data-act="bio-more">' + U.icon('chevL') + 'Retour à la fiche</button>' +
      '<p class="eyebrow">Chronique · ' + U.esc(coll.family) + '</p>' +
      '<h2 class="detail-name">' + U.esc(ch.name) + '</h2>' +
      '<p class="detail-title">' + U.esc(ch.title) + '</p>' +
      '<p class="lore-intro">' + bioHTML(ch, L.intro) + '</p>' +
      slider +
      (tree || autres ? '<div class="lore-block"><p class="eyebrow">' + (L.linksTitle || 'Arbre généalogique') + '</p>' +
        '<p class="lore-legend"><span class="tn is-in is-mini">Doré</span> dans la collection, touchez pour ouvrir sa fiche</p>' + tree + autres + '</div>' : '') +
      '<div class="lore-block"><p class="eyebrow">Repères</p>' + reperes + '</div>' +
      '<button type="button" class="lore-back is-end" data-act="bio-more">' + U.icon('chevL') + 'Retour à la fiche</button>' +
    '</div>';
  }
  // Glissière des chapitres : la barre de progression suit le chapitre affiché
  function loreSync(root) {
    var track = root.querySelector('.lore-track'); if (!track) return;
    var slides = track.children, i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    i = Math.max(0, Math.min(slides.length - 1, i));
    var cur = slides[i], ci = +cur.getAttribute('data-ci'), fill = (+cur.getAttribute('data-pi') + 1) / +cur.getAttribute('data-pn');
    [].forEach.call(root.querySelectorAll('.lore-dot'), function (d, k) {
      d.classList.toggle('is-on', k === ci); d.classList.toggle('is-past', k < ci);
      d.firstChild.style.width = (k < ci ? 100 : k === ci ? fill * 100 : 0) + '%';
      d.setAttribute('aria-current', k === ci ? 'step' : 'false');
    });
  }
  function loreGo(root, i) {
    var track = root.querySelector('.lore-track'); if (!track) return;
    i = Math.max(0, Math.min(track.children.length - 1, i));
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
    // ramène le haut du chapitre à l’écran si on a lu jusqu’en bas
    var panel = root.closest('.modal-panel'), bar = root.querySelector('.lore-bar');
    if (panel && bar) {
      var dy = bar.getBoundingClientRect().top - panel.getBoundingClientRect().top;
      if (dy < 0) panel.scrollBy({ top: dy - 12, behavior: 'smooth' });
    }
  }
  function suggestPrice(rid) { return { base: 30, rare: 180, epic: 520, legendary: 1600, mythic: 4500, unique: 25000 }[rid]; }

  /* ---------- Visionneuse plein écran ----------
     La carte s’affiche en très grand sur fond sombre ; inclinaison, reflets et
     relief suivent la souris. Fermeture : clic sur le fond, bouton ou Échap. */
  /* ---------- Inclinaison sur téléphone ----------
     · au doigt : on fait glisser le doigt sur la grande carte (fiche, visionneuse) ;
     · au gyroscope : la carte suit l’inclinaison du téléphone (iOS demande une autorisation,
       accordée d’un geste : bouton dans la visionneuse).
     Mêmes variables CSS que l’effet de la souris : reflets, holographie et cadre réagissent pareil. */
  function setTilt(c, x, y) {
    x = Math.max(0, Math.min(1, x)); y = Math.max(0, Math.min(1, y));
    c.classList.add('is-hover');
    c.style.setProperty('--rx', ((0.5 - y) * 13).toFixed(2) + 'deg');
    c.style.setProperty('--ry', ((x - 0.5) * 16).toFixed(2) + 'deg');
    c.style.setProperty('--fa', (Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI + 64).toFixed(1) + 'deg');
    c.style.setProperty('--px', (0.5 - x).toFixed(3));
    c.style.setProperty('--py', (0.5 - y).toFixed(3));
    c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  }
  function clearTilt(c) { if (!c) return; ['--rx', '--ry', '--px', '--py', '--fa', '--mx', '--my'].forEach(function (p) { c.style.removeProperty(p); }); c.classList.remove('is-hover'); }
  U.setTilt = setTilt; U.clearTilt = clearTilt;
  var BIG = '.cv-card .card, .detail-card .card';
  var gyro = { on: false, b0: null, x: .5, y: .5, tx: .5, ty: .5, raf: 0 }, drag = null;
  function bigCard() {
    var all = document.querySelectorAll(BIG);
    return all.length ? all[all.length - 1] : null;      // la visionneuse passe devant la fiche
  }
  function gyroStep() {
    gyro.raf = 0;
    var c = bigCard();
    if (!c || drag) return;
    gyro.x += (gyro.tx - gyro.x) * .18; gyro.y += (gyro.ty - gyro.y) * .18;
    setTilt(c, gyro.x, gyro.y);
    if (Math.abs(gyro.tx - gyro.x) + Math.abs(gyro.ty - gyro.y) > .002) gyro.raf = requestAnimationFrame(gyroStep);
  }
  function onOrient(e) {
    if (e.beta == null || e.gamma == null) return;
    if (gyro.b0 == null) gyro.b0 = e.beta;                   // position de départ = carte « à plat »
    gyro.b0 += (e.beta - gyro.b0) * .01;                     // dérive lente : on suit la façon dont on tient le téléphone
    gyro.tx = .5 + e.gamma / 50; gyro.ty = .5 + (e.beta - gyro.b0) / 40;
    if (!gyro.raf) gyro.raf = requestAnimationFrame(gyroStep);
  }
  U.gyroNeedsPermission = function () { return !gyro.on && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'; };
  U.enableGyro = function () {
    if (gyro.on || !window.DeviceOrientationEvent) return Promise.resolve(gyro.on);
    var ask = typeof DeviceOrientationEvent.requestPermission === 'function' ? DeviceOrientationEvent.requestPermission() : Promise.resolve('granted');
    return ask.then(function (r) {
      if (r !== 'granted') return false;
      gyro.on = true; window.addEventListener('deviceorientation', onOrient);
      try { sessionStorage.setItem('atlas-gyro', '1'); } catch (e) { /* */ }
      return true;
    }, function () { return false; });
  };
  function bindTouchTilt() {
    // Android : pas d’autorisation à demander, le gyroscope est actif d’office sur les écrans tactiles
    if (window.matchMedia('(pointer: coarse)').matches && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') U.enableGyro();
    var moved = 0;
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var c = e.target.closest && e.target.closest(BIG);
      if (!c) return;
      drag = { c: c, x0: e.clientX, y0: e.clientY };
      moved = 0;
    }, { passive: true });
    document.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerType === 'mouse') return;
      var b = drag.c.getBoundingClientRect();
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 8) moved = Date.now();
      setTilt(drag.c, (e.clientX - b.left) / b.width, (e.clientY - b.top) / b.height);
    }, { passive: true });
    function end() {
      if (!drag) return;
      var c = drag.c; drag = null;
      if (gyro.on) { if (!gyro.raf) gyro.raf = requestAnimationFrame(gyroStep); } else clearTilt(c);
    }
    document.addEventListener('pointerup', end, { passive: true });
    document.addEventListener('pointercancel', end, { passive: true });
    // Un glissé pour incliner ne doit pas compter comme un toucher (ouvrir la visionneuse…)
    document.addEventListener('click', function (e) {
      if (moved && Date.now() - moved < 400 && e.target.closest && e.target.closest('.detail-card, .cv-card')) { e.stopPropagation(); e.preventDefault(); moved = 0; }
    }, true);
  }

  U.viewCard = function (edId, serial) {
    var root = document.getElementById('overlay-root') || document.body;
    var el = document.createElement('div');
    el.className = 'card-viewer';
    el.innerHTML = '<button class="cv-close" aria-label="Fermer">' + U.icon('close') + '</button>' +
      '<div class="cv-stage"><div class="cv-card">' + U.card(edId, { serial: serial, open: false, artScale: 3, priority: true }) + '</div></div>' +
      '<p class="cv-hint">' + (window.matchMedia('(pointer: coarse)').matches ? 'Glissez le doigt sur la carte pour faire jouer la lumière' : 'Bougez la souris pour faire jouer la lumière · Échap pour fermer') + '</p>' +
      (U.gyroNeedsPermission() ? '<button class="cv-gyro" type="button">' + U.icon('sparkle') + 'Incliner avec le téléphone</button>' : '');
    root.appendChild(el);
    var gb = el.querySelector('.cv-gyro');
    if (gb) gb.addEventListener('click', function (e) {
      e.stopPropagation();
      U.enableGyro().then(function (ok) { gb.remove(); if (!ok) U.toast('Inclinaison refusée : vous pouvez toujours glisser le doigt sur la carte'); });
    });
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
  // Personnage désigné par « slug » (même collection) ou « coll:slug » (autre collection)
  function charRef(ch, ref) { return ref && (ref.indexOf(':') !== -1 ? A.CHAR[ref.replace(':', '-')] : A.CHAR[ch.coll + '-' + ref]); }
  U.charRef = charRef;
  function bioHTML(ch, text) {
    return U.esc(text).replace(/\[\[([a-z0-9:]+)(?:\|([^\]]+))?\]\]/g, function (m, slug, label) {
      var o = charRef(ch, slug);
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
          loreSync(el);
        }
        draw();
        el.addEventListener('scroll', function (e) {
          if (!e.target.classList) return;
          if (e.target.classList.contains('is-row')) updateNav();
          if (e.target.classList.contains('lore-track')) { clearTimeout(e.target._t); e.target._t = setTimeout(function () { loreSync(el); }, 60); }
        }, true);
        window.addEventListener('resize', function () { loreSync(el); });
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
          if ((t = e.target.closest('[data-lore-to]'))) { loreGo(el, +t.getAttribute('data-lore-to')); return; }
          if ((t = e.target.closest('[data-lore-go]'))) {
            var tr = el.querySelector('.lore-track');
            loreGo(el, Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth)) + +t.getAttribute('data-lore-go'));
            return;
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
              if (A0.lore || A0.more) {
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
      var bo = e.target.closest('[data-bio-open]');
      if (bo) { U.openCard(bo.getAttribute('data-bio-open'), bo.getAttribute('data-bio-uid')); return; }
      var sc = e.target.closest('.card[data-secret]');
      if (sc && !e.target.closest('.secret-detail')) { U.openSecret(sc.getAttribute('data-secret')); return; }
      var c = e.target.closest('.card[data-open]');
      if (!c || e.target.closest('[data-stop]')) return;
      U.openCard(c.getAttribute('data-ed'), c.getAttribute('data-uid'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var c = e.target.closest && e.target.closest('.card[data-open]');
      if (c) U.openCard(c.getAttribute('data-ed'), c.getAttribute('data-uid'));
    });
    bindTouchTilt();
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
