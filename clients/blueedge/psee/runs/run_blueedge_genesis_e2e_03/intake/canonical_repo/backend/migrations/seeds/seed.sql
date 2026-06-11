-- ═══════════════════════════════════════════════════════════════════
-- Blue Edge Fleet Management — Seed Data
-- Dubai/UAE context: Arabic names, AED currency, local locations
-- ═══════════════════════════════════════════════════════════════════

-- ─── USERS (5 roles) ────────────────────────────────────────────
INSERT INTO users (id, first_name, last_name, email, password_hash, role, phone, department, is_active) VALUES
('a0000001-0000-0000-0000-000000000001', 'Borhane', 'Admin', 'admin@blueedge.ae', '$2b$10$xK8v5RKZQ1q2q3r4s5t6uOdummy_hash_change_me', 'admin', '+971-50-100-0001', 'Executive', true),
('a0000001-0000-0000-0000-000000000002', 'Khalid', 'Al Maktoum', 'manager@blueedge.ae', '$2b$10$xK8v5RKZQ1q2q3r4s5t6uOdummy_hash_change_me', 'manager', '+971-50-100-0002', 'Fleet Operations', true),
('a0000001-0000-0000-0000-000000000003', 'Fatima', 'Al Zaabi', 'dispatch@blueedge.ae', '$2b$10$xK8v5RKZQ1q2q3r4s5t6uOdummy_hash_change_me', 'dispatcher', '+971-50-100-0003', 'Dispatch Center', true),
('a0000001-0000-0000-0000-000000000004', 'Ahmed', 'Al Mansouri', 'driver@blueedge.ae', '$2b$10$xK8v5RKZQ1q2q3r4s5t6uOdummy_hash_change_me', 'driver', '+971-50-100-0004', 'Tanker Division', true),
('a0000001-0000-0000-0000-000000000005', 'Sara', 'Al Hashimi', 'viewer@blueedge.ae', '$2b$10$xK8v5RKZQ1q2q3r4s5t6uOdummy_hash_change_me', 'viewer', '+971-50-100-0005', 'Compliance', true);

-- ─── TENANTS ────────────────────────────────────────────────────
INSERT INTO tenants (id, name, slug, status, plan, region, emirate, country, company_email, company_phone, primary_color, max_vehicles, max_drivers, max_users) VALUES
('b0000001-0000-0000-0000-000000000001', 'Blue Edge Network LLC', 'blueedge', 'active', 'enterprise', 'uae', 'Dubai', 'UAE', 'ops@blueedge.ae', '+971-4-123-4567', '#0891b2', 500, 800, 50),
('b0000001-0000-0000-0000-000000000002', 'Al Futtaim Logistics', 'alfuttaim', 'active', 'professional', 'uae', 'Dubai', 'UAE', 'fleet@alfuttaim.ae', '+971-4-234-5678', '#1e40af', 200, 300, 20),
('b0000001-0000-0000-0000-000000000003', 'Swiss Transit AG', 'swisstransit', 'active', 'professional', 'europe', 'Zurich', 'Switzerland', 'ops@swisstransit.ch', '+41-44-567-8901', '#dc2626', 100, 150, 15);

-- ─── FLEETS ─────────────────────────────────────────────────────
INSERT INTO fleets (id, org_id, name, fleet_type, region, status, vehicle_count) VALUES
('c0000001-0000-0000-0000-000000000001', 'blueedge', 'Tanker Division - Dubai', 'tanker', 'Dubai', 'active', 45),
('c0000001-0000-0000-0000-000000000002', 'blueedge', 'Bus Transit - Dubai Metro Feeder', 'bus', 'Dubai', 'active', 60),
('c0000001-0000-0000-0000-000000000003', 'blueedge', 'Taxi Operations - Dubai', 'taxi', 'Dubai', 'active', 120),
('c0000001-0000-0000-0000-000000000004', 'blueedge', 'Tanker Division - Jebel Ali', 'tanker', 'Abu Dhabi', 'active', 30),
('c0000001-0000-0000-0000-000000000005', 'swisstransit', 'Zurich City Bus', 'bus', 'Zurich', 'active', 40);

