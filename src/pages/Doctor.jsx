import { useState, useEffect } from 'react'

function Doctor() {
  const [patients, setPatients] = useState([])

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

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2c7be5', textAlign: 'center' }}>👨‍⚕️ Doctor Dashboard</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Total Patients: <strong>{patients.length}</strong></p>

      {patients.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>⏳ Koi patient abhi nahi hai...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#2c7be5', color: 'white' }}>
              <th style={{ padding: '12px' }}>Token</th>
              <th style={{ padding: '12px' }}>Naam</th>
              <th style={{ padding: '12px' }}>Umar</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Takleef</th>
              <th style={{ padding: '12px' }}>Time</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} style={{ background: patient.id % 2 === 0 ? '#f5f5f5' : 'white' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#2c7be5' }}>#{patient.token}</td>
                <td style={{ padding: '12px' }}>{patient.name}</td>
                <td style={{ padding: '12px' }}>{patient.age}</td>
                <td style={{ padding: '12px' }}>{patient.phone}</td>
                <td style={{ padding: '12px' }}>{patient.problem}</td>
                <td style={{ padding: '12px' }}>{patient.time}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => deletePatient(patient.id)}
                    style={{ padding: '5px 10px', background: '#e53e2c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    ✅ Done
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Doctor