/* ==========================================================================
   ATLAS — Sachet de booster en WebGL (three.js)
   --------------------------------------------------------------------------
   Le maillage vient de Blender (tools/blender/build_pack.py → pack-model.js) :
   une vraie poche gonflée, avec ses plis et son épaisseur. Il est découpé
   en quatre parties : capuchon / corps × face avant / face arrière.

   L’élément .pk reste la seule source d’état, comme pour la version CSS :
     – rotation           ← ressort de pack.js (K.rig appelle view.pose)
     – --tp, dir-l/dir-r  ← progression de la déchirure (opener.js)
     – is-torn            ← le capuchon s’arrache
     – is-dropping        ← le corps tombe
   Les cartes et la lueur restent en HTML, SOUS le canevas : le film les cache
   tant que le sachet est fermé, et elles apparaissent par l’ouverture.

   Un seul contexte WebGL pour toute la page : chaque sachet a son canevas 2D,
   on y recopie l’image rendue (aucune limite de contextes, pas de fuite).
   Sans WebGL, sans three.js ou sans modèle : rien ne change (version CSS).
   ========================================================================== */
(function (A) {
  'use strict';
  // Sachet « référence » (test) : modèle coussin + illustration pleine page, s’il a été chargé ; sinon le sachet classique
  var T = window.THREE, M = A.PACK_MODEL_PILLOW || A.PACK_MODEL, REF = !!A.PACK_MODEL_PILLOW;
  // Face en illustration pleine page (essai d’après la référence) : désactivée, le propriétaire préfère les visuels habituels sur le modèle coussin
  var FULL_ART = false;
  var P3 = A.pack3d = { ok: false };
  if (!T || !M || !window.HTMLCanvasElement) return;

  /* ---------- Constantes ---------- */
  var W = M.info.W, H = M.info.H;                  // 1 × 1,6 (même repère que la maquette 100 × 160)
  var TEAR_Y = H / 2 - M.info.tearFromTop;         // hauteur de la déchirure (repère three.js)
  var CRIMP_T = M.info.crimpTop * 100, CRIMP_B = M.info.crimpBottom * 100;
  var TY = M.info.tearFromTop * 100;               // déchirure en unités maquette
  var S = (window.innerWidth || 0) > 700 ? 10 : 8;   // pixels de texture par unité maquette (1000 × 1600 sur ordinateur, 800 × 1280 sur mobile)
  // Canevas plus grand que le sachet (rotation, capuchon qui s’envole, chute) — doit suivre booster.css (.pk-gl)
  var BOX = { x: -0.6, y: -0.45, w: 2.2, h: 2.2 };
  var PERSP = 1400, ORIGIN_Y = 0.4;                // comme .pk { perspective: 1400px; perspective-origin: 50% 40% }
  var DEG = Math.PI / 180;
  // Sortie des cartes : le corps du sachet descend de d (unités du modèle) pendant que la pile monte (booster.css)
  var EMERGE = { ms: 420, d: 0.8 };

  var THEMES = {
    ivory:   { foil: ['#FFFCF6', '#E9DDC6', '#FBF6EC', '#D3C2A2', '#F3EADA', '#E2D4BA'], ink: '#0E0B07', ink2: '#2E261A', gold: '#3E2E14', hi: 'rgba(255,255,255,.7)', lo: 'rgba(110,85,45,.22)', brand: ['#0E0B07', '#3A2C16', '#17120B', '#4A3A20', '#0E0B07'], metal: 0.3, holo: 0.08, env: 0.75, stroke: 0.04, halo: 'rgba(255,250,240,.75)' },
    lapis:   { foil: ['#5276CF', '#152D72', '#3A5DB0', '#0B1B4A', '#28479E', '#11245C'], ink: '#F4F0E6', ink2: '#CBD5F0', gold: '#EACB86', hi: 'rgba(215,228,255,.32)', lo: 'rgba(0,0,0,.42)', brand: ['#7E602E', '#EBD49C', '#9C7A43', '#F3E1B0', '#8C6B35'], metal: 0.72, holo: 0.55 },
    garnet: { foil: ['#A7465A', '#561522', '#8E2E3E', '#3A0B13', '#74222F', '#4C111B'], ink: '#F7ECDC', ink2: '#E2C4AE', gold: '#E2C384', hi: 'rgba(255,215,200,.3)', lo: 'rgba(0,0,0,.4)', brand: ['#7E602E', '#EBD49C', '#9C7A43', '#F3E1B0', '#8C6B35'], metal: 0.7, holo: 0.4 },
    night:  { foil: ['#4A5666', '#141920', '#36414E', '#0A0D11', '#28313C', '#11161C'], ink: '#EEF2F3', ink2: '#A3B3BF', gold: '#E2C68A', hi: 'rgba(220,235,255,.26)', lo: 'rgba(0,0,0,.45)', brand: ['#7E602E', '#EBD49C', '#9C7A43', '#F3E1B0', '#8C6B35'], metal: 0.7, holo: 0.45 }
  };
  // Thèmes des propositions de Booster Atlas
  THEMES.astro = Object.assign({}, THEMES.lapis, { foil: ['#24407F', '#0D1A3C', '#1C3366', '#070F26', '#162B58', '#0A1533'] });
  function light(foil, ink, ink2, motif, o) {           // film clair : texte et motif foncés
    return Object.assign({}, THEMES.ivory, { foil: foil, ink: ink, ink2: ink2, gold: motif[1], motif: motif, facet: 'rgba(255,255,255,.55)', glow: 'rgba(255,255,255,.35)',
      brand: [motif[2], motif[0], motif[2], motif[0], motif[2]], halo: 'rgba(255,255,255,.6)', metal: 0.35, holo: 0.1 }, o || {});
  }
  function dark(base, foil, o, o2) { return Object.assign({}, THEMES[base], { foil: foil }, o || {}, o2 || {}); }
  var CREAM = { brand: ['#E9D9AE', '#FFFDF6', '#F4E6C2', '#FFFFFF', '#E9D9AE'], halo: 'rgba(0,0,0,.38)' };   // ton moyen : ATLAS crème bien lisible
  Object.assign(THEMES, {
    'c-ciel':  light(['#DCE8F3', '#A9C3DD', '#CFE0EF', '#91AFCD', '#BED3E8', '#9DB9D5'], '#152536', '#3F5672', ['#5D7FA6', '#2C4A70', '#162C47']),
    'c-sauge': dark('lapis', ['#A7B89B', '#62775A', '#93A687', '#4F6348', '#829775', '#586D50'], { ink: '#FAF7EE', ink2: '#E3EBD9', gold: '#F4E3B3', motif: ['#FFF4D2', '#F1DCA0', '#C9A964'], facet: 'rgba(55,72,48,.85)', glow: 'rgba(255,244,210,.28)', lo: 'rgba(0,0,0,.3)' }, CREAM),
    'c-lavande': dark('lapis', ['#C3B4E2', '#8572B4', '#B0A0D8', '#6E5C9E', '#9E8CCB', '#7765A8'], { ink: '#FFFBF4', ink2: '#ECE6FA', gold: '#FBE7B5', motif: ['#FFF6DA', '#F7E0A6', '#CBA868'], facet: 'rgba(80,62,120,.85)', glow: 'rgba(255,246,218,.3)', lo: 'rgba(0,0,0,.3)' }, CREAM),
    'c-terracotta': dark('garnet', ['#D98B66', '#9A472B', '#C57352', '#7C351E', '#B0603F', '#873C24'], { ink: '#FFF7EC', ink2: '#F6DCCB', motif: ['#FFF0CF', '#F2D79B', '#C59E5C'], facet: 'rgba(100,40,22,.85)', glow: 'rgba(255,236,200,.28)' }, CREAM),
    'c-mocha': dark('garnet', ['#A88772', '#5C4031', '#8F6F5B', '#463024', '#7A5B48', '#50382A'], { ink: '#FBF4EA', ink2: '#E8D8C8', motif: ['#FBEBC6', '#E9CF95', '#B8935A'], facet: 'rgba(60,40,30,.88)', glow: 'rgba(251,235,198,.25)' }, CREAM),
    'c-chrome': light(['#EEF0F3', '#A3AAB4', '#DDE1E6', '#858D98', '#C7CCD3', '#959CA7'], '#15191F', '#3B434E', ['#6C7581', '#2E353F', '#151A20'], { metal: 0.85, env: 1 }),
    'c-nuit': THEMES.astro,
    'c-emeraude': dark('night', ['#1F5A47', '#0A241C', '#184A39', '#06170F', '#123D2E', '#081C14'], { ink2: '#BCD8C9', motif: ['#F6E3AE', '#E2C68A', '#9C7A43'], facet: 'rgba(5,25,18,.9)', glow: 'rgba(226,198,138,.22)' }),
    'c-bordeaux': dark('garnet', ['#8E2A3B', '#3F0A14', '#701C2C', '#2A050C', '#5B1523', '#360810'], { motif: ['#F8E6B4', '#E2C384', '#A27E3E'], facet: 'rgba(40,6,12,.9)', glow: 'rgba(226,195,132,.22)' }),
    // Booster quotidien : tons profonds, motif Cadran
    'd-amethyste': dark('night', ['#6B3A80', '#26102F', '#56296A', '#170A1D', '#43205A', '#1E0D27'], { ink2: '#D9C6E2', motif: ['#FFF0C4', '#E6C77F', '#A9823F'], facet: 'rgba(25,8,32,.9)', glow: 'rgba(230,199,127,.24)' }),
    'd-petrole': dark('night', ['#1E5D6B', '#08222A', '#174C58', '#04161B', '#113D47', '#061C22'], { ink2: '#BCD9DE', motif: ['#FFF0C4', '#E6C77F', '#A9823F'], facet: 'rgba(3,22,27,.9)', glow: 'rgba(230,199,127,.24)' }),
    'd-cognac': dark('garnet', ['#8A5228', '#3A1E0A', '#73431F', '#2A1506', '#5E3518', '#331A08'], { ink2: '#EBD3BB', motif: ['#FFF0C4', '#E6C77F', '#A9823F'], facet: 'rgba(40,20,6,.9)', glow: 'rgba(230,199,127,.24)' }),
    'd-anthracite': dark('night', ['#4A4D53', '#16171A', '#3A3D42', '#0B0C0E', '#2B2D31', '#121315'], { ink2: '#C3C6CC', gold: '#D9DDE3', motif: ['#FFFFFF', '#D9DDE3', '#8E949D'], facet: 'rgba(8,9,11,.92)', glow: 'rgba(220,225,235,.2)', brand: ['#8E949D', '#FFFFFF', '#B9BEC6', '#FFFFFF', '#8E949D'], metal: 0.7 }),
    // Événements : sachets clairs, pour trancher avec les sachets sombres (Atlas, quotidien, Ultime)
    'e-glacier': dark('lapis', ['#5FA8E0', '#1C5E9C', '#4793CF', '#124878', '#3A82BF', '#175690'], { ink: '#F5FAFF', ink2: '#D8E9F8', gold: '#F2F7FC', motif: ['#FFFFFF', '#E3F0FB', '#9CC3E4'], facet: 'rgba(10,45,85,.85)', glow: 'rgba(235,245,255,.3)', brand: ['#B9D6EE', '#FFFFFF', '#CFE3F4', '#FFFFFF', '#B9D6EE'], halo: 'rgba(5,30,60,.45)', metal: 0.55, holo: 0.3 }),
    'e-vermillon': dark('garnet', ['#E8533A', '#9C1F14', '#D9412B', '#7A140C', '#C3361F', '#8E1A10'], { ink: '#FFF6EA', ink2: '#FFDCCB', gold: '#F8E3B0', motif: ['#FFF4D6', '#F6D88E', '#C99A45'], facet: 'rgba(60,8,4,.88)', glow: 'rgba(255,236,200,.28)', halo: 'rgba(60,8,4,.45)', toriiInk: '#3B0B06', metal: 0.55, holo: 0.3 }),
    // Saga du Nil : feuille d’or, encre lapis-lazuli
    'e-or': light(['#ECCB78', '#9C6F22', '#DDB458', '#7A5216', '#C89E40', '#8C6420'], '#16203F', '#2B3A67', ['#3557B0', '#1E3A8A', '#0E1A40'], { metal: 0.85, holo: 0.12, facet: 'rgba(20,28,60,.85)', glow: 'rgba(255,240,200,.25)', halo: 'rgba(255,236,190,.35)' }),
    // Propositions (page Design des boosters)
    'p-laque': dark('night', ['#2A1512', '#0B0505', '#22100D', '#050202', '#1A0B09', '#0A0404'], { ink: '#F6EBDD', ink2: '#E7B9A8', gold: '#E8C27A', motif: ['#FFE3A6', '#E0B260', '#9C6B2A'], facet: 'rgba(8,2,2,.9)', glow: 'rgba(232,194,122,.2)', metal: 0.6 }),
    'p-indigo': dark('lapis', ['#34478A', '#0E1636', '#283A76', '#080E24', '#1C2A5C', '#0B1330'], { ink: '#F3F5FA', ink2: '#C9D2EC', gold: '#EEF2FA', motif: ['#FFFFFF', '#DCE3F5', '#8E9CC8'], facet: 'rgba(6,10,30,.85)', glow: 'rgba(230,236,255,.22)', brand: ['#A9B6DC', '#FFFFFF', '#C4CEEA', '#FFFFFF', '#A9B6DC'], metal: 0.6 }),
    'p-sakura': dark('garnet', ['#E3A0B4', '#A0506A', '#D689A0', '#7B3550', '#C27088', '#8C4460'], { ink: '#FFF7F8', ink2: '#FFDDE6', gold: '#FFF1D6', motif: ['#FFFFFF', '#FFE6EC', '#E8A3B6'], facet: 'rgba(110,40,65,.75)', glow: 'rgba(255,235,240,.3)', brand: ['#F2C9D4', '#FFFFFF', '#F8DDE5', '#FFFFFF', '#F2C9D4'], halo: 'rgba(90,25,45,.45)', metal: 0.6 }),
    'p-or': light(['#ECCB78', '#9C6F22', '#DDB458', '#7A5216', '#C89E40', '#8C6420'], '#1B1208', '#4A3210', ['#3A2608', '#1E1304', '#0E0902'], { metal: 0.85, holo: 0.12, facet: 'rgba(30,18,4,.8)', glow: 'rgba(255,240,200,.25)', halo: 'rgba(255,236,190,.35)' }),
    'p-sumi': dark('night', ['#56565B', '#1C1C1F', '#46464B', '#101012', '#34343A', '#161618'], { ink: '#F3F1EC', ink2: '#C8C4BC', gold: '#F0684A', motif: ['#FF9A7E', '#E8553A', '#9E2E1C'], facet: 'rgba(8,8,10,.9)', glow: 'rgba(240,104,74,.2)', toriiInk: '#0C0C0E', metal: 0.55 }),
    'p-polaire': dark('night', ['#2B3A4A', '#0C141D', '#22303E', '#070C12', '#1A2531', '#0A1018'], { ink: '#EEF6F4', ink2: '#B5D3CF', gold: '#A6F2CF', motif: ['#D8FFEE', '#7DE8BC', '#2A9C7A'], facet: 'rgba(4,8,12,.9)', glow: 'rgba(125,232,188,.2)', brand: ['#7DCFAE', '#E8FFF4', '#A6F2CF', '#E8FFF4', '#7DCFAE'], metal: 0.55 }),
    'p-aurore': dark('night', ['#1F6B6A', '#082827', '#195957', '#04191A', '#124544', '#061F1F'], { ink: '#F0FBF7', ink2: '#BFE6DC', gold: '#BDF7DC', motif: ['#EFFFF8', '#9FF0C8', '#3FB58A'], facet: 'rgba(2,14,14,.9)', glow: 'rgba(159,240,200,.22)', brand: ['#8FD9BC', '#F0FFF8', '#B5F2D8', '#F0FFF8', '#8FD9BC'], metal: 0.55 }),
    'p-acier': dark('night', ['#7D858D', '#2C3136', '#69717A', '#1D2125', '#545C64', '#262A2F'], { ink: '#F4F6F8', ink2: '#CDD3D9', gold: '#EEF1F4', motif: ['#FFFFFF', '#D7DDE3', '#8C959E'], facet: 'rgba(18,20,24,.85)', glow: 'rgba(230,236,242,.2)', brand: ['#AEB6BE', '#FFFFFF', '#CDD3D9', '#FFFFFF', '#AEB6BE'], metal: 0.85 }),
    'p-sang': dark('garnet', ['#7E1F28', '#2E070B', '#691820', '#1E0306', '#521119', '#250509'], { ink: '#F7ECE6', ink2: '#E3BDB4', gold: '#E9C98E', motif: ['#FFE9BE', '#E5C07E', '#A27A3A'], facet: 'rgba(20,2,4,.9)', glow: 'rgba(233,201,142,.2)', metal: 0.55 }),
    'p-fjord': dark('lapis', ['#2C5F7A', '#0C2533', '#234F67', '#071923', '#1A3E52', '#0A1E2A'], { ink: '#EEF6FA', ink2: '#BFD8E6', gold: '#DCEBF3', motif: ['#FFFFFF', '#CFE4F0', '#7FA9C2'], facet: 'rgba(4,16,24,.88)', glow: 'rgba(207,228,240,.22)', brand: ['#9CC0D6', '#FFFFFF', '#BFD8E6', '#FFFFFF', '#9CC0D6'], metal: 0.55 }),
    'p-lapis': dark('lapis', ['#2E54B0', '#0C1C4E', '#24479A', '#071233', '#1B387D', '#0A173F'], { ink: '#F6EED8', ink2: '#D4DCF2', gold: '#E9C46A', motif: ['#FFE7A3', '#E2B654', '#9C7424'], facet: 'rgba(5,12,40,.88)', glow: 'rgba(233,196,106,.22)', metal: 0.6 }),
    'p-faience': dark('lapis', ['#2FB3A8', '#0D5B56', '#25A096', '#08413D', '#1C8279', '#0A4A45'], { ink: '#FFFBF0', ink2: '#D8F4F0', gold: '#F4D58A', motif: ['#FFF0C2', '#EBC66E', '#A8812F'], facet: 'rgba(4,40,38,.85)', glow: 'rgba(244,213,138,.25)', halo: 'rgba(3,40,38,.45)', metal: 0.6 }),
    'p-obsidienne': dark('night', ['#2E2A26', '#0A0908', '#25211D', '#040404', '#1A1715', '#0B0A09'], { ink: '#F6EFE0', ink2: '#C2B59A', gold: '#E7C36F', motif: ['#FFEBB4', '#E7C36F', '#A27E38'], facet: 'rgba(0,0,0,.92)', glow: 'rgba(231,195,111,.24)', metal: 0.65 }),
    'p-cuivre': dark('garnet', ['#C27744', '#6E3415', '#AE6536', '#55260C', '#94522A', '#5E2D10'], { ink: '#FFF3E6', ink2: '#F3D2B8', gold: '#FBE3B4', motif: ['#FFF5DC', '#F6D79A', '#C09450'], facet: 'rgba(60,20,4,.85)', glow: 'rgba(251,227,180,.25)', halo: 'rgba(60,20,4,.45)', metal: 0.6 }),
    'p-malachite': dark('night', ['#3BA17C', '#145A43', '#2F8C6A', '#0D4232', '#23735A', '#0F4A38'], { ink: '#F8FCF6', ink2: '#CFEADD', gold: '#F2D58E', motif: ['#FFF1C8', '#ECCB7A', '#A88635'], facet: 'rgba(4,34,24,.88)', glow: 'rgba(242,213,142,.24)', halo: 'rgba(4,34,24,.45)', metal: 0.6 }),
    'c-noir': dark('night', ['#2C2925', '#0B0A09', '#211E1B', '#050505', '#181614', '#0C0B0A'], { ink: '#F6EFE0', ink2: '#B9AE99', gold: '#E6C77F', motif: ['#FFF0C4', '#E6C77F', '#A9823F'], facet: 'rgba(0,0,0,.92)', glow: 'rgba(230,199,127,.24)', metal: 0.7 })
  });
  var FOIL_STOPS = [0, 0.26, 0.46, 0.70, 0.88, 1];
  var RAR = { base: '#A8997E', rare: '#5F7488', epic: '#6F5590', legendary: '#A1803F', mythic: '#7F2B35', unique: '#141210' };
  var SERIF = '"Cormorant Garamond", "Cormorant", "EB Garamond", Georgia, serif';
  var SANS = 'Inter, system-ui, "Segoe UI", Roboto, sans-serif';
  // Mise en page commune de la face avant (unités maquette) : la fenêtre ne bouge jamais
  var WIN = { x: 12, y: 54, w: 76, h: 52, r: 1.4 };
  // Sachet « référence » : illustration pleine page dans un liseré de film métallisé, entre les deux soudures
  var ART = { x: 6, y: CRIMP_T + 2.4, w: 88, h: 160 - CRIMP_B - 3 - (CRIMP_T + 2.4), r: 1.2 };

  /* ---------- Contexte WebGL partagé (créé au premier sachet) ---------- */
  var R = null, scene, env, geo, lost = false, views = [];
  var owner = null;      // sachet en cours d’ouverture : il affiche directement le canevas WebGL (aucune recopie)

  function supported() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) { return false; }
  }
  P3.ok = supported();   // sans WebGL : pas de 3D (attach refuse), mais les images plates (faceURL) restent disponibles

  function init() {
    if (R) return true;
    try {
      R = new T.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    } catch (e) { P3.ok = false; return false; }
    R.setPixelRatio(1);
    R.setClearColor(0x000000, 0);
    R.outputEncoding = T.sRGBEncoding;
    R.toneMapping = T.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.05;
    R.domElement.addEventListener('webglcontextlost', function (e) {
      e.preventDefault(); lost = true; P3.ok = false;
      views.slice().forEach(function (v) { v.fallback(); });
    });

    scene = new T.Scene();
    var key = new T.DirectionalLight(0xfff4e2, 1.7); key.position.set(-1.6, 2.2, 2.6);
    var rim = new T.DirectionalLight(0xdfe8ff, 0.55); rim.position.set(2.4, 0.6, -1.2);
    scene.add(key, rim, new T.HemisphereLight(0xfff8ee, 0x2a2118, 0.45));
    scene.environment = env = makeEnv();
    geo = buildGeometry();
    return true;
  }

  /* Studio de reflets : quelques boîtes à lumière douces (le film métallisé en a besoin) */
  function makeEnv() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#d9d2c6'); g.addColorStop(0.45, '#7d756a'); g.addColorStop(0.55, '#4a433b'); g.addColorStop(1, '#16120e');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    function box(cx, cy, w, h, a) {
      var r = x.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
      r.addColorStop(0, 'rgba(255,250,240,' + a + ')'); r.addColorStop(0.5, 'rgba(255,246,230,' + a * 0.45 + ')'); r.addColorStop(1, 'rgba(255,246,230,0)');
      x.save(); x.translate(cx, cy); x.scale(w / Math.max(w, h), h / Math.max(w, h)); x.translate(-cx, -cy);
      x.fillStyle = r; x.fillRect(cx - Math.max(w, h), cy - Math.max(w, h), Math.max(w, h) * 2, Math.max(w, h) * 2); x.restore();
    }
    box(380, 150, 170, 90, 1);      // boîte principale, haut-gauche devant
    box(690, 210, 120, 60, 0.75);   // contre-jour droit
    box(120, 260, 90, 140, 0.5);    // réflecteur latéral
    box(512, 40, 400, 40, 0.6);     // plafond
    var t = new T.CanvasTexture(c);
    t.mapping = T.EquirectangularReflectionMapping;
    t.encoding = T.sRGBEncoding;
    var pm = new T.PMREMGenerator(R);
    var out = pm.fromEquirectangular(t).texture;
    pm.dispose(); t.dispose();
    return out;
  }

  /* ---------- Maillage ---------- */
  function b64(s, Ctor) {
    var bin = atob(s), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Ctor(u.buffer);
  }
  /* Un seul maillage, propre (boutique). Les plis des coins et les plis en éventail sont des
     cibles de morphing par paires (sinus, cosinus) : chaque sachet ouvert choisit leur
     amplitude et leur phase, donc des plis placés ailleurs à chaque fois. */
  var TG = M.targets || [];
  function buildGeometry() {
    var out = {};
    Object.keys(M.parts).forEach(function (k) {
      var p = M.parts[k], n = p.n, g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(b64(p.p, Int16Array), 3, true));
      g.setAttribute('normal', new T.BufferAttribute(b64(p.nm, Int8Array), 3, true));
      g.setAttribute('uv', new T.BufferAttribute(b64(p.uv, Uint16Array), 2, true));
      g.setIndex(new T.BufferAttribute(b64(p.i, Uint16Array), 1));
      if (TG.length) {
        g.morphAttributes.position = []; g.morphAttributes.normal = [];
        TG.forEach(function (t) {
          var tp = t.parts[k], idx = b64(tp.idx, Uint16Array), dz = b64(tp.dz, Int16Array), dn = b64(tp.dn, Int8Array);
          var P = new Float32Array(n * 3), N = new Float32Array(n * 3);
          for (var i = 0; i < idx.length; i++) {
            var j = idx[i] * 3;
            P[j + 2] = dz[i] / 32767 * t.scale;
            N[j] = dn[i * 3] / 127; N[j + 1] = dn[i * 3 + 1] / 127; N[j + 2] = dn[i * 3 + 2] / 127;
          }
          g.morphAttributes.position.push(new T.BufferAttribute(P, 3));
          g.morphAttributes.normal.push(new T.BufferAttribute(N, 3));
        });
        g.morphTargetsRelative = true;
      }
      g.computeBoundingSphere();
      g.boundingSphere.radius *= 1.6;          // coins cornés, languettes pliées (déformés dans le shader)
      out[k] = g;
    });
    return out;
  }
  function geometry() { return geo; }

  /* Désordre d'un sachet qu'on tient en main, tiré au hasard à chaque ouverture.
     La boutique garde le sachet propre. */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function messy() {
    var ear = [0, 0, 0, 0], earL = [0.1, 0.1, 0.1, 0.1];
    var picks = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }).slice(0, Math.random() < 0.3 ? 2 : 1);
    picks.forEach(function (c) {
      ear[c] = rnd(1.1, 2.5) * (Math.random() < 0.8 ? 1 : -1);      // le plus souvent replié vers l'avant
      earL[c] = rnd(0.1, 0.19);
    });
    var infl = [];
    TG.forEach(function (t, i) {
      if (i % 2) return;
      var amp = /^coin/.test(t.name) ? rnd(0.9, 2.2) : /^froissure/.test(t.name) ? rnd(0.6, 1.6) : rnd(0.5, 1.5), ph = rnd(0, 6.283);
      infl.push(amp * Math.cos(ph), amp * Math.sin(ph));
    });
    return {
      ear: ear, earL: earL,
      tab: [rnd(-0.55, 0.55), rnd(-0.35, 0.35), rnd(-0.45, 0.45), rnd(-0.3, 0.3)],
      bow: [rnd(-0.016, 0.016), rnd(-0.032, 0.032)],
      infl: infl
    };
  }
  // Sachet de la boutique : propre, mais chaque sachet a sa propre variante de froissures (fixe, tirée de son identifiant)
  function clean(p) {
    var h = A.hash ? A.hash((p && p.id) || 'pack') : 7, infl = [];
    TG.forEach(function (t, i) {
      if (i % 2) return;
      var amp = 0, ph = 0;
      if (/^froissure/.test(t.name)) { amp = 0.7 + (h % 7) / 10; ph = ((h >> (3 + i)) % 628) / 100; }
      infl.push(amp * Math.cos(ph), amp * Math.sin(ph));
    });
    return { ear: [0, 0, 0, 0], earL: [0.1, 0.1, 0.1, 0.1], tab: [-0.14, 0.05, -0.07, -0.03], bow: [-0.005, -0.01], infl: infl };
  }

  /* ---------- Textures (dessinées une fois par sachet) ---------- */
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function ctxS(c) { var x = c.getContext('2d'); x.setTransform(S, 0, 0, S, 0, 0); return x; }
  function rr(x, X, Y, w, h, r) {
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  }
  // Texte « encré » : sur les sachets clairs (th.stroke), un trait de la même couleur épaissit les lettres,
  // sinon les déliés de la serif disparaissent quand le sachet est petit (boutique)
  function ink(x, t, X, Y) {
    x.fillText(t, X, Y);
    if (!x.atlasStroke) return;
    x.save(); x.lineWidth = parseFloat(x.font.split(' ')[1]) * x.atlasStroke; x.lineJoin = 'round'; x.strokeStyle = x.fillStyle;
    x.strokeText(t, X, Y); x.restore();
  }
  function spaced(x, text, cx, y, track) {
    // Texte centré avec interlettrage (canvas.letterSpacing si disponible)
    if ('letterSpacing' in x) {
      x.letterSpacing = track + 'px';            // en unités du repère courant (déjà mis à l’échelle)
      var w = x.measureText(text).width - track;
      x.textAlign = 'left'; ink(x, text, cx - w / 2, y); x.letterSpacing = '0px';
      return w;
    }
    var chars = text.split(''), tw = 0, i;
    for (i = 0; i < chars.length; i++) tw += x.measureText(chars[i]).width + (i < chars.length - 1 ? track : 0);
    var px = cx - tw / 2; x.textAlign = 'left';
    for (i = 0; i < chars.length; i++) { ink(x, chars[i], px, y); px += x.measureText(chars[i]).width + track; }
    return tw;
  }
  function wrap(x, text, maxW) {
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function foil(x, th) {
    foilBase(x, th);
  }
  function foilBase(x, th) {
    // Dégradé à 158° (comme --pk-foil), sur tout le film
    var a = 158 * DEG, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(100 * dx) + Math.abs(160 * dy);
    var g = x.createLinearGradient(50 - dx * L / 2, 80 - dy * L / 2, 50 + dx * L / 2, 80 + dy * L / 2);
    th.foil.forEach(function (c, i) { g.addColorStop(FOIL_STOPS[i], c); });
    x.fillStyle = g; x.fillRect(0, 0, 100, 160);
    // Film brossé : fines stries verticales (sachet « référence » : film lisse, sauf l’essai « strie » qui les garde à moitié)
    var sk = REF ? (M.info.brush || 0) : 1, pitch = REF ? (M.info.pitch || 0.35) : 0.35;
    if (sk)
    for (var i = 0; i < 100; i += pitch) {
      x.fillStyle = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 > 0.5 ? 'rgba(255,255,255,' + (0.035 * sk) + ')' : 'rgba(0,0,0,' + (0.025 * sk) + ')';
      x.fillRect(i, 0, pitch * 0.51, 160);
    }
    if (REF && M.info.bands) {                       // essai « strie 2 » : larges bandes de reflet, comme un métal satiné
      for (var bx = 0; bx < 100; bx += 0.5) {
        var bv = Math.sin(bx * 0.9) * 0.6 + Math.sin(bx * 2.3 + 1.7) * 0.4;
        x.fillStyle = bv > 0 ? 'rgba(255,255,255,' + (0.05 * bv).toFixed(3) + ')' : 'rgba(0,0,0,' + (-0.04 * bv).toFixed(3) + ')';
        x.fillRect(bx, 0, 0.5, 160);
      }
    }
  }
  // Sachet « référence » : soudures à nervures horizontales (4, et 8 dans le bloc de couture), comme sur la photo
  function ribsY(b, n) { var o = []; for (var k = 0; k < n; k++) o.push(b[0] + b[1] * (0.08 + 0.84 * (k + 0.5) / n)); return o; }
  function crimpsRef(x, th) {
    [[0, CRIMP_T], [160 - CRIMP_B, CRIMP_B]].forEach(function (b) {
      var g = x.createLinearGradient(0, b[0], 0, b[0] + b[1]);
      g.addColorStop(0, 'rgba(0,0,0,.12)'); g.addColorStop(0.15, 'rgba(255,255,255,.06)'); g.addColorStop(0.85, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
      x.fillStyle = g; x.fillRect(0, b[0], 100, b[1]);
      [[0, 100, 4]].forEach(function (zone, zi) {
        ribsY(b, zone[2]).forEach(function (y) {
          var h = b[1] / zone[2] * 0.22;                                  // nervures fines et douces (le relief vient surtout du modèle)
          x.globalAlpha = zi ? 0.38 : 0.3;
          x.fillStyle = th.hi; x.fillRect(zone[0], y - h, zone[1] - zone[0], h * 0.7);
          x.fillStyle = th.lo; x.fillRect(zone[0], y + h * 0.3, zone[1] - zone[0], h * 0.6);
          x.globalAlpha = 1;
        });
      });
    });
  }
  function crimps(x, th) {
    if (REF) { crimpsRef(x, th); return; }
    [[0, CRIMP_T], [160 - CRIMP_B, CRIMP_B]].forEach(function (b) {
      var g = x.createLinearGradient(0, b[0], 0, b[0] + b[1]);
      g.addColorStop(0, 'rgba(0,0,0,.16)'); g.addColorStop(0.22, 'rgba(0,0,0,0)'); g.addColorStop(0.78, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.16)');
      x.fillStyle = g; x.fillRect(0, b[0], 100, b[1]);
      x.globalAlpha = 0.55;                      // le relief des stries vient surtout du bumpMap
      for (var i = 0; i < 100; i += 1.6) {
        x.fillStyle = th.hi; x.fillRect(i, b[0], 0.5, b[1]);
        x.fillStyle = th.lo; x.fillRect(i + 0.5, b[0], 0.6, b[1]);
      }
      x.globalAlpha = 1;
    });
  }
  function teeth(x, back) {
    if (REF && !M.info.teeth) {                                    // bords nets (cran en V seulement si le modèle en a un) ; « teeth » : dents de scie du classique
      if (!M.info.notch) return;
      var nx = M.info.notch * 100;
      if (back) nx = 100 - nx;                                     // le dos est en miroir : le cran traverse les deux faces au même endroit
      x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
      x.beginPath(); x.moveTo(nx - 1.4, -1); x.lineTo(nx, 2.6); x.lineTo(nx + 1.4, -1); x.closePath(); x.fill();
      x.restore(); return;
    }
    // Dents de scie des soudures : on efface le film entre les dents (alphaTest)
    var n = 17, d = 1.25;
    x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
    x.beginPath(); x.moveTo(0, -1);
    for (var i = 0; i <= n * 2; i++) x.lineTo(i / (n * 2) * 100, i % 2 ? d : 0);
    x.lineTo(100, -1); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(0, 161);
    for (var j = 0; j <= n * 2; j++) x.lineTo(j / (n * 2) * 100, j % 2 ? 160 - d : 160);
    x.lineTo(100, 161); x.closePath(); x.fill();
    x.restore();
  }
  // Logo : rose des vents à facettes dans un double cercle — même géométrie que U.mark (A.ui.MARK).
  function mark(x, cx, cy, size, color) {
    var M = A.ui && A.ui.MARK;
    x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(size / 32, size / 32);
    x.strokeStyle = color; x.fillStyle = color;
    x.lineWidth = 1.2; x.beginPath(); x.arc(16, 16, 14.6, 0, 7); x.stroke();
    var a = x.globalAlpha;
    x.globalAlpha = a * 0.6; x.lineWidth = 0.7; x.beginPath(); x.arc(16, 16, 10.6, 0, 7); x.stroke();
    if (M && window.Path2D) {
      x.globalAlpha = a; x.fill(new Path2D(M.dark));
      x.globalAlpha = a * 0.45; x.fill(new Path2D(M.light));
    }
    x.globalAlpha = a;
    x.restore();
  }
  function brand(x, th, cx, y, size) {
    x.font = '600 ' + size + 'px ' + SERIF; x.textBaseline = 'alphabetic';
    var tw = size * 3.9, g = x.createLinearGradient(cx - tw / 2, y - size, cx + tw / 2, y);
    th.brand.forEach(function (c, i) { g.addColorStop([0, 0.3, 0.52, 0.72, 1][i], c); });
    x.fillStyle = 'rgba(0,0,0,.12)'; spaced(x, 'ATLAS', cx + size * 0.19, y + 0.25, size * 0.38);
    x.fillStyle = g; spaced(x, 'ATLAS', cx + size * 0.19, y, size * 0.38);
  }
  function loadImg(src) {
    return new Promise(function (ok) {
      var im = new Image(); im.decoding = 'async';
      if (/^https?:/.test(src) && src.indexOf(location.origin) !== 0) im.crossOrigin = 'anonymous';   // texture WebGL depuis le CDN
      im.onload = function () { ok(im); }; im.onerror = function () { ok(null); };
      im.src = src;
    });
  }
  var fontsReady = null;
  function fonts() {
    if (fontsReady) return fontsReady;
    var f = document.fonts;
    var all = f && f.load ? Promise.all(['600 80px "Cormorant Garamond"', '500 80px "Cormorant Garamond"', '600 30px Inter', '500 30px Inter'].map(function (s) { return f.load(s).catch(function () {}); })) : Promise.resolve();
    return (fontsReady = Promise.race([all, new Promise(function (r) { setTimeout(r, 1800); })]));
  }

  /* ---------- Faces « sans illustration » du Booster Atlas (toutes collections) ----------
     Chaque motif occupe la zone de la fenêtre (WIN) et reste centré sur l’axe du sachet :
     en-tête ATLAS en haut, motif au centre, titre et pied en bas, mêmes marges partout. */
  var DCX = 50, DCY = WIN.y + WIN.h / 2, DR = 23;      // centre et rayon du motif
  function gold(x, th, y0, y1) {
    var g = x.createLinearGradient(0, y0, 0, y1), m = th.motif || ['#F6E3AE', th.gold, '#9C7A43'];
    g.addColorStop(0, m[0]); g.addColorStop(0.45, m[1]); g.addColorStop(1, m[2]);
    return g;
  }
  function rose(x, th, cx, cy, R, dark) {               // rose des vents à 8 branches facettées
    for (var i = 0; i < 8; i++) {
      var t = i * Math.PI / 4 - Math.PI / 2, L = i % 2 ? R * 0.62 : R, w = i % 2 ? 0.16 : 0.13;
      [[1, gold(x, th, cy - R, cy + R)], [-1, dark]].forEach(function (s) {
        x.beginPath(); x.moveTo(cx, cy);
        x.lineTo(cx + Math.cos(t) * L, cy + Math.sin(t) * L);
        x.lineTo(cx + Math.cos(t + s[0] * w) * R * 0.2, cy + Math.sin(t + s[0] * w) * R * 0.2);
        x.closePath(); x.fillStyle = s[1]; x.fill();
      });
    }
    x.fillStyle = gold(x, th, cy - 2, cy + 2); x.beginPath(); x.arc(cx, cy, R * 0.07, 0, 7); x.fill();
  }
  // Runes du futhark ancien, en traits (boîte 0,8 × 2) : le canevas n’a pas de police runique
  var RUNES = [
    [[0, 0, 0, 2], [0, 0.5, 0.8, 0], [0, 1, 0.8, 0.5]], [[0, 0, 0, 2], [0, 0, 0.8, 0.5], [0.8, 0.5, 0.8, 2]],
    [[0, 0, 0, 2], [0, 0.6, 0.7, 1], [0.7, 1, 0, 1.4]], [[0, 0, 0, 2], [0, 0, 0.7, 0.45], [0, 0.5, 0.7, 0.95]],
    [[0, 0, 0, 2], [0, 0, 0.7, 0.45], [0.7, 0.45, 0, 0.9], [0, 0.9, 0.7, 2]], [[0.7, 0.3, 0, 1], [0, 1, 0.7, 1.7]],
    [[0, 0.2, 0.8, 1.8], [0.8, 0.2, 0, 1.8]], [[0, 0, 0, 2], [0.8, 0, 0.8, 2], [0, 0.8, 0.8, 1.2]],
    [[0.4, 0, 0.4, 2]], [[0.4, 0, 0.4, 2], [0.4, 0, 0, 0.5], [0.4, 0, 0.8, 0.5]],
    [[0.4, 0, 0.4, 2], [0.4, 0.9, 0, 0.2], [0.4, 0.9, 0.8, 0.2]], [[0.7, 0, 0, 0.8], [0, 0.8, 0.7, 1.2], [0.7, 1.2, 0, 2]],
    [[0, 0, 0, 2], [0.8, 0, 0.8, 2], [0, 0, 0.8, 0.8], [0.8, 0, 0, 0.8]], [[0, 0.2, 0, 1.8], [0.8, 0.2, 0.8, 1.8], [0, 0.2, 0.8, 1.8], [0.8, 0.2, 0, 1.8]],
    [[0.4, 0, 0.8, 0.6], [0.8, 0.6, 0, 1.6], [0.4, 0, 0, 0.6], [0, 0.6, 0.8, 1.6]], [[0, 0, 0, 2], [0, 0, 0.7, 0.45], [0.7, 0.45, 0, 0.9]]
  ];
  function halo(x, th) {
    var h = x.createRadialGradient(DCX, DCY, 2, DCX, DCY, DR + 8);
    h.addColorStop(0, th.glow || 'rgba(234,203,134,.22)'); h.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = h; x.fillRect(0, DCY - DR - 10, 100, DR * 2 + 20);
  }
  // Cadre commun des emblèmes : halo, double anneau ; laisse un save() ouvert (chaque motif finit par x.restore())
  function ringFrame(x, th) {
    var g = gold(x, th, DCY - DR, DCY + DR);
    x.save(); halo(x, th);
    x.strokeStyle = g; x.lineWidth = 0.55; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
    x.lineWidth = 0.25; x.beginPath(); x.arc(DCX, DCY, DR + 1.4, 0, 7); x.stroke();
    return g;
  }
  var DESIGN = {
    // Saga du Nord : l’arbre-monde Yggdrasil (branches et racines) dans un anneau de runes, sur film givré
    runes: function (x, th) {
      var g = gold(x, th, DCY - DR, DCY + DR);
      x.save(); halo(x, th);
      x.strokeStyle = g; x.fillStyle = g; x.lineCap = 'round';
      x.lineWidth = 0.55; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
      x.lineWidth = 0.3; x.beginPath(); x.arc(DCX, DCY, DR - 5.4, 0, 7); x.stroke();
      x.beginPath(); x.arc(DCX, DCY, DR + 1.4, 0, 7); x.stroke();
      for (var k = 0; k < 24; k++) {                    // anneau de runes, chacune tournée vers le centre
        var t = k / 24 * Math.PI * 2 - Math.PI / 2, rr0 = DR - 2.8, sc = 1.6, rn = RUNES[k % RUNES.length];
        x.save(); x.translate(DCX + Math.cos(t) * rr0, DCY + Math.sin(t) * rr0); x.rotate(t + Math.PI / 2);
        x.lineWidth = 0.36; x.beginPath();
        rn.forEach(function (sg) { x.moveTo((sg[0] - 0.4) * sc, (sg[1] - 1) * sc); x.lineTo((sg[2] - 0.4) * sc, (sg[3] - 1) * sc); });
        x.stroke(); x.restore();
      }
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 6.2, 0, 7); x.clip();
      function branch(px, py, a, len, d, spread, w) {
        var ex = px + Math.cos(a) * len, ey = py + Math.sin(a) * len;
        x.lineWidth = w; x.beginPath(); x.moveTo(px, py); x.lineTo(ex, ey); x.stroke();
        if (d > 0) { branch(ex, ey, a - spread, len * 0.74, d - 1, spread, w * 0.68); branch(ex, ey, a + spread, len * 0.74, d - 1, spread, w * 0.68); }
        else { x.beginPath(); x.arc(ex, ey, 0.32, 0, 7); x.fill(); }
      }
      var by = DCY + 4.2;
      branch(DCX, by, -Math.PI / 2, 5.2, 6, 0.43, 1.5);           // tronc et ramure
      branch(DCX, by, Math.PI / 2, 3.4, 4, 0.62, 1.15);             // racines
      x.lineWidth = 0.22; x.globalAlpha = 0.7; x.beginPath(); x.moveTo(DCX - 9, by); x.lineTo(DCX + 9, by); x.stroke();
      x.restore();
      x.restore();
    },
    // Saga du Soleil levant : soleil vermillon, torii à l’encre et vagues seigaiha, sur papier crème
    torii: function (x, th) {
      var g = gold(x, th, DCY - DR, DCY + DR), ink = th.toriiInk || th.ink, paper = th.foil[2];
      x.save(); halo(x, th);
      x.strokeStyle = g; x.lineWidth = 0.55; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
      x.lineWidth = 0.25; x.beginPath(); x.arc(DCX, DCY, DR + 1.4, 0, 7); x.stroke();
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g; x.beginPath(); x.arc(DCX, DCY - 3, 14.5, 0, 7); x.fill();          // soleil
      var wy = DCY + 8.6;                                                                  // vagues seigaiha
      for (var row = 0; row < 7; row++) {
        var yy = wy + row * 2.3, off = row % 2 ? 2.4 : 0;
        for (var cx = DCX - DR - 4 + off; cx < DCX + DR + 4; cx += 4.8) {
          [2.5, 1.75, 1.0].forEach(function (r, i) {
            x.beginPath(); x.arc(cx, yy, r, Math.PI, 0); x.closePath();
            if (i === 0) { x.fillStyle = paper; x.fill(); }
            x.lineWidth = 0.22; x.strokeStyle = th.ink2; x.globalAlpha = 0.75; x.stroke(); x.globalAlpha = 1;
          });
        }
      }
      x.restore();
      // Torii à l’encre, posé sur les vagues
      x.fillStyle = ink;
      var top = DCY - 10.2, base = wy - 0.6;
      [-1, 1].forEach(function (sd) {                                                      // piliers, légèrement inclinés
        x.beginPath(); x.moveTo(DCX + sd * 6.0, top + 2.4); x.lineTo(DCX + sd * 7.4, base); x.lineTo(DCX + sd * 5.9, base); x.lineTo(DCX + sd * 4.8, top + 2.4); x.closePath(); x.fill();
      });
      x.beginPath(); x.moveTo(DCX - 12.5, top - 1.2); x.quadraticCurveTo(DCX, top + 1.2, DCX + 12.5, top - 1.2);   // kasagi, bouts relevés
      x.lineTo(DCX + 11.6, top + 0.9); x.quadraticCurveTo(DCX, top + 2.9, DCX - 11.6, top + 0.9); x.closePath(); x.fill();
      x.fillRect(DCX - 10.2, top + 2.6, 20.4, 0.9);                                        // shimaki
      x.fillRect(DCX - 9.4, top + 5.8, 18.8, 1.1);                                         // nuki
      x.fillRect(DCX - 0.6, top + 2.6, 1.2, 3.4);                                          // gakuzuka
      x.restore();
    },
    // 1. Astrolabe : rose des vents gravée dans un limbe gradué, sur bleu nuit
    astrolabe: function (x, th) {
      var g = gold(x, th, DCY - DR, DCY + DR);
      x.save();
      var halo = x.createRadialGradient(DCX, DCY, 2, DCX, DCY, DR + 8);
      halo.addColorStop(0, th.glow || 'rgba(234,203,134,.22)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = halo; x.fillRect(0, DCY - DR - 10, 100, DR * 2 + 20);
      x.strokeStyle = g; x.lineWidth = 0.55; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
      x.lineWidth = 0.25; x.beginPath(); x.arc(DCX, DCY, DR - 3.2, 0, 7); x.stroke();
      x.beginPath(); x.arc(DCX, DCY, DR + 1.4, 0, 7); x.stroke();
      for (var k = 0; k < 72; k++) {                    // graduations du limbe
        var t = k * Math.PI / 36, l = k % 6 ? 1.1 : 2.4;
        x.lineWidth = k % 6 ? 0.18 : 0.32;
        x.beginPath(); x.moveTo(DCX + Math.cos(t) * DR, DCY + Math.sin(t) * DR); x.lineTo(DCX + Math.cos(t) * (DR - l), DCY + Math.sin(t) * (DR - l)); x.stroke();
      }
      x.globalAlpha = 0.45; x.lineWidth = 0.2;          // méridiens et parallèles du globe intérieur
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 3.2, 0, 7); x.clip();
      [0.35, 0.7].forEach(function (k) { x.beginPath(); x.ellipse(DCX, DCY, (DR - 3.2) * k, DR - 3.2, 0, 0, 7); x.stroke(); });
      [-0.5, 0, 0.5].forEach(function (k) { var yy = DCY + k * (DR - 3.2); x.beginPath(); x.moveTo(DCX - DR, yy); x.lineTo(DCX + DR, yy); x.stroke(); });
      x.restore(); x.globalAlpha = 1;
      rose(x, th, DCX, DCY, DR - 4.5, th.facet || 'rgba(10,20,55,.85)');
      x.restore();
    },
    // Booster quotidien : cadran solaire, un soleil rayonnant dans un limbe à douze heures
    cadran: function (x, th) {
      var g = gold(x, th, DCY - DR, DCY + DR);
      x.save();
      var halo = x.createRadialGradient(DCX, DCY, 2, DCX, DCY, DR + 8);
      halo.addColorStop(0, th.glow || 'rgba(234,203,134,.22)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = halo; x.fillRect(0, DCY - DR - 10, 100, DR * 2 + 20);
      x.strokeStyle = g; x.fillStyle = g;
      x.lineWidth = 0.55; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
      x.lineWidth = 0.25; x.beginPath(); x.arc(DCX, DCY, DR - 3.6, 0, 7); x.stroke();
      x.beginPath(); x.arc(DCX, DCY, DR + 1.4, 0, 7); x.stroke();
      for (var h = 0; h < 12; h++) {                    // douze heures : losange aux quarts, point ailleurs
        var t = h * Math.PI / 6 - Math.PI / 2, rx = DCX + Math.cos(t) * (DR - 1.8), ry = DCY + Math.sin(t) * (DR - 1.8);
        if (h % 3 === 0) { x.save(); x.translate(rx, ry); x.rotate(t + Math.PI / 4); x.fillRect(-0.9, -0.9, 1.8, 1.8); x.restore(); }
        else { x.beginPath(); x.arc(rx, ry, 0.45, 0, 7); x.fill(); }
      }
      for (var k = 0; k < 32; k++) {                    // rayons alternés, longs et courts, en flammes fines
        var a = k * Math.PI / 16, L = k % 2 ? 11.5 : 15.5, w = k % 2 ? 0.05 : 0.075;
        x.beginPath();
        x.moveTo(DCX + Math.cos(a - w) * 7, DCY + Math.sin(a - w) * 7);
        x.lineTo(DCX + Math.cos(a) * L, DCY + Math.sin(a) * L);
        x.lineTo(DCX + Math.cos(a + w) * 7, DCY + Math.sin(a + w) * 7);
        x.closePath(); x.fillStyle = k % 2 ? th.facet || 'rgba(0,0,0,.5)' : g; x.fill();
        if (k % 2) { x.lineWidth = 0.12; x.strokeStyle = g; x.stroke(); }
      }
      x.fillStyle = g; x.beginPath(); x.arc(DCX, DCY, 6.2, 0, 7); x.fill();   // disque solaire
      x.strokeStyle = th.facet || 'rgba(0,0,0,.5)'; x.lineWidth = 0.3; x.beginPath(); x.arc(DCX, DCY, 4.6, 0, 7); x.stroke();
      x.restore();
    },

    /* ---------- Propositions (page Design des boosters) et Saga du Nil ---------- */
    // Mont Fuji : soleil derrière le cône enneigé, bandes de nuages
    fuji: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g; x.beginPath(); x.arc(DCX + 7, DCY - 7, 7.5, 0, 7); x.fill();
      x.fillStyle = th.facet || 'rgba(0,0,0,.6)';
      x.beginPath(); x.moveTo(DCX - 22, DCY + 13); x.quadraticCurveTo(DCX - 8, DCY + 2, DCX - 4.5, DCY - 9);
      x.lineTo(DCX + 4.5, DCY - 9); x.quadraticCurveTo(DCX + 8, DCY + 2, DCX + 22, DCY + 13); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 0.4; x.stroke();
      x.fillStyle = g; x.beginPath(); x.moveTo(DCX - 4.5, DCY - 9); x.lineTo(DCX + 4.5, DCY - 9);           // neige
      x.lineTo(DCX + 6.6, DCY - 4.6); x.lineTo(DCX + 3.4, DCY - 5.8); x.lineTo(DCX + 1.2, DCY - 3.6); x.lineTo(DCX - 1.4, DCY - 5.6);
      x.lineTo(DCX - 3.8, DCY - 3.8); x.lineTo(DCX - 6.6, DCY - 4.6); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 0.45; x.lineCap = 'round';
      [[DCY + 6, -16, -4], [DCY + 9.5, 3, 15], [DCY + 15.5, -12, 10]].forEach(function (c) {           // nuages
        x.beginPath(); x.moveTo(DCX + c[1], c[0]);
        for (var k = 0; k <= 8; k++) x.lineTo(DCX + c[1] + (c[2] - c[1]) * k / 8, c[0] + Math.sin(k * 1.6) * 0.6);
        x.stroke();
      });
      x.restore(); x.restore();
    },
    // Grande vague : une crête qui s’enroule en griffes d’écume, un petit Fuji au loin
    vague: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.strokeStyle = g; x.lineCap = 'round';
      for (var k = 0; k < 6; k++) {                                     // corps de la vague : courbes parallèles
        var o = k * 1.9;
        x.lineWidth = k ? 0.38 : 0.7;
        x.beginPath(); x.moveTo(DCX - 22, DCY + 16 - o * 0.3);
        x.bezierCurveTo(DCX - 14, DCY + 6 - o, DCX - 6, DCY - 14 + o * 0.6, DCX + 7 - o * 0.4, DCY - 12 + o);
        x.bezierCurveTo(DCX + 14, DCY - 11 + o, DCX + 13, DCY - 3 + o * 0.7, DCX + 8, DCY - 3 + o * 0.6);
        x.stroke();
      }
      x.fillStyle = g;
      for (var c = 0; c < 9; c++) {                                     // griffes d’écume
        var a = -2.6 + c * 0.32, cx = DCX + 6 + Math.cos(a) * 9, cy = DCY - 6 + Math.sin(a) * 8;
        x.beginPath(); x.arc(cx, cy, 1.1 - c * 0.06, 0, 7); x.fill();
      }
      x.fillStyle = th.facet || 'rgba(0,0,0,.5)';                        // le Fuji, petit, au pied de la vague
      x.beginPath(); x.moveTo(DCX + 2, DCY + 15); x.lineTo(DCX + 8, DCY + 8.6); x.lineTo(DCX + 10, DCY + 8.6); x.lineTo(DCX + 16, DCY + 15); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 0.3; x.stroke();
      x.restore(); x.restore();
    },
    // Sakura : une grande fleur de cerisier, deux petites et la branche
    sakura: function (x, th) {
      var g = ringFrame(x, th);
      function flower(cx, cy, r, rot) {
        x.save(); x.translate(cx, cy); x.rotate(rot);
        for (var k = 0; k < 5; k++) {
          x.save(); x.rotate(k * Math.PI * 2 / 5);
          x.beginPath(); x.moveTo(0, 0);
          x.bezierCurveTo(-r * 0.55, -r * 0.3, -r * 0.5, -r * 0.95, -r * 0.12, -r);
          x.lineTo(0, -r * 0.84); x.lineTo(r * 0.12, -r);
          x.bezierCurveTo(r * 0.5, -r * 0.95, r * 0.55, -r * 0.3, 0, 0);
          x.fillStyle = g; x.fill(); x.lineWidth = 0.2; x.strokeStyle = th.facet || 'rgba(0,0,0,.4)'; x.stroke();
          x.restore();
        }
        x.fillStyle = th.facet || 'rgba(0,0,0,.5)'; x.beginPath(); x.arc(0, 0, r * 0.16, 0, 7); x.fill();
        x.restore();
      }
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.strokeStyle = g; x.lineWidth = 1.1; x.lineCap = 'round';
      x.beginPath(); x.moveTo(DCX - 20, DCY + 14); x.quadraticCurveTo(DCX - 6, DCY + 8, DCX + 2, DCY - 2); x.quadraticCurveTo(DCX + 8, DCY - 10, DCX + 18, DCY - 12); x.stroke();
      x.lineWidth = 0.6; x.beginPath(); x.moveTo(DCX - 8, DCY + 8.5); x.quadraticCurveTo(DCX - 12, DCY + 2, DCX - 11, DCY - 4); x.stroke();
      flower(DCX + 2, DCY - 1, 8.5, 0.2);
      flower(DCX - 11, DCY - 6, 4.6, 0.7);
      flower(DCX + 13, DCY - 11, 4, -0.3);
      x.restore(); x.restore();
    },
    // Tomoe (mitsudomoe) : trois virgules qui tournent — tête ronde, queue qui longe le cercle et s’effile
    tomoe: function (x, th) {
      var g = ringFrame(x, th), R = 15;
      x.save(); x.translate(DCX, DCY);
      x.fillStyle = g;
      for (var k = 0; k < 3; k++) {
        var a = k * Math.PI * 2 / 3 - Math.PI / 2, hc = R * 0.5, hr = R * 0.3;
        var hx = Math.cos(a) * hc, hy = Math.sin(a) * hc;
        x.beginPath(); x.arc(hx, hy, hr, 0, 7); x.fill();                 // tête
        x.beginPath();                                                      // queue : part du dos de la tête, longe le cercle, s’effile
        x.moveTo(hx + Math.cos(a - 0.35) * hr, hy + Math.sin(a - 0.35) * hr);
        x.arc(0, 0, R * 0.97, a + 0.05, a + 1.95, false);
        x.quadraticCurveTo(Math.cos(a + 1.05) * R * 0.74, Math.sin(a + 1.05) * R * 0.74,
          hx + Math.cos(a + Math.PI * 0.55) * hr, hy + Math.sin(a + Math.PI * 0.55) * hr);
        x.closePath(); x.fill();
      }
      x.strokeStyle = g; x.lineWidth = 0.45; x.beginPath(); x.arc(0, 0, R + 2.2, 0, 7); x.stroke();
      x.restore(); x.restore();
    },
    // Pagode à cinq toits relevés, soleil derrière
    pagode: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g; x.beginPath(); x.arc(DCX + 9, DCY - 9, 6, 0, 7); x.fill();
      x.fillStyle = th.toriiInk || th.facet || 'rgba(0,0,0,.7)';
      x.fillRect(DCX - 0.35, DCY - 21, 0.7, 7);                           // flèche
      for (var k = 0; k < 5; k++) {
        var y = DCY - 13 + k * 5.6, w = 6 + k * 2.2;
        x.fillRect(DCX - w * 0.55, y + 1.4, w * 1.1, 3.6);                 // étage
        x.beginPath(); x.moveTo(DCX - w - 2.2, y - 0.8); x.quadraticCurveTo(DCX - w, y + 1.6, DCX, y + 0.6);   // toit relevé
        x.quadraticCurveTo(DCX + w, y + 1.6, DCX + w + 2.2, y - 0.8); x.lineTo(DCX + w * 0.7, y + 2.2); x.lineTo(DCX - w * 0.7, y + 2.2); x.closePath(); x.fill();
      }
      x.strokeStyle = g; x.lineWidth = 0.35; x.beginPath(); x.moveTo(DCX - 22, DCY + 16.4); x.lineTo(DCX + 22, DCY + 16.4); x.stroke();
      x.restore(); x.restore();
    },
    // Drakkar : coque à proue de dragon, voile rayée, vagues
    drakkar: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.6)';
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g;
      x.fillRect(DCX - 0.45, DCY - 17, 0.9, 20);                          // mât
      x.beginPath(); x.moveTo(DCX - 9, DCY - 14); x.quadraticCurveTo(DCX, DCY - 16, DCX + 9, DCY - 14);   // voile
      x.lineTo(DCX + 9.5, DCY + 1); x.quadraticCurveTo(DCX, DCY - 1, DCX - 9.5, DCY + 1); x.closePath(); x.fill();
      x.fillStyle = dk; for (var k = 0; k < 3; k++) x.fillRect(DCX - 6.8 + k * 5.2, DCY - 14.4, 2.4, 15);   // rayures
      x.fillStyle = g;
      x.beginPath(); x.moveTo(DCX - 17, DCY + 2); x.quadraticCurveTo(DCX, DCY + 11, DCX + 17, DCY + 2);   // coque
      x.lineTo(DCX + 14, DCY + 6.5); x.quadraticCurveTo(DCX, DCY + 12, DCX - 14, DCY + 6.5); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 1.1; x.lineCap = 'round';
      x.beginPath(); x.moveTo(DCX + 16, DCY + 3); x.quadraticCurveTo(DCX + 21, DCY - 4, DCX + 18, DCY - 8); x.quadraticCurveTo(DCX + 16, DCY - 10, DCX + 15.5, DCY - 7.5); x.stroke();   // proue
      x.beginPath(); x.moveTo(DCX - 16, DCY + 3); x.quadraticCurveTo(DCX - 20, DCY - 3, DCX - 17.5, DCY - 6.5); x.stroke();   // poupe
      x.fillStyle = dk; for (var s = 0; s < 6; s++) { x.beginPath(); x.arc(DCX - 10 + s * 4, DCY + 4.6, 1.15, 0, 7); x.fill(); }   // boucliers
      x.lineWidth = 0.4;
      for (var r = 0; r < 3; r++) { x.beginPath(); for (var k2 = 0; k2 <= 22; k2++) { var xx = DCX - 22 + k2 * 2, yy = DCY + 12 + r * 2.6 + Math.sin(k2 * 1.3 + r) * 0.7; if (k2) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke(); }
      x.restore(); x.restore();
    },
    // Aurore boréale au-dessus des montagnes, étoiles
    aurore: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      for (var b = 0; b < 3; b++) {                                       // rubans de l’aurore
        x.save(); x.globalAlpha = 0.55 - b * 0.12;
        for (var k = 0; k < 40; k++) {
          var xx = DCX - 22 + k * 1.1, yy = DCY - 9 + b * 4 + Math.sin(k * 0.24 + b * 1.7) * 4;
          var gr = x.createLinearGradient(0, yy - 9, 0, yy + 2);
          gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, (th.motif || [th.gold, th.gold])[1]);
          x.fillStyle = gr; x.fillRect(xx, yy - 9, 1.15, 11);
        }
        x.restore();
      }
      x.fillStyle = g;
      [[-14, -15], [-6, -18], [4, -16], [12, -19], [17, -12], [-18, -9]].forEach(function (s) { x.beginPath(); x.arc(DCX + s[0], DCY + s[1], 0.45, 0, 7); x.fill(); });
      x.fillStyle = th.facet || 'rgba(0,0,0,.7)';
      x.beginPath(); x.moveTo(DCX - 23, DCY + 23); x.lineTo(DCX - 23, DCY + 10); x.lineTo(DCX - 13, DCY + 2); x.lineTo(DCX - 7, DCY + 7);
      x.lineTo(DCX + 2, DCY - 1); x.lineTo(DCX + 10, DCY + 7); x.lineTo(DCX + 15, DCY + 4); x.lineTo(DCX + 23, DCY + 11); x.lineTo(DCX + 23, DCY + 23); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 0.4; x.stroke();
      x.restore(); x.restore();
    },
    // Mjölnir : le marteau de Thor, entrelacs sur la tête, manche gainé
    mjolnir: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.6)';
      x.save(); x.translate(DCX, DCY);
      x.fillStyle = g;
      x.beginPath(); x.moveTo(-13, -15); x.lineTo(13, -15); x.lineTo(15, -11); x.lineTo(14, -2); x.lineTo(11, 1); x.lineTo(-11, 1); x.lineTo(-14, -2); x.lineTo(-15, -11); x.closePath(); x.fill();
      x.strokeStyle = dk; x.lineWidth = 0.5;
      x.beginPath(); x.moveTo(-10, -12); x.bezierCurveTo(-4, -2, 4, -14, 10, -4); x.moveTo(-10, -4); x.bezierCurveTo(-4, -14, 4, -2, 10, -12); x.stroke();
      x.strokeRect(-12.5, -13.5, 25, 13);
      x.fillStyle = g; x.fillRect(-1.8, 1, 3.6, 13);                       // manche
      x.strokeStyle = dk; x.lineWidth = 0.35;
      for (var k = 0; k < 6; k++) { x.beginPath(); x.moveTo(-1.8, 3 + k * 2); x.lineTo(1.8, 1.6 + k * 2); x.stroke(); }
      x.fillStyle = g; x.beginPath(); x.arc(0, 16.5, 2.6, 0, 7); x.fill(); // pommeau
      x.strokeStyle = dk; x.beginPath(); x.arc(0, 16.5, 1.3, 0, 7); x.stroke();
      x.restore(); x.restore();
    },
    // Bouclier rond : planches, umbo, rivets
    bouclier: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.6)';
      x.save(); x.translate(DCX, DCY);
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, 17.5, 0, 7); x.fill();
      x.strokeStyle = dk; x.lineWidth = 0.4;
      x.save(); x.beginPath(); x.arc(0, 0, 15.6, 0, 7); x.clip();
      for (var k = -4; k <= 4; k++) { x.beginPath(); x.moveTo(k * 3.6, -18); x.lineTo(k * 3.6, 18); x.stroke(); }   // planches
      x.restore();
      x.lineWidth = 0.7; x.beginPath(); x.arc(0, 0, 15.6, 0, 7); x.stroke();
      for (var r = 0; r < 16; r++) { var a = r * Math.PI / 8; x.fillStyle = dk; x.beginPath(); x.arc(Math.cos(a) * 16.6, Math.sin(a) * 16.6, 0.45, 0, 7); x.fill(); }
      x.fillStyle = dk; x.beginPath(); x.arc(0, 0, 5.6, 0, 7); x.fill();     // umbo
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, 4.4, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.arc(-1.3, -1.3, 1.4, 0, 7); x.fill();
      x.restore(); x.restore();
    },
    // Entrelacs : deux rubans tressés autour d’une rune (Algiz)
    entrelacs: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.6)';
      x.save(); x.translate(DCX, DCY); x.lineCap = 'round';
      function band(ph) {
        x.beginPath();
        for (var k = 0; k <= 96; k++) { var a = k / 96 * Math.PI * 2, r = 15 + Math.sin(a * 6 + ph) * 3.2; if (k) x.lineTo(Math.cos(a) * r, Math.sin(a) * r); else x.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
        x.lineWidth = 2.2; x.strokeStyle = dk; x.stroke(); x.lineWidth = 1.5; x.strokeStyle = g; x.stroke();
      }
      band(0); band(Math.PI);
      x.strokeStyle = g; x.lineWidth = 1.3;                                // rune Algiz
      x.beginPath(); x.moveTo(0, 8); x.lineTo(0, -8); x.moveTo(0, -1); x.lineTo(-5, -7.5); x.moveTo(0, -1); x.lineTo(5, -7.5); x.stroke();
      x.restore(); x.restore();
    },
    // ---------- Saga du Nil : propositions ----------
    // Œil d’Horus (oudjat) : amande, pupille, sourcil, spirale et larme
    oudjat: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.translate(DCX, DCY - 1); x.strokeStyle = g; x.fillStyle = g; x.lineCap = 'round'; x.lineJoin = 'round';
      x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(-13, 0); x.quadraticCurveTo(0, -11, 14, -1); x.quadraticCurveTo(0, 7, -13, 0); x.stroke();   // amande
      x.beginPath(); x.arc(0.5, -1.6, 3.6, 0, 7); x.fill();                                                               // pupille
      x.lineWidth = 1.8; x.beginPath(); x.moveTo(-13, -8.5); x.quadraticCurveTo(0, -16, 15, -8); x.stroke();               // sourcil
      x.lineWidth = 1.3; x.beginPath(); x.moveTo(14, -1); x.lineTo(19, -1); x.stroke();                                   // trait vers la tempe
      x.lineWidth = 1.4; x.beginPath(); x.moveTo(-1, 3.4); x.lineTo(-2.5, 13); x.stroke();                                // larme
      x.beginPath(); x.moveTo(4, 3.2); x.bezierCurveTo(6, 9, 13, 10, 12, 14.5); x.bezierCurveTo(11, 17.5, 7, 16, 8.5, 13.5); x.stroke();   // spirale
      x.restore(); x.restore();
    },
    // Scarabée (Khépri) : il pousse le soleil, ailes déployées
    scarabee: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.5)';
      x.save(); x.translate(DCX, DCY + 2); x.fillStyle = g; x.strokeStyle = g; x.lineCap = 'round';
      [-1, 1].forEach(function (sd) {                                     // ailes
        for (var row = 0; row < 2; row++) for (var f = 0; f < 6 - row; f++) {
          var x0 = sd * (5.5 + f * 2), y0 = -2 + row * 2.4 + f * 0.6, len = 4.6 - row * 1.1;
          x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + sd * 1.7, y0 + 0.4); x.lineTo(x0 + sd * 1.2, y0 + len); x.lineTo(x0 - sd * 0.2, y0 + len - 0.7); x.closePath(); x.fill();
        }
      });
      x.beginPath(); x.ellipse(0, 4, 5.4, 7.2, 0, 0, 7); x.fill();         // corps
      x.beginPath(); x.ellipse(0, -3.6, 3.6, 2.4, 0, 0, 7); x.fill();      // tête
      x.strokeStyle = dk; x.lineWidth = 0.4; x.beginPath(); x.moveTo(0, -1.2); x.lineTo(0, 11); x.moveTo(-5, 1.4); x.lineTo(5, 1.4); x.stroke();
      x.strokeStyle = g; x.lineWidth = 0.7;
      x.beginPath(); x.moveTo(-2.4, -5.4); x.lineTo(-4, -9.5); x.moveTo(2.4, -5.4); x.lineTo(4, -9.5);   // pattes avant
      x.moveTo(-4.6, 7); x.lineTo(-8, 11); x.moveTo(4.6, 7); x.lineTo(8, 11); x.stroke();
      x.fillStyle = g; x.beginPath(); x.arc(0, -13.5, 4.3, 0, 7); x.fill(); // le soleil
      x.restore(); x.restore();
    },
    // Ankh : la croix de vie, entre deux étoiles
    ankh: function (x, th) {
      var g = ringFrame(x, th);
      x.save(); x.translate(DCX, DCY); x.fillStyle = g; x.strokeStyle = g;
      x.lineWidth = 2.6; x.beginPath(); x.ellipse(0, -9.5, 4.6, 6.2, 0, 0, 7); x.stroke();   // boucle
      x.beginPath(); x.moveTo(-10.5, -2.4); x.lineTo(10.5, -2.4); x.lineTo(10.5, 1.2); x.lineTo(-10.5, 1.2); x.closePath(); x.fill();   // traverse
      x.beginPath(); x.moveTo(-1.6, 1); x.lineTo(1.6, 1); x.lineTo(2.6, 17); x.lineTo(-2.6, 17); x.closePath(); x.fill();   // tige
      function star(cx, cy, r) { x.beginPath(); for (var k = 0; k < 10; k++) { var a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); }
      star(-13, -10, 2.2); star(13, -10, 2.2); star(-12, 9, 1.4); star(12, 9, 1.4);
      x.restore(); x.restore();
    },
    // Barque solaire de Râ : coque en papyrus aux bouts relevés, naos et soleil, eaux du Nil
    barque: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.5)';
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g;
      x.beginPath(); x.arc(DCX, DCY - 9, 5.2, 0, 7); x.fill();             // soleil
      x.fillRect(DCX - 4.2, DCY - 2.6, 8.4, 5.6);                          // naos
      x.fillStyle = dk; x.fillRect(DCX - 2.2, DCY - 1.2, 4.4, 4.2);
      x.fillStyle = g;
      x.beginPath(); x.moveTo(DCX - 19, DCY - 4);                            // coque
      x.quadraticCurveTo(DCX - 16, DCY + 5, DCX, DCY + 6);
      x.quadraticCurveTo(DCX + 16, DCY + 5, DCX + 19, DCY - 4);
      x.quadraticCurveTo(DCX + 15, DCY + 1, DCX + 12, DCY + 3); x.lineTo(DCX - 12, DCY + 3);
      x.quadraticCurveTo(DCX - 15, DCY + 1, DCX - 19, DCY - 4); x.closePath(); x.fill();
      x.strokeStyle = g; x.lineWidth = 0.9; x.lineCap = 'round';
      x.beginPath(); x.moveTo(DCX - 19, DCY - 4); x.quadraticCurveTo(DCX - 21, DCY - 8, DCX - 18, DCY - 9.5); x.stroke();   // ombelles de papyrus
      x.beginPath(); x.moveTo(DCX + 19, DCY - 4); x.quadraticCurveTo(DCX + 21, DCY - 8, DCX + 18, DCY - 9.5); x.stroke();
      x.lineWidth = 0.6; x.beginPath(); x.moveTo(DCX + 9, DCY + 3); x.lineTo(DCX + 13, DCY + 10); x.stroke();   // rame
      x.lineWidth = 0.4;
      for (var r = 0; r < 3; r++) { x.beginPath(); for (var k = 0; k <= 22; k++) { var xx = DCX - 22 + k * 2, yy = DCY + 11 + r * 2.4 + Math.sin(k * 1.2 + r) * 0.55; if (k) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke(); }
      x.restore(); x.restore();
    },
    // Lotus : trois fleurs de lotus et deux boutons sur l’eau
    lotus: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.5)';
      function flower(cx, cy, s) {
        x.save(); x.translate(cx, cy); x.scale(s, s);
        [[-1, 1], [1, 1], [-0.55, 0.85], [0.55, 0.85], [0, 1]].forEach(function (pt, i) {   // pétales, du fond vers l’avant
          x.save(); x.rotate(pt[0] * 0.75);
          x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-3.2 * pt[1], -5, 0, -10 * pt[1]); x.quadraticCurveTo(3.2 * pt[1], -5, 0, 0);
          x.fillStyle = g; x.fill(); x.lineWidth = 0.3; x.strokeStyle = dk; x.stroke();
          x.restore();
        });
        x.restore();
      }
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.strokeStyle = g; x.lineWidth = 0.7; x.lineCap = 'round';
      [[0, -2], [-10, 3], [10, 3], [-16, 7], [16, 6]].forEach(function (p) { x.beginPath(); x.moveTo(DCX + p[0], DCY + p[1]); x.lineTo(DCX + p[0] * 0.6, DCY + 13); x.stroke(); });   // tiges
      flower(DCX, DCY - 2, 1.25); flower(DCX - 10, DCY + 3, 0.9); flower(DCX + 10, DCY + 3, 0.9);
      x.fillStyle = g; [[-16, 7], [16, 6]].forEach(function (p) { x.beginPath(); x.ellipse(DCX + p[0], DCY + p[1] - 2.2, 1.4, 2.6, 0, 0, 7); x.fill(); });   // boutons
      x.lineWidth = 0.4;
      for (var r = 0; r < 3; r++) { x.beginPath(); for (var k = 0; k <= 22; k++) { var xx = DCX - 22 + k * 2, yy = DCY + 13 + r * 2.4 + Math.sin(k * 1.1 + r) * 0.5; if (k) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke(); }
      x.restore(); x.restore();
    },
    // Saga du Nil : soleil ailé au-dessus des pyramides et du fleuve
    ailes: function (x, th) {
      var g = ringFrame(x, th), dk = th.facet || 'rgba(0,0,0,.5)';
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR - 1.6, 0, 7); x.clip();
      x.fillStyle = g;
      [-1, 1].forEach(function (sd) {                                     // ailes : trois rangs de plumes
        for (var row = 0; row < 3; row++) {
          for (var f = 0; f < 9 - row * 2; f++) {
            var x0 = DCX + sd * (5 + f * 1.9), y0 = DCY - 10 + row * 2.1 + f * 0.32, len = 4.2 - row * 0.9 + f * 0.12;
            x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + sd * 1.5, y0 + 0.2); x.lineTo(x0 + sd * 1.1, y0 + len); x.lineTo(x0 - sd * 0.2, y0 + len - 0.6); x.closePath(); x.fill();
          }
        }
      });
      x.beginPath(); x.arc(DCX, DCY - 9, 4.2, 0, 7); x.fill();             // disque solaire
      x.strokeStyle = dk; x.lineWidth = 0.35; x.beginPath(); x.arc(DCX, DCY - 9, 3.1, 0, 7); x.stroke();
      [[-11, 7], [0, 9.5], [10, 6]].forEach(function (p) {                // pyramides
        var bx = DCX + p[0], h = p[1], by = DCY + 13;
        x.fillStyle = g; x.beginPath(); x.moveTo(bx - h * 0.95, by); x.lineTo(bx, by - h); x.lineTo(bx + h * 0.95, by); x.closePath(); x.fill();
        x.fillStyle = dk; x.beginPath(); x.moveTo(bx, by - h); x.lineTo(bx + h * 0.95, by); x.lineTo(bx + h * 0.25, by); x.closePath(); x.fill();
      });
      x.strokeStyle = g; x.lineWidth = 0.4; x.lineCap = 'round';           // le Nil
      for (var r = 0; r < 3; r++) { x.beginPath(); for (var k = 0; k <= 22; k++) { var xx = DCX - 22 + k * 2, yy = DCY + 15.5 + r * 2.2 + Math.sin(k * 1.1 + r) * 0.5; if (k) x.lineTo(xx, yy); else x.moveTo(xx, yy); } x.stroke(); }
      x.restore(); x.restore();
    }
  };

  /* Face « référence » : l’illustration occupe tout le sachet, le logo en haut, le nom en grandes capitales dorées en bas */
  function drawFrontRef(p, th, art) {
    var c = cv(100 * S, 160 * S), x = ctxS(c), R = ART;
    x.atlasStroke = th.stroke || 0;
    foil(x, th); crimps(x, th);
    x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 2.4 * S; x.shadowOffsetY = 0.8 * S;
    rr(x, R.x, R.y, R.w, R.h, R.r); x.fillStyle = '#15110C'; x.fill(); x.restore();
    x.save(); rr(x, R.x, R.y, R.w, R.h, R.r); x.clip();
    if (art) {
      var k = Math.max(R.w / art.width, R.h / art.height), aw = art.width * k, ah = art.height * k;
      x.drawImage(art, R.x + (R.w - aw) / 2, R.y + (R.h - ah) * 0.4, aw, ah);
    }
    // Impression : l’illustration prend la teinte du sachet et gagne en profondeur (les illustrations générées sont pâles)
    var real = !!(A.ED[p.cover] && A.ED[p.cover].media);                                // vraie peinture : teinte légère
    x.globalCompositeOperation = 'multiply'; x.globalAlpha = real ? 0.28 : 0.62; x.fillStyle = th.foil[1]; x.fillRect(R.x, R.y, R.w, R.h);
    x.globalCompositeOperation = 'soft-light'; x.globalAlpha = real ? 0.3 : 0.5; x.fillStyle = th.foil[0]; x.fillRect(R.x, R.y, R.w, R.h);
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    var vg = x.createRadialGradient(50, R.y + R.h * 0.5, R.w * 0.3, 50, R.y + R.h * 0.5, R.h * 0.62);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)'); x.fillStyle = vg; x.fillRect(R.x, R.y, R.w, R.h);
    var gt = x.createLinearGradient(0, R.y, 0, R.y + R.h * 0.38);                     // voile sombre en haut : le logo reste lisible
    gt.addColorStop(0, 'rgba(8,6,4,.9)'); gt.addColorStop(0.5, 'rgba(8,6,4,.55)'); gt.addColorStop(1, 'rgba(8,6,4,0)'); x.fillStyle = gt; x.fillRect(R.x, R.y, R.w, R.h * 0.38);
    var gb = x.createLinearGradient(0, R.y + R.h * 0.58, 0, R.y + R.h);               // et en bas, pour le nom
    gb.addColorStop(0, 'rgba(8,6,4,0)'); gb.addColorStop(1, 'rgba(8,6,4,.88)'); x.fillStyle = gb; x.fillRect(R.x, R.y + R.h * 0.58, R.w, R.h * 0.42);
    x.restore();
    x.lineWidth = 0.45; x.strokeStyle = gold(x, th, R.y, R.y + R.h); rr(x, R.x, R.y, R.w, R.h, R.r); x.stroke();
    // Ligne de déchirure, discrète sur l’illustration
    x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 0.3; x.setLineDash([1.1, 0.9]);
    x.beginPath(); x.moveTo(0, TY); x.lineTo(100, TY); x.stroke(); x.setLineDash([]);
    x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.moveTo(6.4, TY - 1.5); x.lineTo(9, TY); x.lineTo(6.4, TY + 1.5); x.fill();
    // Logo
    x.textBaseline = 'alphabetic';
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 1.6 * S;
    brand(x, th, 50, R.y + 25.5, 15.5);
    x.fillStyle = '#F6EEE0'; x.font = '600 3.6px ' + SANS; spaced(x, 'BOOSTER', 50, R.y + 31.5, 1.5);
    x.restore();
    // Nom du sachet : capitales dorées, sur une ligne si possible
    var name = p.name.toUpperCase(), fs = 8.8, lines;
    x.font = '600 ' + fs + 'px ' + SANS;
    while (fs > 6.6 && x.measureText(name).width > 82) { fs -= 0.2; x.font = '600 ' + fs.toFixed(1) + 'px ' + SANS; }
    lines = x.measureText(name).width > 82 ? wrap(x, name, 82) : [name];
    var lh = fs * 1.05, by = R.y + R.h - 6.5 - (lines.length - 1) * lh;
    x.save(); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 1.4 * S; x.shadowOffsetY = 0.3 * S;
    x.fillStyle = 'rgba(246,238,224,.86)'; x.font = '600 2.9px ' + SANS; spaced(x, p.kicker.toUpperCase(), 50, by - fs * 0.95 - 1.2, 0.6);
    x.font = '600 ' + fs.toFixed(1) + 'px ' + SANS; x.textAlign = 'center';
    x.fillStyle = gold(x, th, by - fs, by + (lines.length - 1) * lh);
    lines.forEach(function (l, i) { x.fillText(l, 50, by + i * lh); });
    x.restore();
    teeth(x);
    return c;
  }
  /* Sachet « référence » : l’encre (logo, motif, textes) est un marquage brillant, plus métallique et plus lisse que le film.
     On la repère en comparant la face avec le même film sans rien d’imprimé, puis on en fait la carte rugosité / métal du sachet
     (vert = rugosité, bleu = métal ; le matériau a alors un métal de 1 et la carte porte le métal propre au thème). */
  var FILM_R = 112, INK_R = 18;                    // rugosité (0–255) du film et de l’encre, sachet « référence »
  function foilMetal(th) { return Math.min(1, 0.55 + th.metal * 0.4); }
  function inkPBR(face, th) {
    var w = 400, h = 640, plain = cv(100 * S, 160 * S), px = ctxS(plain);   // assez fin pour que les bords de l’encre restent nets
    foil(px, th); crimps(px, th);
    function px8(c) { var o = cv(w, h), ox = o.getContext('2d'); ox.drawImage(c, 0, 0, w, h); return ox.getImageData(0, 0, w, h).data; }
    var A1 = px8(face), B1 = px8(plain);
    var out = cv(w, h), ox = out.getContext('2d'), img = ox.createImageData(w, h), d = img.data;
    var glow = cv(w, h), gx = glow.getContext('2d'), gimg = gx.createImageData(w, h), gd = gimg.data;   // éclat propre de l’encre
    // Film métallisé (reflets teintés par la couleur du sachet, pas de reflets blancs « plastique ») ; encre en métal poli
    var mi = 255;
    var mf = Math.round(foilMetal(th) * 255), ms = Math.round(foilMetal(th) * 0.85 * 255), ct = CRIMP_T / 160 * h, cb = h - CRIMP_B / 160 * h;
    for (var y = 0; y < h; y++) for (var xx = 0; xx < w; xx++) {
      var i = (y * w + xx) * 4, seal = y < ct || y > cb;
      var diff = Math.abs(A1[i] - B1[i]) + Math.abs(A1[i + 1] - B1[i + 1]) + Math.abs(A1[i + 2] - B1[i + 2]);
      var k = Math.max(0, Math.min(1, (diff - 40) / 90));          // part d’encre dans le pixel
      if (y > TY / 160 * h - 1.5 && y < TY / 160 * h + 1.5) k = 0;    // la ligne de déchirure n’est pas de l’encre
      var br = 0;   // pas de brossage dans les reflets : une rugosité qui change d’un pixel à l’autre fait scintiller (aspect pixelisé)
      d[i] = 0;
      d[i + 1] = Math.round((seal ? 150 : FILM_R + br) * (1 - k) + INK_R * k);   // film satiné, encre polie
      d[i + 2] = Math.round((seal ? ms : mf) * (1 - k) + mi * k);
      d[i + 3] = 255;
      gd[i] = A1[i] * k; gd[i + 1] = A1[i + 1] * k; gd[i + 2] = A1[i + 2] * k; gd[i + 3] = 255;
    }
    ox.putImageData(img, 0, 0); gx.putImageData(gimg, 0, 0);
    return { pbr: tex(out, false), glow: tex(glow, true) };
  }
  function plainPBR(th) {
    var w = 50, h = 80, c = cv(w, h), x = c.getContext('2d');
    x.fillStyle = 'rgb(0,' + FILM_R + ',' + Math.round(foilMetal(th) * 255) + ')'; x.fillRect(0, 0, w, h);   // dos : même film que la face
    x.fillStyle = 'rgb(0,150,' + Math.round(foilMetal(th) * 0.85 * 255) + ')';
    x.fillRect(0, 0, w, CRIMP_T / 160 * h); x.fillRect(0, h - CRIMP_B / 160 * h, w, CRIMP_B / 160 * h);
    return tex(c, false);
  }
  function drawFront(p, th, art) {
    if (REF && FULL_ART) return drawFrontRef(p, th, art);
    var c = cv(100 * S, 160 * S), x = ctxS(c);
    x.atlasStroke = th.stroke || 0;
    foil(x, th); crimps(x, th);
    // Ligne de déchirure pointillée + flèche
    x.strokeStyle = th.ink; x.globalAlpha = 0.3; x.lineWidth = 0.35; x.setLineDash([1.1, 0.9]);
    x.beginPath(); x.moveTo(0, TY); x.lineTo(100, TY); x.stroke(); x.setLineDash([]);
    x.fillStyle = th.ink; x.beginPath(); x.moveTo(6.4, TY - 1.5); x.lineTo(9, TY); x.lineTo(6.4, TY + 1.5); x.fill(); x.globalAlpha = 1;
    // En-tête
    x.textBaseline = 'alphabetic';
    mark(x, 50, 32.5, 9, th.gold);
    brand(x, th, 50, 46.5, 9.6);
    x.fillStyle = th.ink2; x.font = '600 3.2px ' + SANS; spaced(x, 'ÉDITION I', 50, 51.4, 0.9);
    // Fenêtre d’illustration (ou motif du Booster Atlas, sans illustration de collection)
    if (p.design && DESIGN[p.design]) { DESIGN[p.design](x, th); } else {
    x.save(); x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 3.4 * S; x.shadowOffsetY = 1.6 * S;
    rr(x, WIN.x, WIN.y, WIN.w, WIN.h, WIN.r); x.fillStyle = th.ink2; x.fill(); x.restore();
    x.save(); rr(x, WIN.x, WIN.y, WIN.w, WIN.h, WIN.r); x.clip();
    if (art) {
      var s = Math.max(WIN.w / art.width, WIN.h / art.height), aw = art.width * s, ah = art.height * s;
      x.drawImage(art, WIN.x + (WIN.w - aw) / 2, WIN.y + (WIN.h - ah) / 2, aw, ah);
    }
    var vg = x.createRadialGradient(50, WIN.y + WIN.h / 2, WIN.h * 0.3, 50, WIN.y + WIN.h / 2, WIN.w * 0.62);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.2)'); x.fillStyle = vg; x.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    x.restore();
    x.lineWidth = 0.35; x.strokeStyle = th.gold; rr(x, WIN.x, WIN.y, WIN.w, WIN.h, WIN.r); x.stroke();
    x.lineWidth = 0.3; x.strokeStyle = 'rgba(255,255,255,.6)'; rr(x, WIN.x + 1.8, WIN.y + 1.8, WIN.w - 3.6, WIN.h - 3.6, 0.8); x.stroke();
    }
    // Titre
    var y = WIN.y + WIN.h + 6.2;
    x.save(); x.shadowColor = th.halo || 'rgba(0,0,0,.45)'; x.shadowBlur = 1.2 * S; x.shadowOffsetY = 0.3 * S;      // lisibilité sur le film
    // Surtitre : réduit s’il est trop long pour tenir dans la largeur du sachet (ex. « Récompense · carte numérotée garantie »)
    var kt = p.kicker.toUpperCase(), kf = 3.5;
    x.fillStyle = th.gold; x.font = '600 ' + kf + 'px ' + SANS;
    var kw = spaced(x, kt, -1000, -1000, 0.55);
    if (kw > 80) { kf = kf * 80 / kw; x.font = '600 ' + kf.toFixed(2) + 'px ' + SANS; }
    spaced(x, kt, 50, y, 0.55 * kf / 3.5);
    x.font = '600 9.6px ' + SERIF; x.fillStyle = th.ink; x.textAlign = 'center';
    var lines = wrap(x, p.name, 76);
    y += 9.6;
    lines.forEach(function (l, i) { ink(x, l, 50, y + i * 9.4); });
    // Pied
    var colls = p.collections.length > 1 ? p.collections.length + ' collections' : A.COLL[p.collections[0]].name;
    x.font = '600 3.2px ' + SANS; x.fillStyle = th.ink2;
    var fy = 160 - 19 - 0.6, left = (p.size + ' cartes').toUpperCase(), right = colls.toUpperCase();
    x.textAlign = 'left';
    var lw = spaced(x, left, -1000, -1000, 0.56), rw = spaced(x, right, -1000, -1000, 0.56), gap = 2.4, tot = lw + rw + gap * 2 + 1.2;
    spaced(x, left, 50 - tot / 2 + lw / 2, fy, 0.56);
    spaced(x, right, 50 + tot / 2 - rw / 2, fy, 0.56);
    x.fillStyle = th.gold; x.beginPath(); x.arc(50 - tot / 2 + lw + gap + 0.6, fy - 1, 0.6, 0, 7); x.fill();
    x.restore();
    teeth(x);
    return c;
  }
  function drawBack(p, th) {
    var c = cv(100 * S, 160 * S), x = ctxS(c);
    x.atlasStroke = th.stroke || 0;
    foil(x, th); crimps(x, th);
    mark(x, 50, 36, 9, th.gold);
    brand(x, th, 50, 50, 9.6);
    // Texte
    var names = p.collections.map(function (k) { return A.COLL[k].name; }).join(' · ');
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.font = '400 4px ' + SANS; x.fillStyle = th.ink2;
    var y = 61;
    wrap(x, 'Ce sachet contient ' + p.size + ' cartes à collectionner issues de : ' + names + '.', 74).forEach(function (l) { x.fillText(l, 50, y); y += 5.8; });
    // Pastilles de rareté
    var rs = Object.keys(p.odds), dx = 5, x0 = 50 - (rs.length - 1) * dx / 2;
    y += 3;
    rs.forEach(function (r, i) {
      x.fillStyle = 'rgba(255,255,255,.3)'; x.beginPath(); x.arc(x0 + i * dx, y, 1.8, 0, 7); x.fill();
      x.fillStyle = RAR[r] || th.gold; x.beginPath(); x.arc(x0 + i * dx, y, 1.5, 0, 7); x.fill();
    });
    y += 8;
    x.font = '400 3.2px ' + SANS; x.fillStyle = th.ink2;
    wrap(x, 'Probabilités publiées et mises à jour en temps réel.' + (p.guarantee ? ' Une carte numérotée garantie.' : ''), 74).forEach(function (l) { x.fillText(l, 50, y); y += 4.6; });
    // Code-barres
    var bw = 46, bx = 50 - bw / 2, by = 160 - 19 - 16;
    x.fillStyle = th.ink; x.globalAlpha = 0.75;
    for (var k = 0; k < bw; k += 4.6) [[0, 0.4], [0.8, 1.6], [2, 2.3], [3.1, 4.2]].forEach(function (b) { if (k + b[1] <= bw) x.fillRect(bx + k + b[0], by, b[1] - b[0], 10); });
    x.globalAlpha = 1;
    x.font = '500 2.4px ' + SANS; x.fillStyle = th.ink2;
    spaced(x, 'PROTOTYPE · SANS VALEUR MARCHANDE · DUCATS NON CONVERTIBLES', 50, 160 - 19 - 0.5, 0.29);
    teeth(x, true);
    return c;
  }
  /* Rugosité (vert) et métal (bleu), partagés par tous les sachets */
  var shared = null;
  function sharedMaps() {
    if (shared) return shared;
    function pbr(win) {
      var c = cv(100 * 4, 160 * 4), x = c.getContext('2d'); x.scale(4, 4);
      x.fillStyle = 'rgb(0,80,255)'; x.fillRect(0, 0, 100, 160);              // film : lisse et métallisé
      if (!REF) for (var i = 0; i < 100; i += 0.5) {                           // brossage
        x.fillStyle = 'rgba(0,' + (60 + ((i * 37) % 11) * 6) + ',255,.6)'; x.fillRect(i, 0, 0.25, 160);
      }
      x.fillStyle = 'rgb(0,140,190)';                                          // soudures : plus mates
      x.fillRect(0, 0, 100, CRIMP_T); x.fillRect(0, 160 - CRIMP_B, 100, CRIMP_B);
      if (win) { var Wr = REF && FULL_ART ? ART : WIN; x.fillStyle = 'rgb(0,150,0)'; rr(x, Wr.x, Wr.y, Wr.w, Wr.h, Wr.r); x.fill(); }   // illustration imprimée : pas de métal
      return tex(c, false);
    }
    var b = cv(100 * 4, 160 * 4), bx = b.getContext('2d'); bx.scale(4, 4);
    bx.fillStyle = '#808080'; bx.fillRect(0, 0, 100, 160);
    [[0, CRIMP_T], [160 - CRIMP_B, CRIMP_B]].forEach(function (s) {
      if (REF) return;                                             // nervures : le relief vient du modèle (une texture de relief en plus les faisait rayer)
      for (var i = 0; i < 100; i += 1.6) {
        var g = bx.createLinearGradient(i, 0, i + 1.6, 0);
        g.addColorStop(0, '#5a5a5a'); g.addColorStop(0.35, '#d0d0d0'); g.addColorStop(0.7, '#5a5a5a'); g.addColorStop(1, '#5a5a5a');
        bx.fillStyle = g; bx.fillRect(i, s[0], 1.6, s[1]);
      }
    });
    bx.fillStyle = '#6a6a6a';
    for (var k = 0; k < 100; k += 2) bx.fillRect(k, TY - 0.18, 1.1, 0.36);   // perforation
    function alphaMap(back) {
      var a = cv(100 * 4, 160 * 4), ax = a.getContext('2d'); ax.scale(4, 4);
      ax.fillStyle = '#fff'; ax.fillRect(0, 0, 100, 160); teeth(ax, back);
      // alphaMap lit le canal vert : les dents effacées doivent être noires, pas transparentes
      ax.globalCompositeOperation = 'destination-over'; ax.fillStyle = '#000'; ax.fillRect(0, 0, 100, 160);
      return tex(a, false);
    }
    return (shared = { pbrF: pbr(true), pbrB: pbr(false), bump: tex(b, false), alpha: alphaMap(false), alphaB: alphaMap(true) });
  }
  function tex(c, srgb) {
    var t = new T.CanvasTexture(c);
    if (srgb) t.encoding = T.sRGBEncoding;
    t.anisotropy = Math.min(8, R.capabilities.getMaxAnisotropy());
    return t;
  }

  var packTex = {};
  function texturesFor(p) {
    if (packTex[p.id]) return packTex[p.id];
    var th = THEMES[p.theme] || THEMES.ivory, ed = A.ED[p.cover], ch = A.CHAR[ed.charId];
    var src = artSrc(p);
    return (packTex[p.id] = Promise.all([fonts(), loadImg(src)]).then(function (r) {
      var fc = drawFront(p, th, r[1]);
      return { front: tex(fc, true), back: tex(drawBack(p, th), true), th: th, noWin: !(REF && FULL_ART) && !!p.design,
        ink: REF ? inkPBR(fc, th) : null, inkB: REF ? plainPBR(th) : null };
    }));
  }

  /* ---------- Matériaux ---------- */
  var TEAR_V = 1 - M.info.tearFromTop / H;        // ligne de déchirure en coordonnée de texture
  /**
   * Shaders du film :
   *  – peel  : le capuchon se décolle progressivement derrière le doigt (sommets)
   *  – guide : un reflet lumineux parcourt la ligne pointillée pour inviter au geste
   */
  /* Pliages calculés dans le shader (après le morphing), normales comprises :
     coins cornés (charnière arrondie en diagonale), languettes pliées avec torsion, courbure. */
  var FOLD_HEAD = [
    'uniform vec4 uEar; uniform vec4 uEarL; uniform vec4 uTab; uniform vec2 uBow;',
    // Pli arrondi : la partie au-delà de la charnière (s > 0, direction e) tourne de th vers +z
    'void atlasBend(inout vec3 p, inout vec3 n, vec2 e, float s, float th, float h) {',
    '  if (s <= 0.0 || abs(th) < 1e-4) return;',
    '  float R = h / th, a = s <= h ? s / h * th : th;',
    '  float ds = s <= h ? R * sin(a) : R * sin(th) + (s - h) * cos(th);',
    '  float dz = s <= h ? R * (1.0 - cos(a)) : R * (1.0 - cos(th)) + (s - h) * sin(th);',
    '  float d = p.z, ca = cos(a), sa = sin(a);',
    '  p.xy += e * (ds - d * sa - s); p.z = dz + d * ca;',
    '  float ne = dot(n.xy, e), nz = n.z;',
    '  n.xy += e * (ne * ca - nz * sa - ne); n.z = ne * sa + nz * ca;',
    '}',
    'void atlasEar(inout vec3 p, inout vec3 n, float sx, float sy, float ang, float L) {',
    '  vec2 e = vec2(sx, sy) * 0.70710678;',
    '  atlasBend(p, n, e, dot(p.xy, e) - (' + (W / 2 + H / 2).toFixed(4) + ' - L) * 0.70710678, ang, 0.022);',
    '}',
    'void atlasFold(inout vec3 p, inout vec3 n) {',
    '  atlasEar(p, n, -1.0, 1.0, uEar.x, uEarL.x); atlasEar(p, n, 1.0, 1.0, uEar.y, uEarL.y);',
    '  atlasEar(p, n, -1.0, -1.0, uEar.z, uEarL.z); atlasEar(p, n, 1.0, -1.0, uEar.w, uEarL.w);',
    '  float hx = p.x / ' + (W / 2).toFixed(4) + ';',
    '  atlasBend(p, n, vec2(0.0, 1.0), p.y - ' + (H / 2 - M.info.crimpTop + 0.012).toFixed(4) + ', uTab.x + uTab.y * hx, 0.04);',
    '  atlasBend(p, n, vec2(0.0, -1.0), ' + (-H / 2 + M.info.crimpBottom - 0.012).toFixed(4) + ' - p.y, uTab.z + uTab.w * hx, 0.04);',
    '  float bx = p.x / ' + (W / 2).toFixed(4) + ', by = p.y / ' + (H / 2).toFixed(4) + ';',
    '  p.z += uBow.x * bx * bx + uBow.y * by * by;',
    '  n = normalize(n - vec3(2.0 * uBow.x * bx / ' + (W / 2).toFixed(4) + ', 2.0 * uBow.y * by / ' + (H / 2).toFixed(4) + ', 0.0) * n.z);',
    '}'
  ].join('\n');
  var FOLD_MAIN = [
    'vec3 atlasN = objectNormal;',
    'atlasFold(transformed, atlasN);',
    'vec3 atlasTN = normalMatrix * atlasN;',
    '#ifdef FLIP_SIDED',
    'atlasTN = -atlasTN;',
    '#endif',
    '#ifndef FLAT_SHADED',
    'vNormal = normalize(atlasTN);',
    '#endif',
    '#include <project_vertex>'
  ].join('\n');
  function shade(mat, U, o) {
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uTp = U.tp; sh.uniforms.uDir = U.dir; sh.uniforms.uGuide = U.guide; sh.uniforms.uGuideA = U.guideA;
      sh.uniforms.uEar = U.ear; sh.uniforms.uEarL = U.earL; sh.uniforms.uTab = U.tab; sh.uniforms.uBow = U.bow;
      sh.vertexShader = FOLD_HEAD + '\n' + sh.vertexShader.replace('#include <project_vertex>', FOLD_MAIN);
      if (o.peel) {
        sh.vertexShader = 'uniform float uTp;\nuniform float uDir;\n' + sh.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\n' +
          'float xs = uDir > 0.0 ? position.x + 0.5 : 0.5 - position.x;\n' +
          // Front de déchirure progressif : le film se décolle en douceur, puis la lèvre s’enroule derrière le doigt
          'float pb = max(0.0, uTp * 1.22 - xs);\n' +
          'float pa = clamp(pb / 0.26, 0.0, 1.0); pa = pa * pa * (3.0 - 2.0 * pa);\n' +
          'float curl = smoothstep(0.0, 0.6, pb);\n' +
          'float above = max(0.0, position.y - ' + TEAR_Y.toFixed(4) + ');\n' +
          'transformed.y += pa * 0.014 + curl * 0.01;\n' +
          'transformed.z += ' + o.peel.toFixed(1) + ' * (pa * (0.01 + above * 0.18) + curl * above * 0.12);\n');
      }
      if (o.glint) {
        // Encre dorée « marquage à chaud » : un éclat qui court sur l’encre quand le sachet tourne (reflet de deux lumières fixes)
        sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n' +
          'vec3 gvd = normalize(vViewPosition); vec3 grf = reflect(-gvd, normal);\n' +
          'float glt = pow(max(dot(grf, normalize(vec3(-0.45, 0.65, 0.6))), 0.0), 22.0) + 0.7 * pow(max(dot(grf, normalize(vec3(0.6, -0.3, 0.75))), 0.0), 30.0);\n' +
          'totalEmissiveRadiance *= 1.0 + 2.4 * glt;\n');
      }
      if (o.guide) {
        sh.fragmentShader = 'uniform float uGuide;\nuniform float uGuideA;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n' +
          'float gdv = (vUv.y - ' + TEAR_V.toFixed(4) + ') / 0.0045;\n' +
          'float gdx = (vUv.x - uGuide) / 0.08;\n' +
          'float gl = exp(-gdv * gdv) * exp(-gdx * gdx) + 0.25 * exp(-gdv * gdv * 0.08) * exp(-gdx * gdx * 0.35);\n' +
          'totalEmissiveRadiance += vec3(1.0, 0.9, 0.68) * gl * uGuideA;\n');
      }
    };
    mat.customProgramCacheKey = function () { return 'atlas2-' + (o.peel || 0) + (o.guide ? 'g' : '') + (o.glint ? 'e' : ''); };
  }
  function materials(t, part, side, U) {
    var sh = sharedMaps(), front = side === 'F';
    var out = new T.MeshPhysicalMaterial({
      map: front ? t.front : t.back,
      roughnessMap: t.ink ? (front ? t.ink.pbr : t.inkB) : front && !t.noWin ? sh.pbrF : sh.pbrB,   // motif sans fenêtre : film uniforme
      metalnessMap: t.ink ? (front ? t.ink.pbr : t.inkB) : front && !t.noWin ? sh.pbrF : sh.pbrB,
      roughness: 1, metalness: t.ink ? 1 : t.th.metal,                                                  // « référence » : encre brillante (inkPBR)
      emissive: t.ink && front ? 0xffffff : 0x000000, emissiveMap: t.ink && front ? t.ink.glow : null, emissiveIntensity: 0.4, bumpMap: sh.bump, bumpScale: 0.45, alphaTest: 0.5,
      // « référence » : presque pas de vernis (le vernis épais et l’irisé donnaient un aspect latex), film métallisé satiné
      clearcoat: t.ink ? 0.12 : 0.55, clearcoatRoughness: t.ink ? 0.38 : 0.22, iridescence: t.th.holo * (t.ink ? 0.12 : 0.5), iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520],
      envMapIntensity: t.th.env || 1.1, side: T.FrontSide
    });
    // Intérieur du film (visible sur les coins cornés, les languettes, l’ouverture) : aluminium poli, teinté par le sachet
    var inCol = new T.Color('#8E8A84').lerp(new T.Color(t.th.foil[1]), 0.4);
    var inside = new T.MeshStandardMaterial({ color: inCol, metalness: 1, roughness: 0.17, alphaMap: front ? sh.alpha : sh.alphaB, alphaTest: 0.5, side: T.BackSide, envMapIntensity: 1.35 });
    var sg = part === 'cap' ? (front ? 1 : -1) : 0;
    shade(out, U, { peel: sg, guide: front, glint: front && !!t.ink });
    shade(inside, U, { peel: sg });
    out.transparent = inside.transparent = true;      // fondu : capuchon qui s’envole, corps qui tombe
    return [out, inside];
  }

  /* ---------- Une vue = un sachet à l’écran ---------- */
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }
  function smooth(a, b, k) { var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); }

  function View(pk, p) {
    var v = this;
    v.pk = pk; v.p = p; v.dead = false; v.ready = false;
    v.rx = 0; v.ry = 0; v.rz = 0;
    v.torn0 = 0; v.drop0 = 0; v.em0 = 0; v.raf = 0;
    // Sachet de la boutique : propre. Sachet qu'on ouvre (il contient les cartes) : froissé au hasard.
    var opening = !!pk.querySelector('.pk-stack');
    var d = opening ? messy() : clean(p);
    v.direct = opening || pk.hasAttribute('data-pk-direct');   // sachet animé en continu : affichage direct
    v.infl = d.infl;
    v.U = {
      tp: { value: 0 }, dir: { value: 1 }, guide: { value: -1 }, guideA: { value: 0 },
      ear: { value: new T.Vector4().fromArray(d.ear) }, earL: { value: new T.Vector4().fromArray(d.earL) },
      tab: { value: new T.Vector4().fromArray(d.tab) }, bow: { value: new T.Vector2().fromArray(d.bow) }
    };
    // Tant que le modèle se prépare, on masque le sachet CSS (sinon il apparaît une seconde au chargement)
    pk.classList.add('is-gl-wait');
    v.waitT = setTimeout(function () { pk.classList.remove('is-gl-wait'); }, 4000);   // filet de sécurité
    texturesFor(p).then(function (t) { if (!v.dead && !lost) v.build(t); }, function () { v.fallback(); });
  }
  View.prototype.build = function (t) {
    var v = this, pk = v.pk;
    v.root = new T.Group();
    v.cap = new T.Group(); v.main = new T.Group();
    v.capPivot = new T.Group();              // pivot du capuchon : bout encore attaché de la déchirure
    v.capPivot.add(v.cap); v.root.add(v.capPivot, v.main);
    v.mats = [];
    [['cap', 'F'], ['cap', 'B'], ['main', 'F'], ['main', 'B']].forEach(function (k) {
      var m = materials(t, k[0], k[1], v.U), g = geometry()[k[0] + k[1]];
      m.forEach(function (mm, j) { v.mats.push({ m: mm, part: k[0], inside: j === 1 }); });
      var grp = k[0] === 'cap' ? v.cap : v.main;
      [m[0], m[1]].forEach(function (mm) {
        var me = new T.Mesh(g, mm);
        if (me.morphTargetInfluences) for (var i = 0; i < v.infl.length; i++) me.morphTargetInfluences[i] = v.infl[i];
        grp.add(me);
      });
    });
    v.cam = new T.PerspectiveCamera();
    v.cam.matrixAutoUpdate = false;

    // Sachet qu’on ouvre : il anime à chaque image, il prend le canevas WebGL lui-même.
    // Recopier l’image dans un canevas 2D obligeait le processeur à attendre la carte graphique
    // à chaque image (lecture de pixels synchrone), très lent sur iPhone.
    if (v.direct && !owner) {
      owner = v;
      v.canvas = R.domElement;
      v.ctx = null;
    } else {
      v.direct = false;
      v.canvas = document.createElement('canvas');
      v.ctx = v.canvas.getContext('2d');
    }
    v.canvas.className = 'pk-gl';
    v.canvas.setAttribute('aria-hidden', 'true');
    var mv = pk.querySelector('.pk-move');
    mv.appendChild(v.canvas);
    // Le trait lumineux de la déchirure passe au-dessus du film
    var tear = pk.querySelector('.pk-tear');
    if (tear) { v.tearEl = tear; mv.appendChild(tear); }
    v.resize();
    if (window.ResizeObserver) { v.ro = new ResizeObserver(function () { v.resize(); v.invalidate(); }); v.ro.observe(pk); }
    v.mo = new MutationObserver(function () { v.invalidate(); });
    v.mo.observe(pk, { attributes: true, attributeFilter: ['class', 'style', 'data-glow'] });
    v.ready = true;
    clearTimeout(v.waitT);
    pk.classList.add('is-gl'); pk.classList.remove('is-gl-wait');
    pk._gl = v; pk._glPending = null;
    if (pk._rig && pk._rig.sync) pk._rig.sync();     // reprend la pose actuelle du ressort
    v.draw(performance.now());
  };
  View.prototype.resize = function () {
    // Au moins 1,5 pixel par pixel CSS : le texte imprimé reste net même sur un petit sachet (boutique)
    var w = this.pk.offsetWidth || 160, dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2);
    this.wpx = w;
    var cw = Math.round(w * BOX.w * dpr), ch = Math.round(w * 1.6 * BOX.h * dpr);
    // Plafond de pixels (mobiles) : on réduit la définition, pas le cadrage
    var k = Math.min(1, Math.sqrt((this.direct ? 1.6e6 : 2.6e6) / (cw * ch)));   // sachet ouvert : rendu à chaque image, on allège
    cw = Math.round(cw * k); ch = Math.round(ch * k);
    if (this.direct) { this.cw = cw; this.ch = ch; if (this.canvas.width !== cw || this.canvas.height !== ch) R.setSize(cw, ch, false); }
    else if (this.canvas.width !== cw || this.canvas.height !== ch) { this.canvas.width = cw; this.canvas.height = ch; }
    // Caméra hors axe : reproduit exactement la perspective CSS du sachet
    var d = PERSP / w, cy = H / 2 - ORIGIN_Y * H, n = 0.1, f = 40;
    var x0 = -W / 2 + BOX.x * W, x1 = x0 + BOX.w * W;
    var yt = H / 2 - BOX.y * H, yb = yt - BOX.h * H;
    this.cam.projectionMatrix.makePerspective(x0 * n / d, x1 * n / d, (yt - cy) * n / d, (yb - cy) * n / d, n, f);
    this.cam.projectionMatrixInverse.copy(this.cam.projectionMatrix).invert();
    this.cam.matrixWorld.makeTranslation(0, cy, d);
    this.cam.matrixWorldInverse.copy(this.cam.matrixWorld).invert();
  };
  View.prototype.pose = function (rx, ry, rz) {
    if (rx === this.rx && ry === this.ry && rz === this.rz) return;
    this.rx = rx; this.ry = ry; this.rz = rz;
    this.invalidate();
  };
  View.prototype.invalidate = function () {
    var v = this;
    if (!v.raf && !v.dead) v.raf = requestAnimationFrame(function (now) { v.raf = 0; v.draw(now); });
  };
  View.prototype.draw = function (now) {
    var v = this, pk = v.pk;
    if (v.dead || !v.ready || lost) return;
    var cl = pk.classList, dir = cl.contains('dir-l') ? -1 : 1;
    var tp = v.tpv != null ? v.tpv : (parseFloat(pk.style.getPropertyValue('--tp')) || 0);
    var anim = false;
    v.U.tp.value = cl.contains('is-tearing') ? tp : 0;
    v.U.dir.value = dir;
    // Reflet-guide sur la ligne pointillée (classe is-guide posée par opener.js)
    if (cl.contains('is-guide') && !cl.contains('is-tearing')) {
      var gk = (now % 2800) / 2800;
      v.U.guide.value = -0.2 + gk * 1.9;
      v.U.guideA.value = 1.5 * Math.min(1, gk * 6);
      anim = true;
    } else v.U.guideA.value = 0;
    v.root.rotation.set(-v.rx * DEG, v.ry * DEG, -v.rz * DEG, 'XYZ');

    // Capuchon : pivot au bout encore attaché, il se soulève avec la déchirure puis s’envole
    var px = dir > 0 ? W / 2 : -W / 2;
    v.capPivot.position.set(px, TEAR_Y, 0); v.cap.position.set(-px, -TEAR_Y, 0);
    var capA = 1;
    if (cl.contains('is-torn')) {
      if (!v.torn0) v.torn0 = now;
      var k = Math.min(1, (now - v.torn0) / 1000), e = easeOut(k);
      v.capPivot.position.x += dir * 0.55 * e; v.capPivot.position.y += 0.02 + 1.25 * e; v.capPivot.position.z += 0.5 * e;
      v.capPivot.rotation.set(-0.2 - 2.4 * e, dir * 0.9 * e, -dir * (0.09 + 0.8 * e));
      capA = 1 - smooth(0.35, 0.85, k);
      anim = k < 1;
    } else {
      v.torn0 = 0;
      // Avant l’arrachage, seule la partie déjà déchirée bouge (shader) ; le capuchon pivote à peine
      var t = v.U.tp.value;
      v.capPivot.rotation.set(0, 0, -dir * t * 0.035);
    }
    v.cap.visible = capA > 0.01;
    // Corps : il glisse vers le bas pendant que la pile monte (les cartes sortent vraiment
    // par l’ouverture, le film cache ce qui est encore dedans), puis il tombe
    var mainA = 1, emY = 0;
    if (cl.contains('is-emerging')) {
      if (!v.em0) v.em0 = now;
      var ke = Math.min(1, (now - v.em0) / EMERGE.ms);
      emY = -EMERGE.d * ke * ke * (3 - 2 * ke);
      anim = anim || ke < 1;
    } else v.em0 = 0;
    if (cl.contains('is-dropping')) {
      if (!v.drop0) v.drop0 = now;
      // Il file vers le bas d’un coup : c’est le canevas entier qui descend (le sachet n’est jamais rogné par ses bords)
      var kd = Math.min(1, (now - v.drop0) / 480), ed = kd * kd;
      v.main.position.set(0, emY, 0);
      v.main.rotation.set(-16 * DEG * ed, 0, -4 * DEG * ed);
      v.canvas.style.transform = 'translateY(' + (ed * 2.6 * v.wpx).toFixed(1) + 'px)';
      mainA = 1 - smooth(0.5, 1, kd);
      anim = anim || kd < 1;
    } else {
      v.drop0 = 0; v.main.position.set(0, emY, 0); v.main.rotation.set(0, 0, 0);
      if (v.canvas.style.transform) v.canvas.style.transform = '';
    }
    v.main.visible = mainA > 0.01;
    // Lumière intérieure : la couleur de la meilleure carte éclaire le sachet par l’ouverture
    var glow = pk.getAttribute('data-glow'), gi = 0;
    if (glow && cl.contains('is-tearing')) gi = cl.contains('is-torn') ? 2.4 : 0.4 + v.U.tp.value * 2;
    if (glow !== v.glowC) { v.glowC = glow; v.glowCol = new T.Color(glow || '#000000'); }
    v.mats.forEach(function (o) {
      var a = o.part === 'cap' ? capA : mainA;
      o.m.opacity = a; o.m.depthWrite = a > 0.98;
      if (o.inside) { o.m.emissive.copy(v.glowCol); o.m.emissiveIntensity = gi; }
    });

    render(v);
    if (anim) v.invalidate();
  };
  /** Progression de la déchirure, sans passer par le style du sachet (évite de recalculer tout son contenu à chaque image) */
  View.prototype.setTp = function (p) {
    this.tpv = p;
    if (this.tearEl) this.tearEl.style.setProperty('--tp', p.toFixed(3));
    this.invalidate();
  };
  View.prototype.fallback = function () {
    // Retour à la version CSS (perte du contexte WebGL)
    var v = this;
    if (v.tpv != null) v.pk.style.setProperty('--tp', v.tpv.toFixed(3));
    v.destroy();
    v.pk.classList.remove('is-gl');
  };
  View.prototype.destroy = function () {
    var v = this;
    if (v.dead) return;
    v.dead = true;
    clearTimeout(v.waitT); v.pk.classList.remove('is-gl-wait');
    if (v.raf) cancelAnimationFrame(v.raf);
    if (v.ro) v.ro.disconnect();
    if (v.mo) v.mo.disconnect();
    if (v.mats) v.mats.forEach(function (o) { o.m.dispose(); });
    if (v.canvas) v.canvas.remove();
    if (owner === v) {
      owner = null;
      var c = R.domElement; c.className = ''; c.style.transform = ''; c.removeAttribute('aria-hidden');
      // les sachets restés derrière reprennent leur rendu (ils étaient en pause)
      views.forEach(function (o) { if (o !== v && o.stale) { o.stale = false; o.invalidate(); } });
    }
    if (v.tearEl) { var rot = v.pk.querySelector('.pk-rot'); if (rot) rot.appendChild(v.tearEl); }
    if (v.pk._gl === v) v.pk._gl = null;
    if (v.pk._glPending === v) v.pk._glPending = null;
    var i = views.indexOf(v); if (i >= 0) views.splice(i, 1);
  };

  function render(v) {
    if (v.direct) {
      if (R.domElement.width !== v.cw || R.domElement.height !== v.ch) R.setSize(v.cw, v.ch, false);
      R.setViewport(0, 0, v.cw, v.ch); R.setScissor(0, 0, v.cw, v.ch); R.setScissorTest(true);
      scene.add(v.root); R.render(scene, v.cam); scene.remove(v.root);
      return;
    }
    // Pendant une ouverture, le canevas WebGL est à l’écran : les autres sachets (cachés derrière) attendent
    if (owner) { v.stale = true; return; }
    var cw = v.canvas.width, ch = v.canvas.height, el = R.domElement;
    if (el.width < cw || el.height < ch) R.setSize(Math.max(el.width, cw), Math.max(el.height, ch), false);
    R.setViewport(0, 0, cw, ch); R.setScissor(0, 0, cw, ch); R.setScissorTest(true);
    scene.add(v.root);
    R.render(scene, v.cam);
    scene.remove(v.root);
    v.ctx.clearRect(0, 0, cw, ch);
    v.ctx.drawImage(el, 0, el.height - ch, cw, ch, 0, 0, cw, ch);
  }

  /* ---------- API ---------- */
  /** Remplace le rendu CSS d’un sachet par le modèle 3D (dès que ses textures sont prêtes). */
  /* Image plate de la face d’un sachet (même dessin que la 3D), pour les files de sachets légères
     (ouverture multiple). Mise en cache par sachet. */
  // Illustration du sachet : celle de son édition de couverture (plus grande pour la face « référence »)
  function artSrc(p) {
    var ed = A.ED[p.cover], ch = A.CHAR[ed.charId], full = REF && FULL_ART, R = full ? ART : WIN;
    var gen = { seed: ed.id, coll: ch.coll, rarity: ed.rarity, w: R.w * 6, h: R.h * 6 };
    return A.editionSrc ? A.editionSrc(ed, full ? 420 : 200, gen) : ed.image || A.artURI(gen);
  }
  var faceCache = {};
  P3.tearRatio = TY / 160;
  P3.crimpRatio = CRIMP_T / 160;   // hauteur de la languette du haut / hauteur du sachet
  /** Oublie les textures d’un sachet (son visuel vient de changer) : les prochaines vues les redessinent. */
  P3.forget = function (id) { delete packTex[id]; delete faceCache[id]; };
  P3.faceURL = function (p) {
    if (faceCache[p.id]) return faceCache[p.id];
    var th = THEMES[p.theme] || THEMES.ivory;
    return (faceCache[p.id] = Promise.all([fonts(), REF && FULL_ART ? loadImg(artSrc(p)) : null]).then(function (r) {
      var c = drawFront(p, th, r[1]);
      return new Promise(function (res) {
        if (c.toBlob) c.toBlob(function (b) { res(b ? URL.createObjectURL(b) : c.toDataURL()); }, 'image/png');
        else res(c.toDataURL());
      });
    }));
  };

  /* Photo du sachet 3D tel qu’il est affiché (vue directe) : image de tout le cadre .pk-gl.
     Sert aux sachets empilés derrière dans l’ouverture multiple (rendu 3D, sans coût d’animation). */
  P3.snapshot = function (pk) {
    var v = pk && pk._gl;
    if (!v || !v.direct || !v.cw || !R) return null;
    try { render(v); return R.domElement.toDataURL('image/png'); } catch (e) { return null; }
  };

  P3.attach = function (pk) {
    if (!P3.ok || lost || pk._gl || pk._glPending) return null;
    var p = A.PACK[pk.getAttribute('data-pk')];
    if (!p || !init()) return null;
    var v = new View(pk, p);
    pk._glPending = v;
    views.push(v);
    return v;
  };
  P3.detach = function (pk) {
    var v = pk._gl || pk._glPending;
    pk._glPending = null;
    if (v) v.destroy();
  };
})(window.ATLAS);
