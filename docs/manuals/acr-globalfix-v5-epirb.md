# ACR GlobalFix V5 AIS EPIRB — User Manual Notes

**Agora's unit:** CAT. 2 Manual Release (Model 2852)  
**HEX ID:** 2DDAAdb6d23fdff | **AIS Self ID:** 974571684  
**Battery expiry:** July 2035  
**Location:** Galley (mounted)  
**Source:** ACR Electronics product manual (94450OM) and official specifications

---

## Specifications

| Item | Value |
|---|---|
| Model | GlobalFix V5 AIS EPIRB — CAT. 2 (2852) |
| Frequencies | 406 MHz (satellite) + 121.5 MHz (homing) + AIS (VHF) |
| GNSS | GPS + Galileo + GLONASS |
| Position accuracy | Within 100 meters |
| Battery life (operational) | 48 hours continuous operation |
| Battery life (shelf) | 10 years |
| Battery expiry (Agora) | July 2035 |
| Self-test limit | 120 tests max in 10-year battery life |
| Satellite system | Cospas-Sarsat worldwide network |
| Return Link Service (RLS) | Yes — confirms distress signal received by satellite |
| AIS alert | Yes — broadcasts distress to nearby vessels on AIS (VHF) |
| NFC diagnostics | Yes — ACR Product App |
| Float | Yes — buoyant design |
| Water activation | Yes — auto-activates in water |

---

## How It Works

1. **406 MHz satellite signal** → sent to Cospas-Sarsat network worldwide → triggers rescue
2. **121.5 MHz homing signal** → guides rescue helicopter/vessel to your location (short range)
3. **AIS broadcast** → alerts nearby vessels on VHF AIS — the fastest local rescue path
4. **RLS (Return Link Service)** → satellite confirms your signal was received — LED blinks to confirm

---

## Activation

### Manual Activation (CAT. 2 bracket — Agora's unit)
1. Remove EPIRB from bracket
2. Lift the safety cap
3. Press and hold the **ON/ARM** switch to the ARM/ON position
4. EPIRB begins transmitting — LED flashes, audible alert
5. Deploy in water if possible — water activation also works automatically

### Water Activation (automatic)
- The EPIRB auto-activates when submerged — if the boat sinks it will float free and activate

### Cancel / Deactivate
1. Push switch back to OFF position
2. Report to MRCC (Maritime Rescue Coordination Center) immediately — false alerts carry fines

---

## Self-Test Procedure

**Frequency:** Monthly recommended; maximum **120 tests** in 10-year battery life.

1. Press the **TEST** button for **1 second** until a brief green LED flash, then release
2. Watch for **3 green LED flashes** (3 separate sub-tests passing)
3. Then a **long green LED flash** + **long beep** = TEST PASSED
4. If any flash is red or test fails → contact ACR Electronics

**IMPORTANT:** Self-test does NOT transmit a live 406 MHz distress signal. It tests internal circuits only.

---

## NFC Diagnostics (ACR Product App)

1. Download the **ACR Product App** on your phone
2. Hold phone adjacent to the EPIRB
3. App opens automatically via NFC and displays:
   - Current battery level
   - Number of self-tests completed (track against 120 limit)
   - Number of GNSS tests completed
   - Total time EPIRB has been activated
   - Date of last self-test

Use the app at each monthly self-test to confirm battery status.

---

## LED Indicator Reference

| LED Color/Pattern | Meaning |
|---|---|
| 3 green flashes + long green | Self-test passed |
| Any red flash during test | Self-test failed — service required |
| Rapid green flash | Transmitting distress signal |
| Green + RLS blink | Return Link Service confirmed — rescue initiated |

---

## Annual Maintenance

| Task | Interval | Notes |
|---|---|---|
| Self-test | Monthly | 1-second button press; max 120 tests in 10 yrs |
| Check battery expiry date | Annually | Battery expiry: July 2035 |
| Inspect bracket and release mechanism | Annually | Check float-free mechanism works |
| Verify registration is current | Annually | Registration at beaconregistration.noaa.gov |
| Check HEX ID label is legible | Annually | — |

---

## Registration

**Register at:** [beaconregistration.noaa.gov](https://beaconregistration.noaa.gov)

Registration links your HEX ID to vessel and emergency contact info. Rescuers use this to:
- Confirm identity before mobilizing full rescue
- Contact family/shore contacts
- Know vessel type, number of POB, description

**Update registration whenever:**
- Emergency contact info changes
- You sell the vessel
- The EPIRB moves to a different vessel

---

## Agora Notes

- **HEX ID:** 2DDAAdb6d23fdff — matches NOAA registration entry for S/V Agora
- **AIS Self ID:** 974571684 — visible on AIS displays of nearby vessels when EPIRB activates
- Battery expiry July 2035 — next replacement due at that date (send to ACR for battery replacement)
- The inReach SE+/Explorer+ is a SEPARATE device for two-way satellite comms — EPIRB is SOS-only
- PLBs (ACR ResQLink AIS, ×2) are personal — HEX ID 2DDB2DE7643FDFF — keep on lifejackets
