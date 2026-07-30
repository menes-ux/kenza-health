from flask_cors import CORS
from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

SUPABASE_URL = "https://khsoesxaefflzuwhkhrn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc29lc3hhZWZmbHp1d2hraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDU5MTUsImV4cCI6MjEwMDgyMTkxNX0.3AtJ6aKwxkVs7UkVvme0FIzaEuGgsHi5hiEPHhjDwZE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/sms', methods=['POST'])
@app.route('/api/sms', methods=['POST'])
def receive_sms():
    try:
        data = request.json
        raw_text = data.get('raw_payload') 
        
        if not raw_text:
            return jsonify({"error": "Missing raw_payload in request"}), 400

        print(f"\n[FR 1.1] HARDWARE PAYLOAD RECEIVED: '{raw_text}'", flush=True)
        
        # --- FR 1.2: Parse string into variables ---
        parts = raw_text.split('|')
        device_id = parts[0].split(':')[1]
        temperature = float(parts[1].split(':')[1])
        location = parts[2].split(':')[1]
        
        print(f"[FR 1.2] PARSED VARIABLES -> ID: {device_id} | Temp: {temperature}°C | Loc: {location}", flush=True)
        
        # --- STEP 1: LOOK UP THE PATIENT ID ---
        # Find the patient that matches this specific NANO device
        patient_response = supabase.table("patients").select("id").eq("device_id", device_id).execute()
        
        if not patient_response.data:
            print(f"[ERROR] No patient registered with device ID: {device_id}", flush=True)
            return jsonify({"error": f"Unknown device: {device_id}"}), 404
            
        patient_id = patient_response.data[0]['id']
        
        # --- STEP 2: INSERT THE READING ---
        # Now we insert using patient_id instead of device_id
        data_to_insert = {
            "patient_id": patient_id, 
            "temperature": temperature,
            "is_resolved": False
        }
        
        supabase.table("readings").insert(data_to_insert).execute()
        print("[SUCCESS] Reading successfully saved to Supabase!", flush=True)
        
        return jsonify({
            "status": "success",
            "parsed_data": {
                "device_id": device_id,
                "temperature": temperature,
                "location": location
            }
        }), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}", flush=True)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(port=5000, debug=True)