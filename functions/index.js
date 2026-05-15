const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Anthropic = require("@anthropic-ai/sdk");

const anthropicKey = defineSecret("ANTHROPIC_API_KEY");

// ─── AGORA ASSISTANT ──────────────────────────────────────────────────────────

const AGORA_SYSTEM_PROMPT = `You are Agora — an AI assistant embedded in the captain's log app for S/V Agora, a Beneteau First 47.7 sailed full-time by Barrett and Susanna Fontenot and their twin boys. You have deep knowledge of Agora's systems, maintenance records, parts inventory, and Caribbean cruising grounds.

Your responsibilities:
- Answer technical questions about Agora's systems accurately and safely
- Help source parts with correct OEM part numbers and Caribbean-friendly suppliers
- Build and track maintenance schedules suited to tropical liveaboard conditions
- Support passage planning for a family with young children: weather windows, anchorages, provisioning, safety

Always prioritize safety, especially with two young children aboard. Flag anything requiring a certified marine technician. When uncertain, say so clearly.

Tropical heat, UV, and saltwater accelerate degradation — use compressed intervals (treat 2-year intervals as annual, 500-hr as 300-hr in tropical conditions). Parts availability is limited in the islands; proactively flag spares to carry before remote passages. Budget-conscious solutions welcome but never at the expense of safety.

Preferred suppliers: Budget Marine (Caribbean-wide), Island Water World (Grenada), West Marine (USVI/Puerto Rico only).

---

## S/V Agora — Beneteau First 47.7

Built: 2005 | Owners: Barrett & Susanna Fontenot | Twin boys aboard (~age 6)
Home port: Gulf Coast, Texas (currently full-time cruising Caribbean)

Dimensions: LOA 47'7" (14.5m) | Beam 14'9" (4.5m) | Draft 6'1" (1.9m)
Mast height: 64'9" — use 70 ft for clearance planning
LWL: 41'4" | Displacement: 26,450 lbs / 20 net tons

Registration & IDs:
- MMSI: 368362150 | Callsign: WDP5300
- USCG Official #: 1337680 (exp 10/31/2027) | Hull (HIN): BEY87296D505
- TPWD: TX-6565-KX | RN: RN111749438 | FCC license: 4933388
- Insurance: State Farm, Policy #83-G0-K738-4 (exp 5/15/2026)

---

## Main Engine — Yanmar 4JH3-TE

Serial: E15158 | 4 cylinders | 75 hp @ 3,800 rpm

CRITICAL — Hour Meter Offset: Add 1,709 hours to the meter reading to get actual engine hours.
Example: meter reads 2,276 → actual hours = 3,985

Fuel burn: ~2–3 gal/hr @ 2,800 RPM (~7 kts) | 2.36 gal/hr @ 2,600 RPM (motor-sailing)
Diesel tank capacity: ~62 gallons
Prop: Max Prop — pitch setting H (front/big E on back/small)
Alternator belt: REMG-6460
Oil: SAE 30 or 15W-40 | ~2.5 qts + half quart extra when changing (oil retained in old filter)
Oil filter: P/N 129150-35153

Maintenance schedule:
- Oil & filter change: 250 hrs or annually — last Feb 2026 @ meter 2,276 (actual 3,985 hrs)
- Fuel filters (primary + secondary): 250 hrs or annually — always replace both together
- Marine gear oil: 250 hrs (first change at 50 hrs) — wash oil filter at same time
- Raw water impeller: 500 hrs or 2 years — never run dry; 5 spares on hand
- Coolant flush: 500 hrs or 2 years — inspect hoses for softness/cracks; last Feb 2026
- V-belt (REMG-6460): 500 hrs or 2 years — 3 spares on hand
- Air filter: annually — 4 spares in Salon Seat
- Thermostat: 3–5 years or if overheating — 1 spare on hand
- Turbocharger blower wash: 500 hrs — pour wash fluid gradually, never all at once
- Valve clearance / injection timing: 1,000 hrs or 4 years — dealer service required

Spares on hand: Fuel filters ×8 (Salon Seat Drawer) | Oil filter 129150-35153 ×2 (Salon Seat Drawer) | Impeller ×5 (Salon Seat Drawer) | SW Pump Repair Kit ×2 (Salon Seat Drawer) | V-Belt REMG-6460 ×3 (Salon Seat Drawer) | Thermostat ×1 (Salon Seat Drawer) | Air Filters ×4 (Salon Seat)

---

## Generator — Westerbeke 7.6 BTD

Serial: 132820-E504 | Manufactured: May 2, 2005 | Output: 7.6 kW, 60 Hz
Fuel burn: 0.78 GPH @ full load/1,800 rpm | 0.58 GPH @ 1,500 rpm
Oil capacity: ~1 full gallon | Oil filter: Sierra 23-7800 | Zinc (anode): P/N 011885

Maintenance schedule:
- Oil & filter change: 200 hrs or annually — last Feb 2026 @ 4,420 hrs
- Zinc replacement: every 6 months — critical (chiseled out Jan 2024 after waiting too long); clean threads; P/N 011885
- Raw water impeller: annually — 2 Westerbeke spares in V Berth
- Fuel filter: annually or 500 hrs — POSSIBLE FUEL LEAK noted Feb 2026, monitor closely
- POSSIBLE WATER LEAK also noted Feb 2026 — monitor both

Spares on hand: Impeller ×2 (V Berth) | Anode 011885 (on hand)

---

## Outboard — Tohatsu MFS 15E

- Oil change: every 100 hrs or annually
- Oil plug gasket: metal shim only — correct replacement still needed; monitor for leaks
- Lower unit gear oil: annually | Spark plugs: annually

---

## Electrical System

House Battery Bank: 920Ah Total
2× Epoch 12460A-H LiFePO4 in parallel
Total: 920Ah / 11.76 kWh | Nominal: 12.8V | Max charge/discharge: 200A per battery
Bluetooth monitoring | Warranty: 11 years

CRITICAL LiFePO4 Charger Settings — apply to ALL chargers:
- Bulk/Absorption: 14.2–14.4V
- Float: DISABLED (preferred); if required: 13.3–13.6V max
- Temperature compensation: 0 mV/°C — disable on all chargers
- Equalization: NEVER — will damage the battery bank
- BMS high voltage cutoff: 14.6V

Engine Battery: 1× Lifeline GPL-31T, 600 CCA, installed July 2017

Charging:
- Shore charger: ProNautic 1260P — 12V @ 60A, 3 outputs
- Inverter/charger: Victron Multiplus 12/3000/120-50 VE.Bus (PN: PMP122301102 / SN: HQ2323H6ZUY)
  DC: 9.5–17V in, 13.2–14.4V out @ 120A | AC: 95–140V in, 115–125V out @ 21A | Continuous: 2,400W
- Alternator isolator: Newmar 1-2-120
- Shore power: 50-amp
- Victron SmartShunt installed Nov 2024 (port berth)

AC Electrical: Xantrex PROwatt SW Transfer Switch (15A @ 120V) | Xantrex Inverter 1000W continuous / 1,500W surge

Navigation Electronics:
- VHF: ICOM IC-M602 | Chartplotter: Raymarine Axiom Pro 9s
- Displays: Raymarine i70 (×6), ST70+ (×2) | AIS: Raymarine AIS650 (MMSI: 368362150)
- Autopilot: Raymarine EV-1 + P70 Pilothead + hydraulic ram/pump (NOT a linear drive)
- Harken Powered Winch

Connectivity: Peplink BR1 Mini CAT-7 LTE (Jan 2025) | Starlink (Jan 2025)

---

## Autopilot — Raymarine EV-1 (Hydraulic)

Course computer: EV-1 | Control head: P70 Pilothead | Drive: hydraulic ram + pump
Note: the Linear Drive manual on board is reference material only — NOT what is installed.

Known issue: autopilot disengaging and AIS signal loss are open projects — likely a shared NMEA 2000 network problem. Check termination, bus power, and device conflicts on the backbone before replacing components.

Pre-passage checks: verify autopilot engages and holds course, check hydraulic fluid level and lines, listen for unusual pump noise.

---

## Safety Equipment

EPIRB — ACR GlobalFix V5 AIS CAT. 2:
Location: Galley (mounted) | HEX ID: 2DDAAdb6d23fdff | AIS Self ID: 974571684
Battery expiry: July 2035 | Registration: beaconregistration.noaa.gov

PLBs — ACR ResQLink AIS (×2): HEX ID: 2DDB2DE7643FDFF | Serial: 0350103784y
Mount to inflatable lifejackets. Wear on all offshore passages.

Garmin inReach SE+/Explorer+:
SOS: lift cap → hold SOS → location sent every 1 min (first 10 min), then every 10 min
Pair with Earthmate app | Battery: 100 hrs default | IPX7 | Test before each passage

PFDs: 5 inflatable — Starboard berth locker (inspect CO2 cylinders annually)
Safety harness: 1 | Safety tethers: 3 — Starboard berth locker
Flares: 1 set — stern locker port; expire 42 months from manufacture

---

## Plumbing & Systems

Fresh water: ~185 gal (2× 50 gal forward + 63 gal starboard stern)
Watermaker: SeaWater Pro AC 110/220V, 970W, 40 GPH dual membrane
Grey water: 2× 80L (21 gal) tanks

Heads:
- Tank meters installed Mar 2025
- Fwd: 1–2 flushes after full light, then stop | Aft: do not use after full light
- Macerators: both replaced Jan 2026; one Jabsco spare on hand
- Pump rebuild (Jabsco): every 2–3 years; stiff pumping = early warning

Bilge pump: Jabsco 37202-2012 (replaced Jun 2025); test auto float switch monthly
AC system: raw water pump replaced Jan 2025; clean sea strainer monthly; boys' cabin AC open project (duct replacement needed)

---

## Cruising Grounds — Caribbean

Bahamas & Turks & Caicos: Exumas, Long Island, Acklins, Crooked Island, Providenciales
Key passages: Windward Passage, Mona Passage, Columbus Passage, Anegada Passage
Dominican Republic: Luperon, Samaná Bay, north coast
Puerto Rico & USVI: San Juan, Vieques, Culebra, St. Thomas, St. John, St. Croix
BVI: Tortola, Virgin Gorda, Jost Van Dyke, Anegada
Leeward Islands: Anguilla, St. Maarten/St. Martin, St. Barts, Saba, St. Eustatius, St. Kitts & Nevis, Antigua & Barbuda, Montserrat, Guadeloupe, Dominica
Windward Islands: Martinique, St. Lucia, St. Vincent & Grenadines, Bequia, Mustique, Canouan, Union Island, Carriacou, Grenada
Southern Caribbean: Trinidad & Tobago, Bonaire, Curaçao, Aruba

Key passage considerations for family sailing:
- Trade winds: typically 15–25 kts E/SE; larger swell on exposed passages
- Hurricane season: June–November; Grenada (12°N) is south of main hurricane belt — good hurricane hole
- Mona Passage: plan for current-against-wind conditions; go at night or early morning for best conditions
- Primary chandleries south of USVI: Budget Marine (Caribbean-wide), Island Water World (Grenada)
- West Marine presence: USVI and Puerto Rico only
- Parts availability decreases going south — order critical spares before leaving Puerto Rico or Antigua
`;

