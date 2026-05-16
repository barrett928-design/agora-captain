# Agora Captain — CLAUDE.md

This file is auto-loaded every session. It contains the authoritative reference for S/V Agora and the Agora Captain app. Read this before making any suggestions.

---

## The App

A Progressive Web App (PWA) serving as a digital captain's log for S/V Agora.

- **Live URL:** https://barrett928-design.github.io/agora-captain
- **Local path:** /Users/barrettfontenot/agora-captain
- **Stack:** React 19 (single JSX file), Vite 8, Firebase Realtime Database, vite-plugin-pwa
- **Deploy:** `npm run deploy` → GitHub Pages via gh-pages
- **All app logic:** `src/App.jsx` — components, styles (inline CSS string), and data all in one file
- **Firebase:** All data stored under `agora/` node in Realtime Database; debounced write on state change

### Tabs
| Tab | Key | Firebase path |
|---|---|---|
| Projects | `projects` | `agora/projects` |
| Voyage Log | `voyages` | `agora/voyages` |
| Maintenance | `maintenance` | `agora/maintenance` |
| Spare Parts | `parts` | `agora/parts` |
| Fuel Log | `fuel` | `agora/fuel` |
| Checklists | — | Not persisted (local state only) |

### Fuel Log — Form Fields
The fuel log entry form captures: `date`, `location`, `dieselGal`, `dieselSubtotal`, `dieselTaxesFees`, `dieselTotal`, `gasGal`, `gasSubtotal`, `gasTaxesFees`, `gasTotal`, `notes`. Historical data (2023 Caribbean cruise) still needs to be entered — Barrett will provide a spreadsheet.

### Receipt Scanning
The Fuel Log tab has a 📷 Scan Receipt button that uses a Cloud Run service to parse fuel receipts via Claude Haiku.

- **Cloud Run endpoint:** `https://scanfuelreceipt-qbqkp5vmrq-uc.a.run.app`
- **Request:** `POST` with `{ imageBase64: string, mediaType: string }` (e.g. `"image/jpeg"`)
- **Response:** `{ date, location, diesel_gal, diesel_subtotal, diesel_taxes_and_fees, diesel_total, gas_gal, gas_subtotal, gas_taxes_and_fees, gas_total, notes }`
- **CORS:** Only allows requests from `https://barrett928-design.github.io` — will fail with "Failed to fetch" on localhost
- **Cloud Function source:** `functions/index.js` — uses Anthropic API (Claude Haiku) with secret `ANTHROPIC_API_KEY` in Firebase
- **Frontend handler:** `handleScan` in `src/App.jsx` (~line 832) — maps snake_case API response to camelCase form state
- **Always test receipt scanning from the deployed GitHub Pages URL, not localhost**

### AI Assistant — Agora Bot (BUILT AND DEPLOYED)
The app has a floating chat bubble (bottom-right corner) powered by Claude. This is live and working.

- **UI:** `ChatBot` component in `src/App.jsx` (~line 1074) — floating bubble, chat panel, message history
- **Chat endpoint:** `https://chatwithagora-qbqkp5vmrq-uc.a.run.app` (Firebase Cloud Function v2)
- **Scan endpoint:** `https://scanfuelreceipt-qbqkp5vmrq-uc.a.run.app` (existing receipt scan function)
- **Model:** claude-sonnet-4-6 with prompt caching (`anthropic-beta: prompt-caching-2024-07-31`)
- **System prompt:** `AGORA_SYSTEM_PROMPT` in `functions/index.js` — contains all boat specs, manual extracts, maintenance records
- **CORS:** Both functions allow only `https://barrett928-design.github.io`
- **Function deployment:** GitHub Actions auto-deploys Firebase Functions when `functions/` changes on `main` (`.github/workflows/deploy-functions.yml`)
- **Frontend deployment:** Manual — `npm run deploy` from local machine → gh-pages branch
- **Max tokens:** 1,500 per reply | last 20 messages sent per request

