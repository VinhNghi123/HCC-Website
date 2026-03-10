import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/NavBar'
import FloatingIcons from './components/FloatingIcons'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import { MembersList, MemberProfile } from './pages/Members'
import Leaderboard from './pages/Leaderboard'
import Availability from './pages/Availability'
import Gallery from './pages/Gallery'
import Vote from './pages/Vote'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Fixed floating icons visible on EVERY page, always at screen edges */}
        <FloatingIcons />
        <Routes>
          {/* Sign in page has its own full layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Main layout with navbar */}
          <Route path="/*" element={
            <div style={{ minHeight: '100vh' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<MembersList />} />
                <Route path="/members/:id" element={<MemberProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/availability" element={<Availability />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/vote" element={<Vote />} />
              </Routes>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}