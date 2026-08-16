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

function getSeverity(alert) {
  return (
    SEVERITY_CONFIG[alert?.severity] ??
    SEVERITY_CONFIG.low
  );
}

function getAlertType(alert) {
  if (alert?.type) return alert.type;

  if (alert?.rule_triggered) {
    return alert.rule_triggered;
  }

  return 'Security Alert';
}

function getAlertSummary(alert) {
  if (alert?.summary) return alert.summary;

  if (alert?.reason) return alert.reason;

  return 'Suspicious activity detected.';
}

function getAlertTime(alert) {
  if (alert?.time) return alert.time;

  if (alert?.timestamp) return alert.timestamp;

  return 'Just now';
}

export default function AlertsFeed({ alerts = [] }) {
  const visibleAlerts = alerts.slice(0, 6);

  return (
    <section style={styles.panel}>

      {/* HEADER */}
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

        <div
          style={{
            ...styles.count,
            ...(alerts.length > 0
              ? styles.countActive
              : styles.countSafe)
          }}
        >
          {alerts.length}
        </div>

      </div>

      {/* EMPTY STATE */}
      {alerts.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            ✓
          </div>

          <div style={styles.emptyTitle}>
            No Security Threats Detected
          </div>

          <div style={styles.emptyText}>
            Flagged prompts will appear here automatically.
          </div>

          <div style={styles.monitoringBadge}>
            <span style={styles.monitoringDot} />
            MONITORING ACTIVE
          </div>

        </div>

      ) : (

        /* ALERT LIST */
        <div style={styles.list}>

          {visibleAlerts.map((alert, index) => {

            const severity = getSeverity(alert);

            return (
              <div
                key={alert?.id ?? index}
                style={styles.alert}
              >

                {/* SEVERITY BAR */}
                <div
                  style={{
                    ...styles.severityBar,
                    background: severity.color
                  }}
                />

                {/* ICON */}
                <div
                  style={{
                    ...styles.icon,
                    color: severity.color,
                    background: severity.background,
                    border: `1px solid ${severity.color}`
                  }}
                >
                  {severity.icon}
                </div>

                {/* CONTENT */}
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
                      {getAlertTime(alert)}
                    </span>

                  </div>

                  <div style={styles.type}>
                    {getAlertType(alert)}
                  </div>

                  <div style={styles.summary}>
                    {getAlertSummary(alert)}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* FOOTER */}
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
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 700
  },

  countActive: {
    background: 'var(--accent-threat-dim)',
    color: 'var(--accent-threat)',
    border: '1px solid var(--accent-threat)'
  },

  countSafe: {
    background: 'var(--accent-safe-dim)',
    color: 'var(--accent-safe)',
    border: '1px solid var(--accent-safe)'
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
    background: 'rgba(255,255,255,0.015)',
    transition: 'border-color 0.2s ease, background 0.2s ease'
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
    color: 'var(--text-dim)',
    whiteSpace: 'nowrap'
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
    lineHeight: 1.4,
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
    border: '1px solid var(--accent-safe)',
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

  monitoringBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    padding: '5px 8px',
    borderRadius: 4,
    border: '1px solid var(--border-hair)',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    letterSpacing: '0.06em'
  },

  monitoringDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
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