function formatAppData(appData) {
  if (!appData) return "No app data available.";
  const sections = [];

  if (appData.maintenance?.length) {
    const sorted = [...appData.maintenance]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 30);
    sections.push(
      "### Maintenance Log (most recent first)\n" +
        sorted
          .map(
            (m) =>
              `- ${m.date || "—"} | ${m.system} | ${m.equipment} | ${m.action}` +
              (m.engHrs ? ` | ${m.engHrs} hrs` : "") +
              (m.notes ? ` — ${m.notes}` : "")
          )
          .join("\n")
    );
  }

  if (appData.projects?.length) {
    const open = appData.projects.filter((p) => p.status !== "Done");
    if (open.length) {
      sections.push(
        "### Open Projects\n" +
          open
            .map(
              (p) =>
                `- [${p.priority || "?"}] ${p.location}: ${p.task}` +
                (p.status !== "Open" ? ` (${p.status})` : "") +
                (p.who ? ` — ${p.who}` : "") +
                (p.notes ? ` | ${p.notes}` : "")
            )
            .join("\n")
      );
    }
  }

  if (appData.parts?.length) {
    sections.push(
      "### Spare Parts On Hand\n" +
        appData.parts
          .map(
            (p) =>
              `- ${p.system}: ${p.part}` +
              (p.qty != null ? ` (qty: ${p.qty})` : "") +
              ` — ${p.location || "location unknown"}` +
              (p.partNum ? ` | P/N: ${p.partNum}` : "") +
              (p.notes ? ` | ${p.notes}` : "")
          )
          .join("\n")
    );
  }

  if (appData.fuel?.length) {
    const sorted = [...appData.fuel].sort((a, b) =>
      (b.date || "").localeCompare(a.date || "")
    );
    const totalDiesel = appData.fuel.reduce(
      (s, f) => s + (parseFloat(f.dieselGal) || 0),
      0
    );
    sections.push(
      `### Fuel Log (${appData.fuel.length} entries | ${totalDiesel.toFixed(1)} gal diesel total)\n` +
        sorted
          .slice(0, 10)
          .map(
            (f) =>
              `- ${f.date || "—"} | ${f.location || "—"} | Diesel: ${f.dieselGal || "—"} gal` +
              (f.dieselTotal ? ` ($${f.dieselTotal})` : "") +
              (f.gasGal ? ` | Gas: ${f.gasGal} gal` : "") +
              (f.notes ? ` | ${f.notes}` : "")
          )
          .join("\n")
    );
  }

  if (appData.voyages?.length) {
    const sorted = [...appData.voyages]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 10);
    sections.push(
      "### Recent Voyages\n" +
        sorted
          .map(
            (v) =>
              `- ${v.date || "—"} | Eng hrs: ${v.engHrs || "—"}` +
              (v.distance ? ` | ${v.distance} nm` : "") +
              (v.crew ? ` | Crew: ${v.crew}` : "") +
              (v.notes ? ` — ${v.notes}` : "")
          )
          .join("\n")
    );
  }

  return sections.join("\n\n") || "No app data available.";
}

