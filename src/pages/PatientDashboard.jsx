import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments')
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [labReports, setLabReports] = useState([])
  const [visits, setVisits] = useState([])
  const [bookForm, setBookForm] = useState({ doctor: '', date: '', time: '', problem: '' })
  const [booked, setBooked] = useState(false)

  const phone = localStorage.getItem('username')
  const navigate = useNavigate()

  useEffect(() => {
    // Patient ka data load karo
    fetch(`http://localhost:5000/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data.filter(a => a.phone === phone)))

    fetch(`http://localhost:5000/history/${phone}`)
      .then(res => res.json())
      .then(data => {
        setVisits(data.visits || [])
        setPrescriptions(data.prescriptions || [])
      })

    fetch(`http://localhost:5000/lab-reports/${phone}`)
      .then(res => res.json())
      .then(data => setLabReports(data))
  }, [])

  const handleBook = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: localStorage.getItem('username'),
        phone,
        ...bookForm
      })
    })
    const data = await response.json()
    if (data.success) setBooked(true)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/patient/login')
  }

  const tabs = [
    { id: 'appointments', label: '📅 Appointments' },
    { id: 'book', label: '➕ Book Appointment' },
    { id: 'prescriptions', label: '💊 Prescriptions' },
    { id: 'lab', label: '🔬 Lab Reports' },
    { id: 'visits', label: '📋 Visit History' },
  ]

  return (
    <div>
      {/* Navbar */}
      <div style={{ background: '#2c7be5', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', padding: '16px 0', fontSize: '18px' }}>🏥 Patient Portal</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'white', fontSize: '13px' }}>📞 {phone}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', padding: '0 20px', display: 'flex', gap: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setBooked(false) }}
            style={{
              padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
              borderBottom: activeTab === tab.id ? '3px solid #2c7be5' : '3px solid transparent',
              color: activeTab === tab.id ? '#2c7be5' : '#666',
              fontWeight: activeTab === tab.id ? '600' : '400',
              whiteSpace: 'nowrap'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="page">

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>📅 Meri Appointments</h3>
            {appointments.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi appointment nahi hai</p>
            ) : (
              <table className="table">
                <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>{apt.doctor}</td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td><span style={{ padding: '3px 10px', borderRadius: '12px', background: apt.status === 'Confirmed' ? '#e8f5e9' : '#fff3cd', color: apt.status === 'Confirmed' ? '#28a745' : '#856404', fontWeight: '600' }}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Book Appointment */}
        {activeTab === 'book' && (
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>➕ Appointment Book Karo</h3>
            {booked ? (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <div style={{ fontSize: '50px' }}>✅</div>
                <h3 style={{ color: '#28a745', marginTop: '15px' }}>Appointment Book Ho Gaya!</h3>
                <button className="btn-primary" style={{ marginTop: '20px', width: 'auto', padding: '10px 25px' }} onClick={() => { setBooked(false); setActiveTab('appointments') }}>Appointments Dekho</button>
              </div>
            ) : (
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select className="input" value={bookForm.doctor} onChange={e => setBookForm({ ...bookForm, doctor: e.target.value })} required>
                  <option value="">Doctor Select Karo</option>
                  <option value="Dr. Sharma">Dr. Sharma — General</option>
                  <option value="Dr. Gupta">Dr. Gupta — Cardiology</option>
                  <option value="Dr. Singh">Dr. Singh — Orthopedic</option>
                  <option value="Dr. Verma">Dr. Verma — Pediatric</option>
                </select>
                <input className="input" type="date" value={bookForm.date} onChange={e => setBookForm({ ...bookForm, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} />
                <select className="input" value={bookForm.time} onChange={e => setBookForm({ ...bookForm, time: e.target.value })} required>
                  <option value="">Time Select Karo</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
                <textarea className="input" placeholder="Takleef batao..." value={bookForm.problem} onChange={e => setBookForm({ ...bookForm, problem: e.target.value })} rows={3} />
                <button className="btn-primary" type="submit">📅 Book Karo</button>
              </form>
            )}
          </div>
        )}

        {/* Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>💊 Meri Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi prescription nahi hai</p>
            ) : (
              prescriptions.map(pres => (
                <div key={pres.id} style={{ border: '1px solid #eef1f6', borderRadius: '10px', padding: '20px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <p><strong>Doctor:</strong> {pres.doctor_name}</p>
                    <p style={{ color: '#888' }}>{pres.date}</p>
                  </div>
                  <table className="table">
                    <thead><tr><th>#</th><th>Dawai</th><th>Dose</th><th>Din</th></tr></thead>
                    <tbody>
                      {pres.medicines.map((med, i) => (
                        <tr key={i}><td>{i + 1}</td><td>{med.name}</td><td>{med.dose}</td><td>{med.days} din</td></tr>
                      ))}
                    </tbody>
                  </table>
                  {pres.notes && <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}><strong>📝 Notes:</strong> {pres.notes}</div>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Lab Reports */}
        {activeTab === 'lab' && (
          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>🔬 Meri Lab Reports</h3>
            {labReports.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi lab report nahi hai</p>
            ) : (
              <table className="table">
                <thead><tr><th>Date</th><th>Test</th><th>Result</th><th>Normal Range</th><th>Status</th></tr></thead>
                <tbody>
                  {labReports.map(r => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>{r.test_name}</td>
                      <td><strong>{r.result}</strong></td>
                      <td>{r.normal_range}</td>
                      <td><span style={{ padding: '3px 10px', borderRadius: '12px', background: r.status === 'Normal' ? '#e8f5e9' : '#ffeeba', color: r.status === 'Normal' ? '#28a745' : '#856404', fontWeight: '600' }}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Visit History */}
        {activeTab === 'visits' && (
          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>📋 Meri Visit History</h3>
            {visits.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi visit nahi hai</p>
            ) : (
              <table className="table">
                <thead><tr><th>Token</th><th>Takleef</th><th>Time</th></tr></thead>
                <tbody>
                  {visits.map(v => (
                    <tr key={v.id}>
                      <td><strong style={{ color: '#2c7be5' }}>#{v.token}</strong></td>
                      <td>{v.problem}</td>
                      <td>{v.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default PatientDashboard