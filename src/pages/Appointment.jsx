import { useState, useEffect } from 'react'

function Appointment() {
  const [activeTab, setActiveTab] = useState('book')
  const [appointments, setAppointments] = useState([])
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    doctor: '',
    date: '',
    time: '',
    problem: ''
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = () => {
    fetch('http://localhost:5000/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    if (data.success) setSaved(true)
  }

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/appointment/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchAppointments()
  }

  const deleteAppointment = async (id) => {
    await fetch(`http://localhost:5000/appointment/${id}`, { method: 'DELETE' })
    fetchAppointments()
  }

  const statusColor = (status) => {
    if (status === 'Confirmed') return { background: '#e8f5e9', color: '#28a745' }
    if (status === 'Cancelled') return { background: '#ffeaea', color: '#e53e2c' }
    return { background: '#fff3cd', color: '#856404' }
  }

  return (
    <div className="page">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button
          onClick={() => { setActiveTab('book'); setSaved(false) }}
          className="btn-primary"
          style={{ width: 'auto', background: activeTab === 'book' ? '#2c7be5' : '#6c757d' }}
        >
          📅 Appointment Lo
        </button>
        <button
          onClick={() => { setActiveTab('view'); fetchAppointments() }}
          className="btn-primary"
          style={{ width: 'auto', background: activeTab === 'view' ? '#2c7be5' : '#6c757d' }}
        >
          📋 Appointments Dekho
        </button>
      </div>

      {/* Book Appointment */}
      {activeTab === 'book' && (
        <div className="card" style={{ maxWidth: '550px', margin: '0 auto' }}>

          {saved ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '60px' }}>✅</div>
              <h2 style={{ color: '#28a745', marginTop: '15px' }}>Appointment Book Ho Gaya!</h2>
              <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '20px 0', textAlign: 'left' }}>
                <p><strong>👤 Naam:</strong> {formData.patient_name}</p>
                <p><strong>👨‍⚕️ Doctor:</strong> {formData.doctor}</p>
                <p><strong>📅 Date:</strong> {formData.date}</p>
                <p><strong>⏰ Time:</strong> {formData.time}</p>
                <p><strong>📞 Phone:</strong> {formData.phone}</p>
              </div>
              <button
                className="btn-primary"
                style={{ width: 'auto', padding: '10px 30px' }}
                onClick={() => { setSaved(false); setFormData({ patient_name: '', phone: '', doctor: '', date: '', time: '', problem: '' }) }}
              >
                New Appointment
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ color: '#2c7be5', marginBottom: '25px' }}>📅 Appointment Book Karo</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <input
                  className="input"
                  name="patient_name"
                  placeholder="Aapka Naam"
                  value={formData.patient_name}
                  onChange={handleChange}
                  required
                />

                <input
                  className="input"
                  name="phone"
                  placeholder="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <select
                  className="input"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Doctor Select Karo</option>
                  <option value="Dr. Sharma">Dr. Sharma — General</option>
                  <option value="Dr. Gupta">Dr. Gupta — Cardiology</option>
                  <option value="Dr. Singh">Dr. Singh — Orthopedic</option>
                  <option value="Dr. Verma">Dr. Verma — Pediatric</option>
                </select>

                <input
                  className="input"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />

                <select
                  className="input"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Time Select Karo</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>

                <textarea
                  className="input"
                  name="problem"
                  placeholder="Takleef batao (optional)..."
                  value={formData.problem}
                  onChange={handleChange}
                  rows={3}
                />

                <button className="btn-primary" type="submit">
                  📅 Appointment Book Karo
                </button>

              </form>
            </>
          )}
        </div>
      )}

      {/* View Appointments */}
      {activeTab === 'view' && (
        <div className="card">
          <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>
            📋 Saari Appointments
            <span style={{ marginLeft: '15px', fontSize: '16px', background: '#e8f0fe', color: '#2c7be5', padding: '4px 12px', borderRadius: '20px' }}>
              {appointments.length} total
            </span>
          </h2>

          {appointments.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>⏳ Koi appointment nahi hai</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.patient_name}</td>
                    <td>{apt.phone}</td>
                    <td>{apt.doctor}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontWeight: '600', ...statusColor(apt.status) }}>
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '5px' }}>
                      {apt.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(apt.id, 'Confirmed')}
                            style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            ✅ Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(apt.id, 'Cancelled')}
                            style={{ background: '#e53e2c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="btn-danger"
                        style={{ fontSize: '12px' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default Appointment