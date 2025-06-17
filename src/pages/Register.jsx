import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { authAPI } from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      // Simpan token
      localStorage.setItem('token', response.data.token)
      
      // Redirect ke dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Daftar</h1>
          <p>Bergabung dengan komunitas bug hunter Indonesia</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="nama@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Minimal 8 karakter"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Masukkan ulang password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" required />
              Saya setuju dengan <Link to="/terms" className="auth-link">Syarat & Ketentuan</Link>
            </label>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Sudah punya akun?{' '}
            <Link to="/login" className="auth-link">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register 