/* ==========================================================================
   ATLAS — Missions de collection
   --------------------------------------------------------------------------
   Chaque collection propose des missions qui lui sont propres :
   · missions thématiques (ci-dessous) : réunir des personnages liés par une
     histoire — les trois frères de l’Olympe, la famille de Loki, l’équipage
     de l’Île au trésor… Un personnage d’une autre collection s’écrit
     « collection:slug ». Récompense : 150 Éclats par personnage, un booster
     à partir de quatre.
   · missions de chasse (store.js → huntsFor) : une rareté à trouver, trois
     éditions d’un même personnage, des exemplaires numérotés… tirées selon
     la collection, pour que deux collections n’aient pas les mêmes.
   ========================================================================== */
(function (A) {
  'use strict';
  // [id, titre, description, personnages]
  var M = {
    grece: [['freres', 'Le partage du monde', 'Les trois frères qui se partagèrent le ciel, la mer et les Enfers.', ['zeus', 'poseidon', 'hades']],
            ['delos', 'Les jumeaux de Délos', 'Apollon et sa sœur Artémis, nés sur l’île de Délos.', ['apollon', 'artemis']]],
    heros: [['argo', 'L’équipage de l’Argo', 'Trois héros embarqués dans la quête de la Toison d’or.', ['jason', 'heracles', 'orphee']]],
    monstres: [['gardiens', 'Les gardiens', 'Ceux qui gardaient un labyrinthe, une ville ou les portes des Enfers.', ['minotaure', 'sphinx', 'cerbere']]],
    titans: [['japet', 'Les fils de Japet', 'Un père et ses deux fils : celui qui porte le ciel et celui qui vola le feu.', ['japet', 'atlas', 'promethee']]],
    geants: [['gigantomachie', 'La Gigantomachie', 'Les géants qui défièrent les dieux de l’Olympe.', ['alcyonee', 'porphyrion', 'encelade']]],
    egypte: [['osiris', 'La famille d’Osiris', 'Le roi assassiné, l’épouse fidèle et le fils vengeur.', ['osiris', 'isis', 'horus']]],
    pharaons: [['amarna', 'La révolution d’Amarna', 'Le pharaon qui imposa un dieu unique, son épouse et son héritier.', ['akhenaton', 'nefertiti', 'toutankhamon']]],
    planetes: [['telluriques', 'Les planètes rocheuses', 'Les quatre planètes les plus proches du Soleil.', ['mercure', 'venus', 'terre', 'mars']],
               ['geantes', 'Les géantes gazeuses', 'Les deux plus grandes planètes du Système solaire.', ['jupiter', 'saturne']]],
    lunes: [['galilee', 'Les lunes de Galilée', 'Trois des quatre lunes de Jupiter découvertes par Galilée en 1610.', ['io', 'europe', 'ganymede']]],
    astronautes: [['lune', 'Premiers pas sur la Lune', 'L’équipage qui posa le pied sur la Lune en 1969.', ['armstrong', 'aldrin']],
                  ['pionniers', 'Les pionniers soviétiques', 'Premier homme, première femme et première sortie dans l’espace.', ['gagarine', 'terechkova', 'leonov']]],
    missions: [['telescopes', 'Les yeux du ciel', 'Les deux grands télescopes spatiaux.', ['hubble', 'webb']]],
    cosmos: [['trousnoirs', 'Les trous noirs', 'Trois monstres de gravité, du centre de notre galaxie aux confins de l’univers.', ['sgra', 'm87', 'ton618']]],
    detectives: [['baker', '221B Baker Street', 'Le détective, son fidèle ami et l’inspecteur de Scotland Yard.', ['holmes', 'watson', 'lestrade']],
                 ['paris', 'Les enquêteurs de Paris', 'Le premier détective de la littérature, le reporter et le gentleman cambrioleur.', ['dupin', 'rouletabille', 'lupin']]],
    verne: [['tourdumonde', 'Le Tour du monde en 80 jours', 'Le gentleman et son valet, lancés autour du globe.', ['fogg', 'passepartout']]],
    mousquetaires: [['unpourtous', 'Un pour tous', 'Les trois mousquetaires et le jeune Gascon.', ['athos', 'porthos', 'aramis', 'dartagnan']]],
    nuits: [['lampe', 'La lampe merveilleuse', 'Le jeune homme et le génie de la lampe.', ['aladdin', 'genie']],
            ['sesame', 'Sésame, ouvre-toi', 'Le bûcheron et la servante qui déjoua les quarante voleurs.', ['alibaba', 'morgiane']]],
    merveilleux: [['briquejaune', 'La route de brique jaune', 'Dorothy et ses trois compagnons en route vers la Cité d’émeraude.', ['dorothy', 'epouvantail', 'ferblanc', 'lion']]],
    jungle: [['maitres', 'Les maîtres de Mowgli', 'L’ours, la panthère et le chef de la meute qui élevèrent le petit d’homme.', ['baloo', 'bagheera', 'akela']]],
    arthur: [['tableronde', 'La Table ronde', 'Le roi et deux de ses plus célèbres chevaliers.', ['arthur', 'lancelot', 'perceval']]],
    robin: [['compagnons', 'Les Joyeux Compagnons', 'Le hors-la-loi de Sherwood et ses plus fidèles amis.', ['robin', 'petitjean', 'tuck']]],
    etranges: [['ocean', 'Les monstres de l’océan', 'La baleine blanche, le calmar géant et le vaisseau fantôme.', ['mobydick', 'kraken', 'hollandais']]],
    flibustiers: [['reines', 'Les reines pirates', 'Trois femmes qui commandèrent sur les mers.', ['bonny', 'read', 'omalley']]],
    forbans: [['ile', 'L’Île au trésor', 'Le cuisinier, le mousse, le capitaine du trésor et le naufragé.', ['silver', 'jim', 'flint', 'bengunn']]],
    nordique: [['enfants', 'Les fils d’Odin', 'Le dieu du tonnerre et le dieu lumineux.', ['thor', 'baldr']],
               ['vanes', 'Les Vanes', 'Le frère et la sœur venus de Vanaheim.', ['freyr', 'freyja']]],
    creatures: [['loups', 'Les loups du Ragnarök', 'Le loup géant et le chien des Enfers, déchaînés à la fin du monde.', ['fenrir', 'garm']],
                ['yggdrasil', 'Les hôtes d’Yggdrasil', 'Le dragon des racines et l’écureuil messager.', ['nidhogg', 'ratatosk']]],
    jotnar: [['loki', 'La famille de Loki', 'Loki, la géante Angrboda et leurs trois terribles enfants.', ['nordique:loki', 'angrboda', 'hel', 'creatures:fenrir', 'creatures:jormungandr']]],
    mondes: [['feuglace', 'Le feu et la glace', 'Les deux mondes primordiaux dont naquit l’univers.', ['muspellheim', 'niflheim']]],
    presidents: [['cinquieme', 'La Ve République', 'Les présidents de la Ve République, de son fondateur à la fin du XXe siècle.', ['degaulle', 'pompidou', 'giscard', 'mitterrand']]],
    herosfr: [['resistance', 'La Résistance', 'Trois figures du combat contre l’occupant.', ['moulin', 'baker', 'aubrac']]],
    savants: [['revolution', 'Révolutions scientifiques', 'La chimie moderne, les vaccins et la radioactivité.', ['lavoisier', 'pasteur', 'curie']]],
    ecrivains: [['xixe', 'Les géants du XIXe siècle', 'Quatre écrivains qui firent du XIXe siècle un âge d’or du roman.', ['hugo', 'dumas', 'sand', 'zola']]],
    kami: [['izanagi', 'Les enfants d’Izanagi', 'Le soleil, la lune et la tempête, nés de la purification de leur père.', ['amaterasu', 'tsukuyomi', 'susanoo']],
           ['orage', 'Le vent et le tonnerre', 'Le duo qui garde l’entrée des temples.', ['raijin', 'fujin']]],
    yokai: [['metamorphes', 'Les métamorphes', 'Le renard et le chien viverrin, maîtres des déguisements.', ['kitsune', 'tanuki']]],
    samourais: [['unificateurs', 'Les trois unificateurs', 'Ceux qui réunifièrent le Japon à la fin des guerres civiles.', ['nobunaga', 'hideyoshi', 'ieyasu']],
                ['rivaux', 'Les rivaux de Kawanakajima', 'Le Tigre de Kai et le Dragon d’Echigo.', ['shingen', 'kenshin']]],
    epoques: [['shoguns', 'Le temps des shōguns', 'Trois époques de gouvernement militaire.', ['kamakura', 'muromachi', 'edo']]],
    gothique: [['double', 'Le double visage', 'Le docteur et sa part d’ombre.', ['jekyll', 'hyde']],
               ['nuit', 'Les créatures de la nuit', 'Les vampires et le loup-garou.', ['dracula', 'carmilla', 'loupgarou']]],
    contes: [['perrault', 'Les contes de Perrault', 'Quatre héros des Contes de ma mère l’Oye.', ['cendrillon', 'chaperon', 'chatbotte', 'barbebleue']],
             ['chaperon', 'Le Petit Chaperon rouge', 'La fillette et le loup.', ['chaperon', 'loup']]],
    histoire: [['empereurs', 'Les empereurs', 'Deux souverains couronnés empereurs.', ['charlemagne', 'napoleon']],
               ['origines', 'Aux origines', 'Le chef gaulois et le premier roi des Francs.', ['vercingetorix', 'clovis']]],
    eaux: [['lacs', 'Les lacs hantés', 'Trois monstres de lac, d’Écosse à l’Amérique du Nord.', ['nessie', 'ogopogo', 'champ']]],
    hommessauvages: [['geants', 'Les géants velus', 'L’homme des neiges, le géant des forêts et son cousin australien.', ['yeti', 'bigfoot', 'yowie']]],
    betes: [['farces', 'Les belles farces', 'Le dahu des Alpes et le lièvre cornu du Wyoming.', ['dahu', 'jackalope']]],
    citesperdues: [['englouties', 'Les cités englouties', 'L’île de Platon et la ville du roi Gradlon.', ['atlantide', 'ys']]],
    enigmes: [['pierres', 'Les pierres dressées', 'Trois énigmes de pierre, de l’Angleterre au Pacifique.', ['stonehenge', 'carnac', 'paques']]],
    tresors: [['sacres', 'Les trésors sacrés', 'La coupe des chevaliers et le coffre du Temple.', ['graal', 'arche']]],
    dinosaures: [['duel', 'Le duel du Crétacé', 'Le prédateur et l’herbivore cornu, retrouvés avec des traces de combat.', ['trex', 'triceratops']],
                 ['predateurs', 'Les grands prédateurs', 'Trois chasseurs, du géant à voile au petit raptor.', ['trex', 'spinosaure', 'velociraptor']]],
    mersciel: [['anning', 'Les trouvailles de Mary Anning', 'Deux reptiles marins découverts par la paléontologue de Lyme Regis.', ['plesiosaure', 'ichtyosaure']],
               ['ciel', 'Les maîtres du ciel', 'Les deux grands ptérosaures.', ['pteranodon', 'quetzalcoatlus']]],
    megafaune: [['chauvet', 'Le bestiaire de Chauvet', 'Des animaux que les artistes de la préhistoire ont vus et peints.', ['mammouth', 'rhinolaineux', 'ourscavernes']]],
    navires: [['voyages', 'Les grands voyages', 'La traversée de Colomb, le premier tour du monde et l’exploration du Pacifique.', ['santamaria', 'victoria', 'endeavour']]],
    maudits: [['fantomes', 'Les vaisseaux fantômes', 'Quatre navires qui naviguent sans équipage, dans l’histoire ou la légende.', ['marieceleste', 'baychimo', 'caleuche', 'etranges:hollandais']]],
    alchimistes: [['prophetes', 'Lire l’avenir', 'Le prophète de Provence et le mage de la reine.', ['nostradamus', 'dee']]],
    illusionnistes: [['heritage', 'L’héritage de Robert-Houdin', 'Le maître, celui qui prit son nom et celui qui racheta son théâtre.', ['roberthoudin', 'houdini', 'melies']]],
    celtes: [['tuatha', 'Les Tuatha Dé Danann', 'Trois divinités du peuple divin d’Irlande.', ['lug', 'dagda', 'brigid']],
             ['heros', 'Les héros d’Irlande', 'Le chien de Culann et le chef des Fianna.', ['cuchulainn', 'fionn']]],
    azteques: [['templo', 'Le Templo Mayor', 'Les deux dieux qui partageaient le sommet de la grande pyramide.', ['huitzilopochtli', 'tlaloc']],
               ['rivaux', 'Les frères ennemis', 'Le serpent à plumes et le miroir fumant.', ['quetzalcoatl', 'tezcatlipoca']]],
    chine: [['lune', 'La légende de la Lune', 'L’archer aux soleils et son épouse envolée.', ['houyi', 'change']],
            ['singe', 'Le bâton du Roi Singe', 'Le singe et le roi dragon à qui il prit son arme.', ['sunwukong', 'longwang']]],
    inde: [['ramayana', 'Le Ramayana', 'Le prince, son fidèle allié et le roi aux dix têtes.', ['rama', 'hanuman', 'ravana']]],
    slaves: [['tsar', 'Les contes du tsar', 'Le sorcier immortel, l’oiseau de feu et la sorcière de la forêt.', ['koschei', 'oiseaudefeu', 'babayaga']]],
    afrique: [['eaux', 'Les esprits des eaux', 'La mère des eaux, le dieu du Zambèze et le dragon des marais.', ['mamiwata', 'nyaminyami', 'ninkinanka']]]
  };
  A.MISSIONS = {};
  Object.keys(M).forEach(function (cid) {
    A.MISSIONS[cid] = M[cid].map(function (m) {
      var chars = m[3].map(function (s) { return s.indexOf(':') !== -1 ? s.replace(':', '-') : cid + '-' + s; });
      return { id: m[0], label: m[1], desc: m[2], chars: chars,
        reward: chars.length >= 4 ? { booster: 'standard', eclats: 200 } : { eclats: 150 * chars.length } };
    });
  });
})(window.ATLAS);
