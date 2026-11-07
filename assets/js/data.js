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
      id: 'histoire', group: 'france', name: 'Les Souverains', family: 'Histoire de France', universe: 'Histoire', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 5,
      tagline: 'Chefs gaulois, rois et empereurs qui ont gouverné la France.',
      description: 'De Vercingétorix à Napoléon, en passant par Clovis, Saint Louis et le Roi-Soleil : ceux qui ont régné sur la France et façonné son territoire.'
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
    },
    {
      id: 'presidents', name: 'Les Présidents', family: 'Histoire de France', group: 'france', universe: 'Histoire', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Les présidents de la République, de 1848 à 2007.',
      description: 'Les chefs de l’État qui ont présidé la République française, de la IIe à la Ve République, avec les grands moments de leurs mandats.'
    },
    {
      id: 'herosfr', name: 'Les Héros de France', family: 'Histoire de France', group: 'france', universe: 'Histoire', motif: 'castle',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Chevaliers, combattantes et résistants qui ont défendu la France et ses libertés.',
      description: 'De Jeanne d’Arc à Jean Moulin, celles et ceux qui ont pris les armes ou la plume pour la France et pour la liberté.'
    },
    {
      id: 'savants', name: 'Les Savants', family: 'Histoire de France', group: 'france', universe: 'Sciences', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Chimistes, mathématiciens et inventeurs qui ont fait avancer la science.',
      description: 'De Pascal à Marie Curie, les savants et inventeurs français qui ont changé notre regard sur le monde, du vaccin au cinéma.'
    },
    {
      id: 'ecrivains', name: 'Les Écrivains', family: 'Histoire de France', group: 'france', universe: 'Littérature', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Les plumes qui ont fait la langue et la littérature françaises.',
      description: 'De Molière à Zola, les auteurs qui ont fait rire, rêver et réfléchir des générations de lecteurs, et donné au français ses chefs-d’œuvre.'
    },
    {
      id: 'kami', name: 'Les Kami', family: 'Le Japon', group: 'japon', universe: 'Mythologies', motif: 'torii',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Les divinités du shintoïsme, du soleil aux tempêtes.',
      description: 'Amaterasu, Susanoo, Izanagi et Izanami : les dieux qui ont créé l’archipel et dont descend, selon la tradition, la famille impériale.'
    },
    {
      id: 'yokai', name: 'Les Yōkai', family: 'Le Japon', group: 'japon', universe: 'Mythologies', motif: 'torii',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Renards à neuf queues, démons et parapluies hantés.',
      description: 'Les esprits et créatures du folklore japonais, tour à tour farceurs, effrayants ou bienveillants, qui peuplent les rivières, les montagnes et les vieilles maisons.'
    },
    {
      id: 'samourais', name: 'Les Samouraïs', family: 'Le Japon', group: 'japon', universe: 'Histoire', motif: 'pagoda',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Les plus grands guerriers et seigneurs de guerre du Japon.',
      description: 'De la guerre de Genpei à l’unification du pays, les samouraïs, moines guerriers et daimyō dont les exploits ont fait la légende du Japon.'
    },
    {
      id: 'epoques', name: 'Les Grandes Époques', family: 'Le Japon', group: 'japon', universe: 'Histoire', motif: 'pagoda',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'De la préhistoire Jōmon au Japon moderne de l’ère Meiji.',
      description: 'Les grandes périodes de l’histoire japonaise, de la cour raffinée de Heian à la grande paix d’Edo, chacune avec ses arts, ses guerriers et ses chefs-d’œuvre.'
    },
    {
      id: 'eaux', name: 'Les Monstres des eaux', family: 'Cryptozoologie', group: 'cryptozoo', universe: 'Mystères', motif: 'fjord',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Lacs profonds, marais et océans : ce qui nagerait sous la surface.',
      description: 'Des lochs d’Écosse aux marais du Congo, des créatures qu’aucun filet n’a jamais remontées, mais que des milliers de témoins jurent avoir aperçues.'
    },
    {
      id: 'hommessauvages', name: 'Les Hommes sauvages', family: 'Cryptozoologie', group: 'cryptozoo', universe: 'Mystères', motif: 'peak',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Géants poilus des forêts et des neiges éternelles.',
      description: 'Yéti, Bigfoot, Almasty : sur tous les continents, des récits décrivent un grand primate qui marche debout et fuit les humains. Empreintes, poils et témoignages, mais jamais de corps.'
    },
    {
      id: 'betes', name: 'Les Bêtes mystérieuses', family: 'Cryptozoologie', group: 'cryptozoo', universe: 'Mystères', motif: 'forest',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Chupacabra, Mothman, dahu : vraies peurs et belles farces.',
      description: 'Des créatures de la nuit américaine aux canulars des montagnes françaises, sans oublier celle qu’on prenait pour une légende jusqu’à sa découverte.'
    },
    {
      id: 'citesperdues', name: 'Les Cités perdues', family: 'Mystères du monde', group: 'mysteres', universe: 'Mystères', motif: 'temple',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Atlantide, Eldorado, Ys : les villes que l’on cherche encore.',
      description: 'Englouties, cachées ou rêvées, ces cités ont lancé des générations d’explorateurs sur les routes. Certaines n’ont jamais existé ; d’autres ont fini par sortir de terre.'
    },
    {
      id: 'enigmes', name: 'Les Grandes Énigmes', family: 'Mystères du monde', group: 'mysteres', universe: 'Mystères', motif: 'obelisk',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Pierres dressées, dessins géants et manuscrits indéchiffrables.',
      description: 'Qui a construit Stonehenge ? Pourquoi les lignes de Nazca ? Ces énigmes ont résisté aux siècles ; la science a percé certaines d’entre elles, d’autres attendent encore.'
    },
    {
      id: 'tresors', name: 'Les Trésors perdus', family: 'Mystères du monde', group: 'mysteres', universe: 'Mystères', motif: 'cave',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Graal, trésor des Templiers, chambre d’ambre : jamais retrouvés.',
      description: 'Coupe sacrée, or des conquistadors, salle d’ambre volée : des trésors qui ont disparu de l’histoire et que l’on cherche encore, carte à la main.'
    },
    {
      id: 'dinosaures', name: 'Les Dinosaures', family: 'Préhistoire', group: 'prehistoire', universe: 'Sciences', motif: 'volcano',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Tyrannosaure, tricératops, vélociraptor : les maîtres de la Terre.',
      description: 'Pendant plus de 160 millions d’années, les dinosaures ont dominé les continents. Les fossiles nous racontent leurs combats, leurs plumes et leurs records.'
    },
    {
      id: 'mersciel', name: 'Mers et cieux préhistoriques', family: 'Préhistoire', group: 'prehistoire', universe: 'Sciences', motif: 'fjord',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Reptiles marins, requins géants et ptérosaures.',
      description: 'Pendant que les dinosaures régnaient sur la terre, d’autres géants régnaient sur les océans et dans le ciel. Aucun n’était un dinosaure, mais tous étaient redoutables.'
    },
    {
      id: 'megafaune', name: 'Les Géants disparus', family: 'Préhistoire', group: 'prehistoire', universe: 'Sciences', motif: 'peak',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Mammouths, tigres à dents de sabre et paresseux géants.',
      description: 'Pendant les grandes glaciations, des géants à fourrure parcouraient la planète. Nos ancêtres les ont chassés et peints sur les parois des grottes.'
    },
    {
      id: 'navires', name: 'Les Navires de l’histoire', family: 'Navires légendaires', group: 'marine', universe: 'Histoire', motif: 'ship',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Caravelles, frégates et paquebots qui ont changé le monde.',
      description: 'De la Santa María au Titanic, les navires qui ont ouvert des routes, gagné des batailles ou sombré dans la légende.'
    },
    {
      id: 'maudits', name: 'Les Navires maudits', family: 'Navires légendaires', group: 'marine', universe: 'Histoire', motif: 'ship',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Navires fantômes, naufrages et mutineries.',
      description: 'Équipages volatilisés, épaves dérivant pendant des décennies, mutineries sanglantes : les mers ont leurs histoires noires, toutes bien réelles ou presque.'
    },
    {
      id: 'alchimistes', name: 'Les Mages et alchimistes', family: 'Magie et illusion', group: 'magie', universe: 'Histoire', motif: 'tower',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Pierre philosophale, prophéties et langage des anges.',
      description: 'Savants, médecins ou aventuriers : des hommes bien réels dont la légende a fait des magiciens. Entre science naissante et goût du secret.'
    },
    {
      id: 'illusionnistes', name: 'Les Illusionnistes', family: 'Magie et illusion', group: 'magie', universe: 'Histoire', motif: 'dome',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Évasions, fantômes et tours de scène.',
      description: 'Ils ne prétendaient pas avoir des pouvoirs : ils créaient l’émerveillement. Les grands magiciens de scène, de Robert-Houdin à Méliès.'
    },
    {
      id: 'celtes', name: 'Les Dieux celtes', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'forest',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Lug, Dagda, Morrigan : les dieux et héros d’Irlande et de Gaule.',
      description: 'Les récits irlandais du Moyen Âge ont gardé la mémoire des Tuatha Dé Danann, le peuple divin, et de héros comme Cúchulainn. Des dieux dont on retrouve aussi la trace en Gaule.'
    },
    {
      id: 'azteques', name: 'Les Dieux aztèques', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'pyramids',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Serpent à plumes, miroir fumant et soleil guerrier.',
      description: 'Les Mexicas, que l’on appelle Aztèques, honoraient des dieux du soleil, de la pluie et de la guerre depuis leur capitale lacustre. Leurs mythes racontent des mondes détruits et recréés.'
    },
    {
      id: 'chine', name: 'Les Légendes chinoises', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'pagoda',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Le Roi Singe, la déesse de la Lune et les rois dragons.',
      description: 'Des géants qui séparèrent le ciel de la terre aux héros du roman La Pérégrination vers l’Ouest, les légendes que l’on raconte en Chine depuis des siècles.'
    },
    {
      id: 'inde', name: 'Les Récits de l’Inde', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'temple',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Ganesh, Hanuman, Shiva : divinités et héros des grandes épopées.',
      description: 'Le Ramayana et le Mahabharata, immenses épopées de l’Inde, racontent les exploits des dieux et des héros. Ces divinités sont aujourd’hui encore vénérées par des centaines de millions de personnes.'
    },
    {
      id: 'slaves', name: 'Les Contes slaves', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'forest',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Baba Yaga, l’oiseau de feu et Koschei l’Immortel.',
      description: 'Les forêts de Russie, d’Ukraine et des pays slaves abritent sorcières, esprits domestiques et dragons à trois têtes, dans des contes transmis de génération en génération.'
    },
    {
      id: 'afrique', name: 'Les Légendes d’Afrique', family: 'Mythologies du monde', group: 'mythesmonde', universe: 'Mythologies', motif: 'palms',
      edition: 'Édition I', status: 'live', popular: 30,
      tagline: 'Anansi l’araignée, Soundiata et les esprits des fleuves.',
      description: 'Des contes d’Anansi à l’épopée de Soundiata chantée par les griots, des esprits des eaux aux dragons des marais : quelques légendes d’un continent aux mille traditions.'
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
  A.GROUPS.push({
    id: 'france', name: 'Histoire de France', subs: ['histoire', 'presidents', 'herosfr', 'savants', 'ecrivains'], title: 'Mémoire de la France',
    tagline: 'Souverains, présidents, héros, savants et écrivains : ceux qui ont façonné la France.',
    description: 'De la Gaule à la Ve République, les femmes et les hommes qui ont gouverné, défendu, inventé et raconté la France, en cinq sous-collections.'
  });
  A.GROUPS.push({
    id: 'japon', name: 'Le Japon', subs: ['kami', 'yokai', 'samourais', 'epoques'], title: 'Shōgun',
    tagline: 'Kami, yōkai, samouraïs et grandes époques : le Japon des mythes et de l’histoire.',
    description: 'Des dieux qui ont créé l’archipel aux esprits du folklore, des samouraïs légendaires aux grandes époques de son histoire : le Japon en quatre sous-collections.'
  });
  A.GROUPS.push({
    id: 'cryptozoo', name: 'Cryptozoologie', subs: ['eaux', 'hommessauvages', 'betes'], title: 'Cryptozoologue',
    tagline: 'Nessie, le Yéti, le Chupacabra : les créatures que l’on cherche encore.',
    description: 'La cryptozoologie traque les animaux dont l’existence n’a jamais été prouvée. Entre témoignages troublants, canulars célèbres et vraies découvertes, trois sous-collections pour enquêter.'
  });
  A.GROUPS.push({
    id: 'mysteres', name: 'Mystères du monde', subs: ['citesperdues', 'enigmes', 'tresors'], title: 'Gardien des secrets',
    tagline: 'Cités englouties, énigmes de pierre et trésors disparus.',
    description: 'Atlantide, Stonehenge, Saint Graal : ce que l’on sait vraiment, ce que l’on croit savoir, et ce qui reste à découvrir. Trois sous-collections pour les amateurs de mystères.'
  });
  A.GROUPS.push({
    id: 'prehistoire', name: 'Préhistoire', subs: ['dinosaures', 'mersciel', 'megafaune'], title: 'Paléontologue',
    tagline: 'Dinosaures, monstres marins et géants de l’âge de glace.',
    description: 'Des premiers poissons cuirassés aux mammouths, des centaines de millions d’années d’histoire de la vie. Trois sous-collections construites à partir de vrais fossiles.'
  });
  A.GROUPS.push({
    id: 'marine', name: 'Navires légendaires', subs: ['navires', 'maudits'], title: 'Amiral',
    tagline: 'Navires de légende et vaisseaux maudits.',
    description: 'Les navires qui ont fait le tour du monde, gagné des batailles ou disparu sans laisser de trace : l’histoire des océans en deux sous-collections.'
  });
  A.GROUPS.push({
    id: 'magie', name: 'Magie et illusion', subs: ['alchimistes', 'illusionnistes'], title: 'Grand Mage',
    tagline: 'Alchimistes, prophètes et magiciens de scène.',
    description: 'De la pierre philosophale aux tours de scène, l’histoire de ceux qui ont voulu percer les secrets du monde, ou simplement émerveiller le public. Deux sous-collections, de la pierre philosophale au cinéma de Méliès.'
  });
  A.GROUPS.push({
    id: 'mythesmonde', name: 'Mythologies du monde', subs: ['celtes', 'azteques', 'chine', 'inde', 'slaves', 'afrique'], title: 'Mythographe',
    tagline: 'Celtes, Aztèques, Chine, Inde, monde slave et Afrique.',
    description: 'Six traditions, six façons de raconter la naissance du monde, les dieux et les héros. Un tour du monde des mythes, en complément de la Grèce, de l’Égypte, du Nord et du Japon.'
  });
  A.GROUP = {};
  A.GROUPS.forEach(function (g) { A.GROUP[g.id] = g; });

  A.UPCOMING = [
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
    presidents: [
      ['louisnapoleon', 'Louis-Napoléon Bonaparte', 'Le Premier Président', 78, 80, 88, 'BREL', 'Premier président de la République française, élu en 1848.'],
      ['thiers', 'Adolphe Thiers', 'Le Président de 1871', 72, 84, 92, 'BRE', 'Premier président de la IIIe République.'],
      ['carnot', 'Sadi Carnot', 'Le Président du centenaire', 70, 82, 86, 'BRE', 'Président de 1887 à 1894, assassiné à Lyon.'],
      ['poincare', 'Raymond Poincaré', 'Le Président de la Grande Guerre', 74, 88, 90, 'BRE', 'Président de la République pendant la Première Guerre mondiale.'],
      ['pompidou', 'Georges Pompidou', 'Le Président de la modernisation', 70, 82, 92, 'BREL', 'Président de 1969 à 1974.'],
      ['giscard', 'Valéry Giscard d’Estaing', 'Le Président réformateur', 68, 80, 94, 'BREL', 'Président de 1974 à 1981.'],
      ['mitterrand', 'François Mitterrand', 'Le Président des grands travaux', 72, 84, 94, 'BRELM', 'Président de 1981 à 1995, le plus long mandat de la Ve République.'],
      ['chirac', 'Jacques Chirac', 'Le Président de deux mandats', 76, 84, 86, 'BREL', 'Président de 1995 à 2007.'],
      ['degaulle', 'Charles de Gaulle', 'L’Homme du 18 Juin', 80, 90, 94, 'BRELMU', 'Chef de la France libre puis fondateur de la Ve République.']
    ],
    herosfr: [
      ['duguesclin', 'Bertrand du Guesclin', 'Le Dogue de Brocéliande', 90, 86, 78, 'BREL', 'Chevalier breton, connétable de France pendant la guerre de Cent Ans.'],
      ['bayard', 'Le Chevalier Bayard', 'Sans peur et sans reproche', 88, 90, 80, 'BREL', 'Chevalier modèle de la Renaissance.'],
      ['lafayette', 'La Fayette', 'Le Héros des deux mondes', 84, 82, 88, 'BREL', 'Marquis parti combattre pour l’indépendance américaine.'],
      ['gouges', 'Olympe de Gouges', 'La Plume de l’égalité', 62, 74, 96, 'BREL', 'Femme de lettres qui réclama l’égalité des droits pour les femmes.'],
      ['moulin', 'Jean Moulin', 'L’Unificateur de la Résistance', 76, 88, 94, 'BRELM', 'Résistant qui unifia les mouvements de la Résistance.'],
      ['baker', 'Joséphine Baker', 'La Résistante du music-hall', 70, 80, 90, 'BRELM', 'Star du music-hall, résistante et militante contre le racisme.'],
      ['aubrac', 'Lucie Aubrac', 'L’Audacieuse', 80, 82, 90, 'BREL', 'Résistante qui fit évader son mari des mains de la Gestapo.'],
      ['jeanne', 'Jeanne d’Arc', 'La Pucelle d’Orléans', 84, 82, 88, 'BRELM', 'Jeune paysanne lorraine devenue cheffe de guerre.']
    ],
    savants: [
      ['pasteur', 'Louis Pasteur', 'Le Vainqueur de la rage', 62, 84, 98, 'BRELM', 'Chimiste et biologiste, inventeur du vaccin contre la rage.'],
      ['lavoisier', 'Antoine Lavoisier', 'Le Père de la chimie', 58, 80, 99, 'BREL', 'Fondateur de la chimie moderne.'],
      ['pascal', 'Blaise Pascal', 'Le Génie précoce', 54, 76, 99, 'BREL', 'Mathématicien, physicien et philosophe.'],
      ['champollion', 'Jean-François Champollion', 'Le Déchiffreur', 56, 74, 99, 'BRELM', 'Il déchiffra les hiéroglyphes égyptiens en 1822.'],
      ['lumiere', 'Les Frères Lumière', 'Les Inventeurs du cinéma', 60, 78, 96, 'BRELM', 'Inventeurs du cinématographe.'],
      ['eiffel', 'Gustave Eiffel', 'Le Magicien du fer', 70, 92, 90, 'BREL', 'Ingénieur de la tour Eiffel.'],
      ['germain', 'Sophie Germain', 'La Mathématicienne cachée', 52, 78, 98, 'BRE', 'Mathématicienne qui dut se cacher derrière un nom d’homme.'],
      ['curie', 'Marie Curie', 'Pionnière de la radioactivité', 52, 70, 99, 'BREL', 'Double lauréate du prix Nobel, en physique puis en chimie.']
    ],
    ecrivains: [
      ['moliere', 'Molière', 'Le Roi de la comédie', 66, 78, 98, 'BRELMU', 'Le plus grand auteur comique du théâtre français.'],
      ['voltaire', 'Voltaire', 'Le Philosophe des Lumières', 62, 80, 99, 'BRELM', 'Philosophe des Lumières, défenseur de la tolérance.'],
      ['lafontaine', 'Jean de La Fontaine', 'Le Fabuliste', 56, 72, 96, 'BREL', 'Auteur des Fables, où les animaux parlent aux hommes.'],
      ['dumas', 'Alexandre Dumas', 'Le Conteur infatigable', 72, 78, 96, 'BRELM', 'Auteur des Trois Mousquetaires et du Comte de Monte-Cristo.'],
      ['sand', 'George Sand', 'La Romancière libre', 64, 80, 94, 'BREL', 'Romancière qui choisit un nom d’homme et une vie libre.'],
      ['zola', 'Émile Zola', 'L’Écrivain engagé', 66, 82, 96, 'BREL', 'Romancier des Rougon-Macquart, défenseur de Dreyfus.'],
      ['jverne', 'Jules Verne', 'Le Voyageur immobile', 60, 76, 98, 'BRELMU', 'Auteur des Voyages extraordinaires.'],
      ['hugo', 'Victor Hugo', 'Le Poète de la République', 58, 72, 97, 'BRE', 'Romancier, poète et dramaturge, voix de l’exil et de la liberté.']
    ],
    kami: [
      ['amaterasu', 'Amaterasu', 'La Déesse du soleil', 86, 90, 96, 'BRELMU', 'Déesse du soleil, ancêtre mythique de la famille impériale.'],
      ['susanoo', 'Susanoo', 'Le Dieu des tempêtes', 96, 80, 70, 'BRELM', 'Dieu impétueux des tempêtes et de la mer.'],
      ['tsukuyomi', 'Tsukuyomi', 'Le Dieu de la lune', 78, 84, 90, 'BREL', 'Dieu de la lune, frère d’Amaterasu.'],
      ['izanagi', 'Izanagi', 'Le Dieu créateur', 84, 86, 92, 'BREL', 'Dieu créateur qui fit naître les îles du Japon.'],
      ['izanami', 'Izanami', 'La Déesse créatrice', 80, 84, 92, 'BREL', 'Déesse créatrice, devenue reine du monde des morts.'],
      ['raijin', 'Raijin', 'Le Dieu du tonnerre', 94, 82, 72, 'BREL', 'Dieu du tonnerre qui frappe ses tambours.'],
      ['fujin', 'Fūjin', 'Le Dieu du vent', 90, 80, 74, 'BRE', 'Dieu du vent qui porte un sac rempli de tempêtes.'],
      ['inari', 'Inari', 'Le Kami du riz', 72, 86, 94, 'BRELM', 'Kami du riz et de la prospérité, servi par des renards.']
    ],
    yokai: [
      ['kitsune', 'Kitsune', 'Le Renard aux neuf queues', 82, 80, 98, 'BRELMU', 'Renard magique qui gagne de nouvelles queues en vieillissant.'],
      ['tanuki', 'Tanuki', 'Le Farceur ventru', 70, 84, 86, 'BREL', 'Chien viverrin farceur, maître des déguisements.'],
      ['kappa', 'Kappa', 'Le Diable des rivières', 80, 78, 72, 'BREL', 'Créature des rivières avec une coupelle d’eau sur la tête.'],
      ['tengu', 'Tengu', 'Le Gardien des montagnes', 88, 82, 90, 'BRELM', 'Esprit ailé des montagnes, maître des arts martiaux.'],
      ['yukionna', 'Yuki-onna', 'La Femme des neiges', 84, 86, 88, 'BREL', 'Fantôme glacé qui apparaît dans les tempêtes de neige.'],
      ['oni', 'Oni', 'Le Démon cornu', 96, 88, 58, 'BRELMU', 'Démon cornu armé d’une massue de fer.'],
      ['kasaobake', 'Kasa-obake', 'Le Parapluie hanté', 58, 66, 74, 'BRE', 'Vieux parapluie devenu vivant, avec un œil et une jambe.'],
      ['rokurokubi', 'Rokurokubi', 'La Femme au long cou', 66, 74, 84, 'BRE', 'Femme dont le cou s’allonge la nuit.']
    ],
    samourais: [
      ['yoshitsune', 'Minamoto no Yoshitsune', 'Le Héros tragique', 90, 82, 88, 'BRELMU', 'Brillant général de la guerre de Genpei.'],
      ['benkei', 'Benkei', 'Le Moine guerrier', 94, 92, 70, 'BREL', 'Moine guerrier géant, fidèle serviteur de Yoshitsune.'],
      ['tomoe', 'Tomoe Gozen', 'La Guerrière', 88, 80, 84, 'BREL', 'Femme samouraï célèbre pour sa bravoure.'],
      ['shingen', 'Takeda Shingen', 'Le Tigre de Kai', 90, 88, 86, 'BREL', 'Seigneur de guerre célèbre pour sa cavalerie.'],
      ['kenshin', 'Uesugi Kenshin', 'Le Dragon d’Echigo', 92, 86, 88, 'BREL', 'Seigneur guerrier, grand rival de Takeda Shingen.'],
      ['nobunaga', 'Oda Nobunaga', 'Le Grand Unificateur', 92, 84, 92, 'BRELMU', 'Premier des trois unificateurs du Japon.'],
      ['hideyoshi', 'Toyotomi Hideyoshi', 'Le Paysan devenu régent', 86, 84, 94, 'BRELM', 'Fils de paysan qui acheva l’unification du Japon.'],
      ['ieyasu', 'Tokugawa Ieyasu', 'Le Fondateur d’Edo', 84, 92, 94, 'BRELMU', 'Fondateur du shogunat Tokugawa, qui régna plus de 250 ans.'],
      ['musashi', 'Miyamoto Musashi', 'Le Maître des deux sabres', 98, 86, 90, 'BRELMU', 'Bretteur invaincu et auteur du Traité des cinq roues.']
    ],
    epoques: [
      ['jomon', 'L’Époque Jōmon', 'Les Premiers Potiers', 60, 84, 80, 'BREL', 'Préhistoire japonaise, célèbre pour ses poteries.'],
      ['nara', 'L’Époque de Nara', 'La Première Capitale', 66, 82, 88, 'BRE', 'Première capitale permanente, au VIIIe siècle.'],
      ['heian', 'L’Époque de Heian', 'L’Âge d’or de la cour', 62, 80, 96, 'BRELM', 'Âge d’or de la cour impériale de Kyoto.'],
      ['kamakura', 'L’Époque de Kamakura', 'Le Temps des shōguns', 88, 84, 80, 'BREL', 'Naissance du pouvoir des samouraïs et des shōguns.'],
      ['muromachi', 'L’Époque de Muromachi', 'Le Temps du zen', 70, 80, 92, 'BRE', 'Époque des arts zen, du thé et du théâtre nō.'],
      ['sengoku', 'L’Époque Sengoku', 'Les Provinces en guerre', 96, 80, 82, 'BRELM', 'Siècle de guerres entre seigneurs rivaux.'],
      ['edo', 'L’Époque d’Edo', 'La Grande Paix', 72, 94, 92, 'BRELMU', 'Deux siècles et demi de paix sous les shōguns Tokugawa.'],
      ['meiji', 'L’Ère Meiji', 'Le Japon moderne', 82, 86, 90, 'BRELM', 'Le Japon s’ouvre au monde et se modernise à grande vitesse.']
    ],
    eaux: [
      ['nessie', 'Nessie', 'Le Monstre du Loch Ness', 78, 92, 84, 'BRELMU', 'La plus célèbre créature du monde, cachée dans un lac écossais.'],
      ['ogopogo', 'Ogopogo', 'Le Serpent du lac Okanagan', 80, 84, 82, 'BREL', 'Long serpent qui hanterait un lac du Canada.'],
      ['champ', 'Champ', 'Le Monstre du lac Champlain', 76, 86, 78, 'BRE', 'Le « Nessie américain », entre les États-Unis et le Québec.'],
      ['bunyip', 'Bunyip', 'L’Esprit des billabongs', 82, 80, 86, 'BREL', 'Créature des marais d’Australie, qui hurle la nuit.'],
      ['mokele', 'Mokèlé-mbembé', 'Celui qui arrête les rivières', 90, 88, 70, 'BRELM', 'Géant des marais du Congo, décrit comme un dinosaure.'],
      ['serpentmer', 'Le Serpent de mer', 'Le Géant des océans', 88, 82, 74, 'BRELM', 'Immense serpent aperçu par des marins du monde entier.'],
      ['caddy', 'Caddy', 'Le Serpent de la baie', 80, 82, 76, 'BRE', 'Serpent de mer du Pacifique, au large du Canada.']
    ],
    hommessauvages: [
      ['yeti', 'Le Yéti', 'L’Abominable Homme des neiges', 90, 92, 80, 'BRELMU', 'Créature velue des sommets de l’Himalaya.'],
      ['bigfoot', 'Bigfoot', 'Le Géant des forêts', 92, 88, 72, 'BRELM', 'Grand primate des forêts d’Amérique du Nord.'],
      ['yowie', 'Le Yowie', 'L’Homme des Montagnes Bleues', 84, 84, 76, 'BRE', 'Le cousin australien du Bigfoot.'],
      ['almasty', 'L’Almasty', 'L’Homme sauvage du Caucase', 82, 86, 84, 'BREL', 'Homme sauvage des montagnes d’Asie centrale.'],
      ['orangpendek', 'L’Orang pendek', 'Le Petit Homme de Sumatra', 72, 78, 88, 'BRE', 'Petit primate qui marcherait debout dans la jungle de Sumatra.'],
      ['yeren', 'Le Yeren', 'L’Homme sauvage du Hubei', 84, 80, 80, 'BRE', 'Primate roux des forêts de Chine centrale.'],
      ['mapinguari', 'Le Mapinguari', 'Le Géant d’Amazonie', 90, 90, 66, 'BREL', 'Monstre de l’Amazonie à l’odeur insupportable.']
    ],
    betes: [
      ['chupacabra', 'Le Chupacabra', 'Le Suceur de chèvres', 86, 72, 70, 'BRELM', 'Bête qui viderait le sang du bétail.'],
      ['mothman', 'Le Mothman', 'L’Homme-papillon', 80, 74, 90, 'BREL', 'Silhouette ailée aux yeux rouges de Virginie-Occidentale.'],
      ['jerseydevil', 'Le Diable du Jersey', 'Le Treizième Enfant', 84, 76, 78, 'BREL', 'Démon ailé des forêts de pins du New Jersey.'],
      ['kongamato', 'Le Kongamato', 'Le Briseur de bateaux', 82, 70, 76, 'BRE', 'Reptile volant des marais de Zambie.'],
      ['dahu', 'Le Dahu', 'La Chèvre des montagnes', 52, 64, 92, 'BRE', 'Animal des Alpes aux pattes plus courtes d’un côté.'],
      ['jackalope', 'Le Jackalope', 'Le Lièvre cornu', 58, 66, 84, 'BRE', 'Lièvre à bois de cerf, star du Wyoming.'],
      ['okapi', 'L’Okapi', 'La Licorne de la forêt', 74, 84, 86, 'BRELM', 'Animal longtemps tenu pour une légende… et bien réel.']
    ],
    citesperdues: [
      ['atlantide', 'L’Atlantide', 'L’Île engloutie', 84, 90, 96, 'BRELMU', 'Puissante île engloutie en un jour et une nuit.'],
      ['eldorado', 'L’Eldorado', 'La Cité de l’or', 80, 82, 88, 'BRELM', 'Royaume d’or qui fit rêver les conquistadors.'],
      ['ys', 'La Ville d’Ys', 'La Cité engloutie de Bretagne', 76, 84, 90, 'BREL', 'Ville bretonne engloutie par la mer.'],
      ['shambhala', 'Shambhala', 'Le Royaume caché', 70, 88, 98, 'BREL', 'Royaume de paix caché derrière les montagnes.'],
      ['citez', 'La Cité Z', 'La Ville du colonel Fawcett', 78, 80, 86, 'BRE', 'Cité perdue d’Amazonie qui fit disparaître un explorateur.'],
      ['troie', 'Troie', 'La Cité d’Homère', 88, 94, 82, 'BRELM', 'Ville légendaire de l’Iliade, retrouvée en Turquie.'],
      ['hyperboree', 'L’Hyperborée', 'Le Pays au-delà du vent du nord', 74, 82, 92, 'BRE', 'Terre bienheureuse au-delà du vent du nord.']
    ],
    enigmes: [
      ['stonehenge', 'Stonehenge', 'Le Cercle de pierres', 80, 96, 90, 'BRELMU', 'Cercle de pierres géantes aligné sur le soleil.'],
      ['paques', 'Les Moaï', 'Les Géants de l’île de Pâques', 78, 98, 84, 'BRELM', 'Près de mille statues géantes sur une île perdue du Pacifique.'],
      ['nazca', 'Les Lignes de Nazca', 'Les Dessins du désert', 70, 88, 94, 'BREL', 'Dessins géants tracés dans le désert du Pérou.'],
      ['bermudes', 'Le Triangle des Bermudes', 'Le Triangle du diable', 86, 80, 82, 'BREL', 'Zone de l’Atlantique réputée engloutir avions et navires.'],
      ['voynich', 'Le Manuscrit de Voynich', 'Le Livre indéchiffrable', 60, 90, 98, 'BREL', 'Livre illustré écrit dans une langue inconnue.'],
      ['anticythere', 'La Machine d’Anticythère', 'Le Premier Ordinateur', 66, 84, 99, 'BRELM', 'Mécanisme grec à engrenages vieux de plus de 2 000 ans.'],
      ['carnac', 'Les Alignements de Carnac', 'L’Armée de pierre', 74, 96, 86, 'BRE', 'Des milliers de menhirs alignés en Bretagne.']
    ],
    tresors: [
      ['graal', 'Le Saint Graal', 'La Coupe sacrée', 70, 92, 99, 'BRELMU', 'Coupe mystérieuse cherchée par les chevaliers de la Table ronde.'],
      ['templiers', 'Le Trésor des Templiers', 'L’Or des moines-soldats', 82, 88, 86, 'BRELM', 'Fortune disparue de l’ordre des Templiers.'],
      ['arche', 'L’Arche d’alliance', 'Le Coffre sacré', 76, 98, 96, 'BREL', 'Coffre sacré disparu du Temple de Jérusalem.'],
      ['ambre', 'La Chambre d’ambre', 'La Huitième Merveille', 64, 86, 92, 'BREL', 'Salle entière d’ambre, volée pendant la guerre.'],
      ['lima', 'Le Trésor de Lima', 'L’Or de l’île Cocos', 80, 82, 84, 'BRE', 'Trésor d’église volé en mer et caché sur une île.'],
      ['renneslechateau', 'Rennes-le-Château', 'Le Trésor de l’abbé', 70, 80, 88, 'BRE', 'Mystérieuse fortune d’un curé de l’Aude.'],
      ['montezuma', 'Le Trésor de Moctezuma', 'L’Or de la Nuit triste', 84, 80, 80, 'BREL', 'Or aztèque perdu lors de la fuite des conquistadors.']
    ],
    dinosaures: [
      ['trex', 'Tyrannosaurus rex', 'Le Roi des lézards tyrans', 99, 82, 66, 'BRELMU', 'Le plus célèbre des prédateurs, à la morsure record.'],
      ['triceratops', 'Tricératops', 'Le Visage à trois cornes', 88, 94, 64, 'BRELM', 'Herbivore massif aux trois cornes et à la grande collerette.'],
      ['velociraptor', 'Vélociraptor', 'Le Chasseur à plumes', 84, 64, 86, 'BRELM', 'Petit prédateur à plumes, armé d’une griffe en faucille.'],
      ['brachiosaure', 'Brachiosaure', 'Le Lézard-bras', 72, 98, 70, 'BREL', 'Géant au long cou dressé, haut comme un immeuble.'],
      ['stegosaure', 'Stégosaure', 'Le Lézard à toit', 80, 92, 58, 'BREL', 'Herbivore aux plaques dorsales et à la queue hérissée de pointes.'],
      ['spinosaure', 'Spinosaure', 'Le Géant à voile', 94, 78, 74, 'BRELM', 'Le plus long prédateur connu, à demi aquatique.'],
      ['ankylosaure', 'Ankylosaure', 'Le Char d’assaut', 74, 99, 60, 'BRE', 'Herbivore cuirassé, armé d’une massue au bout de la queue.']
    ],
    mersciel: [
      ['mosasaure', 'Mosasaure', 'Le Lézard de la Meuse', 96, 82, 64, 'BRELM', 'Reptile marin géant, découvert près de Maastricht.'],
      ['plesiosaure', 'Plésiosaure', 'Le Presque-Lézard', 82, 84, 76, 'BREL', 'Reptile marin au long cou et aux quatre nageoires.'],
      ['ichtyosaure', 'Ichtyosaure', 'Le Poisson-lézard', 78, 76, 82, 'BREL', 'Reptile marin à l’allure de dauphin.'],
      ['megalodon', 'Mégalodon', 'Le Requin géant', 98, 84, 66, 'BRELMU', 'Le plus grand requin ayant jamais existé.'],
      ['dunkleosteus', 'Dunkleosteus', 'Le Poisson cuirassé', 90, 92, 54, 'BRE', 'Poisson préhistorique aux mâchoires tranchantes comme des cisailles.'],
      ['pteranodon', 'Ptéranodon', 'L’Aile sans dents', 76, 66, 84, 'BREL', 'Reptile volant à crête, de six mètres d’envergure.'],
      ['quetzalcoatlus', 'Quetzalcoatlus', 'Le Géant des airs', 84, 70, 82, 'BRELM', 'Le plus grand animal volant connu, haut comme une girafe.']
    ],
    megafaune: [
      ['mammouth', 'Le Mammouth laineux', 'Le Géant des glaces', 90, 94, 72, 'BRELMU', 'Éléphant à fourrure des steppes glacées.'],
      ['smilodon', 'Le Smilodon', 'Le Tigre à dents de sabre', 94, 78, 72, 'BRELM', 'Félin aux canines géantes, en forme de sabre.'],
      ['megatherium', 'Le Mégathérium', 'Le Paresseux géant', 82, 96, 62, 'BREL', 'Paresseux de six mètres, gros comme un éléphant.'],
      ['rhinolaineux', 'Le Rhinocéros laineux', 'Le Bélier des steppes', 86, 92, 60, 'BREL', 'Rhinocéros à fourrure peint dans les grottes ornées.'],
      ['glyptodon', 'Le Glyptodon', 'Le Tatou géant', 70, 99, 58, 'BRE', 'Tatou géant à carapace grande comme une voiture.'],
      ['ourscavernes', 'L’Ours des cavernes', 'Le Seigneur des grottes', 88, 90, 64, 'BRE', 'Ours géant qui hibernait dans les grottes.'],
      ['megaloceros', 'Le Mégacéros', 'Le Cerf géant', 76, 82, 78, 'BRE', 'Cerf aux bois immenses, de plus de trois mètres d’envergure.']
    ],
    navires: [
      ['santamaria', 'La Santa María', 'Le Navire de Colomb', 74, 80, 88, 'BRELM', 'Navire amiral de Christophe Colomb en 1492.'],
      ['victoria', 'La Victoria', 'Le Premier Tour du monde', 80, 84, 92, 'BRELMU', 'Le seul navire de Magellan à boucler le premier tour du monde.'],
      ['mayflower', 'Le Mayflower', 'Le Navire des Pères pèlerins', 66, 84, 86, 'BREL', 'Navire des colons anglais arrivés en Amérique en 1620.'],
      ['endeavour', 'L’Endeavour', 'Le Navire de James Cook', 76, 86, 94, 'BREL', 'Navire du capitaine Cook, explorateur du Pacifique.'],
      ['vasa', 'Le Vasa', 'Le Vaisseau du roi de Suède', 88, 70, 72, 'BREL', 'Navire de guerre qui coula à peine sorti du port.'],
      ['victory', 'Le HMS Victory', 'Le Vaisseau de Nelson', 94, 90, 80, 'BRELM', 'Navire amiral de Nelson à Trafalgar.'],
      ['titanic', 'Le Titanic', 'Le Paquebot insubmersible', 72, 88, 82, 'BRELMU', 'Paquebot géant qui sombra lors de son premier voyage.']
    ],
    maudits: [
      ['marieceleste', 'La Mary Celeste', 'Le Navire sans équipage', 70, 82, 90, 'BRELM', 'Navire retrouvé intact… sans personne à bord.'],
      ['baychimo', 'Le Baychimo', 'Le Cargo fantôme de l’Arctique', 68, 90, 84, 'BRE', 'Cargo abandonné dans les glaces, aperçu pendant 38 ans.'],
      ['deering', 'Le Carroll A. Deering', 'La Goélette du cap Hatteras', 70, 80, 82, 'BRE', 'Goélette échouée dont l’équipage s’était évaporé.'],
      ['caleuche', 'Le Caleuche', 'Le Vaisseau des noyés', 80, 78, 92, 'BREL', 'Navire fantôme lumineux des légendes du Chili.'],
      ['meduse', 'La Méduse', 'Le Radeau du naufrage', 66, 74, 86, 'BREL', 'Frégate française dont le naufrage inspira un chef-d’œuvre.'],
      ['batavia', 'Le Batavia', 'Le Naufrage sanglant', 84, 72, 70, 'BRE', 'Navire hollandais dont le naufrage tourna au cauchemar.'],
      ['bounty', 'Le Bounty', 'La Mutinerie', 82, 76, 84, 'BRELM', 'La plus célèbre mutinerie de l’histoire.']
    ],
    alchimistes: [
      ['flamel', 'Nicolas Flamel', 'L’Alchimiste de Paris', 64, 82, 96, 'BRELMU', 'Écrivain public parisien devenu, après sa mort, le plus célèbre des alchimistes.'],
      ['nostradamus', 'Nostradamus', 'Le Prophète', 60, 78, 98, 'BRELM', 'Médecin provençal, auteur des plus célèbres prophéties.'],
      ['dee', 'John Dee', 'Le Mage de la reine', 62, 84, 96, 'BREL', 'Savant et astrologue d’Élisabeth Ire.'],
      ['paracelse', 'Paracelse', 'Le Médecin rebelle', 66, 80, 94, 'BREL', 'Médecin suisse, pionnier de la toxicologie.'],
      ['cagliostro', 'Cagliostro', 'L’Aventurier', 72, 70, 90, 'BREL', 'Aventurier et guérisseur qui fascina l’Europe du XVIIIe siècle.'],
      ['saintgermain', 'Le Comte de Saint-Germain', 'L’Homme qui ne mourait pas', 68, 84, 94, 'BREL', 'Mystérieux personnage qui se disait vieux de plusieurs siècles.'],
      ['agrippa', 'Agrippa', 'Le Philosophe occulte', 64, 80, 92, 'BRE', 'Savant de la Renaissance, auteur d’un traité de magie.']
    ],
    illusionnistes: [
      ['roberthoudin', 'Robert-Houdin', 'Le Père de la magie moderne', 66, 82, 96, 'BRELMU', 'Horloger de Blois devenu le plus grand magicien de son temps.'],
      ['houdini', 'Houdini', 'Le Roi de l’évasion', 82, 92, 84, 'BRELMU', 'Le plus célèbre artiste de l’évasion.'],
      ['robertson', 'Robertson', 'Le Maître des fantômes', 70, 76, 92, 'BREL', 'Inventeur des spectacles de fantômes, la fantasmagorie.'],
      ['kellar', 'Harry Kellar', 'Le Doyen des magiciens', 72, 80, 90, 'BRE', 'Grand magicien américain, célèbre pour sa lévitation.'],
      ['adelaide', 'Adelaide Herrmann', 'La Reine de la magie', 74, 84, 92, 'BREL', 'Magicienne qui fit carrière pendant des décennies.'],
      ['chunglingsoo', 'Chung Ling Soo', 'Le Magicien muet', 78, 70, 86, 'BRE', 'Magicien américain mort sur scène en 1918.'],
      ['melies', 'Georges Méliès', 'Le Magicien du cinéma', 70, 78, 98, 'BRELMU', 'Illusionniste devenu l’inventeur des effets spéciaux au cinéma.']
    ],
    celtes: [
      ['lug', 'Lug', 'Le Dieu aux mille talents', 88, 84, 94, 'BRELMU', 'Dieu de tous les arts, maître de la lance et de la fronde.'],
      ['dagda', 'Le Dagda', 'Le Dieu bon', 86, 92, 86, 'BRELM', 'Dieu-père à la massue magique et au chaudron inépuisable.'],
      ['morrigan', 'La Morrigan', 'La Reine fantôme', 90, 78, 92, 'BRELM', 'Déesse de la guerre et du destin, qui prend la forme d’une corneille.'],
      ['brigid', 'Brigid', 'La Flamme d’Irlande', 70, 86, 96, 'BREL', 'Déesse de la poésie, de la forge et de la guérison.'],
      ['cernunnos', 'Cernunnos', 'Le Dieu cornu', 76, 90, 92, 'BREL', 'Dieu aux bois de cerf, seigneur des animaux.'],
      ['cuchulainn', 'Cúchulainn', 'Le Chien de Culann', 96, 84, 76, 'BRELMU', 'Le plus grand héros d’Irlande.'],
      ['fionn', 'Fionn mac Cumhaill', 'Le Chef des Fianna', 88, 86, 90, 'BRELM', 'Héros irlandais devenu sage grâce au saumon de la connaissance.']
    ],
    azteques: [
      ['quetzalcoatl', 'Quetzalcóatl', 'Le Serpent à plumes', 84, 86, 98, 'BRELMU', 'Dieu du vent et du savoir, en forme de serpent à plumes.'],
      ['huitzilopochtli', 'Huitzilopochtli', 'Le Colibri de gauche', 96, 84, 78, 'BRELM', 'Dieu du soleil et de la guerre, protecteur des Mexicas.'],
      ['tezcatlipoca', 'Tezcatlipoca', 'Le Miroir fumant', 92, 80, 92, 'BRELM', 'Dieu de la nuit et du destin, au miroir d’obsidienne.'],
      ['tlaloc', 'Tlaloc', 'Le Seigneur de la pluie', 82, 88, 84, 'BREL', 'Dieu de la pluie aux grands yeux ronds.'],
      ['coatlicue', 'Coatlicue', 'La Jupe de serpents', 80, 94, 86, 'BREL', 'Déesse-mère à la jupe de serpents entrelacés.'],
      ['xochiquetzal', 'Xochiquetzal', 'La Fleur précieuse', 66, 82, 94, 'BRE', 'Déesse des fleurs, de la beauté et des arts.'],
      ['mictlantecuhtli', 'Mictlantecuhtli', 'Le Seigneur des morts', 88, 92, 82, 'BRELM', 'Roi du Mictlan, le monde des morts.']
    ],
    chine: [
      ['sunwukong', 'Sun Wukong', 'Le Roi Singe', 94, 80, 92, 'BRELMU', 'Singe né d’un rocher, maître de 72 métamorphoses.'],
      ['nuwa', 'Nüwa', 'La Mère des humains', 74, 92, 96, 'BRELM', 'Déesse qui façonna les humains et répara le ciel.'],
      ['pangu', 'Pangu', 'Le Géant des origines', 90, 96, 80, 'BREL', 'Géant qui sépara le ciel de la terre.'],
      ['change', 'Chang’e', 'La Déesse de la Lune', 66, 84, 94, 'BRELM', 'Déesse qui vit sur la Lune avec un lapin de jade.'],
      ['houyi', 'Houyi', 'L’Archer divin', 92, 78, 80, 'BREL', 'Archer qui abattit neuf des dix soleils.'],
      ['nezha', 'Nezha', 'L’Enfant de lotus', 86, 76, 86, 'BREL', 'Enfant-dieu guerrier, monté sur des roues de feu.'],
      ['longwang', 'Longwang', 'Le Roi dragon de la mer de l’Est', 90, 92, 82, 'BRELM', 'Roi dragon qui commande la pluie et les mers.']
    ],
    inde: [
      ['ganesh', 'Ganesh', 'Celui qui lève les obstacles', 78, 92, 96, 'BRELMU', 'Dieu à tête d’éléphant, qui écarte les obstacles.'],
      ['hanuman', 'Hanuman', 'Le Serviteur de Rama', 92, 88, 88, 'BRELM', 'Singe à la force immense, fidèle compagnon de Rama.'],
      ['rama', 'Rama', 'Le Héros du Ramayana', 90, 88, 92, 'BRELM', 'Prince exilé qui délivra son épouse Sita.'],
      ['ravana', 'Ravana', 'Le Roi aux dix têtes', 94, 86, 84, 'BREL', 'Roi démon de Lanka, savant et redoutable.'],
      ['durga', 'Durga', 'L’Invincible', 96, 90, 90, 'BRELMU', 'Déesse guerrière à dix bras, montée sur un lion.'],
      ['shiva', 'Shiva', 'Le Danseur cosmique', 92, 90, 98, 'BRELM', 'Dieu de la destruction et du renouveau.'],
      ['garuda', 'Garuda', 'Le Roi des oiseaux', 88, 82, 86, 'BREL', 'Aigle géant, monture du dieu Vishnou.']
    ],
    slaves: [
      ['babayaga', 'Baba Yaga', 'La Sorcière de la forêt', 82, 90, 96, 'BRELMU', 'Sorcière qui vit dans une isba sur pattes de poule.'],
      ['koschei', 'Koschei l’Immortel', 'Le Sorcier sans mort', 90, 96, 84, 'BRELM', 'Sorcier qui a caché sa mort pour ne jamais mourir.'],
      ['oiseaudefeu', 'L’Oiseau de feu', 'Le Joyau des contes', 76, 78, 96, 'BRELM', 'Oiseau aux plumes lumineuses, rare et convoité.'],
      ['perun', 'Perun', 'Le Dieu du tonnerre', 94, 86, 80, 'BREL', 'Dieu de l’orage et du chêne, chef des dieux slaves.'],
      ['rusalka', 'La Roussalka', 'L’Esprit des eaux', 72, 76, 92, 'BREL', 'Esprit des rivières, à la longue chevelure.'],
      ['domovoi', 'Le Domovoï', 'L’Esprit de la maison', 58, 88, 86, 'BRE', 'Petit esprit barbu qui protège le foyer.'],
      ['zmey', 'Zmeï Gorynytch', 'Le Dragon à trois têtes', 96, 88, 70, 'BRELM', 'Dragon à trois têtes qui crache le feu.']
    ],
    afrique: [
      ['anansi', 'Anansi', 'L’Araignée rusée', 66, 78, 99, 'BRELMU', 'Araignée maligne qui possède toutes les histoires du monde.'],
      ['soundiata', 'Soundiata Keïta', 'Le Lion du Mali', 92, 88, 90, 'BRELMU', 'Fondateur de l’empire du Mali.'],
      ['ninkinanka', 'Ninki Nanka', 'Le Dragon des marais', 94, 86, 72, 'BREL', 'Dragon des marais de Gambie, que nul ne doit voir.'],
      ['nyaminyami', 'Nyami Nyami', 'Le Dieu du Zambèze', 88, 90, 86, 'BREL', 'Dieu-serpent du fleuve Zambèze.'],
      ['mamiwata', 'Mami Wata', 'La Mère des eaux', 74, 82, 96, 'BREL', 'Esprit des eaux, à la fois sirène et charmeuse de serpents.'],
      ['kintu', 'Kintu', 'Le Premier Homme', 70, 88, 90, 'BRE', 'Premier homme du Buganda, en Ouganda.'],
      ['tokoloshe', 'Le Tokoloshe', 'Le Lutin malicieux', 72, 70, 82, 'BRE', 'Petit esprit farceur du folklore d’Afrique australe.']
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
      ['louisxiv', 'Louis XIV', 'Le Roi-Soleil', 78, 84, 90, 'BREL', 'Soixante-douze ans de règne et la splendeur de Versailles.'],
      ['charlemagne', 'Charlemagne', 'Empereur d’Occident', 88, 86, 84, 'BREL', 'Couronné à Rome en l’an 800, il unifie une grande partie de l’Europe.'],
      ['vercingetorix', 'Vercingétorix', 'Chef des Arvernes', 89, 80, 78, 'BRE', 'Il fédère les peuples gaulois face aux légions de César.'],
      ['clovis', 'Clovis', 'Le Premier Roi des Francs', 84, 82, 82, 'BREL', 'Roi des Francs, souvent présenté comme le premier roi de France.'],
      ['saintlouis', 'Saint Louis', 'Le Roi justicier', 78, 84, 92, 'BREL', 'Louis IX, roi pieux et justicier, canonisé après sa mort.'],
      ['francoisier', 'François Ier', 'Le Roi de la Renaissance', 84, 80, 90, 'BRELM', 'Roi bâtisseur et protecteur des arts de la Renaissance.'],
      ['henriiv', 'Henri IV', 'Le Bon Roi Henri', 86, 82, 88, 'BRELM', 'Roi qui mit fin aux guerres de Religion.']
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
    'histoire-clovis': 'Chef des Francs saliens dès l’âge de quinze ans, il conquit presque toute la Gaule à la fin du Ve siècle. Son baptême à Reims, vers l’an 500, fit de lui l’allié de l’Église.',
    'histoire-saintlouis': 'Louis IX régna de 1226 à 1270. La tradition le montre rendant la justice sous un chêne, à Vincennes, ouvert à tous ses sujets.',
    'histoire-francoisier': 'Vainqueur à Marignan en 1515, il fit venir en France Léonard de Vinci, qui apporta avec lui La Joconde. Il fit construire le château de Chambord.',
    'histoire-henriiv': 'Protestant devenu roi en 1589, il se convertit au catholicisme pour être accepté par Paris, puis signa en 1598 l’édit de Nantes, qui accordait la liberté de culte aux protestants.',
    'presidents-louisnapoleon': 'Neveu de [[histoire:napoleon|Napoléon Ier]], il fut élu en décembre 1848 au premier suffrage universel masculin, devenant le premier président de la République française.',
    'presidents-thiers': 'Historien et homme politique, il négocia la paix avec la Prusse en 1871 et devint le premier président de la IIIe République.',
    'presidents-carnot': 'Ingénieur polytechnicien, petit-fils de Lazare Carnot, l’« organisateur de la victoire » de la Révolution, il fut élu en 1887. Il présida le centenaire de la Révolution et l’Exposition universelle de 1889, celle de la tour de [[savants:eiffel|Gustave Eiffel]].',
    'presidents-poincare': 'Avocat lorrain, il fut président de 1913 à 1920. Pendant la Grande Guerre, il appela à l’« Union sacrée » de tous les partis et nomma en 1917 Georges Clemenceau à la tête du gouvernement.',
    'presidents-pompidou': 'Professeur de lettres puis banquier, Premier ministre du général [[degaulle|de Gaulle]], il fut élu président en 1969. Son mandat fut marqué par une forte croissance et de grands projets industriels.',
    'presidents-giscard': 'Élu à 48 ans, il fut l’un des plus jeunes présidents de la République. Sous son mandat, la majorité passa de 21 à 18 ans, et la loi Veil légalisa l’interruption volontaire de grossesse en 1975.',
    'presidents-mitterrand': 'Premier président de gauche de la Ve République, il fut élu en 1981 et réélu en 1988. En 1981, la peine de mort fut abolie, à l’initiative du garde des Sceaux Robert Badinter.',
    'presidents-chirac': 'Ancien maire de Paris et Premier ministre, il fut élu président en 1995. La même année, il reconnut la responsabilité de l’État français dans la rafle du Vél’ d’Hiv de 1942.',
    'herosfr-duguesclin': 'Jeune noble breton réputé laid et bagarreur, il devint l’un des plus grands chefs de guerre du XIVe siècle et connétable de France sous Charles V. Il reprit aux Anglais une grande partie du royaume.',
    'herosfr-bayard': 'Pierre Terrail, seigneur de Bayard, se couvrit de gloire dans les guerres d’Italie. On raconte qu’il défendit presque seul un pont, sur le Garigliano, contre une troupe espagnole.',
    'herosfr-lafayette': 'À dix-neuf ans, ce jeune marquis partit en secret combattre aux côtés des insurgés américains contre les Anglais. Ami de George Washington, il participa à la victoire décisive de Yorktown, en 1781.',
    'herosfr-gouges': 'En 1791, elle publia la Déclaration des droits de la femme et de la citoyenne, pour rappeler que les droits proclamés en 1789 devaient aussi valoir pour les femmes.',
    'herosfr-moulin': 'Préfet révoqué par le régime de Vichy, il rejoignit le général [[presidents:degaulle|de Gaulle]] à Londres, puis fut parachuté en France pour unifier les mouvements de résistance. En mai 1943, il créa le Conseil national de la Résistance.',
    'herosfr-baker': 'Née aux États-Unis, elle devint la vedette des cabarets parisiens dans les années 1920. Pendant la Seconde Guerre mondiale, elle s’engagea dans la France libre et transporta des renseignements cachés dans ses partitions.',
    'herosfr-aubrac': 'Professeure d’histoire, elle cofonda le mouvement de résistance Libération-Sud. En octobre 1943, elle organisa l’attaque d’un camion allemand pour libérer son mari, Raymond Aubrac, arrêté avec [[moulin|Jean Moulin]].',
    'savants-pasteur': 'Il montra que les maladies contagieuses et les fermentations sont causées par des micro-organismes, et mit au point la pasteurisation, qui conserve le lait et le vin en les chauffant.',
    'savants-lavoisier': 'Par des pesées d’une grande précision, il montra que la matière se conserve au cours des réactions chimiques et découvrit le rôle de l’oxygène dans la combustion et la respiration.',
    'savants-pascal': 'À dix-neuf ans, il inventa une machine à calculer, la pascaline, pour aider son père dans ses calculs d’impôts. Il prouva aussi l’existence du vide et étudia la pression de l’air.',
    'savants-champollion': 'Passionné par l’Égypte depuis l’enfance, il apprit une dizaine de langues anciennes. En 1822, grâce à la pierre de Rosette, il perça le secret des hiéroglyphes et s’écria : « Je tiens l’affaire ! ».',
    'savants-lumiere': 'Auguste et Louis Lumière, industriels lyonnais, mirent au point le cinématographe, un appareil capable de filmer et de projeter. Le 28 décembre 1895, ils organisèrent à Paris la première séance de cinéma payante.',
    'savants-eiffel': 'Ingénieur spécialiste du métal, son entreprise construisit la tour de 300 mètres de l’Exposition universelle de 1889, alors le plus haut monument du monde.',
    'savants-germain': 'Les femmes étant exclues de l’École polytechnique, elle se procura les cours et envoya ses devoirs sous le nom d’un ancien élève, Monsieur Le Blanc. Le grand mathématicien Lagrange découvrit la supercherie et l’encouragea.',
    'ecrivains-moliere': 'Jean-Baptiste Poquelin prit le nom de Molière et parcourut la France avec sa troupe avant de triompher à Paris, protégé par [[histoire:louisxiv|Louis XIV]]. Il écrivit Le Tartuffe, L’Avare et Le Malade imaginaire.',
    'ecrivains-voltaire': 'François-Marie Arouet, dit Voltaire, fut embastillé, exilé et adulé. Dans Candide et ses autres œuvres, il se moqua du fanatisme et de l’injustice.',
    'ecrivains-lafontaine': 'Dans ses Fables, publiées à partir de 1668, il met en scène des animaux pour faire réfléchir les hommes : Le Corbeau et le Renard, La Cigale et la Fourmi, Le Lièvre et la Tortue.',
    'ecrivains-dumas': 'Petit-fils d’une esclave de Saint-Domingue et fils d’un général de la Révolution, il devint l’écrivain le plus populaire de son temps grâce à [[mousquetaires:dartagnan|d’Artagnan]] et au [[mousquetaires:montecristo|comte de Monte-Cristo]].',
    'ecrivains-sand': 'Aurore Dupin prit le nom de George Sand pour publier ses romans, qui eurent un immense succès. Elle porta souvent des vêtements d’homme pour circuler plus librement dans Paris.',
    'ecrivains-zola': 'Dans les vingt romans des Rougon-Macquart, comme Germinal ou L’Assommoir, il peignit la société de son temps, des mines du Nord aux grands magasins parisiens.',
    'ecrivains-jverne': 'Né à Nantes en 1828, il écrivit une soixantaine de Voyages extraordinaires, où l’on croise le [[verne:nemo|capitaine Nemo]] ou [[verne:fogg|Phileas Fogg]].',
    'kami-amaterasu': 'Née de l’œil gauche d’[[izanagi]] quand il se purifia, elle règne sur la Haute Plaine du Ciel. Selon la tradition, la famille impériale du Japon descend d’elle.',
    'kami-susanoo': 'Né du nez d’[[izanagi]], ce dieu violent et capricieux sema le chaos dans le ciel de sa sœur [[amaterasu]], qui finit par le faire chasser.',
    'kami-tsukuyomi': 'Né de l’œil droit d’[[izanagi]], il règne sur la nuit, tandis que sa sœur [[amaterasu]] règne sur le jour.',
    'kami-izanagi': 'Avec son épouse [[izanami]], il se tint sur le pont flottant du ciel et plongea une lance ornée de joyaux dans l’océan. Les gouttes qui en tombèrent formèrent la première île.',
    'kami-izanami': 'Épouse d’[[izanagi]], elle donna naissance aux îles du Japon et à de nombreux dieux. Elle mourut brûlée en mettant au monde le dieu du feu.',
    'kami-raijin': 'Entouré d’un cercle de tambours qu’il frappe pour faire gronder le tonnerre, ce dieu à l’allure de démon est souvent représenté aux côtés de son frère [[fujin]].',
    'kami-fujin': 'Ce dieu à la peau verte porte sur ses épaules un grand sac d’où il libère les vents. Il forme avec [[raijin]] un duo redouté, qui garde l’entrée de nombreux temples.',
    'kami-inari': 'Kami du riz, des récoltes et de la prospérité, il est honoré dans des dizaines de milliers de sanctuaires au Japon. Ses messagers sont des renards, les [[yokai:kitsune|kitsune]].',
    'yokai-kitsune': 'Ce renard rusé maîtrise la métamorphose et prend souvent l’apparence d’une belle jeune femme. Plus il vieillit, plus il gagne de queues et de pouvoirs, jusqu’à neuf.',
    'yokai-tanuki': 'Inspiré d’un vrai animal, le chien viverrin, ce yōkai jovial adore les farces et se transforme en objets, en moines ou en humains pour duper les passants.',
    'yokai-kappa': 'Mi-tortue, mi-enfant, ce yōkai vit dans les rivières et les étangs, où il entraîne les imprudents. Il porte sur le crâne une coupelle remplie d’eau, qui lui donne sa force.',
    'yokai-tengu': 'Ces esprits des montagnes ont des ailes et un long nez rouge, ou un bec d’oiseau pour les plus anciens. Fiers et redoutables, ils punissent les moines orgueilleux.',
    'yokai-yukionna': 'Grande, pâle et vêtue de blanc, elle apparaît aux voyageurs perdus dans les tempêtes de neige. Son souffle glacé peut les geler sur place.',
    'yokai-oni': 'Ce démon à la peau rouge ou bleue, aux cornes et aux crocs acérés, brandit une massue de fer hérissée de pointes. Il tourmente les âmes des méchants dans les enfers bouddhiques.',
    'yokai-kasaobake': 'Selon la croyance, les objets qui atteignent cent ans prennent vie et deviennent des tsukumogami. Le plus célèbre est ce vieux parapluie de papier doté d’un œil, d’une longue langue et d’une seule jambe.',
    'yokai-rokurokubi': 'Le jour, elle ressemble à une femme ordinaire. Mais la nuit, pendant son sommeil, son cou s’étire démesurément et sa tête part errer dans la maison.',
    'samourais-yoshitsune': 'Ce jeune général mena le clan Minamoto à la victoire contre les Taira, lors de la bataille navale de Dan-no-ura, en 1185. Il était accompagné de son fidèle compagnon, le moine guerrier [[benkei]].',
    'samourais-benkei': 'Selon la légende, ce moine géant désarmait chaque guerrier qui traversait le pont Gojō, à Kyoto, et avait réuni 999 sabres. Son millième adversaire, le jeune [[yoshitsune]], le vainquit : Benkei devint son serviteur.',
    'samourais-tomoe': 'Archère et cavalière redoutable, elle combattit aux côtés du général Minamoto no Yoshinaka pendant la guerre de Genpei, à la fin du XIIe siècle.',
    'samourais-shingen': 'Seigneur de la province de Kai, il fut l’un des plus redoutables chefs de l’époque [[epoques:sengoku|Sengoku]]. Sa bannière portait une devise tirée de Sun Tzu : rapide comme le vent, calme comme la forêt, ardent comme le feu, immobile comme la montagne.',
    'samourais-kenshin': 'Seigneur de la province d’Echigo, ce chef de guerre bouddhiste se disait protégé du dieu de la guerre Bishamonten. Il est célèbre pour sa rivalité chevaleresque avec [[shingen]].',
    'samourais-nobunaga': 'Seigneur ambitieux et novateur, il commença l’unification du Japon déchiré par les guerres. À la bataille de Nagashino, en 1575, ses arquebusiers tirant par salves écrasèrent la cavalerie du clan Takeda.',
    'samourais-hideyoshi': 'Né dans une famille de paysans, il gravit tous les échelons au service de [[nobunaga]], dont il devint le meilleur général. Après sa mort, il acheva l’unification du Japon en 1590.',
    'samourais-ieyasu': 'Patient allié puis rival des deux autres unificateurs, il remporta la bataille décisive de Sekigahara en 1600 et devint shōgun en 1603. Il installa son gouvernement à Edo, l’actuelle Tokyo.',
    'samourais-musashi': 'Ce rōnin, un samouraï sans maître, affirma avoir remporté plus de soixante duels sans jamais perdre. Il mit au point un style de combat à deux sabres.',
    'epoques-jomon': 'Pendant plus de dix mille ans, jusqu’au Ier millénaire av. J.-C., des chasseurs-cueilleurs peuplèrent l’archipel. Leurs poteries comptent parmi les plus anciennes du monde.',
    'epoques-nara': 'En 710, la cour impériale s’installa à Nara, bâtie sur le modèle de la capitale chinoise. Le bouddhisme y devint une religion d’État.',
    'epoques-heian': 'De 794 à 1185, la cour impériale siégea à Heian-kyō, l’actuelle Kyoto. Les nobles y cultivaient la poésie, la calligraphie et le raffinement.',
    'epoques-kamakura': 'Après la victoire de [[samourais:yoshitsune|Yoshitsune]] sur les Taira, son demi-frère Minamoto no Yoritomo devint en 1192 shōgun et installa un gouvernement militaire à Kamakura.',
    'epoques-muromachi': 'De 1336 à 1573, les shōguns Ashikaga gouvernèrent depuis le quartier de Muromachi, à Kyoto. Leur pouvoir s’affaiblit peu à peu face aux seigneurs locaux.',
    'epoques-sengoku': 'De la fin du XVe siècle à la fin du XVIe, le Japon se déchira en guerres incessantes entre seigneurs, les daimyō, comme [[samourais:shingen|Takeda Shingen]] et [[samourais:kenshin|Uesugi Kenshin]].',
    'epoques-edo': 'De 1603 à 1868, les shōguns Tokugawa, héritiers d’[[samourais:ieyasu|Ieyasu]], gouvernèrent depuis Edo, l’actuelle Tokyo, devenue l’une des plus grandes villes du monde. Le pays vécut en paix, presque fermé aux étrangers.',
    'epoques-meiji': 'En 1868, le jeune empereur Meiji retrouva le pouvoir, et Edo, rebaptisée Tokyo, devint la capitale. En quelques décennies, le Japon se dota de chemins de fer, d’usines, d’une armée moderne et d’une constitution.',
    'eaux-nessie': 'Le Loch Ness, long de 37 kilomètres et profond de plus de 220 mètres, contient plus d’eau douce que tous les lacs d’Angleterre réunis. Une vie de saint Colomba raconte déjà, au VIIe siècle, qu’il aurait chassé une « bête d’eau » de la rivière Ness.',
    'eaux-ogopogo': 'Dans le lac Okanagan, en Colombie-Britannique, nagerait une créature longue et ondulante. Les Syilx, peuple autochtone de la région, parlaient d’un esprit du lac, N’ha-a-itk, à qui l’on offrait de petits animaux pour traverser sans danger.',
    'eaux-champ': 'Le lac Champlain s’étend entre l’État de New York, le Vermont et le Québec. On y signale depuis le XIXe siècle une créature au long cou.',
    'eaux-bunyip': 'Dans les récits de nombreux peuples aborigènes d’Australie, le bunyip vit au fond des billabongs, les bras morts des rivières, et des marécages. Son cri, la nuit, éloigne les enfants de l’eau.',
    'eaux-mokele': 'Son nom signifierait « celui qui arrête le cours des rivières » en lingala. Les pêcheurs des marais de la Likouala, en république du Congo, décrivent un animal énorme, au long cou et à la longue queue.',
    'eaux-serpentmer': 'Depuis l’Antiquité, des marins racontent avoir croisé un serpent gigantesque. En 1848, l’équipage du navire britannique HMS Daedalus en décrivit un, long d’une trentaine de mètres, dans l’Atlantique sud ; le récit parut dans le Times.',
    'eaux-caddy': 'Le Cadborosaurus, surnommé Caddy, tire son nom de Cadboro Bay, près de Victoria, au Canada. Des centaines de témoins décrivent une tête de chameau ou de cheval sur un long cou.',
    'hommessauvages-yeti': 'Les peuples de l’Himalaya parlent depuis des siècles d’une créature des neiges. En 1921, un journaliste traduit de travers son nom tibétain et invente « l’abominable homme des neiges ».',
    'hommessauvages-bigfoot': 'Aussi appelé Sasquatch, d’après un mot d’une langue autochtone de Colombie-Britannique, il hanterait les forêts du nord-ouest de l’Amérique. Il mesurerait plus de deux mètres et laisserait d’immenses traces de pas.',
    'hommessauvages-yowie': 'Des récits aborigènes évoquent des hommes sauvages couverts de poils, vivant dans les forêts et les montagnes de l’est de l’Australie.',
    'hommessauvages-almasty': 'Du Caucase à la Mongolie, les bergers parlent d’hommes velus et silencieux, plus petits que le Yéti, qui vivraient à l’écart des villages.',
    'hommessauvages-orangpendek': 'Son nom signifie « petit homme » en indonésien. Les habitants de l’île de Sumatra décrivent un être d’environ un mètre, très fort, qui marche sur deux jambes.',
    'hommessauvages-yeren': 'Dans la forêt de Shennongjia, dans la province du Hubei, des paysans décrivent un grand primate au pelage roux.',
    'hommessauvages-mapinguari': 'Les récits d’Amazonie décrivent un géant au pelage rouge, aux griffes immenses, dont l’odeur ferait fuir tout être vivant. Certains disent qu’il a une bouche sur le ventre.',
    'betes-chupacabra': 'Son nom signifie « suceur de chèvres » en espagnol. Tout commence en 1995 à Porto Rico, où des fermiers découvrent des animaux morts, apparemment vidés de leur sang.',
    'betes-mothman': 'En novembre 1966, à Point Pleasant, en Virginie-Occidentale, plusieurs habitants affirment avoir vu une grande créature ailée aux yeux rouges luisants.',
    'betes-jerseydevil': 'Selon la légende, en 1735, une certaine Mère Leeds, épuisée, aurait maudit son treizième enfant, qui se transforma en créature ailée à tête de cheval et s’envola dans les Pine Barrens, les grandes forêts de pins du New Jersey.',
    'betes-kongamato': 'Son nom signifierait « briseur de bateaux ». Dans les marais de l’ouest de la Zambie, des pêcheurs décrivent une créature volante, sans plumes, aux ailes de peau.',
    'betes-dahu': 'Le dahu vit à flanc de montagne. Ses pattes d’un côté sont plus courtes que celles de l’autre, ce qui lui permet de tenir sur les pentes… mais l’oblige à tourner toujours dans le même sens.',
    'betes-jackalope': 'Mi-lièvre, mi-antilope, il serait si rusé qu’il imiterait les voix des cow-boys autour du feu. Douglas, dans le Wyoming, s’en est proclamée la capitale.',
    'betes-okapi': 'Les Européens entendirent longtemps parler d’un étrange animal de la forêt congolaise, mi-cheval, mi-zèbre, sans jamais le voir. On le surnommait « la licorne africaine ».',
    'citesperdues-atlantide': 'C’est le philosophe grec Platon qui la décrit, vers 360 avant notre ère, dans deux dialogues, le Timée et le Critias : une île immense, au-delà des colonnes d’Héraclès, dont l’armée voulut conquérir le monde.',
    'citesperdues-eldorado': 'À l’origine, El Dorado, « le doré », n’est pas une ville mais un homme. Chez les Muisca, en Colombie, le nouveau chef était couvert de poudre d’or et naviguait sur le lac Guatavita, où l’on jetait des offrandes précieuses.',
    'citesperdues-ys': 'Le roi Gradlon avait bâti pour sa fille Dahut une ville protégée de la mer par une digue et des portes, dont il gardait la clé. Selon la légende, Dahut, poussée par le diable, vola la clé et ouvrit les portes.',
    'citesperdues-shambhala': 'Dans certains textes du bouddhisme tibétain, Shambhala est un royaume pur, caché au-delà des montagnes, où l’enseignement est préservé.',
    'citesperdues-citez': 'Le colonel britannique Percy Fawcett était convaincu qu’une grande civilisation se cachait au cœur de l’Amazonie. Il appelait sa capitale « Z ».',
    'citesperdues-troie': 'Pendant des siècles, on crut que la Troie d’Homère, assiégée dix ans par les Grecs d’[[heros:ulysse|Ulysse]], n’était qu’un mythe.',
    'citesperdues-hyperboree': 'Pour les Grecs, au-delà du royaume de Borée, le vent du nord, vivait un peuple heureux, sous un soleil qui ne se couchait presque jamais.',
    'enigmes-stonehenge': 'Édifié par étapes entre environ 3000 et 2000 avant notre ère dans le sud de l’Angleterre, ce cercle s’aligne sur le lever du soleil au solstice d’été et sur son coucher au solstice d’hiver.',
    'enigmes-paques': 'Sur Rapa Nui, l’île de Pâques, les ancêtres des Rapanui ont sculpté près de 900 statues, les moaï, dans la roche du volcan Rano Raraku.',
    'enigmes-nazca': 'Entre environ 500 avant et 500 après notre ère, le peuple Nazca a tracé dans le désert du sud du Pérou des lignes et des figures immenses : un colibri, un singe, une araignée.',
    'enigmes-bermudes': 'Entre Miami, les Bermudes et Porto Rico, la légende situe une zone où disparaîtraient navires et avions.',
    'enigmes-voynich': 'Ce manuscrit d’environ 240 pages est couvert d’une écriture que personne n’a jamais su lire, et de dessins de plantes qui n’existent pas, d’étoiles et de baigneuses.',
    'enigmes-anticythere': 'En 1901, des pêcheurs d’éponges remontent d’une épave grecque, près de l’île d’Anticythère, des blocs de bronze corrodés. On y découvre des roues dentées.',
    'enigmes-carnac': 'Plus de 3 000 menhirs se dressent en longues files près de Carnac, dans le Morbihan, plantés il y a plus de six mille ans par les premiers paysans de la région.',
    'tresors-graal': 'Le Graal apparaît vers 1180 dans un roman inachevé de Chrétien de Troyes, Perceval ou le Conte du Graal. Le jeune [[arthur:perceval|Perceval]] y voit passer un mystérieux objet lumineux, sans oser poser de question.',
    'tresors-templiers': 'Les Templiers, moines-soldats nés pendant les croisades, devinrent les banquiers de l’Europe. Le vendredi 13 octobre 1307, le roi Philippe le Bel les fit arrêter partout en France.',
    'tresors-arche': 'Selon la Bible, ce coffre de bois couvert d’or contenait les Tables de la Loi. Il était conservé dans le Temple de Jérusalem.',
    'tresors-ambre': 'Ce cabinet tapissé de panneaux d’ambre, d’or et de miroirs fut offert en 1716 par le roi de Prusse au tsar Pierre le Grand. Installé au palais Catherine, près de Saint-Pétersbourg, on le surnommait la huitième merveille du monde.',
    'tresors-lima': 'En 1820, menacées par les indépendantistes, les autorités de Lima confient l’or et les joyaux de la ville au capitaine britannique William Thompson.',
    'tresors-renneslechateau': 'À la fin du XIXe siècle, l’abbé Bérenger Saunière, curé d’un petit village de l’Aude, se met soudain à dépenser des sommes folles : une villa, une tour néogothique, des jardins.',
    'tresors-montezuma': 'En 1520, les conquistadors d’Hernán Cortés sont hébergés dans la capitale aztèque et s’emparent de l’or de l’empereur Moctezuma.',
    'dinosaures-trex': 'Il vécut en Amérique du Nord à la toute fin de l’ère des dinosaures, il y a 68 à 66 millions d’années. Long de 12 mètres, il possédait la morsure la plus puissante de tous les animaux terrestres connus, capable de broyer les os.',
    'dinosaures-triceratops': 'Avec ses trois cornes et sa collerette osseuse, ce géant de neuf mètres partageait les plaines d’Amérique du Nord avec le [[trex]].',
    'dinosaures-velociraptor': 'Loin des monstres de cinéma, le vélociraptor avait la taille d’un grand dindon et pesait une quinzaine de kilos. Il vivait dans les déserts de l’actuelle Mongolie et portait des plumes, comme l’indiquent des points d’attache sur ses os.',
    'dinosaures-brachiosaure': 'Ce sauropode du Jurassique, il y a environ 150 millions d’années, mesurait plus de 20 mètres de long. Ses pattes avant, plus longues que celles de l’arrière, lui donnaient l’allure d’une girafe géante.',
    'dinosaures-stegosaure': 'Il portait sur le dos deux rangées de grandes plaques et, au bout de la queue, quatre pointes redoutables. Son cerveau, lui, n’était guère plus gros qu’une noix.',
    'dinosaures-spinosaure': 'Plus long encore que le [[trex]], ce prédateur d’Afrique du Nord, il y a environ 95 millions d’années, portait une grande voile sur le dos et chassait les poissons géants des fleuves.',
    'dinosaures-ankylosaure': 'Couvert de plaques osseuses jusque sur les paupières, cet herbivore de la fin du Crétacé était un véritable char d’assaut.',
    'mersciel-mosasaure': 'Ce reptile marin, cousin des varans, pouvait dépasser 15 mètres. Il régnait sur les océans à la fin du Crétacé.',
    'mersciel-plesiosaure': 'Avec son petit crâne au bout d’un très long cou et ses quatre grandes nageoires, il « volait » sous l’eau.',
    'mersciel-ichtyosaure': 'Il ressemblait à un dauphin ou à un espadon, mais c’était un reptile qui respirait de l’air et mettait au monde ses petits dans l’eau.',
    'mersciel-megalodon': 'Ce requin géant, disparu il y a environ 3,6 millions d’années, mesurait sans doute entre 15 et 20 mètres. Ses dents pouvaient atteindre 18 centimètres.',
    'mersciel-dunkleosteus': 'Il y a environ 370 millions d’années, bien avant les dinosaures, ce poisson cuirassé chassait dans les mers du Dévonien.',
    'mersciel-pteranodon': 'Ce reptile volant n’était pas un dinosaure mais un ptérosaure. Son envergure dépassait six mètres et sa tête portait une longue crête.',
    'mersciel-quetzalcoatlus': 'Avec plus de dix mètres d’envergure, c’est le plus grand animal volant connu. Debout, il était aussi haut qu’une girafe.',
    'megafaune-mammouth': 'Couvert d’une épaisse fourrure et armé de défenses recourbées, il parcourait les steppes froides de l’Europe à l’Amérique du Nord.',
    'megafaune-smilodon': 'Ses canines supérieures mesuraient près de 28 centimètres. Contrairement à son surnom, il n’était pas un proche parent du tigre.',
    'megafaune-megatherium': 'Ce cousin des paresseux actuels vivait au sol, en Amérique du Sud. Dressé sur ses pattes arrière, il atteignait la hauteur d’une girafe pour brouter les arbres.',
    'megafaune-rhinolaineux': 'Adapté au froid, il portait une épaisse toison et une grande corne aplatie qui lui servait sans doute à dégager la neige.',
    'megafaune-glyptodon': 'Ce cousin des tatous, qui vivait en Amérique du Sud, portait une carapace bombée faite de centaines de plaques osseuses, grande comme une petite voiture.',
    'megafaune-ourscavernes': 'Plus grand que l’ours brun, il hibernait au fond des grottes d’Europe, où l’on retrouve aujourd’hui des milliers de ses ossements.',
    'megafaune-megaloceros': 'On l’appelle parfois « élan d’Irlande », mais il n’était ni un élan, ni seulement irlandais : c’était un cerf géant, proche du daim, qui vivait dans toute l’Eurasie.',
    'navires-santamaria': 'Le 3 août 1492, Christophe Colomb quitte l’Espagne avec trois navires, la Santa María, la Pinta et la Niña, pour rejoindre l’Asie par l’ouest. Le 12 octobre, il atteint une île des Bahamas.',
    'navires-victoria': 'En 1519, Fernand de Magellan quitte l’Espagne avec cinq navires et environ 240 hommes pour atteindre les îles aux épices par l’ouest. Il découvre le détroit qui porte son nom et traverse le Pacifique.',
    'navires-mayflower': 'En 1620, ce navire marchand transporte une centaine de passagers, dont des puritains anglais cherchant la liberté de culte, vers l’Amérique.',
    'navires-endeavour': 'En 1768, le navigateur James Cook part pour Tahiti observer le passage de [[planetes:venus|Vénus]] devant le Soleil, afin de mesurer la distance de la Terre au Soleil.',
    'navires-vasa': 'Le 10 août 1628, le plus puissant navire de guerre suédois quitte le port de Stockholm devant la foule. Trop haut, trop lourd en canons, il chavire après environ 1 300 mètres.',
    'navires-victory': 'Le 21 octobre 1805, au large du cap Trafalgar, l’amiral Nelson mène la flotte britannique contre les flottes française et espagnole de [[histoire:napoleon|Napoléon]] depuis le pont du Victory.',
    'navires-titanic': 'Le plus grand paquebot de son temps, réputé insubmersible, quitte Southampton le 10 avril 1912 pour New York.',
    'maudits-marieceleste': 'En décembre 1872, un navire découvre la Mary Celeste qui dérive dans l’Atlantique, entre les Açores et le Portugal. Personne à bord, mais la cargaison est intacte et il reste des vivres pour six mois.',
    'maudits-baychimo': 'En 1931, ce cargo est pris dans les glaces au large de l’Alaska. Son équipage l’abandonne, persuadé qu’il va couler.',
    'maudits-deering': 'Le 31 janvier 1921, cette goélette est retrouvée échouée sur les bancs du cap Hatteras, en Caroline du Nord, toutes voiles dehors.',
    'maudits-caleuche': 'Dans l’archipel de Chiloé, au sud du Chili, on raconte qu’un navire illuminé navigue la nuit, au son d’une musique de fête.',
    'maudits-meduse': 'En juillet 1816, la frégate la Méduse s’échoue au large de la Mauritanie, à cause d’un commandant incompétent. Faute de canots, environ 150 personnes s’entassent sur un radeau.',
    'maudits-batavia': 'En 1629, ce navire de la Compagnie des Indes orientales, chargé d’argent, fait naufrage sur des îlots au large de l’Australie.',
    'maudits-bounty': 'Le 28 avril 1789, dans le Pacifique, l’officier Fletcher Christian et une partie de l’équipage se révoltent contre le capitaine William Bligh, qu’ils abandonnent dans une chaloupe.',
    'alchimistes-flamel': 'Nicolas Flamel vécut à Paris au XIVe siècle. Écrivain public et libraire, il s’enrichit et finança des églises et des maisons pour les pauvres.',
    'alchimistes-nostradamus': 'Michel de Nostredame, né à Saint-Rémy-de-Provence en 1503, était apothicaire et médecin. Il soigna les malades de la peste.',
    'alchimistes-dee': 'Mathématicien, astronome et géographe, John Dee conseillait la reine Élisabeth Ire d’Angleterre ; il choisit même la date de son couronnement.',
    'alchimistes-paracelse': 'Ce médecin du XVIe siècle brûla publiquement les livres de médecine anciens et voulut tout apprendre de l’expérience.',
    'alchimistes-cagliostro': 'Né Giuseppe Balsamo en Sicile, ce « comte de Cagliostro » parcourut l’Europe en vendant élixirs, guérisons et séances de magie.',
    'alchimistes-saintgermain': 'Personne ne sut jamais d’où il venait. Brillant musicien, chimiste et conteur, il fut reçu à la cour de Louis XV.',
    'alchimistes-agrippa': 'Heinrich Cornelius Agrippa, savant allemand du XVIe siècle, écrivit La Philosophie occulte, l’un des grands livres de magie de la Renaissance.',
    'illusionnistes-roberthoudin': 'Jean-Eugène Robert-Houdin, horloger de Blois, ouvre son théâtre à Paris en 1845. Il abandonne la robe de sorcier pour l’habit de soirée et crée des automates prodigieux.',
    'illusionnistes-houdini': 'Né Erik Weisz à Budapest en 1874, il prit son nom de scène en hommage à [[roberthoudin]]. Il se libérait de menottes, de camisoles et de prisons.',
    'illusionnistes-robertson': 'Le Belge Étienne-Gaspard Robertson présentait à Paris, à la fin du XVIIIe siècle, des spectacles terrifiants dans un ancien couvent.',
    'illusionnistes-kellar': 'À la fin du XIXe siècle, Harry Kellar parcourt le monde avec un spectacle immense, et devient le magicien le plus populaire des États-Unis.',
    'illusionnistes-adelaide': 'Assistante et épouse du grand magicien Alexander Herrmann, Adelaide reprit seule le spectacle à sa mort, en 1896.',
    'illusionnistes-chunglingsoo': 'L’Américain William Robinson se produisait sous le nom de Chung Ling Soo, en se faisant passer pour un magicien chinois. Il ne parlait jamais sur scène et utilisait un interprète.',
    'illusionnistes-melies': 'En 1888, Georges Méliès rachète le théâtre de [[roberthoudin]] à Paris. En décembre 1895, il assiste à la première séance des [[savants:lumiere|frères Lumière]] et comprend aussitôt ce que le cinéma peut apporter à la magie.',
    'celtes-lug': 'Lug se présenta un jour aux portes de Tara, la cour des dieux. Le portier exigeait un talent que personne n’avait encore : Lug les avait tous, forgeron, poète, guerrier, harpiste et magicien.',
    'celtes-dagda': 'Le Dagda, « le dieu bon », c’est-à-dire bon en tout, était le père des dieux d’Irlande.',
    'celtes-morrigan': 'Déesse de la guerre, elle survolait les champs de bataille sous la forme d’une corneille et annonçait qui allait mourir.',
    'celtes-brigid': 'Fille du [[dagda]], elle protégeait les poètes, les forgerons et les guérisseurs. On la fêtait le 1er février, à Imbolc, au retour de la lumière.',
    'celtes-cernunnos': 'Ce dieu gaulois porte des bois de cerf et un torque, un collier rigide d’or. Il est souvent assis en tailleur, entouré d’animaux.',
    'celtes-cuchulainn': 'Enfant, il tua le terrible chien de garde du forgeron Culann et proposa de le remplacer lui-même : on l’appela désormais Cúchulainn, « le chien de Culann ».',
    'celtes-fionn': 'Encore apprenti, Fionn faisait cuire pour son maître le saumon de la connaissance. Il se brûla le pouce sur sa peau et le porta à sa bouche : il reçut toute la sagesse du monde.',
    'azteques-quetzalcoatl': 'Dieu du vent, du savoir et des arts, il aurait offert aux humains le maïs et le calendrier. Son nom unit le quetzal, oiseau aux plumes précieuses, et le serpent.',
    'azteques-huitzilopochtli': 'Ce dieu du soleil et de la guerre guida le peuple mexica pendant sa longue migration.',
    'azteques-tezcatlipoca': 'Son nom signifie « miroir fumant ». Il portait un miroir d’obsidienne, une pierre volcanique noire, dans lequel il voyait tout ce qui se passait dans le monde.',
    'azteques-tlaloc': 'Reconnaissable à ses yeux cerclés et à ses crocs, il commandait la pluie, indispensable aux récoltes, mais aussi la grêle et la foudre.',
    'azteques-coatlicue': 'Mère de [[huitzilopochtli]], elle porte une jupe de serpents et un collier de mains et de cœurs.',
    'azteques-xochiquetzal': 'Déesse de la beauté, de l’amour et des fleurs, elle protégeait aussi les tisserandes, les peintres et les orfèvres.',
    'azteques-mictlantecuhtli': 'Ce dieu squelette règne sur le Mictlan, le monde souterrain. Pour l’atteindre, les âmes devaient franchir neuf niveaux pendant quatre ans.',
    'chine-sunwukong': 'Né d’un rocher frappé par le vent et le soleil, ce singe devient roi de sa tribu, apprend 72 métamorphoses et peut franchir des milliers de lieues d’une seule culbute sur un nuage.',
    'chine-nuwa': 'Se sentant seule, la déesse Nüwa modela les premiers humains dans la terre jaune du fleuve.',
    'chine-pangu': 'Au commencement, l’univers n’était qu’un œuf. Pangu s’y éveilla et le brisa : le léger s’éleva pour former le ciel, le lourd descendit pour former la terre.',
    'chine-change': 'Épouse de l’archer [[houyi]], Chang’e but l’élixir d’immortalité et s’envola jusqu’à la [[lunes:lune|Lune]], où elle vit avec un lapin de jade.',
    'chine-houyi': 'Autrefois, dix soleils brillaient ensemble dans le ciel et brûlaient la terre. L’archer Houyi en abattit neuf de ses flèches, et n’en laissa qu’un.',
    'chine-nezha': 'Né après trois ans et demi de grossesse, Nezha est un enfant prodige armé d’un anneau et d’un ruban magiques.',
    'chine-longwang': 'Les rois dragons règnent sur les quatre mers depuis des palais de cristal sous les eaux. Ils commandent la pluie, et l’on priait dans leurs temples en temps de sécheresse.',
    'inde-ganesh': 'Selon un récit célèbre, [[shiva]], ne reconnaissant pas son fils qui lui barrait le passage, lui trancha la tête, puis la remplaça par celle d’un éléphant pour le ramener à la vie.',
    'inde-hanuman': 'Fils du dieu du vent, ce singe dévoué à [[rama]] traversa la mer d’un seul bond jusqu’à l’île de Lanka pour retrouver Sita, l’épouse enlevée de son maître.',
    'inde-rama': 'Prince vertueux, Rama est exilé quatorze ans dans la forêt avec son épouse Sita et son frère. Le roi démon [[ravana]] enlève Sita et l’emmène sur l’île de Lanka.',
    'inde-ravana': 'Roi de l’île de Lanka, il avait dix têtes et vingt bras. C’était aussi un grand savant et un musicien accompli.',
    'inde-durga': 'Quand le démon-buffle Mahishasura devint invincible face aux dieux, ceux-ci unirent leurs pouvoirs pour créer Durga, à qui chacun confia son arme.',
    'inde-shiva': 'Shiva détruit l’univers à la fin de chaque cycle pour permettre sa renaissance. Il médite sur le mont Kailash, le fleuve Gange s’écoulant de ses cheveux.',
    'inde-garuda': 'Mi-homme, mi-aigle, Garuda est si rapide qu’il peut arrêter la rotation du monde du battement de ses ailes. Il est la monture de Vishnou.',
    'slaves-babayaga': 'Au cœur de la forêt, sa cabane tourne sur des pattes de poule et ne montre sa porte qu’à ceux qui savent lui parler. Elle vole dans un mortier, effaçant ses traces avec un balai.',
    'slaves-koschei': 'Koschei ne peut pas être tué, car il a caché sa mort hors de son corps : dans une aiguille, dans un œuf, dans un canard, dans un lièvre, dans un coffre enterré sous un chêne, sur une île lointaine.',
    'slaves-oiseaudefeu': 'Ses plumes brillent comme des flammes ; une seule suffit à éclairer une pièce entière. Chaque nuit, il vient voler les pommes d’or du jardin du tsar.',
    'slaves-perun': 'Perun lance la foudre et règne depuis le sommet d’un grand chêne. Comme [[nordique:thor|Thor]], il combat un serpent ennemi, qui vole le bétail et les eaux.',
    'slaves-rusalka': 'Les roussalki sont des esprits féminins des rivières et des lacs, à la longue chevelure, qui attirent les voyageurs par leurs chants.',
    'slaves-domovoi': 'Chaque maison avait son domovoï, un petit vieillard barbu qui vivait derrière le poêle. Bien traité, il protégeait la famille et le bétail.',
    'slaves-zmey': 'Ce dragon à trois têtes vit dans les montagnes et enlève les jeunes filles. Quand on lui tranche une tête, une autre repousse.',
    'afrique-anansi': 'Dans les contes akan du Ghana, toutes les histoires appartenaient au dieu du ciel, Nyame. L’araignée Anansi voulut les acheter.',
    'afrique-soundiata': 'Enfant, il ne pouvait pas marcher et subissait les moqueries. Un jour, il se redressa en s’appuyant sur une barre de fer, qui plia sous son poids.',
    'afrique-ninkinanka': 'Dans les mangroves de Gambie et du Sénégal vivrait un immense dragon à tête de cheval et au corps de serpent, couvert d’écailles brillantes.',
    'afrique-nyaminyami': 'Pour les Tonga, qui vivent au bord du Zambèze, ce dieu à corps de serpent et à tête de poisson protège le fleuve et ses habitants.',
    'afrique-mamiwata': 'Vénérée de l’Afrique de l’Ouest à l’Afrique centrale, et jusque dans les Amériques, Mami Wata est un esprit des eaux, représenté en sirène, souvent un serpent enroulé autour d’elle.',
    'afrique-kintu': 'Selon la tradition du Buganda, Kintu était le premier homme sur terre. Il voulut épouser Nambi, fille du dieu du ciel, qui lui imposa des épreuves.',
    'afrique-tokoloshe': 'Dans le folklore zoulou et xhosa, le tokoloshe est un petit être malicieux, invisible quand il le veut, qui vient tourmenter les dormeurs.',
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
    'presidents-degaulle': 'Le 18 juin 1940, depuis Londres, il appelle les Français à poursuivre le combat, puis fonde la Ve République en 1958. Sa « certaine idée de la France » se nourrit de figures comme [[herosfr:jeanne]].',
    'herosfr-jeanne': 'Jeune paysanne de Domrémy, elle mène l’armée de Charles VII et délivre Orléans en 1429, avant d’être brûlée à Rouen. [[histoire:napoleon|Bonaparte]] en fit un symbole national dès 1803, et [[presidents:degaulle]] l’invoqua souvent.',
    'histoire-louisxiv': 'Roi à quatre ans, il gouverne seul à partir de 1661 et fait de Versailles le cœur de l’Europe. On l’appela Louis le Grand, comme [[charlemagne]] fut avant lui Charles le Grand.',
    'savants-curie': 'Née à Varsovie, elle découvre avec Pierre Curie le polonium et le radium, et reçoit deux prix Nobel, en physique puis en chimie. Elle repose au Panthéon depuis 1995, non loin de [[ecrivains:hugo]].',
    'ecrivains-hugo': 'Romancier des Misérables, poète et dramaturge, il passe près de vingt ans en exil sous le Second Empire. Ennemi juré de Napoléon III, il célébra pourtant la légende de son oncle, [[histoire:napoleon]].',
    'histoire-charlemagne': 'Roi des Francs couronné empereur à Rome le jour de Noël de l’an 800, il unifie une grande partie de l’Europe occidentale. Mille ans plus tard, [[napoleon]] se réclamera de son héritage.',
    'histoire-vercingetorix': 'Chef des Arvernes, il fédère les peuples gaulois contre les légions de César et triomphe à Gergovie en 52 av. J.-C. Vaincu à Alésia, il reste le plus ancien héros de l’histoire de France, bien avant [[herosfr:jeanne]].',

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
    'etranges-quasimodo': 'Il s’éprend de la belle Esmeralda, qu’il arrache au gibet pour l’abriter dans la cathédrale en criant « Asile ! ». [[ecrivains:hugo|Victor Hugo]] écrivit Notre-Dame de Paris en 1831, notamment pour défendre la cathédrale, alors délabrée.',
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
    'histoire-clovis': 'L’épisode du vase de Soissons, qu’un guerrier brisa par défi et que Clovis vengea un an plus tard, est resté célèbre. Il fit de Paris sa capitale. Son nom a donné, au fil des siècles, le prénom Louis, porté par dix-huit rois de France.',
    'histoire-saintlouis': 'Il fit bâtir la Sainte-Chapelle à Paris pour abriter la couronne d’épines du Christ, et mena deux croisades. Il mourut de maladie devant Tunis en 1270 et fut canonisé en 1297.',
    'histoire-francoisier': 'En 1539, l’ordonnance de Villers-Cotterêts imposa le français à la place du latin dans les actes officiels. Il fonda aussi le futur Collège de France. Fait prisonnier à Pavie en 1525, il passa un an captif à Madrid.',
    'histoire-henriiv': 'On lui prête le vœu que chaque paysan puisse mettre « la poule au pot » le dimanche. Il fut assassiné par Ravaillac en 1610, rue de la Ferronnerie, à Paris. Le Pont-Neuf, achevé sous son règne, porte sa statue.',
    'presidents-louisnapoleon': 'Ne pouvant se représenter, il fit un coup d’État le 2 décembre 1851, puis devint empereur sous le nom de Napoléon III. Sous son règne, le préfet Haussmann transforma Paris. Il fut renversé après la défaite de Sedan, en 1870.',
    'presidents-thiers': 'Il dirigea la répression de la Commune de Paris en mai 1871, lors de la « Semaine sanglante ». Il obtint la libération du territoire occupé en payant l’indemnité de guerre plus vite que prévu. Il démissionna en 1873.',
    'presidents-carnot': 'Le 24 juin 1894, à Lyon, il fut poignardé par un anarchiste italien et mourut dans la nuit. Il repose au Panthéon. De nombreuses rues et places de France portent son nom.',
    'presidents-poincare': 'Après sa présidence, il redevint président du Conseil et stabilisa le franc en 1928. Son cousin, Henri Poincaré, était l’un des plus grands mathématiciens de son temps.',
    'presidents-pompidou': 'Amateur d’art moderne, il voulut à Paris un grand centre culturel, le Centre Pompidou, inauguré après sa mort. Il mourut en fonction en 1974. Il avait publié une anthologie de la poésie française.',
    'presidents-giscard': 'Européen convaincu, il créa avec le chancelier allemand Helmut Schmidt le Conseil européen et le système monétaire européen. Élu à l’Académie française en 2003, il mourut en 2020.',
    'presidents-mitterrand': 'Ses « grands travaux » ont transformé Paris : la pyramide du Louvre, l’Opéra Bastille, la Bibliothèque nationale. Il signa en 1992 le traité de Maastricht, qui fonda l’Union européenne. Il mourut en 1996.',
    'presidents-chirac': 'Il suspendit le service militaire obligatoire et fit passer le mandat présidentiel de sept à cinq ans. En 2003, il refusa d’engager la France dans la guerre en Irak. Passionné par les arts d’Afrique et d’Asie, il fit créer le musée du quai Branly. Il mourut en 2019.',
    'herosfr-duguesclin': 'Capturé plusieurs fois, il fut libéré contre de fortes rançons ; on raconte que les femmes de France filèrent la laine pour payer la sienne. Il repose à la basilique de Saint-Denis, parmi les rois.',
    'herosfr-bayard': 'Après la victoire de Marignan, en 1515, il aurait armé chevalier le jeune roi [[histoire:francoisier|François Ier]]. Il mourut en 1524 d’un coup d’arquebuse, entouré du respect de ses ennemis. Son surnom de chevalier « sans peur et sans reproche » est passé en proverbe.',
    'herosfr-lafayette': 'Revenu en France, il proposa en 1789 un projet de Déclaration des droits de l’homme et commanda la garde nationale. En 2002, il devint citoyen d’honneur des États-Unis, un titre très rare. Une réplique de L’Hermione, la frégate de son second voyage, a refait la traversée en 2015.',
    'herosfr-gouges': 'Elle défendit aussi l’abolition de l’esclavage. Opposée à la Terreur, elle fut guillotinée en 1793. Sa Déclaration le disait déjà : si la femme a le droit de monter sur l’échafaud, elle doit avoir celui de monter à la tribune.',
    'herosfr-moulin': 'Arrêté par la Gestapo à Caluire, près de Lyon, en juin 1943, il fut torturé et mourut lors de son transfert vers l’Allemagne, sans avoir parlé. Ses cendres furent transférées au Panthéon en 1964, lors d’un discours resté célèbre d’André Malraux.',
    'herosfr-baker': 'Elle adopta douze enfants de différentes origines, sa « tribu arc-en-ciel », et participa à la marche sur Washington aux côtés de Martin Luther King, en 1963. Elle est entrée au Panthéon en 2021.',
    'herosfr-aubrac': 'Enceinte, elle s’enfuit avec lui jusqu’à Londres, où naquit leur fille. Après la guerre, elle témoigna inlassablement dans les écoles pour transmettre la mémoire de la Résistance.',
    'savants-pasteur': 'En 1885, il sauva le jeune Joseph Meister, mordu par un chien enragé, grâce à son vaccin contre la rage. L’Institut Pasteur, fondé en 1887, est devenu l’un des grands centres de recherche du monde.',
    'savants-lavoisier': 'On résume souvent sa découverte par une formule : rien ne se perd, rien ne se crée, tout se transforme. Fermier général, chargé de collecter des impôts, il fut guillotiné en 1794, sous la Terreur.',
    'savants-pascal': 'Il posa avec Fermat les bases du calcul des probabilités. Ses Pensées, publiées après sa mort, sont un chef-d’œuvre de la littérature. L’unité de pression, le pascal, porte son nom.',
    'savants-champollion': 'Il comprit que les hiéroglyphes notaient à la fois des sons et des idées, en lisant dans des cartouches les noms de [[pharaons:ramses|Ramsès]] et de [[pharaons:cleopatre|Cléopâtre]]. Il fonda le musée égyptien du Louvre et mourut en 1832, à 41 ans.',
    'savants-lumiere': 'Au programme figuraient de courts films comme La Sortie de l’usine Lumière. La légende veut que les spectateurs de L’Arrivée d’un train en gare de La Ciotat aient reculé de peur. Ils inventèrent aussi l’autochrome, l’un des premiers procédés de photographie en couleurs.',
    'savants-eiffel': 'Très critiquée par des artistes lors de sa construction, la tour ne devait durer que vingt ans. Elle fut sauvée notamment par ses antennes de radio. Eiffel conçut aussi la structure intérieure de la statue de la Liberté, à New York.',
    'savants-germain': 'Elle fit avancer la théorie des nombres et remporta en 1816 le prix de l’Académie des sciences pour ses travaux sur l’élasticité. Certains nombres premiers portent son nom. Elle ne figure pas parmi les 72 savants dont les noms sont gravés sur la tour [[eiffel|Eiffel]], qui ne comptent aucune femme.',
    'ecrivains-moliere': 'Il se moqua des hypocrites, des médecins et des précieuses ridicules, ce qui lui valut de nombreux ennemis. Pris d’un malaise sur scène en jouant Le Malade imaginaire, en 1673, il mourut quelques heures plus tard. On appelle le français « la langue de Molière ».',
    'ecrivains-voltaire': 'Il prit la défense de Jean Calas, un protestant de Toulouse exécuté à tort en 1762, et obtint sa réhabilitation. Il passa ses dernières années à Ferney, près de Genève, et fut accueilli en triomphe à Paris peu avant sa mort, en 1778.',
    'ecrivains-lafontaine': 'Il reprit souvent des récits du Grec Ésope, qu’il réécrivit en vers d’une grande liberté. Chaque fable porte une morale, comme « la raison du plus fort est toujours la meilleure ». Des générations d’écoliers les ont apprises par cœur.',
    'ecrivains-dumas': 'Il écrivait avec des collaborateurs et publiait en feuilletons dans les journaux, que les lecteurs s’arrachaient. Il se fit bâtir près de Paris un château qu’il baptisa Monte-Cristo. Il est entré au Panthéon en 2002.',
    'ecrivains-sand': 'Elle vécut une longue histoire avec le compositeur Frédéric Chopin et correspondit avec les plus grands écrivains de son temps. Sa maison de Nohant, dans le Berry, où elle écrivit La Mare au diable, se visite encore.',
    'ecrivains-zola': 'En 1898, il publia « J’accuse… ! », une lettre ouverte au président de la République pour défendre le capitaine Dreyfus, condamné à tort. Il dut s’exiler en Angleterre. Il mourut en 1902, asphyxié chez lui par sa cheminée.',
    'ecrivains-jverne': 'Il travaillait à partir d’une abondante documentation scientifique, au point que ses romans semblent annoncer le sous-marin, l’hélicoptère ou le voyage vers la Lune. Il est l’un des auteurs les plus traduits au monde. Il mourut à Amiens en 1905.',
    'kami-amaterasu': 'Offensée par son frère [[susanoo]], elle se cacha dans une grotte, plongeant le monde dans la nuit. Les dieux l’en firent sortir en riant et en dansant devant l’entrée, et en plaçant un miroir où elle vit son propre éclat. Ce miroir serait l’un des trois trésors sacrés de l’empereur, conservé au sanctuaire d’Ise.',
    'kami-susanoo': 'Exilé sur terre, à Izumo, il terrassa le serpent à huit têtes Yamata no Orochi après l’avoir enivré avec du saké. Dans la queue du monstre, il trouva l’épée Kusanagi, qu’il offrit à sa sœur pour se réconcilier avec elle.',
    'kami-tsukuyomi': 'Envoyé auprès de la déesse de la nourriture, il la tua, dégoûté de la voir produire les mets par sa bouche. Furieuse, Amaterasu refusa de le revoir : c’est pourquoi, dit-on, le soleil et la lune ne se montrent jamais ensemble.',
    'kami-izanagi': 'Après la mort d’Izanami, il descendit la chercher au pays des morts, mais s’enfuit en voyant son corps en décomposition. En se purifiant dans une rivière à son retour, il donna naissance à [[amaterasu]], [[tsukuyomi]] et [[susanoo]].',
    'kami-izanami': 'Furieuse d’avoir été vue dans son corps de morte, elle poursuivit Izanagi jusqu’à la sortie du Yomi, le monde des morts, qu’il ferma d’un énorme rocher. Elle jura de faire mourir mille humains chaque jour ; il répondit qu’il en ferait naître mille cinq cents.',
    'kami-raijin': 'Les parents disaient aux enfants de cacher leur nombril pendant les orages, car Raijin aimait, paraît-il, les dévorer. Les célèbres paravents de Tawaraya Sōtatsu, au XVIIe siècle, montrent Raijin et Fūjin face à face.',
    'kami-fujin': 'Les deux dieux montent la garde au temple Sanjūsangen-dō, à Kyoto. On raconte que des vents divins, les kamikaze, sauvèrent le Japon des invasions mongoles de 1274 et 1281.',
    'kami-inari': 'Son grand sanctuaire, le Fushimi Inari-taisha de Kyoto, est célèbre pour ses milliers de portails torii rouges offerts par des fidèles, qui forment des tunnels sur la montagne. On dépose devant les statues de renards du tofu frit, leur mets préféré.',
    'yokai-kitsune': 'Certains kitsune sont bienveillants, comme les messagers du kami [[kami:inari|Inari]] ; d’autres sont des farceurs ou de redoutables séducteurs. On dit qu’un kitsune déguisé se trahit par son reflet ou par l’ombre de sa queue.',
    'yokai-tanuki': 'Ses statues, coiffées d’un chapeau de paille et tenant une bouteille de saké, accueillent les clients devant de nombreux restaurants : il porte bonheur aux commerces. Dans un conte célèbre, un tanuki se change en bouilloire qui danse.',
    'yokai-kappa': 'Il est très poli : si on le salue, il s’incline à son tour, renverse l’eau de sa tête et perd ses forces. Il adore les concombres, d’où le nom des makis au concombre, les kappamaki.',
    'yokai-tengu': 'Selon la légende, un roi des tengu enseigna le maniement du sabre au jeune [[samourais:yoshitsune|Minamoto no Yoshitsune]] sur le mont Kurama, près de Kyoto. On les représente souvent avec un éventail de plumes qui déclenche des tempêtes.',
    'yokai-yukionna': 'Dans un récit recueilli par Lafcadio Hearn en 1904, elle épargne un jeune bûcheron à condition qu’il ne parle jamais d’elle. Des années plus tard, il raconte l’histoire à son épouse… qui n’est autre que Yuki-onna.',
    'yokai-oni': 'Au festival de Setsubun, début février, les familles lancent des graines de soja en criant « Les démons dehors, le bonheur dedans ! ». Dans le conte de Momotarō, un garçon né d’une pêche part vaincre les oni avec un chien, un singe et un faisan.',
    'yokai-kasaobake': 'Il sautille et effraie plus qu’il ne fait de mal. Ces yōkai rappelaient qu’il faut respecter les objets et ne pas les jeter sans égard. Ils figurent sur les rouleaux illustrés et les jeux de l’époque d’[[epoques:edo|Edo]].',
    'yokai-rokurokubi': 'Souvent, elle ignore elle-même qu’elle est un yōkai. Une variante, le nukekubi, a une tête qui se détache entièrement du corps pour s’envoler. Ces récits furent popularisés en Occident par Lafcadio Hearn.',
    'samourais-yoshitsune': 'Jaloux de sa gloire, son demi-frère Yoritomo, devenu shōgun, le fit traquer. Encerclé, Yoshitsune se donna la mort en 1189. Selon la légende, il avait appris le sabre auprès des [[yokai:tengu|tengu]] du mont Kurama.',
    'samourais-benkei': 'Lors du dernier combat de son maître, il aurait défendu seul la porte, criblé de flèches, et serait mort debout. Au Japon, on appelle encore le tibia « l’endroit où pleure Benkei ».',
    'samourais-tomoe': 'Le Dit des Heike la décrit comme une guerrière d’une force rare, capable d’affronter seule des cavaliers ennemis. Son existence historique reste discutée, mais elle est devenue une figure populaire du théâtre et des estampes.',
    'samourais-shingen': 'Il affronta cinq fois son grand rival [[kenshin]] à Kawanakajima. Un jour où Shingen manquait de sel, Kenshin lui en aurait fait parvenir, disant qu’il combattait avec le sabre, non avec le sel. Shingen mourut en 1573, sans doute de maladie.',
    'samourais-kenshin': 'Selon la légende, lors de la quatrième bataille de Kawanakajima, en 1561, il chargea seul jusqu’à la tente de Shingen, qui para son sabre avec son éventail de commandement. Il mourut en 1578.',
    'samourais-nobunaga': 'Il accueillit les missionnaires portugais et prit à son service Yasuke, un homme venu d’Afrique. Trahi par l’un de ses généraux, il mourut en 1582 dans l’incendie du temple Honnō-ji, à Kyoto, sans avoir achevé son œuvre, que poursuivit [[hideyoshi]].',
    'samourais-hideyoshi': 'Il fit désarmer les paysans lors de la « chasse aux sabres » et sépara strictement guerriers et paysans. Il fit bâtir le château d’Osaka. Ses invasions de la Corée, en 1592 et 1597, se soldèrent par un échec.',
    'samourais-ieyasu': 'Ses descendants gouvernèrent le Japon pendant plus de deux siècles et demi de paix, l’époque d’[[epoques:edo|Edo]]. On résume parfois les trois unificateurs ainsi : Nobunaga a pétri le gâteau, Hideyoshi l’a cuit, et Ieyasu l’a mangé.',
    'samourais-musashi': 'Son duel le plus célèbre l’opposa en 1612 à Sasaki Kojirō, sur l’île de Ganryūjima : arrivé en retard, il le vainquit avec un sabre de bois taillé dans une rame. À la fin de sa vie, il écrivit le Traité des cinq roues, encore lu aujourd’hui, et fut aussi un peintre réputé.',
    'epoques-jomon': 'Leur nom, « Jōmon », signifie « marques de cordes », d’après les motifs imprimés dans l’argile. Ils façonnaient aussi d’étranges statuettes, les dogū, aux grands yeux en forme de lunettes.',
    'epoques-nara': 'Le temple Tōdai-ji abrite un bouddha de bronze haut d’une quinzaine de mètres, fondu au VIIIe siècle. C’est aussi à cette époque que furent rédigés le Kojiki et le Nihon shoki, qui racontent les mythes d’[[kami:amaterasu|Amaterasu]] et d’[[kami:izanagi|Izanagi]].',
    'epoques-heian': 'Une dame de la cour, Murasaki Shikibu, y écrivit vers l’an 1000 le Dit du Genji, souvent présenté comme le premier roman du monde. Les kana, l’écriture propre au japonais, se développèrent à cette époque.',
    'epoques-kamakura': 'Les samouraïs dominèrent désormais le pays, laissant à l’empereur un rôle surtout symbolique. Le Japon repoussa deux invasions mongoles, en 1274 et 1281, aidé par des typhons que l’on appela kamikaze, les « vents divins ». Le grand bouddha de Kamakura date de cette époque.',
    'epoques-muromachi': 'C’est pourtant une grande époque de création : le théâtre nō, la cérémonie du thé, les jardins zen et l’art floral y prirent leur forme. Le Pavillon d’or, le Kinkaku-ji, fut bâti à la fin du XIVe siècle.',
    'epoques-sengoku': 'Les Portugais, arrivés en 1543, apportèrent les premières arquebuses, qui changèrent la guerre. Trois grands chefs, [[samourais:nobunaga|Oda Nobunaga]], [[samourais:hideyoshi|Toyotomi Hideyoshi]] et [[samourais:ieyasu|Tokugawa Ieyasu]], réunifièrent finalement le pays.',
    'epoques-edo': 'Les villes virent fleurir le théâtre kabuki, les estampes ukiyo-e et les haïkus de Bashō. La célèbre Grande Vague de Kanagawa, d’Hokusai, date de cette époque. En 1853, les « navires noirs » du commodore américain Perry forcèrent le Japon à s’ouvrir.',
    'epoques-meiji': 'Les samouraïs perdirent leurs privilèges et le droit de porter le sabre. La révolte de Satsuma, menée en 1877 par Saigō Takamori, fut leur dernier combat. L’ère Meiji s’acheva à la mort de l’empereur, en 1912.',
    'eaux-nessie': 'La légende moderne naît en 1933, quand une nouvelle route longe le lac. L’année suivante, la « photo du chirurgien » fait le tour du monde ; en 1994, on apprend que c’était un jouet. En 2018, une étude de l’ADN de l’eau n’a trouvé aucune trace de reptile, mais énormément d’anguilles. Certains imaginent un survivant des [[mersciel:plesiosaure|plésiosaures]].',
    'eaux-ogopogo': 'Son nom moderne viendrait d’une chanson de music-hall britannique des années 1920. La ville de Kelowna en a fait sa mascotte : une statue verte et souriante l’accueille au bord de l’eau.',
    'eaux-champ': 'En 1977, une photographie prise par Sandra Mansi relance la légende : on y voit une tête et un dos sortant de l’eau. Dans les années 1980, les élus du Vermont et de New York votèrent des résolutions pour protéger l’animal… s’il existe. On attribue souvent sa découverte à Samuel de Champlain, mais l’explorateur décrivait sans doute un grand poisson.',
    'eaux-bunyip': 'Au XIXe siècle, des colons crurent trouver ses os. Certains chercheurs pensent que ces récits gardent le souvenir de grands marsupiaux disparus, comme le diprotodon, dont on a retrouvé des fossiles près de points d’eau.',
    'eaux-mokele': 'Sa silhouette rappelle celle d’un [[dinosaures:brachiosaure|sauropode]], ce qui a attiré de nombreuses expéditions dans les années 1980. Aucune n’a rapporté de preuve, mais la région, immense et inondée, reste l’une des moins explorées de la planète.',
    'eaux-serpentmer': 'Une piste sérieuse : le régalec, un poisson ruban argenté qui peut dépasser huit mètres, le plus long des poissons osseux. Il vit en profondeur et ne remonte que malade ou mourant, ce qui explique sa rareté. On l’appelle parfois « roi des harengs ».',
    'eaux-caddy': 'En 1937, des baleiniers trouvèrent dans l’estomac d’un cachalot une étrange carcasse, longue de trois mètres, qu’ils photographièrent. Elle fut perdue avant d’être étudiée, et le mystère reste entier.',
    'hommessauvages-yeti': 'En 1951, l’alpiniste Eric Shipton photographie une empreinte géante près de l’Everest. Plusieurs monastères conservaient des « scalps de yéti » ; en 2017, l’analyse de prétendus restes de yétis a montré qu’ils provenaient presque tous d’ours de l’Himalaya.',
    'hommessauvages-bigfoot': 'En 1967, un court film tourné à Bluff Creek, en Californie, montre une silhouette poilue qui se retourne vers la caméra. Il est toujours débattu. En 2002, la famille d’un homme nommé Ray Wallace révéla qu’il fabriquait de fausses empreintes avec des pieds en bois sculpté.',
    'hommessauvages-yowie': 'Les Montagnes Bleues, près de Sydney, concentrent de nombreux témoignages depuis le XIXe siècle. Ces récits sont d’autant plus étranges que l’Australie n’a jamais abrité de grand singe.',
    'hommessauvages-almasty': 'Une Française, Marie-Jeanne Koffmann, alpiniste et chirurgienne installée en URSS, consacra des décennies à le chercher dans les montagnes du Caucase, en recueillant des centaines de témoignages.',
    'hommessauvages-orangpendek': 'En 2003, la découverte sur l’île voisine de Florès d’une espèce humaine disparue de petite taille, surnommée « le hobbit », a relancé l’intérêt pour ces récits. Des chercheurs ont posé des pièges photographiques dans le parc de Kerinci Seblat.',
    'hommessauvages-yeren': 'En 1977, l’Académie chinoise des sciences y envoya une importante expédition, qui rapporta des poils et des empreintes, mais aucun animal. La forêt abrite en revanche de vrais trésors, comme le rhinopithèque doré, un singe au pelage orangé.',
    'hommessauvages-mapinguari': 'Des scientifiques ont remarqué qu’il ressemblait à un [[megafaune:megatherium|paresseux géant]], un animal disparu il y a environ dix mille ans. Les récits garderaient-ils la mémoire de bêtes que les premiers Américains ont croisées ?',
    'betes-chupacabra': 'La légende gagne ensuite le Mexique et le Texas. Les « chupacabras » capturés dans le sud des États-Unis se sont révélés être des coyotes ou des chiens atteints d’une gale sévère, qui leur fait perdre leurs poils et leur donne un air monstrueux.',
    'betes-mothman': 'Treize mois plus tard, le pont d’argent qui enjambait la rivière Ohio s’effondra, faisant 46 morts. La légende lia les deux événements. La ville organise aujourd’hui un festival du Mothman et lui a élevé une statue de métal.',
    'betes-jerseydevil': 'En janvier 1909, des centaines de témoignages et de traces dans la neige affolèrent la région : des écoles fermèrent. L’équipe de hockey sur glace de l’État s’appelle aujourd’hui les New Jersey Devils.',
    'betes-kongamato': 'En 1932, un administrateur britannique, Frank Melland, montra à des habitants des dessins de [[mersciel:pteranodon|ptérosaures]] : ils les auraient reconnus aussitôt. La piste la plus probable reste une grande chauve-souris ou une cigogne.',
    'betes-dahu': 'C’est une célèbre farce française : on emmène un naïf, de nuit, tenir un sac en appelant le dahu, pendant que les autres rentrent tranquillement se coucher. On distingue les dahus « dextrogyres » des « lévogyres », selon le sens dans lequel ils font le tour de la montagne.',
    'betes-jackalope': 'Dans les années 1930, deux frères taxidermistes eurent l’idée de greffer des bois de cerf sur des lièvres naturalisés : le succès fut immense. La légende a peut-être une origine réelle : un virus provoque chez certains lapins des excroissances en forme de cornes.',
    'betes-okapi': 'En 1901, l’explorateur Harry Johnston obtint enfin des morceaux de peau et un crâne : l’okapi est un parent de la girafe. Devenu l’emblème de la Société internationale de cryptozoologie, il rappelle que des animaux de grande taille peuvent encore échapper aux scientifiques.',
    'citesperdues-atlantide': 'Punie par les dieux, elle aurait sombré « en un seul jour et une seule nuit ». Pour beaucoup d’historiens, Platon invente une fable morale. D’autres pensent à la civilisation minoenne, frappée vers 1600 avant notre ère par l’éruption du volcan de Santorin.',
    'citesperdues-eldorado': 'Les conquistadors transformèrent ce rite en cité fabuleuse, qu’ils cherchèrent pendant deux siècles. L’Anglais Walter Raleigh s’y ruina en 1595. En 1969, des paysans trouvèrent un radeau d’or muisca qui représente la cérémonie ; il est exposé au musée de l’Or de Bogota.',
    'citesperdues-ys': 'La mer engloutit la ville ; Gradlon ne fut sauvé que par saint Guénolé. On dit que la ville dort sous la baie de Douarnenez et que, par temps calme, on entend ses cloches. Selon un jeu de mots populaire, Paris viendrait de « Par-Is », « pareille à Ys ».',
    'citesperdues-shambhala': 'Le mythe fascina les explorateurs occidentaux, qui le cherchèrent jusqu’en Asie centrale. Il inspira au romancier James Hilton, en 1933, la vallée imaginaire de Shangri-La, devenue synonyme de paradis secret.',
    'citesperdues-citez': 'En 1925, il disparut dans le Mato Grosso avec son fils, et des dizaines d’expéditions partirent à sa recherche. Ironie de l’histoire : les archéologues ont depuis découvert, dans la région du Xingu, les traces de vastes villages reliés par des routes, bien avant l’arrivée des Européens.',
    'citesperdues-troie': 'À partir de 1871, l’homme d’affaires allemand Heinrich Schliemann fouille la colline d’Hissarlik, en Turquie, et met au jour plusieurs villes superposées. Il y découvre un trésor qu’il baptise « trésor de Priam », en réalité bien plus ancien. Emporté à Berlin, puis à Moscou en 1945, il est aujourd’hui au musée Pouchkine.',
    'citesperdues-hyperboree': 'On disait qu’[[grece:apollon|Apollon]] y passait l’hiver, tiré par un char de cygnes. Les savants ont parfois vu dans ce mythe un écho lointain des longs jours de l’été arctique.',
    'enigmes-stonehenge': 'Ses « pierres bleues » ont été transportées depuis les collines de Preseli, au pays de Galles, à plus de 200 kilomètres. On ne sait toujours pas comment. Une légende médiévale attribuait le monument à [[arthur:merlin|Merlin]], qui l’aurait fait voler depuis l’Irlande.',
    'enigmes-paques': 'Comment les déplacer sans roues ni grands animaux ? Les traditions disent que les moaï « marchaient ». En 2012, des chercheurs ont montré qu’une équipe pouvait faire avancer une réplique debout en la balançant avec des cordes. Le navigateur néerlandais Roggeveen nomma l’île en y abordant un jour de Pâques, en 1722.',
    'enigmes-nazca': 'On ne les voit vraiment que du ciel, ce qui a nourri bien des théories. L’Allemande Maria Reiche passa sa vie à les étudier et à les protéger. Des centaines de nouvelles figures ont été repérées ces dernières années grâce aux drones et à l’intelligence artificielle.',
    'enigmes-bermudes': 'En décembre 1945, cinq avions de l’US Navy, le « vol 19 », s’y volatilisèrent. L’expression « triangle des Bermudes » naît dans un magazine en 1964. Pourtant, les assureurs et les garde-côtes américains n’y relèvent pas plus de disparitions qu’ailleurs dans une zone aussi fréquentée.',
    'enigmes-voynich': 'Son parchemin a été daté du début du XVe siècle. Il porte le nom du libraire Wilfrid Voynich, qui l’acheta en 1912. Conservé à l’université Yale, il a résisté aux plus grands cryptographes, y compris ceux qui avaient percé les codes de la Seconde Guerre mondiale.',
    'enigmes-anticythere': 'Il a fallu un siècle et des scanners modernes pour comprendre : cette machine, fabriquée vers le IIe ou le Ier siècle avant notre ère, calculait la position du Soleil et de la Lune et prédisait les éclipses. On la surnomme le premier ordinateur de l’histoire : rien d’aussi complexe ne réapparaît avant les horloges du Moyen Âge.',
    'enigmes-carnac': 'Une légende raconte que saint Cornély, poursuivi par des soldats romains, les aurait changés en pierres. Leur fonction reste discutée : calendrier, lieu de culte, frontière ? Les mégalithes de Carnac et des rives du Morbihan ont été inscrits au patrimoine mondial de l’Unesco en 2025.',
    'tresors-graal': 'Les auteurs suivants en firent la coupe de la Cène, où Joseph d’Arimathie aurait recueilli le sang du Christ. Sa quête devint l’épreuve suprême des chevaliers du roi [[arthur:arthur|Arthur]]. Plusieurs églises affirment posséder la coupe, comme la cathédrale de Valence, en Espagne.',
    'tresors-templiers': 'L’ordre fut dissous en 1312, et son dernier grand maître, Jacques de Molay, brûlé à Paris en 1314. Son trésor n’a jamais été retrouvé. On l’a cherché à Gisors, en Écosse ou au Canada ; certains pensent qu’il n’existait déjà plus.',
    'tresors-arche': 'Il disparaît de l’histoire avec la destruction du Temple par les Babyloniens, en 587 avant notre ère. L’Église orthodoxe d’Éthiopie affirme le garder à Aksoum, dans une chapelle veillée par un moine que nul autre n’a le droit d’approcher.',
    'tresors-ambre': 'En 1941, les troupes allemandes le démontèrent et l’emportèrent à Königsberg. Il disparut en 1945, sans doute détruit, peut-être caché. Une reconstitution, fruit de vingt ans de travail, fut inaugurée en 2003.',
    'tresors-lima': 'Une fois au large, Thompson et son équipage s’emparent du trésor et l’auraient enterré sur l’île Cocos, au large du Costa Rica. Des centaines d’expéditions l’ont fouillée depuis, sans succès. L’île, aujourd’hui parc national, est réputée pour ses requins-marteaux.',
    'tresors-renneslechateau': 'D’où venait cet argent ? La légende parle d’un trésor caché. Les historiens penchent pour un commerce de messes payées par correspondance, pour lequel il fut d’ailleurs condamné. Les chercheurs de trésor creusèrent tant que la commune interdit les fouilles en 1965.',
    'tresors-montezuma': 'Dans la nuit du 30 juin, chassés par les Aztèques, ils fuient par les chaussées qui traversent le lac. Lestés d’or, beaucoup se noient : les Espagnols l’appelèrent la « Nuit triste ». Une partie du trésor ne fut jamais retrouvée, quelque part sous l’actuelle Mexico.',
    'dinosaures-trex': 'Ses bras minuscules faisaient pourtant près d’un mètre et soulevaient de lourdes charges. Le squelette « Sue », découvert en 1990 par Sue Hendrickson, est exposé à Chicago. En 2020, un autre spécimen, « Stan », fut vendu près de 32 millions de dollars aux enchères.',
    'dinosaures-triceratops': 'Ce n’était pas qu’une légende : on a retrouvé des os de tricératops portant des traces de dents de tyrannosaure, dont certaines cicatrisées. Le duel a donc bien eu lieu, et le tricératops y a parfois survécu.',
    'dinosaures-velociraptor': 'Il frappait ses proies d’une grande griffe recourbée. En 1971, on découvrit en Mongolie un fossile extraordinaire : un vélociraptor et un protocératops, morts en plein combat, figés depuis 75 millions d’années.',
    'dinosaures-brachiosaure': 'Il pouvait brouter à plus de dix mètres de haut. Un de ses proches cousins, exposé au musée d’histoire naturelle de Berlin, est l’un des plus hauts squelettes de dinosaure montés au monde.',
    'dinosaures-stegosaure': 'Il a vécu il y a environ 150 millions d’années : le [[trex]] est donc plus proche de nous dans le temps que du stégosaure. Les paléontologues appellent sa queue à pointes un « thagomizer », d’après un dessin humoristique de 1982.',
    'dinosaures-spinosaure': 'Ses premiers fossiles, découverts en Égypte en 1912, furent détruits par un bombardement sur Munich en 1944. De nouvelles découvertes au Maroc ont montré qu’il possédait une queue en forme de nageoire : c’est le premier grand dinosaure connu adapté à la nage.',
    'dinosaures-ankylosaure': 'Sa queue se terminait par une lourde massue d’os, capable de briser la patte d’un prédateur. Contemporain du [[trex]], il faisait sans doute partie de ses proies les plus dangereuses.',
    'mersciel-mosasaure': 'Son premier crâne fut trouvé au XVIIIe siècle dans une carrière près de Maastricht, au bord de la Meuse, qui lui donna son nom. En 1795, les troupes françaises le saisirent et l’emportèrent à Paris, où il est toujours exposé au Muséum.',
    'mersciel-plesiosaure': 'En 1823, la paléontologue anglaise Mary Anning découvrit le premier squelette complet, à Lyme Regis. C’est sa silhouette que l’on prête souvent à [[eaux:nessie|Nessie]], même si un reptile marin ne pourrait pas vivre dans les eaux froides du Loch Ness.',
    'mersciel-ichtyosaure': 'Mary Anning et son frère en trouvèrent l’un des premiers squelettes, vers 1811, encore enfants. En 2020, une fillette de onze ans découvrit sur une plage anglaise la mâchoire d’un ichtyosaure géant, sans doute long de 25 mètres, presque autant qu’une baleine bleue.',
    'mersciel-megalodon': 'Pendant des siècles, on prit ces dents fossiles pour des « langues de pierre ». En 1667, le savant danois Nicolas Sténon montra qu’il s’agissait de dents de requin, une étape importante dans la compréhension des fossiles.',
    'mersciel-dunkleosteus': 'Il n’avait pas de dents : ses plaques osseuses formaient des lames qui s’affûtaient d’elles-mêmes. Ses mâchoires s’ouvraient à une vitesse fulgurante. De beaux fossiles ont été trouvés près de Cleveland, aux États-Unis.',
    'mersciel-pteranodon': 'Il n’avait pas de dents et pêchait au-dessus de la mer intérieure qui couvrait alors le centre de l’Amérique du Nord. Ses fossiles sont nombreux dans les craies du Kansas.',
    'mersciel-quetzalcoatlus': 'Découvert au Texas en 1971, il fut baptisé en l’honneur du dieu aztèque [[azteques:quetzalcoatl|Quetzalcóatl]], le serpent à plumes. Il chassait sans doute à terre, à grandes enjambées, de petits animaux.',
    'megafaune-mammouth': 'Les derniers mammouths vivaient sur l’île Wrangel, au nord de la Sibérie, il y a environ 4 000 ans, à l’époque où l’on bâtissait les pyramides d’Égypte. On retrouve en Sibérie des mammouths congelés presque intacts, comme Lyuba, un bébé découvert en 2007.',
    'megafaune-smilodon': 'Des milliers de ses ossements ont été retrouvés dans les fosses de goudron de La Brea, en plein Los Angeles : attirés par des proies prises au piège, les prédateurs s’y engluaient à leur tour.',
    'megafaune-megatherium': 'En 1796, le naturaliste français Georges Cuvier étudia un squelette envoyé à Madrid et prouva qu’il s’agissait d’une espèce disparue. Ce fut l’une des premières démonstrations de l’extinction des espèces. Certains y voient l’origine du [[hommessauvages:mapinguari|Mapinguari]].',
    'megafaune-rhinolaineux': 'Les artistes de la grotte Chauvet, en Ardèche, l’ont peint il y a plus de 30 000 ans, avec une précision qui a permis aux scientifiques d’étudier son allure.',
    'megafaune-glyptodon': 'Il pesait jusqu’à deux tonnes. Des chercheurs pensent que les premiers habitants de l’Amérique ont pu utiliser ses carapaces vides comme abris.',
    'megafaune-ourscavernes': 'Malgré son allure, il se nourrissait surtout de plantes. Dans la grotte Chauvet, des crânes d’ours ont été retrouvés disposés sur un bloc de pierre, peut-être par les humains qui fréquentaient les lieux.',
    'megafaune-megaloceros': 'Ses bois pouvaient dépasser 3,5 mètres d’une pointe à l’autre et peser 40 kilos. Il les perdait et les refaisait chaque année.',
    'navires-santamaria': 'La nuit de Noël 1492, la Santa María s’échoue sur la côte d’Hispaniola, l’actuelle Haïti. Avec son bois, Colomb fait bâtir un fortin, La Navidad, où il laisse une partie de son équipage.',
    'navires-victoria': 'Magellan est tué aux Philippines en 1521. Seule la Victoria, commandée par Juan Sebastián Elcano, rentre en Espagne en septembre 1522 avec dix-huit survivants : le premier tour du monde est accompli.',
    'navires-mayflower': 'Avant de débarquer, les hommes signent le « pacte du Mayflower », un engagement à se gouverner ensemble, souvent vu comme un ancêtre de la démocratie américaine. La fête de Thanksgiving rappelle leur premier automne.',
    'navires-endeavour': 'Il ouvrait aussi des ordres secrets : chercher un continent austral. Il cartographie la Nouvelle-Zélande et la côte est de l’Australie. La navette spatiale Endeavour fut baptisée en son honneur.',
    'navires-vasa': 'Il resta plus de trois siècles au fond du port, protégé par l’eau froide. Renfloué en 1961, il est aujourd’hui exposé presque intact dans un musée qui lui est consacré, l’un des plus visités de Scandinavie.',
    'navires-victory': 'Avant la bataille, il fait hisser le signal « L’Angleterre attend de chacun qu’il fasse son devoir ». Nelson est tué au combat, mais remporte la victoire. Le Victory, conservé à Portsmouth, est toujours un navire en service de la Royal Navy.',
    'navires-titanic': 'Dans la nuit du 14 au 15 avril, il heurte un iceberg et sombre en moins de trois heures. Faute de canots pour tous, plus de 1 500 personnes périssent. L’épave fut retrouvée en 1985, à près de 4 000 mètres de fond, par une équipe franco-américaine.',
    'maudits-marieceleste': 'Seul un canot de sauvetage manque. On a tout imaginé : pirates, mutinerie, monstre marin. En 1884, une nouvelle d’Arthur Conan Doyle, le créateur de [[detectives:holmes|Sherlock Holmes]], rendit l’affaire célèbre dans le monde entier.',
    'maudits-baychimo': 'Pourtant, le navire fantôme dérive pendant des décennies : des chasseurs, des Inuits et des marins l’aperçoivent à de nombreuses reprises. Sa dernière observation date de 1969.',
    'maudits-deering': 'L’équipage a disparu, avec ses affaires personnelles et les livres de bord. Plusieurs administrations américaines enquêtèrent, évoquant pirates, mutinerie ou contrebande d’alcool, sans jamais résoudre l’énigme.',
    'maudits-caleuche': 'Il recueillerait les âmes des noyés, qui y festoient pour l’éternité. Quand on s’en approche, il disparaît ou se change en rocher. Il rappelle le [[etranges:hollandais|Hollandais volant]] des légendes européennes.',
    'maudits-meduse': 'Après treize jours de dérive, de faim et de violences, seules quinze personnes sont recueillies. Le scandale fut immense. Le peintre Théodore Géricault en tira Le Radeau de la Méduse, exposé au Louvre.',
    'maudits-batavia': 'Pendant que le commandant part chercher du secours, un marchand, Jeronimus Cornelisz, prend le pouvoir et terrorise les survivants. À son retour, le commandant fait juger les mutins. Une réplique du navire a été construite aux Pays-Bas.',
    'maudits-bounty': 'Bligh réussit l’exploit de rejoindre l’île de Timor, à plus de 6 000 kilomètres. Les mutins se cachent sur l’île de Pitcairn, où ils brûlent le Bounty. Leurs descendants y vivent encore aujourd’hui.',
    'alchimistes-flamel': 'Deux siècles après sa mort, on raconta qu’il avait découvert la pierre philosophale, qui change le plomb en or et donne l’immortalité. Sa maison de la rue de Montmorency, construite en 1407, est l’une des plus anciennes de Paris.',
    'alchimistes-nostradamus': 'En 1555, il publie Les Prophéties, des quatrains obscurs qui annonceraient l’avenir. Catherine de Médicis le consulta, et il devint médecin du roi Charles IX. Depuis, on prétend y lire chaque grande catastrophe… une fois qu’elle a eu lieu.',
    'alchimistes-dee': 'Il chercha à converser avec les anges à l’aide d’un médium et d’un miroir noir. Ce miroir d’obsidienne, conservé au British Museum, est d’origine aztèque : la pierre sacrée de [[azteques:tezcatlipoca|Tezcatlipoca]].',
    'alchimistes-paracelse': 'Il est l’auteur d’une idée toujours enseignée : « c’est la dose qui fait le poison ». Alchimiste, il cherchait moins à faire de l’or qu’à fabriquer des remèdes, ce qui en fait un ancêtre de la pharmacie.',
    'alchimistes-cagliostro': 'À Paris, il fut mêlé en 1785 à l’affaire du collier de la reine Marie-Antoinette. Acquitté, il fut tout de même enfermé à la Bastille puis expulsé. Il finit ses jours dans une prison du pape, en Italie.',
    'alchimistes-saintgermain': 'Il laissait entendre qu’il avait connu des personnages morts depuis des siècles. [[ecrivains:voltaire|Voltaire]] le décrivit comme « un homme qui ne meurt point, et qui sait tout ». Il mourut pourtant en Allemagne, en 1784, mais certains prétendirent l’avoir croisé bien après.',
    'alchimistes-agrippa': 'On raconta qu’il était suivi d’un chien noir nommé Monsieur, qui serait un démon. Il publia pourtant aussi un livre sur la vanité des sciences, où il critiquait la magie elle-même.',
    'illusionnistes-roberthoudin': 'En 1856, [[presidents:louisnapoleon|Napoléon III]] l’envoie en Algérie pour impressionner les chefs locaux : un enfant soulève un coffre, puis un homme fort ne peut plus le bouger, grâce à un électroaimant caché. Sa maison de Blois est devenue un musée de la magie.',
    'illusionnistes-houdini': 'Son numéro le plus célèbre : s’échapper, tête en bas, d’une cuve remplie d’eau. À la fin de sa vie, il traqua les faux médiums qui prétendaient parler aux morts. Il mourut le 31 octobre 1926, jour d’Halloween.',
    'illusionnistes-robertson': 'Grâce à une lanterne magique cachée sur roulettes, il faisait surgir des spectres qui grandissaient et fonçaient sur le public. C’était aussi un aéronaute, qui battit des records d’altitude en ballon.',
    'illusionnistes-kellar': 'Son numéro phare faisait léviter une jeune femme, puis passer un anneau autour d’elle. Le jeune [[houdini]] l’admirait. En 1908, il transmit symboliquement sa couronne de « doyen » à son successeur, Howard Thurston.',
    'illusionnistes-adelaide': 'Elle se produisit pendant plus de vingt-cinq ans, réalisant même le dangereux tour de la balle attrapée au vol. On la surnommait la « reine de la magie », à une époque où les femmes n’étaient presque jamais en tête d’affiche.',
    'illusionnistes-chunglingsoo': 'Le 23 mars 1918, à Londres, il réalise le tour de la balle attrapée au vol. Un fusil truqué se dérègle et la balle l’atteint. Selon la légende, il prononça alors ses premiers mots en anglais devant le public : « Baissez le rideau ».',
    'illusionnistes-melies': 'Un jour, sa caméra se bloque place de l’Opéra : au visionnage, un omnibus se change en corbillard. Il invente ainsi le trucage. En 1902, il réalise Le Voyage dans la Lune. Ruiné, il finit par vendre des jouets gare Montparnasse, avant d’être redécouvert et décoré de la Légion d’honneur.',
    'celtes-lug': 'Il mena les dieux à la bataille contre les Fomoires et tua leur roi, son propre grand-père, d’une pierre de fronde en plein œil. On le fêtait le 1er août, à Lughnasadh. Lyon, l’antique Lugdunum, pourrait tenir son nom de lui.',
    'celtes-dagda': 'Il possédait une massue dont un bout tuait et l’autre ressuscitait, un chaudron qui ne se vidait jamais et une harpe qui commandait aux saisons. Sa force n’avait d’égal que son appétit.',
    'celtes-morrigan': 'Elle offrit son amour au héros [[cuchulainn]], qui la repoussa. Quand il mourut, attaché debout à une pierre, une corneille se posa sur son épaule : c’est seulement alors que ses ennemis osèrent approcher.',
    'celtes-brigid': 'Son culte se mêla à celui de sainte Brigitte de Kildare, qui fonda un monastère où des religieuses entretenaient une flamme perpétuelle. Une flamme y a été rallumée en 1993 et brûle toujours.',
    'celtes-cernunnos': 'Son nom n’apparaît qu’une seule fois, sur le pilier des Nautes, un monument offert par les bateliers de Lutèce et retrouvé en 1711 sous Notre-Dame de Paris. Le chaudron de Gundestrup, découvert au Danemark, le montre tenant un serpent à cornes de bélier.',
    'celtes-cuchulainn': 'Lors de la guerre de la Razzia des vaches de Cooley, il défendit seul l’Ulster contre l’armée de la reine Medb. Blessé à mort, il s’attacha à une pierre dressée pour mourir debout. Sa statue orne la grande poste de Dublin.',
    'celtes-fionn': 'Chef des Fianna, une troupe de guerriers, il serait aussi un géant : selon la légende, il bâtit la Chaussée des Géants, en Irlande du Nord, pour aller combattre un géant écossais.',
    'azteques-quetzalcoatl': 'Chassé par son rival [[tezcatlipoca]], il serait parti vers l’est en promettant de revenir. On a longtemps dit que l’empereur Moctezuma avait pris Cortés pour lui ; les historiens pensent aujourd’hui que ce récit fut écrit après la conquête.',
    'azteques-huitzilopochtli': 'Il leur annonça qu’ils fonderaient leur ville là où ils verraient un aigle posé sur un cactus, dévorant un serpent. Ce signe, vu sur une île du lac Texcoco, est aujourd’hui au centre du drapeau mexicain.',
    'azteques-tezcatlipoca': 'Éternel rival de [[quetzalcoatl]], il perdit un pied dans un combat contre un monstre de la terre et le remplaça par un miroir. En Angleterre, le mage [[alchimistes:dee|John Dee]] utilisa un miroir d’obsidienne venu du Mexique.',
    'azteques-tlaloc': 'Au sommet du Templo Mayor, la grande pyramide de Tenochtitlan, son sanctuaire bleu se dressait à côté de celui, rouge, de [[huitzilopochtli]]. Ceux qui mouraient noyés rejoignaient son paradis, le Tlalocan.',
    'azteques-coatlicue': 'Sa statue colossale fut découverte en 1790 sous la grande place de Mexico. Elle impressionna tant qu’on la réenterra pendant des années. Elle est aujourd’hui l’une des pièces maîtresses du musée national d’anthropologie de Mexico.',
    'azteques-xochiquetzal': 'On la représente parée de plumes de quetzal et entourée de papillons. Les artisans lui rendaient hommage lors de fêtes colorées.',
    'azteques-mictlantecuhtli': 'Un chien, le xoloitzcuintle, les aidait à traverser une rivière ; cette race de chien sans poils existe toujours au Mexique. Le jour des Morts, fête mexicaine inscrite au patrimoine de l’Unesco, mêle ces traditions anciennes aux fêtes chrétiennes.',
    'chine-sunwukong': 'Il vole au [[longwang|roi dragon]] un bâton magique qui grandit et rétrécit à volonté, puis sème le chaos au palais céleste. Le Bouddha l’emprisonne sous une montagne pendant cinq siècles, jusqu’à ce qu’il accompagne un moine en Inde. C’est le héros du grand roman La Pérégrination vers l’Ouest, écrit au XVIe siècle.',
    'chine-nuwa': 'Quand un pilier du ciel s’effondra, provoquant feux et déluges, elle fondit des pierres de cinq couleurs pour colmater la voûte céleste et rétablir l’ordre du monde.',
    'chine-pangu': 'Pendant 18 000 ans, il les maintint écartés en grandissant chaque jour. À sa mort, son souffle devint le vent, ses yeux le soleil et la lune, son corps les montagnes et son sang les rivières.',
    'chine-change': 'On la célèbre à la fête de la mi-automne, en partageant des gâteaux de lune. Le programme lunaire chinois porte son nom : la sonde Chang’e 4 s’est posée en 2019 sur la face cachée de la Lune, une première mondiale.',
    'chine-houyi': 'En récompense, il reçut l’élixir d’immortalité, que son épouse [[change|Chang’e]] but à sa place. Depuis, dit-on, il contemple la Lune où elle s’est envolée.',
    'chine-nezha': 'Il affronta le fils du [[longwang|roi dragon]] et le vainquit, déclenchant la colère des dragons. Il renaquit d’une fleur de lotus et se déplace sur deux roues de vent et de feu.',
    'chine-longwang': 'Le roi de la mer de l’Est dut céder à [[sunwukong]] le pilier qui servait à mesurer la profondeur des océans : il devint le célèbre bâton du Roi Singe.',
    'inde-ganesh': 'On l’invoque au début de toute entreprise. Il aurait servi de scribe pour le Mahabharata, cassant l’une de ses défenses pour écrire. Chaque année, une grande procession en son honneur traverse le quartier de La Chapelle, à Paris.',
    'inde-hanuman': 'Pour sauver le frère blessé de Rama, il devait rapporter une plante médicinale de l’Himalaya ; ne sachant laquelle cueillir, il souleva la montagne entière et l’emporta.',
    'inde-rama': 'Avec l’aide d’[[hanuman]] et d’une armée de singes, Rama bâtit un pont jusqu’à Lanka et délivre Sita. La fête de Diwali, où l’on allume des milliers de lampes, célèbre notamment son retour dans sa ville d’Ayodhya.',
    'inde-ravana': 'Son orgueil le perdit : en enlevant Sita, l’épouse de [[rama]], il provoqua la guerre qui causa sa chute. Chaque année, lors de la fête de Dussehra, on brûle d’immenses effigies de Ravana.',
    'inde-durga': 'Montée sur un lion, elle vainquit le démon après neuf jours de combat. À Calcutta, la fête de Durga Puja, inscrite au patrimoine de l’Unesco, rassemble des millions de personnes autour de statues monumentales.',
    'inde-shiva': 'Sous la forme de Nataraja, le roi de la danse, il danse au centre d’un cercle de flammes, symbole du mouvement de l’univers. Une statue de Shiva dansant, offerte par l’Inde, se dresse au CERN, près de Genève, là où l’on étudie les particules.',
    'inde-garuda': 'Ennemi juré des serpents, il est devenu un emblème bien au-delà de l’Inde : il figure sur les armoiries de l’Indonésie et de la Thaïlande, et donne son nom à la compagnie aérienne indonésienne.',
    'slaves-babayaga': 'Terrifiante, elle dévore les imprudents, mais aide parfois les héros courageux et polis, comme la jeune Vassilissa… Elle n’est jamais tout à fait bonne ni tout à fait mauvaise.',
    'slaves-koschei': 'Il enlève des princesses, et seul un héros qui découvre le secret de l’aiguille peut le vaincre. Il apparaît, avec [[oiseaudefeu|l’Oiseau de feu]], dans le célèbre ballet de Stravinsky créé à Paris en 1910.',
    'slaves-oiseaudefeu': 'Le prince Ivan part le capturer avec l’aide d’un loup gris, une quête semée d’épreuves. L’oiseau de feu symbolise le trésor inaccessible qui pousse le héros à partir.',
    'slaves-perun': 'En 988, le prince Vladimir de Kiev se convertit au christianisme et fit jeter la statue de Perun dans le fleuve Dniepr. Son culte survécut pourtant dans les fêtes populaires.',
    'slaves-rusalka': 'Le compositeur tchèque Antonín Dvořák en fit l’héroïne d’un opéra, Rusalka, en 1901 : son air du « Chant à la lune » est l’un des plus célèbres du répertoire.',
    'slaves-domovoi': 'Quand on déménageait, on emportait des braises du vieux poêle ou une vieille botte pour l’inviter à suivre la famille dans sa nouvelle maison.',
    'slaves-zmey': 'Le bogatyr Dobrynia Nikititch, héros des épopées russes, l’affronta et délivra la nièce du prince de Kiev. Il rappelle l’[[monstres:hydre|Hydre]] combattue par Héraclès.',
    'afrique-anansi': 'Le prix était immense : capturer un python, un léopard, des frelons et une fée. Par la ruse, Anansi y parvint, et depuis, toutes les histoires lui appartiennent. Ses contes ont traversé l’Atlantique et se racontent encore aux Antilles.',
    'afrique-soundiata': 'Vers 1235, il vainquit le roi sorcier Soumaoro Kanté à la bataille de Kirina et fonda l’empire du Mali. Son épopée est chantée depuis des siècles par les griots, et la charte du Manden, attribuée à son règne, est inscrite au patrimoine de l’Unesco.',
    'afrique-ninkinanka': 'On raconte que celui qui le voit tombe malade et meurt peu après. En 2006, des chercheurs britanniques partirent en expédition dans les marais gambiens, sur la piste de ces récits.',
    'afrique-nyaminyami': 'Dans les années 1950, la construction du barrage de Kariba fut frappée par des crues exceptionnelles qui détruisirent une partie du chantier. Pour les Tonga, déplacés par le lac artificiel, c’était la colère de Nyami Nyami, séparé de son épouse par le barrage.',
    'afrique-mamiwata': 'Elle apporte, dit-on, beauté, richesse et guérison, mais exige fidélité de ceux qu’elle choisit. Son image a inspiré de nombreux artistes africains contemporains.',
    'afrique-kintu': 'Il les réussit, et le couple partit vivre sur terre. Mais Nambi, revenue chercher du grain oublié, fut suivie par son frère Walumbe, la mort : c’est ainsi que la mort arriva parmi les hommes.',
    'afrique-tokoloshe': 'Pour lui échapper, on raconte que certains surélevaient leur lit sur des briques, trop haut pour qu’il puisse les atteindre.',
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
    'presidents-degaulle': 'Officier de la Grande Guerre, blessé et fait prisonnier à Verdun, il défend avant 1940 l’emploi des chars. Président de 1959 à 1969, il dote la France de la dissuasion nucléaire. Il repose à Colombey-les-Deux-Églises.',
    'herosfr-jeanne': 'Elle dit entendre les voix de saint Michel, sainte Catherine et sainte Marguerite. Elle fait sacrer Charles VII à Reims, puis est capturée à Compiègne et jugée pour hérésie. Réhabilitée en 1456, elle est canonisée en 1920.',
    'histoire-louisxiv': 'Il prend le soleil pour emblème et danse lui-même dans les ballets de cour. Il révoque l’édit de Nantes en 1685. On lui prête une phrase qu’il n’a sans doute jamais prononcée : « L’État, c’est moi. »',
    'savants-curie': 'Première femme lauréate d’un prix Nobel, elle fut aussi la première personne à en recevoir deux. Pendant la Grande Guerre, elle équipe des voitures de radiologie, les « petites Curies ». Ses carnets de laboratoire sont encore radioactifs aujourd’hui.',
    'ecrivains-hugo': 'Il publie Notre-Dame de Paris en 1831 et Les Misérables en 1862, depuis son exil à Guernesey. Député, il combat la peine de mort toute sa vie. À sa mort, en 1885, une foule immense suit son cercueil jusqu’au Panthéon.',
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

  /* ---------- Illustrations définitives ----------
     Elles ne sont plus référencées ici : media/originals/<collection>/<personnage>/<rareté>.png
     → tools/media/build.mjs → assets/js/media-manifest.js, raccordé au catalogue par media.js. */

  /* ---------- Boosters ----------
     Les taux de référence (odds) sont modulés par le stock réellement
     disponible : voir store.js → packOdds(). */
  var ALL = ['grece', 'titans', 'geants', 'heros', 'monstres', 'egypte', 'pharaons', 'planetes', 'lunes', 'gothique', 'contes', 'histoire', 'nordique', 'creatures', 'jotnar', 'mondes', 'astronautes', 'missions', 'cosmos', 'detectives', 'verne', 'mousquetaires', 'nuits', 'merveilleux', 'jungle', 'arthur', 'robin', 'etranges', 'flibustiers', 'forbans', 'presidents', 'herosfr', 'savants', 'ecrivains', 'kami', 'yokai', 'samourais', 'epoques', 'eaux', 'hommessauvages', 'betes', 'citesperdues', 'enigmes', 'tresors', 'dinosaures', 'mersciel', 'megafaune', 'navires', 'maudits', 'alchimistes', 'illusionnistes', 'celtes', 'azteques', 'chine', 'inde', 'slaves', 'afrique'];
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
      id: 'standard', name: 'Booster Atlas', kicker: 'Offert toutes les 15 min', price: 0, timer: true, size: 5, theme: 'lapis',
      cover: 'grece-athena-rare',
      collections: ALL,
      odds: { base: 0.78, rare: 0.15, epic: 0.05, legendary: 0.015, mythic: 0.004, unique: 0.001 },
      desc: 'Cinq cartes issues de l’ensemble des collections publiées. Un nouveau booster toutes les 15 minutes, jusqu’à 10 en réserve.',
      lure: 'legendary',
      hook: 'Cinq cartes tirées dans toutes les salles du musée. Un nouveau booster vous attend toutes les 15 minutes.'
    },
    {
      id: 'conservateur', name: 'Coffret du Conservateur', kicker: 'Récompense · carte numérotée garantie', price: 0, earned: true, size: 5, theme: 'garnet',
      cover: 'histoire-napoleon-mythic',
      collections: ALL,
      odds: { base: 0.6, rare: 0.26, epic: 0.1, legendary: 0.03, mythic: 0.008, unique: 0.002 },
      guarantee: { odds: { rare: 0.7, epic: 0.22, legendary: 0.06, mythic: 0.016, unique: 0.004 } },
      desc: 'Cinq cartes, dont la dernière est obligatoirement une édition numérotée (Rare ou supérieure).',
      lure: 'legendary',
      hook: 'Le coffret des collectionneurs : cinq cartes, dont une édition numérotée garantie.'
    },
    {
      id: 'saga', name: 'Saga du Nord', kicker: 'Événement · durée limitée', price: 0, earned: true, size: 5, theme: 'night', event: true,
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
