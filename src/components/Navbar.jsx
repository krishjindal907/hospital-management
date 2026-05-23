import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')
  const hospital = localStorage.getItem('hospital')

  // Har role ke alag links
  const adminLinks = [
    { path: '/admin', label: '📊 Dashboard' },
    { path: '/admin/staff', label: '👥 Staff' },
    { path: '/admin/hospitals', label: '🏥 Hospitals' },
  ]

  const doctorLinks = [
    { path: '/doctor', label: '👨‍⚕️ Patients' },
    { path: '/prescription', label: '💊 Prescription' },
    { path: '/history', label: '📋 History' },
    { path: '/lab', label: '🔬 Lab Reports' },
  ]

  const receptionLinks = [
    { path: '/', label: '👩‍💼 Registration' },
    { path: '/appointment', label: '📅 Appointment' },
    { path: '/history', label: '📋 History' },
  ]

  const getLinks = () => {
    if (role === 'admin') return adminLinks
    if (role === 'doctor') return doctorLinks
    if (role === 'reception') return receptionLinks
    return []
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const roleLabel = () => {
    if (role === 'admin') return '👨‍💼 Admin'
    if (role === 'doctor') return '👨‍⚕️ Doctor'
    if (role === 'reception') return '👩‍💼 Reception'
    return ''
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

      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', alignItems: 'center' }}>
        {getLinks().map(link => (
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
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', background: 'rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '6px' }}>
            {roleLabel()} — {username}
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