-- ─── VEHICLES (15 sample) ───────────────────────────────────────
INSERT INTO vehicles (id, vin, plate_number, fleet_id, vehicle_type, make, model, year, color, status, odometer_km) VALUES
-- Tankers
('d0000001-0000-0000-0000-000000000001', 'TK2024DXB000001A', 'DXB-T-10001', 'c0000001-0000-0000-0000-000000000001', 'tanker', 'Mercedes-Benz', 'Actros 3340', 2023, 'White', 'active', 45200),
('d0000001-0000-0000-0000-000000000002', 'TK2024DXB000002B', 'DXB-T-10002', 'c0000001-0000-0000-0000-000000000001', 'tanker', 'Volvo', 'FH16 750', 2024, 'White', 'active', 28700),
('d0000001-0000-0000-0000-000000000003', 'TK2024DXB000003C', 'DXB-T-10003', 'c0000001-0000-0000-0000-000000000001', 'tanker', 'MAN', 'TGS 33.480', 2023, 'White', 'maintenance', 62100),
('d0000001-0000-0000-0000-000000000004', 'TK2024JAL000004D', 'AUH-T-20001', 'c0000001-0000-0000-0000-000000000004', 'tanker', 'Scania', 'R500', 2024, 'Silver', 'active', 15800),
('d0000001-0000-0000-0000-000000000005', 'TK2024JAL000005E', 'AUH-T-20002', 'c0000001-0000-0000-0000-000000000004', 'tanker', 'DAF', 'XF 480', 2022, 'White', 'active', 89300),
-- Buses
('d0000001-0000-0000-0000-000000000006', 'BS2024DXB000006F', 'DXB-B-30001', 'c0000001-0000-0000-0000-000000000002', 'bus', 'Yutong', 'E12 Electric', 2024, 'Blue/White', 'active', 34500),
('d0000001-0000-0000-0000-000000000007', 'BS2024DXB000007G', 'DXB-B-30002', 'c0000001-0000-0000-0000-000000000002', 'bus', 'BYD', 'K9 eBus', 2023, 'Blue/White', 'active', 67200),
('d0000001-0000-0000-0000-000000000008', 'BS2024DXB000008H', 'DXB-B-30003', 'c0000001-0000-0000-0000-000000000002', 'bus', 'Volvo', '7900 Electric', 2024, 'Green/White', 'active', 22100),
('d0000001-0000-0000-0000-000000000009', 'BS2024DXB000009I', 'DXB-B-30004', 'c0000001-0000-0000-0000-000000000002', 'bus', 'MAN', "Lion's City E", 2023, 'Blue', 'active', 51800),
('d0000001-0000-0000-0000-000000000010', 'BS2024DXB000010J', 'DXB-B-30005', 'c0000001-0000-0000-0000-000000000002', 'bus', 'Mercedes-Benz', 'eCitaro', 2024, 'White', 'maintenance', 18300),
-- Taxis
('d0000001-0000-0000-0000-000000000011', 'TX2024DXB000011K', 'DXB-X-40001', 'c0000001-0000-0000-0000-000000000003', 'taxi', 'Toyota', 'Camry Hybrid', 2024, 'Beige/Red', 'active', 42600),
('d0000001-0000-0000-0000-000000000012', 'TX2024DXB000012L', 'DXB-X-40002', 'c0000001-0000-0000-0000-000000000003', 'taxi', 'Lexus', 'ES 300h', 2024, 'Beige/Red', 'active', 31200),
('d0000001-0000-0000-0000-000000000013', 'TX2024DXB000013M', 'DXB-X-40003', 'c0000001-0000-0000-0000-000000000003', 'taxi', 'Tesla', 'Model 3', 2024, 'White/Green', 'active', 19800),
('d0000001-0000-0000-0000-000000000014', 'TX2024DXB000014N', 'DXB-X-40004', 'c0000001-0000-0000-0000-000000000003', 'taxi', 'Toyota', 'Camry Hybrid', 2023, 'Beige/Red', 'active', 78500),
('d0000001-0000-0000-0000-000000000015', 'TX2024DXB000015O', 'DXB-X-40005', 'c0000001-0000-0000-0000-000000000003', 'taxi', 'Nissan', 'Leaf', 2024, 'White/Green', 'active', 12400);

