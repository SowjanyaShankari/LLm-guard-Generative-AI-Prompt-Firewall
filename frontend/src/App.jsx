import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import MetricCard from './components/MetricCard.jsx';
import AlertsFeed from './components/AlertsFeed.jsx';
import ThreatChart from './components/ThreatChart.jsx';
import PromptTester from './components/PromptTester.jsx';
<<<<<<< HEAD
import { useHealth } from './hooks/useHealth.js';
import { useLiveMetrics, useLiveAlerts, useLiveTrend } from './hooks/useLiveTelemetry.js';
import { postScan } from './api/scan.js';

const PAGE_TITLES = {
  overview: 'Overview', alerts: 'Alerts', prompts: 'Blocked Prompts',
  dlp: 'DLP Activity', rules: 'Firewall Rules', settings: 'Settings'
=======
import SettingsPanel from './components/SettingsPanel.jsx';

import { useHealth } from './hooks/useHealth.js';
import {
  useLiveMetrics,
  useLiveAlerts,
  useLiveTrend
} from './hooks/useLiveTelemetry.js';

import { postScan } from './api/scan.js';

const PAGE_TITLES = {
  overview: 'Overview',
  alerts: 'Alerts',
  prompts: 'Blocked Prompts',
  dlp: 'DLP Activity',
  rules: 'Firewall Rules',
  settings: 'Settings'
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
};

export default function App() {
  const [active, setActive] = useState('overview');
<<<<<<< HEAD
  const healthStatus = useHealth();
  const { metrics, error: metricsError } = useLiveMetrics();
  const { alerts, error: alertsError } = useLiveAlerts();
  const { trend, error: trendError } = useLiveTrend();
=======

  const healthStatus = useHealth();

  const { metrics, error: metricsError } = useLiveMetrics();
  const { alerts, error: alertsError } = useLiveAlerts();
  const { trend, error: trendError } = useLiveTrend();

>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function handleSubmit(promptText) {
    setSubmitting(true);
    setSubmitError(null);
<<<<<<< HEAD
=======

>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
    try {
      return await postScan(promptText);
    } catch (err) {
      setSubmitError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.shell}>
      <Sidebar active={active} onSelect={setActive} />
<<<<<<< HEAD
      <div style={styles.main}>
        <Topbar title={PAGE_TITLES[active]} healthStatus={healthStatus} />
        <div style={styles.content}>
          {active === 'overview' ? (
            <>
              <PromptTester onSubmit={handleSubmit} submitting={submitting} />
              {submitError && <p style={styles.errorHint}>Last scan failed: {submitError.message}</p>}
              <div style={styles.metricsRow}>
                {metricsError ? (
                  <p style={styles.errorHint}>Couldn't load metrics: {metricsError.message}</p>
                ) : (
                  metrics.map((m) => <MetricCard key={m.id} label={m.label} value={m.value} tone={m.tone} />)
                )}
              </div>
              <div style={styles.panelsRow}>
                {trendError ? (
                  <p style={styles.errorHint}>Couldn't load trend: {trendError.message}</p>
                ) : (
                  <ThreatChart data={trend} />
                )}
                {alertsError ? (
                  <p style={styles.errorHint}>Couldn't load alerts: {alertsError.message}</p>
=======

      <div style={styles.main}>
        <Topbar
          title={PAGE_TITLES[active]}
          healthStatus={healthStatus}
        />

        <div style={styles.content}>
          {active === 'overview' ? (
            <>
              <PromptTester
                onSubmit={handleSubmit}
                submitting={submitting}
              />

              {submitError && (
                <p style={styles.errorHint}>
                  Last scan failed: {submitError.message}
                </p>
              )}

              <div style={styles.metricsRow}>
                {metricsError ? (
                  <p style={styles.errorHint}>
                    Couldn't load metrics: {metricsError.message}
                  </p>
                ) : (
                  metrics.map((m) => (
                    <MetricCard
                      key={m.id}
                      label={m.label}
                      value={m.value}
                      tone={m.tone}
                    />
                  ))
                )}
              </div>

              <div style={styles.panelsRow}>
                {trendError ? (
                  <p style={styles.errorHint}>
                    Couldn't load trend: {trendError.message}
                  </p>
                ) : (
                  <ThreatChart data={trend} />
                )}

                {alertsError ? (
                  <p style={styles.errorHint}>
                    Couldn't load alerts: {alertsError.message}
                  </p>
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
                ) : (
                  <AlertsFeed alerts={alerts} />
                )}
              </div>
            </>
<<<<<<< HEAD
          ) : (
            <div style={styles.placeholder}><p>{PAGE_TITLES[active]} view — not yet built.</p></div>
=======
          ) : active === 'settings' ? (
            <SettingsPanel />
          ) : (
            <div style={styles.placeholder}>
              <p>
                {PAGE_TITLES[active]} view — not yet built.
              </p>
            </div>
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
<<<<<<< HEAD
  shell: { display: 'flex', height: '100vh', width: '100%' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  content: { flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 },
  metricsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  panelsRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  placeholder: { border: '1px dashed var(--border-hair-bright)', borderRadius: 'var(--radius-md)', padding: 32, color: 'var(--text-muted)', fontSize: 14 },
  errorHint: { color: 'var(--accent-critical)', fontSize: 13 }
};
=======
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
  },

  errorHint: {
    color: 'var(--accent-critical)',
    fontSize: 13
  }
};
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
