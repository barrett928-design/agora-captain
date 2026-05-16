# Raymarine Axiom Pro 9 — Installation & Operation Notes

**Agora's unit:** Axiom Pro 9s (the "s" variant — without RealVision sonar transducer)  
**Source:** Raymarine Axiom Pro Installation Instructions (Doc 87319-3, 01-2021) and product specifications  
**Note:** Full manual at raymarine.com; direct download blocked from this environment

---

## Specifications

| Item | Value |
|---|---|
| Model | Axiom Pro 9s |
| Screen size | 9" |
| Operating voltage | 8–32V DC |
| Typical current draw | ~1.5–2.5A @ 12V (varies with backlight) |
| Off current | ~11 mA (0.13W) |
| NMEA 2000 connection | 1× DeviceNet male via SeaTalkng backbone |
| NMEA 0183 | 2× ports via Power/Video/NMEA cable |
| Wi-Fi | Yes — for app connectivity and Navionics updates |
| Bluetooth | Yes |
| IP rating | IPX6 (splash proof) |

---

## Connections

### Power and Data Cable
The Axiom Pro uses a single multi-pin cable for:
- 12V DC power (fused, 5A recommended)
- Video input (rear-view camera, etc.)
- NMEA 0183 ports (×2)

### NMEA 2000 / SeaTalkng
- **Connector:** DeviceNet male (on unit) → SeaTalkng T-connector on backbone
- **Power:** Drawn from the backbone — no separate power to the NMEA 2000 port
- Network devices visible to Axiom Pro: EV-1, AIS650, i70 displays, wind/depth instruments

### SeaTalk1 (Legacy)
- Can connect to SeaTalk1 instruments via a SeaTalk to SeaTalkng converter
- Agora has legacy ST70+ displays — confirm if they're on ST1 or SeaTalkng

---

## NMEA 2000 Setup

The Axiom Pro 9 is the most capable device on Agora's NMEA 2000 network. Key setup:

1. Connect to SeaTalkng backbone
2. Power on — Axiom auto-discovers all NMEA 2000 devices
3. Go to **Settings → Network** to see device list — use this to diagnose AIS or EV-1 issues
4. Assign data sources (e.g., use AIS650 for AIS, EV-1 for autopilot data)

**For Agora's AIS troubleshooting:** Check Settings → Network → view NMEA 2000 device list. If AIS650 appears/disappears, the issue is either the device itself or the backbone between AIS650 and the Axiom.

---

## Chart Sources

- **Navionics+:** Main chart source. Update via Wi-Fi (Navionics app on phone → transfer via hotspot) or direct Wi-Fi to internet
- **LightHouse Charts:** Raymarine's own chart format
- Charts stored on internal memory or microSD card

**Offline passagemaking:** Download charts for your region to the card before departure. In the Caribbean, download at each major port (USVI, Antigua, Grenada) where good Wi-Fi is available.

---

## AIS Display

The Axiom Pro receives AIS targets from the Raymarine AIS650 (Agora's MMSI: 368362150):
- AIS targets shown as triangles on chart
- Select a target to see vessel name, MMSI, COG, SOG, CPA
- Closest Point of Approach (CPA) alert can be configured
- **Agora's MMSI:** 368362150 — confirm this is programmed in the AIS650, not just the Axiom

---

## Autopilot Integration

The Axiom Pro 9 integrates with the EV-1 via NMEA 2000:
- Autopilot heading and mode shown on Axiom screen
- Can initiate **Track mode** from Axiom: select waypoint or route → autopilot follows
- Requires EV-1 and P70 to be on the network and calibrated

---

## Key Settings and Features

### Split Screen
- Combine Chart + Radar, Chart + Fishfinder, etc.
- Navigate to Axiom home screen → select page layout

### Anchoring
- Set anchor alarm via Chart page → Anchor → Set position
- Alarm triggers if boat moves beyond set radius

### MOB (Man Overboard)
- Press and hold **MOB** softkey to mark position and navigate to it
- Activates prominent MOB indicator on chart

### Waypoint / Route Creation
- Long-press on chart → place waypoint
- Multiple waypoints → Route
- Route transferred to EV-1 for Track mode autopilot

---

## Software Updates

1. Connect Axiom to Wi-Fi
2. Home screen → Settings → System → Check for updates
3. Or download update file from raymarine.com to microSD and install manually
4. LightHouse OS updates install automatically when Wi-Fi update completes

---

## Notes for Agora

- The Axiom Pro 9s is the "s" variant — no RealVision sonar connector (uses separate 11-pin transducer port if sonar desired)
- MMSI 368362150 is programmed in the AIS650 transponder — verify Axiom is receiving AIS data correctly
- AIS signal loss open project: use Axiom's NMEA 2000 device list page to monitor whether AIS650 appears consistently
- Raymarine i70 displays (×6) and ST70+ (×2) are slave display units — most settings managed from Axiom
- GPS position: Axiom's internal GPS is primary; EV-1 provides IMU/heading data
