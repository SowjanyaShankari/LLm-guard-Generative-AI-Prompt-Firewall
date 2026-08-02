import { useEffect, useState } from 'react';
import { checkHealth } from '../api/scan.js';

const POLL_MS = 10000;

// Replaces the old WebSocket-status hook — this backend has no WS, so
// "is the backend up" is determined by polling the real /health route.
export function useHealth() {
  const [status, setStatus] = useState('connecting'); // connecting | open | closed

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        await checkHealth();
        if (!cancelled) setStatus('open');
      } catch {
        if (!cancelled) setStatus('closed');
      }
    }

    check();
    const interval = setInterval(check, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
