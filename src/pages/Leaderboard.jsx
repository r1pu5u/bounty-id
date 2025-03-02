import React from 'react'
import './Leaderboard.css'

const TOP_HACKERS = [
  {
    rank: 1,
    username: "whitehat_id",
    points: 15750,
    bugsReported: 47,
    criticalFinds: 12,
    totalRewards: "Rp 45.000.000"
  },
  {
    rank: 2,
    username: "securehunter",
    points: 12800,
    bugsReported: 38,
    criticalFinds: 8,
    totalRewards: "Rp 32.500.000"
  },
  {
    rank: 3,
    username: "cyberdefender",
    points: 11200,
    bugsReported: 35,
    criticalFinds: 7,
    totalRewards: "Rp 28.750.000"
  },
  {
    rank: 4,
    username: "ethicalhacker_88",
    points: 9800,
    bugsReported: 29,
    criticalFinds: 6,
    totalRewards: "Rp 24.000.000"
  },
  {
    rank: 5,
    username: "securityninja",
    points: 8900,
    bugsReported: 27,
    criticalFinds: 5,
    totalRewards: "Rp 21.500.000"
  },
  {
    rank: 6,
    username: "bugfinder_pro",
    points: 7500,
    bugsReported: 24,
    criticalFinds: 4,
    totalRewards: "Rp 18.750.000"
  },
  {
    rank: 7,
    username: "pentester_id",
    points: 6800,
    bugsReported: 21,
    criticalFinds: 3,
    totalRewards: "Rp 15.000.000"
  },
  {
    rank: 8,
    username: "vulnhunter",
    points: 6200,
    bugsReported: 19,
    criticalFinds: 3,
    totalRewards: "Rp 13.500.000"
  },
  {
    rank: 9,
    username: "cybersec_hero",
    points: 5500,
    bugsReported: 17,
    criticalFinds: 2,
    totalRewards: "Rp 11.250.000"
  },
  {
    rank: 10,
    username: "secure_warrior",
    points: 4800,
    bugsReported: 15,
    criticalFinds: 2,
    totalRewards: "Rp 9.750.000"
  }
]

function Leaderboard() {
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
              {TOP_HACKERS.map((hacker) => (
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