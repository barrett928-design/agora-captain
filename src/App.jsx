import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";

// Projects moved to first tab
const TABS = ["Projects", "Voyage Log", "Maintenance", "Fuel Log", "Spare Parts"];

const INITIAL_DATA = {
  voyages: [
    { id: 1, date: "2023-05-28", engHrs: "63.6", genHrs: "22", distance: "", depart: "13:10", arrive: "16:30", wind: "10", weather: "Clear/Sunny", notes: "Maiden voyage! Fam + Ghormleys & Mer. Change to 1.25 jib", crew: "Family, Ghormleys, Mer" },
    { id: 2, date: "2023-07-02", engHrs: "71.7", genHrs: "", distance: "17.91", depart: "15:10", arrive: "21:00", wind: "3-15", weather: "Scattered T-storms", notes: "Liles family, Red Fish anchor. Kicked up sand at 5ft depth", crew: "Liles family" },
    { id: 3, date: "2023-07-22", engHrs: "73.3", genHrs: "", distance: "16.65", depart: "13:00", arrive: "18:00", wind: "5-10", weather: "Clear", notes: "", crew: "Wendy and Jon" },
    { id: 4, date: "2023-07-29", engHrs: "", genHrs: "", distance: "12.41", depart: "18:30", arrive: "20:30", wind: "8-12", weather: "", notes: "", crew: "Will, James, Annabelle, Camilla, Evie" },
    { id: 5, date: "2024-02-25", engHrs: "89.9", genHrs: "", distance: "12.88", depart: "11:30", arrive: "14:30", wind: "17-23", weather: "Rough", notes: "First sail after boat work, jib only. Autopilot low battery alarm. Ran aground at low tide (4.3ft).", crew: "Wendy and John" },
    { id: 6, date: "2024-11-22", engHrs: "", genHrs: "", distance: "", depart: "19:00", arrive: "24:00", wind: "5-12 NNW", weather: "Clear", notes: "Boys' first overnight. Anchored south of El Jardin Beach.", crew: "Boys" },
    { id: 7, date: "2025-01-04", engHrs: "", genHrs: "", distance: "", depart: "", arrive: "", wind: "", weather: "", notes: "Man overboard drills with Farley", crew: "Farley" },
  ],
  maintenance: [
    { id: 1, date: "2024-01-13", engHrs: "", system: "Generator", equipment: "Anode", action: "Replaced", crew: "Barrett", notes: "Had to chisel out — don't wait months to check", partLink: "" },
    { id: 2, date: "2024-02-19", engHrs: "", system: "Generator", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "Took full gallon. Sierra oil filter ok for Westerbeke.", partLink: "Sierra 23-7800" },
    { id: 3, date: "2024-02-19", engHrs: "", system: "Yanmar", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "Half quart to catch oil from filter", partLink: "" },
    { id: 4, date: "2024-07-07", engHrs: "", system: "Generator", equipment: "Anode", action: "Replaced", crew: "Barrett", notes: "Need to clean threads, can't screw in fully", partLink: "" },
    { id: 5, date: "2024-11-30", engHrs: "", system: "Electrical", equipment: "Wiring", action: "Installed SmartShunt", crew: "Barrett, Andrew", notes: "Cleaned up wiring under port berth, added fuse box and negative bus.", partLink: "" },
    { id: 6, date: "2025-01-09", engHrs: "", system: "AC", equipment: "Raw Water Pump", action: "Replaced", crew: "Barrett", notes: "", partLink: "" },
    { id: 7, date: "2025-01-19", engHrs: "", system: "Generator", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "", partLink: "" },
    { id: 8, date: "2025-01-19", engHrs: "", system: "Yanmar", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "", partLink: "" },
    { id: 9, date: "2025-01-26", engHrs: "", system: "Electrical", equipment: "Wiring", action: "Installed Peplink Modem + Starlink", crew: "Barrett, Michael", notes: "", partLink: "" },
    { id: 10, date: "2025-03-11", engHrs: "", system: "Heads", equipment: "Tank Meters", action: "Installed", crew: "Judson", notes: "Front: 1-2 flushes after full light. Aft: do not use after full light.", partLink: "" },
    { id: 11, date: "2025-06-25", engHrs: "", system: "Bilge", equipment: "Bilge Pump", action: "Replaced", crew: "Barrett", notes: "", partLink: "Jabsco 37202-2012" },
    { id: 12, date: "2025-10-14", engHrs: "", system: "Generator", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "", partLink: "" },
    { id: 13, date: "2025-10-14", engHrs: "", system: "Yanmar", equipment: "Oil/Filter", action: "Oil change", crew: "Barrett", notes: "", partLink: "" },
    { id: 14, date: "2025-11-05", engHrs: "", system: "Hull", equipment: "Bottom Paint", action: "New bottom paint", crew: "", notes: "", partLink: "" },
    { id: 15, date: "2026-01-19", engHrs: "", system: "Heads", equipment: "Macerators", action: "Replaced both", crew: "Barrett", notes: "One Jabsco left", partLink: "" },
    { id: 16, date: "2026-02-28", engHrs: "2276", system: "Yanmar", equipment: "Oil/Coolant", action: "Oil change and coolant", crew: "Barrett", notes: "", partLink: "" },
    { id: 17, date: "2026-02-28", engHrs: "4420", system: "Generator", equipment: "Oil/Filter/Zinc", action: "Oil change and zinc", crew: "Barrett", notes: "Possible water leak and small fuel leak — monitor", partLink: "" },
    { id: 18, date: "2026-02-28", engHrs: "", system: "Tohatsu", equipment: "Oil", action: "Oil change", crew: "Barrett", notes: "Oil plug gasket missing (metal washer only). Replacements wrong size — monitor.", partLink: "" },
  ],
  projects: [
    { id: 1, location: "Bow", task: "Consider anchor chain replacement", who: "", status: "Open", priority: "High", notes: "" },
    { id: 2, location: "Galley", task: "Inspect fire suppressants", who: "", status: "Open", priority: "High", notes: "" },
    { id: 3, location: "Galley", task: "Develop and drill fire plan", who: "", status: "Open", priority: "High", notes: "" },
    { id: 4, location: "Galley", task: "Develop and drill evacuation plan", who: "", status: "Open", priority: "High", notes: "" },
    { id: 5, location: "Bow", task: "Spot fix gel coat on deck", who: "Barrett", status: "In Progress", priority: "Med", notes: "" },
    { id: 6, location: "Bow", task: "Fix steaming light", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 7, location: "Aft Head", task: "Fix bottom seal on door", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 8, location: "Bow", task: "Replace windlass bolt", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 9, location: "Bow", task: "Rigging inspection (rust spots & wind pressure)", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 10, location: "Salon", task: "Troubleshoot autopilot disengaging & AIS signal loss", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 11, location: "Stern", task: "Troubleshoot A/C for boys & replace ducts", who: "", status: "Open", priority: "Med", notes: "" },
    { id: 12, location: "Bow", task: "Strip & refinish toe rails", who: "Susanna", status: "Open", priority: "Low", notes: "" },
    { id: 13, location: "Bow", task: "Investigate dinghy davits + mount", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 14, location: "Galley", task: "Deep clean stove & storage below", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 15, location: "Salon", task: "Nav table reorg & cable management", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 16, location: "Stern", task: "Repair arch handlebar at helm", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 17, location: "V Berth", task: "New foam on mattress", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 18, location: "Universal", task: "Polish chrome / rust removal (CorrisionX)", who: "", status: "Open", priority: "Low", notes: "" },
    { id: 19, location: "Stern", task: "Replace/repair companionway cover", who: "Susanna", status: "Open", priority: "Low", notes: "" },
    { id: 20, location: "Universal", task: "Install water and fuel tank sensors", who: "", status: "Open", priority: "Low", notes: "" },
  ],
  parts: [
    { id: 1, system: "Yanmar", part: "Fuel Filters", qty: 8, location: "Salon Seat Drawer", notes: "", partNum: "" },
    { id: 2, system: "Yanmar", part: "Oil Filter", qty: 2, location: "Salon Seat Drawer", notes: "", partNum: "129150-35153" },
    { id: 3, system: "Yanmar", part: "Impeller", qty: 5, location: "Salon Seat Drawer", notes: "", partNum: "" },
    { id: 4, system: "Yanmar", part: "SW Pump Repair Kit", qty: 2, location: "Salon Seat Drawer", notes: "", partNum: "" },
    { id: 5, system: "Yanmar", part: "V-Belt", qty: 3, location: "Salon Seat Drawer", notes: "", partNum: "" },
    { id: 6, system: "Yanmar", part: "Thermostat", qty: 1, location: "Salon Seat Drawer", notes: "", partNum: "" },
    { id: 7, system: "Yanmar", part: "Air Filters", qty: 4, location: "Salon Seat", notes: "", partNum: "" },
    { id: 8, system: "Westerbeke", part: "Impeller", qty: 2, location: "V Berth", notes: "", partNum: "" },
    { id: 9, system: "Westerbeke", part: "Anode", qty: null, location: "", notes: "", partNum: "011885" },
    { id: 10, system: "Safety", part: "Emergency Flares", qty: 1, location: "Stern locker, port", notes: "Sealed tub. Check for sliding.", partNum: "" },
    { id: 11, system: "Safety", part: "Safety Harness", qty: 1, location: "Starboard berth locker", notes: "", partNum: "" },
    { id: 12, system: "Safety", part: "Safety Tether", qty: 3, location: "Starboard berth locker", notes: "", partNum: "" },
    { id: 13, system: "Safety", part: "PFD – Inflatable", qty: 5, location: "Starboard berth locker", notes: "", partNum: "" },
    { id: 14, system: "Safety", part: "EPIRB 406 MHz (mounted)", qty: 1, location: "Galley", notes: "HEX ID: 2DDAAdb6d23fdff", partNum: "" },
    { id: 15, system: "Safety", part: "PLB Return Link", qty: 2, location: "", notes: "", partNum: "" },
    { id: 16, system: "Plumbing", part: "Hand Pump Assembly (Jabsco)", qty: 2, location: "V Berth, fwd hatch under bed", notes: "", partNum: "" },
    { id: 17, system: "Plumbing", part: "Water Pump (shower/sink)", qty: 1, location: "V Berth", notes: "", partNum: "" },
    { id: 18, system: "Tools", part: "Sail Repair Kit", qty: 1, location: "Port Settee", notes: "Assorted patches", partNum: "" },
  ],
  fuel: [],
};

