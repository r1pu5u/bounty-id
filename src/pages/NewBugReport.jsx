import { useState } from 'react'
import './Dashboard.css'

const PROGRAMS = [
  'Kota Bandung',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Bali',
  'Sumatera Utara',
  'Sulawesi Selatan',
]

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

function NewBugReport() {
  const [form, setForm] = useState({
    program: '',
    title: '',
    severity: '',
    description: '',
    steps: '',
    poc: '',
    attachment: null,
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'attachment' && files.length > 0) {
      setForm({ ...form, attachment: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send to backend
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    setForm({
      program: '',
      title: '',
      severity: '',
      description: '',
      steps: '',
      poc: '',
      attachment: null,
    })
  }

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Buat Laporan Bug Baru</h1>
      <p>Laporkan kerentanan yang Anda temukan pada sistem pemerintah.</p>
      <form className="update-profile-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="update-profile-fields">
          <div className="update-profile-field">
            <label>Program</label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Program</option>
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="update-profile-field">
            <label>Judul Bug</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Contoh: SQL Injection di login admin"
            />
          </div>
          <div className="update-profile-field">
            <label>Severity</label>
            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Severity</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="update-profile-field">
            <label>Deskripsi Bug</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Jelaskan bug dan dampaknya..."
            />
          </div>
          <div className="update-profile-field">
            <label>Langkah Reproduksi</label>
            <textarea
              name="steps"
              value={form.steps}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Langkah-langkah untuk mereproduksi bug..."
            />
          </div>
          <div className="update-profile-field">
            <label>Proof of Concept (POC) / Link Video (opsional)</label>
            <input
              type="text"
              name="poc"
              value={form.poc}
              onChange={handleChange}
              placeholder="Link Google Drive, YouTube, dsb."
            />
          </div>
          <div className="update-profile-field">
            <label>Lampiran (opsional)</label>
            <input
              type="file"
              name="attachment"
              accept="image/*,application/pdf"
              onChange={handleChange}
            />
            {form.attachment && (
              <span style={{ color: '#00FFA3', fontSize: '0.95rem', marginTop: 4 }}>
                {form.attachment.name}
              </span>
            )}
          </div>
        </div>
        <button className="dashboard-action-btn" type="submit" style={{ marginTop: 24 }}>
          Kirim Laporan
        </button>
        {success && (
          <div className="update-profile-success">
            Laporan bug berhasil dikirim!
          </div>
        )}
      </form>
    </div>
  )
}

export default NewBugReport 