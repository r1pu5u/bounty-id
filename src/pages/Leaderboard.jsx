import React, { useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import './Leaderboard.css'

function Leaderboard() {
  const [hackers, setHackers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getLeaderboard()
      // Filter user dengan role admin
      const filtered = response.data.filter(user => user.role !== 'admin')
      // Transform data untuk menambahkan informasi tambahan
      const transformedData = filtered.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: user.points || 0,
        bugsReported: user.bugsReported || 0,
        criticalFinds: user.criticalFinds || 0,
        totalRewards: formatReward(user.totalRewards || 0)
      }))
      setHackers(transformedData)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError('Gagal mengambil data leaderboard')
    } finally {
      setLoading(false)
    }
  }

  // Helper function untuk format reward
  const formatReward = (amount) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-container">
          <h1>Top Bug Hunters</h1>
          <div className="loading-state">Loading leaderboard data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-container">
          <h1>Top Bug Hunters</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1>Top Bug Hunters</h1>
        <p className="leaderboard-description">
          Para peneliti keamanan terbaik berdasarkan poin, temuan kritis, dan total reward
        </p>
        
        <div className="table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Peringkat</th>
                <th>Username</th>
                <th>Poin</th>
                <th>Bug Dilaporkan</th>
                <th>Temuan Kritis</th>
                <th>Total Reward</th>
              </tr>
            </thead>
            <tbody>
              {hackers.map((hacker) => (
                <tr key={hacker.rank} className={hacker.rank <= 3 ? 'top-three' : ''}>
                  <td>
                    <span className={`rank rank-${hacker.rank}`}>
                      {hacker.rank}
                    </span>
                  </td>
                  <td>
                    <div className="username">
                      {hacker.username}
                    </div>
                  </td>
                  <td>{hacker.points.toLocaleString()}</td>
                  <td>{hacker.bugsReported}</td>
                  <td>{hacker.criticalFinds}</td>
                  <td>{hacker.totalRewards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard 