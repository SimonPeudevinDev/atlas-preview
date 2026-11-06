/* ==========================================================================
   ATLAS — Chargement des illustrations
   --------------------------------------------------------------------------
   Les illustrations ne font pas partie du code : elles sont produites par
   tools/media/build.mjs en trois niveaux de détail (LOD), chacun en AVIF et WebP,
   et rangées par empreinte de contenu :

     <A.MEDIA_BASE>/i/<aa>/<empreinte>/<0|1|2>.<avif|webp>   (+ 1.jpg de secours)

     LOD 0 · 256 px   inventaires, collections, listes
     LOD 1 · 768 px   cartes affichées, ouvertures de boosters
     LOD 2 · 2048 px  inspection et zoom (plafonné à la taille de l’original)

   Une même empreinte = un seul fichier, partagé par tous les joueurs ; les URL ne
   changent jamais, elles se mettent donc en cache pour un an (navigateur, CDN et
   service worker). Le navigateur choisit lui-même le bon niveau grâce à srcset/sizes
   (taille d’affichage × densité d’écran) et le bon format grâce à <picture>.

   Pour servir les images depuis Cloudflare R2 (ou tout autre CDN), il suffit d’ajouter
   dans index.html : <meta name="atlas-media" content="https://media.atlas.example">
   ========================================================================== */
(function (A) {
  'use strict';
  var MF = A.MEDIA_MANIFEST || { lods: [], items: {} };
  var meta = document.querySelector('meta[name="atlas-media"]');
  var BASE = (A.MEDIA_BASE || (meta && meta.content) || 'media/dist').replace(/\/$/, '');
  var CROSS = /^https?:/.test(BASE) && BASE.indexOf(location.origin) !== 0;

  /* Tailles d’affichage par contexte (valeur de l’attribut sizes) */
  var SIZES = {
    card: '(max-width: 600px) 46vw, 240px',      // grilles, vitrines
    detail: '(max-width: 900px) 240px, 300px',   // fiche d’une carte
    viewer: 'min(92vw, 1000px)',                 // inspection plein écran → LOD 2
    opener: '(max-width: 600px) 62vw, 300px',                  // ouverture de booster
    pack: '200px',                               // fenêtre du sachet
    avatar: '80px',
    duel: '72px',
    mini: '120px'
  };

  var media = A.media = {
    base: BASE,
    fmt: 'webp',            // remplacé par 'avif' si le navigateur le décode
    sizes: SIZES,
    get: function (id) { return MF.items[id] || null; },
    has: function (id) { return !!MF.items[id]; },
    count: function () { return Object.keys(MF.items).length; },
    url: function (e, lod, fmt) { return BASE + '/i/' + e.h.slice(0, 2) + '/' + e.h + '/' + lod + '.' + (fmt || media.fmt); },
    /* Niveau à charger pour une largeur affichée donnée (pixels CSS) */
    lodFor: function (e, cssW) {
      var px = cssW * Math.min(window.devicePixelRatio || 1, 3);
      for (var i = 0; i < e.lw.length; i++) if (e.lw[i] >= px * 0.9) return i;
      return e.lw.length - 1;
    }
  };

  function srcset(e, fmt) {
    return e.lw.map(function (w, i) { return media.url(e, i, fmt) + ' ' + w + 'w'; }).join(', ');
  }

  /**
   * <picture> AVIF → WebP → JPEG, dimensionné et chargé paresseusement.
   * opts.ctx      : clé de SIZES (défaut 'card') ou opts.sizes explicite
   * opts.priority : true → chargement immédiat et prioritaire (carte visible tout de suite)
   * L’élément <picture> est « transparent » (display: contents) : img.art garde sa place
   * et toutes les règles CSS existantes.
   */
  media.picture = function (id, opts) {
    var e = MF.items[id];
    if (!e) return '';
    opts = opts || {};
    var sizes = opts.sizes || SIZES[opts.ctx || 'card'] || SIZES.card;
    var bg = 'background:' + e.c + ' url(' + e.p + ') center/cover no-repeat';
    return '<picture class="art-pic">' +
      '<source type="image/avif" srcset="' + srcset(e, 'avif') + '" sizes="' + sizes + '">' +
      '<source type="image/webp" srcset="' + srcset(e, 'webp') + '" sizes="' + sizes + '">' +
      '<img class="art" src="' + media.url(e, 1, 'jpg') + '" width="' + e.w + '" height="' + e.ht + '" alt="" draggable="false"' +
        (opts.priority ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"' +
        (CROSS ? ' crossorigin="anonymous"' : '') + ' style="' + bg + '" onload="this.style.background=\'\'">' +
    '</picture>';
  };

  /* Préchargement (ouverture de booster, carte suivante…) : quelques images seulement,
     au niveau adapté à leur taille d’affichage, dans le format détecté. */
  var warm = {};
  media.preload = function (ids, cssW) {
    (ids || []).forEach(function (id) {
      var e = MF.items[id];
      if (!e) return;
      var u = media.url(e, media.lodFor(e, cssW || 320));
      if (warm[u]) return;
      var im = new Image();
      if (CROSS) im.crossOrigin = 'anonymous';
      im.decoding = 'async';
      im.src = u;
      warm[u] = im;
      if (im.decode) im.decode().catch(function () {});
    });
  };
  /* URL directe (textures WebGL, canvas) */
  media.src = function (id, cssW) {
    var e = MF.items[id];
    return e ? media.url(e, media.lodFor(e, cssW || 320)) : null;
  };

  /* Détection AVIF (une image de 1 px) ; WebP par défaut en attendant */
  try {
    var t = new Image();
    t.onload = function () { if (t.width > 0) media.fmt = 'avif'; };
    t.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  } catch (err) { /* WebP */ }
  // Sans WebP non plus (très anciens navigateurs) : JPEG de secours pour les textures et préchargements
  try {
    var w = new Image();
    w.onerror = function () { if (media.fmt === 'webp') media.fmt = 'jpg'; };
    w.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  } catch (err) { /* */ }
  // Le JPEG n’existe qu’au niveau 1
  var url0 = media.url;
  media.url = function (e, lod, fmt) { fmt = fmt || media.fmt; return url0(e, fmt === 'jpg' ? 1 : lod, fmt); };

  /* ---------- Raccordement au catalogue ---------- */
  Object.keys(MF.items).forEach(function (id) { if (A.ED && A.ED[id]) A.ED[id].media = MF.items[id]; });

  var generated = A.editionArt;
  A.editionArt = function (ed, opts) {
    opts = opts || {};
    if (ed.media && !opts.inline) return media.picture(ed.id, opts);
    return generated(ed, opts);
  };
  /* Illustration d’une édition pour un canvas/WebGL : URL réelle ou art généré */
  A.editionSrc = function (ed, cssW, gen) {
    return (ed.media && media.src(ed.id, cssW)) || ed.image || A.artURI(gen);
  };
})(window.ATLAS);