### Manual Library (`docs/manuals/`)
Synthesized reference docs the system prompt is built from:
- `yanmar-4jh3-te-operation-manual.md` — full engine specs, maintenance schedule, torques
- `westerbeke-7.6btd-service-manual.md` — injection timing, glow plugs, troubleshooting
- `garmin-inreach-owners-manual.md` — SOS procedure, battery life, Earthmate pairing
- `victron-multiplus-12-3000-120-50.md` — specs, PowerAssist, LiFePO4 charger settings
- `acr-globalfix-v5-epirb.md` — activation, self-test, NFC diagnostics, LED reference
- `tohatsu-mfs15e-owners-manual.md` — oil specs, maintenance schedule, flush procedure
- `raymarine-ev1-autopilot.md` — NMEA 2000 troubleshooting, ACU variants, calibration
- `raymarine-axiom-pro-9.md` — specs, network setup, AIS diagnostics

### IAM / Deployment Reference
See `docs/deployment.md` for the full Firebase Functions IAM role checklist — needed if deployment ever fails.

### How to work on this app
- Barrett is **not a developer** — explain things plainly and step by step
- Confirm before making any changes
- All styling is inline in the `css` template string in App.jsx — no separate CSS files
- Go slow; don't bundle multiple changes at once

---

## The Boat — S/V Agora

**Type:** Beneteau First 47.7
**Built:** 2005
**Owners:** Barrett & Susanna Fontenot
**Home port:** Gulf Coast (Texas)

### Dimensions
| | |
|---|---|
| Length | 47' 07" (14.5m) |
| Beam | 14' 09" (4.5m) |
| Draft | 6' 01" (1.9m) |
| Height | 64' 9" (use 70 ft for clearance planning) |
| LWL | 41' 4" (12.6m) |
| Displacement | 26,450 lbs / 20 net tons |

### Registration & IDs
| | |
|---|---|
| MMSI | 368362150 |
| Callsign | WDP5300 |
| USCG Official Number | 1337680 (exp 10/31/2027) |
| RN | RN111749438 |
| TPWD Registration | TX-6565-KX |
| Hull (HIN) | BEY87296D505 |
| Insurance | State Farm, Policy # 83-G0-K738-4 (exp 5/15/2026) |

### MarineTraffic / FCC
- MarineTraffic: MMSI 368362150
- FCC license key: 4933388

---

## Propulsion & Engines

### Main Engine — Yanmar 4JH3-TE
- **Serial number:** E15158
- **Cylinders:** 4
- **Power:** 50.7 kW @ 3,700 rpm / 75 hp @ 3,800 rpm
- **Diesel tank capacity:** ~62 gal reported
- **Fuel burn:** ~2–3 gal/hr @ 2,800 RPM (~7 kts); 2.36 gal/hr @ 2,600 RPM (GIWW)
- **Alternator belt:** REMG-6460
- **Prop:** Max Prop — pitch setting H (front/big E on back/small)
- **IMPORTANT — Hour meter offset:** Add 1,709 hours to meter reading for actual engine hours
- **Oil:** SAE 30 or 15W-40; half quart extra when changing (accounts for oil in old filter)
- **Oil filter part#:** 129150-35151 (manual) — verify against filter on hand, may also be 35153

**Maintenance Schedule (from official Yanmar 4JH3-TE Operation Manual):**
| Task | Interval | Notes |
|---|---|---|
| Oil & filter change | 250 hrs or annually | Last done Feb 2026 @ 2,276 hrs (meter). First change at 50 hrs |
| Fuel filters (primary & secondary) | 250 hrs or annually | Always replace both. Spares in Salon Seat Drawer |
| Raw water impeller | 500 hrs or 2 years | Do not run dry. 5 spares on hand |
| Marine gear oil | 250 hrs (after 1st change at 50 hrs) | Wash oil filter at same time |
| Coolant flush | 500 hrs or 2 years | Inspect hoses for softness/cracks. Last done Feb 2026 |
| V-belt | 500 hrs or 2 years | Check tension & cracking. 3 spares on hand |
| Air filter | Annually | 4 spares in Salon Seat |
| Thermostat | 3–5 years or if overheating | 1 spare on hand |
| Turbocharger blower wash | 500 hrs | Use blower wash fluid, pour gradually |
| Valve clearance / injection timing | 1,000 hrs or 4 years | Dealer service required |

