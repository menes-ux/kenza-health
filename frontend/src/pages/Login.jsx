import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!username || !password) {
      setError("Enter your username and password.");
      return;
    }
    onLogin();
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#f5f5f3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "0.5px solid #e5e5e3",
        padding: "40px 36px",
        width: "380px",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", color: "#111" }}>
            KENZA <span style={{ color: "#FFD600" }}>H.</span>
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
            Malaria monitoring · Lokossa, Benin
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "18px", fontWeight: 500, color: "#111" }}>Sign in</div>
          <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
            Community health worker access only
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", color: "#555", display: "block", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. marie.koudjo"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "14px",
              border: "0.5px solid #ddd",
              borderRadius: "8px",
              outline: "none",
              background: "#fafafa",
              color: "#111",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: "#555", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "14px",
              border: "0.5px solid #ddd",
              borderRadius: "8px",
              outline: "none",
              background: "#fafafa",
              color: "#111",
              boxSizing: "border-box"
            }}
          />
        </div>

        {error && (
          <div style={{
            fontSize: "12px",
            color: "#A32D2D",
            background: "#FCEBEB",
            padding: "8px 12px",
            borderRadius: "8px",
            marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#FFD600",
            color: "#111",
            fontWeight: 700,
            fontSize: "14px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>

        <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "20px" }}>
          Access restricted to registered CHWs · Kenza Health v1.0
        </div>
      </div>
    </div>
  );
}