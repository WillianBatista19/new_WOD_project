import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-wod-card border-t border-wod-border">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-cinzel text-base font-bold tracking-[0.2em] text-wod-text mb-3">
              WORLD OF DARKNESS
            </h3>
            <p className="font-crimson text-base text-wod-muted leading-relaxed">
              Sua enciclopédia das Trevas em português. Explore os sistemas, aprenda sobre os mundos e mergulhe no horror pessoal.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel text-xs font-semibold tracking-widest text-wod-text uppercase mb-5">
              Navegação
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/o-que-e-rpg" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  O Que é RPG?
                </Link>
              </li>
              <li>
                <Link to="/sistemas" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  Sistemas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel text-xs font-semibold tracking-widest text-wod-text uppercase mb-5">
              Sistemas
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/sistemas/vampiro" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  Vampiro: A Máscara
                </Link>
              </li>
              <li>
                <Link to="/sistemas/lobisomem" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  Lobisomem: O Apocalipse
                </Link>
              </li>
              <li>
                <Link to="/sistemas/mago" className="font-crimson text-base text-wod-muted hover:text-wod-text transition-colors duration-200">
                  Mago: A Ascensão
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wod-border mt-10 pt-8 space-y-2">
          <p className="font-crimson text-sm text-wod-muted leading-relaxed">
            World of Darkness é propriedade intelectual da Paradox Interactive e Renegade Game Studios. Este é um projeto de fãs não oficial, sem fins lucrativos, feito por amor ao universo.
          </p>
          <p className="font-crimson text-sm text-wod-muted/50">
            © {new Date().getFullYear()} WoD Encyclopedia — Projeto de Fãs
          </p>
        </div>
      </div>
    </footer>
  )
}
