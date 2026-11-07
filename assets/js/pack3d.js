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
  var T = window.THREE, M = A.PACK_MODEL;
  var P3 = A.pack3d = { ok: false };
  if (!T || !M || !window.HTMLCanvasElement) return;

  /* ---------- Constantes ---------- */
  var W = M.info.W, H = M.info.H;                  // 1 × 1,6 (même repère que la maquette 100 × 160)
  var TEAR_Y = H / 2 - M.info.tearFromTop;         // hauteur de la déchirure (repère three.js)
  var CRIMP_T = M.info.crimpTop * 100, CRIMP_B = M.info.crimpBottom * 100;
  var TY = M.info.tearFromTop * 100;               // déchirure en unités maquette
  var S = 8;                                       // pixels de texture par unité maquette (800 × 1280)
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
  // Coloris du Booster Atlas (motif Astrolabe), du plus simple au plus chic.
  // motif : dégradé du dessin (clair → foncé) ; facet : face sombre de la rose ; glow : halo derrière le motif.
  var DARKBRAND = ['#1A1A1A', '#4A4A4A', '#202020', '#5A5A5A', '#1A1A1A'];
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
    'c-noir': dark('night', ['#2C2925', '#0B0A09', '#211E1B', '#050505', '#181614', '#0C0B0A'], { ink: '#F6EFE0', ink2: '#B9AE99', gold: '#E6C77F', motif: ['#FFF0C4', '#E6C77F', '#A9823F'], facet: 'rgba(0,0,0,.92)', glow: 'rgba(230,199,127,.24)', metal: 0.7 })
  });
  THEMES.prism = Object.assign({}, THEMES.night, { foil: ['#3B2F5C', '#151324', '#2A3F5E', '#0D0C17', '#3A2B4E', '#111020'], holo: 0.6, metal: 0.55 });
  THEMES.sea   = Object.assign({}, THEMES.lapis, { foil: ['#2C6A72', '#0E2E36', '#225A62', '#08222A', '#1B4C55', '#0B2830'], ink2: '#BFDCDC' });
  THEMES.deco  = Object.assign({}, THEMES.night, { foil: ['#1F4D3E', '#0B1F19', '#17402F', '#06140F', '#123528', '#08190F'], ink2: '#B9D2C4' });
  var FOIL_STOPS = [0, 0.26, 0.46, 0.70, 0.88, 1];
  var RAR = { base: '#A8997E', rare: '#5F7488', epic: '#6F5590', legendary: '#A1803F', mythic: '#7F2B35', unique: '#141210' };
  var SERIF = '"Cormorant Garamond", "Cormorant", "EB Garamond", Georgia, serif';
  var SANS = 'Inter, system-ui, "Segoe UI", Roboto, sans-serif';
  // Mise en page commune de la face avant (unités maquette) : la fenêtre ne bouge jamais
  var WIN = { x: 12, y: 54, w: 76, h: 52, r: 1.4 };

  /* ---------- Contexte WebGL partagé (créé au premier sachet) ---------- */
  var R = null, scene, env, geo, lost = false, views = [];
  var owner = null;      // sachet en cours d’ouverture : il affiche directement le canevas WebGL (aucune recopie)

  function supported() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) { return false; }
  }
  P3.ok = supported();
  if (!P3.ok) return;

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
      var amp = /^coin/.test(t.name) ? rnd(0.9, 2.2) : rnd(0.5, 1.5), ph = rnd(0, 6.283);
      infl.push(amp * Math.cos(ph), amp * Math.sin(ph));
    });
    return {
      ear: ear, earL: earL,
      tab: [rnd(-0.55, 0.55), rnd(-0.35, 0.35), rnd(-0.45, 0.45), rnd(-0.3, 0.3)],
      bow: [rnd(-0.016, 0.016), rnd(-0.032, 0.032)],
      infl: infl
    };
  }
  function clean() {
    return { ear: [0, 0, 0, 0], earL: [0.1, 0.1, 0.1, 0.1], tab: [-0.14, 0.05, -0.07, -0.03], bow: [-0.005, -0.01], infl: TG.map(function () { return 0; }) };
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
    if (th === THEMES.prism) { foilBase(x, th); var hg = x.createLinearGradient(0, 0, 100, 160);
      ['rgba(255,120,200,.22)', 'rgba(120,200,255,.22)', 'rgba(140,255,200,.18)', 'rgba(255,230,140,.22)', 'rgba(200,140,255,.22)'].forEach(function (c, i) { hg.addColorStop(i / 4, c); });
      x.fillStyle = hg; x.fillRect(0, 0, 100, 160);
      x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 0.6; for (var k = -160; k < 100; k += 3) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + 160, 160); x.stroke(); }
      return; }
    foilBase(x, th);
  }
  function foilBase(x, th) {
    // Dégradé à 158° (comme --pk-foil), sur tout le film
    var a = 158 * DEG, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(100 * dx) + Math.abs(160 * dy);
    var g = x.createLinearGradient(50 - dx * L / 2, 80 - dy * L / 2, 50 + dx * L / 2, 80 + dy * L / 2);
    th.foil.forEach(function (c, i) { g.addColorStop(FOIL_STOPS[i], c); });
    x.fillStyle = g; x.fillRect(0, 0, 100, 160);
    // Film brossé : fines stries verticales
    for (var i = 0; i < 100; i += 0.35) {
      x.fillStyle = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 > 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.025)';
      x.fillRect(i, 0, 0.18, 160);
    }
  }
  function crimps(x, th) {
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
  function teeth(x) {
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
  function star4(x, cx, cy, r, a) {                     // petite étincelle à 4 branches
    x.save(); x.translate(cx, cy); x.rotate(a || 0); x.beginPath();
    for (var i = 0; i < 8; i++) { var rr2 = i % 2 ? r * 0.22 : r, t = i * Math.PI / 4; x.lineTo(Math.cos(t) * rr2, Math.sin(t) * rr2); }
    x.closePath(); x.fill(); x.restore();
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
  var DESIGN = {
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
    // 2. Holographique : film irisé, éventail de trois cartes (Rare, Épique, Légendaire), étincelles
    holo: function (x, th) {
      var cw = 24, ch = 33.6, cols = [['#8FA9C4', '#5F7488'], ['#B49AD6', '#6F5590'], ['#F0D79A', '#A1803F']];
      [-14, 0, 14].forEach(function (a, i) {
        x.save(); x.translate(DCX + (i - 1) * 9.5, DCY + 4 + (i === 1 ? -3 : 0)); x.rotate(a * DEG);
        x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 2.4 * S; x.shadowOffsetY = 1 * S;
        rr(x, -cw / 2, -ch / 2, cw, ch, 1.4);
        var g = x.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2); g.addColorStop(0, cols[i][0]); g.addColorStop(1, cols[i][1]);
        x.fillStyle = g; x.fill(); x.shadowColor = 'transparent';
        x.lineWidth = 0.35; x.strokeStyle = 'rgba(255,255,255,.75)'; rr(x, -cw / 2 + 1.4, -ch / 2 + 1.4, cw - 2.8, ch - 2.8, 0.8); x.stroke();
        var sh = x.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2);   // reflet holographique
        sh.addColorStop(0.3, 'rgba(255,255,255,0)'); sh.addColorStop(0.48, 'rgba(255,255,255,.35)'); sh.addColorStop(0.62, 'rgba(255,255,255,0)');
        x.fillStyle = sh; rr(x, -cw / 2, -ch / 2, cw, ch, 1.4); x.fill();
        mark(x, 0, 0, 9, 'rgba(255,255,255,.85)');
        x.restore();
      });
      x.fillStyle = '#FFF6DE';
      [[18, 62, 2.4, .2], [83, 58, 3, .5], [80, 98, 1.8, .1], [21, 101, 2.2, .7], [36, 109, 1.3, .4]].forEach(function (s) { star4(x, s[0], s[1], s[2], s[3]); });
    },
    // 3. Globe : sphère quadrillée sous un ciel de constellations
    globe: function (x, th) {
      var g = gold(x, th, DCY - DR, DCY + DR);
      x.save();
      x.fillStyle = 'rgba(255,255,255,.55)';            // constellations
      var pts = [[14, 58], [22, 54], [27, 60], [20, 66], [80, 54], [86, 61], [77, 66], [88, 70], [12, 98], [19, 104], [85, 100], [80, 107]];
      x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 0.15;
      [[0, 1, 2, 3], [4, 5, 7, 6], [8, 9], [10, 11]].forEach(function (c) { x.beginPath(); c.forEach(function (k, i) { x[i ? 'lineTo' : 'moveTo'](pts[k][0], pts[k][1]); }); x.stroke(); });
      pts.forEach(function (p) { x.beginPath(); x.arc(p[0], p[1], 0.45, 0, 7); x.fill(); });
      var sp = x.createRadialGradient(DCX - 7, DCY - 8, 2, DCX, DCY, DR);   // sphère
      sp.addColorStop(0, 'rgba(255,255,255,.2)'); sp.addColorStop(1, 'rgba(0,0,0,.25)');
      x.fillStyle = sp; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.fill();
      x.save(); x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.clip();
      x.strokeStyle = g; x.lineWidth = 0.25;
      [0.18, 0.5, 0.78, 1].forEach(function (k) { x.beginPath(); x.ellipse(DCX, DCY, DR * k, DR, 0, 0, 7); x.stroke(); });
      [-0.72, -0.4, 0, 0.4, 0.72].forEach(function (k) { var yy = DCY + k * DR, w = Math.sqrt(1 - k * k) * DR; x.beginPath(); x.ellipse(DCX, yy, w, w * 0.12, 0, 0, 7); x.stroke(); });
      x.restore();
      x.lineWidth = 0.55; x.strokeStyle = g; x.beginPath(); x.arc(DCX, DCY, DR, 0, 7); x.stroke();
      x.lineWidth = 0.3; x.beginPath(); x.ellipse(DCX, DCY, DR + 5, DR * 0.32, -18 * DEG, 0, 7); x.stroke();   // anneau orbital
      x.fillStyle = g; x.beginPath(); x.arc(DCX + (DR + 5) * Math.cos(-30 * DEG) * 0.98, DCY - 9.4, 0.9, 0, 7); x.fill();
      x.restore();
    },
    // 4. Art déco : soleil de rayons dorés, cadre à redans, sceau ATLAS en médaillon
    deco: function (x, th) {
      var g = gold(x, th, WIN.y, WIN.y + WIN.h);
      x.save();
      x.save(); rr(x, WIN.x, WIN.y, WIN.w, WIN.h, 0.6); x.clip();
      x.strokeStyle = g; x.globalAlpha = 0.5;
      for (var k = 0; k < 29; k++) { var t = Math.PI + k * Math.PI / 28; x.lineWidth = k % 2 ? 0.18 : 0.42; x.beginPath(); x.moveTo(DCX, WIN.y + WIN.h + 2); x.lineTo(DCX + Math.cos(t) * 90, WIN.y + WIN.h + 2 + Math.sin(t) * 90); x.stroke(); }
      x.restore(); x.globalAlpha = 1;
      x.strokeStyle = g; x.lineWidth = 0.4;              // cadre à redans
      var X0 = WIN.x, Y0 = WIN.y, X1 = WIN.x + WIN.w, Y1 = WIN.y + WIN.h, n = 3;
      x.beginPath();
      x.moveTo(X0 + n, Y0); x.lineTo(X1 - n, Y0); x.lineTo(X1 - n, Y0 + n); x.lineTo(X1, Y0 + n); x.lineTo(X1, Y1 - n); x.lineTo(X1 - n, Y1 - n); x.lineTo(X1 - n, Y1);
      x.lineTo(X0 + n, Y1); x.lineTo(X0 + n, Y1 - n); x.lineTo(X0, Y1 - n); x.lineTo(X0, Y0 + n); x.lineTo(X0 + n, Y0 + n); x.closePath(); x.stroke();
      x.lineWidth = 0.2; rr(x, X0 + 1.6, Y0 + 1.6, WIN.w - 3.2, WIN.h - 3.2, 0.4); x.stroke();
      x.fillStyle = th.foil[3]; x.beginPath(); x.arc(DCX, DCY, 15.5, 0, 7); x.fill();   // médaillon
      x.lineWidth = 0.6; x.beginPath(); x.arc(DCX, DCY, 15.5, 0, 7); x.stroke();
      x.lineWidth = 0.22; x.beginPath(); x.arc(DCX, DCY, 13.6, 0, 7); x.stroke();
      for (var d = 0; d < 4; d++) { var a = d * Math.PI / 2 - Math.PI / 4; x.fillStyle = g; x.save(); x.translate(DCX + Math.cos(a) * 15.5, DCY + Math.sin(a) * 15.5); x.rotate(a + Math.PI / 4); x.fillRect(-1, -1, 2, 2); x.restore(); }
      mark(x, DCX, DCY, 22, th.gold);
      x.restore();
    }
  };

  function drawFront(p, th, art) {
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
    x.fillStyle = th.gold; x.font = '600 3.5px ' + SANS; spaced(x, p.kicker.toUpperCase(), 50, y, 0.55);
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
    wrap(x, 'Probabilités publiées et mises à jour en temps réel dans la boutique.' + (p.guarantee ? ' Une carte numérotée garantie.' : ''), 74).forEach(function (l) { x.fillText(l, 50, y); y += 4.6; });
    // Code-barres
    var bw = 46, bx = 50 - bw / 2, by = 160 - 19 - 16;
    x.fillStyle = th.ink; x.globalAlpha = 0.75;
    for (var k = 0; k < bw; k += 4.6) [[0, 0.4], [0.8, 1.6], [2, 2.3], [3.1, 4.2]].forEach(function (b) { if (k + b[1] <= bw) x.fillRect(bx + k + b[0], by, b[1] - b[0], 10); });
    x.globalAlpha = 1;
    x.font = '500 2.4px ' + SANS; x.fillStyle = th.ink2;
    spaced(x, 'PROTOTYPE · SANS VALEUR MARCHANDE · DUCATS NON CONVERTIBLES', 50, 160 - 19 - 0.5, 0.29);
    teeth(x);
    return c;
  }
  /* Rugosité (vert) et métal (bleu), partagés par tous les sachets */
  var shared = null;
  function sharedMaps() {
    if (shared) return shared;
    function pbr(win) {
      var c = cv(100 * 4, 160 * 4), x = c.getContext('2d'); x.scale(4, 4);
      x.fillStyle = 'rgb(0,80,255)'; x.fillRect(0, 0, 100, 160);              // film : lisse et métallisé
      for (var i = 0; i < 100; i += 0.5) {                                     // brossage
        x.fillStyle = 'rgba(0,' + (60 + ((i * 37) % 11) * 6) + ',255,.6)'; x.fillRect(i, 0, 0.25, 160);
      }
      x.fillStyle = 'rgb(0,140,190)';                                          // soudures : plus mates
      x.fillRect(0, 0, 100, CRIMP_T); x.fillRect(0, 160 - CRIMP_B, 100, CRIMP_B);
      if (win) { x.fillStyle = 'rgb(0,150,0)'; rr(x, WIN.x, WIN.y, WIN.w, WIN.h, WIN.r); x.fill(); }   // illustration imprimée : pas de métal
      return tex(c, false);
    }
    var b = cv(100 * 4, 160 * 4), bx = b.getContext('2d'); bx.scale(4, 4);
    bx.fillStyle = '#808080'; bx.fillRect(0, 0, 100, 160);
    [[0, CRIMP_T], [160 - CRIMP_B, CRIMP_B]].forEach(function (s) {
      for (var i = 0; i < 100; i += 1.6) {
        var g = bx.createLinearGradient(i, 0, i + 1.6, 0);
        g.addColorStop(0, '#5a5a5a'); g.addColorStop(0.35, '#d0d0d0'); g.addColorStop(0.7, '#5a5a5a'); g.addColorStop(1, '#5a5a5a');
        bx.fillStyle = g; bx.fillRect(i, s[0], 1.6, s[1]);
      }
    });
    bx.fillStyle = '#6a6a6a';
    for (var k = 0; k < 100; k += 2) bx.fillRect(k, TY - 0.18, 1.1, 0.36);   // perforation
    var a = cv(100 * 4, 160 * 4), ax = a.getContext('2d'); ax.scale(4, 4);
    ax.fillStyle = '#fff'; ax.fillRect(0, 0, 100, 160); teeth(ax);
    // alphaMap lit le canal vert : les dents effacées doivent être noires, pas transparentes
    ax.globalCompositeOperation = 'destination-over'; ax.fillStyle = '#000'; ax.fillRect(0, 0, 100, 160);
    return (shared = { pbrF: pbr(true), pbrB: pbr(false), bump: tex(b, false), alpha: tex(a, false) });
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
    var src = A.editionSrc ? A.editionSrc(ed, 200, { seed: ed.id, coll: ch.coll, rarity: ed.rarity, w: WIN.w * 6, h: WIN.h * 6 })
      : ed.image || A.artURI({ seed: ed.id, coll: ch.coll, rarity: ed.rarity, w: WIN.w * 6, h: WIN.h * 6 });
    return (packTex[p.id] = Promise.all([fonts(), loadImg(src)]).then(function (r) {
      return { front: tex(drawFront(p, th, r[1]), true), back: tex(drawBack(p, th), true), th: th, noWin: !!p.design };
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
      if (o.guide) {
        sh.fragmentShader = 'uniform float uGuide;\nuniform float uGuideA;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n' +
          'float gdv = (vUv.y - ' + TEAR_V.toFixed(4) + ') / 0.0045;\n' +
          'float gdx = (vUv.x - uGuide) / 0.08;\n' +
          'float gl = exp(-gdv * gdv) * exp(-gdx * gdx) + 0.25 * exp(-gdv * gdv * 0.08) * exp(-gdx * gdx * 0.35);\n' +
          'totalEmissiveRadiance += vec3(1.0, 0.9, 0.68) * gl * uGuideA;\n');
      }
    };
    mat.customProgramCacheKey = function () { return 'atlas2-' + (o.peel || 0) + (o.guide ? 'g' : ''); };
  }
  function materials(t, part, side, U) {
    var sh = sharedMaps(), front = side === 'F';
    var out = new T.MeshPhysicalMaterial({
      map: front ? t.front : t.back, roughnessMap: front && !t.noWin ? sh.pbrF : sh.pbrB, metalnessMap: front && !t.noWin ? sh.pbrF : sh.pbrB,   // motif sans fenêtre : film uniforme
      roughness: 1, metalness: t.th.metal, bumpMap: sh.bump, bumpScale: 0.45, alphaTest: 0.5,
      clearcoat: 0.55, clearcoatRoughness: 0.22, iridescence: t.th.holo * 0.5, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520],
      envMapIntensity: t.th.env || 1.1, side: T.FrontSide
    });
    // Intérieur du film (visible sur les coins cornés, les languettes, l’ouverture) : aluminium poli, teinté par le sachet
    var inCol = new T.Color('#8E8A84').lerp(new T.Color(t.th.foil[1]), 0.4);
    var inside = new T.MeshStandardMaterial({ color: inCol, metalness: 1, roughness: 0.17, alphaMap: sh.alpha, alphaTest: 0.5, side: T.BackSide, envMapIntensity: 1.35 });
    var sg = part === 'cap' ? (front ? 1 : -1) : 0;
    shade(out, U, { peel: sg, guide: front });
    shade(inside, U, { peel: sg });
    out.transparent = inside.transparent = true;      // fondu : capuchon qui s’envole, corps qui tombe
    return [out, inside];
  }

  /* ---------- Une vue = un sachet à l’écran ---------- */
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }
  function easeIn(k) { return k * k * k; }
  function smooth(a, b, k) { var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); }

  function View(pk, p) {
    var v = this;
    v.pk = pk; v.p = p; v.dead = false; v.ready = false;
    v.rx = 0; v.ry = 0; v.rz = 0;
    v.torn0 = 0; v.drop0 = 0; v.em0 = 0; v.raf = 0;
    // Sachet de la boutique : propre. Sachet qu'on ouvre (il contient les cartes) : froissé au hasard.
    var opening = !!pk.querySelector('.pk-stack');
    var d = opening ? messy() : clean();
    v.direct = opening;
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
