import { Link } from 'react-router-dom'

const startItems = [
  {
    title: 'Um livro de regras',
    desc: 'O PDF do livro básico de qualquer sistema WoD está disponível em lojas digitais como DriveThruRPG — geralmente em inglês, mas com recursos em português crescendo na comunidade.',
  },
  {
    title: 'Dados de dez faces (d10)',
    desc: 'Um conjunto de 10d10 é suficiente para começar. Aplicativos de rolagem gratuitos existem para quem não quiser comprar dados físicos de imediato.',
  },
  {
    title: 'Um grupo',
    desc: '3 a 5 pessoas, sendo uma o Narrador. Grupos maiores funcionam, mas aumentam a complexidade logística. A maioria das campanhas começa com amigos já conhecidos.',
  },
  {
    title: 'Paciência com as regras',
    desc: 'Muita gente aprende jogando antes de ler o livro todo — e está tudo bem. O Storyteller System é intuitivo o suficiente para improvisar desde a primeira sessão.',
  },
]

export default function WhatIsRPG() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-28 sm:pt-40 pb-20 px-6 text-center"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.015) 0%, transparent 60%)`,
        }}
      >
        {/* Mixed glow — visual anchor for the hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 35% 55%, rgba(196,30,58,0.25) 0%, transparent 55%),
              radial-gradient(ellipse at 65% 45%, rgba(123,47,255,0.3) 0%, transparent 55%)
            `,
          }}
        />

        <div className="relative z-10 container mx-auto max-w-3xl">
          <p
            className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4"
            style={{ animation: 'fadeInUp 0.6s ease-out both' }}
          >
            Para quem está chegando
          </p>
          <h1
            className="font-cinzel text-4xl md:text-5xl font-bold text-wod-text mb-6 leading-tight"
            style={{ animation: 'fadeInUp 0.7s ease-out 0.1s both' }}
          >
            O Que é RPG de Mesa?
          </h1>
          <p
            className="font-crimson text-xl text-wod-muted leading-relaxed"
            style={{ animation: 'fadeInUp 0.7s ease-out 0.2s both' }}
          >
            Um guia acessível para quem nunca jogou — e quer entender por que tanta gente se
            apaixona por isso.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-bg pointer-events-none" />
      </section>

      {/* ── Section 1: O que é RPG ───────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-8">
            Um filme colaborativo onde você escreve o roteiro
          </h2>
          <div className="space-y-5 font-crimson text-lg text-wod-muted leading-relaxed">
            <p>
              RPG de mesa (do inglês{' '}
              <em className="text-wod-text not-italic font-semibold">Role-Playing Game</em>) é como
              um filme colaborativo onde você é roteirista, ator e plateia ao mesmo tempo. Não há
              tela, não há controle — apenas imaginação, dados e uma mesa com amigos.
            </p>
            <p>
              Pense em séries como{' '}
              <em className="text-wod-text">Stranger Things</em> ou filmes como{' '}
              <em className="text-wod-text">A Bruxa</em>: o RPG é o processo criativo que poderia ter
              gerado essas histórias. Um grupo se reúne, uma pessoa assume o papel de{' '}
              <span className="text-wod-text font-semibold">Narrador</span> — no World of Darkness,
              chamado de <em className="text-wod-text">Storyteller</em> —, e as demais interpretam
              os personagens principais.
            </p>
            <p>
              O Narrador descreve o mundo, os NPCs e os obstáculos. Os jogadores decidem como
              seus personagens reagem. Os dados determinam se as tentativas têm sucesso — e em que
              grau.
            </p>
            <p>
              Diferente de videogames, não há roteiro fixo. Uma porta trancada pode ser
              arrombada, contornada, subornada pelo guarda ou destruída com magia — dependendo do
              que os jogadores tentam. O Narrador improvisa junto, e emerge uma história que
              ninguém havia planejado antes de a noite começar.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface/60 pointer-events-none" />
      </section>

      {/* ── Section 2: Como funciona uma sessão ─────────────────────────── */}
      <section className="relative py-20 bg-wod-surface/60 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-8">
            Como funciona uma sessão?
          </h2>
          <div className="space-y-5 font-crimson text-lg text-wod-muted leading-relaxed mb-10">
            <p>
              Uma sessão típica dura entre 3 e 5 horas. O Narrador prepara o cenário: uma
              investigação, uma intriga política entre vampiros, uma missão para proteger um bosque
              sagrado. Os jogadores chegam com seus personagens —{' '}
              <span className="text-wod-text font-semibold">fichas</span> que descrevem quem são, o
              que sabem fazer e o que os motiva.
            </p>
            <p>
              A mecânica básica do World of Darkness é simples: quando seu personagem tenta algo
              com risco real de falhar, você pega um punhado de dados de dez faces (d10), rola, e
              conta quantos mostraram 6 ou mais. Cada um acima de 5 é um sucesso. Mais sucessos
              = resultado melhor.
            </p>
            <p>
              Mas o que torna o RPG especial é o que acontece{' '}
              <em className="text-wod-text">entre</em> os dados: as conversas, as decisões morais,
              as alianças e traições, os momentos em que seu personagem faz algo que o jogador
              jamais faria na vida real — ou que revela algo inesperado sobre quem você é.
            </p>
          </div>

          {/* Callout */}
          <div className="bg-wod-card border border-wod-border rounded p-6">
            <p className="font-cinzel text-xs font-semibold text-wod-text uppercase tracking-widest mb-3">
              A regra mais importante
            </p>
            <p className="font-crimson text-lg text-wod-muted leading-relaxed italic">
              "Regra zero: o objetivo é que todo mundo se divirta. Não há vitória nem derrota, há uma história que vocês criaram juntos."
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ── Section 3: O World of Darkness ──────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-8">
            O que é o World of Darkness?
          </h2>
          <div className="space-y-5 font-crimson text-lg text-wod-muted leading-relaxed">
            <p>
              O World of Darkness é um espelho escuro do nosso mundo contemporâneo. Vampiros
              realmente existem e controlam bancos e governos por trás das câmeras. Lobisomens
              protegem os últimos territórios selvagens que resistem à devastação. Magos
              remoldaram silenciosamente a história humana. E humanos comuns, de vez em quando,
              recebem um chamado para enfrentar tudo isso.
            </p>
            <p>
              O diferencial do WoD não é o poder sobrenatural — é o{' '}
              <span className="text-wod-text font-semibold">custo humano</span> dele. Em Vampiro,
              você interpreta um predador que ainda lembra o que era ser mortal e luta para manter
              a humanidade. Em Lobisomem, sua raiva sagrada é a mesma força que destroça as
              pessoas que você ama. Em Mago, sua capacidade de remodelar a realidade vem com a
              possibilidade de que ela resista catastroficamente.
            </p>
            <p>
              Os temas centrais são{' '}
              <span className="text-wod-text font-semibold">horror pessoal</span> (o que você está
              se tornando?),{' '}
              <span className="text-wod-text font-semibold">política</span> (quem tem poder e como
              mantê-lo?) e{' '}
              <span className="text-wod-text font-semibold">pertencimento</span> (onde você se
              encaixa quando não é mais completamente humano?).
            </p>
            <p>
              É RPG adulto — não no sentido de violência gratuita, mas no sentido de que lida com
              questões que importam de verdade.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface/60 pointer-events-none" />
      </section>

      {/* ── Section 4: Como começar ──────────────────────────────────────── */}
      <section className="relative py-20 bg-wod-surface/60 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-4">
            Como começar?
          </h2>
          <p className="font-crimson text-lg text-wod-muted leading-relaxed mb-10">
            A boa notícia: você não precisa de quase nada para a primeira sessão.
          </p>

          <div className="space-y-3 mb-10">
            {startItems.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-wod-card border border-wod-border rounded p-5 flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-wod-muted mt-2.5" />
                <div>
                  <p className="font-cinzel text-sm font-semibold text-wod-text mb-1">{title}</p>
                  <p className="font-crimson text-base text-wod-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-wod-card border border-wod-border rounded p-6">
            <p className="font-cinzel text-xs font-semibold text-wod-text uppercase tracking-widest mb-3">
              Encontrar um grupo
            </p>
            <p className="font-crimson text-base text-wod-muted leading-relaxed">
              Comunidades no Reddit (r/worldofdarkness, r/brpg), servidores Discord dedicados ao
              WoD e grupos no Facebook em português são os melhores pontos de partida. Lojas de
              jogos locais frequentemente têm grupos ativos ou podem indicar onde encontrá-los.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ── CTA → Sistemas ───────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4">
            Próximo passo
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-4">
            Escolha seu Sistema
          </h2>
          <p className="font-crimson text-xl text-wod-muted leading-relaxed mb-8">
            Agora que você sabe o que é RPG, explore os sistemas do World of Darkness e descubra
            qual ressoa com você.
          </p>
          <Link
            to="/sistemas"
            className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-text text-wod-text px-8 py-4 rounded transition-all duration-300 hover:bg-wod-text hover:text-wod-bg"
          >
            Explorar os Sistemas
          </Link>
        </div>
      </section>
    </>
  )
}
