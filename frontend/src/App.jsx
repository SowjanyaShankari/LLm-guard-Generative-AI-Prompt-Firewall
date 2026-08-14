import React, { useState } from 'react';

import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import MetricCard from './components/MetricCard.jsx';
import AlertsFeed from './components/AlertsFeed.jsx';
import Alerts from './components/Alerts.jsx';
import ThreatChart from './components/ThreatChart.jsx';
import PromptTester from './components/PromptTester.jsx';

import { useHealth } from './hooks/useHealth.js';
import { useScanSession } from './hooks/useScanSession.js';

const PAGE_TITLES = {
  overview: 'Security Overview',
  alerts: 'Security Alerts',
  prompts: 'Blocked Prompts',
  dlp: 'DLP Activity',
  rules: 'Firewall Rules',
  settings: 'Settings'
};

export default function App() {
  const [active, setActive] = useState('overview');

  const healthStatus = useHealth();

  const {
    alerts,
    metrics,
    trend,
    submitPrompt,
    submitting,
    error
  } = useScanSession();

  return (
    <div style={styles.shell}>

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar
        active={active}
        onSelect={setActive}
      />

      {/* =====================================================
          MAIN APPLICATION
          ===================================================== */}

      <main style={styles.main}>

        {/* Top navigation */}
        <Topbar
          title={PAGE_TITLES[active]}
          healthStatus={healthStatus}
        />

        {/* ===================================================
            CONTENT
            =================================================== */}

        <div style={styles.content}>

          {active === 'overview' ? (
  <Overview
    metrics={metrics}
    alerts={alerts}
    trend={trend}
    submitPrompt={submitPrompt}
    submitting={submitting}
    error={error}
  />
) : (
  <ModulePage active={active} />
)}

        </div>

      </main>
    </div>
  );
}


/* =========================================================
   OVERVIEW PAGE
   ========================================================= */

function Overview({
  metrics,
  alerts,
  trend,
  submitPrompt,
  submitting,
  error
}) {
  return (
    <>
      {/* ===================================================
          PAGE INTRO
          =================================================== */}

      <section style={styles.intro}>

        <div>
          <div style={styles.introEyebrow}>
            REAL-TIME SECURITY MONITORING
          </div>

          <h1 style={styles.introTitle}>
            AI Security Overview
          </h1>

          <p style={styles.introText}>
            Monitor prompt activity, detect threats, and protect
            your AI applications from malicious input.
          </p>
        </div>

        <div style={styles.protectionBadge}>
          <span style={styles.protectionDot} />

          <div>
            <div style={styles.protectionTitle}>
              PROTECTION ACTIVE
            </div>

            <div style={styles.protectionText}>
              LLM firewall is monitoring requests
            </div>
          </div>
        </div>

      </section>


      {/* ===================================================
          METRICS
          =================================================== */}

      <section style={styles.metricsGrid}>

        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            tone={metric.tone}
          />
        ))}

      </section>


      {/* ===================================================
          PROMPT SCANNER
          =================================================== */}

      <PromptTester
        onSubmit={submitPrompt}
        submitting={submitting}
      />

      {/* Backend/API error */}
      {error && (
        <div style={styles.errorBox}>

          <span style={styles.errorIcon}>
            !
          </span>

          <div>
            <strong style={styles.errorTitle}>
              Scan request failed
            </strong>

            <div style={styles.errorText}>
              {error.message}
            </div>
          </div>

        </div>
      )}


      {/* ===================================================
          ANALYTICS ROW
          =================================================== */}

      <section style={styles.analyticsGrid}>

        {/* Threat chart */}
        <ThreatChart
          data={trend}
        />

        {/* Alerts */}
        <AlertsFeed
          alerts={alerts}
        />

      </section>


      {/* ===================================================
          SECURITY SUMMARY
          =================================================== */}

      <SecuritySummary
        metrics={metrics}
      />


      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer style={styles.footer}>

        <div>
          <span style={styles.footerBrand}>
            LLM-GUARD
          </span>

          <span style={styles.footerDivider}>
            /
          </span>

          AI Security Operations Center
        </div>

        <div style={styles.footerRight}>
          <span>
            API v1.0
          </span>

          <span style={styles.footerDot}>
            •
          </span>

          <span>
            Firewall Active
          </span>

          <span style={styles.footerDot}>
            •
          </span>

          <span>
            Session Monitoring
          </span>
        </div>

      </footer>

    </>
  );
}


/* =========================================================
   SECURITY SUMMARY
   ========================================================= */

function SecuritySummary({ metrics }) {
  const scanned =
    metrics.find(
      (item) =>
        item.id === 'scanned'
    )?.value ?? 0;

  const blocked =
    metrics.find(
      (item) =>
        item.id === 'blocked'
    )?.value ?? 0;

  const warned =
    metrics.find(
      (item) =>
        item.id === 'warned'
    )?.value ?? 0;

  const safe =
    Math.max(
      Number(scanned) -
      Number(blocked) -
      Number(warned),
      0
    );

  return (
    <section style={styles.summaryPanel}>

      <div style={styles.summaryHeader}>

        <div>
          <div style={styles.summaryEyebrow}>
            SESSION SECURITY SUMMARY
          </div>

          <h2 style={styles.summaryTitle}>
            Current Protection Status
          </h2>
        </div>

        <div style={styles.summaryStatus}>
          <span style={styles.summaryStatusDot} />
          MONITORING
        </div>

      </div>

      <div style={styles.summaryGrid}>

        <SummaryItem
          label="Safe Prompts"
          value={safe}
          color="var(--accent-safe)"
        />

        <SummaryItem
          label="Blocked Threats"
          value={blocked}
          color="var(--accent-threat)"
        />

        <SummaryItem
          label="Warnings"
          value={warned}
          color="var(--accent-warning)"
        />

        <SummaryItem
          label="Total Activity"
          value={scanned}
          color="var(--accent-info)"
        />

      </div>

    </section>
  );
}


