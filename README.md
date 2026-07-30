# Kenza Health
Early malaria monitoring dashboard for children under five in rural Benin.

---

## Demo Video
https://www.youtube.com/watch?v=n-K1mM_OYBA

---

## Live Deployment

| Layer | URL |
|---|---|
| Frontend (Vercel) | https://kenza-health.vercel.app/ |
| Backend API (Render) | https://kenza-health-backend.onrender.com |
| Database | PostgreSQL via Supabase |

LATENCY WARNING FOR EVALUATORS: The Python backend runs on a free Render instance. If inactive, the server sleeps. Your first transmission may take 30 to 50 seconds while the server wakes up. Do not refresh. All subsequent requests process in milliseconds.

---

## Evaluator Login Credentials

| Field | Value |
|---|---|
| Email | evaluator@kenza.health |
| Password | Kenza2026! |

---

## Codebase Structure

```
kenza-health/
├── backend/
│   ├── routes/
│   │   ├── patients.py
│   │   ├── readings.py
│   │   └── alerts.py
│   ├── app.py              # Flask API — main entry point
│   ├── models.py
│   ├── simulate.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── Dashboard.jsx     # FR5.1 — Real-time patient grid
│       │   ├── Patients.jsx      # FR4.1 — Patient registration
│       │   ├── Login.jsx         # NF1 — CHW authentication
│       │   └── Simulator.jsx     # SIM800L hardware simulation terminal
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── supabaseClient.js
├── .gitignore
├── .env                    # NOT committed
└── README.md
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js + Vite | CHW dashboard UI |
| Styling | Tailwind CSS | Responsive layout (NF6, NF7) |
| Backend | Python 3.10 + Flask | Telemetry parsing and alert logic |
| Database | PostgreSQL via Supabase | Health record storage (FR4.1) |
| Auth | Supabase Auth | Secure CHW login (NF1) |
| Frontend Deployment | Vercel | Public HTTPS hosting |
| Backend Deployment | Render | Python Flask API hosting |
| SMS Gateway | Simulated (Africa's Talking ready) | Mother alert dispatch (FR3.1) |

---

## Evaluation Guide

### Step 1 — Login (NF1)
Go to https://kenza-health.vercel.app/ and log in with the evaluator credentials above. This tests the CHW authentication requirement.

### Step 2 — Dashboard (FR5.1, FR5.2)
The dashboard loads with 5 pre-registered patients. Critical fever cases appear highlighted in red. This tests the real-time patient grid and critical case prioritization.

### Step 3 — SIM800L Simulation (FR1.1, FR1.2, FR2.1)
Locate the SIM800L_GATEWAY_TERMINAL in the sidebar. Select a patient from the dropdown, enter a temperature of 38.5 or higher, and click EXECUTE TRANSMISSION. This sends a raw payload to the Flask backend, which parses it and checks the fever threshold.

### Step 4 — Alert and SMS Dispatch (FR3.1, FR4.1)
Return to the Dashboard. A red critical alert appears under the Action requise section. The SMS dispatch is logged in the Render backend console. This tests data persistence and mother alert dispatch.

### Step 5 — Mark as Treated (FR5.3)
Click RESOLVE on the active alert. It disappears from the feed and is logged as resolved in the database.

### Step 6 — Patient Registration (FR4.1)
Navigate to the Patients tab. Register a new patient using the form. The record appears instantly in the database feed.

### Step 7 — Responsiveness (NF6, NF7)
Open the dashboard on a mobile browser or resize the window. The layout adapts across Chrome, Firefox, and Safari.

---

## Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+

### 1. Clone the repository

```bash
git clone https://github.com/YOURUSERNAME/kenza-health.git
cd kenza-health
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
```

On Mac/Linux:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

```bash
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

Start the backend:
```bash
python app.py
```

The API runs at http://localhost:5000

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Health check |
| POST | /api/sms | Receives raw telemetry, parses data, checks fever threshold, saves to database, dispatches SMS alert |

Example POST payload:
```json
{
  "raw_payload": "DEV:NANO-005|TMP:39|VIL:Lokossa"
}
```

Example response:
```json
{
  "status": "success",
  "parsed_data": {
    "device_id": "NANO-005",
    "temperature": 39.0,
    "location": "Lokossa",
    "patient_name": "Kofi Mensah"
  },
  "sms_dispatch": {
    "dispatched": true,
    "recipient": "+229 97 12 34 56"
  }
}
```

---

## Evaluation Guide

### Step 1 — Login (NF1)
Go to https://kenza-health.vercel.app/ and log in with the evaluator credentials above. This tests the CHW authentication requirement.

### Step 2 — Dashboard (FR5.1, FR5.2)
The dashboard loads with 5 pre-registered patients. Critical fever cases appear highlighted in red. This tests the real-time patient grid and critical case prioritization.

### Step 3 — SIM800L Simulation (FR1.1, FR1.2, FR2.1)
Locate the SIM800L_GATEWAY_TERMINAL in the sidebar. Select a patient from the dropdown, enter a temperature of 38.5 or higher, and click EXECUTE TRANSMISSION. This sends a raw payload to the Flask backend, which parses it and checks the fever threshold.

### Step 4 — Alert and SMS Dispatch (FR3.1, FR4.1)
Return to the Dashboard. A red critical alert appears under the Action requise section. The SMS dispatch is logged in the Render backend console. This tests data persistence and mother alert dispatch.

### Step 5 — Mark as Treated (FR5.3)
Click RESOLVE on the active alert. It disappears from the feed and is logged as resolved in the database.

### Step 6 — Patient Registration (FR4.1)
Navigate to the Patients tab. Register a new patient using the form. The record appears instantly in the database feed.

### Step 7 — Responsiveness (NF6, NF7)
Open the dashboard on a mobile browser or resize the window. The layout adapts across Chrome, Firefox, and Safari.

---

## SRS Requirements Coverage

| Req ID | Requirement | Status |
|---|---|---|
| FR 1.1 | Receive SMS telemetry from SIM800L | Simulated via terminal |
| FR 1.2 | Parse telemetry into clean variables | Implemented in app.py |
| FR 2.1 | Detect fever above 38.5°C | Implemented |
| FR 3.1 | Dispatch SMS alert to mother | Simulated — logged in Render console |
| FR 4.1 | Store all health records in SQL database | PostgreSQL via Supabase |
| FR 5.1 | Real-time patient grid dashboard | Polls every 3 seconds |
| FR 5.2 | Highlight critical cases in red | Implemented |
| FR 5.3 | CHW can mark case as treated | Implemented |
| NF 1 | Secure CHW authentication | Supabase Auth |
| NF 5 | System available 24/7 | Vercel and Render deployment |
| NF 6 | Cross-browser support | Chrome, Firefox, Safari tested |
| NF 7 | Mobile and tablet accessible | Responsive CSS implemented |

---

## Phase 2 Roadmap

The following modules are visible in the sidebar as inactive and are planned for the next development phase: epidemic mapping, household grouping, CHW visit scheduling, antimalarial stock tracking, hardware fleet management, SMS gateway history, advanced analytics and CSV export, health protocol training modules, and Fongbe and Minan audio translation (NF4).

---

## Author

Menes Adisso
African Leadership University — Software Engineering
Summative Project — 2026