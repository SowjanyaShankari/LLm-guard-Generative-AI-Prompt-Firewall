import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ThreatChart({ data }) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.heading}>Blocked Prompts (24h Trend)</h2>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="blockedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-threat)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--accent-threat)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-hair)" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="var(--text-dim)"
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'var(--border-hair)' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-dim)"
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-panel-raised)',
                border: '1px solid var(--border-hair-bright)',
                borderRadius: 6,
                fontSize: 12
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="var(--accent-threat)"
              fill="url(#blockedFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const styles = {
  panel: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    padding: 16,
    flex: '2 1 480px'
  },
  heading: {
    margin: '0 0 12px 0',
    fontSize: 14,
    color: 'var(--text-primary)'
  }
};