### Generator — Westerbeke 7.6 BTD
- **Serial number:** 132820-E504
- **Manufacture date:** May 2, 2005
- **Output:** 7.6 kW, 60 Hz
- **Fuel burn:** 0.78 GPH @ full load / 1,800 rpm; 0.58 GPH @ 1,500 rpm
- **Oil capacity:** ~1 full gallon
- **Oil filter:** Sierra 23-7800 (compatible)
- **Zinc (anode) part#:** 011885

**Maintenance Schedule:**
| Task | Interval | Notes |
|---|---|---|
| Oil & filter change | 200 hrs or annually | Last done Feb 2026 @ 4,420 hrs |
| Zinc (anode) replacement | Every 6 months | Critical — had to chisel out after waiting too long. Clean threads each time |
| Raw water impeller | Annually | 2 Westerbeke spares in V Berth |
| Fuel filter | Annually or 500 hrs | Monitor possible fuel leak noted Feb 2026 |
| Note | — | Possible water leak also noted Feb 2026 — monitor both |

### Dinghy — Achilles 10' Aluminum Hard Bottom RIB
- **Model:** 23-1-HB310AX-P
- **Hull ID:** ACH00116I223
- **TPWD Registration:** TX-1281-MS

### Outboard (Dinghy) — Tohatsu MFS 15E
- **Motor ID:** 033029BD
- **TPWD Registration:** TX-7527-RY
- **Oil change:** Every 100 hrs or annually. Oil plug gasket is metal shim only — monitor for leaks. Correct replacement gasket still needed
- **Lower unit gear oil:** Annually
- **Spark plugs:** Annually

---

## Electrical System

### House Battery Bank — 920Ah Total (2x Epoch 12460A-H LiFePO4)
- **2 batteries in parallel**, 460Ah each = **920Ah / 11.76 kWh total**
- Chemistry: Prismatic LiFePO4 (lithium iron phosphate)
- Nominal voltage: 12.8V per battery
- Max continuous charge/discharge: 200A per battery
- Weight: 84 lbs each
- Bluetooth monitoring: Yes
- Warranty: 11 years

**Charger Settings (CRITICAL for LiFePO4):**
- Bulk/Absorption: 14.2–14.4V
- Float: **DISABLED** (preferred). If must be set: 13.3–13.6V
- Temperature compensation: **0 mV/°C — disable on all chargers**
- Equalization: **NEVER equalize LiFePO4**
- BMS high voltage cutoff: 14.6V

### Engine Battery
- 1x Lifeline GPL-31T (600 CCA, installed July 2017)

### Charging
- **Shore charger:** ProNautic 1260P — 12V @ 60A, 3 outputs, 100–250VAC input
- **Inverter/charger:** Victron Multiplus 12/3000/120-50 VE.Bus (UL)
  - PN: PMP122301102 / SN: HQ2323H6ZUY
  - DC IN: 9.5–17V, 250A | AC OUT: 115–125V, 21A, 60Hz
  - DC OUT: 13.2–14.4V, 120A | Cont. output: 2,400W / 3,000VA
- **Alternator isolator:** Newmar 1-2-120 Battery Isolator (splits alternator output)
- **Shore power:** 50-amp

### Battery Monitoring
- Victron SmartShunt installed Nov 2024 (under port berth, cleaned up wiring, added fuse box and negative bus)
- Review SmartShunt data trends at each 6-month battery check
- Future option: Victron Cerbo GX for full integration with NMEA 2000, tank senders, solar

### AC Electrical
- Xantrex PROwatt SW Transfer Switch 15A @ 120V 60Hz
- Xantrex Sine Wave Inverter 1000 (1,000W continuous / 1,500W surge)

### Navigation Electronics
- VHF: ICOM IC-M602
- Chartplotter: Raymarine Axiom Pro 9s
- Displays: Raymarine i70 (×6), Raymarine ST70+ (×2)
- AIS: Raymarine AIS650 (MMSI 368362150)
- Harken Powered Winch

