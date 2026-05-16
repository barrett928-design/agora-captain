# Chartplotter — Raymarine Axiom Pro 9s

## Identity
- **Model:** Raymarine Axiom Pro 9s
- **OS:** LightHouse (LightHouse 4 current)
- **Network role:** Hub of Agora's electronics network (NMEA 2000 / SeaTalkNG)

## Manual
- **Product page:** https://www.raymarine.com/en-US/our-products/multifunction-displays/axiom-pro/axiom-pro-9s/
- **LightHouse 4 online manual:** https://raymarine.iboatcloud.com/lighthouse4/
- **Documentation & Downloads:** Click "Documents & Downloads" on the product page above for PDF manual
- ⚠️ URLs not verified live — search "Axiom Pro 9s" on raymarine.com if link doesn't resolve

## Key Specs
| Spec | Value |
|---|---|
| Display | 9" IPS touchscreen, 1280×800, 1500 nit |
| Processor | Quad-core |
| Built-in sonar | RealVision 3D (CHIRP, DownVision, SideVision) |
| GPS | Internal 10Hz GPS/GLONASS |
| Networking | SeaTalkNG / NMEA 2000, Ethernet, Wi-Fi, Bluetooth |
| Other ports | NMEA 0183, USB |
| Cartography | Navionics+ or LightHouse charts; supports BlueChart g3 |
| Power | 9–31.2 VDC, ~15W typical |
| Waterproofing | IPX6 & IPX7 |

## Connected Devices on Agora
- Raymarine i70 displays (×6)
- Raymarine ST70+ displays (×2)
- Raymarine AIS650 (MMSI 368362150)
- Raymarine EV-1 autopilot / P70 control head

## NMEA 2000 Network — Diagnostic Notes
The Axiom Pro is the network hub. If any connected device is misbehaving:
- Go to **Settings > Network** on the chartplotter to see all connected devices and their status
- **Open project:** Autopilot disengaging + AIS signal loss — both are likely a NMEA 2000 backbone issue (bad connector, missing terminator, bus power drop). Network page is the first diagnostic step.

## Important Operating Notes

### Before Every Passage
- Verify GPS lock on chartplotter
- Confirm AIS targets are showing (means AIS650 and NMEA 2000 network are healthy)
- Verify autopilot shows as connected network device
- Export waypoints/routes to USB before any OS update: **Home > My Data > Export**

### LightHouse OS Updates
- Update via Wi-Fi or USB
- Always check raymarine.com for latest release before a passage
- Past updates have resolved autopilot integration bugs
- **Always export waypoints before updating**

### Useful Features
- **Anchor alarm** — Navigation app > Anchor; set drag radius when anchoring in open anchorages
- **Dual-screen split** — chart + radar, or chart + sonar
- **Screen brightness** — 1500 nits is readable in direct sun; 50–75% is a good power-saving cruising setting (~5–8W saved)
- **Radar port** — available for future Quantum 2 radar addition

### Cartography
- Navionics+ is the standard chart source
- Keep charts updated via Wi-Fi when in marina with internet
