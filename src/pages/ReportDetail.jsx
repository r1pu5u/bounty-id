import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI, API_URL } from '../services/api';
import './Dashboard.css';

// Tambahkan konstanta warna
const statusColor = {
  Accepted: '#00FFA3',
  Pending: '#FFC400',
  'In Review': '#FFC400',
  Rejected: '#FF4444',
};

const severityColor = {
  Low: '#00FFA3',
  Medium: '#FFC400',
  High: '#FF7B00',
  Critical: '#FF4444',
};

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationNote, setVerificationNote] = useState('');
  const [status, setStatus] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [payout, setPayout] = useState('');

  // Tambahkan state untuk user
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari local storage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getReportDetail(id);
      setReport(response.data);
      setStatus(response.data.status);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.response?.data?.message || 'Gagal mengambil detail laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (newStatus) => {
    try {
      setError('');
      // Kirim payout jika status Accepted
      await adminAPI.verifyReport(id, {
        status: newStatus,
        verificationNote,
        reward: newStatus === 'Accepted' ? payout : undefined
      });
      setStatus(newStatus);
      alert('Status laporan berhasil diperbarui');
      fetchReportDetail();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memverifikasi laporan');
    }
  };

  const handleViewPDF = async (reportId) => {
    try {
      setPdfLoading(true);
      const pdfUrl = `${API_URL}/admin/reports/${reportId}/pdf`;
      
      // Buka PDF langsung
      window.open(pdfUrl, '_blank');
      
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Gagal membuka PDF. Silakan coba lagi.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <div className="dashboard-page">Loading...</div>;
  if (error) return <div className="dashboard-page">{error}</div>;
  if (!report) return <div className="dashboard-page">Laporan tidak ditemukan</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-gradient" />
      <div className="report-detail">
        <div className="report-header">
          <h1>Detail Laporan</h1>
          <div className="report-id">BB-{String(report.id).padStart(3, '0')}</div>
        </div>

        <div className="report-info">
          <div className="info-group">
            <label>Judul</label>
            <div>{report.title}</div>
          </div>
          <div className="info-group">
            <label>Program</label>
            <div>{report.Program?.name}</div>
          </div>
          <div className="info-group">
            <label>Reporter</label>
            <div>{report.Reporter?.username}</div>
          </div>
          <div className="info-group">
            <label>Severity</label>
            <div style={{ color: severityColor[report.severity] }}>
              {report.severity}
            </div>
          </div>
          <div className="info-group">
            <label>Status</label>
            <div style={{ color: statusColor[report.status] }}>
              {report.status}
            </div>
          </div>
          <div className="info-group">
            <label>Tanggal Dilaporkan</label>
            <div>{new Date(report.createdAt).toLocaleDateString('id-ID')}</div>
          </div>
          <div className="info-group">
            <label>Reward</label>
            <div>Rp {Number(report.reward).toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div className="report-content">
          <h2>Deskripsi</h2>
          <p>{report.description}</p>

          <h2>Langkah Reproduksi</h2>
          <p>{report.steps}</p>

          <h2>Dampak</h2>
          <p>{report.impact}</p>

          <div className="pdf-section">
            <h2>Dokumen Pendukung</h2>
            {report.attachment ? (
              <div className="pdf-preview">
                <button 
                  className="view-pdf-btn"
                  onClick={() => handleViewPDF(report.id)}
                  disabled={pdfLoading}
                >
                  <i className="fas fa-file-pdf"></i> 
                  {pdfLoading ? 'Loading...' : 'Lihat PDF'}
                </button>
                <span className="pdf-filename">
                  {report.attachment.split('/').pop()}
                </span>
              </div>
            ) : (
              <p className="no-pdf">Tidak ada dokumen pendukung</p>
            )}
          </div>

          {report.attachments && (
            <>
              <h2>Lampiran</h2>
              <div className="attachments">
                {report.attachments.map((attachment, index) => (
                  <a 
                    key={index}
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    Lampiran {index + 1}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {report.status === 'Pending' && user?.role !== 'user' && (
          <div className="verification-section">
            <h2>Verifikasi Laporan</h2>
            <textarea
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              placeholder="Tambahkan catatan verifikasi..."
              className="verification-note"
            />
            {/* Input payout jika status akan di-accept */}
            <div style={{ margin: '1rem 0' }}>
              <label style={{ color: '#00FFA3', fontWeight: 600 }}>Payout (Rp)</label>
              <input
                type="number"
                min="0"
                value={payout}
                onChange={e => setPayout(e.target.value)}
                placeholder="Masukkan nominal payout"
                className="verification-note"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={status === 'Accepted'}
              />
            </div>
            <div className="verification-actions">
              <button 
                className="verify-btn accept"
                onClick={() => handleVerify('Accepted')}
                disabled={!payout}
              >
                Terima
              </button>
              <button 
                className="verify-btn reject"
                onClick={() => handleVerify('Rejected')}
              >
                Tolak
              </button>
            </div>
          </div>
        )}

        <button 
          className="back-btn"
          onClick={() => navigate('/admin/dashboard')}
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default ReportDetail; 