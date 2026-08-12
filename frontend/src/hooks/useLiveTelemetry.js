import { useEffect, useState } from 'react';
import { getMetrics, getAlerts, getTrend } from '../api/telemetry.js';

const ACTION_TO_SEVERITY = { BLOCK: 'critical', WARN: 'medium', ALLOW: 'low' };

function mapLogToAlert(log) {
  return {
    id: String(log.id),
    severity: ACTION_TO_SEVERITY[log.action] ?? 'low',
    type: log.rule_triggered && log.rule_triggered !== 'None' ? log.rule_triggered : `${log.traffic_direction} traffic`,
    summary: log.payload,
    time: log.timestamp
  };
}

export function useLiveMetrics(pollMs = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const summary = await getMetrics();
        if (!cancelled) {
          setData([
            { id: 'scanned', label: 'Prompts Scanned', value: summary.scanned, tone: 'safe' },
            { id: 'blocked', label: 'Prompts Blocked', value: summary.blocked, tone: 'threat' },
            { id: 'warned', label: 'Prompts Flagged', value: summary.warned, tone: 'threat' }
          ]);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      }
    }
    load();
    const interval = setInterval(load, pollMs);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pollMs]);

  return { metrics: data ?? [], error };
}

export function useLiveAlerts(pollMs = 5000) {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const logs = await getAlerts(20);
        if (!cancelled) {
          setAlerts(logs.filter((l) => l.action !== 'ALLOW').map(mapLogToAlert));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      }
    }
    load();
    const interval = setInterval(load, pollMs);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pollMs]);

  return { alerts, error };
}

export function useLiveTrend(pollMs = 30000) {
  const [trend, setTrend] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getTrend();
        if (!cancelled) {
          setTrend(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      }
    }
    load();
    const interval = setInterval(load, pollMs);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pollMs]);

  return { trend, error };
}
