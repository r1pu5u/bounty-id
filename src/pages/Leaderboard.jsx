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
      // Backend returns top users ordered by points; defensively sort again
      const list = (response.data || []).slice().sort((a, b) => (b.points || 0) - (a.points || 0))
      // Transform data for display
      const transformedData = list.map((user, index) => ({
        id: user.id,
        rank: index + 1,
        username: user.username,
        points: Number(user.points || 0),
        bugsReported: Number(user.bugsReported || 0),
        criticalFinds: Number(user.criticalFinds || 0),
        totalRewards: Number(user.totalRewards || 0)
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
  const formatReward = (amount) => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`

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
                <tr key={hacker.id || hacker.rank} className={hacker.rank <= 3 ? 'top-three' : ''}>
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
                  <td>{formatReward(hacker.totalRewards)}</td>
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