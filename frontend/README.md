# AegisShield Frontend

React + TypeScript + Vite dashboard for the AegisShield platform.

## Features

- Detection workflow with text/image analysis triggers
- Cytoscape propagation graph visualization
- Threat rankings and containment actions
- Cluster and audit dashboards

## Prerequisites

- Node.js 18+
- npm
- Running backend API (default: `http://localhost:8000`)

## Run In Development

```bash
npm install
npm run dev
```

App default URL: `http://localhost:5173`

## Environment

Frontend reads backend base URL from `VITE_API_URL`.

If unset, it defaults to `http://localhost:8000`.

You can also create a local env file from `.env.example`.

Windows PowerShell:

```powershell
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```

Linux/macOS:

```bash
export VITE_API_URL="http://localhost:8000"
npm run dev
```

## Scripts

- `npm run dev` start Vite dev server
- `npm run build` production build
- `npm run build:dev` build alias
- `npm run preview` preview built app
- `npm run lint` lint source files

## Notes

- If API calls fail in browser with CORS message, check backend logs first. Server-side 500 errors can appear as CORS/network failures in frontend console.
- Propagation graph lifecycle cleanup has been hardened for route transitions to avoid stale Cytoscape instance errors.
