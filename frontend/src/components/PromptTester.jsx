import React, { useState } from 'react';

export default function PromptTester({ onSubmit, submitting }) {
  const [value, setValue] = useState('');
  const [lastResult, setLastResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!value.trim() || submitting) return;

    try {
      const result = await onSubmit(value);
      setLastResult(result);
      setValue('');
    } catch {
      // Error is handled by useScanSession.
    }
  }

  const isBlocked = lastResult?.status === 'blocked';
  const action = lastResult?.rules?.action;

  return (
    <section style={styles.panel}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            SECURITY SCANNER
          </div>

          <h2 style={styles.heading}>
            Prompt Threat Analysis
          </h2>

          <p style={styles.hint}>
            Submit a prompt to the LLM firewall for real-time security
            inspection.
          </p>
        </div>

        <div style={styles.endpoint}>
          <span style={styles.endpointDot} />
          POST /scan
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.inputWrapper}>

          <div style={styles.inputHeader}>
            <span style={styles.inputLabel}>
              PROMPT INPUT
            </span>

            <span className="mono" style={styles.characterCount}>
              {value.length} / 500
            </span>
          </div>

          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setValue(e.target.value);
              }
            }}
            placeholder="Enter a prompt to analyze for injection, jailbreak, sensitive-data, and policy violations..."
            style={styles.textarea}
            rows={5}
            disabled={submitting}
          />

          <div style={styles.inputFooter}>
            <span style={styles.securityHint}>
              🔒 Prompt is inspected before reaching the AI model
            </span>

            <span className="mono" style={styles.apiLabel}>
              FIREWALL ACTIVE
            </span>
          </div>
        </div>

        {/* Scan button */}
        <button
          type="submit"
          disabled={submitting || !value.trim()}
          style={{
            ...styles.button,
            opacity:
              submitting || !value.trim()
                ? 0.5
                : 1,
            cursor:
              submitting || !value.trim()
                ? 'not-allowed'
                : 'pointer'
          }}
        >
          <span style={styles.buttonIcon}>
            {submitting ? '◌' : '▶'}
          </span>

          {submitting
            ? 'ANALYZING...'
            : 'SCAN PROMPT'}
        </button>
      </form>

      {/* Result */}
      {lastResult && (
        <div
          style={{
            ...styles.resultBox,
            borderColor: isBlocked
              ? 'var(--accent-threat)'
              : action === 'WARN'
                ? '#e0b84f'
                : 'var(--accent-safe)'
          }}
        >
          <div style={styles.resultHeader}>
            <span style={styles.resultTitle}>
              SECURITY ANALYSIS
            </span>

            <span
              style={{
                ...styles.resultBadge,
                color: isBlocked
                  ? 'var(--accent-threat)'
                  : action === 'WARN'
                    ? '#e0b84f'
                    : 'var(--accent-safe)'
              }}
            >
              {isBlocked
                ? 'BLOCKED'
                : action || 'ALLOWED'}
            </span>
          </div>

          <div style={styles.resultContent}>

            {isBlocked ? (
              <>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>
                    Decision
                  </span>

                  <strong style={styles.resultValue}>
                    Request Blocked
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>
                    Reason
                  </span>

                  <span style={styles.resultValue}>
                    {lastResult.reason}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>
                    Firewall Action
                  </span>

                  <strong style={styles.resultValue}>
                    {lastResult.rules?.action}
                  </strong>
                </div>

                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>
                    Risk Score
                  </span>

                  <span className="mono" style={styles.score}>
                    {lastResult.rules?.risk_score ?? 0}
                    <span style={styles.scoreMax}>
                      {' '}
                      / 100
                    </span>
                  </span>
                </div>

                {lastResult.validation?.reason && (
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>
                      Analysis
                    </span>
                    
                    {lastResult.validation?.matched_keywords?.length > 0 && (
  <div style={styles.resultRow}>
    <span style={styles.resultLabel}>
      Matched Rules
    </span>

    <span style={styles.resultValue}>
      {lastResult.validation.matched_keywords.join(', ')}
    </span>
  </div>
)}

                    <span style={styles.resultValue}>
                      {lastResult.validation.reason}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  panel: {
    background:
      'linear-gradient(145deg, rgba(15,31,51,0.98), rgba(7,18,32,0.98))',

    border: '1px solid var(--border-hair)',
    borderRadius: 'var(--radius-md)',

    padding: 20,

    boxShadow:
      '0 10px 30px rgba(0,0,0,0.18)'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 18,
    flexWrap: 'wrap'
  },

  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.14em',
    color: 'var(--accent-safe)',
    marginBottom: 5
  },

  heading: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--text-primary)'
  },

  hint: {
    margin: '5px 0 0',
    fontSize: 11,
    color: 'var(--text-muted)'
  },

  endpoint: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,

    padding: '7px 10px',

    border:
      '1px solid var(--border-hair)',

    borderRadius:
      'var(--radius-sm)',

    fontFamily:
      'var(--font-mono)',

    fontSize: 10,

    color:
      'var(--text-muted)'
  },

  endpointDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent-safe)'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },

  inputWrapper: {
    border:
      '1px solid var(--border-hair)',

    borderRadius:
      'var(--radius-sm)',

    background:
      'rgba(0,0,0,0.15)',

    overflow: 'hidden'
  },

  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding:
      '9px 12px',

    borderBottom:
      '1px solid var(--border-hair)'
  },

  inputLabel: {
    fontFamily:
      'var(--font-mono)',

    fontSize: 9,

    letterSpacing:
      '0.08em',

    color:
      'var(--text-dim)'
  },

  characterCount: {
    fontSize: 9,
    color: 'var(--text-dim)'
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',

    background:
      'transparent',

    border: 'none',
    outline: 'none',

    color:
      'var(--text-primary)',

    padding: 13,

    fontFamily:
      'var(--font-mono)',

    fontSize: 12,

    lineHeight: 1.6,

    resize: 'vertical'
  },

  inputFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding:
      '8px 12px',

    borderTop:
      '1px solid var(--border-hair)',

    gap: 10,

    flexWrap: 'wrap'
  },

  securityHint: {
    fontSize: 9,
    color: 'var(--text-dim)'
  },

  apiLabel: {
    fontSize: 9,
    color: 'var(--accent-safe)',
    letterSpacing: '0.05em'
  },

  button: {
    alignSelf: 'flex-end',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    minWidth: 150,
    height: 42,

    background:
      'linear-gradient(135deg, var(--accent-safe-dim), rgba(50,213,131,0.08))',

    color:
      'var(--accent-safe)',

    border:
      '1px solid var(--accent-safe)',

    borderRadius:
      'var(--radius-sm)',

    padding:
      '0 18px',

    fontFamily:
      'var(--font-mono)',

    fontSize: 10,

    fontWeight: 700,

    letterSpacing:
      '0.05em'
  },

  buttonIcon: {
    fontSize: 11
  },

  resultBox: {
    marginTop: 16,

    border:
      '1px solid',

    borderRadius:
      'var(--radius-sm)',

    background:
      'rgba(255,255,255,0.02)',

    overflow: 'hidden'
  },

  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    padding:
      '10px 13px',

    borderBottom:
      '1px solid var(--border-hair)'
  },

  resultTitle: {
    fontFamily:
      'var(--font-mono)',

    fontSize: 9,

    letterSpacing:
      '0.08em',

    color:
      'var(--text-dim)'
  },

  resultBadge: {
    fontFamily:
      'var(--font-mono)',

    fontSize: 10,

    fontWeight: 700,

    letterSpacing:
      '0.05em'
  },

  resultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 13
  },

  resultRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,

    fontSize: 11
  },

  resultLabel: {
    width: 115,
    minWidth: 115,
    color: 'var(--text-dim)'
  },

  resultValue: {
    color: 'var(--text-primary)'
  },

  score: {
    color: 'var(--text-primary)',
    fontWeight: 700
  },

  scoreMax: {
    color: 'var(--text-dim)',
    fontWeight: 400
  }
};