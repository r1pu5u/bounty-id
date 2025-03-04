import React, { useEffect, useState } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Security Researcher",
    image: "https://i.pravatar.cc/100?img=1",
    text: "Platform yang luar biasa! Saya telah menemukan 15 bug kritis dan mendapatkan reward total Rp30 juta dalam 3 bulan terakhir."
  },
  {
    id: 2,
    name: "Dewi Putri",
    role: "Ethical Hacker",
    image: "https://i.pravatar.cc/100?img=2",
    text: "Proses verifikasi bug yang cepat dan transparan. Tim support sangat responsif dan profesional."
  },
  {
    id: 3,
    name: "Ahmad Rizki",
    role: "Pentester",
    image: "https://i.pravatar.cc/100?img=3",
    text: "BugBountyID membantu saya mengembangkan karir di bidang security. Sistem reward yang kompetitif!"
  },
  {
    id: 4,
    name: "Sarah Wijaya",
    role: "Security Engineer",
    image: "https://i.pravatar.cc/100?img=4",
    text: "Platform bug bounty terbaik untuk infrastruktur pemerintah. Bangga bisa berkontribusi mengamankan sistem negara."
  }
]

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

      {/* New Testimonials Section */}
      <section className="testimonials">
        <h2>Apa Kata Mereka?</h2>
        <div className="testimonial-container">
          <div 
            className="testimonial-slider" 
            style={{ 
              transform: `translateX(-${activeIndex * 100}%)`,
              width: `${TESTIMONIALS.length * 100}%`
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="author-image"
                    />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
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