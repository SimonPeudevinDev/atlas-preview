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
      name: 'Prométhée', title: 'Le Voleur de feu', atk: 74, def: 80, esp: 98,
      bio: 'Titan qui prit le parti des hommes : il déroba le feu de l’Olympe pour le leur offrir, et [[zeus]] le fit enchaîner sur le Caucase.',
      more: 'Son nom signifie « celui qui réfléchit avant ». On lui attribue la création des premiers hommes, façonnés dans l’argile. Lors du premier sacrifice, il trompa [[zeus]] en lui laissant les os enrobés de graisse et la viande aux hommes. Des siècles plus tard, [[heracles]] abattit l’aigle qui le torturait et le libéra.'
    },
    egypte: {
      name: 'Apophis', title: 'Le Serpent du chaos', atk: 94, def: 82, esp: 70,
      bio: 'Immense serpent des ténèbres, il attaque chaque nuit la barque de [[ra]] pour empêcher le soleil de se lever.',
      more: 'On ne le vénérait pas, on le combattait : les prêtres récitaient des formules contre lui et brûlaient des figurines à son image. Selon les récits, le dieu Seth, debout à la proue de la barque solaire, le repousse chaque nuit. Si Apophis l’emportait un jour, le monde retournerait au chaos des origines.'
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
      name: 'Ymir', title: 'Le Géant primordial', atk: 96, def: 90, esp: 60,
      bio: 'Premier des géants, né de la rencontre de la glace et du feu, il fut tué par [[odin]] et ses frères, qui façonnèrent le monde à partir de son corps.',
      more: 'Sa chair devint la terre, son sang les mers, ses os les montagnes, et son crâne la voûte du ciel, soutenue par quatre nains. Ses sourcils servirent à bâtir Midgard, le monde des hommes. Au commencement, il fut nourri par la vache Audhumla.'
    }
  };
})(window.ATLAS);
