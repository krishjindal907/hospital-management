import { useState } from 'react'

function History() {
  const [phone, setPhone] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setData(null)

    const response = await fetch(`http://localhost:5000/history/${phone}`)
    const result = await response.json()

    if (result.visits.length === 0) {
      setError('❌ Is phone number ka koi record nahi mila!')
    } else {
      setData(result)
    }
    setLoading(false)
  }

  return (
    <div className="page">

      {/* Search Box */}
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto 30px' }}>
        <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>🔍 Patient History</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            className="input"
            placeholder="Phone number daalo..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit" style={{ width: 'auto', padding: '10px 20px' }}>
            {loading ? '...' : 'Search'}
          </button>
        </form>
        {error && <p style={{ color: '#e53e2c', marginTop: '15px' }}>{error}</p>}
      </div>

      {data && (
        <>
          {/* Patient Info */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#2c7be5', marginBottom: '15px' }}>👤 Patient Info</h3>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <p><strong>Naam:</strong> {data.visits[0].name}</p>
              <p><strong>Umar:</strong> {data.visits[0].age} saal</p>
              <p><strong>Phone:</strong> {data.visits[0].phone}</p>
              <p><strong>Gender:</strong> {data.visits[0].gender}</p>
            </div>
          </div>

          {/* Visit History */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#2c7be5', marginBottom: '15px' }}>
              🏥 Visit History ({data.visits.length} visits)
            </h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Takleef</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.visits.map(visit => (
                  <tr key={visit.id}>
                    <td><strong style={{ color: '#2c7be5' }}>#{visit.token}</strong></td>
                    <td>{visit.problem}</td>
                    <td>{visit.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prescription History */}
          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '15px' }}>
              💊 Prescription History ({data.prescriptions.length} prescriptions)
            </h3>

            {data.prescriptions.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
                Koi prescription nahi hai
              </p>
            ) : (
              data.prescriptions.map(pres => (
                <div key={pres.id} style={{
                  border: '1px solid #eef1f6',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <p><strong>Doctor:</strong> {pres.doctor_name}</p>
                    <p style={{ color: '#888' }}>{pres.date}</p>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Dawai</th>
                        <th>Dose</th>
                        <th>Din</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pres.medicines.map((med, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{med.name}</td>
                          <td>{med.dose}</td>
                          <td>{med.days} din</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {pres.notes && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
                      <strong>📝 Notes:</strong> {pres.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default History