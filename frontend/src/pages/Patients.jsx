import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!name.trim() || !village.trim()) return;

    setIsSubmitting(true);

    // Fallback device ID if none entered (e.g., DEV-101)
    const finalDeviceId = deviceId.trim() || `DEV-${Math.floor(100 + Math.random() * 900)}`;

    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          name: name.trim(),
          village: village.trim(),
          device_id: finalDeviceId,
        },
      ])
      .select();

    if (error) {
      console.error('Error registering patient:', error.message);
      alert(`Failed to add patient: ${error.message}`);
    } else {
      setName('');
      setVillage('');
      setDeviceId('');
      fetchPatients(); // Refresh list
    }
    setIsSubmitting(false);
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.village?.toLowerCase().includes(search.toLowerCase()) ||
      p.device_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content">
      {/* Top Form Panel */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div className="panel-title">Register New Patient</div>
        </div>

        <form onSubmit={handleAddPatient} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Patient full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
            required
          />
          <input
            type="text"
            placeholder="Village / Location"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
            required
          />
          <input
            type="text"
            placeholder="Device ID (Optional, e.g. DEV-01)"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button type="submit" disabled={isSubmitting} className="treat-btn">
            {isSubmitting ? 'Saving...' : 'Add Patient'}
          </button>
        </form>
      </div>

      {/* Patient Directory Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Patient Directory ({filteredPatients.length})</div>

          <input
            type="text"
            placeholder="Search name, village, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              width: '220px',
              outline: 'none',
            }}
          />
        </div>

        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0' }}>
            Loading patient records...
          </p>
        ) : filteredPatients.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0' }}>
            No patient records found.
          </p>
        ) : (
          filteredPatients.map((patient) => (
            <div className="patient-card" key={patient.id}>
              <div className="patient-left">
                <div className="patient-dot dot-green">
                  <i className="ti ti-user" style={{ fontSize: '18px', color: '#3B6D11' }}></i>
                </div>
                <div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-village">
                    {patient.village} • <span style={{ color: '#666' }}>{patient.device_id}</span>
                  </div>
                </div>
              </div>

              <div className="patient-right">
                <div className="patient-time">
                  Enrolled {new Date(patient.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}