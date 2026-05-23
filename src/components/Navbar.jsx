import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

 const links = [
  { path: '/', label: '👩‍💼 Reception' },
  { path: '/doctor', label: '👨‍⚕️ Doctor' },
  { path: '/prescription', label: '💊 Prescription' },
  { path: '/history', label: '📋 History' },
]
  return (
    <div style={{
      background: '#2c7be5',
      padding: '0 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>

      {/* Logo */}
      <h2 style={{ color: 'white', padding: '16px 0', fontSize: '20px' }}>
        🏥 Hospital Management
      </h2>

      {/* Links */}
      <div style={{ display: 'flex', gap: '5px' }}>
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path ? 'rgba(255,255,255,0.25)' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: location.pathname === link.path ? '600' : '400',
              transition: 'background 0.2s'
            }}
          >
            {link.label}
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '10px'
          }}
        >
          🚪 Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar