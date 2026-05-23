import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)
      localStorage.setItem('hospital', data.hospital)

      if (data.role === 'admin') navigate('/admin')
      else if (data.role === 'doctor') navigate('/doctor')
      else navigate('/')
    } else {
      setError(data.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px' }}>🏥</div>
          <h1 style={{ color: '#2c7be5', fontSize: '24px', marginTop: '10px' }}>Hospital Management</h1>
          <p style={{ color: '#888', marginTop: '5px' }}>Login karein</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: '#e53e2c', textAlign: 'center' }}>{error}</p>}

          <button className="btn-primary" type="submit">
            {loading ? '⏳ Loading...' : 'Login Karo 🔐'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
          <p>👩‍💼 Reception: <strong>reception / reception123</strong></p>
          <p style={{ marginTop: '5px' }}>👨‍⚕️ Doctor: <strong>doctor / doctor123</strong></p>
          <p style={{ marginTop: '5px' }}>📊 Admin: <strong>admin / admin123</strong></p>
        </div>

      </div>
    </div>
  )
}

export default Login