import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Leaderboard from './pages/Leaderboard'
import Marketplace from './pages/Marketplace'
import AquiferInfo from './pages/AquiferInfo'
import SubsidyInfo from './pages/SubsidyInfo'
import ImpactDashboard from './pages/ImpactDashboard'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/aquifer" element={<AquiferInfo />} />
            <Route path="/subsidies" element={<SubsidyInfo />} />
            <Route path="/impact" element={<ImpactDashboard />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
