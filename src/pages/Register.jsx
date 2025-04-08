import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password harus minimal 8 karakter'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Proceed with registration
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
          <div className="form-group">
            <label htmlFor="fullName">Nama Lengkap</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Masukkan nama lengkap"
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

          <button type="submit" className="auth-button">
            Daftar
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