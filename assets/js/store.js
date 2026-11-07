/* ==========================================================================
   ATLAS — Couche « serveur » simulée
   --------------------------------------------------------------------------
   Dans le prototype, l’état est stocké dans le navigateur (localStorage).
   Le découpage reprend l’architecture visée en phase 2, où chaque service
   deviendra une API serveur exécutée dans une transaction SQL atomique :

     Catalog     → collections, personnages, éditions (lecture seule)
     Mint        → stock, numéros de série (tirage côté serveur)
     Inventory   → propriété des exemplaires + provenance
     Wallet      → solde + grand livre (ledger) en monnaie fictive
     Market      → annonces, séquestre (escrow), ventes
   ========================================================================== */
(function (A) {
  'use strict';
  var KEY = 'atlas-demo-v2';
  var S = A.store = {};
  /* Mode test : Éclats illimités (rien n’est débité, le grand livre reste tenu). Passer à false pour revenir au solde réel. */
  S.UNLIMITED = true;
  /* Mode test : toutes les éditions débloquées (un exemplaire de chaque rareté pour chaque personnage). Passer à true pour tout débloquer.
     Désactivé pour éprouver la progression des collections et leurs récompenses. */
  S.UNLOCK_ALL = false;
  /* Mode développement : affiche le nom des personnages secrets même verrouillés. Passer à false avant la mise en production. */
  S.SHOW_SECRETS = true;
  var state = null;
  var listeners = [];

  /* ---------- Utilitaires ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  A.rng = rng;
  var DAY = 86400000;
  function uid(prefix) { return (prefix || 'x') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function todayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  function load() { try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* stockage indisponible */ } return null; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* mode privé : l’état reste en mémoire */ } }
  function emit() { save(); listeners.forEach(function (fn) { try { fn(state); } catch (e) { console.error(e); } }); }
  S.on = function (fn) { listeners.push(fn); };

  /* ---------- Mint : stock et numéros ---------- */
  function minted(ed) { var m = state.minted[ed.id]; return m == null ? ed.minted0 : m; }
  function remaining(ed) { return ed.supply == null ? Infinity : Math.max(0, ed.supply - minted(ed)); }
  S.minted = function (edId) { return minted(A.ED[edId]); };
  S.remaining = function (edId) { return remaining(A.ED[edId]); };

  // Attribue un numéro déjà en circulation (données de démo uniquement)
  function takeExistingSerial(ed, r) {
    if (ed.supply == null) return null;
    var used = state.used[ed.id] || (state.used[ed.id] = []);
    var max = minted(ed);
    if (max <= used.length) return null;
    for (var tries = 0; tries < 200; tries++) {
      var n = 1 + Math.floor(r() * max);
      if (used.indexOf(n) === -1) { used.push(n); return n; }
    }
    return null;
  }
  // Émet un nouvel exemplaire (tirage booster) — opération atomique côté serveur en phase 2
  function mintNew(ed) {
    if (remaining(ed) <= 0) throw new Error('Stock épuisé : ' + ed.id);
    var n = minted(ed) + 1;
    state.minted[ed.id] = n;
    if (ed.supply == null) return null;
    (state.used[ed.id] || (state.used[ed.id] = [])).push(n);
    return n;
  }

  function makeItem(edId, serial, src, at, histLabel) {
    return { uid: uid('it'), ed: edId, serial: serial, at: at, fav: false, show: false, src: src, hist: [{ at: at, t: histLabel }] };
  }

  /* ---------- État initial de la démo ---------- */
  function fresh() {
    var now = Date.now();
    state = {
      v: 1, createdAt: now, eventEndsAt: now + 12 * DAY + 7 * 3600000,
      user: { name: 'Vous', handle: 'collectionneur', level: 4 },
      wallet: { balance: 2500 },
      ledger: [{ id: uid('tx'), at: now, type: 'grant', amount: 2500, label: 'Dotation de bienvenue (démo)' }],
      minted: {}, used: {},
      inventory: [], listings: [], sales: [], offers: [],
      lastDaily: null,
      charge: { n: 10, at: now },
      claimed: {}, tokens: {}, titles: [], trophies: {}, avatars: [], avatar: null, frame: false
    };
    var r = rng(A.hash('atlas-demo'));

    // Inventaire de démonstration
    var seed = [
      ['grece-zeus-legendary', 18], 'grece-zeus-base', 'grece-zeus-base', 'grece-athena-rare', 'grece-hades-base',
      'grece-poseidon-base', 'monstres-meduse-epic', 'grece-apollon-base', 'grece-artemis-base',
      'egypte-anubis-epic', 'egypte-ra-base', 'egypte-bastet-base', 'egypte-bastet-base', 'egypte-thot-rare', 'egypte-isis-base',
      'gothique-dracula-rare', 'gothique-dracula-base', 'gothique-carmilla-base', 'gothique-dorian-base',
      'merveilleux-alice-rare', 'merveilleux-alice-base', 'merveilleux-peterpan-base', 'contes-cendrillon-base', 'contes-chatbotte-legendary',
      'histoire-napoleon-base', 'presidents-degaulle-rare', 'herosfr-jeanne-base', 'savants-curie-base',
      'nordique-loki-base'
    ];
    seed.forEach(function (s, i) {
      var edId = Array.isArray(s) ? s[0] : s;
      var ed = A.ED[edId];
      var serial;
      if (Array.isArray(s)) { serial = s[1]; (state.used[edId] || (state.used[edId] = [])).push(serial); }
      else serial = takeExistingSerial(ed, r);
      var at = now - (i * 1.7 + r() * 2) * DAY - 5 * DAY;
      var src = ed.rarity === 'base' ? 'Booster quotidien' : 'Booster Atlas';
      var it = makeItem(edId, serial, 'booster', at, 'Tirage — ' + src);
      if (edId === 'grece-zeus-legendary') { it.fav = true; it.show = true; it.hist.unshift({ at: at + 3 * DAY, t: 'Exposée en vitrine' }); }
      if (edId === 'egypte-anubis-epic' || edId === 'contes-chatbotte-legendary') { it.fav = true; it.show = true; }
      if (edId === 'merveilleux-alice-rare') it.fav = true;
      state.inventory.push(it);
    });

    // Annonces de la marketplace (joueurs fictifs)
    var numbered = A.EDITIONS.filter(function (e) { return e.rarity !== 'base' && e.rarity !== 'unique'; });
    var bases = A.EDITIONS.filter(function (e) { return e.rarity === 'base'; });
    var PRICE = { base: [18, 45], rare: [110, 280], epic: [360, 720], legendary: [1150, 2500], mythic: [3400, 6200], unique: [18000, 32000] };
    function price(rid) { var p = PRICE[rid]; return Math.round((p[0] + r() * (p[1] - p[0])) / 5) * 5; }
    var picks = [];
    for (var i = 0; i < 30; i++) picks.push(numbered[Math.floor(r() * numbered.length)]);
    for (var j = 0; j < 8; j++) picks.push(bases[Math.floor(r() * bases.length)]);
    var uq = A.EDITIONS.filter(function (e) { return e.rarity === 'unique' && e.minted0 === 1; });
    if (uq[0]) picks.push(uq[0]);
    picks.push(A.ED['grece-zeus-mythic'], A.ED['nordique-thor-legendary'], A.ED['egypte-anubis-legendary']);
    picks.forEach(function (ed) {
      var serial = takeExistingSerial(ed, r);
      if (ed.supply != null && serial == null) return;
      state.listings.push({
        id: uid('ls'), ed: ed.id, serial: serial, price: price(ed.rarity),
        seller: A.DEMO_USERS[Math.floor(r() * A.DEMO_USERS.length)], at: now - r() * 6 * DAY, mine: false
      });
    });

    // Historique des ventes (fictif)
    for (var k = 0; k < 14; k++) {
      var ed2 = numbered[Math.floor(r() * numbered.length)];
      var s2 = takeExistingSerial(ed2, r);
      if (s2 == null) continue;
      var a = Math.floor(r() * A.DEMO_USERS.length), b = (a + 1 + Math.floor(r() * 8)) % A.DEMO_USERS.length;
      state.sales.push({ id: uid('sl'), ed: ed2.id, serial: s2, price: price(ed2.rarity), from: A.DEMO_USERS[a], to: A.DEMO_USERS[b], at: now - (k * 0.35 + r() * 0.3) * DAY });
    }
    save();
  }

  S.init = function () {
    state = load();
    if (!state || state.v !== 1) fresh();
    state.claimed = state.claimed || {}; state.tokens = state.tokens || {}; state.titles = state.titles || [];
    if (!state.charge) state.charge = { n: S.CHARGE.max, at: Date.now() };   // réserve pleine pour les comptes existants
    migrateMoved();
    state.trophies = state.trophies || {}; state.avatars = state.avatars || [];
    if (S.UNLOCK_ALL) unlockAll();
    fillTestCopies();
  };
  // Cartes déplacées d’une sous-collection à l’autre (Héraclès, Méduse, Alice, Peter Pan, Fenrir) : on renomme celles déjà possédées.
  var MOVED = { 'grece-heracles-': 'heros-heracles-', 'grece-meduse-': 'monstres-meduse-', 'contes-alice-': 'merveilleux-alice-', 'contes-peterpan-': 'merveilleux-peterpan-', 'nordique-fenrir-': 'creatures-fenrir-' , 'histoire-degaulle-': 'presidents-degaulle-', 'histoire-jeanne-': 'herosfr-jeanne-', 'histoire-curie-': 'savants-curie-', 'histoire-hugo-': 'ecrivains-hugo-' };
  function moved(id) { for (var k in MOVED) if (id && id.indexOf(k) === 0) return MOVED[k] + id.slice(k.length); return id; }
  function migrateMoved() {
    var n = 0;
    [state.inventory, state.listings, state.sales].forEach(function (list) { (list || []).forEach(function (x) { var m = moved(x.ed); if (m !== x.ed) { x.ed = m; n++; } }); });
    ['minted', 'used'].forEach(function (k) { Object.keys(state[k] || {}).forEach(function (id) { var m = moved(id); if (m !== id) { state[k][m] = state[k][id]; delete state[k][id]; n++; } }); });
    state.inventory = state.inventory.filter(function (i) { return A.ED[i.ed]; });
    if (n) save();
  }
  // Mode test : complète certaines éditions jusqu’à N exemplaires (pour éprouver l’interface).
  S.TEST_COPIES = { 'grece-zeus-base': 50 };
  function fillTestCopies() {
    var r = rng(A.hash('atlas-copies')), now = Date.now(), added = 0;
    Object.keys(S.TEST_COPIES).forEach(function (edId) {
      var ed = A.ED[edId]; if (!ed) return;
      for (var n = S.ownedOf(edId).length; n < S.TEST_COPIES[edId]; n++) {
        var serial = ed.supply == null ? null : (remaining(ed) > 0 ? mintNew(ed) : null);
        if (ed.supply != null && serial == null) break;
        state.inventory.push(makeItem(edId, serial, 'test', now - Math.floor(r() * 20 * DAY), 'Ajoutée (mode test)'));
        added++;
      }
    });
    if (added) save();
  }
  // Ajoute un exemplaire de chaque édition manquante (mode test)
  function unlockAll() {
    var r = rng(A.hash('atlas-unlock')), now = Date.now(), added = 0;
    A.EDITIONS.forEach(function (ed) {
      if (S.ownedOf(ed.id).length) return;
      var serial = takeExistingSerial(ed, r);
      if (serial == null && ed.supply != null && remaining(ed) > 0) serial = mintNew(ed);
      state.inventory.push(makeItem(ed.id, serial, 'test', now - added * 60000, 'Débloquée (mode test)'));
      added++;
    });
    if (added) save();
  }
  S.reset = function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } fresh(); emit(); };
  S.get = function () { return state; };
  // Profil : pseudo, identifiant, e-mail, préférences (démo, stocké localement).
  S.updateUser = function (patch) {
    Object.keys(patch).forEach(function (k) {
      if (k === 'prefs') state.user.prefs = Object.assign({}, state.user.prefs || {}, patch.prefs);
      else state.user[k] = patch[k];
    });
    emit();
  };
  S.ledger = function () { return state.ledger; };

  /* ---------- Catalogue / inventaire ---------- */
  S.items = function () { return state.inventory; };
  S.item = function (u) { return state.inventory.find(function (i) { return i.uid === u; }); };
  S.ownedOf = function (edId) { return state.inventory.filter(function (i) { return i.ed === edId; }); };
  S.ownsChar = function (charId) { return state.inventory.some(function (i) { return A.ED[i.ed].charId === charId; }); };
  S.bestOwned = function (charId) {
    var best = null;
    state.inventory.forEach(function (i) {
      var e = A.ED[i.ed];
      if (e.charId !== charId) return;
      if (!best || A.R[e.rarity].rank > A.R[A.ED[best.ed].rarity].rank) best = i;
    });
    return best;
  };
  S.collectionProgress = function (cid) {
    var chars = A.COLL[cid].chars;
    var owned = chars.filter(function (c) { return S.ownsChar(c); }).length;
    var eds = A.EDITIONS.filter(function (e) { return A.CHAR[e.charId].coll === cid; });
    var edOwned = eds.filter(function (e) { return S.ownedOf(e.id).length > 0; }).length;
    return { owned: owned, total: chars.length, edOwned: edOwned, edTotal: eds.length, pct: chars.length ? owned / chars.length : 0 };
  };
  S.toggleFav = function (u) { var it = S.item(u); if (it) { it.fav = !it.fav; emit(); } return it; };
  S.toggleShow = function (u) {
    var it = S.item(u); if (!it) return it;
    it.show = !it.show;
    it.hist.unshift({ at: Date.now(), t: it.show ? 'Exposée en vitrine' : 'Retirée de la vitrine' });
    emit(); return it;
  };

  /* ---------- Boosters : probabilités et tirage ---------- */
  function poolFor(pack) {
    return A.EDITIONS.filter(function (e) { return pack.collections.indexOf(A.CHAR[e.charId].coll) !== -1; });
  }
  /* Taux réel = taux de référence × (stock restant / tirage total) pour chaque
     rareté limitée. La part non attribuée revient à la rareté la plus basse
     du tableau (Base, ou Rare pour un emplacement garanti). Les probabilités
     baissent donc à mesure que les exemplaires sont distribués. */
  S.packOdds = function (packId, guaranteed) {
    var pack = A.PACK[packId];
    var pool = poolFor(pack);
    var odds = guaranteed ? pack.guarantee.odds : pack.odds;
    var rows = A.RARITIES.filter(function (r) { return odds[r.id]; }).map(function (r) {
      var eds = pool.filter(function (e) { return e.rarity === r.id; });
      var row = { rarity: r.id, ref: odds[r.id], editions: eds.length };
      if (r.supply == null) { row.remaining = null; row.total = null; row.ratio = 1; }
      else {
        row.total = eds.reduce(function (s, e) { return s + e.supply; }, 0);
        row.remaining = eds.reduce(function (s, e) { return s + remaining(e); }, 0);
        row.ratio = row.total ? row.remaining / row.total : 0;
      }
      row.p = row.ref * row.ratio;
      return row;
    });
    var lost = rows.reduce(function (s, x) { return s + (x.ref - x.p); }, 0);
    if (rows.length) rows[0].p += lost;
    return rows;
  };

  S.balance = function () { return S.UNLIMITED ? Infinity : state.wallet.balance; };
  S.dailyAvailable = function () { return state.lastDaily !== todayKey(); };
  S.nextDailyIn = function () { var d = new Date(); d.setHours(24, 0, 0, 0); return d - Date.now(); };
  S.eventRemaining = function () { return Math.max(0, state.eventEndsAt - Date.now()); };

  /* ---------- Réserve de boosters gratuits ----------
     Un Booster Atlas revient toutes les 15 min, jusqu’à 10 en réserve. Le minuteur ne tourne
     que si la réserve n’est pas pleine. (Phase 2 : calcul côté serveur, sur l’horloge du serveur.) */
  S.CHARGE = { max: 10, every: 15 * 60 * 1000, pack: 'standard' };
  function regen() {
    var c = state.charge, now = Date.now(), E = S.CHARGE.every;
    if (c.n >= S.CHARGE.max) { c.at = now; return c; }
    var k = Math.floor(Math.max(0, now - c.at) / E);
    if (k > 0) { c.n = Math.min(S.CHARGE.max, c.n + k); c.at = c.n >= S.CHARGE.max ? now : c.at + k * E; }
    return c;
  }
  /** { n : boosters en réserve, max, next : ms avant le prochain (0 si réserve pleine) } */
  S.charges = function () {
    var c = regen();
    return { n: c.n, max: S.CHARGE.max, next: c.n >= S.CHARGE.max ? 0 : Math.max(0, c.at + S.CHARGE.every - Date.now()) };
  };
  S.refillCharges = function () { state.charge = { n: S.CHARGE.max, at: Date.now() }; emit(); };   // démo
  /** Test : tout recharger (réserve pleine, quotidien disponible, 3 Coffrets et 3 Saga du Nord) */
  S.devRefill = function () {
    state.charge = { n: S.CHARGE.max, at: Date.now() };
    state.lastDaily = null;
    ['conservateur', 'saga'].forEach(function (id) { state.tokens[id] = Math.max(3, state.tokens[id] || 0); });
    emit();
  };

  /* ---------- Récompenses de collection ----------
     Chaque collection a quatre paliers : quelques personnages, la moitié, tous les personnages,
     puis toutes les éditions (maîtrise). Un palier atteint se récupère à la main. */
  var TITLES = {
    grece: ['Initié de l’Olympe', 'Maître de l’Olympe'], egypte: ['Scribe du Nil', 'Gardien des Deux Terres'],
    gothique: ['Veilleur des ombres', 'Seigneur des brumes'], contes: ['Conteur', 'Gardien des contes'],
    histoire: ['Mémorialiste', 'Grand Historien'],
    afrique: ['Griot', 'Maître de la parole'],
    slaves: ['Bogatyr', 'Gardien de l’isba'],
    inde: ['Conteur d’épopées', 'Sage du Gange'],
    chine: ['Lettré', 'Fils du dragon'],
    azteques: ['Prêtre du soleil', 'Chevalier-aigle'],
    celtes: ['Druide', 'Barde des Tuatha'],
    illusionnistes: ['Prestidigitateur', 'Maître illusionniste'],
    alchimistes: ['Apprenti alchimiste', 'Maître de la pierre'],
    maudits: ['Chasseur d’épaves', 'Capitaine fantôme'],
    navires: ['Mousse', 'Capitaine au long cours'],
    megafaune: ['Chasseur de mammouths', 'Gardien de l’âge de glace'],
    mersciel: ['Plongeur du Crétacé', 'Maître des abysses'],
    dinosaures: ['Chasseur de fossiles', 'Paléontologue en chef'],
    tresors: ['Chercheur de trésors', 'Gardien du Graal'],
    enigmes: ['Déchiffreur', 'Maître des énigmes'],
    citesperdues: ['Explorateur', 'Découvreur de mondes'],
    betes: ['Enquêteur de l’étrange', 'Maître des légendes'],
    hommessauvages: ['Pisteur', 'Chasseur d’empreintes'],
    eaux: ['Guetteur du loch', 'Sondeur des abysses'],
    epoques: ['Archiviste', 'Historien impérial'],
    samourais: ['Rōnin', 'Daimyō'],
    yokai: ['Conteur de yōkai', 'Exorciste'],
    kami: ['Pèlerin du sanctuaire', 'Gardien des kami'],
    ecrivains: ['Lecteur assidu', 'Immortel de l’Académie'],
    savants: ['Apprenti savant', 'Prix Nobel'],
    herosfr: ['Résistant', 'Compagnon de la Libération'],
    presidents: ['Électeur', 'Gardien de la République'], nordique: ['Skalde', 'Héraut d’Asgard'],
    creatures: ['Dompteur de loups', 'Maître des bêtes d’Yggdrasil'], jotnar: ['Visiteur de Jötunheim', 'Seigneur des géants'], mondes: ['Voyageur des mondes', 'Gardien de Bifröst'],
    titans: ['Héritier des Titans', 'Seigneur de l’Othrys'], geants: ['Dompteur de colosses', 'Vainqueur de Phlégra'],
    pharaons: ['Scribe royal', 'Fils de Râ'],
    heros: ['Compagnon des Argonautes', 'Héros légendaire'], monstres: ['Chasseur de monstres', 'Dompteur de chimères'],
    planetes: ['Astronome amateur', 'Maître des orbites'], cosmos: ['Observateur du ciel profond', 'Maître du cosmos'], lunes: ['Chasseur de lunes', 'Seigneur des satellites'],
    astronautes: ['Cadet de l’espace', 'Vétéran des étoiles'],
    missions: ['Contrôleur de vol', 'Directeur de mission'],
    detectives: ['Apprenti détective', 'Maître de la déduction'],
    verne: ['Passager du Nautilus', 'Voyageur extraordinaire'],
    mousquetaires: ['Cadet de Gascogne', 'Fine lame'],
    nuits: ['Conteur de Bagdad', 'Gardien de la lampe'],
    merveilleux: ['Voyageur d’Oz', 'Sage de la Cité d’émeraude'],
    jungle: ['Petit d’homme', 'Maître de la jungle'],
    arthur: ['Écuyer de Camelot', 'Chevalier du Graal'],
    robin: ['Archer de Sherwood', 'Prince des voleurs'],
    etranges: ['Témoin de l’étrange', 'Chasseur de mystères'],
    flibustiers: ['Mousse', 'Capitaine de la flibuste'],
    forbans: ['Chercheur de trésor', 'Terreur des sept mers']
  };
  /* Collection globale : progression cumulée de ses sous-collections. */
  S.groupProgress = function (gid) {
    var g = A.GROUP[gid], o = { owned: 0, total: 0, started: 0, done: 0, subs: g.subs.length };
    g.subs.forEach(function (cid) {
      var p = S.collectionProgress(cid);
      o.owned += p.owned; o.total += p.total;
      if (p.owned) o.started++;
      if (p.pct >= 1) o.done++;
    });
    o.pct = o.total ? o.owned / o.total : 0;
    return o;
  };
  // Une portée de récompense est une collection (« grece ») ou une collection globale (« @grecque »).
  S.scopeName = function (key) { return key.charAt(0) === '@' ? A.GROUP[key.slice(1)].name : A.COLL[key].name; };
  function groupRewards(key) {
    var g = A.GROUP[key.slice(1)], pr = S.groupProgress(g.id), n = g.subs.length;
    var steps = [
      { id: 'explorateur', goal: n, of: 'started', label: 'Explorateur', reward: { eclats: 300 } },
      { id: 'premiere', goal: 1, of: 'done', label: 'Première sous-collection', reward: { booster: 'standard' } },
      { id: 'pantheon', goal: n, of: 'done', label: 'Panthéon complet', reward: { eclats: 3000, booster: 'conservateur', titre: g.title } }
    ];
    return steps.map(function (s) {
      s.have = Math.min(s.goal, pr[s.of]);
      s.state = state.claimed[key + ':' + s.id] ? 'claimed' : s.have >= s.goal ? 'ready' : 'locked';
      s.coll = key;
      return s;
    });
  }
  S.rewards = function (cid) {
    if (cid.charAt(0) === '@') return groupRewards(cid);
    var c = A.COLL[cid], pr = S.collectionProgress(cid), n = pr.total, t = TITLES[cid] || ['Collectionneur', 'Maître collectionneur'];
    var steps = [
      { id: 'debut', goal: Math.min(3, n), of: 'chars', label: 'Premiers pas', reward: { eclats: 150 } },
      { id: 'moitie', goal: Math.ceil(n / 2), of: 'chars', label: 'À mi-chemin', reward: { booster: 'standard' } },
      { id: 'complet', goal: n, of: 'chars', label: 'Collection complète', reward: { trophee: true, avatar: true, titre: t[0] } },
      { id: 'maitrise', goal: pr.edTotal, of: 'eds', label: 'Maîtrise', reward: { eclats: 5000, titre: t[1], cadre: true } }
    ];
    return steps.map(function (s) {
      s.have = Math.min(s.goal, s.of === 'chars' ? pr.owned : pr.edOwned);
      s.state = state.claimed[cid + ':' + s.id] ? 'claimed' : s.have >= s.goal ? 'ready' : 'locked';
      s.coll = c.id;
      return s;
    });
  };
  /* ---------- Missions de collection ----------
     Thématiques (missions.js) + missions de chasse tirées selon la collection (huntsFor) :
     deux collections n’ont jamais exactement les mêmes. */
  var HUNTS = {
    rare: { label: 'Première rareté', desc: 'Obtenez une édition Rare ou plus précieuse.', min: 'rare', reward: { eclats: 200 } },
    epic: { label: 'Pièce de musée', desc: 'Obtenez une édition Épique ou plus précieuse.', min: 'epic', reward: { eclats: 400 } },
    legendary: { label: 'Chef-d’œuvre', desc: 'Obtenez une édition Légendaire ou plus précieuse.', min: 'legendary', reward: { booster: 'conservateur' } },
    trio: { label: 'Trois visages', desc: 'Réunissez trois éditions différentes d’un même personnage.', goal: 3, reward: { eclats: 300 } },
    numerotes: { label: 'Exemplaires numérotés', desc: 'Possédez trois exemplaires numérotés de cette collection.', goal: 3, reward: { eclats: 350 } },
    eventail: { label: 'L’éventail des raretés', desc: 'Possédez des cartes de trois raretés différentes dans cette collection.', goal: 3, reward: { eclats: 300 } }
  };
  function huntsFor(cid) {
    var h = A.hash(cid + '-missions'), c = A.COLL[cid];
    var hasR = function (rid) { return c.chars.some(function (id) { return A.CHAR[id].editions.indexOf(rid) !== -1; }); };
    var rar = ['rare', 'epic', 'legendary'].filter(hasR);
    var other = ['trio', 'numerotes', 'eventail'];
    return [rar[h % rar.length], other[(h >> 3) % other.length]].filter(Boolean);
  }
  S.missions = function (cid) {
    var c = A.COLL[cid];
    if (!c) return [];
    var inv = state.inventory.filter(function (i) { return A.CHAR[A.ED[i.ed].charId].coll === cid; });
    var out = (A.MISSIONS && A.MISSIONS[cid] || []).map(function (m) {
      var own = m.chars.filter(function (id) { return A.CHAR[id] && S.ownsChar(id); });
      return { id: 'm-' + m.id, kind: 'set', label: m.label, desc: m.desc, chars: m.chars.filter(function (id) { return A.CHAR[id]; }), owned: own, goal: m.chars.length, have: own.length, reward: m.reward };
    });
    huntsFor(cid).forEach(function (k) {
      var H = HUNTS[k], have = 0, goal = H.goal || 1;
      if (H.min) have = inv.some(function (i) { return A.R[A.ED[i.ed].rarity].rank >= A.R[H.min].rank; }) ? 1 : 0;
      else if (k === 'trio') {
        var per = {};
        inv.forEach(function (i) { var e = A.ED[i.ed]; (per[e.charId] = per[e.charId] || {})[e.id] = 1; });
        have = Object.keys(per).reduce(function (m, id) { return Math.max(m, Object.keys(per[id]).length); }, 0);
      } else if (k === 'numerotes') have = inv.filter(function (i) { return i.serial != null; }).length;
      else if (k === 'eventail') { var r = {}; inv.forEach(function (i) { r[A.ED[i.ed].rarity] = 1; }); have = Object.keys(r).length; }
      out.push({ id: 'h-' + k, kind: 'hunt', hunt: k, min: H.min, label: H.label, desc: H.desc, goal: goal, have: Math.min(goal, have), reward: H.reward });
    });
    return out.map(function (m) {
      m.state = state.claimed[cid + ':' + m.id] ? 'claimed' : m.have >= m.goal ? 'ready' : 'locked';
      m.coll = cid;
      return m;
    });
  };
  function readyKeys() {
    var out = [];
    A.COLLECTIONS.map(function (c) { return c.id; }).concat((A.GROUPS || []).map(function (g) { return '@' + g.id; })).forEach(function (k) {
      S.rewards(k).concat(k.charAt(0) === '@' ? [] : S.missions(k)).forEach(function (s) { if (s.state === 'ready') out.push(k + ':' + s.id); });
    });
    return out;
  }
  S.readyCount = function (cid) { return cid ? S.rewards(cid).concat(cid.charAt(0) === '@' ? [] : S.missions(cid)).filter(function (s) { return s.state === 'ready'; }).length : readyKeys().length; };
  S.claim = function (cid, stepId) {
    var s = S.rewards(cid).concat(cid.charAt(0) === '@' ? [] : S.missions(cid)).filter(function (x) { return x.id === stepId; })[0];
    if (!s || s.state !== 'ready') return { ok: false, error: 'Ce palier n’est pas encore atteint.' };
    var r = s.reward, now = Date.now(), label = (s.kind ? 'Mission' : 'Récompense') + ' · ' + S.scopeName(cid) + ' · ' + s.label;
    state.claimed[cid + ':' + stepId] = now;
    if (r.eclats) { state.wallet.balance += r.eclats; state.ledger.unshift({ id: uid('tx'), at: now, type: 'reward', amount: r.eclats, label: label }); }
    if (r.booster) state.tokens[r.booster] = (state.tokens[r.booster] || 0) + 1;
    if (r.titre && state.titles.indexOf(r.titre) === -1) state.titles.push(r.titre);
    // Personnage secret : numéroté dans l’ordre des collectionneurs qui l’ont révélé (fictif en démo)
    if (r.trophee && !state.trophies[cid]) state.trophies[cid] = { at: now, no: 3 + A.hash(cid + state.user.handle) % 57 };
    if (r.avatar && state.avatars.indexOf(cid) === -1) { state.avatars.push(cid); if (!state.avatar) state.avatar = cid; }
    if (r.cadre) state.frame = true;
    emit();
    return { ok: true, reward: r, step: s };
  };
  S.duels = function () {
    return (A.DUELS || []).map(function (d) {
      var h = S.ownsChar(d.hero), m = S.ownsChar(d.monster);
      return Object.assign({ heroOwned: h, monsterOwned: m, done: h && m, set: d.set || 'grecque' }, d);
    });
  };
  S.trophy = function (cid) { return state.trophies[cid] || null; };
  S.avatars = function () { return state.avatars || []; };
  S.avatar = function () { return state.avatar && state.avatars.indexOf(state.avatar) !== -1 ? state.avatar : null; };
  S.setAvatar = function (cid) { state.avatar = cid && state.avatars.indexOf(cid) !== -1 ? cid : null; emit(); };
  S.hasFrame = function () { return !!state.frame; };
  S.tokens = function (packId) { return (state.tokens && state.tokens[packId]) || 0; };
  S.titles = function () { return state.titles || []; };

  S.canOpen = function (packId) {
    var p = A.PACK[packId];
    if (p.daily && !S.dailyAvailable()) return { ok: false, reason: 'Déjà ouvert' };
    if (p.event && S.eventRemaining() <= 0) return { ok: false, reason: 'Événement terminé' };
    if (p.timer && S.charges().n > 0) return { ok: true, charge: true };
    if (S.tokens(packId) > 0) return { ok: true, token: true };
    if (p.timer) return { ok: false, reason: 'Prochain dans ' + A.ui.clock(S.charges().next) };
    if (p.earned) return { ok: false, reason: 'À gagner en jouant' };
    if (!S.UNLIMITED && state.wallet.balance < p.price) return { ok: false, reason: 'Solde insuffisant' };
    return { ok: true };
  };

  function pick(rows, x) {
    var sum = rows.reduce(function (s, r) { return s + r.p; }, 0);
    var t = x * sum;
    for (var i = 0; i < rows.length; i++) { t -= rows[i].p; if (t <= 0) return rows[i].rarity; }
    return rows[rows.length - 1].rarity;
  }
  // avoid : personnages déjà tirés dans ce booster (jamais deux fois le même personnage)
  function pickEdition(pool, rarity, avoid) {
    var eds = pool.filter(function (e) { return e.rarity === rarity && remaining(e) > 0 && !(avoid && avoid[e.charId]); });
    if (!eds.length) return null;
    if (rarity === 'base') return eds[Math.floor(Math.random() * eds.length)];
    var total = eds.reduce(function (s, e) { return s + remaining(e); }, 0);
    var t = Math.random() * total;
    for (var i = 0; i < eds.length; i++) { t -= remaining(eds[i]); if (t <= 0) return eds[i]; }
    return eds[eds.length - 1];
  }

  /* Ouverture d’un booster : vérification → débit → tirage → émission des
     numéros → inscription à l’inventaire → écriture au grand livre.
     En phase 2 : une seule transaction SQL (SERIALIZABLE) côté serveur. */
  S.openPack = function (packId) {
    var check = S.canOpen(packId);
    if (!check.ok) return { ok: false, error: check.reason };
    var pack = A.PACK[packId];
    var pool = poolFor(pack);
    var readyBefore = readyKeys();
    var duelsBefore = S.duels().filter(function (d) { return d.done; }).map(function (d) { return d.id; });
    var now = Date.now();
    var items = [], seen = {};
    for (var i = 0; i < pack.size; i++) {
      var guaranteed = pack.guarantee && i === pack.size - 1;
      var rows = S.packOdds(packId, guaranteed);
      var rid = pack.fixed ? pack.fixed[i] : pick(rows, Math.random());
      var ed = pickEdition(pool, rid, seen), serial = undefined;
      if (!ed && pack.fixed) {            // pack de test : rareté imposée même si le stock est épuisé (numéro fictif)
        var any = pool.filter(function (e) { return e.rarity === rid && !seen[e.charId]; });
        ed = any[Math.floor(Math.random() * any.length)];
        if (ed) serial = ed.supply ? 1 + Math.floor(Math.random() * ed.supply) : null;
      }
      if (!ed) ed = pickEdition(pool, 'base', seen);
      if (!ed) ed = pickEdition(pool, rid) || pickEdition(pool, 'base');   // très petit choix : on accepte un doublon plutôt que rien
      var first = minted(ed) === 0;                 // personne ne l’avait encore trouvée
      if (serial === undefined) serial = mintNew(ed);
      var it = makeItem(ed.id, serial, 'booster', now + i, 'Tirage — ' + pack.name);
      if (first) { it.first = true; it.hist.push({ at: now + i, t: 'Première découverte mondiale' }); }
      it.isNew = !S.ownsChar(ed.charId) && !seen[ed.charId];
      seen[ed.charId] = true;
      items.push(it);
    }
    items.forEach(function (it) { var n = it.isNew; delete it.isNew; it._new = n; state.inventory.push(it); });
    if (check.charge) {
      var c = regen();
      if (c.n >= S.CHARGE.max) c.at = now;            // la réserve était pleine : le minuteur démarre maintenant
      c.n--;
      state.ledger.unshift({ id: uid('tx'), at: now, type: 'pack', amount: 0, label: pack.name + ' (réserve gratuite)' });
    } else if (check.token) {
      state.tokens[packId]--;
      state.ledger.unshift({ id: uid('tx'), at: now, type: 'pack', amount: 0, label: pack.name + ' (offert par une récompense)' });
    } else if (pack.price) {
      if (!S.UNLIMITED) state.wallet.balance -= pack.price;
      state.ledger.unshift({ id: uid('tx'), at: now, type: 'pack', amount: -pack.price, label: pack.name });
    }
    if (pack.daily && !check.token) state.lastDaily = todayKey();
    emit();
    // paliers de collection atteints grâce à ce booster
    var unlocked = readyKeys().filter(function (k) { return readyBefore.indexOf(k) === -1; }).map(function (k) {
      var p = k.split(':'); return { coll: p[0], step: S.rewards(p[0]).filter(function (r) { return r.id === p[1]; })[0] };
    });
    var duels = S.duels().filter(function (d) { return d.done && duelsBefore.indexOf(d.id) === -1; });
    return { ok: true, unlocked: unlocked, duels: duels, items: items.map(function (it) { var c = Object.assign({}, it); delete it._new; return c; }) };
  };
  S.resetDaily = function () { state.lastDaily = null; emit(); };
  S.grant = function (n) {
    state.wallet.balance += n;
    state.ledger.unshift({ id: uid('tx'), at: Date.now(), type: 'grant', amount: n, label: 'Crédit de démonstration' });
    emit();
  };

  /* ---------- Marketplace (monnaie fictive) ---------- */
  S.listings = function () { return state.listings; };
  S.sales = function () { return state.sales; };
  S.floor = function (edId) {
    var l = state.listings.filter(function (x) { return x.ed === edId; });
    return l.length ? Math.min.apply(null, l.map(function (x) { return x.price; })) : null;
  };

  S.buy = function (listingId) {
    var idx = state.listings.findIndex(function (l) { return l.id === listingId; });
    if (idx === -1) return { ok: false, error: 'Annonce introuvable ou déjà vendue' };
    var l = state.listings[idx];
    if (l.mine) return { ok: false, error: 'Vous ne pouvez pas acheter votre propre annonce' };
    if (!S.UNLIMITED && state.wallet.balance < l.price) return { ok: false, error: 'Solde insuffisant' };
    var now = Date.now();
    state.listings.splice(idx, 1);
    if (!S.UNLIMITED) state.wallet.balance -= l.price;
    state.ledger.unshift({ id: uid('tx'), at: now, type: 'buy', amount: -l.price, label: 'Achat — ' + A.CHAR[A.ED[l.ed].charId].name });
    var it = makeItem(l.ed, l.serial, 'market', now, 'Achetée sur la marketplace à ' + l.seller);
    state.inventory.push(it);
    state.sales.unshift({ id: uid('sl'), ed: l.ed, serial: l.serial, price: l.price, from: l.seller, to: state.user.name, at: now });
    emit();
    return { ok: true, item: it };
  };

  // Mise en vente : l’exemplaire quitte l’inventaire et passe en séquestre
  S.list = function (itemUid, price) {
    var idx = state.inventory.findIndex(function (i) { return i.uid === itemUid; });
    if (idx === -1) return { ok: false, error: 'Carte introuvable' };
    if (!(price > 0)) return { ok: false, error: 'Prix invalide' };
    var it = state.inventory.splice(idx, 1)[0];
    it.hist.unshift({ at: Date.now(), t: 'Mise en vente à ' + price + ' ' + A.CURRENCY.name });
    state.listings.unshift({ id: uid('ls'), ed: it.ed, serial: it.serial, price: Math.round(price), seller: state.user.name, at: Date.now(), mine: true, escrow: it });
    emit();
    return { ok: true };
  };
  S.unlist = function (listingId) {
    var idx = state.listings.findIndex(function (l) { return l.id === listingId && l.mine; });
    if (idx === -1) return { ok: false };
    var l = state.listings.splice(idx, 1)[0];
    var it = l.escrow; it.hist.unshift({ at: Date.now(), t: 'Annonce retirée' });
    state.inventory.push(it);
    emit();
    return { ok: true };
  };
  S.offer = function (listingId, amount) {
    var l = state.listings.find(function (x) { return x.id === listingId; });
    if (!l) return { ok: false, error: 'Annonce introuvable' };
    if (!(amount > 0)) return { ok: false, error: 'Montant invalide' };
    if (!S.UNLIMITED && amount > state.wallet.balance) return { ok: false, error: 'Montant supérieur à votre solde' };
    state.offers.unshift({ id: uid('of'), listing: listingId, amount: Math.round(amount), at: Date.now(), status: 'en attente' });
    emit();
    return { ok: true };
  };
})(window.ATLAS);
