import { useState } from 'react'
import './Dashboard.css'

const REPORTS = [
  {
    id: 'BB-001',
    title: 'SQL Injection di login admin',
    program: 'Kota Bandung',
    severity: 'Critical',
    status: 'Diterima',
    reward: 'Rp 2.500.000',
    date: '2024-06-01',
  },
  {
    id: 'BB-002',
    title: 'XSS pada halaman pencarian',
    program: 'DKI Jakarta',
    severity: 'Medium',
    status: 'Pending',
    reward: '-',
    date: '2024-06-10',
  },
  {
    id: 'BB-003',
    title: 'Directory Traversal',
    program: 'Jawa Barat',
    severity: 'High',
    status: 'Ditolak',
    reward: '-',
    date: '2024-06-15',
  },
  // Tambahkan data dummy lain jika perlu
  {
    id: 'BB-004',
    title: 'CSRF pada form kontak',
    program: 'Bali',
    severity: 'Low',
    status: 'Diterima',
    reward: 'Rp 500.000',
    date: '2024-06-18',
  },
  {
    id: 'BB-005',
    title: 'Open Redirect',
    program: 'Sumatera Utara',
    severity: 'Medium',
    status: 'Pending',
    reward: '-',
    date: '2024-06-20',
  },
  {
    id: 'BB-006',
    title: 'Sensitive Data Exposure',
    program: 'Jawa Tengah',
    severity: 'High',
    status: 'Diterima',
    reward: 'Rp 1.500.000',
    date: '2024-06-22',
  },
  {
    id: 'BB-007',
    title: 'Broken Authentication',
    program: 'Jawa Timur',
    severity: 'Critical',
    status: 'Pending',
    reward: '-',
    date: '2024-06-23',
  },
  {
    id: 'BB-008',
    title: 'IDOR pada endpoint API',
    program: 'Sulawesi Selatan',
    severity: 'High',
    status: 'Diterima',
    reward: 'Rp 1.800.000',
    date: '2024-06-24',
  },
  {
    id: 'BB-009',
    title: 'Clickjacking',
    program: 'DKI Jakarta',
    severity: 'Low',
    status: 'Ditolak',
    reward: '-',
    date: '2024-06-25',
  },
  {
    id: 'BB-010',
    title: 'Path Traversal',
    program: 'Jawa Barat',
    severity: 'Medium',
    status: 'Diterima',
    reward: 'Rp 900.000',
    date: '2024-06-26',
  },
  {
    id: 'BB-011',
    title: 'Privilege Escalation',
    program: 'Kota Bandung',
    severity: 'Critical',
    status: 'Diterima',
    reward: 'Rp 3.000.000',
    date: '2024-06-27',
  },
  {
    id: 'BB-012',
    title: 'Insecure Direct Object Reference',
    program: 'Bali',
    severity: 'High',
    status: 'Pending',
    reward: '-',
    date: '2024-06-28',
  },
]

const statusColor = {
  Diterima: '#00FFA3',
  Pending: '#FFC400',
  Ditolak: '#FF4444',
}

const severityColor = {
  Low: '#00FFA3',
  Medium: '#FFC400',
  High: '#FF7B00',
  Critical: '#FF4444',
}

const STATUS_OPTIONS = ['Semua', 'Diterima', 'Pending', 'Ditolak']
const SEVERITY_OPTIONS = ['Semua', 'Low', 'Medium', 'High', 'Critical']

const PAGE_SIZE = 6

function MyReports() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Semua')
  const [severity, setSeverity] = useState('Semua')
  const [page, setPage] = useState(1)

  // Filter logic
  const filtered = REPORTS.filter(r => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.program.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
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
              <th>Reward</th>
              <th>Tanggal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} style={{textAlign: 'center', color: '#B4B4B4', padding: '2rem'}}>
                  Tidak ada laporan ditemukan.
                </td>
              </tr>
            ) : (
              paginated.map(report => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.title}</td>
                  <td>{report.program}</td>
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
                  <td>{report.reward}</td>
                  <td>{report.date}</td>
                  <td>
                    <button
                      className="lihat-laporan-btn"
                      onClick={() => alert(`Lihat detail laporan ${report.id}`)}
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