/* ==========================================================================
   ATLAS — Pages
   Chaque page expose render(ctx) → HTML et mount(root, ctx).
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui;
  var P = A.pages = {};
  var I = U.icon;

  function hasEstampe(c, style) {
    var da = style === undefined && A.collStyle ? A.collStyle() : style;
    return da === 'lino' && A.media && A.media.has('collections-' + c.id + '--estampe');
  }
  /* Illustration d’une collection : l’aquarelle peinte si elle existe (media/originals/collections/<id>),
     sinon l’aquarelle générée. o : options de l’aquarelle générée ; sizes : largeur affichée. */
  function collArt(c, o, sizes, style) {
    // Style d’essai choisi dans le menu (test) : « collections-grece--objet » si elle existe, sinon l’image normale
    // Visuels d’origine pour toutes les collections (illustrations peintes mises de côté, fichiers conservés dans media/) :
    // repasser A.COLL_PICS à true pour les réafficher
    if (!A.COLL_PICS) return A.artImg(o);
    var id = 'collections-' + c.id, key = c.id, da = style === undefined ? A.collStyle && A.collStyle() : style;
    if (da && A.media && A.media.has(id + '--' + da)) { id += '--' + da; key += '--' + da; }
    // Estampes immersives : le sujet central reste lisible en bandeau, couverture et vignette.
    var engraving = hasEstampe(c, da);
    if (engraving) { id = 'collections-' + c.id + '--estampe'; key = c.id + '--estampe'; }
    if (A.media && A.media.has(id)) return A.media.picture(id, { sizes: sizes || '100vw' }).replace('class="art-pic"', 'class="art-pic is-coll' + (engraving ? ' is-engraving' : '') + (/--objet$/.test(id) ? ' is-object' : '') + '"')
      .replace(' style="', ' style="object-position:50% ' + (COLL_FOCUS[key] || 36) + '%;');
    return A.artImg(o);
  }
  // Hauteur du point d’intérêt de chaque aquarelle (en % de l’image), pour les cadrages très larges
  var COLL_FOCUS = { grece: 36, nordique: 52, egypte: 58, gothique: 46, heros: 52, geants: 51, titans: 53, monstres: 66, 'grece--objet': 60, 'egypte--objet': 60, 'gothique--objet': 60, 'nordique--objet': 60, 'grece--lino': 50, 'egypte--lino': 52, 'gothique--lino': 44, 'nordique--lino': 58, 'grece--estampe': 27, 'nordique--estampe': 30 };
  A.COLL_PICS = false;
  A.collArt = collArt;
  function sectionHead(eyebrow, title, link) {
    return '<div class="section-head"><div><p class="eyebrow">' + eyebrow + '</p><h2 class="h2">' + title + '</h2></div>' +
      (link ? '<a class="link-arrow" href="' + link[1] + '">' + link[0] + ' ' + I('arrow') + '</a>' : '') + '</div>';
  }
  /* Étagère : une collection globale = un en-tête (nom, jauge) + ses sous-collections
     en lignes, comme « Votre collection » sur l’accueil (vignette, progression, prochain palier) */
  function shelf(head, subs, eyebrow, folded) {
    var rows = '<div class="rail">' +
      '<button type="button" class="rail-arrow is-prev" data-rail="-1" aria-label="Collections précédentes" hidden>' + I('chevL') + '</button>' +
      '<div class="pg-colls is-shelf" data-rail-row>' + subs.map(function (c) { return pgRow(c, eyebrow ? c.family : ''); }).join('') + '</div>' +
      '<button type="button" class="rail-arrow is-next" data-rail="1" aria-label="Collections suivantes" hidden>' + I('chevR') + '</button></div>';
    // Univers pas encore commencé : replié derrière « Voir les N collections » pour raccourcir la page
    return '<section class="shelf">' + head + (folded ? '<details class="shelf-fold"><summary>' + I('chevR') + '<span>Voir les ' + subs.length + ' collections</span></summary>' + rows + '</details>' : rows) + '</section>';
  }
  // Jauge de complétion : anneau doré qui se remplit, le pourcentage au centre ; un laurier à 100 %
  function gauge(pct) {
    var p = Math.round(pct * 100);
    return p >= 100 ? '<span class="g-pct is-full">' + I('laurel') + '<small>Complète</small></span>'
      : '<span class="g-pct g-ring" role="img" aria-label="' + p + ' % complété"><svg viewBox="0 0 48 48" aria-hidden="true">' +
          '<circle class="g-track" cx="24" cy="24" r="21" pathLength="100"/>' +
          (p ? '<circle class="g-fill" cx="24" cy="24" r="21" pathLength="100" stroke-dasharray="' + p + ' 100"/>' : '') + '</svg><b>' + p + '<em>%</em></b></span>';
  }
  function groupBlock(g, subs, folded) {
    var pr = S.groupProgress(g.id);
    // L’album n’a plus de page à lui : son en-tête porte ses chiffres, ses paliers sont dans le panneau Missions
    return shelf('<div class="shelf-head" id="album-' + g.id + '">' +
      '<div class="sh-copy"><h2 class="sh-name">' + U.esc(g.name) + '</h2>' +
        '<p class="sh-meta">' + pr.owned + '/' + pr.total + ' personnages · ' + pr.done + '/' + pr.subs + ' complètes' +
          (S.readyCount('@' + g.id) ? '<br><button type="button" class="sh-gift" data-qs-open>' + U.icon('gift') + 'Récompense de l’album à récupérer</button>' : '') + '</p></div>' +
      gauge(pr.pct) + '</div>', subs, false, folded && pr.owned === 0);
  }

  function globe() {
    var o = '<svg class="globe" viewBox="0 0 600 600" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7">';
    o += '<circle cx="300" cy="300" r="280"/>';
    for (var i = 1; i < 6; i++) o += '<ellipse cx="300" cy="300" rx="' + (280 * Math.cos(i * Math.PI / 12)).toFixed(1) + '" ry="280"/>';
    for (var j = -2; j <= 2; j++) { var y = 300 + j * 95, rx = Math.sqrt(280 * 280 - (j * 95) * (j * 95)); o += '<ellipse cx="300" cy="' + y + '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.12).toFixed(1) + '"/>'; }
    return o + '<path d="M300 20v560M20 300h560" stroke-dasharray="2 5"/></g></svg>';
  }

  // Réserve : une barre fine de 10 segments ; le segment en cours se remplit au fil des 15 minutes
  function reserve(ch, tk) {
    var seg = '', f = ch.n >= ch.max ? 0 : 1 - ch.next / S.CHARGE.every;
    for (var i = 0; i < ch.max; i++) seg += '<i' + (i < ch.n ? ' class="is-on"' : i === ch.n ? ' class="is-charging" style="--f:' + f.toFixed(3) + '"' : '') + '></i>';
    return '<div class="rv" role="img" aria-label="' + ch.n + ' boosters en réserve sur ' + ch.max + '">' +
      '<div class="rv-bar">' + seg + '</div>' +
      '<p class="rv-txt"><b>' + ch.n + '</b> sur ' + ch.max + ' en réserve' + (tk ? ' <em>+' + tk + ' offert' + (tk > 1 ? 's' : '') + '</em>' : '') +
        '<span class="rv-sep">·</span>' + (ch.n >= ch.max ? 'pleine' : '+1 dans <b data-clock="charge">' + U.clock(ch.next) + '</b>') + '</p></div>';
  }
  function playHTML() {
    var P0 = A.PACK.standard, PD = A.PACK.daily, ch = S.charges(), can = S.canOpen(P0.id), tk = S.tokens(P0.id), pips = '';
    var dCan = S.canOpen(PD.id);
    for (var i = 0; i < ch.max; i++) pips += '<i' + (i < ch.n ? ' class="is-on"' : '') + '></i>';
    var side = [A.PACK.saga, A.PACK.soleil, A.PACK.nil].filter(function (p) { return S.eventRemaining(p.id) > 0; }).concat(S.UNLIMITED ? [A.PACK.nuit, A.PACK.ultime].filter(Boolean) : []);   // Pack Ultime : mode test uniquement
    // Deux sachets côte à côte qu’on fait glisser : le Booster Atlas (réserve) et le Booster quotidien
    var atlas = '<div class="play-slide" data-slide="1">' +
        '<div class="play-stage is-' + P0.theme + '">' + PLAY_AURA + '<div class="play-pack' + (can.ok ? '"' + ' data-open-pack="' + P0.id + '"' : ' is-empty"') + '>' + A.pack.html(P0, { tilt: true }) + '</div>' + playSide(P0) + '</div>' + reserve(ch, tk) +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + P0.id + '"' + (can.ok ? '' : ' disabled') + '>' +
          (can.ok ? 'Ouvrir un Booster Atlas' : 'Prochain dans <span data-clock="charge">' + U.clock(ch.next) + '</span>') + '</button>' +
        (A.multi && A.multi.count(P0.id) >= 2 ? '<button class="play-many" data-open-many="' + P0.id + '">' + I('cards') + 'Ouvrir les ' + A.multi.count(P0.id) + ' d’un coup</button>' : '<span class="play-many is-ghost" aria-hidden="true">' + I('cards') + 'Ouvrir</span>') +   // place réservée : le sachet reste à la même hauteur d’un booster à l’autre
        '</div>';
    var daily = '<div class="play-slide" data-slide="0">' +
        '<div class="play-stage is-' + PD.theme + '">' + PLAY_AURA + '<div class="play-pack' + (dCan.ok ? '"' + ' data-open-pack="' + PD.id + '"' : ' is-empty"') + '>' + A.pack.html(PD, { tilt: true }) + '</div>' + playSide(PD) + '</div>' +
        '<p class="play-day">' + (dCan.ok ? '<b>Prêt à ouvrir</b>' : 'Déjà ouvert aujourd’hui') + '</p>' +
        '<p class="play-clock">' + (dCan.ok ? 'Un nouveau chaque jour' : 'Prochain dans <b data-clock="daily">' + U.clock(S.nextDailyIn()) + '</b>') + '</p>' +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + PD.id + '"' + (dCan.ok ? '' : ' disabled') + '>' +
          (dCan.ok ? 'Ouvrir le Booster quotidien' : 'Prochain dans <span data-clock="daily">' + U.clock(S.nextDailyIn()) + '</span>') + '</button>' +
        '<span class="play-many is-ghost" aria-hidden="true">' + I('cards') + 'Ouvrir</span>' +
        '</div>';
    // Événements (Nord, Japon) : même présentation en grand quand on les choisit
    var SHORT = { saga: 'Nord', soleil: 'Japon', nil: 'Égypte', nuit: 'Nuit', ultime: 'Ultime' };
    var extra = side.map(function (p, j) {
      var c = S.canOpen(p.id), n = S.tokens(p.id), many = A.multi ? A.multi.count(p.id) : 0;
      return '<div class="play-slide" data-slide="' + (j + 2) + '">' +
        '<div class="play-stage is-' + p.theme + '">' + PLAY_AURA + '<div class="play-pack' + (c.ok ? '"' + ' data-open-pack="' + p.id + '"' : ' is-empty"') + '>' + A.pack.html(p, { tilt: true }) + '</div>' + playSide(p) + '</div>' +
        (p.test ? '<p class="play-day"><b>Illimité (test)</b></p><p class="play-clock">' + (p.testNote || 'Une Rare, une Épique, une Légendaire, une Mythique et une Unique') + '</p>'
          : '<p class="play-day">' + (n ? '<b>' + (n > 1 ? n + ' à ouvrir' : '1 à ouvrir') + '</b>' : 'À gagner en jouant') + '</p>' +
            '<p class="play-clock">' + (p.event ? 'Événement · encore ' + Math.ceil(S.eventRemaining(p.id) / 864e5) + ' jours' : n ? p.kicker : 'Missions et paliers de collection') + '</p>') +
        '<button class="btn btn-primary btn-lg play-btn" data-open-pack="' + p.id + '"' + (c.ok ? '' : ' disabled') + '>' + (p.test ? 'Ouvrir le ' + p.name : c.ok ? 'Ouvrir la ' + p.name : 'Aucune saga à ouvrir') + '</button>' +
        (many >= 2 ? '<button class="play-many" data-open-many="' + p.id + '">' + I('cards') + 'Ouvrir les ' + many + ' d’un coup</button>' : '<span class="play-many is-ghost" aria-hidden="true">' + I('cards') + 'Ouvrir</span>') +
        '</div>';
    }).join('');
    // Sélecteur : une tuile par booster (mini sachet, nom, état)
    // Sélecteur sobre : des onglets texte de largeur fixe, un trait sous l’actif, un point quand il y a de quoi ouvrir
    function pick(p, k, name, ready) {
      return '<button class="pick-b' + (k === 1 ? ' is-on' : '') + '" data-go="' + k + '" role="tab" aria-label="' + p.name + (ready ? ', prêt' : '') + '">' +
        name + (ready ? '<i class="pick-dot"></i>' : '') + '</button>';
    }
    var picker = '<div class="pick' + (side.length > 3 ? ' is-many' : '') + '" role="tablist" style="--k:1;--n:' + (2 + side.length) + '">' +
      pick(PD, 0, 'Quotidien', dCan.ok) + pick(P0, 1, 'Atlas', ch.n > 0) +   // le Booster Atlas au centre au départ, le quotidien à sa gauche
      side.map(function (p, j) { return pick(p, j + 2, SHORT[p.id], S.tokens(p.id) > 0); }).join('') +
      '<span class="pick-bar"></span></div>';
    return '<section class="play"><div class="container play-grid">' +
      '<div class="play-main">' +
        '<p class="eyebrow">Vos boosters</p>' +
        picker +
        '<div class="play-slides">' + daily + atlas + extra + '</div>' +
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

  // Annonces de l’accueil : 6 cartes selon le tri, puis une tuile « tout voir »
  function mkItems(L, sort) {
    var total = L.length;
    if (sort === 'missing') { L = L.filter(function (l) { return !S.ownedOf(l.ed).length; }); sort = 'rare'; }   // éditions pas encore possédées, les plus rares d’abord
    var by = {
      rare: function (a, b) { return A.R[A.ED[b.ed].rarity].rank - A.R[A.ED[a.ed].rarity].rank || a.price - b.price; },
      cheap: function (a, b) { return a.price - b.price; },
      'new': function (a, b) { return b.at - a.at; }
    }[sort];
    var seen = {}, pick = L.slice().sort(by).filter(function (l) { if (seen[l.ed]) return false; seen[l.ed] = 1; return true; }).slice(0, 6);   // une seule annonce par édition
    return pick.map(function (l, k) {
      var ed = A.ED[l.ed], ch = A.CHAR[ed.charId], R = A.R[ed.rarity];
      return '<a class="mk-item r-' + ed.rarity + '" href="#/marketplace?q=' + encodeURIComponent(ch.name) + '" aria-label="' + U.esc(ch.name) + ', ' + l.price + ' Éclats">' +
        '<span class="mk-lot">Lot ' + String(k + 1).padStart(2, '0') + '<i></i>' + R.label + '</span>' +
        '<span class="mk-stage">' + U.card(l.ed, { serial: l.serial }) + '</span>' +
        '<span class="mk-foot">' + U.price(l.price) + '<span class="mk-buy">Voir</span></span></a>';
    }).join('') +
    '<a class="mk-item mk-all" href="#/marketplace"><span class="mk-all-in">' + I('market') + '<b>Voir les ' + U.num(total) + ' annonces</b>' + I('arrow') + '</span></a>';
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
            '<div class="row gap-s wrap"><a class="btn btn-primary btn-lg" href="#/connexion?mode=inscription">Commencer ma collection</a><a class="btn btn-ghost btn-lg" href="#/connexion">Se connecter</a></div>' +
            '<dl class="hero-facts"><div><dt>Collections</dt><dd>' + A.COLLECTIONS.length + '</dd></div><div><dt>Personnages</dt><dd>' + A.CHARS.length + '</dd></div><div><dt>Éditions</dt><dd>' + U.num(A.EDITIONS.length) + '</dd></div></dl>' +
          '</div>' +
          '<div class="hero-visual">' + globe() + zeusFan(feat) +
            '<p class="hero-caption"><span>Zeus, Roi de l’Olympe</span><span>Épique · Légendaire · Unique</span></p>' +
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
      raritiesHTML() +
      landingCollsHTML() +
      // Échanges : la vitrine du concept, toujours foncée (même en mode sombre)
      '<section class="section section-dark is-fixed-dark h-trade-landing"><div class="container trade-grid">' +
        '<div class="trade-copy"><p class="eyebrow">Échanges & marketplace</p><h2 class="h2">Chaque carte a une histoire.</h2>' +
          '<p class="lead">Comme dans une maison de ventes, chaque exemplaire numéroté garde sa provenance : tirage, propriétaires, prix de cession.</p>' +
          '<ul class="checklist">' +
            '<li>' + I('swap') + '<span><b>Échanges entre collectionneurs</b> confirmés par les deux parties avant exécution.</span></li>' +
            '<li>' + I('market') + '<span><b>Marketplace à prix fixe</b> en Éclats, monnaie fictive non convertible.</span></li>' +
          '</ul></div>' +
        '<div class="trade-visual">' +
          '<div class="tv-card">' + U.card('grece-zeus-mythic', { serial: 19, tilt: false }) + '<p>Ombre_de_Rhodes</p></div>' +
          '<span class="tv-mid"><span class="tv-ring" aria-hidden="true"></span><button type="button" class="tv-swap is-idle" data-trade-swap aria-label="Échanger les cartes">' + I('swap') + '</button></span>' +
          '<div class="tv-card">' + U.card('grece-zeus-rare', { serial: 112, tilt: false }) + '<p>Vous</p></div>' +
        '</div>' +
      '</div></section>' +
      // Appel final : c’est ici qu’il a sa place (le visiteur a tout vu)
      '<section class="section cta l-cta"><div class="container cta-inner">' + U.mark('cta-mark') +
        '<h2 class="h2">Votre collection commence ici.</h2>' +
        '<p class="lead">Un compte gratuit, un booster offert toutes les 15 minutes et un autre chaque jour. Sans paiement.</p>' +
        '<a class="btn btn-primary btn-lg" href="#/connexion?mode=inscription">Commencer ma collection</a>' +
        '<p class="l-cta-sub">Déjà inscrit ? <a href="#/connexion">Se connecter</a></p>' +
      '</div></section>' +
      '</div>';
  };
  P.landingMount = function (root) {
    rowDots(root.querySelector('.steps'), root.querySelectorAll('.steps-dots:not(.lc-dots) i'), 4500);
    rowDots(root.querySelector('.lc-row'), root.querySelectorAll('.lc-dots i'), 5000);
    rarityMount(root);
    tradeSwap(root);
  };
  /* Échanges : la carte change de main.
     Technique « FLIP » : les cartes sont échangées dans la page dès le clic, puis animées depuis leur ancienne place
     jusqu’à la nouvelle ; l’animation finit donc exactement à leur position (aucun saut).
     Trajectoire calculée image par image (≈ 60 étapes) :
       élan     0 → 16 %  : les cartes reculent, se cabrent, celle qui part chez « Vous » se soulève ;
       vol     16 → 80 %  : arc de Bézier (l’une passe au-dessus, plus grande et plus ombrée ; l’autre dessous, assombrie),
                            un tour complet sur elle-même qui laisse voir le dos ATLAS ;
       réception 80 → 100 % : ressort amorti (léger dépassement, tassement à l’impact), halo de la couleur de la rareté.
     Le bouton s’enfonce, tourne avec ressort et lâche une onde dorée quand les cartes se croisent. */
  function tradeSwap(root) {
    var btn = root.querySelector('[data-trade-swap]'), ring = root.querySelector('.tv-ring'), busy = false, turn = 0;
    if (!btn || !btn.animate) return;
    var X = A.sfx || {};
    function sfx(name, x, y) { try { if (X[name] && !X.muted) X[name](x, y); } catch (e) { /* son facultatif */ } }
    function angle(el) { var m = new DOMMatrix(getComputedStyle(el).transform); return Math.atan2(m.b, m.a); }
    function center(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; }
    function rarity(card) { var m = card.className.match(/\br-(\w+)/); return m ? m[1] : 'base'; }
    var eOut = function (t) { return 1 - Math.pow(1 - t, 3); };
    var eInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var eSine = function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; };
    // st : décalage de départ (repère de la nouvelle place) ; o : rôle de la carte dans le croisement
    function flight(st, o) {
      var N = 60, out = [], P0x = st.x * 1.06, P0y = st.y - o.rise, R0 = st.r - 6 * o.dir;
      var Cx = P0x * 0.5, Cy = P0y * 0.5 + o.arc;   // point de contrôle de l’arc
      for (var i = 0; i <= N; i++) {
        var t = i / N, x, y, r, ry = 0, sc = 1, sx = 1, sy = 1;
        if (t < 0.16) {
          var u = eOut(t / 0.16);
          x = st.x + (P0x - st.x) * u; y = st.y + (P0y - st.y) * u; r = st.r + (R0 - st.r) * u; sc = 1 + o.pre * u;
        } else if (t < 0.8) {
          var v = eInOut((t - 0.16) / 0.64), q = 1 - v, bump = Math.sin(Math.PI * v);
          x = q * q * P0x + 2 * q * v * Cx; y = q * q * P0y + 2 * q * v * Cy;
          r = R0 * q + o.dir * 4 * bump; ry = o.flip * 360 * eSine(v); sc = 1 + o.pre * q + o.peak * bump;
        } else {
          var k = (t - 0.8) / 0.2, d = Math.exp(-5 * k) * Math.sin(2.8 * Math.PI * k);
          x = -st.x * 0.035 * d; y = -3 * Math.abs(d); r = -o.dir * 3 * d; ry = o.flip * 360; sx = 1 + 0.025 * Math.abs(d); sy = 1 - 0.035 * Math.abs(d);
        }
        if (i === N) { x = 0; y = 0; r = 0; sx = 1; sy = 1; sc = 1; }
        out.push({ offset: t, transform: 'perspective(1000px) translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px) rotate(' + r.toFixed(2) + 'deg) rotateY(' + ry.toFixed(1) + 'deg) scale(' + (sx * sc).toFixed(4) + ', ' + (sy * sc).toFixed(4) + ')' });
      }
      return out;
    }
    btn.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      btn.classList.remove('is-idle');
      var w = root.querySelectorAll('.tv-card'), a = w[0].querySelector('.card'), b = w[1].querySelector('.card');
      var a0 = center(a), b0 = center(b), t0 = angle(w[0]), t1 = angle(w[1]);
      // 1. échange dans la page (positions finales), 2. décalage de départ dans le repère incliné de la nouvelle place
      w[0].insertBefore(b, w[0].firstChild); w[1].insertBefore(a, w[1].firstChild);
      var a1 = center(a), b1 = center(b);
      function start(o, n, tOld, tNew) {
        var dx = o.x - n.x, dy = o.y - n.y, c = Math.cos(-tNew), sn = Math.sin(-tNew);
        return { x: dx * c - dy * sn, y: dx * sn + dy * c, r: (tOld - tNew) * 180 / Math.PI };
      }
      var sa = start(a0, a1, t0, t1), sb = start(b0, b1, t1, t0), h = a0.h;
      var T = 1500;
      // dos de carte, visible pendant le tour complet
      [a, b].forEach(function (c) {
        var back = document.createElement('div'); back.className = 'tv-back'; back.innerHTML = U.cardBack('night');
        c.appendChild(back); c.classList.add('is-flying');
      });
      w[1].style.position = 'relative'; w[1].style.zIndex = 4;   // la carte qui part chez « Vous » passe au-dessus de tout
      // hauteur de l’arc limitée à la place libre au-dessus de la carte (le sommet monte d’environ la moitié de l’arc)
      var sec = root.querySelector('.h-trade-landing'), room = sec ? a0.y - h / 2 - sec.getBoundingClientRect().top - 8 : h;
      var arcUp = Math.max(h * 0.06, Math.min(h * 0.24, 2 * (room - h * 0.16)));   // marge pour l’agrandissement et la rotation en vol
      var ka = a.animate(flight(sa, { dir: 1, rise: 6, arc: -arcUp, pre: 0.04, peak: 0.16, flip: 1 }), { duration: T, easing: 'linear' });
      var kb = b.animate(flight(sb, { dir: -1, rise: -2, arc: h * 0.1, pre: -0.03, peak: -0.12, flip: -1 }), { duration: T, easing: 'linear' });
      // profondeur : ombre portée qui grandit pour la carte du dessus, assombrissement pour celle du dessous
      var ia = a.querySelector('.card-inner'), ib = b.querySelector('.card-inner'), base = getComputedStyle(ia).boxShadow;
      ia.animate([{ boxShadow: base }, { boxShadow: '0 38px 60px rgba(0, 0, 0, .55), 0 0 30px rgba(231, 207, 149, .18)', offset: 0.48 }, { boxShadow: base }], { duration: T * 0.8, easing: 'ease-in-out' });
      [ib, b.querySelector('.tv-back')].forEach(function (el) { el.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(.62)', offset: 0.5 }, { filter: 'brightness(1)' }], { duration: T * 0.8, easing: 'ease-in-out', delay: 0 }); });
      // bouton : s’enfonce, tourne avec ressort, onde dorée au croisement
      turn += 180;
      btn.animate([
        { transform: 'rotate(' + (turn - 180) + 'deg) scale(1)' },
        { transform: 'rotate(' + (turn - 200) + 'deg) scale(.84)', offset: 0.12 },
        { transform: 'rotate(' + (turn + 16) + 'deg) scale(1.12)', offset: 0.52 },
        { transform: 'rotate(' + (turn - 6) + 'deg) scale(.97)', offset: 0.72 },
        { transform: 'rotate(' + turn + 'deg) scale(1)' }
      ], { duration: T, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
      btn.classList.add('is-busy');
      setTimeout(function () {
        if (ring) ring.animate([{ transform: 'scale(1)', opacity: 0.7 }, { transform: 'scale(3.2)', opacity: 0 }], { duration: 750, easing: 'cubic-bezier(.2, .7, .3, 1)' });
      }, T * 0.46);
      // sons : souffle au départ, carte qui tourne, claquements à la pose, note selon la rareté reçue
      var rank = (A.R[rarity(a)] || { rank: 0 }).rank;
      setTimeout(function () { sfx('whoosh', 0.9); }, T * 0.15);
      setTimeout(function () { sfx('flip'); }, T * 0.44);
      setTimeout(function () { sfx('snap', 0); sfx('snap', 0.06); }, T * 0.8);
      setTimeout(function () { sfx('seal', rank); }, T * 0.84);
      // réception : halo de la couleur de la rareté, le nom du nouveau propriétaire s’allume
      setTimeout(function () {
        [a, b].forEach(function (c) { c.classList.remove('is-landed'); void c.offsetWidth; c.classList.add('is-landed'); });
        var you = w[1].querySelector('p'), them = w[0].querySelector('p');
        [[you, a], [them, b]].forEach(function (x) {
          if (!x[0]) return;
          x[0].className = 'is-got r-' + rarity(x[1]);
          setTimeout(function () { x[0].className = ''; }, 1300);
        });
        setTimeout(function () { a.classList.remove('is-landed'); b.classList.remove('is-landed'); }, 1100);
      }, T * 0.8);
      ka.onfinish = function () {
        [a, b].forEach(function (c) { c.classList.remove('is-flying'); var bk = c.querySelector('.tv-back'); if (bk) bk.remove(); });
        w[1].style.zIndex = '';
        btn.classList.remove('is-busy');
        busy = false;
      };
    });
  }
  // Éventail de trois Zeus (les seules cartes déjà illustrées) : Épique, Légendaire, Unique
  function zeusFan(feat) {
    return '<div class="hero-stack">' +
      '<div class="hs hs-l">' + U.card('grece-zeus-epic', { serial: 13, tilt: false }) + '</div>' +
      '<div class="hs hs-r">' + U.card('grece-zeus-unique', { serial: 1, tilt: false }) + '</div>' +
      '<div class="hs hs-c">' + U.card('grece-zeus-legendary', { serial: 18, uid: feat && feat.uid, tilt: false }) + '</div>' +
    '</div>';
  }

  /* Rangée horizontale : le point actif suit la carte visible, défilement automatique */
  function rowDots(row, dots, every) {
    if (!row || !dots.length) return;
    row.addEventListener('scroll', function () {
      var w = row.firstElementChild ? row.firstElementChild.offsetWidth + 12 : 1, k = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4 ? dots.length - 1 : Math.round(row.scrollLeft / w);
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === Math.min(k, dots.length - 1)); });
    }, { passive: true });
    autoSlide(row, every);
  }

  /* Six raretés : une vitrine à une seule grande carte et un sélecteur Base → Unique */
  var RS_TEXT = {
    base: 'L’œuvre de référence, en aquarelle sépia. La porte d’entrée de chaque collection.',
    rare: 'Une autre scène, dans une palette froide d’ardoise et d’argent. Chaque exemplaire porte son numéro.',
    epic: 'Une composition inédite rehaussée de violet, sur un cadre assorti.',
    legendary: 'Rehauts d’or et lumière dorée : la pièce maîtresse d’une collection.',
    mythic: 'Rouge vif sur fond sombre. Vingt-cinq collectionneurs seulement la posséderont.',
    unique: 'Une seule carte au monde, en noir et or. Le nom de son propriétaire reste dans sa provenance.'
  };
  // Mythique et Unique ne sortent pas du Booster Atlas : on donne la chance du Booster quotidien
  function dailyOdds(r) {
    var c = packChance(A.PACK.daily, r.id), n = c > 0 ? Math.max(2, Math.round(1 / c)) : 0;
    return n ? '<b>1 chance sur ' + U.num(n) + '</b> par Booster quotidien d’obtenir une carte ' + r.label + (r.id === 'unique' ? '.' : ' ou plus rare.') : '';
  }
  function rsNow(r) {
    var c = packChance(A.PACK.standard, r.id), n = c > 0 ? Math.max(2, Math.round(1 / c)) : 0;
    var odds = r.rank === 0 ? 'Dans chaque Booster Atlas.'
      : n ? '<b>1 chance sur ' + U.num(n) + '</b> par Booster Atlas d’obtenir une carte ' + r.label + (r.id === 'unique' ? '.' : ' ou plus rare.') : dailyOdds(r);
    return '<span class="rar-chip r-' + r.id + '"><i></i>' + r.label + '</span>' +
      '<p class="rs-supply"><b>' + (r.supply ? U.num(r.supply) : 'Illimité') + '</b><span>' + (r.supply ? (r.supply === 1 ? 'pièce au monde' : 'exemplaires numérotés') : 'tirage ouvert') + '</span></p>' +
      '<p class="rs-desc">' + RS_TEXT[r.id] + '</p>' +
      '<p class="rs-odds">' + odds + '</p>';
  }
  function raritiesHTML() {
    var R = A.RARITIES, k = 0;
    return '<section class="section h-rar"><div class="container">' +
      sectionHead('Six raretés', 'Une même figure, six œuvres.') +
      '<div class="rs" data-rs>' +
        '<div class="rs-stage" data-rs-stage>' + R.map(function (r, i) {
          return '<div class="rs-card' + (i === k ? ' is-on' : '') + '">' + U.card('grece-zeus-' + r.id, { serial: r.supply ? Math.min(7 + r.rank * 3, r.supply) : null, tilt: false }) + '</div>';
        }).join('') + '</div>' +
        '<div class="rs-info">' +
          '<div class="rs-now" aria-live="polite" data-rs-now>' + rsNow(R[k]) + '</div>' +
          '<div class="rs-list" role="tablist" aria-label="Raretés">' + R.map(function (r, i) {
            return '<button class="rs-row r-' + r.id + (i === k ? ' is-on' : '') + '" role="tab" aria-selected="' + (i === k) + '" data-rs-i="' + i + '">' +
              '<i class="rs-dot"></i><span class="rs-l">' + r.label + '</span><span class="rs-s">' + (r.supply ? (r.supply === 1 ? 'Pièce unique' : r.supply + ' ex.') : 'Illimité') + '</span></button>';
          }).join('') + '</div>' +
          '<p class="rs-foot">La rareté tient à l’œuvre et au tirage, jamais à la puissance : ATQ, DÉF et ESP restent les mêmes.</p>' +
        '</div>' +
      '</div>' +
    '</div></section>';
  }
  function rarityMount(root) {
    var box = root.querySelector('[data-rs]');
    if (!box) return;
    var cards = box.querySelectorAll('.rs-card'), rows = box.querySelectorAll('[data-rs-i]'), now = box.querySelector('[data-rs-now]');
    var k = 0, hold = 0, visible = false;
    function go(i) {
      k = (i + cards.length) % cards.length;
      cards.forEach(function (c, j) { c.classList.toggle('is-on', j === k); });
      rows.forEach(function (b, j) { b.classList.toggle('is-on', j === k); b.setAttribute('aria-selected', String(j === k)); });
      now.innerHTML = rsNow(A.RARITIES[k]);
    }
    rows.forEach(function (b) { b.addEventListener('click', function () { hold = Date.now() + 12000; go(+b.getAttribute('data-rs-i')); }); });
    box.querySelector('[data-rs-stage]').addEventListener('click', function () { hold = Date.now() + 12000; go(k + 1); });   // toucher la carte : rareté suivante
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.4 }).observe(box);
    var t = setInterval(function () {
      if (!box.isConnected) { clearInterval(t); return; }
      if (visible && Date.now() > hold) go(k + 1);
    }, 3200);
  }

  /* Les collections : les quatre linogravures, et une ligne pour la suite */
  function landingCollsHTML() {
    var list = ['grece', 'egypte', 'gothique', 'nordique'].map(function (id) { return A.COLL[id]; }).filter(Boolean);
    var more = A.COLLECTIONS.length - list.length;
    return '<section class="section h-lcoll"><div class="container">' +
      sectionHead('Les collections', 'Un musée en ' + A.COLLECTIONS.length + ' salles.') +
      '<div class="lc-row">' + list.map(function (c) {
        return '<article class="lc-item"><div class="lc-art">' + collArt(c, { seed: c.id + '-banner', coll: c.id, rarity: 'base', w: 640, h: 420 }, '(max-width: 900px) 78vw, 300px') + '</div>' +
          '<p class="eyebrow">' + c.family + '</p><h3 class="lc-name">' + U.esc(c.name) + '</h3><p class="lc-tag">' + c.tagline + '</p>' +
          '<p class="lc-n">' + c.chars.length + ' personnages</p></article>';
      }).join('') + '</div>' +
      '<div class="steps-dots lc-dots is-mob" aria-hidden="true">' + list.map(function (c, i) { return '<i' + (i ? '' : ' class="is-on"') + '></i>'; }).join('') + '</div>' +
      '<p class="lc-more">Et ' + more + ' autres collections. Prochainement : ' + A.UPCOMING.map(function (u) { return u.name; }).join(', ') + '.</p>' +
    '</div></section>';
  }

  /* ---------- Connexion / inscription (simulées) ----------
     #/connexion et #/connexion?mode=inscription, affichées tant que le joueur est déconnecté */
  var LOGO_APPLE = '<svg class="auth-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.72-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5zM14.19 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z"/></svg>';
  var LOGO_GOOGLE = '<svg class="auth-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95h-4v3.1A11.99 11.99 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.3V6.6h-4A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.8l3.43-3.43C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75z"/></svg>';
  P.loginHTML = function (mode) {
    var up = mode === 'inscription', u = S.get().user;
    var field = function (name, label, type, extra) {
      return '<label class="auth-field"><span>' + label + '</span><input class="auth-input" name="' + name + '" type="' + type + '"' + (extra || '') + '>' +
        '<small class="auth-err" data-err="' + name + '"></small></label>';
    };
    return '<section class="auth"><div class="container auth-grid">' +
      '<div class="auth-visual" aria-hidden="true">' + globe() + zeusFan(null) + '</div>' +
      '<div class="auth-main">' +
        // Onglets sur toute la largeur du formulaire, trait doré sous l’actif (comme le sélecteur de boosters)
        '<nav class="auth-tabs" aria-label="Compte" style="--k:' + (up ? 1 : 0) + '">' +
          '<a href="#/connexion"' + (up ? '' : ' class="is-on" aria-current="page"') + '>Connexion</a>' +
          '<a href="#/connexion?mode=inscription"' + (up ? ' class="is-on" aria-current="page"' : '') + '>Inscription</a>' +
          '<span class="auth-tabs-bar"></span>' +
        '</nav>' +
        '<h1 class="h1">' + (up ? 'Créer un compte.' : 'Bon retour.') + '</h1>' +
        '<p class="lead">' + (up ? 'Gratuit, et un booster offert toutes les 15 minutes.' : 'Retrouvez votre collection et vos boosters.') + '</p>' +
        '<div class="auth-social">' +
          '<button type="button" class="btn btn-ghost btn-lg" data-auth-social="Apple">' + LOGO_APPLE + 'Apple</button>' +
          '<button type="button" class="btn btn-ghost btn-lg" data-auth-social="Google">' + LOGO_GOOGLE + 'Google</button>' +
        '</div>' +
        '<p class="auth-or"><span>ou avec votre e-mail</span></p>' +
        '<form class="auth-form" novalidate data-auth-form>' +
          (up ? field('name', 'Pseudo', 'text', ' autocomplete="nickname" autocapitalize="off" maxlength="24"') : '') +
          field('email', 'E-mail', 'email', ' autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false"' + (!up && u.email ? ' value="' + U.esc(u.email) + '"' : '')) +
          '<label class="auth-field"><span>Mot de passe' + (up ? '' : '<button type="button" class="link-btn" data-forgot>Mot de passe oublié ?</button>') + '</span>' +
            '<span class="auth-pass"><input class="auth-input" name="password" type="password" autocomplete="' + (up ? 'new-password' : 'current-password') + '"' + (up ? ' placeholder="8 caractères minimum"' : '') + '>' +
            '<button type="button" class="auth-eye" data-eye aria-label="Afficher le mot de passe">Afficher</button></span>' +
            '<small class="auth-err" data-err="password"></small></label>' +
          '<button class="btn btn-primary btn-lg auth-submit" type="submit">' + (up ? 'Créer mon compte' : 'Se connecter') + '</button>' +
          (up ? '<p class="auth-legal">En créant un compte, vous acceptez les conditions d’utilisation.</p>' : '') +
        '</form>' +
        '<p class="so-note">' + I('lock') + 'Prototype : connexion simulée, aucune donnée n’est envoyée.</p>' +
      '</div>' +
    '</div></section>';
  };
  P.loginMount = function (root, mode) {
    var up = mode === 'inscription', form = root.querySelector('[data-auth-form]');
    function err(name, msg) {
      var el = form.querySelector('[data-err="' + name + '"]'), input = form.querySelector('[name="' + name + '"]');
      if (el) el.textContent = msg || '';
      if (input) input.classList.toggle('is-bad', !!msg);
      return !msg;
    }
    root.addEventListener('click', function (e) {
      var eye = e.target.closest('[data-eye]');
      if (eye) {
        var p = form.querySelector('[name="password"]'), show = p.type === 'password';
        p.type = show ? 'text' : 'password';
        eye.textContent = show ? 'Masquer' : 'Afficher';
        eye.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
        return;
      }
      if (e.target.closest('[data-forgot]')) {
        var em = form.querySelector('[name="email"]').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err('email', 'Indiquez votre e-mail pour recevoir le lien.'); return; }
        U.toast('Lien de réinitialisation envoyé à ' + U.esc(em) + ' (simulation)');
        return;
      }
      var so = e.target.closest('[data-auth-social]');
      if (so) A.app.login(up ? 'Bienvenue sur ATLAS' : null);
    });
    form.addEventListener('input', function (e) { if (e.target.name) err(e.target.name, ''); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var x = form.querySelector('[name="' + n + '"]'); return x ? x.value.trim() : ''; };
      var ok = true;
      if (up) ok = err('name', v('name').length < 2 ? 'Choisissez un pseudo d’au moins 2 caractères.' : '') && ok;
      ok = err('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')) ? '' : 'Cette adresse e-mail n’est pas valide.') && ok;
      ok = err('password', v('password').length < (up ? 8 : 1) ? (up ? 'Au moins 8 caractères.' : 'Indiquez votre mot de passe.') : '') && ok;
      if (!ok) { var bad = form.querySelector('.is-bad'); if (bad) bad.focus(); return; }
      var btn = form.querySelector('.auth-submit');
      btn.disabled = true; btn.textContent = up ? 'Création du compte…' : 'Connexion…';
      setTimeout(function () {
        if (up) S.updateUser({ name: v('name'), email: v('email') });
        else S.updateUser({ email: v('email') });
        A.app.login(up ? 'Bienvenue sur ATLAS, ' + U.esc(v('name')) : null);
      }, 500);
    });
  };

  P.home = {
    title: 'Le monde, en cartes',
    mount: function (root, ctx) {
      A.pack.mountAll(root);
      // Carrousel des deux sachets : onglets synchronisés, seul le sachet affiché flotte doucement
      var slides = root.querySelector('.play-slides'), tabs = root.querySelectorAll('.pick-b'), packs = root.querySelectorAll('.play-slide .pk');
      function current() { return slides ? Math.round(slides.scrollLeft / Math.max(1, slides.firstElementChild.offsetWidth)) : 0; }
      // Onglets qui défilent (mobile, mode test) : l’onglet actif reste visible
      function pickInView(pk0, k) {
        var t = tabs[k]; if (!t || pk0.scrollWidth <= pk0.clientWidth + 1) return;
        var l = t.offsetLeft - (pk0.clientWidth - t.offsetWidth) / 2;
        pk0.scrollTo({ left: Math.max(0, l), behavior: 'smooth' });
      }
      function sync() {
        var k = current();
        tabs.forEach(function (t, i) { t.classList.toggle('is-on', i === k); });
        var pk0 = root.querySelector('.pick'); if (pk0) { pk0.style.setProperty('--k', k); pickInView(pk0, k); }
        packs.forEach(function (pk, i) { if (pk._rig) pk._rig.idle(i === k); });
      }
      if (slides) {
        var st0;
        /* Sachets voisins visibles sur les côtés, en retrait et un peu plus petits (effet « vitrine »).
           Chaque sachet reste dans sa diapositive : on le rapproche seulement du centre, selon la position du défilement. */
        var cfRaf = 0;
        function coverflow() {
          cfRaf = 0;
          var w = slides.firstElementChild.getBoundingClientRect().width; if (!w) return;
          var pos = slides.scrollLeft / w, pk1 = slides.querySelector('.pk'), pw = pk1 ? pk1.offsetWidth : 200;
          var off = Math.min(pw * 0.91 + 100, slides.clientWidth / 2 - 40 + pw * 0.41);   // ordinateur : à droite des boutons ; mobile : on en voit le bord
          Array.prototype.forEach.call(slides.children, function (sl, i) {
            var d = i - pos, ad = Math.abs(d), sg = d < 0 ? -1 : 1;
            var x = sg * (ad <= 1 ? ad * off : off + (ad - 1) * off * 0.62);
            sl.style.setProperty('--px', (x - d * w).toFixed(1) + 'px');
            sl.style.setProperty('--ps', (1 - 0.18 * Math.min(ad, 1) - 0.08 * Math.max(0, Math.min(ad - 1, 1))).toFixed(3));
            sl.style.setProperty('--po', (ad <= 1 ? 1 - 0.5 * ad : Math.max(0, 0.5 - (ad - 1) * 0.5)).toFixed(3));
            sl.style.setProperty('--uo', Math.max(0, 1 - ad * 2.2).toFixed(3));
            sl.style.zIndex = String(10 - Math.round(ad));
            sl.classList.toggle('is-side', ad > 0.5);
          });
        }
        function cfQueue() { if (!cfRaf) cfRaf = requestAnimationFrame(coverflow); }
        slides.addEventListener('scroll', function () { cfQueue(); clearTimeout(st0); st0 = setTimeout(sync, 80); }, { passive: true });
        window.addEventListener('resize', function cfR() { if (!slides.isConnected) { window.removeEventListener('resize', cfR); return; } cfQueue(); });
        if (!(ctx && ctx.query.open)) slides.scrollLeft = slides.firstElementChild.offsetWidth;   // départ sur le Booster Atlas (2e)
        coverflow();
        // Toucher un sachet voisin l’amène au centre (sans l’ouvrir)
        // (le sachet du centre passe au-dessus des voisins : on regarde donc où tombe le toucher)
        slides.addEventListener('click', function (e) {
          if (e.target.closest('button')) return;
          var hit = -1;
          Array.prototype.forEach.call(slides.children, function (sl, i) {
            if (hit > -1 || !sl.classList.contains('is-side')) return;
            var r = sl.querySelector('.play-pack').getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hit = i;
          });
          if (hit < 0) return;
          e.preventDefault(); e.stopPropagation();
          glide(hit);
        }, true);
        /* Passage d’un sachet à l’autre : glissement animé par le site lui-même (le défilement « doux » du navigateur
           saute d’un coup quand les animations du système sont coupées). Le sachet qui part recule et s’estompe,
           celui qui arrive s’avance ; le trait des onglets suit. */
        var glideRaf = 0;
        function glide(k) {
          var w = slides.firstElementChild.getBoundingClientRect().width, from = slides.scrollLeft, to = k * w, cur = current();
          cancelAnimationFrame(glideRaf);
          Array.prototype.forEach.call(slides.children, function (c) { c.classList.remove('is-leave', 'is-arrive'); });
          if (Math.abs(to - from) < 1) { slides.classList.remove('is-gliding', 'is-dragging'); sync(); return; }
          var dur = Math.round(Math.min(760, 460 + Math.abs(to - from) / w * 120)), t0 = performance.now();
          slides.style.setProperty('--glide', dur + 'ms');
          slides.classList.add('is-gliding');
          if (cur !== k && slides.children[cur]) slides.children[cur].classList.add('is-leave');
          if (slides.children[k]) slides.children[k].classList.add('is-arrive');
          tabs.forEach(function (t, i) { t.classList.toggle('is-on', i === k); });
          var pk0 = root.querySelector('.pick'); if (pk0) pk0.style.setProperty('--k', k);
          (function step(now) {
            var p = Math.min(1, (now - t0) / dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            slides.scrollLeft = from + (to - from) * e;
            if (p < 1) { glideRaf = requestAnimationFrame(step); return; }
            slides.classList.remove('is-gliding', 'is-dragging');
            Array.prototype.forEach.call(slides.children, function (c) { c.classList.remove('is-leave', 'is-arrive'); });
            sync();
          })(t0);
        }
        tabs.forEach(function (t) { t.addEventListener('click', function () { glide(+t.getAttribute('data-go')); }); });
        // Toucher un événement plus bas : on remonte et le sachet passe au premier plan
        root.querySelectorAll('[data-go-slide]').forEach(function (t) { t.addEventListener('click', function () {
          var k = +t.getAttribute('data-go-slide'), top = root.querySelector('.play').getBoundingClientRect().top + window.scrollY - 60;
          if (window.scrollY > top + 10) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          glide(k);
        }); });
        // Souris : on fait glisser les sachets à la main (le doigt et le pavé tactile défilent déjà nativement).
        // Un glissement d’un huitième de largeur suffit à changer de sachet ; un vrai glissement n’ouvre pas le booster.
        var drag = null, dragged = false, settle;
        slides.addEventListener('dragstart', function (e) { e.preventDefault(); });
        slides.addEventListener('pointerdown', function (e) {
          if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return;
          cancelAnimationFrame(glideRaf); slides.classList.remove('is-gliding');
          drag = { x: e.clientX, left: slides.scrollLeft, k: current(), id: e.pointerId }; dragged = false;
        });
        slides.addEventListener('pointermove', function (e) {
          if (!drag || e.pointerId !== drag.id) return;
          var dx = e.clientX - drag.x;
          if (!dragged) {
            if (Math.abs(dx) < 6) return;
            dragged = true; clearTimeout(settle);
            try { slides.setPointerCapture(e.pointerId); } catch (er) { /* pointeur déjà relâché */ }
            slides.classList.add('is-dragging');
          }
          slides.scrollLeft = drag.left - dx;
        });
        function endDrag(e) {
          if (!drag) return;
          var d = drag; drag = null;
          if (!dragged) return;
          var w = slides.firstElementChild.offsetWidth, dx = e.clientX - d.x;
          var k = Math.max(0, Math.min(slides.children.length - 1, Math.abs(dx) > w / 8 ? d.k + (dx < 0 ? 1 : -1) : d.k));
          glide(k);   // l’aimantation reste coupée pendant le glissement (is-gliding), sinon elle l’interrompt
        }
        slides.addEventListener('pointerup', endDrag);
        slides.addEventListener('pointercancel', endDrag);
        slides.addEventListener('click', function (e) { if (dragged) { dragged = false; e.preventDefault(); e.stopPropagation(); } }, true);
        sync();
      }
      root.addEventListener('click', function (e) {
        // Test : sachet retenu (Strié) ↔ classique (le modèle 3D se charge au démarrage, d’où le rechargement)
        if (e.target.closest('[data-pack-shape]')) {
          try { localStorage.setItem('atlas-pack-shape', A.PACK_MODEL_PILLOW ? 'classic' : 'strie'); } catch (er) { /* stockage indisponible */ }
          location.reload(); return;
        }
        if (e.target.closest('[data-dev-refill]')) { S.devRefill(); U.toast('Tous les boosters sont rechargés (test)'); A.app.rerender(); return; }
        // Récompenses prêtes : on les récupère sans quitter l’accueil (les boosters gagnés arrivent dans le hub)
        if (claimClick(e)) return;
        var od = e.target.closest('[data-odds]');
        if (od) { oddsModal(od.getAttribute('data-odds')); return; }
        var m = e.target.closest('[data-open-many]');
        if (m) { var id = m.getAttribute('data-open-many'); A.multi.open(id, A.multi.count(id)); return; }
        var t = e.target.closest('[data-open-pack]');
        if (t) A.opener.open(t.getAttribute('data-open-pack'));
      });
      var toOpen = ctx && ctx.query.open;
      if (toOpen && A.PACK[toOpen]) {
        // On retire « ?open= » de l’adresse : sinon un nouveau rendu rouvrirait le booster
        try { history.replaceState(null, '', '#/'); } catch (er) { /* ignore */ }
        var sl = slides && slides.querySelector('[data-open-pack="' + toOpen + '"]');
        sl = sl && sl.closest('.play-slide');
        if (sl) { slides.scrollLeft = Array.prototype.indexOf.call(slides.children, sl) * slides.firstElementChild.offsetWidth; sync(); }
        if (S.canOpen(toOpen).ok) setTimeout(function () { A.opener.open(toOpen); }, 350);
      }
      // Marketplace : la rangée des lots défile seule tant qu’on n’y touche pas ; changer de tri
      autoSlide(root.querySelector('[data-mk-row]'), 3800);
      root.querySelectorAll('[data-mk-sort]').forEach(function (b) { b.addEventListener('click', function () {
        root.querySelectorAll('[data-mk-sort]').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        var row = root.querySelector('[data-mk-row]');
        row.innerHTML = mkItems(S.listings().filter(function (l) { return !l.mine; }), b.getAttribute('data-mk-sort'));
        row.scrollLeft = 0;
      }); });
      // Comptes à rebours ; quand un booster arrive (ou le quotidien revient), on redessine la page
      var n0 = S.charges().n, d0 = S.dailyAvailable();
      var tick = setInterval(function () {
        if (!root.isConnected || !root.querySelector('.play')) { clearInterval(tick); return; }
        if (document.querySelector('.opener')) return;
        var ch = S.charges();
        if (ch.n !== n0 || S.dailyAvailable() !== d0) { clearInterval(tick); A.app.rerender(); return; }
        root.querySelectorAll('[data-clock="charge"]').forEach(function (el) { el.textContent = U.clock(ch.next); });
        root.querySelectorAll('.rv-bar .is-charging').forEach(function (el) { el.style.setProperty('--f', (1 - ch.next / S.CHARGE.every).toFixed(3)); });
        root.querySelectorAll('[data-clock="daily"]').forEach(function (el) { el.textContent = U.clock(S.nextDailyIn()); });
        root.querySelectorAll('[data-clock="daily-s"]').forEach(function (el) { el.textContent = U.clock(S.nextDailyIn()).replace(' min', ''); });
      }, 1000);
    },
    // Ordre : vos boosters (plein écran) → votre collection (récompenses, événement, collections presque complètes) → marketplace
    render: function () {
      return playHTML() + progressHTML() + combatHTML() + marketHTML();
    }
  };

  /* Récompenses et missions prêtes à récupérer, toutes collections confondues */
  function readyRewards() {
    var out = [];
    A.COLLECTIONS.forEach(function (c) { S.rewards(c.id).concat(S.missions(c.id)).forEach(function (s) { if (s.state === 'ready') out.push(s); }); });
    (A.GROUPS || []).forEach(function (g) { S.rewards('@' + g.id).forEach(function (s) { if (s.state === 'ready') out.push(s); }); });
    return out;
  }
  /* Votre progression : ce qu’il y a à récupérer, l’événement en cours, puis les collections les plus proches d’être complètes */
  function progressHTML() {
    var ready = readyRewards();
    var ev = S.eventRemaining() > 0 ? A.COLLECTIONS.find(function (c) { return c.status === 'event'; }) : null;
    var started = A.COLLECTIONS.map(function (c) { return { c: c, pr: S.collectionProgress(c.id) }; })
      .filter(function (x) { return x.pr.owned > 0 && x.pr.pct < 1 && x.c !== ev; })
      .sort(function (a, b) { return b.pr.pct - a.pr.pct || (a.pr.total - a.pr.owned) - (b.pr.total - b.pr.owned); });
    var fresh = !started.length;
    // Aucune collection commencée : on propose les plus populaires pour démarrer
    var list = fresh ? A.COLLECTIONS.filter(function (c) { return c.popular && c !== ev; }).sort(function (a, b) { return a.popular - b.popular; }).slice(0, 3).map(function (c) { return { c: c, pr: S.collectionProgress(c.id) }; }) : started.slice(0, 3);
    /* Récompenses prêtes : une seule ligne (icônes, total, aperçu des deux premières) et un bouton
       qui récupère tout ; le détail reste dans chaque collection, signalé sur les vignettes */
    return '<section class="section section-dark is-fixed-dark is-ink-dark h-prog"><div class="container">' +
      sectionHead('Votre collection', fresh ? 'Vos premières salles' : 'Vos salles presque complètes', ['Toutes les collections', '#/collections']) +
      giftsHTML(ready) +
      '<div class="pg-colls" style="--n:' + (list.length + (ev ? 1 : 0)) + '">' + (ev ? pgEvent(ev) : '') + list.map(function (x) { return pgRow(x.c, x.c.family); }).join('') + '</div>' +
    '</div></section>';
  }
  function giftsHTML(ready) {
    if (!ready.length) return '';
    var one = ready.length === 1, rest = ready.length - 2;
    return '<div class="pg-gifts">' +
        '<span class="pg-ics" aria-hidden="true">' + ready.slice(0, 3).map(function (s) { return '<span class="pg-ic">' + U.rewardIcon(s.reward) + '</span>'; }).join('') + '</span>' +
        '<span class="pg-txt"><b>' + (one ? U.esc(ready[0].label) : ready.length + ' récompenses<span class="pg-tail"> à récupérer</span>') + '</b><small>' +
          (one ? U.esc(S.scopeName(ready[0].coll)) + ' · ' + U.esc(U.rewardText(ready[0].reward))
               : ready.slice(0, 2).map(function (s) { return U.esc(s.label) + ' · ' + U.esc(S.scopeName(s.coll)); }).join(', ') + (rest > 0 ? ' et ' + rest + ' autre' + (rest > 1 ? 's' : '') : '')) +
        '</small></span>' +
        (one ? '<button class="btn btn-gold btn-sm" data-claim="' + ready[0].id + '" data-scope="' + ready[0].coll + '">Récupérer</button>'
             : '<button class="btn btn-gold btn-sm" data-claim-all>' + I('gift') + 'Tout récupérer</button>') +
      '</div>';
  }
  // Récupère une récompense (data-claim) ou toutes (data-claim-all) ; renvoie true si le clic est traité
  function claimClick(e) {
    var cl = e.target.closest('[data-claim]');
    if (cl) {
      var res = S.claim(cl.getAttribute('data-scope'), cl.getAttribute('data-claim'));
      if (!res.ok) { U.toast(res.error, 'error'); return true; }
      U.toast(res.step.label + ' : ' + U.rewardText(res.reward) + (res.reward.booster ? ' · dans vos boosters' : ''));
      A.app.rerender();
      return true;
    }
    if (e.target.closest('[data-claim-all]')) {
      var got = readyRewards(), boost = 0, ok = 0, full = 0;
      got.forEach(function (s) { var r = S.claim(s.coll, s.id); if (r.ok) { ok++; if (r.reward.booster) boost++; } else if (r.full) full++; });
      U.toast(ok + ' récompense' + (ok > 1 ? 's' : '') + ' récupérée' + (ok > 1 ? 's' : '') + (boost ? ' · ' + boost + ' booster' + (boost > 1 ? 's' : '') + ' dans vos boosters' : '') +
        (full ? ' · ' + full + ' en attente (réserve pleine)' : ''));
      A.app.rerender();
      return true;
    }
    return false;
  }
  // Une collection en ligne : vignette, nom, progression, prochain palier
  function pgRow(c, eyebrow) {
    var pr = S.collectionProgress(c.id), done = pr.pct >= 1;
    return '<a class="pg-coll' + (done ? ' is-done' : '') + '" href="#/collection/' + c.id + '">' +
      '<span class="pg-art">' + collArt(c, { seed: c.id + '-banner', coll: c.id, rarity: c.status === 'event' ? 'legendary' : 'base', w: 320, h: 200 }, '(max-width: 900px) 96px, 360px') +
        (S.readyCount(c.id) ? '<span class="pg-flag is-gift" title="Récompense à récupérer">' + I('gift') + '<span>Récompense</span></span>'
          : c.status === 'event' ? '<span class="pg-flag">Nouveau</span>' : '') + pgNext(c.id, true) + '</span>' +
      '<span class="pg-copy">' + (eyebrow ? '<span class="eyebrow">' + eyebrow + '</span>' : '') + '<span class="pg-name">' + U.esc(c.name) + '</span>' +
        '<span class="pg-n"><b>' + pr.owned + '/' + pr.total + '</b><i style="--p:' + Math.round(pr.pct * 100) + '%"></i>' + (done ? '<em>' + I('check') + 'Complète</em>' : '') + '</span>' +
        pgNext(c.id) + '</span>' + I('chevR') + '</a>';
  }
  // L’événement en cours : première vignette, objet de musée et temps restant en doré
  function pgEvent(ev) {
    var pr = S.collectionProgress(ev.id), days = Math.ceil(S.eventRemaining() / 864e5);
    return '<a class="pg-coll is-event" href="#/collection/' + ev.id + '">' +
      '<span class="pg-art">' + collArt(ev, { seed: 'event-hero', coll: ev.id, rarity: 'legendary', w: 320, h: 200 }, '(max-width: 900px) 96px, 360px', 'objet') +
        '<span class="pg-flag">Événement</span>' + pgNext(ev.id, true) + '</span>' +
      '<span class="pg-copy"><span class="eyebrow">Encore ' + days + ' jour' + (days > 1 ? 's' : '') + '</span><span class="pg-name">' + U.esc(ev.name) + '</span>' +
        '<span class="pg-n"><b>' + pr.owned + '/' + pr.total + '</b><i style="--p:' + Math.round(pr.pct * 100) + '%"></i></span>' +
        pgNext(ev.id) + '</span>' + I('chevR') + '</a>';
  }
  // Prochain palier, en une ligne courte : « Encore 1 personnage · Personnage secret »
  // onArt : la même info en pastille sur l’illustration (ordinateur) ; sous le nom sur mobile, la vignette est trop petite
  function pgNext(cid, onArt) {
    var s = S.rewards(cid).filter(function (x) { return x.state === 'locked'; })[0];
    if (!s) return '';
    var left = s.goal - s.have, unit = s.of === 'chars' ? 'personnage' : 'édition';
    return '<span class="pg-next' + (onArt ? ' is-on-art' : '') + '">' + U.rewardIcon(s.reward) + '<span>Encore ' + left + ' ' + unit + (left > 1 ? 's' : '') + ' · ' + U.esc(U.rewardText(s.reward).split(' + ')[0]) + '</span></span>';
  }
  /* Vitrine du sachet : halo à la couleur du sachet et globe gravé en filigrane (statique, aucun calque GPU) */
  var PLAY_AURA = '<span class="play-aura" aria-hidden="true"><i class="pa-halo"></i>' + globe() + '</span>';
  /* En bas à droite du sachet : « Tout recharger » (mode test) au-dessus, probabilités en dessous */
  function playSide(p) {
    return '<div class="play-tools">' +
      (S.UNLIMITED ? '<button class="play-tool is-test" data-dev-refill title="Tout recharger (test)" aria-label="Tout recharger (test)">' + I('reset') + '</button>' : '') +
      (S.UNLIMITED ? '<button class="play-tool is-test' + (A.PACK_MODEL_PILLOW ? ' is-on' : '') + '" data-pack-shape title="Sachet : ' + (A.PACK_MODEL_PILLOW ? 'strié (revenir au classique)' : 'classique (revenir au strié)') + ' — test" aria-pressed="' + !!A.PACK_MODEL_PILLOW + '" aria-label="Changer de sachet (test)">' +
        '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/></svg></button>' : '') +
      '<button class="play-tool" data-odds="' + p.id + '" title="Probabilités" aria-label="Probabilités du ' + U.esc(p.name) + '"><b>%</b></button></div>';
  }
  /* Arène : votre bilan, votre meilleure équipe (trois cartes) et les trois modes, jouables d’un geste */
  var HC_MODES = [
    ['duel', 'swords', 'Duel tactique', 'Attaquer, défendre ou charger : devinez le coup adverse.', '3 cartes · 3 manches'],
    ['quiz', 'scroll', 'Quiz des légendes', 'Liens, repères et récits des univers de vos cartes.', '100 PV · 5 manches'],
    ['terrains', 'laurel', 'Trois terrains', 'Déployez vos renforts sur trois fronts, avec une bannière de +20.', '5 cartes · 3 fronts']
  ];
  function combatHTML() {
    var c = S.combat();
    var ros = A.combat && A.combat.roster ? A.combat.roster() : [], team = ros.slice(0, 3), ready = ros.length >= 3;
    var stats = [['Victoires', c.w], ['Série', c.streak], ['Record', c.best]];
    return '<section class="section h-combat"><div class="container">' +
      sectionHead('Combat', 'L’arène des légendes', ['Ouvrir l’arène', '#/combat']) +
      '<div class="hc-grid">' +
        '<div class="hc-team">' +
          '<p class="hc-label">' + (ready ? 'Votre meilleure équipe' : 'Votre équipe') + '</p>' +
          (team.length ? '<div class="hc-fan">' + team.map(function (it, k) {
            return '<a class="hc-card is-' + k + '" href="#/inventaire" aria-label="' + U.esc(A.CHAR[A.ED[it.ed].charId].name) + '">' + U.card(it.ed, { serial: it.serial, open: false, tilt: false, ctx: 'mini' }) + '</a>';
          }).join('') + '</div>' : '') +
          (ready ? '' : '<p class="hc-need">Il vous faut trois personnages différents pour combattre. <a href="#/">Ouvrez un booster</a>.</p>') +
          '<dl class="hc-stats">' + stats.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + U.num(x[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<p class="hc-gain">' + I('coin') + '<span><b>' + S.COMBAT_REWARD + ' Éclats</b> par victoire, dans les trois modes</span></p>' +
        '</div>' +
        '<div class="hc-modes">' + HC_MODES.map(function (m) {
          return '<a class="hc-mode" href="#/combat' + (ready ? '?mode=' + m[0] : '') + '">' +
            '<span class="hc-ic">' + I(m[1]) + '</span>' +
            '<span class="hc-copy"><span class="hc-name">' + m[2] + '</span><span class="hc-desc">' + m[3] + '</span><span class="hc-meta">' + m[4] + '</span></span>' +
            '<span class="btn btn-gold btn-sm hc-go">' + I(m[1]) + 'Jouer</span></a>';
        }).join('') + '</div>' +
      '</div></div></section>';
  }
  /* Marketplace : une bande sombre mise en avant, avec ses deux entrées (acheter, vendre)
     et, par défaut, les annonces de cartes que vous n’avez pas encore */
  function marketHTML() {
    var L = S.listings().filter(function (l) { return !l.mine; }), week = Date.now() - 7 * 864e5;
    var sold = S.sales().filter(function (x) { return x.at > week; }).length;
    var miss = L.filter(function (l) { return !S.ownedOf(l.ed).length; }).length;
    var first = miss ? 'missing' : 'rare';
    var sorts = (miss ? [['missing', 'Qui vous manquent']] : []).concat([['rare', 'Les plus rares'], ['cheap', 'Petits prix'], ['new', 'Nouveautés']]);
    return '<section class="section section-dark is-fixed-dark h-trade h-mk"><div class="container">' +
      '<div class="mk-band-head">' +
        '<div class="mk-band-copy"><p class="eyebrow">Marketplace</p><h2 class="h2">La salle des ventes</h2>' +
          '<p class="mk-meta"><b>' + U.num(L.length) + '</b> annonces<span>·</span><b>' + U.num(sold) + '</b> ventes cette semaine</p></div>' +
        '<div class="mk-band-cta"><a class="btn btn-gold" href="#/marketplace">' + I('market') + 'Explorer la marketplace</a>' +
          '<a class="btn btn-ghost-light" href="#/inventaire">' + I('tag') + 'Vendre une carte</a></div>' +
      '</div>' +
      '<div class="mk-sort" role="tablist">' + sorts.map(function (s) {
        return '<button' + (s[0] === first ? ' class="is-on"' : '') + ' data-mk-sort="' + s[0] + '" role="tab">' + s[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="mk-row" data-mk-row>' + mkItems(L, first) + '</div>' +
    '</div></section>';
  }

  /* ======================================================================
     COLLECTIONS (galerie)
     ====================================================================== */
  var cf = { universe: 'all', q: '', status: '' };
  // Recherche sans accents ni majuscules (« egypte » trouve « Égypte »)
  function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var STATUS = [['todo', 'À compléter'], ['done', 'Complètes'], ['gift', 'Récompenses']];
  /* Collection : une seule page, deux onglets (Mes cartes en premier, puis Albums = le musée) */
  /* Collection : même DA que la page d’un album. Bandeau sans illustration (titre, onglets, texte, chiffres clés,
     progression globale), puis des sections avec surtitre, grand titre et compteur (U.secHead). */
  function hubHero(tab, lead, kpis, cls) {
    return '<section class="coll-hero is-saga is-hub is-plain">' +
      '<div class="container coll-hero-copy">' + hubHead(tab) + '<p class="lead">' + lead + '</p>' +
        '<div class="kpis' + (cls ? ' ' + cls : '') + '">' + kpis + '</div>' +   // tableau de chiffres clés, cases séparées par des filets
      '</div></section>';
  }
  function hubHead(tab) {
    var n = S.items().length;
    return '<div class="hub-head"><div><p class="eyebrow">Galerie</p><h1 class="h1">Collection</h1></div>' +
      '<nav class="hub-tabs" aria-label="Collection">' +
        '<a href="#/inventaire"' + (tab === 'cartes' ? ' class="is-on" aria-current="page"' : '') + '>' + I('cards') + 'Mes cartes<i>' + U.num(n) + '</i></a>' +
        '<a href="#/collections"' + (tab === 'albums' ? ' class="is-on" aria-current="page"' : '') + '>' + I('grid') + 'Albums</a>' +
      '</nav></div>';
  }
  P.collections = {
    title: 'Collection · Albums',
    render: function (ctx) {
      if (ctx && ctx.query && ctx.query.album) cf = { universe: 'all', q: '', status: '' };   // l’album demandé doit être visible
      var unis = A.COLLECTIONS.map(function (c) { return c.universe; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      var done = A.COLLECTIONS.filter(function (c) { return S.collectionProgress(c.id).pct >= 1; }).length;
      var owned = A.CHARS.filter(function (ch) { return S.ownsChar(ch.id); }).length, ready = readyRewards().length;
      return hubHero('albums', A.COLLECTIONS.length + ' collections rangées par univers : complétez-les pour débloquer portraits, titres et personnages secrets.',
          '<div><span>Collections</span><b>' + A.COLLECTIONS.length + '</b></div>' +
          '<div><span>Personnages</span><b>' + owned + '<small> / ' + A.CHARS.length + '</small></b></div>' +
          '<div><span>Complètes</span><b>' + done + '<small> / ' + A.COLLECTIONS.length + '</small></b></div>' +
          '<div class="cf-kpi-gift"><span>Récompenses prêtes</span><b>' + ready + '</b>' +
            (ready ? '<button class="btn btn-gold btn-xs" data-claim-all>' + I('gift') + 'Tout récupérer</button>' : '') + '</div>', 'cf-kpis') +
      '<section class="section-tight cf-res hub-sec"><div class="container">' +
        U.secHead('Albums', 'Les salles du musée', done, A.COLLECTIONS.length, 'complètes') +
        // Filtres comme « Mes cartes » : pastilles de statut à gauche, univers et recherche à droite
        '<div class="toolbar sticky-bar cf-tools">' +
          '<div class="chips scroll-x" role="toolbar">' + [['', 'Toutes']].concat(STATUS).map(function (st) {
            return '<button class="chip' + (cf.status === st[0] ? ' is-active' : '') + '" data-status="' + st[0] + '">' + (st[0] === 'gift' ? I('gift') : '') + st[1] + (st[0] ? '<i class="chip-n" data-n="' + st[0] + '"></i>' : '') + '</button>';
          }).join('') + '</div>' +
          '<div class="tb-filters">' +
            '<label class="select is-compact" title="Univers"><select data-uni-sel aria-label="Univers"><option value="all">Tous les univers</option>' +
              unis.map(function (u) { return '<option value="' + U.esc(u) + '"' + (cf.universe === u ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select></label>' +
            '<label class="search cf-find">' + I('search') + '<input type="search" enterkeyhint="search" autocomplete="off" placeholder="Rechercher…" aria-label="Rechercher une collection, un personnage" value="' + U.esc(cf.q) + '" data-q>' +
              '<button type="button" class="cf-clear" data-clear aria-label="Effacer"' + (cf.q ? '' : ' hidden') + '>' + I('close') + '</button></label>' +
          '</div>' +
        '</div>' +
        '<div class="cf-count" data-count></div><div data-results></div></div></section>' +
      '<section class="section section-alt"><div class="container">' + sectionHead('Prochainement', 'Les collections à venir.') +
        '<div class="upcoming">' + A.UPCOMING.map(function (u) {
          return '<article class="up-item"><div class="up-art">' + A.artImg({ seed: u.id, coll: 'x', rarity: 'base', motif: u.motif, w: 480, h: 280 }) + '<span class="tag">' + u.date + '</span></div><p class="eyebrow">' + u.family + '</p><h3 class="h3">' + u.name + '</h3><p class="muted">' + u.desc + '</p></article>';
        }).join('') + '</div></div></section>';
    },
    mount: function (root, ctx) {
      var res = root.querySelector('[data-results]'), cnt = root.querySelector('[data-count]'), input = root.querySelector('[data-q]');
      function statusOk(c, st) {
        var pr = S.collectionProgress(c.id);
        if (st === 'todo') return pr.pct < 1;
        if (st === 'done') return pr.pct >= 1;
        if (st === 'gift') return S.readyCount(c.id) > 0;
        return true;
      }
      function base(st) {
        return A.COLLECTIONS.filter(function (c) { return (cf.universe === 'all' || c.universe === cf.universe) && statusOk(c, st); });
      }
      function draw() {
        var q = norm(cf.q.trim()), list = base(cf.status);
        // nombres sur les puces de statut (dans l’univers choisi)
        STATUS.forEach(function (st) { var el = root.querySelector('[data-n="' + st[0] + '"]'); if (el) el.textContent = base(st[0]).length; });
        root.querySelector('[data-clear]').hidden = !cf.q;
        var html = '', filtered = cf.universe !== 'all' || cf.status;
        if (q) {
          var colls = list.filter(function (c) { return norm(c.name + ' ' + c.universe + ' ' + (c.family || '') + ' ' + c.tagline).indexOf(q) !== -1; });
          var chars = A.CHARS.filter(function (ch) { return norm(ch.name + ' ' + ch.title).indexOf(q) !== -1; })
            .filter(function (ch) { return list.some(function (c) { return c.id === ch.coll; }); });
          cnt.innerHTML = '<b>' + colls.length + '</b> collection' + (colls.length > 1 ? 's' : '') + '<span>·</span><b>' + chars.length + '</b> personnage' + (chars.length > 1 ? 's' : '');
          if (colls.length) html += '<h2 class="cf-sub">Collections</h2>' + shelf('', colls, true);
          if (chars.length) html += '<h2 class="cf-sub">Personnages</h2><div class="card-grid">' + chars.map(function (ch) {
            var best = S.bestOwned(ch.id);
            return '<div class="cg-item">' + U.card(best ? best.ed : ch.id + '-base', { serial: best && best.serial, uid: best && best.uid, missing: !best }) +
              '<a class="cf-from" href="#/collection/' + ch.coll + '">' + U.esc(A.COLL[ch.coll].name) + '</a>' + U.editionDots(ch.id) + '</div>';
          }).join('') + '</div>';
          if (!colls.length && !chars.length) html = '<div class="empty">Rien ne correspond à « ' + U.esc(cf.q) + ' »' + (filtered ? ' avec ces filtres' : '') + '.' +
            '<button class="btn btn-ghost btn-sm" data-reset-f>Tout effacer</button></div>';
        } else {
          cnt.innerHTML = filtered ? '<b>' + list.length + '</b> collection' + (list.length > 1 ? 's' : '') + '<button class="cf-reset" data-reset-f>Effacer les filtres</button>' : '';
          var shown = {};
          html = (A.GROUPS || []).map(function (g) {
            var subs = list.filter(function (c) { return c.group === g.id; });
            subs.forEach(function (c) { shown[c.id] = true; });
            return subs.length ? groupBlock(g, subs, !filtered) : '';
          }).join('');
          var rest = list.filter(function (c) { return !shown[c.id]; });
          if (rest.length) html += shelf('<div class="shelf-head"><div class="sh-copy"><h2 class="sh-name">Autres collections</h2></div></div>', rest);
          if (!list.length) html = '<div class="empty">' + (cf.status === 'gift' ? 'Aucune récompense à récupérer pour le moment.' : cf.status === 'done' ? 'Aucune collection complète ici pour l’instant.' : 'Toutes ces collections sont complètes. Bravo !') +
            '<button class="btn btn-ghost btn-sm" data-reset-f>Effacer les filtres</button></div>';
        }
        res.innerHTML = html;
      }
      draw();
      root.addEventListener('click', function (e) {
        var t;
        if (claimClick(e)) return;
        if ((t = e.target.closest('[data-rail]'))) {
          var row = t.parentNode.querySelector('[data-rail-row]'), it = row.firstElementChild;
          row.scrollBy({ left: +t.getAttribute('data-rail') * 3 * (it.offsetWidth + 24), behavior: 'smooth' });
          return;
        }
        if ((t = e.target.closest('[data-status]'))) {
          var v = t.getAttribute('data-status'); cf.status = cf.status === v ? '' : v;   // retoucher la pastille l’enlève
        } else if (e.target.closest('[data-clear]')) {
          cf.q = ''; input.value = ''; input.focus();
        } else if (e.target.closest('[data-reset-f]')) {
          cf.q = ''; cf.status = ''; cf.universe = 'all'; input.value = '';
        } else return;
        root.querySelectorAll('[data-status]').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-status') === cf.status); });
        var us = root.querySelector('[data-uni-sel]'); if (us) us.value = cf.universe;
        draw();
      });
      root.addEventListener('change', function (e) {
        if (!e.target.matches('[data-uni-sel]')) return;
        cf.universe = e.target.value; draw();
      });
      // Flèches des rails : visibles seulement s’il reste des collections de ce côté
      function rails() {
        root.querySelectorAll('[data-rail-row]').forEach(function (row) {
          var max = row.scrollWidth - row.clientWidth, w = row.parentNode;
          w.querySelector('.is-prev').hidden = row.scrollLeft <= 2;
          w.querySelector('.is-next').hidden = max <= 2 || row.scrollLeft >= max - 2;
        });
      }
      root.addEventListener('scroll', function (e) { if (e.target.matches && e.target.matches('[data-rail-row]')) rails(); }, true);
      root.addEventListener('toggle', rails, true);   // univers replié qu’on déplie
      window.addEventListener('resize', function onR() { if (!root.isConnected) { window.removeEventListener('resize', onR); return; } rails(); });
      var draw0 = draw; draw = function () { draw0(); rails(); };
      rails();
      var tmr = 0;
      input.addEventListener('input', function () { cf.q = input.value; clearTimeout(tmr); tmr = setTimeout(draw, 120); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') input.blur(); });   // ferme le clavier
      this.refresh = draw;
      var want = ctx && ctx.query && ctx.query.album && root.querySelector('#album-' + ctx.query.album);
      if (want) {
        var fold = want.parentNode.querySelector('.shelf-fold'); if (fold) fold.open = true;
        // après le retour en haut de page fait par le routeur
        requestAnimationFrame(function () { want.scrollIntoView({ block: 'start' }); rails(); });
      }
    }
  };

  /* ======================================================================
     COLLECTION GLOBALE (ex. Mythologie grecque = Olympe + Titans + Géants)
     ====================================================================== */
  // La page d’un album a été retirée (doublon de l’onglet Albums) : les anciens liens mènent à sa ligne dans Albums.
  P.saga = {
    title: 'Albums',
    render: function () { return ''; },
    mount: function (root, ctx) { location.replace('#/collections?album=' + encodeURIComponent(ctx.params[0])); }
  };
  // Retour : flèche ronde à gauche du titre (la destination est dans l’infobulle et pour les lecteurs d’écran)
  function backArrow(href, name) {
    return '<a class="back-arrow" href="' + href + '" title="Retour : ' + U.esc(name) + '" aria-label="Retour : ' + U.esc(name) + '">' + I('arrow') + '</a>';
  }

  /* ======================================================================
     COLLECTION (détail)
     ====================================================================== */
  var cd = { view: 'chars', rarity: 'all', missing: false, q: '' };
  function closeRarityMenu(menu, restoreFocus) {
    menu.classList.remove('is-open', 'opens-up');
    menu.querySelector('[data-rarity-options]').hidden = true;
    var trigger = menu.querySelector('[data-rarity-trigger]');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }
  // Ces écouteurs sont installés une seule fois, indépendamment des changements de page.
  function closeRarityOutside(e) {
    document.querySelectorAll('[data-rarity-menu].is-open').forEach(function (menu) {
      if (!menu.contains(e.target)) closeRarityMenu(menu, false);
    });
  }
  document.addEventListener('pointerdown', closeRarityOutside);
  document.addEventListener('focusin', closeRarityOutside);
  P.collection = {
    title: 'Collection',
    render: function (ctx) {
      var c = A.COLL[ctx.params[0]];
      if (!c) return '<section class="page-head"><div class="container"><h1 class="h1">Collection introuvable</h1><a class="link-arrow" href="#/collections">Retour aux collections ' + I('arrow') + '</a></div></section>';
      this.title = c.name;
      var views = [['chars', 'Personnages'], ['all', 'Éditions']];
      // Même présentation que la page d’album : titre, chiffres + barre, puis paliers et missions en cartes
      return '<section class="coll-hero is-saga is-plain is-coll">' +
        '<div class="container coll-container coll-hero-copy">' +
          '<p class="eyebrow">' + c.family + ' · ' + c.edition + (c.status === 'event' ? ' · Événement' : '') + '</p>' +
          '<div class="title-row">' + (c.group ? backArrow('#/collections?album=' + c.group, A.GROUP[c.group].name) : backArrow('#/collections', 'Albums')) + '<h1 class="h1">' + c.name + '</h1></div><p class="lead">' + c.description + '</p>' +
          '<div data-coll-progress>' + U.collectionFigures(c.id) + '</div>' +
        '</div></section>' +
        '<section class="section-tight qs-strip-sec"><div class="container coll-container" data-rewards>' + U.questStrip(c.id) + '</div></section>' +
        (U.duelSetsFor(c.id).length ? '<section class="section-tight du-sec"><div class="container" data-duels>' + U.duelSetsFor(c.id).map(U.duelsHTML).join('') + '</div></section>' : '') +
        '<section class="section-tight coll-browse"><div class="container coll-container">' +
          '<div class="toolbar sticky-bar coll-toolbar">' +
            '<div class="coll-view"><span class="coll-filter-label">Vue</span><div class="chips" data-f="view" role="group" aria-label="Vue de l’album">' + views.map(function (v) {
              return '<button class="chip' + (cd.view === v[0] ? ' is-active' : '') + '" data-v="' + v[0] + '" aria-pressed="' + (cd.view === v[0]) + '">' + v[1] + '</button>';
            }).join('') + '</div>' +
            '</div><div class="coll-rarity" data-rarity-menu>' +
              '<button type="button" class="coll-rarity-trigger" data-rarity-trigger aria-label="Rareté des éditions : ' + (A.R[cd.rarity] ? A.R[cd.rarity].label : 'Toutes') + '" aria-haspopup="listbox" aria-expanded="false" aria-controls="coll-rarity-options">' +
                '<span class="coll-rarity-caption">Rareté</span><span class="coll-rarity-value' + (cd.rarity !== 'all' ? ' r-' + cd.rarity : '') + '" data-rarity-current><i' + (cd.rarity === 'all' ? ' hidden' : '') + '></i><span>' + (A.R[cd.rarity] ? A.R[cd.rarity].label : 'Toutes') + '</span></span>' + I('chevR') + '</button>' +
              '<div class="coll-rarity-options" id="coll-rarity-options" role="listbox" aria-label="Rareté des éditions" data-rarity-options hidden>' + [{ id: 'all', label: 'Toutes' }].concat(A.RARITIES).map(function (r) {
                return '<button type="button" role="option" tabindex="-1" class="coll-rarity-option' + (r.id === 'all' ? ' is-all' : ' r-' + r.id) + '" aria-selected="' + (cd.rarity === r.id) + '" data-rarity-value="' + r.id + '"><i class="coll-rarity-dot"></i><span>' + r.label + '</span>' + I('check') + '</button>';
              }).join('') + '</div></div>' +
            '<label class="search">' + I('search') + '<input type="search" aria-label="Rechercher un personnage" placeholder="Rechercher un personnage…" value="' + U.esc(cd.q) + '" data-q></label>' +
            '<label class="toggle"><input type="checkbox" data-missing' + (cd.missing ? ' checked' : '') + '><span></span>Manquantes</label>' +
          '</div>' +
          '<p class="coll-result-count" data-result-count aria-live="polite"></p><div data-results></div>' +
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
          var rids = cd.rarity === 'all' ? A.RARITIES.map(function (r) { return r.id; }) : [cd.rarity];
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
        root.querySelector('[data-result-count]').textContent = cells.length + (cells.length > 1 ? ' cartes affichées' : ' carte affichée');
        res.innerHTML = cells.length ? '<div class="card-grid">' + cells.join('') + '</div>' :
          '<div class="empty">' + (cd.missing ? 'Rien ne manque ici. Collection complète pour ce filtre.' : 'Aucune carte pour ce filtre.') + '</div>';
      }
      draw();
      var rw = root.querySelector('[data-rewards]');
      var rarityMenu = root.querySelector('[data-rarity-menu]');
      var rarityTrigger = rarityMenu.querySelector('[data-rarity-trigger]');
      var rarityOptions = rarityMenu.querySelector('[data-rarity-options]');
      var rarityButtons = Array.from(rarityOptions.querySelectorAll('[data-rarity-value]'));
      function openRarityMenu(edge) {
        raritySearch = ''; raritySearchAt = 0;
        rarityOptions.hidden = false;
        rarityOptions.style.maxHeight = '';
        rarityMenu.classList.add('is-open');
        rarityTrigger.setAttribute('aria-expanded', 'true');
        var rect = rarityTrigger.getBoundingClientRect(), limit = window.innerHeight - 12;
        var tabbar = document.querySelector('.tabbar');
        if (tabbar && getComputedStyle(tabbar).display !== 'none') limit = Math.min(limit, tabbar.getBoundingClientRect().top - 8);
        var topLimit = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 8;
        var below = Math.max(0, limit - rect.bottom - 8), above = Math.max(0, rect.top - topLimit - 8);
        var opensUp = rarityOptions.offsetHeight > below && above > below;
        rarityMenu.classList.toggle('opens-up', opensUp);
        rarityOptions.style.maxHeight = Math.max(80, Math.min(320, opensUp ? above : below)) + 'px';
        var target = edge === 'first' ? rarityButtons[0] : edge === 'last' ? rarityButtons[rarityButtons.length - 1] : rarityOptions.querySelector('[aria-selected="true"]');
        target.focus({ preventScroll: true });
        rarityOptions.scrollTop = Math.max(0, target.offsetTop - rarityOptions.clientHeight / 2);
      }
      function syncFilters() {
        root.querySelectorAll('[data-f="view"] .chip').forEach(function (x) {
          var active = x.getAttribute('data-v') === cd.view;
          x.classList.toggle('is-active', active); x.setAttribute('aria-pressed', active);
        });
        var rarityLabel = A.R[cd.rarity] ? A.R[cd.rarity].label : 'Toutes';
        var currentRarity = rarityMenu.querySelector('[data-rarity-current]');
        currentRarity.className = 'coll-rarity-value' + (cd.rarity !== 'all' ? ' r-' + cd.rarity : '');
        currentRarity.querySelector('i').hidden = cd.rarity === 'all';
        currentRarity.querySelector('span').textContent = rarityLabel;
        rarityTrigger.setAttribute('aria-label', 'Rareté des éditions : ' + rarityLabel);
        rarityButtons.forEach(function (button) { button.setAttribute('aria-selected', String(button.getAttribute('data-rarity-value') === cd.rarity)); });
        root.querySelector('[data-missing]').checked = cd.missing;
        root.querySelector('[data-q]').value = cd.q;
      }
      root.addEventListener('click', function (e) {
        var rarityChoice = e.target.closest('[data-rarity-value]');
        if (rarityChoice) {
          cd.rarity = rarityChoice.getAttribute('data-rarity-value');
          if (cd.rarity !== 'all') cd.view = 'all';
          syncFilters(); draw(); closeRarityMenu(rarityMenu, true);
          return;
        }
        if (e.target.closest('[data-rarity-trigger]')) {
          if (rarityOptions.hidden) openRarityMenu();
          else closeRarityMenu(rarityMenu, true);
          return;
        }
        var k = e.target.closest('[data-claim]');
        if (k) {
          var res = S.claim(c.id, k.getAttribute('data-claim'));
          if (!res.ok) { U.toast(res.error, 'error'); return; }
          U.toast(res.step.label + ' : ' + U.rewardText(res.reward) + (res.reward.booster ? ' · dans vos boosters' : ''));
          return;
        }
        if (e.target.closest('[data-show-missing]')) {
          cd.view = 'all'; cd.rarity = 'all'; cd.missing = true; cd.q = '';
          syncFilters(); draw();
          var toolbar = root.querySelector('.coll-toolbar');
          toolbar.scrollIntoView({ block: 'start' });
          root.querySelector('[data-q]').focus({ preventScroll: true });
          return;
        }
        var b = e.target.closest('[data-f="view"] .chip');
        if (!b) return;
        cd.view = b.getAttribute('data-v');
        if (cd.view === 'chars') cd.rarity = 'all';
        syncFilters(); draw();
      });
      var raritySearch = '', raritySearchAt = 0;
      rarityMenu.addEventListener('keydown', function (e) {
        var key = e.key;
        if (e.target === rarityTrigger) {
          if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
            e.preventDefault(); openRarityMenu(key === 'Home' ? 'first' : key === 'End' ? 'last' : undefined);
          }
          return;
        }
        var index = rarityButtons.indexOf(document.activeElement), next = index;
        if (key === 'Escape') { e.preventDefault(); closeRarityMenu(rarityMenu, true); return; }
        if (key === 'Tab') {
          e.preventDefault(); closeRarityMenu(rarityMenu, false);
          (e.shiftKey ? rarityTrigger : root.querySelector('[data-q]')).focus({ preventScroll: true });
          return;
        }
        if (key === 'Enter' || key === ' ') { e.preventDefault(); if (index >= 0) rarityButtons[index].click(); return; }
        if (key === 'ArrowDown') next = Math.min(rarityButtons.length - 1, index + 1);
        else if (key === 'ArrowUp') next = Math.max(0, index - 1);
        else if (key === 'Home') next = 0;
        else if (key === 'End') next = rarityButtons.length - 1;
        else if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          var now = Date.now();
          raritySearch = (now - raritySearchAt < 600 ? raritySearch : '') + key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          raritySearchAt = now;
          next = rarityButtons.findIndex(function (button) { return button.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(raritySearch) === 0; });
          if (next < 0) return;
        } else return;
        e.preventDefault(); rarityButtons[next].focus({ preventScroll: true });
        rarityButtons[next].scrollIntoView({ block: 'nearest' });
      });
      root.querySelector('[data-q]').addEventListener('input', function (e) { cd.q = e.target.value; draw(); });
      root.querySelector('[data-missing]').addEventListener('change', function (e) { cd.missing = e.target.checked; draw(); });
      this.refresh = function () {
        draw(); rw.innerHTML = U.questStrip(c.id);
        root.querySelector('[data-coll-progress]').innerHTML = U.collectionFigures(c.id);
        var du = root.querySelector('[data-duels]'); if (du) du.innerHTML = U.duelSetsFor(c.id).map(U.duelsHTML).join('');
      };
    }
  };

  /* ======================================================================
     PROBABILITÉS DES BOOSTERS (fenêtre ouverte depuis l’accueil)
     ====================================================================== */
  
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
  /* Fenêtre « Probabilités » d’un booster (ouverte depuis l’accueil, bouton %).
     Lecture simple d’abord : pour chaque rareté, « 1 sachet sur N » (chance d’en avoir au moins une
     dans un sachet), puis le taux par carte et le stock restant. Le détail du calcul est replié. */
  function rarityPackChance(p, rid) {
    var miss = 1;
    for (var k = 0; k < p.size; k++) {
      var tot = 0, hit = 0;
      S.packOdds(p.id, !!(p.guarantee && k === p.size - 1)).forEach(function (r) { tot += r.p; if (r.rarity === rid) hit += r.p; });
      miss *= 1 - (tot ? hit / tot : 0);
    }
    return 1 - miss;
  }
  function oneIn(c) {
    if (c >= 0.995) return '<b>Chaque</b> sachet';
    if (c >= 0.5) return '<b>' + Math.round(c * 100) + '&nbsp;%</b> des sachets';
    return '<b>1</b> sachet sur <b>' + U.num(Math.round(1 / c)) + '</b>';
  }
  function oddsModal(id) {
    var p = A.PACK[id], rows = S.packOdds(id).slice().reverse();   // de la plus rare à la plus courante
    var rs = packRarities(p).filter(function (r) { return r !== 'base'; });
    var wins = showcase(p, rs.concat(rs, rs), true).slice(0, 3);
    // Une ligne par rareté : nom, barre de chance (échelle logarithmique, pour que l’Unique reste visible), « 1 sachet sur N »
    var LOGMIN = Math.log(1 / 5000);
    var list = rows.map(function (r) {
      var R = A.R[r.rarity], c = rarityPackChance(p, r.rarity);
      var w = c >= 0.995 ? 100 : Math.max(3, Math.min(100, (1 - Math.log(Math.max(c, 1 / 5000)) / LOGMIN) * 100));
      return '<li class="om-row r-' + r.rarity + '">' +
        '<span class="om-name"><i></i>' + R.label + '</span>' +
        '<span class="om-bar" aria-hidden="true"><i style="--w:' + w.toFixed(1) + '%"></i></span>' +
        '<span class="om-odds">' + oneIn(c) + '</span></li>';
    }).join('');
    // Détail replié : taux par carte et stock restant
    var table = '<table class="om-table"><thead><tr><th>Rareté</th><th>Par carte</th><th>Stock restant</th></tr></thead><tbody>' + rows.map(function (r) {
      return '<tr class="r-' + r.rarity + '"><td><i></i>' + A.R[r.rarity].label + '</td><td>' + U.pct(r.p) + '</td><td>' + (r.total == null ? 'Illimité' : U.num(r.remaining) + ' / ' + U.num(r.total)) + '</td></tr>';
    }).join('') + '</tbody></table>';
    var g = p.guarantee ? S.packOdds(id, true) : null;
    // En-tête : la rareté vedette du booster, en grand
    var lure = p.lure || 'epic', lc = rarityPackChance(p, lure), ln = lc >= 0.5 ? 2 : Math.max(2, Math.round(1 / lc));   // même chiffre que sa ligne dans la liste
    var lureHTML = p.fixed ? '<div class="om-lure r-unique"><b>5<small>sur</small>5</b><span>cartes numérotées, de la Rare à l’Unique</span></div>'
      : '<div class="om-lure r-' + lure + '"><b>1<small>sur</small>' + U.num(ln) + '</b><span class="om-lure-l">chance d’obtenir une <em>' + A.R[lure].label + '</em> dans un sachet</span><span class="om-lure-s">chance d’une <em>' + A.R[lure].label + '</em></span></div>';
    U.modal('<div class="odds-modal is-' + p.theme + '">' +
      '<header class="om-head"><div class="om-id"><p class="eyebrow">Probabilités</p><h2 class="om-title">' + p.name + '</h2>' +
        '<p class="om-kicker">' + p.size + ' cartes<span>·</span>' + p.kicker + '</p></div>' + lureHTML + '</header>' +
      (wins.length ? '<section class="om-sec om-sec-wins"><h3 class="om-h">À gagner</h3><div class="om-wins">' + wins.map(function (ed) {
          return '<figure class="om-win r-' + ed.rarity + '">' + U.card(ed.id, { open: false, tilt: false, ctx: 'mini' }) + '<figcaption><b>' + U.esc(A.CHAR[ed.charId].name) + '</b><span class="rar-chip r-' + ed.rarity + '"><i></i>' + A.R[ed.rarity].label + '</span></figcaption></figure>';
        }).join('') + '</div></section>' : '') +
      '<section class="om-sec"><h3 class="om-h">Chances par sachet</h3><ul class="om-list">' + list + '</ul>' +
        (g ? '<p class="om-guar" title="' + g.map(function (r) { return A.R[r.rarity].label + ' ' + U.pct(r.p).replace(/&nbsp;/g, ' '); }).join(' · ') + '">' + I('sparkle') + '<span><b>Dernière carte garantie</b> : une Rare ou mieux dans chaque sachet</span></p>' : '') +
      '</section>' +
      '<details class="om-how"><summary>Détail et calcul des probabilités' + I('chevR') + '</summary>' + table +
        '<p>Chaque carte est tirée selon un taux de référence par rareté, multiplié par la part du stock encore disponible : quand une rareté s’épuise, ses chances baissent et la part non attribuée revient à la rareté la plus courante. Les quantités d’édition (250, 100, 50…) ne sont pas des probabilités. « 1 sachet sur N » indique la chance d’obtenir au moins une carte de cette rareté dans un sachet.</p><p>Les numéros ne sont jamais émis deux fois. Réserve et quotidien sont comptés par compte ; les boosters d’événement se gagnent en jouant, rien n’est à acheter.</p></details>' +
      '</div>', { cls: 'is-small is-odds' });
  }

  /* ======================================================================
     INVENTAIRE
     ====================================================================== */
  var inv = { sort: 'recent', rarity: 'all', coll: 'all', only: 'all', select: false, selected: [] };
  var SORTS = { recent: 'Plus récentes', rarity: 'Rareté', collection: 'Collection', name: 'Personnage' };
  P.inventory = {
    title: 'Collection · Mes cartes',
    render: function () {
      var items = S.items();
      var numbered = items.filter(function (i) { return i.serial != null; }).length;
      var distinct = {}; items.forEach(function (i) { distinct[A.ED[i.ed].charId] = 1; });
      var complete = A.COLLECTIONS.filter(function (c) { return S.collectionProgress(c.id).pct >= 1; }).length;
      var showcase = items.filter(function (i) { return i.show; });
      var nChars = Object.keys(distinct).length;
      return hubHero('cartes', 'Toutes les cartes que vous avez tirées : exposez les plus belles, échangez ou vendez les doublons.',
          '<div><span>Cartes</span><b>' + items.length + '</b></div>' +
          '<div><span>Personnages</span><b>' + nChars + '<small> / ' + A.CHARS.length + '</small></b></div>' +
          '<div><span>Numérotées</span><b>' + numbered + '</b></div>' +
          '<div><span>Collections terminées</span><b>' + complete + '<small> / ' + A.COLLECTIONS.length + '</small></b></div>') +
        // Vitrine publique : 5 emplacements, les libres en pointillé
        '<section class="section-tight hub-sec"><div class="container">' +
          U.secHead('Vitrine publique', 'Vos cartes exposées', Math.min(showcase.length, S.SHOWCASE_MAX), S.SHOWCASE_MAX, 'emplacements') +
          '<p class="hub-note">Ces cartes apparaissent sur votre profil public.</p><div class="showcase-row is-slots">' +
          showcase.slice(0, S.SHOWCASE_MAX).map(function (i) { return '<div class="sc-item">' + U.card(i.ed, { serial: i.serial, uid: i.uid }) + '</div>'; }).join('') +
          Array.from({ length: Math.max(0, S.SHOWCASE_MAX - showcase.length) }, function () {
            return '<div class="sc-item sc-empty"><span>' + I('star') + '<b>Emplacement libre</b><small>Ouvrez une carte, puis touchez « Vitrine »</small></span></div>';
          }).join('') + '</div></div></section>' +
        '<section class="section-tight hub-sec">' +
          '<div class="container inv-layout">' +
          '<div class="inv-main">' +
          U.secHead('Inventaire', 'Toutes vos cartes') +
          // Filtres : raretés sur la 1re ligne, collection, affichage, tri et échange sur la 2e
            '<div class="toolbar sticky-bar inv-tools">' +
              '<div class="chips scroll-x" data-f="rarity">' + [['all', 'Toutes']].concat(A.RARITIES.map(function (r) { return [r.id, r.label]; }), [['secret', 'Secrète']]).map(function (v) {
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
          '<aside class="inv-side"><div class="side-card"><div class="side-head"><p class="eyebrow">Collections en cours</p><span class="muted small">' + complete + ' / ' + A.COLLECTIONS.length + ' terminées</span></div>' + (function () {
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
      var more = null, CHUNK = 40, shownLast = 0;
      // Rareté « Secrète » : les personnages secrets ne sont pas des cartes de booster. On montre ceux obtenus,
      // puis ceux dont le portrait commence à se révéler (au moins un personnage de la collection possédé).
      function drawSecrets() {
        if (more) { more.disconnect(); more = null; }
        var cols = A.COLLECTIONS.filter(function (c) { return A.SECRET && A.SECRET[c.id] && (inv.coll === 'all' || inv.coll === c.id); });
        var got = cols.filter(function (c) { return S.trophy(c.id); });
        var started = cols.filter(function (c) { return !S.trophy(c.id) && S.collectionProgress(c.id).owned > 0; })
          .sort(function (a, b) { return S.collectionProgress(b.id).pct - S.collectionProgress(a.id).pct; });
        function grid(list) { return '<div class="card-grid">' + list.map(function (c) {
          var pr = S.collectionProgress(c.id);
          return '<div class="cg-item">' + U.secretCard(c.id) + '<p class="cg-note">' + U.esc(c.name) + (S.trophy(c.id) ? '' : ' · ' + pr.owned + '/' + pr.total) + '</p></div>';
        }).join('') + '</div>'; }
        res.innerHTML = '<p class="result-count">' + got.length + ' personnage' + (got.length > 1 ? 's' : '') + ' secret' + (got.length > 1 ? 's' : '') + ' obtenu' + (got.length > 1 ? 's' : '') + '</p>' +
          (got.length ? '<div class="inv-period"><p class="eyebrow">Obtenus</p>' + grid(got) + '</div>' : '<p class="inv-secret-note">Un personnage secret est remis quand une collection est complète. Chaque personnage obtenu révèle un fragment de son portrait.</p>') +
          (started.length ? '<div class="inv-period"><p class="eyebrow">En cours de révélation</p>' + grid(started) + '</div>' : '');
      }
      function draw(keep) {   // keep : garde au moins autant de tuiles qu’avant (sélection, sans saut de défilement)
        if (inv.rarity === 'secret') { drawSecrets(); return; }
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
          // Doublons : les autres exemplaires sont la même carte, décalée derrière (2 au plus), pas des feuilles vides
          var ghosts = t.n > 1 ? Array.from({ length: Math.min(2, t.n - 1) }, function (_, k) {
            return '<span class="cg-ghost is-' + (k + 1) + '" aria-hidden="true">' + U.card(i.ed, { serial: i.serial, open: false, tilt: false }) + '</span>';
          }).reverse().join('') : '';
          return '<div class="cg-item' + (t.n > 1 ? ' is-stack' + (t.n > 2 ? ' is-stack-3' : '') : '') + '">' + ghosts + U.card(i.ed, {
            serial: i.serial, uid: i.uid, fav: i.fav, show: i.show,
            badge: t.n > 1 ? '×' + t.n : (!inv.select ? '' : l.count[i.ed] > 1 ? 'Doublon ×' + l.count[i.ed] : ''),
            open: !inv.select, select: inv.select, selected: inv.selected.indexOf(i.uid) !== -1, tilt: !inv.select
          }) + '<p class="cg-note">' + (t.n > 1 ? t.n + ' exemplaires · ' : '') + U.ago(i.at) + '</p></div>';
        }
        // Affichage par tranches : seules les premières tuiles sont construites, la suite arrive au défilement
        // (un inventaire de plusieurs milliers de cartes d’un coup fait planter Safari iOS).
        if (more) { more.disconnect(); more = null; }
        res.innerHTML = '<p class="result-count">' + l.items.length + ' carte' + (l.items.length > 1 ? 's' : '') +
          (tiles.length !== l.items.length ? ' · ' + tiles.length + ' différente' + (tiles.length > 1 ? 's' : '') : '') + '</p>' +
          (l.items.length ? '<div data-tiles></div><div class="inv-more" data-more></div>' : '<div class="empty">Aucune carte pour ces filtres. <a href="#/">Ouvrir un booster</a></div>');
        var box = res.querySelector('[data-tiles]'), sentinel = res.querySelector('[data-more]'), shown = 0, cur = null, grid = null;
        function chunk() {
          var end = Math.min(tiles.length, shown + CHUNK), html = '';
          for (; shown < end; shown++) {
            var t = tiles[shown];
            if (inv.sort === 'recent') {   // tri par date : regroupement par période d’obtention
              var lb = dayLabel(t.i.at);
              if (lb !== cur) { flushHtml(); cur = lb; box.insertAdjacentHTML('beforeend', '<div class="inv-period"><p class="eyebrow">' + lb + '</p><div class="card-grid"></div></div>'); grid = box.lastElementChild.querySelector('.card-grid'); }
            } else if (!grid) { box.innerHTML = '<div class="card-grid"></div>'; grid = box.firstElementChild; }
            html += tile(t);
          }
          flushHtml();
          function flushHtml() { if (html && grid) { grid.insertAdjacentHTML('beforeend', html); html = ''; } }
          shownLast = shown;
          if (shown >= tiles.length && more) { more.disconnect(); more = null; sentinel.remove(); }
        }
        if (box) {
          var want = keep ? shownLast : 0;
          do chunk(); while (shown < tiles.length && shown < want);
          if (shown < tiles.length) {
            if ('IntersectionObserver' in window) {
              more = new IntersectionObserver(function (en) {
                if (!en[0].isIntersecting) return;
                chunk();
                if (more) { more.unobserve(sentinel); more.observe(sentinel); }   // toujours visible : on relance pour la tranche suivante
              }, { rootMargin: '900px 0px' });
              more.observe(sentinel);
            } else while (shown < tiles.length) chunk();
          } else sentinel.remove();
        }
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
          draw(true); return;
        }
        if (e.target.closest('[data-sel-clear]')) { inv.selected = []; draw(true); return; }
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
  /* Filtres : mêmes composants que « Mes cartes » (raretés en pastilles, puis menus compacts) */
  var MK0 = { q: '', rarity: 'all', coll: 'all', price: 'all', only: 'all', sort: 'recent' };
  var mk = Object.assign({}, MK0);
  var MK_PRICES = { all: ['Tous les prix'], lt100: ['Moins de 100', 0, 99], to1k: ['100 à 1 000', 100, 1000], to5k: ['1 000 à 5 000', 1000, 5000], gt5k: ['Plus de 5 000', 5000, Infinity] };
  var MK_SORTS = { recent: 'Plus récentes', asc: 'Prix croissant', desc: 'Prix décroissant', rarity: 'Rareté', serial: 'Numéro' };
  function mkSelect(key, title, opts) {
    return '<label class="select is-compact" title="' + title + '"><select data-mk="' + key + '" aria-label="' + title + '">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (mk[key] === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('') + '</select></label>';
  }
  /* Colonne de droite, comme « Mes cartes » : mes annonces, ventes récentes, portefeuille */
  function mkSide() {
    var L = S.listings(), mine = L.filter(function (l) { return l.mine; }), sales = S.sales();
    function row(l, sub) {
      var e = A.ED[l.ed];
      return '<li><span>' + U.esc(A.CHAR[e.charId].name) + '<small>' + A.R[e.rarity].label + (e.supply ? ' · ' + U.serial(l.serial, e.supply) : '') + ' · ' + sub + '</small></span><b>' + U.num(l.price) + '</b></li>';
    }
    return '<div class="side-card"><div class="side-head"><p class="eyebrow">Mes annonces</p><span class="muted small">' + mine.length + ' en vente</span></div>' +
        (mine.length ? '<ul class="ledger">' + mine.slice(0, 3).map(function (l) { return row(l, U.ago(l.at)); }).join('') + '</ul>' +
          '<button class="side-more link-btn" data-mk-mine>' + (mine.length > 3 ? 'Voir les ' + mine.length + ' annonces' : 'Voir mes annonces') + ' ' + I('arrow') + '</button>'
          : '<p class="muted small mk-side-note">Aucune carte en vente. Ouvrez une carte de votre inventaire, puis touchez « Mettre en vente ».</p><a class="side-more" href="#/inventaire">Mes cartes ' + I('arrow') + '</a>') + '</div>' +
      '<div class="side-card"><div class="side-head"><p class="eyebrow">Ventes récentes</p><span class="muted small">' + sales.length + '</span></div><ul class="ledger">' +
        sales.slice(0, 5).map(function (x) { return row(x, U.ago(x.at)); }).join('') + '</ul>' +
        (sales.length ? '<a class="side-more" href="#/marketplace" data-mk-hist>Tout l’historique ' + I('arrow') + '</a>' : '') + '</div>' +
      '<div class="side-card"><div class="side-head"><p class="eyebrow">Portefeuille</p><button class="link-btn small" data-buy>Recharger</button></div><p class="side-balance">' + U.price(S.balance()) + '</p></div>';
  }
  P.market = {
    title: 'Marketplace',
    render: function (ctx) {
      if (ctx.query.q != null) mk.q = ctx.query.q;
      var L = S.listings(), sales = S.sales();
      // Chiffres clés de la salle : l’offre (annonces, vendeurs) et l’activité de la semaine (ventes, volume)
      var week = sales.filter(function (s) { return Date.now() - s.at < 7 * 86400000; });
      var vol = week.reduce(function (a, s) { return a + s.price; }, 0);
      var sellers = {}; L.forEach(function (l) { sellers[l.seller] = 1; });
      return '<section class="page-head"><div class="container">' +
        '<p class="eyebrow">Salle des ventes</p><h1 class="h1">Marketplace</h1>' +
        '<p class="lead">Achetez et vendez des exemplaires entre collectionneurs, à prix fixe. Chaque annonce indique l’édition, le numéro et la provenance.</p>' +
        '<div class="kpis">' +
          '<div><span>Annonces</span><b>' + L.length + '</b></div>' +
          '<div><span>Vendeurs</span><b>' + Object.keys(sellers).length + '</b></div>' +
          '<div><span>Ventes · 7 jours</span><b>' + week.length + '</b></div>' +
          '<div><span>Volume · 7 jours</span><b>' + U.price(vol) + '</b></div>' +
        '</div>' +
        '<div class="notice">' + I('lock') + '<span>Transactions simulées en <b>Éclats</b>. Aucun paiement ni retrait en euros dans le prototype ; les enchères arriveront dans une phase ultérieure.</span></div>' +
        '</div></section>' +
        '<section class="section-tight"><div class="container inv-layout mk-layout">' +
          '<div class="inv-main">' +
          U.secHead('Annonces', 'Toutes les annonces') +
          '<div class="toolbar sticky-bar inv-tools mk-tools">' +
            '<div class="chips scroll-x" data-f="rarity">' + [['all', 'Toutes']].concat(A.RARITIES.map(function (r) { return [r.id, r.label]; })).map(function (v) {
              return '<button class="chip' + (v[0] !== 'all' ? ' chip-r r-' + v[0] : '') + (mk.rarity === v[0] ? ' is-active' : '') + '" data-v="' + v[0] + '">' + (v[0] !== 'all' ? '<i></i>' : '') + v[1] + '</button>';
            }).join('') + '</div>' +
            '<div class="tb-filters">' +
              '<label class="search mk-find">' + I('search') + '<input type="search" enterkeyhint="search" autocomplete="off" placeholder="Carte, numéro…" aria-label="Rechercher une carte, un personnage, un numéro" value="' + U.esc(mk.q) + '" data-q>' +
                '<button type="button" class="cf-clear" data-q-clear aria-label="Effacer"' + (mk.q ? '' : ' hidden') + '>' + I('close') + '</button></label>' +
              mkSelect('coll', 'Collection', [['all', 'Toutes les collections']].concat(A.COLLECTIONS.map(function (c) { return [c.id, c.name]; }))) +
              mkSelect('price', 'Prix', Object.keys(MK_PRICES).map(function (k) { return [k, MK_PRICES[k][0]]; })) +
              mkSelect('only', 'Afficher', [['all', 'Toutes les annonces'], ['mine', 'Mes annonces'], ['num', 'Numérotées']]) +
              mkSelect('sort', 'Trier par', Object.keys(MK_SORTS).map(function (k) { return [k, MK_SORTS[k]]; })) +
            '</div>' +
          '</div>' +
          '<div data-results></div>' +
          '</div>' +
          '<aside class="inv-side" data-mk-side>' + mkSide() + '</aside>' +
        '</div></section>' +
        // Historique détaillé : vendeur, acheteur, date (la colonne n’en montre qu’un aperçu)
        '<section class="section" id="mk-historique"><div class="container">' + sectionHead('Historique', 'Ventes récentes') +
          '<div class="table-wrap"><table class="table"><thead><tr><th>Carte</th><th>Édition</th><th class="hide-s">Vendeur</th><th class="hide-s">Acheteur</th><th>Prix</th><th class="hide-s">Date</th></tr></thead><tbody>' +
          sales.slice(0, 20).map(function (s) {
            var e = A.ED[s.ed], ch = A.CHAR[e.charId];
            return '<tr><td><b>' + ch.name + '</b></td><td><span class="rar-chip r-' + e.rarity + '"><i></i>' + A.R[e.rarity].label + '</span> <span class="muted mono">' + U.serial(s.serial, e.supply) + '</span></td>' +
              '<td class="hide-s">' + U.esc(s.from) + '</td><td class="hide-s">' + U.esc(s.to) + '</td><td>' + U.price(s.price) + '</td><td class="hide-s muted">' + U.ago(s.at) + '</td></tr>';
          }).join('') + '</tbody></table></div></div></section>';
    },
    mount: function (root) {
      var res = root.querySelector('[data-results]'), STEP = 12, shown = STEP, list = [], more = null;
      function tile(l) {
        return '<div class="listing">' + U.card(l.ed, { serial: l.serial, badge: l.mine ? 'Votre annonce' : '' }) +
          '<div class="listing-foot"><div class="listing-price">' + U.price(l.price) + '<span class="muted small">par ' + U.esc(l.seller) + '</span><span class="muted small">' + U.ago(l.at) + '</span></div>' +
          (l.mine ? '<div class="row gap-s"><button class="btn btn-ghost btn-sm grow" data-unlist="' + l.id + '">Retirer</button></div>' :
            '<div class="row gap-s"><button class="btn btn-primary btn-sm grow" data-mk-buy="' + l.id + '">Acheter</button><button class="btn btn-ghost btn-sm" data-offer="' + l.id + '">Offre</button></div>') +
          '</div></div>';
      }
      // Les annonces s’affichent par tranches de 12 au défilement (une grille entière est trop lourde sur iPhone)
      function grow() {
        var grid = res.querySelector('.card-grid'), sent = res.querySelector('[data-more]');
        if (!grid || !sent) return;
        var from = grid.children.length;
        if (from >= list.length) { sent.remove(); return; }
        grid.insertAdjacentHTML('beforeend', list.slice(from, Math.max(from + STEP, shown)).map(tile).join(''));
        shown = grid.children.length;
        if (shown >= list.length) sent.remove();
      }
      function draw(keep) {
        if (!keep) shown = STEP;
        var q = mk.q.trim().toLowerCase();
        var L = S.listings().filter(function (l) {
          var e = A.ED[l.ed], ch = A.CHAR[e.charId], co = A.COLL[ch.coll];
          var pr = MK_PRICES[mk.price] || MK_PRICES.all;
          if (mk.only === 'mine' && !l.mine) return false;
          if (mk.only === 'num' && l.serial == null) return false;
          if (mk.coll !== 'all' && ch.coll !== mk.coll) return false;
          if (mk.rarity !== 'all' && e.rarity !== mk.rarity) return false;
          if (pr.length > 1 && (l.price < pr[1] || l.price > pr[2])) return false;
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
        list = L;
        var side = root.querySelector('[data-mk-side]');
        if (side) side.innerHTML = mkSide();
        res.innerHTML = '<p class="result-count">' + L.length + ' annonce' + (L.length > 1 ? 's' : '') + '</p>' +
          (L.length ? '<div class="card-grid is-market">' + L.slice(0, shown).map(tile).join('') + '</div>' +
            (L.length > shown ? '<div class="inv-more" data-more></div>' : '') : '<div class="empty">Aucune annonce ne correspond à ces filtres. <button class="link-btn" data-clear>Réinitialiser les filtres</button></div>');
        root.querySelector('[data-q-clear]').hidden = !mk.q;
        var sent = res.querySelector('[data-more]');
        if (more) more.disconnect();
        if (sent && 'IntersectionObserver' in window) {
          more = new IntersectionObserver(function (en) { if (en[0].isIntersecting) grow(); }, { rootMargin: '600px 0px' });
          more.observe(sent);
        } else if (sent) { shown = L.length; grow(); }
      }
      draw();
      function toTools() {
        var bar = root.querySelector('.mk-tools'), y = window.scrollY + bar.getBoundingClientRect().top - 70;
        if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
      }
      function labelOf(l) { var e = A.ED[l.ed]; return A.CHAR[e.charId].name + ' · ' + A.R[e.rarity].label + (e.supply ? ' ' + U.serial(l.serial, e.supply) : ''); }
      root.addEventListener('click', function (e) {
        var t;
        if ((t = e.target.closest('[data-mk-buy]'))) {
          var l = S.listings().find(function (x) { return x.id === t.getAttribute('data-mk-buy'); });
          if (!l) return;
          U.confirm({
            eyebrow: 'Achat simulé', title: labelOf(l), ok: 'Acheter pour ' + U.num(l.price) + ' D',
            body: '<div class="mini-row"><div class="mini">' + U.card(l.ed, { serial: l.serial, open: false, tilt: false }) + '</div></div>' +
              '<dl class="facts"><div><dt>Vendeur</dt><dd>' + U.esc(l.seller) + '</dd></div><div><dt>Prix</dt><dd>' + U.price(l.price) + '</dd></div><div><dt>Solde après achat</dt><dd>' + U.price(S.balance() - l.price) + '</dd></div></dl>',
            onOk: function () {
              var r = S.buy(l.id);
              if (r.ok) { U.toast('Carte ajoutée à votre inventaire'); draw(true); A.app.refreshChrome(); } else U.toast(r.error, 'error');
            }
          });
          return;
        }
        if ((t = e.target.closest('[data-offer]'))) {
          var lo = S.listings().find(function (x) { return x.id === t.getAttribute('data-offer'); });
          // Offre : pastilles « −5 % … −25 % » sous le prix demandé, et boutons − / + (pas arrondi selon le prix)
          var stp = lo.price >= 5000 ? 100 : lo.price >= 1000 ? 10 : lo.price >= 100 ? 5 : 1;
          var at = function (pc) { return Math.max(stp, Math.round(lo.price * (1 - pc / 100) / stp) * stp); };
          var PCS = [5, 10, 15, 20, 25];
          U.modal('<div class="dialog"><p class="eyebrow">Offre d’achat</p><h2 class="h3">' + labelOf(lo) + '</h2>' +
            '<p class="muted">Prix demandé : ' + U.num(lo.price) + ' Éclats. Le vendeur sera notifié et pourra accepter ou refuser.</p>' +
            '<div class="field"><span>Votre offre</span>' +
              '<div class="input-unit offer-amt"><button type="button" class="offer-step" data-step="-1" aria-label="Baisser de ' + stp + '">' + I('minus') + '</button>' +
                '<input type="number" inputmode="numeric" min="1" step="' + stp + '" value="' + at(15) + '" data-amount aria-label="Votre offre"><span>Éclats</span>' +
                '<button type="button" class="offer-step" data-step="1" aria-label="Monter de ' + stp + '">' + I('plus') + '</button></div>' +
              '<div class="offer-pcs" role="group" aria-label="Réduction sur le prix demandé">' + PCS.map(function (pc) {
                return '<button type="button" class="chip' + (pc === 15 ? ' is-active' : '') + '" data-pc="' + pc + '">−' + pc + '&nbsp;%</button>';
              }).join('') + '</div>' +
              '<p class="offer-hint" data-hint></p></div>' +
            '<div class="dialog-actions"><button class="btn btn-ghost" data-close>Annuler</button><button class="btn btn-primary" data-send>Envoyer l’offre</button></div></div>',
            { cls: 'is-small', mount: function (el, close) {
              var inp = el.querySelector('[data-amount]'), hint = el.querySelector('[data-hint]');
              function sync() {
                var v = parseInt(inp.value, 10) || 0, d = Math.round((1 - v / lo.price) * 100);
                el.querySelectorAll('[data-pc]').forEach(function (b) { b.classList.toggle('is-active', at(+b.getAttribute('data-pc')) === v); });
                hint.textContent = !v ? '' : v >= lo.price ? 'Au prix demandé ou plus : achetez directement.' : 'Soit −' + d + ' % du prix demandé (' + U.num(lo.price - v) + ' Éclats d’écart).';
              }
              el.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-pc],[data-step]');
                if (!b) return;
                if (b.hasAttribute('data-pc')) inp.value = at(+b.getAttribute('data-pc'));
                else inp.value = Math.max(stp, Math.round(((parseInt(inp.value, 10) || 0) + stp * +b.getAttribute('data-step')) / stp) * stp);
                sync();
              });
              inp.addEventListener('input', sync);
              sync();
              el.querySelector('[data-send]').addEventListener('click', function () {
                var r = S.offer(lo.id, parseInt(inp.value, 10));
                if (r.ok) { close(); U.toast('Offre envoyée (simulation)'); } else U.toast(r.error, 'error');
              });
            } });
          return;
        }
        if ((t = e.target.closest('[data-unlist]'))) { S.unlist(t.getAttribute('data-unlist')); U.toast('Annonce retirée, la carte revient dans votre inventaire'); draw(true); return; }
        if ((t = e.target.closest('[data-f="rarity"] .chip'))) {
          mk.rarity = t.getAttribute('data-v');
          root.querySelectorAll('[data-f="rarity"] .chip').forEach(function (x) { x.classList.toggle('is-active', x === t); });
          draw(); return;
        }
        if (e.target.closest('[data-mk-mine]')) { mk.only = 'mine'; root.querySelector('[data-mk="only"]').value = 'mine'; draw(); toTools(); return; }
        if (e.target.closest('[data-mk-hist]')) { e.preventDefault(); var h = root.querySelector('#mk-historique'); if (h) window.scrollTo({ top: window.scrollY + h.getBoundingClientRect().top - 80, behavior: 'smooth' }); return; }
        if (e.target.closest('[data-q-clear]')) { var qi = root.querySelector('[data-q]'); mk.q = ''; qi.value = ''; qi.focus(); draw(); return; }
        if (e.target.closest('[data-clear]')) { mk = Object.assign({}, MK0); location.hash = '#/marketplace'; A.app.rerender(); }
      });
      root.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.matches('[data-mk]')) return;
        mk[t.getAttribute('data-mk')] = t.value;
        draw();
      });
      root.addEventListener('input', function (e) {
        var t = e.target;
        if (t.matches('[data-q]')) { mk.q = t.value; draw(); }
      });
      this.refresh = function () { draw(true); };
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
      // Collections triées : obtenues / commencées d’abord (score décroissant), puis l’ordre du catalogue
      function byOwned(score) {
        return A.COLLECTIONS.map(function (c, i) { return { c: c, s: +score(c), i: i }; })
          .sort(function (x, y) { return y.s - x.s || x.i - y.i; }).map(function (x) { return x.c; });
      }
      // Les n premiers visibles, le reste replié derrière « Voir les N … » (la page faisait 12 000 px sur iPhone)
      function fold(list, n, label, fn) {
        var head = list.slice(0, n).map(fn).join(''), rest = list.slice(n);
        return head + (rest.length ? '<details class="pf-fold"><summary>Voir les ' + list.length + ' ' + label + '</summary><div class="pf-fold-in">' + rest.map(fn).join('') + '</div></details>' : '');
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
            fold(byOwned(function (c) { return S.avatars().indexOf(c.id) !== -1; }), 7, 'portraits', function (c) {
              var own = S.avatars().indexOf(c.id) !== -1;
              return '<button type="button" class="pf-av' + (own ? '' : ' is-locked') + (S.avatar() === c.id ? ' is-on' : '') + '"' + (own ? ' data-avatar-pick="' + c.id + '"' : ' disabled title="Complétez ' + U.esc(c.name) + ' pour le débloquer"') + '>' +
                '<span class="avatar is-lg has-pic' + (S.hasFrame() && own ? ' has-frame' : '') + '">' + U.avatarArt(c.id) + (own ? '' : '<i class="pf-av-lock">' + U.icon('lock') + '</i>') + '</span><small>' + U.esc(c.name) + '</small></button>';
            }) + '</div>') +
          sec('Collection', 'Personnages secrets', 'Un par collection, jamais en booster : chaque personnage obtenu révèle un fragment de son portrait.',
            '<p class="pf-count"><b>' + A.COLLECTIONS.filter(function (c) { return S.trophy(c.id); }).length + '</b> obtenus sur ' + A.COLLECTIONS.length + '</p>' +
            '<div class="pf-trophies">' + fold(byOwned(function (c) { return S.trophy(c.id) ? 2 : A.COLL[c.id].chars.some(function (id) { return S.ownsChar(id); }) ? 1 : 0; }), 4, 'personnages secrets', function (c) { return '<div class="pf-trophy">' + U.secretCard(c.id) + '</div>'; }) + '</div>') +
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

  /* ======================================================================
     RARETÉS — planche de travail pour finaliser le cadre des cartes
     (accessible seulement depuis le pied de page)
     ====================================================================== */
  var RZ = { ch: 'grece-zeus', bg: 'page', back: null };   // back : thème du dos affiché en grand (null = celui du Booster Atlas)
  var RZ_BG = [['page', 'Page'], ['clair', 'Clair'], ['sombre', 'Sombre']];
  // Jetons du cadre lus sur la carte réelle (atlas.css) : ce qui s’affiche est ce que l’on règle.
  var RZ_TOKENS = [['--card-bg', 'Fond'], ['--card-line', 'Filet'], ['--rc', 'Pastille'], ['--f1', 'Métal'], ['--f2', 'Ombre'], ['--f3', 'Reflet']];
  function rzChars() { return A.CHARS.filter(function (c) { return c.editions.length === A.RARITIES.length; }); }
  function rzSerial(r) { return r.supply ? Math.max(1, Math.round(r.supply * 0.07)) : null; }
  // Bloc de travail : en-tête, carte en grand, deux zooms ×3, variantes, jetons du cadre
  function rzBlock(o) {
    var zoom = function (cls, label) {
      return '<figure class="rz-zoom ' + cls + '"><div class="rz-zoom-box"><div class="rz-zoom-in" aria-hidden="true">' + o.still + '</div></div><figcaption>' + label + '</figcaption></figure>';
    };
    return '<article class="rz-block ' + o.cls + '" id="rz-' + o.id + '">' +
      '<header class="rz-head"><span class="rz-dot"></span><div><p class="eyebrow">' + o.kicker + '</p>' +
        '<h2 class="h2">' + o.label + '</h2><p class="muted">' + o.desc + '</p></div></header>' +
      '<div class="rz-stage"><div class="rz-big">' + o.big + '</div></div>' +
      '<div class="rz-zooms">' + zoom('is-tl', 'Coin supérieur · ×3') + zoom('is-br', o.zoomBr || 'Pied de carte · ×3') + '</div>' +
      '<div class="rz-states' + (o.states.length > 3 ? ' is-many' : '') + '">' + o.states.map(function (x) {
        if (x[2] == null) return '<figure class="rz-mini">' + x[0] + '<figcaption>' + x[1] + '</figcaption></figure>';
        return '<figure class="rz-mini is-pick' + (x[3] ? ' is-on' : '') + '" data-rz-pick="' + x[2] + '" role="button" tabindex="0" aria-pressed="' + !!x[3] + '">' + x[0] + '<figcaption>' + x[1] + '</figcaption></figure>';
      }).join('') + '</div>' +
      (o.tokens ? '<dl class="rz-tokens" data-rz-tokens></dl>' : '') +
    '</article>';
  }
  function rzBack(theme) { var pk = A.PACKS.filter(function (x) { return x.theme === theme; })[0]; return '<div class="rz-back">' + U.cardBack(theme, pk && pk.name) + '</div>'; }
  function rzBoard() {
    var ch = A.CHAR[RZ.ch];
    // Personnage secret : celui de la collection du personnage choisi (sinon le premier qui existe)
    var cid = A.SECRET[ch.coll] ? ch.coll : Object.keys(A.SECRET).filter(function (k) { return A.COLL[k]; })[0], sc = A.SECRET[cid];
    var side = A.RARITIES.map(function (r) {
      return '<figure class="rz-mini">' + U.card(ch.id + '-' + r.id, { serial: rzSerial(r), open: false, tilt: false }) + '<figcaption>' + r.label + '</figcaption></figure>';
    }).join('') + (sc ? '<figure class="rz-mini">' + U.secretCard(cid, { reveal: true }) + '<figcaption>Secrète</figcaption></figure>' : '');
    var blocks = A.RARITIES.map(function (r) {
      var ed = ch.id + '-' + r.id, still = U.card(ed, { serial: rzSerial(r), open: false, tilt: false });
      return rzBlock({ id: r.id, cls: 'r-' + r.id, label: r.label, tokens: true, still: still,
        kicker: 'Rang ' + (r.rank + 1) + ' sur ' + A.RARITIES.length + ' · ' + (r.supply ? r.supply + ' exemplaire' + (r.supply > 1 ? 's' : '') : 'tirage illimité'),
        desc: U.esc(r.identity) + ' — ' + U.esc(r.desc),
        big: U.card(ed, { serial: rzSerial(r) }),
        states: [[still, 'Possédée'], [U.card(ed, { serial: rzSerial(r), open: false, tilt: false, missing: true }), 'Non possédée'], [U.card(ed, { unknown: true }), 'Non découverte']] });
    }).join('');
    var secret = sc ? rzBlock({ id: 'secret', cls: 'r-secret', label: 'Secrète',
      kicker: 'Hors tirage · une par collection · platine', still: U.secretCard(cid, { reveal: true }),
      desc: 'Hors booster, offerte quand la collection est complète. Ici : ' + U.esc(sc.name) + '.',
      big: U.secretCard(cid, { reveal: true }),
      states: [[U.secretCard(cid, { reveal: true }), 'Révélée'], [U.secretCard(cid, { locked: true }), 'En fragments']] }) : '';
    // Dos : celui de chaque sachet (l’ouverture montre le dos du sachet ouvert)
    var cur = RZ.back != null ? RZ.back : (A.PACK.standard ? A.PACK.standard.theme : '');
    var backs = [['', 'Ivoire']].concat(A.PACKS.map(function (pk) { return [pk.theme, pk.name]; }));
    var dos = rzBlock({ id: 'dos', cls: 'r-dos', label: 'Dos de carte',
      kicker: 'Verso · ' + backs.length + ' déclinaisons', still: rzBack(cur), zoomBr: 'Coin inférieur · ×3',
      desc: 'Le verso vu à l’ouverture, aux couleurs et au nom du sachet. Touchez un dos pour l’afficher en grand.',
      big: rzBack(cur),
      states: backs.map(function (b) { return [rzBack(b[0]), U.esc(b[1]), b[0], b[0] === cur]; }) });
    var mesures = '<article class="rz-block rz-measure" id="rz-mesures"><header class="rz-head"><span class="rz-dot"></span><div><p class="eyebrow">Contrôle · mesuré en direct</p>' +
      '<h2 class="h2">Mesures</h2><p class="muted">Chaque type de carte mesuré à sa taille réelle, ramené à 300 px de large.</p></div></header><div data-rz-measure></div></article>';
    return '<div class="rz-block rz-all"><header class="rz-head"><div><p class="eyebrow">Vue d’ensemble</p><h2 class="h2">Côte à côte</h2>' +
        '<p class="muted">Les six raretés du même personnage et la carte secrète, à la taille d’une grille de collection.</p></div></header>' +
        '<div class="rz-stage"><div class="rz-row">' + side + '</div></div></div>' + blocks + secret + dos + mesures;
  }
  /* ---------- Mesures : contrôle de toutes les dimensions, en direct ----------
     Chaque carte de la page est mesurée dans le navigateur, puis ramenée à une carte de 300 px de large
     (les cartes se dessinent en cqw : les proportions sont les mêmes à toutes les tailles). */
  var RZ_REF = 300;
  function rzMeasureTargets() {
    return A.RARITIES.map(function (r) { return [r.label, '#rz-' + r.id + ' .rz-big .card']; }).concat([
      ['Secrète', '#rz-secret .rz-big .card'],
      ['Secrète en fragments', '#rz-secret .rz-states .rz-mini:nth-child(2) .card'],
      ['Non possédée', '#rz-base .rz-states .rz-mini:nth-child(2) .card'],
      ['Non découverte', '#rz-base .rz-states .rz-mini:nth-child(3) .card'],
      ['Dos', '#rz-dos .rz-big .rz-back']
    ]);
  }
  // [groupe, libellé, fonction (m) → nombre | texte | null, décimales, réglage libre (non comparé)]
  var RZ_ROWS = [
    ['Carte', 'Largeur affichée (px réels)', function (m) { return m.w; }, 0, true],
    ['Carte', 'Proportions (hauteur ÷ largeur)', function (m) { return m.h / m.w; }, 3],
    ['Carte', 'Arrondi des coins', function (m) { return m.px(m.cs(m.shell).borderTopLeftRadius); }],
    ['Carte', 'Trait du bord (1 px à toutes les tailles)', function (m) { return parseFloat(m.cs(m.shell).borderTopWidth); }, 2, true],
    ['Carte', 'Marge intérieure (trait compris)', function (m) { var c = m.cs(m.shell); return m.px(c.borderTopWidth) + m.px(c.paddingTop); }],
    ['Cadre', 'Cadre métal · épaisseur', function (m) {
      var h = m.q('.card-holo'); if (!h) return null; var c = m.cs(h);
      return c.backgroundImage === 'none' || +c.opacity === 0 ? 'aucun' : m.px(c.paddingTop); }],
    ['Cadre', 'Cadre métal · opacité', function (m) { var h = m.q('.card-holo'); return h ? +m.cs(h).opacity : null; }, 2, true],
    ['Cadre', 'Filet intérieur · retrait du bord', function (m) {
      if (!m.inner) return null; var a = getComputedStyle(m.inner, '::after');
      return a.content === 'none' ? 'aucun' : m.px(m.cs(m.inner).borderTopWidth) + m.px(a.top); }],
    ['Cadre', 'Filet intérieur · arrondi', function (m) {
      if (!m.inner) return null; var a = getComputedStyle(m.inner, '::after');
      return a.content === 'none' ? 'aucun' : m.px(a.borderTopLeftRadius); }],
    ['Illustration', 'Retrait gauche', function (m) { return m.box('.card-art', 'l'); }],
    ['Illustration', 'Retrait haut', function (m) { return m.box('.card-art', 't'); }],
    ['Illustration', 'Retrait droit', function (m) { return m.box('.card-art', 'r'); }],
    ['Illustration', 'Largeur', function (m) { return m.box('.card-art', 'w'); }],
    ['Illustration', 'Hauteur', function (m) { return m.box('.card-art', 'h'); }],
    ['Illustration', 'Arrondi', function (m) { var a = m.q('.card-art'); return a ? m.px(m.cs(a).borderTopLeftRadius) : null; }],
    ['Textes', 'Nom · taille', function (m) { return m.font('.card-name'); }],
    ['Textes', 'Titre · taille', function (m) { return m.font('.card-title'); }],
    ['Textes', 'Collection · taille', function (m) { return m.font('.card-coll'); }],
    ['Textes', 'Numéro · taille', function (m) { return m.font('.card-serial'); }],
    ['Textes', 'Statistiques · taille des valeurs', function (m) { return m.font('.card-stats b'); }],
    ['Textes', 'Rareté · taille', function (m) { return m.font('.card-rar'); }],
    ['Textes', 'Nom · retrait gauche', function (m) { return m.box('.card-name', 'l'); }],
    ['Textes', 'Rareté · retrait droit', function (m) { return m.box('.card-rar', 'r'); }],
    ['Écarts verticaux', 'Illustration → nom', function (m) { return m.gap('.card-art', '.card-name'); }],
    ['Écarts verticaux', 'Nom → titre', function (m) { return m.gap('.card-name', '.card-title'); }],
    ['Écarts verticaux', 'Titre → filet du pied', function (m) { return m.gap('.card-title', '.card-foot'); }],
    ['Écarts verticaux', 'Filet du pied → statistiques', function (m) { var f = m.q('.card-foot'), s = m.q('.card-stats'); return f && s ? (m.rel(s).top - m.rel(f).top) * m.k : null; }],
    ['Écarts verticaux', 'Statistiques → bas de la carte', function (m) { var s = m.q('.card-stats'); return s ? (m.h - m.rel(s).bottom) * m.k : null; }],
    ['Dos', 'Cadre intérieur · retrait', function (m) { return m.box('.cb-frame', 'l'); }],
    ['Dos', 'Emblème · largeur', function (m) { return m.box('.cb-mark', 'w'); }],
    ['Dos', 'ATLAS · taille', function (m) { return m.font('.cb-name'); }],
    ['Dos', 'Collection · retrait bas', function (m) { var c = m.q('.cb-coll'); return c ? (m.h - m.rel(c).bottom) * m.k : null; }]
  ];
  function rzMeasureOne(el) {
    var r = el.getBoundingClientRect(), shell = el.querySelector('.card-inner') || el.querySelector('.card-back');
    var m = {
      w: r.width, h: r.height, k: RZ_REF / r.width, shell: shell, inner: el.querySelector('.card-inner'),
      q: function (s) { return el.querySelector(s); },
      cs: function (n) { return getComputedStyle(n); },
      px: function (v) { return (parseFloat(v) || 0) * m.k; },
      rel: function (n) { var b = n.getBoundingClientRect(); return { left: b.left - r.left, top: b.top - r.top, right: r.right - b.right, bottom: b.bottom - r.top, width: b.width, height: b.height }; },
      box: function (s, side) {
        var n = el.querySelector(s); if (!n) return null; var b = m.rel(n);
        return { l: b.left, t: b.top, r: b.right, w: b.width, h: b.height }[side] * m.k; },
      font: function (s) { var n = el.querySelector(s); return n ? m.px(getComputedStyle(n).fontSize) : null; },
      // Écart entre le bas de a et le haut de b (texte : boîte de ligne) ; border = haut de la bordure de b
      gap: function (a, b) { var x = el.querySelector(a), y = el.querySelector(b); return x && y ? (m.rel(y).top - m.rel(x).bottom) * m.k : null; }
    };
    return RZ_ROWS.map(function (row) { try { var v = row[2](m); return v == null || (typeof v === 'number' && isNaN(v)) ? null : v; } catch (e) { return null; } });
  }
  function rzFmt(v, d) { return v == null ? '—' : typeof v === 'number' ? v.toFixed(d == null ? 1 : d).replace('.', ',') : v; }
  function rzMeasure(root) {
    var host = root.querySelector('[data-rz-measure]'); if (!host) return;
    // Les cartes sont mesurées telles qu’affichées (grandes cartes et vignettes), puis ramenées à 300 px de large :
    // si une dimension ne suit pas la taille de la carte, elle ressort en écart.
    var cols = rzMeasureTargets().map(function (t) {
      var el = root.querySelector(t[1]); if (!el) return null;
      return { label: t[0], vals: rzMeasureOne(el), k: RZ_REF / el.getBoundingClientRect().width, back: t[0] === 'Dos' };
    }).filter(Boolean);
    var diffs = [], group = '';
    var body = RZ_ROWS.map(function (row, i) {
      var head = row[0] !== group ? '<tr class="rz-mg"><th colspan="' + (cols.length + 1) + '">' + row[0] + '</th></tr>' : '';
      group = row[0];
      // Référence : la valeur la plus fréquente de la ligne (hors dos, qui est un autre objet)
      var count = {}, ref = null, best = 0;
      cols.forEach(function (c) { var v = c.vals[i]; if (v == null || c.back) return; var key = rzFmt(v, row[3]); count[key] = (count[key] || 0) + 1; if (count[key] > best) { best = count[key]; ref = v; } });
      var cells = cols.map(function (c) {
        var v = c.vals[i], off = false;
        if (!row[4] && !c.back && v != null && ref != null) off = typeof v === 'number' && typeof ref === 'number' ? Math.abs(v - ref) > Math.max(.15, .15 * c.k) : v !== ref;   // moins de 0,15 px à l’écran : arrondi de rendu
        if (off) diffs.push(c.label + ' · ' + row[1]);
        return '<td class="' + (off ? 'is-off' : '') + (v == null ? ' is-na' : '') + '"' + (off ? ' title="Valeur habituelle : ' + rzFmt(ref, row[3]) + '"' : '') + '>' + rzFmt(v, row[3]) + '</td>';
      }).join('');
      return head + '<tr' + (row[4] ? ' class="is-free"' : '') + '><th scope="row">' + row[1] + (row[4] ? ' <small>réglage par rareté</small>' : '') + '</th>' + cells + '</tr>';
    }).join('');
    host.innerHTML =
      '<p class="rz-mstate ' + (diffs.length ? 'is-off' : 'is-ok') + '">' + (diffs.length
        ? diffs.length + ' écart' + (diffs.length > 1 ? 's' : '') + ' (surligné' + (diffs.length > 1 ? 's' : '') + ' ; la valeur habituelle s’affiche au survol)'
        : 'Aucun écart : tous les types de carte ont exactement les mêmes dimensions, à toutes les tailles.') + ' <small>Les arrondis de rendu de moins de 0,15 px à l’écran sont ignorés.</small></p>' +
      '<div class="rz-mwrap"><table class="rz-mtable"><thead><tr><th scope="col">Mesure (carte de ' + RZ_REF + ' px)</th>' +
        cols.map(function (c) { return '<th scope="col">' + c.label + '</th>'; }).join('') + '</tr></thead><tbody>' + body + '</tbody></table></div>';
  }
  function rzMeasureSoon(root) {
    var go = function () { requestAnimationFrame(function () { rzMeasure(root); }); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  }
  function rzTokens(root) {
    root.querySelectorAll('.rz-block[id]').forEach(function (b) {
      var card = b.querySelector('.rz-big .card'), dl = b.querySelector('[data-rz-tokens]');
      if (!card || !dl) return;
      var cs = getComputedStyle(card);
      dl.innerHTML = RZ_TOKENS.map(function (t) {
        var v = cs.getPropertyValue(t[0]).trim();
        if (!v) return '';
        return '<div><dt><i style="background:' + U.esc(v) + '"></i>' + t[1] + '</dt><dd><code>' + t[0] + '</code> ' + U.esc(v) + '</dd></div>';
      }).join('');
    });
  }

  P.rarities = {
    title: 'Raretés des cartes',
    render: function (ctx) {
      var q = ctx.query.perso;
      if (q && A.CHAR[q] && A.CHAR[q].editions.length === A.RARITIES.length) RZ.ch = q;
      return '<section class="page-head"><div class="container"><p class="eyebrow">Atelier de design</p><h1 class="h1">Les raretés</h1>' +
        '<p class="lead">Chaque cadre de carte, en grand et de près, pour finaliser le design des six raretés, de la carte secrète et du dos.</p></div></section>' +
        '<section class="section-tight"><div class="container">' +
        '<div class="sticky-bar rz-bar">' +
          '<label class="select is-compact" title="Personnage"><select data-rz-ch aria-label="Personnage">' + A.COLLECTIONS.map(function (co) {
            var list = rzChars().filter(function (c) { return c.coll === co.id; });
            return list.length ? '<optgroup label="' + U.esc(co.name) + '">' + list.map(function (c) {
              return '<option value="' + c.id + '"' + (c.id === RZ.ch ? ' selected' : '') + '>' + U.esc(c.name) + '</option>';
            }).join('') + '</optgroup>' : '';
          }).join('') + '</select></label>' +
          '<div class="rz-seg" role="group" aria-label="Fond">' + RZ_BG.map(function (b) {
            return '<button class="chip' + (RZ.bg === b[0] ? ' is-active' : '') + '" data-rz-bg="' + b[0] + '">' + b[1] + '</button>';
          }).join('') + '</div>' +
          '<nav class="rz-jump" aria-label="Aller à une rareté">' + A.RARITIES.concat([{ id: 'secret', label: 'Secrète' }, { id: 'dos', label: 'Dos' }, { id: 'mesures', label: 'Mesures' }]).map(function (r) {
            return '<a class="chip chip-r r-' + r.id + '" href="#/raretes" data-rz-go="' + r.id + '"><i></i>' + r.label + '</a>';
          }).join('') + '</nav>' +
        '</div>' +
        '<div class="rz bg-' + RZ.bg + '" data-rz>' + rzBoard() + '</div></div></section>';
    },
    mount: function (root) {
      var board = root.querySelector('[data-rz]'), bar = root.querySelector('.rz-bar');
      rzTokens(root);
      rzMeasureSoon(root);
      // Redessine la planche sans bouger la page
      function redraw() {
        var y = window.scrollY;
        board.innerHTML = rzBoard();
        rzTokens(root);
        rzMeasureSoon(root);
        window.scrollTo({ top: y, behavior: 'instant' });
      }
      // Bloc sous la barre collante : c’est celui que l’on regarde
      function current() {
        var y = bar.getBoundingClientRect().bottom + 1, list = root.querySelectorAll('.rz-block[id]');
        for (var i = 0; i < list.length; i++) { var r = list[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) return list[i]; }
        return null;
      }
      function markJump() {
        if (!root.isConnected) { window.removeEventListener('scroll', markJump); return; }
        var c = current(), id = c ? c.id.slice(3) : '';
        root.querySelectorAll('[data-rz-go]').forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-rz-go') === id); });
      }
      window.addEventListener('scroll', markJump, { passive: true });
      root.addEventListener('change', function (e) {
        if (!e.target.matches('[data-rz-ch]')) return;
        RZ.ch = e.target.value;   // même endroit de la page avec le nouveau personnage
        redraw();
      });
      root.addEventListener('keydown', function (e) {
        var k = e.target.closest && e.target.closest('[data-rz-pick]');
        if (k && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); k.click(); }
      });
      root.addEventListener('click', function (e) {
        var pk = e.target.closest('[data-rz-pick]');
        if (pk) { RZ.back = pk.getAttribute('data-rz-pick'); redraw(); return; }
        var b = e.target.closest('[data-rz-bg]');
        if (b) {
          RZ.bg = b.getAttribute('data-rz-bg');
          board.className = 'rz bg-' + RZ.bg;
          root.querySelectorAll('[data-rz-bg]').forEach(function (x) { x.classList.toggle('is-active', x === b); });
          return;
        }
        var g = e.target.closest('[data-rz-go]');
        if (g) {
          e.preventDefault();
          var t = root.querySelector('#rz-' + g.getAttribute('data-rz-go')), c = current();
          if (!t) return;
          // Déjà dans un bloc : on passe au même endroit de l’autre bloc (les blocs ont la même mise en page),
          // sinon on arrive en haut du bloc, sous la barre.
          if (c) window.scrollTo({ top: window.scrollY + t.getBoundingClientRect().top - c.getBoundingClientRect().top, behavior: 'instant' });
          else window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(bar).top) + bar.offsetHeight) - 16, behavior: 'smooth' });
          markJump();
        }
      });
    }
  };
})(window.ATLAS);
