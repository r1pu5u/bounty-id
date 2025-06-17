import { useState, useEffect, useRef } from 'react'
import { userAPI } from '../services/api'
import './Dashboard.css'

function UpdateProfile() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      // Redirect ke login jika tidak ada token
      window.location.href = '/login';
      return;
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getProfile()
      const userData = response.data
      
      setForm({
        fullName: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        avatar: userData.avatar || '',
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Gagal mengambil data profile')
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await userAPI.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        bio: form.bio,
        avatar: form.avatar
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !form.email) {
    return (
      <div className="dashboard-page dashboard-page--wide">
        <div className="dashboard-gradient" />
        <div className="loading-state">Loading profile data...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Update Profil</h1>
      <p>Perbarui data profil Anda di bawah ini.</p>

      {error && <div className="error-message">{error}</div>}

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
        <button 
          className="dashboard-action-btn" 
          type="submit" 
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Simpan Perubahan'}
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