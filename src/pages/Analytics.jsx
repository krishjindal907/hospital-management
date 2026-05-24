import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

const COLORS = ['#2c7be5', '#28a745', '#fd7e14', '#6f42c1', '#e53e2c']

function Analytics() {
  const [stats, setStats] = useState(null)
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [labReports, setLabReports] = useState([])
  const [prescriptions, setPrescriptions] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))

    fetch('http://localhost:5000/patients')
      .then(res => res.json())
      .then(data => setPatients(data))

    fetch('http://localhost:5000/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))

    fetch('http://localhost:5000/lab-reports')
      .then(res => res.json())
      .then(data => setLabReports(data))

    fetch('http://localhost:5000/prescriptions')
      .then(res => res.json())
      .then(data => setPrescriptions(data))
  }, [])

  // Gender distribution
  const genderData = [
    { name: 'Male', value: patients.filter(p => p.gender === 'Male').length },
    { name: 'Female', value: patients.filter(p => p.gender === 'Female').length },
    { name: 'Other', value: patients.filter(p => p.gender === 'Other').length },
  ].filter(d => d.value > 0)

  // Appointment status
  const appointmentData = [
    { name: 'Pending', value: appointments.filter(a => a.status === 'Pending').length },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length },
  ].filter(d => d.value > 0)

  // Lab report status
  const labData = [
    { name: 'Normal', value: labReports.filter(r => r.status === 'Normal').length },
    { name: 'Abnormal', value: labReports.filter(r => r.status === 'Abnormal').length },
    { name: 'Critical', value: labReports.filter(r => r.status === 'Critical').length },
  ].filter(d => d.value > 0)

  // Doctor wise appointments
  const doctorData = appointments.reduce((acc, apt) => {
    const existing = acc.find(d => d.name === apt.doctor)
    if (existing) existing.appointments++
    else acc.push({ name: apt.doctor, appointments: 1 })
    return acc
  }, [])

  // Overview stats
  const overviewData = [
    { name: 'Patients', value: patients.length, color: '#2c7be5' },
    { name: 'Appointments', value: appointments.length, color: '#28a745' },
    { name: 'Prescriptions', value: prescriptions.length, color: '#fd7e14' },
    { name: 'Lab Reports', value: labReports.length, color: '#6f42c1' },
  ]

  return (
    <div className="page">
      <h2 style={{ color: '#2c7be5', marginBottom: '25px' }}>📊 Reports & Analytics</h2>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {overviewData.map(item => (
          <div key={item.name} className="card" style={{ textAlign: 'center', borderTop: `4px solid ${item.color}` }}>
            <h1 style={{ fontSize: '40px', color: item.color, margin: '10px 0' }}>{item.value}</h1>
            <p style={{ color: '#888' }}>{item.name}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Gender Pie Chart */}
        <div className="card">
          <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>👥 Patient Gender Distribution</h3>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {genderData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Data nahi hai</p>
          )}
        </div>

        {/* Appointment Status */}
        <div className="card">
          <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>📅 Appointment Status</h3>
          {appointmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={appointmentData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {appointmentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Data nahi hai</p>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Doctor wise appointments */}
        <div className="card">
          <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>👨‍⚕️ Doctor wise Appointments</h3>
          {doctorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={doctorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#2c7be5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Data nahi hai</p>
          )}
        </div>

        {/* Lab Report Status */}
        <div className="card">
          <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>🔬 Lab Report Status</h3>
          {labData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={labData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {labData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Data nahi hai</p>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="card">
        <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>📋 Quick Summary</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>👥 Total Patients</td>
              <td><strong>{patients.length}</strong></td>
              <td><span style={{ color: '#28a745' }}>✅ Active</span></td>
            </tr>
            <tr>
              <td>📅 Appointments</td>
              <td><strong>{appointments.length}</strong></td>
              <td><span style={{ color: '#2c7be5' }}>{appointments.filter(a => a.status === 'Confirmed').length} Confirmed</span></td>
            </tr>
            <tr>
              <td>💊 Prescriptions</td>
              <td><strong>{prescriptions.length}</strong></td>
              <td><span style={{ color: '#28a745' }}>✅ Saved</span></td>
            </tr>
            <tr>
              <td>🔬 Lab Reports</td>
              <td><strong>{labReports.length}</strong></td>
              <td><span style={{ color: '#e53e2c' }}>{labReports.filter(r => r.status === 'Critical').length} Critical</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analytics