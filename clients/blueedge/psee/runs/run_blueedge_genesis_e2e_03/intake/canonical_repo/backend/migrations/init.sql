-- ═══════════════════════════════════════════════════════════════════
-- Blue Edge Fleet Management — Initial Database Schema
-- PostgreSQL 16 + TimescaleDB
-- Generated from 61 TypeORM entities across 57 modules
-- ═══════════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- ─── CORE: Users & Auth ─────────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin','manager','dispatcher','driver','viewer','customer')),
    avatar_url VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(255),
    preferences JSONB,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    refresh_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Fleets ───────────────────────────────────────────────
CREATE TABLE fleets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    fleet_type VARCHAR(20) DEFAULT 'tanker' CHECK (fleet_type IN ('tanker','bus','taxi','mixed')),
    region VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
    vehicle_count INT DEFAULT 0,
    settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Vehicles ─────────────────────────────────────────────
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17) UNIQUE NOT NULL,
    plate_number VARCHAR(15) NOT NULL,
    fleet_id UUID REFERENCES fleets(id),
    vehicle_type VARCHAR(20) DEFAULT 'tanker' CHECK (vehicle_type IN ('tanker','bus','taxi')),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(30),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance','decommissioned')),
    specs JSONB,
    tank_config JSONB,
    insurance JSONB,
    last_known_position JSONB,
    current_speed_kmh FLOAT,
    heading FLOAT,
    odometer_km FLOAT,
    fuel_level_pct FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Drivers ──────────────────────────────────────────────
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_ar VARCHAR(100),
    last_name_ar VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','suspended','on_leave')),
    license JSONB,
    certifications JSONB,
    emergency_contact JSONB,
    safety_score FLOAT DEFAULT 100,
    efficiency_score FLOAT DEFAULT 100,
    compliance_score FLOAT DEFAULT 100,
    assigned_vehicle_id UUID REFERENCES vehicles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Trips ────────────────────────────────────────────────
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    fleet_id UUID NOT NULL REFERENCES fleets(id),
    driver_id UUID REFERENCES drivers(id),
    co_driver_id UUID REFERENCES drivers(id),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed','cancelled')),
    trip_type VARCHAR(30) DEFAULT 'tanker_delivery' CHECK (trip_type IN ('tanker_delivery','bus_route','taxi_ride','deadhead','maintenance')),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    start_lat FLOAT, start_lng FLOAT,
    end_lat FLOAT, end_lng FLOAT,
    start_address VARCHAR(255),
    end_address VARCHAR(255),
    distance_km FLOAT,
    duration_minutes FLOAT,
    fuel_used_l FLOAT,
    avg_speed_kmh FLOAT,
    max_speed_kmh FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Alerts ───────────────────────────────────────────────
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    fleet_id UUID REFERENCES fleets(id),
    trip_id UUID REFERENCES trips(id),
    severity VARCHAR(10) DEFAULT 'medium' CHECK (severity IN ('critical','high','medium','low','info')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','acknowledged','resolved','dismissed')),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message VARCHAR(500) NOT NULL,
    details JSONB,
    latitude FLOAT, longitude FLOAT,
    acknowledged_by UUID, acknowledged_at TIMESTAMPTZ,
    resolved_by UUID, resolved_at TIMESTAMPTZ,
    resolution VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CORE: Notifications ────────────────────────────────────────
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(10) DEFAULT 'info' CHECK (severity IN ('info','warning','error','success')),
    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    dismissed BOOLEAN DEFAULT false,
    channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app','email','sms','push','webhook')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Fuel Transactions ──────────────────────────────────
CREATE TABLE fuel_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    trip_id UUID REFERENCES trips(id),
    type VARCHAR(20) DEFAULT 'fill' CHECK (type IN ('fill','partial','theft_suspected','adjustment')),
    quantity_l FLOAT NOT NULL,
    cost_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    price_per_liter FLOAT,
    odometer_km FLOAT,
    station_name VARCHAR(200),
    latitude FLOAT, longitude FLOAT,
    fuel_card_number VARCHAR(50),
    fuel_type VARCHAR(30),
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Work Orders (Maintenance) ──────────────────────────
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','pending_parts','completed','cancelled')),
    type VARCHAR(20) DEFAULT 'corrective' CHECK (type IN ('preventive','corrective','emergency','predictive','inspection')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('critical','high','medium','low')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    estimated_hours FLOAT,
    actual_hours FLOAT,
    labor_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    parts JSONB,
    tasks JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Devices & IoT ─────────────────────────────────────
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    device_type VARCHAR(20) DEFAULT 'svg_gateway' CHECK (device_type IN ('svg_gateway','obd_dongle','dashcam','sensor','beacon')),
    status VARCHAR(20) DEFAULT 'provisioning' CHECK (status IN ('active','inactive','provisioning','maintenance','decommissioned')),
    firmware_version VARCHAR(50),
    hardware_version VARCHAR(50),
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    last_heartbeat TIMESTAMPTZ,
    capabilities JSONB,
    configuration JSONB,
    sim_iccid VARCHAR(100),
    imei VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: OTA Updates ────────────────────────────────────────
CREATE TABLE ota_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id),
    vehicle_id UUID REFERENCES vehicles(id),
    fleet_id UUID REFERENCES fleets(id),
    package_name VARCHAR(100) NOT NULL,
    from_version VARCHAR(30),
    to_version VARCHAR(30) NOT NULL,
    update_type VARCHAR(20) DEFAULT 'firmware' CHECK (update_type IN ('firmware','config','model','map','certificate','application')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','downloading','downloaded','installing','verifying','completed','failed','rolled_back','cancelled')),
    package_size BIGINT,
    checksum VARCHAR(64),
    progress_pct FLOAT DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INT DEFAULT 0,
    error_message TEXT,
    rollback_info JSONB,
    metadata JSONB,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Diagnostics ────────────────────────────────────────
CREATE TABLE diagnostic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    device_id UUID REFERENCES devices(id),
    dtc_code VARCHAR(10),
    description VARCHAR(200),
    system VARCHAR(30) DEFAULT 'powertrain' CHECK (system IN ('powertrain','chassis','body','network','manufacturer')),
    severity VARCHAR(10) DEFAULT 'medium' CHECK (severity IN ('critical','high','medium','low','info')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','pending','confirmed','cleared','resolved')),
    protocol VARCHAR(20) DEFAULT 'j1939' CHECK (protocol IN ('j1939','obd2','uds','proprietary')),
    spn INT,
    fmi INT,
    occurrence_count INT DEFAULT 1,
    first_seen TIMESTAMPTZ NOT NULL,
    cleared_at TIMESTAMPTZ,
    freeze_frame JSONB,
    raw_data JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Parts Marketplace ──────────────────────────────────
CREATE TABLE parts_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(50) NOT NULL,
    part_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    vendor_name VARCHAR(200) NOT NULL,
    price_aed DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    lead_time_days INT,
    status VARCHAR(20) DEFAULT 'available',
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS: Fleet Lifecycle ────────────────────────────────────
CREATE TABLE lifecycle_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    phase VARCHAR(30) NOT NULL,
    acquisition_cost_aed DECIMAL(12,2) DEFAULT 0,
    current_value_aed DECIMAL(12,2) DEFAULT 0,
    total_maintenance_cost_aed DECIMAL(12,2) DEFAULT 0,
    age_months INT DEFAULT 0,
    odometer_km INT DEFAULT 0,
    planned_retirement_date DATE,
    replacement_vehicle_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAFETY: Safety Events ──────────────────────────────────────
CREATE TABLE safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    trip_id UUID REFERENCES trips(id),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) DEFAULT 'medium' CHECK (severity IN ('critical','high','medium','low')),
    event_time TIMESTAMPTZ NOT NULL,
    duration_ms INT,
    latitude FLOAT, longitude FLOAT,
    speed_kmh FLOAT,
    heading FLOAT,
    sensor_data JSONB,
    video_evidence JSONB,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','acknowledged','reviewed','dismissed','escalated')),
    reviewed_by UUID,
    review_notes TEXT,
    ai_confidence FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAFETY: Compliance Records ─────────────────────────────────
CREATE TABLE compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    fleet_id UUID REFERENCES fleets(id),
    type VARCHAR(20) DEFAULT 'inspection' CHECK (type IN ('hos','dvir','inspection','certification','permit','emission','hazmat','insurance','registration')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('compliant','non_compliant','pending','expired','waiver')),
    authority VARCHAR(20) DEFAULT 'local' CHECK (authority IN ('fmcsa','dot','phmsa','epa','rta_dubai','adnoc','local')),
    issue_date DATE,
    effective_date DATE,
    expiry_date DATE,
    documents JSONB,
    findings JSONB,
    evidence JSONB,
    inspector VARCHAR(200),
    inspector_name VARCHAR(200),
    score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAFETY: Permits ────────────────────────────────────────────
CREATE TABLE permits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    permit_type VARCHAR(50) NOT NULL,
    permit_number VARCHAR(50) NOT NULL,
    issuing_authority VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    documents JSONB,
    renewal_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAFETY: Cross-Border Regulations ───────────────────────────
CREATE TABLE border_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country VARCHAR(100) NOT NULL,
    regulation_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    authority VARCHAR(200) NOT NULL,
    requirements JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SAFETY: Fatigue Assessment ─────────────────────────────────
CREATE TABLE fatigue_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    risk_score DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    perclos_score DECIMAL(5,2),
    reaction_time_ms DECIMAL(5,2),
    hours_on_duty INT DEFAULT 0,
    hours_since_rest INT DEFAULT 0,
    biomarkers JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: Products ───────────────────────────────────────────
CREATE TABLE tanker_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    un_number VARCHAR(20),
    hazmat_class VARCHAR(10),
    flash_point_c FLOAT,
    density_min FLOAT, density_max FLOAT,
    max_temp_c FLOAT,
    compatibility_group VARCHAR(20),
    sds_url TEXT,
    erg_guide VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: Cargo Manifests ────────────────────────────────────
CREATE TABLE cargo_manifests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    manifest_number VARCHAR(30) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','confirmed','in_transit','delivered','rejected')),
    customer_name VARCHAR(100),
    origin_facility VARCHAR(200),
    destination_facility VARCHAR(200),
    compartments JSONB,
    total_volume_l FLOAT,
    hazmat_info JSONB,
    documentation JSONB,
    loaded_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: Custody Transfers ──────────────────────────────────
CREATE TABLE custody_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manifest_id UUID NOT NULL REFERENCES cargo_manifests(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    trip_id UUID REFERENCES trips(id),
    transfer_type VARCHAR(20) DEFAULT 'loading' CHECK (transfer_type IN ('loading','unloading','transfer')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','disputed')),
    facility_name VARCHAR(200),
    latitude FLOAT, longitude FLOAT,
    compartment_readings JSONB,
    total_volume_l FLOAT,
    discrepancy_l FLOAT,
    temperature_c FLOAT,
    safety_checklist JSONB,
    operator_name VARCHAR(100),
    witness_name VARCHAR(100),
    signature_url VARCHAR(500),
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: HAZMAT Routes ──────────────────────────────────────
CREATE TABLE hazmat_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    origin VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    hazmat_classes VARCHAR(30),
    restrictions TEXT,
    time_restriction VARCHAR(50),
    waypoints_geojson JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','suspended','archived')),
    last_deviation_at TIMESTAMPTZ,
    deviation_count_30d INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: HAZMAT Permits ─────────────────────────────────────
CREATE TABLE hazmat_permits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permit_number VARCHAR(50) NOT NULL,
    authority VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL,
    hazmat_classes VARCHAR(30),
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'valid' CHECK (status IN ('valid','expiring','expired','suspended')),
    vehicle_ids TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TANKER: Safety Events ──────────────────────────────────────
CREATE TABLE tanker_safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    event_type VARCHAR(30) NOT NULL,
    severity VARCHAR(10) DEFAULT 'medium' CHECK (severity IN ('critical','high','medium','low')),
    description TEXT NOT NULL,
    sensor_data JSONB,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUS: Routes ────────────────────────────────────────────────
CREATE TABLE bus_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id),
    route_number VARCHAR(20) NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','suspended','planned','discontinued')),
    route_type VARCHAR(20) DEFAULT 'local' CHECK (route_type IN ('express','local','brt','feeder','shuttle')),
    distance_km FLOAT,
    estimated_minutes INT,
    stop_count INT DEFAULT 0,
    stops JSONB,
    schedule JSONB,
    fare_amount DECIMAL(8,2),
    currency VARCHAR(10) DEFAULT 'AED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUS: Stops ─────────────────────────────────────────────────
CREATE TABLE bus_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES bus_routes(id),
    stop_code VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200),
    latitude FLOAT NOT NULL, longitude FLOAT NOT NULL,
    sequence INT DEFAULT 0,
    has_accessibility BOOLEAN DEFAULT false,
    has_shelter BOOLEAN DEFAULT false,
    has_display BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','closed','temporary','planned')),
    avg_boardings_day INT DEFAULT 0,
    avg_alightings_day INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUS: Schedules ─────────────────────────────────────────────
CREATE TABLE bus_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES bus_routes(id),
    route_number VARCHAR(20) NOT NULL,
    day_type VARCHAR(20) DEFAULT 'weekday' CHECK (day_type IN ('weekday','friday','saturday','holiday')),
    first_departure VARCHAR(10),
    last_departure VARCHAR(10),
    headway_peak_min INT,
    headway_off_peak_min INT,
    trips_per_day INT,
    timetable JSONB,
    gtfs_service_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published','draft','archived')),
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUS: Dispatch ──────────────────────────────────────────────
CREATE TABLE bus_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    driver_name VARCHAR(100) NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    vehicle_number VARCHAR(20) NOT NULL,
    route_id UUID NOT NULL REFERENCES bus_routes(id),
    route_number VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    shift VARCHAR(20) DEFAULT 'morning' CHECK (shift IN ('morning','afternoon','evening','night','split')),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled','active','completed','cancelled','no_show')),
    trips_completed INT DEFAULT 0,
    total_passengers INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUS: Passenger Counts (TimescaleDB hypertable) ─────────────
CREATE TABLE bus_passenger_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    route_id UUID NOT NULL REFERENCES bus_routes(id),
    stop_id UUID REFERENCES bus_stops(id),
    trip_id UUID REFERENCES trips(id),
    boardings INT DEFAULT 0,
    alightings INT DEFAULT 0,
    onboard INT DEFAULT 0,
    capacity INT,
    load_factor_pct FLOAT,
    source VARCHAR(20) DEFAULT 'apc_sensor' CHECK (source IN ('apc_sensor','manual','estimated')),
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TAXI: Zones ────────────────────────────────────────────────
CREATE TABLE taxi_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    center_lat FLOAT NOT NULL,
    center_lng FLOAT NOT NULL,
    radius_m FLOAT DEFAULT 1000,
    zone_type VARCHAR(20) DEFAULT 'standard' CHECK (zone_type IN ('standard','airport','hotel','mall','business','residential','event')),
    surge_multiplier FLOAT DEFAULT 1.0,
    current_demand INT DEFAULT 0,
    available_taxis INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','surge')),
    base_fare DECIMAL(10,2),
    per_km_rate DECIMAL(10,2),
    per_min_rate DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TAXI: Drivers ──────────────────────────────────────────────
CREATE TABLE taxi_drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    license_number VARCHAR(20) NOT NULL,
    medallion_id VARCHAR(20),
    vehicle_number VARCHAR(20),
    rating FLOAT DEFAULT 5,
    total_trips INT DEFAULT 0,
    trips_today INT DEFAULT 0,
    revenue_today DECIMAL(10,2) DEFAULT 0,
    acceptance_rate FLOAT DEFAULT 0,
    cancellation_rate FLOAT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'off_duty' CHECK (status IN ('available','on_trip','on_break','off_duty','suspended')),
    current_shift VARCHAR(20) DEFAULT 'morning',
    last_lat FLOAT, last_lng FLOAT,
    phone VARCHAR(20),
    shift_started_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TAXI: Trips ────────────────────────────────────────────────
CREATE TABLE taxi_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id UUID NOT NULL REFERENCES taxi_drivers(id),
    trip_id UUID REFERENCES trips(id),
    status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested','accepted','en_route','in_progress','completed','cancelled','no_show')),
    booking_type VARCHAR(20) DEFAULT 'app_dispatch' CHECK (booking_type IN ('street_hail','app_dispatch','phone','corporate','airport')),
    pickup_lat FLOAT, pickup_lng FLOAT,
    pickup_address VARCHAR(255),
    dropoff_lat FLOAT, dropoff_lng FLOAT,
    dropoff_address VARCHAR(255),
    distance_km FLOAT,
    duration_minutes INT,
    base_fare DECIMAL(10,2),
    surge_multiplier DECIMAL(10,2),
    total_fare DECIMAL(10,2),
    tip_amount DECIMAL(10,2),
    payment_method VARCHAR(20) DEFAULT 'card' CHECK (payment_method IN ('cash','card','wallet','corporate')),
    rating FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TAXI: Payments ─────────────────────────────────────────────
CREATE TABLE taxi_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES taxi_trips(id),
    driver_id UUID NOT NULL REFERENCES taxi_drivers(id),
    total_fare DECIMAL(10,2) NOT NULL,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    driver_share DECIMAL(10,2) NOT NULL,
    company_share DECIMAL(10,2) NOT NULL,
    driver_split_pct FLOAT DEFAULT 80,
    method VARCHAR(20) DEFAULT 'card' CHECK (method IN ('cash','card','wallet','corporate','nol')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','settled','disputed','refunded')),
    settled_at TIMESTAMPTZ,
    currency VARCHAR(10) DEFAULT 'AED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TAXI: Surge Zones ──────────────────────────────────────────
CREATE TABLE surge_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    center_lat DECIMAL(10,6) NOT NULL,
    center_lng DECIMAL(10,6) NOT NULL,
    multiplier DECIMAL(5,2) DEFAULT 1.0,
    radius_km DECIMAL(5,2),
    demand_level INT DEFAULT 0,
    available_drivers INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'normal',
    pricing_tiers JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: Electric Vehicles ──────────────────────────────────
CREATE TABLE electric_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID UNIQUE NOT NULL REFERENCES vehicles(id),
    battery_capacity_kwh FLOAT NOT NULL,
    current_soc_pct FLOAT DEFAULT 0,
    battery_health_pct FLOAT DEFAULT 100,
    range_estimated_km FLOAT,
    range_actual_km FLOAT,
    charging_status VARCHAR(30) DEFAULT 'not_charging' CHECK (charging_status IN ('not_charging','charging_ac','charging_dc','scheduled','error')),
    charging_power_kw FLOAT,
    time_to_80_min INT,
    current_charger_id UUID,
    battery_cycles JSONB,
    thermal_data JSONB,
    total_energy_consumed_kwh INT DEFAULT 0,
    regen_energy_kwh FLOAT DEFAULT 0,
    charging_history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: Charging Stations ──────────────────────────────────
CREATE TABLE charging_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    address VARCHAR(300) NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    total_connectors INT DEFAULT 0,
    available_connectors INT DEFAULT 0,
    max_power_kw DECIMAL(6,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'operational',
    connector_types JSONB,
    price_per_kwh DECIMAL(6,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: Charging Depots ────────────────────────────────────
CREATE TABLE charging_depots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    location VARCHAR(300) NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    total_chargers INT DEFAULT 0,
    available_chargers INT DEFAULT 0,
    total_capacity_kw DECIMAL(8,2) DEFAULT 0,
    current_load_kw DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'operational',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: V2G Sessions ───────────────────────────────────────
CREATE TABLE v2g_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    charger_id UUID NOT NULL,
    contract_id UUID,
    direction VARCHAR(20) DEFAULT 'g2v_charge' CHECK (direction IN ('v2g_discharge','g2v_charge','v2h_home','v2b_building','bidirectional')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','paused','failed','scheduled','cancelled')),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    energy_kwh FLOAT DEFAULT 0,
    power_kw FLOAT,
    soc_start_pct FLOAT,
    soc_end_pct FLOAT,
    grid_frequency_hz FLOAT,
    revenue_aed DECIMAL(10,2) DEFAULT 0,
    cost_aed DECIMAL(10,2) DEFAULT 0,
    co2_offset_kg FLOAT,
    grid_signal_log JSONB,
    battery_impact JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: Electrification Plans ──────────────────────────────
CREATE TABLE electrification_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id),
    plan_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    total_vehicles INT DEFAULT 0,
    ev_target INT DEFAULT 0,
    estimated_cost_aed DECIMAL(12,2) DEFAULT 0,
    estimated_savings_aed DECIMAL(12,2) DEFAULT 0,
    payback_months INT DEFAULT 36,
    timeline JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ENERGY: Cold Chain ─────────────────────────────────────────
CREATE TABLE coldchain_shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    manifest_id UUID,
    trip_id UUID REFERENCES trips(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','breached','cancelled')),
    temperature_range JSONB NOT NULL,
    current_status VARCHAR(20) DEFAULT 'normal' CHECK (current_status IN ('normal','warning','breach','critical')),
    current_temp_c FLOAT,
    zones JSONB,
    sensor_readings JSONB,
    breach_events JSONB,
    loaded_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Predictions ──────────────────────────────────
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    component_type VARCHAR(50) NOT NULL,
    failure_probability DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('critical','high','medium','low')),
    predicted_failure_date DATE NOT NULL,
    remaining_useful_life_hours INT,
    remaining_useful_life_km INT,
    recommendation TEXT,
    estimated_repair_cost_aed DECIMAL(10,2),
    confidence_score DECIMAL(5,2) NOT NULL,
    model_inputs JSONB,
    contributing_factors JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','acknowledged','scheduled','resolved','expired')),
    work_order_id UUID REFERENCES work_orders(id),
    model_version VARCHAR(50) DEFAULT 'gradient_boost_v3',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Anomalies ────────────────────────────────────
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    anomaly_type VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    description TEXT,
    data_points JSONB,
    status VARCHAR(20) DEFAULT 'open',
    investigated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Driver Scoring ───────────────────────────────
CREATE TABLE driver_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    overall_score DECIMAL(5,2) NOT NULL,
    safety_score DECIMAL(5,2),
    efficiency_score DECIMAL(5,2),
    compliance_score DECIMAL(5,2),
    customer_score DECIMAL(5,2),
    event_breakdown JSONB,
    trend_data JSONB,
    score_period VARCHAR(20) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    rank INT DEFAULT 0,
    total_drivers INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Geofences ────────────────────────────────────
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'circle' CHECK (type IN ('circle','polygon','corridor')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive')),
    category VARCHAR(20) DEFAULT 'depot' CHECK (category IN ('depot','customer','restricted','fuel_station','loading','border','speed_zone')),
    geometry JSONB NOT NULL,
    rules JSONB,
    alerts JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Blockchain Records ───────────────────────────
CREATE TABLE blockchain_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_hash VARCHAR(200) NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(200) NOT NULL,
    block_number VARCHAR(50),
    chain_id VARCHAR(50),
    payload JSONB,
    status VARCHAR(20) DEFAULT 'confirmed',
    verified_by VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Data Products ────────────────────────────────
CREATE TABLE data_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(200) NOT NULL,
    stream VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    pricing_model VARCHAR(50),
    price_aed FLOAT,
    period VARCHAR(20),
    subscriber_list JSONB,
    subscriber_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    revenue_aed FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Agent Tasks ──────────────────────────────────
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type VARCHAR(50) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    target_entity VARCHAR(200),
    parameters JSONB,
    result JSONB,
    status VARCHAR(20) DEFAULT 'queued',
    confidence_score FLOAT,
    processing_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Road Segments ────────────────────────────────
CREATE TABLE road_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_code VARCHAR(50) NOT NULL,
    road_name VARCHAR(200) NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    roughness_index FLOAT,
    quality_score FLOAT,
    hazards JSONB,
    condition VARCHAR(20) DEFAULT 'good',
    last_survey_vehicles INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INTELLIGENCE: Executive Reports ────────────────────────────
CREATE TABLE executive_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,
    period VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'generated',
    generated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PEOPLE: Finance Transactions ───────────────────────────────
CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    driver_id UUID REFERENCES drivers(id),
    fleet_id UUID REFERENCES fleets(id),
    trip_id UUID REFERENCES trips(id),
    category VARCHAR(20) DEFAULT 'other' CHECK (category IN ('fuel','maintenance','toll','insurance','fine','lease','depreciation','tire','permit','salary','revenue','other')),
    type VARCHAR(20) DEFAULT 'expense' CHECK (type IN ('expense','revenue','refund','adjustment')),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    date DATE NOT NULL,
    description VARCHAR(300),
    vendor VARCHAR(100),
    invoice_number VARCHAR(50),
    reference_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected','cancelled')),
    approved_by UUID REFERENCES users(id),
    metadata JSONB,
    tags JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PEOPLE: Driver Incentive Programs ──────────────────────────
CREATE TABLE incentive_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reward_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    criteria JSONB,
    status VARCHAR(20) DEFAULT 'active',
    participant_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PEOPLE: Driver Sessions (Mobile) ───────────────────────────
CREATE TABLE driver_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id),
    device_id UUID REFERENCES devices(id),
    status VARCHAR(20) DEFAULT 'active',
    location JSONB,
    app_version VARCHAR(50),
    platform VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PEOPLE: Customer Shipment Tracking ─────────────────────────
CREATE TABLE shipment_trackings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    shipment_number VARCHAR(50) NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    origin VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'in_transit',
    progress_percent DECIMAL(5,2) DEFAULT 0,
    estimated_arrival TIMESTAMPTZ,
    sla_metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Tenants ──────────────────────────────────────────
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_setup',
    plan VARCHAR(20) DEFAULT 'starter',
    region VARCHAR(20) DEFAULT 'uae',
    trade_license_no VARCHAR(100),
    tax_registration_no VARCHAR(100),
    company_email VARCHAR(200),
    company_phone VARCHAR(30),
    address TEXT,
    emirate VARCHAR(50),
    country VARCHAR(100),
    logo_url VARCHAR(500),
    primary_color VARCHAR(10) DEFAULT '#0891b2',
    domain VARCHAR(200),
    max_vehicles INT DEFAULT 25,
    max_drivers INT DEFAULT 50,
    max_users INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Tenant Themes (White Label) ──────────────────────
CREATE TABLE tenant_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    tenant_name VARCHAR(200) NOT NULL,
    logo_url VARCHAR(500),
    primary_color VARCHAR(10) DEFAULT '#0891b2',
    secondary_color VARCHAR(10) DEFAULT '#06b6d4',
    background_color VARCHAR(10) DEFAULT '#0f172a',
    custom_styles JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Billing / Invoices ───────────────────────────────
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    subtotal DECIMAL(12,2) NOT NULL,
    vat_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    line_items JSONB,
    notes TEXT,
    stripe_invoice_id VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Onboarding ───────────────────────────────────────
CREATE TABLE onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'not_started',
    current_step INT DEFAULT 0,
    total_steps INT DEFAULT 6,
    step_data JSONB,
    completed_steps JSONB,
    completed_at TIMESTAMPTZ,
    progress_percent INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Messaging ────────────────────────────────────────
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    recipient_phone VARCHAR(30) NOT NULL,
    recipient_name VARCHAR(100),
    driver_id UUID REFERENCES drivers(id),
    template_id VARCHAR(100),
    content TEXT NOT NULL,
    content_arabic TEXT,
    status VARCHAR(20) DEFAULT 'queued',
    external_message_id VARCHAR(200),
    metadata JSONB,
    failure_reason TEXT,
    cost_aed DECIMAL(6,4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Digital Twins ────────────────────────────────────
CREATE TABLE digital_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    twin_type VARCHAR(20) NOT NULL,
    live_state JSONB NOT NULL,
    mesh_config JSONB,
    sensor_mappings JSONB,
    simulation_params JSONB,
    status VARCHAR(20) DEFAULT 'active',
    sync_fidelity DECIMAL(5,2) DEFAULT 100,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLATFORM: Aftersales Work Orders ───────────────────────────
CREATE TABLE aftersales_work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    order_type VARCHAR(50) NOT NULL,
    dtc_code VARCHAR(20),
    component VARCHAR(100),
    workshop_id VARCHAR(100),
    technician_id VARCHAR(100),
    parts_required JSONB,
    status VARCHAR(20) DEFAULT 'open',
    priority VARCHAR(10) DEFAULT 'medium',
    estimated_cost_aed FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT LOG ──────────────────────────────────────────────────
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(200),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(200),
    ip_address VARCHAR(50),
    status VARCHAR(20) DEFAULT 'success',
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════

-- Core lookups
CREATE INDEX idx_vehicles_fleet ON vehicles(fleet_id);
CREATE INDEX idx_vehicles_type ON vehicles(vehicle_type);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_time ON trips(start_time DESC);
CREATE INDEX idx_alerts_vehicle ON alerts(vehicle_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- Tanker
CREATE INDEX idx_manifests_vehicle ON cargo_manifests(vehicle_id);
CREATE INDEX idx_manifests_status ON cargo_manifests(status);
CREATE INDEX idx_custody_manifest ON custody_transfers(manifest_id);
CREATE INDEX idx_hazmat_routes_status ON hazmat_routes(status);

-- Bus
CREATE INDEX idx_bus_routes_fleet ON bus_routes(fleet_id);
CREATE INDEX idx_bus_stops_route ON bus_stops(route_id);
CREATE INDEX idx_bus_dispatch_date ON bus_dispatches(date);

-- Taxi
CREATE INDEX idx_taxi_trips_driver ON taxi_trips(driver_id);
CREATE INDEX idx_taxi_trips_status ON taxi_trips(status);
CREATE INDEX idx_taxi_payments_status ON taxi_payments(status);

-- Assets
CREATE INDEX idx_work_orders_vehicle ON work_orders(vehicle_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_fuel_vehicle ON fuel_transactions(vehicle_id);
CREATE INDEX idx_fuel_time ON fuel_transactions(timestamp DESC);
CREATE INDEX idx_devices_vehicle ON devices(vehicle_id);
CREATE INDEX idx_devices_status ON devices(status);

-- Safety
CREATE INDEX idx_safety_events_vehicle ON safety_events(vehicle_id);
CREATE INDEX idx_safety_events_severity ON safety_events(severity);
CREATE INDEX idx_compliance_vehicle ON compliance_records(vehicle_id);
CREATE INDEX idx_compliance_status ON compliance_records(status);
CREATE INDEX idx_compliance_expiry ON compliance_records(expiry_date);

-- Intelligence
CREATE INDEX idx_predictions_vehicle ON predictions(vehicle_id);
CREATE INDEX idx_predictions_risk ON predictions(risk_level);
CREATE INDEX idx_anomalies_vehicle ON anomalies(vehicle_id);
CREATE INDEX idx_driver_scores_driver ON driver_scores(driver_id);
CREATE INDEX idx_driver_scores_period ON driver_scores(score_period, period_start);

-- Finance
CREATE INDEX idx_finance_vehicle ON finance_transactions(vehicle_id);
CREATE INDEX idx_finance_date ON finance_transactions(date DESC);
CREATE INDEX idx_finance_category ON finance_transactions(category);

-- Audit
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_time ON audit_log(created_at DESC);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS: auto-update updated_at
-- ═══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at' AND table_schema = 'public'
        GROUP BY table_name
    LOOP
        EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
    END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════
-- TimescaleDB Hypertables for time-series data
-- ═══════════════════════════════════════════════════════════════════
-- SELECT create_hypertable('bus_passenger_counts', 'timestamp', if_not_exists => TRUE);
-- Uncomment above when TimescaleDB is enabled
