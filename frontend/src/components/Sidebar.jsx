import React from "react";
import {
  FaChartLine,
  FaBell,
  FaShieldAlt,
  FaLock,
  FaCog
} from "react-icons/fa";

const NAV_ITEMS = [
  {
    key: "overview",
    label: "Overview",
    icon: <FaChartLine />
  },
  {
    key: "alerts",
    label: "Alerts",
    icon: <FaBell />
  },
  {
    key: "prompts",
    label: "Blocked Prompts",
    icon: <FaShieldAlt />
  },
  {
    key: "dlp",
    label: "DLP Activity",
    icon: <FaLock />
  },
  {
    key: "rules",
    label: "Firewall Rules",
    icon: <FaShieldAlt />
  },
  {
    key: "settings",
    label: "Settings",
    icon: <FaCog />
  }
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logoCircle}>🛡️</div>

        <div>
          <div style={styles.brandText}>LLM-GUARD</div>
          <div style={styles.brandSub}>AI Prompt Firewall</div>
        </div>
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
              <span style={styles.icon}>
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div>LLM-Guard v1.0</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>
          SOC Dashboard
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    minWidth: 260,
    height: "100vh",
    background: "#0F172A",
    borderRight: "1px solid #1E293B",
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #1E293B"
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: "#22C55E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22
  },

  brandText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1
  },

  brandSub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    background: "transparent",
    border: "none",
    color: "#CBD5E1",
    fontSize: 15,
    borderRadius: 12,
    cursor: "pointer",
    transition: "0.25s",
    textAlign: "left"
  },

  navItemActive: {
    background: "#1E293B",
    color: "#22C55E",
    boxShadow: "0 0 15px rgba(34,197,94,.25)"
  },

  icon: {
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22
  },

  footer: {
    borderTop: "1px solid #1E293B",
    paddingTop: 20,
    color: "#64748B",
    fontSize: 13,
    textAlign: "center"
  }
};