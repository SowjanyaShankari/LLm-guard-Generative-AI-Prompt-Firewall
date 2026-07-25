import React from 'react';

const SEVERITY_STYLE = {
  critical: { color: 'var(--accent-critical)', label: 'CRITICAL' },
  high: { color: 'var(--accent-threat)', label: 'HIGH' },
  medium: { color: '#e0b84f', label: 'MEDIUM' },
  low: { color: 'var(--text-muted)', label: 'LOW' }
};

export default function AlertsFeed({ alerts }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.heading}>Recent Alerts</h2>
      <ul style={styles.list}>
        {alerts.map((alert) => {
          const sev = SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.low;
          return (
            <li key={alert.id} style={styles.row}>
              <span
                className="mono"
                style={{ ...styles.badge, color: sev.color, borderColor: sev.color }}
              >
                {sev.label}
              </span>
              <div style={styles.rowBody}>
                <div style={styles.rowTop}>
                  <span style={styles.rowType}>{alert.type}</span>
                  <span className="mono" style={styles.rowTime}>
                    {alert.time}
                  </span>
                </div>
                <p style={styles.rowSummary}>{alert.summary}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const styles = {
  panel: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    padding: 16,
    flex: '1 1 380px'
  },
  heading: {
    margin: '0 0 12px 0',
    fontSize: 14,
    color: 'var(--text-primary)'
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-hair)',
    paddingBottom: 10
  },
  badge: {
    flexShrink: 0,
    fontSize: 10,
    padding: '3px 6px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid',
    height: 'fit-content'
  },
  rowBody: {
    flex: 1
  },
  rowTop: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  rowType: {
    fontSize: 13,
    fontWeight: 600
  },
  rowTime: {
    fontSize: 11,
    color: 'var(--text-dim)'
  },
  rowSummary: {
    margin: '4px 0 0 0',
    fontSize: 12,
    color: 'var(--text-muted)',
    lineHeight: 1.4
  }
};
