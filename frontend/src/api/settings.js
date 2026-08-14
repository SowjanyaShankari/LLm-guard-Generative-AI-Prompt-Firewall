import { request } from './client.js';

export function getSettings() {
  return request('/api/settings');
}

export function saveSettings(data) {
  return request('/api/settings', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}