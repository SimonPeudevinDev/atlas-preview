/* ==========================================================================
   ATLAS — Pages
   Chaque page expose render(ctx) → HTML et mount(root, ctx).
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui;
  var P = A.pages = {};
  var I = U.icon;

  function sectionHead(eyebrow, title, link) {
    return '<div class="section-head"><div><p class="eyebrow">' + eyebrow + '</p><h2 class="h2">' + title + '</h2></div>' +
      (link ? '<a class="link-arrow" href="' + link[1] + '">' + link[0] + ' ' + I('arrow') + '</a>' : '') + '</div>';
  }
  function collTile(c, opts) {
    opts = opts || {};
    var pr = S.collectionProgress(c.id);
    return '<a class="coll-tile' + (opts.cls ? ' ' + opts.cls : '') + '" href="#/collection/' + c.id + '">' +
      '<div class="coll-art">' + (opts.art || A.artImg({ seed: c.id + '-banner', coll: c.id, rarity: c.status === 'event' ? 'legendary' : 'base', w: 640, h: 300 })) +
      (c.status === 'event' ? '<span class="tag tag-gold">Nouvelle collection</span>' : '') +
      (S.readyCount(c.id) ? '<span class="tag tag-reward">' + U.icon('gift') + 'Récompense à récupérer</span>' : '') + '</div>' +
      '<div class="coll-meta"><p class="eyebrow">' + c.family + ' · ' + c.edition + '</p><h3 class="coll-name">' + c.name + '</h3>' +
      '<p class="coll-tag">' + c.tagline + '</p>' +
      U.progress(pr.pct, '<span>' + pr.owned + ' / ' + pr.total + ' personnages</span><span>' + Math.round(pr.pct * 100) + ' %</span>') + nextReward(c.id) + '</div></a>';
  }
  // Prochain palier encore verrouillé, pour donner un objectif sur la tuile
  function nextReward(cid) {
    var s = S.rewards(cid).filter(function (x) { return x.state === 'locked'; })[0];
    if (!s) return '';
    var left = s.goal - s.have, unit = s.of === 'chars' ? 'personnage' : 'édition';
    return '<p class="coll-next">' + U.rewardIcon(s.reward) + 'Encore ' + left + ' ' + unit + (left > 1 ? 's' : '') + ' pour : ' + U.esc(U.rewardText(s.reward)) + '</p>';
  }
  /* Étagère : une collection globale = une ligne compacte (nom, progression) + ses sous-collections
     en petites vignettes qui défilent à l’horizontale. La page tient en quelques écrans. */
  function shelfTile(c) {
    var pr = S.collectionProgress(c.id), done = pr.pct >= 1;
    return '<a class="shelf-tile' + (done ? ' is-done' : '') + '" href="#/collection/' + c.id + '">' +
      '<div class="st-art">' + A.artImg({ seed: c.id + '-banner', coll: c.id, rarity: c.status === 'event' ? 'legendary' : 'base', w: 320, h: 200 }) +
        (S.readyCount(c.id) ? '<span class="st-badge is-reward" title="Récompense à récupérer">' + U.icon('gift') + '</span>' : done ? '<span class="st-badge is-done" title="Complète">' + U.icon('check') + '</span>' : '') +
        (c.status === 'event' ? '<span class="st-new">Nouveau</span>' : '') + '</div>' +
      '<h3 class="st-name">' + U.esc(c.name) + '</h3>' +
      '<p class="st-n"><span>' + pr.owned + '/' + pr.total + '</span><i style="--p:' + Math.round(pr.pct * 100) + '%"></i></p></a>';
  }
  function shelf(head, subs) {
    return '<section class="shelf">' + head + '<div class="shelf-row">' + subs.map(shelfTile).join('') + '</div></section>';
  }
  // Jauge de complétion : le pourcentage en grand chiffre doré ; un laurier à 100 %
  function gauge(pct) {
    var p = Math.round(pct * 100);
    return p >= 100 ? '<span class="g-pct is-full">' + I('laurel') + '<small>Complète</small></span>'
      : '<span class="g-pct"><b>' + p + '<em> %</em></b><small>complété</small></span>';
  }
  function groupBlock(g, subs) {
    var pr = S.groupProgress(g.id), ready = S.readyCount('@' + g.id) || subs.some(function (c) { return S.readyCount(c.id); });
    return shelf('<a class="shelf-head" href="#/saga/' + g.id + '">' +
      '<div class="sh-copy"><h2 class="sh-name">' + U.esc(g.name) + '</h2>' +
        '<p class="sh-meta">' + pr.owned + '/' + pr.total + ' personnages · ' + pr.done + '/' + pr.subs + ' complètes' + (ready ? '<br><b>' + U.icon('gift') + 'Récompense à récupérer</b>' : '') + '</p></div>' +
      gauge(pr.pct) + I('chevR') + '</a>', subs);
  }

  function globe() {
    var o = '<svg class="globe" viewBox="0 0 600 600" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7">';
    o += '<circle cx="300" cy="300" r="280"/>';
    for (var i = 1; i < 6; i++) o += '<ellipse cx="300" cy="300" rx="' + (280 * Math.cos(i * Math.PI / 12)).toFixed(1) + '" ry="280"/>';
    for (var j = -2; j <= 2; j++) { var y = 300 + j * 95, rx = Math.sqrt(280 * 280 - (j * 95) * (j * 95)); o += '<ellipse cx="300" cy="' + y + '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.12).toFixed(1) + '"/>'; }
    return o + '<path d="M300 20v560M20 300h560" stroke-dasharray="2 5"/></g></svg>';
  }

  /* ======================================================================
     ACCUEIL
     ====================================================================== */
  /* ---------- Accueil : les boosters, comme dans un jeu ----------
     Le Booster Atlas revient toutes les 15 min (10 en réserve), le quotidien chaque jour,
     les autres se gagnent en jouant (missions, paliers, trophées). */
  function chargeClock(ch) { return ch.n >= ch.max ? 'Réserve pleine · un nouveau toutes les 15 min' : 'Prochain dans <b data-clock="charge">' + U.clock(ch.next) + '</b>'; }
  // Nombre de boosters à ouvrir : une pastille posée sur le coin du sachet
  function countBadge(n, label) { return '<span class="play-count' + (n ? '' : ' is-zero') + '" aria-label="' + label + '">×' + n + '</span>'; }
  function playTile(p, k) {
    var tk = S.tokens(p.id), can = S.canOpen(p.id), st;
    if (p.daily) st = can.ok ? 'Prêt à ouvrir' : 'Prochain dans <b data-clock="daily">' + U.clock(S.nextDailyIn()) + '</b>';
    else st = tk ? (tk > 1 ? tk + ' à ouvrir' : '1 à ouvrir') : 'À gagner : missions et paliers';
    return '<article class="play-tile' + (can.ok ? ' is-ready' : '') + (p.event ? ' is-event' : '') + '" data-go-slide="' + k + '">' +
      '<div class="pt-pack">' + A.pack.html(p) + (tk > 1 ? '<span class="pt-count">×' + tk + '</span>' : '') + '</div>' +
      '<div class="pt-copy"><p class="pt-k">' + p.kicker + '</p><h3 class="pt-name">' + p.name + '</h3><p class="pt-st">' + st + '</p></div>' +
      '<span class="pt-go">' + I('chevR') + '</span></article>';
  }
  function playHTML() {
    var P0 = A.PACK.standard, PD = A.PACK.daily, ch = S.charges(), can = S.canOpen(P0.id), tk = S.tokens(P0.id), pips = '';
    var dCan = S.canOpen(PD.id);
    for (var i = 0; i < ch.max; i++) pips += '<i' + (i < ch.n ? ' class="is-on"' : '') + '></i>';
    var side = [A.PACK.conservateur].concat(S.eventRemaining() > 0 ? [A.PACK.saga] : []);
    // Deux sachets côte à côte qu’on fait glisser : le Booster Atlas (réserve) et le Booster quotidien
    var atlas = '<div class="play-slide" data-slide="0">' +
        '<div class="play-pack' + (can.ok ? '"' + ' data-open-pack="' + P0.id + '"' : ' is-empty"') + '>' + A.pack.html(P0, { tilt: true }) + countBadge(ch.n + tk, ch.n + ' en réserve' + (tk ? ', ' + tk + ' offerts' : '')) + '</div>' +
        '<p class="play-clock">' + chargeClock(ch) + '</p>' +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + P0.id + '"' + (can.ok ? '' : ' disabled') + '>' +
          (can.ok ? 'Ouvrir un Booster Atlas' : 'Prochain dans <span data-clock="charge">' + U.clock(ch.next) + '</span>') + '</button>' +
        (A.multi && A.multi.count(P0.id) >= 2 ? '<button class="play-many" data-open-many="' + P0.id + '">' + I('cards') + 'Ouvrir les ' + A.multi.count(P0.id) + ' d’un coup</button>' : '') +
        '<p class="play-note">5 cartes · jusqu’à ' + ch.max + ' en réserve</p></div>';
    var daily = '<div class="play-slide" data-slide="1">' +
        '<div class="play-pack' + (dCan.ok ? '"' + ' data-open-pack="' + PD.id + '"' : ' is-empty"') + '>' + A.pack.html(PD, { tilt: true }) + '</div>' +
        '<p class="play-day">' + (dCan.ok ? '<b>Prêt à ouvrir</b>' : 'Déjà ouvert aujourd’hui') + '</p>' +
        '<p class="play-clock">' + (dCan.ok ? 'Un nouveau chaque jour' : 'Prochain dans <b data-clock="daily">' + U.clock(S.nextDailyIn()) + '</b>') + '</p>' +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + PD.id + '"' + (dCan.ok ? '' : ' disabled') + '>' +
          (dCan.ok ? 'Ouvrir le Booster quotidien' : 'Prochain dans <span data-clock="daily">' + U.clock(S.nextDailyIn()) + '</span>') + '</button>' +
        '<p class="play-note">' + PD.size + ' cartes offertes, une fois par jour</p></div>';
    // Coffret, Saga : même présentation en grand quand on les choisit
    var SHORT = { conservateur: 'Coffret', saga: 'Saga' };
    var extra = side.map(function (p, j) {
      var c = S.canOpen(p.id), n = S.tokens(p.id), many = A.multi ? A.multi.count(p.id) : 0;
      return '<div class="play-slide" data-slide="' + (j + 2) + '">' +
        '<div class="play-pack' + (c.ok ? '"' + ' data-open-pack="' + p.id + '"' : ' is-empty"') + '>' + A.pack.html(p, { tilt: true }) + (n ? countBadge(n, n + ' à ouvrir') : '') + '</div>' +
        '<p class="play-day">' + (n ? '<b>' + (n > 1 ? n + ' à ouvrir' : '1 à ouvrir') + '</b>' : 'À gagner en jouant') + '</p>' +
        '<p class="play-clock">' + (n ? p.kicker : 'Missions et paliers de collection') + '</p>' +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + p.id + '"' + (c.ok ? '' : ' disabled') + '>' + (c.ok ? 'Ouvrir le ' + SHORT[p.id] : 'Aucun ' + SHORT[p.id].toLowerCase() + ' à ouvrir') + '</button>' +
        (many >= 2 ? '<button class="play-many" data-open-many="' + p.id + '">' + I('cards') + 'Ouvrir les ' + many + ' d’un coup</button>' : '') +
        '<p class="play-note">' + p.size + ' cartes · ' + p.kicker + '</p></div>';
    }).join('');
    // Sélecteur : une tuile par booster (mini sachet, nom, état)
    // Sélecteur sobre : des onglets texte de largeur fixe, un trait sous l’actif, un point quand il y a de quoi ouvrir
    function pick(p, k, name, ready) {
      return '<button class="pick-b' + (k ? '' : ' is-on') + '" data-go="' + k + '" role="tab" aria-label="' + p.name + (ready ? ', prêt' : '') + '">' +
        name + (ready ? '<i class="pick-dot"></i>' : '') + '</button>';
    }
    var picker = '<div class="pick" role="tablist" style="--n:' + (2 + side.length) + '">' +
      pick(P0, 0, 'Atlas', ch.n > 0) + pick(PD, 1, 'Quotidien', dCan.ok) +
      side.map(function (p, j) { return pick(p, j + 2, SHORT[p.id], S.tokens(p.id) > 0); }).join('') +
      '<span class="pick-bar"></span></div>';
    return '<section class="play"><div class="container play-grid">' +
      '<div class="play-main">' +
        '<p class="eyebrow">Vos boosters</p>' +
        picker +
        '<div class="play-slides">' + atlas + daily + extra + '</div>' +
        (S.UNLIMITED ? '<button class="play-reset" data-dev-refill>' + I('reset') + 'Tout recharger (test)</button>' : '') +
      '</div>' +
    '</div></section>';
  }

  /* Défilement automatique d’une rangée horizontale (en boucle), seulement quand elle est visible
     et qu’elle déborde ; il s’arrête dès qu’on la touche et repart 8 s plus tard */
  function autoSlide(row, every) {
    if (!row || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var visible = false, holdUntil = 0;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting && en[0].intersectionRatio > 0.5; }, { threshold: [0, 0.5, 1] }).observe(row);
    ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { row.addEventListener(ev, function () { holdUntil = Date.now() + 8000; }, { passive: true }); });
    var t = setInterval(function () {
      if (!row.isConnected) { clearInterval(t); return; }
      if (!visible || Date.now() < holdUntil || row.scrollWidth <= row.clientWidth + 4 || document.querySelector('.opener')) return;
      var f = row.firstElementChild, gap = parseFloat(getComputedStyle(row).columnGap) || 0, w = f.offsetWidth + gap;
      var atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      row.scrollTo({ left: atEnd ? 0 : Math.round(row.scrollLeft / w + 1) * w, behavior: 'smooth' });
    }, every);
  }

  /* Page d’accueil déconnectée : la présentation d’ATLAS et « Comment ça marche »
     (le hub des boosters est réservé aux joueurs connectés) */
  P.landingHTML = function () {
      var feat = S.ownedOf('grece-zeus-legendary')[0];
      var steps = [
        ['I', 'Découvrir', 'Parcourez des collections consacrées aux mythologies, aux contes, à la littérature et à l’histoire. Chaque personnage possède sa notice.'],
        ['II', 'Collectionner', 'Ouvrez les boosters offerts toutes les 15 minutes et chaque jour, complétez vos collections et traquez les éditions numérotées les plus rares.'],
        ['III', 'Échanger', 'Négociez avec d’autres collectionneurs ou achetez sur la marketplace. Chaque exemplaire conserve sa provenance.']
      ];
      return '<div class="landing">' +
      '<section class="hero h-hero">' +
        '<div class="container hero-grid">' +
          '<div class="hero-copy reveal">' +
            '<p class="eyebrow">Musée numérique de cartes à collectionner</p>' +
            '<h1 class="display">Le monde,<br><em>en cartes.</em></h1>' +
            '<p class="lead">Des dieux de l’Olympe aux héroïnes des contes, ATLAS réunit les grandes figures de la culture en œuvres numérotées que l’on découvre, collectionne et échange.</p>' +
            '<div class="row gap-s wrap"><button class="btn btn-primary btn-lg" data-login>Se connecter</button></div>' +
            '<p class="so-note">' + I('lock') + 'Prototype : connexion simulée, aucune donnée n’est envoyée.</p>' +
            '<dl class="hero-facts"><div><dt>Collections</dt><dd>' + A.COLLECTIONS.length + '</dd></div><div><dt>Personnages</dt><dd>' + A.CHARS.length + '</dd></div><div><dt>Éditions</dt><dd>' + A.EDITIONS.length + '</dd></div></dl>' +
          '</div>' +
          '<div class="hero-visual">' + globe() +
            '<div class="hero-stack">' +
              '<div class="hs hs-l">' + U.card('egypte-anubis-epic', { serial: 41, tilt: false }) + '</div>' +
              '<div class="hs hs-r">' + U.card('merveilleux-alice-rare', { serial: 112, tilt: false }) + '</div>' +
              '<div class="hs hs-c">' + U.card('grece-zeus-legendary', { serial: 18, uid: feat && feat.uid }) + '</div>' +
            '</div>' +
            '<p class="hero-caption"><span>Zeus, Roi de l’Olympe</span><span>Légendaire · N° 018/50</span></p>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section h-steps"><div class="container">' +
        sectionHead('Comment ça marche', 'Trois gestes, une collection.') +
        '<div class="steps">' + steps.map(function (s) {
          return '<article class="step"><span class="step-n">' + s[0] + '</span><h3 class="h3">' + s[1] + '</h3><p>' + s[2] + '</p></article>';
        }).join('') + '</div>' +
        '<div class="steps-dots" aria-hidden="true">' + steps.map(function (s, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
      '</div></section>' +
      '</div>';
  };
  P.landingMount = function (root) {
    var st = root.querySelector('.steps'), dots = root.querySelectorAll('.steps-dots i');
    if (st && dots.length) st.addEventListener('scroll', function () {
      var w = st.firstElementChild ? st.firstElementChild.offsetWidth + 12 : 1, k = st.scrollLeft + st.clientWidth >= st.scrollWidth - 4 ? dots.length - 1 : Math.round(st.scrollLeft / w);
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === Math.min(k, dots.length - 1)); });
    }, { passive: true });
    autoSlide(st, 4500);
  };

  P.home = {
    title: 'Le monde, en cartes',
    mount: function (root) {
      A.pack.mountAll(root);
      // Carrousel des deux sachets : onglets synchronisés, seul le sachet affiché flotte doucement
      var slides = root.querySelector('.play-slides'), tabs = root.querySelectorAll('.pick-b'), packs = root.querySelectorAll('.play-slide .pk');
      function current() { return slides ? Math.round(slides.scrollLeft / Math.max(1, slides.firstElementChild.offsetWidth)) : 0; }
      function sync() {
        var k = current();
        tabs.forEach(function (t, i) { t.classList.toggle('is-on', i === k); });
        var pk0 = root.querySelector('.pick'); if (pk0) pk0.style.setProperty('--k', k);
        packs.forEach(function (pk, i) { if (pk._rig) pk._rig.idle(i === k); });
      }
      if (slides) {
        var st0;
        slides.addEventListener('scroll', function () { clearTimeout(st0); st0 = setTimeout(sync, 80); }, { passive: true });
        tabs.forEach(function (t) { t.addEventListener('click', function () { var k = +t.getAttribute('data-go'); slides.scrollTo({ left: k * slides.firstElementChild.offsetWidth, behavior: 'smooth' }); }); });
        // Toucher Coffret ou Saga plus bas : on remonte et le sachet passe au premier plan
        root.querySelectorAll('[data-go-slide]').forEach(function (t) { t.addEventListener('click', function () {
          var k = +t.getAttribute('data-go-slide'), top = root.querySelector('.play').getBoundingClientRect().top + window.scrollY - 60;
          if (window.scrollY > top + 10) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          slides.scrollTo({ left: k * slides.firstElementChild.offsetWidth, behavior: 'smooth' });
        }); });
        sync();
      }
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-to-top]')) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        if (e.target.closest('[data-dev-refill]')) { S.devRefill(); U.toast('Tous les boosters sont rechargés (test)'); A.app.rerender(); return; }
        var m = e.target.closest('[data-open-many]');
        if (m) { var id = m.getAttribute('data-open-many'); A.multi.open(id, A.multi.count(id)); return; }
        var t = e.target.closest('[data-open-pack]');
        if (t) A.opener.open(t.getAttribute('data-open-pack'));
      });
      // Carrousel « Comment ça marche » : le point actif suit l’étape visible
      var st = root.querySelector('.steps'), dots = root.querySelectorAll('.steps-dots i');
      if (st && dots.length) st.addEventListener('scroll', function () {
        var w = st.firstElementChild ? st.firstElementChild.offsetWidth + 12 : 1, k = st.scrollLeft + st.clientWidth >= st.scrollWidth - 4 ? dots.length - 1 : Math.round(st.scrollLeft / w);
        dots.forEach(function (d, i) { d.classList.toggle('is-on', i === Math.min(k, dots.length - 1)); });
      }, { passive: true });
      autoSlide(st, 4500);
      // Carrousels de grandes cartes (collections populaires, à venir) : points synchronisés
      [['.pop-row:not(.up-row)', '.pop-dots:not(.up-dots) i'], ['.up-row', '.up-dots i']].forEach(function (q) {
        var pr = root.querySelector(q[0]), pd = root.querySelectorAll(q[1]);
        if (!pr || !pd.length) return;
        pr.addEventListener('scroll', function () {
          var w = pr.firstElementChild ? pr.firstElementChild.offsetWidth + 12 : 1, k = pr.scrollLeft + pr.clientWidth >= pr.scrollWidth - 4 ? pd.length - 1 : Math.round(pr.scrollLeft / w);
          pd.forEach(function (d, i) { d.classList.toggle('is-on', i === Math.min(k, pd.length - 1)); });
        }, { passive: true });
        autoSlide(pr, 5000);
      });
      // Raretés (mobile) : la carte du centre en avant, les voisines plus petites et estompées
      var rr = root.querySelector('.rarity-row');
      if (rr && window.matchMedia && matchMedia('(max-width: 900px)').matches) {
        var ri = [].slice.call(rr.children), rd = root.querySelectorAll('.rar-dot'), rraf = 0;
        var center = function (i) { return ri[i].offsetLeft + ri[i].offsetWidth / 2 - rr.clientWidth / 2; };
        var upd = function () {
          rraf = 0;
          var c = rr.scrollLeft + rr.clientWidth / 2, best = 0, bd = 1e9;
          ri.forEach(function (it, i) {
            var d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - c) / it.offsetWidth;
            it.style.setProperty('--d', Math.min(1, d).toFixed(3));
            if (d < bd) { bd = d; best = i; }
          });
          ri.forEach(function (it, i) { it.classList.toggle('is-on', i === best); });
          rd.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
        };
        rr.addEventListener('scroll', function () { if (!rraf) rraf = requestAnimationFrame(upd); }, { passive: true });
        rd.forEach(function (d) { d.addEventListener('click', function () { rr.dispatchEvent(new Event('pointerdown')); rr.scrollTo({ left: center(+d.getAttribute('data-rar')), behavior: 'smooth' }); }); });
        rr.scrollLeft = center(Math.min(3, ri.length - 1));   // on commence sur la Légendaire
        upd();
      }
      autoSlide(rr, 3200);
      // Comptes à rebours ; quand un booster arrive (ou le quotidien revient), on redessine la page
      var n0 = S.charges().n, d0 = S.dailyAvailable();
      var tick = setInterval(function () {
        if (!root.isConnected || !root.querySelector('.play')) { clearInterval(tick); return; }
        if (document.querySelector('.opener')) return;
        var ch = S.charges();
        if (ch.n !== n0 || S.dailyAvailable() !== d0) { clearInterval(tick); A.app.rerender(); return; }
        root.querySelectorAll('[data-clock="charge"]').forEach(function (el) { el.textContent = U.clock(ch.next); });
        root.querySelectorAll('[data-clock="daily"]').forEach(function (el) { el.textContent = U.clock(S.nextDailyIn()); });
        root.querySelectorAll('[data-clock="daily-s"]').forEach(function (el) { el.textContent = U.clock(S.nextDailyIn()).replace(' min', ''); });
      }, 1000);
    },
    render: function () {
      var popular = A.COLLECTIONS.filter(function (c) { return c.popular; }).sort(function (a, b) { return a.popular - b.popular; }).slice(0, 3);
      var event = A.COLLECTIONS.find(function (c) { return c.status === 'event'; });

      return playHTML() +
      '<section class="section section-alt h-coll"><div class="container">' +
        sectionHead('Collections populaires', 'Les collections les plus visitées.', ['Toutes les collections', '#/collections']) +
        '<div class="coll-grid is-desk">' + popular.map(function (c) { return collTile(c); }).join('') + '</div>' +
        // mobile : grandes cartes au format de l’événement, qui défilent (l’événement en tête)
        '<div class="pop-row is-mob">' + [event].concat(popular.filter(function (c) { return c.id !== event.id; })).map(function (c) {
          var pr = S.collectionProgress(c.id), ev = c.id === event.id, done = pr.pct >= 1, gift = S.readyCount(c.id);
          return '<a class="event-banner pop-card" href="#/collection/' + c.id + '">' +
            '<div class="event-art">' + (ev ? A.artImg({ seed: 'event-hero', coll: c.id, rarity: 'legendary', w: 900, h: 300 }) : A.artImg({ seed: c.id + '-banner', coll: c.id, rarity: 'base', w: 900, h: 300 })) +
              (gift ? '<span class="st-badge is-reward" title="Récompense à récupérer">' + U.icon('gift') + '</span>' : '') + '</div>' +
            '<div class="event-copy"><p class="eyebrow">' + (ev ? 'Nouvelle collection · Événement' : 'Collection populaire') + '</p><h3 class="h2">' + U.esc(c.name) + '</h3><p>' + c.tagline + '</p>' +
              '<div class="pop-foot"><span class="link-arrow">Explorer ' + I('arrow') + '</span>' +
              '<span class="pop-n' + (done ? ' is-done' : '') + '">' + pr.owned + '/' + pr.total + '<i style="--p:' + Math.round(pr.pct * 100) + '%"></i></span></div></div></a>';
        }).join('') + '</div>' +
        '<div class="steps-dots pop-dots is-mob" aria-hidden="true">' + [event].concat(popular.filter(function (c) { return c.id !== event.id; })).map(function (c, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
        '<a class="event-banner is-desk" href="#/collection/' + event.id + '">' +
          '<div class="event-art">' + A.artImg({ seed: 'event-hero', coll: event.id, rarity: 'legendary', w: 900, h: 300 }) + '</div>' +
          '<div class="event-copy"><p class="eyebrow">Nouvelle collection · Événement</p><h3 class="h2">' + event.name + '</h3><p>' + event.tagline + '</p>' +
          '<span class="link-arrow">Explorer la collection ' + I('arrow') + '</span></div></a>' +
      '</div></section>' +

      '<section class="section h-rar"><div class="container">' +
        sectionHead('Six raretés', 'Une même figure, six œuvres.') +
        '<p class="section-lead">Chaque personnage existe en plusieurs éditions illustrées. La rareté tient à l’œuvre et au tirage, jamais à la puissance.</p>' +
        '<div class="rarity-row">' + A.RARITIES.map(function (r) {
          return '<figure class="rarity-item">' + U.card('grece-zeus-' + r.id, { serial: r.supply ? Math.min(7 + r.rank * 3, r.supply) : null, open: true }) +
            '<figcaption><span class="rar-chip r-' + r.id + '"><i></i>' + r.label + '</span><span class="muted small">' + (r.supply ? (r.supply === 1 ? 'Pièce unique' : r.supply + ' exemplaires') : 'Tirage illimité') + '</span></figcaption></figure>';
        }).join('') + '</div>' +
        '<div class="rar-dots is-mob" role="tablist">' + A.RARITIES.map(function (r, i) { return '<button class="rar-dot r-' + r.id + '" data-rar="' + i + '" aria-label="' + r.label + '"></button>'; }).join('') + '</div>' +
      '</div></section>' +

      '<section class="section section-dark h-trade"><div class="container trade-grid">' +
        '<div class="trade-copy"><p class="eyebrow">Échanges & marketplace</p><h2 class="h2">Chaque carte a une histoire.</h2>' +
          '<p class="lead">Comme dans une maison de ventes, chaque exemplaire numéroté garde sa provenance : tirage, propriétaires, prix de cession.</p>' +
          '<ul class="checklist">' +
            '<li>' + I('swap') + '<span><b>Échanges entre collectionneurs</b> confirmés par les deux parties avant exécution.</span></li>' +
            '<li>' + I('market') + '<span><b>Marketplace à prix fixe</b> en Éclats, monnaie fictive non convertible.</span></li>' +
            '<li>' + I('shield') + '<span><b>Transferts sécurisés</b> : séquestre, traçabilité et protection contre la duplication.</span></li>' +
          '</ul>' +
          '<a class="btn btn-gold" href="#/marketplace">Visiter la marketplace</a></div>' +
        '<div class="trade-visual">' +
          '<div class="tv-card">' + U.card('gothique-dracula-legendary', { serial: 12 }) + '<p>Ombre_de_Rhodes</p></div>' +
          '<div class="tv-swap">' + I('swap') + '</div>' +
          '<div class="tv-card">' + U.card('histoire-napoleon-epic', { serial: 33 }) + '<p>Vous</p></div>' +
        '</div>' +
      '</div></section>' +

      '<section class="section h-up"><div class="container">' +
        sectionHead('Prochainement', 'Les collections à venir.') +
        // mobile : mêmes grandes cartes que les collections populaires
        '<div class="pop-row up-row is-mob">' + A.UPCOMING.map(function (u) {
          return '<div class="event-banner pop-card is-soon"><div class="event-art">' + A.artImg({ seed: u.id, coll: 'x', rarity: 'base', motif: u.motif, w: 900, h: 300 }) + '</div>' +
            '<div class="event-copy"><p class="eyebrow">' + u.date + ' · ' + u.family + '</p><h3 class="h2">' + u.name + '</h3><p>' + u.desc + '</p>' +
            '<div class="pop-foot"><span class="soon-tag">' + I('clock') + 'En préparation</span></div></div></div>';
        }).join('') + '</div>' +
        '<div class="steps-dots pop-dots up-dots is-mob" aria-hidden="true">' + A.UPCOMING.map(function (u, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
        '<div class="upcoming is-desk">' + A.UPCOMING.map(function (u) {
          return '<article class="up-item"><div class="up-art">' + A.artImg({ seed: u.id, coll: 'x', rarity: 'base', motif: u.motif, w: 480, h: 280 }) + '<span class="tag">' + u.date + '</span></div>' +
            '<p class="eyebrow">' + u.family + '</p><h3 class="h3">' + u.name + '</h3><p class="muted">' + u.desc + '</p></article>';
        }).join('') + '</div>' +
      '</div></section>' +

      '<section class="section cta h-cta"><div class="container cta-inner">' + U.mark('cta-mark') +
        '<h2 class="h2">Vos boosters vous attendent.</h2><p class="lead">Un Booster Atlas toutes les 15 minutes, trois cartes chaque jour, et des coffrets à gagner. Sans paiement.</p>' +
        '<button class="btn btn-primary btn-lg" data-to-top>' + I('arrow') + 'Remonter aux boosters</button></div></section>';
    }
  };

  /* ======================================================================
     COLLECTIONS (galerie)
     ====================================================================== */
  var cf = { universe: 'all', q: '', missing: false };
  P.collections = {
    title: 'Collections',
    render: function () {
      var unis = ['all'].concat(A.COLLECTIONS.map(function (c) { return c.universe; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      return '<section class="page-head"><div class="container">' +
        '<p class="eyebrow">Galerie</p><h1 class="h1">Collections</h1>' +
        '<p class="lead">' + A.COLLECTIONS.length + ' collections ouvertes, ' + A.CHARS.length + ' figures à collectionner, et d’autres à venir. Chaque collection rassemble les figures d’un même univers.</p>' +
        '<div class="toolbar">' +
          '<div class="chips" data-f="universe">' + unis.map(function (u) { return '<button class="chip' + (cf.universe === u ? ' is-active' : '') + '" data-v="' + u + '">' + (u === 'all' ? 'Tous les univers' : u) + '</button>'; }).join('') + '</div>' +
          '<div class="toolbar-end">' +
            '<label class="toggle"><input type="checkbox" data-missing' + (cf.missing ? ' checked' : '') + '><span></span>Collections incomplètes</label>' +
            '<label class="search">' + I('search') + '<input type="search" placeholder="Rechercher un personnage…" value="' + U.esc(cf.q) + '" data-q></label>' +
          '</div>' +
        '</div></div></section>' +
        '<section class="section-tight"><div class="container"><div data-results></div></div></section>' +
        '<section class="section section-alt"><div class="container">' + sectionHead('Prochainement', 'En préparation') +
        '<div class="upcoming">' + A.UPCOMING.map(function (u) {
          return '<article class="up-item"><div class="up-art">' + A.artImg({ seed: u.id, coll: 'x', rarity: 'base', motif: u.motif, w: 480, h: 280 }) + '<span class="tag">' + u.date + '</span></div><p class="eyebrow">' + u.family + '</p><h3 class="h3">' + u.name + '</h3><p class="muted">' + u.desc + '</p></article>';
        }).join('') + '</div></div></section>';
    },
    mount: function (root) {
      var res = root.querySelector('[data-results]');
      function draw() {
        var q = cf.q.trim().toLowerCase();
        var list = A.COLLECTIONS.filter(function (c) {
          if (cf.universe !== 'all' && c.universe !== cf.universe) return false;
          if (cf.missing && S.collectionProgress(c.id).pct >= 1) return false;
          return true;
        });
        var html = '';
        if (q) {
          var chars = A.CHARS.filter(function (ch) { return ch.name.toLowerCase().indexOf(q) !== -1 || ch.title.toLowerCase().indexOf(q) !== -1; })
            .filter(function (ch) { return list.some(function (c) { return c.id === ch.coll; }); });
          html = '<p class="result-count">' + chars.length + ' personnage' + (chars.length > 1 ? 's' : '') + ' trouvé' + (chars.length > 1 ? 's' : '') + '</p>' +
            (chars.length ? '<div class="card-grid">' + chars.map(function (ch) {
              var best = S.bestOwned(ch.id);
              return '<div class="cg-item">' + U.card(best ? best.ed : ch.id + '-base', { serial: best && best.serial, uid: best && best.uid, missing: !best }) + U.editionDots(ch.id) + '</div>';
            }).join('') + '</div>' : '<div class="empty">Aucun personnage ne correspond à « ' + U.esc(cf.q) + ' ».</div>');
        } else {
          var shown = {};
          html = (A.GROUPS || []).map(function (g) {
            var subs = list.filter(function (c) { return c.group === g.id; });
            subs.forEach(function (c) { shown[c.id] = true; });
            return subs.length ? groupBlock(g, subs) : '';
          }).join('');
          var rest = list.filter(function (c) { return !shown[c.id]; });
          if (rest.length) html += shelf('<div class="shelf-head"><div class="sh-copy"><h2 class="sh-name">Autres collections</h2></div></div>', rest);
          if (!list.length) html = '<div class="empty">Toutes les collections de cet univers sont complètes. Bravo !</div>';
        }
        res.innerHTML = html;
      }
      draw();
      root.addEventListener('click', function (e) {
        var c = e.target.closest('[data-f="universe"] .chip');
        if (!c) return;
        cf.universe = c.getAttribute('data-v');
        root.querySelectorAll('[data-f="universe"] .chip').forEach(function (b) { b.classList.toggle('is-active', b === c); });
        draw();
      });
      root.querySelector('[data-q]').addEventListener('input', function (e) { cf.q = e.target.value; draw(); });
      root.querySelector('[data-missing]').addEventListener('change', function (e) { cf.missing = e.target.checked; draw(); });
      this.refresh = draw;
    }
  };

  /* ======================================================================
     COLLECTION GLOBALE (ex. Mythologie grecque = Olympe + Titans + Géants)
     ====================================================================== */
  P.saga = {
    title: 'Collection globale',
    render: function (ctx) {
      var g = A.GROUP[ctx.params[0]];
      if (!g) return '<section class="page-head"><div class="container"><h1 class="h1">Collection introuvable</h1><a class="link-arrow" href="#/collections">Retour aux collections ' + I('arrow') + '</a></div></section>';
      this.title = g.name;
      var pr = S.groupProgress(g.id);
      return '<section class="coll-hero">' +
        '<div class="coll-hero-art">' + A.artImg({ seed: g.id + '-saga', coll: g.subs[0], rarity: 'legendary', w: 1400, h: 520 }) + '</div>' +
        '<div class="container coll-hero-copy">' +
          '<a class="back" href="#/collections">← Collections</a>' +
          '<p class="eyebrow">Collection globale · ' + g.subs.length + ' sous-collections</p>' +
          '<h1 class="h1">' + U.esc(g.name) + '</h1><p class="lead">' + U.esc(g.description) + '</p>' +
          '<div class="coll-stats" data-saga-stats>' + sagaStats(pr) + '</div>' +
        '</div></section>' +
        '<section class="section-tight rw-sec"><div class="container" data-rewards>' + U.rewardTrack('@' + g.id) + '</div></section>' +
        '<section class="section-tight"><div class="container"><p class="eyebrow">Sous-collections</p>' +
          '<div class="coll-grid is-full" data-subs>' + g.subs.map(function (cid) { return collTile(A.COLL[cid]); }).join('') + '</div></div></section>' +
        (U.duelSetsFor('@' + g.id).length ? '<section class="section-tight du-sec"><div class="container" data-duels>' + U.duelSetsFor('@' + g.id).map(U.duelsHTML).join('') + '</div></section>' : '');
    },
    mount: function (root, ctx) {
      var g = A.GROUP[ctx.params[0]];
      if (!g) return;
      root.addEventListener('click', function (e) {
        var k = e.target.closest('[data-claim]');
        if (!k) return;
        var res = S.claim('@' + g.id, k.getAttribute('data-claim'));
        if (!res.ok) { U.toast(res.error, 'error'); return; }
        U.toast(res.step.label + ' : ' + U.rewardText(res.reward) + (res.reward.booster ? ' · à ouvrir dans la Boutique' : ''));
      });
      this.refresh = function () {
        root.querySelector('[data-rewards]').innerHTML = U.rewardTrack('@' + g.id);
        root.querySelector('[data-saga-stats]').innerHTML = sagaStats(S.groupProgress(g.id));
        root.querySelector('[data-subs]').innerHTML = g.subs.map(function (cid) { return collTile(A.COLL[cid]); }).join('');
        var du = root.querySelector('[data-duels]'); if (du) du.innerHTML = U.duelSetsFor('@' + g.id).map(U.duelsHTML).join('');
      };
    }
  };
  function sagaStats(pr) {
    return '<div><span>Personnages</span><b>' + pr.owned + '<small> / ' + pr.total + '</small></b></div>' +
      '<div><span>Sous-collections complètes</span><b>' + pr.done + '<small> / ' + pr.subs + '</small></b></div>' +
      '<div class="coll-stats-bar">' + U.progress(pr.pct, 'Progression globale ' + Math.round(pr.pct * 100) + ' %') + '</div>';
  }

  /* ======================================================================
     COLLECTION (détail)
     ====================================================================== */
  var cd = { view: 'chars', missing: false, q: '' };
  P.collection = {
    title: 'Collection',
    render: function (ctx) {
      var c = A.COLL[ctx.params[0]];
      if (!c) return '<section class="page-head"><div class="container"><h1 class="h1">Collection introuvable</h1><a class="link-arrow" href="#/collections">Retour aux collections ' + I('arrow') + '</a></div></section>';
      this.title = c.name;
      var pr = S.collectionProgress(c.id);
      var views = [['chars', 'Personnages'], ['all', 'Toutes']].concat(A.RARITIES.map(function (r) { return [r.id, r.label]; }));
      return '<section class="coll-hero">' +
        '<div class="coll-hero-art">' + A.artImg({ seed: c.id + '-banner', coll: c.id, rarity: c.status === 'event' ? 'legendary' : 'base', w: 1400, h: 520 }) + '</div>' +
        '<div class="container coll-hero-copy">' +
          (c.group ? '<a class="back" href="#/saga/' + c.group + '">← ' + A.GROUP[c.group].name + '</a>' : '<a class="back" href="#/collections">← Collections</a>') +
          '<p class="eyebrow">' + (c.group ? 'Sous-collection · ' : '') + c.family + ' · ' + c.edition + (c.status === 'event' ? ' · Événement' : '') + '</p>' +
          '<h1 class="h1">' + c.name + '</h1><p class="lead">' + c.description + '</p>' +
          '<div class="coll-stats">' +
            '<div><span>Personnages</span><b>' + pr.owned + '<small> / ' + pr.total + '</small></b></div>' +
            '<div><span>Éditions</span><b>' + pr.edOwned + '<small> / ' + pr.edTotal + '</small></b></div>' +
            '<div class="coll-stats-bar">' + U.progress(pr.pct, 'Progression ' + Math.round(pr.pct * 100) + ' %') + '</div>' +
          '</div>' +
        '</div></section>' +
        '<section class="section-tight rw-sec"><div class="container" data-rewards>' + U.objectives(c.id) + '</div></section>' +
        (U.duelSetsFor(c.id).length ? '<section class="section-tight du-sec"><div class="container" data-duels>' + U.duelSetsFor(c.id).map(U.duelsHTML).join('') + '</div></section>' : '') +
        '<section class="section-tight"><div class="container">' +
          '<div class="toolbar sticky-bar">' +
            '<div class="chips scroll-x" data-f="view">' + views.map(function (v) {
              var plain = v[0] === 'chars' || v[0] === 'all';
              return '<button class="chip' + (!plain ? ' chip-r r-' + v[0] : '') + (cd.view === v[0] ? ' is-active' : '') + '" data-v="' + v[0] + '">' + (!plain ? '<i></i>' : '') + v[1] + '</button>';
            }).join('') + '</div>' +
            '<label class="search">' + I('search') + '<input type="search" placeholder="Personnage…" value="' + U.esc(cd.q) + '" data-q></label>' +
            '<label class="toggle"><input type="checkbox" data-missing' + (cd.missing ? ' checked' : '') + '><span></span>Manquantes</label>' +
          '</div>' +
          '<div data-results></div>' +
        '</div></section>';
    },
    mount: function (root, ctx) {
      var c = A.COLL[ctx.params[0]];
      if (!c) return;
      var res = root.querySelector('[data-results]');
      function draw() {
        var q = cd.q.trim().toLowerCase();
        var chars = c.chars.map(function (id) { return A.CHAR[id]; }).filter(function (ch) { return !q || ch.name.toLowerCase().indexOf(q) !== -1; });
        var cells = [];
        if (cd.view === 'chars') {
          chars.forEach(function (ch) {
            var best = S.bestOwned(ch.id), no = c.chars.indexOf(ch.id) + 1;
            if (cd.missing && best) return;
            cells.push('<div class="cg-item' + (best ? '' : ' is-missing') + '">' + U.card(best ? best.ed : ch.id + '-base', { serial: best && best.serial, uid: best && best.uid, missing: !best }) + U.editionDots(ch.id) +
              '<p class="cg-no">N° ' + (no < 10 ? '0' : '') + no + ' · ' + (best ? 'À vous' : 'Manquant') + '</p></div>');
          });
          if (!q && !cd.missing && A.SECRET[c.id]) cells.push('<div class="cg-item is-trophy">' + U.secretCard(c.id) + '<p class="cg-no">★ · ' + (S.trophy(c.id) ? 'Révélé' : 'Personnage secret') + '</p></div>');
        } else {
          var rids = cd.view === 'all' ? A.RARITIES.map(function (r) { return r.id; }) : [cd.view];
          chars.forEach(function (ch) {
            rids.forEach(function (rid) {
              if (ch.editions.indexOf(rid) === -1) return;
              var edId = ch.id + '-' + rid, own = S.ownedOf(edId);
              if (cd.missing && own.length) return;
              var rem = S.remaining(edId);
              if (!own.length && S.minted(edId) === 0) {         // personne ne l’a encore trouvée
                cells.push('<div class="cg-item is-unknown">' + U.card(edId, { unknown: true }) + '<p class="cg-note">Soyez le premier à la découvrir</p></div>');
                return;
              }
              cells.push('<div class="cg-item' + (own.length ? '' : ' is-missing') + '">' + U.card(edId, { serial: own[0] && own[0].serial, uid: own[0] && own[0].uid, missing: !own.length, badge: own.length > 1 ? '×' + own.length : '' }) +
                '<p class="cg-note">' + (A.ED[edId].supply ? (rem > 0 ? U.num(rem) + ' disponibles sur ' + A.ED[edId].supply : '<span class="sold">Édition épuisée</span>') : 'Tirage illimité') + '</p></div>');
            });
          });
        }
        res.innerHTML = cells.length ? '<div class="card-grid">' + cells.join('') + '</div>' :
          '<div class="empty">' + (cd.missing ? 'Rien ne manque ici. Collection complète pour ce filtre.' : 'Aucune carte pour ce filtre.') + '</div>';
      }
      draw();
      var rw = root.querySelector('[data-rewards]');
      root.addEventListener('click', function (e) {
        var k = e.target.closest('[data-claim]');
        if (k) {
          var res = S.claim(c.id, k.getAttribute('data-claim'));
          if (!res.ok) { U.toast(res.error, 'error'); return; }
          U.toast(res.step.label + ' : ' + U.rewardText(res.reward) + (res.reward.booster ? ' · à ouvrir dans la Boutique' : ''));
          return;
        }
        var b = e.target.closest('[data-f="view"] .chip');
        if (!b) return;
        cd.view = b.getAttribute('data-v');
        root.querySelectorAll('[data-f="view"] .chip').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        draw();
      });
      root.querySelector('[data-q]').addEventListener('input', function (e) { cd.q = e.target.value; draw(); });
      root.querySelector('[data-missing]').addEventListener('change', function (e) { cd.missing = e.target.checked; draw(); });
      this.refresh = function () { draw(); rw.innerHTML = U.objectives(c.id); var du = root.querySelector('[data-duels]'); if (du) du.innerHTML = U.duelSetsFor(c.id).map(U.duelsHTML).join(''); };
    }
  };

  /* ======================================================================
     BOUTIQUE
     ====================================================================== */
  var oddsOpen = null;   // booster dont le tableau détaillé des probabilités est déplié (aucun par défaut)

  function shopPacks() { return A.PACKS.filter(function (p) { return !p.test; }); }
  function packPool(p) { return A.EDITIONS.filter(function (e) { return p.collections.indexOf(A.CHAR[e.charId].coll) !== -1; }); }
  /* Raretés qu’un booster peut donner, de la plus haute à la plus basse. */
  function packRarities(p) {
    var o = Object.assign({}, p.odds, p.guarantee ? p.guarantee.odds : {});
    return A.RARITIES.filter(function (r) { return o[r.id]; }).map(function (r) { return r.id; }).reverse();
  }
  /* Une édition par rareté demandée, personnages tous différents, encore en stock.
     Choix stable d’un rendu à l’autre (hash) ; preferArt : illustrations définitives d’abord. */
  function showcase(p, rarities, preferArt) {
    var pool = packPool(p), used = {};
    return rarities.map(function (rid) {
      var eds = pool.filter(function (e) { return e.rarity === rid && !used[e.charId] && (e.supply == null || S.remaining(e.id) > 0); })
        .sort(function (a, b) { return (preferArt ? (b.media || b.image ? 1 : 0) - (a.media || a.image ? 1 : 0) : 0) || A.hash(a.id + p.id) - A.hash(b.id + p.id); });
      if (eds[0]) used[eds[0].charId] = true;
      return eds[0];
    }).filter(Boolean);
  }
  /* Probabilité d’obtenir au moins une carte de rareté ≥ rid dans un booster, d’après les taux réels. */
  function packChance(p, rid) {
    var min = A.R[rid].rank, miss = 1;
    for (var i = 0; i < p.size; i++) {
      var tot = 0, hit = 0;
      S.packOdds(p.id, !!(p.guarantee && i === p.size - 1)).forEach(function (r) { tot += r.p; if (A.R[r.rarity].rank >= min) hit += r.p; });
      miss *= 1 - (tot ? hit / tot : 0);
    }
    return 1 - miss;
  }
  function lureHTML(p) {
    if (p.fixed) return 'Une carte de chaque rareté numérotée, de la <span class="lure-r r-rare">Rare</span> à l’<span class="lure-r r-unique">Unique</span>.';
    var rid = p.lure || 'epic', c = packChance(p, rid);
    var odds = c >= 0.5 ? 'Plus d’une chance sur deux' : '1 chance sur ' + Math.max(2, Math.round(1 / c));
    return '<b>' + odds + '</b> d’obtenir une <span class="lure-r r-' + rid + '">' + A.R[rid].label + '</span> ou mieux.';
  }
  /* Encart « 1 sur 18 » : la chance d’obtenir la rareté visée, mise en avant dans sa couleur. */
  function oddsBox(p) {
    if (p.fixed) return '<div class="pack-odds r-unique"><span class="po-n">5 <small>sur</small> 5</span><span class="po-t">cartes numérotées, de la <b>Rare</b> à l’<b>Unique</b></span></div>';
    var rid = p.lure || 'epic', c = packChance(p, rid);
    return '<div class="pack-odds r-' + rid + '"><span class="po-n">1 <small>sur</small> ' + (c >= 0.5 ? 2 : Math.max(2, Math.round(1 / c))) + '</span>' +
      '<span class="po-t">chance d’obtenir une <b>' + A.R[rid].label + '</b> ou mieux</span></div>';
  }
  /* Vignette : toujours l’aperçu généré (jamais l’illustration définitive), comme une preview. */
  function miniCard(ed) {
    return '<span class="mcard r-' + ed.rarity + '" title="' + U.esc(A.CHAR[ed.charId].name + ' · ' + A.R[ed.rarity].label) + '">' + A.artImg({ seed: ed.id, coll: A.CHAR[ed.charId].coll, rarity: ed.rarity }) + '<i></i></span>';
  }
  /* « À gagner » : les meilleures cartes possibles (hors Base), la plus rare d’abord. */
  function winRow(p) {
    // raretés de la plus haute à la plus basse (hors Base), répétées : si une rareté est épuisée, on passe à la suivante
    var rs = packRarities(p).filter(function (r) { return r !== 'base'; });
    var eds = showcase(p, rs.concat(rs, rs)).slice(0, 3);
    return '<div class="pack-win"><span class="pack-win-label">À gagner</span><span class="pack-win-list">' + eds.map(miniCard).join('') + '</span></div>';
  }
  function packPill(p) {
    if (p.timer) { var ch = S.charges(); return '<span class="pill pill-gold">' + I('clock') + ch.n + '/' + ch.max + (ch.n < ch.max ? ' · +1 dans ' + U.clock(ch.next) : ' · réserve pleine') + '</span>'; }
    if (p.daily) return S.dailyAvailable()
      ? '<span class="pill pill-gold">' + I('clock') + 'Encore ' + U.duration(S.nextDailyIn()) + '</span>'
      : '<span class="pill">' + I('clock') + 'Prochain dans ' + U.duration(S.nextDailyIn()) + '</span>';
    if (p.event) return '<span class="pill pill-gold">' + I('clock') + 'Fin dans ' + U.duration(S.eventRemaining()) + '</span>';
    return '';
  }
  function priceHTML(p) {
    var tk = S.tokens(p.id);
    if (p.timer) return '<span class="free">' + S.charges().n + ' en réserve' + (tk ? ' +' + tk : '') + '</span>';
    if (tk) return '<span class="free">' + U.icon('gift') + 'Gagné' + (tk > 1 ? ' ×' + tk : '') + '</span>';
    if (p.earned) return '<span class="free is-muted">À gagner en jouant</span>';
    return p.price ? U.price(p.price) : '<span class="free">Gratuit</span>';
  }

  /* ---------- Booster vedette ---------- */
  function featuredPack() {
    if (S.dailyAvailable()) return A.PACK.daily;
    if (S.eventRemaining() > 0 && S.tokens('saga')) return A.PACK.saga;
    return A.PACK.standard;
  }
  function featureHTML(p) {
    var can = S.canOpen(p.id);
    var rs = packRarities(p).filter(function (r) { return r !== 'base'; });
    var center = rs.indexOf('legendary') !== -1 ? 'legendary' : rs[0];
    var side = rs[rs.indexOf(center) + 1] || center;
    var eds = showcase(p, [center, side, side], true);
    var fan = [eds[1], eds[0], eds[2]].filter(Boolean);
    var hint = p.daily ? '<span class="pill pill-gold">' + I('clock') + 'Encore ' + U.duration(S.nextDailyIn()) + ' pour l’ouvrir</span>' : packPill(p);
    return '<div class="feature' + (p.event ? ' is-dark' : '') + '">' +
      '<div class="feature-stage"><div class="feature-scene">' +
        '<div class="feature-fan">' + fan.map(function (ed, i) { return '<div class="ff ff-' + i + '">' + U.card(ed.id, { open: false, tilt: false }) + '</div>'; }).join('') + '</div>' +
        '<div class="feature-pack"' + (can.ok ? ' data-open-pack="' + p.id + '"' : '') + '>' + A.pack.html(p, { tilt: true }) + '</div>' +
      '</div></div>' +
      '<div class="feature-copy">' +
        '<p class="eyebrow">À l’affiche · ' + p.kicker + '</p>' +
        '<h2 class="h2">' + p.name + '</h2>' +
        '<p class="feature-hook">' + (p.hook || p.desc) + '</p>' +
        '<p class="feature-lure">' + lureHTML(p) + '</p>' +
        '<div class="feature-meta">' + hint + '</div>' +
        '<div class="feature-buy"><span class="pack-price">' + priceHTML(p) + '</span>' +
          '<button class="btn btn-lg ' + (can.ok ? (p.event ? 'btn-gold' : 'btn-primary') : 'btn-ghost') + '" data-open-pack="' + p.id + '"' + (can.ok ? '' : ' disabled') + '>' + (can.ok ? 'Ouvrir le booster' : can.reason) + '</button></div>' +
      '</div></div>';
  }

  /* ---------- Fil « Dernières ouvertures » (fictif) ---------- */
  var FEED_W = { rare: 48, epic: 30, legendary: 15, mythic: 5, unique: 2 };
  var feed = null;
  function feedItem(at) {
    var packs = shopPacks(), p = packs[Math.floor(Math.random() * packs.length)];
    var rs = packRarities(p).filter(function (r) { return FEED_W[r]; });
    var sum = rs.reduce(function (s, r) { return s + FEED_W[r]; }, 0), t = Math.random() * sum, rid = rs[0];
    for (var i = 0; i < rs.length; i++) { t -= FEED_W[rs[i]]; if (t <= 0) { rid = rs[i]; break; } }
    var eds = packPool(p).filter(function (e) { return e.rarity === rid; });
    return { user: A.DEMO_USERS[Math.floor(Math.random() * A.DEMO_USERS.length)], ed: eds[Math.floor(Math.random() * eds.length)].id, at: at };
  }
  function feedRow(f, cls) {
    var ed = A.ED[f.ed], R = A.R[ed.rarity];
    return '<li class="feed-row' + (cls ? ' ' + cls : '') + '">' + miniCard(ed) +
      '<p><b>' + U.esc(f.user) + '</b> a obtenu <b>' + U.esc(A.CHAR[ed.charId].name) + '</b></p>' +
      '<span class="rar-chip r-' + ed.rarity + '"><i></i><span>' + R.label + '</span></span>' +
      '<time data-at="' + f.at + '">' + feedAgo(f.at) + '</time></li>';
  }
  function feedAgo(t) {
    var s = (Date.now() - t) / 1000;
    if (s < 10) return 'à l’instant';
    if (s < 60) return 'il y a ' + Math.floor(s / 5) * 5 + ' s';
    return U.ago(t);
  }
  function feedHTML() {
    if (!feed) { var now = Date.now(); feed = [1, 3, 6, 11, 17].map(function (m) { return feedItem(now - m * 60000 - Math.random() * 40000); }); }
    return '<div class="feed">' +
      '<div class="feed-head"><p class="eyebrow feed-live"><i></i>En direct</p><h3 class="h3">Dernières ouvertures</h3>' +
        '<p class="muted">Les plus belles cartes tirées par les collectionneurs, à l’instant.</p></div>' +
      '<ul class="feed-list" data-feed>' + feed.map(function (f) { return feedRow(f); }).join('') + '</ul></div>';
  }

  /* ---------- Probabilités ---------- */
  function oddsTable(packId) {
    var p = A.PACK[packId];
    var rows = S.packOdds(packId);
    var g = p.guarantee ? S.packOdds(packId, true) : null;
    return '<div class="odds">' +
      '<table class="table"><thead><tr><th>Rareté</th><th>Taux de référence</th><th>Taux réel</th><th class="hide-s">Stock restant</th><th class="hide-s">Éditions</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td><span class="rar-chip r-' + r.rarity + '"><i></i>' + A.R[r.rarity].label + '</span></td><td class="muted">' + U.pct(r.ref) + '</td><td><b>' + U.pct(r.p) + '</b></td>' +
          '<td class="hide-s">' + (r.remaining == null ? 'Illimité' : U.num(r.remaining) + ' / ' + U.num(r.total)) + '</td><td class="hide-s">' + r.editions + '</td></tr>';
      }).join('') + '</tbody></table>' +
      (g ? '<p class="odds-note"><b>Dernière carte garantie Rare ou mieux :</b> ' + g.map(function (r) { return A.R[r.rarity].label + ' ' + U.pct(r.p); }).join(' · ') + '</p>' : '') +
      '</div>';
  }
  function oddsItem(p) {
    var open = oddsOpen === p.id;
    return '<div class="odds-item' + (open ? ' is-open' : '') + '" data-odds-item="' + p.id + '">' +
      '<button class="odds-sum" data-odds-toggle="' + p.id + '" aria-expanded="' + open + '">' +
        '<span class="odds-name">' + p.name + '</span>' +
        '<span class="odds-lure">' + p.size + ' cartes · ' + lureHTML(p) + '</span>' +
        '<span class="odds-more"><span>' + (open ? 'Masquer' : 'Voir le détail') + '</span>' + I('chevR') + '</span>' +
      '</button>' +
      '<div class="odds-detail"' + (open ? '' : ' hidden') + '>' + oddsTable(p.id) + '</div></div>';
  }

  P.shop = {
    title: 'Boosters',
    render: function () {
      var st = S.get();
      return '<section class="page-head"><div class="container">' +
        '<p class="eyebrow">Boosters</p><h1 class="h1">Boosters</h1>' +
        '<p class="lead">Aucun booster ne s’achète : le Booster Atlas revient toutes les 15 minutes, le quotidien chaque jour, et les coffrets se gagnent en jouant. Chaque carte est tirée dans le stock réel des éditions.</p>' +
        '</div></section>' +
        '<section class="section-tight"><div class="container">' +
        featureHTML(featuredPack()) +
        '<div class="packs-wrap">' +
        '<button class="packs-arrow is-prev" data-packs="-1" aria-label="Boosters précédents" hidden>' + I('chevL') + '</button>' +
        '<button class="packs-arrow is-next" data-packs="1" aria-label="Boosters suivants" hidden>' + I('chevR') + '</button>' +
        '<div class="packs">' + A.PACKS.map(function (p) {
          var can = S.canOpen(p.id);
          return '<article class="pack-card' + (p.event ? ' is-event' : '') + '">' +
            '<div class="pack-stage"' + (can.ok ? ' data-open-pack="' + p.id + '"' : '') + '>' + A.pack.html(p, { tilt: true }) +
              '<span class="pack-timer">' + packPill(p) + '</span></div>' +
            '<div class="pack-info"><p class="eyebrow">' + p.kicker + '</p><h3 class="h3">' + p.name + '</h3>' +
            oddsBox(p) +
            winRow(p) +
            '<div class="pack-meta">' + packPill(p) + '</div>' +   /* mobile uniquement (sur ordinateur le minuteur est sur le visuel) */
            '<div class="pack-buy"><span class="pack-price">' + priceHTML(p) + '</span>' +
            '<button class="btn ' + (can.ok ? 'btn-primary' : 'btn-ghost') + '" data-open-pack="' + p.id + '"' + (can.ok ? '' : ' disabled') + '>' + (can.ok ? 'Ouvrir' : can.reason) + '</button></div>' +
            '<div class="pack-links">' + (p.test ? '<span></span>' : '<button class="link-btn" data-odds="' + p.id + '">Voir les probabilités</button>') +
            (p.daily && !S.dailyAvailable() ? '<button class="icon-reset" data-reset-daily title="Réinitialiser le booster quotidien (démo)" aria-label="Réinitialiser le booster quotidien">' + I('reset') + '</button>' : '') + '</div>' +
            '</div></article>';
        }).join('') + '</div></div>' +
        feedHTML() +
        '</div></section>' +
        '<section class="section section-alt" id="odds"><div class="container">' +
          sectionHead('Transparence', 'Probabilités en temps réel') +
          '<div class="odds-list">' + shopPacks().map(oddsItem).join('') + '</div>' +
          '<p class="odds-note muted">Probabilités par carte tirée. Le taux réel est recalculé à chaque tirage : taux de référence × part du stock encore disponible. La part non attribuée revient à la rareté la plus courante. Les quantités d’édition (250, 100, 50…) ne sont pas des probabilités.</p>' +
          '<div class="info-grid">' +
            '<div class="info">' + I('shield') + '<h4>Boosters gratuits protégés</h4><p>La réserve et le booster quotidien sont comptés par compte, sur l’horloge du serveur. En phase 2 : compte vérifié, limitation par appareil et détection des comptes automatisés.</p></div>' +
            '<div class="info">' + I('sparkle') + '<h4>Numérotation à la frappe</h4><p>Le numéro d’exemplaire est attribué au moment du tirage, dans une transaction atomique : aucun numéro ne peut être émis deux fois.</p></div>' +
            '<div class="info">' + I('gift') + '<h4>Rien à acheter</h4><p>Les Éclats servent uniquement à la marketplace. Coffrets et boosters d’événement se gagnent avec les missions, les paliers de collection et les trophées. <button class="link-btn" data-refill>Tout recharger (test)</button></p></div>' +
          '</div>' +
        '</div></section>';
    },
    mount: function (root, ctx) {
      A.pack.mountAll(root);
      // Le sachet vedette flotte doucement (en plus de suivre la souris)
      var fp = root.querySelector('.feature-pack .pk');
      if (fp && fp._rig) fp._rig.idle(true);

      // Carrousel des boosters : flèches visibles seulement s’il reste des boosters de ce côté.
      var row = root.querySelector('.packs'), prev = root.querySelector('.packs-arrow.is-prev'), next = root.querySelector('.packs-arrow.is-next');
      function updArrows() {
        if (!row.isConnected) { window.removeEventListener('resize', updArrows); return; }
        var max = row.scrollWidth - row.clientWidth;
        prev.hidden = row.scrollLeft <= 2;
        next.hidden = max <= 2 || row.scrollLeft >= max - 2;
      }
      row.addEventListener('scroll', updArrows, { passive: true });
      window.addEventListener('resize', updArrows);
      setTimeout(updArrows, 0);

      // Fil des dernières ouvertures : une nouvelle ligne glisse en haut toutes les ~6 s, la plus ancienne sort.
      var list = root.querySelector('[data-feed]');
      var feedTimer = setInterval(function () {
        if (!list.isConnected) { clearInterval(feedTimer); return; }
        var f = feedItem(Date.now());
        feed.unshift(f); feed.length = 5;
        list.insertAdjacentHTML('afterbegin', feedRow(f, 'is-enter'));
        var li = list.firstElementChild;
        li.offsetHeight;                                   // force le style initial avant la transition
        li.classList.remove('is-enter');
        var rows = list.children;
        if (rows.length > 5) { var old = rows[rows.length - 1]; old.classList.add('is-leave'); setTimeout(function () { old.remove(); }, 700); }
        list.querySelectorAll('time[data-at]').forEach(function (t) { t.textContent = feedAgo(+t.getAttribute('data-at')); });
      }, 9000);

      function setOdds(id) {
        oddsOpen = id;
        root.querySelectorAll('[data-odds-item]').forEach(function (it) {
          var on = it.getAttribute('data-odds-item') === id;
          it.classList.toggle('is-open', on);
          it.querySelector('.odds-detail').hidden = !on;
          it.querySelector('.odds-sum').setAttribute('aria-expanded', on);
          it.querySelector('.odds-more span').textContent = on ? 'Masquer' : 'Voir le détail';
        });
      }
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-packs]'))) {
          var card = row.querySelector('.pack-card');
          row.scrollBy({ left: +t.getAttribute('data-packs') * (card.offsetWidth + 20), behavior: 'smooth' });
          return;
        }
        if ((t = e.target.closest('[data-open-pack]'))) { A.opener.open(t.getAttribute('data-open-pack')); return; }
        if ((t = e.target.closest('[data-odds-toggle]'))) {
          var id = t.getAttribute('data-odds-toggle');
          setOdds(oddsOpen === id ? null : id);
          return;
        }
        if ((t = e.target.closest('[data-odds]'))) {
          var pid = t.getAttribute('data-odds');
          setOdds(pid);
          var it = root.querySelector('[data-odds-item="' + pid + '"]');
          if (it) it.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        if (e.target.closest('[data-reset-daily]')) { S.resetDaily(); A.app.rerender(); return; }
        if (e.target.closest('[data-refill]')) { S.devRefill(); U.toast('Tous les boosters sont rechargés (test)'); A.app.rerender(); return; }
        if (e.target.closest('[data-grant]')) { S.grant(1000); U.toast('1 000 Éclats ajoutés (démo)'); A.app.rerender(); }
      });
      if (ctx.query.open) {
        // On retire « ?open= » de l’URL : sinon, à la fermeture (croix / Échap), le re-rendu rouvrirait le booster.
        var toOpen = ctx.query.open;
        try { history.replaceState(null, '', '#/boutique'); } catch (e) {}
        if (S.canOpen(toOpen).ok) setTimeout(function () { A.opener.open(toOpen); }, 350);
      }
    }
  };

  /* ======================================================================
     INVENTAIRE
     ====================================================================== */
  var inv = { sort: 'recent', rarity: 'all', coll: 'all', only: 'all', select: false, selected: [] };
  var SORTS = { recent: 'Plus récentes', rarity: 'Rareté', collection: 'Collection', name: 'Personnage' };
  P.inventory = {
    title: 'Mon inventaire',
    render: function () {
      var items = S.items();
      var numbered = items.filter(function (i) { return i.serial != null; }).length;
      var distinct = {}; items.forEach(function (i) { distinct[A.ED[i.ed].charId] = 1; });
      var complete = A.COLLECTIONS.filter(function (c) { return S.collectionProgress(c.id).pct >= 1; }).length;
      var showcase = items.filter(function (i) { return i.show; });
      return '<section class="page-head"><div class="container">' +
        '<p class="eyebrow">Collectionneur · Niveau ' + S.get().user.level + '</p><h1 class="h1">Mon inventaire</h1>' +
        '<div class="kpis">' +
          '<div><span>Cartes</span><b>' + items.length + '</b></div>' +
          '<div><span>Personnages</span><b>' + Object.keys(distinct).length + '<small> / ' + A.CHARS.length + '</small></b></div>' +
          '<div><span>Numérotées</span><b>' + numbered + '</b></div>' +
          '<div><span>Collections terminées</span><b>' + complete + '<small> / ' + A.COLLECTIONS.length + '</small></b></div>' +
        '</div></div></section>' +
        (showcase.length ? '<section class="section-tight is-flush"><div class="container"><div class="showcase"><div class="showcase-head"><p class="eyebrow">Vitrine publique</p><p class="muted small">Ces cartes apparaissent sur votre profil.</p></div><div class="showcase-row">' +
          showcase.map(function (i) { return '<div class="sc-item">' + U.card(i.ed, { serial: i.serial, uid: i.uid }) + '</div>'; }).join('') + '</div></div></div></section>' : '') +
        '<section class="section-tight"><div class="container inv-layout">' +
          '<div class="inv-main">' +
            '<div class="toolbar sticky-bar">' +
              '<div class="chips scroll-x" data-f="rarity">' + [['all', 'Toutes']].concat(A.RARITIES.map(function (r) { return [r.id, r.label]; })).map(function (v) {
                return '<button class="chip' + (v[0] !== 'all' ? ' chip-r r-' + v[0] : '') + (inv.rarity === v[0] ? ' is-active' : '') + '" data-v="' + v[0] + '">' + (v[0] !== 'all' ? '<i></i>' : '') + v[1] + '</button>';
              }).join('') + '</div>' +
              // Filtres compacts : la valeur suffit, l’intitulé est porté par aria-label / title.
              '<div class="tb-filters">' +
                '<label class="select is-compact" title="Collection"><select data-coll aria-label="Collection"><option value="all">Toutes les collections</option>' + A.COLLECTIONS.map(function (c) { return '<option value="' + c.id + '"' + (inv.coll === c.id ? ' selected' : '') + '>' + c.name + '</option>'; }).join('') + '</select></label>' +
                '<label class="select is-compact" title="Afficher"><select data-only aria-label="Afficher">' + [['all', 'Toutes les cartes'], ['dup', 'Doublons'], ['fav', 'Favoris'], ['num', 'Numérotées']].map(function (o) { return '<option value="' + o[0] + '"' + (inv.only === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
                '<label class="select is-compact" title="Trier par"><select data-sort aria-label="Trier par">' + Object.keys(SORTS).map(function (k) { return '<option value="' + k + '"' + (inv.sort === k ? ' selected' : '') + '>' + SORTS[k] + '</option>'; }).join('') + '</select></label>' +
                '<button class="btn btn-ghost btn-xs' + (inv.select ? ' is-on' : '') + '" data-select-mode title="Sélectionner des cartes à proposer en échange">' + I('swap') + (inv.select ? 'Terminer' : 'Échanger') + '</button>' +
              '</div>' +
            '</div>' +
            '<div data-results></div>' +
          '</div>' +
          // Colonne latérale de taille bornée : elle ne grandit pas quand on ajoute des collections.
          '<aside class="inv-side"><div class="side-card"><div class="side-head"><p class="eyebrow">Progression</p><span class="muted small">' + complete + ' / ' + A.COLLECTIONS.length + ' terminées</span></div>' + (function () {
            // Les collections en cours d’abord (les plus avancées en tête), puis les terminées.
            var list = A.COLLECTIONS.map(function (c) { return { c: c, pr: S.collectionProgress(c.id) }; });
            list.sort(function (a, b) { var da = a.pr.pct >= 1, db = b.pr.pct >= 1; return da !== db ? (da ? 1 : -1) : b.pr.pct - a.pr.pct; });
            return list.slice(0, 5).map(function (x) {
              return '<a class="side-prog" href="#/collection/' + x.c.id + '"><div class="row between"><span>' + x.c.name + '</span><span class="muted small">' + x.pr.owned + '/' + x.pr.total + '</span></div>' + U.progress(x.pr.pct) + '</a>';
            }).join('') + (list.length > 5 ? '<a class="side-more" href="#/collections">Voir les ' + list.length + ' collections ' + I('arrow') + '</a>' : '');
          })() + '</div>' +
          '<div class="side-card"><div class="side-head"><p class="eyebrow">Portefeuille</p><button class="link-btn small" data-buy>Recharger</button></div><p class="side-balance">' + U.price(S.balance()) + '</p><ul class="ledger">' +
            S.get().ledger.slice(0, 3).map(function (l) { return '<li><span>' + U.esc(l.label) + '<small>' + U.ago(l.at) + '</small></span><b class="' + (l.amount < 0 ? 'neg' : 'pos') + '">' + (l.amount > 0 ? '+' : '') + U.num(l.amount) + '</b></li>'; }).join('') +
          '</ul><a class="side-more" href="#/profil">Historique complet ' + I('arrow') + '</a></div></aside>' +
        '</div></section>' +
        '<div class="select-bar' + (inv.select ? ' is-in' : '') + '" data-select-bar><div class="container row between"><span data-sel-count>0 carte sélectionnée</span><div class="row gap-s"><button class="btn btn-ghost btn-sm" data-sel-clear>Effacer</button><button class="btn btn-gold btn-sm" data-sel-trade>Proposer un échange</button></div></div></div>';
    },
    mount: function (root) {
      var res = root.querySelector('[data-results]');
      function list() {
        var items = S.items().slice();
        var count = {}; items.forEach(function (i) { count[i.ed] = (count[i.ed] || 0) + 1; });
        items = items.filter(function (i) {
          var e = A.ED[i.ed];
          if (inv.rarity !== 'all' && e.rarity !== inv.rarity) return false;
          if (inv.coll !== 'all' && A.CHAR[e.charId].coll !== inv.coll) return false;
          if (inv.only === 'dup' && count[i.ed] < 2) return false;
          if (inv.only === 'fav' && !i.fav) return false;
          if (inv.only === 'num' && i.serial == null) return false;
          return true;
        });
        items.sort(function (a, b) {
          var ea = A.ED[a.ed], eb = A.ED[b.ed], ca = A.CHAR[ea.charId], cb = A.CHAR[eb.charId];
          if (inv.sort === 'rarity') return A.R[eb.rarity].rank - A.R[ea.rarity].rank || b.at - a.at;
          if (inv.sort === 'collection') return ca.coll.localeCompare(cb.coll) || ca.name.localeCompare(cb.name, 'fr');
          if (inv.sort === 'name') return ca.name.localeCompare(cb.name, 'fr') || A.R[eb.rarity].rank - A.R[ea.rarity].rank;
          return b.at - a.at || A.R[eb.rarity].rank - A.R[ea.rarity].rank;
        });
        return { items: items, count: count };
      }
      function dayLabel(t) {
        var d = new Date(t), today = new Date(); today.setHours(0, 0, 0, 0);
        var d0 = new Date(d); d0.setHours(0, 0, 0, 0);
        var diff = Math.round((today - d0) / 86400000);
        if (diff <= 0) return 'Aujourd’hui';
        if (diff === 1) return 'Hier';
        if (diff < 7) return 'Cette semaine';
        if (diff < 31) return 'Ce mois-ci';
        return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^./, function (c) { return c.toUpperCase(); });
      }
      function draw() {
        var l = list();
        // Doublons empilés : une seule tuile par édition (l’exemplaire le mieux placé selon le tri),
        // les autres exemplaires apparaissent en pile derrière. En mode échange, chaque exemplaire est sélectionnable.
        var tiles = [];
        if (inv.select) tiles = l.items.map(function (i) { return { i: i, n: 1 }; });
        else {
          var at = {};
          l.items.forEach(function (i) {
            if (at[i.ed] != null) { tiles[at[i.ed]].n++; return; }
            at[i.ed] = tiles.length; tiles.push({ i: i, n: 1 });
          });
        }
        function tile(t) {
          var i = t.i;
          return '<div class="cg-item' + (t.n > 1 ? ' is-stack' + (t.n > 2 ? ' is-stack-3' : '') : '') + '">' + U.card(i.ed, {
            serial: i.serial, uid: i.uid, fav: i.fav, show: i.show,
            badge: t.n > 1 ? '×' + t.n : (!inv.select ? '' : l.count[i.ed] > 1 ? 'Doublon ×' + l.count[i.ed] : ''),
            open: !inv.select, select: inv.select, selected: inv.selected.indexOf(i.uid) !== -1, tilt: !inv.select
          }) + '<p class="cg-note">' + (t.n > 1 ? t.n + ' exemplaires · ' : '') + U.ago(i.at) + '</p></div>';
        }
        // Tri par date : regroupement par période d’obtention
        var body = '';
        if (inv.sort === 'recent') {
          var cur = null, buf = [];
          var flush = function () { if (buf.length) body += '<div class="inv-period"><p class="eyebrow">' + cur + '</p><div class="card-grid">' + buf.join('') + '</div></div>'; buf = []; };
          tiles.forEach(function (t) { var lb = dayLabel(t.i.at); if (lb !== cur) { flush(); cur = lb; } buf.push(tile(t)); });
          flush();
        } else body = '<div class="card-grid">' + tiles.map(tile).join('') + '</div>';
        res.innerHTML = '<p class="result-count">' + l.items.length + ' carte' + (l.items.length > 1 ? 's' : '') +
          (tiles.length !== l.items.length ? ' · ' + tiles.length + ' différente' + (tiles.length > 1 ? 's' : '') : '') + '</p>' +
          (l.items.length ? body : '<div class="empty">Aucune carte pour ces filtres. <a href="#/boutique">Ouvrir un booster</a></div>');
        var n = inv.selected.length;
        root.querySelector('[data-sel-count]').textContent = n + ' carte' + (n > 1 ? 's' : '') + ' sélectionnée' + (n > 1 ? 's' : '');
      }
      draw();
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-f="rarity"] .chip'))) {
          inv.rarity = t.getAttribute('data-v');
          root.querySelectorAll('[data-f="rarity"] .chip').forEach(function (x) { x.classList.toggle('is-active', x === t); });
          draw(); return;
        }
        if (e.target.closest('[data-select-mode]')) { inv.select = !inv.select; if (!inv.select) inv.selected = []; A.app.rerender(); return; }
        if ((t = e.target.closest('.card[data-select]'))) {
          var u = t.getAttribute('data-uid'), k = inv.selected.indexOf(u);
          if (k === -1) inv.selected.push(u); else inv.selected.splice(k, 1);
          draw(); return;
        }
        if (e.target.closest('[data-sel-clear]')) { inv.selected = []; draw(); return; }
        if (e.target.closest('[data-sel-trade]')) {
          if (!inv.selected.length) { U.toast('Sélectionnez au moins une carte', 'error'); return; }
          U.modal('<div class="dialog"><p class="eyebrow">Échanges · Phase 2</p><h2 class="h3">Proposer un échange</h2>' +
            '<div class="mini-row">' + inv.selected.map(function (u) { var it = S.item(u); return it ? '<div class="mini">' + U.card(it.ed, { serial: it.serial, open: false, tilt: false }) + '</div>' : ''; }).join('') + '</div>' +
            '<p class="muted">L’échange entre comptes arrive avec l’authentification (phase 2). Les deux parties devront confirmer avant exécution ; les cartes proposées seront verrouillées pendant la négociation.</p>' +
            '<div class="dialog-actions"><button class="btn btn-primary" data-close>Compris</button></div></div>', { cls: 'is-small' });
        }
      });
      root.querySelector('[data-coll]').addEventListener('change', function (e) { inv.coll = e.target.value; draw(); });
      root.querySelector('[data-only]').addEventListener('change', function (e) { inv.only = e.target.value; draw(); });
      root.querySelector('[data-sort]').addEventListener('change', function (e) { inv.sort = e.target.value; draw(); });
      this.refresh = function () { A.app.rerender(); };
    }
  };

  /* ======================================================================
     MARKETPLACE
     ====================================================================== */
  var mk = { q: '', colls: [], rars: [], min: '', max: '', sort: 'recent', mine: false };
  P.market = {
    title: 'Marketplace',
    render: function (ctx) {
      if (ctx.query.q != null) mk.q = ctx.query.q;
      var L = S.listings(), sales = S.sales();
      var vol = sales.filter(function (s) { return Date.now() - s.at < 86400000; }).reduce(function (a, s) { return a + s.price; }, 0);
      return '<section class="page-head"><div class="container">' +
        '<p class="eyebrow">Salle des ventes</p><h1 class="h1">Marketplace</h1>' +
        '<p class="lead">Achetez et vendez des exemplaires entre collectionneurs, à prix fixe. Chaque annonce indique l’édition, le numéro et la provenance.</p>' +
        '<div class="kpis">' +
          '<div><span>Annonces actives</span><b>' + L.length + '</b></div>' +
          '<div><span>Volume 24 h</span><b>' + U.num(vol) + '<small> D</small></b></div>' +
          '<div><span>Ventes récentes</span><b>' + sales.length + '</b></div>' +
          '<div><span>Votre solde</span><b>' + U.num(S.balance()) + '<small> D</small></b></div>' +
        '</div>' +
        '<div class="notice">' + I('lock') + '<span>Transactions simulées en <b>Éclats</b>. Aucun paiement ni retrait en euros dans le prototype ; les enchères arriveront dans une phase ultérieure.</span></div>' +
        '</div></section>' +
        '<section class="section-tight"><div class="container mk-layout">' +
          '<aside class="mk-filters"><details open><summary>' + I('filter') + 'Filtres</summary>' +
            '<div class="f-group"><p class="f-label">Collection</p>' + A.COLLECTIONS.map(function (c) { return '<label class="check"><input type="checkbox" data-coll value="' + c.id + '"' + (mk.colls.indexOf(c.id) !== -1 ? ' checked' : '') + '><span></span>' + c.name + '</label>'; }).join('') + '</div>' +
            '<div class="f-group"><p class="f-label">Rareté</p>' + A.RARITIES.map(function (r) { return '<label class="check"><input type="checkbox" data-rar value="' + r.id + '"' + (mk.rars.indexOf(r.id) !== -1 ? ' checked' : '') + '><span></span><i class="dot r-' + r.id + '"></i>' + r.label + '</label>'; }).join('') + '</div>' +
            '<div class="f-group"><p class="f-label">Prix (Éclats)</p><div class="row gap-s"><input class="input" type="number" placeholder="Min" data-min value="' + mk.min + '"><input class="input" type="number" placeholder="Max" data-max value="' + mk.max + '"></div></div>' +
            '<label class="toggle"><input type="checkbox" data-mine' + (mk.mine ? ' checked' : '') + '><span></span>Mes annonces</label>' +
            '<button class="link-btn" data-clear>Réinitialiser les filtres</button>' +
          '</details></aside>' +
          '<div class="mk-main">' +
            '<div class="toolbar"><label class="search grow">' + I('search') + '<input type="search" placeholder="Rechercher une carte, un personnage, un numéro…" value="' + U.esc(mk.q) + '" data-q></label>' +
            '<label class="select"><span>Trier</span><select data-sort>' + [['recent', 'Plus récentes'], ['asc', 'Prix croissant'], ['desc', 'Prix décroissant'], ['rarity', 'Rareté'], ['serial', 'Numéro']].map(function (o) { return '<option value="' + o[0] + '"' + (mk.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label></div>' +
            '<div data-results></div>' +
          '</div>' +
        '</div></section>' +
        '<section class="section"><div class="container">' + sectionHead('Historique', 'Ventes récentes') +
          '<div class="table-wrap"><table class="table"><thead><tr><th>Carte</th><th>Édition</th><th class="hide-s">Vendeur</th><th class="hide-s">Acheteur</th><th>Prix</th><th class="hide-s">Date</th></tr></thead><tbody>' +
          sales.slice(0, 12).map(function (s) {
            var e = A.ED[s.ed], ch = A.CHAR[e.charId];
            return '<tr><td><b>' + ch.name + '</b></td><td><span class="rar-chip r-' + e.rarity + '"><i></i>' + A.R[e.rarity].label + '</span> <span class="muted mono">' + U.serial(s.serial, e.supply) + '</span></td>' +
              '<td class="hide-s">' + U.esc(s.from) + '</td><td class="hide-s">' + U.esc(s.to) + '</td><td>' + U.price(s.price) + '</td><td class="hide-s muted">' + U.ago(s.at) + '</td></tr>';
          }).join('') + '</tbody></table></div></div></section>';
    },
    mount: function (root) {
      var res = root.querySelector('[data-results]');
      function draw() {
        var q = mk.q.trim().toLowerCase();
        var L = S.listings().filter(function (l) {
          var e = A.ED[l.ed], ch = A.CHAR[e.charId], co = A.COLL[ch.coll];
          if (mk.mine && !l.mine) return false;
          if (mk.colls.length && mk.colls.indexOf(ch.coll) === -1) return false;
          if (mk.rars.length && mk.rars.indexOf(e.rarity) === -1) return false;
          if (mk.min !== '' && l.price < +mk.min) return false;
          if (mk.max !== '' && l.price > +mk.max) return false;
          if (q) {
            var hay = (ch.name + ' ' + ch.title + ' ' + co.name + ' ' + A.R[e.rarity].label + ' ' + U.serial(l.serial, e.supply)).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
          }
          return true;
        });
        L.sort(function (a, b) {
          if (mk.sort === 'asc') return a.price - b.price;
          if (mk.sort === 'desc') return b.price - a.price;
          if (mk.sort === 'rarity') return A.R[A.ED[b.ed].rarity].rank - A.R[A.ED[a.ed].rarity].rank || a.price - b.price;
          if (mk.sort === 'serial') return (a.serial || 9999) - (b.serial || 9999);
          return b.at - a.at;
        });
        res.innerHTML = '<p class="result-count">' + L.length + ' annonce' + (L.length > 1 ? 's' : '') + '</p>' +
          (L.length ? '<div class="card-grid is-market">' + L.map(function (l) {
            return '<div class="listing">' + U.card(l.ed, { serial: l.serial, badge: l.mine ? 'Votre annonce' : '' }) +
              '<div class="listing-foot"><div class="listing-price">' + U.price(l.price) + '<span class="muted small">par ' + U.esc(l.seller) + '</span><span class="muted small">' + U.ago(l.at) + '</span></div>' +
              (l.mine ? '<div class="row gap-s"><button class="btn btn-ghost btn-sm grow" data-unlist="' + l.id + '">Retirer</button></div>' :
                '<div class="row gap-s"><button class="btn btn-primary btn-sm grow" data-buy="' + l.id + '">Acheter</button><button class="btn btn-ghost btn-sm" data-offer="' + l.id + '">Offre</button></div>') +
              '</div></div>';
          }).join('') + '</div>' : '<div class="empty">Aucune annonce ne correspond à votre recherche.</div>');
      }
      draw();
      function labelOf(l) { var e = A.ED[l.ed]; return A.CHAR[e.charId].name + ' · ' + A.R[e.rarity].label + (e.supply ? ' ' + U.serial(l.serial, e.supply) : ''); }
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-buy]'))) {
          var l = S.listings().find(function (x) { return x.id === t.getAttribute('data-buy'); });
          if (!l) return;
          U.confirm({
            eyebrow: 'Achat simulé', title: labelOf(l), ok: 'Acheter pour ' + U.num(l.price) + ' D',
            body: '<div class="mini-row"><div class="mini">' + U.card(l.ed, { serial: l.serial, open: false, tilt: false }) + '</div></div>' +
              '<dl class="facts"><div><dt>Vendeur</dt><dd>' + U.esc(l.seller) + '</dd></div><div><dt>Prix</dt><dd>' + U.price(l.price) + '</dd></div><div><dt>Solde après achat</dt><dd>' + U.price(S.balance() - l.price) + '</dd></div></dl>',
            onOk: function () {
              var r = S.buy(l.id);
              if (r.ok) { U.toast('Carte ajoutée à votre inventaire'); draw(); A.app.refreshChrome(); } else U.toast(r.error, 'error');
            }
          });
          return;
        }
        if ((t = e.target.closest('[data-offer]'))) {
          var lo = S.listings().find(function (x) { return x.id === t.getAttribute('data-offer'); });
          U.modal('<div class="dialog"><p class="eyebrow">Offre d’achat</p><h2 class="h3">' + labelOf(lo) + '</h2>' +
            '<p class="muted">Prix demandé : ' + U.num(lo.price) + ' Éclats. Le vendeur sera notifié et pourra accepter ou refuser.</p>' +
            '<label class="field"><span>Votre offre</span><div class="input-unit"><input type="number" min="1" value="' + Math.round(lo.price * 0.85 / 5) * 5 + '" data-amount><span>Éclats</span></div></label>' +
            '<div class="dialog-actions"><button class="btn btn-ghost" data-close>Annuler</button><button class="btn btn-primary" data-send>Envoyer l’offre</button></div></div>',
            { cls: 'is-small', mount: function (el, close) {
              el.querySelector('[data-send]').addEventListener('click', function () {
                var r = S.offer(lo.id, parseInt(el.querySelector('[data-amount]').value, 10));
                if (r.ok) { close(); U.toast('Offre envoyée (simulation)'); } else U.toast(r.error, 'error');
              });
            } });
          return;
        }
        if ((t = e.target.closest('[data-unlist]'))) { S.unlist(t.getAttribute('data-unlist')); U.toast('Annonce retirée, la carte revient dans votre inventaire'); draw(); return; }
        if (e.target.closest('[data-clear]')) { mk = { q: '', colls: [], rars: [], min: '', max: '', sort: 'recent', mine: false }; location.hash = '#/marketplace'; A.app.rerender(); }
      });
      root.addEventListener('change', function (e) {
        var t = e.target;
        if (t.matches('[data-coll]')) mk.colls = [].slice.call(root.querySelectorAll('[data-coll]:checked')).map(function (x) { return x.value; });
        if (t.matches('[data-rar]')) mk.rars = [].slice.call(root.querySelectorAll('[data-rar]:checked')).map(function (x) { return x.value; });
        if (t.matches('[data-sort]')) mk.sort = t.value;
        if (t.matches('[data-mine]')) mk.mine = t.checked;
        draw();
      });
      root.addEventListener('input', function (e) {
        var t = e.target;
        if (t.matches('[data-q]')) mk.q = t.value;
        if (t.matches('[data-min]')) mk.min = t.value;
        if (t.matches('[data-max]')) mk.max = t.value;
        if (t.matches('[data-q],[data-min],[data-max]')) draw();
      });
      if (window.innerWidth < 900) { var d = root.querySelector('.mk-filters details'); if (d) d.open = false; }
      this.refresh = draw;
    }
  };

  /* ======================================================================
     MON PROFIL (démo : données locales, connexion simulée)
     ====================================================================== */
  P.profile = {
    title: 'Mon profil',
    render: function () {
      var st = S.get(), u = st.user, prefs = u.prefs || {}, items = S.items();
      var numbered = items.filter(function (i) { return i.serial != null; }).length;
      var complete = A.COLLECTIONS.filter(function (c) { return S.collectionProgress(c.id).pct >= 1; }).length;
      // Niveau fictif : 25 cartes par niveau.
      var xp = items.length % 25;
      var muted = A.sfx && A.sfx.muted;
      // Une ligne de réglage : intitulé + description à gauche, contrôle à droite.
      function row(title, hint, control) {
        return '<div class="pf-row"><div><b>' + title + '</b><small>' + hint + '</small></div>' + control + '</div>';
      }
      function toggle(key, title, hint, on) {
        return '<label class="pf-row is-toggle"><div><b>' + title + '</b><small>' + hint + '</small></div>' +
          '<input type="checkbox" data-pref="' + key + '"' + (on ? ' checked' : '') + '><i class="switch-ui"></i></label>';
      }
      // Section façon catalogue : titre serif à gauche, contenu à droite, filets fins.
      function sec(eyebrow, title, desc, body) {
        return '<section class="pf-sec"><div class="pf-sec-head"><p class="eyebrow">' + eyebrow + '</p><h2 class="pf-sec-title">' + title + '</h2>' + (desc ? '<p class="muted small">' + desc + '</p>' : '') + '</div><div class="pf-sec-body">' + body + '</div></section>';
      }
      var ledger = S.ledger().slice(0, 5).map(function (t) {
        return '<li><span>' + U.esc(t.label) + '</span><time>' + U.ago(t.at) + '</time><b class="' + (t.amount < 0 ? 'neg' : 'pos') + '">' + (t.amount > 0 ? '+' : '−') + U.num(Math.abs(t.amount)) + '</b></li>';
      }).join('');
      return '<section class="page-head"><div class="container">' +
        '<div class="pf-head"><span class="avatar is-xl' + U.avatarCls() + '">' + U.avatarInner() + '</span><div>' +
          '<p class="eyebrow">Mon profil</p><h1 class="h1">' + U.esc(u.name) + '</h1>' +
          '<p class="lead">@' + U.esc(u.handle) + ' · Membre depuis le ' + U.date(st.createdAt) + '</p></div></div>' +
        // Mêmes statistiques que sur une page Collection.
        '<div class="coll-stats pf-stats">' +
          '<div><span>Cartes</span><b>' + U.num(items.length) + '</b></div>' +
          '<div><span>Numérotées</span><b>' + U.num(numbered) + '</b></div>' +
          '<div><span>Collections</span><b>' + complete + '<small> / ' + A.COLLECTIONS.length + '</small></b></div>' +
          '<div class="coll-stats-bar">' + U.progress(xp / 25, 'Niveau ' + u.level + ' · encore ' + (25 - xp) + ' cartes avant le niveau ' + (u.level + 1)) + '</div>' +
        '</div></div></section>' +
        '<div class="container pf-body">' +
          sec('Collection', 'Photo de profil', 'Chaque collection complétée débloque un portrait.',
            '<div class="pf-avatars"><button type="button" class="pf-av' + (S.avatar() ? '' : ' is-on') + '" data-avatar-pick=""><span class="avatar is-lg">' + A.app.initial() + '</span><small>Initiale</small></button>' +
            A.COLLECTIONS.map(function (c) {
              var own = S.avatars().indexOf(c.id) !== -1;
              return '<button type="button" class="pf-av' + (own ? '' : ' is-locked') + (S.avatar() === c.id ? ' is-on' : '') + '"' + (own ? ' data-avatar-pick="' + c.id + '"' : ' disabled title="Complétez ' + U.esc(c.name) + ' pour le débloquer"') + '>' +
                '<span class="avatar is-lg has-pic' + (S.hasFrame() && own ? ' has-frame' : '') + '">' + U.avatarArt(c.id) + (own ? '' : '<i class="pf-av-lock">' + U.icon('lock') + '</i>') + '</span><small>' + U.esc(c.name) + '</small></button>';
            }).join('') + '</div>') +
          sec('Collection', 'Personnages secrets', 'Un par collection, jamais en booster : chaque personnage obtenu révèle un fragment de son portrait.',
            '<div class="pf-trophies">' + A.COLLECTIONS.map(function (c) { return '<div class="pf-trophy">' + U.secretCard(c.id) + '</div>'; }).join('') + '</div>') +
          sec('Collection', 'Titres', 'Gagnés en complétant les collections : tous les personnages, puis toutes les éditions.',
            (S.titles().length ? '<div class="pf-titles">' + S.titles().map(function (t) { return '<span class="pf-title">' + U.icon('laurel') + U.esc(t) + '</span>'; }).join('') + '</div>'
              : '<p class="muted">Aucun titre pour l’instant. Complétez une collection pour obtenir le premier.</p>') +
            (S.readyCount() ? '<p class="pf-ready">' + U.icon('gift') + S.readyCount() + ' récompense' + (S.readyCount() > 1 ? 's' : '') + ' à récupérer dans vos <a href="#/collections">collections</a>.</p>' : '')) +
          sec('Identité', 'Compte', 'Votre nom public et vos coordonnées.',
            '<form class="pf-form" data-profile-form>' +
              '<label class="field"><span>Pseudo</span><input class="input" name="name" maxlength="24" value="' + U.esc(u.name) + '" required></label>' +
              '<label class="field"><span>Identifiant</span><div class="input-prefix"><i>@</i><input class="input" name="handle" maxlength="24" pattern="[A-Za-z0-9_.\\-]+" value="' + U.esc(u.handle) + '" required></div></label>' +
              '<label class="field is-wide"><span>E-mail</span><input class="input" type="email" name="email" value="' + U.esc(u.email || 'vous@exemple.fr') + '"></label>' +
              '<div class="pf-form-actions"><button class="btn btn-primary btn-sm" type="submit">Enregistrer</button></div>' +
            '</form>') +
          sec('Réglages', 'Préférences', 'Sons et notifications.',
            toggle('sound', 'Sons', 'Effets sonores à l’ouverture des boosters', !muted) +
            toggle('notifDaily', 'Booster du jour', 'Me prévenir quand il est disponible', prefs.notifDaily !== false) +
            toggle('notifOffers', 'Offres reçues', 'Me prévenir quand on fait une offre sur mes annonces', prefs.notifOffers !== false) +
            toggle('publicShowcase', 'Vitrine publique', 'Les autres collectionneurs peuvent voir ma vitrine', prefs.publicShowcase !== false)) +
          sec('Portefeuille', 'Solde', 'Monnaie fictive, non convertible.',
            '<div class="pf-balance"><span>' + U.price(S.balance()) + '<small>Éclats disponibles</small></span><button class="btn btn-ghost btn-sm" data-buy>' + I('coin') + 'Acheter des Éclats</button></div>' +
            '<p class="eyebrow pf-sub">Dernières opérations</p><ul class="pf-ledger">' + ledger + '</ul>') +
          sec('Compte', 'Session', '',
            row('Connecté sur cet appareil', 'Votre collection, vos favoris et votre solde restent enregistrés après la déconnexion.', '<button class="btn btn-ghost btn-sm" data-logout>' + I('logout') + 'Se déconnecter</button>') +
            row('Données de démonstration', 'Remet l’inventaire, le solde et les annonces à leur état initial.', '<button class="btn btn-ghost btn-sm is-danger" data-reset-demo>Réinitialiser</button>')) +
        '</div>';
    },
    mount: function (root) {
      root.addEventListener('submit', function (e) {
        var f = e.target.closest('[data-profile-form]'); if (!f) return;
        e.preventDefault();
        var name = f.name.value.trim(), handle = f.handle.value.trim();
        if (!name || !handle) return;
        S.updateUser({ name: name, handle: handle, email: f.email.value.trim() });
        U.toast('Profil enregistré');
        A.app.rerender();
      });
      root.addEventListener('change', function (e) {
        var t = e.target.closest('[data-pref]'); if (!t) return;
        var k = t.getAttribute('data-pref');
        if (k === 'sound') { if (A.sfx) A.sfx.setMuted(!t.checked); return; }
        var p = {}; p[k] = t.checked; S.updateUser({ prefs: p });
      });
      root.addEventListener('click', function (e) {
        var av = e.target.closest('[data-avatar-pick]');
        if (av) { S.setAvatar(av.getAttribute('data-avatar-pick') || null); A.app.rerender(); U.toast('Photo de profil mise à jour'); return; }
        if (!e.target.closest('[data-reset-demo]')) return;
        U.confirm({ title: 'Réinitialiser la démo ?', body: '<p class="muted">L’inventaire, le solde et les annonces reviennent à leur état initial.</p>', ok: 'Réinitialiser', onOk: function () { S.reset(); U.toast('Démo réinitialisée'); A.app.rerender(); } });
      });
    }
  };

  /* ======================================================================
     DESIGN SYSTEM
     ====================================================================== */
  P.design = {
    title: 'Design system',
    render: function () {
      var colors = [
        ['--bg', 'Ivoire', '#F6F2EA'], ['--surface', 'Blanc cassé', '#FBF9F4'], ['--bg-2', 'Beige clair', '#EFE9DD'], ['--line', 'Filet', '#E3DBCD'],
        ['--ink', 'Encre', '#1B1814'], ['--ink-2', 'Graphite', '#4B453C'], ['--ink-3', 'Gris chaud', '#8A8173'], ['--gold', 'Or discret', '#A88A55']
      ];
      return '<section class="page-head"><div class="container"><p class="eyebrow">Fondations</p><h1 class="h1">Design system</h1>' +
        '<p class="lead">Les règles visuelles d’ATLAS : un musée numérique, sobre et lumineux, où les œuvres occupent toute l’attention.</p></div></section>' +
        '<section class="section-tight"><div class="container ds">' +
          '<div class="ds-block"><p class="eyebrow">Couleurs</p><div class="swatches">' + colors.map(function (c) {
            return '<div class="swatch"><span style="background:var(' + c[0] + ')"></span><b>' + c[1] + '</b><code>' + c[0] + ' · ' + c[2] + '</code></div>';
          }).join('') + '</div></div>' +
          '<div class="ds-block"><p class="eyebrow">Raretés</p><div class="swatches">' + A.RARITIES.map(function (r) {
            return '<div class="swatch"><span class="sw-r r-' + r.id + '"></span><b>' + r.label + '</b><code>' + r.identity + ' · ' + (r.supply ? r.supply + ' ex.' : 'illimité') + '</code></div>';
          }).join('') + '</div></div>' +
          '<div class="ds-block"><p class="eyebrow">Typographie</p>' +
            '<div class="type-spec"><span class="display">Le monde, en cartes.</span><code>Display · Cormorant Garamond 400 · clamp(52 → 112 px)</code></div>' +
            '<div class="type-spec"><span class="h1">Titre de page</span><code>H1 · Cormorant Garamond 500</code></div>' +
            '<div class="type-spec"><span class="h2">Titre de section</span><code>H2 · Cormorant Garamond 500</code></div>' +
            '<div class="type-spec"><span class="eyebrow">Sur-titre · capitales espacées</span><code>Eyebrow · Inter 500 · 11 px · 0.18em</code></div>' +
            '<div class="type-spec"><span class="lead">Texte d’introduction, lisible et aéré, destiné aux chapôs.</span><code>Lead · Inter 400 · 17 px</code></div>' +
            '<div class="type-spec"><span>Texte d’interface courant, très lisible sur mobile comme sur desktop.</span><code>Body · Inter 400 · 15 px</code></div>' +
          '</div>' +
          '<div class="ds-block"><p class="eyebrow">Composants</p><div class="row gap-s wrap">' +
            '<button class="btn btn-primary">Bouton principal</button><button class="btn btn-ghost">Secondaire</button><button class="btn btn-gold">Accent or</button>' +
            '<span class="chip is-active">Filtre actif</span><span class="chip">Filtre</span>' + U.price(1250) +
            '<span class="pill pill-ok">Disponible</span><span class="pill pill-gold">' + I('clock') + 'Événement</span>' +
          '</div></div>' +
          '<div class="ds-block"><p class="eyebrow">Anatomie de la carte</p><div class="anatomy">' +
            '<div class="anatomy-card">' + U.card('egypte-anubis-legendary', { serial: 18 }) + '</div>' +
            '<ol class="anatomy-list">' +
              '<li><b>Illustration</b> — environ 76 % de la hauteur. Œuvre originale, lumière naturelle, zones de respiration.</li>' +
              '<li><b>Nom & numéro</b> — serif, numéro d’exemplaire à droite (018/50).</li>' +
              '<li><b>Titre & collection</b> — sous-titre en italique, collection en capitales.</li>' +
              '<li><b>Statistiques</b> — Attaque, Défense, Esprit : identiques pour toutes les éditions.</li>' +
              '<li><b>Rareté</b> — pastille et filet de cadre. Satin discret à partir de Légendaire.</li>' +
            '</ol></div></div>' +
        '</div></section>';
    }
  };
})(window.ATLAS);
