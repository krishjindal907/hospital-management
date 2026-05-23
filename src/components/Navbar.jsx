import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const username = localStorage.getItem('username')
  const hospital = localStorage.getItem('hospital')

  const links = [
    { path: '/', label: '👩‍💼 Reception' },
    { path: '/doctor', label: '👨‍⚕️ Doctor' },
    { path: '/prescription', label: '💊 Prescription' },
    { path: '/history', label: '📋 History' },
    { path: '/lab', label: '🔬 Lab' },
    { path: '/admin', label: '📊 Admin' },
    { path: '/appointment', label: '📅 Appointment' },
  ]

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={{
      background: '#2c7be5',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      flexWrap: 'wrap'
    }}>

      <h2 style={{ color: 'white', padding: '16px 0', fontSize: '18px' }}>
        🏥 {hospital || 'Hospital Management'}
      </h2>

      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path ? 'rgba(255,255,255,0.25)' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: location.pathname === link.path ? '600' : '400',
            }}
          >
            {link.label}
          </button>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
            👤 {username}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar