/* ==========================================================================
   ATLAS — Routeur et structure de l’application
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui, P = A.pages;
  var app = A.app = {};

  var ROUTES = [
    [/^\/$/, P.home, 'home'],
    [/^\/collections$/, P.collections, 'collections'],
    [/^\/collection\/([\w-]+)$/, P.collection, 'collections'],
    [/^\/saga\/([\w-]+)$/, P.saga, 'collections'],
    [/^\/boutique$/, P.shop, 'shop'],
    [/^\/inventaire$/, P.inventory, 'inventory'],
    [/^\/marketplace$/, P.market, 'market'],
    [/^\/profil$/, P.profile, 'profile'],
    [/^\/design-system$/, P.design, ''],
    [/^\/atelier$/, P.atelier, ''],
    [/^\/infos$/, P.infos, ''],
    [/^\/jauges$/, P.jauges, '']   // temporaire : choix de la jauge des collections
  ];
  var NAV = [
    ['home', '#/', 'Accueil', 'home'],
    ['collections', '#/collections', 'Collections', 'grid'],
    ['shop', '#/boutique', 'Boosters', 'pack'],
    ['inventory', '#/inventaire', 'Inventaire', 'cards'],
    ['market', '#/marketplace', 'Marketplace', 'market']
  ];

  function parse() {
    var h = location.hash.replace(/^#/, '') || '/';
    var parts = h.split('?');
    var query = {};
    (parts[1] || '').split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return { path: parts[0] || '/', query: query };
  }

  function chrome() {
    var header = document.getElementById('site-header');
    header.innerHTML = '<div class="container nav-inner">' +
      '<a class="logo" href="#/">' + U.mark() + '<span>ATLAS</span></a>' +
      '<nav class="nav-links">' + NAV.slice(1).map(function (n) { return '<a href="' + n[1] + '" data-nav="' + n[0] + '">' + n[2] + '</a>'; }).join('') + '</nav>' +
      '<div class="nav-right">' +
        // Booster du jour : libellé explicite, point doré quand il est disponible.
        '<a class="daily-btn" href="#/boutique?open=daily" data-daily>' + U.icon('pack') + '<span>Booster du jour</span><i></i></a>' +
        // Solde + achat dans un seul bloc lisible : « ◎ ∞ | + Acheter » (même ordre que les prix)
        '<div class="wallet-group"><a class="wallet" href="#/profil" title="Votre solde en Éclats" aria-label="Votre solde en Éclats">' + U.icon('coin', 'coin') + '<b data-wallet></b></a>' +
        '<button class="buy-coins" data-buy title="Acheter des Éclats"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg><span>Acheter</span></button></div>' +
        '<div class="profile-wrap"><button class="avatar" data-profile-menu aria-haspopup="menu" aria-expanded="false" title="Mon profil" data-avatar></button>' +
          '<div class="profile-menu" role="menu" hidden data-profile-panel></div></div>' +
      '</div></div>';
    document.getElementById('tabbar').innerHTML = NAV.map(function (n) {
      return '<a href="' + n[1] + '" data-nav="' + n[0] + '">' + U.icon(n[3]) + '<span>' + n[2] + '</span></a>';
    }).join('');
    document.getElementById('site-footer').innerHTML = '<div class="container footer-inner">' +
      '<div class="footer-brand"><a class="logo" href="#/">' + U.mark() + '<span>ATLAS</span></a>' +
        '<p>Musée numérique de cartes à collectionner. Les grandes figures de la culture, en œuvres numérotées.</p></div>' +
      '<div class="footer-cols">' +
        '<div><p class="eyebrow">Explorer</p><a href="#/collections">Collections</a><a href="#/boutique">Boutique</a><a href="#/marketplace">Marketplace</a></div>' +
        '<div><p class="eyebrow">Mon espace</p><a href="#/inventaire">Inventaire</a><a href="#/boutique?open=daily">Booster quotidien</a></div>' +
        '<div><p class="eyebrow">Projet</p><a href="#/design-system">Design system</a><button class="link-btn" data-reset>Réinitialiser la démo</button></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' ATLAS · Édition I</span><em>Le monde, en cartes.</em></div>' +
    '</div>';
    document.getElementById('site-footer').addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      U.confirm({ title: 'Réinitialiser la démo ?', body: '<p class="muted">L’inventaire, le solde et les annonces reviennent à leur état initial.</p>', ok: 'Réinitialiser', onOk: function () { S.reset(); U.toast('Démo réinitialisée'); app.rerender(); } });
    });
  }

  /* ---------- Acheter des Éclats (démo : crédit fictif, aucun paiement) ---------- */
  // Prix fictifs (démo) : `was` = prix barré de la fausse promotion.
  var OFFERS = [
    { n: 500, price: 4.99, was: 6.99 },
    { n: 1200, bonus: 100, price: 9.99, was: 12.99 },
    { n: 3000, bonus: 400, price: 19.99, was: 29.99, best: 'Populaire' },
    { n: 8000, bonus: 1500, price: 49.99, was: 79.99, best: 'Meilleure valeur' }
  ];
  // Fin de la fausse promo : toujours « dans 2 jours » à minuit, pour la démo.
  function promoEnd() { var d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime() + 2 * 86400000; }
  function eur(v) { return v.toFixed(2).replace('.', ',') + ' €'; }
  function countdown(ms) {
    var s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return (d ? d + ' j ' : '') + p(h) + ' h ' + p(m) + ' min ' + p(sec) + ' s';
  }
  app.buyCoins = function () {
    var maxPct = Math.max.apply(null, OFFERS.map(function (o) { return Math.round((1 - o.price / o.was) * 100); }));
    var end = promoEnd();
    U.modal('<div class="buy"><p class="eyebrow">Boutique d’Éclats</p><h2 class="h3">Acheter des Éclats</h2>' +
      '<p class="muted buy-sub">Pour ouvrir des boosters et acheter des cartes sur la Marketplace.</p>' +
      // Bandeau promo discret : une seule ligne, pas de bloc sombre.
      '<p class="buy-promo"><span class="buy-promo-tag">Offre de lancement</span><span>Jusqu’à <b>−' + maxPct + '&nbsp;%</b> sur tous les packs</span><span class="buy-promo-sep"></span>' +
        U.icon('clock') + '<span>Se termine dans <b data-timer>' + countdown(end - Date.now()) + '</b></span></p>' +
      '<div class="buy-grid">' + OFFERS.map(function (o, i) {
        var pct = Math.round((1 - o.price / o.was) * 100);
        // Structure identique pour toutes les offres : étiquettes, quantité, bonus, prix, bouton.
        return '<button class="buy-offer' + (o.best ? ' is-best' : '') + '" data-offer="' + i + '">' +
          '<span class="buy-tags">' + (o.best ? '<span class="buy-flag">' + o.best + '</span>' : '<span></span>') + '<span class="buy-off">−' + pct + ' %</span></span>' +
          '<span class="buy-n">' + U.num(o.n) + '</span><span class="buy-unit">Éclats</span>' +
          '<span class="buy-bonus' + (o.bonus ? '' : ' is-empty') + '">' + (o.bonus ? '+ ' + U.num(o.bonus) + ' offerts' : '&nbsp;') + '</span>' +
          '<span class="buy-prices"><s>' + eur(o.was) + '</s><b>' + eur(o.price) + '</b></span>' +
          '<span class="buy-cta">Choisir</span></button>';
      }).join('') + '</div>' +
      '<p class="buy-note">' + U.icon('shield') + 'Prototype : aucun paiement réel, promotions fictives. Les Éclats sont crédités gratuitement.</p></div>',
      { cls: 'is-buy', mount: function (el, close) {
        var timer = el.querySelector('[data-timer]');
        var tick = setInterval(function () {
          if (!timer.isConnected) { clearInterval(tick); return; }
          timer.textContent = countdown(end - Date.now());
        }, 1000);
        el.addEventListener('click', function (e) {
          var b = e.target.closest('[data-offer]'); if (!b) return;
          var o = OFFERS[+b.getAttribute('data-offer')];
          S.grant(o.n + (o.bonus || 0));
          if (A.sfx) { A.sfx.unlock(); A.sfx.numbered(2); }
          close();
          app.refreshChrome();
          U.toast(U.num(o.n + (o.bonus || 0)) + ' Éclats ajoutés (démo)');
          var w = document.querySelector('.wallet');
          if (w) { w.classList.remove('nav-bump'); void w.offsetWidth; w.classList.add('nav-bump'); }
        });
      } });
  };
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-buy]')) app.buyCoins(); });

  app.refreshChrome = function () {
    var w = document.querySelector('[data-wallet]');
    if (w) w.textContent = U.num(S.balance());
    var d = document.querySelector('[data-daily]');
    if (d) {
      var ready = S.dailyAvailable();
      d.classList.toggle('is-ready', ready);
      d.title = ready ? 'Votre booster gratuit du jour est disponible' : 'Prochain booster gratuit dans ' + U.duration(S.nextDailyIn());
      d.setAttribute('href', ready ? '#/boutique?open=daily' : '#/boutique');
    }
    var av = document.querySelector('[data-avatar]');
    if (av) { av.innerHTML = U.avatarInner(); av.className = 'avatar' + U.avatarCls(); }
  };

  /* ---------- Profil : menu de l’avatar, déconnexion simulée ---------- */
  app.initial = function () { var n = (S.get().user.name || 'V').trim(); return (n[0] || 'V').toUpperCase(); };
  var SESSION_KEY = 'atlas-session';
  app.isOut = function () { try { return localStorage.getItem(SESSION_KEY) === 'out'; } catch (e) { return false; } };
  app.logout = function () {
    closeProfileMenu();
    try { localStorage.setItem(SESSION_KEY, 'out'); } catch (e) { /* ignore */ }
    U.closeModal();
    render(false);
  };
  app.login = function () {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    render(false);
    U.toast('Bon retour, ' + U.esc(S.get().user.name));
  };
  function profileMenuHTML() {
    var u = S.get().user, items = S.items();
    var muted = A.sfx && A.sfx.muted;
    return '<div class="pm-head"><span class="avatar is-lg' + U.avatarCls() + '">' + U.avatarInner() + '</span><div><b>' + U.esc(u.name) + '</b><small>@' + U.esc(u.handle) + ' · Niveau ' + u.level + '</small></div></div>' +
      '<div class="pm-stats"><a href="#/inventaire"><b>' + U.num(items.length) + '</b><span>Cartes</span></a><a href="#/profil"><b>' + U.num(S.balance()) + '</b><span>Éclats</span></a></div>' +
      '<nav class="pm-links">' +
        '<a href="#/profil" role="menuitem">' + U.icon('user') + 'Mon profil</a>' +
        '<a href="#/inventaire" role="menuitem">' + U.icon('cards') + 'Mon inventaire</a>' +
        '<button data-buy role="menuitem">' + U.icon('coin') + 'Acheter des Éclats</button>' +
        '<button data-sound-toggle role="menuitem">' + U.icon('sound') + 'Sons<span class="pm-switch' + (muted ? '' : ' is-on') + '"></span></button>' +
      '</nav>' +
      '<button class="pm-logout" data-logout role="menuitem">' + U.icon('logout') + 'Se déconnecter</button>';
  }
  function closeProfileMenu() {
    var p = document.querySelector('[data-profile-panel]'), b = document.querySelector('[data-profile-menu]');
    if (p) p.hidden = true;
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var panel = document.querySelector('[data-profile-panel]');
    if (e.target.closest('[data-profile-menu]')) {
      var open = panel.hidden;
      if (open) panel.innerHTML = profileMenuHTML();
      panel.hidden = !open;
      e.target.closest('[data-profile-menu]').setAttribute('aria-expanded', String(open));
      return;
    }
    if (e.target.closest('[data-logout]')) { app.logout(); return; }
    if (e.target.closest('[data-login]')) { app.login(); return; }
    if (e.target.closest('[data-sound-toggle]')) {
      if (A.sfx) A.sfx.setMuted(!A.sfx.muted);
      var sw = e.target.closest('[data-sound-toggle]').querySelector('.pm-switch, .switch');
      if (sw) sw.classList.toggle('is-on', !(A.sfx && A.sfx.muted));
      return;
    }
    if (panel && !panel.hidden && !e.target.closest('[data-profile-panel]')) closeProfileMenu();
    else if (panel && !panel.hidden && e.target.closest('[data-profile-panel] a, [data-profile-panel] [data-buy]')) closeProfileMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeProfileMenu(); });

  function signedOutHTML() {
    return '<section class="signed-out"><div class="so-card">' + U.mark() +
      '<p class="eyebrow">Session terminée</p><h1 class="h2">À bientôt</h1>' +
      '<p class="muted">Vous êtes déconnecté de votre compte ATLAS. Votre collection, vos favoris et votre solde sont conservés.</p>' +
      '<button class="btn btn-primary" data-login>Se reconnecter</button>' +
      '<p class="so-note">' + U.icon('lock') + 'Prototype : connexion simulée, aucune donnée n’est envoyée.</p>' +
    '</div></section>';
  }

  var current = null;
  function render(keepScroll) {
    var out = app.isOut();
    document.body.classList.toggle('is-out', out);
    if (out) {
      var v = document.getElementById('view');
      v.innerHTML = '<div class="page is-entering">' + signedOutHTML() + '</div>';
      current = null;
      document.title = 'ATLAS — Déconnecté';
      window.scrollTo(0, 0);
      return;
    }
    var r = parse();
    var match = null, params = [];
    for (var i = 0; i < ROUTES.length; i++) {
      var m = r.path.match(ROUTES[i][0]);
      if (m) { match = ROUTES[i]; params = m.slice(1); break; }
    }
    if (!match) match = ROUTES[0];
    var page = match[1];
    var ctx = { params: params, query: r.query };
    var view = document.getElementById('view');
    var y = window.scrollY;
    var root = document.createElement('div');
    root.className = 'page' + (keepScroll ? '' : ' is-entering');
    root.innerHTML = page.render(ctx);
    view.innerHTML = '';
    view.appendChild(root);
    if (page.mount) page.mount(root, ctx);
    current = page;
    document.title = 'ATLAS — ' + page.title;
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === match[2]); });
    window.scrollTo(0, keepScroll ? y : 0);
    app.refreshChrome();
    onScroll();
  }
  app.rerender = function () { render(true); };

  // Mise à jour des grilles quand l’état change (favoris, vitrine, ventes…)
  S.on(function () { app.refreshChrome(); if (current && current.refresh) current.refresh(); });

  function onScroll() {
    document.body.classList.toggle('is-scrolled', window.scrollY > 8);
    // Barres de filtres : fond visible uniquement quand elles sont collées sous le header.
    var bars = document.querySelectorAll('.sticky-bar');
    for (var i = 0; i < bars.length; i++) {
      var top = parseFloat(getComputedStyle(bars[i]).top) || 0;
      bars[i].classList.toggle('is-stuck', window.scrollY > 0 && bars[i].getBoundingClientRect().top <= top + 0.5);
    }
  }

  /* ---------- Actualisation : rester sur la même page ---------- */
  var SCROLL_KEY = 'atlas-scroll';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('pagehide', function () {
    try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ path: parse().path, y: window.scrollY })); } catch (e) { /* ignore */ }
  });
  function restoreAfterReload() {
    var r = parse(), saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || 'null'); } catch (e) { /* ignore */ }
    if (saved && saved.path === r.path && saved.y > 0) {
      window.scrollTo(0, saved.y);
      // Les visuels se chargent après coup : on réapplique une fois la page stabilisée.
      setTimeout(function () { window.scrollTo(0, saved.y); }, 120);
    }
    if (!app.isOut() && r.query.carte && A.ED[r.query.carte]) {
      var it = r.query.ex && S.item(r.query.ex);
      if (!it || it.ed !== r.query.carte) it = S.ownedOf(r.query.carte)[0];
      U.openCard(r.query.carte, it ? it.uid : null);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    S.init();
    chrome();
    U.bindGlobal();
    A.pack.bindTilt();
    window.addEventListener('hashchange', function () { U.closeModal(); render(false); });
    window.addEventListener('scroll', onScroll, { passive: true });
    render(false);
    // Actualisation : on revient au même défilement et on rouvre la fiche notée dans l’URL.
    restoreAfterReload();
    onScroll();
    // Cache longue durée des illustrations (sw.js) : HTTPS ou localhost uniquement
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
    }
  });
})(window.ATLAS);
