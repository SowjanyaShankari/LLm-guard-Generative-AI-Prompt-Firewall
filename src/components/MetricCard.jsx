import React from 'react';

export default function MetricCard({ label, value, tone = 'safe' }) {
  const accent = tone === 'threat' ? 'var(--accent-threat)' : 'var(--accent-safe)';

  return (
    <div style={styles.card}>
      <div style={{ ...styles.accentBar, background: accent }} />
      <div style={styles.body}>
        <span style={styles.label}>{label}</span>
        <span className="mono" style={styles.value}>
          {value}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    minWidth: 200,
    flex: '1 1 200px'
  },
  accentBar: {
    width: 4
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '14px 16px'
  },
  label: {
    fontSize: 12,
    color: 'var(--text-muted)'
  },
  value: {
    fontSize: 24,
    fontWeight: 600
  }
};
