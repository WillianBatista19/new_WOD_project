import { ReferenceEntry } from '../types'

// W5 consolidated the classic 13 tribes into 6 — this list is deliberately different from
// systems.ts's lobisomem.factions, which lists the classic tribe roster for the general
// encyclopedia/lore pages. The sheet follows strict 5th Edition character creation rules.
export const TRIBES: ReferenceEntry[] = [
  { name: 'Storm Lords', description: 'Aristocratas da tempestade e da profecia. Creem que a liderança é um direito conquistado através da força de vontade e da visão espiritual.' },
  { name: 'Blood Talons', description: 'Guerreiros dedicados à arte da caça e do combate. Para eles, a batalha é sagrada e a Wyrm só recua diante de garras afiadas.' },
  { name: 'Bone Shadows', description: 'Xamãs da morte e da transformação. Servem como pontes entre os vivos, os mortos e os espíritos do além.' },
  { name: 'Hunters in Darkness', description: 'Guardiões dos últimos lugares selvagens. Protegem a natureza intocada com uma devoção quase religiosa.' },
  { name: 'Iron Masters', description: 'Garou adaptados à era industrial e digital. Acreditam que a tecnologia pode ser aliada de Gaia, não inimiga.' },
  { name: 'Ghost Wolves', description: 'Garou sem tribo, livres de tradições e políticas tribais — mas também sem a proteção e os recursos que uma tribo oferece.' },
]

export const AUSPICES: ReferenceEntry[] = [
  { name: 'Rahu (Lua Cheia)', description: 'Guerreiros natos, os primeiros a avançar na batalha. Especialidade em Renome: Glória.' },
  { name: 'Cahalith (Lua Gibosa)', description: 'Contadores de histórias e visionários carismáticos, lendários tanto em combate quanto em festa. Especialidade em Renome: Glória.' },
  { name: 'Elodoth (Lua Minguante)', description: 'Juízes e mediadores da lei Garou, árbitros de disputas entre alcateias. Especialidade em Renome: Honra.' },
  { name: 'Ithaeur (Lua Crescente)', description: 'Xamãs e místicos que caminham entre o mundo material e o espiritual. Especialidade em Renome: Sabedoria.' },
  { name: 'Irraka (Lua Nova)', description: 'Espiões e batedores natos, mestres da furtividade sob a lua ausente. Especialidade em Renome: Sabedoria.' },
]

export const RAGE_EXPLANATION =
  'Raiva (0 a 5) mede o quão perto o Garou está da fúria bestial. Pontos de Raiva podem ser gastos para ações extras, feitos de força sobre-humana ou ativar certos Dons — mas gastar Raiva empurra o Garou para mais perto do Frenesi, o estado de fúria descontrolada em que a Fera interior assume o controle.'

export const HARMONY_EXPLANATION =
  'Harmonia (0 a 10) mede o equilíbrio entre a natureza humana, lupina e espiritual do Garou. Ao contrário da Humanidade vampírica, Harmonia não mede pureza moral, mas sim o quão bem o Garou navega as três facetas de si mesmo sem que nenhuma domine as outras. Baixa Harmonia indica um Garou fragmentado, mais suscetível ao Frenesi e à Fera interior.'

export const FORMS_REFERENCE: ReferenceEntry[] = [
  { name: 'Hominídeo', description: 'Forma humana comum, indistinguível de um mortal. Sem modificadores de Atributos, essencial para se misturar entre humanos.' },
  { name: 'Glabro', description: 'Forma híbrida musculosa e ameaçadora. +2 Força, +1 Vigor, -1 Manipulação — o primeiro passo rumo à fúria.' },
  { name: 'Crinos', description: 'A forma de guerra lendária, um monstro de quase três metros. +4 Força, +3 Destreza, +3 Vigor, mas incapaz de falar com humanos — e causa Pavor Delirium a quem a vê.' },
  { name: 'Hispo', description: 'Lobo gigante e feroz, equilibrando força e velocidade. +3 Força, +2 Destreza, +2 Vigor — ideal para perseguições selvagens.' },
  { name: 'Lupus', description: 'Forma de lobo comum, perfeita para se mover despercebido pela natureza. +1 Destreza, +1 Vigor, -1 Manipulação, mas sentidos aguçados.' },
]
