import { useNavigate } from 'react-router-dom'

function Unauthorized() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')

  const goHome = () => {
    if (role === 'admin') navigate('/admin')
    else if (role === 'doctor') navigate('/doctor')
    else if (role === 'reception') navigate('/')
    else navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '60px' }}>🚫</div>
        <h2 style={{ color: '#e53e2c', marginTop: '15px' }}>Access Nahi Hai!</h2>
        <p style={{ color: '#888', marginTop: '10px' }}>
          Aapke role ke liye ye page allowed nahi hai.
        </p>
        <button
          className="btn-primary"
          style={{ marginTop: '20px', width: 'auto', padding: '10px 30px' }}
          onClick={goHome}
        >
          Apne Dashboard Pe Jao
        </button>
      </div>
    </div>
  )
}

export default Unauthorized