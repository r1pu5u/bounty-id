import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPrograms();
      setPrograms(response.data);
    } catch (err) {
      setError('Gagal mengambil data program');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = () => {
    // Nanti bisa diarahkan ke halaman tambah program
    alert('Fitur tambah program coming soon!');
  };

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Kelola Program</h1>
      <button className="dashboard-action-btn" onClick={handleAddProgram} style={{marginBottom: '1.5rem'}}>+ Tambah Program</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: '#FF4444' }}>{error}</p>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table className="myreports-table myreports-table--full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Program</th>
                <th>Provinsi</th>
                <th>Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{textAlign: 'center', color: '#B4B4B4', padding: '2rem'}}>
                    Tidak ada program ditemukan.
                  </td>
                </tr>
              ) : (
                programs.map(program => (
                  <tr key={program.id}>
                    <td>{program.id}</td>
                    <td>{program.name}</td>
                    <td>{program.province}</td>
                    <td>{new Date(program.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPrograms; 