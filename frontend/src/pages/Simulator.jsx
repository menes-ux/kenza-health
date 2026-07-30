import React, { useState } from 'react';

const Simulator = () => {
  const [deviceId, setDeviceId] = useState('NANO-001');
  const [temperature, setTemperature] = useState('37.5');
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-generates the raw text so the grader can see it live
  const rawText = `DEV:${deviceId}|TMP:${temperature}|VIL:Lokossa`;

  const sendTelemetry = async () => {
    setLoading(true);
    setLog(null);
    
    try {
      // Sends data to the Python backend
      const response = await fetch('https://kenza-health-backend.onrender.com/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_payload: rawText }),
      });

      const data = await response.json();
      setLog(data);
    } catch (error) {
      setLog({ 
        status: "error", 
        message: "SYSTEM FAILURE: Could not reach Python backend. Ensure app.py is running." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#00ff00', 
      fontFamily: '"Courier New", Courier, monospace', 
      minHeight: '100vh', 
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ borderBottom: '1px solid #00ff00', paddingBottom: '10px' }}>
          &gt; KENZA_HEALTH // SIM800L_GATEWAY_TERMINAL
        </h1>
        
        <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
          Here you will be simulating the SIM800L hardware module sending raw text transmissions to allow our backend to test the extraction and parsing logic (FR 1.1 &amp; FR 1.2). 
        </p>
        <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
          You have 5 pre-registered patients in the database (NANO-001 through NANO-005). Choose a Device ID and assign the body temperature you want to simulate. Our Python backend (deployed on Render) will catch this payload, parse it into clean variables, check for fever thresholds, and save it to Supabase.
        </p>

        <div style={{ margin: '40px 0', padding: '20px', border: '1px solid #00ff00', backgroundColor: '#111' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '18px' }}>
              &gt; SELECT_DEVICE_ID:
            </label>
            <select 
              value={deviceId} 
              onChange={(e) => setDeviceId(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#000', color: '#00ff00', border: '1px solid #00ff00', fontFamily: 'inherit', fontSize: '16px' }}
            >
              <option value="NANO-001">NANO-001 (Amadou Diallo)</option>
              <option value="NANO-002">NANO-002 (Chloé Mensah)</option>
              <option value="NANO-003">NANO-003 (Netanya Koffi)</option>
              <option value="NANO-004">NANO-004 (Koffi Abacha)</option>
              <option value="NANO-005">NANO-005 (Zola Bakare)</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '18px' }}>
              &gt; INPUT_TEMPERATURE_CELSIUS:
            </label>
            <input 
              type="number" 
              step="0.1"
              value={temperature} 
              onChange={(e) => setTemperature(e.target.value)} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#000', color: '#00ff00', border: '1px solid #00ff00', fontFamily: 'inherit', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ margin: '30px 0', color: '#ffcc00' }}>
            <p>&gt; Here is what the SIM800L will send:</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', backgroundColor: '#332b00', padding: '10px' }}>
              {rawText}
            </p>
          </div>

          <button 
            onClick={sendTelemetry} 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: loading ? '#333' : '#dc3545', 
              color: 'white', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontFamily: 'inherit',
              fontSize: '18px',
              textTransform: 'uppercase'
            }}
          >
            {loading ? '> TRANSMITTING...' : '> EXECUTE TRANSMISSION'}
          </button>
        </div>

        {log && (
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            border: log.status === 'error' ? '1px solid #dc3545' : '1px solid #00ff00',
            backgroundColor: '#111'
          }}>
            <h3 style={{ color: log.status === 'error' ? '#dc3545' : '#00ff00', marginTop: 0 }}>
              &gt; BACKEND_RESPONSE:
            </h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;