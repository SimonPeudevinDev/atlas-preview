/* ==========================================================================
   ATLAS — Sachet de booster en 3D
   --------------------------------------------------------------------------
   Le sachet est un vrai volume construit en CSS 3D (unités cqw : 100 × 160) :

       ┌──────── soudure haute (plane, z = 0, dents de scie) ────────┐
       │╲_____________ épaule (inclinée à 30°) ___________________╱│
       │ │                                                         │ │
       │ │  biseau  │        face (z = +D)          │  biseau      │ │
       │ │          │                               │              │ │
       │╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾ épaule ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲│
       └──────── soudure basse ──────────────────────────────────────┘

   Biseaux et épaules se rejoignent en onglet : la surface est fermée.
   L’éclairage est CALCULÉ : une lumière fixe (haut-gauche), et la luminosité
   de chaque facette dépend de son orientation réelle. Le mouvement suit un
   ressort (pas d’animation CSS concurrente) → aucun scintillement.
   ========================================================================== */
(function (A) {
  'use strict';
  var U = A.ui;
  var K = A.pack = {};

  /* ---------- Géométrie ---------- */
  var ANG = 30 * Math.PI / 180;
  var G = { W: 100, H: 160, D: 3.6, b: 7.2, s: 7.2, FT: 12, FB: 9.6, TY: 22.4, e: 0.3 };
  G.pb = G.b * Math.cos(ANG); G.ps = G.s * Math.cos(ANG);
  G.cx0 = G.pb; G.cx1 = G.W - G.pb;
  G.cy0 = G.FT + G.ps; G.cy1 = G.H - G.FB - G.ps;
  K.G = G;

  function r3(x) { return Math.round(x * 1000) / 1000; }
  function pct(v) { return r3(v) + '%'; }
  function box(x, y, w, h) { return 'left:' + r3(x) + 'cqw;top:' + r3(y) + 'cqw;width:' + r3(w) + 'cqw;height:' + r3(h) + 'cqw;'; }
  function canvas(x, y, inner) { return '<div class="pc-in" style="left:' + r3(-x) + 'cqw;top:' + r3(-y) + 'cqw">' + (inner || '') + '</div>'; }
  function lights(key, side) {
    var o = '';
    if (side) o += '<i class="lt-holo" style="transform:translateX(var(--hx-' + side + ',0%))"></i>';
    o += '<i class="lt-d" style="opacity:var(--d-' + key + ',0)"></i>';
    if (side) o += '<i class="lt-sheen" style="transform:translate(var(--sx-' + side + ',0%),var(--sy-' + side + ',0%));opacity:var(--g-' + side + ',.4)"></i>';
    o += '<i class="lt-s" style="opacity:var(--s-' + key + ',0)"></i>';
    return o;
  }
  function pc(cls, x, y, w, h, tf, origin, inner, key, opt) {
    opt = opt || {};
    return '<div class="pc ' + cls + '" style="' + box(x, y, w, h) + 'transform-origin:' + origin + ';transform:' + tf + ';' + (opt.clip ? 'clip-path:' + opt.clip + ';' : '') + '">' +
      canvas(x, y, inner) + (key ? lights(key, opt.side) : '') + '</div>';
  }

  /* Ligne de déchirure irrégulière (coordonnées du sachet) */
  function tearLine() {
    var p = [], x = -2;
    while (x < 102) { p.push([x, G.TY + (Math.random() - 0.5) * 2.2]); x += 1.2 + Math.random() * 3.4; }
    p.push([102, G.TY]);
    return p;
  }
  function tearClip(line, part, x0, y0, w, h, mirror) {
    var pts = line.map(function (q) { return [mirror ? 100 - q[0] : q[0], q[1]]; });
    pts.sort(function (a, b) { return a[0] - b[0]; });
    var loc = pts.map(function (q) { return pct((q[0] - x0) / w * 100) + ' ' + pct((q[1] - y0) / h * 100); });
    if (part === 'cap') return 'polygon(0% 0%, 100% 0%, ' + loc.reverse().join(', ') + ')';
    return 'polygon(' + loc.join(', ') + ', 100% 100%, 0% 100%)';
  }

  /* Une face (avant ou arrière) : centre + biseaux (+ épaule selon la partie) */
  function side(k, face, part, line) {
    var o = '', D = G.D, e = G.e, mirror = k === 'b';
    var split = part !== 'whole' ? ' is-split' : '';
    var zt = 'translateZ(' + D + 'cqw)';
    // Centre
    var cy0 = part === 'main' ? G.TY - 1.6 : G.cy0 - e;
    var cy1 = part === 'cap' ? G.TY + 1.6 : G.cy1 + e;
    var cx = G.cx0 - e, cw = (G.cx1 - G.cx0) + 2 * e;
    o += pc('pc-c' + split, cx, cy0, cw, cy1 - cy0, zt, '50% 50%', face, k + 'c',
      { side: k, clip: part === 'whole' ? null : tearClip(line, part, cx, cy0, cw, cy1 - cy0, mirror) });
    // Biseaux (trapèzes : onglets avec les épaules)
    var by0 = part === 'main' ? G.TY : G.FT, by1 = part === 'cap' ? G.TY : G.H - G.FB, bh = by1 - by0;
    var it = part === 'main' ? 0 : (G.cy0 - by0) / bh * 100;          // retrait haut côté intérieur
    var ib = part === 'cap' ? 100 : 100 - (by1 - G.cy1) / bh * 100;     // retrait bas côté intérieur
    var clipL = 'polygon(0% 0%, 100% ' + pct(it) + ', 100% ' + pct(ib) + ', 0% 100%)';
    var clipR = 'polygon(0% ' + pct(it) + ', 100% 0%, 100% 100%, 0% ' + pct(ib) + ')';
    o += pc('pc-bev' + split, G.cx0 - G.b, by0, G.b, bh, zt + ' rotateY(-30deg)', '100% 50%', '', k + 'l', { clip: clipL });
    o += pc('pc-bev' + split, G.cx1, by0, G.b, bh, zt + ' rotateY(30deg)', '0% 50%', '', k + 'r', { clip: clipR });
    // Épaules (une seule fois : haut dans le capuchon, bas dans le corps)
    var sx0 = G.cx0 / G.W * 100, sx1 = G.cx1 / G.W * 100;
    if (part === 'cap') o += pc('pc-sh', 0, G.cy0 - G.s, G.W, G.s, zt + ' rotateX(30deg)', '50% 100%', '<div class="pf-wrinkle"></div>', k + 't',
      { clip: 'polygon(0% 0%, 100% 0%, ' + pct(sx1) + ' 100%, ' + pct(sx0) + ' 100%)' });
    if (part === 'main') o += pc('pc-sh', 0, G.cy1, G.W, G.s, zt + ' rotateX(-30deg)', '50% 0%', '<div class="pf-wrinkle"></div>', k + 'b',
      { clip: 'polygon(' + pct(sx0) + ' 0%, ' + pct(sx1) + ' 0%, 100% 100%, 0% 100%)' });
    return o;
  }

  function zig(top) {
    var n = 17, d = 1.25 / 12 * 100, p = [];
    if (top) {
      for (var i = 0; i <= n * 2; i++) p.push(pct(i / (n * 2) * 100) + ' ' + pct(i % 2 ? d : 0));
      p.push('100% 100%', '0% 100%');
    } else {
      p.push('0% 0%', '100% 0%');
      var dd = 1.25 / 9.6 * 100;
      for (var j = n * 2; j >= 0; j--) p.push(pct(j / (n * 2) * 100) + ' ' + pct(j % 2 ? 100 - dd : 100));
    }
    return 'polygon(' + p.join(', ') + ')';
  }
  function fin(top) {
    return top ? pc('pc-fin', 0, 0, G.W, G.FT, 'none', '50% 50%', '<div class="pf-crimp"></div>', 'fin', { clip: zig(true) })
               : pc('pc-fin', 0, G.H - G.FB, G.W, G.FB, 'none', '50% 50%', '<div class="pf-crimp"></div>', 'fin', { clip: zig(false) });
  }
  function core(part) {
    var y0 = part === 'cap' ? G.FT + 1 : G.TY, y1 = part === 'cap' ? G.TY : G.H - G.FB - 1;
    return '<div class="pc-core" style="' + box(G.cx0, y0, G.cx1 - G.cx0, y1 - y0) + 'transform:translateZ(1.4cqw)"></div>' +
           '<div class="pc-core" style="' + box(G.cx0, y0, G.cx1 - G.cx0, y1 - y0) + 'transform:translateZ(-1.4cqw)"></div>';
  }

  /* ---------- Illustration des faces ---------- */
  function frontFace(p) {
    var colls = p.collections.length > 1 ? p.collections.length + ' collections' : A.COLL[p.collections[0]].name;
    return '<div class="pf-perf" style="top:' + G.TY + 'cqw"><span></span></div>' +
      '<div class="pf-content">' +
        '<div class="pk-top">' + U.mark('pk-mark') + '<span class="pk-brand">ATLAS</span><span class="pk-ed">Édition I</span></div>' +
        (p.design ? '<div class="pk-window is-motif">' + U.mark('pk-motif') + '</div>'   // sachet sans illustration : le sceau en grand
          : '<div class="pk-window">' + A.editionArt(A.ED[p.cover], { ctx: 'pack' }) + '<span class="pk-wframe"></span></div>') +
        '<div class="pk-title"><span class="pk-kicker">' + p.kicker + '</span><span class="pk-name">' + p.name + '</span></div>' +
        '<div class="pk-foot"><span>' + p.size + ' cartes</span><i></i><span>' + colls + '</span></div>' +
      '</div><div class="pf-pillow"></div>';
  }
  function backFace(p) {
    var names = p.collections.map(function (c) { return A.COLL[c].name; }).join(' · ');
    var rars = Object.keys(p.odds).map(function (r) { return '<i class="r-' + r + '"></i>'; }).join('');
    return '<div class="pf-content is-back">' +
        U.mark('pk-mark') + '<span class="pk-brand">ATLAS</span>' +
        '<p class="pk-copy">Ce sachet contient <b>' + p.size + ' cartes</b> à collectionner issues de : ' + names + '.</p>' +
        '<div class="pk-rars">' + rars + '</div>' +
        '<p class="pk-copy is-small">Probabilités publiées et mises à jour en temps réel dans la boutique.' + (p.guarantee ? ' Une carte numérotée garantie.' : '') + '</p>' +
        '<div class="pk-barcode"></div>' +
        '<p class="pk-legal">Prototype · Sans valeur marchande · Éclats non convertibles</p>' +
      '</div><div class="pf-pillow"></div>';
  }

  /**
   * @param {object} p  pack (A.PACKS)
   * @param {object} o  { stack: html des cartes à l’intérieur, tilt: bool }
   */
  K.html = function (p, o) {
    o = o || {};
    var line = tearLine();
    var F = frontFace(p), B = backFace(p);
    var whole = '<div class="pk-grp pk-whole">' + side('f', F, 'whole') + '<div class="pk-grp pk-bk">' + side('b', B, 'whole') + '</div></div>';
    var main = '<div class="pk-grp pk-main">' + fin(false) + core('main') + side('f', F, 'main', line) +
      '<div class="pk-grp pk-bk">' + side('b', B, 'main', line) + '</div>' +
      '<div class="pc-mouth" style="' + box(G.cx0, G.TY - G.D, G.cx1 - G.cx0, 2 * G.D) + '"></div></div>';
    var cap = '<div class="pk-grp pk-cap">' + fin(true) + core('cap') + side('f', F, 'cap', line) +
      '<div class="pk-grp pk-bk">' + side('b', B, 'cap', line) + '</div></div>';
    return '<div class="pk t-' + p.theme + '" data-pk="' + p.id + '"' + (o.tilt ? ' data-pk-tilt' : '') + '>' +
      '<div class="pk-shadow"></div>' +
      '<div class="pk-move"><div class="pk-rot">' +
        whole + main +
        (o.stack ? '<div class="pk-stack">' + o.stack + '</div>' : '') +
        '<div class="pk-leak"></div>' +
        cap +
        '<div class="pk-tear" style="' + box(G.cx0, G.TY, G.cx1 - G.cx0, 0) + 'transform:translateZ(' + (G.D + 0.3) + 'cqw)"><i></i></div>' +
      '</div></div></div>';
  };

  /* ---------- Éclairage calculé ---------- */
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }
  var L = norm([-0.42, -0.62, 1]);            // lumière : haut-gauche, devant
  var HV = norm([L[0], L[1], L[2] + 1]);      // demi-vecteur (spéculaire)
  var C = Math.cos(ANG), S = Math.sin(ANG);
  var NORMALS = {
    fc: [0, 0, 1], fl: [-S, 0, C], fr: [S, 0, C], ft: [0, -S, C], fb: [0, S, C],
    bc: [0, 0, -1], bl: [S, 0, -C], br: [-S, 0, -C], bt: [0, -S, -C], bb: [0, S, -C],
    fin: [0, 0, 1]
  };
  K.light = function (pk, rxd, ryd) {
    var rx = rxd * Math.PI / 180, ry = ryd * Math.PI / 180;
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    var st = pk.style;
    for (var k in NORMALS) {
      var n = NORMALS[k];
      // CSS « rotateX(rx) rotateY(ry) » : RY puis RX
      var x = n[0] * cy + n[2] * sy, y = n[1], z = -n[0] * sy + n[2] * cy;
      var y2 = y * cx - z * sx, z2 = y * sx + z * cx;
      if (k === 'fin' && z2 < 0) { x = -x; y2 = -y2; z2 = -z2; }
      var dif = Math.max(0, x * L[0] + y2 * L[1] + z2 * L[2]);
      var hd = Math.max(0, x * HV[0] + y2 * HV[1] + z2 * HV[2]);
      st.setProperty('--d-' + k, (Math.max(0, 0.8 - dif) * 0.8).toFixed(3));
      st.setProperty('--s-' + k, (Math.pow(hd, 34) * 0.5).toFixed(3));
      if (k === 'fc' || k === 'bc') {
        var sd = k === 'fc' ? 'f' : 'b', m = k === 'fc' ? 1 : -1;
        st.setProperty('--sx-' + sd, ((HV[0] - x) * m * 115).toFixed(1) + '%');
        st.setProperty('--sy-' + sd, ((HV[1] - y2) * 115).toFixed(1) + '%');
        st.setProperty('--g-' + sd, (0.18 + Math.pow(hd, 8) * 0.82).toFixed(3));
        st.setProperty('--hx-' + sd, (-ryd * m * 1.25 + rxd * 0.5).toFixed(1) + '%');
      }
    }
  };

  /* ---------- Mouvement à ressort ---------- */
  K.rig = function (pk, o) {
    o = o || {};
    var mv = pk.querySelector('.pk-move'), rt = pk.querySelector('.pk-rot'), sh = pk.querySelector('.pk-shadow');
    var rest = [o.rx || 0, o.ry || 0], range = o.range || [12, 20];
    var s = { rx: rest[0], ry: rest[1], vx: 0, vy: 0, ptr: null, idle: !!o.idle, t0: performance.now(), y: 0, sc: 1, tw: null, raf: 0, dead: false, shake: null };

    function apply(now) {
      var fl = s.idle ? Math.sin((now - s.t0) / 650) * 6 : 0;
      var jx = 0, jy = 0, jr = 0;
      if (s.shake) {
        var k = (now - s.shake.t0) / s.shake.d;
        if (k >= 1) s.shake = null;
        else { var a = s.shake.a * (1 - k); jx = (Math.random() - 0.5) * a; jy = (Math.random() - 0.5) * a * 0.6; jr = (Math.random() - 0.5) * a * 0.35; }
      }
      var gl = pk._gl;
      if (gl) { gl.pose(s.rx, s.ry, jr); rt.style.transform = ''; }       // modèle 3D (pack3d.js)
      else rt.style.transform = 'rotateX(' + s.rx.toFixed(2) + 'deg) rotateY(' + s.ry.toFixed(2) + 'deg) rotateZ(' + jr.toFixed(2) + 'deg)';
      mv.style.transform = 'translate3d(' + jx.toFixed(2) + 'px,' + (s.y + fl + jy).toFixed(2) + 'px,0) scale(' + s.sc.toFixed(4) + ')';
      if (sh) {
        sh.style.transform = 'translateX(' + (-s.ry * 0.6).toFixed(1) + 'px) scale(' + ((1 - fl * 0.014) * s.sc).toFixed(3) + ')';
        sh.style.opacity = Math.max(0, s.sc * (1 - Math.abs(s.y) / 260)).toFixed(3);
      }
      if (!gl) K.light(pk, s.rx, s.ry);
    }
    function target(now) {
      if (s.ptr) return s.ptr;
      if (s.idle) { var t = (now - s.t0) / 1000; return [rest[0] + Math.sin(t * 0.8) * 4.5, rest[1] + Math.sin(t * 0.55) * 14]; }
      return rest;
    }
    function frame(now) {
      s.raf = 0;
      if (s.dead) return;
      var busy = !!s.shake;
      if (s.tw) {
        var k = Math.min(1, (now - s.tw.t0) / s.tw.d), e = 1 - Math.pow(1 - k, 3), er = 1 - Math.pow(1 - k, 4);
        s.rx = s.tw.f.rx + (rest[0] - s.tw.f.rx) * er;
        s.ry = s.tw.f.ry + (rest[1] - s.tw.f.ry) * er;
        s.y = s.tw.f.y * (1 - e);
        s.sc = s.tw.f.sc + (1 - s.tw.f.sc) * e;
        if (k >= 1) { s.tw = null; s.vx = 0; s.vy = 0; if (s.onLand) s.onLand(); }
        busy = true;
      } else {
        var tg = target(now), kk = o.stiff || 0.07, dd = o.damp || 0.8;
        s.vx = (s.vx + (tg[0] - s.rx) * kk) * dd;
        s.vy = (s.vy + (tg[1] - s.ry) * kk) * dd;
        s.rx += s.vx; s.ry += s.vy;
        busy = busy || s.idle || !!s.ptr || Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(tg[0] - s.rx) + Math.abs(tg[1] - s.ry) > 0.02;
      }
      apply(now);
      if (busy) s.raf = requestAnimationFrame(frame);
    }
    function kick() { if (!s.raf && !s.dead) s.raf = requestAnimationFrame(frame); }
    function clamp(v) { return Math.max(-0.25, Math.min(1.25, v)); }
    apply(performance.now());

    var api = {
      sync: function () { apply(performance.now()); },
      pointer: function (x, y) { x = clamp(x); y = clamp(y); s.ptr = [rest[0] + (0.5 - y) * range[0] * 2, rest[1] + (x - 0.5) * range[1] * 2]; kick(); },
      // regarder vers un point éloigné (nx, ny entre -1 et 1) : rotation douce, sans la présentation de trois-quarts
      look: function (nx, ny) { s.ptr = [-ny * 14 + 2, nx * 32]; kick(); },
      release: function () { s.ptr = null; kick(); },
      rest: function (rx, ry) { rest = [rx, ry]; kick(); },
      idle: function (b) { s.idle = b; kick(); },
      impulse: function (vx, vy) { s.vx += vx; s.vy += vy; kick(); },
      shake: function (a, d) { s.shake = { a: a, d: d || 500, t0: performance.now() }; kick(); },
      enter: function (d, onLand) {
        s.onLand = onLand;
        s.tw = { t0: performance.now(), d: d || 1150, f: { rx: rest[0] + 24, ry: rest[1] - 540, y: window.innerHeight * 0.62, sc: 0.55 } };
        s.rx = s.tw.f.rx; s.ry = s.tw.f.ry; s.y = s.tw.f.y; s.sc = s.tw.f.sc;
        apply(performance.now()); kick();
      },
      destroy: function () { s.dead = true; if (s.raf) cancelAnimationFrame(s.raf); if (A.pack3d && A.pack3d.detach) A.pack3d.detach(pk); }
    };
    pk._rig = api;
    // Vrai modèle 3D si WebGL est disponible (sinon le volume CSS reste affiché)
    if (A.pack3d && A.pack3d.ok) A.pack3d.attach(pk);
    return api;
  };

  /* Boutique : tous les sachets s’orientent vers la souris, où qu’elle soit sur la page
     (rotation continue : aucun saut quand la souris passe d’un sachet à l’autre) */
  K.bindTilt = function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var mx = 0, my = 0, raf = 0;
    function update() {
      raf = 0;
      var W = window.innerWidth, H = window.innerHeight;
      live.forEach(function (pk) {
        if (!pk.isConnected || !pk._rig || pk.hasAttribute('data-pk-still')) return;
        var b = pk.getBoundingClientRect();
        if (b.bottom < 0 || b.top > H) return;
        var cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        var nx = Math.max(-1, Math.min(1, (mx - cx) / (W * 0.35)));
        var ny = Math.max(-1, Math.min(1, (my - cy) / (H * 0.6)));
        pk._rig.look(nx, ny);
      });
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () {
      live.forEach(function (pk) { if (pk._rig) pk._rig.release(); });
    });
  };
  var live = [];
  K.mountAll = function (root) {
    // Les sachets d’un rendu précédent ne sont plus dans la page : on arrête leur ressort
    live = live.filter(function (pk) { if (pk.isConnected) return true; pk._rig.destroy(); return false; });
    [].slice.call(root.querySelectorAll('.pk[data-pk-tilt]')).forEach(function (pk) {
      if (pk._rig) return;
      var still = pk.hasAttribute('data-pk-still');   // posé de face, immobile (pile de l’ouverture multiple)
      K.rig(pk, { rx: still ? 0 : 5, ry: still ? 0 : -20, range: [12, 26], stiff: 0.06, damp: 0.82 });
      live.push(pk);
    });
  };
})(window.ATLAS);
