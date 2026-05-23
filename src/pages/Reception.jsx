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
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#2c7be5' }}>🏥 Hospital Reception</h1>

      {token ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#e8f5e9', borderRadius: '10px' }}>
          <h2>✅ Registration Complete!</h2>
          <h1 style={{ fontSize: '60px', color: '#2c7be5' }}>#{token}</h1>
          <p>Yahi aapka Token Number hai</p>
          <p><strong>{formData.name}</strong> — Doctor abhi bulayenge</p>
          <button
            onClick={() => { setToken(null); setFormData({ name: '', age: '', phone: '', gender: '', problem: '' }) }}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#2c7be5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            New Patient
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input name="name" placeholder="Patient ka Naam" value={formData.name} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <input name="age" placeholder="Umar (Age)" type="number" value={formData.age} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <input name="phone" placeholder="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <select name="gender" value={formData.gender} onChange={handleChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}>
            <option value="">Gender Select Karo</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <textarea name="problem" placeholder="Bimari / Takleef batao..." value={formData.problem} onChange={handleChange} required rows={4} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
          <button type="submit" style={{ padding: '12px', background: '#2c7be5', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
            Token Generate Karo 🎫
          </button>
        </form>
      )}
    </div>
  )
}

export default Reception