-- ─── DRIVERS (12 sample with Arabic names) ──────────────────────
INSERT INTO drivers (id, employee_id, first_name, last_name, first_name_ar, last_name_ar, email, phone, status, safety_score, efficiency_score, assigned_vehicle_id) VALUES
('e0000001-0000-0000-0000-000000000001', 'DRV-001', 'Ahmed', 'Al Mansouri', 'أحمد', 'المنصوري', 'ahmed.m@blueedge.ae', '+971-55-101-0001', 'active', 94.5, 91.2, 'd0000001-0000-0000-0000-000000000001'),
('e0000001-0000-0000-0000-000000000002', 'DRV-002', 'Mohammed', 'Al Shamsi', 'محمد', 'الشامسي', 'mohammed.s@blueedge.ae', '+971-55-101-0002', 'active', 97.8, 95.1, 'd0000001-0000-0000-0000-000000000002'),
('e0000001-0000-0000-0000-000000000003', 'DRV-003', 'Omar', 'Al Ketbi', 'عمر', 'الكتبي', 'omar.k@blueedge.ae', '+971-55-101-0003', 'active', 88.2, 86.7, 'd0000001-0000-0000-0000-000000000003'),
('e0000001-0000-0000-0000-000000000004', 'DRV-004', 'Hassan', 'Al Nuaimi', 'حسن', 'النعيمي', 'hassan.n@blueedge.ae', '+971-55-101-0004', 'active', 92.1, 93.8, 'd0000001-0000-0000-0000-000000000006'),
('e0000001-0000-0000-0000-000000000005', 'DRV-005', 'Saeed', 'Al Dhaheri', 'سعيد', 'الظاهري', 'saeed.d@blueedge.ae', '+971-55-101-0005', 'active', 96.3, 94.0, 'd0000001-0000-0000-0000-000000000007'),
('e0000001-0000-0000-0000-000000000006', 'DRV-006', 'Rashid', 'Al Suwaidi', 'راشد', 'السويدي', 'rashid.s@blueedge.ae', '+971-55-101-0006', 'active', 91.0, 89.5, 'd0000001-0000-0000-0000-000000000008'),
('e0000001-0000-0000-0000-000000000007', 'DRV-007', 'Yousef', 'Al Marzouqi', 'يوسف', 'المرزوقي', 'yousef.m@blueedge.ae', '+971-55-101-0007', 'on_leave', 85.4, 82.1, NULL),
('e0000001-0000-0000-0000-000000000008', 'DRV-008', 'Ali', 'Al Hammadi', 'علي', 'الحمادي', 'ali.h@blueedge.ae', '+971-55-101-0008', 'active', 98.1, 96.7, 'd0000001-0000-0000-0000-000000000011'),
('e0000001-0000-0000-0000-000000000009', 'DRV-009', 'Khaled', 'Al Falasi', 'خالد', 'الفلاسي', 'khaled.f@blueedge.ae', '+971-55-101-0009', 'active', 93.6, 90.4, 'd0000001-0000-0000-0000-000000000012'),
('e0000001-0000-0000-0000-000000000010', 'DRV-010', 'Faisal', 'Al Muhairi', 'فيصل', 'المهيري', 'faisal.m@blueedge.ae', '+971-55-101-0010', 'active', 89.9, 91.5, 'd0000001-0000-0000-0000-000000000013'),
('e0000001-0000-0000-0000-000000000011', 'DRV-011', 'Sultan', 'Al Qassimi', 'سلطان', 'القاسمي', 'sultan.q@blueedge.ae', '+971-55-101-0011', 'active', 95.2, 93.0, 'd0000001-0000-0000-0000-000000000014'),
('e0000001-0000-0000-0000-000000000012', 'DRV-012', 'Nasser', 'Al Remeithi', 'ناصر', 'الريميثي', 'nasser.r@blueedge.ae', '+971-55-101-0012', 'active', 90.7, 88.3, 'd0000001-0000-0000-0000-000000000004');

