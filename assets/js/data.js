/* ==========================================================================
   ATLAS — Données de démonstration
   --------------------------------------------------------------------------
   Toutes les données ci-dessous sont FICTIVES et servent uniquement au
   prototype visuel. En phase 2, elles proviendront de la base PostgreSQL
   (tables : collections, characters, editions, packs…).
   ========================================================================== */
window.ATLAS = window.ATLAS || {};
(function (A) {
  'use strict';

  /* ---------- Raretés ---------- */
  A.RARITIES = [
    { id: 'base',      label: 'Base',       supply: null, identity: 'Ivoire',                 desc: 'Tirage illimité. La porte d’entrée de chaque collection.' },
    { id: 'rare',      label: 'Rare',       supply: 250,  identity: 'Argent · bleu ardoise',   desc: '250 exemplaires numérotés par édition.' },
    { id: 'epic',      label: 'Épique',     supply: 100,  identity: 'Violet',                 desc: '100 exemplaires numérotés par édition.' },
    { id: 'legendary', label: 'Légendaire', supply: 50,   identity: 'Or satiné',              desc: '50 exemplaires numérotés par édition.' },
    { id: 'mythic',    label: 'Mythique',   supply: 25,   identity: 'Rouge grenat',           desc: '25 exemplaires numérotés par édition.' },
    { id: 'unique',    label: 'Unique',     supply: 1,    identity: 'Noir et or',             desc: 'Une seule pièce au monde.' }
  ];
  A.R = {};
  A.RARITIES.forEach(function (r, i) { r.rank = i; A.R[r.id] = r; });
  var LETTER = { B: 'base', R: 'rare', E: 'epic', L: 'legendary', M: 'mythic', U: 'unique' };

  /* ---------- Collections ---------- */
  A.COLLECTIONS = [
    {
      id: 'grece', name: 'Olympe', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'temple',
      edition: 'Édition I', status: 'live', popular: 1,
      tagline: 'Les dieux, les héros et les monstres de la Grèce antique.',
      description: 'Du sommet de l’Olympe aux rives du Styx, une galerie consacrée aux divinités et aux figures héroïques qui ont façonné l’imaginaire occidental.'
    },
    {
      id: 'titans', name: 'Les Titans', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'peak',
      edition: 'Édition I', status: 'live', popular: 6,
      tagline: 'La génération d’avant les dieux, maîtresse du monde jusqu’à sa chute.',
      description: 'Enfants du Ciel et de la Terre, ils régnèrent avant l’Olympe. Leur guerre de dix ans contre Zeus décida du sort du monde.'
    },
    {
      id: 'geants', name: 'Les Géants', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'volcano',
      edition: 'Édition I', status: 'live', popular: 7,
      tagline: 'Géants, Cyclopes et Hécatonchires, colosses nés de la Terre.',
      description: 'Lancés par Gaïa contre l’Olympe ou alliés de Zeus, ces colosses ont laissé leur nom aux volcans, aux îles et aux lunes de Saturne.'
    },
    {
      id: 'egypte', name: 'Rives du Nil', family: 'Mythologie égyptienne', universe: 'Mythologies', motif: 'pyramids',
      edition: 'Édition I', status: 'live', popular: 2,
      tagline: 'Les divinités solaires et funéraires de l’Égypte ancienne.',
      description: 'Entre le désert et le fleuve, les dieux de l’Égypte veillent sur le soleil, les vivants et le long voyage des âmes.'
    },
    {
      id: 'gothique', name: 'Nuits gothiques', family: 'Monstres gothiques', universe: 'Littérature', motif: 'castle',
      edition: 'Édition I', status: 'live', popular: 3,
      tagline: 'Les créatures nées de la littérature fantastique du XIXᵉ siècle.',
      description: 'Châteaux battus par les vents, laboratoires clandestins et salons d’opéra : les grandes figures du roman gothique.'
    },
    {
      id: 'contes', name: 'Il était une fois', family: 'Contes classiques', universe: 'Littérature', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 4,
      tagline: 'Les héroïnes et les héros des contes de Perrault, Grimm, Carroll et Barrie.',
      description: 'Forêts profondes, tours oubliées et pays des merveilles : les personnages qui ont bercé des générations de lecteurs.'
    },
    {
      id: 'histoire', name: 'Figures de France', family: 'Histoire', universe: 'Histoire', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 5,
      tagline: 'Souverains, savants et résistants qui ont marqué l’histoire de France.',
      description: 'De la Gaule à la Ve République, un panthéon de personnalités dont l’empreinte traverse les siècles.'
    },
    {
      id: 'nordique', name: 'Saga du Nord', family: 'Mythologie nordique', universe: 'Mythologies', motif: 'fjord',
      edition: 'Édition I', status: 'event', popular: 0,
      tagline: 'Les dieux d’Asgard et les créatures du Ragnarök.',
      description: 'Nouvelle collection. Entre fjords et neiges éternelles, les dieux nordiques et les êtres qui annoncent la fin des temps.'
    }
  ];

  /* ---------- Collections globales ----------
     Une collection globale réunit plusieurs sous-collections d’un même univers.
     Sa progression additionne celle de ses sous-collections et elle a ses propres récompenses. */
  A.GROUPS = [
    {
      id: 'grecque', name: 'Mythologie grecque', subs: ['grece', 'titans', 'geants'], title: 'Gardien du Panthéon grec',
      tagline: 'Dieux, Titans et Géants : trois générations qui se sont disputé le monde.',
      description: 'Des Titans qui régnaient avant l’Olympe aux Géants lancés contre lui, en passant par les dieux qui l’ont emporté : toute la mythologie grecque, en trois sous-collections.'
    }
  ];
  A.GROUP = {};
  A.GROUPS.forEach(function (g) { A.GROUP[g.id] = g; });

  A.UPCOMING = [
    { id: 'japon',  name: 'Kami & Yōkai',       family: 'Mythologie japonaise',  motif: 'torii',  date: 'Printemps 2027', desc: 'Esprits, divinités et créatures du folklore japonais.' },
    { id: 'arthur', name: 'La Table ronde',     family: 'Légendes arthuriennes', motif: 'castle', date: 'Été 2027',       desc: 'Chevaliers, enchanteurs et la quête du Graal.' },
    { id: 'explo',  name: 'Grands Explorateurs', family: 'Histoire',             motif: 'fjord',  date: 'Automne 2027',   desc: 'Navigateurs et voyageurs qui ont redessiné la carte du monde.' }
  ];

  /* ---------- Personnages ----------
     [slug, nom, titre, attaque, défense, esprit, éditions disponibles, notice]
     Les statistiques sont identiques quelle que soit l’édition. */
  var RAW = {
    grece: [
      ['zeus', 'Zeus', 'Roi de l’Olympe', 92, 78, 85, 'BRELMU', 'Maître du ciel et de la foudre, il gouverne les dieux depuis les hauteurs de l’Olympe.'],
      ['hera', 'Héra', 'Reine des dieux', 70, 82, 88, 'BREL', 'Protectrice du mariage, aussi majestueuse que redoutable dans ses colères.'],
      ['poseidon', 'Poséidon', 'Seigneur des mers', 90, 80, 72, 'BRELM', 'Son trident soulève les tempêtes et fait trembler la terre.'],
      ['hades', 'Hadès', 'Maître des Enfers', 84, 90, 86, 'BRELMU', 'Souverain du monde souterrain, gardien silencieux des âmes.'],
      ['athena', 'Athéna', 'Déesse de la sagesse', 80, 88, 97, 'BRELM', 'Stratège née tout armée du front de Zeus, protectrice d’Athènes.'],
      ['apollon', 'Apollon', 'Dieu de la lumière', 82, 70, 88, 'BRE', 'Dieu des arts, de la musique et des oracles de Delphes.'],
      ['artemis', 'Artémis', 'La Chasseresse', 86, 72, 80, 'BREL', 'Sœur jumelle d’Apollon, reine des forêts et de la lune.'],
      ['meduse', 'Méduse', 'La Gorgone', 81, 77, 69, 'BREL', 'Son regard change en pierre quiconque ose la contempler.'],
      ['heracles', 'Héraclès', 'Le Héros aux douze travaux', 95, 84, 62, 'BRE', 'Le plus célèbre des héros grecs, d’une force sans égale.']
    ],
    titans: [
      ['cronos', 'Cronos', 'Le Titan dévoreur', 90, 82, 84, 'BRELMU', 'Le plus jeune des Titans, il détrôna son père Ouranos avant d’être renversé par son fils.'],
      ['rhea', 'Rhéa', 'Mère des dieux', 66, 84, 90, 'BREL', 'Épouse de Cronos, elle sauva son dernier-né en trompant le Titan.'],
      ['oceanos', 'Océan', 'Le Fleuve du monde', 72, 88, 82, 'BRE', 'Titan aîné, fleuve immense qui encercle la terre.'],
      ['hyperion', 'Hypérion', 'Le Titan de la lumière', 84, 76, 86, 'BRE', 'Celui qui va au-dessus : père du Soleil, de la Lune et de l’Aurore.'],
      ['themis', 'Thémis', 'La Justice divine', 62, 86, 96, 'BREL', 'Gardienne de l’ordre et des lois, conseillère de Zeus.'],
      ['mnemosyne', 'Mnémosyne', 'La Mémoire', 54, 74, 99, 'BRE', 'Titanide de la mémoire, mère des neuf Muses.'],
      ['japet', 'Japet', 'Le Père des audacieux', 86, 80, 78, 'BRE', 'Titan père d’Atlas et de Prométhée.'],
      ['atlas', 'Atlas', 'Le Porteur du ciel', 94, 92, 64, 'BRELM', 'Condamné à soutenir la voûte céleste aux confins du monde.'],
      ['promethee', 'Prométhée', 'Le Voleur de feu', 74, 80, 98, 'BRELM', 'Titan ami des hommes, il leur offrit le feu volé à l’Olympe.']
    ],
    geants: [
      ['alcyonee', 'Alcyonée', 'L’Immortel de Pallène', 92, 88, 56, 'BRELMU', 'Chef des Géants, invincible tant qu’il restait sur sa terre natale.'],
      ['porphyrion', 'Porphyrion', 'Le Roi des Géants', 95, 84, 62, 'BREL', 'Roi des Géants, il osa s’attaquer à Héra.'],
      ['encelade', 'Encelade', 'L’Enseveli de Sicile', 90, 86, 60, 'BREL', 'Écrasé sous la Sicile par Athéna.'],
      ['ephialtes', 'Éphialtès', 'L’Ennemi d’Apollon', 88, 80, 64, 'BRE', 'Géant aveuglé par les flèches des dieux.'],
      ['mimas', 'Mimas', 'Le Géant du volcan', 86, 82, 60, 'BRE', 'Accablé sous le métal en fusion d’Héphaïstos.'],
      ['polypheme', 'Polyphème', 'Le Cyclope', 93, 78, 50, 'BRELM', 'Cyclope fils de Poséidon, aveuglé par Ulysse.'],
      ['briaree', 'Briarée', 'L’Hécatonchire', 97, 90, 58, 'BRE', 'Géant aux cent bras et aux cinquante têtes, allié de Zeus.'],
      ['antee', 'Antée', 'Le Lutteur invincible', 94, 92, 52, 'BRE', 'Fils de la Terre, invincible tant qu’il la touchait.']
    ],
    egypte: [
      ['ra', 'Râ', 'Dieu du soleil', 90, 76, 88, 'BRELMU', 'Chaque jour, il traverse le ciel sur sa barque solaire.'],
      ['anubis', 'Anubis', 'Gardien des morts', 78, 86, 90, 'BRELMU', 'Le dieu à tête de chacal pèse le cœur des défunts.'],
      ['bastet', 'Bastet', 'Déesse protectrice', 74, 80, 84, 'BREL', 'Douce gardienne du foyer, féroce lorsqu’on la menace.'],
      ['osiris', 'Osiris', 'Seigneur de l’au-delà', 76, 84, 89, 'BREL', 'Roi assassiné puis ressuscité, il règne sur le royaume des morts.'],
      ['isis', 'Isis', 'La Grande Magicienne', 72, 78, 95, 'BRELM', 'Ses formules ramenèrent Osiris à la vie.'],
      ['horus', 'Horus', 'Le Dieu faucon', 88, 80, 82, 'BREL', 'Fils d’Isis et d’Osiris, protecteur des pharaons.'],
      ['thot', 'Thot', 'Scribe des dieux', 60, 74, 98, 'BRE', 'Inventeur de l’écriture, maître du savoir et du temps.'],
      ['sekhmet', 'Sekhmet', 'La Puissante', 93, 74, 70, 'BRE', 'Déesse lionne, souffle brûlant du désert.']
    ],
    gothique: [
      ['dracula', 'Dracula', 'Le Comte des Carpates', 86, 80, 90, 'BRELMU', 'Aristocrate immortel surgi des brumes de Transylvanie.'],
      ['creature', 'La Créature', 'Née de Frankenstein', 92, 88, 64, 'BRELM', 'Assemblée et animée par Victor Frankenstein, elle cherche sa place parmi les hommes.'],
      ['carmilla', 'Carmilla', 'La Dame de Styrie', 78, 72, 86, 'BREL', 'Mystérieuse invitée d’un château isolé, bien avant Dracula.'],
      ['jekyll', 'Dr Jekyll', 'Le Savant', 58, 66, 92, 'BRE', 'Médecin respecté, il cherche à séparer le bien du mal en lui.'],
      ['hyde', 'Mr Hyde', 'L’Autre visage', 90, 70, 60, 'BRE', 'L’ombre libérée de Jekyll, arpentant les ruelles de Londres.'],
      ['fantome', 'Le Fantôme', 'Hôte de l’Opéra', 74, 76, 88, 'BREL', 'Génie masqué hantant les dessous du Palais Garnier.'],
      ['dorian', 'Dorian Gray', 'Le Portrait éternel', 66, 90, 82, 'BREL', 'Sa jeunesse ne s’altère jamais ; son portrait, si.'],
      ['loupgarou', 'Le Loup-garou', 'Bête de pleine lune', 91, 79, 58, 'BRE', 'Homme le jour, créature des bois la nuit.']
    ],
    contes: [
      ['cendrillon', 'Cendrillon', 'La Pantoufle de verre', 58, 72, 86, 'BRELMU', 'Avant minuit, la fille des cendres devient la reine du bal.'],
      ['alice', 'Alice', 'Au pays des merveilles', 60, 70, 94, 'BRELMU', 'Curieuse et logique, elle suit un lapin blanc au fond d’un terrier.'],
      ['peterpan', 'Peter Pan', 'L’Enfant qui ne grandit pas', 76, 68, 84, 'BRELM', 'Chef des Garçons perdus, il vole jusqu’au Pays imaginaire.'],
      ['chaperon', 'Le Petit Chaperon rouge', 'Promeneuse des bois', 54, 64, 80, 'BREL', 'Une galette, un petit pot de beurre et une rencontre inattendue.'],
      ['chatbotte', 'Le Chat botté', 'Le Rusé', 70, 66, 95, 'BREL', 'Par la seule force de son esprit, il fait la fortune de son maître.'],
      ['belle', 'La Belle au bois dormant', 'Endormie depuis cent ans', 50, 90, 78, 'BRE', 'Un fuseau, une malédiction, et un château gagné par les ronces.'],
      ['blancheneige', 'Blanche-Neige', 'Princesse de la forêt', 56, 74, 82, 'BREL', 'Réfugiée chez sept nains, elle échappe à la jalousie d’une reine.'],
      ['loup', 'Le Grand Méchant Loup', 'Ombre des sentiers', 85, 70, 72, 'BRE', 'Rôdeur des contes, il guette les imprudents.']
    ],
    histoire: [
      ['napoleon', 'Napoléon Bonaparte', 'Empereur des Français', 92, 76, 96, 'BRELMU', 'Général, Premier consul puis empereur, il redessine l’Europe.'],
      ['degaulle', 'Charles de Gaulle', 'L’Homme du 18 Juin', 80, 90, 94, 'BRELMU', 'Chef de la France libre puis fondateur de la Ve République.'],
      ['jeanne', 'Jeanne d’Arc', 'La Pucelle d’Orléans', 84, 82, 88, 'BRELM', 'Jeune paysanne lorraine devenue cheffe de guerre.'],
      ['louisxiv', 'Louis XIV', 'Le Roi-Soleil', 78, 84, 90, 'BREL', 'Soixante-douze ans de règne et la splendeur de Versailles.'],
      ['curie', 'Marie Curie', 'Pionnière de la radioactivité', 52, 70, 99, 'BREL', 'Double lauréate du prix Nobel, en physique puis en chimie.'],
      ['hugo', 'Victor Hugo', 'Le Poète de la République', 58, 72, 97, 'BRE', 'Romancier, poète et dramaturge, voix de l’exil et de la liberté.'],
      ['charlemagne', 'Charlemagne', 'Empereur d’Occident', 88, 86, 84, 'BREL', 'Couronné à Rome en l’an 800, il unifie une grande partie de l’Europe.'],
      ['vercingetorix', 'Vercingétorix', 'Chef des Arvernes', 89, 80, 78, 'BRE', 'Il fédère les peuples gaulois face aux légions de César.']
    ],
    nordique: [
      ['odin', 'Odin', 'Le Père de tout', 88, 82, 98, 'BRELMU', 'Il sacrifia un œil pour boire à la source de la sagesse.'],
      ['thor', 'Thor', 'Dieu du tonnerre', 97, 86, 66, 'BRELMU', 'Son marteau Mjöllnir protège Asgard et Midgard.'],
      ['loki', 'Loki', 'Le Dieu de la ruse', 76, 70, 97, 'BRELM', 'Métamorphe imprévisible, allié et ennemi des dieux.'],
      ['freyja', 'Freyja', 'Amour et guerre', 82, 76, 88, 'BREL', 'Elle accueille la moitié des guerriers tombés au combat.'],
      ['frigg', 'Frigg', 'Reine d’Asgard', 66, 84, 92, 'BRE', 'Épouse d’Odin, elle connaît le destin de chacun sans le dévoiler.'],
      ['fenrir', 'Fenrir', 'Le Loup colossal', 96, 84, 56, 'BREL', 'Enchaîné par les dieux, il attend le Ragnarök.'],
      ['heimdall', 'Heimdall', 'Gardien de Bifröst', 80, 92, 84, 'BRE', 'Il veille sur le pont arc-en-ciel et entend pousser l’herbe.'],
      ['tyr', 'Týr', 'Dieu du serment', 88, 85, 76, 'BRE', 'Il offrit sa main pour enchaîner Fenrir.']
    ]
  };

  /* ---------- Construction du catalogue ---------- */
  function hash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    // finaliseur murmur3 : répartit mieux les graines proches
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
    return h >>> 0;
  }
  A.hash = hash;

  A.COLL = {};
  A.COLLECTIONS.forEach(function (c) { A.COLL[c.id] = c; c.chars = []; });

  A.CHARS = []; A.CHAR = {};
  A.EDITIONS = []; A.ED = {};

  Object.keys(RAW).forEach(function (cid) {
    RAW[cid].forEach(function (row) {
      var ch = {
        id: cid + '-' + row[0], slug: row[0], coll: cid,
        name: row[1], title: row[2], atk: row[3], def: row[4], esp: row[5],
        bio: row[7], editions: row[6].split('').map(function (l) { return LETTER[l]; })
      };
      A.CHARS.push(ch); A.CHAR[ch.id] = ch; A.COLL[cid].chars.push(ch.id);

      ch.editions.forEach(function (rid) {
        var r = A.R[rid];
        var id = ch.id + '-' + rid;
        var h = hash(id);
        // Nombre d’exemplaires déjà émis au lancement de la démo (fictif)
        var minted;
        switch (rid) {
          case 'base': minted = 1800 + (h % 9000); break;
          case 'rare': minted = 30 + (h % 160); break;
          case 'epic': minted = 12 + (h % 60); break;
          case 'legendary': minted = 6 + (h % 30); break;
          case 'mythic': minted = 2 + (h % 14); break;
          case 'unique': minted = (h % 3 === 0) ? 1 : 0; break;
        }
        var ed = {
          id: id, charId: ch.id, rarity: rid, supply: r.supply, minted0: minted,
          image: null // ← emplacement remplaçable : URL de l’illustration définitive
        };
        A.EDITIONS.push(ed); A.ED[id] = ed;
      });
    });
  });
  /* ---------- Notices des personnages ----------
     [[slug]] = lien vers un autre personnage de la même collection (le nom s’affiche) ;
     [[slug|texte]] = même lien avec un texte libre. Rendu dans la fiche détaillée (ui.js → bioHTML). */
  var STORIES = {
    'grece-zeus': 'Maître du ciel et de la foudre, il règne sur l’Olympe aux côtés de son épouse [[hera]]. Après la victoire sur les Titans, il partagea le monde avec ses frères : les mers à [[poseidon]], les Enfers à [[hades]].',
    'grece-hera': 'Reine des dieux et protectrice du mariage, elle ne pardonne jamais les infidélités de [[zeus]]. Sa jalousie poursuivit [[heracles]], fils de son époux, depuis le berceau jusqu’à ses douze travaux.',
    'grece-poseidon': 'Frère de [[zeus]], il reçut les mers en partage : son trident soulève les tempêtes et fait trembler la terre. Il disputa à [[athena]] la protection d’Athènes, et perdit : la cité préféra son olivier.',
    'grece-hades': 'Frère aîné de [[zeus]] et de [[poseidon]], il règne sur le monde souterrain, gardien silencieux des âmes. Rares sont les vivants à en être revenus : [[heracles]] y descendit pour capturer Cerbère.',
    'grece-athena': 'Née tout armée du front de [[zeus]], elle est la déesse de la sagesse et de la stratégie. Elle guida [[heracles]] dans ses travaux et offrit à Persée le bouclier poli qui lui permit de vaincre [[meduse]].',
    'grece-apollon': 'Dieu de la lumière, des arts et des oracles, il parle aux hommes par la voix de la Pythie de Delphes. Fils de [[zeus]], il est le frère jumeau d’[[artemis]], née juste avant lui sur l’île de Délos.',
    'grece-artemis': 'Chasseresse des forêts et protectrice des jeunes filles, elle veille la nuit sous la lune. Jumelle d’[[apollon]], elle aurait aidé sa mère à le mettre au monde, à peine née elle-même.',
    'grece-meduse': 'Seule mortelle des trois Gorgones, elle change en pierre quiconque croise son regard. Sa malédiction lui vient d’[[athena]], offensée que [[poseidon]] l’ait séduite dans son temple.',
    'titans-cronos': 'Fils d’Ouranos et de Gaïa, il mutila son père d’un coup de faucille et devint roi du monde. Averti qu’un de ses enfants le détrônerait, il les avala tous, sauf [[grece:zeus|Zeus]], que [[rhea]] parvint à cacher.',
    'titans-rhea': 'Sœur et épouse de [[cronos]], elle vit disparaître ses cinq premiers enfants, avalés par leur père. Pour sauver le sixième, [[grece:zeus|Zeus]], elle accoucha en secret en Crète et tendit à Cronos une pierre emmaillotée.',
    'titans-oceanos': 'Aîné des Titans, il est le fleuve sans fin qui entoure le disque de la terre, source de toutes les eaux. Il resta à l’écart de la guerre contre [[grece:zeus|Zeus]], qui le laissa régner sur ses eaux.',
    'titans-hyperion': 'Son nom signifie « celui qui va au-dessus ». Avec sa sœur Théia, il eut les trois astres qui éclairent le monde : Hélios, le Soleil, Séléné, la Lune, et Éos, l’Aurore.',
    'titans-themis': 'Titanide de la loi et de l’ordre juste, elle siégea aux côtés de [[grece:zeus|Zeus]], dont elle fut la deuxième épouse. Elle lui donna les Heures, gardiennes des saisons, et les Moires, qui filent le destin.',
    'titans-mnemosyne': 'Elle incarne la mémoire, qui permet aux poètes de chanter le passé. Unie à [[grece:zeus|Zeus]] pendant neuf nuits, elle donna naissance aux neuf Muses.',
    'titans-japet': 'Frère de [[cronos]], il combattit dans la guerre des Titans et fut jeté dans le Tartare. Il est surtout connu par ses fils : [[atlas]], [[promethee]], Épiméthée et Ménoetios.',
    'titans-atlas': 'Fils de [[japet]], il mena les Titans au combat contre les Olympiens. Vaincu, il fut condamné par [[grece:zeus|Zeus]] à porter le ciel sur ses épaules, à l’extrême ouest du monde.',
    'titans-promethee': 'Fils de [[japet]], il façonna les premiers hommes dans l’argile, puis vola le feu de l’Olympe pour le leur donner. [[grece:zeus|Zeus]] le fit enchaîner sur le Caucase, où un aigle venait lui dévorer le foie.',
    'geants-alcyonee': 'Le plus redoutable des Géants était immortel tant qu’il restait sur la terre de Pallène, où il était né. [[grece:heracles|Héraclès]] le blessa d’une flèche puis, sur le conseil d’[[grece:athena|Athéna]], le traîna hors de ses terres, où il mourut.',
    'geants-porphyrion': 'Roi des Géants, il se jeta sur [[grece:hera|Héra]] pendant la bataille contre les dieux. [[grece:zeus|Zeus]] le frappa de sa foudre et [[grece:heracles|Héraclès]] l’acheva d’une flèche.',
    'geants-encelade': 'Il affronta [[grece:athena|Athéna]] pendant la guerre des Géants. Alors qu’il fuyait, la déesse jeta sur lui l’île de Sicile, qui l’écrasa.',
    'geants-ephialtes': 'Pendant la bataille contre les dieux, [[grece:apollon|Apollon]] lui creva l’œil gauche d’une flèche, et [[grece:heracles|Héraclès]] lui perça le droit.',
    'geants-mimas': 'Selon les récits, il fut tué par Héphaïstos, qui l’accabla de projectiles de métal en fusion, ou par [[grece:zeus|Zeus]] et sa foudre.',
    'geants-polypheme': 'Fils de [[grece:poseidon|Poséidon]], ce cyclope à l’œil unique vivait en Sicile avec ses moutons. Il enferma Ulysse et ses compagnons dans sa grotte et en dévora plusieurs, avant que le héros ne l’enivre et lui crève l’œil.',
    'geants-briaree': 'Fils d’Ouranos et de Gaïa, il fut enfermé dans le Tartare avec ses frères Cottos et Gygès. Libéré par [[grece:zeus|Zeus]], il l’aida à vaincre les Titans en lançant sur eux des rochers par centaines.',
    'geants-antee': 'Fils de [[grece:poseidon|Poséidon]] et de la Terre, ce géant de Libye défiait les voyageurs à la lutte et les tuait. Chaque fois qu’il touchait le sol, sa mère lui rendait ses forces.',
    'grece-heracles': 'Fils de [[zeus]] et d’une mortelle, il accomplit douze travaux pour expier un crime commis dans la folie envoyée par [[hera]]. Le dernier le mena jusqu’au royaume d’[[hades]], d’où il ramena Cerbère.',

    'egypte-ra': 'Chaque jour, il traverse le ciel sur sa barque solaire, puis affronte la nuit le serpent Apophis. Lorsque les hommes se révoltèrent contre lui, il envoya son œil, sous la forme de [[sekhmet]], pour les châtier.',
    'egypte-anubis': 'Le dieu à tête de chacal guide les défunts et pèse leur cœur contre la plume de Maât, sous le regard d’[[osiris]]. Le verdict est consigné par [[thot]], le scribe des dieux.',
    'egypte-bastet': 'Déesse chatte, douce gardienne du foyer, des naissances et de la musique. Fille de [[ra]], elle partage avec [[sekhmet]] une même nature : l’une apaisée, l’autre déchaînée.',
    'egypte-osiris': 'Premier roi d’Égypte, il fut assassiné et démembré par son frère Seth, jaloux de son trône. Rassemblé par [[isis]] et embaumé par [[anubis]], il règne depuis sur le royaume des morts.',
    'egypte-isis': 'La Grande Magicienne parcourut l’Égypte pour retrouver les morceaux d’[[osiris]], son époux, et lui rendre la vie. Elle cacha ensuite leur fils [[horus]] dans les marais du delta, loin de la colère de Seth.',
    'egypte-horus': 'Fils d’[[isis]] et d’[[osiris]], le dieu faucon affronta Seth pour venger son père et reprendre le trône. Il y perdit un œil, que [[thot]] lui rendit ; chaque pharaon est son héritier vivant.',
    'egypte-thot': 'Dieu à tête d’ibis, inventeur de l’écriture et maître du temps, il note le verdict du jugement des morts mené par [[anubis]]. C’est lui qui guérit l’œil d’[[horus]] après son combat contre Seth.',
    'egypte-sekhmet': 'Déesse lionne au souffle brûlant, elle naquit de l’œil de [[ra]] pour punir les hommes révoltés. Pour l’arrêter, on teinta la bière en rouge : elle la but comme du sang, s’endormit, et s’éveilla apaisée, sous les traits de [[bastet]].',

    'gothique-dracula': 'Aristocrate immortel surgi des brumes de Transylvanie, il gagne l’Angleterre pour y étendre son règne. Bram Stoker lui donna vie en 1897, vingt-cinq ans après sa devancière, [[carmilla]].',
    'gothique-creature': 'Assemblée et animée par Victor Frankenstein, elle cherche sa place parmi des hommes qui la rejettent. Née en 1818 sous la plume de Mary Shelley, elle est l’aînée des monstres de cette salle, bien avant [[dracula]].',
    'gothique-carmilla': 'Mystérieuse invitée d’un château isolé de Styrie, elle se lie à la jeune Laura, qui dépérit nuit après nuit. Imaginée par Sheridan Le Fanu en 1872, elle ouvrit la voie à [[dracula]].',
    'gothique-jekyll': 'Médecin respecté de Londres, il met au point un breuvage pour séparer le bien du mal en lui. L’expérience libère [[hyde]], qu’il ne parvient bientôt plus à contenir.',
    'gothique-hyde': 'L’ombre libérée de [[jekyll]], qui arpente sans remords les ruelles brumeuses de Londres. Chaque nuit, il revient plus fort, et le docteur plus faible.',
    'gothique-fantome': 'Génie masqué de la musique, il hante les dessous du Palais Garnier et son lac souterrain. Comme [[dorian]], il cache au monde ce qu’il est vraiment.',
    'gothique-dorian': 'Sa jeunesse ne s’altère jamais : son portrait, caché sous les combles, vieillit à sa place et porte chacun de ses crimes. Comme [[jekyll]], il a confié sa part d’ombre à un double.',
    'gothique-loupgarou': 'Homme le jour, créature des bois les nuits de pleine lune, il ne garde aucun souvenir de ses chasses. Il partage avec [[dracula]] la nuit et les frayeurs des campagnes d’Europe centrale.',

    'contes-cendrillon': 'Avant minuit, la fille des cendres devient la reine du bal, grâce à sa marraine la fée et à une citrouille changée en carrosse. Perrault la publia en 1697, dans le même recueil que le [[chaperon|Petit Chaperon rouge]] et le [[chatbotte|Chat botté]].',
    'contes-alice': 'Curieuse et logique, elle suit un lapin blanc au fond d’un terrier et tombe dans un monde absurde. Née sous la plume de Lewis Carroll en 1865, elle partage avec [[peterpan]] le refus des règles des grandes personnes.',
    'contes-peterpan': 'Chef des Garçons perdus, il s’envole avec Wendy jusqu’au Pays imaginaire, où l’on ne grandit jamais. Imaginé par J. M. Barrie en 1904, il est, avec [[alice]], l’un des deux enfants anglais de cette salle.',
    'contes-chaperon': 'Une galette, un petit pot de beurre et une rencontre inattendue dans les bois. Chez Perrault, le [[loup|Grand Méchant Loup]] la dévore ; chez les frères Grimm, un chasseur la sauve.',
    'contes-chatbotte': 'Seul héritage d’un fils de meunier, il fait par la seule force de son esprit la fortune de son maître, devenu marquis de Carabas. Dans le recueil de Perrault, il a pour voisines [[cendrillon]] et [[belle|la Belle au bois dormant]].',
    'contes-belle': 'Un fuseau, une malédiction et un château gagné par les ronces : elle dort cent ans avant qu’un prince ne la réveille. Comme [[blancheneige]], elle passe d’un sommeil semblable à la mort à une seconde vie.',
    'contes-blancheneige': 'Réfugiée chez sept nains, elle échappe à la jalousie d’une reine que son miroir ne flatte plus. Une pomme empoisonnée la plonge, comme [[belle|la Belle au bois dormant]], dans un sommeil dont seul un prince la tire.',
    'contes-loup': 'Rôdeur des sentiers à la voix trop douce, il guette les imprudents. Sa rencontre avec le [[chaperon|Petit Chaperon rouge]] rappelle aux enfants que les bois ne sont jamais tout à fait sûrs.',

    'histoire-napoleon': 'Général, Premier consul puis empereur des Français en 1804, il redessine l’Europe et fonde le Code civil. Il se voulait l’héritier de [[charlemagne]], dont il fit porter la couronne à son sacre.',
    'histoire-degaulle': 'Le 18 juin 1940, depuis Londres, il appelle les Français à poursuivre le combat, puis fonde la Ve République en 1958. Sa « certaine idée de la France » se nourrit de figures comme [[jeanne]].',
    'histoire-jeanne': 'Jeune paysanne de Domrémy, elle mène l’armée de Charles VII et délivre Orléans en 1429, avant d’être brûlée à Rouen. [[napoleon|Bonaparte]] en fit un symbole national dès 1803, et [[degaulle]] l’invoqua souvent.',
    'histoire-louisxiv': 'Roi à quatre ans, il gouverne seul à partir de 1661 et fait de Versailles le cœur de l’Europe. On l’appela Louis le Grand, comme [[charlemagne]] fut avant lui Charles le Grand.',
    'histoire-curie': 'Née à Varsovie, elle découvre avec Pierre Curie le polonium et le radium, et reçoit deux prix Nobel, en physique puis en chimie. Elle repose au Panthéon depuis 1995, non loin de [[hugo]].',
    'histoire-hugo': 'Romancier des Misérables, poète et dramaturge, il passe près de vingt ans en exil sous le Second Empire. Ennemi juré de Napoléon III, il célébra pourtant la légende de son oncle, [[napoleon]].',
    'histoire-charlemagne': 'Roi des Francs couronné empereur à Rome le jour de Noël de l’an 800, il unifie une grande partie de l’Europe occidentale. Mille ans plus tard, [[napoleon]] se réclamera de son héritage.',
    'histoire-vercingetorix': 'Chef des Arvernes, il fédère les peuples gaulois contre les légions de César et triomphe à Gergovie en 52 av. J.-C. Vaincu à Alésia, il reste le plus ancien héros de l’histoire de France, bien avant [[jeanne]].',

    'nordique-odin': 'Le Père de tout sacrifia un œil pour boire à la source de la sagesse et resta pendu neuf nuits à l’arbre-monde pour découvrir les runes. Il sait qu’au Ragnarök, [[fenrir]] le dévorera.',
    'nordique-thor': 'Fils d’[[odin]], il protège Asgard et Midgard avec Mjöllnir, un marteau forgé par des nains à la suite d’une ruse de [[loki]].',
    'nordique-loki': 'Métamorphe imprévisible, tour à tour allié et ennemi des dieux. Père de [[fenrir]], c’est lui qui causera la mort de Baldr, le fils bien-aimé d’[[odin]] et de [[frigg]].',
    'nordique-freyja': 'Déesse de l’amour et de la guerre, elle parcourt le ciel sur un char tiré par des chats. Elle accueille la moitié des guerriers tombés au combat ; l’autre moitié rejoint [[odin]] au Valhalla.',
    'nordique-frigg': 'Épouse d’[[odin]] et reine d’Asgard, elle connaît le destin de chacun sans jamais le dévoiler. Elle fit jurer à toutes choses d’épargner son fils Baldr, mais oublia le gui, ce dont [[loki]] sut profiter.',
    'nordique-fenrir': 'Fils de [[loki]], le loup grandit si vite que les dieux prirent peur. Ils l’enchaînèrent par la ruse, au prix de la main de [[tyr]] ; depuis, il attend le Ragnarök.',
    'nordique-heimdall': 'Gardien du pont arc-en-ciel Bifröst, il voit à cent lieues et entend pousser l’herbe. Au Ragnarök, il sonnera du cor et affrontera [[loki]] : ils périront l’un par l’autre.',
    'nordique-tyr': 'Dieu du serment et du courage, il fut le seul à oser nourrir le jeune [[fenrir]]. Pour que le loup accepte la chaîne magique, il plaça sa main dans sa gueule, et la perdit.'
  };
  Object.keys(STORIES).forEach(function (id) { if (A.CHAR[id]) A.CHAR[id].story = STORIES[id]; });

  /* « Voir plus » : un paragraphe complémentaire par personnage (mêmes liens [[slug]] possibles). */
  var MORE = {
    'grece-zeus': 'Dernier-né du Titan Cronos, qui dévorait ses enfants, il fut caché en Crète et nourri par la chèvre Amalthée. Devenu adulte, il força son père à recracher ses frères et sœurs, puis mena contre les Titans une guerre de dix ans. Les Cyclopes lui forgèrent la foudre, son arme et son emblème.',
    'grece-hera': 'Fille de Cronos et de Rhéa, elle est à la fois la sœur et l’épouse de [[zeus]]. Le paon lui est consacré : elle orna sa queue des cent yeux du géant Argos, son fidèle gardien. Ses sanctuaires d’Argos et de Samos comptaient parmi les plus vénérés de Grèce.',
    'grece-poseidon': 'On lui attribue la création du cheval, qu’il aurait fait jaillir d’un rocher d’un coup de trident. Rancunier, il poursuivit Ulysse dix ans durant pour venger son fils, le cyclope Polyphème. Les Grecs le surnommaient « l’Ébranleur de la terre ».',
    'grece-hades': 'Il enleva Perséphone pour en faire sa reine ; pour avoir goûté quelques grains de grenade, la jeune déesse dut passer chaque année une partie de l’année sous terre. Son casque le rendait invisible. Les Grecs évitaient de prononcer son nom et l’appelaient Ploutos, « le Riche ».',
    'grece-athena': 'Elle porte l’égide, ornée de la tête de [[meduse]], et la chouette est son oiseau. Le Parthénon, sur l’Acropole d’Athènes, lui est dédié. Protectrice des artisans autant que des guerriers, elle passait pour avoir inventé le métier à tisser.',
    'grece-apollon': 'Il tua le serpent Python à Delphes et y fonda son oracle, le plus célèbre du monde grec. Musicien, il joue de la lyre que lui offrit Hermès. Épris de la nymphe Daphné, changée en laurier pour lui échapper, il fit de cet arbre son emblème.',
    'grece-artemis': 'Elle obtint de [[zeus]] de rester à jamais libre et sans époux, entourée de nymphes chasseresses. Le chasseur Actéon, qui l’avait surprise au bain, fut changé en cerf et dévoré par ses propres chiens. Son temple d’Éphèse comptait parmi les Sept Merveilles du monde.',
    'grece-meduse': 'Le héros Persée la décapita en ne la regardant que dans le reflet de son bouclier. De son sang naquirent le cheval ailé Pégase et le géant Chrysaor. Même tranchée, sa tête gardait son pouvoir : Persée l’offrit à [[athena]], qui la fixa sur son égide.',
    'titans-cronos': 'Son règne fut plus tard décrit comme un âge d’or, où les hommes vivaient sans travail ni vieillesse. Les Romains l’identifièrent à Saturne, dont les fêtes, les Saturnales, renversaient l’ordre social pendant quelques jours. La faucille reste son attribut.',
    'titans-rhea': 'Elle est souvent rapprochée de Cybèle, la grande déesse mère venue d’Asie Mineure, représentée sur un char tiré par des lions. On l’honorait au son des tambourins et des cymbales, en souvenir des Courètes qui avaient couvert les pleurs de l’enfant.',
    'titans-oceanos': 'Avec son épouse Téthys, il eut trois mille fils, les fleuves, et trois mille filles, les Océanides. Parmi elles, Métis, la première épouse de Zeus. Sur les cartes anciennes, son cours marque la limite du monde connu.',
    'titans-hyperion': 'Les poètes grecs le confondent parfois avec son fils Hélios. Selon certains récits, il fut l’un des quatre Titans qui maintinrent Ouranos pendant que [[cronos]] le mutilait. Le poète anglais Keats lui consacra un long poème inachevé.',
    'titans-themis': 'Avant Apollon, elle aurait tenu l’oracle de Delphes. On la représente tenant une balance, parfois les yeux bandés : c’est elle que l’on voit encore devant de nombreux palais de justice.',
    'titans-mnemosyne': 'Dans certains rites funéraires, les initiés devaient boire aux Enfers à la source de Mnémosyne, et non à celle du Léthé, qui fait tout oublier. Le mot « mnémotechnique » vient de son nom.',
    'titans-japet': 'Ses fils ont tous défié l’ordre des dieux, et tous en ont payé le prix. Certains auteurs anciens voyaient en lui l’ancêtre de l’humanité, par Prométhée et son fils Deucalion.',
    'titans-atlas': 'Lors de son onzième travail, [[grece:heracles|Héraclès]] prit sa place quelques instants pour qu’il aille cueillir les pommes d’or des Hespérides. Au XVIe siècle, le géographe Mercator donna le nom d’Atlas à son recueil de cartes, et le mot est resté. Les montagnes de l’Atlas, au Maroc, portent aussi son nom.',
    'titans-promethee': 'Son nom signifie « celui qui réfléchit avant », par opposition à son frère Épiméthée, « celui qui réfléchit après », qui accepta Pandore malgré ses avertissements. C’est [[grece:heracles|Héraclès]] qui le délivra en abattant l’aigle. Eschyle lui consacra une tragédie, Prométhée enchaîné.',
    'geants-alcyonee': 'Il avait volé les troupeaux du Soleil avant la guerre contre les dieux. De chagrin, ses filles, les Alcyonides, se jetèrent à la mer et furent changées en martins-pêcheurs, les alcyons.',
    'geants-porphyrion': 'Selon Apollodore, Zeus lui inspira un désir soudain pour Héra afin de le distraire au cœur de la bataille. Son nom évoque la pourpre, la couleur des flammes ou du sang. Le poète Pindare le désigne comme le roi des Géants.',
    'geants-encelade': 'Pour les Anciens, ses mouvements sous la terre provoquaient les séismes de Sicile, et son souffle les éruptions de l’Etna. Une lune glacée de Saturne porte son nom : elle projette d’immenses geysers dans l’espace.',
    'geants-ephialtes': 'Son nom désignait aussi, chez les Grecs, le démon du cauchemar qui pèse sur la poitrine des dormeurs. Il ne faut pas le confondre avec Éphialtès l’Aloade, qui tenta avec son frère Otos d’empiler des montagnes pour escalader le ciel.',
    'geants-mimas': 'Le mont Mimas, en Asie Mineure, porte son nom, comme une petite lune de Saturne reconnaissable à son immense cratère, qui lui donne l’air d’un grand œil.',
    'geants-polypheme': 'Ulysse lui avait dit s’appeler « Personne » : quand Polyphème hurla que Personne l’attaquait, les autres Cyclopes ne vinrent pas l’aider. Sa colère, transmise à son père Poséidon, poursuivit Ulysse pendant dix ans. D’autres récits le montrent soupirant pour la nymphe Galatée.',
    'geants-briaree': 'Il devint ensuite le gardien des Titans prisonniers. Dans l’Iliade, la déesse Thétis l’appelle au secours de [[grece:zeus|Zeus]] quand les autres dieux veulent l’enchaîner : sa seule présence suffit à les faire renoncer.',
    'geants-antee': '[[grece:heracles|Héraclès]] devina son secret : il le souleva de terre et l’étouffa dans ses bras. Antée bâtissait un temple à son père avec les crânes de ses victimes.',
    'grece-heracles': 'Encore au berceau, il étrangla les deux serpents envoyés par [[hera]]. Parmi ses travaux : le lion de Némée, l’hydre de Lerne aux têtes qui repoussent, les écuries d’Augias. À sa mort, il fut accueilli sur l’Olympe et devint immortel.',

    'egypte-ra': 'On le représente avec une tête de faucon coiffée du disque solaire. Si puissant que [[isis]] dut ruser pour lui arracher son nom secret, il fut plus tard uni à Amon pour devenir Amon-Rê, roi des dieux, honoré à Karnak.',
    'egypte-anubis': 'Avant l’essor du culte d’[[osiris]], il était le grand dieu des morts. On lui attribue l’invention de l’embaumement, et les prêtres portaient son masque de chacal pendant la momification. Le chacal rôdant près des tombes, il devint le protecteur des nécropoles.',
    'egypte-bastet': 'Son grand temple se dressait à Bubastis, dans le delta du Nil, où l’on a retrouvé des milliers de chats momifiés offerts en son honneur. On la célébrait par des fêtes joyeuses, en musique et en danse. Elle tient souvent un sistre, instrument de musique sacré.',
    'egypte-osiris': 'Il apprit aux hommes l’agriculture et les lois. On le représente la peau verte ou noire, couleurs de la végétation et du limon fertile du Nil, coiffé de la couronne atef. Abydos, où l’on disait sa tête enterrée, était son grand lieu de pèlerinage.',
    'egypte-isis': 'Son culte franchit les frontières de l’Égypte et gagna tout l’Empire romain, jusqu’en Gaule. Elle porte sur la tête un trône, hiéroglyphe de son nom. Les mères la priaient, car elle avait protégé seule l’enfance d’[[horus]].',
    'egypte-horus': 'Son œil, l’oudjat, devint l’une des amulettes de protection les plus répandues d’Égypte. Son œil droit était le soleil, son œil gauche la lune. Le grand temple d’Edfou, l’un des mieux conservés du pays, lui est dédié.',
    'egypte-thot': 'Il est parfois représenté sous la forme d’un babouin. On lui attribuait l’invention des hiéroglyphes, des mathématiques et du calendrier. Les Grecs l’identifièrent à Hermès et vénérèrent sous le nom d’Hermès Trismégiste un sage légendaire né de lui.',
    'egypte-sekhmet': 'Son nom signifie « la Puissante ». Elle répandait les épidémies mais savait aussi les guérir : ses prêtres étaient médecins. Le pharaon Amenhotep III fit sculpter des centaines de statues à son effigie, dont beaucoup sont aujourd’hui dans les musées du monde entier.',

    'gothique-dracula': 'Le roman, composé de lettres et de journaux intimes, suit Jonathan Harker, Mina et le professeur Van Helsing. Stoker emprunta son nom à Vlad III, prince de Valachie. Le comte ne se reflète pas dans les miroirs, craint l’ail et le crucifix, et perd ses pouvoirs à la lumière du jour.',
    'gothique-creature': 'Mary Shelley avait dix-huit ans quand l’idée lui vint, lors d’un concours d’histoires de fantômes au bord du lac Léman, en 1816. Dans le roman, la Créature est cultivée et éloquente : elle a appris à lire avec Milton et Plutarque. C’est le cinéma qui l’a rendue muette.',
    'gothique-carmilla': 'Son nom cache des anagrammes : elle se présente aussi comme Millarca ou Mircalla. Le récit, paru en feuilleton puis dans le recueil In a Glass Darkly, est raconté par Laura elle-même. Il annonce bien des codes du vampire moderne.',
    'gothique-jekyll': 'Robert Louis Stevenson aurait écrit la première version du récit en quelques jours, en 1886, après un cauchemar. L’histoire est d’abord vue par l’avocat Utterson, qui s’inquiète de l’étrange protégé de son ami ; la vérité n’éclate que dans la confession finale du docteur.',
    'gothique-hyde': 'Petit, difforme sans qu’on sache dire pourquoi, il inspire à tous un dégoût immédiat. Il piétine une enfant dans la rue, puis assassine un vieux gentleman à coups de canne. Son nom évoque l’anglais hide : « se cacher ».',
    'gothique-fantome': 'Gaston Leroux le fit paraître en 1910. Il s’appelle Erik, compose un « Don Juan triomphant » et s’éprend de la jeune cantatrice Christine Daaé. Le lac sous l’Opéra existe vraiment : c’est une réserve d’eau creusée lors de la construction du Palais Garnier.',
    'gothique-dorian': 'Oscar Wilde publia le roman en 1890, puis une version augmentée en 1891. Le portrait est l’œuvre du peintre Basil Hallward, et c’est Lord Henry qui pousse Dorian vers une vie de plaisirs. La préface l’annonce : « Tout art est à la fois surface et symbole. »',
    'gothique-loupgarou': 'Le mot garou vient du francique « homme-loup » ; loup-garou dit donc deux fois « loup ». Au XIIe siècle, Marie de France conte déjà l’histoire de Bisclavret, chevalier changé en loup. La croyance donna lieu à de vrais procès en France jusqu’au XVIIe siècle.',

    'contes-cendrillon': 'Chez Perrault, la pantoufle est de verre ; chez les frères Grimm, elle est d’or, et ce sont des oiseaux qui aident l’héroïne. Le conte existe sous des centaines de formes à travers le monde, jusque dans la Chine ancienne.',
    'contes-alice': 'Le récit naquit d’une promenade en barque sur la Tamise, en 1862, pour amuser la petite Alice Liddell et ses sœurs. Elle y croise le Chapelier fou, le Chat de Cheshire et la Reine de cœur. Carroll lui offrit une suite en 1871 : De l’autre côté du miroir.',
    'contes-peterpan': 'Accompagné de la fée Clochette, il affronte le capitaine Crochet, dont il a tranché la main pour la jeter à un crocodile. Barrie légua les droits de son œuvre au Great Ormond Street Hospital, un hôpital pour enfants de Londres.',
    'contes-chaperon': 'La version de Perrault, en 1697, finit mal et se clôt sur une morale adressée aux jeunes filles. Les frères Grimm, en 1812, ajoutent le chasseur qui ouvre le ventre du [[loup|loup]]. Son chaperon est une petite coiffe rouge, cadeau de sa grand-mère.',
    'contes-chatbotte': 'Il ne demande à son maître qu’un sac et une paire de bottes, puis enchaîne les ruses : il offre du gibier au roi, fait croire à la noyade du « marquis » et pousse un ogre à se changer en souris pour le croquer. Le château de l’ogre revient à son maître, qui épouse la princesse.',
    'contes-belle': 'Chez Perrault, le conte ne s’arrête pas au réveil : la mère du prince est une ogresse qui veut dévorer la jeune reine et ses enfants. Tchaïkovski en tira en 1890 l’un des plus célèbres ballets du répertoire.',
    'contes-blancheneige': 'Les frères Grimm publièrent le conte en 1812. La reine tente trois fois de la tuer : avec un lacet, un peigne empoisonné, puis la pomme. Son miroir magique ne sait dire que la vérité, et c’est bien là le drame.',
    'contes-loup': 'Le loup de Perrault parle, se déguise et ruse, mais n’a pas de nom. On le retrouve dans Les Trois Petits Cochons ou Le Loup et les Sept Chevreaux. Chez Perrault, la morale vise les « loups doucereux », séducteurs plus dangereux que les bêtes.',

    'histoire-napoleon': 'Né à Ajaccio en 1769, il devient général à vingt-quatre ans, après le siège de Toulon. Vaincu à Waterloo en 1815, il meurt en exil à Sainte-Hélène en 1821. Ses cendres reposent aux Invalides depuis 1840.',
    'histoire-degaulle': 'Officier de la Grande Guerre, blessé et fait prisonnier à Verdun, il défend avant 1940 l’emploi des chars. Président de 1959 à 1969, il dote la France de la dissuasion nucléaire. Il repose à Colombey-les-Deux-Églises.',
    'histoire-jeanne': 'Elle dit entendre les voix de saint Michel, sainte Catherine et sainte Marguerite. Elle fait sacrer Charles VII à Reims, puis est capturée à Compiègne et jugée pour hérésie. Réhabilitée en 1456, elle est canonisée en 1920.',
    'histoire-louisxiv': 'Il prend le soleil pour emblème et danse lui-même dans les ballets de cour. Il révoque l’édit de Nantes en 1685. On lui prête une phrase qu’il n’a sans doute jamais prononcée : « L’État, c’est moi. »',
    'histoire-curie': 'Première femme lauréate d’un prix Nobel, elle fut aussi la première personne à en recevoir deux. Pendant la Grande Guerre, elle équipe des voitures de radiologie, les « petites Curies ». Ses carnets de laboratoire sont encore radioactifs aujourd’hui.',
    'histoire-hugo': 'Il publie Notre-Dame de Paris en 1831 et Les Misérables en 1862, depuis son exil à Guernesey. Député, il combat la peine de mort toute sa vie. À sa mort, en 1885, une foule immense suit son cercueil jusqu’au Panthéon.',
    'histoire-charlemagne': 'Fils de Pépin le Bref, il gouverne depuis Aix-la-Chapelle. Il encourage les écoles et la copie des manuscrits : c’est la renaissance carolingienne, d’où vient sa réputation d’« inventeur de l’école ».',
    'histoire-vercingetorix': 'Fils de Celtillos, il est proclamé roi par les Arvernes en 52 av. J.-C. Assiégé dans Alésia, il se rend à César pour épargner ses hommes. Emmené à Rome, il y est exécuté vers 46 av. J.-C., après le triomphe de son vainqueur.',

    'nordique-odin': 'Deux corbeaux, Hugin et Munin, « Pensée » et « Mémoire », parcourent chaque jour le monde pour lui en rapporter les nouvelles. Il chevauche Sleipnir, cheval à huit jambes, et porte la lance Gungnir. En anglais, le mercredi lui doit son nom : Wednesday, le jour de Woden.',
    'nordique-thor': 'Fils d’[[odin]] et de la géante Jörd, la Terre, il voyage sur un char tiré par deux boucs. Au Ragnarök, il tuera le serpent de Midgard mais succombera à son venin, neuf pas plus loin. En anglais, le jeudi porte son nom : Thursday.',
    'nordique-loki': 'Fils d’un géant, il est pourtant admis parmi les dieux et devient le frère de sang d’[[odin]]. Changé en jument, il donna naissance à Sleipnir, le cheval d’Odin. Après la mort de Baldr, les dieux l’enchaînent sous un serpent dont le venin lui coule sur le visage.',
    'nordique-freyja': 'Elle possède un manteau de plumes de faucon qui permet de voler, et le collier Brísingamen, forgé par quatre nains. Elle pleure des larmes d’or rouge en cherchant son époux disparu. Maîtresse du seiðr, elle enseigna cette magie à [[odin]].',
    'nordique-frigg': 'Elle file les nuages sur son rouet et partage avec [[odin]] le haut siège d’où l’on voit tous les mondes. Baldr pouvait revenir des enfers si toutes choses le pleuraient ; une seule géante refusa, sans doute [[loki]] déguisé. En anglais, le vendredi lui doit son nom : Friday.',
    'nordique-fenrir': 'Les dieux brisèrent deux chaînes avant de lui passer Gleipnir, fine comme un ruban, faite du bruit des pas d’un chat, de la barbe d’une femme et des racines d’une montagne. Au Ragnarök, il se libérera et avalera [[odin]].',
    'nordique-heimdall': 'On le dit né de neuf mères. Il a besoin de moins de sommeil qu’un oiseau et ses dents sont d’or. Un poème ancien, la Rígsþula, lui attribue l’origine des différentes classes de la société humaine.',
    'nordique-tyr': 'Ancien dieu germanique de la guerre, il fut peu à peu éclipsé par [[odin]]. Au Ragnarök, il affrontera Garm, le chien des enfers, et ils s’entretueront. En anglais, le mardi lui doit son nom : Tuesday.'
  };
  Object.keys(MORE).forEach(function (id) { if (A.CHAR[id]) A.CHAR[id].more = MORE[id]; });

  // Ajustement pour la carte vedette de la démo (Zeus Légendaire 018/50)
  A.ED['grece-zeus-legendary'].minted0 = 31;
  A.ED['grece-zeus-unique'].minted0 = 0;

  /* ---------- Illustrations définitives disponibles ---------- */
  var ART = {
    'grece-zeus-base': 'assets/card/zeus/Zeus_common.png',
    'grece-zeus-rare': 'assets/card/zeus/Zeus_rare.png',
    'grece-zeus-epic': 'assets/card/zeus/Zeus_epic.png',
    'grece-zeus-legendary': 'assets/card/zeus/Zeus_legendary.png',
    'grece-zeus-mythic': 'assets/card/zeus/Zeus_mythic.png',
    'grece-zeus-unique': 'assets/card/zeus/Zeus_unique.png'
  };
  Object.keys(ART).forEach(function (id) { if (A.ED[id]) A.ED[id].image = ART[id]; });

  /* ---------- Boosters ----------
     Les taux de référence (odds) sont modulés par le stock réellement
     disponible : voir store.js → packOdds(). */
  var ALL = ['grece', 'titans', 'geants', 'egypte', 'gothique', 'contes', 'histoire', 'nordique'];
  A.PACKS = [
    {
      id: 'daily', name: 'Booster quotidien', kicker: 'Offert chaque jour', price: 0, size: 3, theme: 'ivory', daily: true,
      cover: 'contes-alice-base',
      collections: ['grece', 'titans', 'geants', 'egypte', 'gothique', 'contes', 'histoire'],
      odds: { base: 0.9, rare: 0.085, epic: 0.015 },
      desc: 'Trois cartes pour découvrir de nouveaux personnages. Un booster par compte et par jour.',
      // lure : rareté mise en avant dans « 1 chance sur N d’obtenir … ou mieux » · hook : accroche du bloc vedette
      lure: 'epic',
      hook: 'Trois cartes offertes, chaque jour. Qui rejoindra votre collection aujourd’hui ?'
    },
    {
      id: 'standard', name: 'Booster Atlas', kicker: 'Toutes collections', price: 150, size: 5, theme: 'lapis',
      cover: 'grece-athena-rare',
      collections: ALL,
      odds: { base: 0.78, rare: 0.15, epic: 0.05, legendary: 0.015, mythic: 0.004, unique: 0.001 },
      desc: 'Cinq cartes issues de l’ensemble des collections publiées.',
      lure: 'legendary',
      hook: 'Cinq cartes tirées dans toutes les salles du musée, des dieux de l’Olympe aux héros de l’Histoire.'
    },
    {
      id: 'conservateur', name: 'Coffret du Conservateur', kicker: 'Une carte numérotée garantie', price: 600, size: 5, theme: 'garnet',
      cover: 'histoire-napoleon-mythic',
      collections: ALL,
      odds: { base: 0.6, rare: 0.26, epic: 0.1, legendary: 0.03, mythic: 0.008, unique: 0.002 },
      guarantee: { odds: { rare: 0.7, epic: 0.22, legendary: 0.06, mythic: 0.016, unique: 0.004 } },
      desc: 'Cinq cartes, dont la dernière est obligatoirement une édition numérotée (Rare ou supérieure).',
      lure: 'legendary',
      hook: 'Le coffret des collectionneurs : cinq cartes, dont une édition numérotée garantie.'
    },
    {
      id: 'saga', name: 'Saga du Nord', kicker: 'Événement · durée limitée', price: 250, size: 5, theme: 'night', event: true,
      cover: 'nordique-odin-legendary',
      collections: ['nordique'],
      odds: { base: 0.72, rare: 0.19, epic: 0.065, legendary: 0.018, mythic: 0.005, unique: 0.002 },
      guarantee: { odds: { rare: 0.8, epic: 0.15, legendary: 0.035, mythic: 0.012, unique: 0.003 } },
      desc: 'Booster de lancement de la nouvelle collection nordique. Une carte numérotée garantie.',
      lure: 'legendary',
      hook: 'Odin, Thor, Freyja… La nouvelle salle nordique ouvre ses portes, pour un temps seulement. Une carte numérotée garantie dans chaque booster.'
    }
  ];
  A.PACK = {};
  // TEST : une carte de chaque rareté numérotée, pour voir toutes les animations d’ouverture
  A.PACKS.push({
    id: 'ultime', name: 'Pack Ultime', kicker: 'Test · toutes les raretés', price: 0, size: 5, theme: 'night', test: true,
    cover: 'grece-zeus-unique',
    collections: ALL,
    fixed: ['rare', 'epic', 'legendary', 'mythic', 'unique'],
    odds: { rare: 0.2, epic: 0.2, legendary: 0.2, mythic: 0.2, unique: 0.2 },
    desc: 'Pack de test : une Rare, une Épique, une Légendaire, une Mythique et une Unique.'
  });
  A.PACKS.forEach(function (p) { A.PACK[p.id] = p; });

  /* ---------- Joueurs fictifs (marketplace) ---------- */
  A.DEMO_USERS = ['Calliope', 'Ombre_de_Rhodes', 'Mlle Lune', 'Le Conservateur', 'Héliodore', 'Nyx.collection', 'Baltazar', 'Sélène', 'Cabinet Ferrand', 'Orphée_92'];

  A.CURRENCY = { name: 'Éclats', short: 'Éc', note: 'Monnaie fictive, non convertible en euros.' };
})(window.ATLAS);
