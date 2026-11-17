/* ATLAS — Questions de culture : faits des fiches, univers et personnages variés. */
(function (A) {
  'use strict';
  var Q = A.quiz = {}, NB = ' ', bank = null, recent = [];
  Q.themes = [
    { id: 'liens', name: 'Liens', icon: 'user', hint: 'Familles, alliés, adversaires et influences.', accuracy: .66 },
    { id: 'reperes', name: 'Repères', icon: 'clock', hint: 'Dates, lieux et découvertes.', accuracy: .6 },
    { id: 'recits', name: 'Récits', icon: 'scroll', hint: 'Événements, objets et détails des légendes.', accuracy: .62 }
  ];
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)), v = out[i]; out[i] = out[k]; out[k] = v; }
    return out;
  }
  function link(ch, ref) { return A.CHAR[ref.indexOf(':') < 0 ? ch.coll + '-' + ref : ref.replace(':', '-')]; }
  function plain(ch, text) {
    return (text || '').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, ref, label) {
      var target = link(ch, ref); return label || (target ? target.name : ref);
    });
  }
  function norm(text) { return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function mask(text, answer) { return text.split(answer).join('[…]'); }

  // Les réponses et les corrections proviennent des paragraphes story / more du catalogue.
  var authored = [
    ['pharaons-cleopatre', 'recits', 'À quelle bataille Cléopâtre et Marc Antoine sont-ils vaincus avant la fin de leur royaume', ['Actium', 'Pharsale', 'Philippes', 'Zama']],
    ['pharaons-cleopatre', 'liens', 'À quelle dynastie Cléopâtre VII appartient-elle', ['Ptolémées', 'Séleucides', 'Antigonides', 'Julio-Claudiens']],
    ['pharaons-cleopatre', 'reperes', 'En quelle année la bataille d’Actium précède-t-elle la mort de Cléopâtre', ['31 av. J.-C.', '44 av. J.-C.', '27 av. J.-C.', '14 ap. J.-C.']],
    ['pharaons-narmer', 'recits', 'Quel objet montre Narmer portant successivement les couronnes du Sud et du Nord', ['La palette de Narmer', 'La pierre de Rosette', 'Le papyrus de Turin', 'La stèle de Mérenptah']],
    ['pharaons-kheops', 'reperes', 'Quelle était approximativement la hauteur initiale de la Grande Pyramide, en mètres', ['146', '93', '210', '320']],
    ['pharaons-hatchepsout', 'recits', 'Vers quel pays Hatchepsout envoie-t-elle une expédition rapportant encens et arbres à myrrhe', ['Pount', 'Koush', 'Canaan', 'Mitanni']],
    ['pharaons-thoutmosis', 'recits', 'Quelle victoire de Thoutmôsis III est racontée en détail dans les annales de Karnak', ['Megiddo', 'Qadesh', 'Actium', 'Péluse']],
    ['pharaons-akhenaton', 'reperes', 'Quelle capitale Akhenaton fonde-t-il pour son nouveau culte', ['Akhetaton', 'Memphis', 'Tanis', 'Pi-Ramsès']],
    ['pharaons-nefertiti', 'reperes', 'Dans quelle ville le célèbre buste peint de Néfertiti est-il exposé', ['Berlin', 'Londres', 'Paris', 'Le Caire']],
    ['pharaons-toutankhamon', 'liens', 'Quel archéologue découvre le tombeau de Toutankhamon presque intact', ['Howard Carter', 'Auguste Mariette', 'Flinders Petrie', 'Giovanni Belzoni']],
    ['pharaons-ramses', 'recits', 'Face à quel peuple Ramsès II livre-t-il la bataille de Qadesh', ['Hittites', 'Perses', 'Assyriens', 'Mycéniens']],
    ['pharaons-ramses', 'reperes', 'Quels temples de Ramsès II ont été déplacés pour les préserver des eaux du lac Nasser', ['Abou Simbel', 'Deir el-Bahari', 'Louxor', 'Edfou']],
    ['grece-zeus', 'liens', 'Quel Titan dévore les frères et sœurs de Zeus avant d’être contraint de les rendre', ['Cronos', 'Japet', 'Hypérion', 'Océan']],
    ['grece-zeus', 'reperes', 'Sur quelle île Zeus est-il caché enfant pour échapper à son père', ['Crète', 'Délos', 'Rhodes', 'Naxos']],
    ['grece-hera', 'recits', 'Quel oiseau Héra orne-t-elle des cent yeux d’Argos', ['Le paon', 'L’aigle', 'Le cygne', 'Le corbeau']],
    ['grece-poseidon', 'liens', 'Pour venger quel Cyclope Poséidon poursuit-il Ulysse', ['Polyphème', 'Brontès', 'Stéropès', 'Argès']],
    ['grece-hades', 'recits', 'Quel fruit oblige Perséphone à passer une partie de l’année aux Enfers', ['grenade', 'figue', 'pomme', 'datte']],
    ['grece-athena', 'reperes', 'Quel temple de l’Acropole est dédié à Athéna', ['Le Parthénon', 'Le Panthéon', 'Le temple d’Apollon', 'L’Héraion de Samos']],
    ['grece-apollon', 'liens', 'Qui offre à Apollon la lyre dont il joue', ['Hermès', 'Héphaïstos', 'Dionysos', 'Arès']],
    ['grece-artemis', 'recits', 'En quel animal Artémis change-t-elle Actéon après qu’il l’a surprise au bain', ['cerf', 'sanglier', 'loup', 'ours']],
    ['egypte-ra', 'liens', 'Quelle déesse Râ envoie-t-il pour punir les hommes révoltés', ['Sekhmet', 'Bastet', 'Isis', 'Maât']],
    ['egypte-anubis', 'recits', 'Contre quoi Anubis pèse-t-il le cœur du défunt', ['la plume de Maât', 'le sceptre d’Osiris', 'l’œil d’Horus', 'le disque de Râ']],
    ['egypte-bastet', 'reperes', 'Dans quelle cité du delta du Nil se dressait le grand temple de Bastet', ['Bubastis', 'Abydos', 'Edfou', 'Karnak']],
    ['egypte-osiris', 'liens', 'Qui assassine et démembre Osiris selon le récit de sa fiche', ['Seth', 'Horus', 'Thot', 'Sobek']],
    ['egypte-isis', 'recits', 'Quel signe Isis porte-t-elle sur la tête comme hiéroglyphe de son nom', ['un trône', 'un sistre', 'une plume', 'un scarabée']],
    ['egypte-horus', 'reperes', 'Quel grand temple égyptien est dédié à Horus', ['Edfou', 'Philae', 'Dendérah', 'Abou Simbel']],
    ['egypte-thot', 'liens', 'À quel dieu les Grecs identifient-ils Thot', ['Hermès', 'Apollon', 'Héphaïstos', 'Dionysos']],
    ['egypte-sekhmet', 'recits', 'Avec quelle boisson colorée en rouge apaise-t-on Sekhmet', ['la bière', 'le vin', 'le lait', 'le jus de grenade']],
    ['nordique-odin', 'recits', 'Quel est le nom de la lance d’Odin', ['Gungnir', 'Mjöllnir', 'Gram', 'Dáinsleif']],
    ['nordique-thor', 'recits', 'Quels animaux tirent le char de Thor', ['deux boucs', 'deux loups', 'deux chevaux', 'deux sangliers']],
    ['nordique-loki', 'liens', 'Sous quelle forme Loki donne-t-il naissance à Sleipnir', ['jument', 'louve', 'serpente', 'biche']],
    ['nordique-freyja', 'recits', 'Quel est le nom du collier de Freyja forgé par quatre nains', ['Brísingamen', 'Draupnir', 'Gjallarhorn', 'Skidbladnir']],
    ['nordique-frigg', 'recits', 'Quelle plante Frigg oublie-t-elle de faire jurer de ne pas blesser Baldr', ['le gui', 'le houx', 'l’if', 'le frêne']],
    ['nordique-baldr', 'liens', 'Quel dieu aveugle lance la branche qui tue Baldr', ['Höd', 'Týr', 'Heimdall', 'Bragi']],
    ['nordique-freyr', 'recits', 'Quelle arme Freyr abandonne-t-il pour épouser Gerd', ['son épée', 'sa lance', 'son marteau', 'son arc']],
    ['planetes-mercure', 'reperes', 'Combien de jours terrestres Mercure met-elle environ à faire le tour du Soleil', ['88', '116', '225', '365']],
    ['planetes-venus', 'recits', 'Sur Vénus, quelle durée dépasse celle de l’année', ['un tour sur elle-même', 'la révolution de sa lune', 'un cycle de ses anneaux', 'le passage d’une tempête']],
    ['planetes-terre', 'reperes', 'Quel pourcentage approximatif de la surface terrestre est recouvert d’eau liquide', ['71', '51', '61', '81']],
    ['planetes-mars', 'recits', 'Quel volcan martien dépasse de loin l’Everest en hauteur', ['Olympus Mons', 'Ascraeus Mons', 'Arsia Mons', 'Elysium Mons']],
    ['planetes-jupiter', 'liens', 'Qui découvre les quatre grandes lunes de Jupiter en 1610', ['Galilée', 'Kepler', 'Huygens', 'Cassini']],
    ['planetes-saturne', 'recits', 'Quelle sonde termine sa mission en plongeant dans Saturne en 2017', ['Cassini', 'Galileo', 'Juno', 'Voyager 2']],
    ['planetes-uranus', 'liens', 'Qui découvre Uranus au télescope en 1781', ['William Herschel', 'Urbain Le Verrier', 'Johann Galle', 'Giovanni Cassini']],
    ['planetes-neptune', 'liens', 'Quel astronome prédit la position de Neptune par le calcul', ['Urbain Le Verrier', 'William Herschel', 'Tycho Brahe', 'Edmond Halley']],
    ['verne-nemo', 'recits', 'Que signifie le nom Nemo en latin', ['personne', 'liberté', 'profondeur', 'vengeance']],
    ['verne-fogg', 'recits', 'Dans quelle direction le voyage de Fogg lui fait-il gagner une journée', ['vers l’est', 'vers l’ouest', 'vers le nord', 'vers le sud']],
    ['verne-passepartout', 'reperes', 'À l’heure de quelle ville la montre de Passepartout reste-t-elle réglée', ['Londres', 'Paris', 'Bombay', 'Yokohama']],
    ['verne-strogoff', 'reperes', 'Dans quelle ville Michel Strogoff doit-il porter son message', ['Irkoutsk', 'Omsk', 'Kazan', 'Tobolsk']],
    ['verne-lidenbrock', 'recits', 'Par quel volcan les voyageurs de Lidenbrock remontent-ils à la surface', ['Stromboli', 'Vésuve', 'Etna', 'Hekla']],
    ['verne-barbicane', 'reperes', 'Dans quel État américain Barbicane installe-t-il son canon lunaire', ['Floride', 'Texas', 'Virginie', 'Californie']],
    ['verne-robur', 'recits', 'Quel nom porte l’appareil à hélices de Robur', ['l’Albatros', 'le Nautilus', 'le Victoria', 'le Go Ahead']],
    ['verne-cyrus', 'liens', 'Quel protecteur caché aide Cyrus Smith et ses compagnons', ['Le Capitaine Nemo', 'Robur', 'Impey Barbicane', 'Michel Strogoff']],
    ['contes-cendrillon', 'recits', 'Chez les frères Grimm, de quelle matière est la pantoufle de Cendrillon', ['or', 'verre', 'argent', 'cristal']],
    ['contes-chatbotte', 'recits', 'Quel titre le Chat botté invente-t-il pour son maître', ['marquis de Carabas', 'duc de Nemours', 'comte de Montferrat', 'prince de Bellegarde']],
    ['contes-poucet', 'recits', 'Quel objet Poucet vole-t-il à l’ogre après avoir sauvé ses frères', ['ses bottes de sept lieues', 'sa clé d’or', 'son anneau d’invisibilité', 'son bonnet enchanté']],
    ['contes-barbebleue', 'liens', 'Comment s’appelle la sœur que l’épouse de Barbe bleue appelle au secours', ['Anne', 'Aurore', 'Élise', 'Margot']],
    ['contes-hansel', 'recits', 'Que tend Hansel à la sorcière pour lui faire croire qu’il est encore maigre', ['un petit os', 'une brindille', 'une cuillère', 'une patte de poulet']],
    ['savants-pasteur', 'liens', 'Quel enfant Pasteur traite-t-il contre la rage en 1885', ['Joseph Meister', 'Jean-Baptiste Jupille', 'Émile Roux', 'Albert Calmette']],
    ['savants-lavoisier', 'recits', 'Quel élément Lavoisier identifie-t-il comme essentiel à la combustion', ['oxygène', 'hydrogène', 'azote', 'hélium']],
    ['savants-pascal', 'liens', 'Avec quel mathématicien Pascal pose-t-il les bases du calcul des probabilités', ['Fermat', 'Descartes', 'Leibniz', 'Huygens']],
    ['savants-champollion', 'reperes', 'Quel document permet à Champollion de percer le secret des hiéroglyphes', ['la pierre de Rosette', 'la palette de Narmer', 'le papyrus de Turin', 'la stèle de Mérenptah']],
    ['savants-lumiere', 'reperes', 'En quelle année les frères Lumière organisent-ils leur première séance de cinéma payante', ['1895', '1889', '1902', '1910']],
    ['savants-eiffel', 'recits', 'Quelle autre œuvre célèbre possède une structure intérieure conçue par Eiffel', ['la statue de la Liberté', 'le pont de Brooklyn', 'le Crystal Palace', 'le pont du Forth']],
    ['savants-germain', 'liens', 'Quel nom Sophie Germain utilise-t-elle pour envoyer ses devoirs', ['Monsieur Le Blanc', 'Monsieur Dupont', 'Monsieur Lebrun', 'Monsieur Laurent']],
    ['savants-curie', 'recits', 'Quel nom donne-t-on aux voitures de radiologie que Marie Curie équipe pendant la guerre', ['petites Curies', 'ambulances Pasteur', 'rayons mobiles', 'unités Becquerel']]
  ];

  function build() {
    var out = [];
    function add(ch, theme, text, choices, source, curated, clue) {
      if (choices.length !== 4 || new Set(choices).size !== 4) return;
      out.push({ id: ch.id + ':' + theme + ':' + out.length, charId: ch.id, theme: theme, text: text, clue: clue || '',
        options: choices, answer: choices[0], explanation: source, curated: !!curated });
    }
    authored.forEach(function (row) {
      var ch = A.CHAR[row[0]]; if (!ch) return;
      var source = [ch.story, ch.more].map(function (s) { return plain(ch, s); }).find(function (s) { return norm(s).indexOf(norm(row[3][0])) !== -1; });
      if (source) add(ch, row[1], row[2] + NB + '?', row[3], source, true);
    });
    var quotes = [];
    A.CHARS.forEach(function (ch) {
      [ch.story, ch.more].forEach(function (raw) {
        plain(ch, raw).replace(/«\s*([^»]{2,50}?)\s*»/g, function (_, value) {
          if (/[!?]/.test(value) || norm(value) === norm(ch.title) || norm(value) === norm(ch.name)) return _;
          quotes.push({ ch: ch, value: value }); return _;
        });
      });
    });
    A.CHARS.forEach(function (ch) {
      [ch.story, ch.more].forEach(function (raw) {
        if (!raw) return;
        var source = plain(ch, raw);
        raw.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, ref, alias) {
          var target = link(ch, ref); if (!target || target.id === ch.id) return _;
          var related = A.CHARS.filter(function (x) { return x.id !== target.id && A.COLL[x.coll].group === A.COLL[target.coll].group; });
          var choices = [target.name];
          shuffle(related.concat(shuffle(A.CHARS))).some(function (x) { if (choices.indexOf(x.name) < 0) choices.push(x.name); return choices.length === 4; });
          var clue = mask(mask(source, alias || target.name), target.name);
          add(ch, 'liens', 'Quel nom complète ce passage sur ' + ch.name + NB + '?', choices, source, false, clue);
          return _;
        });
        if (!/aujourd’hui|actuellement|connues|on connaît/i.test(source)) {
          var numbers = source.match(/\b\d{1,4}(?:[,.]\d+)?(?:[ \u00a0]\d{3})*\b/g) || [];
          Array.from(new Set(numbers)).slice(0, 3).forEach(function (answer) {
            var n = Number(answer.replace(/[ \u00a0]/g, '').replace(',', '.')); if (!n || !isFinite(n)) return;
            var precision = answer.indexOf(',') < 0 ? 0 : answer.split(',')[1].length;
            var step = precision ? Math.pow(10, -precision) * 2 : n < 20 ? 1 : n < 100 ? 5 : n < 1000 ? 20 : 10;
            var choices = [answer];
            [-2, 1, 3, 5, 7].some(function (offset) {
              var v = n + step * offset;
              if (v > 0) { var label = v.toFixed(precision).replace('.', ','); if (choices.indexOf(label) < 0 && Number(label.replace(',', '.')) !== n) choices.push(label); }
              return choices.length === 4;
            });
            var escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var clue = source.replace(new RegExp('(^|[^0-9])' + escaped + '(?![0-9])', 'g'), '$1[…]');
            add(ch, 'reperes', 'Quelle valeur complète ce fait concernant ' + ch.name + NB + '?', choices, source, false, clue);
          });
        }
        quotes.filter(function (item) { return item.ch.id === ch.id && source.indexOf(item.value) !== -1; }).forEach(function (item) {
          var others = shuffle(quotes.filter(function (x) { return A.COLL[x.ch.coll].group === A.COLL[ch.coll].group && x.value !== item.value; }));
          var choices = [item.value];
          others.concat(shuffle(quotes)).some(function (x) { if (choices.indexOf(x.value) < 0) choices.push(x.value); return choices.length === 4; });
          add(ch, 'recits', 'Quel détail complète cette anecdote sur ' + ch.name + NB + '?', choices, source, false, mask(source, item.value));
        });
      });
    });
    return out;
  }
  Q.bank = function () { if (!bank) bank = build(); return bank; };
  Q.question = function (theme, eds, used) {
    used.questions = used.questions || {}; used.characters = used.characters || {};
    var cards = eds.map(function (id) { var ed = A.ED[id]; return ed && A.CHAR[ed.charId]; }).filter(Boolean);
    var colls = cards.map(function (ch) { return ch.coll; });
    var groups = cards.map(function (ch) { return A.COLL[ch.coll].group; });
    var universes = cards.map(function (ch) { return A.COLL[ch.coll].universe; });
    var available = Q.bank().filter(function (q) { return q.theme === theme && !used.questions[q.id] && !used.characters[q.charId]; });
    var rank = function (q) { var c = A.COLL[A.CHAR[q.charId].coll]; return colls.indexOf(c.id) !== -1 ? 0 : groups.indexOf(c.group) !== -1 ? 1 : universes.indexOf(c.universe) !== -1 ? 2 : 3; };
    if (!available.length) return null;
    var min = Math.min.apply(null, available.map(rank));
    available = available.filter(function (q) { return rank(q) === min; });
    var ids = Array.from(new Set(available.map(function (q) { return q.charId; }))), charId = pick(ids);
    var questions = available.filter(function (q) { return q.charId === charId; });
    var fresh = questions.filter(function (q) { return recent.indexOf(q.id) === -1; });
    if (fresh.length) questions = fresh;
    var curated = questions.filter(function (q) { return q.curated; });
    var chosen = pick(curated.length ? curated : questions);
    used.questions[chosen.id] = true; used.characters[chosen.charId] = true;
    recent.push(chosen.id); if (recent.length > 60) recent.shift();
    return Object.assign({}, chosen, { options: shuffle(chosen.options) });
  };

  /* ---- Joute du savoir (Quiz des légendes) : questions éclair autour des deux cartes qui s’affrontent ----
     kind : indices (« Qui suis-je ? » : les indices tombent un par un), portrait (vraie illustration floutée qui se dévoile,
     rare), titre (« Qui est … ? »), univers, savoir (questions des fiches).
     time : secondes pour répondre ; ai : chance que l’IA trouve. */
  Q.KINDS = {
    indices: { label: 'Qui suis-je' + NB + '?', time: 12, ai: .68 },
    portrait: { label: 'Portrait', time: 10, ai: .7 },
    titre: { label: 'Titre', time: 9, ai: .72 },
    univers: { label: 'Univers', time: 8, ai: .75 },
    savoir: { label: 'Savoir', time: 13, ai: .62 }
  };
  function hasArt(c) { return A.EDITIONS.some(function (e) { return e.charId === c.id && e.media; }); }
  function nearChars(eds, used, art) {
    var cards = eds.map(function (id) { var ed = A.ED[id]; return ed && A.CHAR[ed.charId]; }).filter(Boolean);
    var colls = cards.map(function (c) { return c.coll; }), groups = cards.map(function (c) { return A.COLL[c.coll].group; });
    var free = A.CHARS.filter(function (c) { return !used.characters[c.id] && c.title && (art ? hasArt(c) : A.EDITIONS.some(function (e) { return e.charId === c.id; })); });
    var tiers = [free.filter(function (c) { return colls.indexOf(c.coll) !== -1; }), free.filter(function (c) { return groups.indexOf(A.COLL[c.coll].group) !== -1; }), free];
    for (var i = 0; i < tiers.length; i++) if (tiers[i].length) return tiers[i];
    return [];
  }
  /** Trois leurres + la bonne réponse, pris d’abord au plus près (même collection, même famille), sans doublon. */
  function decoys(answer, pools, label) {
    var out = [answer];
    pools.forEach(function (pool) { shuffle(pool).forEach(function (x) { var v = label(x); if (out.length < 4 && v && out.indexOf(v) === -1) out.push(v); }); });
    return out.length === 4 ? out : null;
  }
  function namesNear(ch) {
    var group = A.COLL[ch.coll].group;
    return decoys(ch.name, [A.CHARS.filter(function (c) { return c.coll === ch.coll; }), A.CHARS.filter(function (c) { return A.COLL[c.coll].group === group; }), A.CHARS], function (c) { return c.name; });
  }
  function flash(kind, ch) {
    var co = A.COLL[ch.coll], q = { kind: kind, charId: ch.id, coll: ch.coll }, opts;
    if (kind === 'indices') {
      // Indices du plus difficile au plus facile : deux phrases de la fiche (nom masqué), puis le titre
      var words = ch.name.split(/[\s’'-]+/).filter(function (w) { return w.length > 3; });
      var hide = function (t) { [ch.name].concat(words).forEach(function (w) { t = t.split(w).join('…'); }); return t; };
      var sent = plain(ch, (ch.story || '') + ' ' + (ch.more || '')).split(/(?:\.|!|\?)\s+/).map(function (x) { return x.trim(); })
        .filter(function (x) { return x.length > 30 && x.length < 170; });
      if (sent.length < 1) return null;
      opts = namesNear(ch); if (!opts) return null;
      q.clues = sent.slice(0, 2).reverse().map(function (x) { return hide(x.replace(/[.;:,]+$/, '')) + '.'; }).concat(['Son titre' + NB + ': «' + NB + hide(ch.title) + NB + '»']);
      q.text = 'Qui suis-je' + NB + '?';
    } else if (kind === 'portrait') {
      // seulement les vraies illustrations (l’art généré montre un paysage, pas le personnage)
      var eds = A.EDITIONS.filter(function (e) { return e.charId === ch.id && e.media; });
      opts = namesNear(ch); if (!opts || !eds.length) return null;
      q.art = pick(eds).id; q.text = 'Qui se cache derrière cette illustration' + NB + '?';
    } else if (kind === 'titre') {
      opts = namesNear(ch); if (!opts) return null;
      q.text = 'Qui est «' + NB + ch.title + NB + '»' + NB + '?';
    } else {
      var others = Object.keys(A.COLL).map(function (k) { return A.COLL[k]; }).filter(function (c) { return c.id !== co.id; });
      opts = decoys(co.name, [others.filter(function (c) { return c.universe === co.universe; }), others.filter(function (c) { return c.group === co.group; }), others], function (c) { return c.name; });
      if (!opts) return null;
      q.text = 'De quel univers vient ' + ch.name + NB + '?';
    }
    q.answer = opts[0]; q.options = shuffle(opts);
    q.explanation = ch.name + ', ' + (ch.title ? ch.title.charAt(0).toLowerCase() + ch.title.slice(1) : '') + ' · ' + co.name + '. ' + (plain(ch, ch.story || '').split(/\.\s/)[0] + '.').replace(/^\.$/, '');
    return q;
  }
  /** Prochaine question de la joute : eds = cartes en jeu (les deux combattants d’abord), used = mémoire de la partie. */
  Q.next = function (eds, used) {
    used.characters = used.characters || {}; used.questions = used.questions || {}; used.kinds = used.kinds || [];
    var last = used.kinds.slice(-2), weights = { indices: 3.5, portrait: 2, titre: 2, univers: 1.5, savoir: 3 };
    // jamais trois fois le même format d’affilée
    if (last.length === 2 && last[0] === last[1]) weights[last[0]] = 0;
    var order = [];
    for (var tries = 0; tries < 8; tries++) {
      var tot = 0, k; for (k in weights) tot += weights[k];
      var r = Math.random() * tot; for (k in weights) { r -= weights[k]; if (r <= 0) break; }
      if (order.indexOf(k) === -1) order.push(k);
    }
    Object.keys(weights).forEach(function (k) { if (order.indexOf(k) === -1 && weights[k]) order.push(k); });
    for (var i = 0; i < order.length; i++) {
      var kind = order[i], q = null;
      if (kind === 'savoir') {
        q = Q.question(pick(Q.themes).id, eds, used);
        if (q) q = Object.assign(q, { kind: 'savoir', coll: A.CHAR[q.charId].coll, time: q.clue ? 18 : 13, ai: (Q.themes.filter(function (t) { return t.id === q.theme; })[0] || {}).accuracy || .62 });
      } else {
        var pool = nearChars(eds, used, kind === 'portrait');
        if (pool.length) q = flash(kind, pick(pool));
        if (q) { used.characters[q.charId] = true; q.time = Q.KINDS[kind].time; q.ai = Q.KINDS[kind].ai; }
      }
      if (q) { used.kinds.push(kind); q.label = Q.KINDS[kind].label; return q; }
    }
    return null;
  };
})(window.ATLAS);
