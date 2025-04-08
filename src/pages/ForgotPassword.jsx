import { useState } from 'react'
import './Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Add password reset logic here
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Masukkan email Anda untuk reset password</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>
            <button type="submit" className="auth-button">
              Kirim Link Reset
            </button>
          </form>
        ) : (
          <div className="success-message">
            <p>Link reset password telah dikirim ke email Anda</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword 