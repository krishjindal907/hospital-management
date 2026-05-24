import { useState, useEffect } from 'react'

function Reception() {
  const [formData, setFormData] = useState({
    name: '', age: '', phone: '', gender: '', problem: ''
  })
  const [token, setToken] = useState(null)
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
  }, [token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
    setToken(data.token)
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.problem.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page">

        {/* Search Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 20px', background: showList ? '#6c757d' : '#2c7be5' }}
            onClick={() => setShowList(!showList)}
          >
            {showList ? '📝 Registration' : '🔍 Patient Search'}
          </button>
        </div>

        {/* Patient Search List */}
        {showList ? (
          <div className="card">
            <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>🔍 Patient Search</h2>
            <input
              className="input"
              placeholder="Naam, phone ya takleef search karo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            {filteredPatients.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>
                {search ? '❌ Koi patient nahi mila!' : '⏳ Koi patient nahi hai'}
              </p>
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
                  {filteredPatients.map(p => (
                    <tr key={p.id}>
                      <td><strong style={{ color: '#2c7be5' }}>#{p.token}</strong></td>
                      <td>{p.name}</td>
                      <td>{p.age}</td>
                      <td>{p.phone}</td>
                      <td>{p.problem}</td>
                      <td>{p.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          /* Registration Form */
          <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '25px', color: '#2c7be5' }}>🧾 Patient Registration</h2>

            {token ? (
              <div className="token-box">
                <p style={{ color: '#555', marginBottom: '10px' }}>Token Number</p>
                <div className="token-number">#{token}</div>
                <p style={{ marginTop: '15px', color: '#555' }}>
                  <strong>{formData.name}</strong> — Doctor abhi bulayenge
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: '25px', width: 'auto', padding: '10px 30px' }}
                  onClick={() => { setToken(null); setFormData({ name: '', age: '', phone: '', gender: '', problem: '' }) }}
                >
                  New Patient
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input className="input" name="name" placeholder="Patient ka Naam" value={formData.name} onChange={handleChange} required />
                <input className="input" name="age" placeholder="Umar (Age)" type="number" value={formData.age} onChange={handleChange} required />
                <input className="input" name="phone" placeholder="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
                <select className="input" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Gender Select Karo</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <textarea className="input" name="problem" placeholder="Bimari / Takleef batao..." value={formData.problem} onChange={handleChange} required rows={4} />
                <button className="btn-primary" type="submit">
                  Token Generate Karo 🎫
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Reception