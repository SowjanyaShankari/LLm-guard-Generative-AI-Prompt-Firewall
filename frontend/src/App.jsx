import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import MetricCard from './components/MetricCard.jsx';
import AlertsFeed from './components/AlertsFeed.jsx';
import ThreatChart from './components/ThreatChart.jsx';
import PromptTester from './components/PromptTester.jsx';
import { useHealth } from './hooks/useHealth.js';
import { useScanSession } from './hooks/useScanSession.js';

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

  const healthStatus = useHealth();
  const { alerts, metrics, trend, submitPrompt, submitting, error } = useScanSession();

  return (
    <div style={styles.shell}>
      <Sidebar active={active} onSelect={setActive} />

      <div style={styles.main}>
        <Topbar title={PAGE_TITLES[active]} healthStatus={healthStatus} />

        <div style={styles.content}>
          {active === 'overview' ? (
            <>
              <PromptTester onSubmit={submitPrompt} submitting={submitting} />

              {error && (
                <p style={styles.errorHint}>
                  Last scan failed: {error.message}. Check the backend is running and
                  VITE_API_KEY matches backend/auth.py.
                </p>
              )}

              <div style={styles.metricsRow}>
                {metrics.map((m) => (
                  <MetricCard key={m.id} label={m.label} value={m.value} tone={m.tone} />
                ))}
              </div>

              <div style={styles.panelsRow}>
                {trend.length === 0 ? (
                  <p style={styles.hint}>Scan a prompt above to start building the trend chart.</p>
                ) : (
                  <ThreatChart data={trend} />
                )}

                {alerts.length === 0 ? (
                  <p style={styles.hint}>No flagged prompts yet this session.</p>
                ) : (
                  <AlertsFeed alerts={alerts} />
                )}
              </div>
            </>
          ) : (
            <div style={styles.placeholder}>
              <p>
                {PAGE_TITLES[active]} view — not yet built. This nav section becomes its
                own page once the backend exposes a matching endpoint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: { display: 'flex', height: '100vh', width: '100%' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  content: {
    flex: 1,
    padding: 24,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  metricsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  panelsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  placeholder: {
    border: '1px dashed var(--border-hair-bright)',
    borderRadius: 'var(--radius-md)',
    padding: 32,
    color: 'var(--text-muted)',
    fontSize: 14
  },
  hint: { color: 'var(--text-muted)', fontSize: 13 },
  errorHint: { color: 'var(--accent-critical)', fontSize: 13 }
};
