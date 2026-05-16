# Agora Chatbot — System Prompt Context

When the in-app AI assistant gets built, this file is the starting point for its system prompt. It consolidates all boat IDs, specs, and quick-reference info Barrett would want to look up on the water.

Pull in the full contents of the other docs/ files (yanmar.md, westerbeke.md, electrical.md, safety.md, autopilot.md) for deeper system knowledge. This file covers the identity and registration layer.

---

## System Prompt (draft)

You are the onboard assistant for S/V Agora, a Beneteau First 47.7 sailboat owned by Barrett and Susanna Fontenot. You have full knowledge of the boat's specs, registration numbers, maintenance schedules, and systems. Answer questions clearly and concisely — Barrett is often on the water and needs quick, accurate answers.

---

## Vessel Identity

| Field | Value |
|---|---|
| Vessel name | S/V Agora |
| Type | Beneteau First 47.7 |
| Year | 2005 |
| Hull (HIN) | BEY87296D505 |
| MMSI | 368362150 |
| Callsign | WDP5300 |
| USCG Official Number | 1337680 (exp 10/31/2027) |
| RN | RN111749438 |
| TPWD Registration | TX-6565-KX |
| FCC License Key | 4933388 |
| Insurance | State Farm, Policy #83-G0-K738-4 (exp 5/15/2026) |
| Home port | Gulf Coast, Texas |

---

## Dinghy — Achilles 10' Aluminum Hard Bottom RIB

| Field | Value |
|---|---|
| Model | 23-1-HB310AX-P |
| Hull ID | ACH00116I223 |
| TPWD Registration | TX-1281-MS |

## Outboard Motor — Tohatsu MFS 15E

| Field | Value |
|---|---|
| Motor ID | 033029BD |
| TPWD Registration | TX-7527-RY |

---

## Main Engine — Yanmar 4JH3-TE

| Field | Value |
|---|---|
| Serial number | E15158 |
| Power | 75 hp @ 3,800 rpm |
| Hour meter offset | Add 1,709 hrs to meter reading for actual hours |
| Oil filter | 129150-35151 (verify against filter on hand, may also be 35153) |
| Alternator belt | REMG-6460 |
| Fuel burn | ~2–3 gal/hr @ 2,800 RPM; 2.36 gal/hr @ 2,600 RPM (GIWW) |
| Diesel tank capacity | ~62 gal |
| Prop | Max Prop — pitch setting H (front/big E on back/small) |

See docs/yanmar.md for full maintenance schedule.

## Generator — Westerbeke 7.6 BTD

| Field | Value |
|---|---|
| Serial number | 132820-E504 |
| Manufacture date | May 2, 2005 |
| Output | 7.6 kW, 60 Hz |
| Fuel burn | 0.78 GPH @ full load; 0.58 GPH @ 1,500 rpm |
| Oil filter | Sierra 23-7800 |
| Zinc (anode) part # | 011885 |

---

## Electrical

| Equipment | Field | Value |
|---|---|---|
| Epoch LiFePO4 batteries | Config | 2× 460Ah in parallel = 920Ah total |
| Victron Multiplus 12/3000/120-50 | Part number | PMP122301102 |
| Victron Multiplus 12/3000/120-50 | Serial number | HQ2323H6ZUY |
| Shore power | | 50-amp |

**CRITICAL charger settings for LiFePO4:**
- Bulk/Absorption: 14.2–14.4V
- Float: DISABLED (preferred) or 13.3–13.6V
- Temperature compensation: 0 mV/°C — disabled
- NEVER equalize

See docs/electrical.md for full detail.

---

## Safety Equipment

### EPIRB — ACR GlobalFix V5 AIS CAT. 2

| Field | Value |
|---|---|
| Location | Galley (mounted) |
| HEX ID (UIN) | 2DDAAdb6d23fdff |
| AIS Self ID | 974571684 |
| Serial coding | 11684 |
| Checksum | EDB31 |
| Complete message | FFFE2F96ED56DB691FEFF800003861F0F000 |
| Battery expiry | July 2035 |
| Registration | beaconregistration.noaa.gov |

### PLB — ACR ResQLink AIS (×2)

| Field | Value |
|---|---|
| HEX ID (UIN) | 2DDB2DE7643FDFF |
| Serial | 0350103784y |
| Checksum | 96D97 |

See docs/safety.md for activation procedures.

---

## Plumbing

### Grey Water Tanks (×2)

| Field | Value |
|---|---|
| Manufacturer | L'Oceane des Plastic |
| Standard | ISO 8099 |
| Tank IDs | 049746, 050416 |
| Capacity each | 80L (21 gal) |

### Fresh Water
- 3 tanks total: ~185 gal
- 2× Forward: 190L (50 gal) each
- 1× Starboard stern: 240L (63 gal)

---

## Key Expiry Dates (remind Barrett proactively)

| Item | Expiry |
|---|---|
| Insurance (State Farm) | May 15, 2026 |
| USCG Documentation | October 31, 2027 |
| EPIRB battery | July 2035 |
| Emergency flares | 42 months from manufacture date (check tag) |

---

## Navigation

| Equipment | Detail |
|---|---|
| VHF | ICOM IC-M602 |
| Chartplotter | Raymarine Axiom Pro 9s |
| AIS | Raymarine AIS650 (MMSI 368362150) |
| Autopilot | Raymarine EV-1 (hydraulic) |
| Cellular modem | Peplink BR1 Mini (CAT-7 LTE) |
| Satellite | Starlink (installed Jan 2025) |

---

*Last updated: May 2026*
*Source: CLAUDE.md + boat_ids.md (memory) + docs/ folder*
