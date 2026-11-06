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
          'Son père, le Titan Cronos, savait par une prophétie qu’un de ses fils le détrônerait, comme lui-même avait détrôné son propre père, Ouranos. Pour l’en empêcher, il avalait chacun de ses enfants dès leur naissance. Hestia, Déméter, [[hera]], [[hades]] et [[poseidon]] disparurent ainsi.',
          'Enceinte une sixième fois, leur mère Rhéa s’enfuit en Crète pour accoucher en secret. À Cronos, elle tendit une pierre emmaillotée qu’il avala sans méfiance. L’enfant grandit dans une grotte, nourri du lait de la chèvre Amalthée, tandis que les Courètes, des guerriers dansants, frappaient leurs boucliers pour couvrir ses pleurs. Une corne brisée de la chèvre devint la corne d’abondance.'
        ] },
        { t: 'La guerre contre les Titans', p: [
          'Devenu adulte, Zeus fit boire à Cronos un breuvage préparé avec l’aide de Métis, la Sagesse. Le Titan recracha d’abord la pierre, que Zeus planta à Delphes, puis tous ses enfants, vivants et devenus adultes.',
          'Commença alors la Titanomachie : dix ans de guerre entre les jeunes dieux, retranchés sur l’Olympe, et les Titans, installés sur le mont Othrys. Zeus libéra du Tartare les Cyclopes et les Hécatonchires, des géants aux cent bras. En remerciement, les Cyclopes forgèrent la foudre de Zeus, le trident de [[poseidon]] et le casque d’invisibilité d’[[hades]]. Les Titans vaincus furent enfermés dans le Tartare, et Atlas fut condamné à porter le ciel sur ses épaules.'
        ] },
        { t: 'Le partage du monde', p: [
          'Les trois frères tirèrent leur domaine au sort : le ciel revint à Zeus, la mer à [[poseidon]], le monde souterrain à [[hades]]. La terre et l’Olympe restèrent communs, mais c’est Zeus qui y régna, roi des dieux et des hommes.',
          'Son pouvoir fut encore défié. Gaïa, la Terre, furieuse du sort des Titans, lança contre lui les Géants puis Typhon, un monstre aux cent têtes de serpent. Contre les Géants, les dieux eurent besoin de l’aide d’un mortel : [[heracles]] combattit à leurs côtés. Typhon, lui, fut écrasé sous l’Etna, dont les éruptions seraient son souffle.'
        ] },
        { t: 'Épouses, amours et enfants', p: [
          'Sa première épouse fut Métis. Averti qu’elle lui donnerait un fils plus puissant que lui, Zeus l’avala. Peu après, saisi d’une terrible douleur à la tête, il se fit fendre le crâne d’un coup de hache : [[athena]] en jaillit, tout armée.',
          'Il s’unit ensuite à Thémis, mère des Saisons, à Mnémosyne, la Mémoire, qui lui donna les neuf Muses, et à Léto, mère d’[[apollon]] et d’[[artemis]]. Enfin, il épousa sa sœur [[hera]], qui devint reine des dieux et lui donna notamment Arès et Hébé.',
          'Ses amours avec des mortelles sont célèbres, et presque toujours déguisées : il séduisit Danaé en pluie d’or, Léda en cygne, Europe en taureau blanc. De ces unions naquirent des héros et des rois, comme Persée, Hélène ou Minos, et surtout [[heracles]], fils d’Alcmène, que la jalousie d’[[hera]] poursuivit toute sa vie.'
        ] },
        { t: 'Le gardien de l’ordre', p: [
          'Zeus n’est pas seulement le dieu de l’orage. Il garantit les serments, protège les suppliants et les étrangers, et punit ceux qui trahissent l’hospitalité. Le roi Lycaon, qui lui avait servi de la chair humaine, fut changé en loup.',
          'Quand le Titan Prométhée vola le feu pour l’offrir aux hommes, Zeus le fit enchaîner sur le Caucase, où un aigle venait chaque jour lui dévorer le foie. Aux hommes, il envoya Pandore et sa jarre de malheurs. Plus tard, lassé de leur violence, il les noya sous un déluge dont seuls Deucalion et Pyrrha réchappèrent.'
        ] },
        { t: 'Culte et héritage', p: [
          'Son plus grand sanctuaire était Olympie. Selon la tradition, les Jeux olympiques y furent célébrés en son honneur dès 776 av. J.-C. Son temple abritait une statue d’or et d’ivoire sculptée par Phidias, haute d’environ douze mètres, l’une des Sept Merveilles du monde. À Dodone, ses prêtres lisaient ses volontés dans le bruissement d’un chêne sacré.',
          'Les Romains l’identifièrent à Jupiter. La plus grande planète du système solaire porte ce nom, et ses quatre grandes lunes celui de figures qu’il aima : Io, Europe, Ganymède et Callisto.'
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
        parents: { label: 'Les Titans', a: { n: 'Cronos' }, b: { n: 'Rhéa' } },
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
        { n: 'Prométhée', rel: 'Rival', note: 'Puni pour avoir donné le feu aux hommes.' },
        { n: 'Typhon', rel: 'Ennemi', note: 'Dernier monstre lancé contre son règne.' }
      ]
    }
  };
  Object.keys(LORE).forEach(function (id) { if (A.CHAR[id]) A.CHAR[id].lore = LORE[id]; });
})(window.ATLAS);
