'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <h2 style={styles.title}>TAPIZCENTER</h2>
          <p style={styles.subtitle}>Panel de Administración</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tapizcenter.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '2rem 1rem',
    background: 'radial-gradient(circle at center, #1b263b 0%, #0d1b2a 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(27, 38, 59, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(224, 225, 221, 0.15)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 20px 40px rgba(13, 27, 42, 0.5), 0 0 25px rgba(212, 175, 55, 0.1)',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '3px',
    margin: 0,
    fontFamily: 'var(--font-display)',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#778da9',
    marginTop: '0.25rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#e0e1dd',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    border: '1px solid rgba(65, 90, 119, 0.5)',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  button: {
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#D4AF37',
    color: '#0D1B2A',
    fontWeight: '700',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
};
