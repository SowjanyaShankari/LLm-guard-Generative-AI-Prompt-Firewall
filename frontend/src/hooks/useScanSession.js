import { useCallback, useState } from 'react';
import { postScan } from '../api/scan.js';

// The backend has no GET endpoint for past events yet — every /scan call
// is a one-shot request/response with nothing saved server-side. So this
// hook builds the dashboard's alerts/metrics/trend state client-side, in
// memory, from each real response as it comes back. It resets on page
// reload — that's a known limitation, not a bug. See README for what the
// backend needs to add for a persistent, shared dashboard.

const ACTION_TO_SEVERITY = {
  BLOCK: 'critical',
  WARN: 'medium',
  ALLOW: 'low'
};

function hourBucket(date) {
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

export function useScanSession() {
  const [alerts, setAlerts] = useState([]);
  const [trendMap, setTrendMap] = useState({});
  const [totals, setTotals] = useState({ scanned: 0, blocked: 0, warned: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitPrompt = useCallback(async (promptText) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await postScan(promptText);
      let action = "ALLOW";

if (result.status === "blocked") {
  action = "BLOCK";
} else {
  action = result.rules.action;
} // ALLOW | WARN | BLOCK
      const now = new Date();

      setTotals((prev) => ({
        scanned: prev.scanned + 1,
        blocked: prev.blocked + (action === 'BLOCK' ? 1 : 0),
        warned: prev.warned + (action === 'WARN' ? 1 : 0)
      }));

      if (action !== 'ALLOW') {
        setAlerts((prev) =>
          [
            {
              id: `${now.getTime()}`,
              severity: ACTION_TO_SEVERITY[action] ?? 'low',
              type: result.validation.matched_keywords.length
                ? `Pattern: ${result.validation.matched_keywords[0]}`
                : 'Flagged Prompt',
              summary: result.validation.reason,
              time: now.toLocaleTimeString()
            },
            ...prev
          ].slice(0, 50)
        );
      }

      const hour = hourBucket(now);
      setTrendMap((prev) => {
        const existing = prev[hour] ?? { blocked: 0, scanned: 0 };
        return {
          ...prev,
          [hour]: {
            blocked: existing.blocked + (action === 'BLOCK' ? 1 : 0),
            scanned: existing.scanned + 1
          }
        };
      });

      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const metrics = [
    { id: 'scanned', label: 'Prompts Scanned (session)', value: totals.scanned, tone: 'safe' },
    { id: 'blocked', label: 'Prompts Blocked (session)', value: totals.blocked, tone: 'threat' },
    { id: 'warned', label: 'Prompts Flagged (session)', value: totals.warned, tone: 'threat' }
  ];

  const trend = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, v]) => ({ hour, ...v }));

  return { alerts, metrics, trend, submitPrompt, submitting, error };
}
