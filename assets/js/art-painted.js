/* ==========================================================================
   ATLAS — TEST : illustrations « paysage » en SVG (ligne de test n° 3)
   --------------------------------------------------------------------------
   Mélange des deux pistes :
   - la COMPOSITION des illustrations de référence (arbre au premier plan,
     monument sur son promontoire, collines étagées dans la brume, soleil,
     silhouette du voyageur) ;
   - les APLATS des illustrations d’origine : chaque plan = une seule teinte,
     perspective atmosphérique par la valeur (clair au loin, foncé devant),
     premiers plans en silhouettes, aucune texture.
   Composition calée sur 1536×1024, recadrée en « slice ».
   ========================================================================== */
(function (A) {
  'use strict';
  var W = 1536, H = 1024;
  function f(x) { return Math.round(x * 10) / 10; }
  function pt(p) { return f(p[0]) + ',' + f(p[1]); }

  /* ---------- Géométrie ---------- */
  function poly(pts) { return 'M' + pts.map(pt).join(' L') + ' Z'; }
  function curve(pts, closed) {
    var n = pts.length, d = 'M' + pt(pts[0]), last = closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!closed) { if (i === 0) p0 = p1; if (i + 2 >= n) p3 = p2; }
      d += ' C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + pt(p2);
    }
    return d + (closed ? ' Z' : '');
  }
  function hill(keys, bottom) {
    bottom = bottom == null ? H + 30 : bottom;
    return curve(keys) + ' L' + f(keys[keys.length - 1][0]) + ',' + bottom + ' L' + f(keys[0][0]) + ',' + bottom + ' Z';
  }
  function yOn(keys, x) {
    if (x <= keys[0][0]) return keys[0][1];
    for (var i = 0; i < keys.length - 1; i++) {
      if (x <= keys[i + 1][0]) return keys[i][1] + (keys[i + 1][1] - keys[i][1]) * (x - keys[i][0]) / (keys[i + 1][0] - keys[i][0]);
    }
    return keys[keys.length - 1][1];
  }
  function blob(r, cx, cy, rx, ry, n, j) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, k = 1 + (r() - 0.5) * j;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return curve(pts, true);
  }
  function bz(b, t) {
    var u = 1 - t;
    return [u * u * u * b[0][0] + 3 * u * u * t * b[1][0] + 3 * u * t * t * b[2][0] + t * t * t * b[3][0],
            u * u * u * b[0][1] + 3 * u * u * t * b[1][1] + 3 * u * t * t * b[2][1] + t * t * t * b[3][1]];
  }
  function bzd(b, t) {
    var u = 1 - t;
    return [3 * u * u * (b[1][0] - b[0][0]) + 6 * u * t * (b[2][0] - b[1][0]) + 3 * t * t * (b[3][0] - b[2][0]),
            3 * u * u * (b[1][1] - b[0][1]) + 6 * u * t * (b[2][1] - b[1][1]) + 3 * t * t * (b[3][1] - b[2][1])];
  }
  /* Branche / tronc effilé le long d’une Bézier cubique */
  function limb(b, w0, w1) {
    var L = [], R = [], N = 24;
    for (var i = 0; i <= N; i++) {
      var t = i / N, p = bz(b, t), d = bzd(b, t), l = Math.hypot(d[0], d[1]) || 1;
      var w = (w0 + (w1 - w0) * Math.pow(t, 0.75)) / 2;
      L.push([p[0] - d[1] / l * w, p[1] + d[0] / l * w]);
      R.unshift([p[0] + d[1] / l * w, p[1] - d[0] / l * w]);
    }
    return curve(L.concat(R), true);
  }
  function leaf(x, y, ang, L, w) {
    return '<path d="M0,0 Q' + f(L / 2) + ',' + f(-w) + ' ' + f(L) + ',0 Q' + f(L / 2) + ',' + f(w) + ' 0,0Z" transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(ang) + ')"/>';
  }
  /* Feuillage dense le long d’une branche (une seule teinte par appel) */
  function foliage(r, b, n, L, spread, t0, dy) {
    var o = '';
    for (var i = 0; i < n; i++) {
      var t = t0 + (1 - t0) * Math.sqrt(r()), p = bz(b, t), d = bzd(b, t);
      var base = Math.atan2(d[1], d[0]) * 180 / Math.PI, side = r() < 0.5 ? -1 : 1;
      o += leaf(p[0] + (r() - 0.5) * spread, p[1] + (r() - 0.5) * spread * 0.8 + (dy || 0), base + side * (25 + r() * 55),
        L * (0.7 + r() * 0.5), L * 0.2);
    }
    return o;
  }
  /* Palme : nervure + folioles retombantes (une teinte) */
  function frond(r, c, ang, len, droop) {
    var a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a);
    var tip = [c[0] + dx * len, c[1] + dy * len + droop];
    var ct = [c[0] + dx * len * 0.55, c[1] + dy * len * 0.55 - Math.abs(dx) * len * 0.12];
    function q(t) { var u = 1 - t; return [u * u * c[0] + 2 * u * t * ct[0] + t * t * tip[0], u * u * c[1] + 2 * u * t * ct[1] + t * t * tip[1]]; }
    var o = '<path d="M' + pt(c) + ' Q' + pt(ct) + ' ' + pt(tip) + '" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>';
    for (var t = 0.08; t <= 1; t += 0.03) {
      var p = q(t), p2 = q(Math.min(1, t + 0.01)), tx = p2[0] - p[0], ty = p2[1] - p[1], tl = Math.hypot(tx, ty) || 1;
      tx /= tl; ty /= tl;
      for (var s = -1; s <= 1; s += 2) {
        var ll = len * 0.3 * (1 - t * 0.6) * (0.85 + r() * 0.3), ra = s * (0.8 + r() * 0.3);
        var ex = tx * Math.cos(ra) - ty * Math.sin(ra), ey = tx * Math.sin(ra) + ty * Math.cos(ra);
        var end = [p[0] + ex * ll, p[1] + ey * ll + ll * 0.5], b = [p[0] + tx * 10, p[1] + ty * 10];
        o += '<path d="M' + pt(p) + ' Q' + pt([(p[0] + end[0]) / 2 + s * 3, (p[1] + end[1]) / 2 - 5]) + ' ' + pt(end) + ' Q' + pt([(b[0] + end[0]) / 2, (b[1] + end[1]) / 2 + 3]) + ' ' + pt(b) + 'Z"/>';
      }
    }
    return o;
  }
  /* Touffes d’herbe en silhouette, enracinées sur une ligne de sol */
  function tufts(r, ground, x0, x1, n, hmin, hmax, sw) {
    var o = '';
    for (var i = 0; i < n; i++) {
      var x = x0 + r() * (x1 - x0), y = yOn(ground, x) + 6 + r() * 30, h = hmin + r() * (hmax - hmin), bend = (r() - 0.4) * h * 0.5;
      o += '<path d="M' + pt([x, y]) + ' Q' + pt([x + bend * 0.2, y - h * 0.6]) + ' ' + pt([x + bend, y - h]) + '" stroke-width="' + f((sw || 2.2) * (0.6 + r() * 0.6)) + '"/>';
    }
    return '<g fill="none" stroke="currentColor" stroke-linecap="round">' + o + '</g>';
  }
  function cypress(x, base, h, w) {
    return '<path d="M' + f(x - w / 2) + ',' + f(base) + ' C' + f(x - w * 0.62) + ',' + f(base - h * 0.45) + ' ' + f(x - w * 0.3) + ',' + f(base - h * 0.85) + ' ' + f(x) + ',' + f(base - h) +
      ' C' + f(x + w * 0.3) + ',' + f(base - h * 0.85) + ' ' + f(x + w * 0.62) + ',' + f(base - h * 0.45) + ' ' + f(x + w / 2) + ',' + f(base) + ' Z"/>';
  }
  function birds(list, col) {
    return '<g fill="none" stroke="' + col + '" stroke-linecap="round" stroke-linejoin="round">' + list.map(function (b) {
      var x = b[0], y = b[1], s = b[2];
      return '<path stroke-width="' + f(s * 0.24) + '" d="M' + f(x - s * 2) + ',' + f(y - s * 0.5) + ' Q' + f(x - s) + ',' + f(y - s * 0.9) + ' ' + f(x) + ',' + f(y) + ' Q' + f(x + s) + ',' + f(y - s * 0.9) + ' ' + f(x + s * 2) + ',' + f(y - s * 0.4) + '"/>';
    }).join('') + '</g>';
  }
  function bat(x, y, s, col) {
    return '<path transform="translate(' + f(x) + ',' + f(y) + ') scale(' + f(s) + ')" fill="' + col + '" d="M0,0 C-6,-6 -14,-8 -26,-4 C-22,-2 -20,1 -20,4 C-16,1 -12,1 -9,4 C-7,1 -4,1 -2,3 L0,5 L2,3 C4,1 7,1 9,4 C12,1 16,1 20,4 C20,1 22,-2 26,-4 C14,-8 6,-6 0,0Z"/>';
  }
  /* Voyageur drapé, cape au vent vers la gauche */
  function wanderer(x, y, s, col) {
    return '<g transform="translate(' + f(x) + ',' + f(y) + ') scale(' + f(s) + ')" fill="' + col + '">' +
      '<path opacity=".8" d="M-2,-46 C-12,-41 -24,-36 -42,-33 C-32,-28 -36,-22 -48,-17 C-36,-13 -22,-15 -12,-18 C-10,-10 -8,-4 -6,0 L2,0 C1,-16 2,-32 -2,-46Z"/>' +
      '<circle cx="0" cy="-54" r="5.4"/><path d="M-4,-49 C-8,-40 -9,-24 -11,0 L9,0 C8,-22 7,-40 4,-49 Z"/></g>';
  }

  /* ---------- Filtres : bords organiques, zéro texture ---------- */
  function edge(id, scale, seed, freq) {
    return '<filter id="' + id + '" x="-4%" y="-4%" width="108%" height="108%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + freq + '" numOctaves="2" seed="' + seed + '" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="' + scale + '" xChannelSelector="R" yChannelSelector="G"/></filter>';
  }
  var DEFS = edge('e1', 10, 4, 0.012) + edge('e0', 3, 8, 0.03) + edge('e2', 18, 13, 0.006) +
    '<filter id="mist" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="24"/></filter>' +
    '<filter id="haze" x="-30%" y="-60%" width="160%" height="220%"><feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="9"/></filter>' +
    '<filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="55"/></filter>';

  function lg(id, stops, x2, y2) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 == null ? 0 : x2) + '" y2="' + (y2 == null ? 1 : y2) + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') + '</linearGradient>';
  }
  function skyR(id, cx, cy, stops) {
    return '<radialGradient id="' + id + '" gradientUnits="userSpaceOnUse" cx="' + cx + '" cy="' + cy + '" r="1250">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join('') + '</radialGradient>';
  }
  function frame(defs, body, tint, vig) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' + DEFS + defs +
      '<radialGradient id="vig" cx=".5" cy=".45" r=".78"><stop offset=".55" stop-color="' + tint + '" stop-opacity="0"/><stop offset="1" stop-color="' + tint + '" stop-opacity="' + (vig || 0.18) + '"/></radialGradient></defs>' +
      body + '<rect width="' + W + '" height="' + H + '" fill="url(#vig)"/></svg>';
  }
  /* calque : un groupe d’une seule teinte, filtre de bord optionnel */
  function layer(col, inner, filter, extra) {
    return '<g fill="' + col + '" color="' + col + '"' + (filter ? ' filter="url(#' + filter + ')"' : '') + (extra || '') + '>' + inner + '</g>';
  }
  function P(d) { return '<path d="' + d + '"/>'; }
  function mist(cx, cy, rx, ry, col, op) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + col + '" opacity="' + op + '" filter="url(#mist)"/>'; }
  /* nuage : aplat doux aux bords fondus */
  function cloud(r, cx, cy, w, h, col, op) {
    var o = '', n = 8;
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1), x = cx - w / 2 + t * w, rr = h * (0.4 + Math.sin(t * Math.PI) * 0.6) * (0.8 + r() * 0.35);
      o += '<circle cx="' + f(x) + '" cy="' + f(cy - Math.sin(t * Math.PI) * h * 0.3) + '" r="' + f(rr) + '"/>';
    }
    return '<g fill="' + col + '" opacity="' + op + '" filter="url(#haze)">' + o + '<rect x="' + f(cx - w / 2 - h * 0.3) + '" y="' + f(cy - h * 0.1) + '" width="' + f(w + h * 0.6) + '" height="' + f(h * 0.45) + '" rx="' + f(h * 0.22) + '"/></g>';
  }
  function sun(cx, cy, rad, core, halo, op) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(rad * 2.4) + '" fill="' + halo + '" opacity="' + op + '" filter="url(#glow)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(rad * 1.1) + '" fill="' + halo + '" opacity=".5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="' + core + '"/>';
  }

  /* ======================================================================
     OLYMPE
     ====================================================================== */
  function olympe() {
    var r = A.rng(A.hash('mix-olympe')), o = '';
    var defs = skyR('sky', 600, 240, [[0, '#FBF3E0'], [0.18, '#F3EBD8'], [0.5, '#E8E3D4'], [1, '#DCD9CC']]) +
      lg('beam', [[0, '#FFF6DE', 0.55], [1, '#FFF6DE', 0]], 0.25, 1);
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#sky)"/>';
    o += sun(600, 240, 122, '#FCF5E4', '#F9EBC8', 0.75);
    o += '<g filter="url(#mist)">' + [[560, 345, 300, 860, 470, 860], [630, 350, 560, 860, 700, 860]].map(function (p) {
      return '<path d="' + poly([[p[0], p[1]], [p[2], p[3]], [p[4], p[5]]]) + '" fill="url(#beam)" opacity=".5"/>';
    }).join('') + '</g>';
    o += cloud(r, 1350, 200, 380, 110, '#F7F2E7', 0.85) + cloud(r, 1440, 110, 220, 60, '#F9F5EC', 0.8) + cloud(r, 780, 400, 260, 36, '#F6F0E3', 0.7);
    o += birds([[985, 226, 9], [883, 266, 8], [826, 306, 5.5]], '#7D7262');

    // lointains
    o += layer('#D8D5C8', P(hill([[-60, 560], [120, 505], [230, 462], [292, 444], [340, 452], [430, 485], [560, 530], [700, 560], [900, 578]], 780)), 'e2');
    o += mist(500, 575, 640, 46, '#F2EEE3', 0.9);
    o += layer('#CCCABD', P(hill([[-60, 625], [180, 598], [380, 616], [560, 602], [720, 628], [900, 612], [1100, 630], [1600, 612]], 800)), 'e2');
    o += mist(700, 650, 760, 36, '#EFEBE0', 0.85);

    // acropole : falaise en 3 aplats (flanc ombré, face, plateau éclairé)
    var cliffKeys = [[560, 800], [610, 705], [690, 645], [775, 588], [820, 548], [900, 524], [1060, 514], [1300, 508], [1480, 510], [1536, 542], [1536, 800]];
    o += layer('#C3B89F', P(curve(cliffKeys.concat([[560, 800]]), true)), 'e1');
    o += layer('#B2A78D', P(poly([[560, 800], [640, 690], [740, 610], [800, 575], [840, 610], [800, 700], [760, 800]])) +
      P(poly([[1000, 560], [1080, 545], [1120, 610], [1060, 720], [1020, 800], [960, 800], [990, 660]])) +
      P(poly([[1380, 548], [1536, 560], [1536, 800], [1400, 800], [1430, 660]])), 'e1');
    o += layer('#D6CDB7', P(poly([[818, 550], [900, 524], [1480, 510], [1536, 542], [1536, 556], [1300, 550], [900, 564]])), 'e0');

    // temple : 2 tons (pierre éclairée / ombre intérieure)
    var tShadow = '', tLit = '', x0 = 984, x1 = 1366;
    o += layer('#ADA187', '<rect x="992" y="376" width="366" height="101"/>', 'e0');
    tLit += '<rect x="958" y="500" width="434" height="12"/><rect x="970" y="488" width="410" height="12"/><rect x="982" y="477" width="386" height="11"/>';
    for (var c = 0; c < 9; c++) tLit += '<rect x="' + f(x0 + 8 + c * (x1 - x0 - 38) / 8) + '" y="372" width="22" height="105"/>';
    tLit += '<rect x="976" y="334" width="398" height="38"/>' + P(poly([[966, 334], [1175, 268], [1384, 334]]));
    for (var c2 = 0; c2 < 9; c2++) tShadow += '<rect x="' + f(x0 + 23 + c2 * (x1 - x0 - 38) / 8) + '" y="380" width="7" height="97" opacity=".5"/>';
    tShadow += '<rect x="976" y="352" width="398" height="5" opacity=".6"/>' + P(poly([[996, 328], [1175, 282], [1354, 328]]));
    o += layer('#E6DECB', tLit, 'e0') + layer('#B7AC93', tShadow, 'e0');
    o += layer('#8E8A74', cypress(948, 524, 118, 22) + cypress(972, 526, 86, 17) + cypress(1392, 514, 140, 26) + cypress(1414, 516, 176, 29) + cypress(1452, 518, 112, 22), 'e0');
    o += mist(1150, 770, 560, 46, '#F1ECE0', 0.95) + mist(820, 745, 300, 36, '#F1ECE0', 0.8);

    // collines intermédiaires
    o += layer('#BCB8A6', P(hill([[560, 806], [760, 740], [980, 706], [1200, 696], [1400, 720], [1600, 704]])), 'e1');
    o += mist(1100, 800, 620, 30, '#EEEADF', 0.8);
    o += layer('#ADA893', P(hill([[620, 905], [820, 836], [1050, 806], [1300, 796], [1600, 776]])), 'e1');
    o += layer('#A09A83', P(hill([[760, 1005], [980, 936], [1200, 900], [1400, 886], [1600, 876]])), 'e1');

    // premier plan : colline + olivier en silhouettes
    var FG = [[-60, 700], [80, 688], [240, 700], [420, 742], [620, 802], [820, 882], [1000, 952], [1200, 1012], [1320, 1040]];
    o += layer('#9A8E73', P(hill(FG)), 'e1');
    o += '<path d="' + curve([[-60, 704], [80, 693], [240, 705], [420, 747], [620, 807], [820, 887]]) + '" fill="none" stroke="#ADA185" stroke-width="12" stroke-linecap="round" filter="url(#e1)"/>';
    o += layer('#877C63', tufts(r, FG, 140, 820, 60, 18, 60), null);
    o += wanderer(364, 736, 1.32, '#4F4638');

    var trunk = [[-30, 1000], [40, 860], [0, 620], [42, 420]];
    var B = [
      [[30, 440], [160, 340], [360, 280], [545, 238]],
      [[45, 420], [110, 300], [160, 180], [230, 40]],
      [[120, 360], [220, 230], [320, 130], [430, 60]],
      [[25, 400], [0, 260], [40, 140], [10, 0]],
      [[200, 320], [300, 360], [420, 380], [520, 370]],
      [[250, 300], [330, 250], [420, 200], [520, 150]],
      [[60, 560], [120, 510], [180, 490], [250, 500]]
    ];
    var wood = P(limb(trunk, 110, 44)) + P(limb([[30, 760], [70, 740], [110, 732], [150, 744]], 26, 4)) + P(limb([[40, 780], [70, 800], [90, 830], [100, 870]], 22, 4));
    var dark = '', lit = '';
    B.forEach(function (b, i) {
      wood += P(limb(b, [34, 22, 16, 20, 9, 10, 12][i], 3));
      dark += foliage(r, b, [240, 170, 170, 120, 90, 130, 60][i], 38, 95, 0.2, 0);
      lit += foliage(r, b, [90, 60, 60, 40, 30, 50, 20][i], 34, 80, 0.35, -14);
    });
    o += layer('#6F6553', wood, 'e0');
    o += layer('#7E7560', dark, 'e0');
    o += layer('#A0977C', lit, 'e0');
    // rochers
    o += layer('#B4AA94', P(blob(r, 150, 955, 205, 118, 9, 0.22)) + P(blob(r, 420, 1012, 125, 60, 8, 0.25)), 'e1');
    o += layer('#C7BEA9', P(blob(r, 130, 905, 150, 46, 8, 0.25)) + P(blob(r, 400, 984, 80, 20, 7, 0.25)), 'e1');
    o += layer('#7F7560', tufts(r, [[0, 905], [1536, 905]], 250, 620, 18, 40, 100), null);
    return frame(defs, o, '#4A3D2C');
  }

  /* ======================================================================
     RIVES DU NIL
     ====================================================================== */
  function nil() {
    var r = A.rng(A.hash('mix-nil')), o = '';
    var defs = skyR('sky', 594, 216, [[0, '#FDF4DF'], [0.18, '#F7E8CB'], [0.5, '#EFDCB8'], [1, '#E7CFA6']]) +
      lg('river', [[0, '#E3CBA0'], [0.3, '#EAD6B1'], [1, '#DFC59A']]);
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#sky)"/>';
    o += sun(594, 216, 124, '#FFF8E8', '#FBE6BC', 0.85);
    o += cloud(r, 1360, 230, 400, 110, '#FBF1DD', 0.85) + cloud(r, 1430, 120, 240, 60, '#FCF4E4', 0.8) + cloud(r, 340, 425, 280, 40, '#FAEFD9', 0.7) + cloud(r, 1060, 450, 320, 34, '#F9EDD6', 0.65);
    o += birds([[960, 200, 9], [874, 242, 8], [818, 276, 5.5]], '#86704F');

    o += layer('#E6D1AA', P(hill([[-60, 522], [160, 484], [380, 494], [560, 480], [720, 500], [900, 472], [1080, 454], [1230, 472], [1380, 457], [1600, 482]], 720)), 'e2');
    o += mist(900, 545, 700, 36, '#F8ECD4', 0.85);
    // pyramides : face éclairée / face à l’ombre
    o += layer('#EBD8B2', P(poly([[1150, 584], [1225, 464], [1262, 584]])), 'e0') + layer('#D9C196', P(poly([[1225, 464], [1380, 584], [1262, 584]])), 'e0');
    o += layer('#ECD7AC', P(poly([[680, 588], [800, 355], [880, 588]])), 'e0') + layer('#D3B584', P(poly([[800, 355], [1200, 588], [880, 588]])), 'e0');
    o += layer('#C9AB79', '<path d="M800,355 L880,588" stroke="#C9AB79" stroke-width="3" fill="none"/>', 'e0');
    o += mist(900, 610, 560, 22, '#F7EAD0', 0.6);
    o += layer('#E3CB9F', P(hill([[560, 640], [700, 602], [880, 612], [1050, 592], [1250, 602], [1400, 588], [1600, 602]], 790)), 'e2');
    o += layer('#D9BE8E', P(hill([[560, 692], [740, 652], [960, 664], [1150, 642], [1350, 654], [1600, 642]], 790)), 'e2');
    o += mist(1000, 672, 600, 22, '#F5E6CA', 0.6);
    // plateau + obélisque
    o += layer('#CFAF7C', P(curve([[300, 770], [340, 692], [400, 642], [450, 620], [640, 614], [700, 642], [760, 702], [800, 770]], true)), 'e1');
    o += layer('#DCC195', P(poly([[400, 642], [450, 620], [640, 614], [690, 636], [600, 640], [470, 646]])), 'e0');
    o += layer('#E5CDA2', P(poly([[436, 622], [536, 622], [532, 600], [440, 600]])) + P(poly([[456, 600], [486, 600], [486, 412], [465, 412]])) + P(poly([[465, 412], [486, 386], [486, 412]])), 'e0');
    o += layer('#C3A26E', P(poly([[486, 600], [516, 600], [507, 412], [486, 412]])) + P(poly([[486, 386], [507, 412], [486, 412]])), 'e0');
    // rive lointaine
    var bush = P(hill([[600, 792], [700, 774], [900, 770], [1100, 764], [1300, 768], [1600, 762]], 800));
    for (var b = 0; b < 24; b++) bush += P(blob(r, 640 + r() * 900, 764 + r() * 12, 20 + r() * 30, 9 + r() * 12, 8, 0.4));
    o += layer('#B39566', bush, 'e1');
    // fleuve
    o += '<rect x="0" y="784" width="' + W + '" height="' + (H - 784) + '" fill="url(#river)"/>';
    var refl = '';
    for (var l = 0; l < 22; l++) {
      var ly = 790 + l * 10, w = (190 - l * 6) * (0.7 + r() * 0.5);
      refl += '<rect x="' + f(520 - w / 2 + (r() - 0.5) * 30) + '" y="' + f(ly) + '" width="' + f(w) + '" height="4" rx="2" opacity="' + f(1 - l * 0.04) + '"/>';
    }
    var rip = '';
    for (var rl = 0; rl < 12; rl++) rip += '<rect x="' + f(700 + r() * 800) + '" y="' + f(800 + r() * 200) + '" width="' + f(50 + r() * 110) + '" height="2.5" rx="1.2"/>';
    o += layer('#FCF2DC', refl, 'e0') + layer('#F3E4C6', rip, null, ' opacity=".8"');
    // felouque
    o += layer('#F6EBD3', P(poly([[1222, 692], [1292, 806], [1240, 806]])), 'e0') + layer('#E2CDA6', P(poly([[1222, 692], [1240, 806], [1214, 806]])), 'e0');
    o += layer('#6E5638', '<path d="M1222,690 L1220,812 M1202,694 L1300,812" stroke="#6E5638" stroke-width="2.4" fill="none"/>' +
      P('M1166,812 Q1230,830 1300,808 L1292,820 Q1230,838 1176,822 Z') + '<circle cx="1256" cy="800" r="5"/><path d="M1250,814 L1252,804 L1262,804 L1262,814Z"/>', 'e0');
    o += layer('#CDB083', '<rect x="1180" y="832" width="110" height="5" rx="2"/><rect x="1196" y="846" width="80" height="4" rx="2"/><rect x="1210" y="858" width="50" height="3" rx="1.5"/>', null, ' opacity=".7"');

    // berge, palmiers, roseaux en silhouettes
    var LB = [[-60, 800], [150, 790], [330, 822], [470, 870], [560, 950], [620, 1040]];
    o += layer('#B08E5C', P(hill(LB)), 'e1');
    o += layer('#94764A', tufts(r, LB, 150, 470, 46, 60, 170, 3), null);
    var palm = P(limb([[100, 1030], [150, 820], [140, 620], [160, 440]], 40, 18));
    [[-160, 150, 60], [-120, 170, 90], [-60, 150, 40], [-20, 140, 70], [20, 160, 100], [-95, 120, 20]].forEach(function (fr) { palm += frond(r, [160, 442], fr[0], fr[1], fr[2]); });
    var tr1 = [[30, 1040], [110, 780], [170, 450], [232, 198]];
    palm += P(limb(tr1, 66, 28));
    [[-175, 260, 120], [-150, 250, 160], [-120, 230, 130], [-95, 200, 40], [-70, 220, 60], [-40, 260, 110], [-10, 270, 170], [20, 240, 190], [-200, 220, 200], [45, 200, 210]].forEach(function (fr) { palm += frond(r, [232, 196], fr[0], fr[1], fr[2]); });
    o += layer('#86693F', palm, 'e0');
    var rings = '';
    for (var p1 = 2; p1 < 32; p1 += 2) { var tp = bz(tr1, p1 / 34); rings += '<path d="M' + f(tp[0] - 20) + ',' + f(tp[1]) + ' q20,7 40,0"/>'; }
    o += '<g fill="none" stroke="#9E7F50" stroke-width="3" opacity=".7">' + rings + '</g>';
    o += layer('#C9AE82', P(blob(r, 130, 962, 230, 110, 9, 0.22)) + P(blob(r, 560, 1012, 150, 50, 8, 0.25)), 'e1');
    o += layer('#D9C29A', P(blob(r, 110, 912, 175, 44, 8, 0.25)) + P(blob(r, 540, 992, 100, 18, 7, 0.25)), 'e1');
    return frame(defs, o, '#5A4020');
  }

  /* ======================================================================
     NUITS GOTHIQUES
     ====================================================================== */
  function gothique() {
    var r = A.rng(A.hash('mix-gothique')), o = '';
    var defs = skyR('sky', 1045, 200, [[0, '#F4F0E6'], [0.16, '#E6E1D6'], [0.5, '#DAD4C8'], [1, '#CEC7BA']]);
    o += '<rect width="' + W + '" height="' + H + '" fill="url(#sky)"/>';
    o += sun(1045, 200, 140, '#F4EFE3', '#EEE8DA', 0.8);
    o += layer('#E9E3D5', P(blob(r, 1005, 168, 38, 26, 7, 0.35)) + P(blob(r, 1085, 245, 48, 24, 7, 0.35)) + P(blob(r, 1090, 140, 24, 18, 7, 0.35)), 'e1', ' opacity=".8"');
    o += cloud(r, 1380, 240, 380, 120, '#EDE9E0', 0.85) + cloud(r, 1440, 120, 230, 70, '#F0ECE4', 0.8) + cloud(r, 860, 410, 260, 40, '#ECE8DF', 0.7);
    o += bat(855, 228, 2.2, '#4E473E') + bat(765, 276, 1.2, '#5C554B');

    o += layer('#C6C0B4', P(hill([[-60, 562], [150, 522], [300, 540], [420, 500], [520, 516], [640, 542], [800, 562], [1000, 582]], 760)), 'e2');
    o += layer('#B8B2A5', P(hill([[-60, 604], [200, 584], [460, 598], [700, 588], [1000, 604], [1600, 594]], 780)), 'e2');
    o += mist(600, 610, 720, 44, '#ECE8DF', 0.9);

    // éperon + château (aplat moyen), face éclairée de la falaise
    o += layer('#8E877B', P(curve([[660, 790], [720, 692], [790, 632], [860, 572], [920, 522], [980, 480], [1180, 472], [1290, 480], [1330, 522], [1380, 602], [1500, 702], [1600, 722], [1600, 800], [660, 800]], true)), 'e1');
    o += layer('#9D968A', P(poly([[860, 572], [920, 522], [980, 480], [1060, 478], [1000, 560], [930, 660], [880, 760], [760, 760]])), 'e1');
    var base = 474, c = '';
    function tower(x, top, w, sp) { return P(poly([[x - w / 2, base + 4], [x - w / 2, top], [x + w / 2, top], [x + w / 2, base + 4]])) + P(poly([[x - w / 2 - 3, top + 2], [x, top - sp], [x + w / 2 + 3, top + 2]])); }
    c += P(poly([[950, 478], [950, 380], [985, 360], [1020, 380], [1060, 330], [1110, 330], [1160, 370], [1200, 380], [1240, 400], [1250, 478]]));
    c += tower(968, 370, 28, 66) + tower(1004, 318, 22, 74) + tower(1032, 270, 26, 90) + tower(1140, 260, 30, 96) + tower(1176, 330, 22, 62) + tower(1214, 380, 34, 50) + tower(940, 420, 18, 44);
    c += P(poly([[1058, 478], [1058, 210], [1102, 210], [1102, 478]])) + P(poly([[1052, 214], [1080, 92], [1108, 214]])) + '<rect x="1100" y="300" width="50" height="170"/>';
    c += '<rect x="1180" y="452" width="200" height="18"/>';
    for (var a = 0; a < 4; a++) { var ax = 1196 + a * 46; c += P('M' + ax + ',470 L' + ax + ',572 L' + (ax + 10) + ',572 L' + (ax + 10) + ',500 Q' + (ax + 28) + ',478 ' + (ax + 46) + ',500 L' + (ax + 46) + ',572 L' + (ax + 56) + ',572 L' + (ax + 56) + ',470Z'); }
    c += tower(1370, 420, 24, 64) + tower(1405, 470, 14, 40);
    o += layer('#938C80', c, 'e0');
    o += layer('#A59E92', P(poly([[1080, 92], [1108, 214], [1084, 214]])) + P(poly([[1140, 164], [1158, 262], [1143, 262]])) + P(poly([[1032, 180], [1048, 272], [1035, 272]])), 'e0');
    var wins = '<path d="M1112,420 L1112,340 Q1125,316 1138,340 L1138,420Z"/>';
    for (var wn = 0; wn < 12; wn++) wins += '<rect x="' + f(962 + r() * 260) + '" y="' + f(385 + r() * 75) + '" width="5" height="10" rx="2.5"/>';
    o += layer('#E8E0CB', wins, null, ' opacity=".85"');
    o += layer('#6E685E', cypress(860, 578, 70, 12) + cypress(882, 568, 52, 10) + cypress(1060, 488, 40, 9) + cypress(1240, 490, 36, 8) + cypress(800, 642, 40, 9) + cypress(1440, 702, 46, 10) + cypress(1470, 714, 34, 8), 'e0');
    o += mist(1000, 548, 300, 26, '#EEEAE1', 0.6) + mist(1260, 598, 260, 26, '#EEEAE1', 0.6) + mist(800, 680, 380, 34, '#ECE8DF', 0.75);

    o += layer('#ABA59A', P(hill([[560, 792], [760, 732], [980, 702], [1220, 692], [1420, 718], [1600, 702]])), 'e1');
    o += mist(1100, 798, 580, 28, '#E9E5DC', 0.75);
    o += layer('#9C968A', P(hill([[700, 882], [920, 832], [1120, 802], [1350, 812], [1600, 792]])), 'e1');
    o += layer('#8D877B', P(hill([[700, 1002], [900, 932], [1150, 902], [1400, 902], [1600, 882]])) + cypress(1166, 932, 50, 11) + cypress(1186, 936, 36, 9), 'e1');
    o += mist(1200, 925, 520, 26, '#E6E2D9', 0.45);

    // premier plan : pente sombre, ruine, arbre nu
    var GF = [[-60, 640], [120, 640], [300, 680], [470, 740], [640, 820], [800, 900], [950, 980], [1080, 1040]];
    o += layer('#6E675D', P(hill(GF)), 'e1');
    o += '<path d="' + curve([[-60, 645], [120, 645], [300, 685], [470, 745], [640, 825]]) + '" fill="none" stroke="#7E776C" stroke-width="10" stroke-linecap="round" filter="url(#e1)"/>';
    o += layer('#5E584F', tufts(r, GF, 170, 780, 55, 18, 60), null);
    o += layer('#A58F5E', tufts(r, GF, 200, 700, 22, 20, 55, 1.6), null, ' opacity=".8"');
    o += wanderer(432, 750, 1.38, '#38332C');
    var wall = 'M30,720 L30,140 L52,140 L52,108 L78,108 L78,150 L120,150 L120,96 L150,96 L150,130 L196,130 L196,170 L228,170 L232,250 L246,262 L246,720 Z';
    var win = 'M84,640 L84,300 Q84,212 138,168 Q192,212 192,300 L192,640 Z';
    o += layer('#8C8577', '<path d="' + wall + ' ' + win + '" fill-rule="evenodd"/>', 'e0');
    o += layer('#9B9487', P('M200,170 L228,170 L232,250 L246,262 L246,720 L210,720 L212,300 Q205,230 200,170Z'), 'e0');
    o += layer('#8C8577', '<g fill="none" stroke="#8C8577" stroke-width="9"><path d="M138,300 V640"/><path d="M90,380 Q90,316 114,300 Q138,316 138,380 M138,380 Q138,316 162,300 Q186,316 186,380"/><circle cx="138" cy="244" r="34"/><circle cx="138" cy="224" r="13"/><circle cx="118" cy="244" r="13"/><circle cx="158" cy="244" r="13"/><circle cx="138" cy="264" r="13"/></g>', 'e0');
    var ivy = '', ivyLit = '';
    [[[250, 720], [270, 600], [240, 470], [260, 360]], [[250, 520], [220, 430], [200, 330], [215, 250]], [[60, 720], [40, 600], [70, 480], [50, 380]], [[200, 300], [210, 240], [190, 200], [205, 150]]].forEach(function (v) {
      ivy += '<path d="M' + pt(v[0]) + ' C' + pt(v[1]) + ' ' + pt(v[2]) + ' ' + pt(v[3]) + '" stroke="#5E5B48" stroke-width="2.5" fill="none"/>';
      for (var k = 0; k < 24; k++) {
        var p = bz(v, r()), sz = 7 + r() * 6;
        var lf = '<path transform="translate(' + f(p[0] + (r() - 0.5) * 20) + ',' + f(p[1] + (r() - 0.5) * 14) + ') rotate(' + f(r() * 360) + ') scale(' + f(sz / 10) + ')" d="M0,-10 L4,-3 L10,-2 L5,3 L6,10 L0,6 L-6,10 L-5,3 L-10,-2 L-4,-3Z"/>';
        if (k % 4 === 0) ivyLit += lf; else ivy += lf;
      }
    });
    o += layer('#5E5B48', ivy, 'e0') + layer('#A38D5A', ivyLit, 'e0');
    var Bt = [
      [[-30, 360], [120, 300], [380, 210], [720, 120]], [[130, 300], [190, 200], [230, 110], [280, 20]],
      [[300, 236], [360, 150], [430, 90], [520, 40]], [[420, 196], [480, 220], [560, 206], [640, 226]],
      [[520, 160], [580, 110], [620, 80], [700, 56]], [[230, 268], [260, 300], [320, 300], [360, 320]],
      [[60, 0], [70, 120], [40, 220], [10, 300]], [[620, 130], [660, 150], [690, 170], [720, 200]]
    ];
    var tw = '', gold = '';
    Bt.forEach(function (b, i) {
      tw += P(limb(b, [40, 14, 12, 7, 6, 6, 26, 4][i], 2));
      gold += foliage(r, b, [16, 6, 8, 6, 6, 4, 0, 5][i], 22, 30, 0.5, 0);
    });
    var twig = '';
    for (var tt = 0; tt < 26; tt++) {
      var bi = Bt[Math.floor(r() * 6)], tp2 = bz(bi, 0.3 + r() * 0.7), ang = (-90 + (r() - 0.5) * 140) * Math.PI / 180, ln = 30 + r() * 60;
      var end = [tp2[0] + Math.cos(ang) * ln, tp2[1] + Math.sin(ang) * ln];
      twig += '<path d="M' + pt(tp2) + ' Q' + pt([(tp2[0] + end[0]) / 2 + (r() - 0.5) * 20, (tp2[1] + end[1]) / 2]) + ' ' + pt(end) + '" stroke-width="' + f(1.4 + r() * 2) + '"/>';
      if (r() < 0.5) gold += leaf(end[0], end[1], r() * 360, 16, 4);
    }
    o += layer('#5F574C', tw + '<g fill="none" stroke="#5F574C" stroke-linecap="round">' + twig + '</g>', 'e0');
    o += layer('#A68F5C', gold, 'e0');
    o += layer('#7A7368', P(blob(r, 120, 955, 220, 118, 9, 0.22)) + P(blob(r, 420, 1012, 130, 50, 8, 0.25)), 'e1');
    o += layer('#8A8377', P(blob(r, 110, 905, 165, 44, 8, 0.25)), 'e1');
    o += layer('#5A544B', tufts(r, [[0, 905], [1536, 905]], 270, 600, 16, 40, 100), null);
    return frame(defs, o, '#2E2A24', 0.22);
  }

  var SCENES = { grece: olympe, egypte: nil, gothique: gothique };
  var cache = {};
  A.paintedArt = function (coll) {
    if (!SCENES[coll]) return '';
    if (!cache[coll]) cache[coll] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SCENES[coll]());
    return '<img class="art" alt="" draggable="false" decoding="async" src="' + cache[coll] + '">';
  };
})(window.ATLAS);
