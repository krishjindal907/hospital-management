import { useState } from 'react'

function Reception() {
  const [formData, setFormData] = useState({
    name: '', age: '', phone: '', gender: '', problem: ''
  })
  const [token, setToken] = useState(null)

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

  return (
    <>
      

      <div className="page">
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
      </div>
    </>
  )
}

export default Reception