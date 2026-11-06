/* ==========================================================================
   ATLAS — Chroniques des personnages (« Voir plus »)
   Pour chaque personnage : une introduction, des chapitres dans l’ordre du récit,
   des repères et ses liens avec les autres figures.
   [[slug]] ou [[slug|texte]] = lien vers un personnage de la même collection.
   Dans « arbre » et « autres » : c = slug d’un personnage de la collection (cliquable),
   n = nom d’une figure absente de la collection (texte simple).
   Un personnage sans chronique garde le paragraphe « Voir plus » de data.js.
   ========================================================================== */
(function (A) {
  var LORE = {
    'grece-zeus': {
      intro: 'Le plus puissant des dieux grecs n’a pas toujours régné. Son histoire commence par une fuite, continue par une guerre de dix ans et se termine sur un trône qu’il doit défendre sans cesse, contre les Titans, les monstres et parfois sa propre famille.',
      chapitres: [
        { t: 'Un enfant caché en Crète', p: [
          'Avant Zeus, le monde appartenait aux Titans, enfants d’Ouranos, le Ciel, et de Gaïa, la Terre. [[titans:cronos|Cronos]], le plus jeune d’entre eux, avait pris le pouvoir en mutilant son père d’un coup de faucille. Mais ses parents lui prédirent qu’à son tour il serait renversé par l’un de ses fils. Hanté par cette prophétie, il avala vivant chacun des enfants que lui donnait son épouse [[titans:rhea|Rhéa]] : Hestia, Déméter, [[hera]], [[hades]] et [[poseidon]].',
          'Lorsqu’elle attendit son sixième enfant, Rhéa refusa de le perdre. Elle partit accoucher en secret en Crète, puis tendit à Cronos une pierre emmaillotée dans des langes, qu’il avala sans se douter de rien. Le nouveau-né fut caché dans une grotte de la montagne, confié à des nymphes et nourri du lait de la chèvre Amalthée. Pour que ses pleurs n’arrivent pas jusqu’à son père, de jeunes guerriers, les Courètes, dansaient devant la grotte en frappant leurs boucliers.',
          'Ce récit explique pourquoi la Crète se disait le berceau du roi des dieux. Il raconte aussi l’origine de deux objets célèbres : selon la légende, une corne brisée d’Amalthée devint la corne d’abondance, et sa peau servit à fabriquer l’égide, le bouclier de Zeus.'
        ] },
        { t: 'La guerre contre les Titans', p: [
          'Devenu adulte, Zeus revint affronter son père. Avec l’aide de Métis, une déesse réputée pour sa sagesse, il lui fit boire un breuvage qui le força à rendre tout ce qu’il avait avalé. Sortit d’abord la pierre, que Zeus installa plus tard à Delphes, au « nombril du monde », puis ses frères et sœurs, intacts et devenus adultes. Les enfants de Cronos avaient désormais un chef.',
          'Commença alors la Titanomachie, une guerre de dix ans. Les jeunes dieux s’étaient retranchés sur le mont Olympe, les Titans sur le mont Othrys, et aucun camp ne parvenait à l’emporter. Sur le conseil de Gaïa, Zeus descendit dans le Tartare, le gouffre le plus profond du monde, pour libérer ceux que Cronos y tenait enfermés : les Cyclopes, forgerons à l’œil unique, et les Hécatonchires, géants aux cent bras comme [[geants:briaree|Briarée]].',
          'Ces alliés firent basculer la guerre. Les Cyclopes forgèrent pour Zeus la foudre, pour [[poseidon]] le trident et pour [[hades]] un casque qui rendait invisible. Les Hécatonchires écrasèrent l’ennemi sous des pluies de rochers. Vaincus, les Titans furent jetés à leur tour dans le Tartare, sous la garde de leurs anciens prisonniers. [[titans:atlas|Atlas]], l’un de leurs chefs, fut condamné à soutenir le ciel pour l’éternité.'
        ] },
        { t: 'Le partage du monde', p: [
          'Une fois la victoire acquise, il fallut répartir le pouvoir. Chez Homère, les trois frères tirent au sort : Zeus reçoit le ciel, [[poseidon]] la mer et [[hades]] le monde souterrain, tandis que la terre et l’Olympe restent communs. C’est pourtant Zeus que tous reconnaissent comme roi : il tranche les querelles des dieux, et même ses frères lui doivent obéissance.',
          'Ce pouvoir fut vite contesté. Gaïa, furieuse que ses enfants les Titans soient enfermés, souleva contre l’Olympe les Géants, nés de la Terre et menés par [[geants:porphyrion|Porphyrion]]. Un oracle avait annoncé que les dieux ne pourraient pas les vaincre sans l’aide d’un mortel. Zeus fit donc appel à son fils [[heracles]], dont les flèches achevèrent les Géants que les dieux avaient terrassés.',
          'La dernière menace fut la plus terrible. Gaïa donna naissance à Typhon, un monstre si grand que sa tête touchait les étoiles, avec cent têtes de serpent qui crachaient le feu. Plusieurs dieux s’enfuirent devant lui. Zeus l’affronta seul, le foudroya sans relâche et l’ensevelit sous l’Etna, en Sicile. Pour les Grecs, les éruptions du volcan étaient les soubresauts du monstre prisonnier.'
        ] },
        { t: 'Épouses, amours et enfants', p: [
          'Les unions de Zeus ne sont pas de simples aventures : elles organisent le monde. Sa première épouse, Métis, incarnait l’intelligence et la ruse. Quand il apprit qu’elle lui donnerait un fils capable de le détrôner, Zeus l’avala, et s’appropria du même coup sa sagesse. Plus tard, pris d’un mal de tête insupportable, il se fit fendre le crâne d’un coup de hache : [[athena]] en sortit, adulte et en armes.',
          'Ses épouses suivantes lui donnèrent les puissances qui règlent l’univers. Avec [[titans:themis|Thémis]], la Justice, il eut les Heures, qui veillent sur les saisons, et les Moires, qui filent le destin de chacun. Avec [[titans:mnemosyne|Mnémosyne]], la Mémoire, il eut les neuf Muses, qui inspirent les arts. Avec Léto, les jumeaux [[apollon]] et [[artemis]]. Enfin, il épousa sa sœur [[hera]], qui devint reine de l’Olympe et lui donna Arès, Hébé et Ilithyie.',
          'Zeus s’unit aussi à de nombreuses mortelles, souvent sous une forme trompeuse : une pluie d’or pour entrer dans la prison de Danaé, un cygne pour approcher Léda, un taureau blanc pour enlever Europe. Ces récits permettaient aux grandes familles grecques de se donner un ancêtre divin. Ils expliquent aussi la colère d’[[hera]], qui s’acharna sur ces femmes et sur leurs enfants, à commencer par [[heracles]].'
        ] },
        { t: 'Le gardien de l’ordre', p: [
          'Plus qu’un dieu de l’orage, Zeus est le garant de l’ordre du monde. On l’invoquait sous de nombreux surnoms : Zeus Xénios protège les étrangers et les hôtes, Zeus Horkios veille sur les serments, Zeus Hikésios défend ceux qui viennent implorer de l’aide. Accueillir un voyageur, tenir parole, épargner celui qui demande grâce : tout cela se faisait sous son regard.',
          'Ceux qui bafouent ces lois sont punis. Lycaon, roi d’Arcadie, voulut vérifier si son invité était vraiment un dieu et lui servit de la chair humaine : Zeus le changea en loup. Le Titan [[titans:promethee|Prométhée]], qui avait volé le feu de l’Olympe pour l’offrir aux hommes, fut enchaîné à un rocher du Caucase. Chaque jour, un aigle venait lui dévorer le foie, qui repoussait pendant la nuit.',
          'Les hommes eux-mêmes n’échappèrent pas à sa justice. Pour leur faire payer le vol du feu, Zeus leur envoya Pandore, la première femme, dont la jarre libéra tous les malheurs du monde. Plus tard, lassé de leur violence, il les noya sous un déluge. Seuls survécurent Deucalion, fils de Prométhée, et son épouse Pyrrha, qui repeuplèrent la terre en jetant des pierres derrière eux.'
        ] },
        { t: 'Culte et héritage', p: [
          'Zeus était vénéré dans tout le monde grec, mais son grand sanctuaire se trouvait à Olympie, dans le Péloponnèse. Selon la tradition, les premiers Jeux olympiques y furent organisés en 776 av. J.-C. Tous les quatre ans, une trêve sacrée suspendait les guerres pour que les athlètes de toutes les cités puissent venir concourir en son honneur.',
          'Au Ve siècle av. J.-C., le sculpteur Phidias réalisa pour son temple une statue d’or et d’ivoire d’environ douze mètres de haut, qui montrait le dieu assis sur son trône. Elle fut comptée parmi les Sept Merveilles du monde. Plus au nord, à Dodone, se trouvait son plus ancien oracle : les prêtres y lisaient ses volontés dans le bruissement des feuilles d’un chêne sacré.',
          'Les Romains l’identifièrent à leur propre roi des dieux, Jupiter, et c’est sous ce nom qu’il a traversé les siècles. Les astronomes l’ont donné à la plus grande planète du système solaire, et ont baptisé ses quatre grandes lunes d’après des figures qu’il aima : Io, Europe, Ganymède et Callisto.'
        ] }
      ],
      reperes: [
        ['Domaine', 'Le ciel, la foudre, l’ordre du monde'],
        ['Symboles', 'Foudre, aigle, chêne, sceptre'],
        ['Demeure', 'Le mont Olympe'],
        ['Sanctuaires', 'Olympie, Dodone'],
        ['Chez les Romains', 'Jupiter'],
        ['À lire', 'Hésiode, Théogonie · Homère, Iliade · Ovide, Métamorphoses']
      ],
      // Arbre : parents, fratrie (le personnage y est mis en avant), enfants regroupés par mère
      arbre: {
        parents: { label: 'Les Titans', a: { c: 'titans:cronos' }, b: { c: 'titans:rhea' } },
        fratrie: [{ n: 'Hestia' }, { n: 'Déméter' }, { c: 'hades' }, { c: 'poseidon' }, { c: 'hera', tag: 'et épouse' }],
        enfants: [
          { mere: { c: 'hera' }, enf: [{ n: 'Arès' }, { n: 'Hébé' }] },
          { mere: { n: 'Métis' }, enf: [{ c: 'athena' }] },
          { mere: { n: 'Léto' }, enf: [{ c: 'apollon' }, { c: 'artemis' }] },
          { mere: { n: 'Maïa' }, enf: [{ n: 'Hermès' }] },
          { mere: { n: 'Alcmène' }, mortelle: true, enf: [{ c: 'heracles' }] },
          { mere: { n: 'Sémélé' }, mortelle: true, enf: [{ n: 'Dionysos' }] },
          { mere: { n: 'Danaé' }, mortelle: true, enf: [{ n: 'Persée' }] }
        ]
      },
      autres: [
        { c: 'meduse', rel: 'Victime de son fils', note: 'Persée la décapita ; sa tête orne l’égide d’Athéna.' },
        { c: 'titans:promethee', rel: 'Rival', note: 'Puni pour avoir donné le feu aux hommes.' },
        { n: 'Typhon', rel: 'Ennemi', note: 'Dernier monstre lancé contre son règne.' }
      ]
    }
  };
  Object.keys(LORE).forEach(function (id) { if (A.CHAR[id]) A.CHAR[id].lore = LORE[id]; });
})(window.ATLAS);
