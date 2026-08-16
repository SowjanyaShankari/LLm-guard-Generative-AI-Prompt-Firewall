import React, { useMemo } from 'react';

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

  const chartData = useMemo(() => {
    return data.map((item) => ({
      hour: item.hour ?? '--',
      scanned: Number(item.scanned) || 0,
      blocked: Number(item.blocked) || 0
    }));
  }, [data]);


  const totals = useMemo(() => {
    return chartData.reduce(
      (result, item) => ({
        scanned: result.scanned + item.scanned,
        blocked: result.blocked + item.blocked
      }),
      {
        scanned: 0,
        blocked: 0
      }
    );
  }, [chartData]);


  const blockRate =
    totals.scanned > 0
      ? Math.round((totals.blocked / totals.scanned) * 100)
      : 0;


  return (
    <section style={styles.panel}>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div style={styles.header}>

        <div>

          <div style={styles.eyebrow}>
            THREAT MONITORING
          </div>

          <h2 style={styles.title}>
            Prompt Security Trend
          </h2>

          <p style={styles.subtitle}>
            Real-time prompt activity and firewall decisions
          </p>

        </div>


        <div style={styles.status}>

          <span style={styles.statusDot} />

          LIVE

        </div>

      </div>


      {/* =====================================================
          LEGEND
          ===================================================== */}

      <div style={styles.legendRow}>

        <div style={styles.legendItem}>

          <span
            style={{
              ...styles.legendDot,
              background: 'var(--accent-info)'
            }}
          />

          <span>
            Scanned
          </span>

        </div>


        <div style={styles.legendItem}>

          <span
            style={{
              ...styles.legendDot,
              background: 'var(--accent-threat)'
            }}
          />

          <span>
            Blocked
          </span>

        </div>


        <div style={styles.legendSpacer} />


        <div style={styles.blockRate}>

          Block Rate

          <strong>
            {blockRate}%
          </strong>

        </div>

      </div>


      {/* =====================================================
          CHART
          ===================================================== */}

      {chartData.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            ◌
          </div>

          <div style={styles.emptyTitle}>
            No Threat Activity Yet
          </div>

          <div style={styles.emptyText}>
            Scan prompts to start building the security trend.
          </div>

          <div style={styles.monitoringBadge}>

            <span style={styles.monitoringDot} />

            WAITING FOR SCAN ACTIVITY

          </div>

        </div>

      ) : (

        <div style={styles.chart}>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0
              }}
            >

              <defs>

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
                    stopOpacity={0.22}
                  />

                  <stop
                    offset="100%"
                    stopColor="#4ea1ff"
                    stopOpacity={0}
                  />

                </linearGradient>


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
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="100%"
                    stopColor="#ff5c69"
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
                  fontSize: 9
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />


              <YAxis
                allowDecimals={false}
                tick={{
                  fill: '#718398',
                  fontSize: 9
                }}
                axisLine={false}
                tickLine={false}
                width={35}
              />


              <Tooltip
                cursor={{
                  stroke: '#334b68',
                  strokeDasharray: '4 4'
                }}

                contentStyle={{
                  background: '#0b1728',
                  border: '1px solid #29435f',
                  borderRadius: 8,
                  color: '#e8f0f7',
                  fontSize: 11,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                }}

                labelStyle={{
                  color: '#a8b8c8',
                  marginBottom: 5
                }}

                itemStyle={{
                  color: '#e8f0f7'
                }}
              />


              <Area
                type="monotone"
                dataKey="scanned"
                name="Scanned"
                stroke="#4ea1ff"
                fill="url(#scannedGradient)"
                strokeWidth={2}
                activeDot={{
                  r: 4
                }}
                animationDuration={500}
              />


              <Area
                type="monotone"
                dataKey="blocked"
                name="Blocked"
                stroke="#ff5c69"
                fill="url(#blockedGradient)"
                strokeWidth={2}
                activeDot={{
                  r: 4
                }}
                animationDuration={500}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      )}


      {/* =====================================================
          FOOTER METRICS
          ===================================================== */}

      <div style={styles.footer}>

        <div style={styles.footerItem}>

          <span style={styles.footerLabel}>
            DATA POINTS
          </span>

          <span
            className="mono"
            style={styles.footerValue}
          >
            {chartData.length}
          </span>

        </div>


        <div style={styles.footerItem}>

          <span style={styles.footerLabel}>
            TOTAL SCANNED
          </span>

          <span
            className="mono"
            style={styles.footerValue}
          >
            {totals.scanned}
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
              color:
                totals.blocked > 0
                  ? 'var(--accent-threat)'
                  : 'var(--text-primary)'
            }}
          >
            {totals.blocked}
          </span>

        </div>


        <div style={styles.footerItem}>

          <span style={styles.footerLabel}>
            BLOCK RATE
          </span>

          <span
            className="mono"
            style={{
              ...styles.footerValue,
              color:
                blockRate > 0
                  ? 'var(--accent-threat)'
                  : 'var(--accent-safe)'
            }}
          >
            {blockRate}%
          </span>

        </div>

      </div>

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

    boxShadow:
      '0 10px 30px rgba(0,0,0,0.16)'
  },


  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 15,

    marginBottom: 10,

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


  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,

    padding: '5px 8px',

    border:
      '1px solid var(--accent-safe)',

    borderRadius: 4,

    color: 'var(--accent-safe)',

    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    fontWeight: 700,

    letterSpacing: '0.08em'
  },


  statusDot: {
    width: 5,
    height: 5,

    borderRadius: '50%',

    background: 'var(--accent-safe)'
  },


  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,

    marginBottom: 8,

    flexWrap: 'wrap'
  },


  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,

    color: 'var(--text-muted)',

    fontSize: 9
  },


  legendDot: {
    width: 6,
    height: 6,

    borderRadius: '50%'
  },


  legendSpacer: {
    flex: 1
  },


  blockRate: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,

    color: 'var(--text-dim)',

    fontFamily: 'var(--font-mono)',
    fontSize: 8
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

    border:
      '1px dashed var(--border-hair)',

    borderRadius:
      'var(--radius-sm)'
  },


  emptyIcon: {
    width: 42,
    height: 42,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '50%',

    background:
      'var(--accent-info-dim)',

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


  monitoringBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,

    marginTop: 14,

    padding: '5px 8px',

    border:
      '1px solid var(--border-hair)',

    borderRadius: 4,

    color: 'var(--text-dim)',

    fontFamily: 'var(--font-mono)',
    fontSize: 8,

    letterSpacing: '0.05em'
  },


  monitoringDot: {
    width: 5,
    height: 5,

    borderRadius: '50%',

    background:
      'var(--accent-safe)'
  },


  footer: {
    display: 'flex',

    gap: 25,

    marginTop: 12,

    paddingTop: 12,

    borderTop:
      '1px solid var(--border-hair)',

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