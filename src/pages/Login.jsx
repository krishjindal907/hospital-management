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
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#2c7be5' }}>🏥 Hospital Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <select value={role} onChange={e => setRole(e.target.value)} required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}>
          <option value="">Role Select Karo</option>
          <option value="reception">Reception</option>
          <option value="doctor">Doctor</option>
        </select>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit"
          style={{ padding: '12px', background: '#2c7be5', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
          Login Karo 🔐
        </button>
      </form>
      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px', fontSize: '14px' }}>
        <p>👩‍💼 Reception password: <strong>1234</strong></p>
        <p>👨‍⚕️ Doctor password: <strong>5678</strong></p>
      </div>
    </div>
  )
}

export default Login