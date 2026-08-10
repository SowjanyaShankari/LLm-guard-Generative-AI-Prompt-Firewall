import React from "react";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaExclamationTriangle,
  FaChartLine
} from "react-icons/fa";

export default function MetricCard({
  label,
  value,
  tone = "safe"
}) {

  let icon = <FaChartLine />;
  let color = "#3B82F6";

  if (label.toLowerCase().includes("scanned")) {
    icon = <FaChartLine />;
    color = "#3B82F6";
  }

  if (label.toLowerCase().includes("blocked")) {
    icon = <FaShieldAlt />;
    color = "#EF4444";
  }

  if (label.toLowerCase().includes("flagged")) {
    icon = <FaExclamationTriangle />;
    color = "#F59E0B";
  }

  if (tone === "safe") {
    color = "#22C55E";
  }

  return (
    <div style={styles.card}>

      <div
        style={{
          ...styles.iconBox,
          background: color
        }}
      >
        {icon}
      </div>

      <div style={styles.info}>

        <div style={styles.label}>
          {label}
        </div>

        <div style={styles.value}>
          {value}
        </div>

      </div>

    </div>
  );
}

const styles = {

  card: {
    background: "#162032",
    border: "1px solid #263244",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 18,
    minWidth: 240,
    flex: "1 1 240px",
    boxShadow: "0 4px 15px rgba(0,0,0,.25)",
    transition: ".25s"
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    color: "#fff"
  },

  info: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 6
  },

  value: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700"
  }

};