### Connectivity
- **Cellular modem:** Peplink BR1 Mini (installed Jan 2025 with Michael)
  - CAT-7 LTE, Wi-Fi 5 dual-band, GPS, 300 Mbps throughput
  - US carrier certified: AT&T, T-Mobile, Verizon, FirstNet
- **Starlink:** Installed Jan 2025

---

## Autopilot — Raymarine EV-1 (Hydraulic)

- **Course computer / sensor:** Raymarine EV-1
- **Control head:** Raymarine P70 Pilothead
- **Drive type:** Hydraulic (hydraulic ram + hydraulic pump)
- **Known issue:** Autopilot disengaging is an open project. AIS signal loss being investigated at the same time — may share a root cause (NMEA 2000 network issue)

Note: There is also a Raymarine Linear Drive installation guide in the docs folder — this may be reference material from the POC project and may not reflect what's actually installed.

---

## Safety Equipment

### EPIRB — ACR GlobalFix V5 AIS CAT. 2
- **Location:** Galley (mounted)
- **HEX ID:** 2DDAAdb6d23fdff
- **AIS Self ID:** 974571684
- **Battery expiry:** July 2035
- **Protocol:** RLS Location (confirms receipt of distress signal)
- **Frequencies:** 406 MHz satellite + 121.5 MHz homing + AIS (VHF local broadcast)
- **Registration:** beaconregistration.noaa.gov

### PLB — ACR ResQLink AIS (×2)
- **Model:** ResQLink AIS Personal Locator Beacon
- **HEX ID:** 2DDB2DE7643FDFF
- **Serial:** 0350103784y
- **Frequencies:** 406 MHz satellite + 121.5 MHz + AIS
- **Note:** Mount to inflatable lifejackets. Wear on offshore passages

### Garmin inReach SE+ / Explorer+
- **Network:** Iridium satellite (global, works offshore)
- **Key functions:** Two-way satellite text messaging, SOS rescue, GPS tracking, weather forecasts
- **SOS:** Lift cap → hold SOS button → location sent to Garmin Response every 1 min (first 10 min), then every 10 min
- **Paired app:** Earthmate (Bluetooth)
- **Battery:** Up to 100 hrs default; 30 days extended tracking
- **Water rating:** IPX7
- Rinse with fresh water after salt exposure

### Other Safety
- **PFDs:** 5 inflatable — Starboard berth locker. Inspect CO2 cylinders annually
- **Safety harness:** 1 — Starboard berth locker
- **Safety tethers:** 3 — Starboard berth locker
- **Emergency flares:** 1 set — stern locker (port). Expire 42 months from manufacture
- **Fire extinguishers:** Check pressure, tags, brackets annually. Fire plan is an open project

---

## Plumbing

### Fresh Water
- **Total capacity:** ~185 gal (3 tanks)
  - 2× Forward tanks: 190L each (50 gal each)
  - 1× Starboard stern: 240L (63 gal)
- **Watermaker:** SeaWater Pro AC 110/220V, 970W, 40 GPH Dual Membrane

### Grey Water
- 2× 80L (21 gal) tanks
- **Manufacturer:** L'Oceane des Plastic | **Standard:** ISO 8099 | **Tank IDs:** 049746, 050416

### Heads
- **Tank meters installed:** Mar 2025 (Judson)
  - Fwd: 1–2 flushes after full light, then stop
  - Aft: Do not use after full light
- **Macerators:** Both replaced Jan 2026. One Jabsco spare on hand
- **Pump rebuild (Jabsco):** Every 2–3 years. Stiff pumping = early warning
- **Holding tank vents:** Inspect annually. Blocked vent → pressure buildup → seal failure

---

## Systems

### AC System
- **Raw water pump:** Replaced Jan 2025. Watch for reduced cooling. Replace every 2 years
- **Sea strainer:** Clean monthly in season. Quick check every time aboard
- **Foam filter:** Rinse in fresh water monthly in season
- **Boys' cabin AC:** Open project — duct replacement needed

### Bilge
- **Bilge pump:** Jabsco 37202-2012 (replaced Jun 2025)
- **Test monthly:** Auto float switch and manual override

