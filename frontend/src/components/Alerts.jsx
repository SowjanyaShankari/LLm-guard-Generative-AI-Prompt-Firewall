import React from 'react';

export default function Alerts({ alerts = [] }) {
  return (
    <section style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Security Alerts</h2>

          <p style={styles.subtitle}>
            Suspicious prompt activity detected by LLM-Guard
          </p>
        </div>

        <div style={styles.badge}>
          {alerts.length} ALERT{alerts.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* No alerts */}
      {alerts.length === 0 ? (
        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            ✓
          </div>

          <h3 style={styles.emptyTitle}>
            No Security Alerts
          </h3>

          <p style={styles.emptyText}>
            No suspicious prompt activity has been detected
            in this session.
          </p>

        </div>
      ) : (

        /* Alerts list */
        <div style={styles.list}>

          {alerts.map((alert, index) => (

            <div
              key={alert.id || index}
              style={styles.alert}
            >

              {/* Severity */}
              <div style={styles.severity}>
                {alert.severity || 'CRITICAL'}
              </div>

              {/* Alert information */}
              <div style={styles.content}>

                <strong style={styles.contentStrong}>
                  {alert.title || 'Flagged Prompt'}
                </strong>

                <p style={styles.contentP}>
                  {alert.reason ||
                    'Suspicious prompt activity detected.'}
                </p>

                {/* Prompt */}
                {alert.prompt && (
                  <div style={styles.prompt}>
                    {alert.prompt}
                  </div>
                )}

              </div>

              {/* Time */}
              <div style={styles.time}>
                {alert.timestamp || 'Just now'}
              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}


const styles = {

  container: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    padding: 20
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600
  },

  subtitle: {
    margin: '5px 0 0',
    fontSize: 12,
    color: 'var(--text-muted)'
  },

  badge: {
    color: 'var(--accent-threat)',
    border: '1px solid var(--accent-threat)',
    borderRadius: 6,
    padding: '5px 9px',
    fontSize: 11,
    fontWeight: 700
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },

  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    background: 'var(--bg-panel-raised)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-sm)'
  },

  severity: {
    color: 'var(--accent-threat)',
    border: '1px solid var(--accent-threat)',
    borderRadius: 5,
    padding: '4px 7px',
    fontSize: 10,
    fontWeight: 700,
    minWidth: 65,
    textAlign: 'center'
  },

  content: {
    flex: 1
  },

  contentStrong: {
    fontSize: 13
  },

  contentP: {
    margin: '5px 0',
    fontSize: 12,
    color: 'var(--text-muted)'
  },

  prompt: {
    marginTop: 8,
    padding: 8,
    background: 'var(--bg-panel)',
    borderRadius: 4,
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  },

  time: {
    fontSize: 10,
    color: 'var(--text-dim)',
    whiteSpace: 'nowrap'
  },

  empty: {
    textAlign: 'center',
    padding: '50px 20px',
    color: 'var(--text-muted)'
  },

  emptyIcon: {
    margin: '0 auto 10px',
    width: 38,
    height: 38,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--accent-safe)',
    color: 'var(--accent-safe)',
    fontSize: 20
  },

  emptyTitle: {
    margin: '10px 0 5px',
    fontSize: 14,
    color: 'var(--text-primary)'
  },

  emptyText: {
    margin: 0,
    fontSize: 12,
    color: 'var(--text-muted)'
  }
  
};
