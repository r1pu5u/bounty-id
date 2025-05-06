import { useState, useEffect, useRef } from 'react'
import './Dashboard.css'

function UpdateProfile() {
  // Ambil avatar dari localStorage jika ada
  const storedAvatar = localStorage.getItem('user_avatar')
  const [form, setForm] = useState({
    fullName: 'Nama Pengguna',
    email: 'user@email.com',
    phone: '',
    bio: '',
    avatar: storedAvatar || '',
  })
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Saat avatar berubah, simpan ke localStorage
  useEffect(() => {
    if (form.avatar) {
      localStorage.setItem('user_avatar', form.avatar)
    }
  }, [form.avatar])

  // Saat komponen mount, ambil avatar dari localStorage (jaga-jaga)
  useEffect(() => {
    const saved = localStorage.getItem('user_avatar')
    if (saved && !form.avatar) {
      setForm(f => ({ ...f, avatar: saved }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'avatar' && files.length > 0) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm({ ...form, avatar: ev.target.result })
      }
      reader.readAsDataURL(files[0])
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Send update to backend
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Update Profil</h1>
      <p>Perbarui data profil Anda di bawah ini.</p>
      <form className="update-profile-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="update-profile-avatar update-profile-avatar--center">
          <label htmlFor="avatar-upload" className="update-profile-avatar-label">
            <img
              src={form.avatar || 'https://i.pravatar.cc/120?img=5'}
              alt="Avatar"
              className="update-profile-avatar-img"
            />
            <span className="update-profile-avatar-edit">Ganti Foto</span>
            <input
              id="avatar-upload"
              name="avatar"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChange}
              ref={fileInputRef}
            />
          </label>
        </div>
        <div className="update-profile-fields">
          <div className="update-profile-field">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="update-profile-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled
              style={{ background: '#222', color: '#888', cursor: 'not-allowed' }}
            />
          </div>
          <div className="update-profile-field">
            <label>No. HP</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="update-profile-field">
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Ceritakan tentang dirimu..."
            />
          </div>
        </div>
        <button className="dashboard-action-btn" type="submit" style={{ marginTop: 24 }}>
          Simpan Perubahan
        </button>
        {success && (
          <div className="update-profile-success">
            Profil berhasil diperbarui!
          </div>
        )}
      </form>
    </div>
  )
}

export default UpdateProfile 