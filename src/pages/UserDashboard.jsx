import './Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function UserDashboard() {
  const { user } = useAuth()
  const stats = {
    bugsReported: 12,
    rewards: 'Rp 7.500.000',
    critical: 2,
    accepted: 10,
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-gradient" />
      <h1>Dashboard Pengguna</h1>
      <p>Selamat datang, <b>{user?.fullName || user?.email}</b>! Berikut ringkasan aktivitas Anda.</p>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">Bug Dilaporkan</div>
          <div className="card-value">{stats.bugsReported}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Reward Diterima</div>
          <div className="card-value">{stats.rewards}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Temuan Kritis</div>
          <div className="card-value">{stats.critical}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Bug Diterima</div>
          <div className="card-value">{stats.accepted}</div>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/my-reports" className="dashboard-action-btn">Lihat Laporan Saya</Link>
        <Link to="/update-profile" className="dashboard-action-btn">Update Profil</Link>
        <Link to="/new-bug" className="dashboard-action-btn">Ajukan Bug Baru</Link>
        <Link to="/payment" className="dashboard-action-btn">Pembayaran</Link>
      </div>
    </div>
  )
}

export default UserDashboard 