# Westerbeke 7.6KW BTD Service Manual

**Source:** Westerbeke Service Manual, Publication No. 038673, Third Edition, September 1999
**Covers:** 7.6KW·60Hz / 5.7KW·50Hz BTD and 5.0KW BCD/BCDA/BCDB, Single Phase Marine Diesel Generators
**Agora's unit:** 7.6KW BTD, Serial 132820-E504, manufactured May 2, 2005

---

## Key Specs (7.6KW BTD)

- **Output:** 7.6 kW @ 60 Hz / 1,800 RPM
- **Fuel burn:** ~0.78 GPH @ full load (1,800 RPM); ~0.58 GPH @ light load (1,500 RPM)
- **Oil capacity:** ~1 full gallon
- **Oil filter:** Sierra 23-7800 (compatible)
- **Zinc (anode):** P/N 011885 — replace every 6 months; clean threads each time
- **Coolant system:** freshwater-cooled engine block with raw water heat exchanger

---

## Engine Troubleshooting Categories

The service manual organizes engine faults into these categories:

### Low Cranking Speed
- Faulty battery connections or discharged battery
- Damaged drive
- Defective starter motor

### Engine Fails to Start / Difficult Starting
- Air in fuel system — bleed fuel system
- Clogged fuel filter — replace
- Injection timing off
- Low compression
- Faulty injectors

### Injection System Out of Adjustment
- Check injection timing (16° BTDC for 7.6KW BTD)
- Adjust shim thickness under injection pump to change timing (~1 degree per 0.004 inch shim change)
- Advance timing: decrease shim thickness; retard timing: increase shim thickness

### Insufficient Fuel
- Bleed fuel lines
- Check/replace fuel filters
- Inspect fuel lift pump
- Check for air leaks in fuel supply lines

### Insufficient Air
- Inspect/clean air intake
- Check for obstructions

### Excessive Exhaust Smoke
- **Whitish or purplish smoke:** excessive oil consumption, low compression
- **Blackish or blue-grayish smoke:** fuel mixture issue, injector problem, air restriction

### Low Output Power / Rough Running
- Check injectors for spray pattern and opening pressure (~2,133 lbf/in² / 15.0 kgf/cm²)
- Verify injection timing
- Inspect glow plugs

---

## Fuel Injectors

**Spray pattern test:** Operate nozzle tester above 50 strokes/minute to check for steady, atomized spray. Any dripping, poor atomization, or separation indicates a defective nozzle.

**Nozzle opening pressure:** ~2,133 psi (15.0 kgf/cm²). Adjust via shim thickness in injector — 0.0020 in (0.05 mm) shim change ≈ 71 psi (5.0 kgf/cm²) pressure change.

**Tip:** Clean nozzle with clean diesel fuel only; do not expose skin to injector spray (penetrating pressure).

---

## Glow Plugs

**Torque:** 1–1.5 ft-lbs (1–1.5 N·m) — thread with anti-seize compound.

**Testing:**
- Resistance test: 1.5–2 ohms across terminals = good
- Current draw: 8–9 amps per plug when powered
- Do not energize glow plugs for more than 30 seconds continuously

**Inspection:** Clean carbon from tip and threads with a wire brush and solvent before reinstalling. Replace if tip is eroded or severely burned.

---

## Raw Water Pump

**Disassembly:**
1. Remove pump from engine; disconnect inlet/outlet nipples
2. Remove the impeller cover screw and cover
3. Pull impeller with needle-nose pliers, noting cam position
4. Remove cam from housing, then seals and bearings

**Assembly:**
- Apply thin film of petroleum jelly to impeller vanes and pump bore before installing impeller
- Do NOT use oil or grease on impeller (damages rubber); petroleum jelly only
- Rotate shaft as inserting impeller so vanes bend in correct direction
- Check shaft rotates smoothly after assembly

**Inspection:** Check shaft, bearings, and impeller for cracks and damage. Inspect lip seals and end caps. Replace any worn parts.

---

## Coolant Circulating Pump

**Disassembly:**
1. Remove pump pulley boss (press support required)
2. Remove bearing shaft from impeller and bearing housing
3. Inspect shaft, bearings, and impeller for cracks — do NOT apply oil or grease to any portion of the impeller seal spring/seal disc
4. Check pump turns smoothly after reassembly

**Lubrication:** Fill with lithium soap (NLGI No. 2):
- Both ball bearings
- ~1/3 space between both ball bearings
- Space between ball bearings and cover plate

---

## Starter Motor

- Type: sealed, high-torque internal-reduction starter
- Pinion side of shaft is separate from motor shaft; pinion slides only on the pinion shaft
- **No-load test:** with battery connected, starter should run smoothly to ≥1,000 RPM; if current or speed is out of spec, disassemble and repair

---

## Generator Maintenance Notes

From the manual's generator section:

- For generators run more than **10 hours between loads**, output voltage and current may become eroded and buildup may occur on brush contact areas — clean slip rings regularly in high-use tropical operation
- When generator runs at **1,800 RPM**, the generator rotor temperature develops — monitor for excessive heat buildup
- **No-load voltage adjustment:** adjustable via potentiometer on generator control board
- **Residual voltage check:** If generator won't build voltage, check residual magnetism (flash field procedure)
- **Bridge rectifier:** Failure causes no AC output; test each diode for continuity in both directions

---

## Shore Power Transfer Switch

The 7.6KW BTD includes a shore power transfer switch that prevents backfeed to shore power when generator is running. Inspect connections annually for corrosion.

---

## Injection Timing Reference (7.6KW BTD)

- **Timing:** 16° BTDC
- **Method:** Spill timing with engine in operating condition
- If specified timing cannot be achieved, adjust by adding or removing shim material under the injection pump mounting flange (0.004 inch / 0.10 mm change ≈ 1 degree of timing change)
- **Advance timing:** decrease shim thickness
- **Retard timing:** increase shim thickness

---

## Service Data / Tolerances (Summary from manual)

*Note: OCR quality of the original scanned specifications tables is poor; consult physical manual or Westerbeke dealer for exact values. The following are confirmed from readable text.*

| Item | Value |
|---|---|
| Injection timing | 16° BTDC |
| Nozzle opening pressure | ~2,133 psi (15 kgf/cm²) |
| Glow plug torque | 1–1.5 ft-lbs |
| Glow plug resistance | 1.5–2 ohms |
| Glow plug current draw | 8–9 amps each |
| Operating temp | 77–104°F (25–40°C) coolant range normal |

---

## Torque Spring Set (Governor)

When disassembled and reassembled, set projection of torque spring stopper using the adjustment screw to the specified projection per spec:
- N = 1.9 turns (5.0 KW models)
- N = 1.3 turns (7.6 KW models — Agora's generator)

---

## Notes for Agora

- **Zinc (anode) P/N 011885** — had to be chiseled out when replacement was delayed too long; do not miss the 6-month interval. Clean threads each time.
- **Possible fuel leak and water leak noted Feb 2026** — monitor closely; inspect gaskets, fuel pump diaphragm, and heat exchanger connections
- **2 spare impellers** stored in V Berth
- Last oil & filter change: Feb 2026 @ 4,420 hours
