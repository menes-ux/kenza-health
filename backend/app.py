from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

SUPABASE_URL = "https://khsoesxaefflzuwhkhrn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc29lc3hhZWZmbHp1d2hraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDU5MTUsImV4cCI6MjEwMDgyMTkxNX0.3AtJ6aKwxkVs7UkVvme0FIzaEuGgsHi5hiEPHhjDwZE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/sms', methods=['POST'])
def receive_sms():
    try:
        # FR 1.1 - Backend receives simulated SMS data
        payload = request.json
        raw_sms_text = payload.get('Body') # Example: "NANO-001 39.5"

        # FR 1.2 - Parses it into clean variables
        parts = raw_sms_text.split()
        if len(parts) != 2:
            return jsonify({"error": "Invalid SMS format. Expected: DEVICE_ID TEMPERATURE"}), 400
            
        device_id = parts[0]
        temp = float(parts[1])

        # Find patient and guardian phone number
        patient_response = supabase.table('patients').select('id, name, guardian_phone').eq('device_id', device_id).execute()
        
        if not patient_response.data:
            return jsonify({"error": "Device not registered"}), 404
            
        patient = patient_response.data[0]
        
        # FR 2.1 - Checks if temperature is above 38.5
        is_alert = temp > 38.5

        # FR 3.1 - Dispatches SMS alert to mother
        if is_alert:
            print(f"\n=================================================")
            print(f"📱 SIMULATED SMS SENT TO {patient['guardian_phone']}")
            print(f"MESSAGE: URGENT: {patient['name']} has a high fever of {temp}°C. Please seek medical care.")
            print(f"=================================================\n")

        # FR 4.1 - Saves everything to SQL database
        supabase.table('readings').insert({
            "patient_id": patient['id'],
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
    app.run(port=5000, debug=True)