import './Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { userAPI } from '../services/api'

function UserDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    bugsReported: 0,
    rewards: 0,
    critical: 0,
    accepted: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await userAPI.getStats()
        setStats({
          bugsReported: response.data.bugDilaporkan  || 0,
          critical:     response.data.temuanKritis   || 0,
          rewards:      response.data.rewardDiterima || 0,
          accepted:     response.data.bugDiterima    || 0
        })
      } catch (err) {
        setError('Gagal mengambil data statistik pengguna')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="dashboard-page">Loading...</div>
  if (error)   return <div className="dashboard-page">{error}</div>

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
          <div className="card-value">Rp {Number(stats.rewards).toLocaleString('id-ID')}</div>
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
        <Link to="/my-reports"     className="dashboard-action-btn">Lihat Laporan Saya</Link>
        <Link to="/update-profile" className="dashboard-action-btn">Update Profil</Link>
        <Link to="/new-bug"        className="dashboard-action-btn">Ajukan Bug Baru</Link>
        <Link to="/payment"        className="dashboard-action-btn">Pembayaran</Link>
      </div>
    </div>
  )
}

export default UserDashboard
