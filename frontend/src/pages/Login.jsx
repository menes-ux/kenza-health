import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email/username and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const formattedEmail = email.includes('@') ? email : `${email}@kenza.health`;

    if (isSignUp) {
      // Handle Sign Up
      const { error: signUpError } = await supabase.auth.signUp({
        email: formattedEmail,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccessMsg('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      }
    } else {
      // Handle Sign In
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        if (onLogin) onLogin(data.session);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          width: 100vw;
          height: 100vh;
          display: flex;
          background: #0d0d0e;
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .login-left {
          flex: 1;
          background: #121214;
          border-right: 1px solid #222225;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .login-right {
          width: 480px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right { width: 100%; }
        }

        .pulse-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 214, 0, 0.05);
          border: 1px solid rgba(255, 214, 0, 0.2);
          padding: 12px 16px;
          border-radius: 8px;
          width: fit-content;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #FFD600;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(255, 214, 0, 0.7);
          animation: pulse-ring 1.8s infinite cubic-bezier(0.66, 0, 0, 1);
        }

        @keyframes pulse-ring {
          to { box-shadow: 0 0 0 12px rgba(255, 214, 0, 0); }
        }

        .input-field {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          border: 1px solid #e2e2e0;
          border-radius: 8px;
          outline: none;
          background: #fafafa;
          color: #111;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #111;
          background: #fff;
        }
      `}</style>

      {/* Left Panel */}
      <div className="login-left">
        <div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
            KENZA <span style={{ color: '#FFD600' }}>H.</span>
          </div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Malaria Telemetry & Monitoring · Lokossa, Benin
          </div>
        </div>

        <div style={{ maxWidth: '460px' }}>
          <div className="pulse-container" style={{ marginBottom: '24px' }}>
            <div className="pulse-dot"></div>
            <span style={{ fontSize: '12px', color: '#FFD600', fontWeight: 600 }}>
              SYSTEM ONLINE · AES-128 ENCRYPTED
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f5f5f3', marginBottom: '6px' }}>
              Community Decision-Support Platform
            </div>
            <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.6', margin: 0 }}>
              Welcome to Kenza Health. This Minimum Viable Product (MVP) provides automated fever triage and real-time clinical decision support for Community Health Workers.
            </p>
          </div>

          <div style={{ borderTop: '1px solid #222225', paddingTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e4e4e7', marginBottom: '6px' }}>
              Plateforme d'Aide à la Décision Communautaire
            </div>
            <p style={{ fontSize: '12.5px', color: '#71717a', lineHeight: '1.6', margin: 0 }}>
              Bienvenue sur Kenza Health. Ce produit minimum viable (MVP) assure le tri automatique des accès fébriles et l'aide à la décision clinique en temps réel.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#52525b' }}>
          SHA-256 Authentication Standard · Kenza Health Telemetry v1.0
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>
              {isSignUp ? 'Create Account' : 'Sign in'}
            </div>
            <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
              {isSignUp ? 'Register as a new CHW' : 'Community Health Worker access only'}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>
                Username or Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. evaluator"
                className="input-field"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: '#3f3f46', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            {error && (
              <div style={{ fontSize: '12px', color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{ fontSize: '12px', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#FFD600',
                color: '#111',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign in')}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccessMsg('');
              }}
              style={{ background: 'none', border: 'none', color: '#111', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
             
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#a1a1aa', textAlign: 'center', marginTop: '24px' }}>
            Access restricted to registered CHWs · Lokossa District
          </div>
        </div>
      </div>
    </div>
  );
}