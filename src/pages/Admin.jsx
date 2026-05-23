import { useState, useEffect } from 'react'

function Admin() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))

    fetch('http://localhost:5000/admin/recent')
      .then(res => res.json())
      .then(data => setRecent(data))
  }, [])

  return (
    <div className="page">
      <h2 style={{ color: '#2c7be5', marginBottom: '25px' }}>📊 Admin Dashboard</h2>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #2c7be5' }}>
            <div style={{ fontSize: '40px' }}>🏥</div>
            <h1 style={{ fontSize: '40px', color: '#2c7be5', margin: '10px 0' }}>{stats.totalPatients}</h1>
            <p style={{ color: '#888' }}>Total Patients</p>
          </div>

          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #28a745' }}>
            <div style={{ fontSize: '40px' }}>💊</div>
            <h1 style={{ fontSize: '40px', color: '#28a745', margin: '10px 0' }}>{stats.totalPrescriptions}</h1>
            <p style={{ color: '#888' }}>Prescriptions</p>
          </div>

          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #fd7e14' }}>
            <div style={{ fontSize: '40px' }}>🔬</div>
            <h1 style={{ fontSize: '40px', color: '#fd7e14', margin: '10px 0' }}>{stats.totalLabReports}</h1>
            <p style={{ color: '#888' }}>Lab Reports</p>
          </div>

          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #6f42c1' }}>
            <div style={{ fontSize: '40px' }}>📋</div>
            <h1 style={{ fontSize: '40px', color: '#6f42c1', margin: '10px 0' }}>{stats.todayPatients}</h1>
            <p style={{ color: '#888' }}>Total Visits</p>
          </div>

        </div>
      )}

      {/* Recent Patients */}
      <div className="card">
        <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>🕐 Recent Patients</h3>
        {recent.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi patient nahi hai</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Naam</th>
                <th>Umar</th>
                <th>Phone</th>
                <th>Takleef</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(patient => (
                <tr key={patient.id}>
                  <td><strong style={{ color: '#2c7be5' }}>#{patient.token}</strong></td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.problem}</td>
                  <td>{patient.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Admin