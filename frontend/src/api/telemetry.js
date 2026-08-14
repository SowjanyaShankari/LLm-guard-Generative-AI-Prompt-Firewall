import { request } from './client.js';

export function getMetrics() {
  return request('/api/metrics');
}

export function getAlerts(limit = 20) {
  return request(`/api/alerts?limit=${limit}`);
}

export function getTrend() {
  return request('/api/trend');
}
