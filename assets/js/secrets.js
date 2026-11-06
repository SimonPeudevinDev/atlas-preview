/* ==========================================================================
   ATLAS — Personnages secrets (un par collection)
   Ils ne sortent jamais des boosters : leur illustration se révèle fragment par
   fragment, un fragment par personnage obtenu dans la collection, et la carte
   est remise quand la collection est complète (palier « Collection complète »).
   [[slug]] = lien vers un personnage de la même collection.
   image : chemin de l’illustration définitive (ex. 'assets/card/secret/promethee.png'), facultatif.
   ========================================================================== */
(function (A) {
  A.SECRET = {
    grece: {
      name: 'Dionysos', title: 'Le Dernier Olympien', atk: 78, def: 72, esp: 92,
      bio: 'Fils de [[zeus]] et de la mortelle Sémélé, il fut le dernier à rejoindre les dieux de l’Olympe.',
      more: 'Sa mère mourut foudroyée en voyant Zeus dans toute sa gloire : Zeus cousit l’enfant dans sa cuisse jusqu’à sa naissance. Dieu de la vigne, du vin et de l’ivresse, il est aussi celui du théâtre : les tragédies et les comédies d’Athènes étaient jouées pendant ses fêtes, les Dionysies.'
    },
    heros: {
      name: 'Achille', title: 'Le Héros invulnérable', atk: 98, def: 88, esp: 70,
      bio: 'Fils de la nymphe Thétis, il était invulnérable sauf au talon, par lequel sa mère l’avait tenu pour le plonger dans le Styx.',
      more: 'Il fut le plus grand guerrier grec de la guerre de Troie, où il tua le prince troyen Hector. Il mourut d’une flèche de Pâris, guidée par Apollon, en plein talon. On parle encore du « talon d’Achille » pour désigner un point faible.'
    },
    monstres: {
      name: 'Échidna', title: 'La Mère des monstres', atk: 88, def: 84, esp: 76,
      bio: 'Mi-femme mi-serpent, elle donna naissance avec Typhon aux plus terribles monstres grecs, dont [[cerbere]], l’[[hydre]] et la [[chimere]].',
      more: 'Hésiode la décrit comme une nymphe au beau visage dont le corps se termine en serpent tacheté. Elle vivait dans une grotte, loin des dieux et des hommes. Selon certains récits, Argos aux cent yeux, le gardien d’Héra, la tua pendant son sommeil.'
    },
    titans: {
      name: 'Gaïa', title: 'La Terre mère', atk: 80, def: 98, esp: 94,
      bio: 'Née aux origines du monde, la Terre enfanta seule Ouranos, le Ciel, puis lui donna les Titans, dont [[cronos]], les Cyclopes et les Hécatonchires.',
      more: 'Quand Ouranos enferma ses enfants dans ses profondeurs, elle forgea la faucille avec laquelle [[cronos]] le renversa. Plus tard, furieuse du sort des Titans, elle lança contre l’Olympe les Géants puis Typhon. C’est aussi elle qui parlait, à l’origine, par l’oracle de Delphes.'
    },
    geants: {
      name: 'Typhon', title: 'Le Père des monstres', atk: 99, def: 90, esp: 66,
      bio: 'Dernier enfant de Gaïa, ce monstre aux cent têtes de serpent fut le plus terrible adversaire de [[grece:zeus|Zeus]].',
      more: 'Sa tête touchait les étoiles et ses yeux lançaient des flammes. Avec Échidna, il engendra les pires monstres de la mythologie : Cerbère, l’hydre de Lerne, la Chimère. Vaincu par la foudre de Zeus, il fut enseveli sous l’Etna. Le mot « typhon » viendrait en partie de son nom.'
    },
    egypte: {
      name: 'Apophis', title: 'Le Serpent du chaos', atk: 94, def: 82, esp: 70,
      bio: 'Immense serpent des ténèbres, il attaque chaque nuit la barque de [[ra]] pour empêcher le soleil de se lever.',
      more: 'On ne le vénérait pas, on le combattait : les prêtres récitaient des formules contre lui et brûlaient des figurines à son image. Selon les récits, le dieu Seth, debout à la proue de la barque solaire, le repousse chaque nuit. Si Apophis l’emportait un jour, le monde retournerait au chaos des origines.'
    },
    pharaons: {
      name: 'Imhotep', title: 'L’Architecte divinisé', atk: 58, def: 82, esp: 99,
      bio: 'Architecte du roi Djéser, il conçut vers 2650 av. J.-C. la première pyramide de l’histoire, la pyramide à degrés de Saqqarah, bien avant celle de [[kheops]].',
      more: 'Vizir, médecin et grand prêtre, il fut si admiré qu’on finit par en faire un dieu, fils de Ptah, que l’on priait pour guérir. Les Grecs l’assimilèrent à leur dieu de la médecine, Asclépios. Son tombeau n’a jamais été retrouvé.'
    },
    planetes: {
      name: 'Pluton', title: 'La Planète déchue', atk: 70, def: 92, esp: 88,
      bio: 'Découverte en 1930 par Clyde Tombaugh, elle fut longtemps la neuvième planète, avant d’être reclassée planète naine en 2006.',
      more: 'Plus petite que notre Lune, elle met 248 ans à faire le tour du Soleil. En 2015, la sonde New Horizons a révélé à sa surface une immense plaine glacée en forme de cœur. Son nom, proposé par une écolière anglaise de onze ans, Venetia Burney, est celui du dieu romain des Enfers, l’équivalent d’[[grece:hades|Hadès]].'
    },
    lunes: {
      name: 'Charon', title: 'Le Passeur', atk: 62, def: 86, esp: 90,
      bio: 'Grande lune de Pluton, presque moitié aussi large qu’elle : les deux astres tournent l’un autour de l’autre comme un couple, en se montrant toujours la même face.',
      more: 'Découverte en 1978, elle porte le nom du passeur qui, dans la mythologie grecque, faisait traverser le Styx aux âmes des morts contre une obole. En 2015, la sonde New Horizons y a photographié une calotte rougeâtre à son pôle nord, surnommée Mordor.'
    },
    astronautes: {
      name: 'Laïka', title: 'La Chienne des étoiles', atk: 52, def: 70, esp: 80,
      bio: 'Chienne errante recueillie dans les rues de Moscou, elle fut en novembre 1957 le premier être vivant mis en orbite, à bord de Spoutnik 2.',
      more: 'Le vaisseau n’était pas conçu pour revenir sur Terre : elle mourut quelques heures après le lancement, de surchauffe. Son sacrifice a ouvert la voie aux vols habités, et un monument lui rend hommage à Moscou depuis 2008.'
    },
    missions: {
      name: 'Le Disque d’or', title: 'Le Message aux étoiles', atk: 40, def: 99, esp: 99,
      bio: 'Disque gravé emporté par les sondes [[voyager]], à l’intention d’éventuels êtres venus d’ailleurs.',
      more: 'Ce disque de cuivre plaqué d’or contient 115 images, des sons de la Terre, des salutations en 55 langues et 90 minutes de musique, de Bach à Chuck Berry. Une notice gravée explique comment le lire. Il pourrait durer un milliard d’années.'
    },
    detectives: {
      name: 'Mycroft Holmes', title: 'Le Frère de l’ombre', atk: 60, def: 88, esp: 99,
      bio: 'Frère aîné de [[holmes]], plus doué encore que lui, il refuse pourtant de quitter son fauteuil.',
      more: 'Il travaille pour le gouvernement britannique, au point d’être parfois, selon son frère, le gouvernement lui-même. Il passe ses soirées au Diogenes Club, un cercle où il est interdit de parler.'
    },
    verne: {
      name: 'Le Nautilus', title: 'Le Sous-marin de Nemo', atk: 88, def: 96, esp: 90,
      bio: 'Le sous-marin du [[nemo|capitaine Nemo]], long de soixante-dix mètres, entièrement mû par l’électricité.',
      more: 'Verne le décrit avec un salon-musée, une bibliothèque de douze mille volumes et un orgue. Il emprunte son nom à un véritable sous-marin construit par Robert Fulton en 1800. En 1954, la marine américaine baptisa Nautilus son premier sous-marin nucléaire.'
    },
    mousquetaires: {
      name: 'L’Homme au masque de fer', title: 'Le Prisonnier sans visage', atk: 60, def: 90, esp: 92,
      bio: 'Prisonnier mystérieux de Louis XIV, il passa des décennies dans les prisons royales, le visage toujours caché.',
      more: 'Il a réellement existé : il mourut à la Bastille en 1703 sans que personne connaisse son identité. Voltaire en fit une légende, et Dumas, dans Le Vicomte de Bragelonne, le frère jumeau du roi, au cœur d’un complot d’[[aramis]].'
    },
    nuits: {
      name: 'Le Tapis volant', title: 'Le Voyageur instantané', atk: 70, def: 80, esp: 92,
      bio: 'Tapis capable de transporter en un instant ses passagers d’un bout à l’autre du monde.',
      more: 'Dans un conte ajouté par Galland, trois princes rivalisent pour rapporter l’objet le plus merveilleux : un tapis qui vole, une lunette qui voit au loin et une pomme qui guérit. Aucun ne l’emporte : les trois objets réunis sauvent ensemble la princesse.'
    },
    merveilleux: {
      name: 'Le Magicien d’Oz', title: 'Le Maître des illusions', atk: 50, def: 80, esp: 96,
      bio: 'Maître de la Cité d’émeraude, il apparaît à chacun sous une forme terrifiante différente.',
      more: 'C’est en réalité un simple homme d’Omaha, arrivé à Oz en ballon, qui se cache derrière des illusions. Il ne peut rien accorder de magique, mais ses faux cadeaux révèlent à chacun ce qu’il possédait déjà. Il repart en ballon, sans [[dorothy]].'
    },
    jungle: {
      name: 'Le Cobra blanc', title: 'Le Gardien du trésor', atk: 80, def: 92, esp: 88,
      bio: 'Vieux cobra aveugle et blanchi par l’âge, il garde depuis des siècles le trésor d’une cité oubliée.',
      more: 'Dans « L’Ankus du roi », [[mowgli]] et [[kaa]] découvrent sous les Grottes froides un trésor de rois. Mowgli emporte un aiguillon d’éléphant serti de pierres précieuses et découvre que les hommes s’entretuent pour le posséder. Il finit par le rapporter.'
    },
    arthur: {
      name: 'Excalibur', title: 'L’Épée du roi', atk: 99, def: 90, esp: 80,
      bio: 'L’épée du roi [[arthur]], remise par la [[damedulac|Dame du Lac]].',
      more: 'Son fourreau rendait son porteur invulnérable. Selon les récits, elle se confond ou non avec l’épée tirée du rocher. En France, Durendal, l’épée de Roland, a sa propre légende : on dit qu’elle est plantée dans la falaise de Rocamadour.'
    },
    robin: {
      name: 'Richard Cœur de Lion', title: 'Le Roi croisé', atk: 94, def: 88, esp: 84,
      bio: 'Roi d’Angleterre parti en croisade, dont [[robin]] et ses compagnons attendent le retour.',
      more: 'Il régna de 1189 à 1199 mais ne passa que quelques mois en Angleterre. Capturé au retour de la croisade, il fut libéré contre une énorme rançon. Dans la légende, il rentre déguisé, rencontre Robin dans la forêt et lui pardonne.'
    },
    etranges: {
      name: 'Le Monstre du Loch Ness', title: 'La Bête des eaux noires', atk: 88, def: 86, esp: 70,
      bio: 'Créature supposée vivre dans les eaux sombres du Loch Ness, en Écosse.',
      more: 'La légende remonte à un récit du VIe siècle, où saint Columba aurait repoussé une bête de la rivière Ness. Elle devint célèbre en 1934 grâce à une photographie, révélée soixante ans plus tard comme un trucage réalisé avec un jouet. Aucune expédition n’a jamais apporté de preuve.'
    },
    flibustiers: {
      name: 'Le Jolly Roger', title: 'Le Pavillon noir', atk: 90, def: 70, esp: 80,
      bio: 'Le drapeau noir des pirates, orné le plus souvent d’une tête de mort et de tibias croisés.',
      more: 'Chaque capitaine avait son propre dessin : on attribue à [[barbenoire]] un squelette transperçant un cœur, et [[roberts]] se représentait debout sur deux crânes. Hisser le pavillon noir signifiait : rendez-vous, et vous aurez la vie sauve.'
    },
    forbans: {
      name: 'La Carte au trésor', title: 'La Croix rouge', atk: 50, def: 80, esp: 98,
      bio: 'La carte de l’île au trésor, dessinée par le capitaine [[flint]], où une croix rouge marque la cachette.',
      more: 'Stevenson eut l’idée du roman en dessinant une carte imaginaire avec son beau-fils, un jour de pluie en Écosse : c’est autour d’elle qu’il construisit toute l’histoire. L’image du trésor marqué d’une croix vient en grande partie de ce livre.'
    },
    cosmos: {
      name: 'Le Fond diffus cosmologique', title: 'La Première Lumière', atk: 70, def: 99, esp: 99,
      bio: 'La plus ancienne lumière de l’Univers, émise environ 380 000 ans après le Big Bang.',
      more: 'Elle baigne tout le ciel, refroidie aujourd’hui à 2,7 degrés au-dessus du zéro absolu. Deux ingénieurs américains la découvrirent par hasard en 1965 et crurent d’abord à des fientes de pigeon dans leur antenne. Une petite partie de la « neige » des vieilles télévisions venait de ce rayonnement.'
    },
    gothique: {
      name: 'Van Helsing', title: 'Le Chasseur de l’ombre', atk: 82, def: 84, esp: 94,
      bio: 'Professeur hollandais, médecin et savant, il mène la traque contre [[dracula]] aux côtés de Jonathan et Mina Harker.',
      more: 'Bram Stoker en fit, en 1897, l’homme qui croit à ce que la science refuse encore d’admettre. C’est lui qui comprend le premier le mal qui frappe la jeune Lucy Westenra. Il connaît les remèdes anciens : l’ail, l’hostie, le pieu et la lumière du jour.'
    },
    contes: {
      name: 'Ma Mère l’Oye', title: 'La Conteuse', atk: 52, def: 70, esp: 99,
      bio: 'Vieille conteuse au coin du feu, elle prête son nom au recueil où Perrault réunit [[cendrillon]], le [[chatbotte]] et le [[chaperon]].',
      more: 'En 1697, le recueil de Charles Perrault s’ouvre sur une gravure : une vieille femme file la laine en racontant des histoires à des enfants, sous une pancarte « Contes de ma mère l’Oye ». Elle incarne la tradition orale, ces récits transmis de génération en génération bien avant d’être écrits. Le premier conte du recueil est celui de la [[belle]].'
    },
    histoire: {
      name: 'Marianne', title: 'Figure de la République', atk: 70, def: 88, esp: 92,
      bio: 'Coiffée du bonnet phrygien, elle incarne la République française et sa devise : liberté, égalité, fraternité.',
      more: 'Ce prénom, très répandu au XVIIIe siècle, devient le surnom de la République pendant la Révolution. Son buste orne les mairies, son profil les timbres et les pièces de monnaie. Le tableau de Delacroix, La Liberté guidant le peuple, peint en 1830, a nourri son image de femme du peuple en marche.'
    },
    nordique: {
      name: 'Mjöllnir', title: 'Le Marteau de Thor', atk: 99, def: 90, esp: 70,
      bio: 'Le marteau de [[thor]], forgé par des nains, qui revient toujours dans la main de son maître.',
      more: 'Les nains Brokk et Eitri le forgèrent à la suite d’un pari avec [[loki]], qui, changé en mouche, piqua le forgeron : le manche en sortit un peu trop court. De petits marteaux de Thor, portés en pendentif, ont été retrouvés dans de nombreuses tombes vikings.'
    },
    creatures: {
      name: 'Fáfnir', title: 'Le Dragon du trésor', atk: 95, def: 92, esp: 72,
      bio: 'Nain changé en dragon par sa cupidité, il veille sur un trésor maudit.',
      more: 'Il tua son père pour s’emparer de l’or que [[nordique:loki|Loki]] avait dû livrer en rançon, puis se changea en dragon pour le garder. Le héros Sigurd le tua en le frappant par en dessous, caché dans une fosse. En goûtant son sang, il se mit à comprendre le langage des oiseaux.'
    },
    jotnar: {
      name: 'Ymir', title: 'Le Géant primordial', atk: 96, def: 90, esp: 60,
      bio: 'Premier des géants, né de la rencontre de la glace et du feu, il fut tué par [[nordique:odin|Odin]] et ses frères, qui façonnèrent le monde à partir de son corps.',
      more: 'Sa chair devint la terre, son sang les mers, ses os les montagnes, et son crâne la voûte du ciel, soutenue par quatre nains. Ses sourcils servirent à bâtir [[mondes:midgard|Midgard]], le monde des hommes. Au commencement, il fut nourri par la vache [[creatures:audhumla|Audhumla]].'
    },
    mondes: {
      name: 'Yggdrasil', title: 'L’Arbre du monde', atk: 70, def: 99, esp: 99,
      bio: 'Frêne immense dont les branches et les racines relient les neuf mondes.',
      more: 'Sous ses racines coulent trois sources, dont le puits de Mímir et celui d’Urd, où les Nornes tissent le destin. [[nordique:odin|Odin]] s’y pendit neuf nuits, transpercé de sa lance, pour découvrir le secret des runes. Au Ragnarök, l’arbre tremblera, mais ne tombera pas.'
    },
  };
})(window.ATLAS);
