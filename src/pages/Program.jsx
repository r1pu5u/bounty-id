import { useState } from 'react'
import './Program.css'

const PROVINCES = [
  "Jawa Barat", "DKI Jakarta", "Jawa Tengah", "Jawa Timur", 
  "Sumatera Utara", "Bali", "Sulawesi Selatan"
]

const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]

const PROGRAMS = [
  {
    id: 1,
    name: "Kota Bandung",
    province: "Jawa Barat",
    responseTime: "24 jam",
    payouts: {
      Low: "Rp200.000",
      Medium: "Rp1.000.000",
      High: "Rp2.500.000",
      Critical: "Rp5.000.000"
    },
    isActive: true
  },
  {
    id: 2,
    name: "Jakarta Pusat",
    province: "DKI Jakarta",
    responseTime: "12 jam",
    payouts: {
      Low: "Rp300.000",
      Medium: "Rp1.500.000",
      High: "Rp3.000.000",
      Critical: "Rp7.000.000"
    },
    isActive: true
  },
  // Add more program data here...
]

function Program() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvinces, setSelectedProvinces] = useState([])

  const filteredPrograms = PROGRAMS.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProvince = selectedProvinces.length === 0 || selectedProvinces.includes(program.province)
    return matchesSearch && matchesProvince
  })

  return (
    <div className="program-page">
      {/* Sidebar */}
      <aside className="program-sidebar">
        <div className="sidebar-section">
          <h3>Cari Program</h3>
          <input 
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sidebar-section">
          <h3>Filter Provinsi</h3>
          <div className="filter-options">
            {PROVINCES.map(province => (
              <label key={province} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedProvinces.includes(province)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProvinces([...selectedProvinces, province])
                    } else {
                      setSelectedProvinces(selectedProvinces.filter(p => p !== province))
                    }
                  }}
                />
                {province}
              </label>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Status Program</h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="status"
                value="all"
                checked={activeFilter === "all"}
                onChange={(e) => setActiveFilter(e.target.value)}
              />
              Semua Program
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="status"
                value="active"
                checked={activeFilter === "active"}
                onChange={(e) => setActiveFilter(e.target.value)}
              />
              Program Aktif
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="program-content">
        <h1>Program Bug Bounty</h1>
        <div className="program-grid">
          {filteredPrograms.map(program => (
            <div key={program.id} className="program-card">
              <div className="card-header">
                <h2>{program.name}</h2>
                <span className={`status ${program.isActive ? 'active' : 'inactive'}`}>
                  {program.isActive ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>
              <div className="card-body">
                <p className="province">{program.province}</p>
                <p className="response-time">
                  <span>Waktu Respons:</span> {program.responseTime}
                </p>
                <div className="payout-ranges">
                  <h3>Reward Range:</h3>
                  {SEVERITY_LEVELS.map(level => (
                    <div key={level} className="payout-item">
                      <span className={`severity ${level.toLowerCase()}`}>{level}</span>
                      <span className="amount">{program.payouts[level]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Program 