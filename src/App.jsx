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
import PatientLogin from './pages/PatientLogin'
import PatientDashboard from './pages/PatientDashboard'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

function Layout() {
  const location = useLocation()
  const hideNavbar = 
    location.pathname === '/login' || 
    location.pathname === '/unauthorized' ||
    location.pathname === '/patient/login' ||
    location.pathname.startsWith('/patient')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
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