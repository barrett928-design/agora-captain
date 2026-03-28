import { useState, useEffect} from "react";
import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";

const TABS = ["Voyage Log", "Maintenance", "Projects", "Spare Parts", "Checklists"];

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
};

const CHECKLIST_ITEMS = {
  arrival: ["50 amp shore power on", "Fridge/freezer on", "Check bilge", "Check heads", "Assess exterior", "Check dock lines", "Safety meeting", "Open head through holes", "De-humidifiers on", "Check fuel level"],
  departure: ["A/C on", "Shore power off", "Time noted", "Engine hrs noted", "Check bilge", "Check heads", "Covers off", "Scrub deck", "Check weather"],
  packup: ["Shore power on", "Fridge/freezer off", "Instruments off", "Wet laundry off", "Turn off gas at tanks", "Note electric meter", "Wipe down counters & table", "Close head through holes", "Wet wipe salon table", "Sweep & dust", "Covers on"],
};

const SYSTEMS = ["Yanmar", "Generator", "Westerbeke", "Tohatsu", "AC", "Electrical", "Heads", "Bilge", "Hull", "Plumbing", "Rigging", "Safety", "Other"];
const LOCATIONS = ["Bow", "Stern", "Salon", "Galley", "Aft Head", "Fwd Head", "V Berth", "Kid Bunks", "Midship", "Universal"];
const PRIORITIES = ["High", "Med", "Low"];
const STATUSES = ["Open", "In Progress", "Done"];

