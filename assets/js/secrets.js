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
    presidents: {
      name: 'Marianne', title: 'Figure de la République', atk: 70, def: 88, esp: 92,
      bio: 'Coiffée du bonnet phrygien, elle incarne la République française et sa devise : liberté, égalité, fraternité.',
      more: 'Ce prénom, très répandu au XVIIIe siècle, devint le surnom de la République pendant la Révolution. Son buste orne les mairies, son profil les timbres et les pièces de monnaie. Le tableau de Delacroix, La Liberté guidant le peuple, peint en 1830, a nourri son image de femme du peuple en marche.'
    },
    herosfr: {
      name: 'Le Soldat inconnu', title: 'La Flamme du souvenir', atk: 80, def: 90, esp: 80,
      bio: 'Soldat français mort pendant la Grande Guerre, dont on ignore le nom, inhumé sous l’Arc de triomphe.',
      more: 'Il fut choisi en 1920 à Verdun parmi huit cercueils de soldats non identifiés, par un jeune soldat qui déposa un bouquet sur le sixième. Depuis 1923, une flamme y est ravivée chaque soir. Il représente tous les combattants morts pour la France.'
    },
    savants: {
      name: 'Le Mètre étalon', title: 'La Mesure du monde', atk: 40, def: 96, esp: 99,
      bio: 'La mesure de longueur inventée par la France révolutionnaire, pour un système valable pour tous.',
      more: 'Le mètre fut défini en 1791 comme la dix-millionième partie du quart du méridien terrestre. Les astronomes Delambre et Méchain mesurèrent pendant sept ans l’arc de méridien entre Dunkerque et Barcelone. Seize mètres étalons de marbre furent installés dans Paris ; deux sont encore en place.'
    },
    ecrivains: {
      name: 'L’Encyclopédie', title: 'Le Livre des Lumières', atk: 50, def: 90, esp: 99,
      bio: 'Immense dictionnaire raisonné des sciences et des arts, dirigé par Diderot et d’Alembert au XVIIIe siècle.',
      more: 'Publiée de 1751 à 1772 en dix-sept volumes de texte et onze de planches, elle rassemblait le savoir de son temps, avec la participation de [[voltaire]]. Interdite à plusieurs reprises, elle diffusa les idées des Lumières dans toute l’Europe.'
    },
    kami: {
      name: 'Yamata no Orochi', title: 'Le Serpent à huit têtes', atk: 97, def: 92, esp: 66,
      bio: 'Serpent géant à huit têtes et huit queues, si long qu’il couvrait huit vallées et huit collines.',
      more: 'Il dévorait chaque année l’une des filles d’un vieux couple. [[susanoo]] l’enivra avec huit cuves de saké avant de le découper. Dans l’une de ses queues, il trouva l’épée Kusanagi, l’un des trois trésors sacrés du Japon.'
    },
    yokai: {
      name: 'Tamamo-no-Mae', title: 'La Renarde impériale', atk: 80, def: 86, esp: 99,
      bio: 'Courtisane d’une beauté et d’une intelligence sans égales, qui était en réalité un [[kitsune]] à neuf queues.',
      more: 'Selon la légende, elle ensorcela l’empereur Toba au XIIe siècle, qui tomba gravement malade. Démasquée par un astrologue, elle s’enfuit et fut tuée, puis changée en une pierre empoisonnée, la Sesshō-seki. En 2022, cette pierre se fendit en deux, ce qui fit grand bruit au Japon.'
    },
    samourais: {
      name: 'Les 47 Rōnin', title: 'Les Vengeurs loyaux', atk: 92, def: 90, esp: 88,
      bio: 'Quarante-sept samouraïs devenus sans maître, qui vengèrent leur seigneur au début du XVIIIe siècle.',
      more: 'Leur seigneur, Asano, avait été condamné à mort pour avoir blessé un haut fonctionnaire, Kira, dans le château d’Edo. Pendant près de deux ans, les rōnin feignirent la débauche pour endormir la méfiance, puis attaquèrent la demeure de Kira. Leurs tombes, au temple Sengaku-ji de Tokyo, reçoivent encore des visiteurs chaque jour.'
    },
    epoques: {
      name: 'Le Mont Fuji', title: 'La Montagne sacrée', atk: 70, def: 99, esp: 90,
      bio: 'Volcan de 3 776 mètres, plus haut sommet du Japon et symbole du pays.',
      more: 'Montagne sacrée du shintoïsme, il est gravi par des pèlerins depuis des siècles. Hokusai lui consacra une série célèbre, les Trente-six vues du mont Fuji. Sa dernière éruption remonte à 1707, en pleine époque d’[[edo]].'
    },
    eaux: {
      name: 'Le Cœlacanthe', title: 'Le Fossile vivant', atk: 70, def: 96, esp: 92,
      bio: 'Poisson que l’on croyait disparu depuis 66 millions d’années, retrouvé vivant en 1938.',
      more: 'En décembre 1938, Marjorie Courtenay-Latimer, conservatrice d’un petit musée d’Afrique du Sud, remarque un poisson bleu étrange dans la pêche d’un chalutier. Le chercheur J. L. B. Smith reconnaît un cœlacanthe, connu seulement par des fossiles. Une seconde espèce fut découverte en Indonésie en 1998. C’est le rêve de tout cryptozoologue : un « monstre » qui existe vraiment.'
    },
    hommessauvages: {
      name: 'Le Gigantopithèque', title: 'Le Singe géant', atk: 96, def: 92, esp: 70,
      bio: 'Le plus grand singe ayant jamais existé : il approchait les trois mètres.',
      more: 'En 1935, le paléontologue Ralph von Koenigswald découvre chez un apothicaire de Hong Kong d’énormes molaires vendues comme « dents de dragon ». Elles appartenaient à un singe géant, qui vécut en Chine jusqu’il y a environ 300 000 ans. On ne le connaît que par ses dents et ses mâchoires ; certains y voient l’ancêtre rêvé du [[yeti]].'
    },
    betes: {
      name: 'La Bête du Gévaudan', title: 'La Terreur de la Margeride', atk: 94, def: 84, esp: 80,
      bio: 'Bête mystérieuse qui terrorisa le sud de la France de 1764 à 1767.',
      more: 'Dans le Gévaudan, l’actuelle Lozère, une bête attaqua près d’une centaine de personnes, surtout des enfants et des bergères. Louis XV envoya ses meilleurs chasseurs ; l’un d’eux abattit un grand loup en 1765, mais les attaques reprirent. En juin 1767, Jean Chastel tua un animal, et la terreur cessa. Loup, hybride ou plusieurs bêtes : on en débat encore.'
    },
    citesperdues: {
      name: 'Le Machu Picchu', title: 'La Cité des nuages', atk: 82, def: 98, esp: 94,
      bio: 'Citadelle inca perchée à 2 400 mètres dans les Andes.',
      more: 'Bâtie au XVe siècle pour l’empereur inca Pachacutec, elle fut abandonnée au moment de la conquête espagnole, et les conquistadors ne la trouvèrent jamais. Les paysans de la vallée la connaissaient, mais elle fut révélée au monde en 1911 par l’explorateur américain Hiram Bingham, guidé par eux. Ses pierres s’emboîtent si parfaitement qu’on ne peut y glisser une lame de couteau.'
    },
    enigmes: {
      name: 'Göbekli Tepe', title: 'Le Premier Temple', atk: 70, def: 99, esp: 96,
      bio: 'Sanctuaire de pierre bâti il y a plus de 11 000 ans, avant l’agriculture.',
      more: 'Sur une colline du sud-est de la Turquie, l’archéologue Klaus Schmidt a fouillé à partir de 1995 des cercles de piliers en T, sculptés de renards, de serpents et de vautours. Ils ont été dressés vers 9600 avant notre ère, six mille ans avant [[stonehenge]], par des chasseurs-cueilleurs qui ne connaissaient ni l’agriculture ni l’écriture. Cette découverte a bousculé l’histoire de la civilisation.'
    },
    tresors: {
      name: 'La Toison d’or', title: 'Le Trésor de Colchide', atk: 80, def: 90, esp: 96,
      bio: 'Toison d’un bélier ailé, but de l’expédition des Argonautes.',
      more: 'Pour reprendre son trône, [[heros:jason|Jason]] dut rapporter de Colchide, au bord de la mer Noire, la toison d’or d’un bélier divin, gardée par un dragon qui ne dormait jamais. Il y parvint avec les Argonautes et l’aide de la magicienne Médée. Des historiens rapprochent le mythe d’une vraie technique : dans le Caucase, on recueillait les paillettes d’or des rivières avec des peaux de mouton.'
    },
    dinosaures: {
      name: 'L’Archéoptéryx', title: 'Le Dinosaure à plumes', atk: 66, def: 70, esp: 96,
      bio: 'Le chaînon entre les dinosaures et les oiseaux.',
      more: 'Découvert en 1861 dans les calcaires de Solnhofen, en Bavière, deux ans après la publication de L’Origine des espèces de Darwin, il avait des plumes et des ailes, mais aussi des dents et une longue queue osseuse. Il a montré que les oiseaux descendent des dinosaures : en un sens, les dinosaures ne se sont jamais tout à fait éteints.'
    },
    mersciel: {
      name: 'L’Anomalocaris', title: 'La Crevette étrange', atk: 86, def: 72, esp: 80,
      bio: 'Le premier grand prédateur de l’histoire, il y a plus de 500 millions d’années.',
      more: 'Long d’environ un mètre, ce prédateur des mers du Cambrien saisissait ses proies avec deux appendices épineux. Ses fossiles, trouvés dans les schistes de Burgess, au Canada, ont d’abord été pris pour trois animaux différents : une crevette, une méduse et une éponge. Son nom signifie « crevette anormale ».'
    },
    megafaune: {
      name: 'Lucy', title: 'Notre lointaine ancêtre', atk: 60, def: 80, esp: 99,
      bio: 'Australopithèque vieille de 3,2 millions d’années, l’un des fossiles les plus célèbres au monde.',
      more: 'Le 24 novembre 1974, l’équipe de Donald Johanson et d’Yves Coppens découvre en Éthiopie le squelette d’une jeune australopithèque, complet à environ 40 %. Le soir même, une chanson des Beatles qui passait au campement lui donna son nom. En Éthiopie, on l’appelle Dinknesh, « tu es merveilleuse ». Elle marchait déjà debout.'
    },
    navires: {
      name: 'L’Hermione', title: 'La Frégate de la liberté', atk: 86, def: 84, esp: 94,
      bio: 'Frégate qui emmena La Fayette en Amérique en 1780.',
      more: 'En 1780, cette frégate française rapide transporte [[herosfr:lafayette|La Fayette]] jusqu’à Boston, avec une nouvelle décisive pour les insurgés américains : la France envoie une armée pour les soutenir. Une réplique fidèle, construite à Rochefort pendant dix-sept ans, a refait la traversée vers l’Amérique en 2015.'
    },
    maudits: {
      name: 'L’Erebus et le Terror', title: 'L’Expédition perdue', atk: 74, def: 92, esp: 90,
      bio: 'Les deux navires de l’expédition Franklin, disparus dans l’Arctique en 1845.',
      more: 'En 1845, l’explorateur John Franklin part chercher le passage du Nord-Ouest avec deux navires et 129 hommes. Aucun ne revint. Pendant plus d’un siècle et demi, on chercha les épaves. Grâce notamment aux témoignages transmis par les Inuits, elles furent enfin retrouvées en 2014 et 2016, dans les eaux glacées du Nunavut, au Canada.'
    },
    alchimistes: {
      name: 'Hermès Trismégiste', title: 'Le Trois Fois Grand', atk: 66, def: 90, esp: 99,
      bio: 'Sage légendaire, père de l’alchimie selon la tradition.',
      more: 'Ce personnage mythique est né de la fusion du dieu grec Hermès et du dieu égyptien [[egypte:thot|Thot]], tous deux maîtres du savoir. On lui attribuait des textes de sagesse et la Table d’émeraude, qui proclame : « ce qui est en bas est comme ce qui est en haut ». Les alchimistes du Moyen Âge en firent leur maître, et l’on parle encore d’un objet fermé « hermétiquement ».'
    },
    illusionnistes: {
      name: 'Le Turc mécanique', title: 'L’Automate joueur d’échecs', atk: 70, def: 88, esp: 99,
      bio: 'Automate qui battait aux échecs les plus grands de son temps.',
      more: 'Présenté en 1770 à l’impératrice Marie-Thérèse par Wolfgang von Kempelen, ce mannequin en costume oriental jouait aux échecs, et gagnait. Il affronta Benjamin Franklin et, dit-on, [[histoire:napoleon|Napoléon]]. Le secret : un maître d’échecs caché dans le meuble. L’automate fut détruit par un incendie à Philadelphie en 1854.'
    },
    celtes: {
      name: 'Balor', title: 'L’Œil qui tue', atk: 98, def: 86, esp: 70,
      bio: 'Roi des Fomoires, dont l’œil unique tuait tout ce qu’il regardait.',
      more: 'Sa paupière était si lourde qu’il fallait quatre hommes et un crochet pour la soulever. Une prophétie annonçait qu’il serait tué par son petit-fils : il enferma sa fille dans une tour, mais elle eut tout de même un enfant, [[lug]]. Lors de la grande bataille, Lug lança une pierre de fronde dans l’œil de Balor, qui ressortit par l’arrière de sa tête et foudroya sa propre armée.'
    },
    azteques: {
      name: 'Tenochtitlan', title: 'La Venise des Aztèques', atk: 80, def: 98, esp: 92,
      bio: 'Capitale aztèque bâtie sur un lac, l’une des plus grandes villes du monde.',
      more: 'Fondée vers 1325 sur une île du lac Texcoco, là où apparut le signe de [[huitzilopochtli]], elle comptait peut-être 200 000 habitants. Chaussées, canaux, jardins flottants et pyramides : les conquistadors crurent rêver en la découvrant. Elle tomba en 1521. Mexico a été bâtie sur ses ruines, dont on dégage encore des temples.'
    },
    chine: {
      name: 'Fenghuang', title: 'Le Phénix chinois', atk: 76, def: 88, esp: 99,
      bio: 'Oiseau merveilleux qui n’apparaît qu’en temps de paix.',
      more: 'Le fenghuang réunit les plus belles parties de nombreux oiseaux et porte les cinq couleurs. Il n’apparaît que sous le règne d’un souverain juste. Associé au dragon, symbole de l’empereur, il devint l’emblème des impératrices, brodé sur leurs robes et leurs coiffes.'
    },
    inde: {
      name: 'Vishnou', title: 'Le Protecteur du monde', atk: 90, def: 98, esp: 98,
      bio: 'Dieu qui préserve l’univers et descend sur terre sous de nombreuses formes.',
      more: 'Quand le monde est menacé, Vishnou s’incarne sur terre : on compte dix avatars principaux, dont [[rama]] et Krishna. Il repose entre deux créations sur un serpent géant, flottant sur l’océan cosmique, porté par [[garuda]] quand il voyage. Le grand temple d’Angkor Vat, au Cambodge, lui fut d’abord dédié.'
    },
    slaves: {
      name: 'Vassilissa', title: 'La Très-Belle', atk: 70, def: 84, esp: 96,
      bio: 'Jeune fille qui affronta Baba Yaga grâce à une poupée magique.',
      more: 'Avant de mourir, sa mère lui laissa une petite poupée qui la conseillait si on lui donnait à manger. Sa marâtre l’envoya chercher du feu chez [[babayaga]], espérant qu’elle n’en reviendrait jamais. Aidée par la poupée, Vassilissa accomplit toutes les tâches de la sorcière et rentra avec un crâne aux yeux brûlants, dont le regard réduisit en cendres sa méchante famille.'
    },
    afrique: {
      name: 'Mansa Moussa', title: 'L’Empereur d’or', atk: 82, def: 94, esp: 96,
      bio: 'Empereur du Mali, souvent présenté comme l’homme le plus riche de l’histoire.',
      more: 'Petit-neveu de [[soundiata]], il régna sur le Mali au XIVe siècle. En 1324, il fit le pèlerinage à La Mecque avec une suite immense et tant d’or qu’il en fit baisser le cours au Caire pendant des années. En 1375, l’Atlas catalan, l’une des plus belles cartes du Moyen Âge, le représente assis sur son trône, une pépite d’or à la main.'
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
      name: 'La Sainte Ampoule', title: 'L’Huile du sacre', atk: 50, def: 92, esp: 96,
      bio: 'Fiole d’huile sainte qui, selon la légende, fut apportée par une colombe pour le baptême de [[clovis]].',
      more: 'Elle servit pendant des siècles à sacrer les rois de France dans la cathédrale de Reims. Les révolutionnaires la brisèrent en 1793, mais un fragment conservé par un prêtre fut encore utilisé en 1825, pour le sacre de Charles X, le dernier roi sacré.'
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
