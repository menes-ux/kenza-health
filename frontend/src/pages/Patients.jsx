import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Patients({ globalSearch = '' }) {
  // Main list of patients coming from the database, plus a loading flag
  // so we can show a "syncing" message while the request is in flight.
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  // These three fields track what the user is currently typing in the
  // "add patient" form, before it gets submitted.
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the patient list once, right after the component first mounts.
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    // We ask Supabase for every column ('*') from the patients table,
    // ordered so the most recently created patient shows up first.
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If something goes wrong, we just log it for now, nothing fancy.
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    // Basic guard: we don't allow submitting the form if the required
    // fields are empty or only contain whitespace.
    if (!name.trim() || !village.trim()) return;

    setIsSubmitting(true);

    // If the caregiver doesn't type a device id manually, we generate a
    // random fallback one so every patient still gets an identifier.
    const finalDeviceId = deviceId.trim() || `DEV-${Math.floor(100 + Math.random() * 900)}`;

    const { error } = await supabase
      .from('patients')
      .insert([
        {
          name: name.trim(),
          village: village.trim(),
          device_id: finalDeviceId,
        },
      ]);

    if (error) {
      console.error('Error registering patient:', error.message);
      alert(`Failed to add patient: ${error.message}`);
    } else {
      // Once the insert succeeds, we clear the form fields and refresh
      // the list so the new patient appears immediately.
      setName('');
      setVillage('');
      setDeviceId('');
      fetchPatients(); 
    }
    setIsSubmitting(false);
  };

  // This filters the patient list based on the global search bar (passed
  // down as a prop), matching against name, village, or device id.
  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.village?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.device_id?.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ backgroundColor: '#F8F9FA', minHeight: '100%', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '32px' }}>
          {/* Page title and short subtitle, translated to French */}
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>Répertoire</h1>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Gérer les affectations de matériel et les inscriptions</div>
        </div>

        {/* REGISTRATION FORM */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #EAEAEA', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0', color: '#111', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Inscrire un(e) nouveau(elle) patient(e)
          </h2>
          
          <form onSubmit={handleAddPatient} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Nom complet du (de la) patient(e)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '14px', outline: 'none' }}
              required
            />
            <input
              type="text"
              placeholder="Village / Localité"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              style={{ flex: 1, minWidth: '150px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '14px', outline: 'none' }}
              required
            />
            <input
              type="text"
              placeholder="ID de l'appareil (ex. NANO-004)"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              style={{ flex: 1, minWidth: '150px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '14px', outline: 'none', fontFamily: 'monospace' }}
            />
            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ backgroundColor: '#111', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {/* Button label changes while the request is being processed */}
              {isSubmitting ? 'ENREGISTREMENT...' : 'AJOUTER LE (LA) PATIENT(E)'}
            </button>
          </form>
        </div>

        {/* TERMINAL STYLE LIST */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #EAEAEA', color: '#111' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Flux de la base de données ({filteredPatients.length})
            </h2>
            {/* LOCAL SEARCH BAR DELETED FROM HERE */}
          </div>

          {loading ? (
             // Shown briefly while we wait for the Supabase request to come back
             <div style={{ color: '#888', fontSize: '13px', fontFamily: 'monospace', padding: '10px 0' }}>&gt; Synchronisation de la base de données...</div>
          ) : filteredPatients.length === 0 ? (
            // Empty state, shown when there are no patients or the search filter matches nothing
            <div style={{ padding: '10px 0', color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>&gt; Aucun dossier patient(e) trouvé.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* One row per patient, rendered in the order returned by the query */}
              {filteredPatients.map((patient) => (
                <div key={patient.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', borderBottom: '1px solid #F8F9FA', fontFamily: 'monospace', fontSize: '14px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ color: '#111', fontWeight: 'bold' }}>● INSCRIT(E)</div>
                    <div style={{ color: '#666' }}>
                      {new Date(patient.created_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' })}
                    </div>
                    <div style={{ color: '#111', fontWeight: 600 }}>{patient.name}</div>
                  </div>
                  
                  <div style={{ color: '#888', textAlign: 'right' }}>
                    {patient.village} • ID : <span style={{ color: '#111', fontWeight: 600 }}>{patient.device_id}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}