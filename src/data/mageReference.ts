import { SYSTEMS } from './systems';
import { ReferenceEntry } from '../types';

const MAGE = SYSTEMS.find((s) => s.id === 'mago')!;

export const TRADITIONS: ReferenceEntry[] = MAGE.factions;

export const SPHERES_REFERENCE: ReferenceEntry[] = [
  { name: 'Correspondência', description: 'Domina espaço e distância — teletransporte, sensoriamento remoto e a dobra do que separa um lugar do outro.' },
  { name: 'Entropia', description: 'Rege o acaso, a sorte e a decadência — desde azarar um inimigo até acelerar a entropia de um sistema inteiro.' },
  { name: 'Forças', description: 'Comanda energia bruta: fogo, eletricidade, luz, cinética. A Esfera mais direta para efeitos de combate.' },
  { name: 'Vida', description: 'Molda carne e biologia — cura, mutação, controle sobre o próprio corpo ou o de outra criatura viva.' },
  { name: 'Matéria', description: 'Transmuta e manipula substância inanimada, do metal à pedra, alterando ou criando objetos físicos.' },
  { name: 'Mente', description: 'Alcança pensamento e percepção alheios — telepatia, ilusões e a reescrita sutil do que alguém acredita ver.' },
  { name: 'Primo', description: 'Toca a energia mágica pura por trás da realidade — Quintessência e Paradoxo nascem e se dissolvem aqui.' },
  { name: 'Espírito', description: 'Abre a fronteira para a Umbra e seus habitantes, permitindo cruzar o Véu e negociar com espíritos.' },
  { name: 'Tempo', description: 'Manipula o fluxo temporal — visões do passado e futuro, além de acelerar ou retardar o presente.' },
];

export const ESSENCES: ReferenceEntry[] = [
  { name: 'Dinâmica', description: 'Avatares que florescem na mudança, no risco e na ruptura. Magos com essa natureza buscam revolução, não estabilidade.' },
  { name: 'Padrão', description: 'Avatares que buscam ordem, estrutura e permanência. Preferem consolidar e proteger o que já existe a arriscar tudo por mudança.' },
  { name: 'Primordial', description: 'Uma essência rara, ligada às eras mais antigas da realidade — magos assim carregam ecos de um tempo anterior ao Consenso atual.' },
  { name: 'Peregrina', description: 'Avatares movidos por uma busca incessante — verdade, redenção ou um destino que ainda não se revelou por completo.' },
];

export const ARETE_EXPLANATION =
  'Arete mede sua maestria sobre a magia e sua conexão com seu Avatar. Define o teto de qualquer Esfera que você possa desenvolver e quantos dados você soma ao lançar feitiços — quanto maior o Arete, mais fácil dobrar a realidade sem chamar a atenção do Paradoxo.';

export const PARADOX_EXPLANATION =
  'Paradoxo é a resposta da realidade consensual contra magia óbvia demais. Cada ato mágico ostensivo acumula pontos de Paradoxo; quando o acúmulo é grande o suficiente, ele explode de volta sobre o mago em forma de falhas, visões ou manifestações hostis — o preço de forçar o impossível diante de testemunhas.';
