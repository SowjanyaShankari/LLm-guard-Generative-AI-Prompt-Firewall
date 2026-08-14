import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../api/settings.js';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    sensitivity: 75,
    block_threshold: 80,
    warn_threshold: 50,
    prompt_injection: true,
    jailbreak_detection: true,
    dlp_detection: true
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setMessage('Settings saved successfully');
    } catch (err) {
      setMessage('Failed to save settings');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Guardrail Configuration</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Sensitivity: {settings.sensitivity}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.sensitivity}
          onChange={(e) =>
            handleChange('sensitivity', Number(e.target.value))
          }
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Block Threshold: {settings.block_threshold}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.block_threshold}
          onChange={(e) =>
            handleChange('block_threshold', Number(e.target.value))
          }
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Warning Threshold: {settings.warn_threshold}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.warn_threshold}
          onChange={(e) =>
            handleChange('warn_threshold', Number(e.target.value))
          }
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.prompt_injection}
            onChange={(e) =>
              handleChange('prompt_injection', e.target.checked)
            }
          />
          Prompt Injection Detection
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.jailbreak_detection}
            onChange={(e) =>
              handleChange('jailbreak_detection', e.target.checked)
            }
          />
          Jailbreak Detection
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.dlp_detection}
            onChange={(e) =>
              handleChange('dlp_detection', e.target.checked)
            }
          />
          DLP Detection
        </label>
      </div>

      <br />

      <button onClick={handleSave}>
        Save Settings
      </button>

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}