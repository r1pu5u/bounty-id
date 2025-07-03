import { useState, useEffect } from 'react'
import { reportAPI } from '../services/api'
import './Dashboard.css'
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

const PAGE_SIZE = 6

function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Semua')
  const [severity, setSeverity] = useState('Semua')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getAll()
      setReports(response.data)
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Gagal mengambil data laporan')
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  const filtered = reports.filter(r => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.Program?.name.toLowerCase().includes(search.toLowerCase()) ||
      `BB-${String(r.id).padStart(3, '0')}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'Semua' ? true : r.status === status
    const matchSeverity = severity === 'Semua' ? true : r.severity === severity
    return matchSearch && matchStatus && matchSeverity
  })

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page if filter/search changes
  function handleFilterChange(fn) {
    return (e) => {
      fn(e.target.value)
      setPage(1)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page dashboard-page--full">
        <div className="dashboard-gradient" />
        <h1>Laporan Saya</h1>
        <p>Memuat data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page dashboard-page--full">
        <div className="dashboard-gradient" />
        <h1>Laporan Saya</h1>
        <p style={{ color: '#FF4444' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page dashboard-page--full">
      <div className="dashboard-gradient" />
      <h1>Laporan Saya</h1>
      <p>Daftar laporan bug yang telah Anda submit ke berbagai program.</p>
      <div className="myreports-controls">
        <input
          className="myreports-search"
          type="text"
          placeholder="Cari judul, program, atau ID..."
          value={search}
          onChange={handleFilterChange(setSearch)}
        />
        <select
          className="myreports-filter"
          value={status}
          onChange={handleFilterChange(setStatus)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="myreports-filter"
          value={severity}
          onChange={handleFilterChange(setSeverity)}
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
              <th>Severity</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} style={{textAlign: 'center', color: '#B4B4B4', padding: '2rem'}}>
                  Tidak ada laporan ditemukan.
                </td>
              </tr>
            ) : (
              paginated.map(report => (
                <tr key={report.id}>
                  <td>BB-{String(report.id).padStart(3, '0')}</td>
                  <td>{report.title}</td>
                  <td>{report.Program?.name}</td>
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
      {/* Pagination */}
      <div className="myreports-pagination">
        <button
          className="myreports-page-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &laquo; Prev
        </button>
        <span className="myreports-page-info">
          Halaman {page} dari {totalPages}
        </span>
        <button
          className="myreports-page-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  )
}

export default MyReports 