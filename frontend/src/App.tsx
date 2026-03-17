import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { PageTransition } from './components/PageTransition'
import { LoadingScreen } from './components/LoadingScreen'
import { HomePage } from './pages/HomePage'
import { DetectionPage } from './pages/DetectionPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ThreatsPage } from './pages/ThreatsPage'
import { AuditPage } from './pages/AuditPage'

export default function App() {
  const [booting, setBooting] = useState(true)
  const handleDone = useCallback(() => setBooting(false), [])

  return (
    <>
      {booting && <LoadingScreen onDone={handleDone} />}
      <div
        className="flex min-h-screen flex-col bg-background text-foreground"
        style={{
          opacity: booting ? 0 : 1,
          transition: 'opacity 0.4s ease 0.1s',
        }}
      >
        <Navbar />
        <PageTransition>
          <Routes>
            <Route path="/"          element={<HomePage />}      />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/threats"   element={<ThreatsPage />}   />
            <Route path="/audit"     element={<AuditPage />}     />
          </Routes>
        </PageTransition>
        <Footer />
      </div>
    </>
  )
}
