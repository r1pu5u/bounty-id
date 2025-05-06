import './Dashboard.css'

function AdminDashboard() {
  // Dummy data, replace with real data if available
  const admin = { fullName: 'Admin', email: 'admin@email.com' }
  const stats = {
    programs: 8,
    pending: 5,
    users: 120,
    totalRewards: 'Rp 120.000.000',
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-gradient" />
      <h1>Admin Dashboard</h1>
      <p>Halo, <b>{admin.fullName}</b>! Berikut ringkasan sistem.</p>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">Program Aktif</div>
          <div className="card-value">{stats.programs}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Laporan Pending</div>
          <div className="card-value">{stats.pending}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Pengguna</div>
          <div className="card-value">{stats.users}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Reward</div>
          <div className="card-value">{stats.totalRewards}</div>
        </div>
      </div>
      <div className="dashboard-actions">
        <button className="dashboard-action-btn">Kelola Program</button>
        <button className="dashboard-action-btn">Verifikasi Laporan</button>
        <button className="dashboard-action-btn">Kelola Pengguna</button>
      </div>
    </div>
  )
}

export default AdminDashboard 