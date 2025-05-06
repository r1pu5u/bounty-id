import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Program from './pages/Program'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import UserRoute from './components/UserRoute'
import MyReports from './pages/MyReports'
import UpdateProfile from './pages/UpdateProfile'
import NewBugReport from './pages/NewBugReport'
import Payment from './pages/Payment'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AuthProvider>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="logo">
            <Link to="/" onClick={closeMobileMenu}>BugBountyID</Link>
          </div>
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/program" onClick={closeMobileMenu}>Program</Link>
            <Link to="/researchers" onClick={closeMobileMenu}>Peneliti</Link>
            <Link to="/reports" onClick={closeMobileMenu}>Laporan</Link>
            <Link to="/leaderboard" onClick={closeMobileMenu}>Leaderboard</Link>
            <Link to="/login" className="cta-button" onClick={closeMobileMenu}>Masuk</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/program" 
            element={
              <ProtectedRoute>
                <Program />
              </ProtectedRoute>
            } 
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/new-bug" element={<NewBugReport />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
