import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Program from './pages/Program'

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">BugBountyID</Link>
        </div>
        <div className="nav-links">
          <Link to="/program">Program</Link>
          <Link to="/researchers">Peneliti</Link>
          <Link to="/reports">Laporan</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <button className="cta-button">Mulai</button>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/program" element={<Program />} />
      </Routes>
    </div>
  )
}

export default App
