import { useEffect, useState } from 'react'
import '../styles/Payment.css'
import { userAPI, paymentAPI, reportAPI } from '../services/api'

function Payment() {
  const [balance, setBalance] = useState(1250000) // mock balance in IDR
  const [transactions, setTransactions] = useState([])
  const [showPayout, setShowPayout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')

  useEffect(() => {
    // load user profile and payments
    const load = async () => {
      try {
        const profileRes = await userAPI.getProfile()
        const profile = profileRes.data
        // prefill payment fields from profile if available
        if (profile.bankName) setBankName(profile.bankName)
        if (profile.bankAccountNumber) setAccountNumber(profile.bankAccountNumber)
        if (profile.bankAccountHolder) setAccountHolder(profile.bankAccountHolder)
        if (profile.paypalEmail) setPaypalEmail(profile.paypalEmail)

        // use totalRewards as balance if provided
        if (profile.totalRewards !== undefined) {
          setBalance(Number(profile.totalRewards))
        }

        // fetch existing payments
        const payRes = await paymentAPI.getMyPayments()
        const txns = (payRes.data || []).map(p => ({ id: `pay-${p.id}`, type: 'Payout', amount: -Number(p.amount), date: new Date(p.createdAt).toLocaleDateString(), method: p.method }))

        // fetch user's reports and show accepted rewards given by triagers
        const reportsRes = await reportAPI.getAll()
        const rewardTxns = (reportsRes.data || [])
          .filter(r => r.status === 'Accepted' && Number(r.reward) > 0)
          .map(r => ({ id: `rep-${r.id}`, type: 'Reward', amount: Number(r.reward), date: new Date(r.verifiedAt || r.updatedAt || r.createdAt).toLocaleDateString(), note: `BB-${String(r.id).padStart(3,'0')} ${r.title}` }))

        // combine payments and rewards, sort by date desc
        const combined = [...rewardTxns, ...txns]
          .sort((a,b) => new Date(b.date) - new Date(a.date))
        setTransactions(combined)
      } catch (err) {
        // fallback to local mock data if API fails
        const mock = [
          { id: 't1', type: 'Reward', amount: 250000, date: '2025-12-01' },
          { id: 't2', type: 'Reward', amount: 500000, date: '2025-11-10' },
          { id: 't3', type: 'Payout', amount: -300000, date: '2025-10-05' },
        ]
        setTransactions(mock)
      }
    }
    load()
  }, [])

  const formatIDR = (value) => {
    const sign = value < 0 ? '-' : ''
    const abs = Math.abs(value)
    return sign + abs.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
  }

  const handlePayoutClick = () => setShowPayout(true)

  const confirmPayout = () => {
    // call backend to create payment request
    setLoading(true)
    (async () => {
      try {
        const payoutAmount = balance
        if (payoutAmount > 0) {
          const methodDetail = paymentMethod === 'bank'
            ? `${bankName} • ${accountNumber}`
            : paypalEmail

          const res = await paymentAPI.createPayment({ amount: payoutAmount, method: paymentMethod, details: methodDetail })
          const newTxn = { id: res.data.id || `payout-${Date.now()}`, type: 'Payout', amount: -payoutAmount, date: new Date(res.data.createdAt || Date.now()).toLocaleDateString(), method: methodDetail }
          setTransactions((t) => [newTxn, ...t])
          setBalance(0)
        }
      } catch (err) {
        console.error('Error creating payout:', err)
        alert(err.response?.data?.message || 'Gagal membuat permintaan penarikan')
      } finally {
        setLoading(false)
        setShowPayout(false)
      }
    })()
  }

  return (
    <div className="dashboard-page dashboard-page--wide payment-page">
      <div className="dashboard-gradient" />

      <header className="payment-header">
        <h1>Pembayaran</h1>
        <p className="muted">Di sini Anda dapat melihat dan mengelola pembayaran / reward Anda.</p>
      </header>

      <section className="payment-grid">
        <aside className="balance-card">
          <div className="balance-row">
            <div>
              <h3>Saldo Tersedia</h3>
              <p className="balance-amount">{formatIDR(balance)}</p>
              <p className="muted small">Saldo yang bisa ditarik atau dipakai untuk reward</p>
            </div>
            <div className="balance-actions">
              <button className="btn btn-primary" onClick={handlePayoutClick} disabled={balance <= 0}>
                Tarik Saldo
              </button>
            </div>
          </div>
        </aside>

        <main className="transactions">
          <div className="transactions-header">
            <h3>Riwayat Transaksi</h3>
            <p className="muted small">Transaksi terakhir terkait reward dan payout</p>
          </div>

          <ul className="txn-list">
            {transactions.length === 0 && <li className="txn-empty">Belum ada transaksi</li>}
            {transactions.map((t) => (
              <li key={t.id} className="txn-item">
                <div className="txn-left">
                  <div className={`txn-type ${t.type.toLowerCase()}`}>{t.type}</div>
                  <div className="txn-date">{t.date}</div>
                </div>
                <div className="txn-right">{formatIDR(t.amount)}</div>
              </li>
            ))}
          </ul>
        </main>
      </section>

      {showPayout && (
        <div className="payout-modal" role="dialog" aria-modal="true">
          <div className="payout-card">
            <h4>Konfirmasi Penarikan</h4>
            <p className="muted">Jumlah: {formatIDR(balance)}</p>

            <div className="payout-form">
              <label className="muted small">Metode Penarikan</label>
              <div className="method-row">
                <label className={`method-option ${paymentMethod === 'bank' ? 'active' : ''}`}>
                  <input type="radio" name="method" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  <span>Bank</span>
                </label>
                <label className={`method-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                  <input type="radio" name="method" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span>PayPal</span>
                </label>
              </div>

              {paymentMethod === 'bank' && (
                <div className="bank-fields">
                  <label className="field">
                    <div className="field-label">Nama Bank</div>
                    <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Contoh: BCA" />
                  </label>
                  <label className="field">
                    <div className="field-label">Nomor Rekening</div>
                    <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" />
                  </label>
                  <label className="field">
                    <div className="field-label">Atas Nama</div>
                    <input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Nama pemilik rekening" />
                  </label>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="paypal-fields">
                  <label className="field">
                    <div className="field-label">Email PayPal</div>
                    <input value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="email@contoh.com" />
                  </label>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowPayout(false)} disabled={loading}>
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={confirmPayout}
                disabled={loading || balance <= 0 || (paymentMethod === 'bank' && (!bankName || !accountNumber || !accountHolder)) || (paymentMethod === 'paypal' && !paypalEmail)}
              >
                {loading ? 'Memproses...' : 'Konfirmasi Tarik'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment