/* ==========================================================================
   ATLAS — Illustrations provisoires génératives
   --------------------------------------------------------------------------
   En attendant les œuvres définitives, chaque édition reçoit un paysage
   « aquarelle » généré en SVG (motif de collection + ambiance de rareté).
   Ce sont des EMPLACEMENTS REMPLAÇABLES : dès qu’une édition possède un
   champ `image`, l’illustration réelle est affichée à la place.
   ========================================================================== */
(function (A) {
  'use strict';
  var n = 0;
  function f(x) { return Math.round(x * 10) / 10; }

  /* Ambiances lumineuses par rareté */
  var MOODS = {
    base:      { sky0: '#F4EEE2', sky1: '#E6DBC7', sun: '#FBF1DC', far: '#D6C9B1', mid: '#BBAA8D', near: '#9E8D70', fig: '#5A4F40', vig: 0.16 },
    rare:      { sky0: '#E8EBEC', sky1: '#C8D1D8', sun: '#F6F4EC', far: '#AEBAC5', mid: '#8596A6', near: '#5D6F80', fig: '#2E3A46', vig: 0.2 },
    epic:      { sky0: '#EEE6EE', sky1: '#C9B7D2', sun: '#F7E7DE', far: '#A893B5', mid: '#7E6793', near: '#56436E', fig: '#2B213D', vig: 0.22 },
    legendary: { sky0: '#F6E9CD', sky1: '#E1C28B', sun: '#FFF5DC', far: '#CBA66A', mid: '#A5804A', near: '#785A32', fig: '#3A2B16', vig: 0.22, line: '#B8955A' },
    mythic:    { sky0: '#F1DDD2', sky1: '#C6857A', sun: '#FAE6CF', far: '#A65E58', mid: '#7E2D36', near: '#561C24', fig: '#2A0C10', vig: 0.26, line: '#C9A45C' },
    unique:    { sky0: '#22201B', sky1: '#0F0D0B', sun: '#C9A45C', far: '#2D271F', mid: '#1F1B16', near: '#141210', fig: '#C9A45C', vig: 0.35, line: '#C9A45C', dark: true }
  };
  /* Teintes propres à chaque collection pour l’édition Base */
  var BASE_TINT = {
    grece:    { sky1: '#DCDCD2', far: '#C9CBC0', mid: '#B5AC94' },
    egypte:   { sky0: '#F7EBD3', sky1: '#EBCF9F', far: '#E0C08C', mid: '#C9A26A', near: '#A9844F' },
    gothique: { sky0: '#ECE8E0', sky1: '#CFC8BD', far: '#B9B1A4', mid: '#8F877B', near: '#6E675D', fig: '#3C3832' },
    contes:   { sky1: '#DCDDC7', far: '#C3C6A8', mid: '#A2A785', near: '#7F8766' },
    histoire: { sky0: '#F2ECE3', sky1: '#DCD0BE' },
    nordique: { sky0: '#EEF1F0', sky1: '#CFD9DA', far: '#B3C1C4', mid: '#8D9EA3', near: '#6B7D82', fig: '#34404A' },
    titans:   { sky0: '#F1EDE6', sky1: '#D8D0C3', far: '#BFB5A5', mid: '#8F8473', near: '#6E6455', fig: '#3A342C' },
    geants:   { sky0: '#F3E9DF', sky1: '#DDC6B4', far: '#C2A592', mid: '#8E6E5D', near: '#6A4F42', fig: '#33241E' },
    heros:    { sky0: '#EEF0EC', sky1: '#CCD6D6', far: '#AFBDBF', mid: '#7F8E8F', near: '#5E6C6E', fig: '#2E3638' },
    monstres: { sky0: '#ECE9E3', sky1: '#C9C3B6', far: '#ABA393', mid: '#7A7263', near: '#585244', fig: '#1E1B16' },
    planetes: { sky0: '#E6E8EE', sky1: '#B9BED0', far: '#9AA0B5', mid: '#6E7590', near: '#4E5468', fig: '#22252F' },
    lunes:    { sky0: '#E9E9E9', sky1: '#C4C6CA', far: '#A6A8AD', mid: '#85878C', near: '#626469', fig: '#2A2B2E' },
    pharaons: { sky0: '#F6ECDA', sky1: '#E5CDA2', far: '#D2B07D', mid: '#B08A55', near: '#8C6A3C', fig: '#3A2A16' }
  };

  function moodFor(coll, rarity) {
    var m = Object.assign({}, MOODS[rarity] || MOODS.base);
    if (rarity === 'base' && BASE_TINT[coll]) Object.assign(m, BASE_TINT[coll]);
    return m;
  }

  function ridge(r, x0, x1, y, amp, step) {
    var pts = [];
    for (var x = x0; x <= x1 + step; x += step) pts.push([x, y + (r() - 0.5) * 2 * amp]);
    return pts;
  }
  function smooth(pts, bottom) {
    var d = 'M' + f(pts[0][0]) + ',' + bottom + ' L' + f(pts[0][0]) + ',' + f(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ',' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ',' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ',' + f(p2[1]);
    }
    return d + ' L' + f(pts[pts.length - 1][0]) + ',' + bottom + ' Z';
  }
  function yAt(pts, x) {
    for (var i = 0; i < pts.length - 1; i++) {
      if (x >= pts[i][0] && x <= pts[i + 1][0]) {
        var t = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
      }
    }
    return pts[0][1];
  }
  function rect(x, y, w, h) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '"/>'; }
  function poly(p) { return '<path d="M' + p.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' L') + ' Z"/>'; }

  /* ---------- Motifs de collection ---------- */
  var MOTIFS = {
    temple: function (cx, gy, s, m, r) {
      var w = 118 * s, colH = 56 * s, nCol = 6, o = '', x0 = cx - w / 2, broken = Math.floor(r() * 9);
      o += rect(x0 - 7 * s, gy - 6 * s, w + 14 * s, 6 * s) + rect(x0 - 3 * s, gy - 10 * s, w + 6 * s, 4 * s);
      for (var i = 0; i < nCol; i++) {
        var x = x0 + i * (w - 8 * s) / (nCol - 1);
        var h = (i === broken) ? colH * 0.45 : colH;
        o += rect(x, gy - 10 * s - h, 8 * s, h);
      }
      var top = gy - 10 * s - colH;
      o += rect(x0 - 4 * s, top - 9 * s, w + 8 * s, 9 * s);
      o += poly([[x0 - 7 * s, top - 9 * s], [cx, top - 34 * s], [x0 + w + 7 * s, top - 9 * s]]);
      return o;
    },
    pyramids: function (cx, gy, s, m) {
      var o = '';
      o += '<g opacity=".55">' + poly([[cx + 40 * s, gy], [cx + 95 * s, gy - 52 * s], [cx + 150 * s, gy]]) + '</g>';
      o += poly([[cx - 82 * s, gy], [cx, gy - 98 * s], [cx + 82 * s, gy]]);
      o += '<g opacity=".35" fill="' + m.sky0 + '">' + poly([[cx, gy - 98 * s], [cx + 82 * s, gy], [cx + 22 * s, gy]]) + '</g>';
      o += poly([[cx - 118 * s, gy], [cx - 118 * s, gy - 62 * s], [cx - 114 * s, gy - 70 * s], [cx - 110 * s, gy - 62 * s], [cx - 110 * s, gy]]);
      return o;
    },
    castle: function (cx, gy, s, m, r) {
      var o = '';
      o += poly([[cx - 95 * s, gy + 4], [cx - 60 * s, gy - 22 * s], [cx - 34 * s, gy - 30 * s], [cx + 30 * s, gy - 34 * s], [cx + 58 * s, gy - 20 * s], [cx + 100 * s, gy + 4]]);
      var towers = [[-40, 54, 9], [-22, 78, 11], [2, 104, 13], [26, 70, 10], [44, 50, 8]];
      towers.forEach(function (t) {
        var x = cx + t[0] * s, h = t[1] * s, w = t[2] * s, base = gy - 28 * s;
        o += rect(x - w / 2, base - h, w, h + 4);
        o += poly([[x - w / 2 - 1.5 * s, base - h], [x, base - h - w * 2.2], [x + w / 2 + 1.5 * s, base - h]]);
      });
      var win = '';
      for (var i = 0; i < 6; i++) {
        var t = towers[Math.floor(r() * towers.length)];
        win += rect(cx + t[0] * s - 1.2 * s, gy - 28 * s - t[1] * s * (0.3 + r() * 0.5), 2.4 * s, 4 * s);
      }
      return o + '<g fill="' + m.sun + '" opacity=".85">' + win + '</g>';
    },
    tower: function (cx, gy, s, m, r) {
      var o = '';
      o += rect(cx - 14 * s, gy - 96 * s, 28 * s, 96 * s);
      o += poly([[cx - 19 * s, gy - 96 * s], [cx, gy - 150 * s], [cx + 19 * s, gy - 96 * s]]);
      o += rect(cx + 18 * s, gy - 54 * s, 18 * s, 54 * s);
      o += poly([[cx + 15 * s, gy - 54 * s], [cx + 27 * s, gy - 86 * s], [cx + 39 * s, gy - 54 * s]]);
      o += '<path d="M' + f(cx) + ',' + f(gy - 150 * s) + ' l0,-12 l10,4 l-10,4" stroke-width="' + f(s) + '"/>';
      o += '<g fill="' + m.sun + '" opacity=".8">' + rect(cx - 2.5 * s, gy - 78 * s, 5 * s, 9 * s) + '</g>';
      return o;
    },
    dome: function (cx, gy, s) {
      var o = '', w = 136 * s;
      o += rect(cx - w / 2, gy - 30 * s, w, 30 * s);
      o += rect(cx - w / 2 - 6 * s, gy - 34 * s, w + 12 * s, 5 * s);
      for (var i = 0; i < 8; i++) o += rect(cx - 34 * s + i * 9.2 * s, gy - 62 * s, 4.4 * s, 28 * s);
      o += rect(cx - 38 * s, gy - 66 * s, 76 * s, 5 * s);
      o += '<path d="M' + f(cx - 32 * s) + ',' + f(gy - 66 * s) + ' A' + f(32 * s) + ',' + f(36 * s) + ' 0 0 1 ' + f(cx + 32 * s) + ',' + f(gy - 66 * s) + ' Z"/>';
      o += rect(cx - 4 * s, gy - 112 * s, 8 * s, 12 * s);
      o += poly([[cx - 1 * s, gy - 112 * s], [cx, gy - 126 * s], [cx + 1 * s, gy - 112 * s]]);
      return o;
    },
    fjord: function (cx, gy, s, m, r, W) {
      var o = '', pts = [[-40, gy]], x = -40;
      while (x < W + 40) { x += 28 + r() * 40; pts.push([x, gy - (40 + r() * 70) * s]); x += 18 + r() * 24; pts.push([x, gy - (10 + r() * 28) * s]); }
      pts.push([W + 80, gy]);
      o += poly(pts);
      var snow = '';
      for (var i = 1; i < pts.length - 1; i += 2) {
        var p = pts[i], a = pts[i - 1], b = pts[i + 1], k = 0.22;
        snow += poly([[p[0], p[1]], [p[0] + (b[0] - p[0]) * k, p[1] + (b[1] - p[1]) * k], [p[0] + (b[0] - p[0]) * k * 0.4, p[1] + (b[1] - p[1]) * k * 0.7], [p[0] + (a[0] - p[0]) * k * 0.5, p[1] + (a[1] - p[1]) * k * 0.9], [p[0] + (a[0] - p[0]) * k, p[1] + (a[1] - p[1]) * k]]);
      }
      o += '<g fill="' + m.sky0 + '" opacity=".75">' + snow + '</g>';
      return o;
    },
    // Titans : le mont Othrys, sommet escarpé couronné d’un trône taillé dans la roche
    peak: function (cx, gy, s, m, r) {
      var o = '';
      o += '<g opacity=".5">' + poly([[cx - 170 * s, gy], [cx - 105 * s, gy - 58 * s], [cx - 70 * s, gy - 40 * s], [cx - 30 * s, gy]]) + '</g>';
      o += poly([[cx - 92 * s, gy], [cx - 46 * s, gy - 70 * s], [cx - 30 * s, gy - 62 * s], [cx - 12 * s, gy - 112 * s], [cx + 4 * s, gy - 104 * s], [cx + 22 * s, gy - 126 * s], [cx + 46 * s, gy - 82 * s], [cx + 62 * s, gy - 90 * s], [cx + 110 * s, gy]]);
      o += '<g fill="' + m.sky0 + '" opacity=".5">' + poly([[cx + 22 * s, gy - 126 * s], [cx + 46 * s, gy - 82 * s], [cx + 30 * s, gy - 92 * s], [cx + 20 * s, gy - 84 * s]]) + '</g>';
      // trône au sommet
      o += rect(cx + 12 * s, gy - 138 * s, 20 * s, 12 * s) + rect(cx + 12 * s, gy - 156 * s, 5 * s, 20 * s) + rect(cx + 27 * s, gy - 156 * s, 5 * s, 20 * s) + rect(cx + 12 * s, gy - 160 * s, 20 * s, 5 * s);
      return o;
    },
    // Géants : un volcan fumant (l’Etna, sous lequel dorment Encelade et Typhon)
    volcano: function (cx, gy, s, m, r) {
      var o = '';
      o += poly([[cx - 130 * s, gy], [cx - 26 * s, gy - 96 * s], [cx - 14 * s, gy - 90 * s], [cx - 4 * s, gy - 98 * s], [cx + 8 * s, gy - 90 * s], [cx + 22 * s, gy - 97 * s], [cx + 132 * s, gy]]);
      o += '<g fill="' + m.sun + '" opacity=".75">' + poly([[cx - 14 * s, gy - 90 * s], [cx - 4 * s, gy - 98 * s], [cx + 8 * s, gy - 90 * s], [cx + 2 * s, gy - 70 * s]]) + '</g>';
      var smoke = '';
      for (var i = 0; i < 5; i++) {
        var y = gy - (112 + i * 22) * s, x = cx + (i * 9 + r() * 8 - 4) * s, rr = (10 + i * 5) * s;
        smoke += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(rr) + '"/>';
      }
      o += '<g fill="' + m.far + '" opacity=".55">' + smoke + '</g>';
      return o;
    },
    // Héros : le navire Argo, voile gonflée
    ship: function (cx, gy, s, m) {
      var o = '', y = gy - 6 * s;
      o += poly([[cx - 70 * s, y - 14 * s], [cx + 70 * s, y - 14 * s], [cx + 52 * s, y + 6 * s], [cx - 54 * s, y + 6 * s]]);
      o += poly([[cx + 62 * s, y - 14 * s], [cx + 80 * s, y - 34 * s], [cx + 72 * s, y - 14 * s]]);
      o += rect(cx - 2 * s, y - 92 * s, 4 * s, 78 * s);
      o += poly([[cx - 40 * s, y - 86 * s], [cx + 40 * s, y - 86 * s], [cx + 34 * s, y - 34 * s], [cx - 34 * s, y - 34 * s]]);
      o += '<g fill="' + m.sun + '" opacity=".55">' + rect(cx - 40 * s, y - 64 * s, 80 * s, 5 * s) + '</g>';
      for (var i = 0; i < 7; i++) o += '<path d="M' + f(cx - 44 * s + i * 13 * s) + ',' + f(y) + ' l-8,' + f(16 * s) + '" stroke-width="' + f(1.4 * s) + '"/>';
      return o;
    },
    // Monstres : l’entrée d’une grotte dans une falaise
    cave: function (cx, gy, s, m) {
      var o = '';
      o += poly([[cx - 150 * s, gy], [cx - 120 * s, gy - 70 * s], [cx - 70 * s, gy - 104 * s], [cx - 10 * s, gy - 116 * s], [cx + 60 * s, gy - 98 * s], [cx + 120 * s, gy - 64 * s], [cx + 150 * s, gy]]);
      o += '<g fill="' + m.fig + '" opacity=".85"><path d="M' + f(cx - 34 * s) + ',' + f(gy) + ' C' + f(cx - 36 * s) + ',' + f(gy - 60 * s) + ' ' + f(cx + 34 * s) + ',' + f(gy - 64 * s) + ' ' + f(cx + 32 * s) + ',' + f(gy) + ' Z"/></g>';
      o += '<g fill="' + m.sun + '" opacity=".8">' + '<circle cx="' + f(cx - 8 * s) + '" cy="' + f(gy - 30 * s) + '" r="' + f(2 * s) + '"/><circle cx="' + f(cx + 6 * s) + '" cy="' + f(gy - 30 * s) + '" r="' + f(2 * s) + '"/></g>';
      return o;
    },
    // Planètes : une planète à anneaux suspendue au-dessus de l’horizon
    planet: function (cx, gy, s, m) {
      var o = '', y = gy - 86 * s, R = 34 * s;
      o += '<ellipse cx="' + f(cx) + '" cy="' + f(y) + '" rx="' + f(R * 2.1) + '" ry="' + f(R * 0.5) + '" fill="none" stroke="' + m.line + '" stroke-width="' + f(3 * s) + '" opacity=".7" transform="rotate(-14 ' + f(cx) + ' ' + f(y) + ')"/>';
      o += '<circle cx="' + f(cx) + '" cy="' + f(y) + '" r="' + f(R) + '"/>';
      o += '<g fill="' + m.sky0 + '" opacity=".25">' + rect(cx - R, y - 8 * s, R * 2, 4 * s) + rect(cx - R, y + 6 * s, R * 2, 3 * s) + '</g>';
      o += '<g fill="' + m.sun + '" opacity=".9"><circle cx="' + f(cx - 90 * s) + '" cy="' + f(gy - 120 * s) + '" r="' + f(1.6 * s) + '"/><circle cx="' + f(cx + 96 * s) + '" cy="' + f(gy - 140 * s) + '" r="' + f(1.2 * s) + '"/><circle cx="' + f(cx + 60 * s) + '" cy="' + f(gy - 30 * s) + '" r="' + f(1.4 * s) + '"/></g>';
      return o;
    },
    // Lunes : un sol cratérisé, la planète mère dans le ciel
    moon: function (cx, gy, s, m) {
      var o = '';
      o += '<circle cx="' + f(cx + 40 * s) + '" cy="' + f(gy - 96 * s) + '" r="' + f(30 * s) + '" opacity=".55"/>';
      o += poly([[cx - 160 * s, gy], [cx - 150 * s, gy - 18 * s], [cx - 60 * s, gy - 24 * s], [cx + 30 * s, gy - 16 * s], [cx + 150 * s, gy - 22 * s], [cx + 160 * s, gy]]);
      o += '<g fill="' + m.sky0 + '" opacity=".35">';
      [[-90, 18, 14], [-20, 14, 9], [70, 19, 12]].forEach(function (c) { o += '<ellipse cx="' + f(cx + c[0] * s) + '" cy="' + f(gy - c[1] * s) + '" rx="' + f(c[2] * s) + '" ry="' + f(c[2] * 0.28 * s) + '"/>'; });
      return o + '</g>';
    },
    // Merveilles du cosmos : un trou noir et son disque de gaz dans le ciel
    blackhole: function (cx, gy, s, m) {
      var y = gy - 92 * s, o = '';
      o += '<ellipse cx="' + f(cx) + '" cy="' + f(y) + '" rx="' + f(72 * s) + '" ry="' + f(14 * s) + '" fill="' + m.sun + '" opacity=".75" transform="rotate(-10 ' + f(cx) + ' ' + f(y) + ')"/>';
      o += '<circle cx="' + f(cx) + '" cy="' + f(y) + '" r="' + f(30 * s) + '" fill="none" stroke="' + m.sun + '" stroke-width="' + f(5 * s) + '" opacity=".6"/>';
      o += '<circle cx="' + f(cx) + '" cy="' + f(y) + '" r="' + f(26 * s) + '" fill="' + m.fig + '"/>';
      o += poly([[cx - 160 * s, gy], [cx - 90 * s, gy - 16 * s], [cx + 20 * s, gy - 10 * s], [cx + 160 * s, gy - 18 * s], [cx + 160 * s, gy]]);
      return o;
    },
    // Astronautes : une fusée sur son pas de tir
    rocket: function (cx, gy, s, m) {
      var o = '', b = gy - 4 * s;
      o += rect(cx - 30 * s, b - 4 * s, 60 * s, 4 * s);
      o += rect(cx + 18 * s, b - 120 * s, 5 * s, 116 * s);
      o += rect(cx - 9 * s, b - 96 * s, 18 * s, 92 * s);
      o += poly([[cx - 9 * s, b - 96 * s], [cx, b - 126 * s], [cx + 9 * s, b - 96 * s]]);
      o += poly([[cx - 9 * s, b - 22 * s], [cx - 20 * s, b - 4 * s], [cx - 9 * s, b - 4 * s]]) + poly([[cx + 9 * s, b - 22 * s], [cx + 20 * s, b - 4 * s], [cx + 9 * s, b - 4 * s]]);
      o += '<g fill="' + m.sun + '" opacity=".7"><circle cx="' + f(cx) + '" cy="' + f(b - 70 * s) + '" r="' + f(3.2 * s) + '"/></g>';
      return o;
    },
    // Îles et jungle : palmiers et collines
    palms: function (cx, gy, s, m) {
      var o = poly([[cx - 140 * s, gy], [cx - 60 * s, gy - 30 * s], [cx + 30 * s, gy - 18 * s], [cx + 140 * s, gy]]);
      [[-50, 92, -0.15], [-14, 112, 0.08], [44, 80, 0.2]].forEach(function (p) {
        var x = cx + p[0] * s, h = p[1] * s, k = p[2], tx = x + k * h, ty = gy - 20 * s - h;
        o += '<path d="M' + f(x) + ',' + f(gy - 20 * s) + ' Q' + f(x + k * h * 0.2) + ',' + f(ty + h * 0.5) + ' ' + f(tx) + ',' + f(ty) + '" fill="none" stroke="' + m.mid + '" stroke-width="' + f(4 * s) + '"/>';
        [-2.6, -2, -1.2, -0.4, 0.3].forEach(function (a) {
          o += '<path d="M' + f(tx) + ',' + f(ty) + ' q' + f(Math.cos(a) * 18 * s) + ',' + f(Math.sin(a) * 14 * s - 6 * s) + ' ' + f(Math.cos(a) * 34 * s) + ',' + f(Math.sin(a) * 18 * s + 10 * s) + '" fill="none" stroke="' + m.mid + '" stroke-width="' + f(3.2 * s) + '" stroke-linecap="round"/>';
        });
      });
      return o;
    },
    // Forêt de Sherwood : sapins et chênes serrés
    forest: function (cx, gy, s, m, r) {
      var o = '';
      for (var i = 0; i < 9; i++) {
        var x = cx + (i - 4) * 30 * s + (r() - 0.5) * 10 * s, h = (60 + r() * 50) * s;
        if (i % 3 === 1) o += rect(x - 2.5 * s, gy - h * 0.45, 5 * s, h * 0.45) + '<circle cx="' + f(x) + '" cy="' + f(gy - h * 0.62) + '" r="' + f(h * 0.3) + '"/>';
        else o += poly([[x - h * 0.22, gy], [x, gy - h], [x + h * 0.22, gy]]);
      }
      return o;
    },
    // Pharaons : pylône de temple encadré de deux obélisques
    obelisk: function (cx, gy, s, m) {
      var o = '';
      o += poly([[cx - 58 * s, gy], [cx - 52 * s, gy - 64 * s], [cx - 8 * s, gy - 64 * s], [cx - 6 * s, gy]]);
      o += poly([[cx + 6 * s, gy], [cx + 8 * s, gy - 64 * s], [cx + 52 * s, gy - 64 * s], [cx + 58 * s, gy]]);
      o += rect(cx - 6 * s, gy - 40 * s, 12 * s, 40 * s);
      o += '<g fill="' + m.sun + '" opacity=".5">' + rect(cx - 4 * s, gy - 30 * s, 8 * s, 30 * s) + '</g>';
      [[-82, 98], [82, 86]].forEach(function (b) {
        var x = cx + b[0] * s, h = b[1] * s;
        o += poly([[x - 6 * s, gy], [x - 4 * s, gy - h], [x, gy - h - 9 * s], [x + 4 * s, gy - h], [x + 6 * s, gy]]);
      });
      return o;
    },
    torii: function (cx, gy, s) {
      var o = '';
      o += rect(cx - 40 * s, gy - 84 * s, 7 * s, 84 * s) + rect(cx + 33 * s, gy - 84 * s, 7 * s, 84 * s);
      o += rect(cx - 50 * s, gy - 70 * s, 100 * s, 5 * s);
      o += '<path d="M' + f(cx - 62 * s) + ',' + f(gy - 92 * s) + ' Q' + f(cx) + ',' + f(gy - 84 * s) + ' ' + f(cx + 62 * s) + ',' + f(gy - 92 * s) + ' L' + f(cx + 58 * s) + ',' + f(gy - 84 * s) + ' Q' + f(cx) + ',' + f(gy - 78 * s) + ' ' + f(cx - 58 * s) + ',' + f(gy - 84 * s) + ' Z"/>';
      return o;
    }
  };
  var WATER = { pyramids: true, fjord: true };

  function figure(x, y, k, color, staff) {
    return '<g transform="translate(' + f(x) + ',' + f(y) + ') scale(' + f(k) + ')" fill="' + color + '">' +
      '<circle cx="0" cy="-21" r="2.6"/>' +
      '<path d="M-1.8,-18 C-3.6,-15 -4.6,-8 -5.4,0 L5.4,0 C4.6,-8 3.6,-15 1.8,-18 Z"/>' +
      (staff ? '<path d="M5.2,-25 L6.4,0" stroke="' + color + '" stroke-width=".9"/>' : '') + '</g>';
  }
  function birds(r, W, H, color) {
    var o = '', count = 2 + Math.floor(r() * 3), bx = W * (0.15 + r() * 0.5), by = H * (0.14 + r() * 0.16);
    for (var i = 0; i < count; i++) {
      var x = bx + i * (9 + r() * 10), y = by + (r() - 0.5) * 14, w = 3 + r() * 2.5;
      o += '<path d="M' + f(x) + ',' + f(y) + ' q' + f(w) + ',' + f(-w * 0.8) + ' ' + f(w * 2) + ',0 q' + f(w) + ',' + f(-w * 0.8) + ' ' + f(w * 2) + ',0"/>';
    }
    return '<g fill="none" stroke="' + color + '" stroke-width=".9" stroke-linecap="round" opacity=".55">' + o + '</g>';
  }

  /**
   * Génère une illustration SVG.
   * @param {object} o { seed, coll, rarity, motif?, w?, h? }
   */
  A.art = function (o) {
    var W = o.w || 300, H = o.h || 330;
    var r = A.rng(A.hash(o.seed || 'atlas'));
    var m = moodFor(o.coll, o.rarity || 'base');
    var motif = o.motif || (A.COLL[o.coll] ? A.COLL[o.coll].motif : 'temple');
    var id = 'g' + (++n);
    var s = Math.min(H / 330, W / 300) * (0.9 + r() * 0.25);
    var gy = H * (0.7 + r() * 0.04);
    var cx = W * (0.36 + r() * 0.3);
    var sunX = W * (0.22 + r() * 0.56), sunY = H * (0.2 + r() * 0.14), sunR = Math.min(W, H) * (0.1 + r() * 0.06);
    var night = motif === 'castle';
    var fx = cx > W / 2 ? W * (0.12 + r() * 0.14) : W * (0.74 + r() * 0.14);

    var far = ridge(r, -30, W + 30, gy - 18 * s, 14 * s, 46);
    var near = ridge(r, -30, W + 30, gy + 26 * s, 10 * s, 60);
    var fy = yAt(near, fx);

    var out = [];
    out.push('<svg class="art" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">');
    out.push('<defs><linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + m.sky0 + '"/><stop offset="1" stop-color="' + m.sky1 + '"/></linearGradient>' +
      '<radialGradient id="' + id + 'v" cx=".5" cy=".42" r=".78"><stop offset=".55" stop-color="#2a1f12" stop-opacity="0"/><stop offset="1" stop-color="#2a1f12" stop-opacity="' + m.vig + '"/></radialGradient></defs>');
    out.push('<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 's)"/>');

    // Lavis du ciel
    out.push('<g filter="url(#atl-blur)" opacity=".5"><ellipse cx="' + f(W * r()) + '" cy="' + f(H * 0.18) + '" rx="' + f(W * 0.5) + '" ry="' + f(H * 0.07) + '" fill="' + m.sun + '"/>' +
      '<ellipse cx="' + f(W * r()) + '" cy="' + f(H * 0.38) + '" rx="' + f(W * 0.45) + '" ry="' + f(H * 0.05) + '" fill="' + m.far + '" opacity=".6"/></g>');

    // Soleil / lune
    out.push('<circle cx="' + f(sunX) + '" cy="' + f(sunY) + '" r="' + f(sunR * 2.4) + '" fill="' + m.sun + '" opacity="' + (m.dark ? 0.12 : 0.45) + '" filter="url(#atl-blur)"/>');
    if (night && !m.dark) {
      out.push('<circle cx="' + f(sunX) + '" cy="' + f(sunY) + '" r="' + f(sunR * 0.8) + '" fill="' + m.sun + '"/>');
      out.push('<circle cx="' + f(sunX + sunR * 0.32) + '" cy="' + f(sunY - sunR * 0.16) + '" r="' + f(sunR * 0.72) + '" fill="' + m.sky1 + '" opacity=".92"/>');
    } else {
      out.push('<circle cx="' + f(sunX) + '" cy="' + f(sunY) + '" r="' + f(sunR) + '" fill="' + m.sun + '" opacity="' + (m.dark ? 0.9 : 0.95) + '"/>');
    }
    if (m.line) {
      out.push('<circle cx="' + f(sunX) + '" cy="' + f(sunY) + '" r="' + f(sunR + 7) + '" fill="none" stroke="' + m.line + '" stroke-width=".8" opacity=".85"/>');
      out.push('<circle cx="' + f(sunX) + '" cy="' + f(sunY) + '" r="' + f(sunR + 13) + '" fill="none" stroke="' + m.line + '" stroke-width=".4" stroke-dasharray="1 3" opacity=".7"/>');
    }
    if (!m.dark) out.push(birds(r, W, H, m.fig));

    // Lointain
    out.push('<path d="' + smooth(far, H + 10) + '" fill="' + m.far + '" opacity=".75" filter="url(#atl-wc)"/>');

    // Motif
    var stroke = m.dark ? ' stroke="' + m.line + '" stroke-width=".7"' : '';
    out.push('<g fill="' + m.mid + '"' + stroke + ' stroke-linejoin="round" filter="url(#atl-wc)">' + MOTIFS[motif](cx, gy, s, m, r, W) + '</g>');

    // Eau
    if (WATER[motif]) {
      out.push('<rect x="0" y="' + f(gy) + '" width="' + W + '" height="' + f(H - gy) + '" fill="' + m.far + '" opacity=".55"/>');
      var lines = '';
      for (var i = 0; i < 7; i++) {
        var ly = gy + 6 + i * (H - gy) / 9, lx = r() * W * 0.7;
        lines += '<path d="M' + f(lx) + ',' + f(ly) + ' h' + f(30 + r() * W * 0.3) + '"/>';
      }
      out.push('<g stroke="' + (m.dark ? m.line : m.sun) + '" stroke-width=".8" opacity=".5">' + lines + '</g>');
      if (motif === 'fjord') {
        var bx = cx + 40 * s, by = gy + 22 * s;
        out.push('<g fill="' + m.near + '"' + stroke + '><path d="M' + f(bx - 28 * s) + ',' + f(by - 6 * s) + ' Q' + f(bx) + ',' + f(by + 6 * s) + ' ' + f(bx + 28 * s) + ',' + f(by - 6 * s) + ' L' + f(bx + 22 * s) + ',' + f(by) + ' L' + f(bx - 22 * s) + ',' + f(by) + ' Z"/>' +
          rect(bx - 0.6 * s, by - 34 * s, 1.2 * s, 30 * s) + rect(bx - 11 * s, by - 32 * s, 22 * s, 18 * s) + '</g>');
      }
    }

    // Premier plan
    var nearCut = WATER[motif] ? near.map(function (p) { return [p[0], p[0] < W * 0.42 || p[0] > W * 0.82 ? p[1] : H + 20]; }) : near;
    out.push('<path d="' + smooth(nearCut, H + 10) + '" fill="' + m.near + '"' + (m.dark ? ' stroke="' + m.line + '" stroke-width=".5"' : '') + ' filter="url(#atl-wc)"/>');
    if (!WATER[motif] || fx < W * 0.42 || fx > W * 0.82) out.push(figure(fx, fy + 1, s * 1.05, m.fig, r() > 0.5));

    // Poussière d’or (Légendaire et plus)
    if (m.line) {
      var dust = '';
      for (var d = 0; d < 26; d++) dust += '<circle cx="' + f(r() * W) + '" cy="' + f(r() * H * 0.7) + '" r="' + f(0.4 + r() * 0.9) + '"/>';
      out.push('<g fill="' + m.line + '" opacity="' + (m.dark ? 0.8 : 0.55) + '">' + dust + '</g>');
    }
    out.push('<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'v)"/>');
    out.push('</svg>');
    return out.join('');
  };

  /* Illustration d’une édition (image définitive si disponible) */
  /* Version « image » : le SVG embarque ses propres filtres et devient une
     image data-URI. Le navigateur la rastérise UNE fois puis la met en cache :
     plus aucun recalcul des filtres pendant les animations 3D (fluidité,
     pas de scintillement). */
  var FILTERS = '<filter id="atl-wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>' +
    '<filter id="atl-blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>';
  var cache = {};
  A.artURI = function (o) {
    var key = [o.seed, o.coll, o.rarity, o.motif, o.w, o.h, o.scale].join('|');
    if (cache[key]) return cache[key];
    var W = o.w || 300, H = o.h || 330;
    var svg = A.art(o)
      .replace('<svg class="art" ', '<svg xmlns="http://www.w3.org/2000/svg" width="' + Math.round(W * (o.scale || 1)) + '" height="' + Math.round(H * (o.scale || 1)) + '" ')
      .replace('<defs>', '<defs>' + FILTERS);
    return (cache[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  };
  A.artImg = function (o) { return '<img class="art" alt="" draggable="false" decoding="async" src="' + A.artURI(o) + '">'; };

  A.editionArt = function (ed, opts) {
    opts = opts || {};
    if (ed.image) return '<img class="art" src="' + ed.image + '" alt="" loading="lazy" draggable="false">';
    var ch = A.CHAR[ed.charId];
    var o = { seed: ed.id, coll: ch.coll, rarity: ed.rarity, w: opts.w, h: opts.h, scale: opts.scale };
    return opts.inline ? A.art(o) : A.artImg(o);
  };
})(window.ATLAS);
