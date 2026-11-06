/* ==========================================================================
   ATLAS — Relief lumineux calculé depuis les pixels de l’illustration
   --------------------------------------------------------------------------
   Au survol d’une carte, un shader WebGL traite la luminosité de son
   illustration comme une carte de hauteur (traits d’encre, plis, nuages
   = reliefs), en déduit les normales (Sobel) puis éclaire ce relief avec une
   lumière qui suit la souris : arêtes tournées vers la lumière = reflet
   métallique teinté selon la rareté ; arêtes opposées = petite ombre.
   Un seul canvas WebGL, déplacé de carte en carte. Sans WebGL : rien ne change.
   ========================================================================== */
(function (A) {
  'use strict';
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* teinte du reflet et intensité par rareté */
  var TINT = {
    base: [[1.0, 0.97, 0.9], 0.45], rare: [[0.86, 0.92, 1.0], 0.75], epic: [[0.93, 0.85, 1.0], 0.85],
    legendary: [[1.0, 0.95, 0.84], 1.05], mythic: [[1.0, 0.74, 0.66], 1.0], unique: [[1.0, 0.84, 0.5], 1.15]
  };

  var VS = 'attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }';
  var FS = [
    'precision mediump float;',
    'uniform sampler2D t; uniform vec2 sc; uniform vec2 px; uniform vec2 lp; uniform vec3 tint; uniform float k;',
    'varying vec2 v;',
    // hauteur = luminance LISSÉE (on ignore le grain du papier, on garde les formes du dessin)
    'float L0(vec2 u){ return dot(texture2D(t, u).rgb, vec3(.299, .587, .114)); }',
    'float h(vec2 u, vec2 b){ return (L0(u) * 2. + L0(u + vec2(b.x, b.y)) + L0(u + vec2(-b.x, b.y)) + L0(u + vec2(b.x, -b.y)) + L0(u + vec2(-b.x, -b.y))) / 6.; }',
    'vec2 sobel(vec2 uv, vec2 d){',
    '  vec2 b = d * .6;',
    '  float tl = h(uv + vec2(-d.x, -d.y), b), tc = h(uv + vec2(0., -d.y), b), tr = h(uv + vec2(d.x, -d.y), b);',
    '  float ml = h(uv + vec2(-d.x, 0.), b), mr = h(uv + vec2(d.x, 0.), b);',
    '  float bl = h(uv + vec2(-d.x, d.y), b), bc = h(uv + vec2(0., d.y), b), br = h(uv + vec2(d.x, d.y), b);',
    '  return vec2((tr + 2. * mr + br) - (tl + 2. * ml + bl), (bl + 2. * bc + br) - (tl + 2. * tc + tr));',
    '}',
    'void main(){',
    '  vec2 uv = (v - .5) * sc + .5;',
    // deux échelles : contours fins + grandes formes ; seuil pour effacer le bruit
    '  vec2 g = sobel(uv, px * 2.5) * .45 + sobel(uv, px * 6.) * .55;',
    '  float gm = length(g);',
    '  float edge = smoothstep(.06, .32, gm);',
    '  g *= edge;',
    '  vec3 n = normalize(vec3(-g * 3.2, 1.));',
    '  vec3 L = normalize(vec3((lp - v) * vec2(1., 1.2), .42));',
    '  float rel = dot(n, L) - L.z;',                                  // 0 sur les zones planes
    '  vec3 R = reflect(-L, n);',
    '  float spec = pow(max(R.z, 0.), 48.) * edge;',                    // éclats brillants sur les arêtes
    '  float dl = distance(v * vec2(1., 1.1), lp * vec2(1., 1.1));',
    '  float att = 1. - smoothstep(0., .62, dl);',                     // tache de lumière autour du curseur
    '  float pool = pow(att, 3.) * .07;',                               // lueur douce au point de lumière
    '  float hi = clamp((max(rel, 0.) * .95 + spec * 1.6) * att * k + pool * k, 0., 1.);',
    '  float sh = clamp(max(-rel, 0.) * .6 * att * k, 0., .32);',
    '  gl_FragColor = vec4(tint * hi, hi + sh * (1. - hi));',           // alpha prémultiplié : ombre = noir translucide
    '}'
  ].join('\n');

  var cv, gl, U, tex, cur = null, curImg = null, fade = 0;
  function init() {
    cv = document.createElement('canvas');
    cv.className = 'art card-relief';
    gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return false;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (w) { gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE); });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    U = {};
    ['sc', 'px', 'lp', 'tint', 'k'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    return true;
  }

  function attach(card, img) {
    var art = card.querySelector('.card-art');
    if (!art) return false;
    try { gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch (e) { return false; }
    img.after(cv);
    var r = img.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = img.offsetWidth || r.width, hgt = img.offsetHeight || r.height;
    cv.width = Math.max(2, Math.round(w * dpr)); cv.height = Math.max(2, Math.round(hgt * dpr));
    gl.viewport(0, 0, cv.width, cv.height);
    var ca = w / hgt, ia = (img.naturalWidth || w) / (img.naturalHeight || hgt);
    gl.uniform2f(U.sc, ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1);       // « cover », comme l’<img>
    gl.uniform2f(U.px, 1 / cv.width * (ca > ia ? 1 : ca / ia), 1 / cv.height * (ca > ia ? ia / ca : 1));
    var rar = (card.className.match(/\br-(\w+)/) || [])[1], t = TINT[rar] || TINT.base;
    gl.uniform3f(U.tint, t[0][0], t[0][1], t[0][2]); gl.uniform1f(U.k, t[1]);
    return true;
  }

  function draw(x, y) {
    gl.uniform2f(U.lp, x, y);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var card = e.target.closest && e.target.closest('.card[data-tilt]');
    if (card && card.classList.contains('is-missing')) card = null;
    if (!card) { if (cur) { cv.classList.remove('is-on'); cur = null; } return; }
    var img = card.querySelector('.card-art img.art');
    if (!img || !img.complete || !img.naturalWidth) return;
    if (!gl && !init()) { gl = null; return; }
    if (card !== cur || img !== curImg) {
      if (!attach(card, img)) return;
      cur = card; curImg = img;
      requestAnimationFrame(function () { cv.classList.add('is-on'); });
    }
    var r = img.getBoundingClientRect();
    draw((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { if (cur) { cv.classList.remove('is-on'); cur = null; } });
})(window.ATLAS);