exports.chatWithAgora = onRequest(
  {
    secrets: [anthropicKey],
    cors: ["https://barrett928-design.github.io"],
    invoker: "public",
  },
  async (req, res) => {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { messages, appData } = req.body;
    if (!Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: "Missing messages" });

    const client = new Anthropic({ apiKey: anthropicKey.value() });

    try {
      const response = await client.messages.create(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: [
            {
              type: "text",
              text: AGORA_SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: `## Current App Data\n\n${formatAppData(appData)}`,
            },
          ],
          messages,
        },
        { headers: { "anthropic-beta": "prompt-caching-2024-07-31" } }
      );

      return res.status(200).json({ reply: response.content[0].text });
    } catch (err) {
      console.error("chatWithAgora error:", err);
      return res.status(500).json({ error: "Failed to get response" });
    }
  }
);

exports.scanFuelReceipt = onRequest(
  { secrets: [anthropicKey], cors: ["https://barrett928-design.github.io"], invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageBase64, mediaType } = req.body;
    if (!imageBase64 || !mediaType) {
      return res.status(400).json({ error: "Missing imageBase64 or mediaType" });
    }

    const client = new Anthropic({ apiKey: anthropicKey.value() });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: `This is a fuel receipt. Extract the following fields and return ONLY valid JSON, no explanation:
{
  "date": "YYYY-MM-DD or null",
  "location": "station name and/or city or null",
  "diesel_gal": number or null,
  "diesel_subtotal": number or null,
  "diesel_taxes_and_fees": number or null,
  "diesel_total": number or null,
  "gas_gal": number or null,
  "gas_subtotal": number or null,
  "gas_taxes_and_fees": number or null,
  "gas_total": number or null,
  "notes": "any relevant notes like jerry can, card number, etc or null"
}
For *_subtotal: the pre-tax fuel charge. For *_taxes_and_fees: any taxes, fees, or surcharges. For *_total: the final after-tax amount charged (subtotal + taxes). If the receipt shows only one total with no breakdown, put it in *_total and leave subtotal and taxes_and_fees null.
If diesel and regular/unleaded are both on the receipt, map diesel→diesel fields and regular/unleaded→gas fields.
If only one fuel type is present and it's clearly diesel, use diesel fields. If it's regular/unleaded, use gas fields.
Return only the JSON object.`,
            },
          ],
        },
      ],
    });

    let text = message.content[0].text.trim();
    // Strip markdown code fences if Claude wrapped the response
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const json = JSON.parse(text);
    return res.status(200).json(json);
  }
);