const CHECKLIST_ITEMS = {
  departure: [
    "Check weather forecast",
    "Check bilge — dry before leaving",
    "Check fuel level",
    "Note engine hours & departure time",
    "Safety briefing (crew roles, MOB plan, flare location)",
    "PFDs accessible",
    "VHF on & channel 16",
    "Engine warm-up & check gauges",
    "Covers off, lines singled up",
    "Start Garmin",
    "Log departure time",
  ],
  arrival: [
    "Engine off, note engine hours",
    "Note arrival time",
    "Furl sails / secure boom",
    "Secure dock lines (bow, stern, springs)",
    "Shore power on (50 amp)",
    "Check bilge",
    "Check heads & through-hulls open",
    "Fridge/freezer on",
    "Covers on instruments",
    "Rinse cockpit & deck",
  ],
  packup: [
    "Shore power on (50 amp)",
    "Note electric meter reading",
    "Fridge/freezer off",
    "All instruments off",
    "Turn off gas at tanks",
    "Close all head through-hulls",
    "Check bilge",
    "Close all hatches & ports",
    "Covers on",
    "No wet laundry or food left out",
    "Wipe down counters & table",
    "Dock lines double-checked",
  ],
};

// Agora-specific maintenance schedule, grouped by system
const MAINTENANCE_SCHEDULE = [
  { system: "Yanmar", task: "Engine oil & filter change", interval: "Every 250 hrs or annually", notes: "SAE 30 or 15W-40. Half quart extra to account for oil in old filter. Last done Feb 2026 @ 2276 hrs. Filter P/N: 129150-35151." },
  { system: "Yanmar", task: "Fuel filter replacement (primary & secondary)", interval: "Every 250 hrs or annually", notes: "Keep spares in Salon Seat Drawer. Always replace both at once." },
  { system: "Yanmar", task: "Marine gear oil change", interval: "Every 250 hrs", notes: "Wash oil filter at same time. First change at 50 hrs." },
  { system: "Yanmar", task: "Raw water impeller replacement", interval: "Every 500 hrs or 2 years", notes: "Do not run dry — impeller relies on water for lubrication. 5 spares on hand." },
  { system: "Yanmar", task: "Coolant flush & refill", interval: "Every 500 hrs or 2 years", notes: "Use marine-grade antifreeze. Inspect hoses for softness or cracks. Last done Feb 2026." },
  { system: "Yanmar", task: "V-belt inspection & replacement", interval: "Every 500 hrs or 2 years", notes: "Check tension and cracking each season. 3 spares on hand." },
  { system: "Yanmar", task: "Air filter cleaning / replacement", interval: "Annually", notes: "Inspect for oil fouling. 4 spares in Salon Seat." },
  { system: "Yanmar", task: "Thermostat replacement", interval: "Every 3–5 years or if overheating", notes: "1 spare on hand. Cheap insurance against overheating." },
  { system: "Yanmar", task: "Turbocharger blower wash", interval: "Every 500 hrs", notes: "Pour blower wash fluid gradually into intake — never all at once. Run at high speed 2500–3000 RPM." },
  { system: "Yanmar", task: "Valve clearance & fuel injection timing", interval: "Every 1,000 hrs or 4 years", notes: "Dealer/technician service required." },
  { system: "Generator", task: "Engine oil & filter change", interval: "Every 200 hrs or annually", notes: "Takes ~1 full gallon. Sierra 23-7800 filter works. Last done Feb 2026 @ 4420 hrs." },
  { system: "Generator", task: "Zinc (anode) replacement", interval: "Every 6 months", notes: "Critical — had to chisel out Jan 2024 after waiting too long. Clean threads each time. Part #011885." },
  { system: "Generator", task: "Raw water impeller replacement", interval: "Annually", notes: "Check raw water flow before start of each season. 2 spares (Westerbeke) in V Berth." },
  { system: "Generator", task: "Fuel filter replacement", interval: "Annually or every 500 hrs", notes: "Monitor for the possible fuel leak noted Feb 2026." },
  { system: "Tohatsu", task: "Engine oil change", interval: "Every 100 hrs or annually", notes: "Oil plug gasket is a metal shim only — monitor for leaks. Correct replacement gasket still needed." },
  { system: "Tohatsu", task: "Lower unit gear oil change", interval: "Annually", notes: "" },
  { system: "Tohatsu", task: "Spark plug inspection", interval: "Annually", notes: "" },
  { system: "AC", task: "Raw water pump inspection / replacement", interval: "Every 2 years or if cooling drops", notes: "Last replaced Jan 2025. Watch for reduced cooling output as early warning." },
  { system: "AC", task: "Sea strainer cleaning", interval: "Monthly in season", notes: "Clogged strainer will kill the pump. Quick check every time you're aboard." },
  { system: "AC", task: "Foam filter cleaning", interval: "Monthly in season", notes: "Rinse in fresh water. Check boys' cabin AC as part of the duct replacement project." },
  { system: "Heads", task: "Pump rebuild (Jabsco)", interval: "Every 2–3 years", notes: "Rebuild kit is far cheaper than full pump replacement. Watch for stiff pumping as early warning." },
  { system: "Heads", task: "Macerator inspection", interval: "Annually", notes: "Last replaced both Jan 2026. Listen for grinding or unusual noise." },
  { system: "Heads", task: "Holding tank vent inspection", interval: "Annually", notes: "Blocked vent causes pressure buildup and seal failure." },
  { system: "Hull", task: "Bottom paint (ablative antifouling)", interval: "Annually at haul-out", notes: "Last done Nov 2025. Schedule fall haul-out each year." },
  { system: "Hull", task: "Through-hull & seacock exercise", interval: "Annually at haul-out", notes: "Open and close all seacocks fully. Grease any stiff ones. Seized seacocks are a serious safety issue." },
  { system: "Hull", task: "Hull zinc replacement", interval: "Annually or when 50% depleted", notes: "Check at every haul-out." },
  { system: "Rigging", task: "Standing rigging inspection", interval: "Annually", notes: "Check for broken strands, cracks at swage fittings, rust at chainplates. Anchor chain replacement is a related open project." },
  { system: "Rigging", task: "Running rigging inspection", interval: "Annually", notes: "Check halyards and sheets for chafe, especially where they run through blocks and clutches." },
  { system: "Rigging", task: "Winch service", interval: "Every 2 years", notes: "Disassemble, clean, and regrease pawls and bearings." },
  { system: "Electrical", task: "Battery bank check", interval: "Every 6 months", notes: "Check voltage, terminals, and connections. Clean any corrosion. SmartShunt installed Nov 2024 — review data for trends." },
  { system: "Electrical", task: "Shore power connection inspection", interval: "Annually", notes: "Check 50-amp connector and cord for heat damage or corrosion." },
  { system: "Safety", task: "EPIRB battery & registration check", interval: "Per manufacturer label (typically 5 years)", notes: "HEX ID: 2DDAAdb6d23fdff. Verify registration at beaconregistration.noaa.gov." },
  { system: "Safety", task: "Flare expiration check", interval: "Annually", notes: "USCG flares expire 42 months from manufacture date. Current qty: 1 set in stern locker (port)." },
  { system: "Safety", task: "Fire extinguisher inspection", interval: "Annually", notes: "Check pressure gauges, inspection tags, and mounting brackets. Fire plan is an open project." },
  { system: "Safety", task: "PFD & harness inspection", interval: "Annually", notes: "Check inflatable bladders, CO2 cylinders, and oral inflation tubes. 5 PFDs + 1 harness + 3 tethers on board." },
  { system: "Bilge", task: "Bilge pump test", interval: "Monthly", notes: "Test auto float switch and manual override. Last pump replaced Jun 2025 (Jabsco 37202-2012)." },
];

