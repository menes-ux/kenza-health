import time
import sys

def slow_print(text, delay=0.03):
    """Prints text slowly for a cinematic 'hacker' effect in the video."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def run_hardware_simulation():
    print("\n" + "="*50)
    slow_print("KENZA HEALTH IOT GATEWAY INITIALIZED...", 0.05)
    print("="*50 + "\n")
    time.sleep(1)

    # --- FR 1.1: RECEIVE RAW SMS ---
    slow_print(">>> [FR 1.1] LISTENING FOR SIM800L HARDWARE TRANSMISSION...")
    time.sleep(2)
    raw_sms_payload = "DEV:NANO-004|TMP:39.5|VIL:Lokossa"
    slow_print(f"[SUCCESS] RAW SMS RECEIVED: '{raw_sms_payload}'\n", 0.01)
    time.sleep(1.5)

    # --- FR 1.2: PARSE TELEMETRY DATA ---
    slow_print(">>> [FR 1.2] PARSING TELEMETRY DATA...")
    time.sleep(1)
    
    # Splitting the raw string into clear variables
    data_parts = raw_sms_payload.split('|')
    device_id = data_parts[0].split(':')[1]
    temperature = float(data_parts[1].split(':')[1])
    village = data_parts[2].split(':')[1]
    
    slow_print(f"    ├─ Variable 1 Extracted -> DEVICE_ID: {device_id}")
    time.sleep(0.5)
    slow_print(f"    ├─ Variable 2 Extracted -> TEMPERATURE: {temperature}°C")
    time.sleep(0.5)
    slow_print(f"    └─ Variable 3 Extracted -> LOCATION: {village}\n")
    time.sleep(1.5)

    # --- FR 2.1: FEVER ANALYSIS ---
    slow_print(">>> [FR 2.1] EXECUTING FEVER ANALYSIS ALGORITHM...")
    time.sleep(1)
    slow_print(f"[EVALUATION] Checking if {temperature}°C > 38.5°C threshold...")
    time.sleep(1.5)

    if temperature > 38.5:
        slow_print("[CRITICAL] THRESHOLD EXCEEDED! FEVER SPIKE DETECTED.\n", 0.05)
        time.sleep(1)

        # --- FR 3.1: DISPATCH ALERT TO MOTHER ---
        slow_print(">>> [FR 3.1] TRIGGERING EMERGENCY SMS SYSTEM...")
        time.sleep(1)
        slow_print("[TWILIO GATEWAY] Connecting to local telecom provider...")
        time.sleep(1)
        slow_print("[TWILIO GATEWAY] Dispatching message to Mother (+229 97 XX XX XX):")
        slow_print("                 'URGENT : La température de votre enfant a atteint 39.5°C.'")
        slow_print("[SUCCESS] SMS DELIVERED.\n")
        time.sleep(1)
        
    else:
         slow_print("[NORMAL] Temperature is stable. No alert required.\n")

    # --- FR 4.1: DATA LOGGING ---
    slow_print(">>> [FR 4.1] LOGGING RECORD TO CLOUD DATABASE...")
    time.sleep(1)
    slow_print("[SUPABASE SQL] INSERT INTO readings (device_id, temperature) VALUES ('NANO-004', 39.5)...")
    time.sleep(1)
    slow_print("[SUCCESS] RECORD PERMANENTLY SAVED.")
    
    print("\n" + "="*50)
    slow_print("TRANSMISSION COMPLETE. WAITING FOR NEXT SIGNAL...", 0.05)
    print("="*50 + "\n")

if __name__ == "__main__":
    run_hardware_simulation()