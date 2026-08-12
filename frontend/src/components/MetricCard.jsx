import React from 'react';

export default function MetricCard({
  label,
  value,
  tone = 'safe'
}) {
  const isThreat = tone === 'threat';

  const accent = isThreat
    ? 'var(--accent-threat)'
    : 'var(--accent-safe)';

  const icon = isThreat ? '⚠' : '✓';

  return (
    <div
      style={{
        ...styles.card,
        '--card-accent': accent
      }}
    >
      {/* Accent line */}
      <div
        style={{
          ...styles.accentBar,
          background: accent
        }}
      />

      <div style={styles.body}>
        {/* Top row */}
        <div style={styles.topRow}>
          <span style={styles.label}>
            {label}
          </span>

          <span
            style={{
              ...styles.icon,
              color: accent,
              borderColor: accent
            }}
          >
            {icon}
          </span>
        </div>

        {/* Metric value */}
        <div className="mono" style={styles.value}>
          {value}
        </div>

        {/* Status */}
        <div style={styles.statusRow}>
          <span
            style={{
              ...styles.statusDot,
              background: accent
            }}
          />

          <span style={styles.statusText}>
            {isThreat ? 'Security event detected' : 'Operating normally'}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    minWidth: 220,
    flex: '1 1 220px',
    minHeight: 138,
    overflow: 'hidden',

    background:
      'linear-gradient(145deg, rgba(17,32,52,0.98), rgba(8,20,35,0.98))',

    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',

    boxShadow:
      '0 8px 25px rgba(0,0,0,0.15)',

    transition:
      'transform 0.2s ease, border-color 0.2s ease'
  },

  accentBar: {
    width: 4,
    minWidth: 4
  },

  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px 17px'
  },

  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },

  label: {
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.03em',
    fontWeight: 500
  },

  icon: {
    width: 25,
    height: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    border: '1px solid',
    borderRadius: '50%',

    fontSize: 12,
    fontWeight: 700
  },

  value: {
    marginTop: 7,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em'
  },

  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginTop: 12
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%'
  },

  statusText: {
    fontSize: 10,
    color: 'var(--text-dim)'
  }
};