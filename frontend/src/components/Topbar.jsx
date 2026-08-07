import React from "react";

const STATUS_MAP = {
  open: {
    label: "ONLINE",
    color: "#22C55E"
  },
  connecting: {
    label: "CHECKING",
    color: "#F59E0B"
  },
  closed: {
    label: "OFFLINE",
    color: "#EF4444"
  }
};

export default function Topbar({
  title,
  healthStatus = "connecting"
}) {
  const status =
    STATUS_MAP[healthStatus] || STATUS_MAP.connecting;

  const now = new Date();

  const date = now.toLocaleDateString();

  const time = now.toLocaleTimeString();

  return (
    <header style={styles.bar}>
      <div>
        <h2 style={styles.title}>
          🛡 LLM-GUARD Security Operations Center
        </h2>

        <p style={styles.subtitle}>
          {title} • Generative AI Prompt Firewall
        </p>
      </div>

      <div style={styles.right}>

        <div style={styles.box}>
          <span
            style={{
              ...styles.dot,
              background: status.color
            }}
          />

          <div>
            <div style={styles.small}>
              Backend
            </div>

            <div style={styles.value}>
              {status.label}
            </div>
          </div>
        </div>

        <div style={styles.box}>
          <div style={styles.small}>
            Date
          </div>

          <div style={styles.value}>
            {date}
          </div>
        </div>

        <div style={styles.box}>
          <div style={styles.small}>
            Time
          </div>

          <div style={styles.value}>
            {time}
          </div>
        </div>

        <div style={styles.version}>
          Version 1.0
        </div>

      </div>
    </header>
  );
}

const styles = {
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#111827",
    padding: "18px 28px",
    borderBottom: "1px solid #1E293B",
    flexWrap: "wrap"
  },

  title: {
    margin: 0,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700"
  },

  subtitle: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 14
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap"
  },

  box: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#1E293B",
    padding: "10px 16px",
    borderRadius: 12
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%"
  },

  small: {
    color: "#94A3B8",
    fontSize: 11
  },

  value: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14
  },

  version: {
    background: "#22C55E",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: 30,
    fontWeight: "600",
    fontSize: 13
  }
};