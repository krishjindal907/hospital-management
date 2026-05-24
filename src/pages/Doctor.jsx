import { useState, useEffect } from 'react'

function Doctor() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchPatients = () => {
      fetch('http://localhost:5000/patients')
        .then(res => res.json())
        .then(data => setPatients(data))
    }
    fetchPatients()
    const interval = setInterval(fetchPatients, 3000)
    return () => clearInterval(interval)
  }, [])

  const deletePatient = async (id) => {
    await fetch(`http://localhost:5000/patients/${id}`, { method: 'DELETE' })
    setPatients(patients.filter(p => p.id !== id))
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.problem.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page">
        <div className="card">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#2c7be5' }}>Patient Queue</h2>
            <span style={{ background: '#e8f0fe', color: '#2c7be5', padding: '6px 16px', borderRadius: '20px', fontWeight: '600' }}>
              Total: {patients.length}
            </span>
          </div>

          {/* Search Box */}
          <input
            className="input"
            placeholder="🔍 Patient naam, phone ya takleef search karo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: '20px' }}
          />

          {filteredPatients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
              <div style={{ fontSize: '50px' }}>{search ? '🔍' : '⏳'}</div>
              <p style={{ marginTop: '15px', fontSize: '18px' }}>
                {search ? 'Koi patient nahi mila!' : 'Koi patient abhi nahi hai'}
              </p>
            </div>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td><strong style={{ color: '#2c7be5' }}>#{patient.token}</strong></td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.problem}</td>
                    <td>{patient.time}</td>
                    <td>
                      <button className="btn-danger" onClick={() => deletePatient(patient.id)}>
                        ✅ Done
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

export default Doctor