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
import Profile from './pages/Profile'
import Achievements from './pages/Achievements'
import Challenges from './pages/Challenges'
import Community from './pages/Community'
import ARVisualization from './pages/ARVisualization'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/community" element={<Community />} />
              <Route path="/ar" element={<ARVisualization />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