/* =========================================================
   SUMMARY ITEM
   ========================================================= */

function SummaryItem({
  label,
  value,
  color
}) {
  return (
    <div style={styles.summaryItem}>

      <div
        style={{
          ...styles.summaryIcon,
          color,
          borderColor: color
        }}
      >
        ●
      </div>

      <div>

        <div style={styles.summaryValue}>
          {value}
        </div>

        <div style={styles.summaryLabel}>
          {label}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PLACEHOLDER PAGES
   ========================================================= */

function Placeholder({ title }) {
  return (
    <section style={styles.placeholder}>

      <div style={styles.placeholderIcon}>
        ◇
      </div>

      <div style={styles.placeholderEyebrow}>
        LLM-GUARD MODULE
      </div>

      <h1 style={styles.placeholderTitle}>
        {title}
      </h1>

      <p style={styles.placeholderText}>
        This security module is ready for integration.
        The dashboard navigation is already connected and
        can be extended when the corresponding backend
        endpoint becomes available.
      </p>

      <div style={styles.placeholderStatus}>
        <span style={styles.placeholderDot} />
        MODULE READY
      </div>

    </section>
  );
}


/* =========================================================
   STYLES
   ========================================================= */

const styles = {

  shell: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    background: 'var(--bg-main)'
  },


  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },


  content: {
    flex: 1,
    padding: '24px 26px 30px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },


  /* -------------------------------------------------------
     INTRO
     ------------------------------------------------------- */

  intro: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: '2px 2px 0',
    flexWrap: 'wrap'
  },


  introEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.14em',
    color: 'var(--accent-safe)',
    marginBottom: 5
  },


  introTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em'
  },


  introText: {
    margin: '5px 0 0',
    maxWidth: 650,
    fontSize: 11,
    color: 'var(--text-muted)'
  },


  protectionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '10px 13px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(50,213,131,0.2)',
    background: 'var(--accent-safe-dim)'
  },


  protectionDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent-safe)',
    boxShadow: '0 0 10px rgba(50,213,131,0.5)'
  },


  protectionTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--accent-safe)'
  },


  protectionText: {
    marginTop: 2,
    fontSize: 9,
    color: 'var(--text-muted)'
  },


  /* -------------------------------------------------------
     METRICS
     ------------------------------------------------------- */

  metricsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 14
  },


  /* -------------------------------------------------------
     ANALYTICS
     ------------------------------------------------------- */

  analyticsGrid: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 14,
    flexWrap: 'wrap'
  },


  /* -------------------------------------------------------
     ERROR
     ------------------------------------------------------- */

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 13px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,92,105,0.25)',
    background: 'var(--accent-threat-dim)'
  },


  errorIcon: {
    width: 24,
    height: 24,
    minWidth: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--accent-threat)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 11
  },


  errorTitle: {
    color: 'var(--accent-threat)',
    fontSize: 11
  },


  errorText: {
    marginTop: 2,
    color: 'var(--text-muted)',
    fontSize: 10
  },


  /* -------------------------------------------------------
     SECURITY SUMMARY
     ------------------------------------------------------- */

  summaryPanel: {
    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',
    background:
      'linear-gradient(145deg, rgba(15,31,51,0.95), rgba(7,18,32,0.95))',
    padding: 18
  },


  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 16,
    flexWrap: 'wrap'
  },


  summaryEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    letterSpacing: '0.12em',
    color: 'var(--text-dim)',
    marginBottom: 4
  },


  summaryTitle: {
    margin: 0,
    fontSize: 14,
    color: 'var(--text-primary)'
  },


  summaryStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    color: 'var(--accent-safe)',
    letterSpacing: '0.06em'
  },


  summaryStatusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
  },


  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 10
  },


  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-hair)',
    background: 'rgba(255,255,255,0.012)'
  },


  summaryIcon: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: '50%',
    fontSize: 8
  },


  summaryValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text-primary)'
  },


  summaryLabel: {
    marginTop: 1,
    fontSize: 9,
    color: 'var(--text-muted)'
  },


  /* -------------------------------------------------------
     FOOTER
     ------------------------------------------------------- */

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 5,
    color: 'var(--text-dim)',
    fontSize: 9,
    flexWrap: 'wrap'
  },


  footerBrand: {
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700
  },


  footerDivider: {
    margin: '0 6px',
    color: 'var(--accent-safe)'
  },


  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: 'var(--font-mono)'
  },


  footerDot: {
    color: 'var(--border-hair-bright)'
  },


  /* -------------------------------------------------------
     PLACEHOLDER
     ------------------------------------------------------- */

  placeholder: {
    minHeight: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    border: '1px dashed var(--border-hair-bright)',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(11,23,40,0.55)',
    padding: 35
  },


  placeholderIcon: {
    width: 58,
    height: 58,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'var(--accent-safe-dim)',
    color: 'var(--accent-safe)',
    fontSize: 28,
    marginBottom: 15
  },


  placeholderEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.12em',
    color: 'var(--text-dim)'
  },


  placeholderTitle: {
    margin: '6px 0 0',
    fontSize: 20,
    color: 'var(--text-primary)'
  },


  placeholderText: {
    maxWidth: 500,
    margin: '8px 0 15px',
    color: 'var(--text-muted)',
    fontSize: 11,
    lineHeight: 1.6
  },


  placeholderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    color: 'var(--accent-safe)',
    fontFamily: 'var(--font-mono)',
    fontSize: 9
  },


  placeholderDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
  }
};