const SYSTEMS = ["Yanmar", "Generator", "Westerbeke", "Tohatsu", "AC", "Electrical", "Heads", "Bilge", "Hull", "Plumbing", "Rigging", "Safety", "Other"];
const LOCATIONS = ["Bow", "Stern", "Salon", "Galley", "Aft Head", "Fwd Head", "V Berth", "Kid Bunks", "Midship", "Universal"];
const PRIORITIES = ["High", "Med", "Low"];
const STATUSES = ["Open", "In Progress", "Done"];
// Assignee picklist — Barrett, Susanna, Both, or unassigned
const ASSIGNEES = ["", "Barrett", "Susanna", "Both"];

// ── PALETTE — dark gradient header + cream content (Sue's color circles) ──────
const SCAN_RECEIPT_URL = "https://scanfuelreceipt-qbqkp5vmrq-uc.a.run.app";

const SEA   = "#F0EAD8";   // page background — warm cream
const NAVY  = "#133d58";   // header gradient mid
const TEAL  = "#2B5CB8";   // royal blue — active sub-tabs, links, filter chips
const GOLD  = "#C8472A";   // terracotta/orange-red — primary accent
const LIGHT = "#1A2B52";   // deep navy — primary body text
const WHITE = "#FBF7F0";   // card background — off-white
const MUTED = "#7A8FA0";   // muted text — grey-blue

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${SEA}; font-family: 'Source Sans 3', sans-serif; color: ${LIGHT}; min-height: 100vh; }
  .app { max-width: 1100px; margin: 0 auto; padding: 0 0 80px; }

  .header { background: linear-gradient(135deg, #081d2b 0%, ${NAVY} 60%, #0e3a54 100%); padding: 28px 32px 0; border-bottom: 3px solid ${GOLD}; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events: none; }
  .header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; position: relative; }
  .boat-name { font-family: 'Libre Baskerville', serif; font-size: 32px; font-weight: 700; color: #F0EAD8; letter-spacing: 2px; text-transform: uppercase; }
  .boat-sub { font-size: 13px; color: #9BAAB4; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .compass { width: 48px; height: 48px; opacity: 0.85; }

  .tabs { display: flex; gap: 0; position: relative; overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { padding: 10px 20px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #9BAAB4; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; font-weight: 600; }
  .tab:hover { color: #F0EAD8; }
  .tab.active { color: ${GOLD}; border-bottom-color: ${GOLD}; }

  .content { padding: 24px 20px; }

  .card { background: ${WHITE}; border: 1px solid rgba(26,43,82,0.12); border-radius: 8px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(26,43,82,0.07); }
  .card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; }
  .card-header:hover { background: rgba(26,43,82,0.04); }
  .card-body { padding: 0 16px 16px; border-top: 1px solid rgba(26,43,82,0.08); }

  .section-title { font-family: 'Libre Baskerville', serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; margin-top: 4px; opacity: 0.95; }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; transition: all 0.15s; font-family: 'Source Sans 3', sans-serif; }
  .btn-primary { background: ${GOLD}; color: #fff; }
  .btn-primary:hover { background: #b33d23; }
  .btn-ghost { background: transparent; color: ${MUTED}; border: 1px solid rgba(26,43,82,0.22); }
  .btn-ghost:hover { color: ${LIGHT}; border-color: rgba(26,43,82,0.4); }
  .btn-danger { background: rgba(200,71,42,0.1); color: #b33d23; border: 1px solid rgba(200,71,42,0.3); }
  .btn-danger:hover { background: rgba(200,71,42,0.2); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  /* Badges */
  .badge { display: inline-block; padding: 3px 9px; border-radius: 3px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge-high     { background: rgba(200,71,42,0.12);  color: #b33d23; border: 1px solid rgba(200,71,42,0.3); }
  .badge-med      { background: rgba(43,92,184,0.12);  color: #2B5CB8; border: 1px solid rgba(43,92,184,0.3); }
  .badge-low      { background: rgba(122,143,160,0.15); color: #4a6070; border: 1px solid rgba(122,143,160,0.3); }
  .badge-open     { background: rgba(43,92,184,0.1);   color: #2B5CB8; border: 1px solid rgba(43,92,184,0.25); cursor:pointer; }
  .badge-progress { background: rgba(200,71,42,0.1);   color: #b33d23; border: 1px solid rgba(200,71,42,0.28); cursor:pointer; }
  .badge-done     { background: rgba(40,160,80,0.12);  color: #1e7a3c; border: 1px solid rgba(40,160,80,0.28); cursor:pointer; }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media (max-width: 600px) { .grid2, .grid3 { grid-template-columns: 1fr; } .boat-name { font-size: 22px; } }

  .field { margin-bottom: 12px; }
  .field label { display: block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED}; margin-bottom: 5px; }
  .field input, .field select, .field textarea { width: 100%; background: #fff; border: 1px solid rgba(26,43,82,0.2); border-radius: 4px; padding: 8px 10px; color: ${LIGHT}; font-size: 14px; font-family: 'Source Sans 3', sans-serif; transition: border-color 0.15s; }
  .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: ${TEAL}; }
  .field textarea { resize: vertical; min-height: 70px; }
  .field select option { background: #fff; }

  .meta { font-size: 12px; color: ${MUTED}; }
  .meta strong { color: ${LIGHT}; }

  .divider { border: none; border-top: 1px solid rgba(26,43,82,0.1); margin: 16px 0; }

  .action-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
  .filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-chip { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; border: 1px solid rgba(26,43,82,0.2); color: ${MUTED}; cursor: pointer; background: transparent; transition: all 0.15s; }
  .filter-chip:hover { color: ${LIGHT}; border-color: rgba(26,43,82,0.4); }
  .filter-chip.active { background: ${TEAL}; color: #fff; border-color: ${TEAL}; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(10,25,40,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #fff; border: 1px solid rgba(26,43,82,0.15); border-radius: 10px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
  .modal-wide { max-width: 740px; }
  .modal-header { padding: 20px 24px 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-title { font-family: 'Libre Baskerville', serif; font-size: 18px; color: ${GOLD}; }
  .modal-body { padding: 0 24px 24px; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  /* Delete zone */
  .delete-zone { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(200,71,42,0.2); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .delete-zone-label { font-size: 12px; color: rgba(200,71,42,0.7); }

  /* Schedule panel */
  .schedule-sys-heading { font-family: 'Libre Baskerville', serif; font-size: 13px; color: ${GOLD}; letter-spacing: 1px; text-transform: uppercase; margin: 18px 0 8px; padding-bottom: 5px; border-bottom: 1px solid rgba(200,71,42,0.2); }
  .schedule-row { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(26,43,82,0.07); }
  .schedule-row:last-child { border-bottom: none; }
  .schedule-task { flex: 1; font-size: 13px; color: ${LIGHT}; font-weight: 600; }
  .schedule-interval { font-size: 12px; color: ${TEAL}; white-space: nowrap; }
  .schedule-notes { font-size: 12px; color: ${MUTED}; margin-top: 2px; }

  .checklist-col { flex: 1; min-width: 200px; }
  .checklist-cols { display: flex; gap: 20px; flex-wrap: wrap; }
  .check-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(26,43,82,0.07); cursor: pointer; }
  .check-item:hover { background: rgba(26,43,82,0.03); }
  .check-box { width: 20px; height: 20px; border: 2px solid rgba(26,43,82,0.22); border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .check-box.checked { background: ${TEAL}; border-color: ${TEAL}; }
  .check-label { font-size: 14px; transition: all 0.15s; }
  .check-label.checked { color: ${MUTED}; text-decoration: line-through; }
  .checklist-title { font-family: 'Libre Baskerville', serif; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 12px; }
  .progress-bar { height: 3px; background: rgba(26,43,82,0.1); border-radius: 2px; margin-bottom: 14px; }
  .progress-fill { height: 100%; border-radius: 2px; background: ${TEAL}; transition: width 0.3s; }

  .sub-tabs { display: flex; gap: 0; margin-bottom: 16px; border-bottom: 1px solid rgba(26,43,82,0.12); }
  .sub-tab { padding: 6px 16px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED}; cursor: pointer; border: none; background: transparent; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; font-family: 'Source Sans 3', sans-serif; }
  .sub-tab:hover { color: ${LIGHT}; }
  .sub-tab.active { color: ${TEAL}; border-bottom-color: ${TEAL}; }

  .fuel-stats { display: flex; gap: 16px; padding: 12px 16px; background: rgba(26,43,82,0.05); border-radius: 8px; margin-bottom: 16px; flex-wrap: wrap; border: 1px solid rgba(26,43,82,0.08); }
  .fuel-stat { flex: 1; min-width: 120px; }

  .empty-state { text-align: center; padding: 40px; color: ${MUTED}; font-size: 14px; }
  .row-label { font-size: 12px; color: ${MUTED}; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .row-val { font-size: 14px; color: ${LIGHT}; }

  /* ── Chat bubble ─────────────────────────────────────────────────────────── */
  .chat-bubble { position: fixed; bottom: 24px; right: 24px; z-index: 90; }
  .chat-toggle { width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #081d2b 0%, ${NAVY} 100%); border: 2px solid ${GOLD}; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(19,61,88,0.4); transition: transform 0.2s; }
  .chat-toggle:hover { transform: scale(1.07); }
  .chat-panel { position: fixed; bottom: 92px; right: 24px; width: 360px; max-width: calc(100vw - 32px); height: 520px; max-height: calc(100vh - 120px); background: ${WHITE}; border: 1px solid rgba(26,43,82,0.15); border-radius: 12px; box-shadow: 0 8px 36px rgba(19,61,88,0.28); display: flex; flex-direction: column; z-index: 90; overflow: hidden; }
  .chat-panel-header { background: linear-gradient(135deg, #081d2b 0%, ${NAVY} 100%); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${GOLD}; flex-shrink: 0; }
  .chat-panel-title { color: #F0EAD8; font-family: 'Libre Baskerville', serif; font-size: 15px; letter-spacing: 1px; }
  .chat-panel-sub { color: #9BAAB4; font-size: 11px; letter-spacing: 0.5px; margin-top: 2px; }
  .chat-close-btn { background: transparent; border: none; color: #9BAAB4; cursor: pointer; font-size: 18px; line-height: 1; padding: 2px 4px; }
  .chat-close-btn:hover { color: #F0EAD8; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 12px; }
  .chat-msg { max-width: 86%; padding: 10px 13px; border-radius: 10px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
  .chat-msg.user { background: ${NAVY}; color: #F0EAD8; align-self: flex-end; border-bottom-right-radius: 3px; }
  .chat-msg.bot { background: rgba(26,43,82,0.07); color: ${LIGHT}; align-self: flex-start; border-bottom-left-radius: 3px; border: 1px solid rgba(26,43,82,0.1); }
  .chat-msg.typing { color: ${MUTED}; font-style: italic; }
  .chat-input-row { padding: 12px 14px; border-top: 1px solid rgba(26,43,82,0.1); display: flex; gap: 8px; flex-shrink: 0; background: ${WHITE}; }
  .chat-text-input { flex: 1; border: 1px solid rgba(26,43,82,0.2); border-radius: 6px; padding: 8px 11px; font-size: 14px; font-family: 'Source Sans 3', sans-serif; color: ${LIGHT}; background: #fff; }
  .chat-text-input:focus { outline: none; border-color: ${TEAL}; }
  .chat-send-btn { padding: 8px 14px; background: ${GOLD}; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Source Sans 3', sans-serif; white-space: nowrap; }
  .chat-send-btn:hover { background: #b33d23; }
  .chat-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  @media (max-width: 480px) { .chat-panel { right: 0; bottom: 76px; width: 100vw; max-width: 100vw; border-radius: 14px 14px 0 0; height: 72vh; } .chat-bubble { bottom: 16px; right: 16px; } }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Modal({ title, onClose, wide, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${wide ? " modal-wide" : ""}`}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

// ─── MAINTENANCE SCHEDULE HELPERS ─────────────────────────────────────────────
function parseIntervalDays(interval) {
  const s = interval.toLowerCase();
  if (s.includes('monthly')) return 30;
  if (s.includes('6 month')) return 180;
  if (/annually|annual|1 year/.test(s)) return 365;
  if (/2.year/.test(s)) return 730;
  if (/3.year/.test(s)) return 1095;
  if (/5.year/.test(s)) return 1825;
  return null;
}

function parseIntervalHrs(interval) {
  const m = interval.match(/(\d+)\s*hrs?/i);
  return m ? parseInt(m[1]) : null;
}

function findLastDone(row, maintenanceData) {
  const systemMatches = maintenanceData.filter(m => m.system === row.system && m.date);
  if (!systemMatches.length) return null;
  const stop = new Set(['and','the','or','if','with','from','each','season','annually','spring','haul','out','check','when','replace','inspection','every']);
  const taskWords = row.task.toLowerCase().split(/[\s\/&,\-–()]+/).filter(w => w.length > 3 && !stop.has(w));
  const scored = systemMatches.map(m => {
    const haystack = `${m.equipment} ${m.action} ${m.notes}`.toLowerCase();
    const score = taskWords.filter(w => haystack.includes(w)).length;
    return { entry: m, score };
  });
  scored.sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date));
  return scored[0]?.entry || null;
}

function getMaintenanceStatus(row, lastDone, currentEngHrs) {
  if (!lastDone) return null;
  const intervalDays = parseIntervalDays(row.interval);
  const intervalHrs = parseIntervalHrs(row.interval);
  const daysSince = Math.floor((Date.now() - new Date(lastDone.date + 'T12:00:00')) / 86400000);
  let overdue = false, dueSoon = false;
  if (intervalDays) {
    if (daysSince > intervalDays) overdue = true;
    else if (daysSince > intervalDays - 60) dueSoon = true;
  }
  if (intervalHrs && currentEngHrs && lastDone.engHrs) {
    const hrsSince = currentEngHrs - parseFloat(lastDone.engHrs);
    if (hrsSince > intervalHrs) overdue = true;
    else if (hrsSince > intervalHrs - 50) dueSoon = true;
  }
  if (overdue) return 'overdue';
  if (dueSoon) return 'due-soon';
  return 'ok';
}

// ─── MAINTENANCE SCHEDULE MODAL ───────────────────────────────────────────────
function ScheduleModal({ onClose, maintenanceData }) {
  const [filterSys, setFilterSys] = useState("All");
  const systems = ["All", ...Array.from(new Set(MAINTENANCE_SCHEDULE.map(r => r.system)))];
  const filtered = MAINTENANCE_SCHEDULE.filter(r => filterSys === "All" || r.system === filterSys);

  const currentYanmarHrs = Math.max(0, ...maintenanceData.filter(m => m.system === "Yanmar" && m.engHrs).map(m => parseFloat(m.engHrs)));
  const currentGenHrs = Math.max(0, ...maintenanceData.filter(m => m.system === "Generator" && m.engHrs).map(m => parseFloat(m.engHrs)));

  const grouped = filtered.reduce((acc, row) => {
    if (!acc[row.system]) acc[row.system] = [];
    acc[row.system].push(row);
    return acc;
  }, {});

  return (
    <Modal title="Maintenance Schedule — S/V Agora" onClose={onClose} wide>
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {systems.map(s => (
          <button key={s} className={`filter-chip ${filterSys === s ? "active" : ""}`} onClick={() => setFilterSys(s)}>{s}</button>
        ))}
      </div>
      {Object.entries(grouped).map(([sys, rows]) => (
        <div key={sys}>
          <div className="schedule-sys-heading">{sys}</div>
          {rows.map((row, i) => {
            const lastDone = findLastDone(row, maintenanceData);
            const currentHrs = row.system === "Yanmar" ? currentYanmarHrs : row.system === "Generator" ? currentGenHrs : null;
            const status = getMaintenanceStatus(row, lastDone, currentHrs);
            return (
              <div key={i} className="schedule-row">
                <div style={{ flex: 1 }}>
                  <div className="schedule-task">{row.task}</div>
                  {row.notes && <div className="schedule-notes">{row.notes}</div>}
                  {lastDone && (
                    <div className="schedule-notes" style={{ marginTop: 4, color: MUTED }}>
                      Last done: {new Date(lastDone.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {lastDone.engHrs ? ` @ ${lastDone.engHrs} hrs` : ''}
                    </div>
                  )}
                  {!lastDone && <div className="schedule-notes" style={{ marginTop: 4, color: MUTED, fontStyle: 'italic' }}>No record found</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
                  <div className="schedule-interval">{row.interval}</div>
                  {status === 'overdue' && <span className="badge badge-high" style={{ fontSize: 10, marginTop: 5, display: 'inline-block' }}>OVERDUE</span>}
                  {status === 'due-soon' && <span className="badge badge-med" style={{ fontSize: 10, marginTop: 5, display: 'inline-block' }}>DUE SOON</span>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

// ─── VOYAGE LOG ───────────────────────────────────────────────────────────────
function VoyageLog({ data, setData }) {
  const [subTab, setSubTab] = useState(0);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ date: new Date().toISOString().slice(0, 10) }); setModal("new"); setConfirmDelete(false); };
  const openEdit = (v) => { setForm({ ...v }); setModal("edit"); setConfirmDelete(false); };

  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(v => v.id === form.id ? form : v));
    setModal(null);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const del = (id) => { setData(data.filter(v => v.id !== id)); setModal(null); };
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="sub-tabs">
        <button className={`sub-tab ${subTab === 0 ? "active" : ""}`} onClick={() => setSubTab(0)}>Log</button>
        <button className={`sub-tab ${subTab === 1 ? "active" : ""}`} onClick={() => setSubTab(1)}>Checklists</button>
      </div>
      {subTab === 1 && <Checklists />}
      {subTab === 0 && <div>
      <div className="action-bar">
        <div className="section-title" style={{ margin: 0 }}>Voyage Log</div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Log Voyage</button>
      </div>
      {sorted.length === 0 && <div className="empty-state">No voyages logged yet.</div>}
      {sorted.map(v => (
        <div className="card" key={v.id}>
          <div className="card-header" onClick={() => openEdit(v)}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: LIGHT }}>{new Date(v.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{v.destination && <span style={{ fontWeight: 400, color: TEAL }}> — {v.destination}</span>}</div>
              <div className="meta">{v.crew && <><strong>{v.crew}</strong> · </>}{v.distance && <>{v.distance} nm · </>}{v.wind && <>Wind {v.wind} kts</>}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {v.weather && <span className="badge badge-low">{v.weather}</span>}
            </div>
          </div>
          {v.notes && <div className="card-body"><div className="meta">{v.notes}</div></div>}
        </div>
      ))}
      {modal && (
        <Modal title={modal === "new" ? "Log Voyage" : "Edit Voyage"} onClose={() => setModal(null)}>
          <div className="grid2">
            <Field label="Date"><input type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Crew"><input value={form.crew || ""} onChange={e => setForm({ ...form, crew: e.target.value })} placeholder="Who was aboard?" /></Field>
          </div>
          <Field label="Destination / Anchorage"><input value={form.destination || ""} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Redfish Island, Offats Bayou" /></Field>
          <div className="grid3">
            <Field label="Engine Hrs"><input value={form.engHrs || ""} onChange={e => setForm({ ...form, engHrs: e.target.value })} placeholder="e.g. 2280" /></Field>
            <Field label="Gen Hrs End"><input value={form.genHrs || ""} onChange={e => setForm({ ...form, genHrs: e.target.value })} /></Field>
            <Field label="Distance (nm)"><input value={form.distance || ""} onChange={e => setForm({ ...form, distance: e.target.value })} /></Field>
          </div>
          <div className="grid2">
            <Field label="Depart"><input value={form.depart || ""} onChange={e => setForm({ ...form, depart: e.target.value })} placeholder="e.g. 09:00" /></Field>
            <Field label="Arrive"><input value={form.arrive || ""} onChange={e => setForm({ ...form, arrive: e.target.value })} placeholder="e.g. 14:30" /></Field>
          </div>
          <div className="grid2">
            <Field label="Wind (kts)"><input value={form.wind || ""} onChange={e => setForm({ ...form, wind: e.target.value })} placeholder="e.g. 10-15" /></Field>
            <Field label="Weather"><input value={form.weather || ""} onChange={e => setForm({ ...form, weather: e.target.value })} placeholder="e.g. Clear/Sunny" /></Field>
          </div>
          <Field label="Notes"><textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Anything notable about the trip..." /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
          {modal === "edit" && (
            <div className="delete-zone">
              <span className="delete-zone-label">Permanent — cannot be undone</span>
              {!confirmDelete
                ? <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>Delete Voyage</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep It</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(form.id)}>Yes, Delete</button>
                  </div>
              }
            </div>
          )}
        </Modal>
      )}
      </div>}
    </div>
  );
}

// ─── MAINTENANCE ──────────────────────────────────────────────────────────────
function Maintenance({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterSys, setFilterSys] = useState("All");
  const [showSchedule, setShowSchedule] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openNew = () => { setForm({ date: new Date().toISOString().slice(0, 10) }); setModal("new"); setConfirmDelete(false); };
  const openEdit = (m) => { setForm({ ...m }); setModal("edit"); setConfirmDelete(false); };
  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(m => m.id === form.id ? form : m));
    setModal(null);
  };
  const del = (id) => { setData(data.filter(m => m.id !== id)); setModal(null); };

  const systems = ["All", ...Array.from(new Set(data.map(m => m.system))).sort()];
  const filtered = [...data].filter(m => filterSys === "All" || m.system === filterSys).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{ margin: 0 }}>Maintenance Log</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSchedule(true)}>Schedule</button>
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ Log Service</button>
        </div>
      </div>
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {systems.map(s => <button key={s} className={`filter-chip ${filterSys === s ? "active" : ""}`} onClick={() => setFilterSys(s)}>{s}</button>)}
      </div>
      {filtered.map(m => (
        <div className="card" key={m.id}>
          <div className="card-header" onClick={() => openEdit(m)}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: LIGHT }}>{m.system} — {m.equipment}</div>
              <div className="meta">{new Date(m.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {m.action}{m.crew && <> · <strong>{m.crew}</strong></>}{m.engHrs && <> · {m.engHrs} hrs</>}</div>
            </div>
          </div>
          {(m.notes || m.partLink) && <div className="card-body">
            {m.notes && <div className="meta" style={{ marginBottom: m.partLink ? 6 : 0 }}>{m.notes}</div>}
            {m.partLink && <div className="meta">
              {m.partLink.startsWith("http")
                ? <a href={m.partLink} target="_blank" rel="noreferrer" style={{ color: TEAL }}>🔗 {m.partLink}</a>
                : <>🔗 {m.partLink}</>}
            </div>}
          </div>}
        </div>
      ))}
      {modal && (
        <Modal title={modal === "new" ? "Log Service" : "Edit Service"} onClose={() => setModal(null)}>
          <div className="grid2">
            <Field label="Date"><input type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Engine Hours"><input value={form.engHrs || ""} onChange={e => setForm({ ...form, engHrs: e.target.value })} placeholder="e.g. 2280" /></Field>
          </div>
          <div className="grid2">
            <Field label="System"><select value={form.system || ""} onChange={e => setForm({ ...form, system: e.target.value })}>
              <option value="">Select...</option>
              {SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select></Field>
            <Field label="Equipment"><input value={form.equipment || ""} onChange={e => setForm({ ...form, equipment: e.target.value })} placeholder="e.g. Oil Filter" /></Field>
          </div>
          <div className="grid2">
            <Field label="Action"><input value={form.action || ""} onChange={e => setForm({ ...form, action: e.target.value })} placeholder="e.g. Oil change" /></Field>
            <Field label="Done By"><input value={form.crew || ""} onChange={e => setForm({ ...form, crew: e.target.value })} placeholder="e.g. Barrett" /></Field>
          </div>
          <Field label="Notes"><textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <Field label="Part # / Link"><input value={form.partLink || ""} onChange={e => setForm({ ...form, partLink: e.target.value })} /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
          {modal === "edit" && (
            <div className="delete-zone">
              <span className="delete-zone-label">Permanent — cannot be undone</span>
              {!confirmDelete
                ? <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>Delete Record</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep It</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(form.id)}>Yes, Delete</button>
                  </div>
              }
            </div>
          )}
        </Modal>
      )}
      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} maintenanceData={data} />}
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterPri, setFilterPri] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Open");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openNew = () => { setForm({ priority: "Med", status: "Open", who: "" }); setModal("new"); setConfirmDelete(false); };
  const openEdit = (p) => { setForm({ ...p }); setModal("edit"); setConfirmDelete(false); };
  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(p => p.id === form.id ? form : p));
    setModal(null);
  };
  const del = (id) => { setData(data.filter(p => p.id !== id)); setModal(null); };

  // Status cycling stays on the card for quick updates
  const cycle = (p) => {
    const s = { Open: "In Progress", "In Progress": "Done", Done: "Open" };
    setData(data.map(x => x.id === p.id ? { ...x, status: s[x.status] } : x));
  };

  const filtered = data
    .filter(p => (filterPri === "All" || p.priority === filterPri) && (filterStatus === "All" || p.status === filterStatus))
    .sort((a, b) => {
      const pri = { High: 0, Med: 1, Low: 2 };
      return (pri[a.priority] ?? 2) - (pri[b.priority] ?? 2);
    });

  const openCount = data.filter(p => p.status !== "Done").length;

  return (
    <div>
      <div className="action-bar">
        <div>
          <div className="section-title" style={{ margin: 0 }}>Projects & Tasks</div>
          <div className="meta" style={{ marginTop: 2 }}>{openCount} open item{openCount !== 1 ? "s" : ""}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Task</button>
      </div>
      <div className="filter-row" style={{ marginBottom: 8 }}>
        {["All", "Open", "In Progress", "Done"].map(s => (
          <button key={s} className={`filter-chip ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {["All", ...PRIORITIES].map(p => (
          <button key={p} className={`filter-chip ${filterPri === p ? "active" : ""}`} onClick={() => setFilterPri(p)}>{p}</button>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty-state">No tasks match this filter.</div>}
      {filtered.map(p => (
        <div className="card" key={p.id}>
          {/* Clicking the text area opens the edit modal; NO delete X on the card */}
          <div className="card-header">
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => openEdit(p)}>
              <div style={{ fontSize: 14, fontWeight: 600, color: LIGHT, marginBottom: 3 }}>{p.task}</div>
              <div className="meta">
                {p.location}
                {p.who && <> · <strong>{p.who}</strong></>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span className={`badge badge-${p.priority?.toLowerCase() || 'low'}`}>{p.priority}</span>
              {/* Tapping the status badge cycles it — no need to open the modal */}
              <button
                onClick={() => cycle(p)}
                className={`badge badge-${p.status === "Open" ? "open" : p.status === "In Progress" ? "progress" : "done"}`}
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
              >
                {p.status}
              </button>
            </div>
          </div>
          {p.notes && <div className="card-body"><div className="meta">{p.notes}</div></div>}
        </div>
      ))}

      {/* Edit / New modal — delete only available here, with confirmation */}
      {modal && (
        <Modal title={modal === "new" ? "Add Task" : "Edit Task"} onClose={() => setModal(null)}>
          <Field label="Task">
            <input value={form.task || ""} onChange={e => setForm({ ...form, task: e.target.value })} placeholder="What needs doing?" />
          </Field>
          <div className="grid2">
            <Field label="Location">
              <select value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })}>
                <option value="">Select...</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            {/* Assignee picklist — Barrett, Susanna, Both */}
            <Field label="Assigned To">
              <select value={form.who || ""} onChange={e => setForm({ ...form, who: e.target.value })}>
                {ASSIGNEES.map(a => <option key={a} value={a}>{a || "Unassigned"}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid2">
            <Field label="Priority">
              <select value={form.priority || "Med"} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status || "Open"} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
          {/* Delete — only in edit mode, with a confirm step */}
          {modal === "edit" && (
            <div className="delete-zone">
              <span className="delete-zone-label">Permanent — cannot be undone</span>
              {!confirmDelete
                ? <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>Delete Task</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep It</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(form.id)}>Yes, Delete</button>
                  </div>
              }
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── SPARE PARTS ──────────────────────────────────────────────────────────────
function SpareParts({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterSys, setFilterSys] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openNew = () => { setForm({}); setModal("new"); setConfirmDelete(false); };
  const openEdit = (p) => { setForm({ ...p }); setModal("edit"); setConfirmDelete(false); };
  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(p => p.id === form.id ? form : p));
    setModal(null);
  };
  const del = (id) => { setData(data.filter(p => p.id !== id)); setModal(null); };
  const systems = ["All", ...Array.from(new Set(data.map(p => p.system))).sort()];
  const filtered = data.filter(p => filterSys === "All" || p.system === filterSys).sort((a, b) => a.system.localeCompare(b.system));

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{ margin: 0 }}>Spare Parts</div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Part</button>
      </div>
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {systems.map(s => <button key={s} className={`filter-chip ${filterSys === s ? "active" : ""}`} onClick={() => setFilterSys(s)}>{s}</button>)}
      </div>
      {filtered.map(p => (
        <div className="card" key={p.id}>
          <div className="card-header" onClick={() => openEdit(p)} style={{ cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: LIGHT }}>{p.part}</div>
              <div className="meta">{p.system}{p.location && <> · {p.location}</>}{p.partNum && <> · #{p.partNum}</>}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: p.qty <= 1 ? '#ff8080' : GOLD }}>{p.qty ?? '—'}</span>
            </div>
          </div>
          {p.notes && <div className="card-body"><div className="meta">{p.notes}</div></div>}
        </div>
      ))}
      {modal && (
        <Modal title={modal === "new" ? "Add Part" : "Edit Part"} onClose={() => setModal(null)}>
          <div className="grid2">
            <Field label="System"><select value={form.system || ""} onChange={e => setForm({ ...form, system: e.target.value })}>
              <option value="">Select...</option>
              {SYSTEMS.map(s => <option key={s}>{s}</option>)}
            </select></Field>
            <Field label="Part Name"><input value={form.part || ""} onChange={e => setForm({ ...form, part: e.target.value })} /></Field>
          </div>
          <div className="grid2">
            <Field label="Qty on Hand"><input type="number" value={form.qty ?? ""} onChange={e => setForm({ ...form, qty: parseInt(e.target.value) || null })} /></Field>
            <Field label="Location"><input value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Salon Seat Drawer" /></Field>
          </div>
          <Field label="Part # / Link"><input value={form.partNum || ""} onChange={e => setForm({ ...form, partNum: e.target.value })} /></Field>
          <Field label="Notes"><textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
          {modal === "edit" && (
            <div className="delete-zone">
              <span className="delete-zone-label">Permanent — cannot be undone</span>
              {!confirmDelete
                ? <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>Delete Part</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep It</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(form.id)}>Yes, Delete</button>
                  </div>
              }
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── FUEL LOG ─────────────────────────────────────────────────────────────────
function FuelLog({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);

  const openNew = () => { setForm({ date: new Date().toISOString().slice(0, 10) }); setModal("new"); setConfirmDelete(false); };

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setModal("new");
    setConfirmDelete(false);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(SCAN_RECEIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type }),
      });
      if (!res.ok) throw new Error("Scan failed");
      const d = await res.json();
      setForm({
        date:             d.date                   || new Date().toISOString().slice(0, 10),
        location:         d.location               || "",
        dieselGal:        d.diesel_gal             != null ? String(d.diesel_gal)             : "",
        dieselSubtotal:   d.diesel_subtotal        != null ? String(d.diesel_subtotal)        : "",
        dieselTaxesFees:  d.diesel_taxes_and_fees  != null ? String(d.diesel_taxes_and_fees)  : "",
        dieselTotal:      d.diesel_total           != null ? String(d.diesel_total)           : "",
        gasGal:           d.gas_gal                != null ? String(d.gas_gal)                : "",
        gasSubtotal:      d.gas_subtotal           != null ? String(d.gas_subtotal)           : "",
        gasTaxesFees:     d.gas_taxes_and_fees     != null ? String(d.gas_taxes_and_fees)     : "",
        gasTotal:         d.gas_total              != null ? String(d.gas_total)              : "",
        notes:            d.notes                  || "",
      });
    } catch {
      setForm({ date: new Date().toISOString().slice(0, 10) });
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  };
  const openEdit = (f) => { setForm({ ...f }); setModal("edit"); setConfirmDelete(false); };

  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(f => f.id === form.id ? form : f));
    setModal(null);
  };

  const del = (id) => { setData(data.filter(f => f.id !== id)); setModal(null); };
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

  const thisYear = new Date().getFullYear().toString();
  const ytd = data.filter(f => f.date?.startsWith(thisYear));
  const ytdDieselGal  = ytd.reduce((s, f) => s + (parseFloat(f.dieselGal)  || 0), 0);
  const ytdDieselCost = ytd.reduce((s, f) => s + (parseFloat(f.dieselTotal) || 0), 0);
  const ytdGasGal     = ytd.reduce((s, f) => s + (parseFloat(f.gasGal)     || 0), 0);
  const ytdGasCost    = ytd.reduce((s, f) => s + (parseFloat(f.gasTotal)   || 0), 0);

  const dieselPPG = (parseFloat(form.dieselGal) && parseFloat(form.dieselTotal))
    ? (parseFloat(form.dieselTotal) / parseFloat(form.dieselGal)).toFixed(3) : "";
  const gasPPG    = (parseFloat(form.gasGal)    && parseFloat(form.gasTotal))
    ? (parseFloat(form.gasTotal)    / parseFloat(form.gasGal)).toFixed(3)    : "";

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{ margin: 0 }}>Fuel Log</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} disabled={scanning}>
            {scanning ? "Scanning…" : "📷 Scan Receipt"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ Log Fill-Up</button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleScan} />
      {(ytdDieselGal > 0 || ytdGasGal > 0) && (
        <div className="fuel-stats">
          {ytdDieselGal > 0 && (
            <div className="fuel-stat">
              <div className="row-label">{thisYear} Diesel</div>
              <div className="row-val">{ytdDieselGal.toFixed(1)} gal {ytdDieselCost > 0 && <span style={{ color: MUTED }}>/ ${ytdDieselCost.toFixed(2)}</span>}</div>
            </div>
          )}
          {ytdGasGal > 0 && (
            <div className="fuel-stat">
              <div className="row-label">{thisYear} Gas</div>
              <div className="row-val">{ytdGasGal.toFixed(1)} gal {ytdGasCost > 0 && <span style={{ color: MUTED }}>/ ${ytdGasCost.toFixed(2)}</span>}</div>
            </div>
          )}
        </div>
      )}
      {sorted.length === 0 && <div className="empty-state">No fuel entries yet.</div>}
      {sorted.map(f => {
        const dTotal = parseFloat(f.dieselTotal) || 0;
        const gTotal = parseFloat(f.gasTotal)    || 0;
        return (
          <div className="card" key={f.id} onClick={() => openEdit(f)} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: LIGHT }}>
                  {new Date(f.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {f.location && <span style={{ fontWeight: 400, color: TEAL }}> — {f.location}</span>}
                </div>
                <div className="meta">
                  {f.dieselGal && <>{f.dieselGal} gal diesel{dTotal > 0 ? ` · $${dTotal.toFixed(2)}` : ''}</>}
                  {f.dieselGal && f.gasGal && <> · </>}
                  {f.gasGal && <>{f.gasGal} gal gas{gTotal > 0 ? ` · $${gTotal.toFixed(2)}` : ''}</>}
                </div>
              </div>
              {(dTotal + gTotal) > 0 && (
                <div style={{ fontSize: 15, fontWeight: 600, color: GOLD, flexShrink: 0 }}>
                  ${(dTotal + gTotal).toFixed(2)}
                </div>
              )}
            </div>
            {f.notes && <div className="card-body"><div className="meta">{f.notes}</div></div>}
          </div>
        );
      })}
      {modal && (
        <Modal title={modal === "new" ? "Log Fill-Up" : "Edit Fill-Up"} onClose={() => setModal(null)}>
          {scanning && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: 14 }}>
              Reading receipt…
            </div>
          )}
          {!scanning && <>
            <div className="grid2">
              <Field label="Date"><input type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
              <Field label="Fuel Stop"><input value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Galveston Yacht Basin" /></Field>
            </div>
            <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 8, marginTop: 4 }}>Diesel</div>
            <div className="grid3">
              <Field label="Gallons"><input type="number" step="0.1" value={form.dieselGal || ""} onChange={e => setForm({ ...form, dieselGal: e.target.value })} placeholder="0.0" /></Field>
              <Field label="Subtotal $"><input type="number" step="0.01" value={form.dieselSubtotal || ""} onChange={e => setForm({ ...form, dieselSubtotal: e.target.value })} placeholder="0.00" /></Field>
              <Field label="Taxes & Fees $"><input type="number" step="0.01" value={form.dieselTaxesFees || ""} onChange={e => setForm({ ...form, dieselTaxesFees: e.target.value })} placeholder="0.00" /></Field>
            </div>
            <div className="grid3">
              <Field label="Total $"><input type="number" step="0.01" value={form.dieselTotal || ""} onChange={e => setForm({ ...form, dieselTotal: e.target.value })} placeholder="0.00" /></Field>
              <Field label="$ / Gal"><input readOnly value={dieselPPG ? `$${dieselPPG}` : ""} style={{ color: MUTED }} /></Field>
              <div />
            </div>
            <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: MUTED, marginBottom: 8, marginTop: 4 }}>Gas (Dinghy)</div>
            <div className="grid3">
              <Field label="Gallons"><input type="number" step="0.1" value={form.gasGal || ""} onChange={e => setForm({ ...form, gasGal: e.target.value })} placeholder="0.0" /></Field>
              <Field label="Subtotal $"><input type="number" step="0.01" value={form.gasSubtotal || ""} onChange={e => setForm({ ...form, gasSubtotal: e.target.value })} placeholder="0.00" /></Field>
              <Field label="Taxes & Fees $"><input type="number" step="0.01" value={form.gasTaxesFees || ""} onChange={e => setForm({ ...form, gasTaxesFees: e.target.value })} placeholder="0.00" /></Field>
            </div>
            <div className="grid3">
              <Field label="Total $"><input type="number" step="0.01" value={form.gasTotal || ""} onChange={e => setForm({ ...form, gasTotal: e.target.value })} placeholder="0.00" /></Field>
              <Field label="$ / Gal"><input readOnly value={gasPPG ? `$${gasPPG}` : ""} style={{ color: MUTED }} /></Field>
              <div />
            </div>
            <Field label="Notes"><textarea value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this fill-up..." /></Field>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
            {modal === "edit" && (
              <div className="delete-zone">
                <span className="delete-zone-label">Permanent — cannot be undone</span>
                {!confirmDelete
                  ? <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>Delete Entry</button>
                  : <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep It</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(form.id)}>Yes, Delete</button>
                    </div>
                }
              </div>
            )}
          </>}
        </Modal>
      )}
    </div>
  );
}

// ─── CHECKLISTS ───────────────────────────────────────────────────────────────
function Checklists() {
  const [checks, setChecks] = useState({ departure: {}, arrival: {}, packup: {} });
  const toggle = (list, i) => setChecks(c => ({ ...c, [list]: { ...c[list], [i]: !c[list][i] } }));
  const reset = (list) => setChecks(c => ({ ...c, [list]: {} }));

  const CheckList = ({ id, title, items }) => {
    const done = items.filter((_, i) => checks[id][i]).length;
    return (
      <div className="checklist-col">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="checklist-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => reset(id)}>Reset</button>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(done / items.length) * 100}%` }} /></div>
        <div className="meta" style={{ marginBottom: 10 }}>{done} / {items.length} complete</div>
        {items.map((item, i) => (
          <div key={i} className="check-item" onClick={() => toggle(id, i)}>
            <div className={`check-box ${checks[id][i] ? "checked" : ""}`}>{checks[id][i] && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}</div>
            <div className={`check-label ${checks[id][i] ? "checked" : ""}`}>{item}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="section-title">Operational Checklists</div>
      <div className="checklist-cols">
        <CheckList id="departure" title="Departure" items={CHECKLIST_ITEMS.departure} />
        <CheckList id="arrival" title="Arrival" items={CHECKLIST_ITEMS.arrival} />
        <CheckList id="packup" title="Pack Up" items={CHECKLIST_ITEMS.packup} />
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
// ─── CHAT ASSISTANT ───────────────────────────────────────────────────────────
const CHAT_URL = "https://chatwithagora-qbqkp5vmrq-uc.a.run.app";

function ChatBot({ data }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    if (messages.length >= 50) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20), appData: data }),
      });
      if (!res.ok) throw new Error("server error");
      const json = await res.json();
      setMessages(m => [...m, { role: "assistant", content: json.reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, I couldn't connect right now. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="chat-bubble">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div>
              <div className="chat-panel-title">Agora Assistant</div>
              <div className="chat-panel-sub">Systems · Maintenance · Passages</div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            <div className="chat-msg bot">
              Hi! Ask me anything about Agora's systems, maintenance, parts, or passage planning.
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "bot"}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="chat-msg bot typing">Thinking…</div>}
            <div ref={bottomRef} />
          </div>
          {messages.length >= 50 && (
            <div style={{ padding: "8px 14px", fontSize: 12, color: MUTED, textAlign: "center", borderTop: `1px solid rgba(26,43,82,0.1)` }}>
              Session limit reached — refresh to start a new conversation.
            </div>
          )}
          <div className="chat-input-row">
            <input
              className="chat-text-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about systems, parts, passages…"
              disabled={loading || messages.length >= 50}
            />
            <button className="chat-send-btn" onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={() => setOpen(o => !o)} title="Agora Assistant">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0EAD8" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#F0EAD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    const dataRef = ref(db, "agora");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
      else setData(INITIAL_DATA);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => {
      set(ref(db, "agora"), data);
    }, 800);
    return () => clearTimeout(t);
  }, [data]);

  const update = (key) => (val) => setData(d => ({ ...d, [key]: val }));

  if (!data) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: MUTED }}>Loading…</div>;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-top">
            <div>
              <div className="boat-name">Agora</div>
              <div className="boat-sub">Beneteau First 47.7 · Captain's Log</div>
            </div>
            <svg className="compass" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="21" stroke="#C8472A" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="24" cy="24" r="3" fill="#C8472A" />
              <polygon points="24,8 27,22 24,20 21,22" fill="#F0EAD8" />
              <polygon points="24,40 21,26 24,28 27,26" fill="#9BAAB4" />
            </svg>
          </div>
          <div className="tabs">
            {TABS.map((t, i) => <div key={t} className={`tab ${tab === i ? "active" : ""}`} onClick={() => setTab(i)}>{t}</div>)}
          </div>
        </div>
        <div className="content">
          {tab === 0 && <Projects data={data.projects} setData={update("projects")} />}
          {tab === 1 && <VoyageLog data={data.voyages} setData={update("voyages")} />}
          {tab === 2 && <Maintenance data={data.maintenance} setData={update("maintenance")} />}
          {tab === 3 && <FuelLog data={data.fuel || []} setData={update("fuel")} />}
          {tab === 4 && <SpareParts data={data.parts} setData={update("parts")} />}
        </div>
      </div>
      <ChatBot data={data} />
    </>
  );
}
