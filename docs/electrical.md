# Electrical System

## House Battery Bank — 920Ah (2× Epoch 12460A-H LiFePO4)

- 2 batteries wired in parallel = 920Ah / 11.76 kWh total
- Chemistry: Prismatic LiFePO4
- Nominal voltage: 12.8V each
- Max continuous charge/discharge: 200A per battery
- Weight: 84 lbs each; 20.55"L × 9.45"W × 8.60"H
- Bluetooth monitoring built in
- Warranty: 11 years

### Charger Settings (CRITICAL)
- Bulk/Absorption: 14.2–14.4V
- Float: **DISABLED** (preferred). If required: 13.3–13.6V max
- Temperature compensation: **0 mV/°C — disable on all chargers**
- Equalization: **NEVER**
- BMS cutoff: 14.6V

## Engine Battery
- 1× Lifeline GPL-31T, 600 CCA, installed July 2017

## Charging System
- **Shore charger:** ProNautic 1260P — 12V @ 60A, 3 outputs, 100–250VAC input
- **Inverter/charger:** Victron Multiplus 12/3000/120-50 VE.Bus
  - PN: PMP122301102 / SN: HQ2323H6ZUY
  - DC IN: 9.5–17V @ 250A | DC OUT: 13.2–14.4V @ 120A
  - AC IN: 95–140V, 50A | AC OUT: 115–125V, 21A, 60Hz
  - Continuous power: 2,400W / 3,000VA
- **Alternator isolator:** Newmar 1-2-120 (splits alternator output between banks)
- **Shore power:** 50-amp

## Battery Monitoring
- Victron SmartShunt installed Nov 2024 (under port berth)
- Cleaned up wiring, added fuse box and negative bus at same time
- Future upgrade path: Victron Cerbo GX → NMEA 2000 integration, tank senders, solar

## AC Electrical
- Xantrex PROwatt SW Transfer Switch (15A @ 120V 60Hz)
- Xantrex Sine Wave Inverter 1000 (1,000W continuous / 1,500W surge)
- Note: 1,000W / 120V = ~8.3A. Typical microwave = full load.

## Navigation Electronics
- VHF: ICOM IC-M602
- Chartplotter: Raymarine Axiom Pro 9s
- Displays: Raymarine i70 (×6), Raymarine ST70+ (×2)
- AIS: Raymarine AIS650
- Autopilot: Raymarine EV-1 + P70 Pilothead + hydraulic ram/pump

## Connectivity
- Peplink BR1 Mini cellular modem (installed Jan 2025)
- Starlink (installed Jan 2025)

## NMEA 2000 Note
The autopilot (EV-1) and AIS (AIS650) are both on the NMEA 2000 network. The autopilot disengaging and AIS signal loss issues may be related to NMEA 2000 network health — check for termination, bus power, and device conflicts.
