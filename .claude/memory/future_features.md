---
name: Agora Captain — Future Feature Ideas
description: Bigger feature ideas identified during app review, not yet built, for future discussion
type: project
---

These were identified during a full app review on 2026-03-29. Not yet prioritized or scoped — save for future sessions.

## Agreed Short-Term Improvements (in progress)
1. Quick data fixes — header "Beneteau 48" → "First 47.7", label cleanup
2. Clickable part links — if Part # field starts with http, make it a real link
3. "Last Done" on Maintenance Schedule modal — auto-pull most recent log entry per task type
4. Overdue/due-soon flagging on Schedule — cross-reference interval + last done date
5. Destination/anchorage field on Voyage Log
6. Contacts & Docs tab — marina numbers, Coast Guard, insurance, links to Google Drive docs

## Bigger Future Ideas (not yet started)
- **Dashboard tab** — at-a-glance: days since last voyage, overdue maintenance count, current engine hours, next items due
- **Fuel log** — track fuel added per fill-up, calculate consumption per trip, running total, estimate range based on known burn rate (2.36 gal/hr @ 2,600 RPM)
- **Favorite anchorages** — log spots with depth, holding quality, notes; builds into personal cruising guide
- **Provisioning / passage checklist** — fourth checklist type for longer trips
- **Expiry reminders** — insurance (5/15/2026), USCG registration (10/31/2027), EPIRB battery (Jul 2035), flare dates — show warnings in app
- **Search** — search bar across maintenance log as it grows
- **Stats row on Voyage Log** — total distance sailed, total voyages, total engine hours
- **Trip duration calc** — auto-calculate from depart/arrive times already logged
- **Photo attachments on maintenance records** — damage documentation
- **Export to PDF** — for insurance/documentation
- **Offline mode improvements** — PWA already supports it but could be more explicit to user
- **Engine hours meter offset** — Yanmar meter needs +1,709 for actual hours; could auto-display actual hours alongside raw meter reading

## Style Backlog
- Remove emoji from "📋 Schedule" button to match rest of app style
- Split "Part # / Link" into two fields: Part # (text) and Link (URL, clickable)
- Mobile tab label abbreviation: "Spare Parts" → "Parts", "Voyage Log" → "Log"
- "Universal" location rename → "Boat-Wide" or "General"
- Projects: add "opened on" date (auto-stamp), add optional target date/deadline field
