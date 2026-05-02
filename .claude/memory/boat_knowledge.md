---
name: Boat Knowledge — Where to Find It
description: Where boat specs, manuals, and system knowledge are stored for Claude to reference
type: reference
---

All boat knowledge is organized in two places:

**CLAUDE.md** (project root) — auto-loaded every session. Contains:
- Full boat overview and all system specs
- Engine model numbers (Yanmar 4JH3DTE, Westerbeke generator, Tohatsu MFS 15E)
- Battery specs (Epoch 12460A-H LiFePO4, 460Ah, 12.8V)
- Safety equipment (Garmin inReach, EPIRB HEX ID, PFD locations)
- Autopilot (Raymarine linear drive)
- Connectivity (Peplink BR1 Mini, Starlink)
- Full maintenance schedule with last-done dates
- Spare parts inventory with locations
- All open projects

**`/docs/` folder** — detailed system notes, read on demand:
- `docs/yanmar.md` — Yanmar 4JH3DTE engine
- `docs/electrical.md` — LiFePO4 battery charger settings, Peplink, Starlink
- `docs/safety.md` — inReach SOS procedure, EPIRB, PFDs
- `docs/autopilot.md` — Raymarine linear drive maintenance and alignment

**Source documents** (in ~/Downloads, used to build the above):
- Yanmar 4JH3DTE Operation Manual (PDF)
- Epoch 12460A-H data sheet
- Tohatsu MFS 15E owner's manual
- Peplink BR1 Mini spec sheet
- Garmin inReach SE+/Explorer+ owner's manual
- Raymarine Linear Drive installation guide
- Barrett's Google Doc with registration numbers (linked separately)

**Note:** Two large PDFs (Westerbeke manual and one other, ~84 pages each) couldn't be read due to missing `poppler-utils` tool. Install with `brew install poppler` to read them.
