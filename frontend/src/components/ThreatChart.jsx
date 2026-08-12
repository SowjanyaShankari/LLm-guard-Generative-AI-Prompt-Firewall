import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function ThreatChart({ data = [] }) {
  return (
    <section style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>THREAT MONITORING</div>

          <h2 style={styles.title}>
            Prompt Security Trend
          </h2>

          <p style={styles.subtitle}>
            Prompt activity and blocked threats during this session
          </p>
        </div>

        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span
              style={{
                ...styles.legendDot,
                background: 'var(--accent-threat)'
              }}
            />
            Blocked
          </span>

          <span style={styles.legendItem}>
            <span
              style={{
                ...styles.legendDot,
                background: 'var(--accent-info)'
              }}
            />
            Scanned
          </span>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>◌</div>

          <div style={styles.emptyTitle}>
            No threat activity yet
          </div>

          <div style={styles.emptyText}>
            Scan prompts to start building the security trend.
          </div>
        </div>
      ) : (
        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0
              }}
            >
              <defs>
                <linearGradient
                  id="blockedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#ff5c69"
                    stopOpacity={0.25}
                  />

                  <stop
                    offset="100%"
                    stopColor="#ff5c69"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="scannedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#4ea1ff"
                    stopOpacity={0.18}
                  />

                  <stop
                    offset="100%"
                    stopColor="#4ea1ff"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1c3048"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="hour"
                tick={{
                  fill: '#718398',
                  fontSize: 10
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: '#718398',
                  fontSize: 10
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: '#0b1728',
                  border: '1px solid #29435f',
                  borderRadius: 8,
                  color: '#e8f0f7',
                  fontSize: 11
                }}
                labelStyle={{
                  color: '#a8b8c8'
                }}
              />

              <Area
                type="monotone"
                dataKey="scanned"
                name="Scanned"
                stroke="#4ea1ff"
                fill="url(#scannedGradient)"
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="blocked"
                name="Blocked"
                stroke="#ff5c69"
                fill="url(#blockedGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom stats */}
      {data.length > 0 && (
        <div style={styles.footer}>
          <div style={styles.footerItem}>
            <span style={styles.footerLabel}>
              DATA POINTS
            </span>

            <span className="mono" style={styles.footerValue}>
              {data.length}
            </span>
          </div>

          <div style={styles.footerItem}>
            <span style={styles.footerLabel}>
              TOTAL SCANNED
            </span>

            <span className="mono" style={styles.footerValue}>
              {data.reduce(
                (total, item) => total + item.scanned,
                0
              )}
            </span>
          </div>

          <div style={styles.footerItem}>
            <span style={styles.footerLabel}>
              TOTAL BLOCKED
            </span>

            <span
              className="mono"
              style={{
                ...styles.footerValue,
                color: 'var(--accent-threat)'
              }}
            >
              {data.reduce(
                (total, item) => total + item.blocked,
                0
              )}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  panel: {
    flex: '2 1 520px',
    minWidth: 0,
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
    gap: 15,
    marginBottom: 12,
    flexWrap: 'wrap'
  },

  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.13em',
    color: 'var(--accent-info)',
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

  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    color: 'var(--text-muted)',
    fontSize: 10
  },

  legendDot: {
    width: 6,
    height: 6,
    borderRadius: '50%'
  },

  chart: {
    width: '100%',
    height: 250
  },

  empty: {
    height: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--border-hair)',
    borderRadius: 'var(--radius-sm)'
  },

  emptyIcon: {
    width: 42,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--accent-info-dim)',
    color: 'var(--accent-info)',
    fontSize: 20,
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
    gap: 25,
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid var(--border-hair)',
    flexWrap: 'wrap'
  },

  footerItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },

  footerLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    letterSpacing: '0.08em',
    color: 'var(--text-dim)'
  },

  footerValue: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-primary)'
  }
};