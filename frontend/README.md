# LLM-Guard Threat Dashboard — Frontend Scaffold

Week 1 deliverable for the Full-Stack Dashboard Developer role: foundational
React UI components for the SOC-facing Threat Dashboard described in the
project workflow (steps 1–2, "UI/UX Design" and "Front-end Development").

No backend calls yet — everything renders from `src/data/mockData.js` so the
UI can be reviewed before the Backend Security Engineer's telemetry API and
the AI/ML Security Specialist's scanner are wired up.

## Stack

- React 18 + Vite (fast dev server, no config needed for Week 1)
- Recharts for the trend chart
- Plain CSS variables for design tokens (no UI framework dependency yet —
  easy to swap in Tailwind later if the team standardizes on it)

## Structure

```
llm-guard-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           # React root
    ├── App.jsx            # Page shell: sidebar + topbar + content grid
    ├── index.css          # Design tokens (color, type, radius)
    ├── data/
    │   └── mockData.js    # Placeholder metrics/alerts/trend data
    └── components/
        ├── Sidebar.jsx     # Nav: Overview, Alerts, Blocked Prompts, DLP, Rules, Settings
        ├── Topbar.jsx      # Page title + live proxy/scanner status indicators
        ├── MetricCard.jsx  # KPI tile (blocked count, latency, etc.)
        ├── AlertsFeed.jsx  # Severity-tagged recent alerts list
        └── ThreatChart.jsx # Blocked-prompts trend chart
```

## Design decisions

- **Palette** — a dark "monitoring room" background (`#0B0E14`, not pure
  black) with amber (`--accent-threat`) for anything that represents a
  blocked/flagged event and cyan-teal (`--accent-safe`) for nominal/online
  status. Severity badges (critical/high/medium/low) get their own color
  so an analyst can scan the alert list by color alone.
- **Type** — Space Grotesk for headings/labels, JetBrains Mono for anything
  that's a number, timestamp, or status string (latency, counts, "ONLINE"),
  so live data visually reads as data.
- **Signature element** — the pulsing status dots in the topbar, meant to
  read like a live system heartbeat rather than a static "connected" label.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Next steps (not part of Week 1)

- Replace `src/data/mockData.js` with real fetch/WebSocket calls once the
  Backend Security Engineer exposes the telemetry endpoint.
- Build out the non-Overview nav pages (Alerts, Blocked Prompts, DLP
  Activity, Firewall Rules, Settings) — currently placeholders in `App.jsx`.
- Add a proper client-side router (e.g. React Router) once there's more
  than one real page, instead of the simple `useState` tab switch used here.
