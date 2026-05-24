import { useState, useEffect } from 'react'

const SERVICES = [
  { name: 'OPD Consultation', price: 500 },
  { name: 'Blood Test (CBC)', price: 300 },
  { name: 'X-Ray', price: 800 },
  { name: 'ECG', price: 600 },
  { name: 'Urine Test', price: 200 },
  { name: 'Blood Sugar Test', price: 150 },
  { name: 'Blood Pressure Check', price: 100 },
  { name: 'Dressing', price: 250 },
  { name: 'Injection', price: 150 },
  { name: 'Ultrasound', price: 1500 },
]

function Billing() {
  const [activeTab, setActiveTab] = useState('create')
  const [patients, setPatients] = useState([])
  const [bills, setBills] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [customService, setCustomService] = useState({ name: '', price: '' })
  const [saved, setSaved] = useState(false)
  const [savedBill, setSavedBill] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
    fetchBills()
  }, [])

  const fetchBills = () => {
    fetch('http://localhost:5000/bills')
      .then(res => res.json())
      .then(data => setBills(data.map(b => ({ ...b, services: JSON.parse(b.services) }))))
  }

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.name === service.name)
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.name !== service.name))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const addCustomService = () => {
    if (!customService.name || !customService.price) return
    setSelectedServices([...selectedServices, { name: customService.name, price: parseInt(customService.price) }])
    setCustomService({ name: '', price: '' })
  }

  const total = selectedServices.reduce((sum, s) => sum + s.price, 0)

  const handleSubmit = async () => {
    if (!selectedPatient || selectedServices.length === 0) return
    const response = await fetch('http://localhost:5000/bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: selectedPatient.name,
        phone: selectedPatient.phone,
        services: selectedServices,
        total
      })
    })
    const data = await response.json()
    if (data.success) {
      setSavedBill({ patient: selectedPatient, services: selectedServices, total })
      setSaved(true)
      fetchBills()
    }
  }

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/bill/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchBills()
  }

  const deleteBill = async (id) => {
    if (!window.confirm('Delete karna chahte ho?')) return
    await fetch(`http://localhost:5000/bill/${id}`, { method: 'DELETE' })
    fetchBills()
  }

  const handlePrint = () => window.print()

  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.total, 0)
  const unpaidTotal = bills.filter(b => b.status === 'Unpaid').reduce((sum, b) => sum + b.total, 0)

  return (
    <div className="page">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button onClick={() => { setActiveTab('create'); setSaved(false) }}
          className="btn-primary" style={{ width: 'auto', background: activeTab === 'create' ? '#2c7be5' : '#6c757d' }}>
          ➕ Bill Banao
        </button>
        <button onClick={() => { setActiveTab('view'); fetchBills() }}
          className="btn-primary" style={{ width: 'auto', background: activeTab === 'view' ? '#2c7be5' : '#6c757d' }}>
          📋 Saare Bills
        </button>
      </div>

      {/* Create Bill */}
      {activeTab === 'create' && (
        <>
          {saved && savedBill ? (
            /* Print View */
            <div className="card" id="print-area">
              <div style={{ textAlign: 'center', borderBottom: '2px solid #2c7be5', paddingBottom: '15px', marginBottom: '20px' }}>
                <h1 style={{ color: '#2c7be5' }}>🏥 City Hospital</h1>
                <p style={{ color: '#666' }}>123 Main Street | Phone: 98765-43210</p>
                <h2 style={{ marginTop: '10px' }}>BILL / RECEIPT</h2>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p><strong>Patient:</strong> {savedBill.patient.name}</p>
                  <p><strong>Phone:</strong> {savedBill.patient.phone}</p>
                  <p><strong>Token:</strong> #{savedBill.patient.token}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Bill #:</strong> {bills.length}</p>
                </div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {savedBill.services.map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td style={{ textAlign: 'right' }}>₹{s.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f0f4f8' }}>
                    <td colSpan="2"><strong>Total</strong></td>
                    <td style={{ textAlign: 'right' }}><strong style={{ color: '#2c7be5', fontSize: '18px' }}>₹{savedBill.total}</strong></td>
                  </tr>
                </tfoot>
              </table>

              <div style={{ marginTop: '30px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                <p>Shukriya! Please visit again.</p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }} className="no-print">
                <button className="btn-primary" onClick={handlePrint}>🖨️ Print Karo</button>
                <button className="btn-primary" style={{ background: '#28a745' }}
                  onClick={() => { setSaved(false); setSelectedPatient(null); setSelectedServices([]) }}>
                  New Bill
                </button>
              </div>
            </div>

          ) : !selectedPatient ? (
            /* Patient Select */
            <div className="card">
              <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>👤 Patient Select Karo</h2>
              {patients.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Koi patient nahi hai</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr><th>Token</th><th>Naam</th><th>Phone</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p.id}>
                        <td><strong style={{ color: '#2c7be5' }}>#{p.token}</strong></td>
                        <td>{p.name}</td>
                        <td>{p.phone}</td>
                        <td>
                          <button className="btn-primary" style={{ width: 'auto', padding: '6px 16px' }}
                            onClick={() => setSelectedPatient(p)}>
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          ) : (
            /* Bill Form */
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#2c7be5' }}>🧾 Bill Banao</h2>
                <p style={{ color: '#888' }}>Patient: <strong>{selectedPatient.name}</strong> | Token: <strong>#{selectedPatient.token}</strong></p>
              </div>

              {/* Services */}
              <h3 style={{ marginBottom: '15px' }}>Services Select Karo:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {SERVICES.map(service => {
                  const selected = selectedServices.find(s => s.name === service.name)
                  return (
                    <div key={service.name}
                      onClick={() => toggleService(service)}
                      style={{
                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                        border: selected ? '2px solid #2c7be5' : '2px solid #eef1f6',
                        background: selected ? '#e8f0fe' : 'white',
                        transition: 'all 0.2s'
                      }}>
                      <p style={{ fontWeight: '500', fontSize: '14px' }}>{service.name}</p>
                      <p style={{ color: '#2c7be5', fontWeight: '600' }}>₹{service.price}</p>
                    </div>
                  )
                })}
              </div>

              {/* Custom Service */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input className="input" placeholder="Custom service naam" value={customService.name}
                  onChange={e => setCustomService({ ...customService, name: e.target.value })} />
                <input className="input" placeholder="Price" type="number" value={customService.price}
                  onChange={e => setCustomService({ ...customService, price: e.target.value })}
                  style={{ width: '120px' }} />
                <button onClick={addCustomService}
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + Add
                </button>
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Selected Services:</h3>
                  {selectedServices.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span>{s.name}</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: '#2c7be5', fontWeight: '600' }}>₹{s.price}</span>
                        <button onClick={() => setSelectedServices(selectedServices.filter((_, idx) => idx !== i))}
                          style={{ background: 'none', border: 'none', color: '#e53e2c', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #2c7be5' }}>
                    <strong>Total:</strong>
                    <strong style={{ color: '#2c7be5', fontSize: '20px' }}>₹{total}</strong>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={handleSubmit} disabled={selectedServices.length === 0}>
                  💾 Bill Save Karo
                </button>
                <button className="btn-primary" style={{ background: '#6c757d' }}
                  onClick={() => setSelectedPatient(null)}>
                  ← Wapas
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Bills */}
      {activeTab === 'view' && (
        <>
          {/* Revenue Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #28a745' }}>
              <p style={{ color: '#888' }}>💰 Total Revenue</p>
              <h2 style={{ color: '#28a745', fontSize: '30px', margin: '10px 0' }}>₹{totalRevenue}</h2>
              <p style={{ color: '#888', fontSize: '13px' }}>Paid bills</p>
            </div>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #e53e2c' }}>
              <p style={{ color: '#888' }}>⏳ Unpaid Amount</p>
              <h2 style={{ color: '#e53e2c', fontSize: '30px', margin: '10px 0' }}>₹{unpaidTotal}</h2>
              <p style={{ color: '#888', fontSize: '13px' }}>Pending bills</p>
            </div>
            <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #2c7be5' }}>
              <p style={{ color: '#888' }}>🧾 Total Bills</p>
              <h2 style={{ color: '#2c7be5', fontSize: '30px', margin: '10px 0' }}>{bills.length}</h2>
              <p style={{ color: '#888', fontSize: '13px' }}>All time</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: '#2c7be5', marginBottom: '20px' }}>🧾 Saare Bills</h3>
            {bills.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>Koi bill nahi hai</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Phone</th>
                    <th>Services</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id}>
                      <td>{bill.date}</td>
                      <td>{bill.patient_name}</td>
                      <td>{bill.phone}</td>
                      <td>{bill.services.length} services</td>
                      <td><strong style={{ color: '#2c7be5' }}>₹{bill.total}</strong></td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontWeight: '600',
                          background: bill.status === 'Paid' ? '#e8f5e9' : '#ffeaea',
                          color: bill.status === 'Paid' ? '#28a745' : '#e53e2c'
                        }}>
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '5px' }}>
                        {bill.status === 'Unpaid' && (
                          <button onClick={() => updateStatus(bill.id, 'Paid')}
                            style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>
                            ✅ Paid
                          </button>
                        )}
                        <button className="btn-danger" onClick={() => deleteBill(bill.id)} style={{ fontSize: '12px' }}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Billing