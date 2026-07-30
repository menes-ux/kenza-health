from flask import Blueprint, request, jsonify
import os
from supabase import create_client

readings_bp = Blueprint('readings', __name__)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@readings_bp.route('/api/telemetry', methods=['POST'])
def process_telemetry():
    """
    Receives raw text from the SIM800L (via React Simulator), 
    parses it, saves it to the database, and checks for fever.
    """
    data = request.json
    raw_payload = data.get('raw_payload', '')
    
    # --- FR 1.1: Log incoming raw transmission ---
    print(f"\n[FR 1.1] HARDWARE PAYLOAD RECEIVED: '{raw_payload}'", flush=True)
    
    try:
        # --- FR 1.2: Parse string into variables ---
        # Expected format: "DEV:NANO-004|TMP:39.5|VIL:Lokossa"
        parts = raw_payload.split('|')
        
        device_id = parts[0].split(':')[1]
        temperature = float(parts[1].split(':')[1])
        location = parts[2].split(':')[1]
        
        print(f"[FR 1.2] PARSED VARIABLES -> ID: {device_id} | Temp: {temperature}°C | Loc: {location}", flush=True)
        
        # --- Save to Supabase (readings table) ---
        supabase.table('readings').insert({
            "device_id": device_id,
            "temperature": temperature,
            "location": location
        }).execute()
        print("[SUCCESS] Reading saved to database.", flush=True)
        
        # --- FR 3: Fever Check ---
        is_fever = temperature > 38.5
        if is_fever:
             print("🚨 [ALERT] CRITICAL FEVER. TRIGGERING SMS PROTOCOL...", flush=True)
        
        # Return success back to the React Simulator
        return jsonify({
            "status": "success",
            "parsed_data": {
                "device_id": device_id,
                "temperature": temperature,
                "location": location
            },
            "fever_alert": is_fever
        }), 200

    except Exception as e:
        print(f"[ERROR] Failed to parse telemetry: {e}", flush=True)
        return jsonify({"status": "error", "message": "Failed to parse hardware string"}), 400