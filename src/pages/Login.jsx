import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (role === 'reception' && password === '1234') {
      navigate('/')
    } else if (role === 'doctor' && password === '5678') {
      navigate('/doctor')
    } else {
      setError('❌ Wrong password!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '50px' }}>🏥</div>
          <h1 style={{ color: '#2c7be5', fontSize: '24px', marginTop: '10px' }}>Hospital Management</h1>
          <p style={{ color: '#888', marginTop: '5px' }}>Apna role select karke login karein</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <select
            className="input"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            <option value="">Role Select Karo</option>
            <option value="reception">👩‍💼 Reception</option>
            <option value="doctor">👨‍⚕️ Doctor</option>
          </select>

          <input
            className="input"
            type="password"
            placeholder="Password daalo"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p style={{ color: '#e53e2c', textAlign: 'center', fontWeight: '500' }}>{error}</p>
          )}

          <button className="btn-primary" type="submit">
            Login Karo 🔐
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
          <p>👩‍💼 Reception: <strong>1234</strong></p>
          <p style={{ marginTop: '5px' }}>👨‍⚕️ Doctor: <strong>5678</strong></p>
        </div>

      </div>
    </div>
  )
}

export default Login