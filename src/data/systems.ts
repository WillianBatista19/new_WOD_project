import { GameSystem } from '../types';

export const SYSTEMS: GameSystem[] = [
  {
    id: 'vampiro',
    name: 'Vampiro: A Máscara',
    subtitle: 'Vampire: The Masquerade',
    tagline: 'A Máscara esconde mais do que um rosto',
    description:
      'Predadores eternos mascarados de humanos. Nas cidades da noite, os Kindred travam guerras silenciosas de poder e traição enquanto lutam contra a Besta interior que ameaça consumir tudo que ainda resta de sua humanidade.',
    longDescription:
      'Em Vampiro: A Máscara (5ª Edição), você interpreta um Kindred — um morto-vivo que acorda toda noite com fome, política e séculos de rancor acumulado. A 5ª edição abraça o horror pessoal: sua Humanidade sangra lentamente enquanto você faz escolhas impossíveis. A Camarilla e os Anarquistas disputam o controle das cidades, a Segunda Inquisição caça vampiros nas sombras digitais, e a Besta dentro de você nunca dorme. Cada sessão é um teste: o quanto você sacrifica para sobreviver — e o que sobra de você quando a noite termina?',
    color: '#c41e3a',
    colorSecondary: '#6b0f1a',
    colorGlow: 'rgba(196,30,58,0.4)',
    icon: '🩸',
    uniqueStat: {
      name: 'Humanidade',
      description:
        'Sua última âncora para o que você foi em vida. Perde-se a cada atrocidade cometida, e com ela vão os instintos humanos — até que a Besta ocupe tudo.',
    },
    factions: [
      { name: 'Brujah', description: 'Rebeldes apaixonados e filósofos raivosos. Carregam a chama da revolução e a maldição da fúria instantânea.' },
      { name: 'Gangrel', description: 'Andarilhos selvagens que refletem a natureza bestial da condição Kindred mais que qualquer outro Clã.' },
      { name: 'Malkavian', description: 'Amaldiçoados com loucura profética. Seus delírios às vezes revelam verdades que os sãos jamais enxergariam.' },
      { name: 'Nosferatu', description: 'Monstruosidades obrigadas a viver nas sombras. Mestres em obter segredos que valem mais que sangue.' },
      { name: 'Toreador', description: 'Estetas obcecados pela beleza humana. Congelados no momento de maior glória — ou maior decadência.' },
      { name: 'Tremere', description: 'Magos que venderam a alma por sangue eterno. Constroem pirâmides de lealdade e segredos alquímicos.' },
      { name: 'Ventrue', description: 'Aristocratas do Requiem. Dominam, controlam, mandam — e raramente sujam as próprias mãos.' },
      { name: 'Lasombra', description: 'Senhores das sombras e da ambição. Recentemente admitidos na Camarilla, trazem consigo séculos de intriga e nobreza corrompida.' },
      { name: 'Banu Haqim', description: 'Juízes e assassinos de tradição secular. Sua sede não é apenas por sangue, mas por justiça — ou o que definem como tal.' },
      { name: 'Ministry', description: 'Sedutores que pregam a libertação dos tabus. Servem a um propósito mais sombrio por trás da máscara da liberação.' },
    ],
    steps: [
      { title: 'Escolha seu Clã', desc: 'Seu Clã define suas Disciplinas inatas, seus vícios e sua posição nas noites eternas.' },
      { title: 'Defina o Conceito', desc: 'Quem você era em vida? A Abraçada molda o vampiro, mas a vida moldou a pessoa que morreu.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em ordem de prioridade (4/3/2 pontos por grupo).' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos distribuídos em três grupos de prioridade (11/7/4).' },
      { title: 'Escolha Disciplinas', desc: 'Três pontos em Disciplinas — poderes do sangue únicos de cada Clã.' },
      { title: 'Defina Backgrounds', desc: 'Recursos, Aliados, Domínio: o que te conecta ao mundo e o que você tem a perder.' },
      { title: 'Ajuste Humanidade', desc: 'Comece com Humanidade 7. Cada escolha daqui em diante pode fazer esse número cair.' },
    ],
  },
  {
    id: 'lobisomem',
    name: 'Lobisomem: O Apocalipse',
    subtitle: 'Werewolf: The Apocalypse',
    tagline: 'Entre homem e espírito, a raiva que salva — ou destrói',
    description:
      'Guerreiros sagrados de Gaia dilacerados entre o humano e o bestial. Os Garou carregam a Raiva do mundo como arma e fardo, lutando uma guerra que pode já estar perdida enquanto o Apocalipse se aproxima.',
    longDescription:
      'Em Lobisomem: O Apocalipse (5ª Edição), você interpreta um Garou — um guerreiro-espírito nascido do cruzamento entre lobisomem e humano ou lobo. Você existe para proteger Gaia, a Terra-Mãe, da corrupção da Wyrm. Mas a Raiva que te faz poderoso é a mesma que destrói o que você ama. O Umbra, o mundo espiritual paralelo, chama. Os Padrões de Corrupção se espalham. E os outros Garou nem sempre são aliados. Cada sessão é uma escolha entre a fúria que salva e a fúria que condena.',
    color: '#4caf50',
    colorSecondary: '#1a3a1a',
    colorGlow: 'rgba(76,175,80,0.4)',
    icon: '🐺',
    uniqueStat: {
      name: 'Raiva',
      description:
        'A fúria sagrada de Gaia fluindo em suas veias. É o combustível para lutar — e o veneno que pode destruir tudo que você protege se não a controlar.',
    },
    factions: [
      { name: 'Filhos de Gaia', description: 'Pacifistas entre guerreiros. Buscam harmonia onde outros veem apenas conflito — e pagam o preço por isso.' },
      { name: 'Bone Gnawers', description: 'Sobreviventes das cidades esquecidas. Desprezados pelos outros Garou, conhecem as ruas melhor que qualquer tribo.' },
      { name: 'Get of Fenris', description: 'Guerreiros nórdicos implacáveis. Valorizam a força acima de tudo e raramente recuam de qualquer batalha.' },
      { name: 'Black Furies', description: 'Protetoras furiosas da feminilidade e da natureza. Sua ira contra os opressores é lendária e justificada.' },
      { name: 'Glass Walkers', description: 'Adaptados à era tecnológica. Enquanto outros Garou fogem das cidades, eles as dominam.' },
      { name: 'Red Talons', description: 'Lobos puros que odeiam a humanidade. Para eles, a solução para a crise de Gaia tem nome: extinção humana.' },
      { name: 'Shadow Lords', description: 'Maquiavélicos e ambiciosos. Manipulam política Garou com maestria e creem que a liderança deve ser conquistada, não herdada.' },
      { name: 'Silver Fangs', description: 'A linhagem real dos Garou, marcada pela loucura hereditária. Lideram — mas cada geração paga um preço diferente.' },
    ],
    steps: [
      { title: 'Escolha sua Tribo', desc: 'Sua Tribo define seus Dons iniciais, sua cultura e seu papel na guerra de Gaia.' },
      { title: 'Defina sua Alcunha', desc: 'Seu nome Garou reflete seu caráter. Conquistado em batalha ou ritual, ele te seguirá para sempre.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em ordem de prioridade (7/5/3 pontos — Garou são mais poderosos que vampiros).' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos distribuídos por prioridade (13/9/5).' },
      { title: 'Escolha Dons', desc: 'Poderes espirituais concedidos por espíritos aliados. Sua Tribo define quais estão disponíveis.' },
      { title: 'Defina Gnose e Raiva', desc: 'Gnose é sua conexão espiritual; Raiva, sua fúria de combate. Ambas custam o que você tem de mais precioso.' },
    ],
  },
  {
    id: 'mago',
    name: 'Mago: A Ascensão',
    subtitle: 'Mage: The Ascension',
    tagline: 'A realidade é apenas um ponto de vista',
    description:
      'A realidade é uma mentira consensual que os Despertos aprenderam a questionar. Magos remoldaram o mundo com a força da vontade — mas o universo resiste através do Paradoxo. Cada milagre tem um preço, e o cosmos cobra.',
    longDescription:
      'Em Mago: A Ascensão (Edição do 20º Aniversário), você interpreta um Desperto — alguém que compreendeu que a realidade é moldada pela crença coletiva. Sua vontade pode dobrar as leis da física, invocar tempestades, curar feridas ou ver através do tempo. Mas o Consenso, a crença coletiva da humanidade, resiste como uma força física: o Paradoxo. Quanto mais ostensivo seu poder, maior o backlash. As Tradições, o Technocracia e os Marauders travam uma guerra pela definição da realidade — e você é uma peça no tabuleiro.',
    color: '#7b2fff',
    colorSecondary: '#4a0e8f',
    colorGlow: 'rgba(123,47,255,0.4)',
    icon: '✨',
    uniqueStat: {
      name: 'Arete',
      description:
        'Sua maestria sobre a magia. Define o máximo de pontos que qualquer Esfera pode atingir, e o quanto você pode fazer o impossível parecer inevitável.',
    },
    factions: [
      { name: 'Akashayana', description: 'Monges e guerreiros do caminho do dharma. Para eles, mente e corpo são um, e a perfeição é a única magia que importa.' },
      { name: 'Coro Celestial', description: 'Místicos de tradição cristã e abraâmica. Creem que a magia é a expressão da vontade divina — e que seus oponentes servem à escuridão.' },
      { name: 'Culto do Êxtase', description: 'Xamãs do prazer e da percepção alterada. Encontram a verdade no excesso, na dança e nas experiências que transcendem o corpo.' },
      { name: 'Dreamspeakers', description: 'Guardiões das tradições espirituais indígenas. Falam com os espíritos da terra e pagam o preço de estar entre dois mundos.' },
      { name: 'Euthanatos', description: 'Segadores que enxergam a morte como transformação. Sua magia é a Entropia — e sabem que às vezes a cura requer eliminar o doente.' },
      { name: 'Ordem de Hermes', description: 'Herdeiros da tradição alquímica ocidental. Grimorios, sigilos e geometria sagrada são suas ferramentas de poder.' },
      { name: 'Filhos do Éter', description: 'Cientistas loucos e inventores impossíveis. Creem que a ciência pode explicar e realizar qualquer milagre — dado equipamento suficiente.' },
      { name: 'Verbena', description: 'Bruxas e druidas ligados à terra e ao sangue. Magia antiga, orgânica e visceral que a modernidade tenta apagar.' },
      { name: 'Virtual Adepts', description: 'Hackers que descobriram que o código pode reescrever a realidade. A rede é o Umbra deles, e os dados são sua magia.' },
    ],
    steps: [
      { title: 'Escolha sua Tradição', desc: 'Define sua visão de mundo, seu Paradigma e como você manifesta magia através de seus Instrumentos.' },
      { title: 'Defina o Conceito', desc: 'Quem você era antes do Despertar? O evento que abriu seus olhos para a verdade moldará tudo que segue.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em prioridade (7/5/3). Magos geralmente priorizam Mental.' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos (13/9/5). Acadêmicos e Ocultismo são centrais para a maioria das Tradições.' },
      { title: 'Escolha Esferas', desc: 'Distribua 6 pontos em Esferas — os domínios da realidade que você pode dobrar. Nenhuma pode exceder seu Arete inicial.' },
      { title: 'Defina Arete e Quintessência', desc: 'Arete começa em 1 (ou 2 com pontos bônus). Quintessência é a energia mágica que alimenta seus feitiços mais ambiciosos.' },
    ],
  },
  {
    id: 'changeling',
    name: 'Changeling: O Sonhar',
    subtitle: 'The Dreaming',
    tagline: 'A magia que o mundo esqueceu ainda vive em você',
    description:
      'Você é um changeling — uma criatura feérica presa em corpo mortal, lutando contra a Banalidade que apaga a magia do mundo moderno.',
    longDescription:
      'Em Changeling: O Sonhar (Edição do 20º Aniversário), você interpreta um Kithain — a alma de uma fada encarnada num corpo humano mortal, despertada pelo Chrysalis. Presos entre o Sonho, o reino feérico de Arcádia agora fragmentado e distante, e o mundo Banal da razão fria, os changelings lutam para preservar Glamour — a energia mágica nascida da criatividade, da paixão e do encanto — antes que a Banalidade, o ceticismo esmagador da modernidade, apague de vez a magia e os force a um Undoing. Cada Kith carrega dons e fraquezas próprias de sua linhagem fae, e cada Corte impõe um código de conduta que molda como o changeling vive entre dois mundos.',
    color: '#c4870a',
    colorSecondary: '#8a5c05',
    colorGlow: 'rgba(196, 135, 10, 0.4)',
    icon: '⭐',
    uniqueStat: {
      name: 'Glamour',
      description:
        'A energia da criatividade, do encanto e da imaginação humana. Alimenta as Artes feéricas do Kithain — mas se esgota conforme a Banalidade do mundo avança sobre o Sonho.',
    },
    factions: [
      { name: 'Boggans', description: 'Fadas domésticas dedicadas ao trabalho manual e à lealdade. Encontram magia na dedicação silenciosa às tarefas mais simples do cotidiano.' },
      { name: 'Eshu', description: 'Contadores de histórias e viajantes natos. Tecem destino e narrativa por onde passam, carregando segredos de terras distantes.' },
      { name: 'Nockers', description: 'Artesãos geniais e irascíveis. Criam maravilhas mecânicas impossíveis — e reclamam de cada imperfeição alheia (e da própria).' },
      { name: 'Pixies', description: 'Espíritos levianos movidos por impulso e travessura. Vivem o momento com uma intensidade que poucos conseguem acompanhar.' },
      { name: 'Pooka', description: 'Metamorfos ligados a um animal totêmico. Mentirosos charmosos que escondem verdades atrás de brincadeiras e formas mutáveis.' },
      { name: 'Redcaps', description: 'Brutos ferozes movidos por apetites viscerais. Assustam tanto aliados quanto inimigos com sua fome selvagem.' },
      { name: 'Satyrs', description: 'Devotos do prazer, da música e do excesso. Vivem para a celebração — e para os riscos que vêm com ela.' },
      { name: 'Sidhe', description: 'A nobreza feérica retornada de Arcádia. Belos, orgulhosos e obcecados por honra, poder e a corte a que servem.' },
      { name: 'Sluagh', description: 'Guardiões dos segredos mais sombrios do Sonho. Sussurram verdades que ninguém mais ousa dizer em voz alta.' },
      { name: 'Trolls', description: 'Guerreiros leais e implacáveis. Onde há um juramento a proteger, um Troll estará de guarda até o fim.' },
    ],
    steps: [
      { title: 'Escolha seu Kith', desc: 'Sua linhagem feérica define seus Dons naturais, sua afinidade com certas Artes e como os outros Kithain te enxergam.' },
      { title: 'Defina sua Corte', desc: 'Seelie ou Unseelie: seu código de conduta feérico dita como você deve agir para manter sua ligação com o Sonho.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em ordem de prioridade (7/5/3 pontos), como nos demais jogos do Storyteller System.' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos distribuídos em três grupos de prioridade (13/9/5).' },
      { title: 'Escolha Artes e Reinos', desc: 'As Artes definem que tipo de magia feérica você manipula; os Reinos, sobre o que essa magia atua.' },
      { title: 'Defina Glamour e Banalidade', desc: 'Glamour alimenta seus poderes; Banalidade mede o quanto o mundo mundano já corroeu sua natureza feérica.' },
    ],
  },
  {
    id: 'demonio',
    name: 'Demônio: A Queda',
    subtitle: 'The Fallen',
    tagline: 'Caído do paraíso, mas não esquecido por Deus',
    description:
      'Você é um anjo caído — aprisionado no Abismo por milênios, agora solto em um mundo que não reconhece mais.',
    longDescription:
      'Em Demônio: A Queda, você interpreta um dos Caídos: anjos que se rebelaram contra o Criador na Guerra antiga, foram banidos ao Abismo por milênios de tormento, e agora retornam à Terra possuindo corpos humanos — seus Recipientes — para reconstruir o que perderam. Dividido entre a fúria da rebelião passada e a saudade da comunhão com Deus, cada Caído carrega uma Casa angelical que define sua natureza primordial e deve equilibrar sua Fé, a lembrança do que era antes da Queda, contra a Tormenta, a corrupção que ameaça consumir o que resta de sua divindade. O Apocalipse se aproxima, e cada Caído decide: reconciliação, vingança ou destruição.',
    color: '#1a4a8a',
    colorSecondary: '#0d2550',
    colorGlow: 'rgba(26, 74, 138, 0.45)',
    icon: '👑',
    uniqueStat: {
      name: 'Fé',
      description:
        'A lembrança viva de sua natureza angelical e a força que alimenta seus Lores. Quanto maior a Fé, mais divino o Caído permanece — mas a Tormenta sempre espreita, pronta a consumir o que resta dessa divindade.',
    },
    factions: [
      { name: 'Namaru', description: 'Anjos da destruição e da guerra santa. Carregam a fúria de quem lutou nas linhas de frente da rebelião original.' },
      { name: 'Asharu', description: 'Guardiões vigilantes que observavam a criação por ordem divina. Agora vigiam a humanidade com o mesmo olhar implacável.' },
      { name: 'Annunaki', description: 'Devoradores de mundos e conceitos. Sua fome primordial ameaça consumir tudo que tocam, inclusive a si mesmos.' },
      { name: 'Lammasu', description: 'Mestres da forma e da transformação. Manipulam matéria e corpo com uma facilidade que beira o blasfemo.' },
      { name: 'Rabisu', description: 'Sedutores e corruptores natos. Encontram a fraqueza humana com uma precisão quase profética.' },
      { name: 'Halaku', description: 'Corruptores sutis da mente e da percepção. Preferem a mentira elegante à violência bruta.' },
      { name: 'Shedim', description: 'Devastadores movidos por fúria pura. Deixam ruína só para provar que ainda podem destruir algo.' },
    ],
    steps: [
      { title: 'Escolha sua Casa', desc: 'Sua Casa angelical define seus Lores natos, seu papel na Guerra original e sua visão sobre a Queda.' },
      { title: 'Escolha seu Recipiente', desc: 'O corpo humano que você possui carrega uma vida e memórias próprias — e influencia como você se apresenta ao mundo.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em ordem de prioridade (7/5/3 pontos).' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos distribuídos em três grupos de prioridade (13/9/5).' },
      { title: 'Escolha Lores e Feitos', desc: 'Os Lores são os domínios de poder angelical de sua Casa; Feitos são as manifestações práticas desses Lores.' },
      { title: 'Defina Fé e Tormenta', desc: 'Fé mede sua conexão com sua natureza divina; Tormenta, o quanto a corrupção do Abismo ainda te consome.' },
    ],
  },
  {
    id: 'cacador',
    name: 'Caçador: O Ajuste de Contas',
    subtitle: 'Hunter: The Reckoning',
    tagline: 'Nenhum poder sobrenatural. Apenas determinação — e isso talvez baste',
    description:
      'Mortais comuns que receberam um chamado misterioso para enfrentar as trevas. Sem sangue mágico nem garras afiadas — apenas Virtudes ardentes, astúcia e a convicção inabalável de que o escuro pode ser combatido.',
    longDescription:
      'Em Caçador: O Ajuste de Contas, você interpreta alguém comum que teve um momento de revelação: os monstros são reais, e ninguém mais vai parar com eles. Os Mensageiros concederam a você Virtudes — poderes sobrenaturais sutis que amplificam sua humanidade em combate ao inhuman. Mas ser um Caçador tem um custo: quanto mais você vê, mais difícil é voltar para a vida normal. E os próprios monstros que você caça raramente são o que parecem.',
    color: '#d4860a',
    colorSecondary: '#6b4205',
    colorGlow: 'rgba(212,134,10,0.4)',
    icon: '🗡️',
    uniqueStat: {
      name: 'Virtude',
      description:
        'A chama sobrenatural que diferencia Caçadores de simples mortais. Alimenta seus poderes únicos e mantém você em pé quando tudo mais falhou.',
    },
    factions: [
      { name: 'Visionários', description: 'Os que veem a verdade por trás da fachada sobrenatural. Sua Virtude é a clareza — e com ela vem o peso de saber.' },
      { name: 'Julgadores', description: 'Executores implacáveis da justiça mortal. Acreditam que os monstros devem ser julgados pelas mesmas leis que os humanos.' },
      { name: 'Fervorosos', description: 'A linha de frente da caça. Movidos por fé e raiva, são os primeiros a atacar — e os primeiros a se perder no processo.' },
      { name: 'Inocentes', description: 'Sobreviventes que descobriram o sobrenatural da pior forma. Sua força vem de recusar-se a ser vítima novamente.' },
      { name: 'Mártires', description: 'Aqueles que abraçaram o sacrifício como vocação. Carregam o peso da missão como uma cruz — e às vezes literalmente.' },
    ],
    steps: [
      { title: 'Defina seu Chamado', desc: 'O que te despertou para o sobrenatural? Esse momento define sua motivação e o tipo de Caçador que você se tornou.' },
      { title: 'Escolha sua Virtude', desc: 'Visão, Julgamento ou Fervor — sua inclinação natural molda quais poderes os Mensageiros te concedem.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em prioridade. Caçadores mordem e abraçam a diversidade humana — não há padrão.' },
      { title: 'Selecione Habilidades', desc: 'Talentos, Perícias e Conhecimentos são sua única vantagem real contra o sobrenatural.' },
      { title: 'Escolha Poderes', desc: 'Convicções e Faculdades concedidos pelos Mensageiros. Modestos comparados à magia vampírica — mas surpreendentemente eficazes.' },
    ],
  },
  {
    id: 'mumia',
    name: 'Múmia: O Caminho',
    subtitle: 'Mummy: The Resurrection',
    tagline: 'A eternidade cobra um preço que você pagará vida após vida',
    description:
      'Servos imortais dos deuses do antigo Egito, os Amenti ressurgem após cada morte com menos de si mesmos. A imortalidade é real — mas as memórias se apagam. A questão não é quando você morrerá, mas o que sobrará quando voltar.',
    longDescription:
      'Em Múmia: O Caminho, você interpreta um Amenti — um mortal que os deuses egípcios escolheram para ser seu instrumento imortal no mundo moderno. Cada morte e ressurreição te torna mais poderoso, mas apaga pedaços da sua personalidade e memória. Você existe para cumprir a vontade dos deuses, mas cada ciclo de morte e renascimento levanta a mesma questão: você ainda é você, ou apenas uma casca cumprindo um propósito que já esqueceu?',
    color: '#c9a227',
    colorSecondary: '#6b5510',
    colorGlow: 'rgba(201,162,39,0.4)',
    icon: '☥',
    uniqueStat: {
      name: 'Sekhem',
      description:
        'Sua força vital sobrenatural, dom dos deuses. Alimenta seus poderes mas se dissipa com o tempo — e quando chega a zero, você vai dormir até a próxima ressurreição.',
    },
    factions: [
      { name: 'Kher-Minu', description: 'Os Guardiões dos segredos do além. Servem como intermediários entre o mundo dos vivos e o Duat, o reino dos mortos.' },
      { name: 'Khri-Shata', description: 'Guerreiros abençoados. Foram escolhidos pela força de espírito — e por uma disposição para lutar sem hesitar.' },
      { name: 'Mesektet', description: 'Os que viajam entre os mundos com facilidade sobrenatural. Mensageiros e espiões dos deuses no mundo moderno.' },
      { name: 'Sefekhi', description: 'Estudiosos da magia antiga. Guardiões de conhecimentos que deveriam estar perdidos há milênios.' },
      { name: 'Udja-Sen', description: 'Curandeiros e restauradores. Seu propósito é consertar o que foi quebrado — seja um corpo, uma família ou uma nação.' },
    ],
    steps: [
      { title: 'Escolha seu Caminho', desc: 'Seu Caminho determina sua função como Amenti e quais poderes os deuses te concedem para cumpri-la.' },
      { title: 'Defina sua Vida Anterior', desc: 'Quem você era antes de ser escolhido? Esses fragmentos de memória são tudo que resta de sua humanidade original.' },
      { title: 'Distribua Atributos', desc: 'Físico, Social e Mental em prioridade. A morte apagou muita coisa, mas os atributos básicos permanecem.' },
      { title: 'Selecione Habilidades', desc: 'O que sobreviveu de suas vidas passadas molda o que você sabe fazer nesta — e nas próximas.' },
      { title: 'Escolha Hekau', desc: 'A magia egípcia antiga. Mais rígida e ritualística que outras formas sobrenaturais, mas formidável quando dominada.' },
    ],
  },
];