-- ─── TANKER PRODUCTS ────────────────────────────────────────────
INSERT INTO tanker_products (id, name, un_number, hazmat_class, flash_point_c, density_min, density_max, max_temp_c, erg_guide, is_active) VALUES
('f0000001-0000-0000-0000-000000000001', 'Diesel (ULSD)', 'UN1202', '3', 52.0, 0.820, 0.845, 60.0, '128', true),
('f0000001-0000-0000-0000-000000000002', 'Gasoline (Super 98)', 'UN1203', '3', -43.0, 0.720, 0.775, 40.0, '128', true),
('f0000001-0000-0000-0000-000000000003', 'Jet A-1 (Aviation)', 'UN1863', '3', 38.0, 0.775, 0.840, 55.0, '128', true),
('f0000001-0000-0000-0000-000000000004', 'LPG (Propane)', 'UN1075', '2.1', -104.0, 0.493, 0.510, 50.0, '115', true),
('f0000001-0000-0000-0000-000000000005', 'Bitumen (Grade 60/70)', 'UN1999', '3', 250.0, 1.000, 1.050, 200.0, '128', true),
('f0000001-0000-0000-0000-000000000006', 'Naphtha (Light)', 'UN1268', '3', -20.0, 0.630, 0.730, 45.0, '128', true);

-- ─── HAZMAT ROUTES (Dubai) ──────────────────────────────────────
INSERT INTO hazmat_routes (id, name, origin, destination, hazmat_classes, time_restriction, status) VALUES
('f1000001-0000-0000-0000-000000000001', 'JAFZA-AlQuoz Diesel Route', 'JAFZA Terminal 4, Jebel Ali', 'Al Quoz Industrial 3', '3', 'No transit 07:00-09:00, 17:00-19:00', 'active'),
('f1000001-0000-0000-0000-000000000002', 'Jebel Ali-DXB Aviation Fuel', 'Jebel Ali Refinery', 'DXB Airport Fuel Farm', '3', 'Night only 22:00-05:00', 'active'),
('f1000001-0000-0000-0000-000000000003', 'Ruwais-Jebel Ali LPG', 'ADNOC Ruwais', 'ENOC Terminal, Jebel Ali', '2.1', '24h permitted, escort required', 'active'),
('f1000001-0000-0000-0000-000000000004', 'Fujairah-Dubai Naphtha', 'Fujairah Oil Terminal', 'Dubai Dry Dock', '3', 'No transit through Sharjah CBD', 'active');

