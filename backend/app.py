from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

SUPABASE_URL = "https://khsoesxaefflzuwhkhrn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc29lc3hhZWZmbHp1d2hraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDU5MTUsImV4cCI6MjEwMDgyMTkxNX0.3AtJ6aKwxkVs7UkVvme0FIzaEuGgsHi5hiEPHhjDwZE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

FEVER_THRESHOLD = 37.5  # Fever threshold in Celsius

def trigger_sms_gateway(phone_number, patient_name, temp):
    """
    Simulates an SMS Gateway API dispatch (e.g., Twilio / Africa's Talking / Termii)
    """
    message = (
        f"🚨 ALERTE KENZA HEALTH: Fièvre détectée ({temp}°C) pour {patient_name}. "
        f"Un agent de santé du district de Lokossa a été notifié. "
        f"Veuillez donner de l'eau et rafraîchir l'enfant immédiatement."
    )
    
    print("\n" + "="*60)
    print("📲 [SMS GATEWAY API DISPATCH]")
    print(f"   To Carrier    : Moov Benin / MTN Benin (+229)")
    print(f"   Recipient Phone: {phone_number}")
    print(f"   Message Body  : {message}")
    print(f"   Status        : 200 OK (DELIVERED VIA CELLULAR GATEWAY)")
    print("="*60 + "\n", flush=True)
    
    return {
        "dispatched": True,
        "recipient": phone_number,
        "message": message
    }

@app.route('/api/sms', methods=['POST'])
def receive_sms():
    try:
        data = request.json
        raw_text = data.get('raw_payload') 
        
        if not raw_text:
            return jsonify({"error": "Missing raw_payload in request"}), 400

        print(f"\n[FR 1.1] HARDWARE PAYLOAD RECEIVED: '{raw_text}'", flush=True)
        
        # --- FR 1.2: Parse payload ---
        parts = raw_text.split('|')
        device_id = parts[0].split(':')[1]
        temperature = float(parts[1].split(':')[1])
        location = parts[2].split(':')[1]
        
        print(f"[FR 1.2] PARSED VARIABLES -> ID: {device_id} | Temp: {temperature}°C | Loc: {location}", flush=True)
        
        # --- STEP 1: LOOK UP PATIENT DATA ---
        patient_response = supabase.table("patients").select("id, name, phone_number").eq("device_id", device_id).execute()
        
        if not patient_response.data:
            print(f"[ERROR] No patient registered with device ID: {device_id}", flush=True)
            return jsonify({"error": f"Unknown device: {device_id}"}), 404
            
        patient = patient_response.data[0]
        patient_id = patient['id']
        patient_name = patient.get('name', 'Enfant')
        # Fallback phone number if none registered in DB yet
        mother_phone = patient.get('phone_number') or "+229 97 12 34 56"
        
        # --- STEP 2: INSERT READING TO SUPABASE ---
        data_to_insert = {
            "patient_id": patient_id, 
            "temperature": temperature,
            "is_resolved": False
        }
        supabase.table("readings").insert(data_to_insert).execute()
        
        # --- STEP 3: AUTOMATIC URGENT CARE SMS DISPATCH ---
        sms_info = None
        if temperature >= FEVER_THRESHOLD:
            sms_info = trigger_sms_gateway(mother_phone, patient_name, temperature)

        return jsonify({
            "status": "success",
            "parsed_data": {
                "device_id": device_id,
                "temperature": temperature,
                "location": location,
                "patient_name": patient_name
            },
            "sms_dispatch": sms_info
        }), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}", flush=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)