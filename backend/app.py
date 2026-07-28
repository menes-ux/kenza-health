from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)


SUPABASE_URL = "https://khsoesxaefflzuwhkhrn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc29lc3hhZWZmbHp1d2hraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDU5MTUsImV4cCI6MjEwMDgyMTkxNX0.3AtJ6aKwxkVs7UkVvme0FIzaEuGgsHi5hiEPHhjDwZE"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/telemetry', methods=['POST'])
def receive_telemetry():
    try:
        # 1. Catch the incoming data (e.g., {"device_id": "NANO-001", "temperature": 39.2})
        payload = request.json
        device_id = payload.get('device_id')
        temp = float(payload.get('temperature'))

        # 2. Find which child owns this device
        patient_response = supabase.table('patients').select('id').eq('device_id', device_id).execute()
        
        if not patient_response.data:
            return jsonify({"error": "Device not registered to a patient"}), 404
            
        patient_id = patient_response.data[0]['id']
        
        # 3. Check if it triggers the malaria fever threshold
        is_alert = temp > 38.5

        # 4. Save the reading to the database
        supabase.table('readings').insert({
            "patient_id": patient_id,
            "temperature": temp,
            "is_alert": is_alert
        }).execute()

        return jsonify({
            "status": "success", 
            "recorded_temp": temp,
            "alert_triggered": is_alert
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Runs the server on port 5000
    app.run(port=5000, debug=True)