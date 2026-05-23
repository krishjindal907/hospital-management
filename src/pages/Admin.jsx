import { useState, useEffect } from 'react'

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [staff, setStaff] = useState([])
  const [newStaff, setNewStaff] = useState({ username: '', password: '', role: 'reception', hospital: 'City Hospital' })
  const [message, setMessage] = useState('')
  const [changePassword, setChangePassword] = useState({ id: null, password: '' })

  useEffect(() => {
    fetchStats()
    fetchStaff()
  }, [])

  const fetchStats = () => {
    fetch('http://localhost:5000/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))

    fetch('http://localhost:5000/admin/recent')
      .then(res => res.json())
      .then(data => setRecent(data))
  }

  const fetchStaff = () => {
    fetch('http://localhost:5000/admin/staff')
      .then(res => res.json())
      .then(data => setStaff(data))
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff)
    })
    const data = await response.json()
    setMessage(data.message)
    if (data.success) {
      fetchStaff()
      setNewStaff({ username: '', password: '', role: 'reception', hospital: 'City Hospital' })
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Kya aap sure hain?')) return
    await fetch(`http://localhost:5000/admin/staff/${id}`, { method: 'DELETE' })
    fetchStaff()
  }

  const handleChangePassword = async (id) => {
    if (!changePassword.password) return
    const response = await fetch(`http://localhost:5000/admin/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: changePassword.password })
    })
    const data = await response.json()
    setMessage(data.message)
    setChangePassword({ id: null, password: '' })
    setTimeout(() => setMessage(''), 3000)
  }

  const roleColor = (role) => {
    if (role === 'admin') return { background: '#e8f0fe', color: '#2c7be5' }
    if (role === 'doctor') return { background: '#e8f5e9', color: '#28a745' }
    if (role === 'reception') return { background: '#fff3cd', color: '#856404' }
    return { background: '#f0f0f0', color: '#666' }
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'staff', label: '👥 Staff Management' },
  ]

  return (
    <div>
      {/* Tabs */}
      <div style={{ background: 'white', padding: '0 20px', display: 'flex', gap: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px',
              borderBottom: activeTab === tab.id ? '3px solid #2c7be5' : '3px solid transparent',
              color: activeTab === tab.id ? '#2c7be5' : '#666',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="page">

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
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
                  <div style={{ fontSize: '40px' }}>👥</div>
                  <h1 style={{ fontSize: '40px', color: '#6f42c1', margin: '10px 0' }}>{staff.length}</h1>
                  <p style={{ color: '#888' }}>Total Staff</p>
                </div>
              </div>
            )}

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
          </>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <>
            {message && (
              <div style={{ padding: '12px 20px', background: message.includes('❌') ? '#ffeaea' : '#e8f5e9', borderRadius: '8px', marginBottom: '20px', color: message.includes('❌') ? '#e53e2c' : '#28a745', fontWeight: '500' }}>
                {message}
              </div>
            )}

            {/* Add Staff Form */}
            <div className="card" style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>➕ Naya Staff Add Karo</h3>
              <form onSubmit={handleAddStaff} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  className="input"
                  placeholder="Username"
                  value={newStaff.username}
                  onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                  required
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  value={newStaff.password}
                  onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                  required
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <select
                  className="input"
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                  style={{ flex: 1, minWidth: '150px' }}
                >
                  <option value="reception">👩‍💼 Reception</option>
                  <option value="doctor">👨‍⚕️ Doctor</option>
                  <option value="admin">👨‍💼 Admin</option>
                </select>
                <input
                  className="input"
                  placeholder="Hospital naam"
                  value={newStaff.hospital}
                  onChange={e => setNewStaff({ ...newStaff, hospital: e.target.value })}
                  required
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <button className="btn-primary" type="submit" style={{ width: 'auto', padding: '10px 25px' }}>
                  ➕ Add Karo
                </button>
              </form>
            </div>

            {/* Staff List */}
            <div className="card">
              <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>
                👥 Staff List
                <span style={{ marginLeft: '15px', fontSize: '14px', background: '#e8f0fe', color: '#2c7be5', padding: '4px 12px', borderRadius: '20px' }}>
                  {staff.length} members
                </span>
              </h3>

              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Hospital</th>
                    <th>Password Change</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map(member => (
                    <tr key={member.id}>
                      <td><strong>{member.username}</strong></td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontWeight: '600', ...roleColor(member.role) }}>
                          {member.role}
                        </span>
                      </td>
                      <td>{member.hospital}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {changePassword.id === member.id ? (
                            <>
                              <input
                                className="input"
                                type="password"
                                placeholder="Naya password"
                                value={changePassword.password}
                                onChange={e => setChangePassword({ ...changePassword, password: e.target.value })}
                                style={{ width: '140px', padding: '6px 10px' }}
                              />
                              <button
                                onClick={() => handleChangePassword(member.id)}
                                style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                              >
                                ✅ Save
                              </button>
                              <button
                                onClick={() => setChangePassword({ id: null, password: '' })}
                                style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setChangePassword({ id: member.id, password: '' })}
                              style={{ background: '#fd7e14', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                            >
                              🔑 Change
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-danger"
                          onClick={() => handleDeleteStaff(member.id)}
                          style={{ fontSize: '12px' }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin