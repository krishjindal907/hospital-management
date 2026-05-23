import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Reception from './pages/Reception'
import Doctor from './pages/Doctor'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Reception />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App