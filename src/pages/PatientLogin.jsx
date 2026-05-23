import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function PatientLogin() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', age: '', gender: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.phone, password: formData.password })
      })
      const data = await response.json()

      if (data.success && data.role === 'patient') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('username', data.username)
        localStorage.setItem('hospital', data.hospital)
        navigate('/patient')
      } else {
        setError('❌ Wrong phone ya password!')
      }
    } catch (err) {
      setError('❌ Server se connect nahi ho pa raha!')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/patient/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        setIsRegister(false)
        setError('')
        alert('✅ Registration ho gaya! Ab login karo.')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('❌ Server se connect nahi ho pa raha!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '50px' }}>🏥</div>
          <h1 style={{ color: '#2c7be5', fontSize: '22px', marginTop: '10px' }}>Patient Portal</h1>
          <p style={{ color: '#888', marginTop: '5px' }}>
            {isRegister ? 'Naya account banao' : 'Apne account mein login karo'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '20px', background: '#f0f4f8', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: !isRegister ? 'white' : 'transparent',
              color: !isRegister ? '#2c7be5' : '#888',
              fontWeight: !isRegister ? '600' : '400',
              boxShadow: !isRegister ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: isRegister ? 'white' : 'transparent',
              color: isRegister ? '#2c7be5' : '#888',
              fontWeight: isRegister ? '600' : '400',
              boxShadow: isRegister ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {!isRegister ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input className="input" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input className="input" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            {error && <p style={{ color: '#e53e2c', textAlign: 'center' }}>{error}</p>}
            <button className="btn-primary" type="submit">{loading ? '⏳...' : 'Login Karo'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input className="input" name="name" placeholder="Aapka Naam" value={formData.name} onChange={handleChange} required />
            <input className="input" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input className="input" name="age" placeholder="Umar" type="number" value={formData.age} onChange={handleChange} required />
            <select className="input" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Gender Select Karo</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input className="input" name="password" type="password" placeholder="Password banao" value={formData.password} onChange={handleChange} required />
            {error && <p style={{ color: '#e53e2c', textAlign: 'center' }}>{error}</p>}
            <button className="btn-primary" type="submit">{loading ? '⏳...' : 'Register Karo'}</button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
          Staff login? <a href="/login" style={{ color: '#2c7be5' }}>Yahan click karo</a>
        </p>
      </div>
    </div>
  )
}

export default PatientLogin