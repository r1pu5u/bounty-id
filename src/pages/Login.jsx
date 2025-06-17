import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { authAPI } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Cek status login saat komponen dimount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      if (token && user) {
        try {
          // Validasi token dengan backend
          const response = await authAPI.validateToken(token)
          
          if (response.data.valid) {
            // Token valid, redirect berdasarkan role
            if (user.role === 'admin') {
              navigate('/admin/dashboard')
            } else {
              navigate('/dashboard')
            }
          } else {
            // Token tidak valid, hapus data login
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (err) {
          // Error saat validasi token, hapus data login
          console.error('Token validation error:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }

    checkAuth()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect berdasarkan role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      // Handle berbagai jenis error
      if (err.response) {
        // Error dari server (status code 4xx atau 5xx)
        switch (err.response.status) {
          case 401:
            alert('Email atau password salah. Silakan coba lagi.');
            break;
          case 404:
            alert('Akun tidak ditemukan. Silakan periksa email Anda.');
            break;
          case 500:
            alert('Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.');
            break;
          default:
            alert(err.response.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        }
      } else if (err.request) {
        // Request dibuat tapi tidak ada response (network error)
        alert('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        // Error lainnya
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
      
      // Set error untuk ditampilkan di form
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
      
      // Log error untuk debugging
      console.error('Login error:', err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Masuk</h1>
          <p>Selamat datang kembali di BugBountyID</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Loading...' : 'Masuk'}
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