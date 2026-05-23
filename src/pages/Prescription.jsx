import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Prescription() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medicines, setMedicines] = useState([
    { name: '', dose: '', days: '' }
  ])
  const [notes, setNotes] = useState('')
  const [doctorName, setDoctorName] = useState('Dr. Sharma')
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
  }, [])

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dose: '', days: '' }])
  }

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        medicines,
        notes,
        doctor_name: doctorName
      })
    })
    const data = await response.json()
    if (data.success) setSaved(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
     

      <div className="page">

        {/* Patient Select */}
        {!selectedPatient ? (
          <div className="card">
            <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>💊 Patient Select Karo</h2>
            {patients.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>⏳ Koi patient nahi hai</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Naam</th>
                    <th>Umar</th>
                    <th>Takleef</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id}>
                      <td><strong style={{ color: '#2c7be5' }}>#{patient.token}</strong></td>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.problem}</td>
                      <td>
                        <button
                          className="btn-primary"
                          style={{ width: 'auto', padding: '6px 16px' }}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : saved ? (

          /* Prescription Print View */
          <div className="card" id="print-area">
            <div style={{ textAlign: 'center', borderBottom: '2px solid #2c7be5', paddingBottom: '15px', marginBottom: '20px' }}>
              <h1 style={{ color: '#2c7be5' }}>🏥 City Hospital</h1>
              <p style={{ color: '#666' }}>123 Main Street | Phone: 98765-43210</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p><strong>Patient:</strong> {selectedPatient.name}</p>
                <p><strong>Umar:</strong> {selectedPatient.age} saal</p>
                <p><strong>Takleef:</strong> {selectedPatient.problem}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p><strong>Token:</strong> #{selectedPatient.token}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Doctor:</strong> {doctorName}</p>
              </div>
            </div>

            <h3 style={{ color: '#2c7be5', marginBottom: '15px' }}>💊 Dawaiyan:</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Dawai ka Naam</th>
                  <th>Dose</th>
                  <th>Kitne Din</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{med.name}</td>
                    <td>{med.dose}</td>
                    <td>{med.days} din</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {notes && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <strong>📝 Notes:</strong> {notes}
              </div>
            )}

            <div style={{ marginTop: '40px', textAlign: 'right' }}>
              <p style={{ borderTop: '1px solid #333', display: 'inline-block', paddingTop: '5px' }}>
                {doctorName}
              </p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }} className="no-print">
              <button className="btn-primary" onClick={handlePrint}>
                🖨️ Print Karo
              </button>
              <button
                className="btn-primary"
                style={{ background: '#28a745' }}
                onClick={() => { setSaved(false); setSelectedPatient(null); setMedicines([{ name: '', dose: '', days: '' }]); setNotes('') }}
              >
                New Prescription
              </button>
            </div>
          </div>

        ) : (

          /* Prescription Form */
          <div className="card">
            <h2 style={{ color: '#2c7be5', marginBottom: '5px' }}>📝 Prescription Likho</h2>
            <p style={{ color: '#888', marginBottom: '25px' }}>
              Patient: <strong>{selectedPatient.name}</strong> | Token: <strong>#{selectedPatient.token}</strong>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <input
                className="input"
                placeholder="Doctor ka Naam"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                required
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3>💊 Dawaiyan</h3>
                  <button type="button" onClick={addMedicine}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                    + Add
                  </button>
                </div>

                {medicines.map((med, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      className="input"
                      placeholder="Dawai naam"
                      value={med.name}
                      onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      className="input"
                      placeholder="Dose"
                      value={med.dose}
                      onChange={e => handleMedicineChange(index, 'dose', e.target.value)}
                      required
                      style={{ width: '120px' }}
                    />
                    <input
                      className="input"
                      placeholder="Din"
                      type="number"
                      value={med.days}
                      onChange={e => handleMedicineChange(index, 'days', e.target.value)}
                      required
                      style={{ width: '80px' }}
                    />
                    {medicines.length > 1 && (
                      <button type="button" className="btn-danger" onClick={() => removeMedicine(index)}>✕</button>
                    )}
                  </div>
                ))}
              </div>

              <textarea
                className="input"
                placeholder="Extra notes (optional)..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" type="submit">
                  💾 Prescription Save Karo
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#6c757d' }}
                  onClick={() => setSelectedPatient(null)}
                >
                  ← Wapas
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default Prescription