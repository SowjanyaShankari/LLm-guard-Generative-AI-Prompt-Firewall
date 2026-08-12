import React from 'react';

const STATUS_MAP = {
  open: {
    label: 'ONLINE',
    color: 'var(--accent-safe)',
    description: 'All systems operational'
  },
  connecting: {
    label: 'CHECKING',
    color: '#e0b84f',
    description: 'Checking backend connection'
  },
  closed: {
    label: 'UNREACHABLE',
    color: 'var(--accent-threat)',
    description: 'Backend connection unavailable'
  }
};

export default function Topbar({
  title = 'Security Overview',
  healthStatus = 'connecting'
}) {
  const status = STATUS_MAP[healthStatus] ?? STATUS_MAP.connecting;

  return (
    <header style={styles.bar}>
      {/* Page title */}
      <div style={styles.titleArea}>
        <div style={styles.breadcrumb}>
          LLM-GUARD
          <span style={styles.separator}>/</span>
          SECURITY OPERATIONS
        </div>

        <h1 style={styles.title}>{title}</h1>

        <p style={styles.subtitle}>
          Generative AI Prompt Firewall — SOC monitoring dashboard
        </p>
      </div>

      {/* Right side controls */}
      <div style={styles.rightArea}>
        {/* Live monitoring indicator */}
        <div style={styles.liveIndicator}>
          <span
            style={{
              ...styles.pulseDot,
              background: status.color
            }}
          />

          <div>
            <div style={styles.liveText}>
              SYSTEM {status.label}
            </div>

            <div style={styles.liveDescription}>
              {status.description}
            </div>
          </div>
        </div>

        {/* Environment badge */}
        <div style={styles.environment}>
          <span style={styles.environmentDot} />
          LOCAL
        </div>
      </div>

      <style>{`
        @keyframes guard-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(50, 213, 131, 0.55);
          }

          70% {
            box-shadow: 0 0 0 7px rgba(50, 213, 131, 0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(50, 213, 131, 0);
          }
        }
      `}</style>
    </header>
  );
}

const styles = {
  bar: {
    minHeight: 82,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 26px',
    borderBottom: '1px solid var(--border-hair)',
    background:
      'linear-gradient(180deg, rgba(11,23,40,0.98), rgba(7,17,30,0.96))',
    flexWrap: 'wrap',
    gap: 16
  },

  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },

  breadcrumb: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.12em',
    color: 'var(--text-dim)',
    marginBottom: 3
  },

  separator: {
    margin: '0 7px',
    color: 'var(--accent-safe)'
  },

  title: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: 'var(--text-primary)'
  },

  subtitle: {
    margin: '3px 0 0',
    fontSize: 11,
    color: 'var(--text-muted)'
  },

  rightArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },

  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '8px 12px',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255,255,255,0.015)'
  },

  pulseDot: {
    width: 8,
    height: 8,
    minWidth: 8,
    borderRadius: '50%',
    animation: 'guard-pulse 2s infinite'
  },

  liveText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--text-primary)'
  },

  liveDescription: {
    fontSize: 9,
    color: 'var(--text-dim)',
    marginTop: 2
  },

  environment: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 10px',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.06em'
  },

  environmentDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
  }
};