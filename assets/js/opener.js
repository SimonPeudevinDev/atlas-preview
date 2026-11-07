/* ==========================================================================
   ATLAS — Ouverture de booster
   --------------------------------------------------------------------------
   Séquence :
     1. Arrivée du sachet (rotation 3D, atterrissage), un reflet parcourt la
        ligne pointillée pour inviter au geste
     2. Déchirure au geste : glisser le long de la ligne (ou clic / Entrée).
        La caméra avance, le fond s’assombrit ; à l’arrachage, flash et
        faisceaux de la couleur de la meilleure carte
     3. Les cartes sortent du sachet et se rangent en pile, le sachet tombe
     4. Révélation carte par carte (moteur à ressorts, voir « Révélation ») :
        toucher pour retourner, glisser pour lancer, toucher pour ranger.
        Les cartes rares se chargent avant de se révéler.
     5. Récapitulatif
   Le tirage est effectué (côté « serveur ») dès le début de la déchirure :
   les cartes sont acquises même si l’on ferme la fenêtre.
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui, SFX = A.sfx;
  var O = A.opener = {};
  // Windows « animations désactivées » est ignoré ici : l’ouverture est l’expérience centrale du site
  var reduce = false;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Couleur de la lumière de chaque rareté (franche : on doit la reconnaître dès la déchirure)
  var GLOW = { base: '#F4E7C8', rare: '#58A6FF', epic: '#A866FF', legendary: '#FFC23A', mythic: '#FF3B2F', unique: '#FFE6A0' };
  var DUST = [0, 18, 30, 44, 54, 64];
  var TINT = [0, 0.22, 0.34, 0.5, 0.62, 0.72];
  var SND_ON = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>';
  var SND_OFF = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>';

  function rankOf(it) { return A.R[A.ED[it.ed].rarity].rank; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function ease(k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? Math.min(ms, 80) : ms); }); }
  function center(r) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  O.open = function (packId) {
    var pack = A.PACK[packId];
    var check = S.canOpen(packId);
    if (!check.ok) { U.toast(check.reason, 'error'); return; }
    SFX.unlock();

    var proxies = '';
    for (var i = 0; i < Math.min(pack.size, 4); i++) proxies += '<div class="psc" style="--i:' + i + '">' + U.cardBack(pack.theme) + '</div>';

    var el = document.createElement('div');
    el.className = 'opener t-' + pack.theme;
    el.innerHTML =
      '<div class="op-tint"></div><div class="op-aura"></div><div class="op-dim"></div>' +
      '<div class="op-top">' +
        '<button class="op-icon" data-sound aria-label="Activer ou couper le son">' + (SFX.muted ? SND_OFF : SND_ON) + '</button>' +
        '<div class="op-head"><p class="eyebrow">' + pack.kicker + '</p><h2 class="op-title">' + pack.name + '</h2></div>' +
        '<button class="op-icon" data-close aria-label="Fermer">' + U.icon('close') + '</button>' +
      '</div>' +
      '<div class="op-stage">' +
        '<div class="op-halo"></div>' +
        '<div class="op-pack">' + A.pack.html(pack, { stack: proxies }) + '</div>' +
        '<div class="rv-stack"></div>' +
      '</div>' +
      '<div class="op-label" aria-live="polite"></div>' +
      '<div class="op-bottom">' +
        '<p class="op-hint">' + (fine ? 'Glissez le long de la ligne pointillée pour ouvrir · ou cliquez' : 'Glissez le long de la ligne pour ouvrir') + '</p>' +
        '<div class="op-prog" hidden></div>' +
        '<button class="btn btn-ghost-light btn-sm" data-skip hidden>Tout révéler</button>' +
      '</div>' +
      '<div class="op-summary" hidden></div>' +
      '<div class="op-flash"></div>' +
      '<canvas class="op-fx"></canvas>';
    document.getElementById('overlay-root').appendChild(el);
    document.body.classList.add('no-scroll');
    void el.offsetWidth;
    el.classList.add('is-in');

    var fx = A.fx(el.querySelector('.op-fx'));
    var pk = el.querySelector('.pk');
    var stage = el.querySelector('.op-stage');
    var stack = el.querySelector('.rv-stack');
    var label = el.querySelector('.op-label');
    var hint = el.querySelector('.op-hint');
    var prog = el.querySelector('.op-prog');
    var skipBtn = el.querySelector('[data-skip]');
    var summaryEl = el.querySelector('.op-summary');
    var flashEl = el.querySelector('.op-flash');
    var dimEl = el.querySelector('.op-dim');   // --otp / --dimk posés sur lui seul : pas de recalcul de tout l’écran à chaque image

    var phase = 'pack', entering = !reduce, items = null, closed = false;
    var tp = 0, dir = 0, lastGrain = 0, drag = null;
    var unlocked = [], newDuels = [];

    function setHint(t) { hint.textContent = t; hint.classList.toggle('is-empty', !t); }
    function flash(a) {
      if (reduce) return;
      flashEl.style.setProperty('--flash', a);
      flashEl.classList.remove('is-on'); void flashEl.offsetWidth; flashEl.classList.add('is-on');
    }
    function ring(x, y, scale, color) {
      if (reduce) return;
      var r = document.createElement('i');
      r.className = 'op-ring';
      r.style.left = x + 'px'; r.style.top = y + 'px';
      r.style.setProperty('--ring-s', scale);
      if (color) r.style.setProperty('--glow', color);
      el.appendChild(r);
      setTimeout(function () { r.remove(); }, 1100);
    }

    /* ---------- 1. Arrivée ---------- */
    // Un seul ressort pilote le sachet (rotation, flottement, secousses) : voir pack.js
    var rig = A.pack.rig(pk, { rx: 0, ry: 0, range: [14, 24], idle: false, stiff: 0.07, damp: 0.8 });
    function guide(on) { pk.classList.toggle('is-guide', on && !reduce); }
    if (entering) {
      rig.enter(1050, function () { entering = false; rig.shake(5, 260); guide(true); });
      setTimeout(function () { if (closed) return; SFX.land(); A.haptic(12); }, 720);
    } else guide(true);
    function settle() { rig.release(); rig.idle(false); rig.rest(0, 0); }

    /* ---------- Fermeture ---------- */
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey);
      rig.destroy();
      fx.destroy();
      if (loopRaf) cancelAnimationFrame(loopRaf);
      el.classList.remove('is-in');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { el.remove(); }, 450);
      if (items && phase !== 'summary') U.toast(items.length + ' cartes ajoutées à votre inventaire');
      A.app.rerender();
    }

    /* ---------- 2. Déchirure ---------- */
    function commit() {
      if (items) return true;
      var res = S.openPack(packId);
      if (!res.ok) { U.toast(res.error, 'error'); close(); return false; }
      items = res.items.sort(function (a, b) { return rankOf(a) - rankOf(b); });
      unlocked = res.unlocked || []; newDuels = res.duels || [];
      // Préchargement : les illustrations tirées (niveau « carte ») partent dès la déchirure,
      // elles sont décodées avant d’être révélées une à une
      if (A.media) A.media.preload(items.map(function (it) { return it.ed; }), 240);
      // Les cartes-témoins du sachet deviennent les vraies cartes, face visible : ce qui sort du sachet
      // est exactement ce qu’on va voir (la carte du dessus = la première présentée)
      // Seule la carte du dessus est la vraie : les autres témoins sont des leurres crédibles (cartes Base au hasard)
      var ps = pk.querySelectorAll('.psc');
      [].forEach.call(ps, function (p, pi) {
        var it = items[ps.length - 1 - pi];
        if (!it) return;
        p.innerHTML = pi === ps.length - 1 ? U.card(it.ed, { serial: it.serial, open: false, tilt: false, ctx: 'opener', priority: true }) : U.card(decoyFor(it), { open: false, tilt: false });
      });
      // La lumière qui s’échappe du sachet trahit la meilleure carte
      var g = GLOW[A.ED[items[items.length - 1].ed].rarity];
      el.style.setProperty('--glow', g);
      pk.setAttribute('data-glow', g);                 // l’intérieur du sachet s’éclaire de cette couleur (pack3d.js)
      A.app.refreshChrome();
      return true;
    }

    function tearPoint(p) {
      var b = pk.getBoundingClientRect();
      var x = dir >= 0 ? b.left + b.width * p : b.right - b.width * p;
      return { x: x, y: b.top + b.height * 0.14, w: b.width, b: b };
    }
    // La déchirure suit le doigt avec un léger retard amorti : elle avance d’un mouvement continu, sans à-coups
    var tpGoal = 0, tpRaf = 0, tpT = 0;
    function followTp(p) {
      tpGoal = p;
      if (tpRaf) return;
      tpT = performance.now();
      tpRaf = requestAnimationFrame(function step(now) {
        tpRaf = 0;
        if (closed || phase !== 'pack') return;
        var dt = Math.min(50, Math.max(1, now - tpT)); tpT = now;
        var np = tp + (tpGoal - tp) * (1 - Math.exp(-dt / 70));
        if (Math.abs(tpGoal - np) < 0.0015) np = tpGoal;
        setTp(np);
        if (np !== tpGoal) tpRaf = requestAnimationFrame(step);
      });
    }
    function stopFollow() { if (tpRaf) { cancelAnimationFrame(tpRaf); tpRaf = 0; } }
    var lastDust = 0;
    function setTp(p) {
      // Paillettes : en continu le long de la déchirure (petites et fréquentes)
      if (p < lastDust) lastDust = p;
      while (p - lastDust >= 0.035) {
        lastDust += 0.035;
        var pt = tearPoint(lastDust);
        fx.burst({ x: pt.x, y: pt.y, n: 1, colors: [el.style.getPropertyValue('--glow') || GLOW.base, '#FFFFFF'], shape: 'dust', speed: 0.7, angle: -Math.PI / 2, spread: 1.4, grav: 0.02, life: 420, size: 0.8 });
      }
      // Son et vibration : un petit « tic » régulier qui monte avec la progression
      if (p < lastGrain) lastGrain = Math.floor(p / 0.06) * 0.06;
      while (p - lastGrain >= 0.06) {
        lastGrain += 0.06;
        SFX.grain(lastGrain); A.haptic(3);
      }
      tp = p;
      if (pk._gl && pk._gl.setTp) pk._gl.setTp(p); else pk.style.setProperty('--tp', p.toFixed(3));
      dimEl.style.setProperty('--otp', p.toFixed(3));
    }
    function setDir(d) {
      dir = d;
      pk.classList.remove('dir-l', 'dir-r');
      if (d) { pk.classList.add(d > 0 ? 'dir-r' : 'dir-l', 'is-tearing'); el.classList.add('is-tearing'); guide(false); }
    }
    function animateTp(to, ms, done) {
      var from = tp, t0 = performance.now();
      (function step() {
        var k = clamp((performance.now() - t0) / ms, 0, 1);
        var e = to > from ? k * k * (3 - 2 * k) : 1 - Math.pow(1 - k, 3);
        setTp(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step); else if (done) done();
      })();
    }
    function autoTear() {
      if (phase !== 'pack' || entering) return;
      if (!commit()) return;
      phase = 'tearing';
      settle();
      if (!dir) setDir(1);
      setHint('');
      animateTp(1, reduce ? 50 : 560, finishTear);
    }

    async function finishTear() {
      phase = 'opening';
      setTp(1);
      setHint('');
      pk.classList.add('is-torn');
      el.classList.add('is-torn');
      var best = rankOf(items[items.length - 1]);
      var glow = el.style.getPropertyValue('--glow') || GLOW.base;
      SFX.rip(best); A.haptic(28);
      if (!reduce) { rig.shake(9, 420); rig.impulse(-1.6, dir * 2.4); }
      var pt = tearPoint(0.5);
      flash(0.35 + best * 0.08);
      beams(pt, best);
      // Étincelles de la couleur de la meilleure carte ; une carte numérotée les fait monter en colonne
      fx.burst({ x: pt.x, y: pt.y, w: pt.w * 0.7, n: 8 + best * 5, colors: [glow, '#FFFFFF'], shape: 'dust', speed: 2, angle: -Math.PI / 2, spread: 1.1, grav: -0.012, life: 1600, size: 1.4 });
      if (best >= 1) {
        fx.burst({ x: pt.x, y: pt.y, w: pt.w * 0.5, n: 10 + best * 5, colors: [glow, '#FFF4D6'], shape: 'dust', speed: 3.2, angle: -Math.PI / 2, spread: 0.35, grav: -0.03, drag: 0.985, life: 2200, size: 1.2, stagger: 600 });
        SFX.numbered(best);
      }

      await wait(300);
      if (closed) return;
      settle();
      pk.classList.add('is-emerging');
      SFX.slide(0.6);
      await wait(reduce ? 300 : 700);                // la pile monte, le corps descend (pack3d.js : EMERGE)
      if (!closed) handoff();
    }
    // Faisceaux de lumière qui jaillissent de l’ouverture
    function beams(pt, best) {
      if (reduce) return;
      var b = document.createElement('div');
      b.className = 'op-beams';
      b.style.left = pt.x + 'px'; b.style.top = pt.y + 'px';
      b.style.setProperty('--beam-a', (0.22 + best * 0.07).toFixed(2));
      b.style.setProperty('--beam-d', (1.3 + best * 0.18).toFixed(2) + 's');
      el.appendChild(b);
      void b.offsetWidth; b.classList.add('is-on');
      setTimeout(function () { b.remove(); }, 2600);
    }

    /* ======================================================================
       3–4. Révélation
       Chaque carte a un état (position, échelle, inclinaison, retournement)
       animé par des ressorts dans une seule boucle. Les retournements et les
       charges suivent une chronologie, puis les ressorts reprennent la main :
       aucun conflit entre animations CSS et gestes.
       ====================================================================== */
    var cards = [], cur = 0, busy = false, sw = null, hover = null, loopRaf = 0, lastT = 0, nextDust = 0;
    var KEYS = ['x', 'y', 'z', 'rz', 's', 'tx', 'ty'];

    /* Leurre : une carte Base du même booster, tirée au hasard (une fois par carte), affichée tant que la carte
       est sous la pile. Elle a l’air d’une vraie carte ; la vraie face n’apparaît qu’au moment où l’on soulève celle du dessus. */
    var decoys = {};
    function decoyFor(it) {
      if (decoys[it.uid]) return decoys[it.uid];
      var pool = A.EDITIONS.filter(function (e) { return e.rarity === 'base' && pack.collections.indexOf(A.CHAR[e.charId].coll) !== -1 && e.id !== it.ed; });
      return (decoys[it.uid] = pool[Math.floor(Math.random() * pool.length)].id);
    }
    function cardHTML(it, i) {
      var ed = A.ED[it.ed];
      return '<div class="rv-card r-' + ed.rarity + '" data-i="' + i + '" style="--cg:' + GLOW[ed.rarity] + ';z-index:' + (50 - i) + '">' +
        '<div class="rv-tilt"><div class="rv-flip">' +
          '<div class="rv-face rv-back">' + U.cardBack(pack.theme) + '</div>' +
          '<div class="rv-face rv-front">' + U.card(it.ed, { serial: it.serial, open: false, tilt: false, newBadge: it._new, firstBadge: it.first, ctx: 'opener', priority: i < 2 }) +
            '<span class="rv-holo"></span><span class="rv-glare"></span><span class="rv-sweep"></span><span class="rv-edge"></span>' +
            (i > 0 ? '<div class="rv-decoy">' + U.card(decoyFor(it), { open: false, tilt: false }) + '</div>' : '') + '</div>' +
        '</div></div></div>';
    }
    function mk(it, i) {
      var c = { it: it, i: i, ed: A.ED[it.ed], r: rankOf(it), state: 'stack', st: {}, v: {}, tg: {}, ry: 180, k: 0 };
      c.el = stack.querySelector('.rv-card[data-i="' + i + '"]');
      c.tilt = c.el.querySelector('.rv-tilt'); c.flip = c.el.querySelector('.rv-flip');
      c.glare = c.el.querySelector('.rv-glare'); c.holo = c.el.querySelector('.rv-holo');
      c.css = {};
      KEYS.forEach(function (k) { c.st[k] = k === 's' ? 1 : 0; c.v[k] = 0; c.tg[k] = c.st[k]; });
      return c;
    }
    // Pile : légèrement en désordre, comme un vrai paquet
    var JIT = [0, -1.8, 1.4, -0.9, 1.1, -1.4];
    function layout() {
      cards.forEach(function (c) {
        if (c.state === 'out') return;
        var d = c.i - cur;
        c.tg.x = d ? JIT[d % JIT.length] * 2 : 0;
        c.tg.y = d * 7;
        c.tg.z = -d * 16;
        c.tg.rz = d ? JIT[(d + 2) % JIT.length] : 0;
        c.tg.s = 1 - d * 0.018;
        c.el.style.opacity = d > 3 ? '0' : '1';
        c.el.classList.toggle('is-under', d > 0);          // les cartes du dessous restent floues : pas de spoil
      });
    }
    // N’écrit que ce qui a changé : une carte immobile ne coûte plus rien au navigateur
    function put(c, key, node, prop, val) {
      if (c.css[key] === val) return;
      c.css[key] = val;
      if (prop === 'transform') node.style.transform = val; else node.style.setProperty(prop, val);
    }
    function draw(c) {
      var s = c.st;
      put(c, 'm', c.el, 'transform', 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,' + s.z.toFixed(1) + 'px) rotate(' + s.rz.toFixed(2) + 'deg) scale(' + s.s.toFixed(3) + ')');
      put(c, 't', c.tilt, 'transform', 'rotateX(' + s.tx.toFixed(1) + 'deg) rotateY(' + s.ty.toFixed(1) + 'deg)');
      put(c, 'f', c.flip, 'transform', 'rotateY(' + c.ry.toFixed(1) + 'deg)');
    }
    function spring(c, f, K, D) {
      KEYS.forEach(function (k) {
        c.v[k] = (c.v[k] + (c.tg[k] - c.st[k]) * K * f) * Math.pow(D, f);
        c.st[k] += c.v[k] * f;
      });
    }
    function loop(now) {
      loopRaf = 0;
      if (closed) return;
      var f = clamp((now - (lastT || now)) / 16.67, 0, 3) || 1; lastT = now;
      var top = cards[cur];
      cards.forEach(function (c) {
        if (c.state === 'gone') return;
        if (c.state === 'wait') {
          if (now >= c.t0) {
            // la carte quitte le sachet : petit envol en arc, puis elle claque sur la pile
            c.state = 'stack'; c.v.y = -7; c.v.z = 6; c.v.rz = (Math.random() - 0.5) * 4;
            SFX.deal(0.24, 0.55 + Math.random() * 0.3);
            if (c.i === 0) setTimeout(function () { if (!closed) A.haptic(8); }, 260);
          } else { draw(c); return; }
        }
        if (c.state === 'charging') charging(c, now);
        else if (c.state === 'out') { outFrame(c, now, f); return; }
        else if (c.state === 'drag') { /* la position suit le doigt (pointermove) */ }
        else {
          if (c === top && c.state === 'shown') aim(c, now);
          if (c.spin) {                                     // tour sur elle-même (Mythique, Unique)
            var sk = clamp((now - c.spin.t0) / c.spin.d, 0, 1);
            c.ry = 180 + c.spin.turns * 360 * (1 - Math.pow(1 - sk, 3));
            if (sk >= 1) { c.ry = 180; c.spin = null; }
          }
          spring(c, f, c.state === 'shown' ? 0.1 : 0.085, 0.74);
        }
        draw(c);
      });
      // Poussière dorée qui monte derrière les cartes rares
      if (top && top.state === 'shown' && top.r >= 2 && now > nextDust && !reduce) {
        nextDust = now + 520 - top.r * 70;
        var b = top.el.getBoundingClientRect();
        fx.burst({ x: b.left + b.width / 2, y: b.bottom - b.height * 0.1, w: b.width * 1.3, n: 1 + (top.r >= 4 ? 1 : 0), colors: [GLOW[top.ed.rarity], '#FFF6DE'], shape: 'dust', speed: 0.7, angle: -Math.PI / 2, spread: 0.6, grav: -0.008, drag: 0.995, life: 2600, size: 1 + top.r * 0.15 });
      }
      loopRaf = requestAnimationFrame(loop);
    }
    function run() { if (!loopRaf && !closed) { lastT = 0; loopRaf = requestAnimationFrame(loop); } }

    /* Inclinaison de la carte révélée : suit la souris, sinon se balance doucement */
    function aim(c, now) {
      if (hover) {
        c.tg.tx = (0.5 - hover.y) * 20; c.tg.ty = (hover.x - 0.5) * 26;
        put(c, 'gx', c.glare, '--gx', (hover.x * 100).toFixed(0) + '%');
        put(c, 'gy', c.glare, '--gy', (hover.y * 100).toFixed(0) + '%');
        put(c, 'go', c.glare, '--go', '1');
      } else {
        var t = now / 1000;
        c.tg.tx = Math.sin(t * 0.8) * 3; c.tg.ty = Math.sin(t * 0.55) * 7;
        put(c, 'gx', c.glare, '--gx', (50 + c.st.ty * 3).toFixed(0) + '%');
        put(c, 'gy', c.glare, '--gy', (30 - c.st.tx * 3).toFixed(0) + '%');
        put(c, 'go', c.glare, '--go', '.55');
      }
      put(c, 'hx', c.holo, '--hx', (c.st.ty * -2.2 + c.st.tx * 1.2).toFixed(1) + '%');
    }

    /* Les cartes sortent du sachet face visible. Quand une carte passe sur le dessus, elle se présente :
       petit sursaut puis l’effet de sa rareté. Légendaire et plus : un instant de charge d’abord
       (tremblement croissant, bords qui s’embrasent, particules aspirées). */
    function charging(c, now) {
      var k = clamp((now - c.c0) / c.cd, 0, 1), a = 1 + 6 * k * k;
      c.el.style.setProperty('--charge', k.toFixed(3));
      dimEl.style.setProperty('--dimk', (k * (c.r >= 4 ? 0.65 : 0.4)).toFixed(3));
      c.st.x = (Math.random() - 0.5) * a; c.st.y = (Math.random() - 0.5) * a * 0.6;
      c.st.rz = (Math.random() - 0.5) * a * 0.4; c.st.s = 1 + 0.05 * easeOut(k); c.st.z = 24 * k;
      if (now > (c.nextPull || 0)) {
        c.nextPull = now + 110;
        var b = c.el.getBoundingClientRect(), p = center(b);
        fx.burst({ x: p.x, y: p.y, n: 4 + Math.round(k * 6), colors: [GLOW[c.ed.rarity], '#FFFFFF'], shape: 'dust', speed: -2.2 - k * 2, grav: 0, drag: 0.985, life: 520, size: 1.1, ring: b.width * (0.95 - k * 0.2) });
      }
      if (k >= 1) present(c);
    }
    function present(c) {
      c.el.classList.remove('is-anticipating', 'is-charging');
      el.classList.remove('fx-dim', 'fx-black');
      c.state = 'shown';
      KEYS.forEach(function (kk) { c.v[kk] = 0; });
      c.v.s = 0.016; c.v.z = 3;                           // petit sursaut vers l’avant, le ressort le ramène
      c.tg.x = 0; c.tg.y = 0; c.tg.z = 0; c.tg.rz = 0; c.tg.s = 1;
      if (c.r >= 5 && !reduce) { SFX.flip(); impact(c); mega(c); busy = false; hintNext(); return; }   // Unique : pas de rotation, la lumière se libère
      SFX.flip();
      impact(c);
      busy = false;
      hintNext();
    }
    function hintNext() {
      var last = cur === cards.length - 1;
      setHint(fine ? (last ? 'Cliquez ou glissez pour terminer' : 'Glissez ou cliquez pour la suivante') : (last ? 'Glissez pour terminer' : 'Glissez ou touchez pour la suivante'));
    }
    function impact(c) {
      var r = c.r, col = GLOW[c.ed.rarity], b = c.el.getBoundingClientRect(), p = center(b);
      el.style.setProperty('--glow', col);
      el.style.setProperty('--tint', TINT[r]);
      dimEl.style.setProperty('--dimk', r >= 4 ? 0.55 : r >= 3 ? 0.3 : 0);
      el.classList.toggle('fx-tint', r >= 1);
      el.classList.toggle('fx-aura', r >= 3);
      el.classList.toggle('fx-halo', r >= 1);
      c.el.classList.add('is-revealed');
      if (r >= 2) c.el.classList.add('is-holo');
      if (r >= 2) flash(0.18 + r * 0.1);
      if (r >= 1) {
        // Carte à lueur : onde de lumière, rayons qui tournent derrière, bords qui s’embrasent puis respirent
        ring(p.x, p.y, 34 + r * 14, col);
        if (r >= 3) setTimeout(function () { if (!closed) ring(p.x, p.y, 50 + r * 16, col); }, 160);
        rays(p, r, b);
        c.el.classList.remove('is-burst'); void c.el.offsetWidth; c.el.classList.add('is-burst');
        c.v.s = 0.022 + r * 0.007; c.v.z = 6 + r * 2;
      }
      if (r >= 4) { stage.classList.remove('is-quake'); void stage.offsetWidth; stage.classList.add('is-quake'); }
      if (DUST[r]) fx.burst({ x: p.x, y: p.y, n: DUST[r], colors: [col, '#FFF6DE', '#D8BC80'], shape: 'dust', speed: 2.4 + r * 0.9, grav: 0.012, drag: 0.962, life: 1500 + r * 260, size: 1.1 + r * 0.25, ring: b.width * 0.4 });
      SFX.reveal(r);
      if (r >= 3) A.haptic([30, 40, 80]); else if (r >= 1) A.haptic(14); else A.haptic(6);
      /* le numéro se déroule dans la légende (showLabel), pas sur la carte */
      showLabel(c.it);
      pip(c.i, 'is-done r-' + c.ed.rarity);
    }

    /* Final de l’Unique, en retenue : une lumière blanche douce, une onde, une gerbe d’or mesurée
       et quelques paillettes qui retombent lentement. */
    function mega(c) {
      var b = c.el.getBoundingClientRect(), p = center(b), col = GLOW[c.ed.rarity], W = window.innerWidth;
      flash(0.55);
      ring(p.x, p.y, 80, col);
      fx.burst({ x: p.x, y: p.y, n: 60, colors: [col, '#FFF6DE', '#F3D38A'], shape: 'dust', speed: 4.2, grav: 0.02, drag: 0.955, life: 1800, size: 1.3, ring: b.width * 0.35 });
      SFX.mega(true);
      A.haptic([30, 40, 70]);
    }
    function rays(p, r, b) {
      var old = el.querySelector('.op-light'); if (old) old.remove();
      var y = document.createElement('div');
      y.className = 'op-light';
      y.style.left = p.x + 'px'; y.style.top = p.y + 'px';
      y.style.setProperty('--la', (0.45 + r * 0.11).toFixed(2));
      y.style.setProperty("--fy", Math.round(b.height / 2 + 14) + "px");
      var motes = '';
      for (var i = 0; i < 4 + r; i++) {
        motes += '<i style="--x:' + (Math.random() * 100).toFixed(1) + '%;--y:' + (20 + Math.random() * 70).toFixed(1) + '%;--s:' + (2 + Math.random() * 4).toFixed(1) + 'px;--d:' +
          (5 + Math.random() * 6).toFixed(2) + 's;--dl:-' + (Math.random() * 6).toFixed(2) + 's;--dx:' + ((Math.random() - 0.5) * 60).toFixed(0) + 'px"></i>';
      }
      y.innerHTML = '<span class="ol-halo"></span><span class="ol-orbit"></span><span class="ol-floor"></span><span class="ol-motes">' + motes + '</span>';
      el.insertBefore(y, el.querySelector('.op-stage'));
      void y.offsetWidth; y.classList.add('is-on');
    }

    /* Carte numérotée : le numéro se déroule chiffre par chiffre comme un compteur mécanique,
       chaque chiffre se verrouille avec un déclic, un reflet balaie le tout, puis il se range dans la légende */
    function stamp(c, b) {
      if (reduce) return;
      var s = document.createElement('div');
      s.className = 'op-stamp r-' + c.ed.rarity;
      s.style.left = (b.left + b.width / 2) + 'px'; s.style.top = (b.top + b.height * 0.5) + 'px';
      var parts = U.serial(c.it.serial, c.ed.supply).split('/'), digs = parts[0].split(''), html = '';
      digs.forEach(function (d, i) {
        var n = 12 + i * 6 + Math.floor(Math.random() * 4), strip = '';
        for (var k = n; k >= 0; k--) strip += '<b>' + ((+d - k % 10 + 10) % 10) + '</b>';   // finit sur le bon chiffre
        html += '<span class="dg"><span class="dg-r" style="--n:' + n + ';--dd:' + (i * 0.22) + 's;--du:' + (0.9 + i * 0.25).toFixed(2) + 's">' + strip + '</span></span>';
      });
      s.innerHTML = '<span class="st-k">' + (c.ed.supply === 1 ? 'Pièce unique' : 'Exemplaire numéroté') + '</span>' +
        '<span class="st-n"><span class="st-d">' + html + '</span>' + (parts[1] ? '<span class="st-of">/' + parts[1] + '</span>' : '') + '<span class="st-glint"></span></span>';
      el.appendChild(s);
      void s.offsetWidth; s.classList.add('is-on');
      // déclic à chaque chiffre verrouillé, sceau sur le dernier
      var t0 = 260;
      digs.forEach(function (d, i) {
        var at = t0 + (i * 0.22 + 0.9 + i * 0.25) * 1000;
        setTimeout(function () {
          if (closed) return;
          var col = s.querySelectorAll('.dg')[i]; if (col) col.classList.add('is-lock');
          if (i === digs.length - 1) { SFX.seal(c.r); A.haptic(12); s.classList.add('is-sealed'); }
          else { SFX.tick(); SFX.snap(); A.haptic(4); }
        }, at);
      });
      var lockEnd = t0 + ((digs.length - 1) * 0.47 + 0.9) * 1000;
      setTimeout(function () { s.classList.add('is-out'); }, lockEnd + 700);
      setTimeout(function () { s.remove(); }, lockEnd + 1500);
    }

    /* Sortie de la carte : lancée (geste) ou rangée (toucher) */
    function throwOut(c, sign, v) {
      c.state = 'out'; c.mode = 'throw'; c.t0 = performance.now();
      c.vx = sign * Math.max(26, Math.abs(v) * 26); c.vy = -3 - Math.random() * 3; c.vr = sign * (1.4 + Math.random());
      c.el.style.zIndex = 60;
      SFX.whoosh(1.2); A.haptic(6);
      leave();
    }
    function collect(c) {
      c.state = 'out'; c.mode = 'collect'; c.t0 = performance.now();
      var a = c.el.getBoundingClientRect(), slot = prog.querySelector('[data-pip="' + c.i + '"]'), b = slot.getBoundingClientRect();
      c.from = { x: c.st.x, y: c.st.y, s: c.st.s, rz: c.st.rz };
      c.to = { x: c.st.x + (b.left + b.width / 2) - (a.left + a.width / 2), y: c.st.y + (b.top + b.height / 2) - (a.top + a.height / 2), s: 0.1 };
      c.el.style.zIndex = 60;
      SFX.whoosh(0.8);
      leave();
    }
    function outFrame(c, now, f) {
      var s = c.st;
      if (c.mode === 'throw') {
        s.x += c.vx * f; s.y += c.vy * f; c.vy += 0.6 * f; s.rz += c.vr * f; s.ty += (c.vx > 0 ? 1.2 : -1.2) * f;
        c.el.style.opacity = clamp(1 - (now - c.t0) / 600, 0, 1);
        if (now - c.t0 > 650) gone(c);
      } else {
        var k = clamp((now - c.t0) / 520, 0, 1), e = ease(k);
        s.x = lerp(c.from.x, c.to.x, e); s.y = lerp(c.from.y, c.to.y, e) - Math.sin(Math.PI * k) * 40;
        s.s = lerp(c.from.s, c.to.s, e); s.rz = lerp(c.from.rz, 0, e); s.tx = s.ty = 0;
        c.el.style.opacity = clamp(1.6 - k * 1.6, 0, 1);
        if (k >= 1) { gone(c); SFX.deal(0, 0.5); }
      }
      draw(c);
    }
    function gone(c) { c.state = 'gone'; c.el.remove(); }
    // On soulève la carte du dessus : celle de derrière montre sa vraie face (le leurre disparaît)
    function unveilNext() {
      var n = cards[cur + 1];
      if (n && !n.unveiled) { n.unveiled = true; n.el.classList.add('is-real'); }
    }
    function leave() {
      busy = true;
      clearFx();
      cur++;
      pip(cur, 'is-cur');
      if (cur >= cards.length) { setHint(''); setTimeout(summary, 650); return; }
      layout();
      setTimeout(prepareTop, 140);
    }

    function handoff() {
      var html = '';
      for (var i = items.length - 1; i >= 0; i--) html += cardHTML(items[i], i);
      stack.innerHTML = html;
      cards = items.map(mk);
      prog.innerHTML = items.map(function (it, i) { return '<i class="op-pip" data-pip="' + i + '"></i>'; }).join('');

      // Les cartes partent de leur place dans le sachet et viennent se ranger en pile, l’une après l’autre
      // (chaque carte reprend exactement la place de sa carte-témoin, déjà sortie du sachet : aucun saut)
      var proxies = [].slice.call(pk.querySelectorAll('.psc')), nP = proxies.length;
      var rects = proxies.map(function (p) { return p.getBoundingClientRect(); });
      stack.classList.add('is-on');
      var rr = stack.getBoundingClientRect();
      var s0 = pk.querySelector('.pk-stack').getBoundingClientRect().width / rr.width;   // la pile n’est pas tournée
      var now = performance.now();
      cards.forEach(function (c) {
        var pi = Math.max(0, nP - 1 - c.i), pr = rects[pi];     // la carte du dessus ↔ témoin du dessus
        c.st.x = center(pr).x - center(rr).x; c.st.y = center(pr).y - center(rr).y;
        c.st.s = s0; c.st.z = 0;
        c.st.rz = (pi - 1.5) * 0.8;
        c.state = 'wait'; c.t0 = now + 60 + (cards.length - 1 - c.i) * 115;   // la carte du dessus arrive en dernier
      });
      layout();
      pk.querySelector('.pk-stack').style.visibility = 'hidden';
      pk.classList.add('is-dropping');
      SFX.drop();
      run();

      setTimeout(function () {
        if (closed) return;
        rig.destroy();
        var wrap = el.querySelector('.op-pack'); if (wrap) wrap.remove();
        el.classList.remove('is-torn', 'is-tearing');
        dimEl.style.setProperty('--otp', 0);
        phase = 'reveal';
        prog.hidden = false; skipBtn.hidden = false;
        pip(0, 'is-cur');
        prepareTop();
      }, 900 + cards.length * 115);
    }

    function pip(i, cls) {
      var p = prog.querySelector('[data-pip="' + i + '"]'); if (!p) return;
      if (cls === 'is-cur') { var o = prog.querySelector('.is-cur'); if (o) o.classList.remove('is-cur'); }
      cls.split(' ').forEach(function (k) { p.classList.add(k); });
      if (cls.indexOf('is-done') >= 0) p.classList.remove('is-cur');
    }

    // La carte du dessus se présente d’elle-même (pas de retournement : elle est déjà face visible)
    function prepareTop() {
      var c = cards[cur];
      if (!c || c.state === 'shown' || c.state === 'charging' || c.state === 'teasing') return;
      busy = true;
      setHint('');
      // Carte numérotée : on annonce d’abord la rareté du tirage (« /25 exemplaires ») — l’attente monte
      if (c.ed.supply && !reduce) tease(c);
      if (c.r >= 3 && !reduce) {
        c.state = 'charging'; c.c0 = performance.now();
        c.cd = c.r >= 5 ? 2300 : c.r >= 4 ? 1500 : 1000;
        c.el.classList.add('is-charging');
        el.classList.add('fx-dim');
        if (c.r >= 5) el.classList.add('fx-black');
        SFX.charge(c.r, c.cd / 1000);
        A.haptic([8, 60, 8, 60, 8, 60]);
      } else if (c.ed.supply && !reduce) {
        c.state = 'teasing';
        setTimeout(function () { if (!closed && c.state === 'teasing') { c.state = 'stack'; present(c); } }, 950);
      } else present(c);
    }
    function tease(c) {
      var s = c.ed.supply;
      label.innerHTML = '<div class="op-tease r-' + c.ed.rarity + '">' +
        '<span class="tz-k">' + (s === 1 ? 'Édition' : 'Édition limitée') + '</span>' +
        '<span class="tz-n">' + (s === 1 ? '1' : '/' + s) + '</span>' +
        '<span class="tz-s">' + (s === 1 ? 'seul exemplaire au monde' : 'exemplaires au monde') + '</span></div>';
      var t = label.firstChild; void t.offsetWidth; t.classList.add('is-in');
      SFX.tease(c.r);
    }

    function showLabel(it) {
      var ed = A.ED[it.ed], ch = A.CHAR[ed.charId], R = A.R[ed.rarity];
      label.innerHTML = '<div class="ol r-' + ed.rarity + '">' +
        '<span class="ol-rar"><i></i>' + (ed.rarity === 'unique' ? 'Pièce unique' : R.label) + '<i></i></span>' +
        '<h3 class="ol-name">' + U.esc(ch.name) + '</h3>' +
        '<p class="ol-meta">' + U.esc(ch.title) + (ed.supply ? '<span class="ol-dot"></span><span class="ol-serial" data-serial>N° ' + U.serial(1, ed.supply) + '</span>' : '') + '</p>' +
        (it._new ? '<span class="ol-new">Nouveau personnage</span>' : '') +
      '</div>';
      var ol = label.firstChild;
      void ol.offsetWidth;
      ol.classList.add('is-in');
      var sEl = label.querySelector('[data-serial]');
      if (sEl) {
        // Machine à sous dans la légende : le « /25 » est déjà là, les chiffres défilent, chacun se verrouille
        // avec un déclic de plus en plus aigu, le dernier ralentit (suspense), puis le numéro explose de lumière
        var parts = U.serial(it.serial, ed.supply).split('/'), digs = parts[0].split(''), html = '', L = digs.length;
        var T = digs.map(function (d, i) { var last = i === L - 1; return { dd: 0.25 + i * 0.1, du: 0.4 + i * 0.22 + (last && L > 1 ? 0.45 : 0) }; });
        digs.forEach(function (d, i) {
          var n = 8 + i * 5 + (i === L - 1 ? 6 : 0) + Math.floor(Math.random() * 3), strip = '';
          for (var k = n; k >= 0; k--) strip += '<b>' + ((+d - k % 10 + 10) % 10) + '</b>';
          html += '<span class="dg"><span class="dg-r" style="--n:' + n + ';--dd:' + T[i].dd.toFixed(2) + 's;--du:' + T[i].du.toFixed(2) + 's">' + strip + '</span></span>';
        });
        sEl.innerHTML = '<span class="odo-k">N°</span><span class="odo-d">' + html + '</span>' + (parts[1] ? '<span class="odo-of">/' + parts[1] + '</span>' : '');
        void sEl.offsetWidth; sEl.classList.add('is-on');
        // déclics pendant le défilement (accélèrent puis ralentissent avec le dernier chiffre)
        var endT = (T[L - 1].dd + T[L - 1].du) * 1000;
        (function rollTicks(t) {
          if (closed || t > endT - 60) return;
          SFX.tick();
          var k = t / endT;
          setTimeout(function () { rollTicks(t + 45 + k * k * 160); }, 45 + k * k * 160);
        })(T[0].dd * 1000);
        digs.forEach(function (d, i) {
          setTimeout(function () {
            if (closed) return;
            var col = sEl.querySelectorAll('.dg')[i]; if (col) col.classList.add('is-lock');
            SFX.lock(i, L);
            if (i === L - 1) {
              sEl.classList.add('is-sealed');
              SFX.seal(R.rank); A.haptic([12, 30, 24]);
              var b = sEl.getBoundingClientRect(), p = center(b);
              fx.burst({ x: p.x, y: p.y, n: 26 + R.rank * 6, colors: [GLOW[ed.rarity], '#FFF6DE', '#F3D38A'], shape: 'dust', speed: 3.2, grav: 0.02, drag: 0.95, life: 1100, size: 1.1, ring: 12 });
              // numéros remarquables
              var call = it.serial === 1 && ed.supply > 1 ? 'Premier exemplaire' : it.serial === ed.supply && ed.supply > 1 ? 'Dernier exemplaire'
                : (ed.supply >= 25 && it.serial < 10) ? 'Numéro à un chiffre' : (/^(\d)\1+$/.test(String(it.serial)) && it.serial > 10) ? 'Numéro miroir' : '';
              if (call) setTimeout(function () {
                if (closed) return;
                var pill = document.createElement('span'); pill.className = 'ol-call'; pill.textContent = call;
                sEl.parentNode.parentNode.appendChild(pill); void pill.offsetWidth; pill.classList.add('is-in');
                SFX.numbered(3); A.haptic(20);
              }, 380);
            } else A.haptic(6);
          }, (T[i].dd + T[i].du) * 1000);
        });
      }
    }
    function hideLabel() { var ol = label.firstChild; if (ol) ol.classList.remove('is-in'); }
    function clearFx() {
      el.classList.remove('fx-tint', 'fx-aura', 'fx-halo', 'fx-dim', 'fx-black'); dimEl.style.setProperty('--dimk', 0); hideLabel();
      [].forEach.call(el.querySelectorAll('.op-mega'), function (m) { m.classList.add('is-off'); });
      var y = el.querySelector('.op-light'); if (y) { y.classList.add('is-off'); setTimeout(function () { y.remove(); }, 500); }
    }

    function advance() {
      if (phase !== 'reveal' || busy) return;
      var c = cards[cur]; if (!c) return;
      if (c.state === 'shown') collect(c);
    }

    /* ---------- 5. Récapitulatif ---------- */
    function summary(skip) {
      if (closed || phase === 'summary') return;
      phase = 'summary';
      clearFx();
      // cartes encore jamais vues (bouton « Tout révéler ») : distribuées face cachée, puis retournées en cascade
      var unseen = {};
      if (skip) cards.forEach(function (c) { if (c.state !== 'gone' && c.state !== 'out' && !(c.i === cur && c.state === 'shown')) unseen[c.i] = true; });
      var fromR = stack.getBoundingClientRect();
      stack.style.visibility = 'hidden';
      var newCount = items.filter(function (it) { return it._new; }).length;
      var firsts = items.filter(function (it) { return it.first; }).length;
      var bestR = A.R[A.ED[items[items.length - 1].ed].rarity];
      var again = S.canOpen(packId);
      summaryEl.innerHTML =
        '<p class="eyebrow">Booster ouvert</p><h2 class="op-title">' + items.length + ' cartes obtenues</h2>' +
        '<p class="sum-sub">' + (newCount ? newCount + (newCount > 1 ? ' nouveaux personnages' : ' nouveau personnage') + ' · ' : '') + 'Meilleure carte : ' + bestR.label + '</p>' +
        // Pas de bandeaux d’objectifs (fragments, récompenses, exploits) pendant l’ouverture : la progression se consulte dans les collections

        '<div class="sum-grid">' + items.map(function (it, i) {
          var ed = A.ED[it.ed], R = A.R[ed.rarity];
          return '<div class="sum-item r-' + ed.rarity + (i === items.length - 1 && R.rank >= 1 ? ' is-best' : '') + (unseen[i] ? ' is-down' : '') + '" data-i="' + i + '" style="--cg:' + GLOW[ed.rarity] + '">' +
            '<div class="sum-flip"><div class="sum-face">' + U.card(it.ed, { serial: it.serial, open: false, newBadge: it._new, firstBadge: it.first }) + '</div>' +
            '<div class="sum-face sum-back">' + U.cardBack(pack.theme) + '</div></div>' +
            '<p class="sum-cap"><span class="rar-chip r-' + ed.rarity + '"><i></i>' + R.label + '</span>' + (ed.supply ? '<span class="mono">' + U.serial(it.serial, ed.supply) + '</span>' : '') + '</p></div>';
        }).join('') + '</div>' +
        '<div class="sum-actions"><button class="btn btn-gold btn-lg" data-done>Ajouter à l’inventaire</button>' +
        (again.ok ? '<button class="btn btn-ghost-light btn-lg" data-again>Ouvrir un autre' + (pack.timer ? ' · ' + S.charges().n + ' en réserve' : '') + '</button>' : '') + '</div>';
      summaryEl.hidden = false;
      summaryEl.classList.add('is-dealing');
      el.classList.add('is-summary');
      setTimeout(function () { if (loopRaf) { cancelAnimationFrame(loopRaf); loopRaf = 0; } }, 500);
      dealSummary(fromR, unseen);
    }

    /* Distribution du récapitulatif : chaque carte part de la pile et vole jusqu’à sa place en arc,
       se pose avec un claquement ; les cartes jamais vues se retournent ensuite une à une
       (de la plus commune à la meilleure, qui a droit à sa révélation complète). */
    function dealSummary(fromR, unseen) {
      var els = [].slice.call(summaryEl.querySelectorAll('.sum-item'));
      // « Tout révéler » : on veut voir le butin vite, toute la séquence est accélérée
      var fast = Object.keys(unseen).length > 0;
      summaryEl.classList.toggle('is-fast', fast);
      var fc = center(fromR), gap = fast ? 45 : 85, t = fast ? 60 : 140, dur = fast ? 380 : 640;
      els.forEach(function (node, i) {
        var r = node.getBoundingClientRect(), p = center(r);
        var dx = fc.x - p.x, dy = fc.y - p.y, s0 = fromR.width / r.width, rz = (Math.random() - 0.5) * 16;
        var delay = t + i * gap;
        if (node.animate) {
          node.animate([
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s0 + ') rotate(' + (rz * 0.3) + 'deg)', opacity: 0 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s0 + ') rotate(' + (rz * 0.3) + 'deg)', opacity: 1, offset: 0.06 },
            { transform: 'translate(' + (dx * 0.35) + 'px,' + (dy * 0.35 - 70) + 'px) scale(' + (1 + (s0 - 1) * 0.3) + ') rotate(' + rz + 'deg)', offset: 0.55 },
            { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 }
          ], { duration: dur, delay: delay, easing: 'cubic-bezier(.25,.7,.25,1)', fill: 'backwards' });
        }
        setTimeout(function () {
          if (closed) return;
          node.classList.add('is-landed');
          SFX.deal(0, 0.75); A.haptic(4);
          var c = center(node.getBoundingClientRect());
          fx.burst({ x: c.x, y: c.y + r.height * 0.45, w: r.width, n: 6, colors: ['#FFF6DE', '#D8BC80'], shape: 'dust', speed: 1.2, angle: -Math.PI / 2, spread: 1.4, grav: 0.02, life: 700, size: 0.9 });
        }, delay + dur - 40);
      });
      var tEnd = t + els.length * gap + dur + 10;
      var step = fast ? 130 : 300, charge = fast ? 250 : 450;
      // retournements en cascade
      var down = els.filter(function (n) { return n.classList.contains('is-down'); });
      down.forEach(function (node, j) {
        var it = items[+node.getAttribute('data-i')], r = rankOf(it), last = j === down.length - 1;
        var at = tEnd + (fast ? 60 : 200) + j * step + (last && r >= 3 ? charge : 0);
        if (last && r >= 3) setTimeout(function () {          // la meilleure se charge avant de se retourner
          if (closed) return;
          node.classList.add('is-charging'); SFX.charge(r, 0.6); A.haptic([8, 50, 8, 50, 8]);
        }, at - charge - 200);
        setTimeout(function () { if (!closed) flipSummary(node, r, last); }, at);
      });
      var done = down.length ? tEnd + (fast ? 60 : 200) + down.length * step + 900 : tEnd;
      if (!down.length) setTimeout(function () { if (!closed) SFX.reveal(Math.min(2, rankOf(items[items.length - 1]))); }, tEnd - 200);
      setTimeout(function () { if (!closed) summaryEl.classList.remove('is-dealing'); }, done);
    }
    function flipSummary(node, r, big) {
      node.classList.remove('is-down', 'is-charging');
      node.classList.add('is-flipped');
      SFX.snap();
      var b = node.getBoundingClientRect(), p = center(b), col = GLOW[A.ED[items[+node.getAttribute('data-i')].ed].rarity];
      if (r >= 1) {
        ring(p.x, p.y, 16 + r * 8, col);
        fx.burst({ x: p.x, y: p.y, n: 8 + r * 10, colors: [col, '#FFF6DE'], shape: 'dust', speed: 1.6 + r * 0.6, grav: 0.012, drag: 0.962, life: 1100 + r * 200, size: 1 + r * 0.2, ring: b.width * 0.4 });
      }
      if (big) {
        if (r >= 2) flash(0.15 + r * 0.08);
        if (r >= 4) { summaryEl.classList.remove('is-quake'); void summaryEl.offsetWidth; summaryEl.classList.add('is-quake'); }
        SFX.reveal(r);
        A.haptic(r >= 3 ? [30, 40, 80] : 14);
      } else if (r >= 1) SFX.reveal(Math.min(r, 1));
      else bellSoft();
    }
    function bellSoft() { SFX.tick(); }

    /* « Ajouter à l’inventaire » : les cartes se rassemblent en une pile au centre (un claquement chacune),
       un sceau doré confirme l’ajout, puis la pile s’envole vers le lien Inventaire du menu, le fond
       s’efface pendant le vol, et le lien s’illumine quand elle arrive. */
    var finishing = false;
    function finishToInventory() {
      if (finishing) return;
      finishing = true;
      var els = [].slice.call(summaryEl.querySelectorAll('.sum-item'));
      summaryEl.classList.add('is-collecting');
      var W = window.innerWidth, H = window.innerHeight, cx = W / 2, cy = H / 2, gap = 32;                       // animation rapide : environ deux fois plus courte
      var target = document.querySelector('.nav-links a[data-nav="inventory"]'), tr = target && target.getBoundingClientRect();
      if (!tr || !tr.width) { target = document.querySelector('.avatar'); tr = target && target.getBoundingClientRect(); }
      if (!tr || !tr.width) { target = document.querySelector('#tabbar [href="#/inventaire"]'); tr = target && target.getBoundingClientRect(); }
      var tc = tr && tr.width ? center(tr) : { x: W - 60, y: 30 };
      var n = els.length;
      els.forEach(function (node, i) {
        var r = node.getBoundingClientRect(), p = center(r);
        var gx = cx - p.x, gy = cy - p.y - 20, rz = (i - (n - 1) / 2) * 2.2;
        var lift = (n - 1 - i) * -3;                         // la meilleure (dernière) finit sur le dessus
        node.style.zIndex = 10 + i;
        if (!node.animate) return;
        node.animate([
          { transform: 'none' },
          { transform: 'translate(' + gx + 'px,' + (gy + lift) + 'px) rotate(' + rz + 'deg) scale(.9)', offset: 1 }
        ], { duration: 300, delay: i * gap, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
        setTimeout(function () { if (!closed) SFX.deal(0, 0.7); }, i * gap + 270);
        // envol vers l’inventaire
        node.animate([
          { transform: 'translate(' + gx + 'px,' + (gy + lift) + 'px) rotate(' + rz + 'deg) scale(.9)' },
          { transform: 'translate(' + (gx + (tc.x - cx) * 0.25) + 'px,' + (gy + lift + 40) + 'px) rotate(' + (rz * 0.5) + 'deg) scale(.82)', offset: 0.25 },
          { transform: 'translate(' + (tc.x - p.x) + 'px,' + (tc.y - p.y) + 'px) rotate(' + (rz * 0.2 + 8) + 'deg) scale(.05)', opacity: 0.4 }
        ], { duration: 420, delay: n * gap + 560 + i * 20, easing: 'cubic-bezier(.55,0,.75,.3)', fill: 'forwards' });
      });
      // sceau de confirmation
      var t1 = n * gap + 280;
      setTimeout(function () {
        if (closed) return;
        var seal = document.createElement('div');
        seal.className = 'op-added';
        seal.style.left = cx + 'px'; seal.style.top = (cy + els[0].getBoundingClientRect().height * 0.5 + 34) + 'px';
        seal.innerHTML = '<span class="oa-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
          '<span class="oa-t">' + n + ' cartes ajoutées à l’inventaire</span>';
        el.appendChild(seal);
        void seal.offsetWidth; seal.classList.add('is-on');
        ring(cx, cy - 20, 60, '#E8C676');
        fx.burst({ x: cx, y: cy - 20, n: 40, colors: ['#F3D38A', '#FFF6DE', '#D8BC80'], shape: 'dust', speed: 3, grav: 0.02, drag: 0.96, life: 1300, size: 1.2, ring: 90 });
        SFX.seal(2); A.haptic([10, 30, 20]);
      }, t1);
      // le fond s’efface pendant que la pile s’envole
      var t2 = n * gap + 560;
      setTimeout(function () { if (!closed) { el.classList.add('is-leaving'); SFX.whoosh(1.1); } }, t2);
      setTimeout(function () {
        if (closed) return;
        close();
        setTimeout(function () {
          var t = document.querySelector('.nav-links a[data-nav="inventory"]') || document.querySelector('.avatar');
          if (t) { t.classList.remove('nav-bump'); void t.offsetWidth; t.classList.add('nav-bump'); setTimeout(function () { t.classList.remove('nav-bump'); }, 1300); }
          SFX.pop();
        }, 60);
      }, t2 + 420 + n * 20);
    }

    /* ---------- Interactions ---------- */
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      // Carte révélée : inclinaison et reflet
      if (phase === 'reveal' && !sw && cards[cur]) {
        var r = cards[cur].el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        hover = x > -0.35 && x < 1.35 && y > -0.25 && y < 1.25 ? { x: clamp(x, 0, 1), y: clamp(y, 0, 1) } : null;
      }
    });
    el.addEventListener('pointerleave', function () { hover = null; if (phase === 'pack' && !drag) rig.release(); });

    // Geste de déchirure
    // le geste peut commencer n’importe où sur l’écran (pas seulement sur le sachet) : on peut prendre de l’élan
    el.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a')) return;
      if (phase !== 'pack' || entering) return;
      settle();
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), v: 0, onPack: !!e.target.closest('.pk') };
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    el.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!dir && Math.abs(dx) > 8) {
        if (!commit()) return;
        setDir(dx > 0 ? 1 : -1);
        setHint('');
      }
      if (!dir) return;
      var w = pk.getBoundingClientRect().width;
      followTp(clamp(dx * dir / (w * 0.85), 0, 1));
      var now = performance.now();
      drag.v = (e.clientX - drag.lx) * dir / Math.max(1, now - drag.lt);
      drag.lx = e.clientX; drag.lt = now;
    });
    function endDrag(e) {
      if (!drag) return;
      var d = drag; drag = null;
      if (phase !== 'pack') return;
      stopFollow();
      if (!dir) {
        if (d.onPack && Math.abs(e.clientX - d.x) < 8 && Math.abs(e.clientY - d.y) < 8) autoTear();
        /* le sachet reste de face */
        return;
      }
      var reach = Math.max(tp, tpGoal);
      if (reach > 0.55 || (reach > 0.2 && d.v > 0.5)) { phase = 'tearing'; animateTp(1, 220, finishTear); }
      else {
        animateTp(0, 320, function () { setDir(0); pk.classList.remove('is-tearing'); el.classList.remove('is-tearing'); guide(true); });
        setHint('Encore un peu… glissez jusqu’au bout');
      }
    }
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    // Pile de cartes : glisser pour lancer, toucher pour ranger (la suivante se présente aussitôt)
    var PEEK = 0.11;                                     // décalage visible maximal, en part de la largeur de carte
    function rubber(d, max) { return (d < 0 ? -1 : 1) * max * (1 - Math.exp(-Math.abs(d) / max)); }
    stack.addEventListener('pointerdown', function (e) {
      if (phase !== 'reveal' || busy) return;
      var c = cards[cur];
      if (!c || !c.el.contains(e.target)) return;
      sw = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), v: 0, c: c, shown: c.state === 'shown', moved: false, ox: c.st.x, oy: c.st.y };
      try { stack.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      // Appui long : la petite description du personnage s’affiche sur la carte
      if (sw.shown) { var s0 = sw; s0.holdT = setTimeout(function () { if (sw === s0 && !s0.moved) { s0.held = true; showInfo(c, true); } }, 420); }
    });
    function showInfo(c, on) {
      U.infoToggle(c.el.querySelector('.rv-front'), c.ed.id, on);
      if (on) A.haptic(6);
    }
    stack.addEventListener('pointermove', function (e) {
      if (!sw) return;
      var dx = e.clientX - sw.x, dy = e.clientY - sw.y, c = sw.c;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) { sw.moved = true; clearTimeout(sw.holdT); }
      if (sw.held) return;                                // appui long en cours : la carte ne bouge pas
      if (!sw.shown || !sw.moved) return;
      if (c.state !== 'drag') unveilNext();
      c.state = 'drag';
      // Coup d’œil limité : la carte résiste au-delà d’un petit décalage, pour entrevoir le cadre
      // (la rareté) de la suivante sans la dévoiler. Le lancer se juge toujours sur le geste réel.
      var pw = c.el.offsetWidth * PEEK, vx = rubber(dx, pw), vy = rubber(dy * 0.4, pw * 0.35);
      c.st.x = sw.ox + vx; c.st.y = sw.oy + vy; c.st.rz = vx * 0.05;
      c.st.ty = clamp(vx * 0.09, -24, 24); c.st.tx = clamp(-vy * 0.12, -10, 10);
      draw(c);
      var now = performance.now();
      sw.v = (e.clientX - sw.lx) / Math.max(1, now - sw.lt);
      sw.lx = e.clientX; sw.lt = now;
    });
    function endSwipe(e) {
      if (!sw) return;
      var s = sw; sw = null;
      var dx = e.clientX - s.x, c = s.c;
      clearTimeout(s.holdT);
      if (s.held) { showInfo(c, false); return; }          // fin de l’appui long : on cache la description
      if (!s.shown) return;
      if (Math.abs(dx) > 90 || (Math.abs(dx) > 30 && Math.abs(s.v) > 0.55)) throwOut(c, dx > 0 ? 1 : -1, s.v);
      else if (!s.moved) collect(c);
      else { c.state = 'shown'; }                        // le ressort la ramène au centre
    }
    stack.addEventListener('pointerup', endSwipe);
    stack.addEventListener('pointercancel', function () { if (sw) { clearTimeout(sw.holdT); if (sw.held) showInfo(sw.c, false); if (sw.c.state === 'drag') sw.c.state = 'shown'; sw = null; } });
    stack.addEventListener('contextmenu', function (e) { if (phase === 'reveal') e.preventDefault(); });

    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { close(); return; }
      if (e.target.closest('[data-sound]')) {
        SFX.setMuted(!SFX.muted);
        e.target.closest('[data-sound]').innerHTML = SFX.muted ? SND_OFF : SND_ON;
        if (!SFX.muted) SFX.pop();
        return;
      }
      if (e.target.closest('[data-skip]')) {
        if (phase === 'reveal') { busy = true; summary(true); }
        return;
      }
      if (e.target.closest('[data-done]')) { finishToInventory(); return; }
      if (e.target.closest('[data-again]')) { close(); setTimeout(function () { O.open(packId); }, 480); }
    });

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowRight') return;
      if (e.target.closest && e.target.closest('button')) return;
      e.preventDefault();
      if (phase === 'pack') autoTear();
      else if (phase === 'reveal') advance();
    }
    document.addEventListener('keydown', onKey);
  };
})(window.ATLAS);
