import React from 'react';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: '⌂' },
  { key: 'alerts', label: 'Alerts', icon: '◉' },
  { key: 'prompts', label: 'Blocked Prompts', icon: '⊘' },
  { key: 'dlp', label: 'DLP Activity', icon: '▣' },
  { key: 'rules', label: 'Firewall Rules', icon: '◇' },
  { key: 'settings', label: 'Settings', icon: '⚙' }
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.logo}>
          <span style={styles.logoShield}>◇</span>
        </div>

        <div>
          <div style={styles.brandText}>LLM-GUARD</div>
          <div style={styles.brandSubtitle}>AI SECURITY</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.sectionLabel}>SECURITY OPERATIONS</div>

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
                  ...styles.icon,
                  ...(isActive ? styles.iconActive : {})
                }}
              >
                {item.icon}
              </span>

              <span style={styles.navLabel}>{item.label}</span>

              {item.key === 'alerts' && (
                <span style={styles.badge}>!</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Protection status */}
      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <span style={styles.statusDot} />
          <span style={styles.statusTitle}>SYSTEM STATUS</span>
        </div>

        <div style={styles.protectedText}>PROTECTED</div>

        <div style={styles.statusDescription}>
          All security systems operational
        </div>

        <div style={styles.shield}>
          ◇
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.version}>LLM-GUARD v1.0.0</div>
        <div style={styles.footerText}>AI Security Operations Center</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minWidth: 240,
    height: '100vh',
    background: 'rgba(5, 15, 27, 0.96)',
    borderRight: '1px solid var(--border-hair)',
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 14px',
    position: 'relative'
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '4px 10px 22px',
    borderBottom: '1px solid var(--border-hair)',
    marginBottom: 22
  },

  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'var(--accent-safe-dim)',
    border: '1px solid rgba(50, 213, 131, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  logoShield: {
    color: 'var(--accent-safe)',
    fontSize: 25,
    fontWeight: 700
  },

  brandText: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: '0.08em',
    color: 'var(--text-primary)'
  },

  brandSubtitle: {
    fontSize: 9,
    letterSpacing: '0.16em',
    color: 'var(--accent-safe)',
    marginTop: 2
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.13em',
    color: 'var(--text-dim)',
    padding: '0 10px 9px'
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1
  },

  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 12px',
    background: 'transparent',
    border: '1px solid transparent',
    color: 'var(--text-muted)',
    fontSize: 13,
    textAlign: 'left',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer'
  },

  navItemActive: {
    background: 'var(--accent-safe-dim)',
    border: '1px solid rgba(50, 213, 131, 0.16)',
    color: 'var(--text-primary)',
    boxShadow: 'inset 3px 0 0 var(--accent-safe)'
  },

  icon: {
    width: 20,
    textAlign: 'center',
    fontSize: 17,
    color: 'var(--text-dim)'
  },

  iconActive: {
    color: 'var(--accent-safe)'
  },

  navLabel: {
    flex: 1
  },

  badge: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--accent-threat)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  statusCard: {
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(145deg, rgba(50,213,131,0.08), rgba(11,23,40,0.8))',
    padding: 14,
    marginBottom: 18
  },

  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 7
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--accent-safe)',
    boxShadow: '0 0 10px rgba(50, 213, 131, 0.6)',
    animation: 'guard-pulse 2s infinite'
  },

  statusTitle: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)'
  },

  protectedText: {
    marginTop: 8,
    color: 'var(--accent-safe)',
    fontSize: 14,
    fontWeight: 700
  },

  statusDescription: {
    marginTop: 4,
    color: 'var(--text-dim)',
    fontSize: 10,
    lineHeight: 1.4,
    maxWidth: 150
  },

  shield: {
    position: 'absolute',
    right: 10,
    bottom: -5,
    fontSize: 58,
    color: 'rgba(50, 213, 131, 0.05)'
  },

  footer: {
    padding: '4px 8px'
  },

  version: {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10
  },

  footerText: {
    color: 'var(--text-dim)',
    fontSize: 9,
    marginTop: 3
  }
};