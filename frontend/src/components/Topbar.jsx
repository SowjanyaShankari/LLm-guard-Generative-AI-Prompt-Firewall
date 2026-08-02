import React from 'react';

const STATUS_MAP = {
  open: { label: 'ONLINE', color: 'var(--accent-safe)' },
  connecting: { label: 'CHECKING', color: '#e0b84f' },
  closed: { label: 'UNREACHABLE', color: 'var(--accent-threat)' }
};

// healthStatus comes from useHealth() in App.jsx, polling the real
// GET /health route on the backend.
export default function Topbar({ title, healthStatus = 'connecting' }) {
  const status = STATUS_MAP[healthStatus] ?? STATUS_MAP.connecting;

  return (
    <header style={styles.bar}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>Generative AI Prompt Firewall &mdash; SOC view</p>
      </div>

      <div style={styles.statusGroup}>
        <div style={styles.statusItem}>
          <span style={{ ...styles.pulseDot, background: status.color }} />
          <span className="mono" style={styles.statusText}>
            BACKEND: {status.label}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes guard-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(79, 209, 197, 0.55); }
          70%  { box-shadow: 0 0 0 6px rgba(79, 209, 197, 0); }
          100% { box-shadow: 0 0 0 0 rgba(79, 209, 197, 0); }
        }
      `}</style>
    </header>
  );
}

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-hair)',
    background: 'var(--bg-panel)',
    flexWrap: 'wrap',
    gap: 12
  },
  title: { margin: 0, fontSize: 18, fontWeight: 600 },
  subtitle: { margin: '2px 0 0 0', fontSize: 12, color: 'var(--text-muted)' },
  statusGroup: { display: 'flex', gap: 16 },
  statusItem: { display: 'flex', alignItems: 'center', gap: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: '50%', animation: 'guard-pulse 2s infinite' },
  statusText: { fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }
};
