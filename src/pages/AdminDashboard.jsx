import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import './Dashboard.css'
import './MyReports.css'
import { useNavigate } from 'react-router-dom'

const statusColor = {
  Accepted: '#00FFA3',
  Pending: '#FFC400',
  'In Review': '#FFC400',
  Rejected: '#FF4444',
}

const severityColor = {
  Low: '#00FFA3',
  Medium: '#FFC400',
  High: '#FF7B00',
  Critical: '#FF4444',
}

const STATUS_OPTIONS = ['Semua', 'Pending', 'In Review', 'Accepted', 'Rejected']
const SEVERITY_OPTIONS = ['Semua', 'Low', 'Medium', 'High', 'Critical']

const PAGE_SIZE = 5

function AdminDashboard() {
  console.log('AdminDashboard: Component is rendering')
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0,
    totalRewards: 0
  })
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [severityFilter, setSeverityFilter] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : { username: 'Admin' }

  const navigate = useNavigate()

  useEffect(() => {
    console.log('AdminDashboard: useEffect triggered')
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    console.log('AdminDashboard: Starting fetchDashboardData')
    try {
      setLoading(true)
      const [statsResponse, reportsResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getReports()
      ])
      console.log('AdminDashboard: Stats fetched successfully:', statsResponse.data)
      console.log('AdminDashboard: Reports fetched successfully:', reportsResponse.data)
      setStats(statsResponse.data)
      setReports(reportsResponse.data)
    } catch (err) {
      console.error('AdminDashboard: Error fetching data:', err)
      setError(err.response?.data?.message || 'Gagal mengambil data dashboard')
    } finally {
      setLoading(false)
      console.log('AdminDashboard: Loading set to false')
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.Program?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.Reporter?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `BB-${String(report.id).padStart(3, '0')}`.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'Semua' || report.status === statusFilter
    const matchesSeverity = severityFilter === 'Semua' || report.severity === severityFilter

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setCurrentPage(1)
  }

  const handleKelolaProgram = () => {
    navigate('/admin/programs')
  }

  if (loading) {
    console.log('AdminDashboard: Rendering Loading state')
    return (
      <div className="dashboard-page">
        <div className="dashboard-gradient" />
        <h1>Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    console.log('AdminDashboard: Rendering Error state:', error)
    return (
      <div className="dashboard-page">
        <div className="dashboard-gradient" />
        <h1>Admin Dashboard</h1>
        <p style={{ color: '#FF4444' }}>{error}</p>
      </div>
    )
  }

  console.log('AdminDashboard: Rendering main content with stats:', stats, ' and reports:', reports)
  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Admin Dashboard</h1>
      <p>Halo, <b>{user?.username}</b>! Berikut ringkasan sistem.</p>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">Total Laporan</div>
          <div className="card-value">{stats.totalReports}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Laporan Pending</div>
          <div className="card-value">{stats.pendingReports}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Laporan Diterima</div>
          <div className="card-value">{stats.acceptedReports}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Laporan Ditolak</div>
          <div className="card-value">{stats.rejectedReports}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">Total Reward</div>
          <div className="card-value">Rp {stats.totalRewards.toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div className="dashboard-actions">
        <button className="dashboard-action-btn" onClick={handleKelolaProgram}>Kelola Program</button>
        <button className="dashboard-action-btn">Verifikasi Laporan</button>
  <button className="dashboard-action-btn" onClick={() => navigate('/admin/users')}>Kelola Pengguna</button>
      </div>

      <h2 style={{marginTop: '3rem', marginBottom: '1.5rem'}}>Daftar Laporan Terbaru</h2>
      <div className="myreports-controls">
        <input
          className="myreports-search"
          type="text"
          placeholder="Cari judul, program, reporter, atau ID..."
          value={searchQuery}
          onChange={handleFilterChange(setSearchQuery)}
        />
        <select
          className="myreports-filter"
          value={statusFilter}
          onChange={handleFilterChange(setStatusFilter)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="myreports-filter"
          value={severityFilter}
          onChange={handleFilterChange(setSeverityFilter)}
        >
          {SEVERITY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div style={{overflowX: 'auto'}}>
        <table className="myreports-table myreports-table--full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Program</th>
              <th>Reporter</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{textAlign: 'center', color: '#B4B4B4', padding: '2rem'}}>
                  Tidak ada laporan ditemukan.
                </td>
              </tr>
            ) : (
              paginatedReports.map(report => (
                <tr key={report.id}>
                  <td>BB-{String(report.id).padStart(3, '0')}</td>
                  <td>{report.title}</td>
                  <td>{report.Program?.name}</td>
                  <td>{report.Reporter?.username}</td>
                  <td>
                    <span
                      style={{
                        color: severityColor[report.severity],
                        fontWeight: 600,
                      }}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: statusColor[report.status],
                        fontWeight: 600,
                      }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button
                      className="lihat-laporan-btn"
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="myreports-pagination">
        <button
          className="myreports-page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>
        <span className="myreports-page-info">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          className="myreports-page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard 