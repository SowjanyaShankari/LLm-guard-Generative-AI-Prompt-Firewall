import React from 'react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'prompts', label: 'Blocked Prompts' },
  { key: 'dlp', label: 'DLP Activity' },
  { key: 'rules', label: 'Firewall Rules' },
  { key: 'settings', label: 'Settings' }
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandMark}>◈</span>
        <span style={styles.brandText}>LLM-GUARD</span>
      </div>

      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {})
              }}
            >
              <span
                style={{
                  ...styles.navIndicator,
                  background: isActive ? 'var(--accent-safe)' : 'transparent'
                }}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={styles.footer} className="mono">
        v0.1.0-scaffold
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    height: '100%',
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border-hair)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 8px 20px 8px',
    borderBottom: '1px solid var(--border-hair)',
    marginBottom: 16
  },
  brandMark: {
    color: 'var(--accent-threat)',
    fontSize: 18
  },
  brandText: {
    fontWeight: 700,
    letterSpacing: '0.08em',
    fontSize: 14
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 14,
    textAlign: 'left',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer'
  },
  navItemActive: {
    background: 'var(--bg-panel-raised)',
    color: 'var(--text-primary)'
  },
  navIndicator: {
    width: 4,
    height: 4,
    borderRadius: '50%'
  },
  footer: {
    fontSize: 11,
    color: 'var(--text-dim)',
    padding: '8px'
  }
};