### Hull
- **Bottom paint:** Ablative antifouling, last done Nov 2025. Annual fall haul-out
- **Through-hulls & seacocks:** Exercise and grease annually at haul-out. Seized seacocks = serious safety issue
- **Hull zincs:** Replace annually or when 50% depleted

### Rigging
- **Standing rigging:** Inspect annually — broken strands, cracks at swage fittings, rust at chainplates
- **Running rigging:** Inspect annually — chafe on halyards/sheets
- **Winch service:** Every 2 years — disassemble, clean, regrease

---

## Spare Parts Inventory

| System | Part | Qty | Location |
|---|---|---|---|
| Yanmar | Fuel Filters | 8 | Salon Seat Drawer |
| Yanmar | Oil Filter (129150-35153) | 2 | Salon Seat Drawer |
| Yanmar | Impeller | 5 | Salon Seat Drawer |
| Yanmar | SW Pump Repair Kit | 2 | Salon Seat Drawer |
| Yanmar | V-Belt | 3 | Salon Seat Drawer |
| Yanmar | Thermostat | 1 | Salon Seat Drawer |
| Yanmar | Air Filters | 4 | Salon Seat |
| Westerbeke | Impeller | 2 | V Berth |
| Westerbeke | Anode (#011885) | — | — |
| Safety | Emergency Flares | 1 set | Stern locker (port) |
| Safety | PFD – Inflatable | 5 | Starboard berth locker |
| Plumbing | Hand Pump Assembly (Jabsco) | 2 | V Berth, fwd hatch |
| Plumbing | Water Pump (shower/sink) | 1 | V Berth |

---

## Open Projects (as of Mar 2026)

**High priority:**
- Anchor chain replacement (consider)
- Inspect fire suppressants
- Develop fire plan
- Develop evacuation plan

**Medium priority:**
- Spot fix gel coat on deck (Barrett, in progress)
- Fix steaming light
- Fix bottom seal on aft head door
- Replace windlass bolt
- Rigging inspection (rust spots)
- Troubleshoot autopilot disengaging & AIS signal loss (Raymarine EV-1 / NMEA 2000)
- Troubleshoot A/C for boys & replace ducts

**Low priority:**
- Strip & refinish toe rails (Susanna)
- Dinghy davits investigation
- Deep clean stove
- Nav table reorg & cable management
- Repair arch handlebar at helm
- V Berth mattress foam
- Polish chrome / rust removal
- Replace/repair companionway cover (Susanna)
- Install water and fuel tank sensors

---

## Future App Ideas (Backlog)

Features to consider for future development:

- **Fish log** — Tab to log catches with species, size/weight specs, location, date, and photo
- **Fishing gear category** — Add a Fishing Gear category to the Spare Parts tab for rods, reels, lures, line, tackle, etc.

---

## Docs Folder

Detailed system notes in `/docs/` — read on demand:
- `docs/yanmar.md` — Yanmar 4JH3-TE engine details
- `docs/westerbeke.md` — Westerbeke 7.6 BTD generator details
- `docs/electrical.md` — Batteries, chargers, Victron, Peplink/Starlink
- `docs/safety.md` — inReach, EPIRB, PLBs, PFDs
- `docs/autopilot.md` — Raymarine EV-1 autopilot system
- `docs/chartplotter.md` — Raymarine Axiom Pro 9s; NMEA 2000 network diagnostics
- `docs/vhf.md` — ICOM IC-M602; DSC distress procedure, MMSI notes
- `docs/tohatsu.md` — Tohatsu MFS 15E outboard; oil specs, gasket open item
- `docs/chatbot-system-prompt.md` — Draft system prompt for the future in-app AI assistant; consolidates all IDs, specs, and quick-reference info

### Manuals still needed (no doc yet)
- **SeaWater Pro watermaker** — "AC 110/220V, 970W, 40 GPH Dual Membrane"; exact model name uncertain, manual not yet found
- **Harken Powered Winch** — model number unknown; needs to be read off the winch
- **Peplink BR1 Mini** — connectivity/IT, lower priority for onboard chatbot
- **Victron SmartShunt** — partially covered in electrical.md; dedicated manual not extracted
