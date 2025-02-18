import React from 'react'

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Amankan Digital Indonesia</h1>
          <p>Platform bug bounty untuk melindungi infrastruktur digital pemerintah Indonesia. Temukan dan laporkan kerentanan, dapatkan reward.</p>
          <div className="cta-buttons">
            <button className="primary-button">Mulai Mencari</button>
            <button className="secondary-button">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <h3>Rp 2.5M+</h3>
          <p>Total Rewards</p>
        </div>
        <div className="stat-card">
          <h3>1,200+</h3>
          <p>Bug Terverifikasi</p>
        </div>
        <div className="stat-card">
          <h3>500+</h3>
          <p>Peneliti Aktif</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Fitur Unggulan</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Aman</h3>
            <p>Platform terenkripsi dengan standar keamanan tinggi</p>
          </div>
          <div className="feature-card">
            <h3>Transparan</h3>
            <p>Sistem reward dan pelaporan yang transparan</p>
          </div>
          <div className="feature-card">
            <h3>Terverifikasi</h3>
            <p>Tim ahli memverifikasi setiap laporan</p>
          </div>
          <div className="feature-card">
            <h3>Reward Instan</h3>
            <p>Pembayaran cepat setelah verifikasi</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home 