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
      id: 'grece', name: 'Les Olympiens', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'temple',
      edition: 'Édition I', status: 'live', popular: 1,
      tagline: 'Les dieux qui règnent sur le monde depuis le sommet de l’Olympe.',
      description: 'Du sommet de l’Olympe aux rives du Styx, une galerie consacrée aux grandes divinités grecques et à leurs querelles de famille.'
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
      id: 'heros', name: 'Les Héros', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'ship',
      edition: 'Édition I', status: 'live', popular: 9,
      tagline: 'Les héros grecs et les exploits qui les ont rendus immortels.',
      description: 'Demi-dieux, rois et aventuriers : chacun a son monstre. Réunissez le héros et son adversaire pour débloquer le récit de leur duel.'
    },
    {
      id: 'monstres', name: 'Les Monstres', family: 'Mythologie grecque', group: 'grecque', universe: 'Mythologies', motif: 'cave',
      edition: 'Édition I', status: 'live', popular: 10,
      tagline: 'Gorgones, hydres et chimères : les créatures que les héros ont dû affronter.',
      description: 'Gardiens, fléaux et énigmes vivantes. Chaque monstre a son héros : réunissez-les pour débloquer le récit de leur duel.'
    },
    {
      id: 'egypte', name: 'Les Dieux du Nil', family: 'Égypte ancienne', group: 'egyptienne', universe: 'Mythologies', motif: 'pyramids',
      edition: 'Édition I', status: 'live', popular: 2,
      tagline: 'Les divinités solaires et funéraires de l’Égypte ancienne.',
      description: 'Entre le désert et le fleuve, les dieux de l’Égypte veillent sur le soleil, les vivants et le long voyage des âmes.'
    },
    {
      id: 'pharaons', name: 'Les Pharaons', family: 'Égypte ancienne', group: 'egyptienne', universe: 'Histoire', motif: 'obelisk',
      edition: 'Édition I', status: 'live', popular: 8,
      tagline: 'Rois et reines qui ont gouverné l’Égypte pendant trois mille ans.',
      description: 'De l’unification du pays à la mort de Cléopâtre, les souverains qui ont bâti les pyramides, conquis l’Orient et défié Rome.'
    },
    {
      id: 'planetes', name: 'Les Planètes', family: 'L’Espace', group: 'solaire', universe: 'Sciences', motif: 'planet',
      edition: 'Édition I', status: 'live', popular: 11,
      tagline: 'Les huit planètes qui tournent autour du Soleil.',
      description: 'De la brûlante Mercure à la lointaine Neptune, les planètes du système solaire, leurs records et les dieux qui leur ont donné leur nom.'
    },
    {
      id: 'lunes', name: 'Les Lunes', family: 'L’Espace', group: 'solaire', universe: 'Sciences', motif: 'moon',
      edition: 'Édition I', status: 'live', popular: 12,
      tagline: 'Volcans, océans cachés et geysers : les lunes les plus étonnantes.',
      description: 'Notre Lune et ses cousines : des mondes de glace, de feu et de méthane, qui comptent parmi les meilleurs espoirs de trouver la vie ailleurs.'
    },
    {
      id: 'gothique', name: 'Nuits gothiques', family: 'Récits fantastiques', group: 'fantastique', universe: 'Littérature', motif: 'castle',
      edition: 'Édition I', status: 'live', popular: 3,
      tagline: 'Les créatures nées de la littérature fantastique du XIXᵉ siècle.',
      description: 'Châteaux battus par les vents, laboratoires clandestins et salons d’opéra : les grandes figures du roman gothique.'
    },
    {
      id: 'contes', name: 'Contes de fées', family: 'Contes et merveilles', group: 'contesmonde', universe: 'Littérature', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 4,
      tagline: 'Les héroïnes, les héros et les ogres des contes de Perrault et des frères Grimm.',
      description: 'Forêts profondes, châteaux endormis et ogres affamés : les contes de fées qui ont bercé des générations d’enfants.'
    },
    {
      id: 'histoire', name: 'Figures de France', family: 'Histoire', universe: 'Histoire', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 5,
      tagline: 'Souverains, savants et résistants qui ont marqué l’histoire de France.',
      description: 'De la Gaule à la Ve République, un panthéon de personnalités dont l’empreinte traverse les siècles.'
    },
    {
      id: 'nordique', name: 'Les Dieux d’Asgard', family: 'Mythologie nordique', group: 'norrois', universe: 'Mythologies', motif: 'fjord',
      edition: 'Édition I', status: 'event', popular: 0,
      tagline: 'Odin le borgne, Thor le tonnerre, Loki le rusé : les dieux d’Asgard.',
      description: 'Nouvelle collection. Entre fjords et neiges éternelles, les Ases et les Vanes, dieux de la guerre, de la sagesse et de la fertilité, qui savent tous comment le monde finira.'
    },
    {
      id: 'astronautes', name: 'Les Astronautes', family: 'L’Espace', group: 'solaire', universe: 'Sciences', motif: 'rocket',
      edition: 'Édition I', status: 'live', popular: 14,
      tagline: 'Les pionniers qui ont quitté la Terre, de Gagarine à Pesquet.',
      description: 'Pilotes, ingénieurs et scientifiques : celles et ceux qui ont franchi les premiers la frontière de l’espace.'
    },
    {
      id: 'missions', name: 'Les Missions', family: 'L’Espace', group: 'solaire', universe: 'Sciences', motif: 'planet',
      edition: 'Édition I', status: 'live', popular: 15,
      tagline: 'Satellites, sondes et télescopes qui ont changé notre regard sur l’Univers.',
      description: 'Du premier « bip-bip » de Spoutnik aux galaxies lointaines de James Webb : les grandes missions de l’histoire spatiale.'
    },
    {
      id: 'cosmos', name: 'Les Merveilles du cosmos', family: 'L’Espace', group: 'solaire', universe: 'Sciences', motif: 'blackhole',
      edition: 'Édition I', status: 'live', popular: 27,
      tagline: 'Trous noirs, étoiles géantes et vides cosmiques : les records de l’Univers.',
      description: 'Les objets les plus extrêmes jamais observés : des trous noirs de milliards de soleils, des étoiles plus grandes que notre système solaire et un visiteur venu d’ailleurs.'
    },
    {
      id: 'detectives', name: 'Romans policiers', family: 'Romans d’aventure', group: 'aventure', universe: 'Littérature', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 16,
      tagline: 'Détectives de génie, gentlemen cambrioleurs et cerveaux du crime.',
      description: 'De Baker Street aux salons parisiens, les enquêteurs et les criminels qui ont inventé le roman policier.'
    },
    {
      id: 'verne', name: 'Voyages extraordinaires', family: 'Romans d’aventure', group: 'aventure', universe: 'Littérature', motif: 'ship',
      edition: 'Édition I', status: 'live', popular: 17,
      tagline: 'Sous les mers, au centre de la Terre, vers la Lune : les héros des Voyages extraordinaires.',
      description: 'Savants, capitaines et aventuriers imaginés par Jules Verne, qui annonçaient le sous-marin, l’avion et la fusée.'
    },
    {
      id: 'mousquetaires', name: 'Cape et épée', family: 'Romans d’aventure', group: 'aventure', universe: 'Littérature', motif: 'castle',
      edition: 'Édition I', status: 'live', popular: 18,
      tagline: 'Mousquetaires, vengeurs et bretteurs : le panache à la française.',
      description: 'Les héros de Dumas et de Rostand, entre duels, complots de cour et vengeances implacables.'
    },
    {
      id: 'nuits', name: 'Les Mille et Une Nuits', family: 'Contes et merveilles', group: 'contesmonde', universe: 'Littérature', motif: 'palms',
      edition: 'Édition I', status: 'live', popular: 19,
      tagline: 'Lampes magiques, cavernes au trésor et tapis volants.',
      description: 'Les contes que Shéhérazade raconta, nuit après nuit, pour sauver sa vie : Aladdin, Ali Baba, Sinbad et leurs merveilles.'
    },
    {
      id: 'merveilleux', name: 'Pays merveilleux', family: 'Contes et merveilles', group: 'contesmonde', universe: 'Littérature', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 20,
      tagline: 'Le pays des merveilles, le Pays imaginaire, Oz et le pantin qui voulait devenir un garçon.',
      description: 'Lewis Carroll, J. M. Barrie, L. Frank Baum et Carlo Collodi : les grands contes modernes et leurs mondes merveilleux, tels que leurs auteurs les ont écrits.'
    },
    {
      id: 'jungle', name: 'Le Livre de la jungle', family: 'Contes et merveilles', group: 'contesmonde', universe: 'Littérature', motif: 'palms',
      edition: 'Édition I', status: 'live', popular: 21,
      tagline: 'Mowgli et les peuples de la jungle indienne, tels que Kipling les a imaginés.',
      description: 'Loups, ours, panthère et tigre : les héros des récits de Rudyard Kipling et la Loi de la jungle.'
    },
    {
      id: 'arthur', name: 'La Table ronde', family: 'Légendes médiévales', group: 'medieval', universe: 'Littérature', motif: 'castle',
      edition: 'Édition I', status: 'live', popular: 22,
      tagline: 'Le roi Arthur, Merlin et les chevaliers de Camelot.',
      description: 'Épées magiques, enchanteurs et quête du Graal : la grande légende du Moyen Âge, de Brocéliande à Avalon.'
    },
    {
      id: 'robin', name: 'Robin des Bois', family: 'Légendes médiévales', group: 'medieval', universe: 'Littérature', motif: 'forest',
      edition: 'Édition I', status: 'live', popular: 23,
      tagline: 'Le hors-la-loi de Sherwood et sa joyeuse bande.',
      description: 'Archers, moines bagarreurs et shérif cruel : la légende du voleur qui prenait aux riches pour donner aux pauvres.'
    },
    {
      id: 'etranges', name: 'Êtres étranges', family: 'Récits fantastiques', group: 'fantastique', universe: 'Littérature', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 24,
      tagline: 'Hommes invisibles, golems et vaisseaux fantômes.',
      description: 'Les créatures et les êtres à part nés des légendes et des grands récits fantastiques du XIXe siècle.'
    },
    {
      id: 'flibustiers', name: 'Pirates de l’histoire', family: 'L’Âge des pirates', group: 'pirates', universe: 'Histoire', motif: 'ship',
      edition: 'Édition I', status: 'live', popular: 25,
      tagline: 'Les vrais pirates et corsaires qui ont terrorisé les mers.',
      description: 'De Barbe-Noire à Surcouf, les flibustiers et corsaires bien réels, avec leurs trésors, leurs codes et leurs fins souvent tragiques.'
    },
    {
      id: 'forbans', name: 'Pirates de roman', family: 'L’Âge des pirates', group: 'pirates', universe: 'Littérature', motif: 'palms',
      edition: 'Édition I', status: 'live', popular: 26,
      tagline: 'Jambes de bois, cartes au trésor et capitaines au crochet.',
      description: 'Les pirates nés de la plume de Stevenson, de Barrie et de Sabatini, qui ont fixé pour toujours l’image du pirate.'
    },
    {
      id: 'creatures', name: 'Les Créatures', family: 'Mythologie nordique', group: 'norrois', universe: 'Mythologies', motif: 'fjord',
      edition: 'Édition I', status: 'event', popular: 0,
      tagline: 'Le serpent du monde, le loup du Ragnarök et le cheval à huit jambes.',
      description: 'Loups, serpents, dragons et corbeaux : les créatures qui peuplent l’arbre du monde et qui annoncent la fin des temps.'
    },
    {
      id: 'jotnar', name: 'Les Jötnar', family: 'Mythologie nordique', group: 'norrois', universe: 'Mythologies', motif: 'volcano',
      edition: 'Édition I', status: 'event', popular: 0,
      tagline: 'Géants de feu, de glace et de pierre, éternels rivaux des dieux.',
      description: 'Les géants du Nord, tour à tour ennemis, rivaux et parents des dieux : du géant de feu Surt à Hel, la reine des morts.'
    },
    {
      id: 'mondes', name: 'Les Neuf Mondes', family: 'Mythologie nordique', group: 'norrois', universe: 'Mythologies', motif: 'fjord',
      edition: 'Édition I', status: 'event', popular: 0,
      tagline: 'Asgard, Midgard, Helheim : les mondes reliés par l’arbre Yggdrasil.',
      description: 'Le cosmos des Vikings : neuf mondes suspendus aux branches et aux racines du frêne Yggdrasil, du royaume des dieux à celui des morts.'
    }
  ];

  /* ---------- Collections globales ----------
     Une collection globale réunit plusieurs sous-collections d’un même univers.
     Sa progression additionne celle de ses sous-collections et elle a ses propres récompenses. */
  A.GROUPS = [
    {
      id: 'grecque', name: 'Mythologie grecque', subs: ['grece', 'titans', 'geants', 'heros', 'monstres'], title: 'Gardien du Panthéon grec',
      tagline: 'Dieux, Titans, Géants, héros et monstres : tout l’univers des mythes grecs.',
      description: 'Des Titans qui régnaient avant l’Olympe aux héros qui ont affronté les monstres, en passant par les dieux qui l’ont emporté : toute la mythologie grecque, en cinq sous-collections.'
    }
  ];
  A.GROUPS.push({
    id: 'egyptienne', name: 'Égypte ancienne', subs: ['egypte', 'pharaons'], title: 'Grand Vizir d’Égypte',
    tagline: 'Les dieux du Nil et les rois qui ont gouverné en leur nom.',
    description: 'Des dieux qui guident le soleil et pèsent les cœurs aux pharaons qui ont bâti les pyramides : trois mille ans d’Égypte en deux sous-collections.'
  });
  /* ---------- Duels : un héros, son monstre ----------
     Posséder les deux cartes d’un duel débloque le récit de leur affrontement (un « exploit »). */
  A.DUELS = [
    { id: 'gorgone', hero: 'heros-persee', monster: 'monstres-meduse', title: 'Persée tranche la tête de Méduse',
      text: 'Pour éviter son regard qui change en pierre, Persée ne la regarde que dans le reflet de son bouclier poli, offert par Athéna. Il lui tranche la tête pendant son sommeil et la glisse dans une besace magique. Du cou de la Gorgone jaillissent le cheval ailé Pégase et Chrysaor, le guerrier à l’épée d’or.' },
    { id: 'labyrinthe', hero: 'heros-thesee', monster: 'monstres-minotaure', title: 'Thésée entre dans le Labyrinthe',
      text: 'Athènes devait livrer régulièrement sept jeunes gens et sept jeunes filles au Minotaure, enfermé dans le Labyrinthe de Crète. Thésée se joignit à eux. La princesse Ariane lui confia une pelote de fil : il la déroula en avançant, tua le monstre au cœur du dédale, puis suivit le fil pour retrouver la sortie.' },
    { id: 'lerne', hero: 'heros-heracles', monster: 'monstres-hydre', title: 'Héraclès affronte l’Hydre',
      text: 'Pour chaque tête tranchée, deux autres repoussaient. Son neveu Iolaos eut l’idée de brûler chaque cou avec une torche pour empêcher la repousse. Héraclès enterra la dernière tête, immortelle, sous un énorme rocher, puis trempa ses flèches dans le sang empoisonné du monstre.' },
    { id: 'lycie', hero: 'heros-bellerophon', monster: 'monstres-chimere', title: 'Bellérophon abat la Chimère',
      text: 'Monté sur Pégase, Bellérophon attaqua la Chimère depuis le ciel, hors de portée de ses flammes. Selon un récit, il lui enfonça dans la gueule une lance garnie de plomb : le souffle brûlant du monstre fit fondre le métal, qui lui coula dans la gorge.' },
    { id: 'enigme', hero: 'heros-oedipe', monster: 'monstres-sphinx', title: 'Œdipe résout l’énigme',
      text: 'Le Sphinx demandait : quel être marche à quatre pattes le matin, sur deux à midi et sur trois le soir ? Œdipe répondit : l’homme, qui rampe enfant, marche debout adulte et s’aide d’un bâton dans sa vieillesse. Vaincu, le Sphinx se jeta du haut de son rocher, et Thèbes fut délivrée.' },
    { id: 'toison', hero: 'heros-jason', monster: 'monstres-dragon', title: 'Jason s’empare de la Toison d’or',
      text: 'Le dragon qui gardait la Toison ne dormait jamais. La magicienne Médée l’endormit avec un philtre et des incantations, pendant que Jason décrochait la toison d’or de l’arbre sacré. Les deux s’enfuirent aussitôt à bord du navire Argo, poursuivis par le roi de Colchide.' },
    { id: 'enfers', hero: 'heros-orphee', monster: 'monstres-cerbere', title: 'Orphée apaise Cerbère',
      text: 'Pour ramener son épouse Eurydice, morte d’une morsure de serpent, Orphée descendit aux Enfers. Au son de sa lyre, le chien à trois têtes se coucha, apaisé. Hadès accepta de rendre Eurydice, à condition qu’Orphée ne se retourne pas avant la sortie. Au dernier pas, il se retourna, et la perdit à jamais.' },
    { id: 'detroit', hero: 'heros-ulysse', monster: 'monstres-scylla', title: 'Ulysse passe le détroit',
      text: 'Ulysse devait choisir entre Charybde, un tourbillon capable d’engloutir son navire, et Scylla, un monstre à six têtes. Sur le conseil de la magicienne Circé, il longea la falaise de Scylla, sacrifiant six marins pour sauver les autres. C’est l’origine de l’expression « tomber de Charybde en Scylla ».' }
  ];
  A.GROUPS.push({
    id: 'solaire', name: 'L’Espace', subs: ['planetes', 'lunes', 'cosmos', 'astronautes', 'missions'], title: 'Explorateur de l’espace',
    tagline: 'Planètes, lunes, trous noirs, astronautes et missions : le ciel et ceux qui l’ont exploré.',
    description: 'Les planètes et leurs lunes, les objets les plus extrêmes de l’Univers, puis celles et ceux qui sont partis les explorer, en hommes ou en robots : cinq sous-collections, de Mercure aux trous noirs.'
  });
  A.GROUPS.push({
    id: 'aventure', name: 'Romans d’aventure', subs: ['detectives', 'verne', 'mousquetaires'], title: 'Grand Aventurier',
    tagline: 'Détectives, explorateurs et mousquetaires : les héros des grands romans populaires.',
    description: 'De Baker Street au Nautilus en passant par la cour de Louis XIII : les héros qui ont fait vibrer des générations de lecteurs, en trois sous-collections.'
  });
  A.GROUPS.push({
    id: 'contesmonde', name: 'Contes et merveilles', subs: ['contes', 'nuits', 'merveilleux', 'jungle'], title: 'Grand Conteur',
    tagline: 'Contes de Perrault et de Grimm, Mille et Une Nuits, Oz et la jungle de Kipling.',
    description: 'Des forêts de Perrault aux palais de Bagdad, du pays d’Oz à la jungle indienne : les contes qui ont bercé le monde entier, en quatre sous-collections.'
  });
  A.GROUPS.push({
    id: 'medieval', name: 'Légendes médiévales', subs: ['arthur', 'robin'], title: 'Chevalier de la Table ronde',
    tagline: 'Chevaliers de Camelot et hors-la-loi de Sherwood.',
    description: 'Épées magiques, enchanteurs et archers rebelles : les deux grandes légendes du Moyen Âge anglais, en deux sous-collections.'
  });
  A.GROUPS.push({
    id: 'fantastique', name: 'Récits fantastiques', subs: ['gothique', 'etranges'], title: 'Maître de l’étrange',
    tagline: 'Vampires, savants fous, créatures et vaisseaux fantômes.',
    description: 'Les monstres du roman gothique et les êtres étranges des légendes et des récits fantastiques, en deux sous-collections.'
  });
  A.GROUPS.push({
    id: 'pirates', name: 'L’Âge des pirates', subs: ['flibustiers', 'forbans'], title: 'Seigneur des sept mers',
    tagline: 'Les vrais pirates des Caraïbes et ceux des grands romans.',
    description: 'Barbe-Noire, Anne Bonny et Surcouf d’un côté, Long John Silver et le capitaine Crochet de l’autre : la piraterie, de l’histoire à la légende.'
  });
  /* Ragnarök : les affrontements de la fin du monde, débloqués en réunissant les deux adversaires */
  A.DUELS.push({ id: 'fin-odin', set: 'ragnarok', hero: 'nordique-odin', monster: 'creatures-fenrir', title: 'Odin affronte Fenrir',
    text: 'Au Ragnarök, Odin s’avancera le premier, coiffé d’or et armé de sa lance, contre le loup Fenrir enfin libéré. Le loup ouvrira une gueule qui touchera le ciel et la terre, et avalera le père des dieux. Son fils Vidar le vengera en lui déchirant la mâchoire.' });
  A.DUELS.push({ id: 'fin-thor', set: 'ragnarok', hero: 'nordique-thor', monster: 'creatures-jormungandr', title: 'Thor contre le serpent du monde',
    text: 'Le serpent de Midgard sortira de l’océan en crachant son venin sur le ciel et la mer. Thor l’abattra d’un coup de son marteau, mais fera neuf pas avant de tomber mort, empoisonné par son souffle.' });
  A.DUELS.push({ id: 'fin-freyr', set: 'ragnarok', hero: 'nordique-freyr', monster: 'jotnar-surt', title: 'Freyr face à Surt',
    text: 'Le géant de feu chevauchera à la tête des fils de Muspell. Freyr, qui avait donné son épée pour épouser Gerd, le combattra avec un simple bois de cerf, et tombera. Surt embrasera alors le monde entier.' });
  A.DUELS.push({ id: 'fin-tyr', set: 'ragnarok', hero: 'nordique-tyr', monster: 'creatures-garm', title: 'Týr contre Garm',
    text: 'Le chien Garm, libéré de ses chaînes, se jettera sur Týr, le dieu manchot qui avait sacrifié sa main pour enchaîner Fenrir. Les deux adversaires s’entretueront.' });
  A.DUELS.push({ id: 'fin-heimdall', set: 'ragnarok', hero: 'nordique-heimdall', monster: 'nordique-loki', title: 'Heimdall contre Loki',
    text: 'Heimdall soufflera dans son cor, Gjallarhorn, pour réveiller les dieux. Dans la bataille, il affrontera Loki, son vieil ennemi, venu à bord d’un navire chargé de morts : les deux s’entretueront.' });
  A.GROUPS.push({
    id: 'norrois', name: 'Mythologie nordique', subs: ['nordique', 'creatures', 'jotnar', 'mondes'], title: 'Survivant du Ragnarök',
    tagline: 'Dieux, créatures, géants et neuf mondes, jusqu’au Ragnarök.',
    description: 'D’Odin au serpent de Midgard, des géants de feu aux neuf mondes suspendus à l’arbre Yggdrasil : toute la mythologie des Vikings, en quatre sous-collections.'
  });
  A.GROUP = {};
  A.GROUPS.forEach(function (g) { A.GROUP[g.id] = g; });

  A.UPCOMING = [
    { id: 'japon',  name: 'Kami & Yōkai',       family: 'Mythologie japonaise',  motif: 'torii',  date: 'Printemps 2027', desc: 'Esprits, divinités et créatures du folklore japonais.' },
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
      ['artemis', 'Artémis', 'La Chasseresse', 86, 72, 80, 'BREL', 'Sœur jumelle d’Apollon, reine des forêts et de la lune.']

    ],
    heros: [
      ['heracles', 'Héraclès', 'Le Héros aux douze travaux', 95, 84, 62, 'BRELM', 'Le plus célèbre des héros grecs, d’une force sans égale.'],
      ['persee', 'Persée', 'Le Vainqueur de la Gorgone', 86, 78, 84, 'BRELM', 'Fils de Zeus et de Danaé, il trancha la tête de Méduse.'],
      ['thesee', 'Thésée', 'Le Héros d’Athènes', 88, 82, 84, 'BRELM', 'Prince d’Athènes, vainqueur du Minotaure.'],
      ['bellerophon', 'Bellérophon', 'Le Cavalier de Pégase', 84, 76, 78, 'BRE', 'Héros de Corinthe qui dompta Pégase.'],
      ['oedipe', 'Œdipe', 'Le Roi de Thèbes', 70, 72, 96, 'BREL', 'Il résolut l’énigme du Sphinx et devint roi de Thèbes.'],
      ['jason', 'Jason', 'Le Chef des Argonautes', 82, 80, 82, 'BREL', 'Chef de l’expédition des Argonautes, il conquit la Toison d’or.'],
      ['orphee', 'Orphée', 'Le Chantre de Thrace', 58, 70, 98, 'BREL', 'Musicien dont le chant charmait les bêtes et les pierres.'],
      ['ulysse', 'Ulysse', 'Le Rusé', 80, 82, 99, 'BRELMU', 'Roi d’Ithaque, héros de l’Odyssée.']
    ],
    monstres: [
      ['meduse', 'Méduse', 'La Gorgone', 81, 77, 69, 'BRELM', 'Son regard change en pierre quiconque ose la contempler.'],
      ['minotaure', 'Le Minotaure', 'Le Taureau de Crète', 94, 86, 48, 'BRELM', 'Mi-homme mi-taureau, enfermé dans le Labyrinthe.'],
      ['hydre', 'L’Hydre de Lerne', 'Le Serpent aux neuf têtes', 92, 90, 52, 'BREL', 'Serpent dont chaque tête tranchée repoussait en double.'],
      ['chimere', 'La Chimère', 'Le Monstre à trois natures', 90, 78, 58, 'BRE', 'Lion, chèvre et serpent à la fois, elle crachait le feu.'],
      ['sphinx', 'Le Sphinx', 'Le Gardien de Thèbes', 78, 80, 96, 'BREL', 'Monstre ailé qui posait une énigme aux voyageurs.'],
      ['dragon', 'Le Dragon de Colchide', 'Le Gardien de la Toison', 92, 94, 60, 'BRE', 'Serpent géant qui veillait sur la Toison d’or.'],
      ['cerbere', 'Cerbère', 'Le Chien des Enfers', 90, 92, 56, 'BRELMU', 'Chien à trois têtes, gardien de la porte des Enfers.'],
      ['scylla', 'Scylla', 'Le Monstre du détroit', 91, 80, 62, 'BRE', 'Monstre à six têtes tapi dans un détroit.']
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
    pharaons: [
      ['narmer', 'Narmer', 'L’Unificateur', 84, 80, 82, 'BRE', 'Premier roi à régner sur la Haute et la Basse-Égypte réunies, vers 3100 av. J.-C.'],
      ['kheops', 'Khéops', 'Le Bâtisseur de Gizeh', 78, 90, 84, 'BRELM', 'Pharaon de la IVe dynastie, il fit élever la Grande Pyramide.'],
      ['hatchepsout', 'Hatchepsout', 'La Reine-pharaon', 72, 84, 94, 'BRELMU', 'L’une des rares femmes à avoir régné en pharaon.'],
      ['thoutmosis', 'Thoutmôsis III', 'Le Conquérant', 92, 84, 82, 'BREL', 'Le plus grand chef de guerre de l’Égypte ancienne.'],
      ['akhenaton', 'Akhenaton', 'Le Roi hérétique', 60, 72, 96, 'BREL', 'Il imposa le culte d’un dieu unique, le disque solaire Aton.'],
      ['nefertiti', 'Néfertiti', 'La Belle est venue', 64, 78, 92, 'BRELM', 'Grande épouse royale d’Akhenaton, célèbre pour son buste.'],
      ['toutankhamon', 'Toutânkhamon', 'L’Enfant-roi', 58, 76, 80, 'BRELMU', 'Pharaon mort jeune, devenu célèbre par son tombeau intact.'],
      ['ramses', 'Ramsès II', 'Le Grand', 90, 88, 88, 'BRELMU', 'Pharaon bâtisseur au règne de soixante-sept ans.'],
      ['cleopatre', 'Cléopâtre VII', 'La Dernière Reine', 70, 80, 98, 'BRELMU', 'Dernière souveraine de l’Égypte des pharaons.']
    ],
    planetes: [
      ['mercure', 'Mercure', 'La Messagère pressée', 62, 70, 84, 'BREL', 'La plus petite planète et la plus proche du Soleil.'],
      ['venus', 'Vénus', 'L’Étoile du Berger', 88, 90, 76, 'BREL', 'La planète la plus chaude, voilée de nuages acides.'],
      ['terre', 'La Terre', 'La Planète bleue', 80, 86, 98, 'BRELMU', 'La seule planète connue à abriter la vie.'],
      ['mars', 'Mars', 'La Planète rouge', 84, 78, 82, 'BRELM', 'Planète désertique, rouge de poussière d’oxyde de fer.'],
      ['jupiter', 'Jupiter', 'La Géante', 98, 94, 80, 'BRELMU', 'La plus grande planète, une boule de gaz géante.'],
      ['saturne', 'Saturne', 'La Planète aux anneaux', 90, 88, 86, 'BRELM', 'Célèbre pour ses anneaux de glace et de roche.'],
      ['uranus', 'Uranus', 'La Planète couchée', 78, 84, 80, 'BRE', 'Géante de glace qui roule sur le côté.'],
      ['neptune', 'Neptune', 'La Planète des vents', 92, 82, 78, 'BREL', 'La plus lointaine des planètes, balayée par des vents extrêmes.']
    ],
    lunes: [
      ['lune', 'La Lune', 'L’Astre des nuits', 70, 84, 92, 'BRELMU', 'Seul satellite naturel de la Terre.'],
      ['phobos', 'Phobos', 'La Lune condamnée', 60, 58, 70, 'BRE', 'Petite lune de Mars, qui se rapproche lentement de sa planète.'],
      ['io', 'Io', 'La Lune volcanique', 94, 70, 74, 'BREL', 'L’astre le plus volcanique du système solaire.'],
      ['europe', 'Europe', 'L’Océan caché', 66, 88, 96, 'BRELM', 'Lune glacée qui cache un océan sous sa surface.'],
      ['ganymede', 'Ganymède', 'La Reine des lunes', 82, 92, 86, 'BRELM', 'La plus grande lune du système solaire.'],
      ['titan', 'Titan', 'La Lune aux lacs de méthane', 80, 90, 92, 'BRELM', 'Seule lune dotée d’une atmosphère épaisse.'],
      ['encelade', 'Encelade', 'Le Geyser glacé', 64, 76, 94, 'BREL', 'Petite lune de Saturne qui crache des jets d’eau.'],
      ['miranda', 'Miranda', 'La Lune rapiécée', 58, 72, 82, 'BRE', 'Petite lune d’Uranus au relief chaotique.'],
      ['triton', 'Triton', 'La Lune à contresens', 76, 80, 84, 'BRE', 'Grande lune de Neptune qui tourne à l’envers.']
    ],
    astronautes: [
      ['gagarine', 'Youri Gagarine', 'Le Premier Homme dans l’espace', 82, 80, 88, 'BRELMU', 'Premier humain à voyager dans l’espace, le 12 avril 1961.'],
      ['terechkova', 'Valentina Terechkova', 'La Mouette', 74, 82, 86, 'BRELM', 'Première femme dans l’espace, en 1963.'],
      ['leonov', 'Alexeï Leonov', 'Le Premier Marcheur de l’espace', 80, 84, 82, 'BREL', 'Premier humain à sortir dans le vide spatial, en 1965.'],
      ['armstrong', 'Neil Armstrong', 'Le Premier Pas', 84, 86, 90, 'BRELMU', 'Premier homme à marcher sur la Lune, en juillet 1969.'],
      ['aldrin', 'Buzz Aldrin', 'Le Pilote d’Eagle', 82, 82, 88, 'BREL', 'Deuxième homme à marcher sur la Lune.'],
      ['ride', 'Sally Ride', 'La Pionnière américaine', 72, 80, 94, 'BREL', 'Première Américaine dans l’espace, en 1983.'],
      ['chretien', 'Jean-Loup Chrétien', 'Le Premier Français', 78, 80, 86, 'BRE', 'Premier Français dans l’espace, en 1982.'],
      ['pesquet', 'Thomas Pesquet', 'Le Commandant de l’ISS', 80, 84, 90, 'BRELM', 'Premier Français à commander la Station spatiale internationale.']
    ],
    missions: [
      ['spoutnik', 'Spoutnik 1', 'Le Premier Satellite', 50, 60, 80, 'BREL', 'Premier satellite artificiel, lancé par l’URSS en 1957.'],
      ['apollo11', 'Apollo 11', 'La Mission lunaire', 90, 86, 92, 'BRELMU', 'Premier alunissage habité, en juillet 1969.'],
      ['voyager', 'Voyager 1', 'La Sonde interstellaire', 72, 88, 96, 'BRELM', 'L’objet humain le plus lointain, sorti du système solaire.'],
      ['hubble', 'Hubble', 'L’Œil dans l’espace', 66, 82, 94, 'BREL', 'Télescope spatial en orbite depuis 1990.'],
      ['iss', 'La Station spatiale internationale', 'La Maison en orbite', 70, 94, 88, 'BRELM', 'Laboratoire habité en permanence depuis l’an 2000.'],
      ['curiosity', 'Curiosity', 'Le Géologue de Mars', 74, 86, 90, 'BREL', 'Robot qui explore Mars depuis 2012.'],
      ['rosetta', 'Rosetta et Philae', 'La Chasseuse de comète', 68, 78, 92, 'BRE', 'Première mission à se poser sur une comète.'],
      ['webb', 'James Webb', 'Le Télescope des origines', 70, 84, 98, 'BRELMU', 'Le plus grand télescope spatial, lancé en 2021.']
    ],
    detectives: [
      ['holmes', 'Sherlock Holmes', 'Le Détective de Baker Street', 72, 80, 99, 'BRELMU', 'Le plus célèbre détective de la littérature.'],
      ['watson', 'Docteur Watson', 'Le Fidèle Narrateur', 74, 84, 82, 'BREL', 'Médecin militaire, ami et biographe de Sherlock Holmes.'],
      ['moriarty', 'Professeur Moriarty', 'Le Napoléon du crime', 80, 82, 98, 'BRELM', 'Génie des mathématiques devenu maître du crime.'],
      ['adler', 'Irene Adler', 'La Femme', 66, 78, 96, 'BREL', 'La seule personne à avoir déjoué Sherlock Holmes.'],
      ['lestrade', 'Inspecteur Lestrade', 'L’Homme de Scotland Yard', 70, 82, 70, 'BRE', 'Inspecteur de Scotland Yard, rival et allié de Holmes.'],
      ['lupin', 'Arsène Lupin', 'Le Gentleman cambrioleur', 82, 80, 98, 'BRELMU', 'Voleur élégant et insaisissable, maître du déguisement.'],
      ['rouletabille', 'Joseph Rouletabille', 'Le Reporter détective', 72, 74, 94, 'BREL', 'Jeune reporter qui résout les mystères les plus fous.'],
      ['dupin', 'Auguste Dupin', 'Le Premier Détective', 62, 72, 97, 'BRE', 'Le premier détective de la littérature, imaginé par Edgar Poe.']
    ],
    verne: [
      ['nemo', 'Capitaine Nemo', 'Le Maître du Nautilus', 86, 88, 96, 'BRELMU', 'Mystérieux capitaine du sous-marin Nautilus.'],
      ['fogg', 'Phileas Fogg', 'Le Gentleman ponctuel', 68, 84, 90, 'BRELM', 'Gentleman anglais qui fit le tour du monde en 80 jours.'],
      ['passepartout', 'Passepartout', 'Le Valet aventurier', 76, 70, 74, 'BRE', 'Domestique français, fidèle compagnon de Phileas Fogg.'],
      ['strogoff', 'Michel Strogoff', 'Le Courrier du tsar', 90, 86, 80, 'BREL', 'Courrier du tsar lancé à travers la Sibérie en guerre.'],
      ['lidenbrock', 'Professeur Lidenbrock', 'Le Voyageur souterrain', 70, 78, 94, 'BRE', 'Savant parti pour le centre de la Terre.'],
      ['barbicane', 'Impey Barbicane', 'Le Président du Gun Club', 80, 78, 88, 'BRE', 'Président d’un club d’artilleurs qui vise la Lune.'],
      ['robur', 'Robur le Conquérant', 'Le Maître du ciel', 84, 80, 92, 'BREL', 'Inventeur d’une machine volante plus lourde que l’air.'],
      ['cyrus', 'Cyrus Smith', 'L’Ingénieur naufragé', 76, 84, 96, 'BREL', 'Ingénieur qui recrée la civilisation sur une île déserte.']
    ],
    mousquetaires: [
      ['dartagnan', 'D’Artagnan', 'Le Cadet de Gascogne', 90, 80, 86, 'BRELMU', 'Jeune Gascon devenu le quatrième mousquetaire.'],
      ['athos', 'Athos', 'Le Noble mélancolique', 86, 84, 88, 'BREL', 'Le plus âgé et le plus noble des trois mousquetaires.'],
      ['porthos', 'Porthos', 'Le Colosse', 94, 86, 60, 'BRE', 'Mousquetaire à la force herculéenne et au goût du panache.'],
      ['aramis', 'Aramis', 'Le Mousquetaire abbé', 82, 78, 92, 'BREL', 'Mousquetaire élégant qui rêve d’entrer dans les ordres.'],
      ['milady', 'Milady de Winter', 'L’Espionne du cardinal', 78, 76, 96, 'BRELM', 'Espionne redoutable au service de Richelieu.'],
      ['richelieu', 'Le Cardinal de Richelieu', 'L’Éminence rouge', 70, 88, 97, 'BREL', 'Ministre tout-puissant de Louis XIII, adversaire des mousquetaires.'],
      ['montecristo', 'Le Comte de Monte-Cristo', 'Le Vengeur', 84, 86, 98, 'BRELMU', 'Marin trahi qui revient, riche et méconnaissable, pour se venger.'],
      ['cyrano', 'Cyrano de Bergerac', 'Le Panache', 88, 76, 94, 'BRELM', 'Poète bretteur au nez immense et au cœur généreux.']
    ],
    nuits: [
      ['sheherazade', 'Shéhérazade', 'La Conteuse des mille nuits', 58, 80, 99, 'BRELMU', 'Conteuse qui sauva sa vie par ses histoires.'],
      ['shahryar', 'Le Roi Shahryar', 'Le Roi trahi', 84, 82, 70, 'BRE', 'Roi qui se vengeait d’une trahison sur toutes les femmes.'],
      ['aladdin', 'Aladdin', 'Le Garçon à la lampe', 72, 70, 88, 'BRELMU', 'Garçon pauvre devenu prince grâce à une lampe magique.'],
      ['genie', 'Le Génie de la lampe', 'Le Serviteur enchaîné', 96, 88, 90, 'BRELM', 'Génie tout-puissant prisonnier d’une lampe.'],
      ['alibaba', 'Ali Baba', 'Le Bûcheron chanceux', 66, 72, 80, 'BREL', 'Bûcheron qui découvrit la caverne des quarante voleurs.'],
      ['morgiane', 'Morgiane', 'La Servante rusée', 76, 74, 96, 'BREL', 'Servante d’Ali Baba qui déjoua les quarante voleurs.'],
      ['sinbad', 'Sinbad le marin', 'Le Navigateur', 82, 80, 84, 'BRELM', 'Marchand de Bagdad aux sept voyages extraordinaires.'],
      ['rokh', 'L’Oiseau Rokh', 'Le Géant des airs', 94, 86, 56, 'BRE', 'Oiseau gigantesque capable d’emporter un éléphant.']
    ],
    merveilleux: [
      ['alice', 'Alice', 'Au pays des merveilles', 60, 70, 94, 'BRELMU', 'Curieuse et logique, elle suit un lapin blanc au fond d’un terrier.'],
      ['peterpan', 'Peter Pan', 'L’Enfant qui ne grandit pas', 76, 68, 84, 'BRELM', 'Chef des Garçons perdus, il vole jusqu’au Pays imaginaire.'],
      ['dorothy', 'Dorothy', 'La Fille du Kansas', 60, 78, 86, 'BRELMU', 'Petite fille emportée par une tornade au pays d’Oz.'],
      ['epouvantail', 'L’Épouvantail', 'Celui qui voulait un cerveau', 50, 70, 88, 'BREL', 'Épouvantail de paille qui rêve d’avoir un cerveau.'],
      ['ferblanc', 'Le Bûcheron de fer-blanc', 'Celui qui voulait un cœur', 82, 90, 70, 'BREL', 'Bûcheron de métal qui rêve d’avoir un cœur.'],
      ['lion', 'Le Lion poltron', 'Celui qui voulait du courage', 88, 80, 62, 'BRE', 'Lion peureux qui rêve d’avoir du courage.'],
      ['sorciere', 'La Sorcière de l’Ouest', 'La Tyranne des Winkies', 86, 74, 88, 'BRELM', 'Méchante sorcière qui règne sur l’ouest d’Oz.'],
      ['pinocchio', 'Pinocchio', 'Le Pantin de bois', 64, 72, 78, 'BRELMU', 'Pantin de bois qui rêve de devenir un vrai garçon.'],
      ['geppetto', 'Geppetto', 'Le Menuisier', 54, 76, 84, 'BRE', 'Vieux menuisier qui sculpta Pinocchio.'],
      ['fee', 'La Fée aux cheveux bleus', 'La Protectrice', 60, 86, 94, 'BREL', 'Fée bienveillante qui veille sur Pinocchio.']
    ],
    jungle: [
      ['mowgli', 'Mowgli', 'Le Petit d’homme', 76, 74, 88, 'BRELMU', 'Enfant élevé par les loups dans la jungle indienne.'],
      ['baloo', 'Baloo', 'Le Maître de la Loi', 86, 90, 84, 'BREL', 'Vieil ours sage qui enseigne la Loi de la jungle.'],
      ['bagheera', 'Bagheera', 'La Panthère noire', 90, 80, 92, 'BRELM', 'Panthère noire rusée, protectrice de Mowgli.'],
      ['sherekhan', 'Shere Khan', 'Le Tigre boiteux', 96, 82, 74, 'BRELMU', 'Tigre redoutable, ennemi juré de Mowgli.'],
      ['kaa', 'Kaa', 'Le Python des rochers', 92, 88, 90, 'BREL', 'Immense python, vieux et sage.'],
      ['akela', 'Akela', 'Le Grand Loup solitaire', 88, 84, 82, 'BRE', 'Chef de la meute des loups de Seeonee.'],
      ['hathi', 'Hathi', 'Le Maître de la jungle', 94, 96, 80, 'BRE', 'Vieil éléphant qui proclame la trêve de l’eau.'],
      ['rikki', 'Rikki-tikki-tavi', 'La Mangouste', 80, 70, 84, 'BREL', 'Jeune mangouste qui protège une famille des cobras.']
    ],
    arthur: [
      ['arthur', 'Le Roi Arthur', 'Le Roi de Camelot', 90, 90, 88, 'BRELMU', 'Roi légendaire de Bretagne, fondateur de la Table ronde.'],
      ['merlin', 'Merlin', 'L’Enchanteur', 66, 84, 99, 'BRELMU', 'Enchanteur et prophète, conseiller du roi Arthur.'],
      ['lancelot', 'Lancelot du Lac', 'Le Meilleur Chevalier', 96, 88, 78, 'BRELM', 'Le plus valeureux des chevaliers de la Table ronde.'],
      ['guenievre', 'Guenièvre', 'La Reine de Camelot', 62, 82, 90, 'BREL', 'Épouse du roi Arthur, aimée de Lancelot.'],
      ['morgane', 'La Fée Morgane', 'La Magicienne d’Avalon', 78, 80, 96, 'BRELM', 'Demi-sœur d’Arthur, puissante magicienne.'],
      ['perceval', 'Perceval', 'Le Chevalier naïf', 84, 80, 76, 'BREL', 'Jeune chevalier naïf, le premier à approcher le Graal.'],
      ['damedulac', 'La Dame du Lac', 'La Fée des eaux', 64, 86, 96, 'BREL', 'Fée qui remit l’épée à Arthur et éleva Lancelot.'],
      ['mordred', 'Mordred', 'Le Traître', 88, 78, 82, 'BRE', 'Neveu et fils d’Arthur, qui provoqua la chute de Camelot.']
    ],
    robin: [
      ['robin', 'Robin des Bois', 'Le Prince des voleurs', 88, 80, 90, 'BRELMU', 'Hors-la-loi qui vole les riches pour donner aux pauvres.'],
      ['marianne', 'Lady Marianne', 'La Compagne de Sherwood', 70, 78, 90, 'BREL', 'Jeune noble, amour et alliée de Robin des Bois.'],
      ['petitjean', 'Petit Jean', 'Le Géant au bâton', 94, 88, 66, 'BREL', 'Colosse au bâton, bras droit de Robin des Bois.'],
      ['tuck', 'Frère Tuck', 'Le Moine joyeux', 86, 84, 74, 'BRE', 'Moine gourmand et bagarreur de la bande de Robin.'],
      ['sherif', 'Le Shérif de Nottingham', 'L’Ennemi juré', 82, 84, 80, 'BRELM', 'Officier cruel qui pourchasse Robin des Bois.'],
      ['scarlet', 'Will Scarlet', 'L’Escrimeur', 86, 76, 78, 'BRE', 'Fine lame de la bande de Robin des Bois.'],
      ['alan', 'Alan-a-Dale', 'Le Ménestrel', 62, 70, 90, 'BRE', 'Ménestrel de la bande, sauvé par Robin le jour de ses noces.'],
      ['prince', 'Le Prince Jean', 'L’Usurpateur', 72, 82, 84, 'BREL', 'Frère du roi Richard, qui gouverne en son absence.']
    ],
    etranges: [
      ['invisible', 'L’Homme invisible', 'Le Savant effacé', 78, 84, 92, 'BRELM', 'Savant devenu invisible, et peu à peu fou.'],
      ['moreau', 'Le Docteur Moreau', 'Le Savant de l’île', 70, 80, 94, 'BREL', 'Savant qui transforme des animaux en créatures humaines.'],
      ['horla', 'Le Horla', 'La Présence invisible', 84, 88, 96, 'BREL', 'Être invisible qui hante le narrateur de Maupassant.'],
      ['quasimodo', 'Quasimodo', 'Le Sonneur de Notre-Dame', 92, 90, 70, 'BRELMU', 'Sonneur de cloches bossu de Notre-Dame de Paris.'],
      ['mobydick', 'Moby Dick', 'La Baleine blanche', 98, 94, 64, 'BRELM', 'Cachalot blanc géant, obsession du capitaine Achab.'],
      ['golem', 'Le Golem', 'Le Gardien d’argile', 96, 98, 50, 'BREL', 'Colosse d’argile animé par un rabbin de Prague.'],
      ['hollandais', 'Le Hollandais volant', 'Le Vaisseau fantôme', 86, 92, 80, 'BREL', 'Navire fantôme condamné à errer sur les mers.'],
      ['kraken', 'Le Kraken', 'Le Monstre des profondeurs', 99, 90, 54, 'BRE', 'Monstre marin géant des légendes scandinaves.']
    ],
    flibustiers: [
      ['barbenoire', 'Barbe-Noire', 'La Terreur des Caraïbes', 96, 84, 80, 'BRELMU', 'Le plus célèbre pirate de l’âge d’or de la piraterie.'],
      ['bonny', 'Anne Bonny', 'La Pirate irlandaise', 86, 78, 84, 'BRELM', 'L’une des rares femmes pirates célèbres.'],
      ['read', 'Mary Read', 'La Combattante déguisée', 88, 80, 80, 'BREL', 'Femme pirate qui vécut des années déguisée en homme.'],
      ['morgan', 'Henry Morgan', 'Le Corsaire devenu gouverneur', 88, 86, 88, 'BREL', 'Corsaire gallois qui mit à sac Panama.'],
      ['roberts', 'Bartholomew Roberts', 'Black Bart', 92, 86, 86, 'BRELM', 'Le pirate le plus redoutable de son temps.'],
      ['labuse', 'La Buse', 'Le Pirate au trésor perdu', 84, 80, 92, 'BRELMU', 'Pirate français dont le trésor n’a jamais été retrouvé.'],
      ['omalley', 'Grace O’Malley', 'La Reine pirate', 84, 86, 90, 'BREL', 'Cheffe de clan irlandaise qui tint tête aux Anglais.'],
      ['surcouf', 'Robert Surcouf', 'Le Roi des corsaires', 90, 84, 90, 'BRELM', 'Corsaire malouin, terreur des navires anglais.']
    ],
    forbans: [
      ['silver', 'Long John Silver', 'Le Cuisinier à la jambe de bois', 86, 80, 94, 'BRELMU', 'Pirate rusé et charismatique de L’Île au trésor.'],
      ['jim', 'Jim Hawkins', 'Le Mousse', 70, 72, 86, 'BREL', 'Jeune garçon héros de L’Île au trésor.'],
      ['flint', 'Le Capitaine Flint', 'Le Pirate légendaire', 94, 82, 86, 'BRELM', 'Pirate redouté qui enterra son trésor sur une île.'],
      ['bengunn', 'Ben Gunn', 'Le Naufragé', 64, 76, 80, 'BRE', 'Ancien pirate abandonné trois ans sur l’île au trésor.'],
      ['billybones', 'Billy Bones', 'Le Vieux Loup de mer', 82, 74, 70, 'BRE', 'Vieux pirate qui cachait la carte du trésor.'],
      ['crochet', 'Le Capitaine Crochet', 'L’Ennemi de Peter Pan', 90, 82, 88, 'BRELMU', 'Capitaine pirate à la main de fer, ennemi de Peter Pan.'],
      ['smee', 'Smee', 'Le Maître d’équipage', 60, 70, 66, 'BRE', 'Maître d’équipage débonnaire du capitaine Crochet.'],
      ['blood', 'Capitaine Blood', 'Le Médecin pirate', 88, 84, 92, 'BRELM', 'Médecin injustement déporté devenu capitaine pirate.']
    ],
    cosmos: [
      ['sgra', 'Sagittarius A*', 'Le Cœur de la Voie lactée', 96, 94, 90, 'BRELMU', 'Trou noir géant au centre de notre galaxie.'],
      ['m87', 'M87*', 'Le Premier Trou noir photographié', 98, 92, 88, 'BRELM', 'Premier trou noir dont on ait obtenu une image, en 2019.'],
      ['ton618', 'TON 618', 'Le Monstre ultramassif', 99, 96, 80, 'BRELMU', 'L’un des trous noirs les plus massifs connus.'],
      ['stephenson', 'Stephenson 2-18', 'L’Étoile démesurée', 90, 88, 76, 'BREL', 'L’une des plus grandes étoiles connues.'],
      ['betelgeuse', 'Bételgeuse', 'L’Épaule d’Orion', 88, 80, 82, 'BRELM', 'Supergéante rouge qui explosera un jour en supernova.'],
      ['r136a1', 'R136a1', 'La Plus Massive', 94, 84, 80, 'BREL', 'L’étoile la plus massive connue.'],
      ['magnetar', 'SGR 1806-20', 'Le Magnétar', 97, 90, 70, 'BREL', 'Étoile morte au champ magnétique monstrueux.'],
      ['crabe', 'La Nébuleuse du Crabe', 'La Supernova de l’an 1054', 80, 86, 90, 'BRELM', 'Reste d’une étoile dont l’explosion fut vue en 1054.'],
      ['bouvier', 'Le Grand Vide du Bouvier', 'Le Désert cosmique', 60, 99, 88, 'BRE', 'Immense région presque vide de galaxies.'],
      ['oumuamua', 'ʻOumuamua', 'Le Messager venu d’ailleurs', 70, 76, 94, 'BREL', 'Premier objet venu d’un autre système stellaire, repéré en 2017.']
    ],
    creatures: [
      ['jormungandr', 'Jörmungandr', 'Le Serpent de Midgard', 97, 96, 62, 'BRELMU', 'Serpent si long qu’il entoure le monde et se mord la queue.'],
      ['fenrir', 'Fenrir', 'Le Loup colossal', 96, 84, 56, 'BREL', 'Enchaîné par les dieux, il attend le Ragnarök.'],
      ['sleipnir', 'Sleipnir', 'Le Cheval à huit jambes', 88, 84, 80, 'BRELM', 'Cheval à huit jambes, monture d’Odin.'],
      ['nidhogg', 'Nidhögg', 'Le Dragon des racines', 94, 88, 70, 'BREL', 'Dragon qui ronge les racines de l’arbre du monde.'],
      ['ratatosk', 'Ratatosk', 'Le Messager d’Yggdrasil', 50, 62, 86, 'BRE', 'Écureuil qui sème la discorde le long de l’arbre du monde.'],
      ['huginmunin', 'Hugin et Munin', 'Les Corbeaux d’Odin', 60, 70, 98, 'BREL', 'Les deux corbeaux qui rapportent à Odin les nouvelles du monde.'],
      ['garm', 'Garm', 'Le Chien des enfers', 90, 86, 52, 'BRE', 'Chien monstrueux qui garde l’entrée du royaume des morts.'],
      ['audhumla', 'Audhumla', 'La Vache primordiale', 40, 90, 80, 'BRE', 'Vache des origines qui nourrit le premier géant.']
    ],
    jotnar: [
      ['surt', 'Surt', 'Le Géant de feu', 98, 88, 74, 'BRELMU', 'Seigneur de Muspellheim, qui embrasera le monde au Ragnarök.'],
      ['hel', 'Hel', 'La Reine des morts', 80, 92, 90, 'BRELM', 'Fille de Loki, souveraine du royaume des morts.'],
      ['angrboda', 'Angrboda', 'La Mère des monstres', 72, 80, 92, 'BREL', 'Géante, mère du loup Fenrir, du serpent du monde et de Hel.'],
      ['skadi', 'Skadi', 'La Chasseresse des neiges', 84, 84, 82, 'BREL', 'Géante des montagnes, déesse de l’hiver et de la chasse à ski.'],
      ['thrym', 'Thrym', 'Le Voleur du marteau', 90, 82, 58, 'BRE', 'Roi des géants qui vola le marteau de Thor.'],
      ['utgardaloki', 'Útgarda-Loki', 'Le Roi des illusions', 78, 84, 98, 'BREL', 'Roi géant qui trompa Thor par la magie.'],
      ['hrungnir', 'Hrungnir', 'Le Géant de pierre', 96, 98, 50, 'BRE', 'Géant au cœur et à la tête de pierre, défié par Thor.'],
      ['aegir', 'Ægir', 'Le Seigneur des vagues', 82, 90, 84, 'BRE', 'Géant de la mer, qui brasse la bière des dieux.']
    ],
    mondes: [
      ['asgard', 'Asgard', 'La Citadelle des dieux', 90, 98, 92, 'BRELMU', 'Le monde des dieux Ases, perché au sommet de l’arbre du monde.'],
      ['midgard', 'Midgard', 'Le Monde des hommes', 70, 80, 86, 'BRELM', 'Le monde des humains, au centre des neuf mondes.'],
      ['jotunheim', 'Jötunheim', 'Le Pays des géants', 88, 86, 74, 'BREL', 'Monde montagneux et glacé des géants.'],
      ['vanaheim', 'Vanaheim', 'Le Monde des Vanes', 72, 84, 90, 'BRE', 'Monde des Vanes, dieux de la fertilité.'],
      ['alfheim', 'Alfheim', 'Le Pays des elfes', 66, 80, 94, 'BRE', 'Monde lumineux des elfes de lumière.'],
      ['nidavellir', 'Nidavellir', 'Les Forges des nains', 84, 92, 82, 'BREL', 'Monde souterrain où les nains forgent les trésors des dieux.'],
      ['muspellheim', 'Muspellheim', 'Le Monde du feu', 96, 80, 70, 'BREL', 'Monde de flammes, au sud du gouffre originel.'],
      ['niflheim', 'Niflheim', 'Le Monde des brumes', 60, 96, 80, 'BRE', 'Monde de glace et de brouillard, au nord du gouffre originel.'],
      ['helheim', 'Helheim', 'Le Royaume des morts', 78, 94, 84, 'BREL', 'Royaume froid où vont les morts qui ne périssent pas au combat.']
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
      ['chaperon', 'Le Petit Chaperon rouge', 'Promeneuse des bois', 54, 64, 80, 'BREL', 'Une galette, un petit pot de beurre et une rencontre inattendue.'],
      ['chatbotte', 'Le Chat botté', 'Le Rusé', 70, 66, 95, 'BREL', 'Par la seule force de son esprit, il fait la fortune de son maître.'],
      ['belle', 'La Belle au bois dormant', 'Endormie depuis cent ans', 50, 90, 78, 'BRE', 'Un fuseau, une malédiction, et un château gagné par les ronces.'],
      ['blancheneige', 'Blanche-Neige', 'Princesse de la forêt', 56, 74, 82, 'BREL', 'Réfugiée chez sept nains, elle échappe à la jalousie d’une reine.'],
      ['poucet', 'Le Petit Poucet', 'Le Plus Petit des sept', 58, 70, 94, 'BREL', 'Le plus petit de sept frères, qui sauve les siens de l’ogre.'],
      ['barbebleue', 'La Barbe bleue', 'Le Mari meurtrier', 86, 80, 82, 'BREL', 'Riche seigneur dont un petit cabinet cache un terrible secret.'],
      ['hansel', 'Hansel et Gretel', 'Les Enfants de la forêt', 64, 72, 90, 'BREL', 'Frère et sœur qui échappent à une sorcière gourmande d’enfants.'],
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
      ['baldr', 'Baldr', 'Le Dieu lumineux', 72, 90, 92, 'BRELM', 'Le plus beau et le plus aimé des dieux, dont la mort annonce le Ragnarök.'],
      ['freyr', 'Freyr', 'Le Seigneur des moissons', 84, 82, 84, 'BREL', 'Dieu de la fertilité, du soleil et de la paix.'],
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
    'grece-hera': 'Reine des dieux et protectrice du mariage, elle ne pardonne jamais les infidélités de [[zeus]]. Sa jalousie poursuivit [[heros:heracles]], fils de son époux, depuis le berceau jusqu’à ses douze travaux.',
    'grece-poseidon': 'Frère de [[zeus]], il reçut les mers en partage : son trident soulève les tempêtes et fait trembler la terre. Il disputa à [[athena]] la protection d’Athènes, et perdit : la cité préféra son olivier.',
    'grece-hades': 'Frère aîné de [[zeus]] et de [[poseidon]], il règne sur le monde souterrain, gardien silencieux des âmes. Rares sont les vivants à en être revenus : [[heros:heracles]] y descendit pour capturer Cerbère.',
    'grece-athena': 'Née tout armée du front de [[zeus]], elle est la déesse de la sagesse et de la stratégie. Elle guida [[heros:heracles]] dans ses travaux et offrit à Persée le bouclier poli qui lui permit de vaincre [[monstres:meduse]].',
    'grece-apollon': 'Dieu de la lumière, des arts et des oracles, il parle aux hommes par la voix de la Pythie de Delphes. Fils de [[zeus]], il est le frère jumeau d’[[artemis]], née juste avant lui sur l’île de Délos.',
    'grece-artemis': 'Chasseresse des forêts et protectrice des jeunes filles, elle veille la nuit sous la lune. Jumelle d’[[apollon]], elle aurait aidé sa mère à le mettre au monde, à peine née elle-même.',
    'monstres-meduse': 'Seule mortelle des trois Gorgones, elle change en pierre quiconque croise son regard. Sa malédiction lui vient d’[[grece:athena]], offensée que [[grece:poseidon]] l’ait séduite dans son temple.',
    'heros-persee': 'Fils de [[grece:zeus|Zeus]] et de Danaé, il fut envoyé par un roi jaloux chercher la tête de [[monstres:meduse|Méduse]]. Avec les sandales ailées d’Hermès, le casque d’Hadès et le bouclier d’[[grece:athena|Athéna]], il réussit l’exploit.',
    'heros-thesee': 'Fils du roi d’Athènes Égée, il partit pour la Crète avec les jeunes gens livrés au [[monstres:minotaure|Minotaure]]. Guidé par le fil d’Ariane, il tua le monstre et sortit du Labyrinthe.',
    'heros-bellerophon': 'Héros de Corinthe, il dompta le cheval ailé Pégase grâce à une bride d’or offerte par [[grece:athena|Athéna]], puis abattit la [[monstres:chimere|Chimère]] depuis les airs.',
    'heros-oedipe': 'Abandonné à sa naissance, il grandit loin de Thèbes sans connaître ses vrais parents. En résolvant l’énigme du [[monstres:sphinx|Sphinx]], il délivra la ville et en devint le roi.',
    'heros-jason': 'Pour reprendre le trône de son père, il dut rapporter la Toison d’or, gardée en Colchide par un [[monstres:dragon|dragon]]. Il réunit pour cela les plus grands héros de son temps à bord du navire Argo, dont [[heracles]] et [[orphee]].',
    'heros-orphee': 'Fils de la muse Calliope, il jouait de la lyre si merveilleusement que les animaux, les arbres et les pierres le suivaient. Il descendit aux Enfers chercher son épouse Eurydice, et sa musique apaisa même [[monstres:cerbere|Cerbère]].',
    'heros-ulysse': 'Roi d’Ithaque, il imagina le cheval de bois qui permit aux Grecs de prendre Troie. Son retour chez lui dura dix ans : il affronta le cyclope [[geants:polypheme|Polyphème]], la magicienne Circé, les Sirènes et [[monstres:scylla|Scylla]].',
    'monstres-minotaure': 'Né des amours de la reine Pasiphaé et d’un taureau envoyé par [[grece:poseidon|Poséidon]], il avait un corps d’homme et une tête de taureau. Le roi Minos l’enferma dans le Labyrinthe construit par Dédale, où il dévorait les jeunes Athéniens livrés en tribut.',
    'monstres-hydre': 'Ce serpent d’eau vivait dans les marais de Lerne, près d’Argos. Son haleine était mortelle, et chaque tête coupée repoussait en double. L’affronter fut le deuxième des douze travaux d’[[heros:heracles|Héraclès]].',
    'monstres-chimere': 'Elle avait la tête d’un lion, le corps d’une chèvre et la queue d’un serpent, et soufflait des flammes. Elle ravageait la Lycie jusqu’à ce que [[heros:bellerophon|Bellérophon]] l’abatte du haut de Pégase.',
    'monstres-sphinx': 'Ce monstre à corps de lion, ailes d’oiseau et visage de femme avait été envoyé contre Thèbes. Il dévorait ceux qui ne trouvaient pas la réponse à son énigme, jusqu’à ce qu’[[heros:oedipe|Œdipe]] la résolve.',
    'monstres-dragon': 'Ce serpent immense, qui ne dormait jamais, était enroulé autour du chêne où pendait la Toison d’or, dans un bois sacré d’Arès. [[heros:jason|Jason]] ne le vainquit qu’avec l’aide de la magicienne Médée.',
    'monstres-cerbere': 'Ce chien à trois têtes, à queue de serpent, gardait l’entrée du royaume d’[[grece:hades|Hadès]] : il laissait entrer les morts mais empêchait quiconque d’en sortir. La lyre d’[[heros:orphee|Orphée]] parvint pourtant à l’apaiser.',
    'monstres-scylla': 'Ancienne nymphe changée en monstre, elle vivait dans une grotte au-dessus d’un détroit, face au tourbillon de Charybde. Ses six têtes de chien happaient les marins qui passaient, comme ceux d’[[heros:ulysse|Ulysse]].',
    'planetes-mercure': 'Elle fait le tour du Soleil en 88 jours seulement, plus vite que toute autre planète. Sans véritable atmosphère pour retenir la chaleur, sa surface passe d’environ 430 °C le jour à −180 °C la nuit.',
    'planetes-venus': 'Presque aussi grande que la Terre, elle est enveloppée d’une épaisse atmosphère de gaz carbonique qui piège la chaleur : il y fait environ 465 °C, assez pour faire fondre le plomb. Ses nuages sont faits d’acide sulfurique.',
    'planetes-terre': 'Troisième planète à partir du Soleil, c’est la seule où l’on connaisse de l’eau liquide en surface, qui en recouvre environ 71 %. Son atmosphère et son champ magnétique la protègent des rayonnements du Soleil. Elle a un seul satellite naturel, la [[lunes:lune|Lune]].',
    'planetes-mars': 'Sa couleur rouge vient de l’oxyde de fer, la rouille, qui couvre son sol. Elle abrite le plus grand volcan connu du système solaire, Olympus Mons, haut d’environ 22 kilomètres, près de trois fois l’Everest.',
    'planetes-jupiter': 'Plus de mille Terres pourraient tenir à l’intérieur. Faite surtout d’hydrogène et d’hélium, elle n’a pas de surface solide. Sa Grande Tache rouge est une tempête plus large que la Terre, observée depuis près de deux siècles.',
    'planetes-saturne': 'Ses anneaux s’étendent sur des centaines de milliers de kilomètres, mais leur épaisseur ne dépasse souvent pas quelques dizaines de mètres. Ils sont faits de blocs de glace et de roche. Sa densité est si faible qu’elle flotterait dans une baignoire assez grande.',
    'planetes-uranus': 'Son axe est incliné de 98 degrés : elle tourne presque couchée sur son orbite, sans doute après une collision géante dans sa jeunesse. Chacun de ses pôles connaît ainsi environ quarante-deux ans de jour, puis quarante-deux ans de nuit.',
    'planetes-neptune': 'À environ 4,5 milliards de kilomètres du Soleil, elle met près de 165 ans à en faire le tour. Ses vents, les plus rapides du système solaire, dépassent 2 000 km/h.',
    'lunes-lune': 'Elle s’est sans doute formée il y a environ 4,5 milliards d’années, quand un astre de la taille de Mars a percuté la jeune [[planetes:terre|Terre]]. Elle nous montre toujours la même face, car elle tourne sur elle-même au même rythme qu’autour de nous.',
    'lunes-phobos': 'Ce bloc de roche irrégulier d’environ 22 kilomètres tourne si près de [[planetes:mars|Mars]] qu’il en fait le tour trois fois par jour. Il se rapproche de la planète d’environ deux mètres par siècle.',
    'lunes-io': 'Prise entre l’attraction de [[planetes:jupiter|Jupiter]] et celle de ses voisines, elle est sans cesse étirée et comprimée, ce qui la chauffe de l’intérieur. Plus de 400 volcans actifs parsèment sa surface jaune et orangée de soufre.',
    'lunes-europe': 'Sous une croûte de glace épaisse de plusieurs kilomètres, cette lune de [[planetes:jupiter|Jupiter]] cache un océan d’eau salée qui contiendrait plus d’eau que tous les océans de la Terre. C’est l’un des endroits où l’on espère trouver une forme de vie hors de la Terre.',
    'lunes-ganymede': 'Plus grande que la planète [[planetes:mercure|Mercure]], c’est la plus grande lune du système solaire et la seule à posséder son propre champ magnétique. Elle cacherait, elle aussi, un océan sous sa glace.',
    'lunes-titan': 'Plus grosse que Mercure, la plus grande lune de [[planetes:saturne|Saturne]] est enveloppée d’une épaisse atmosphère orangée. Il y pleut du méthane, qui remplit des lacs et des mers : c’est le seul astre connu, hors de la Terre, à porter des liquides stables à sa surface.',
    'lunes-encelade': 'Cette petite lune de [[planetes:saturne|Saturne]], d’à peine 500 kilomètres de diamètre, est couverte d’une glace si pure qu’elle renvoie presque toute la lumière du Soleil. Près de son pôle sud, des geysers projettent dans l’espace l’eau d’un océan caché.',
    'lunes-miranda': 'Cette petite lune d’[[planetes:uranus|Uranus]] semble faite de morceaux mal assemblés : plaines, sillons et falaises se juxtaposent sans ordre. Sa falaise de Verona Rupes, haute de plusieurs kilomètres, compte parmi les plus hautes du système solaire.',
    'lunes-triton': 'La plus grande lune de [[planetes:neptune|Neptune]] tourne autour de sa planète dans le sens inverse de la rotation de celle-ci, un cas unique pour une lune de cette taille. C’est sans doute un astre venu de la ceinture de Kuiper, capturé par Neptune.',
    'astronautes-gagarine': 'Le 12 avril 1961, à bord de Vostok 1, ce pilote soviétique de 27 ans fit le tour de la Terre en 108 minutes. Au décollage, il lança simplement : « Poïekhali ! », « On y va ! ».',
    'astronautes-terechkova': 'Ancienne ouvrière du textile et parachutiste amatrice, elle s’envola le 16 juin 1963 à bord de Vostok 6 et passa près de trois jours en orbite, seule. Son indicatif radio était « Tchaïka », la mouette.',
    'astronautes-leonov': 'Le 18 mars 1965, il sortit de la capsule Voskhod 2, relié par un câble, et flotta dans le vide une douzaine de minutes. Sa combinaison gonfla tant qu’il dut en laisser échapper de l’air pour réussir à rentrer.',
    'astronautes-armstrong': 'Commandant d’[[missions:apollo11|Apollo 11]], il posa le module Eagle sur la [[lunes:lune|Lune]] le 20 juillet 1969, avec quelques secondes de carburant en réserve. Quelques heures plus tard, il y fit le premier pas de l’humanité.',
    'astronautes-aldrin': 'Pilote du module lunaire d’Apollo 11, il rejoignit [[armstrong]] sur la [[lunes:lune|Lune]] une vingtaine de minutes après lui. Il décrivit le paysage d’une formule restée célèbre : « une magnifique désolation ».',
    'astronautes-ride': 'Physicienne, elle s’envola en juin 1983 à bord de la navette Challenger et devint, à 32 ans, la première Américaine dans l’espace. Elle manipula le bras robotique de la navette pour déployer et récupérer un satellite.',
    'astronautes-chretien': 'Pilote de chasse et d’essai, il s’envola en juin 1982 vers la station soviétique Saliout 7, devenant le premier Français et le premier Européen de l’Ouest dans l’espace.',
    'astronautes-pesquet': 'Ingénieur et pilote de ligne, il passa six mois à bord de la [[missions:iss|Station spatiale internationale]] en 2016-2017, puis y retourna en 2021. Lors de ce second séjour, il en prit le commandement, une première pour un Français.',
    'missions-spoutnik': 'Le 4 octobre 1957, l’Union soviétique mit en orbite une sphère de métal de 58 centimètres munie de quatre antennes. Son « bip-bip » radio, capté par les radioamateurs du monde entier, ouvrait l’ère spatiale.',
    'missions-apollo11': 'Lancée le 16 juillet 1969 par une fusée Saturn V, la mission emmena [[astronautes:armstrong|Neil Armstrong]], [[astronautes:aldrin|Buzz Aldrin]] et Michael Collins vers la [[lunes:lune|Lune]]. Armstrong et Aldrin s’y posèrent pendant que Collins restait en orbite.',
    'missions-voyager': 'Lancée en 1977, elle survola [[planetes:jupiter|Jupiter]] et [[planetes:saturne|Saturne]] avant de filer vers l’espace interstellaire, qu’elle atteignit en 2012. Elle se trouve aujourd’hui à plus de 24 milliards de kilomètres de la Terre.',
    'missions-hubble': 'Placé en orbite en 1990, ce télescope échappe au flou de l’atmosphère terrestre. Ses premières images étaient floues à cause d’un miroir mal poli de deux microns : des astronautes vinrent le doter d’optiques correctrices en 1993.',
    'missions-iss': 'Assemblée à partir de 1998 par une quinzaine de pays, elle est habitée en permanence depuis novembre 2000. Grande comme un terrain de football, elle fait le tour de la Terre en environ 90 minutes, à 400 kilomètres d’altitude.',
    'missions-curiosity': 'Ce robot de la taille d’une voiture s’est posé sur [[planetes:mars|Mars]] en août 2012, descendu par une grue volante. Il a montré que le cratère Gale abritait autrefois un lac, avec les ingrédients chimiques nécessaires à la vie.',
    'missions-rosetta': 'Lancée par l’Agence spatiale européenne en 2004, la sonde Rosetta rattrapa la comète Tchouri après dix ans de voyage. Le 12 novembre 2014, elle largua le petit robot Philae, qui se posa sur la comète : une première.',
    'missions-webb': 'Lancé le 25 décembre 2021 par une fusée Ariane 5 depuis la Guyane, il observe l’Univers dans l’infrarouge. Son miroir doré de 6,5 mètres, trop grand pour la fusée, a voyagé plié comme un origami.',
    'detectives-holmes': 'Créé par Arthur Conan Doyle en 1887, il résout les énigmes les plus obscures par l’observation et la déduction. Il vit au 221B Baker Street, à Londres, avec son ami le docteur [[watson]].',
    'detectives-watson': 'Ancien médecin militaire blessé en Afghanistan, il partage l’appartement de [[holmes]] et l’accompagne dans ses enquêtes. C’est lui qui raconte presque toutes leurs aventures.',
    'detectives-moriarty': 'Brillant professeur de mathématiques, il dirige dans l’ombre la moitié des crimes de Londres. [[holmes]] le surnomme « le Napoléon du crime ».',
    'detectives-adler': 'Cantatrice d’opéra et aventurière, elle apparaît dans Un scandale en Bohême, en 1891. Elle devine les plans de [[holmes]] et lui échappe, ce qui lui vaut à jamais son admiration.',
    'detectives-lestrade': 'Inspecteur de Scotland Yard, il fait appel à [[holmes]] quand une affaire le dépasse, tout en enviant son talent. Il apparaît dans une douzaine d’aventures.',
    'detectives-lupin': 'Créé par Maurice Leblanc en 1905, ce cambrioleur au monocle dérobe les plus grands trésors avec panache, sans jamais tuer. Il se joue de la police et de l’inspecteur Ganimard.',
    'detectives-rouletabille': 'Créé par Gaston Leroux en 1907, ce reporter de dix-huit ans à la tête ronde comme une boule résout Le Mystère de la chambre jaune : un crime commis dans une pièce fermée de l’intérieur.',
    'detectives-dupin': 'Edgar Allan Poe l’imagina en 1841 dans Double Assassinat dans la rue Morgue, souvent considéré comme la première nouvelle policière. Ce Parisien solitaire résout les crimes par le seul raisonnement.',
    'verne-nemo': 'Dans Vingt Mille Lieues sous les mers, en 1870, il parcourt les océans à bord du Nautilus, un sous-marin électrique en avance sur son temps. Il a rompu avec la terre ferme et avec toutes les nations.',
    'verne-fogg': 'Ce gentleman londonien parie vingt mille livres qu’il fera le tour du monde en quatre-vingts jours. Il part le soir même avec son domestique [[passepartout]], en train et en paquebot.',
    'verne-passepartout': 'Ancien acrobate et pompier, ce Français jovial cherchait une place tranquille quand il entra au service de [[fogg]]. Le jour même, il partait pour le tour du monde.',
    'verne-strogoff': 'Officier du tsar, il doit traverser la Sibérie en pleine révolte tatare pour porter un message vital au frère de l’empereur, à Irkoutsk. Il voyage incognito, sous un faux nom.',
    'verne-lidenbrock': 'Ce professeur de minéralogie de Hambourg déchiffre un vieux parchemin indiquant un passage vers le centre de la Terre. Avec son neveu Axel et le guide Hans, il descend dans le cratère d’un volcan d’Islande.',
    'verne-barbicane': 'Président du Gun Club de Baltimore, il propose de tirer un énorme obus vers la [[lunes:lune|Lune]] avec un canon géant creusé dans le sol de Floride. Trois hommes prennent place à bord.',
    'verne-robur': 'En 1886, Verne imagine Robur, un ingénieur qui enlève les membres d’un club de partisans des ballons pour leur prouver la supériorité de son engin, l’Albatros, porté par des hélices.',
    'verne-cyrus': 'Pendant la guerre de Sécession, il s’évade en ballon avec quatre compagnons et un chien. Naufragés sur une île inconnue du Pacifique, ils recréent tout, du feu à l’électricité, grâce à sa science.',
    'mousquetaires-dartagnan': 'Arrivé de Gascogne avec un vieux cheval et les conseils de son père, il provoque en duel le même jour [[athos]], [[porthos]] et [[aramis]]. Ils deviennent inséparables.',
    'mousquetaires-athos': 'Sous ce nom d’emprunt se cache le comte de La Fère, un grand seigneur au passé douloureux. Sage et respecté, il est comme un père pour [[dartagnan]].',
    'mousquetaires-porthos': 'Géant vaniteux et généreux, il aime les beaux habits, la bonne chère et les duels. Sa force est légendaire, sa ruse beaucoup moins.',
    'mousquetaires-aramis': 'Raffiné, discret et galant, il hésite sans cesse entre l’épée et la soutane. Il entretient une correspondance secrète avec une duchesse.',
    'mousquetaires-milady': 'Belle, intelligente et sans pitié, elle mène les missions secrètes du [[richelieu|cardinal de Richelieu]]. Elle porte à l’épaule la marque infamante d’une fleur de lys.',
    'mousquetaires-richelieu': 'Principal ministre de Louis XIII, il dispose de ses propres gardes, rivaux des mousquetaires du roi. Chez Dumas, il trame ses intrigues contre la reine avec l’aide de [[milady]].',
    'mousquetaires-montecristo': 'Edmond Dantès, jeune marin, est jeté au château d’If sur une fausse accusation, le jour de ses fiançailles. Quatorze ans plus tard, il s’évade et découvre le trésor de l’île de Monte-Cristo.',
    'mousquetaires-cyrano': 'Dans la pièce d’Edmond Rostand, en 1897, ce cadet de Gascogne, poète et bretteur redoutable, aime en secret sa cousine Roxane. Persuadé que son nez le rend laid, il écrit pour elle les lettres d’amour d’un autre.',
    'nuits-sheherazade': 'Pour mettre fin à la cruauté du roi [[shahryar]], qui épousait chaque soir une femme et la faisait exécuter à l’aube, elle se porta volontaire. Chaque nuit, elle lui conta une histoire, en s’arrêtant au moment le plus captivant.',
    'nuits-shahryar': 'Trahi par sa première épouse, ce roi jura de ne plus jamais être trompé : il épousait chaque soir une jeune femme et la faisait exécuter le matin. [[sheherazade]] mit fin à ce cycle.',
    'nuits-aladdin': 'Fils d’un tailleur pauvre, il est envoyé par un magicien chercher une vieille lampe au fond d’une caverne. En la frottant, il fait apparaître un [[genie|génie]] qui exauce tous ses souhaits.',
    'nuits-genie': 'Enfermé dans une lampe, il doit obéir à celui qui la possède. Pour [[aladdin]], il fait surgir un palais en une nuit et des trésors à foison.',
    'nuits-alibaba': 'Caché dans un arbre, ce pauvre bûcheron voit une bande de quarante voleurs ouvrir une caverne avec une formule magique : « Sésame, ouvre-toi ! ». Il la répète et découvre leur trésor.',
    'nuits-morgiane': 'Servante d’[[alibaba]], elle découvre que les voleurs se cachent dans des jarres pour attaquer son maître pendant la nuit. Elle les neutralise un à un en versant de l’huile bouillante dans chaque jarre.',
    'nuits-sinbad': 'Riche marchand de Bagdad, il raconte ses sept voyages, tous marqués par un naufrage et des prodiges. Il est emporté par l’oiseau [[rokh]], débarque sur une baleine qu’il prend pour une île et affronte un géant mangeur d’hommes.',
    'nuits-rokh': 'Si grand que ses ailes cachent le soleil, il nourrit ses petits avec des éléphants. [[sinbad]] s’attache à sa patte pour quitter une île, et le Rokh l’emporte au-dessus des montagnes.',
    'merveilleux-dorothy': 'Une tornade emporte la maison de cette fillette du Kansas, avec son chien Toto, jusqu’au merveilleux pays d’Oz. Pour rentrer chez elle, elle suit la route de briques jaunes jusqu’à la Cité d’émeraude.',
    'merveilleux-epouvantail': 'Rencontré dans un champ de maïs, cet épouvantail rempli de paille suit [[dorothy]] pour demander un cerveau au magicien. Pourtant, c’est souvent lui qui trouve les solutions.',
    'merveilleux-ferblanc': 'Ensorcelé par une méchante sorcière, ce bûcheron a vu son corps remplacé pièce par pièce par du fer-blanc. Rouillé et immobile dans la forêt, il est sauvé par [[dorothy]], qui lui huile les articulations.',
    'merveilleux-lion': 'Ce lion rugit pour cacher sa peur : il tremble devant tout. Il rejoint [[dorothy]] pour demander du courage au magicien, mais se montre brave à chaque danger.',
    'merveilleux-sorciere': 'Elle n’a qu’un œil, mais il voit aussi loin qu’un télescope. Elle asservit le peuple des Winkies et lance contre [[dorothy]] des loups, des corbeaux et des singes ailés.',
    'merveilleux-pinocchio': 'Taillé par [[geppetto]] dans une bûche qui parle, ce pantin désobéissant enchaîne les bêtises. Chaque fois qu’il ment, son nez s’allonge.',
    'merveilleux-geppetto': 'Vieux menuisier pauvre, il sculpte un pantin dans une bûche pour gagner sa vie en montreur de marionnettes. Il vend son seul manteau pour acheter un abécédaire à [[pinocchio]].',
    'merveilleux-fee': 'D’abord petite fille aux cheveux bleus, puis jeune femme, elle sauve [[pinocchio]] à plusieurs reprises et l’aide à grandir. C’est devant elle que son nez s’allonge le plus.',
    'jungle-mowgli': 'Perdu bébé dans la jungle et poursuivi par le tigre [[sherekhan]], il est recueilli par une famille de loups. Le conseil de la meute, présidé par [[akela]], l’accepte grâce à [[baloo]] et [[bagheera]].',
    'jungle-baloo': 'Ours brun grave et somnolent, il enseigne aux jeunes loups la Loi de la jungle. Il prend la défense de [[mowgli]] devant le conseil et devient son professeur.',
    'jungle-bagheera': 'Panthère noire aussi rusée que dangereuse, elle achète la vie de [[mowgli]] au conseil des loups en offrant un taureau fraîchement tué.',
    'jungle-sherekhan': 'Ce tigre boiteux, méprisé pour chasser le bétail et les hommes, réclame [[mowgli]] comme proie depuis le premier jour. Il pousse les jeunes loups à chasser l’enfant.',
    'jungle-kaa': 'Ce python des rochers, long de dix mètres, est l’un des êtres les plus anciens et les plus redoutés de la jungle. Il aide [[baloo]] et [[bagheera]] à délivrer [[mowgli]], enlevé par les singes.',
    'jungle-akela': 'Grand loup gris, il dirige la meute par sa force et sa ruse. Il préside le conseil qui accepte [[mowgli]] parmi les loups.',
    'jungle-hathi': 'Vieil éléphant sauvage respecté de tous, il est le maître de la jungle. Lors d’une grande sécheresse, il proclame la trêve de l’eau, pendant laquelle personne ne peut chasser près du point d’eau.',
    'jungle-rikki': 'Recueillie par une famille anglaise en Inde, cette petite mangouste affronte deux cobras, Nag et Nagaïna, qui menacent le jardin. Son nom imite son cri de guerre.',
    'arthur-arthur': 'Jeune écuyer inconnu, il devient roi en retirant d’un rocher une épée que nul autre n’avait pu en arracher. Conseillé par [[merlin]], il réunit à Camelot les meilleurs chevaliers autour de la Table ronde.',
    'arthur-merlin': 'Fils d’une mortelle et d’un démon, il connaît le passé et devine l’avenir. Il organise la naissance d’[[arthur]], veille sur son éducation et le guide au début de son règne.',
    'arthur-lancelot': 'Élevé par la [[damedulac|Dame du Lac]], d’où son nom, il devient le meilleur chevalier du monde. Mais son amour pour la reine [[guenievre]] le met en rivalité avec son roi, [[arthur]].',
    'arthur-guenievre': 'Fille du roi Léodagan, elle épouse [[arthur]] et apporte en dot, selon certains récits, la Table ronde elle-même. Son amour pour [[lancelot]] fait le malheur du royaume.',
    'arthur-morgane': 'Demi-sœur d’[[arthur]], elle apprend la magie et devient une enchanteresse redoutable, tantôt guérisseuse, tantôt ennemie du roi. Elle vole le fourreau magique de son épée.',
    'arthur-perceval': 'Élevé par sa mère loin du monde et des chevaliers, ce garçon naïf quitte tout pour rejoindre la cour d’[[arthur]]. Au château du Roi Pêcheur, il voit passer le Graal mais n’ose pas poser de question.',
    'arthur-damedulac': 'Fée vivant sous les eaux d’un lac enchanté, elle remet son épée à [[arthur]] et élève le jeune [[lancelot]]. On l’appelle souvent Viviane.',
    'arthur-mordred': 'Neveu et, selon certains récits, fils d’[[arthur]], il profite de l’absence du roi pour s’emparer du trône et de la reine.',
    'robin-robin': 'Archer d’exception réfugié dans la forêt de Sherwood, il défie le [[sherif|shérif de Nottingham]] et le [[prince|prince Jean]], qui écrasent le peuple d’impôts. Il prend aux riches pour donner aux pauvres.',
    'robin-marianne': 'Jeune femme noble, elle aime [[robin]] et l’aide à déjouer les plans du [[sherif|shérif]]. Dans certains récits, elle se déguise en page pour le rejoindre à Sherwood.',
    'robin-petitjean': 'Ce géant doit son surnom à une plaisanterie. Il rencontre [[robin]] sur un pont étroit : aucun ne veut céder le passage, et Petit Jean le fait tomber dans la rivière d’un coup de bâton.',
    'robin-tuck': 'Moine bon vivant, gourmand et redoutable à l’épée, il rejoint la bande de [[robin]] après l’avoir affronté. Leur combat commence quand Robin se fait porter par lui pour traverser une rivière.',
    'robin-sherif': 'Représentant du pouvoir royal, il lève les impôts sans pitié et pourchasse [[robin]] dans la forêt de Sherwood, sans jamais parvenir à le capturer.',
    'robin-scarlet': 'Habile à l’épée et, dit-on, vêtu de rouge, il est l’un des plus anciens compagnons de [[robin]]. Dans certaines ballades, il est son cousin.',
    'robin-alan': 'Ménestrel au cœur brisé, il voit sa fiancée promise de force à un vieux chevalier. [[robin]] interrompt la cérémonie et l’unit à celle qu’il aime.',
    'robin-prince': 'Pendant que son frère, le roi Richard Cœur de Lion, est retenu prisonnier au retour de la croisade, il gouverne l’Angleterre et accable le peuple d’impôts. Il est l’ennemi de [[robin]].',
    'etranges-invisible': 'Dans le roman de H. G. Wells, en 1897, le scientifique Griffin découvre comment rendre son corps invisible. Il se cache sous des bandages et des lunettes noires, mais ne parvient pas à inverser l’expérience.',
    'etranges-moreau': 'Sur une île perdue du Pacifique, ce chirurgien chassé d’Angleterre opère des animaux pour les transformer en êtres presque humains. Wells publia L’Île du docteur Moreau en 1896.',
    'etranges-horla': 'Dans la nouvelle de Guy de Maupassant, en 1887, un homme sent une présence invisible qui boit l’eau et le lait de sa carafe pendant la nuit, et prend peu à peu possession de sa volonté.',
    'etranges-quasimodo': 'Abandonné bébé sur le parvis de Notre-Dame, il est recueilli par l’archidiacre Frollo et devient le sonneur de la cathédrale. Les cloches l’ont rendu sourd.',
    'etranges-mobydick': 'Ce cachalot blanc a arraché la jambe du capitaine Achab, qui parcourt désormais les océans pour se venger. Herman Melville publia Moby Dick en 1851.',
    'etranges-golem': 'Selon la légende, le rabbin Loew de Prague façonna au XVIe siècle un géant d’argile pour protéger la communauté juive de la ville. Il l’animait en lui glissant dans la bouche un parchemin portant le nom de Dieu.',
    'etranges-hollandais': 'Selon la légende des marins, son capitaine jura de franchir le cap de Bonne-Espérance malgré la tempête, dût-il naviguer jusqu’au Jugement dernier. Il fut exaucé : son navire erre depuis, sans jamais pouvoir accoster.',
    'etranges-kraken': 'Les marins norvégiens racontaient qu’un monstre immense, si grand qu’on le prenait pour une île, surgissait des profondeurs pour entraîner les navires vers le fond.',
    'flibustiers-barbenoire': 'Edward Teach, dit Barbe-Noire, terrorisa les Caraïbes et les côtes d’Amérique vers 1717 et 1718. On raconte qu’il glissait des mèches allumées dans sa barbe pour paraître entouré de fumée au combat.',
    'flibustiers-bonny': 'Née en Irlande, elle s’enfuit avec le pirate Calico Jack Rackham et combat à ses côtés, vêtue en homme, dans les Caraïbes. Elle y rencontre [[read]].',
    'flibustiers-read': 'Élevée en garçon depuis l’enfance, elle servit comme soldat, puis devint marin. Capturée par des pirates, elle les rejoignit et rencontra [[bonny]] sur le navire de Rackham.',
    'flibustiers-morgan': 'Corsaire au service de l’Angleterre, il attaqua les colonies espagnoles des Caraïbes. En 1671, il traversa l’isthme et mit à sac la ville de Panama.',
    'flibustiers-roberts': 'Gallois enrôlé de force par des pirates en 1719, il devint leur capitaine six semaines plus tard. En trois ans, il captura plus de quatre cents navires.',
    'flibustiers-labuse': 'Olivier Levasseur, dit La Buse, écuma l’océan Indien et s’empara en 1721 d’un navire portugais chargé d’un immense trésor. Il fut pendu à La Réunion en 1730.',
    'flibustiers-omalley': 'Au XVIe siècle, cette cheffe de clan irlandaise commandait une flotte qui contrôlait les côtes de l’ouest de l’Irlande. On l’appelait Gráinne Mhaol.',
    'flibustiers-surcouf': 'Né à Saint-Malo en 1773, ce corsaire muni d’une lettre de marque du gouvernement français captura des dizaines de navires britanniques dans l’océan Indien. Son plus célèbre exploit fut la prise du Kent, en 1800.',
    'forbans-silver': 'Cuisinier du navire Hispaniola, ce marin à la jambe de bois et au perroquet sur l’épaule cache un chef pirate. Il prépare une mutinerie pour s’emparer du trésor du capitaine [[flint]].',
    'forbans-jim': 'Fils d’aubergistes, il découvre dans le coffre d’un vieux marin la carte du trésor du capitaine [[flint]]. Il embarque comme mousse sur l’Hispaniola.',
    'forbans-flint': 'Mort avant le début de L’Île au trésor, il est pourtant partout : c’est son trésor que tous cherchent, enterré sur une île dont il a dessiné la carte. Il fit tuer les six marins qui l’avaient aidé à le cacher.',
    'forbans-bengunn': 'Ancien marin de [[flint]], il fut abandonné seul sur l’île par ses compagnons pendant trois ans. À moitié fou, il rêve de fromage.',
    'forbans-billybones': 'Ce vieux marin balafré s’installe à l’auberge de l’Amiral Benbow, où il boit du rhum en chantant sa chanson de pirate. Il guette sans cesse l’arrivée d’un marin à une jambe.',
    'forbans-crochet': 'Chef des pirates du Pays imaginaire, il porte un crochet de fer à la place de la main droite, tranchée par [[merveilleux:peterpan|Peter Pan]] et jetée à un crocodile.',
    'forbans-smee': 'Irlandais jovial, il sert le [[crochet|capitaine Crochet]] avec une fidélité touchante, bien qu’il soit le moins effrayant des pirates.',
    'forbans-blood': 'Médecin irlandais, Peter Blood est condamné à tort pour avoir soigné un rebelle, puis vendu comme esclave à la Barbade. Il s’évade et devient le plus brillant capitaine pirate des Caraïbes.',
    'cosmos-sgra': 'Au centre de la Voie lactée, à environ 27 000 années-lumière de nous, se cache un trou noir de quatre millions de fois la masse du Soleil. On le repère grâce aux étoiles qui tournent autour de lui à des vitesses folles.',
    'cosmos-m87': 'Au cœur de la galaxie M87, à 55 millions d’années-lumière, ce trou noir pèse environ 6,5 milliards de fois la masse du Soleil. En avril 2019, il est devenu le premier trou noir jamais « photographié » : un anneau orangé autour d’une ombre noire.',
    'cosmos-ton618': 'Ce quasar lointain abrite un trou noir estimé à environ 60 milliards de fois la masse du Soleil, quinze mille fois plus que [[sgra]]. Sa lumière a voyagé pendant près de onze milliards d’années avant de nous parvenir.',
    'cosmos-stephenson': 'Cette supergéante rouge, à environ 19 000 années-lumière, aurait un rayon de plus de 2 000 fois celui du Soleil. Placée au centre de notre système, elle engloutirait l’orbite de [[planetes:saturne|Saturne]].',
    'cosmos-betelgeuse': 'Cette supergéante rouge marque l’épaule de la constellation d’Orion, à quelque 550 à 700 années-lumière. Si elle était à la place du Soleil, elle s’étendrait au-delà de l’orbite de [[planetes:mars|Mars]].',
    'cosmos-r136a1': 'Dans le Grand Nuage de Magellan, une galaxie voisine, cette étoile pèserait environ 200 fois la masse du Soleil et brillerait des millions de fois plus que lui.',
    'cosmos-magnetar': 'Ce magnétar est le cadavre ultra-dense d’une étoile : une boule d’une vingtaine de kilomètres plus lourde que le Soleil, dont le champ magnétique est des millions de milliards de fois plus intense que celui de la Terre.',
    'cosmos-crabe': 'En 1054, des astronomes chinois notèrent une « étoile invitée » si brillante qu’on la voyait en plein jour pendant plus de trois semaines. C’était l’explosion d’une étoile, dont les débris forment aujourd’hui la nébuleuse du Crabe.',
    'cosmos-bouvier': 'Dans la direction de la constellation du Bouvier s’étend une bulle d’environ 330 millions d’années-lumière de diamètre, où l’on ne compte que quelques dizaines de galaxies, là où il devrait y en avoir des milliers.',
    'cosmos-oumuamua': 'En octobre 2017, un télescope d’Hawaï repéra un objet filant trop vite pour appartenir au système solaire : le premier visiteur interstellaire jamais observé. Son nom hawaïen évoque un éclaireur venu de loin.',
    'nordique-baldr': 'Fils d’[[odin]] et de [[frigg]], il était si aimé que sa mère fit jurer à toutes choses de ne jamais le blesser. Seul le gui, jugé trop jeune, fut oublié.',
    'nordique-freyr': 'Frère de [[freyja]], ce dieu Vane veille sur les récoltes, la pluie et le soleil. Il possède un navire, Skidbladnir, qui se plie comme un mouchoir, et un sanglier aux soies d’or.',
    'creatures-jormungandr': 'Fils de [[nordique:loki|Loki]] et de la géante [[jotnar:angrboda|Angrboda]], il fut jeté dans l’océan par [[nordique:odin|Odin]]. Il y grandit tant qu’il fait le tour de Midgard, le monde des hommes, et se mord la queue.',
    'creatures-sleipnir': 'Monture d’[[nordique:odin|Odin]], ce cheval gris à huit jambes galope sur terre, dans les airs et jusqu’au royaume des morts.',
    'creatures-nidhogg': 'Tapi sous les racines d’Yggdrasil, l’arbre du monde, ce dragon les ronge sans relâche. Il dévore aussi les cadavres des parjures et des meurtriers.',
    'creatures-ratatosk': 'Cet écureuil court sans cesse le long du tronc d’Yggdrasil pour porter les insultes échangées entre l’aigle du sommet et le dragon [[nidhogg]], tapi sous les racines.',
    'creatures-huginmunin': 'Chaque matin, ces deux corbeaux s’envolent pour parcourir le monde, puis reviennent se poser sur les épaules d’[[nordique:odin|Odin]] pour lui murmurer tout ce qu’ils ont vu.',
    'creatures-garm': 'Enchaîné devant une grotte, le poitrail couvert de sang, ce chien garde l’entrée du royaume de [[jotnar:hel|Hel]]. Ses hurlements annonceront le début du Ragnarök.',
    'creatures-audhumla': 'Née de la glace qui fondait au commencement du monde, cette vache nourrit de son lait le géant Ymir, le premier de tous les êtres.',
    'jotnar-surt': 'Gardien de [[mondes:muspellheim|Muspellheim]], le monde du feu, il brandit une épée plus éclatante que le soleil. Au Ragnarök, il mènera les fils de Muspell à l’assaut des dieux.',
    'jotnar-hel': 'Fille de [[nordique:loki|Loki]] et d’[[angrboda]], elle a, dit-on, un visage mi-vivant, mi-cadavre. [[nordique:odin|Odin]] lui confia [[mondes:helheim|Helheim]], où vont ceux qui meurent de maladie ou de vieillesse.',
    'jotnar-angrboda': 'Avec [[nordique:loki|Loki]], cette géante du Bois-de-Fer eut trois enfants qui firent trembler les dieux : le loup [[creatures:fenrir|Fenrir]], le serpent [[creatures:jormungandr|Jörmungandr]] et [[hel]].',
    'jotnar-skadi': 'Fille d’un géant tué par les dieux, elle vint à Asgard en armes pour se venger. Les dieux lui offrirent un mari, à choisir en ne voyant que ses pieds : elle désigna Njörd, le dieu de la mer.',
    'jotnar-thrym': 'Ce roi des géants vola le marteau de [[nordique:thor|Thor]] et exigea en échange la main de [[nordique:freyja|Freyja]]. Furieuse, la déesse refusa.',
    'jotnar-utgardaloki': 'Ce roi géant reçut [[nordique:thor|Thor]] et ses compagnons dans sa forteresse et leur imposa des épreuves impossibles : vider une corne à boire, soulever un chat, lutter contre une vieille femme.',
    'jotnar-hrungnir': 'Le plus fort des géants avait un cœur et une tête de pierre. Après avoir défié [[nordique:odin|Odin]] à la course à cheval, il affronta [[nordique:thor|Thor]] en duel.',
    'jotnar-aegir': 'Géant de la haute mer, il vit sous les vagues avec son épouse Rán, qui attrape les noyés dans son filet. Leurs neuf filles sont les vagues.',
    'mondes-asgard': 'Demeure des dieux Ases, elle est entourée d’une muraille bâtie par un géant et reliée au monde des hommes par Bifröst, le pont arc-en-ciel gardé par [[nordique:heimdall|Heimdall]].',
    'mondes-midgard': 'Les dieux façonnèrent ce monde à partir du corps du géant Ymir, et l’entourèrent d’un rempart fait de ses sourcils pour le protéger des géants.',
    'mondes-jotunheim': 'Terre de montagnes, de forêts et de glaces, c’est le domaine des géants, éternels rivaux des dieux. [[nordique:thor|Thor]] s’y rend souvent pour les combattre.',
    'mondes-vanaheim': 'C’est le monde des Vanes, une famille de dieux liés à la fertilité, à la mer et à la prospérité. [[nordique:freyja|Freyja]], [[nordique:freyr|Freyr]] et leur père Njörd en sont issus.',
    'mondes-alfheim': 'Les elfes lumineux, plus beaux que le soleil, habitent ce monde. Les dieux en firent cadeau à [[nordique:freyr|Freyr]] quand il perça sa première dent.',
    'mondes-nidavellir': 'Sous les montagnes, les nains forgent les trésors des dieux : la lance d’[[nordique:odin|Odin]], le collier de [[nordique:freyja|Freyja]] et le marteau de [[nordique:thor|Thor]].',
    'mondes-muspellheim': 'Au commencement, au sud du grand vide Ginnungagap, s’étendait ce monde de feu, si brûlant que seuls ses habitants peuvent y vivre. Il est gardé par le géant [[jotnar:surt|Surt]].',
    'mondes-niflheim': 'Au nord du gouffre originel, ce monde de glace, de froid et de brume est l’un des deux premiers mondes. De sa source, Hvergelmir, naissent tous les fleuves.',
    'mondes-helheim': 'Gouverné par [[jotnar:hel|Hel]], ce monde sombre accueille ceux qui meurent de maladie ou de vieillesse. On y parvient après neuf nuits de route, par le pont Gjallarbrú qui enjambe un fleuve glacé.',
    'titans-cronos': 'Fils d’Ouranos et de Gaïa, il mutila son père d’un coup de faucille et devint roi du monde. Averti qu’un de ses enfants le détrônerait, il les avala tous, sauf [[grece:zeus|Zeus]], que [[rhea]] parvint à cacher.',
    'titans-rhea': 'Sœur et épouse de [[cronos]], elle vit disparaître ses cinq premiers enfants, avalés par leur père. Pour sauver le sixième, [[grece:zeus|Zeus]], elle accoucha en secret en Crète et tendit à Cronos une pierre emmaillotée.',
    'titans-oceanos': 'Aîné des Titans, il est le fleuve sans fin qui entoure le disque de la terre, source de toutes les eaux. Il resta à l’écart de la guerre contre [[grece:zeus|Zeus]], qui le laissa régner sur ses eaux.',
    'titans-hyperion': 'Son nom signifie « celui qui va au-dessus ». Avec sa sœur Théia, il eut les trois astres qui éclairent le monde : Hélios, le Soleil, Séléné, la Lune, et Éos, l’Aurore.',
    'titans-themis': 'Titanide de la loi et de l’ordre juste, elle siégea aux côtés de [[grece:zeus|Zeus]], dont elle fut la deuxième épouse. Elle lui donna les Heures, gardiennes des saisons, et les Moires, qui filent le destin.',
    'titans-mnemosyne': 'Elle incarne la mémoire, qui permet aux poètes de chanter le passé. Unie à [[grece:zeus|Zeus]] pendant neuf nuits, elle donna naissance aux neuf Muses.',
    'titans-japet': 'Frère de [[cronos]], il combattit dans la guerre des Titans et fut jeté dans le Tartare. Il est surtout connu par ses fils : [[atlas]], [[promethee]], Épiméthée et Ménoetios.',
    'titans-atlas': 'Fils de [[japet]], il mena les Titans au combat contre les Olympiens. Vaincu, il fut condamné par [[grece:zeus|Zeus]] à porter le ciel sur ses épaules, à l’extrême ouest du monde.',
    'titans-promethee': 'Fils de [[japet]], il façonna les premiers hommes dans l’argile, puis vola le feu de l’Olympe pour le leur donner. [[grece:zeus|Zeus]] le fit enchaîner sur le Caucase, où un aigle venait lui dévorer le foie.',
    'geants-alcyonee': 'Le plus redoutable des Géants était immortel tant qu’il restait sur la terre de Pallène, où il était né. [[heros:heracles|Héraclès]] le blessa d’une flèche puis, sur le conseil d’[[grece:athena|Athéna]], le traîna hors de ses terres, où il mourut.',
    'geants-porphyrion': 'Roi des Géants, il se jeta sur [[grece:hera|Héra]] pendant la bataille contre les dieux. [[grece:zeus|Zeus]] le frappa de sa foudre et [[heros:heracles|Héraclès]] l’acheva d’une flèche.',
    'geants-encelade': 'Il affronta [[grece:athena|Athéna]] pendant la guerre des Géants. Alors qu’il fuyait, la déesse jeta sur lui l’île de Sicile, qui l’écrasa.',
    'geants-ephialtes': 'Pendant la bataille contre les dieux, [[grece:apollon|Apollon]] lui creva l’œil gauche d’une flèche, et [[heros:heracles|Héraclès]] lui perça le droit.',
    'geants-mimas': 'Selon les récits, il fut tué par Héphaïstos, qui l’accabla de projectiles de métal en fusion, ou par [[grece:zeus|Zeus]] et sa foudre.',
    'geants-polypheme': 'Fils de [[grece:poseidon|Poséidon]], ce cyclope à l’œil unique vivait en Sicile avec ses moutons. Il enferma Ulysse et ses compagnons dans sa grotte et en dévora plusieurs, avant que le héros ne l’enivre et lui crève l’œil.',
    'geants-briaree': 'Fils d’Ouranos et de Gaïa, il fut enfermé dans le Tartare avec ses frères Cottos et Gygès. Libéré par [[grece:zeus|Zeus]], il l’aida à vaincre les Titans en lançant sur eux des rochers par centaines.',
    'geants-antee': 'Fils de [[grece:poseidon|Poséidon]] et de la Terre, ce géant de Libye défiait les voyageurs à la lutte et les tuait. Chaque fois qu’il touchait le sol, sa mère lui rendait ses forces.',
    'pharaons-narmer': 'Vers 3100 av. J.-C., il réunit sous une même couronne la Haute-Égypte, au sud, et la Basse-Égypte, au nord. On le considère souvent comme le fondateur de la première dynastie, placé sous la protection du dieu faucon [[egypte:horus|Horus]].',
    'pharaons-kheops': 'Vers 2560 av. J.-C., il fit bâtir à Gizeh la Grande Pyramide, haute à l’origine d’environ 146 mètres. Pendant près de quatre mille ans, elle resta le plus haut monument construit par l’homme.',
    'pharaons-hatchepsout': 'Veuve de Thoutmôsis II, elle gouverna d’abord pour le jeune [[thoutmosis]], son neveu, avant de se proclamer pharaon vers 1478 av. J.-C. Ses statues la montrent avec tous les attributs du roi, jusqu’à la barbe postiche.',
    'pharaons-thoutmosis': 'Longtemps resté dans l’ombre de [[hatchepsout]], il mena après elle dix-sept campagnes militaires et porta les frontières de l’Égypte jusqu’à l’Euphrate.',
    'pharaons-akhenaton': 'Né Amenhotep IV, il délaissa les dieux traditionnels pour un seul, Aton, le disque du soleil, et changea de nom. Il fonda une nouvelle capitale, Akhetaton, aux côtés de son épouse [[nefertiti]].',
    'pharaons-nefertiti': 'Son nom signifie « la belle est venue ». Grande épouse royale d’[[akhenaton]], elle partagea avec lui le culte d’Aton et apparaît à ses côtés sur de nombreux reliefs, parfois dans des poses réservées au roi.',
    'pharaons-toutankhamon': 'Monté sur le trône vers neuf ans, il rétablit le culte des anciens dieux abandonnés par [[akhenaton]], et mourut vers dix-neuf ans. Son règne fut court et modeste.',
    'pharaons-ramses': 'Il régna environ soixante-sept ans, de 1279 à 1213 av. J.-C. Il fit graver partout le récit de la bataille de Qadesh contre les Hittites, présentée comme une victoire, puis signa avec eux l’un des plus anciens traités de paix connus.',
    'pharaons-cleopatre': 'Dernière reine de la dynastie des Ptolémées, descendants d’un général d’Alexandre le Grand, elle fut la seule de sa famille à parler égyptien. Alliée de Jules César puis de Marc Antoine, elle tenta de préserver l’indépendance de l’Égypte face à Rome.',
    'heros-heracles': 'Fils de [[grece:zeus]] et d’une mortelle, il accomplit douze travaux pour expier un crime commis dans la folie envoyée par [[grece:hera]]. Le dernier le mena jusqu’au royaume d’[[grece:hades]], d’où il ramena Cerbère.',

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
    'merveilleux-alice': 'Curieuse et logique, elle suit un lapin blanc au fond d’un terrier et tombe dans un monde absurde. Née sous la plume de Lewis Carroll en 1865, elle partage avec [[peterpan]] le refus des règles des grandes personnes.',
    'merveilleux-peterpan': 'Chef des Garçons perdus, il s’envole avec Wendy jusqu’au Pays imaginaire, où l’on ne grandit jamais. Imaginé par J. M. Barrie en 1904, il est, avec [[alice]], l’un des deux enfants anglais de cette collection.',
    'contes-poucet': 'Abandonné dans la forêt avec ses six frères par des parents trop pauvres, il sème des cailloux blancs pour retrouver le chemin. La seconde fois, les oiseaux mangent ses miettes de pain, et les enfants arrivent chez un ogre.',
    'contes-barbebleue': 'Ce riche seigneur à la barbe bleue confie à sa jeune épouse les clés de son château, en lui interdisant d’ouvrir un seul petit cabinet. Poussée par la curiosité, elle l’ouvre et y découvre les corps de ses précédentes épouses.',
    'contes-hansel': 'Abandonnés dans la forêt, ce frère et cette sœur découvrent une maisonnette faite de pain, couverte de gâteau et aux fenêtres de sucre. Elle appartient à une sorcière qui veut engraisser Hansel pour le manger.',
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

    'nordique-odin': 'Le Père de tout sacrifia un œil pour boire à la source de la sagesse et resta pendu neuf nuits à l’arbre-monde pour découvrir les runes. Il sait qu’au Ragnarök, [[creatures:fenrir]] le dévorera.',
    'nordique-thor': 'Fils d’[[odin]], il protège Asgard et Midgard avec Mjöllnir, un marteau forgé par des nains à la suite d’une ruse de [[loki]].',
    'nordique-loki': 'Métamorphe imprévisible, tour à tour allié et ennemi des dieux. Père de [[creatures:fenrir]], c’est lui qui causera la mort de Baldr, le fils bien-aimé d’[[odin]] et de [[frigg]].',
    'nordique-freyja': 'Déesse de l’amour et de la guerre, elle parcourt le ciel sur un char tiré par des chats. Elle accueille la moitié des guerriers tombés au combat ; l’autre moitié rejoint [[odin]] au Valhalla.',
    'nordique-frigg': 'Épouse d’[[odin]] et reine d’Asgard, elle connaît le destin de chacun sans jamais le dévoiler. Elle fit jurer à toutes choses d’épargner son fils Baldr, mais oublia le gui, ce dont [[loki]] sut profiter.',
    'creatures-fenrir': 'Fils de [[nordique:loki]], le loup grandit si vite que les dieux prirent peur. Ils l’enchaînèrent par la ruse, au prix de la main de [[nordique:tyr]] ; depuis, il attend le Ragnarök.',
    'nordique-heimdall': 'Gardien du pont arc-en-ciel Bifröst, il voit à cent lieues et entend pousser l’herbe. Au Ragnarök, il sonnera du cor et affrontera [[loki]] : ils périront l’un par l’autre.',
    'nordique-tyr': 'Dieu du serment et du courage, il fut le seul à oser nourrir le jeune [[creatures:fenrir]]. Pour que le loup accepte la chaîne magique, il plaça sa main dans sa gueule, et la perdit.'
  };
  Object.keys(STORIES).forEach(function (id) { if (A.CHAR[id]) A.CHAR[id].story = STORIES[id]; });

  /* « Voir plus » : un paragraphe complémentaire par personnage (mêmes liens [[slug]] possibles). */
  var MORE = {
    'grece-zeus': 'Dernier-né du Titan Cronos, qui dévorait ses enfants, il fut caché en Crète et nourri par la chèvre Amalthée. Devenu adulte, il força son père à recracher ses frères et sœurs, puis mena contre les Titans une guerre de dix ans. Les Cyclopes lui forgèrent la foudre, son arme et son emblème.',
    'grece-hera': 'Fille de Cronos et de Rhéa, elle est à la fois la sœur et l’épouse de [[zeus]]. Le paon lui est consacré : elle orna sa queue des cent yeux du géant Argos, son fidèle gardien. Ses sanctuaires d’Argos et de Samos comptaient parmi les plus vénérés de Grèce.',
    'grece-poseidon': 'On lui attribue la création du cheval, qu’il aurait fait jaillir d’un rocher d’un coup de trident. Rancunier, il poursuivit Ulysse dix ans durant pour venger son fils, le cyclope Polyphème. Les Grecs le surnommaient « l’Ébranleur de la terre ».',
    'grece-hades': 'Il enleva Perséphone pour en faire sa reine ; pour avoir goûté quelques grains de grenade, la jeune déesse dut passer chaque année une partie de l’année sous terre. Son casque le rendait invisible. Les Grecs évitaient de prononcer son nom et l’appelaient Ploutos, « le Riche ».',
    'grece-athena': 'Elle porte l’égide, ornée de la tête de [[monstres:meduse]], et la chouette est son oiseau. Le Parthénon, sur l’Acropole d’Athènes, lui est dédié. Protectrice des artisans autant que des guerriers, elle passait pour avoir inventé le métier à tisser.',
    'grece-apollon': 'Il tua le serpent Python à Delphes et y fonda son oracle, le plus célèbre du monde grec. Musicien, il joue de la lyre que lui offrit Hermès. Épris de la nymphe Daphné, changée en laurier pour lui échapper, il fit de cet arbre son emblème.',
    'grece-artemis': 'Elle obtint de [[zeus]] de rester à jamais libre et sans époux, entourée de nymphes chasseresses. Le chasseur Actéon, qui l’avait surprise au bain, fut changé en cerf et dévoré par ses propres chiens. Son temple d’Éphèse comptait parmi les Sept Merveilles du monde.',
    'monstres-meduse': 'Le héros Persée la décapita en ne la regardant que dans le reflet de son bouclier. De son sang naquirent le cheval ailé Pégase et le géant Chrysaor. Même tranchée, sa tête gardait son pouvoir : Persée l’offrit à [[grece:athena]], qui la fixa sur son égide.',
    'heros-persee': 'Sur le chemin du retour, il délivra la princesse Andromède, enchaînée à un rocher pour être livrée à un monstre marin, et l’épousa. Il changea en pierre le roi Polydectès en lui montrant la tête de la Gorgone. Une constellation porte son nom, à côté de celle d’Andromède.',
    'heros-thesee': 'Au retour, il oublia de remplacer les voiles noires de son navire par des voiles blanches, signe de victoire. Croyant son fils mort, Égée se jeta dans la mer, qui porte depuis son nom. Devenu roi, Thésée passe pour avoir réuni les villages de l’Attique autour d’Athènes.',
    'heros-bellerophon': 'Grisé par ses victoires, il voulut monter jusqu’à l’Olympe sur le dos de Pégase. Zeus envoya un taon piquer le cheval, qui désarçonna son cavalier. Bellérophon finit sa vie seul, boiteux et errant.',
    'heros-oedipe': 'Un oracle avait annoncé qu’il tuerait son père et épouserait sa mère. Sans le savoir, il accomplit les deux. Quand il découvrit la vérité, il se creva les yeux. Sa tragédie, mise en scène par Sophocle, a inspiré à Freud le nom du « complexe d’Œdipe ».',
    'heros-jason': 'La magicienne Médée, éprise de lui, l’aida à surmonter toutes les épreuves du roi de Colchide. Jason l’abandonna plus tard pour une princesse de Corinthe, et Médée se vengea terriblement. Le héros mourut, dit-on, écrasé par une poutre de son vieux navire.',
    'heros-orphee': 'Il perdit Eurydice pour toujours en se retournant trop tôt vers elle. Inconsolable, il fut mis en pièces par les Ménades, suivantes de Dionysos. Sa tête, jetée dans un fleuve, continuait de chanter. Sa lyre devint une constellation.',
    'heros-ulysse': 'Pour écouter le chant des Sirènes sans y succomber, il se fit attacher au mât et boucha de cire les oreilles de ses marins. De retour à Ithaque, déguisé en mendiant, il fut reconnu par son vieux chien Argos, puis chassa les prétendants qui entouraient son épouse Pénélope.',
    'monstres-minotaure': 'Son vrai nom était Astérion, « l’étoilé ». Le palais de Cnossos, en Crète, avec ses innombrables salles et ses fresques de taureaux, a peut-être inspiré la légende du Labyrinthe. Il fut tué par [[heros:thesee|Thésée]].',
    'monstres-hydre': 'Selon Hésiode, elle était la fille de Typhon et d’Échidna, et [[grece:hera|Héra]] l’aurait élevée pour perdre Héraclès. Le nombre de ses têtes varie selon les auteurs, de cinq à cent. On appelle aujourd’hui « hydre » un minuscule animal d’eau douce capable de régénérer son corps.',
    'monstres-chimere': 'La Chimère d’Arezzo, grande statue de bronze étrusque, la montre blessée, la tête de chèvre pendante. Son nom est devenu un mot courant : une chimère est une idée irréaliste, et, en biologie, un être formé de cellules d’origines différentes.',
    'monstres-sphinx': 'Chez les Grecs, le Sphinx est une créature féminine et cruelle. Le mot vient pourtant d’Égypte, où le sphinx, comme celui de Gizeh, est un gardien à tête de roi. Vaincu, le Sphinx de Thèbes se jeta du haut de son rocher.',
    'monstres-dragon': 'Selon certains récits, il était né du sang de Typhon. Le roi de Colchide imposa aussi à Jason de semer les dents d’un autre dragon, celui de Thèbes : il en sortit des guerriers armés, que le héros dut combattre.',
    'monstres-cerbere': 'Pour son dernier travail, [[heros:heracles|Héraclès]] le captura à mains nues et le ramena un moment à la surface. Selon Ovide, la bave qui coula de ses gueules fit naître l’aconit, une plante vénéneuse. On appelle encore « cerbère » un gardien intraitable.',
    'monstres-scylla': 'Selon Ovide, la magicienne Circé, jalouse, la changea en monstre en empoisonnant l’eau de son bain. Les Anciens situaient le détroit entre l’Italie et la Sicile, à Messine. L’expression « tomber de Charybde en Scylla » signifie échapper à un danger pour tomber dans un pire.',
    'planetes-mercure': 'Son nom vient du dieu romain du commerce et des voyageurs, messager des dieux, l’équivalent d’Hermès. Couverte de cratères, elle ressemble à notre Lune. Du lever au coucher du Soleil, un jour sur Mercure dure environ 176 jours terrestres, deux fois plus que son année.',
    'planetes-venus': 'C’est l’astre le plus brillant du ciel après le Soleil et la Lune, visible à l’aube ou au crépuscule, d’où son surnom d’Étoile du Berger. Elle tourne sur elle-même dans le sens inverse de la plupart des planètes, et si lentement qu’un tour sur elle-même dure plus longtemps que son année.',
    'planetes-terre': 'Elle s’est formée il y a environ 4,5 milliards d’années. Son axe, incliné d’environ 23,5 degrés, lui donne ses saisons. La première photographie de la Terre entière vue de l’espace par des humains, « La Bille bleue », fut prise en 1972 par l’équipage d’Apollo 17.',
    'planetes-mars': 'Elle porte le nom du dieu romain de la guerre. Des robots comme Curiosity et Perseverance y roulent pour chercher des traces d’une vie passée. D’anciens lits de rivières montrent que l’eau y coulait autrefois. Ses deux petites lunes s’appellent [[lunes:phobos|Phobos]] et Déimos.',
    'planetes-jupiter': 'Elle porte le nom du roi des dieux romains, l’équivalent de [[grece:zeus|Zeus]]. En 1610, Galilée découvrit ses quatre plus grandes lunes, [[lunes:io|Io]], [[lunes:europe|Europe]], [[lunes:ganymede|Ganymède]] et Callisto : la preuve que tout ne tourne pas autour de la Terre. On lui connaît aujourd’hui près d’une centaine de lunes.',
    'planetes-saturne': 'Elle porte le nom du dieu romain de l’agriculture, identifié au Titan [[titans:cronos|Cronos]]. C’est la planète qui compte le plus de lunes connues, plus de 270, dont [[lunes:titan|Titan]], plus grosse que Mercure. La sonde Cassini l’a étudiée pendant treize ans, avant de plonger dans son atmosphère en 2017.',
    'planetes-uranus': 'C’est la première planète découverte au télescope, par William Herschel en 1781. Le méthane de son atmosphère lui donne sa couleur bleu-vert. Elle porte le nom d’Ouranos, le Ciel, père des Titans. Une seule sonde l’a visitée : Voyager 2, en 1986, qui photographia aussi sa lune [[lunes:miranda|Miranda]].',
    'planetes-neptune': 'Ce fut la première planète découverte par le calcul : en 1846, l’astronome français Urbain Le Verrier prédit sa position à partir des irrégularités de l’orbite d’Uranus, et on l’observa là où il l’avait annoncée. Elle porte le nom du dieu romain des mers, l’équivalent de [[grece:poseidon|Poséidon]]. Sa plus grande lune, [[lunes:triton|Triton]], tourne à l’envers.',
    'lunes-lune': 'Son attraction provoque les marées des océans. Elle s’éloigne de la Terre d’environ 3,8 centimètres par an. Douze astronautes y ont marché entre 1969 et 1972, à commencer par Neil Armstrong lors de la mission Apollo 11.',
    'lunes-phobos': 'Dans quelques dizaines de millions d’années, il sera déchiré par la gravité de Mars ou s’écrasera à sa surface, et formera peut-être un anneau. Son nom signifie « la peur » : avec Déimos, « la terreur », il accompagne le dieu de la guerre. Les deux lunes de Mars furent découvertes en 1877 par Asaph Hall.',
    'lunes-io': 'Ses panaches volcaniques peuvent monter à plusieurs centaines de kilomètres au-dessus du sol. Dans la mythologie grecque, Io était une prêtresse aimée de [[grece:zeus|Zeus]], qui la changea en génisse pour la cacher à [[grece:hera|Héra]]. Elle fut découverte par Galilée en 1610.',
    'lunes-europe': 'Sa surface, l’une des plus lisses du système solaire, est striée de fissures brunes. La sonde Europa Clipper, lancée en 2024, doit l’étudier à partir de 2030. Son nom vient de la princesse phénicienne qu’enleva [[grece:zeus|Zeus]] changé en taureau, celle qui a aussi donné son nom à notre continent.',
    'lunes-ganymede': 'La sonde européenne JUICE, lancée en 2023, doit se placer en orbite autour d’elle en 2034. Dans la mythologie, Ganymède était un jeune prince troyen enlevé par [[grece:zeus|Zeus]], changé en aigle, pour devenir l’échanson des dieux.',
    'lunes-titan': 'En 2005, la sonde européenne Huygens s’y posa : le premier atterrissage dans le système solaire extérieur. La NASA prépare Dragonfly, un drone qui doit y voler dans les années 2030. Elle doit son nom aux Titans, la famille de [[titans:cronos|Cronos]], que les Romains appelaient Saturne.',
    'lunes-encelade': 'La sonde Cassini a traversé ces panaches et y a détecté du sel, des molécules organiques et des signes d’activité hydrothermale. Ces jets alimentent l’un des anneaux de Saturne, l’anneau E. Elle porte le nom du Géant [[geants:encelade|Encelade]], écrasé sous la Sicile par Athéna.',
    'lunes-miranda': 'Elle fut découverte en 1948 par Gerard Kuiper. On ne la connaît que par les images de Voyager 2, prises lors de son unique passage en 1986. Contrairement aux lunes de Jupiter et de Saturne, celles d’Uranus portent des noms de personnages de Shakespeare : Miranda est l’héroïne de La Tempête.',
    'lunes-triton': 'Il y fait environ −235 °C, l’une des températures de surface les plus basses jamais mesurées. Voyager 2 y a pourtant photographié en 1989 des geysers d’azote. Elle porte le nom de Triton, fils de [[grece:poseidon|Poséidon]], dieu marin qui soufflait dans une conque.',
    'astronautes-gagarine': 'Revenu en héros, il devint l’homme le plus célèbre de la planète. Il mourut en 1968, à 34 ans, dans l’accident d’un avion d’entraînement. Le 12 avril est aujourd’hui la Journée internationale du vol spatial habité.',
    'astronautes-terechkova': 'Elle reste la seule femme à avoir voyagé seule dans l’espace. Il fallut attendre dix-neuf ans pour qu’une autre femme, Svetlana Savitskaïa, y retourne.',
    'astronautes-leonov': 'Peintre de talent, il emporta des crayons en orbite et dessina le premier lever de soleil vu de l’espace. En 1975, il commanda la partie soviétique d’Apollo-Soyouz, la première poignée de main en orbite entre Américains et Soviétiques.',
    'astronautes-armstrong': 'Ingénieur et ancien pilote d’essai, il était connu pour son calme et sa discrétion. Après Apollo 11, il refusa la plupart des honneurs et enseigna l’aéronautique à l’université. Il est mort en 2012.',
    'astronautes-aldrin': 'Docteur en astronautique, il avait mis au point des techniques de rendez-vous en orbite utilisées par la NASA. Comme c’est Armstrong qui tenait l’appareil photo, la plupart des célèbres photos d’un homme sur la Lune montrent en réalité Aldrin.',
    'astronautes-ride': 'Après sa carrière, elle consacra sa vie à donner aux jeunes, et surtout aux filles, le goût des sciences. Elle siégea dans les commissions d’enquête sur les accidents des navettes Challenger et Columbia. Elle est morte en 2012.',
    'astronautes-chretien': 'En 1988, lors d’un second vol, il devint le premier astronaute ni américain ni soviétique à sortir dans le vide spatial. Il vola aussi à bord de la navette américaine Atlantis en 1997.',
    'astronautes-pesquet': 'Ses photographies de la Terre prises depuis la station, partagées chaque jour, ont été suivies par des millions de personnes. Il a passé au total près de 400 jours dans l’espace, un record pour un astronaute européen.',
    'missions-spoutnik': 'Il fit le tour de la Terre en 96 minutes environ, pendant trois mois, avant de se consumer dans l’atmosphère. Le choc fut tel aux États-Unis qu’il poussa à la création de la NASA, en 1958, et lança la course à l’espace.',
    'missions-apollo11': 'Environ 600 millions de personnes suivirent les premiers pas à la télévision. Les astronautes rapportèrent plus de 21 kilogrammes de roches lunaires et laissèrent sur place une plaque disant qu’ils étaient venus en paix pour toute l’humanité.',
    'missions-voyager': 'Elle emporte un disque d’or chargé de sons et d’images de la Terre. En 1990, depuis les confins du système solaire, elle prit la photo « Pale Blue Dot », où la Terre n’est qu’un point minuscule. Ses signaux mettent près d’une journée à nous parvenir.',
    'missions-hubble': 'Il a aidé à mesurer l’âge de l’Univers, environ 13,8 milliards d’années, et à montrer que son expansion accélère. Son image des « Piliers de la création », dans la nébuleuse de l’Aigle, est l’une des plus célèbres de l’astronomie.',
    'missions-iss': 'Ses occupants voient ainsi seize levers et couchers de soleil par jour. On y étudie les effets de l’apesanteur sur le corps humain, la croissance des plantes ou le comportement des flammes. [[astronautes:pesquet|Thomas Pesquet]] l’a commandée en 2021.',
    'missions-curiosity': 'Il porte un laser, la ChemCam, conçu en partie en France, qui vaporise la roche à distance pour en analyser la composition. Prévu pour deux ans, il a continué de rouler plus d’une décennie sur les pentes du mont Sharp.',
    'missions-rosetta': 'Philae rebondit et finit coincé à l’ombre d’une falaise, sans assez de soleil pour ses panneaux. Il eut pourtant le temps d’envoyer ses mesures. Rosetta termina sa mission en 2016 en se posant doucement sur la comète.',
    'missions-webb': 'Il se trouve à 1,5 million de kilomètres de la Terre, protégé du Soleil par un pare-soleil grand comme un court de tennis. Il observe des galaxies nées quelques centaines de millions d’années après le Big Bang.',
    'detectives-holmes': 'Violoniste, chimiste amateur et maître du déguisement, il devine la vie d’un inconnu à ses chaussures ou à ses mains. Conan Doyle le fit mourir en 1893 face à [[moriarty]], mais dut le ressusciter dix ans plus tard sous la pression des lecteurs.',
    'detectives-watson': 'Moins brillant que son ami, il apporte courage, loyauté et bon sens. Il sert d’intermédiaire avec le lecteur, à qui Holmes doit expliquer ses déductions. Il épouse Mary Morstan, rencontrée lors de l’enquête du Signe des quatre.',
    'detectives-moriarty': 'Il n’apparaît en personne que dans une seule nouvelle, Le Dernier Problème, où il affronte Holmes au bord des chutes de Reichenbach, en Suisse. Cette brève apparition a suffi à en faire le modèle de tous les grands méchants intelligents.',
    'detectives-adler': 'Pour Holmes, elle restera toujours « la femme ». Elle n’apparaît que dans une seule histoire, mais son intelligence et son indépendance en ont fait l’un des personnages les plus repris de l’univers du détective.',
    'detectives-lestrade': 'Holmes le juge peu imaginatif mais tenace, le meilleur des policiers de métier. Avec le temps, Lestrade finit par reconnaître ouvertement le génie du détective. Il incarne la police officielle face au détective privé.',
    'detectives-lupin': 'Leblanc l’opposa même à [[holmes|un célèbre détective anglais]], rebaptisé Herlock Sholmès après les protestations de Conan Doyle. Dans L’Aiguille creuse, Lupin découvre le secret des rois de France, caché dans une aiguille de craie à Étretat.',
    'detectives-rouletabille': 'Le roman est l’un des modèles du crime en chambre close, où le coupable semble avoir traversé les murs. Rouletabille se fie au raisonnement plutôt qu’aux indices matériels. Gaston Leroux est aussi l’auteur du [[gothique:fantome|Fantôme de l’Opéra]].',
    'detectives-dupin': 'Son ami, qui raconte ses enquêtes, annonce déjà le docteur [[watson]]. Dans La Lettre volée, Dupin retrouve un document caché à la vue de tous, là où personne ne pense à chercher. Baudelaire traduisit ses aventures en français.',
    'verne-nemo': 'Son nom signifie « personne » en latin, un clin d’œil à [[heros:ulysse|Ulysse]] face au cyclope. On découvre dans L’Île mystérieuse qu’il est un prince indien révolté contre la domination britannique. Les vingt mille lieues sont la distance parcourue, et non la profondeur.',
    'verne-fogg': 'De retour à Londres, il se croit en retard d’un jour. Mais en voyageant vers l’est, il a gagné une journée en franchissant la ligne de changement de date, et remporte son pari. La journaliste Nellie Bly releva le défi pour de vrai en 1889 et boucla le tour en 72 jours.',
    'verne-passepartout': 'Il aide à sauver en Inde la jeune Aouda d’un bûcher, se fait engager dans une troupe d’acrobates au Japon et est enlevé par des Sioux aux États-Unis. Il n’a jamais remis à l’heure sa montre de famille, restée à l’heure de Londres.',
    'verne-strogoff': 'Capturé, il est condamné à être aveuglé par une lame chauffée à blanc. Il ne perd pourtant pas la vue : les larmes versées en regardant sa mère une dernière fois l’ont protégé. Le roman parut en 1876.',
    'verne-lidenbrock': 'Sous terre, ils découvrent une mer intérieure, des forêts de champignons géants et des animaux préhistoriques. Ils remontent à la surface projetés par une éruption du Stromboli, en Italie. Le Voyage au centre de la Terre parut en 1864.',
    'verne-barbicane': 'Le canon de De la Terre à la Lune, en 1865, se trouve en Floride, comme le futur centre spatial du cap Canaveral. Comme l’équipage d’[[missions:apollo11|Apollo 11]], les voyageurs de Verne sont trois et finissent par amerrir dans le Pacifique.',
    'verne-robur': 'Son appareil annonçait l’avion et l’hélicoptère, à une époque où l’on ne volait qu’en ballon. Dans Maître du monde, en 1904, Robur revient, devenu menaçant, à bord d’une machine capable de rouler, de naviguer et de voler.',
    'verne-cyrus': 'Dans L’Île mystérieuse, en 1875, les naufragés sont aidés en secret par un protecteur caché : le [[nemo|capitaine Nemo]], qui vit ses derniers jours dans une grotte de l’île. Les traductions anglaises ont rebaptisé l’ingénieur Cyrus Harding.',
    'mousquetaires-dartagnan': 'Alexandre Dumas s’inspira d’un homme réel, Charles de Batz de Castelmore, comte d’Artagnan, capitaine des mousquetaires de Louis XIV. La devise des quatre amis, « Tous pour un, un pour tous », est restée célèbre.',
    'mousquetaires-athos': 'Il cache un secret : il a épousé autrefois une femme marquée de la fleur de lys des criminels, qu’il crut avoir fait périr. Cette femme n’est autre que [[milady]].',
    'mousquetaires-porthos': 'Dans Le Vicomte de Bragelonne, il meurt écrasé en retenant à lui seul la voûte d’une grotte pour permettre à ses amis de s’enfuir. Dumas aurait pleuré en écrivant cette scène.',
    'mousquetaires-aramis': 'Il finit par devenir évêque, puis général des Jésuites. Dans Le Vicomte de Bragelonne, il organise le complot de l’homme au masque de fer pour remplacer Louis XIV par son frère jumeau.',
    'mousquetaires-milady': 'Elle vole deux ferrets de diamant au duc de Buckingham pour compromettre la reine, puis le fait assassiner. Démasquée par les mousquetaires et par [[athos]], son ancien mari, elle est jugée et exécutée au bord de la Lys.',
    'mousquetaires-richelieu': 'Le vrai Richelieu gouverna la France de 1624 à 1642. Il renforça l’autorité du roi, fonda l’Académie française en 1635 et fit raser de nombreux châteaux forts. Son surnom d’Éminence rouge vient de sa robe de cardinal.',
    'mousquetaires-montecristo': 'En prison, l’abbé Faria lui enseigne les sciences et les langues, et lui révèle l’emplacement du trésor. Devenu le mystérieux comte de Monte-Cristo, Dantès punit un à un ceux qui l’ont trahi. Le roman de Dumas parut en feuilleton de 1844 à 1846.',
    'mousquetaires-cyrano': 'Il se bat en vers, en composant une ballade pendant un duel. Le vrai Savinien de Cyrano de Bergerac, écrivain du XVIIe siècle, imagina un voyage dans la [[lunes:lune|Lune]]. La pièce de Rostand est l’une des plus jouées du théâtre français.',
    'nuits-sheherazade': 'Curieux de connaître la suite, le roi repoussait l’exécution au lendemain. Au bout de mille et une nuits, il renonça à sa cruauté. Le recueil fut révélé à l’Europe par la traduction française d’Antoine Galland, à partir de 1704.',
    'nuits-shahryar': 'Au fil des contes, il apprend la patience, la justice et la compassion. Son histoire forme le récit-cadre des Mille et Une Nuits : elle enveloppe toutes les autres, qui s’emboîtent parfois les unes dans les autres.',
    'nuits-aladdin': 'Le conte ne figure dans aucun manuscrit arabe ancien connu : Antoine Galland l’entendit en 1709 de la bouche d’un conteur syrien, Hanna Diyab, et l’ajouta à sa traduction. L’histoire se déroule pourtant en Chine.',
    'nuits-genie': 'Dans le conte, il y a en réalité deux génies : celui de la lampe et celui d’un anneau magique, plus modeste. Dans les traditions arabes, les djinns sont des êtres faits d’un feu sans fumée, ni bons ni mauvais par nature.',
    'nuits-alibaba': 'Son frère, trop avide, reste enfermé dans la caverne pour avoir oublié la formule. Les voleurs veulent ensuite se venger d’Ali Baba, mais c’est la ruse de sa servante [[morgiane]] qui le sauve. Ce conte fut lui aussi ajouté par Galland, d’après Hanna Diyab.',
    'nuits-morgiane': 'Plus tard, elle démasque le chef des voleurs, déguisé en marchand, en dansant devant lui un poignard à la main. Pour la remercier, Ali Baba l’affranchit et la marie à son neveu. C’est la véritable héroïne du conte.',
    'nuits-sinbad': 'Ses voyages reflètent les routes des marchands arabes vers l’Inde, l’Asie du Sud-Est et l’Afrique de l’Est. Le géant qu’il aveugle lors de son troisième voyage rappelle étrangement [[geants:polypheme|Polyphème]], le cyclope d’Ulysse.',
    'nuits-rokh': 'Marco Polo affirmait que le Rokh vivait à Madagascar. La légende s’inspire peut-être de l’æpyornis, un oiseau géant de Madagascar haut de trois mètres, disparu depuis quelques siècles, dont les œufs étaient énormes.',
    'merveilleux-dorothy': 'Dans le roman de L. Frank Baum, paru en 1900, ses chaussures magiques sont en argent ; elles ne deviendront rouges que dans le film de 1939. En les faisant claquer trois fois, elle rentre enfin chez elle.',
    'merveilleux-epouvantail': 'Le magicien lui offre une tête bourrée de son, d’aiguilles et d’épingles, pour qu’il ait l’esprit vif. Il devient ensuite le souverain de la Cité d’émeraude. Comme ses compagnons, il possédait déjà ce qu’il cherchait.',
    'merveilleux-ferblanc': 'Il veut un cœur pour pouvoir aimer à nouveau. Le magicien lui offre un cœur de soie rempli de sciure. Il pleure si facilement qu’il doit veiller à ne pas rouiller.',
    'merveilleux-lion': 'Le magicien lui fait boire une potion présentée comme du courage. Le lion se sent alors plein de bravoure, et devient le roi des animaux d’une forêt du sud d’Oz.',
    'merveilleux-sorciere': 'Elle craint l’eau et l’obscurité. Furieuse, Dorothy lui jette un seau d’eau, et la sorcière fond comme du sucre. Chez Baum, elle n’a pas la peau verte : ce trait vient du film de 1939.',
    'merveilleux-pinocchio': 'Carlo Collodi publia ses aventures en feuilleton à partir de 1881. Pinocchio y est changé en âne au Pays des jouets, puis avalé par un énorme requin. Ce n’est qu’à la fin, pour avoir pris soin de son père, qu’il devient un vrai garçon.',
    'merveilleux-geppetto': 'Parti en mer chercher son fils fugueur, il est avalé par un requin géant, dans lequel il vit deux ans à la lueur d’une bougie. C’est là que Pinocchio le retrouve et le sauve. Les gamins du quartier le surnomment Polendina, à cause de sa perruque jaune.',
    'merveilleux-fee': 'Elle est pour Pinocchio à la fois une sœur et une mère. À la fin du roman, c’est elle qui le change en vrai garçon, pour le récompenser d’avoir pris soin de [[geppetto]].',
    'jungle-mowgli': 'Rudyard Kipling publia Le Livre de la jungle en 1894. Mowgli y apprend la Loi de la jungle et finit par vaincre Shere Khan avec l’aide d’un troupeau de buffles. Son nom signifie « grenouille », car il est nu et sans poils.',
    'jungle-baloo': 'Chez Kipling, Baloo est un maître exigeant, qui n’hésite pas à corriger son élève. Il lui apprend les « maîtres mots » qui lui permettent d’être reconnu par tous les peuples de la jungle.',
    'jungle-bagheera': 'Née en captivité dans la ménagerie d’un roi, elle porte sous le cou la marque de son ancien collier. Elle conseille à Mowgli de voler la « Fleur rouge », le feu, pour se défendre de Shere Khan.',
    'jungle-sherekhan': 'Boiteux de naissance, il est surnommé Lungri, « le boiteux », par la mère louve. Mowgli le vainc en lançant sur lui un troupeau de buffles dans un ravin, puis étend sa peau sur le rocher du conseil.',
    'jungle-kaa': 'Chez Kipling, Kaa est un allié de Mowgli. Sa « danse de la faim » hypnotise les singes Bandar-log, qui s’avancent malgré eux vers sa gueule. Les grands animaux eux-mêmes en restent fascinés.',
    'jungle-akela': 'Le jour où il manque sa proie, la meute, poussée par Shere Khan, veut le destituer et le tuer. Mowgli le défend avec la Fleur rouge. Les louveteaux scouts ont emprunté son nom pour désigner leur chef.',
    'jungle-hathi': 'Il raconte comment le premier tigre a tué l’homme et apporté la peur dans la jungle. Avec ses trois fils, il aide plus tard [[mowgli]] à « lâcher la jungle » sur un village hostile.',
    'jungle-rikki': 'Son histoire figure dans Le Livre de la jungle, sans lien avec [[mowgli]]. Rikki y gagne sa réputation en combattant d’abord un petit serpent venimeux. La mangouste est réellement l’un des rares prédateurs du cobra.',
    'arthur-arthur': 'La légende naît de récits gallois, puis de la chronique de Geoffroy de Monmouth, au XIIe siècle. Chrétien de Troyes y ajoute Lancelot et la quête du Graal. Blessé à mort, Arthur est emmené sur l’île d’Avalon, d’où il doit, dit-on, revenir un jour.',
    'arthur-merlin': 'On lui attribuait l’édification de Stonehenge, dont il aurait fait venir les pierres d’Irlande. Il finit enchanté par la fée Viviane, la [[damedulac|Dame du Lac]], à qui il avait enseigné sa magie, et reste prisonnier dans la forêt de Brocéliande.',
    'arthur-lancelot': 'Chrétien de Troyes raconte comment il accepta de monter dans une charrette d’infamie pour retrouver la reine enlevée. Leur amour découvert déchire la Table ronde et précipite la chute de Camelot. Il est le père de Galaad, qui trouvera le Graal.',
    'arthur-guenievre': 'Condamnée au bûcher quand sa liaison est découverte, elle est sauvée par Lancelot. Après la mort d’Arthur, elle se retire dans un couvent. Son nom vient du gallois Gwenhwyfar, souvent traduit par « blanche fée ».',
    'arthur-morgane': 'Elle règne sur l’île d’Avalon, où elle emporte Arthur mourant pour le soigner. Les mirages que l’on aperçoit parfois au-dessus de la mer, au détroit de Messine, celui de [[monstres:scylla|Scylla]], s’appellent encore « fata Morgana ».',
    'arthur-perceval': 'Chrétien de Troyes laissa son Conte du Graal inachevé vers 1180, ouvrant des siècles de suites et de mystères. Le compositeur Richard Wagner fit de son équivalent allemand, Parsifal, le héros de son dernier opéra.',
    'arthur-damedulac': 'Élève de [[merlin]], elle finit par l’emprisonner grâce à la magie qu’il lui avait enseignée. À la mort d’Arthur, l’épée lui est rendue, jetée dans le lac : une main sort des eaux pour la saisir.',
    'arthur-mordred': 'À la bataille de Camlann, Arthur et Mordred s’entretuent : le roi transperce son fils de sa lance, mais reçoit une blessure mortelle. C’est la fin de la Table ronde.',
    'robin-robin': 'Ses premières ballades datent du XVe siècle, où il n’est encore qu’un brigand populaire. Les récits plus tardifs en font un noble dépossédé, fidèle au roi Richard Cœur de Lion. On raconte qu’il fendit d’une flèche celle de son adversaire plantée au cœur de la cible.',
    'robin-marianne': 'Elle vient d’une autre tradition, celle des jeux de mai, où une Marion était la reine de la fête. Elle rejoint la légende de Robin au XVIe siècle. Une ballade raconte que les deux amoureux, déguisés, se battirent en duel sans se reconnaître.',
    'robin-petitjean': 'Impressionné, Robin l’invite à rejoindre sa bande, dont il devient le bras droit. Une tombe du village de Hathersage, dans le Derbyshire, passe pour être la sienne.',
    'robin-tuck': 'Il célèbre les messes de la bande et, dans certains récits, le mariage de Robin et de [[marianne]]. Un vrai chapelain hors-la-loi du Sussex se faisait appeler Frère Tuck au XVe siècle.',
    'robin-sherif': 'Il organise un concours de tir à l’arc pour attirer Robin dans un piège ; le hors-la-loi y vient déguisé et remporte la flèche d’or. La fonction de shérif de Nottingham existe toujours, comme titre honorifique.',
    'robin-scarlet': 'Les ballades le décrivent comme un jeune homme élégant au tempérament vif. Il est l’un des rares membres de la bande à figurer dès les plus anciens récits, aux côtés de [[petitjean]] et de Much, le fils du meunier.',
    'robin-alan': 'Devenu membre de la bande, il chante ses exploits. Dans la tradition, c’est par les chansons des ménestrels que les aventures de Robin se répandirent dans toute l’Angleterre.',
    'robin-prince': 'Il a réellement existé : devenu roi en 1199 sous le nom de Jean sans Terre, il dut accepter en 1215 la Grande Charte, qui limitait le pouvoir royal. Son surnom vient de ce qu’il n’avait reçu, enfant, aucune terre en héritage.',
    'etranges-invisible': 'L’invisibilité, qui devait le rendre tout-puissant, le condamne au froid, à la faim et à la solitude : il doit rester nu pour ne pas être vu. Il sombre dans la folie et la violence. Wells imagina aussi les Martiens de La Guerre des mondes.',
    'etranges-moreau': 'Ses créatures récitent une Loi qui leur interdit de marcher à quatre pattes ou de boire en lapant. Mais leur nature animale revient peu à peu. Le roman posait déjà la question des limites de la science.',
    'etranges-horla': 'Le narrateur finit par incendier sa propre maison pour tuer le Horla, sans savoir s’il y est parvenu. Écrit sous forme de journal, le récit laisse planer le doute : créature réelle ou folie ?',
    'etranges-quasimodo': 'Il s’éprend de la belle Esmeralda, qu’il arrache au gibet pour l’abriter dans la cathédrale en criant « Asile ! ». [[histoire:hugo|Victor Hugo]] écrivit Notre-Dame de Paris en 1831, notamment pour défendre la cathédrale, alors délabrée.',
    'etranges-mobydick': 'Le roman s’inspire d’un fait réel : en 1820, le baleinier Essex fut coulé par un cachalot en plein Pacifique. Sa première phrase, « Appelez-moi Ismaël », est l’une des plus célèbres de la littérature américaine.',
    'etranges-golem': 'Dans une autre version, le mot « emet », vérité, est inscrit sur son front ; en effaçant la première lettre, on obtient « met », mort, et le Golem s’effondre. On dit que ses restes reposent dans le grenier de la synagogue Vieille-Nouvelle de Prague.',
    'etranges-hollandais': 'Le croiser en mer annonce le malheur. La légende inspira à Richard Wagner son opéra Le Vaisseau fantôme, en 1843. Des marins de la Royal Navy affirmèrent l’avoir aperçu en 1881, au large de l’Australie.',
    'etranges-kraken': 'En 1752, l’évêque Erik Pontoppidan le décrivit dans son Histoire naturelle de la Norvège. La légende s’inspire sans doute du calmar géant, qui peut dépasser douze mètres et ne fut photographié vivant qu’en 2004. Le [[verne:nemo|capitaine Nemo]] affronte des poulpes géants dans Vingt Mille Lieues sous les mers.',
    'flibustiers-barbenoire': 'Son navire, la Revanche de la reine Anne, s’échoua en 1718 ; son épave a été retrouvée en Caroline du Nord. Il fut tué la même année par la marine britannique, au terme d’un combat acharné : on lui compta plus de vingt blessures.',
    'flibustiers-bonny': 'Capturées en 1720, Anne Bonny et Mary Read échappèrent à la pendaison en se déclarant enceintes. À Rackham, qui allait être pendu, Anne aurait reproché de ne pas s’être battu comme un homme. On ignore tout de sa fin.',
    'flibustiers-read': 'Lors de leur capture en 1720, elle et Anne Bonny furent parmi les dernières à se battre, pendant que les hommes de l’équipage, ivres, se cachaient. Elle mourut de fièvre en prison l’année suivante.',
    'flibustiers-morgan': 'Au lieu d’être puni, il fut anobli et nommé lieutenant-gouverneur de la Jamaïque, où il combattit… les pirates. Il mourut riche en 1688.',
    'flibustiers-roberts': 'Il ne buvait que du thé et imposait à son équipage un code strict : extinction des feux à huit heures, jeux d’argent interdits à bord. Il fut tué en 1722 au large de l’Afrique, par une décharge de mitraille.',
    'flibustiers-labuse': 'Selon la légende, il lança dans la foule, avant de mourir, un cryptogramme indiquant la cachette de son trésor. Des chasseurs de trésor le cherchent encore, notamment aux Seychelles et à La Réunion.',
    'flibustiers-omalley': 'En 1593, elle se rendit à Londres et rencontra en personne la reine Élisabeth Ire pour obtenir la libération de son fils. Les deux femmes auraient conversé en latin. Elle obtint gain de cause.',
    'flibustiers-surcouf': 'À la différence d’un pirate, un corsaire agit légalement, pour le compte de son pays en guerre. À un Anglais qui lui reprochait de se battre pour l’argent, il aurait répondu que chacun se bat pour ce qui lui manque. Il mourut riche armateur en 1827.',
    'forbans-silver': 'Robert Louis Stevenson, l’auteur de [[gothique:jekyll|Dr Jekyll]], publia L’Île au trésor en 1883. Silver y est à la fois menaçant et attachant, et se prend d’affection pour le jeune [[jim]]. Il s’enfuit à la fin avec une partie du trésor. Son perroquet s’appelle Capitaine Flint.',
    'forbans-jim': 'Caché dans un tonneau de pommes, il surprend [[silver]] en train de préparer la mutinerie. C’est lui qui raconte l’aventure et qui, seul, reprend le navire aux pirates.',
    'forbans-flint': 'Son nom terrifie encore ses anciens hommes, comme [[billybones]] ou [[silver]]. Sur l’île, un squelette disposé comme une flèche indique la direction du trésor.',
    'forbans-bengunn': 'Pendant sa solitude, il a déterré le trésor et l’a caché dans sa grotte : quand les pirates arrivent, la cachette est vide. Il aide [[jim]] et ses amis à l’emporter.',
    'forbans-billybones': 'Ancien second de [[flint]], il détient la carte du trésor. Il meurt d’une attaque après avoir reçu la « tache noire », le message de mort des pirates. [[jim]] trouve la carte dans son coffre.',
    'forbans-crochet': 'Le crocodile, qui a trouvé la main à son goût, le suit partout ; il a aussi avalé un réveil, dont le tic-tac annonce son approche. J. M. Barrie le décrit comme un ancien élève d’une grande école anglaise, obsédé par les bonnes manières.',
    'forbans-smee': 'Barrie le décrit comme étrangement attachant : il tue sans méchanceté et coud à la machine pendant ses loisirs. Il est l’un des rares pirates à survivre au combat final contre [[merveilleux:peterpan|Peter Pan]].',
    'forbans-blood': 'Rafael Sabatini publia ses aventures en 1922. Blood reste un gentleman : il épargne les prisonniers et finit nommé gouverneur de la Jamaïque. Son parcours s’inspire en partie de celui d’[[flibustiers:morgan|Henry Morgan]].',
    'cosmos-sgra': 'Le suivi de ces étoiles a valu le prix Nobel de physique 2020 à Reinhard Genzel et Andrea Ghez. En 2022, le réseau de radiotélescopes Event Horizon Telescope a publié la première image de son ombre, entourée d’un anneau de gaz brûlant, trois ans après celle de [[m87]].',
    'cosmos-m87': 'L’image a été obtenue en combinant huit radiotélescopes répartis sur la planète, qui ont formé un télescope virtuel aussi grand que la Terre. M87* projette aussi un jet de matière long de plusieurs milliers d’années-lumière.',
    'cosmos-ton618': 'Le gaz qui tourbillonne autour de lui chauffe tant qu’il brille des milliers de fois plus que toute notre galaxie. Son horizon serait si vaste que notre système solaire y tiendrait des dizaines de fois. Son nom vient du catalogue de l’observatoire de Tonantzintla, au Mexique.',
    'cosmos-stephenson': 'Ces mesures restent incertaines : la taille des étoiles géantes est difficile à estimer, et le titre de plus grande étoile change régulièrement de mains, comme avec UY Scuti avant elle. La lumière mettrait près de neuf heures à faire le tour de sa surface.',
    'cosmos-betelgeuse': 'Fin 2019, son éclat a brusquement baissé : on a cru à une explosion imminente, mais il s’agissait d’un nuage de poussière qu’elle avait expulsé. Elle deviendra bien une supernova, d’ici moins de cent mille ans, et brillera alors en plein jour, comme celle qui donna naissance à la [[crabe|nébuleuse du Crabe]].',
    'cosmos-r136a1': 'Les premières estimations lui donnaient plus de 300 masses solaires ; elles ont été revues à la baisse en 2022 grâce à des images plus nettes. Une étoile aussi massive vit très vite : quelques millions d’années à peine, contre une dizaine de milliards pour le Soleil.',
    'cosmos-magnetar': 'Le 27 décembre 2004, il libéra en un dixième de seconde plus d’énergie que le Soleil en cent mille ans. Bien qu’il se trouve à des dizaines de milliers d’années-lumière, ce sursaut perturba la haute atmosphère de la Terre. C’est un proche parent du pulsar de la [[crabe|nébuleuse du Crabe]].',
    'cosmos-crabe': 'En son cœur tourne un pulsar, une étoile à neutrons qui pivote sur elle-même trente fois par seconde et balaie l’espace de ses faisceaux comme un phare. La nébuleuse, située à environ 6 500 années-lumière, s’étend encore à plus de 1 500 kilomètres par seconde.',
    'cosmos-bouvier': 'Découvert en 1981, ce vide révèle la structure de l’Univers : de longs filaments de galaxies entourant d’immenses bulles vides. Si notre galaxie s’y trouvait, on aurait mis bien plus longtemps à découvrir qu’il existe d’autres galaxies que la nôtre.',
    'cosmos-oumuamua': 'Très allongé ou aplati, sans queue de comète visible, il accéléra légèrement en s’éloignant du Soleil, ce qui fit beaucoup débattre. On pense aujourd’hui qu’il pourrait s’agir d’un fragment de glace dégazant de façon invisible. Il est reparti vers l’espace interstellaire.',
    'nordique-baldr': 'Les dieux s’amusaient à lui lancer des armes qui ne le touchaient pas. [[loki]] fit lancer une branche de gui par le dieu aveugle Höd, qui tua Baldr. Sa mort plongea les dieux dans le deuil : il ne reviendra qu’après le Ragnarök, dans un monde renouvelé.',
    'nordique-freyr': 'Pour épouser la géante Gerd, il donna son épée, qui combattait seule. Au Ragnarök, il affrontera le géant de feu [[jotnar:surt|Surt]] armé d’un simple bois de cerf, et périra.',
    'creatures-jormungandr': 'Un jour, [[nordique:thor|Thor]], parti pêcher avec le géant Hymir, le ferra avec une tête de bœuf pour appât et le hissa hors de l’eau, avant que le géant, terrifié, ne coupe la ligne. Au Ragnarök, ils s’entretueront : Thor l’abattra mais succombera à son venin après neuf pas.',
    'creatures-sleipnir': 'Il est né de [[nordique:loki|Loki]], changé en jument pour détourner l’étalon d’un géant qui bâtissait les remparts d’Asgard. C’est sur Sleipnir que Hermod descendit chez [[jotnar:hel|Hel]] pour tenter de ramener [[nordique:baldr|Baldr]].',
    'creatures-nidhogg': 'Il échange des insultes avec l’aigle perché au sommet de l’arbre, grâce à l’écureuil [[ratatosk]] qui court porter leurs messages. Selon la Völuspá, le grand poème de la fin du monde, il survolera encore la terre après le Ragnarök.',
    'creatures-ratatosk': 'Son nom signifierait « dent qui perce ». Il n’apparaît que dans quelques lignes de l’Edda, mais il est devenu l’une des figures les plus attachantes de la mythologie nordique.',
    'creatures-huginmunin': 'Leurs noms signifient « Pensée » et « Mémoire ». Dans un poème de l’Edda, Odin dit craindre de ne pas voir revenir Hugin, mais plus encore Munin. Le corbeau figurait sur certaines bannières des Vikings.',
    'creatures-garm': 'Comme [[monstres:cerbere|Cerbère]] chez les Grecs, il veille sur le monde des morts. Au Ragnarök, il brisera ses chaînes et affrontera le dieu [[nordique:tyr|Týr]] : les deux s’entretueront.',
    'creatures-audhumla': 'Elle-même se nourrissait en léchant des blocs de glace salée. En trois jours, elle en dégagea un homme, Buri, le grand-père d’[[nordique:odin|Odin]] : ainsi apparut la lignée des dieux.',
    'jotnar-surt': 'Il tuera [[nordique:freyr|Freyr]], puis embrasera les neuf mondes, qui sombreront dans les flammes. En Islande, une grande grotte de lave, Surtshellir, porte son nom, comme l’île de Surtsey, née d’une éruption sous-marine en 1963.',
    'jotnar-hel': 'Quand les dieux la supplièrent de rendre [[nordique:baldr|Baldr]], elle accepta à une condition : que toutes les choses du monde le pleurent. Une seule géante refusa, sans doute Loki déguisé, et Baldr resta chez elle.',
    'jotnar-angrboda': 'Son nom signifie « celle qui annonce le malheur ». Certains auteurs voient en elle la voyante qu’Odin réveille d’entre les morts dans les poèmes de l’Edda. Son rôle rappelle celui d’Échidna, la mère des monstres grecs.',
    'jotnar-skadi': 'Elle aimait les montagnes enneigées, lui la mer : ils finirent par vivre séparés. Chasseresse à skis et à l’arc, elle est l’une des rares géantes accueillies parmi les dieux. Certains rapprochent son nom de celui de la Scandinavie.',
    'jotnar-thrym': 'Thor dut se déguiser en mariée, accompagné de [[nordique:loki|Loki]] en demoiselle d’honneur. Au festin, la fausse fiancée dévora un bœuf entier et huit saumons. Quand le marteau fut posé sur ses genoux pour bénir l’union, Thor le saisit et terrassa les géants.',
    'jotnar-utgardaloki': 'Thor échoua à chaque fois, avant d’apprendre la vérité : la corne plongeait dans l’océan, le chat était le serpent [[creatures:jormungandr|Jörmungandr]] et la vieille femme, la Vieillesse elle-même. Il n’a aucun lien avec le dieu [[nordique:loki|Loki]].',
    'jotnar-hrungnir': 'Le marteau de Thor brisa sa pierre à aiguiser, dont un éclat se ficha dans le front du dieu, qui le garda toute sa vie. Selon Snorri Sturluson, les autres éclats sont à l’origine de toutes les pierres à aiguiser du monde.',
    'jotnar-aegir': 'Il reçoit les dieux dans sa grande salle et leur brasse de la bière dans un chaudron immense, que [[nordique:thor|Thor]] rapporta de chez le géant Hymir. Les marins disaient d’une mer démontée qu’Ægir ouvrait la gueule.',
    'mondes-asgard': 'On y trouve le Valhalla, la halle d’[[nordique:odin|Odin]] aux cinq cent quarante portes, où les guerriers morts au combat festoient en attendant le Ragnarök. Les Valkyries y conduisent les plus braves.',
    'mondes-midgard': 'Il est cerné par l’océan, où vit le serpent [[creatures:jormungandr|Jörmungandr]]. Son nom signifie « l’enclos du milieu » ; par l’anglais ancien, il a inspiré à Tolkien le nom de la « Terre du Milieu ».',
    'mondes-jotunheim': 'On y trouve la forteresse d’[[jotnar:utgardaloki|Útgarda-Loki]] et le puits de Mímir, où [[nordique:odin|Odin]] sacrifia un œil pour boire la sagesse. En Norvège, le massif du Jotunheimen, qui porte les plus hauts sommets du pays, lui doit son nom.',
    'mondes-vanaheim': 'Les Vanes firent autrefois la guerre aux Ases, la première guerre du monde. Pour sceller la paix, les deux camps échangèrent des otages : c’est ainsi que Njörd et ses enfants vinrent vivre à Asgard. Les textes ne disent presque rien de Vanaheim lui-même.',
    'mondes-alfheim': 'Les Scandinaves rendaient un culte aux elfes, des êtres proches des ancêtres et de la fertilité. Les elfes de Tolkien, grands et lumineux, s’inspirent en partie de ceux-là, bien loin des petits lutins des contes.',
    'mondes-nidavellir': 'On l’associe à Svartalfheim, le monde des elfes noirs, que les textes confondent souvent avec les nains. C’est là que fut fabriqué Gleipnir, le lien qui retient le loup [[creatures:fenrir|Fenrir]].',
    'mondes-muspellheim': 'Les étincelles jaillies de Muspellheim devinrent le soleil, la lune et les étoiles, placés dans le ciel par les dieux. C’est la rencontre de son feu avec la glace de [[niflheim]] qui fit naître la vie.',
    'mondes-niflheim': 'Ses glaces, fondues au contact du feu de [[muspellheim]], donnèrent naissance au géant Ymir et à la vache [[creatures:audhumla|Audhumla]]. Le dragon [[creatures:nidhogg|Nidhögg]] ronge la racine d’Yggdrasil qui plonge jusqu’ici.',
    'mondes-helheim': 'L’entrée est gardée par le chien [[creatures:garm|Garm]]. Contrairement à l’enfer chrétien, ce n’est pas un lieu de châtiment. Le mot anglais « hell » partage pourtant la même origine que le nom de Hel.',
    'titans-cronos': 'Son règne fut plus tard décrit comme un âge d’or, où les hommes vivaient sans travail ni vieillesse. Les Romains l’identifièrent à Saturne, dont les fêtes, les Saturnales, renversaient l’ordre social pendant quelques jours. La faucille reste son attribut.',
    'titans-rhea': 'Elle est souvent rapprochée de Cybèle, la grande déesse mère venue d’Asie Mineure, représentée sur un char tiré par des lions. On l’honorait au son des tambourins et des cymbales, en souvenir des Courètes qui avaient couvert les pleurs de l’enfant.',
    'titans-oceanos': 'Avec son épouse Téthys, il eut trois mille fils, les fleuves, et trois mille filles, les Océanides. Parmi elles, Métis, la première épouse de Zeus. Sur les cartes anciennes, son cours marque la limite du monde connu.',
    'titans-hyperion': 'Les poètes grecs le confondent parfois avec son fils Hélios. Selon certains récits, il fut l’un des quatre Titans qui maintinrent Ouranos pendant que [[cronos]] le mutilait. Le poète anglais Keats lui consacra un long poème inachevé.',
    'titans-themis': 'Avant Apollon, elle aurait tenu l’oracle de Delphes. On la représente tenant une balance, parfois les yeux bandés : c’est elle que l’on voit encore devant de nombreux palais de justice.',
    'titans-mnemosyne': 'Dans certains rites funéraires, les initiés devaient boire aux Enfers à la source de Mnémosyne, et non à celle du Léthé, qui fait tout oublier. Le mot « mnémotechnique » vient de son nom.',
    'titans-japet': 'Ses fils ont tous défié l’ordre des dieux, et tous en ont payé le prix. Certains auteurs anciens voyaient en lui l’ancêtre de l’humanité, par Prométhée et son fils Deucalion.',
    'titans-atlas': 'Lors de son onzième travail, [[heros:heracles|Héraclès]] prit sa place quelques instants pour qu’il aille cueillir les pommes d’or des Hespérides. Au XVIe siècle, le géographe Mercator donna le nom d’Atlas à son recueil de cartes, et le mot est resté. Les montagnes de l’Atlas, au Maroc, portent aussi son nom.',
    'titans-promethee': 'Son nom signifie « celui qui réfléchit avant », par opposition à son frère Épiméthée, « celui qui réfléchit après », qui accepta Pandore malgré ses avertissements. C’est [[heros:heracles|Héraclès]] qui le délivra en abattant l’aigle. Eschyle lui consacra une tragédie, Prométhée enchaîné.',
    'geants-alcyonee': 'Il avait volé les troupeaux du Soleil avant la guerre contre les dieux. De chagrin, ses filles, les Alcyonides, se jetèrent à la mer et furent changées en martins-pêcheurs, les alcyons.',
    'geants-porphyrion': 'Selon Apollodore, Zeus lui inspira un désir soudain pour Héra afin de le distraire au cœur de la bataille. Son nom évoque la pourpre, la couleur des flammes ou du sang. Le poète Pindare le désigne comme le roi des Géants.',
    'geants-encelade': 'Pour les Anciens, ses mouvements sous la terre provoquaient les séismes de Sicile, et son souffle les éruptions de l’Etna. Une lune glacée de Saturne porte son nom : elle projette d’immenses geysers dans l’espace.',
    'geants-ephialtes': 'Son nom désignait aussi, chez les Grecs, le démon du cauchemar qui pèse sur la poitrine des dormeurs. Il ne faut pas le confondre avec Éphialtès l’Aloade, qui tenta avec son frère Otos d’empiler des montagnes pour escalader le ciel.',
    'geants-mimas': 'Le mont Mimas, en Asie Mineure, porte son nom, comme une petite lune de Saturne reconnaissable à son immense cratère, qui lui donne l’air d’un grand œil.',
    'geants-polypheme': 'Ulysse lui avait dit s’appeler « Personne » : quand Polyphème hurla que Personne l’attaquait, les autres Cyclopes ne vinrent pas l’aider. Sa colère, transmise à son père Poséidon, poursuivit Ulysse pendant dix ans. D’autres récits le montrent soupirant pour la nymphe Galatée.',
    'geants-briaree': 'Il devint ensuite le gardien des Titans prisonniers. Dans l’Iliade, la déesse Thétis l’appelle au secours de [[grece:zeus|Zeus]] quand les autres dieux veulent l’enchaîner : sa seule présence suffit à les faire renoncer.',
    'geants-antee': '[[heros:heracles|Héraclès]] devina son secret : il le souleva de terre et l’étouffa dans ses bras. Antée bâtissait un temple à son père avec les crânes de ses victimes.',
    'pharaons-narmer': 'La palette de Narmer, une plaque de schiste sculptée découverte à Hiérakonpolis, le montre coiffé tour à tour de la couronne blanche du Sud et de la couronne rouge du Nord. Elle est conservée au musée du Caire. Les Grecs attribuaient cette unification à un roi nommé Ménès, peut-être le même homme.',
    'pharaons-kheops': 'C’est la seule des Sept Merveilles du monde antique encore debout. Ironie de l’histoire, le seul portrait sûr de son bâtisseur est une statuette d’ivoire de quelques centimètres. Au pied de la pyramide, on a retrouvé une grande barque démontée, destinée à son voyage dans l’au-delà.',
    'pharaons-hatchepsout': 'Son règne fut prospère : elle envoya une grande expédition au pays de Pount, d’où l’on rapporta de l’encens et des arbres à myrrhe. Son temple funéraire de Deir el-Bahari, étagé contre la falaise, compte parmi les plus beaux d’Égypte. Après sa mort, son nom fut martelé sur de nombreux monuments.',
    'pharaons-thoutmosis': 'Sa victoire à Megiddo, vers 1457 av. J.-C., est l’une des premières batailles dont on connaisse le déroulement en détail, grâce aux annales gravées à Karnak. On l’a parfois surnommé le « Napoléon de l’Égypte ». L’obélisque dressé à Istanbul vient de l’un de ses monuments.',
    'pharaons-akhenaton': 'L’art de son règne rompt avec la tradition : le roi y apparaît avec un visage allongé et un corps aux formes inhabituelles, en famille, dans des scènes intimes. Après sa mort, les anciens dieux furent rétablis, sa capitale abandonnée et son nom effacé des listes royales. Il fut probablement le père de [[toutankhamon]].',
    'pharaons-nefertiti': 'Son buste peint, découvert en 1912 dans l’atelier du sculpteur Thoutmôsis à Amarna, est exposé au Neues Museum de Berlin. Certains historiens pensent qu’elle régna seule, sous un autre nom, après la mort de son époux. Son tombeau n’a jamais été identifié avec certitude.',
    'pharaons-toutankhamon': 'En 1922, l’archéologue Howard Carter découvrit son tombeau presque intact dans la Vallée des Rois. On y trouva plus de cinq mille objets, dont le célèbre masque funéraire en or. La légende d’une malédiction naquit de la mort de lord Carnarvon, qui finançait les fouilles, quelques mois plus tard.',
    'pharaons-ramses': 'Il couvrit l’Égypte de monuments, dont les temples d’Abou Simbel, taillés dans la falaise et déplacés bloc par bloc dans les années 1960 pour échapper aux eaux du lac Nasser. En 1976, sa momie fut accueillie à Paris avec les honneurs militaires, pour y être soignée contre des champignons.',
    'pharaons-cleopatre': 'Vaincue avec Antoine à la bataille d’Actium en 31 av. J.-C., elle se donna la mort l’année suivante, selon la tradition par la morsure d’un aspic. L’Égypte devint alors une province romaine. Elle a vécu plus près de nous dans le temps que de la construction de la pyramide de [[kheops]].',
    'heros-heracles': 'Encore au berceau, il étrangla les deux serpents envoyés par [[grece:hera]]. Parmi ses travaux : le lion de Némée, l’hydre de Lerne aux têtes qui repoussent, les écuries d’Augias. À sa mort, il fut accueilli sur l’Olympe et devint immortel.',

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
    'merveilleux-alice': 'Le récit naquit d’une promenade en barque sur la Tamise, en 1862, pour amuser la petite Alice Liddell et ses sœurs. Elle y croise le Chapelier fou, le Chat de Cheshire et la Reine de cœur. Carroll lui offrit une suite en 1871 : De l’autre côté du miroir.',
    'merveilleux-peterpan': 'Accompagné de la fée Clochette, il affronte le [[forbans:crochet|capitaine Crochet]], dont il a tranché la main pour la jeter à un crocodile. Barrie légua les droits de son œuvre au Great Ormond Street Hospital, un hôpital pour enfants de Londres.',
    'contes-poucet': 'Par une ruse, il fait égorger par l’ogre ses propres filles à la place de ses frères. Il lui vole ensuite ses bottes de sept lieues, qui s’ajustent à la taille de celui qui les porte. Le conte clôt le recueil de Perrault, en 1697.',
    'contes-barbebleue': 'La clé, tachée de sang, la trahit : rien ne peut la nettoyer. Alors que la Barbe bleue s’apprête à la tuer, elle appelle sa sœur, qui guette du haut d’une tour : « Anne, ma sœur Anne, ne vois-tu rien venir ? ». Ses frères arrivent juste à temps.',
    'contes-hansel': 'Pour tromper la sorcière, presque aveugle, Hansel lui tend un petit os au lieu de son doigt. C’est finalement Gretel qui la pousse dans le four. Les frères Grimm publièrent le conte en 1812 ; la maisonnette ne deviendra que plus tard une maison de pain d’épice.',
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
    'creatures-fenrir': 'Les dieux brisèrent deux chaînes avant de lui passer Gleipnir, fine comme un ruban, faite du bruit des pas d’un chat, de la barbe d’une femme et des racines d’une montagne. Au Ragnarök, il se libérera et avalera [[nordique:odin]].',
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
  var ALL = ['grece', 'titans', 'geants', 'heros', 'monstres', 'egypte', 'pharaons', 'planetes', 'lunes', 'gothique', 'contes', 'histoire', 'nordique', 'creatures', 'jotnar', 'mondes', 'astronautes', 'missions', 'cosmos', 'detectives', 'verne', 'mousquetaires', 'nuits', 'merveilleux', 'jungle', 'arthur', 'robin', 'etranges', 'flibustiers', 'forbans'];
  A.PACKS = [
    {
      id: 'daily', name: 'Booster quotidien', kicker: 'Offert chaque jour', price: 0, size: 3, theme: 'ivory', daily: true,
      cover: 'merveilleux-alice-base',
      collections: ALL.filter(function (c) { return ['nordique', 'creatures', 'jotnar', 'mondes'].indexOf(c) === -1; }),
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
      collections: ['nordique', 'creatures', 'jotnar', 'mondes'],
      odds: { base: 0.72, rare: 0.19, epic: 0.065, legendary: 0.018, mythic: 0.005, unique: 0.002 },
      guarantee: { odds: { rare: 0.8, epic: 0.15, legendary: 0.035, mythic: 0.012, unique: 0.003 } },
      desc: 'Booster de lancement de la nouvelle collection Mythologie nordique : dieux, créatures, géants et neuf mondes. Une carte numérotée garantie.',
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
