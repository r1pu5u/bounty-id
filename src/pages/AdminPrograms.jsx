import React, { useEffect, useState } from 'react';
import { adminAPI, programAPI } from '../services/api';
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
    setEditingId(null)
    setForm({ name: '', province: '', responseTime: '', payouts: { Low: '', Medium: '', High: '', Critical: '' }, isActive: true })
    setShowModal(true)
  };

  // modal/form state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', province: '', responseTime: '', payouts: { Low: '', Medium: '', High: '', Critical: '' }, isActive: true })

  const openEdit = (program) => {
    setEditingId(program.id)
    setForm({
      name: program.name || '',
      province: program.province || '',
      responseTime: program.responseTime || '',
      payouts: program.payouts || { Low: '', Medium: '', High: '', Critical: '' },
      isActive: program.isActive === undefined ? true : program.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus program ini?')) return
    try {
      await programAPI.delete(id)
      fetchPrograms()
    } catch (err) {
      alert('Gagal menghapus program')
    }
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        province: form.province,
        responseTime: form.responseTime,
        payouts: form.payouts,
        isActive: form.isActive
      }
      if (editingId) {
        await programAPI.update(editingId, payload)
      } else {
        await programAPI.create(payload)
      }
      setShowModal(false)
      fetchPrograms()
    } catch (err) {
      console.error('Error saving program', err)
      alert('Gagal menyimpan program')
    }
  }

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
                      <td style={{display: 'flex', gap: 8}}>
                        <button className="lihat-laporan-btn" onClick={() => openEdit(program)}>Edit</button>
                        <button className="lihat-laporan-btn" onClick={() => handleDelete(program.id)} style={{background: '#FF4444'}}>Hapus</button>
                      </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="payout-modal" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="payout-card" style={{width:640}}>
            <h3>{editingId ? 'Edit Program' : 'Tambah Program'}</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <label>
                Nama Program
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </label>
              <label>
                Provinsi
                <input value={form.province} onChange={e=>setForm({...form,province:e.target.value})} />
              </label>
              <label>
                Response Time
                <input value={form.responseTime} onChange={e=>setForm({...form,responseTime:e.target.value})} />
              </label>
              <label>
                Active
                <select value={form.isActive? '1':'0'} onChange={e=>setForm({...form,isActive: e.target.value==='1'})}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </label>
            </div>
            <div style={{marginTop:12}}>
              <h4>Payouts (format teks untuk setiap severity)</h4>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <input placeholder="Low" value={form.payouts.Low} onChange={e=>setForm({...form,payouts:{...form.payouts,Low:e.target.value}})} />
                <input placeholder="Medium" value={form.payouts.Medium} onChange={e=>setForm({...form,payouts:{...form.payouts,Medium:e.target.value}})} />
                <input placeholder="High" value={form.payouts.High} onChange={e=>setForm({...form,payouts:{...form.payouts,High:e.target.value}})} />
                <input placeholder="Critical" value={form.payouts.Critical} onChange={e=>setForm({...form,payouts:{...form.payouts,Critical:e.target.value}})} />
              </div>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
              <button className="btn" onClick={()=>setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPrograms; 