const SEA = "#0a2a3b";
const NAVY = "#0d3d5c";
const TEAL = "#1a7a8a";
const GOLD = "#c9a84c";
const LIGHT = "#e8f4f8";
const WHITE = "#f5fafc";
const MUTED = "#7aa3b8";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${SEA}; font-family: 'Source Sans 3', sans-serif; color: ${WHITE}; min-height: 100vh; }
  .app { max-width: 1100px; margin: 0 auto; padding: 0 0 80px; }
  
  .header { background: linear-gradient(135deg, #061820 0%, ${NAVY} 60%, #0a3550 100%); padding: 28px 32px 0; border-bottom: 2px solid ${GOLD}; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events: none; }
  .header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; position: relative; }
  .boat-name { font-family: 'Libre Baskerville', serif; font-size: 32px; font-weight: 700; color: ${GOLD}; letter-spacing: 2px; text-transform: uppercase; }
  .boat-sub { font-size: 13px; color: ${MUTED}; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .compass { width: 48px; height: 48px; opacity: 0.6; }
  
  .tabs { display: flex; gap: 0; position: relative; }
  .tab { padding: 10px 20px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED}; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; font-weight: 600; }
  .tab:hover { color: ${LIGHT}; }
  .tab.active { color: ${GOLD}; border-bottom-color: ${GOLD}; }
  
  .content { padding: 24px 20px; }
  
  .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
  .card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; }
  .card-header:hover { background: rgba(255,255,255,0.04); }
  .card-body { padding: 0 16px 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  
  .section-title { font-family: 'Libre Baskerville', serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 16px; margin-top: 4px; opacity: 0.9; }
  
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; transition: all 0.15s; font-family: 'Source Sans 3', sans-serif; }
  .btn-primary { background: ${GOLD}; color: #0a1a24; }
  .btn-primary:hover { background: #ddb95c; }
  .btn-ghost { background: transparent; color: ${MUTED}; border: 1px solid rgba(255,255,255,0.12); }
  .btn-ghost:hover { color: ${WHITE}; border-color: rgba(255,255,255,0.3); }
  .btn-danger { background: transparent; color: #e05555; border: 1px solid rgba(224,85,85,0.3); }
  .btn-danger:hover { background: rgba(224,85,85,0.1); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  
  .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge-high { background: rgba(220,60,60,0.2); color: #ff7070; border: 1px solid rgba(220,60,60,0.3); }
  .badge-med { background: rgba(201,168,76,0.2); color: ${GOLD}; border: 1px solid rgba(201,168,76,0.3); }
  .badge-low { background: rgba(100,160,180,0.15); color: ${MUTED}; border: 1px solid rgba(100,160,180,0.2); }
  .badge-open { background: rgba(100,160,180,0.1); color: ${MUTED}; }
  .badge-progress { background: rgba(201,168,76,0.15); color: ${GOLD}; }
  .badge-done { background: rgba(60,180,100,0.15); color: #70cc90; }
  
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media (max-width: 600px) { .grid2, .grid3 { grid-template-columns: 1fr; } .tabs { overflow-x: auto; } .boat-name { font-size: 22px; } }
  
  .field { margin-bottom: 12px; }
  .field label { display: block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${MUTED}; margin-bottom: 5px; }
  .field input, .field select, .field textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 8px 10px; color: ${WHITE}; font-size: 14px; font-family: 'Source Sans 3', sans-serif; transition: border-color 0.15s; }
  .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: ${TEAL}; }
  .field textarea { resize: vertical; min-height: 70px; }
  .field select option { background: #0d2535; }
  
  .meta { font-size: 12px; color: ${MUTED}; }
  .meta strong { color: ${LIGHT}; }
  
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 16px 0; }
  
  .action-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
  .filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-chip { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; border: 1px solid rgba(255,255,255,0.1); color: ${MUTED}; cursor: pointer; background: transparent; transition: all 0.15s; }
  .filter-chip.active { background: ${TEAL}; color: white; border-color: ${TEAL}; }
  
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #0d2535; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 20px 24px 0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-title { font-family: 'Libre Baskerville', serif; font-size: 18px; color: ${GOLD}; }
  .modal-body { padding: 0 24px 24px; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  
  .checklist-col { flex: 1; min-width: 200px; }
  .checklist-cols { display: flex; gap: 20px; flex-wrap: wrap; }
  .check-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; }
  .check-item:hover { background: rgba(255,255,255,0.02); }
  .check-box { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-radius: 3px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .check-box.checked { background: ${TEAL}; border-color: ${TEAL}; }
  .check-label { font-size: 14px; transition: all 0.15s; }
  .check-label.checked { color: ${MUTED}; text-decoration: line-through; }
  .checklist-title { font-family: 'Libre Baskerville', serif; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: ${GOLD}; margin-bottom: 12px; }
  .progress-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; margin-bottom: 14px; }
  .progress-fill { height: 100%; border-radius: 2px; background: ${TEAL}; transition: width 0.3s; }
  
  .empty-state { text-align: center; padding: 40px; color: ${MUTED}; font-size: 14px; }
  .row-label { font-size: 12px; color: ${MUTED}; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .row-val { font-size: 14px; color: ${LIGHT}; }
`;

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
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

// ─── VOYAGE LOG ─────────────────────────────────────────────────────────────
function VoyageLog({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => { setForm({ date: new Date().toISOString().slice(0,10) }); setModal("new"); };
  const openEdit = (v) => { setForm({...v}); setModal("edit"); };

  const save = () => {
    if (modal === "new") {
      const next = [...data, { ...form, id: Date.now() }];
      setData(next);
    } else {
      setData(data.map(v => v.id === form.id ? form : v));
    }
    setModal(null);
  };

  const del = (id) => setData(data.filter(v => v.id !== id));
  const sorted = [...data].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{margin:0}}>Voyage Log</div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Log Voyage</button>
      </div>
      {sorted.length === 0 && <div className="empty-state">No voyages logged yet.</div>}
      {sorted.map(v => (
        <div className="card" key={v.id}>
          <div className="card-header" onClick={() => openEdit(v)}>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:WHITE}}>{new Date(v.date + 'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
              <div className="meta">{v.crew && <><strong>{v.crew}</strong> · </>}{v.distance && <>{v.distance} nm · </>}{v.wind && <>Wind {v.wind} kts</>}</div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {v.weather && <span className="badge badge-low">{v.weather}</span>}
              <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();del(v.id);}}>✕</button>
            </div>
          </div>
          {v.notes && <div className="card-body"><div className="meta">{v.notes}</div></div>}
        </div>
      ))}
      {modal && (
        <Modal title={modal==="new"?"Log Voyage":"Edit Voyage"} onClose={()=>setModal(null)}>
          <div className="grid2">
            <Field label="Date"><input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})} /></Field>
            <Field label="Crew"><input value={form.crew||""} onChange={e=>setForm({...form,crew:e.target.value})} placeholder="Who was aboard?" /></Field>
          </div>
          <div className="grid3">
            <Field label="Eng Hrs End"><input value={form.engHrs||""} onChange={e=>setForm({...form,engHrs:e.target.value})} placeholder="e.g. 2280" /></Field>
            <Field label="Gen Hrs End"><input value={form.genHrs||""} onChange={e=>setForm({...form,genHrs:e.target.value})} /></Field>
            <Field label="Distance (nm)"><input value={form.distance||""} onChange={e=>setForm({...form,distance:e.target.value})} /></Field>
          </div>
          <div className="grid2">
            <Field label="Depart"><input value={form.depart||""} onChange={e=>setForm({...form,depart:e.target.value})} placeholder="e.g. 09:00" /></Field>
            <Field label="Arrive"><input value={form.arrive||""} onChange={e=>setForm({...form,arrive:e.target.value})} placeholder="e.g. 14:30" /></Field>
          </div>
          <div className="grid2">
            <Field label="Wind (kts)"><input value={form.wind||""} onChange={e=>setForm({...form,wind:e.target.value})} placeholder="e.g. 10-15" /></Field>
            <Field label="Weather"><input value={form.weather||""} onChange={e=>setForm({...form,weather:e.target.value})} placeholder="e.g. Clear/Sunny" /></Field>
          </div>
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Anything notable about the trip..." /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────
function Maintenance({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterSys, setFilterSys] = useState("All");

  const openNew = () => { setForm({ date: new Date().toISOString().slice(0,10) }); setModal("new"); };
  const openEdit = (m) => { setForm({...m}); setModal("edit"); };
  const save = () => {
    if (modal === "new") setData([...data, { ...form, id: Date.now() }]);
    else setData(data.map(m => m.id === form.id ? form : m));
    setModal(null);
  };
  const del = (id) => setData(data.filter(m => m.id !== id));

  const systems = ["All", ...Array.from(new Set(data.map(m=>m.system))).sort()];
  const filtered = [...data].filter(m => filterSys==="All" || m.system===filterSys).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{margin:0}}>Maintenance Log</div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Log Service</button>
      </div>
      <div className="filter-row" style={{marginBottom:16}}>
        {systems.map(s => <button key={s} className={`filter-chip ${filterSys===s?"active":""}`} onClick={()=>setFilterSys(s)}>{s}</button>)}
      </div>
      {filtered.map(m => (
        <div className="card" key={m.id}>
          <div className="card-header" onClick={()=>openEdit(m)}>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:WHITE}}>{m.system} — {m.equipment}</div>
              <div className="meta">{new Date(m.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · {m.action}{m.crew && <> · <strong>{m.crew}</strong></>}{m.engHrs && <> · {m.engHrs} hrs</>}</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();del(m.id);}}>✕</button>
          </div>
          {(m.notes||m.partLink) && <div className="card-body">
            {m.notes && <div className="meta" style={{marginBottom:m.partLink?6:0}}>{m.notes}</div>}
            {m.partLink && <div className="meta">🔗 {m.partLink}</div>}
          </div>}
        </div>
      ))}
      {modal && (
        <Modal title={modal==="new"?"Log Service":"Edit Service"} onClose={()=>setModal(null)}>
          <div className="grid2">
            <Field label="Date"><input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})} /></Field>
            <Field label="Engine Hours"><input value={form.engHrs||""} onChange={e=>setForm({...form,engHrs:e.target.value})} placeholder="e.g. 2280" /></Field>
          </div>
          <div className="grid2">
            <Field label="System"><select value={form.system||""} onChange={e=>setForm({...form,system:e.target.value})}>
              <option value="">Select...</option>
              {SYSTEMS.map(s=><option key={s}>{s}</option>)}
            </select></Field>
            <Field label="Equipment"><input value={form.equipment||""} onChange={e=>setForm({...form,equipment:e.target.value})} placeholder="e.g. Oil Filter" /></Field>
          </div>
          <div className="grid2">
            <Field label="Action"><input value={form.action||""} onChange={e=>setForm({...form,action:e.target.value})} placeholder="e.g. Oil change" /></Field>
            <Field label="Done By"><input value={form.crew||""} onChange={e=>setForm({...form,crew:e.target.value})} placeholder="e.g. Barrett" /></Field>
          </div>
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} /></Field>
          <Field label="Part # / Link"><input value={form.partLink||""} onChange={e=>setForm({...form,partLink:e.target.value})} /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────
function Projects({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterPri, setFilterPri] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Open");

  const openNew = () => { setForm({ priority: "Med", status: "Open" }); setModal("new"); };
  const openEdit = (p) => { setForm({...p}); setModal("edit"); };
  const save = () => {
    if (modal==="new") setData([...data,{...form,id:Date.now()}]);
    else setData(data.map(p=>p.id===form.id?form:p));
    setModal(null);
  };
  const del = (id) => setData(data.filter(p=>p.id!==id));
  const cycle = (p) => {
    const s = {Open:"In Progress","In Progress":"Done",Done:"Open"};
    setData(data.map(x=>x.id===p.id?{...x,status:s[x.status]}:x));
  };

  const filtered = data.filter(p=>(filterPri==="All"||p.priority===filterPri)&&(filterStatus==="All"||p.status===filterStatus));
  const open = filtered.filter(p=>p.status!=="Done").length;

  return (
    <div>
      <div className="action-bar">
        <div>
          <div className="section-title" style={{margin:0}}>Projects & Tasks</div>
          <div className="meta" style={{marginTop:2}}>{open} open item{open!==1?"s":""}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Task</button>
      </div>
      <div className="filter-row" style={{marginBottom:8}}>
        {["All","Open","In Progress","Done"].map(s=><button key={s} className={`filter-chip ${filterStatus===s?"active":""}`} onClick={()=>setFilterStatus(s)}>{s}</button>)}
      </div>
      <div className="filter-row" style={{marginBottom:16}}>
        {["All",...PRIORITIES].map(p=><button key={p} className={`filter-chip ${filterPri===p?"active":""}`} onClick={()=>setFilterPri(p)}>{p}</button>)}
      </div>
      {filtered.length===0&&<div className="empty-state">No tasks match this filter.</div>}
      {filtered.map(p=>(
        <div className="card" key={p.id}>
          <div className="card-header">
            <div style={{flex:1,cursor:'pointer'}} onClick={()=>openEdit(p)}>
              <div style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:3}}>{p.task}</div>
              <div className="meta">{p.location}{p.who&&<> · <strong>{p.who}</strong></>}</div>
            </div>
            <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
              <span className={`badge badge-${p.priority?.toLowerCase()||'low'}`}>{p.priority}</span>
              <button onClick={()=>cycle(p)} className={`badge badge-${p.status==="Open"?"open":p.status==="In Progress"?"progress":"done"}`} style={{cursor:'pointer',border:'none',fontFamily:'inherit'}}>{p.status}</button>
              <button className="btn btn-danger btn-sm" onClick={()=>del(p.id)}>✕</button>
            </div>
          </div>
          {p.notes&&<div className="card-body"><div className="meta">{p.notes}</div></div>}
        </div>
      ))}
      {modal&&(
        <Modal title={modal==="new"?"Add Task":"Edit Task"} onClose={()=>setModal(null)}>
          <Field label="Task"><input value={form.task||""} onChange={e=>setForm({...form,task:e.target.value})} placeholder="What needs doing?" /></Field>
          <div className="grid2">
            <Field label="Location"><select value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}>
              <option value="">Select...</option>
              {LOCATIONS.map(l=><option key={l}>{l}</option>)}
            </select></Field>
            <Field label="Assigned To"><input value={form.who||""} onChange={e=>setForm({...form,who:e.target.value})} placeholder="e.g. Barrett, Susanna" /></Field>
          </div>
          <div className="grid2">
            <Field label="Priority"><select value={form.priority||"Med"} onChange={e=>setForm({...form,priority:e.target.value})}>
              {PRIORITIES.map(p=><option key={p}>{p}</option>)}
            </select></Field>
            <Field label="Status"><select value={form.status||"Open"} onChange={e=>setForm({...form,status:e.target.value})}>
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select></Field>
          </div>
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SPARE PARTS ─────────────────────────────────────────────────────────────
function SpareParts({ data, setData }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterSys, setFilterSys] = useState("All");

  const openNew = () => { setForm({}); setModal("new"); };
  const openEdit = (p) => { setForm({...p}); setModal("edit"); };
  const save = () => {
    if (modal==="new") setData([...data,{...form,id:Date.now()}]);
    else setData(data.map(p=>p.id===form.id?form:p));
    setModal(null);
  };
  const del = (id) => setData(data.filter(p=>p.id!==id));
  const systems = ["All",...Array.from(new Set(data.map(p=>p.system))).sort()];
  const filtered = data.filter(p=>filterSys==="All"||p.system===filterSys).sort((a,b)=>a.system.localeCompare(b.system));

  return (
    <div>
      <div className="action-bar">
        <div className="section-title" style={{margin:0}}>Spare Parts</div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Add Part</button>
      </div>
      <div className="filter-row" style={{marginBottom:16}}>
        {systems.map(s=><button key={s} className={`filter-chip ${filterSys===s?"active":""}`} onClick={()=>setFilterSys(s)}>{s}</button>)}
      </div>
      {filtered.map(p=>(
        <div className="card" key={p.id}>
          <div className="card-header" onClick={()=>openEdit(p)} style={{cursor:'pointer'}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:WHITE}}>{p.part}</div>
              <div className="meta">{p.system}{p.location&&<> · {p.location}</>}{p.partNum&&<> · #{p.partNum}</>}</div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontSize:20,fontWeight:700,color:p.qty<=1?'#ff7070':GOLD}}>{p.qty??'—'}</span>
              <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();del(p.id);}}>✕</button>
            </div>
          </div>
          {p.notes&&<div className="card-body"><div className="meta">{p.notes}</div></div>}
        </div>
      ))}
      {modal&&(
        <Modal title={modal==="new"?"Add Part":"Edit Part"} onClose={()=>setModal(null)}>
          <div className="grid2">
            <Field label="System"><select value={form.system||""} onChange={e=>setForm({...form,system:e.target.value})}>
              <option value="">Select...</option>
              {SYSTEMS.map(s=><option key={s}>{s}</option>)}
            </select></Field>
            <Field label="Part Name"><input value={form.part||""} onChange={e=>setForm({...form,part:e.target.value})} /></Field>
          </div>
          <div className="grid2">
            <Field label="Qty on Hand"><input type="number" value={form.qty??""} onChange={e=>setForm({...form,qty:parseInt(e.target.value)||null})} /></Field>
            <Field label="Location"><input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Salon Seat Drawer" /></Field>
          </div>
          <Field label="Part # / Link"><input value={form.partNum||""} onChange={e=>setForm({...form,partNum:e.target.value})} /></Field>
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} /></Field>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CHECKLISTS ─────────────────────────────────────────────────────────────
function Checklists() {
  const [checks, setChecks] = useState({ arrival: {}, departure: {}, packup: {} });
  const toggle = (list, i) => setChecks(c => ({ ...c, [list]: { ...c[list], [i]: !c[list][i] } }));
  const reset = (list) => setChecks(c => ({ ...c, [list]: {} }));

  const CheckList = ({ id, title, items }) => {
    const done = items.filter((_,i)=>checks[id][i]).length;
    return (
      <div className="checklist-col">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div className="checklist-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>reset(id)}>Reset</button>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${(done/items.length)*100}%`}} /></div>
        <div className="meta" style={{marginBottom:10}}>{done} / {items.length} complete</div>
        {items.map((item,i)=>(
          <div key={i} className="check-item" onClick={()=>toggle(id,i)}>
            <div className={`check-box ${checks[id][i]?"checked":""}`}>{checks[id][i]&&<span style={{color:'white',fontSize:12}}>✓</span>}</div>
            <div className={`check-label ${checks[id][i]?"checked":""}`}>{item}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="section-title">Operational Checklists</div>
      <div className="checklist-cols">
        <CheckList id="arrival" title="Arrival" items={CHECKLIST_ITEMS.arrival} />
        <CheckList id="departure" title="Departure" items={CHECKLIST_ITEMS.departure} />
        <CheckList id="packup" title="Pack Up" items={CHECKLIST_ITEMS.packup} />
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
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

  if (!data) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:MUTED}}>Loading…</div>;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-top">
            <div>
              <div className="boat-name">Agora</div>
              <div className="boat-sub">Beneteau 48 · Captain's Log</div>
            </div>
            <svg className="compass" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="24" cy="24" r="3" fill={GOLD}/>
              <polygon points="24,6 27,22 24,20 21,22" fill={GOLD}/>
              <polygon points="24,42 21,26 24,28 27,26" fill={MUTED}/>
              <text x="24" y="4" textAnchor="middle" fill={GOLD} fontSize="5" fontFamily="Libre Baskerville">N</text>
              <text x="24" y="46" textAnchor="middle" fill={MUTED} fontSize="5" fontFamily="Libre Baskerville">S</text>
              <text x="3" y="25" textAnchor="middle" fill={MUTED} fontSize="5" fontFamily="Libre Baskerville">W</text>
              <text x="45" y="25" textAnchor="middle" fill={MUTED} fontSize="5" fontFamily="Libre Baskerville">E</text>
            </svg>
          </div>
          <div className="tabs">
            {TABS.map((t,i)=><div key={t} className={`tab ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</div>)}
          </div>
        </div>
        <div className="content">
          {tab===0 && <VoyageLog data={data.voyages} setData={update("voyages")} />}
          {tab===1 && <Maintenance data={data.maintenance} setData={update("maintenance")} />}
          {tab===2 && <Projects data={data.projects} setData={update("projects")} />}
          {tab===3 && <SpareParts data={data.parts} setData={update("parts")} />}
          {tab===4 && <Checklists />}
        </div>
      </div>
    </>
  );
}
