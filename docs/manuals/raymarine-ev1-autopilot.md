# Raymarine Evolution EV-1 Autopilot — Installation & Operation Notes

**Agora's installation:** EV-1 sensor core + P70 Pilothead + hydraulic ram + hydraulic pump  
**Source:** Raymarine Evolution EV-1 Installation Instructions (Doc 87180, Rev 06, 08-2021)  
**Note:** Full manual at raymarine.com/en-us/download/evolution-autopilot-manuals; direct fetch blocked

---

## System Overview

The Evolution autopilot system consists of:
- **EV-1 Sensor Core** — attitude, heading, rate-of-turn, and speed-through-water sensor
- **ACU (Autopilot Control Unit)** — drives the steering actuator
- **Control head** — P70 Pilothead (Agora's unit) or p70R, S100, etc.
- **Drive unit** — hydraulic pump + ram (Agora's installation)

---

## Specifications — EV-1 Sensor Core

| Item | Value |
|---|---|
| Connection | NMEA 2000 / SeaTalkng (DeviceNet connector) |
| Power | From NMEA 2000 backbone (no separate power wire) |
| Mounting | Any orientation — software configures alignment |
| Operating temp | -10°C to +55°C |
| IP rating | IPX6 |

---

## ACU Variants (Agora's is hydraulic — likely ACU-100 or ACU-150)

| ACU Model | Drive Type | Max Hydraulic Pressure | Notes |
|---|---|---|---|
| ACU-100 | Hydraulic pump | 110 bar | Smaller boats, lower demand |
| ACU-150 | Hydraulic pump | 110 bar | Larger boats, higher demand |
| ACU-200 | Linear drive | N/A | Not Agora |
| ACU-300 | Rotary drive | N/A | Not Agora |

---

## NMEA 2000 / SeaTalkng Network

The EV-1 connects to the boat's SeaTalkng/NMEA 2000 backbone:

- Uses a **DeviceNet male connector** → SeaTalkng backbone
- Power drawn from backbone (no separate 12V wire to EV-1)
- The backbone must have proper **termination resistors at both ends**
- The backbone must have exactly **one power node** (usually from a T-connector with inline fuse)

**Agora's known issue:** Autopilot disengaging and AIS signal loss are suspected to be NMEA 2000 network problems. Check:
1. Both ends of backbone have termination resistors installed
2. Only one power node on the backbone (multiple = bus instability)
3. Secure/undamaged connections at every T-connector
4. No device is drawing excessive current and browning out the backbone

---

## Calibration — First-Time Setup

1. Mount EV-1, connect to SeaTalkng backbone
2. Power up system; EV-1 displays in control head
3. **Dockside setup (boat stationary):**
   - Enter the autopilot setup menu on P70
   - Set drive type: Hydraulic
   - Set vessel type (sailing vessel)
   - Perform compass swing (motor in circles) — EV-1 builds deviation table
4. **Sea trial:**
   - Set motor to deadband (reduces hunting)
   - Adjust rudder gain and counter rudder for your sea conditions
   - Save settings

---

## P70 Pilothead — Controls

| Button | Function |
|---|---|
| Auto | Engage autopilot in Auto mode (maintain current heading) |
| Standby | Disengage autopilot |
| Track | Follow a GPS waypoint track (requires connected chartplotter) |
| -1 / +1 | Adjust heading by 1° |
| -10 / +10 | Adjust heading by 10° |
| Disp | Cycle display information |

---

## Operating Modes

- **Auto:** Holds compass heading. Most common use.
- **Track:** Follows GPS route from chartplotter via NMEA 2000. Requires SeaTalk or NMEA 2000 integration with Axiom Pro 9.
- **Wind Vane (if apparent/true wind data available):** Holds apparent wind angle — useful offshore sailing. Requires wind instrument on NMEA 2000 network.

---

## Pre-Passage Autopilot Checks

1. Engage autopilot at dock — verify it holds heading and responds to ±1° adjustments
2. Listen for unusual hydraulic pump noise (cavitation, grinding)
3. Check hydraulic fluid reservoir level
4. Inspect hydraulic hoses and ram for leaks
5. On departure: test engage/disengage before leaving the slip

---

## Hydraulic System

- **Fluid type:** ATF (Automatic Transmission Fluid) Dexron II/III — confirm against hydraulic pump label
- **Fluid level:** Check at reservoir (usually mounted near hydraulic ram)
- **Bleed if:** Ram moves slowly or unevenly, or pump makes unusual noises
- Hydraulic leak at ram = urgent — loss of steering backup possible

---

## Troubleshooting

| Problem | Probable Cause | Fix |
|---|---|---|
| Autopilot disengages randomly | NMEA 2000 bus instability | Check termination, power, and device count on backbone |
| Autopilot won't engage | No EV-1 detected | Check SeaTalkng cable and connector seating |
| Heading drifts in Auto | Compass deviation table needs update | Re-run compass swing in flat water |
| Ram moves but heading wanders | Rudder gain too low | Increase rudder gain in autopilot setup |
| Hydraulic pump runs but no response | Low hydraulic fluid or air in system | Check fluid level; bleed system |
| EV-1 not showing on network | Bus power or termination problem | Use Axiom to check NMEA 2000 device list |

---

## Notes for Agora

- **Open project:** Autopilot disengaging — likely NMEA 2000 network issue; investigate alongside AIS signal loss on Raymarine AIS650
- The Linear Drive installation guide in the docs folder is reference material only — Agora's drive is hydraulic
- If replacing the hydraulic pump or ram, confirm ACU model (100 vs 150) before ordering parts
- The P70 Pilothead is a SeaTalk1 device — it connects to the ACU via SeaTalk1 cable, NOT directly to the NMEA 2000 backbone
