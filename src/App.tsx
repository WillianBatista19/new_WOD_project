import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home/Home'
import Systems from './pages/Systems/Systems'
import SystemDetail from './pages/SystemDetail/SystemDetail'
import CharacterSheet from './pages/CharacterSheet/CharacterSheet'
import VampireSheet from './pages/CharacterSheet/VampireSheet'
import WerewolfSheet from './pages/CharacterSheet/WerewolfSheet'
import WhatIsRPG from './pages/WhatIsRPG/WhatIsRPG'
import MistBackground from './components/MistBackground/MistBackground'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <div className="min-h-screen bg-wod-bg text-wod-text flex flex-col">
      <ScrollToTop />
      <MistBackground />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/o-que-e-rpg" element={<WhatIsRPG />} />
          <Route path="/sistemas" element={<Systems />} />
          <Route path="/sistemas/:id" element={<SystemDetail />} />
          <Route path="/sistemas/vampiro/ficha" element={<VampireSheet />} />
          <Route path="/sistemas/lobisomem/ficha" element={<WerewolfSheet />} />
          <Route path="/sistemas/:id/ficha" element={<CharacterSheet />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="text-center">
                  <p className="font-cinzel text-6xl font-bold text-wod-border mb-4">404</p>
                  <p className="font-cinzel text-wod-muted tracking-widest">
                    Página não encontrada nas trevas
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
