# Offline Notes Lab

**Project By:** Ode Caleb Onahinyohe  
**Matric NO:** 2024/1/97767CP

A beginner-friendly offline-first notes Progressive Web App (PWA) built with Vite, React, and TypeScript. It allows creating notes, stores them in the browser via `localStorage`, exposes online and offline network status, and uses a custom service worker to cache the application shell.

## Requirements

- Node.js LTS (v20.x or v22.x recommended; tested on v22.23.2)
- npm (v10.x+)

## Run locally

```bash
npm install
npm run dev
```

Vite starts the local development server (default: `http://localhost:3000` or `http://localhost:5173`).

## Verify the build

```bash
npm run check
npm run build
npm run preview
```

- `npm run check`: Runs `tsc --noEmit` to verify TypeScript types without emitting files.
- `npm run build`: Builds the production bundle in the `dist` directory, copying public assets (`manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`).
- `npm run preview`: Serves the production build locally to test service worker caching and PWA installation.

## PWA test

Open the preview, install or inspect the manifest, switch Network to Offline, reload, and create a note.

### Detailed Offline Test Procedure (from workshop manual)

1. Open the production preview URL in a normal browser window (not incognito).
2. Reload once while online and wait for the service worker (`/sw.js`) to register and activate.
3. Open Browser Developer Tools:
   - **Application → Manifest**: Confirm name, short name, start URL, theme color, and both icons (192px and 512px) load with HTTP status 200.
   - **Application → Service Workers**: Confirm `/sw.js` is active and running.
   - **Application → Cache Storage**: Confirm cache `offline-notes-lab-v2` contains `/` and `/manifest.webmanifest`.
4. Open **Developer Tools → Network** and select **Offline** in the throttling dropdown.
5. Reload the page: the application shell loads successfully from Cache Storage.
6. Create a note in the form and click **Save locally**.
7. Refresh the page while still offline: the newly created note persists because it is loaded from `localStorage`.
8. Switch Network back to **Online**: the status indicator in the header updates immediately from `Offline` to `Online`.

# pwa-assignment
pwa assignment by caleb ode 
