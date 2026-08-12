import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import MetricCard from './components/MetricCard.jsx';
import AlertsFeed from './components/AlertsFeed.jsx';
import ThreatChart from './components/ThreatChart.jsx';
import { metrics, alerts, trend } from './data/mockData.js';

const PAGE_TITLES = {
  overview: 'Overview',
  alerts: 'Alerts',
  prompts: 'Blocked Prompts',
  dlp: 'DLP Activity',
  rules: 'Firewall Rules',
  settings: 'Settings'
};

export default function App() {
  const [active, setActive] = useState('overview');

  return (
    <div style={styles.shell}>
      <Sidebar active={active} onSelect={setActive} />

      <div style={styles.main}>
        <Topbar title={PAGE_TITLES[active]} />

        <div style={styles.content}>
          {active === 'overview' ? (
            <>
              <div style={styles.metricsRow}>
                {metrics.map((m) => (
                  <MetricCard key={m.id} label={m.label} value={m.value} tone={m.tone} />
                ))}
              </div>

              <div style={styles.panelsRow}>
                <ThreatChart data={trend} />
                <AlertsFeed alerts={alerts} />
              </div>
            </>
          ) : (
            <div style={styles.placeholder}>
              <p>
                {PAGE_TITLES[active]} view — not yet built. This is scaffolding for the
                Week 1 deliverable; each nav section becomes its own page as the
                Backend Security Engineer's telemetry API comes online.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    display: 'flex',
    height: '100vh',
    width: '100%'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  content: {
    flex: 1,
    padding: 24,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  metricsRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  panelsRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  },
  placeholder: {
    border: '1px dashed var(--border-hair-bright)',
    borderRadius: 'var(--radius-md)',
    padding: 32,
    color: 'var(--text-muted)',
    fontSize: 14
  }
};
