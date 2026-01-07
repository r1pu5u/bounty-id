import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import './Dashboard.css'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users', err)
      setError('Gagal mengambil data pengguna')
    } finally { setLoading(false) }
  }

  const toggleRole = async (user) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin'
      await adminAPI.updateUser(user.id, { role: newRole })
      fetchUsers()
    } catch (err) {
      console.error('Error updating role', err)
      alert('Gagal mengubah peran pengguna')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus pengguna ini?')) return
    try {
      await adminAPI.deleteUser(id)
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user', err)
      alert('Gagal menghapus pengguna')
    }
  }

  return (
    <div className="dashboard-page dashboard-page--wide">
      <div className="dashboard-gradient" />
      <h1>Kelola Pengguna</h1>

      {loading ? <p>Loading...</p> : error ? <p style={{color:'#FF4444'}}>{error}</p> : (
        <div style={{overflowX:'auto'}}>
          <table className="myreports-table myreports-table--full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{textAlign:'center',color:'#B4B4B4',padding:'2rem'}}>Tidak ada pengguna.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td style={{display:'flex',gap:8}}>
                      <button className="lihat-laporan-btn" onClick={() => toggleRole(u)}>{u.role === 'admin' ? 'Demote' : 'Promote'}</button>
                      <button className="lihat-laporan-btn" onClick={() => handleDelete(u.id)} style={{background:'#FF4444'}}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
