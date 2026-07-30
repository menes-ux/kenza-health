from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
@app.route('/', methods=['GET'])
def home():
    return "Kenza Health API is running live!"
CORS(app)

import os
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

FEVER_THRESHOLD = 37.5  # Fever threshold in °C

def trigger_sms_gateway(phone_number, patient_name, temp):
    """
    Simulates sending an SMS via a cellular gateway (e.g., Twilio / Africa's Talking)
    """
    # Emergency message sent to the mother (Kept in French)
    message = (
        f"🚨 ALERTE URGENTE KENZA HEALTH : Une fièvre de {temp}°C a été détectée chez votre enfant {patient_name}. "
        f"L'agent de santé du district de Lokossa a été immédiatement averti. "
        f"Veuillez donner de l'eau à l'enfant et le garder au frais en attendant la prise en charge."
    )
    
    # Clean terminal log display (In English)
    print("\n" + "="*65)
    print("📲 [SMS GATEWAY - AUTOMATIC DISPATCH]")
    print(f"   Carrier Network : Moov Benin / MTN Benin (+229)")
    print(f"   Recipient Phone : {phone_number}")
    print(f"   SMS Message Body: {message}")
    print(f"   Delivery Status : 200 OK (DELIVERED SUCCESSFULLY VIA GSM NETWORK)")
    print("="*65 + "\n", flush=True)
    
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

        # --- Functional Requirement 1.1 Log ---
        print(f"\n[FR 1.1] HARDWARE TELEMETRY RECEIVED: '{raw_text}'", flush=True)
        
        # --- Functional Requirement 1.2: Variable Extraction ---
        parts = raw_text.split('|')
        device_id = parts[0].split(':')[1]
        temperature = float(parts[1].split(':')[1])
        location = parts[2].split(':')[1]
        
        print(f"[FR 1.2] EXTRACTED DATA -> Device: {device_id} | Temp: {temperature}°C | Location: {location}", flush=True)
        
        # --- STEP 1: PATIENT ID LOOKUP ---
        # Select only 'id' and 'name' to prevent missing column errors in Supabase
        patient_response = supabase.table("patients").select("id, name").eq("device_id", device_id).execute()
        
        if not patient_response.data:
            print(f"[ERROR] No patient registered with Device ID: {device_id}", flush=True)
            return jsonify({"error": f"Unknown device ID: {device_id}"}), 404
            
        patient = patient_response.data[0]
        patient_id = patient['id']
        patient_name = patient.get('name', 'the child')
        mother_phone = "+229 97 12 34 56"  # Fallback phone number for MVP demo
        
        # --- STEP 2: SAVE READING TO SUPABASE ---
        data_to_insert = {
            "patient_id": patient_id, 
            "temperature": temperature,
            "is_resolved": False
        }
        supabase.table("readings").insert(data_to_insert).execute()
        print("[SUCCESS] Reading successfully recorded in Supabase database!", flush=True)
        
        # --- STEP 3: AUTOMATIC SMS DISPATCH ON FEVER DETECTED ---
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