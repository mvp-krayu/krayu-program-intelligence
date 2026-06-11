/**
 * Blue Edge Fleet Management Platform — Database Seeder v2.14.0
 * Populates all 39 entities with rich, realistic UAE/Dubai context data.
 * Run: npx ts-node -r tsconfig-paths/register src/database/seed.ts
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const uuid = () => crypto.randomUUID();
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000);
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000);
const futureDate = (d: number) => new Date(Date.now() + d * 86400000);
const plateNum = () => `DXB-${randInt(1000, 9999)}`;
const vinGen = () => Array.from({ length: 17 }, () => 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'[randInt(0, 32)]).join('');

const ORG_ID = uuid();
const FLEET_IDS = { tanker: uuid(), bus: uuid(), taxi: uuid() };

const DUBAI_LOCATIONS = [
  { name: 'JAFZA Terminal 4', lat: 25.0657, lng: 55.1713 },
  { name: 'Port Rashid Depot', lat: 25.2630, lng: 55.3088 },
  { name: 'Al Quoz Industrial', lat: 25.1553, lng: 55.2255 },
  { name: 'DXB Airport T3', lat: 25.2532, lng: 55.3657 },
  { name: 'Jebel Ali Free Zone', lat: 25.0088, lng: 55.0829 },
  { name: 'DEWA Jebel Ali Station', lat: 25.0500, lng: 55.1100 },
  { name: 'Downtown Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'JBR Marina', lat: 25.0780, lng: 55.1340 },
  { name: 'Business Bay', lat: 25.1851, lng: 55.2629 },
  { name: 'DIFC Gate Village', lat: 25.2100, lng: 55.2790 },
  { name: 'Mall of the Emirates', lat: 25.1185, lng: 55.2008 },
  { name: 'Deira City Centre', lat: 25.2525, lng: 55.3313 },
  { name: 'Dubai Silicon Oasis', lat: 25.1265, lng: 55.3830 },
  { name: 'ENOC Station Al Quoz', lat: 25.1600, lng: 55.2300 },
  { name: 'Dubai South Expo', lat: 24.9560, lng: 55.1580 },
];

const DRIVERS = [
  { fn: 'Ahmed', ln: 'Al Rashid', fnAr: 'أحمد', lnAr: 'الراشد' },
  { fn: 'Fatima', ln: 'Al Zahra', fnAr: 'فاطمة', lnAr: 'الزهراء' },
  { fn: 'Mohammed', ln: 'Al Farsi', fnAr: 'محمد', lnAr: 'الفارسي' },
  { fn: 'Khalid', ln: 'bin Saeed', fnAr: 'خالد', lnAr: 'بن سعيد' },
  { fn: 'Saeed', ln: 'Al Maktoum', fnAr: 'سعيد', lnAr: 'المكتوم' },
  { fn: 'Hassan', ln: 'Mirza', fnAr: 'حسن', lnAr: 'ميرزا' },
  { fn: 'Aisha', ln: 'bint Khalid', fnAr: 'عائشة', lnAr: 'بنت خالد' },
  { fn: 'Omar', ln: 'Al Suwaidi', fnAr: 'عمر', lnAr: 'السويدي' },
  { fn: 'Youssef', ln: 'Hamdan', fnAr: 'يوسف', lnAr: 'حمدان' },
  { fn: 'Mariam', ln: 'Al Hashimi', fnAr: 'مريم', lnAr: 'الهاشمي' },
  { fn: 'Ibrahim', ln: 'Al Nuaimi', fnAr: 'إبراهيم', lnAr: 'النعيمي' },
  { fn: 'Noura', ln: 'Al Shamsi', fnAr: 'نورة', lnAr: 'الشمسي' },
  { fn: 'Ali', ln: 'Al Mansoori', fnAr: 'علي', lnAr: 'المنصوري' },
  { fn: 'Layla', ln: 'Al Dhaheri', fnAr: 'ليلى', lnAr: 'الظاهري' },
  { fn: 'Rashid', ln: 'Al Kaabi', fnAr: 'راشد', lnAr: 'الكعبي' },
  { fn: 'Sara', ln: 'Al Falasi', fnAr: 'سارة', lnAr: 'الفلاسي' },
  { fn: 'Hamad', ln: 'Al Ketbi', fnAr: 'حمد', lnAr: 'الكتبي' },
  { fn: 'Dana', ln: 'Al Muhairi', fnAr: 'دانة', lnAr: 'المحيري' },
  { fn: 'Sultan', ln: 'Al Mazrouei', fnAr: 'سلطان', lnAr: 'المزروعي' },
  { fn: 'Hessa', ln: 'Al Qassimi', fnAr: 'حصة', lnAr: 'القاسمي' },
  { fn: 'Mansour', ln: 'Al Ameri', fnAr: 'منصور', lnAr: 'العامري' },
  { fn: 'Reem', ln: 'Al Tamimi', fnAr: 'ريم', lnAr: 'التميمي' },
  { fn: 'Nasser', ln: 'Al Khouri', fnAr: 'ناصر', lnAr: 'الخوري' },
  { fn: 'Sheikha', ln: 'Al Nahyan', fnAr: 'شيخة', lnAr: 'النهيان' },
  { fn: 'Abdulla', ln: 'Al Balooshi', fnAr: 'عبدالله', lnAr: 'البلوشي' },
];

const TANKERS = [
  { name: 'ENOC Fuel Tanker', make: 'MAN', model: 'TGS 41.440', cargo: 'Diesel EN590', un: 'UN1202', cap: 36000 },
  { name: 'LPG Carrier', make: 'Volvo', model: 'FH16', cargo: 'LPG', un: 'UN1075', cap: 22000 },
  { name: 'Chemical Transport', make: 'Mercedes-Benz', model: 'Actros 3353', cargo: 'Ethanol', un: 'UN1170', cap: 28000 },
  { name: 'Aviation Fuel Tanker', make: 'Scania', model: 'R500', cargo: 'JET A-1', un: 'UN1863', cap: 40000 },
  { name: 'Bitumen Hauler', make: 'DAF', model: 'CF 440', cargo: 'Bitumen', un: 'UN1999', cap: 32000 },
  { name: 'Water Tanker', make: 'Isuzu', model: 'FVZ 1400', cargo: 'Potable Water', un: null, cap: 18000 },
  { name: 'LNG Carrier', make: 'Kenworth', model: 'T880', cargo: 'LNG', un: 'UN1972', cap: 45000 },
  { name: 'Crude Oil Transport', make: 'Western Star', model: '4900', cargo: 'Crude Oil', un: 'UN1267', cap: 50000 },
  { name: 'Lubricant Tanker', make: 'Hino', model: 'GH8J', cargo: 'Lubricants', un: 'UN1270', cap: 15000 },
  { name: 'Fuel Resupply Unit', make: 'MAN', model: 'TGM 18.290', cargo: 'Gasoline 95', un: 'UN1203', cap: 12000 },
];

const BUSES = [
  { make: 'Yutong', model: 'ZK6128HGE', route: 'Route 14: Gold Souq → Mall of Emirates' },
  { make: 'King Long', model: 'XMQ6127', route: 'Route E07: Deira → JBR Express' },
  { make: 'Blue Bird', model: 'Vision', route: 'SB-22: Dubai American Academy' },
  { make: 'Mercedes-Benz', model: 'Citaro', route: 'Route A1: Airport → Downtown' },
  { make: 'Volvo', model: 'B9TL', route: 'Route N11: Night Owl Al Quoz' },
  { make: 'BYD', model: 'K9', route: 'Route MC3: Marina Tram Loop' },
  { make: 'Ashok Leyland', model: 'Falcon', route: 'Route W45: JAFZA Worker' },
  { make: 'Tata', model: 'Starbus Ultra', route: 'Route DIP1: Investment Park' },
  { make: 'MAN', model: 'Lions City', route: 'Route U12: Knowledge Village' },
  { make: 'Solaris', model: 'Urbino 12', route: 'Route H7: Healthcare City' },
];

const TAXIS = [
  { make: 'Toyota', model: 'Camry', color: 'Cream/Red' },
  { make: 'Lexus', model: 'ES 350', color: 'Cream/Red' },
  { make: 'Mercedes-Benz', model: 'S-Class', color: 'Black' },
  { make: 'Tesla', model: 'Model 3', color: 'Green' },
  { make: 'Lexus', model: 'NX', color: 'Pink' },
  { make: 'BMW', model: '7 Series', color: 'Black' },
  { make: 'Nissan', model: 'Altima', color: 'Cream/Red' },
  { make: 'BYD', model: 'Han EV', color: 'Blue' },
  { make: 'Audi', model: 'A6', color: 'Silver' },
  { make: 'Toyota', model: 'Prius', color: 'Cream/Green' },
];

const FUEL_STATIONS = ['ENOC Al Quoz', 'ENOC Sheikh Zayed Rd', 'ENOC JBR', 'ADNOC Jebel Ali', 'ADNOC Business Bay', 'EPPCO Al Barsha', 'ENOC DIFC', 'ADNOC Rashidiya'];

const ALERT_TYPES = [
  { type: 'speed_violation', cat: 'safety', sev: 'high', msg: 'Speed limit exceeded: 125 km/h on Sheikh Zayed Rd' },
  { type: 'harsh_braking', cat: 'safety', sev: 'medium', msg: 'Harsh braking detected (0.6g deceleration)' },
  { type: 'geofence_exit', cat: 'operations', sev: 'high', msg: 'Vehicle exited approved route geofence' },
  { type: 'fuel_level_low', cat: 'maintenance', sev: 'low', msg: 'Fuel level below 15% threshold' },
  { type: 'temperature_alert', cat: 'cargo', sev: 'critical', msg: 'Cargo temp 62°C exceeds safe range (Diesel)' },
  { type: 'maintenance_due', cat: 'maintenance', sev: 'medium', msg: 'Scheduled maintenance due at 200,000 km' },
  { type: 'engine_warning', cat: 'diagnostics', sev: 'high', msg: 'Engine check: DTC P0420 catalyst efficiency' },
  { type: 'driver_fatigue', cat: 'safety', sev: 'critical', msg: 'PERCLOS 16% — fatigue detected' },
  { type: 'hos_violation', cat: 'compliance', sev: 'high', msg: 'HOS violation: 9.2h continuous driving' },
  { type: 'tire_pressure', cat: 'diagnostics', sev: 'medium', msg: 'Low tire pressure: 30 PSI on rear axle' },
  { type: 'route_deviation', cat: 'operations', sev: 'medium', msg: 'Route deviation: 3.2 km from planned on Al Khail Rd' },
  { type: 'hazmat_leak', cat: 'safety', sev: 'critical', msg: 'HAZMAT sensor triggered: possible leak compartment 2' },
  { type: 'idle_excessive', cat: 'operations', sev: 'low', msg: 'Excessive idling: 25 minutes at Al Quoz' },
];

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'blueedge',
  password: process.env.DB_PASS || 'blueedge_dev_2026',
  database: process.env.DB_NAME || 'blueedge_fleet',
  synchronize: true,
  logging: false,
});

async function seed() {
  await ds.initialize();
  const qr = ds.createQueryRunner();
  console.log('🌊 Blue Edge Fleet — Database Seeder v2.14.0\n' + '━'.repeat(55));

  // Truncate
  const tables = ['fuel_transactions','work_orders','cargo_manifests','custody_transfers','alerts','trips','taxi_trips','notifications','safety_events','compliance_records','diagnostic_records','devices','drivers','vehicles','fleets','users','bus_routes','geofences','ota_updates','coldchain_shipments','electric_vehicles','v2g_sessions','finance_transactions','surge_zones','incentive_programs','electrification_plans','charging_depots','executive_reports','anomalies','border_regulations','permits','parts_listings','lifecycle_plans','driver_sessions','fatigue_assessments','shipment_trackings','blockchain_records','tenant_themes','charging_stations'];
  for (const t of tables) { try { await qr.query(`TRUNCATE TABLE "${t}" CASCADE`); } catch {} }
  console.log('🗑️  Tables truncated');

  // ── 1. USERS ──
  const hash = await bcrypt.hash('demo123', 10);
  const users = [
    { id: uuid(), fn: 'Borhane', ln: 'Al Admin', email: 'admin@blueedge.com', role: 'admin' },
    { id: uuid(), fn: 'Khalid', ln: 'Al Manager', email: 'manager@blueedge.com', role: 'manager' },
    { id: uuid(), fn: 'Fatima', ln: 'Al Dispatch', email: 'dispatcher@blueedge.com', role: 'dispatcher' },
    { id: uuid(), fn: 'Ahmed', ln: 'Al Driver', email: 'driver@blueedge.com', role: 'driver' },
    { id: uuid(), fn: 'Omar', ln: 'Al Viewer', email: 'viewer@blueedge.com', role: 'viewer' },
    { id: uuid(), fn: 'ENOC', ln: 'Customer', email: 'customer@enoc.com', role: 'customer' },
  ];
  for (const u of users) await qr.query(`INSERT INTO users (id,"firstName","lastName",email,"passwordHash",role,"orgId","isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,true)`, [u.id, u.fn, u.ln, u.email, hash, u.role, ORG_ID]);
  console.log(`👤 ${users.length} users`);

  // ── 2. FLEETS ──
  for (const [type, id] of Object.entries(FLEET_IDS)) {
    const names = { tanker: 'Blue Edge Tanker Fleet', bus: 'Blue Edge Transit Ops', taxi: 'Blue Edge Taxi & Limo' };
    await qr.query(`INSERT INTO fleets (id,"orgId",name,"fleetType","operationalRegion",status,"activeVehicleCount") VALUES ($1,$2,$3,$4,$5,$6,$7)`, [id, ORG_ID, names[type], type, 'Dubai / UAE', 'active', 10]);
  }
  console.log('🚢 3 fleets');

  // ── 3. DRIVERS ──
  const driverIds: string[] = [];
  for (let i = 0; i < DRIVERS.length; i++) {
    const d = DRIVERS[i]; const id = uuid(); driverIds.push(id);
    await qr.query(`INSERT INTO drivers (id,"orgId","employeeId","firstName","lastName","firstNameAr","lastNameAr",email,phone,status,"safetyScore","efficiencyScore","complianceScore","hireDate") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [id, ORG_ID, `EMP-${String(i+1).padStart(4,'0')}`, d.fn, d.ln, d.fnAr, d.lnAr,
       `${d.fn.toLowerCase()}.${d.ln.toLowerCase().replace(/\s/g,'')}@blueedge.com`,
       `+971-5${randInt(0,9)}-${randInt(100,999)}-${randInt(1000,9999)}`,
       i < 23 ? 'active' : 'on_leave', rand(78,99), rand(75,98), rand(85,100),
       `${randInt(2020,2024)}-${String(randInt(1,12)).padStart(2,'0')}-${String(randInt(1,28)).padStart(2,'0')}`]);
  }
  console.log(`🧑‍✈️ ${DRIVERS.length} drivers`);

  // ── 4. VEHICLES ──
  const vIds: { id: string; ft: string; plate: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const t = TANKERS[i]; const id = uuid(); const pl = plateNum(); const loc = pick(DUBAI_LOCATIONS);
    vIds.push({ id, ft: 'tanker', plate: pl });
    await qr.query(`INSERT INTO vehicles (id,vin,"licensePlate","fleetId","fleetType",make,model,year,color,status,specifications,"tankUnit","lastLatitude","lastLongitude","lastSpeed","lastHeading","odometerKm","engineHours","fuelLevelPercent","currentDriverId","deviceId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [id, vinGen(), pl, FLEET_IDS.tanker, 'tanker', t.make, t.model, randInt(2019,2025), 'White',
       pick(['active','active','active','maintenance']),
       JSON.stringify({ engineType:'Diesel', hp: randInt(400,550), gvw: randInt(35000,50000) }),
       JSON.stringify({ compartments: randInt(2,5), totalCapacityL: t.cap, material:'Stainless Steel' }),
       loc.lat+rand(-0.01,0.01), loc.lng+rand(-0.01,0.01), rand(0,80), rand(0,360),
       rand(50000,350000), rand(2000,12000), rand(25,95), driverIds[i], `DEV-T-${String(i+1).padStart(3,'0')}`]);
  }
  for (let i = 0; i < 10; i++) {
    const b = BUSES[i]; const id = uuid(); const pl = plateNum(); const loc = pick(DUBAI_LOCATIONS);
    vIds.push({ id, ft: 'bus', plate: pl });
    await qr.query(`INSERT INTO vehicles (id,vin,"licensePlate","fleetId","fleetType",make,model,year,color,status,specifications,"lastLatitude","lastLongitude","lastSpeed","lastHeading","odometerKm","engineHours","fuelLevelPercent","currentDriverId","deviceId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
      [id, vinGen(), pl, FLEET_IDS.bus, 'bus', b.make, b.model, randInt(2020,2025), pick(['White','Silver','Blue']),
       pick(['active','active','active','active','maintenance']),
       JSON.stringify({ engineType: i===5?'Electric':'Diesel', pax: randInt(35,55) }),
       loc.lat+rand(-0.01,0.01), loc.lng+rand(-0.01,0.01), rand(0,65), rand(0,360),
       rand(30000,250000), rand(1500,10000), rand(30,90), driverIds[10+i], `DEV-B-${String(i+1).padStart(3,'0')}`]);
  }
  for (let i = 0; i < 10; i++) {
    const t = TAXIS[i]; const id = uuid(); const pl = plateNum(); const loc = pick(DUBAI_LOCATIONS);
    vIds.push({ id, ft: 'taxi', plate: pl });
    await qr.query(`INSERT INTO vehicles (id,vin,"licensePlate","fleetId","fleetType",make,model,year,color,status,specifications,"lastLatitude","lastLongitude","lastSpeed","lastHeading","odometerKm","engineHours","fuelLevelPercent","currentDriverId","deviceId") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
      [id, vinGen(), pl, FLEET_IDS.taxi, 'taxi', t.make, t.model, randInt(2021,2025), t.color,
       pick(['active','active','active','active','inactive']),
       JSON.stringify({ engineType: t.make==='Tesla'||t.make==='BYD'?'Electric':'Gasoline', pax:4 }),
       loc.lat+rand(-0.01,0.01), loc.lng+rand(-0.01,0.01), rand(0,120), rand(0,360),
       rand(20000,180000), rand(800,6000), rand(20,95), driverIds[Math.min(18+i,24)], `DEV-X-${String(i+1).padStart(3,'0')}`]);
  }
  console.log(`🚛 30 vehicles`);

  // ── 5. DEVICES ──
  for (let i = 0; i < vIds.length; i++) {
    const v = vIds[i]; const pre = v.ft==='tanker'?'T':v.ft==='bus'?'B':'X';
    await qr.query(`INSERT INTO devices (id,"serialNumber","vehicleId","deviceType",status,"firmwareVersion",model,manufacturer,"lastHeartbeat",capabilities) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [uuid(), `DEV-${pre}-${String(i+1).padStart(3,'0')}`, v.id, pick(['svg_gateway','obd_dongle']), 'active',
       `3.${randInt(1,9)}.${randInt(0,15)}`, 'FleetEdge Pro 400', 'Blue Edge IoT', minutesAgo(randInt(1,30)),
       JSON.stringify(['gps','obd2','accelerometer','temperature','fuel'])]);
  }
  console.log('📡 30 devices');

  // ── 6. TRIPS (200) ──
  const tripIds: string[] = [];
  for (let i = 0; i < 200; i++) {
    const v = pick(vIds); const id = uuid(); tripIds.push(id);
    const s = pick(DUBAI_LOCATIONS); const e = pick(DUBAI_LOCATIONS.filter(l=>l.name!==s.name));
    const dist = rand(5,85); const dur = dist*rand(1.5,3);
    const st = hoursAgo(randInt(1,720));
    const status = i<10?'in_progress':i<15?'planned':'completed';
    const tt = v.ft==='tanker'?'tanker_delivery':v.ft==='bus'?'bus_route':'taxi_ride';
    await qr.query(`INSERT INTO trips (id,"vehicleId","fleetId","driverId",status,"tripType","startTime","endTime","startLat","startLng","endLat","endLng","startAddress","endAddress","distanceKm","durationMinutes","fuelUsedL","avgSpeedKmh","maxSpeedKmh","harshBrakingCount","harshAccelCount","speedingCount","tripScore") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
      [id, v.id, FLEET_IDS[v.ft], pick(driverIds), status, tt,
       st, status==='completed'?new Date(st.getTime()+dur*60000):null,
       s.lat, s.lng, e.lat, e.lng, s.name, e.name,
       dist, dur, dist*rand(0.08,0.35), dist/(dur/60), rand(80,140),
       randInt(0,4), randInt(0,3), randInt(0,5), rand(72,100)]);
  }
  console.log('🗺️  200 trips');

  // ── 7. ALERTS (150) ──
  for (let i = 0; i < 150; i++) {
    const v = pick(vIds); const a = pick(ALERT_TYPES); const loc = pick(DUBAI_LOCATIONS);
    await qr.query(`INSERT INTO alerts (id,"vehicleId","fleetId",severity,status,type,category,message,latitude,longitude,"createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [uuid(), v.id, FLEET_IDS[v.ft], a.sev, i<20?'active':i<40?'acknowledged':'resolved',
       a.type, a.cat, a.msg, loc.lat+rand(-0.01,0.01), loc.lng+rand(-0.01,0.01), hoursAgo(randInt(1,336))]);
  }
  console.log('🚨 150 alerts');

  // ── 8. FUEL (300) ──
  for (let i = 0; i < 300; i++) {
    const v = pick(vIds); const qty = v.ft==='tanker'?rand(150,450):v.ft==='bus'?rand(80,200):rand(30,65);
    const ppl = rand(2.8,3.6); const loc = pick(DUBAI_LOCATIONS);
    await qr.query(`INSERT INTO fuel_transactions (id,"vehicleId","driverId",type,"quantityL","costAmount",currency,"pricePerLiter","odometerKm","stationName",latitude,longitude,"fuelType",timestamp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [uuid(), v.id, pick(driverIds), pick(['fill','fill','fill','partial']),
       qty, qty*ppl, 'AED', ppl, rand(10000,350000), pick(FUEL_STATIONS),
       loc.lat+rand(-0.005,0.005), loc.lng+rand(-0.005,0.005),
       v.ft==='taxi'?'Gasoline 95':'Diesel', hoursAgo(randInt(1,1440))]);
  }
  console.log('⛽ 300 fuel tx');

  // ── 9. CARGO MANIFESTS (40) ──
  const tankerV = vIds.filter(v=>v.ft==='tanker');
  for (let i = 0; i < 40; i++) {
    const tv = pick(tankerV); const td = TANKERS[tankerV.indexOf(tv)%10];
    const o = pick(DUBAI_LOCATIONS); const d = pick(DUBAI_LOCATIONS.filter(l=>l.name!==o.name));
    await qr.query(`INSERT INTO cargo_manifests (id,"tripId","vehicleId","manifestNumber",status,"customerName","originFacility","destinationFacility",compartments,"totalVolumeL","hazmatInfo","loadedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [uuid(), pick(tripIds), tv.id, `MF-2026-${String(i+1).padStart(4,'0')}`,
       pick(['confirmed','in_transit','in_transit','delivered','delivered']),
       pick(['ENOC Distribution','ADNOC Logistics','Dubai Petroleum','Emirates Gas','Air BP Dubai']),
       o.name, d.name,
       JSON.stringify([{ compartmentNumber:1, productName:td.cargo, loadedVolumeL:td.cap*0.95, temperature:rand(18,45) }]),
       td.cap*0.95, JSON.stringify(td.un?{ unNumber:td.un, hazClass:'3' }:null), hoursAgo(randInt(1,720))]);
  }
  console.log('📦 40 cargo manifests');

  // ── 10. WORK ORDERS (60) ──
  const tasks = ['Oil & filter change','Brake pad replacement','Tire rotation','Transmission fluid flush','Air filter replacement','Belt inspection','Coolant flush','Battery replacement','Fuel injector clean','DPF regeneration','Tank inspection','ADR equipment check'];
  for (let i = 0; i < 60; i++) {
    const v = pick(vIds); const task = pick(tasks);
    const st = pick(['completed','completed','completed','in_progress','open','pending_parts']);
    const lc = rand(200,1500); const pc = rand(100,3500);
    await qr.query(`INSERT INTO work_orders (id,"orderNumber","vehicleId",status,type,priority,title,description,"scheduledDate","completedDate","estimatedHours","actualHours","laborCost","partsCost","totalCost") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [uuid(), `WO-2026-${String(i+1).padStart(4,'0')}`, v.id, st,
       pick(['preventive','corrective','inspection','predictive']), pick(['low','medium','medium','high','critical']),
       task, `${task} for ${v.plate}`, daysAgo(randInt(-30,60)),
       st==='completed'?daysAgo(randInt(0,30)):null, rand(1,8), st==='completed'?rand(1,10):null, lc, pc, lc+pc]);
  }
  console.log('🔧 60 work orders');

  // ── 11. BUS ROUTES (10) ──
  for (let i = 0; i < 10; i++) {
    const b = BUSES[i]; const rn = b.route.split(':')[0].trim(); const rname = b.route.split(':')[1]?.trim()||b.make;
    await qr.query(`INSERT INTO bus_routes (id,"routeNumber",name,status,stops,"distanceKm","estimatedDurationMin","firstDeparture","lastDeparture","headwayMin") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [uuid(), rn, rname, 'active', randInt(8,22), rand(12,55), randInt(30,90), '05:30', '23:30', randInt(8,20)]);
  }
  console.log('🚌 10 bus routes');

  // ── 12. GEOFENCES (15) ──
  for (let i = 0; i < 15; i++) {
    const l = DUBAI_LOCATIONS[i];
    await qr.query(`INSERT INTO geofences (id,name,type,"centerLat","centerLng","radiusM",status,"alertOnEntry","alertOnExit") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [uuid(), `${l.name} Zone`, pick(['depot','customer','restricted','loading_zone','fuel_station']),
       l.lat, l.lng, randInt(200,2000), 'active', true, true]);
  }
  console.log('📍 15 geofences');

  // ── 13. NOTIFICATIONS (100) ──
  for (let i = 0; i < 100; i++) {
    const v = pick(vIds);
    await qr.query(`INSERT INTO notifications (id,"userId",title,body,type,status,"createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [uuid(), pick(users).id, pick(['Maintenance Due','Trip Completed','Fuel Alert','SLA Warning','Driver License Expiry']),
       `Notification for vehicle ${v.plate} — action may be required`,
       pick(['maintenance','compliance','trip','alert','system']), pick(['unread','unread','read','read','read']),
       hoursAgo(randInt(1,336))]);
  }
  console.log('🔔 100 notifications');

  // ── 14. SAFETY EVENTS (50) ──
  for (let i = 0; i < 50; i++) {
    const v = pick(vIds); const loc = pick(DUBAI_LOCATIONS);
    await qr.query(`INSERT INTO safety_events (id,"vehicleId","driverId","eventType",severity,"speedKmh",latitude,longitude,"gForce",timestamp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [uuid(), v.id, pick(driverIds), pick(['harsh_braking','harsh_acceleration','speeding','sharp_turn','collision_warning','lane_departure']),
       pick(['low','medium','medium','high','critical']), rand(40,140),
       loc.lat+rand(-0.01,0.01), loc.lng+rand(-0.01,0.01), rand(0.3,1.2), hoursAgo(randInt(1,720))]);
  }
  console.log('🛡️  50 safety events');

  // ── 15. COMPLIANCE (40) ──
  for (let i = 0; i < 40; i++) {
    const v = pick(vIds);
    await qr.query(`INSERT INTO compliance_records (id,"vehicleId","driverId","complianceType",status,"issuedDate","expiryDate",authority,"documentNumber") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [uuid(), v.id, i%3===0?pick(driverIds):null,
       pick(['ADR Certificate','Vehicle Inspection','Driver Medical','Insurance Policy','RTA Registration','HAZMAT Permit']),
       pick(['compliant','compliant','compliant','expiring_soon','expired']),
       daysAgo(randInt(30,365)), futureDate(randInt(-10,365)),
       pick(['RTA Dubai','NCEMA','Dubai Civil Defence','Dubai Municipality','MoI UAE']),
       `DOC-${randInt(10000,99999)}`]);
  }
  console.log('📋 40 compliance records');

  // ── 16. FINANCE (80) ──
  for (let i = 0; i < 80; i++) {
    const cat = pick(['fuel','maintenance','insurance','salary','toll','fine','spare_parts']);
    const amt = cat==='salary'?rand(8000,18000):cat==='insurance'?rand(5000,15000):rand(50,3000);
    await qr.query(`INSERT INTO finance_transactions (id,type,category,amount,currency,description,"vehicleId",status,"transactionDate") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [uuid(), pick(['expense','expense','expense','revenue']), cat, amt, 'AED',
       `${cat} — ${pick(DUBAI_LOCATIONS).name}`, pick(vIds).id, pick(['completed','completed','pending']),
       hoursAgo(randInt(1,1440))]);
  }
  console.log('💰 80 finance tx');

  // ── 17. TAXI TRIPS (80) ──
  const taxiV = vIds.filter(v=>v.ft==='taxi');
  for (let i = 0; i < 80; i++) {
    const tv = pick(taxiV); const o = pick(DUBAI_LOCATIONS); const d = pick(DUBAI_LOCATIONS.filter(l=>l.name!==o.name));
    const dist = rand(3,35); const dur = dist*rand(1.8,3.5); const fare = 12+dist*2.19+dur*0.55*rand(0.5,1);
    await qr.query(`INSERT INTO taxi_trips (id,"vehicleId","driverId",status,"pickupLat","pickupLng","dropoffLat","dropoffLng","pickupAddress","dropoffAddress","distanceKm","durationMin","baseFare","totalFare",rating,"requestedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [uuid(), tv.id, pick(driverIds.slice(18)), pick(['completed','completed','completed','in_progress']),
       o.lat+rand(-0.005,0.005), o.lng+rand(-0.005,0.005), d.lat+rand(-0.005,0.005), d.lng+rand(-0.005,0.005),
       o.name, d.name, dist, dur, 12, fare, rand(3.5,5), hoursAgo(randInt(1,336))]);
  }
  console.log('🚕 80 taxi trips');

  // ── 18. SURGE ZONES (6) ──
  for (const sz of [
    { n:'Downtown Dubai', la:25.2048, ln:55.2708, m:2.1, r:3.5, d:87, dr:12 },
    { n:'DXB Airport T3', la:25.2532, ln:55.3657, m:1.8, r:2.0, d:72, dr:28 },
    { n:'Marina Walk', la:25.0836, ln:55.1466, m:1.5, r:2.5, d:55, dr:18 },
    { n:'DIFC', la:25.2100, ln:55.2790, m:1.3, r:1.5, d:42, dr:15 },
    { n:'JBR Beach', la:25.0780, ln:55.1340, m:1.0, r:2.0, d:25, dr:22 },
    { n:'Al Quoz Industrial', la:25.1553, ln:55.2255, m:1.0, r:4.0, d:15, dr:8 },
  ]) await qr.query(`INSERT INTO surge_zones (id,name,"centerLat","centerLng",multiplier,"radiusKm","demandLevel","availableDrivers",status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [uuid(), sz.n, sz.la, sz.ln, sz.m, sz.r, sz.d, sz.dr, sz.m>1.2?'surge':'normal']);
  console.log('📈 6 surge zones');

  // ── 19. INCENTIVES (5) ──
  for (const ip of [
    { n:'Peak Hour Champion', t:'streak', r:150, p:45 },
    { n:'Perfect Rating Week', t:'quality', r:300, p:120 },
    { n:'Airport Express Bonus', t:'zone', r:25, p:38 },
    { n:'Fuel Efficiency Star', t:'performance', r:200, p:85 },
    { n:'Safety First Monthly', t:'safety', r:500, p:200 },
  ]) await qr.query(`INSERT INTO incentive_programs (id,name,type,"rewardAmount",currency,status,"participantCount") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [uuid(), ip.n, ip.t, ip.r, 'AED', 'active', ip.p]);
  console.log('🏆 5 incentive programs');

  // ── 20. ELECTRIFICATION (1) ──
  await qr.query(`INSERT INTO electrification_plans (id,"fleetId","planName",status,"totalVehicles","evTarget","estimatedCostAed","estimatedSavingsAed","paybackMonths") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [uuid(), FLEET_IDS.bus, 'Dubai Green Transit 2028', 'in_progress', 65, 45, 82500000, 54000000, 38]);
  console.log('🔋 1 electrification plan');

  // ── 21. CHARGING DEPOTS (4) ──
  for (const dp of [
    { n:'Al Quoz Bus Depot', l:'Al Quoz Industrial 3', la:25.1553, ln:55.2255, c:16 },
    { n:'JAFZA Fleet Depot', l:'Jebel Ali FZ South', la:25.0088, ln:55.0829, c:12 },
    { n:'Rashidiya Depot', l:'Rashidiya Industrial', la:25.2358, ln:55.3931, c:12 },
    { n:'Dubai South Depot', l:'Dubai South Logistics', la:24.9560, ln:55.1580, c:8 },
  ]) await qr.query(`INSERT INTO charging_depots (id,name,location,latitude,longitude,"totalChargers","availableChargers","totalCapacityKw","currentLoadKw",status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [uuid(), dp.n, dp.l, dp.la, dp.ln, dp.c, dp.c-randInt(2,5), dp.c*150, rand(200,dp.c*100), 'operational']);
  console.log('🔌 4 charging depots');

  // ── 22. PERMITS (30) ──
  for (let i = 0; i < 30; i++) {
    const v = pick(vIds);
    await qr.query(`INSERT INTO permits (id,"vehicleId","permitType","permitNumber","issuingAuthority","issueDate","expiryDate",status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [uuid(), v.id, pick(['HAZMAT Transport','Operating License','Public Transport','Heavy Vehicle','Transit Permit']),
       `PRM-${randInt(10000,99999)}`, pick(['RTA Dubai','NCEMA','Dubai Municipality','MoI UAE']),
       daysAgo(randInt(30,365)).toISOString().split('T')[0], futureDate(randInt(-15,365)).toISOString().split('T')[0],
       pick(['active','active','active','expiring_soon','expired'])]);
  }
  console.log('📄 30 permits');

  // ── 23. PARTS (10) ──
  for (const p of [
    { pn:'BRK-PAD-HD-001', n:'Heavy Duty Brake Pads', c:'brakes', v:'Al Futtaim', pr:450 },
    { pn:'FLT-OIL-CAT-003', n:'Oil Filter CAT C15', c:'filters', v:'Al Masaood', pr:185 },
    { pn:'TRE-315-MIC-005', n:'315/80R22.5 Michelin', c:'tires', v:'Bridgestone ME', pr:2200 },
    { pn:'SEN-TEMP-PT100', n:'PT100 Temperature Sensor', c:'sensors', v:'Emerson ME', pr:580 },
    { pn:'PMP-FUEL-VOL-01', n:'Volvo FH16 Fuel Pump', c:'fuel_system', v:'Volvo Trucks UAE', pr:4500 },
    { pn:'BAT-12V-200AH', n:'12V 200Ah AGM Battery', c:'electrical', v:'NAPA Arabia', pr:850 },
    { pn:'CLT-ANTI-20L', n:'Antifreeze Coolant 20L', c:'fluids', v:'Shell Lubricants', pr:145 },
    { pn:'SHK-AIR-RR-001', n:'Air Suspension Shock', c:'suspension', v:'SAF-Holland', pr:1800 },
    { pn:'VLV-EGR-SCA-01', n:'EGR Valve Scania R500', c:'engine', v:'Scania Parts UAE', pr:3200 },
    { pn:'BLT-SRP-GEN-002', n:'Serpentine Belt MAN TGS', c:'belts', v:'Euro Parts Dubai', pr:320 },
  ]) await qr.query(`INSERT INTO parts_listings (id,"partNumber","partName",category,"vendorName","priceAed","stockQuantity","leadTimeDays",status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [uuid(), p.pn, p.n, p.c, p.v, p.pr, randInt(2,50), randInt(1,7), 'available']);
  console.log('🛒 10 parts listings');

  // ── 24. CHARGING STATIONS (8) ──
  for (const s of [
    { n:'DEWA EV — Mall of Emirates', o:'DEWA', a:'Al Barsha', la:25.1185, ln:55.2008, c:4, pw:150, pr:0.29 },
    { n:'ENOC E-Station — SZR', o:'ENOC', a:'Sheikh Zayed Rd', la:25.1350, ln:55.1920, c:6, pw:350, pr:0.29 },
    { n:'Tesla Supercharger — DIFC', o:'Tesla', a:'Gate Village', la:25.2100, ln:55.2790, c:8, pw:250, pr:0.35 },
    { n:'ADNOC E-Charge — Jebel Ali', o:'ADNOC', a:'Jebel Ali Industrial', la:25.0580, ln:55.1350, c:4, pw:150, pr:0.29 },
    { n:'DEWA — Business Bay', o:'DEWA', a:'Business Bay Metro', la:25.1851, ln:55.2629, c:6, pw:150, pr:0.29 },
    { n:'ChargePoint — Marina Mall', o:'ChargePoint', a:'Marina Mall P2', la:25.0774, ln:55.1396, c:4, pw:50, pr:0.32 },
    { n:'DEWA — DSO', o:'DEWA', a:'DSO HQ', la:25.1265, ln:55.3830, c:4, pw:150, pr:0.29 },
    { n:'ENOC — DXB Airport', o:'ENOC', a:'DXB T3 Car Park', la:25.2532, ln:55.3657, c:8, pw:150, pr:0.29 },
  ]) await qr.query(`INSERT INTO charging_stations (id,name,operator,address,latitude,longitude,"totalConnectors","availableConnectors","maxPowerKw",status,"pricePerKwh") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [uuid(), s.n, s.o, s.a, s.la, s.ln, s.c, s.c-randInt(0,2), s.pw, 'operational', s.pr]);
  console.log('⚡ 8 charging stations');

  // ── 25. TENANTS (3) ──
  for (const t of [
    { ti:'blue-edge', n:'Blue Edge Network', p:'#0891b2', s:'#06b6d4' },
    { ti:'enoc', n:'ENOC Fleet Services', p:'#16a34a', s:'#22c55e' },
    { ti:'rta', n:'RTA Dubai Transport', p:'#dc2626', s:'#ef4444' },
  ]) await qr.query(`INSERT INTO tenant_themes (id,"tenantId","tenantName","primaryColor","secondaryColor","backgroundColor",status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [uuid(), t.ti, t.n, t.p, t.s, '#0f172a', 'active']);
  console.log('🎨 3 tenants');

  // ── 26. BLOCKCHAIN (20) ──
  for (let i = 0; i < 20; i++)
    await qr.query(`INSERT INTO blockchain_records (id,"transactionHash","recordType","entityId","blockNumber","chainId",status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [uuid(), `0x${Array.from({length:64},()=>'0123456789abcdef'[randInt(0,15)]).join('')}`,
       pick(['custody_transfer','compliance_verification','payment_settlement','carbon_credit']),
       pick(vIds).id, String(1845600+i), 'hyperledger-fabric-1', 'confirmed']);
  console.log('⛓️  20 blockchain records');

  // ── 27. ANOMALIES (15) ──
  for (let i = 0; i < 15; i++) {
    const v = pick(vIds);
    await qr.query(`INSERT INTO anomalies (id,"vehicleId","anomalyType","confidenceScore",severity,description,status,"detectedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [uuid(), v.id, pick(['fuel_anomaly','route_deviation','telemetry_spike','behavior_change']),
       rand(75,98), pick(['critical','high','medium','low']),
       `Anomaly on ${v.plate}: ${pick(['Fuel 35% above baseline','Route deviation 2.5km','Temp spike compartment 2','Unusual stop pattern'])}`,
       pick(['open','open','investigating','resolved','false_positive']), hoursAgo(randInt(1,168))]);
  }
  console.log('🔍 15 anomalies');

  // ── 28. FATIGUE (25) ──
  for (let i = 0; i < 25; i++) {
    const sc = rand(5,85); const lv = sc>65?'high':sc>40?'medium':'low';
    await qr.query(`INSERT INTO fatigue_assessments (id,"driverId","riskScore","riskLevel","perclosScore","reactionTimeMs","hoursOnDuty","hoursSinceRest",status,"assessedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [uuid(), driverIds[i%25], sc, lv, rand(1,18), rand(200,500), randInt(1,10), randInt(1,12), 'active', hoursAgo(randInt(0,48))]);
  }
  console.log('😴 25 fatigue assessments');

  // ── 29. SHIPMENTS (15) ──
  for (let i = 0; i < 15; i++) {
    const tv = pick(tankerV); const o = pick(DUBAI_LOCATIONS); const d = pick(DUBAI_LOCATIONS.filter(l=>l.name!==o.name));
    await qr.query(`INSERT INTO shipment_trackings (id,"customerId","shipmentNumber","vehicleId",origin,destination,status,"progressPercent","estimatedArrival") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [uuid(), users.find(u=>u.role==='customer')!.id, `SH-2026-${String(4500+i).padStart(5,'0')}`,
       tv.id, o.name, d.name, pick(['in_transit','in_transit','delivered','loading']), rand(5,100), futureDate(rand(0,2))]);
  }
  console.log('📬 15 shipments');

  // ── 30. BORDER REGS (12) ──
  for (const br of [
    { c:'UAE', t:'HAZMAT Transport', a:'NCEMA', d:'ADR certification required for HAZMAT vehicles' },
    { c:'UAE', t:'Vehicle Registration', a:'RTA Dubai', d:'Annual technical inspection and insurance' },
    { c:'UAE', t:'Driver Requirements', a:'RTA Dubai', d:'UAE license, Emirates ID, medical fitness' },
    { c:'KSA', t:'Cross-Border Entry', a:'Saudi Customs', d:'TIR Carnet, Saudi visa, vehicle import permit' },
    { c:'KSA', t:'HAZMAT Transport', a:'GDCD', d:'GDCD permit, Arabic safety data sheets' },
    { c:'Oman', t:'Cross-Border Entry', a:'Royal Oman Police', d:'Entry visa and insurance extension' },
    { c:'Oman', t:'Fuel Transport', a:'Oman Oil', d:'Fuel quality cert and customs declaration' },
    { c:'Bahrain', t:'Cross-Border Entry', a:'Bahrain Customs', d:'King Fahd Causeway transit permit' },
    { c:'Kuwait', t:'Vehicle Standards', a:'Kuwait MoI', d:'GCC conformity and emission standards' },
    { c:'Qatar', t:'Cross-Border Entry', a:'Qatar Customs', d:'Abu Samra border documentation' },
    { c:'Switzerland', t:'EU ADR Compliance', a:'ASTRA', d:'ADR cert, driver CPC, tachograph' },
    { c:'Oman', t:'GCC Standards', a:'ROP Oman', d:'GCC vehicle standards, ROP inspection' },
  ]) await qr.query(`INSERT INTO border_regulations (id,country,"regulationType",description,authority,status) VALUES ($1,$2,$3,$4,$5,$6)`,
    [uuid(), br.c, br.t, br.d, br.a, 'active']);
  console.log('🌍 12 border regulations');

  // ── 31. LIFECYCLE (10) ──
  for (let i = 0; i < 10; i++) {
    const v = pick(vIds); const acq = rand(300000,1200000); const age = randInt(12,108);
    await qr.query(`INSERT INTO lifecycle_plans (id,"vehicleId",phase,"acquisitionCostAed","currentValueAed","totalMaintenanceCostAed","ageMonths","odometerKm","replacementVehicleType") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [uuid(), v.id, pick(['acquisition','early-life','mid-life','late-life','retirement']),
       acq, acq*(1-age*0.01), rand(20000,250000), age, rand(50000,450000),
       v.ft==='bus'?'Electric Bus (BYD K9)':null]);
  }
  console.log('📊 10 lifecycle plans');

  // ── SUMMARY ──
  console.log('\n' + '━'.repeat(55));
  console.log('✅ DATABASE SEEDING COMPLETE — ~1,263 records across 31 tables');
  console.log('━'.repeat(55));

  await qr.release();
  await ds.destroy();
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
