import { useState, useEffect } from 'react'
import { programAPI, reportAPI } from '../services/api'
import './Dashboard.css'

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

function NewBugReport() {
  const [programs, setPrograms] = useState([])
  const [form, setForm] = useState({
    programId: '',
    title: '',
    severity: '',
    description: '',
    steps: '',
    poc: '',
    attachment: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await programAPI.getAll()
      setPrograms(response.data)
    } catch (err) {
      console.error('Error fetching programs:', err)
      setError('Gagal mengambil data program')
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'attachment' && files.length > 0) {
      setForm({ ...form, attachment: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('programId', form.programId)
      formData.append('title', form.title)
      formData.append('severity', form.severity)
      formData.append('description', form.description)
      formData.append('steps', form.steps)
      formData.append('poc', form.poc)
      if (form.attachment) {
        formData.append('attachment', form.attachment)
      }

      await reportAPI.create(formData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      setForm({
        programId: '',
        title: '',
        severity: '',
        description: '',
        steps: '',
        poc: '',
        attachment: null,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim laporan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Buat Laporan Bug Baru</h1>
      <p>Laporkan kerentanan yang Anda temukan pada sistem pemerintah.</p>

      {error && <div className="error-message">{error}</div>}

      <form className="update-profile-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="update-profile-fields">
          <div className="update-profile-field">
            <label>Program</label>
            <select
              name="programId"
              value={form.programId}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} - {program.province}
                </option>
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
        <button 
          className="dashboard-action-btn" 
          type="submit" 
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim Laporan'}
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