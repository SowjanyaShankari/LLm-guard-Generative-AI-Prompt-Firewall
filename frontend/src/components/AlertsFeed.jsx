import React from 'react';

const SEVERITY_CONFIG = {
  critical: {
    label: 'CRITICAL',
    color: 'var(--accent-threat)',
    background: 'var(--accent-threat-dim)',
    icon: '!'
  },

  high: {
    label: 'HIGH',
    color: '#ff7b5c',
    background: 'rgba(255,123,92,0.10)',
    icon: '!'
  },

  medium: {
    label: 'MEDIUM',
    color: 'var(--accent-warning)',
    background: 'var(--accent-warning-dim)',
    icon: '!'
  },

  low: {
    label: 'LOW',
    color: 'var(--accent-safe)',
    background: 'var(--accent-safe-dim)',
    icon: '✓'
  }
};

export default function AlertsFeed({ alerts = [] }) {
  return (
    <section style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            SECURITY EVENTS
          </div>

          <h2 style={styles.title}>
            Recent Alerts
          </h2>

          <p style={styles.subtitle}>
            Latest suspicious activity detected by LLM-Guard
          </p>
        </div>

        <div style={styles.count}>
          {alerts.length}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            ✓
          </div>

          <div style={styles.emptyTitle}>
            No security threats detected
          </div>

          <div style={styles.emptyText}>
            Flagged prompts will appear here automatically.
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {alerts.slice(0, 6).map((alert, index) => {
            const severity =
              SEVERITY_CONFIG[alert.severity] ??
              SEVERITY_CONFIG.low;

            return (
              <div
                key={alert.id ?? index}
                style={styles.alert}
              >
                {/* Severity indicator */}
                <div
                  style={{
                    ...styles.severityBar,
                    background: severity.color
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    ...styles.icon,
                    color: severity.color,
                    background: severity.background
                  }}
                >
                  {severity.icon}
                </div>

                {/* Main content */}
                <div style={styles.content}>
                  <div style={styles.topRow}>
                    <span
                      style={{
                        ...styles.severity,
                        color: severity.color
                      }}
                    >
                      {severity.label}
                    </span>

                    <span style={styles.time}>
                      {alert.time}
                    </span>
                  </div>

                  <div style={styles.type}>
                    {alert.type || 'Security Alert'}
                  </div>

                  <div style={styles.summary}>
                    {alert.summary || 'Suspicious activity detected.'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {alerts.length > 0 && (
        <div style={styles.footer}>
          <span>
            Showing {Math.min(alerts.length, 6)} of {alerts.length} alerts
          </span>

          <span style={styles.live}>
            <span style={styles.liveDot} />
            LIVE SESSION
          </span>
        </div>
      )}
    </section>
  );
}

const styles = {
  panel: {
    flex: '1 1 340px',
    minWidth: 300,
    background:
      'linear-gradient(145deg, rgba(15,31,51,0.98), rgba(7,18,32,0.98))',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    padding: 18,
    boxShadow: '0 10px 30px rgba(0,0,0,0.16)'
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15
  },

  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.13em',
    color: 'var(--accent-threat)',
    marginBottom: 4
  },

  title: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)'
  },

  subtitle: {
    margin: '4px 0 0',
    fontSize: 10,
    color: 'var(--text-muted)'
  },

  count: {
    minWidth: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--accent-threat-dim)',
    color: 'var(--accent-threat)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },

  alert: {
    position: 'relative',
    display: 'flex',
    gap: 10,
    minHeight: 70,
    overflow: 'hidden',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255,255,255,0.015)'
  },

  severityBar: {
    width: 3,
    minWidth: 3
  },

  icon: {
    width: 28,
    height: 28,
    minWidth: 28,
    marginTop: 11,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 800
  },

  content: {
    flex: 1,
    minWidth: 0,
    padding: '10px 10px 10px 0'
  },

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },

  severity: {
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    fontWeight: 800,
    letterSpacing: '0.08em'
  },

  time: {
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    color: 'var(--text-dim)'
  },

  type: {
    marginTop: 4,
    color: 'var(--text-primary)',
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  summary: {
    marginTop: 2,
    color: 'var(--text-muted)',
    fontSize: 9,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  empty: {
    minHeight: 260,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--border-hair)',
    borderRadius: 'var(--radius-sm)',
    textAlign: 'center'
  },

  emptyIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--accent-safe-dim)',
    color: 'var(--accent-safe)',
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 10
  },

  emptyTitle: {
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 600
  },

  emptyText: {
    marginTop: 4,
    color: 'var(--text-dim)',
    fontSize: 10
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTop: '1px solid var(--border-hair)',
    color: 'var(--text-dim)',
    fontSize: 9
  },

  live: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    color: 'var(--accent-safe)'
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
  }
};