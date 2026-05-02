---
name: Agora Captain — Project Overview
description: Core facts about the Agora Captain PWA: what it is, where it lives, and how it's built
type: project
---

A Progressive Web App (PWA) serving as a digital captain's log for S/V Agora, a Beneteau 48 sailboat owned by Barrett and Susanna. Replaces a Google Sheet.

**Live URL:** https://barrett928-design.github.io/agora-captain
**Local path:** /Users/barrettfontenot/agora-captain
**Status:** Fully built and live. Work now is adding new features.

## Key Files
- `src/App.jsx` — entire app lives here (all components, logic, inline CSS styles)
- `src/firebase.js` — Firebase config and Realtime Database export
- `src/main.jsx` — React entry point
- `vite.config.js` — Vite + PWA plugin config
- `package.json` — scripts and dependencies (deploy via `npm run deploy` → gh-pages)

## Tech Stack
- React 19 (single JSX file, built with Vite 8)
- Firebase Realtime Database (free tier) — all data stored under the `agora/` node
- vite-plugin-pwa for offline/installable PWA support
- Deployed to GitHub Pages via gh-pages

## App Structure (5 tabs)
- **Projects** — task list with location, assignee (Barrett/Susanna/Both), priority, status
- **Voyage Log** — trip records (dates, engine hours, distance, crew, weather, notes)
- **Maintenance** — service log grouped by system; includes a maintenance schedule panel
- **Spare Parts** — inventory list
- **Checklists** — Departure / Arrival / Pack Up checklists (not persisted to Firebase)

## Why: Replaces a Google Sheet to give a nicer mobile experience for use on the boat.
## How to apply: When suggesting new features, think "what would be useful on a boat?"
