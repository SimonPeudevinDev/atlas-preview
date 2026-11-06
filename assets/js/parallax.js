/* ==========================================================================
   ATLAS — Parallaxe 2.5D sur une illustration plate (WebGL)
   --------------------------------------------------------------------------
   Toute <img class="px-art"> placée dans une .coll-art devient « vivante »
   au survol : un shader estime une profondeur pour chaque zone de l’image
   (bas de l’image et encre foncée = premier plan ; ciel et nuages clairs =
   lointain) puis décale les plans différemment selon la souris.
   Le canvas n’est créé qu’au premier survol et ne tourne que pendant
   l’animation. Sans WebGL : l’image reste telle quelle.
   ========================================================================== */
(function () {
  'use strict';
  /* Effet déclenché uniquement par le survol de la souris : actif même si le
     système demande des animations réduites (sinon il disparaît sur beaucoup
     de PC Windows où les « effets d’animation » sont coupés). */

  var VS = 'attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }';
  var FS = [
    'precision mediump float;',
    'uniform sampler2D t; uniform vec2 m; uniform vec2 sc; uniform float z; uniform float k;',
    'varying vec2 v;',
    'float lum(vec2 u){ return dot(texture2D(t, u).rgb, vec3(.299, .587, .114)); }',
    'void main(){',
    '  vec2 uv = (v - .5) * sc / z + .5;',
    // profondeur grossière : position verticale + densité d’encre moyennée (flou large)
    '  float ink = 0.;',
    '  for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++) ink += lum(uv + vec2(float(i), float(j)) * .035);',
    '  ink = 1. - ink / 25.;',
    '  float d = clamp(smoothstep(.15, 1., uv.y) * .7 + smoothstep(.15, .6, ink) * .55, 0., 1.);',
    '  vec2 q = uv - m * (d - .35) * k;',
    '  q = clamp(q, .002, .998);',
    '  vec3 c = texture2D(t, q).rgb;',
    // lumière douce qui suit la souris
    '  float g = 1. - smoothstep(0., .75, distance(v, vec2(.5 + m.x * .45, .4 + m.y * .35)));',
    '  c += vec3(1., .97, .9) * g * .06 * length(m);',
    '  gl_FragColor = vec4(c, 1.);',
    '}'
  ].join('\n');

  function setup(art, img) {
    var cv = document.createElement('canvas');
    cv.className = 'px-canvas';
    var gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false });
    if (!gl) return null;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (w) { gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE); });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch (e) { return null; }
    var U = { m: gl.getUniformLocation(pr, 'm'), sc: gl.getUniformLocation(pr, 'sc'), z: gl.getUniformLocation(pr, 'z'), k: gl.getUniformLocation(pr, 'k') };
    art.appendChild(cv);

    var st = { tx: 0, ty: 0, x: 0, y: 0, tz: 1, zz: 1, raf: 0, on: false };
    function size() {
      var r = art.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      var ca = r.width / r.height, ia = img.naturalWidth / img.naturalHeight;
      gl.uniform2f(U.sc, ca > ia ? 1 : ca / ia, ca > ia ? ia / ca : 1);   // « cover »
    }
    function draw() {
      st.x += (st.tx - st.x) * 0.08; st.y += (st.ty - st.y) * 0.08; st.zz += (st.tz - st.zz) * 0.06;
      gl.uniform2f(U.m, st.x, st.y); gl.uniform1f(U.z, st.zz); gl.uniform1f(U.k, 0.065);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      var moving = Math.abs(st.tx - st.x) + Math.abs(st.ty - st.y) + Math.abs(st.tz - st.zz) > 0.0004;
      st.raf = moving ? requestAnimationFrame(draw) : 0;
    }
    function kick() { if (!st.raf) st.raf = requestAnimationFrame(draw); }
    size(); draw();
    cv.classList.add('is-ready');
    window.addEventListener('resize', function () { size(); kick(); });
    return {
      move: function (nx, ny) { st.tx = nx; st.ty = ny; st.tz = 1.07; kick(); },
      leave: function () { st.tx = 0; st.ty = 0; st.tz = 1; kick(); }
    };
  }

  var cur = null;
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var art = e.target.closest && e.target.closest('.coll-art');
    var img = art && art.querySelector('img.px-art');
    if (cur && cur.art !== art) { cur.fx.leave(); cur = null; }
    if (!img || !img.complete || !img.naturalWidth) return;
    if (!art._px) art._px = setup(art, img) || 'none';
    if (art._px === 'none') return;
    var r = art.getBoundingClientRect();
    art._px.move((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1);
    cur = { art: art, fx: art._px };
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { if (cur) { cur.fx.leave(); cur = null; } });
})();
