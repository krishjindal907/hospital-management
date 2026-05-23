import { useState, useEffect } from 'react'

function LabReport() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [technicianName, setTechnicianName] = useState('Lab Tech 1')
  const [tests, setTests] = useState([
    { test_name: '', result: '', normal_range: '', status: 'Normal' }
  ])
  const [saved, setSaved] = useState(false)
  const [viewPhone, setViewPhone] = useState('')
  const [viewReports, setViewReports] = useState(null)
  const [activeTab, setActiveTab] = useState('add')

  useEffect(() => {
    fetch('http://localhost:5000/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
  }, [])

  const addTest = () => {
    setTests([...tests, { test_name: '', result: '', normal_range: '', status: 'Normal' }])
  }

  const removeTest = (index) => {
    setTests(tests.filter((_, i) => i !== index))
  }

  const handleTestChange = (index, field, value) => {
    const updated = [...tests]
    updated[index][field] = value
    setTests(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    for (const test of tests) {
      await fetch('http://localhost:5000/lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          patient_name: selectedPatient.name,
          phone: selectedPatient.phone,
          test_name: test.test_name,
          result: test.result,
          normal_range: test.normal_range,
          status: test.status,
          technician: technicianName
        })
      })
    }
    setSaved(true)
  }

  const handleViewReports = async (e) => {
    e.preventDefault()
    const response = await fetch(`http://localhost:5000/lab-reports/${viewPhone}`)
    const data = await response.json()
    setViewReports(data)
  }

  const handlePrint = () => window.print()

  return (
    <div className="page">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button
          onClick={() => setActiveTab('add')}
          className="btn-primary"
          style={{ width: 'auto', background: activeTab === 'add' ? '#2c7be5' : '#6c757d' }}
        >
          🔬 Report Add Karo
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className="btn-primary"
          style={{ width: 'auto', background: activeTab === 'view' ? '#2c7be5' : '#6c757d' }}
        >
          📋 Reports Dekho
        </button>
      </div>

      {/* Add Report Tab */}
      {activeTab === 'add' && (
        <>
          {!selectedPatient ? (
            <div className="card">
              <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>🔬 Patient Select Karo</h2>
              {patients.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>⏳ Koi patient nahi hai</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Naam</th>
                      <th>Phone</th>
                      <th>Takleef</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.id}>
                        <td><strong style={{ color: '#2c7be5' }}>#{patient.token}</strong></td>
                        <td>{patient.name}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.problem}</td>
                        <td>
                          <button
                            className="btn-primary"
                            style={{ width: 'auto', padding: '6px 16px' }}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          ) : saved ? (

            /* Print View */
            <div className="card" id="print-area">
              <div style={{ textAlign: 'center', borderBottom: '2px solid #2c7be5', paddingBottom: '15px', marginBottom: '20px' }}>
                <h1 style={{ color: '#2c7be5' }}>🏥 City Hospital — Lab Report</h1>
                <p style={{ color: '#666' }}>123 Main Street | Phone: 98765-43210</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p><strong>Patient:</strong> {selectedPatient.name}</p>
                  <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Technician:</strong> {technicianName}</p>
                </div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test</th>
                    <th>Result</th>
                    <th>Normal Range</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{test.test_name}</td>
                      <td><strong>{test.result}</strong></td>
                      <td>{test.normal_range}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: test.status === 'Normal' ? '#e8f5e9' : '#ffeeba',
                          color: test.status === 'Normal' ? '#28a745' : '#856404',
                          fontWeight: '600'
                        }}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }} className="no-print">
                <button className="btn-primary" onClick={handlePrint}>🖨️ Print Karo</button>
                <button
                  className="btn-primary"
                  style={{ background: '#28a745' }}
                  onClick={() => { setSaved(false); setSelectedPatient(null); setTests([{ test_name: '', result: '', normal_range: '', status: 'Normal' }]) }}
                >
                  New Report
                </button>
              </div>
            </div>

          ) : (

            /* Report Form */
            <div className="card">
              <h2 style={{ color: '#2c7be5', marginBottom: '5px' }}>🔬 Lab Report Likho</h2>
              <p style={{ color: '#888', marginBottom: '25px' }}>
                Patient: <strong>{selectedPatient.name}</strong> | Token: <strong>#{selectedPatient.token}</strong>
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                  className="input"
                  placeholder="Technician ka Naam"
                  value={technicianName}
                  onChange={e => setTechnicianName(e.target.value)}
                  required
                />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3>🧪 Tests</h3>
                    <button type="button" onClick={addTest}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                      + Add Test
                    </button>
                  </div>

                  {tests.map((test, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        className="input"
                        placeholder="Test naam (e.g. CBC)"
                        value={test.test_name}
                        onChange={e => handleTestChange(index, 'test_name', e.target.value)}
                        required
                        style={{ flex: 2 }}
                      />
                      <input
                        className="input"
                        placeholder="Result"
                        value={test.result}
                        onChange={e => handleTestChange(index, 'result', e.target.value)}
                        required
                        style={{ flex: 1 }}
                      />
                      <input
                        className="input"
                        placeholder="Normal Range"
                        value={test.normal_range}
                        onChange={e => handleTestChange(index, 'normal_range', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <select
                        className="input"
                        value={test.status}
                        onChange={e => handleTestChange(index, 'status', e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                        <option value="Critical">Critical</option>
                      </select>
                      {tests.length > 1 && (
                        <button type="button" className="btn-danger" onClick={() => removeTest(index)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" type="submit">💾 Report Save Karo</button>
                  <button type="button" className="btn-primary" style={{ background: '#6c757d' }}
                    onClick={() => setSelectedPatient(null)}>← Wapas</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* View Reports Tab */}
      {activeTab === 'view' && (
        <div className="card">
          <h2 style={{ color: '#2c7be5', marginBottom: '20px' }}>📋 Lab Reports Dekho</h2>
          <form onSubmit={handleViewReports} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input
              className="input"
              placeholder="Phone number daalo..."
              value={viewPhone}
              onChange={e => setViewPhone(e.target.value)}
              required
            />
            <button className="btn-primary" type="submit" style={{ width: 'auto', padding: '10px 20px' }}>
              Search
            </button>
          </form>

          {viewReports && (
            viewReports.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '30px' }}>❌ Koi report nahi mili</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Test</th>
                    <th>Result</th>
                    <th>Normal Range</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {viewReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.date}</td>
                      <td>{report.patient_name}</td>
                      <td>{report.test_name}</td>
                      <td><strong>{report.result}</strong></td>
                      <td>{report.normal_range}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: report.status === 'Normal' ? '#e8f5e9' : '#ffeeba',
                          color: report.status === 'Normal' ? '#28a745' : '#856404',
                          fontWeight: '600'
                        }}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default LabReport