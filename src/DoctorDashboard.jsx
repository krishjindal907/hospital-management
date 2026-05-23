import { useState, useEffect } from 'react'

function DoctorDashboard() {
  const [patients, setPatients] = useState([])

  // Har 3 second mein automatically update hoga
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

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      
      <h1 style={{ color: '#2c7be5', textAlign: 'center' }}>
        🏥 Doctor Dashboard
      </h1>

      <p style={{ textAlign: 'center', color: '#666' }}>
        Total Patients: <strong>{patients.length}</strong>
      </p>

      {patients.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
          ⏳ Koi patient abhi nahi hai...
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#2c7be5', color: 'white' }}>
              <th style={th}>Token</th>
              <th style={th}>Naam</th>
              <th style={th}>Umar</th>
              <th style={th}>Phone</th>
              <th style={th}>Gender</th>
              <th style={th}>Takleef</th>
              <th style={th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} style={{ background: patient.id % 2 === 0 ? '#f5f5f5' : 'white' }}>
                <td style={{ ...td, fontWeight: 'bold', color: '#2c7be5' }}>#{patient.token}</td>
                <td style={td}>{patient.name}</td>
                <td style={td}>{patient.age}</td>
                <td style={td}>{patient.phone}</td>
                <td style={td}>{patient.gender}</td>
                <td style={td}>{patient.problem}</td>
                <td style={td}>{patient.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Styles
const th = { padding: '12px', textAlign: 'left', fontWeight: 'bold' }
const td = { padding: '12px', borderBottom: '1px solid #eee' }

export default DoctorDashboard