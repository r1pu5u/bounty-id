import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
import ReportDetail from './pages/ReportDetail'
import { useNavigate } from 'react-router-dom'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Cek status login saat komponen dimount
    const token = localStorage.getItem('token')
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AuthProvider>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/logo.png" alt="BugBountyID" />
            </Link>
          </div>
          <button 
            className={`mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/program" onClick={closeMobileMenu}>Program</Link>
            <Link to="/researchers" onClick={closeMobileMenu}>Peneliti</Link>
            <Link to="/my-reports" onClick={closeMobileMenu}>Laporan</Link>
            <Link to="/leaderboard" onClick={closeMobileMenu}>Leaderboard</Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="dashboard-link"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button 
                  className="logout-button"
                  onClick={() => {
                    handleLogout()
                    closeMobileMenu()
                  }}
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link to="/login" className="cta-button" onClick={closeMobileMenu}>
                Masuk
              </Link>
            )}
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
                <Navigate to="/admin/dashboard" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard/>
              </AdminRoute>
            }
          />
          <Route path="/admin/reports/:id" element={<ReportDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
