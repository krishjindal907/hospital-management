import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Reception from './pages/Reception'
import Doctor from './pages/Doctor'
import Login from './pages/Login'
import Prescription from './pages/Prescription'
import History from './pages/History'
import Navbar from './components/Navbar'

function Layout() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login'

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Reception />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/history" element={<History />} />
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