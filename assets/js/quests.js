/* ==========================================================================
   ATLAS — Bouton « Missions » flottant (bas à droite) et son panneau
   Le contenu suit la page : une collection → ses paliers et missions ;
   un album → ses paliers et ceux de ses collections ; ailleurs → toutes les collections.
   ========================================================================== */
(function (A) {
  'use strict';
  var S = A.store, U = A.ui;
  var fab, sheet, body, title, sub, isOpen = false, pending = 0;

  function ctx() {
    var h = (location.hash.replace(/^#/, '') || '/').split('?')[0], m;
    if ((m = h.match(/^\/collection\/([\w-]+)$/)) && A.COLL[m[1]]) return { key: m[1], name: A.COLL[m[1]].name, sub: A.COLL[m[1]].group ? 'Collection et album' : 'Cette collection' };
    // Pas de bouton en combat : l’écran est déjà chargé de commandes
    return { key: null, name: 'Toutes les collections', sub: 'Vos objectifs les plus proches', hide: /^\/(combat|connexion)/.test(h) };
  }
  function readyIn(c) {
    return c.key ? U.questScope(c.key, true).filter(function (s) { return s.state === 'ready'; }).length : S.readyCount();
  }

  var panel, F = null, anims = [];
  var EASE = 'cubic-bezier(.22, 1, .36, 1)';
  function still() { return !panel.animate || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function stop() { anims.forEach(function (x) { x.cancel(); }); anims = []; }

  function build() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'qfab';
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.innerHTML = '<span class="qfab-i">' + U.icon('scroll') + '</span><span class="qfab-l">Missions</span><span class="qfab-x">' + U.icon('close') + '</span><span class="qfab-n" hidden></span>';
    document.body.appendChild(fab);

    sheet = document.createElement('div');
    sheet.className = 'qsheet';
    sheet.hidden = true;
    sheet.innerHTML = '<div class="qsheet-back" data-qs-close></div>' +
      '<section class="qsheet-panel" role="dialog" aria-modal="true" aria-labelledby="qsheet-title">' +
        '<header class="qsheet-head"><div><p class="eyebrow" data-qs-sub></p><h2 class="qsheet-title" id="qsheet-title" data-qs-title></h2></div>' +
          '<button type="button" class="qsheet-close" data-qs-close aria-label="Fermer">' + U.icon('close') + '</button></header>' +
        '<div class="qsheet-bar" data-qs-bar></div><div class="qsheet-body" data-qs-body></div></section>';
    document.body.appendChild(sheet);
    panel = sheet.querySelector('.qsheet-panel');
    body = sheet.querySelector('[data-qs-body]');
    title = sheet.querySelector('[data-qs-title]');
    sub = sheet.querySelector('[data-qs-sub]');

    fab.addEventListener('click', function () { if (isOpen) close(); else open(); });
    window.addEventListener('resize', function () { if (isOpen) fit(); });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-qs-close]')) { close(); return; }
      if (e.target.closest('a[href^="#/"]')) close();   // lien vers une collection : on ferme, la page change
    });
    document.addEventListener('keydown', function (e) { if (isOpen && e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-qs-open]')) open(); });
    window.addEventListener('hashchange', function () { close(true); update(); });
    S.on(function () { if (pending) return; pending = requestAnimationFrame(function () { pending = 0; update(); }); });
  }

  // Hauteur qui change (onglet, récompense récupérée) : transition de l’ancienne hauteur vers la nouvelle
  function grow(h0) {
    if (!isOpen || still()) return;
    var h1 = panel.offsetHeight;
    if (Math.abs(h1 - h0) < 2) return;
    panel.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 300, easing: EASE });
  }
  /* Le bouton se déplie en fenêtre (et s’y replie) : la fenêtre part de la place exacte du bouton,
     découpée à sa taille et à ses coins arrondis, puis s’ouvre ; le contenu apparaît en fondu. */
  function morph(opening, done) {
    stop();
    if (still() || !F) { if (done) done(); return; }
    var P = panel.getBoundingClientRect(), R = getComputedStyle(panel).borderRadius || '16px';
    var dx = F.right - P.right, dy = F.bottom - P.bottom;
    var small = { transform: 'translate(' + dx + 'px, ' + dy + 'px)', clipPath: 'inset(' + Math.max(0, P.height - F.height) + 'px 0px 0px ' + Math.max(0, P.width - F.width) + 'px round ' + F.height / 2 + 'px)' };
    var big = { transform: 'translate(0px, 0px)', clipPath: 'inset(0px 0px 0px 0px round ' + R + ')' };
    var t = opening ? 460 : 340, kids = [panel.querySelector('.qsheet-head'), body];
    var a = panel.animate(opening ? [small, big] : [big, small], { duration: t, easing: opening ? EASE : 'cubic-bezier(.55, 0, .45, 1)', fill: 'both' });
    anims.push(a);
    kids.forEach(function (k) {
      anims.push(k.animate(opening ? [{ opacity: 0 }, { opacity: 0, offset: .18 }, { opacity: 1, offset: .7 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0, offset: .4 }, { opacity: 0 }], { duration: t, fill: 'both' }));
    });
    a.onfinish = function () { if (done) done(); if (opening) stop(); };
  }

  /* Hauteur de la liste calée sur des missions entières : la dernière visible n’est jamais coupée.
     (Au défilement, la liste s’arrête aussi au début d’une mission : scroll-snap dans le CSS.) */
  function fit() {
    body.style.maxHeight = '';
    if (body.scrollHeight <= body.clientHeight + 1) return;
    var rows = body.querySelectorAll('.qs-row'), cs = getComputedStyle(body);
    if (!rows.length) return;
    var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom), h = rows[0].offsetHeight;
    var n = Math.max(1, Math.floor((body.clientHeight - pad) / h));   // lignes toutes de même hauteur : n missions entières
    body.style.maxHeight = (n * h + pad) + 'px';
  }
  function fill(c, quiet) {
    title.textContent = c.name;
    sub.textContent = 'Missions · ' + c.sub;
    var y = body.scrollTop, h0 = panel.offsetHeight;
    body.innerHTML = U.questList(c.key);
    var bar = body.querySelector('.qs-bar'), slot = sheet.querySelector('[data-qs-bar]');
    slot.innerHTML = '';
    if (bar) slot.appendChild(bar);   // « Tout récupérer » reste fixe, hors de la liste qui défile
    slot.hidden = !bar;
    body.scrollTop = 0;
    fit();
    body.scrollTop = y;
    if (!quiet) grow(h0);
  }
  function update() {
    var c = ctx(), n = readyIn(c), badge = fab.querySelector('.qfab-n');
    fab.hidden = !!c.hide;
    badge.hidden = !n;
    badge.textContent = n > 99 ? '99+' : n;
    fab.classList.toggle('has-ready', n > 0);
    fab.setAttribute('aria-label', 'Missions' + (n ? ' : ' + n + ' récompense' + (n > 1 ? 's' : '') + ' à récupérer' : ''));
    fab.title = fab.getAttribute('aria-label');
    if (isOpen) fill(c);
  }
  function open() {
    var c = ctx();
    if (c.hide) return;
    F = fab.getBoundingClientRect();   // le bouton fermé (pastille « Missions ») : point de départ de l’animation
    isOpen = true;
    sheet.hidden = false;
    fill(c, true);
    document.body.classList.add('qs-open');
    fab.classList.add('is-hiding');
    sheet.classList.add('is-in');
    morph(true);   // la fenêtre prend la place du bouton : il reste masqué jusqu’à la fermeture
    sheet.querySelector('.qsheet-close').focus({ preventScroll: true });
  }
  function close(now) {
    if (!isOpen) return;
    isOpen = false;
    fab.classList.remove('is-open');
    document.body.classList.remove('qs-open');
    sheet.classList.remove('is-in');
    if (now) { stop(); sheet.hidden = true; fab.classList.remove('is-hiding'); return; }
    fab.classList.add('is-hiding');
    F = fab.getBoundingClientRect();   // la pastille reprend sa place : la fenêtre s’y replie
    morph(false, function () { stop(); if (!isOpen) sheet.hidden = true; fab.classList.remove('is-hiding'); fab.focus({ preventScroll: true }); });
  }

  // Après l’initialisation du magasin (app.js s’abonne à DOMContentLoaded avant ce fichier)
  document.addEventListener('DOMContentLoaded', function () { build(); update(); });
  A.quests = { open: open, close: close, update: update };
})(window.ATLAS);