-- ─── BUS ROUTES (Dubai RTA) ────────────────────────────────────
INSERT INTO bus_routes (id, fleet_id, route_number, route_name, status, route_type, distance_km, estimated_minutes, stop_count, fare_amount, currency) VALUES
('g0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'F55', 'Marina Loop Feeder', 'active', 'feeder', 8.5, 25, 12, 3.00, 'AED'),
('g0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'E303', 'Airport Express - DXB T3', 'active', 'express', 22.0, 35, 8, 5.00, 'AED'),
('g0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000002', 'E101', 'Creek-Deira Express', 'active', 'express', 15.3, 30, 10, 4.00, 'AED'),
('g0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000002', 'F09', 'JBR Beach Shuttle', 'active', 'shuttle', 5.2, 15, 7, 2.00, 'AED'),
('g0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000002', 'C28', 'Business Bay-DIFC Local', 'active', 'local', 12.1, 40, 18, 3.00, 'AED');

-- ─── BUS STOPS (Dubai) ──────────────────────────────────────────
INSERT INTO bus_stops (id, route_id, stop_code, name, name_ar, latitude, longitude, sequence, has_shelter, has_display, has_accessibility, status) VALUES
('g1000001-0000-0000-0000-000000000001', 'g0000001-0000-0000-0000-000000000001', 'F55-01', 'Dubai Marina Mall', 'دبي مارينا مول', 25.0772, 55.1390, 1, true, true, true, 'active'),
('g1000001-0000-0000-0000-000000000002', 'g0000001-0000-0000-0000-000000000001', 'F55-02', 'JBR Walk 1', 'ممشى جي بي آر 1', 25.0794, 55.1350, 2, true, true, true, 'active'),
('g1000001-0000-0000-0000-000000000003', 'g0000001-0000-0000-0000-000000000001', 'F55-03', 'Marina Promenade', 'مارينا بروميناد', 25.0750, 55.1420, 3, true, false, true, 'active'),
('g1000001-0000-0000-0000-000000000004', 'g0000001-0000-0000-0000-000000000002', 'E303-01', 'DXB Airport Terminal 3', 'مطار دبي الدولي - صالة 3', 25.2532, 55.3657, 1, true, true, true, 'active'),
('g1000001-0000-0000-0000-000000000005', 'g0000001-0000-0000-0000-000000000002', 'E303-02', 'Deira City Centre', 'ديرة سيتي سنتر', 25.2524, 55.3310, 2, true, true, true, 'active'),
('g1000001-0000-0000-0000-000000000006', 'g0000001-0000-0000-0000-000000000003', 'E101-01', 'Dubai Creek Tower', 'برج خور دبي', 25.2200, 55.3400, 1, true, true, true, 'active'),
('g1000001-0000-0000-0000-000000000007', 'g0000001-0000-0000-0000-000000000003', 'E101-02', 'Gold Souk Station', 'محطة سوق الذهب', 25.2690, 55.2970, 2, true, true, false, 'active'),
('g1000001-0000-0000-0000-000000000008', 'g0000001-0000-0000-0000-000000000004', 'F09-01', 'The Walk JBR', 'ذا ووك جي بي آر', 25.0786, 55.1341, 1, true, false, true, 'active');

-- ─── TAXI ZONES (Dubai) ─────────────────────────────────────────
INSERT INTO taxi_zones (id, name, name_ar, center_lat, center_lng, radius_m, zone_type, base_fare, per_km_rate, per_min_rate, status) VALUES
('h0000001-0000-0000-0000-000000000001', 'Dubai Mall / Burj Khalifa', 'دبي مول / برج خليفة', 25.1972, 55.2744, 800, 'mall', 12.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000002', 'DXB Airport Terminal 1', 'مطار دبي - صالة 1', 25.2532, 55.3657, 1200, 'airport', 25.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000003', 'DXB Airport Terminal 3', 'مطار دبي - صالة 3', 25.2470, 55.3520, 1000, 'airport', 25.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000004', 'JBR / Marina Walk', 'جي بي آر / مارينا ووك', 25.0794, 55.1350, 600, 'hotel', 12.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000005', 'DIFC', 'مركز دبي المالي العالمي', 25.2100, 55.2750, 500, 'business', 12.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000006', 'Palm Jumeirah', 'نخلة جميرا', 25.1124, 55.1390, 1500, 'residential', 12.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000007', 'Mall of the Emirates', 'مول الإمارات', 25.1181, 55.2006, 600, 'mall', 12.00, 2.19, 0.58, 'active'),
('h0000001-0000-0000-0000-000000000008', 'Deira Gold Souk', 'سوق الذهب - ديرة', 25.2690, 55.2970, 500, 'standard', 12.00, 2.19, 0.58, 'active');

-- ─── TAXI DRIVERS ───────────────────────────────────────────────
INSERT INTO taxi_drivers (id, name, name_ar, license_number, medallion_id, vehicle_number, rating, total_trips, status, phone) VALUES
('h1000001-0000-0000-0000-000000000001', 'Ali Al Hammadi', 'علي الحمادي', 'TXL-2024-001', 'MED-001', 'DXB-X-40001', 4.9, 4520, 'available', '+971-55-201-0001'),
('h1000001-0000-0000-0000-000000000002', 'Khaled Al Falasi', 'خالد الفلاسي', 'TXL-2024-002', 'MED-002', 'DXB-X-40002', 4.8, 3890, 'on_trip', '+971-55-201-0002'),
('h1000001-0000-0000-0000-000000000003', 'Faisal Al Muhairi', 'فيصل المهيري', 'TXL-2024-003', 'MED-003', 'DXB-X-40003', 4.7, 2150, 'available', '+971-55-201-0003'),
('h1000001-0000-0000-0000-000000000004', 'Sultan Al Qassimi', 'سلطان القاسمي', 'TXL-2024-004', 'MED-004', 'DXB-X-40004', 4.6, 5670, 'on_break', '+971-55-201-0004'),
('h1000001-0000-0000-0000-000000000005', 'Ibrahim Al Tayer', 'إبراهيم الطاير', 'TXL-2024-005', 'MED-005', 'DXB-X-40005', 4.9, 1890, 'available', '+971-55-201-0005');

-- ─── CHARGING STATIONS (Dubai DEWA / ENOC) ──────────────────────
INSERT INTO charging_stations (id, name, operator, address, latitude, longitude, total_connectors, available_connectors, max_power_kw, status, price_per_kwh) VALUES
('i0000001-0000-0000-0000-000000000001', 'DEWA EV Green Charger - Mall of Emirates', 'DEWA', 'Mall of the Emirates, Al Barsha', 25.1181, 55.2006, 8, 5, 150.00, 'operational', 0.29),
('i0000001-0000-0000-0000-000000000002', 'ENOC Link - DIFC Gate', 'ENOC', 'DIFC Gate Avenue, Dubai', 25.2100, 55.2750, 4, 3, 50.00, 'operational', 0.33),
('i0000001-0000-0000-0000-000000000003', 'DEWA EV Station - JBR', 'DEWA', 'The Walk, JBR', 25.0786, 55.1341, 6, 2, 150.00, 'operational', 0.29),
('i0000001-0000-0000-0000-000000000004', 'Tesla Supercharger - Dubai Hills', 'Tesla', 'Dubai Hills Mall', 25.1032, 55.2449, 12, 8, 250.00, 'operational', 0.35),
('i0000001-0000-0000-0000-000000000005', 'ADNOC EV Hub - Jebel Ali', 'ADNOC', 'ADNOC Service Station, Jebel Ali', 25.0070, 55.0690, 6, 6, 100.00, 'operational', 0.31);

-- ─── WORK ORDERS (Maintenance) ──────────────────────────────────
INSERT INTO work_orders (id, order_number, vehicle_id, status, type, priority, title, description, scheduled_date, estimated_hours, labor_cost, parts_cost, total_cost) VALUES
('j0000001-0000-0000-0000-000000000001', 'WO-2026-0001', 'd0000001-0000-0000-0000-000000000003', 'in_progress', 'preventive', 'medium', 'Annual Service - Tanker T-10003', 'Full annual service: oil change, brake inspection, tank integrity check, HAZMAT seal verification', NOW() - INTERVAL '1 day', 8.0, 1200.00, 3500.00, 4700.00),
('j0000001-0000-0000-0000-000000000002', 'WO-2026-0002', 'd0000001-0000-0000-0000-000000000010', 'open', 'corrective', 'high', 'Battery Module Replacement - Bus B-30005', 'Replace degraded battery module #3, recalibrate BMS', NOW() + INTERVAL '2 days', 6.0, 800.00, 18500.00, 19300.00),
('j0000001-0000-0000-0000-000000000003', 'WO-2026-0003', 'd0000001-0000-0000-0000-000000000011', 'completed', 'inspection', 'low', 'RTA Annual Inspection - Taxi X-40001', 'Annual RTA roadworthiness inspection', NOW() - INTERVAL '7 days', 2.0, 350.00, 0.00, 350.00),
('j0000001-0000-0000-0000-000000000004', 'WO-2026-0004', 'd0000001-0000-0000-0000-000000000006', 'open', 'predictive', 'medium', 'Tire Replacement Predicted - Bus B-30001', 'ML model predicts front-left tire failure within 5000km', NOW() + INTERVAL '5 days', 1.5, 200.00, 2800.00, 3000.00);

-- ─── FUEL TRANSACTIONS ──────────────────────────────────────────
INSERT INTO fuel_transactions (id, vehicle_id, driver_id, type, quantity_l, cost_amount, price_per_liter, station_name, fuel_type, timestamp) VALUES
('k0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'fill', 380.0, 1064.00, 2.80, 'ENOC Station - Jebel Ali FZ', 'Diesel', NOW() - INTERVAL '2 hours'),
('k0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000002', 'fill', 420.0, 1176.00, 2.80, 'ADNOC Station - Al Quoz', 'Diesel', NOW() - INTERVAL '5 hours'),
('k0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000011', 'e0000001-0000-0000-0000-000000000008', 'fill', 52.0, 166.40, 3.20, 'ENOC Station - Sheikh Zayed Rd', 'Super 98', NOW() - INTERVAL '8 hours'),
('k0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000014', 'e0000001-0000-0000-0000-000000000011', 'fill', 48.0, 153.60, 3.20, 'ADNOC Station - Business Bay', 'Super 98', NOW() - INTERVAL '12 hours');

-- ─── ALERTS ─────────────────────────────────────────────────────
INSERT INTO alerts (id, vehicle_id, driver_id, severity, status, type, title, message, latitude, longitude) VALUES
('l0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'high', 'active', 'speed_violation', 'Speed Limit Exceeded', 'Vehicle DXB-T-10001 traveling at 95 km/h in 80 km/h zone on E311', 25.0500, 55.1200),
('l0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000003', NULL, 'critical', 'active', 'maintenance_overdue', 'Overdue Service', 'Tank integrity check overdue by 12 days for DXB-T-10003', 25.0070, 55.0690),
('l0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000007', 'e0000001-0000-0000-0000-000000000005', 'medium', 'acknowledged', 'harsh_braking', 'Harsh Braking Detected', 'Bus DXB-B-30002 harsh braking event near Gold Souk Station', 25.2690, 55.2970),
('l0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000013', 'e0000001-0000-0000-0000-000000000010', 'low', 'resolved', 'low_battery', 'Low Battery Alert', 'Tesla Model 3 DXB-X-40003 battery at 12%, nearest charger 2.1km', 25.1972, 55.2744);

-- ─── GEOFENCES (Dubai) ──────────────────────────────────────────
INSERT INTO geofences (id, org_id, name, type, status, category, geometry, description) VALUES
('m0000001-0000-0000-0000-000000000001', 'blueedge', 'JAFZA Terminal 4 Depot', 'circle', 'active', 'depot', '{"center":{"lat":25.0070,"lng":55.0690},"radiusM":500}', 'Main tanker depot at JAFZA Terminal 4'),
('m0000001-0000-0000-0000-000000000002', 'blueedge', 'Al Quoz Industrial Zone', 'polygon', 'active', 'customer', '{"coordinates":[{"lat":25.1400,"lng":55.2200},{"lat":25.1400,"lng":55.2400},{"lat":25.1200,"lng":55.2400},{"lat":25.1200,"lng":55.2200}]}', 'Al Quoz delivery area'),
('m0000001-0000-0000-0000-000000000003', 'blueedge', 'DXB Airport Restricted Zone', 'circle', 'active', 'restricted', '{"center":{"lat":25.2532,"lng":55.3657},"radiusM":2000}', 'Airport restricted zone - HAZMAT prohibited'),
('m0000001-0000-0000-0000-000000000004', 'blueedge', 'Bus Depot - Al Awir', 'circle', 'active', 'depot', '{"center":{"lat":25.1600,"lng":55.4100},"radiusM":300}', 'Main bus maintenance and overnight depot'),
('m0000001-0000-0000-0000-000000000005', 'blueedge', 'ENOC Fuel Station - SZR', 'circle', 'active', 'fuel_station', '{"center":{"lat":25.1750,"lng":55.2500},"radiusM":100}', 'ENOC fuel station on Sheikh Zayed Road');

-- ─── CARGO MANIFESTS ────────────────────────────────────────────
INSERT INTO cargo_manifests (id, vehicle_id, manifest_number, status, customer_name, origin_facility, destination_facility, total_volume_l, hazmat_info) VALUES
('n0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'CM-2026-00001', 'in_transit', 'ENOC Distribution', 'JAFZA Terminal 4', 'Al Quoz Industrial 3 - ENOC Depot', 32000.0, '{"unNumber":"UN1202","hazClass":"3","packingGroup":"III","erg":"128"}'),
('n0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'CM-2026-00002', 'confirmed', 'Dubai Aviation', 'Jebel Ali Refinery', 'DXB Airport Fuel Farm', 40000.0, '{"unNumber":"UN1863","hazClass":"3","packingGroup":"III","erg":"128"}'),
('n0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000004', 'CM-2026-00003', 'delivered', 'ADNOC Retail', 'ADNOC Ruwais Terminal', 'ADNOC Station - Business Bay', 28000.0, '{"unNumber":"UN1203","hazClass":"3","packingGroup":"II","erg":"128"}');

-- Complete
SELECT 'Seed data loaded successfully' AS status,
       (SELECT COUNT(*) FROM users) AS users,
       (SELECT COUNT(*) FROM fleets) AS fleets,
       (SELECT COUNT(*) FROM vehicles) AS vehicles,
       (SELECT COUNT(*) FROM drivers) AS drivers,
       (SELECT COUNT(*) FROM bus_routes) AS bus_routes,
       (SELECT COUNT(*) FROM taxi_zones) AS taxi_zones,
       (SELECT COUNT(*) FROM tanker_products) AS tanker_products;
