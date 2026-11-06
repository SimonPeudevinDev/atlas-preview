/* ==========================================================================
   ATLAS — Sons, vibrations et particules
   --------------------------------------------------------------------------
   Sons synthétisés en direct (Web Audio) : aucun fichier audio à charger.
   Particules dessinées sur un <canvas> (paillettes d’aluminium, poussière d’or).
   ========================================================================== */
(function (A) {
  'use strict';

  /* ---------- Son ---------- */
  var SFX = A.sfx = {};
  var KEY = 'atlas-sound';
  var ctx = null, master = null, verb = null, noiseBuf = null;
  SFX.muted = (function () { try { return localStorage.getItem(KEY) === 'off'; } catch (e) { return false; } })();
  SFX.setMuted = function (m) {
    SFX.muted = m;
    try { localStorage.setItem(KEY, m ? 'off' : 'on'); } catch (e) { /* ignore */ }
    if (m && ctx) ctx.suspend(); else if (ctx) ctx.resume();
  };

  function ac() {
    if (SFX.muted) return null;
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
      master = ctx.createGain(); master.gain.value = 0.6;
      var comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
      // Réverbération de salle (réponse impulsionnelle générée) : donne de l’ampleur aux sons « épiques »
      try {
        var len = Math.round(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
        for (var ch = 0; ch < 2; ch++) {
          var d = ir.getChannelData(ch);
          for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
        var conv = ctx.createConvolver(); conv.buffer = ir;
        verb = ctx.createGain(); verb.gain.value = 0.32;
        verb.connect(conv); conv.connect(master);
      } catch (e) { verb = null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  SFX.unlock = function () { ac(); };

  function env(g, t, peak, a, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + Math.max(a, 0.002));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function tone(o) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(); osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    var g = c.createGain(); env(g, t, o.gain || 0.1, o.a || 0.004, o.dur);
    osc.connect(g); g.connect(master);
    if (o.wet && verb) { var w = c.createGain(); w.gain.value = o.wet; g.connect(w); w.connect(verb); }
    osc.start(t); osc.stop(t + o.dur + 0.05);
  }
  /* Bruit filtré très court : bruits physiques (carte qui glisse, claque, papier qui se déchire).
     Toujours bref et filtré : jamais de souffle continu. */
  function noise(o) {
    var c = ac(); if (!c) return;
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var t = c.currentTime + (o.delay || 0);
    var src = c.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    var f = c.createBiquadFilter(); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1.2;
    f.frequency.setValueAtTime(o.f, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    var g = c.createGain(); env(g, t, o.gain || 0.1, o.a || 0.003, o.dur);
    src.connect(f); f.connect(g); g.connect(master);
    if (o.wet && verb) { var w = c.createGain(); w.gain.value = o.wet; g.connect(w); w.connect(verb); }
    src.start(t, Math.random() * 0.5); src.stop(t + o.dur + 0.05);
  }
  // Accord de cuivres (dents de scie détunées, filtre qui s’ouvre) : la « fanfare » des grandes raretés
  function brass(fs, delay, gain, dur) {
    var c = ac(); if (!c) return;
    var t = c.currentTime + (delay || 0);
    var f = c.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 2;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + 0.35);
    f.frequency.exponentialRampToValueAtTime(900, t + dur);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.12);
    g.gain.setValueAtTime(gain, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    f.connect(g); g.connect(master);
    if (verb) { var w = c.createGain(); w.gain.value = 0.9; g.connect(w); w.connect(verb); }
    fs.forEach(function (fr) {
      [-6, 6].forEach(function (det) {
        var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr; o.detune.value = det;
        o.connect(f); o.start(t); o.stop(t + dur + 0.05);
      });
    });
  }
  // Impact grave : chute de fréquence + coup sourd
  function boom(delay, gain, dur) {
    tone({ f: 92, f2: 34, dur: dur || 1.4, gain: gain, a: 0.004, delay: delay, wet: 0.5 });
    tone({ type: 'triangle', f: 180, f2: 60, dur: 0.25, gain: gain * 0.35, delay: delay });
    noise({ type: 'lowpass', f: 420, f2: 120, q: 0.7, dur: 0.35, gain: gain * 0.9, delay: delay, wet: 0.4 });
  }
  function bell(f, delay, gain, dur) {
    dur = dur || 1.8;
    tone({ f: f, dur: dur, gain: gain, delay: delay, wet: 0.35 });
    tone({ f: f * 2.76, dur: dur * 0.45, gain: gain * 0.22, delay: delay, wet: 0.35 });
    tone({ f: f * 5.4, dur: dur * 0.2, gain: gain * 0.08, delay: delay });
  }

  /* Sons « de jeu » : uniquement des notes pures (aucun souffle, aucune musique).
     La révélation monte en richesse avec la rareté, comme un coffre rare qu’on ouvre. */
  function chord(fs, delay, gain, dur, a) {
    fs.forEach(function (f) {
      tone({ f: f, dur: dur, gain: gain, delay: delay, a: a || 0.02 });
      tone({ f: f * 1.003, dur: dur, gain: gain * 0.6, delay: delay, a: a || 0.02 });   // léger chorus
    });
  }
  // Déchirure : crissement de l’aluminium (micro-craquements) + petit tic qui monte avec la progression
  SFX.grain = function (k) {
    k = k || 0;
    noise({ f: 2600 + Math.random() * 2600, q: 2.5, dur: 0.018 + Math.random() * 0.02, gain: 0.09 });
    noise({ f: 1800 + Math.random() * 1500, q: 3, dur: 0.012, gain: 0.05, delay: 0.02 + Math.random() * 0.02 });
    tone({ type: 'triangle', f: 520 + k * 1100, dur: 0.03, gain: 0.018 });
  };
  // Le film cède : déchirure franche du papier + coup sourd + éclat qui résonne
  SFX.rip = function (rank) {
    rank = rank || 0;
    noise({ f: 3200, f2: 1100, q: 0.9, dur: 0.16, gain: 0.22, a: 0.002 });
    for (var i = 0; i < 5; i++) noise({ f: 2000 + Math.random() * 3000, q: 4, dur: 0.012, gain: 0.08, delay: 0.02 + i * 0.025 });
    boom(0.02, 0.26 + rank * 0.03, 0.9 + rank * 0.15);
    tone({ type: 'triangle', f: 880, f2: 1760, dur: 0.12, gain: 0.05 });
    bell(1318.5, 0.05, 0.05, 0.9);
  };
  // Mouvement d’air (carte lancée, rangée) : souffle bref et filtré
  SFX.whoosh = function (k) {
    k = k || 1;
    noise({ f: 700, f2: 2400, q: 0.8, dur: 0.18, gain: 0.05 * k, a: 0.06 });
    tone({ f: 220, f2: 420, dur: 0.18, gain: 0.012 * k, a: 0.05 });
  };
  /* Bruits de cartes */
  // La pile glisse hors du sachet : frottement carton contre aluminium
  SFX.slide = function (dur) {
    dur = dur || 0.45;
    noise({ f: 1400, f2: 2600, q: 0.7, dur: dur, gain: 0.07, a: dur * 0.5 });
    noise({ f: 4200, q: 1.5, dur: dur * 0.8, gain: 0.025, a: dur * 0.4 });
  };
  // Une carte qui se pose sur la pile : « tchk » sec
  SFX.deal = function (delay, k) {
    k = k == null ? 1 : k;
    noise({ f: 2400, f2: 1200, q: 1.1, dur: 0.07, gain: 0.08 * k, delay: delay || 0, a: 0.004 });
    noise({ type: 'lowpass', f: 700, q: 0.8, dur: 0.05, gain: 0.12 * k, delay: (delay || 0) + 0.045 });
    tone({ f: 190, f2: 120, dur: 0.06, gain: 0.05 * k, delay: (delay || 0) + 0.045 });
  };
  // Claquement de la carte qu’on retourne / qui se présente
  SFX.snap = function (delay) {
    noise({ type: 'highpass', f: 2600, q: 0.7, dur: 0.035, gain: 0.12, delay: delay || 0 });
    noise({ f: 900, q: 1.4, dur: 0.05, gain: 0.07, delay: (delay || 0) + 0.01 });
  };
  // Le corps du sachet tombe
  SFX.drop = function () {
    noise({ f: 900, f2: 300, q: 0.8, dur: 0.4, gain: 0.05, a: 0.12 });
    tone({ f: 110, f2: 50, dur: 0.35, gain: 0.12, delay: 0.32 });
  };
  // Le sachet contient une carte numérotée : arpège qui monte depuis l’ouverture
  SFX.numbered = function (rank) {
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093].slice(0, 3 + rank).forEach(function (f, i) { bell(f, 0.05 + i * 0.07, 0.05 + rank * 0.006, 1.4); });
  };
  // Le numéro s’imprime : coup de sceau grave + éclat
  SFX.seal = function (rank) {
    tone({ f: 96, f2: 48, dur: 0.45, gain: 0.26, a: 0.003 });
    bell([1318.5, 1318.5, 1567.98, 1760, 2093, 2093][rank] || 1318.5, 0.03, 0.05, 1.1);
  };
  SFX.land = function () { tone({ f: 120, f2: 52, dur: 0.3, gain: 0.3 }); };
  SFX.flip = function () { SFX.snap(); tone({ type: 'triangle', f: 520, f2: 780, dur: 0.05, gain: 0.025 }); };
  SFX.pop = function () { tone({ f: 540, f2: 820, dur: 0.12, gain: 0.07 }); };
  SFX.tick = function () { tone({ f: 2400, dur: 0.025, gain: 0.025 }); };
  // Annonce du tirage (« /25 exemplaires ») : coup sourd feutré + deux notes suspendues
  SFX.tease = function (rank) {
    tone({ f: 98, f2: 70, dur: 0.6, gain: 0.14, wet: 0.5 });
    bell(392, 0.05, 0.05, 1.4); bell(587.33, 0.2, 0.045, 1.6);
    if (rank >= 3) noise({ f: 300, f2: 2400, q: 1, dur: 0.9, gain: 0.03, a: 0.8 });
  };
  // Verrouillage d’un chiffre du numéro : déclic métallique de plus en plus aigu
  SFX.lock = function (i, n) {
    var f = [880, 1174.66, 1567.98, 1975.53][Math.min(3, i + (4 - n))] || 1318.5;
    SFX.snap();
    tone({ type: 'triangle', f: f, dur: 0.09, gain: 0.06 });
    bell(f, 0.01, 0.035, 0.5);
  };
  // Carte qui tourne sur elle-même : souffle qui accélère
  SFX.whirl = function (d) {
    noise({ f: 400, f2: 3200, q: 1.4, dur: d, gain: 0.06, a: d * 0.7 });
    tone({ f: 110, f2: 330, dur: d, gain: 0.05, a: d * 0.8 });
    for (var i = 0; i < 8; i++) noise({ f: 1800, q: 2, dur: 0.03, gain: 0.03 + i * 0.006, delay: d * (1 - Math.pow(0.78, i + 1)) });
  };
  // Grand final Unique / Mythique : double impact, accord tenu très large, scintillement qui retombe
  SFX.mega = function (lite) {
    boom(0, 0.5, 2.4); boom(0.16, 0.32, 1.8);
    brass(lite ? [110, 164.81, 220, 329.63, 440] : [130.81, 196, 261.63, 392, 523.25, 659.25], 0.06, lite ? 0.045 : 0.055, lite ? 3 : 4.2);
    var top = lite ? [1760, 2093, 2637] : [2093, 2637, 3135.96, 3951.07];
    for (var i = 0; i < (lite ? 10 : 18); i++) bell(top[i % top.length] * (i % 2 ? 1 : 0.5), 0.2 + i * 0.11, 0.025, 1.1);
  };
  // Charge d’une grande carte : une note qui monte
  SFX.charge = function (rank, dur) {
    tone({ f: 160, f2: 520 + rank * 90, dur: dur, gain: 0.07, a: dur * 0.85 });
    tone({ type: 'triangle', f: 80, f2: 240, dur: dur, gain: 0.05, a: dur * 0.85 });
    tone({ f: 330, f2: 990 + rank * 120, dur: dur, gain: 0.025, a: dur * 0.9 });
    noise({ f: 600, f2: 5000, q: 1.2, dur: dur, gain: 0.03, a: dur * 0.9 });              // montée d’énergie
    for (var i = 0; i < 6; i++) tone({ f: 70, dur: 0.12, gain: 0.04 + i * 0.02, delay: dur * (0.25 + i * 0.12), a: 0.003 });   // battements de cœur qui accélèrent
  };
  /* Révélation selon la rareté :
     0 commune  : un « ding » discret
     1 rare     : deux notes qui montent
     2 épique   : arpège rapide + étincelle aiguë
     3 légendaire : arpège doré + accord tenu qui scintille
     4 mythique : coup grave + arpège + grand accord
     5 unique   : idem, plus haut et plus long */
  SFX.reveal = function (rank) {
    if (rank === 0) { bell(659.25, 0, 0.06, 0.7); return; }
    if (rank === 1) { tone({ f: 130, f2: 70, dur: 0.5, gain: 0.12, wet: 0.4 }); bell(659.25, 0, 0.09, 1.1); bell(987.77, 0.1, 0.09, 1.3); return; }
    if (rank === 2) {
      boom(0, 0.18, 0.9);
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { bell(f, i * 0.06, 0.08, 1.3); });
      bell(2093, 0.28, 0.04, 0.9);
      return;
    }
    // Légendaire et plus : impact grave + fanfare de cuivres
    boom(0, rank >= 4 ? 0.42 : 0.32, rank >= 4 ? 2 : 1.5);
    brass(rank === 4 ? [110, 164.81, 220, 277.18] : [130.81, 196, 261.63, 329.63], 0.04, rank >= 5 ? 0.05 : 0.04, rank >= 4 ? 3 : 2.4);
    var arp = rank === 3 ? [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]
      : rank === 4 ? [440, 523.25, 659.25, 880, 1046.5, 1318.5, 1760]
      : [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093, 2637];
    arp.forEach(function (f, i) { bell(f, i * 0.055, 0.075, 1.6); });
    var end = arp.length * 0.055;
    var top = rank === 4 ? [440, 554.37, 659.25, 880] : [523.25, 659.25, 783.99, 1046.5];
    chord(top, end, rank >= 5 ? 0.03 : 0.024, rank >= 4 ? 2.6 : 2.0, 0.08);
    [0, 0.16, 0.3, 0.5].forEach(function (d, i) { bell(top[3] * 2 * [1, 1.5, 1.25, 2][i], end + d, 0.03, 0.8); });   // scintillement
  };

  /* ---------- Vibrations (mobile Android) ---------- */
  A.haptic = function (p) { try { if (!SFX.muted && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignore */ } };

  /* ---------- Particules ---------- */
  var sprites = {};
  function glowSprite(c) {
    if (sprites[c]) return sprites[c];
    var s = document.createElement('canvas'); s.width = s.height = 64;
    var x = s.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.12, c);
    gr.addColorStop(0.35, hexA(c, 0.35));
    gr.addColorStop(0.65, hexA(c, 0.08));
    gr.addColorStop(1, hexA(c, 0));
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return (sprites[c] = s);
  }
  function hexA(c, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec(c);
    if (!m) return 'rgba(255,255,255,' + a + ')';
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  A.fx = function (canvas) {
    var g = canvas.getContext('2d');
    var parts = [], raf = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    }
    size();
    window.addEventListener('resize', size);

    function loop() {
      var W = window.innerWidth, H = window.innerHeight, now = performance.now();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      parts = parts.filter(function (p) { return now - p.t0 < p.life; });
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.grav;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        var k = 1 - (now - p.t0) / p.life;
        if (p.shape === 'foil') {
          g.globalCompositeOperation = 'source-over';
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
          g.scale(1, Math.cos(p.rot * 2.3));
          g.globalAlpha = Math.min(1, k * 1.6);
          g.fillStyle = p.c; g.fillRect(-p.s, -p.s * 0.45, p.s * 2, p.s * 0.9);
          g.restore();
        } else {
          // point de lumière diffus (dégradé radial pré-rendu) : aucun bord de cercle visible
          g.globalCompositeOperation = 'lighter';
          var r = p.s * (0.4 + 0.6 * k);
          var tw = 0.65 + 0.35 * Math.sin(now / 90 + p.ph);
          var R = r * 4.2;
          g.globalAlpha = k * tw;
          g.drawImage(glowSprite(p.c), p.x - R, p.y - R, R * 2, R * 2);
        }
      }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      raf = parts.length ? requestAnimationFrame(loop) : 0;
    }

    return {
      /* o : { x, y, n, colors, shape, speed, angle, spread, grav, drag, life, size, ring, w } */
      burst: function (o) {
        var now = performance.now();
        for (var i = 0; i < o.n; i++) {
          var a = (o.angle == null ? -Math.PI / 2 : o.angle) + (Math.random() - 0.5) * (o.spread == null ? Math.PI * 2 : o.spread);
          var sp = (o.speed || 3) * (0.35 + Math.random() * 0.9);
          var x = o.x + (o.w ? (Math.random() - 0.5) * o.w : 0), y = o.y;
          if (o.ring) { var rr = o.ring * (0.6 + Math.random() * 0.5); x += Math.cos(a) * rr; y += Math.sin(a) * rr * 1.3; }
          parts.push({
            x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            grav: o.grav == null ? 0.08 : o.grav, drag: o.drag || 0.975,
            rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35, ph: Math.random() * 6.28,
            s: (o.size || 2) * (0.5 + Math.random()), c: o.colors[Math.floor(Math.random() * o.colors.length)],
            shape: o.shape || 'dust', life: (o.life || 1200) * (0.6 + Math.random() * 0.5), t0: now + Math.random() * (o.stagger || 0)
          });
        }
        if (!raf) raf = requestAnimationFrame(loop);
      },
      destroy: function () { window.removeEventListener('resize', size); if (raf) cancelAnimationFrame(raf); parts = []; }
    };
  };
})(window.ATLAS);
