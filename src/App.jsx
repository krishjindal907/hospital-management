import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Reception from './pages/Reception'
import Doctor from './pages/Doctor'
import Login from './pages/Login'
import Prescription from './pages/Prescription'
import History from './pages/History'
import LabReport from './pages/LabReport'
import Admin from './pages/Admin'
import Appointment from './pages/Appointment'
import Unauthorized from './pages/Unauthorized'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function Layout() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login' || location.pathname === '/unauthorized'

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Reception */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['reception', 'admin']}>
            <Reception />
          </ProtectedRoute>
        } />
        <Route path="/appointment" element={
          <ProtectedRoute allowedRoles={['reception', 'admin']}>
            <Appointment />
          </ProtectedRoute>
        } />

        {/* Doctor */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <Doctor />
          </ProtectedRoute>
        } />
        <Route path="/prescription" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <Prescription />
          </ProtectedRoute>
        } />

        {/* Shared */}
        <Route path="/history" element={
          <ProtectedRoute allowedRoles={['doctor', 'reception', 'admin']}>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/lab" element={
          <ProtectedRoute allowedRoles={['doctor', 'reception', 'admin']}>
            <LabReport />
          </ProtectedRoute>
        } />

        {/* Admin Only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        } />

      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App