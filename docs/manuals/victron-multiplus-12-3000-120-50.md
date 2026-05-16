# Victron Multiplus 12/3000/120-50 VE.Bus

**Agora's unit:** PN PMP122301102 / SN HQ2323H6ZUY  
**Source:** Victron Energy product documentation and community specifications  
**Note:** Full manual PDF blocked from automated access — download from victronenergy.com/upload/documents/Manual-MultiPlus-3k-120V-(firmware-xxxx4xx)-EN.pdf

---

## Specifications

| Item | Value |
|---|---|
| Model | MultiPlus 12/3000/120-50 VE.Bus |
| DC input voltage range | 9.5–17V |
| Max DC input current | 250A |
| DC output (charging) | 13.2–14.4V @ 120A |
| AC input voltage range | 95–140V AC |
| AC input max current | 50A (transfer switch) |
| AC output voltage | 115–125V AC ±2% |
| AC output frequency | 60 Hz ±0.1% |
| Continuous AC output | 3,000 VA / 2,400W @ 25°C |
| Continuous output @ 40°C | 2,200W |
| Continuous output @ 65°C | 1,700W |
| Peak power | 5,500W |
| Max efficiency | 93% |
| Zero-load draw (normal) | 13W |
| Zero-load draw (AES mode) | 9W |
| Zero-load draw (Search mode) | 3W |

---

## PowerAssist

PowerAssist supplements shore/generator power during peak demand:

- Adds up to 25A (3,000 ÷ 120V = 25A) to the input current
- With 50A shore input + 25A PowerAssist = up to **75A total output** available
- Prevents shore power breaker trips when loads spike
- Configured via VE.Configure software

---

## Charger Settings for Agora's LiFePO4 Banks

Agora uses 2× Epoch 12460A-H LiFePO4 (920Ah total). These settings are CRITICAL — factory defaults are for AGM and will overcharge lithium.

| Setting | Value | Notes |
|---|---|---|
| Battery type | Lithium Iron Phosphate | Or use custom |
| Bulk/Absorption voltage | **14.2–14.4V** | Do not exceed 14.4V |
| Absorption duration | 2 hours max | Or use adaptive |
| Float voltage | **DISABLED** preferred | If must be set: 13.3–13.6V max |
| Temperature compensation | **0 mV/°C — DISABLED** | Never enable for LiFePO4 |
| Equalization | **NEVER** | Will destroy lithium cells |
| BMS cutoff high voltage | 14.6V | BMS will disconnect if reached |

---

## VE.Configure — Programming the Multiplus

The Multiplus requires VE.Configure software (Windows PC) to change charger settings:

**What you need:**
- MK3-USB interface dongle (connects PC to Multiplus via VE.Bus port)
- OR Victron VE.Bus Smart Dongle (Bluetooth, more convenient)
- VE.Configure 3 software (free download from victronenergy.com)

**Connection:** MK3-USB → 8-pin RJ45 port on Multiplus → USB on PC

**Key settings to verify for Agora:**
1. Charger → Battery type → Lithium Iron Phosphate
2. Charger → Absorption voltage → 14.2–14.4V
3. Charger → Float voltage → 13.5V (or disable)
4. Charger → Temperature compensation → 0 mV/°C
5. Charger → Equalization → Disabled
6. Grid → AC input current limit → 50A (matches shore power)
7. PowerAssist → Enable → Yes

---

## Transfer Switch

- Built-in 50A automatic transfer switch
- Switches between shore/generator power and inverter
- Transfer time: approximately 20ms
- No manual switching required — fully automatic

---

## VE.Bus Interface

The VE.Bus port allows connection to:
- **Victron Color Control GX / Cerbo GX** — full monitoring dashboard
- **MK3-USB dongle** — PC programming
- **Venus GX** — system integration
- Future option for Agora: Victron Cerbo GX for NMEA 2000 integration

---

## LED Status Indicators

| LED | State | Meaning |
|---|---|---|
| Mains On (green) | On | Shore/generator AC present |
| Inverter On (green) | On | Operating in inverter mode |
| Bulk (yellow) | On | Bulk charging |
| Absorption (yellow) | On | Absorption phase |
| Float (green) | On | Float phase |
| Inverter On (green) | Flashing | Overload warning |
| Low Battery (red) | On | DC input below threshold |
| Temperature (red) | On | Overtemperature |
| Overload (red) | On | Output overload |

---

## Alarm / Shutdown Conditions

- **Overload:** Output exceeds continuous rating — reduces output, then shuts down
- **Low battery:** DC input below ~9.5V — shuts down inverter to protect batteries
- **Overtemperature:** Shuts down until cooled — check ventilation
- **High voltage:** DC input above 17V — check alternator regulator

---

## Notes for Agora

- Do not change charger settings without VE.Configure — front panel has no settings access
- Alternator output goes through Newmar 1-2-120 isolator before reaching Multiplus input
- Shore power: 50-amp inlet → Multiplus → distribution panel
- Victron SmartShunt (installed Nov 2024) monitors battery SoC; review data trends at each 6-month check
