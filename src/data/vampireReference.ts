import { SYSTEMS } from './systems'
import { ReferenceEntry } from '../types'

const VAMPIRE = SYSTEMS.find((s) => s.id === 'vampiro')!

export const CLANS: ReferenceEntry[] = VAMPIRE.factions

export const DISCIPLINES_REFERENCE: ReferenceEntry[] = [
  { name: 'Animalismo', description: 'Comando sobre bestas e a Besta interior — acalmar animais, sentir emoções e, nos níveis mais altos, comandar outros Kindred pelo sangue.' },
  { name: 'Auspício', description: 'Sentidos sobrenaturais aguçados: aura-lê emoções, telepatia e presciência. A Disciplina do observador que nada deixa passar.' },
  { name: 'Celeridade', description: 'Velocidade sobrenatural — ações extras, reflexos impossíveis e a capacidade de se mover mais rápido do que o olho humano acompanha.' },
  { name: 'Dominação', description: 'Domina a vontade alheia com uma palavra ou um olhar. Comandos, memórias apagadas e submissão completa para quem encara os olhos de um Kindred.' },
  { name: 'Fortitude', description: 'Resistência sobrenatural do corpo-morto — ignora ferimentos, sobrevive ao fogo e ao sol por mais tempo do que deveria ser possível.' },
  { name: 'Ofuscação', description: 'Manto de invisibilidade e disfarce — passar despercebido, se disfarçar como outra pessoa ou desaparecer completamente da percepção alheia.' },
  { name: 'Potência', description: 'Força bruta sobrenatural — socos que atravessam concreto, saltos impossíveis e a força para arrancar portas de blindados.' },
  { name: 'Presença', description: 'Carisma amplificado ao sobrenatural — atrai, apavora ou fascina qualquer um que esteja por perto, dobrando emoções à vontade do Kindred.' },
  { name: 'Proteanismo', description: 'Transformação do próprio corpo — garras, forma de morcego ou lobo, dissolução em névoa. A Disciplina mais próxima da bestialidade ancestral.' },
  { name: 'Feitiçaria de Sangue', description: 'Ritualismo e magia de sangue dos Tremere — rituais, thaumaturgia e o controle alquímico da própria Vitae e da alheia.' },
]

export const HUNGER_EXPLANATION =
  'Fome (0 a 5) substitui a antiga reserva de sangue e mede o quão perto você está da inanição. Em vez de rolar dados normais, uma quantidade de dados igual à sua Fome vira "dados de Fome": em falhas, eles trazem complicações da Besta; em sucessos críticos formados só por dados de Fome, você pode entrar em Frenesi de Fome. Fome 5 é jejum absoluto — a Besta está no controle e um Torpor forçado é iminente até você se alimentar.'

export const BLOOD_POTENCY_EXPLANATION =
  'Potência de Sangue (1 a 10) mede a força e a idade da sua Vitae. Quanto maior, mais poderosas suas Disciplinas e menos você precisa se alimentar — mas também mais dados de Fome entram em suas rolagens, mais difícil fica se alimentar de sangue fraco, e mais distante você fica da humanidade que restou.'

export const HUMANITY_EXPLANATION =
  'Humanidade (0 a 10) é sua última âncora ao que você foi em vida — empatia, remorso, a capacidade de conviver entre mortais sem se trair. Cai a cada atrocidade cometida ou Falha Moral sofrida. Quando chega a zero, a Besta finalmente vence: o que resta já não é mais uma pessoa.'
