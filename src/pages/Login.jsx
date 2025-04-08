import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add login logic here
    console.log('Login attempt:', formData)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Masuk</h1>
          <p>Selamat datang kembali di BugBountyID</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Ingat saya
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Lupa password?
            </Link>
          </div>

          <button type="submit" className="auth-button">
            Masuk
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Belum punya akun?{' '}
            <Link to="/register" className="auth-link">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 