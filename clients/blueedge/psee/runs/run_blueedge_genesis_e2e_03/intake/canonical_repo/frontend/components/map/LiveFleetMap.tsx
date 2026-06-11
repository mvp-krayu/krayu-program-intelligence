// Extracted from dashboard.html — LiveFleetMap
// Line 1749 | 202 lines

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/hooks';
import { VEHICLE_POSITIONS, MARKER_COLORS, DUBAI_CENTER, MARKER_ICONS, GEOFENCE_ZONES } from '@/constants';

export default function LiveFleetMap({ height = 320, livePositions }: any) {
  const { t } = useI18n();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geofenceLayersRef = useRef([]);
  const heatLayersRef = useRef([]);
  const trailLayersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [showGeofences, setShowGeofences] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTrails, setShowTrails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (typeof L === 'undefined') return;

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(DUBAI_CENTER, 11);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const tileUrl = isLight
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);
    mapInstanceRef.current = map;

    VEHICLE_POSITIONS.forEach((v, i) => {
      const color = MARKER_COLORS[v.type];
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;position:relative">${MARKER_ICONS[v.type]}<div style="position:absolute;width:36px;height:36px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:pulse-dot 2s infinite;top:-6px;left:-6px"></div></div>`,
        iconSize: [28, 28], iconAnchor: [14, 14]
      });
      const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div class="popup-title">${v.plate} — ${v.type.toUpperCase()}</div>
        <div class="popup-detail">👤 ${v.driver}</div>
        <div class="popup-detail">📦 ${v.cargo}</div>
        <div class="popup-detail">🏎️ ${v.speed} km/h — <span style="color:${v.status==='active'?'#22c55e':'#f59e0b'}">${v.status}</span></div>
      `);
      marker.on('click', () => setSelectedVehicle(v));
      markersRef.current.push(marker);
    });

    setMapReady(true);

    const interval = setInterval(() => {
      markersRef.current.forEach((marker, i) => {
        const pos = marker.getLatLng();
        const v = VEHICLE_POSITIONS[i];
        if (v.speed > 0) {
          const dlat = (Math.random() - 0.5) * 0.002;
          const dlng = (Math.random() - 0.5) * 0.002;
          marker.setLatLng([pos.lat + dlat, pos.lng + dlng]);
        }
      });
    }, 3000);

    return () => { clearInterval(interval); map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Live WebSocket position updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !livePositions || livePositions.length === 0) return;

    // Update existing markers or create new ones for live positions
    const typeColors: Record<string, string> = { tanker: '#f59e0b', bus: '#3b82f6', taxi: '#22c55e' };
    livePositions.forEach((pos: any) => {
      const existing = markersRef.current.find((m: any) => m._vehicleId === pos.vehicleId);
      if (existing) {
        existing.setLatLng([pos.lat, pos.lng]);
        if (existing.getPopup()) {
          existing.setPopupContent(`<b>${pos.vehicleId}</b><br/>${pos.speed} km/h · ${pos.status}<br/>${pos.fleetType}`);
        }
      } else {
        try {
          const color = typeColors[pos.fleetType] || '#94a3b8';
          const m = (L as any).circleMarker([pos.lat, pos.lng], { radius: 6, fillColor: color, color: '#fff', weight: 1, fillOpacity: 0.9 })
            .bindPopup(`<b>${pos.vehicleId}</b><br/>${pos.speed} km/h · ${pos.status}<br/>${pos.fleetType}`)
            .addTo(map);
          (m as any)._vehicleId = pos.vehicleId;
          markersRef.current.push(m);
        } catch {}
      }
    });
  }, [livePositions]);

  // Geofence toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    geofenceLayersRef.current.forEach(l => map.removeLayer(l));
    geofenceLayersRef.current = [];
    if (!showGeofences) return;

    GEOFENCE_ZONES.forEach(gz => {
      if (gz.points) {
        // Corridor polyline
        const line = L.polyline(gz.points, { color: gz.color, weight: 4, opacity: 0.6, dashArray: '8,6' }).addTo(map);
        const bufferLine = L.polyline(gz.points, { color: gz.color, weight: gz.width ? gz.width / 50 : 12, opacity: 0.1 }).addTo(map);
        const label = L.marker(gz.points[Math.floor(gz.points.length / 2)], {
          icon: L.divIcon({ className: 'geofence-label', html: `<span style="color:${gz.color}">${gz.name}</span>`, iconSize: [120, 20], iconAnchor: [60, 10] })
        }).addTo(map);
        geofenceLayersRef.current.push(line, bufferLine, label);
      } else {
        // Circle zone
        const circle = L.circle([gz.lat, gz.lng], {
          radius: gz.radius, color: gz.color, fillColor: gz.color, fillOpacity: 0.08,
          weight: 2, dashArray: gz.type === 'restricted' ? '6,4' : ''
        }).addTo(map);
        const label = L.marker([gz.lat, gz.lng], {
          icon: L.divIcon({ className: 'geofence-label', html: `<span style="color:${gz.color}">${gz.type === 'restricted' ? '⛔ ' : ''}${gz.name}</span>`, iconSize: [140, 20], iconAnchor: [70, 10] })
        }).addTo(map);
        geofenceLayersRef.current.push(circle, label);
      }
    });
  }, [showGeofences, mapReady]);

  // Heatmap toggle — simple gradient circles representing activity density
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    heatLayersRef.current.forEach(l => map.removeLayer(l));
    heatLayersRef.current = [];
    if (!showHeatmap) return;

    // Generate heatmap points around vehicle positions
    const heatPoints = [];
    VEHICLE_POSITIONS.forEach(v => {
      const intensity = v.speed > 0 ? 0.8 : 0.3;
      heatPoints.push({ lat: v.lat, lng: v.lng, r: 2500, intensity });
      // Add nearby activity clusters
      for (let j = 0; j < 3; j++) {
        heatPoints.push({
          lat: v.lat + (Math.random() - 0.5) * 0.04,
          lng: v.lng + (Math.random() - 0.5) * 0.04,
          r: 1500 + Math.random() * 2000,
          intensity: 0.2 + Math.random() * 0.4
        });
      }
    });

    heatPoints.forEach(pt => {
      const circle = L.circle([pt.lat, pt.lng], {
        radius: pt.r,
        color: 'transparent',
        fillColor: pt.intensity > 0.6 ? '#ef4444' : pt.intensity > 0.3 ? '#f59e0b' : '#22c55e',
        fillOpacity: pt.intensity * 0.25,
        interactive: false
      }).addTo(map);
      heatLayersRef.current.push(circle);
    });
  }, [showHeatmap, mapReady]);

  // Route trail toggle — show simulated trail for all active vehicles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    trailLayersRef.current.forEach(l => map.removeLayer(l));
    trailLayersRef.current = [];
    if (!showTrails) return;

    VEHICLE_POSITIONS.filter(v => v.speed > 0).forEach(v => {
      const color = MARKER_COLORS[v.type];
      // Generate a simulated trail (last ~8 positions)
      const trail = [];
      let lat = v.lat, lng = v.lng;
      for (let p = 0; p < 8; p++) {
        trail.unshift([lat, lng]);
        lat -= (Math.random() * 0.008 + 0.002);
        lng -= (Math.random() - 0.5) * 0.01;
      }
      const line = L.polyline(trail, { color, weight: 3, opacity: 0.6, dashArray: '' }).addTo(map);
      // Trail dots
      trail.forEach((pt, i) => {
        const dot = L.circleMarker(pt, {
          radius: 2 + i * 0.5, color, fillColor: color, fillOpacity: 0.15 + i * 0.1,
          weight: 1, interactive: false
        }).addTo(map);
        trailLayersRef.current.push(dot);
      });
      // Direction arrow at vehicle position
      const arrow = L.marker([v.lat, v.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="color:${color};font-size:10px;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,0.6)">${v.speed}km/h →</div>`,
          iconSize: [60, 14], iconAnchor: [-16, 7]
        })
      }).addTo(map);
      trailLayersRef.current.push(line, arrow);
    });
  }, [showTrails, mapReady]);

  const counts = { tanker: VEHICLE_POSITIONS.filter(v => v.type==='tanker').length, bus: VEHICLE_POSITIONS.filter(v => v.type==='bus').length, taxi: VEHICLE_POSITIONS.filter(v => v.type==='taxi').length };
  const activeCount = VEHICLE_POSITIONS.filter(v => v.status==='active').length;

  return (
    <div>
      <div className="fleet-map" style={{height}}>
        <div ref={mapRef} style={{height:'100%',width:'100%'}} />
        <div className="map-controls">
          <button className={`map-ctrl-btn ${showGeofences ? 'active' : ''}`} onClick={() => setShowGeofences(!showGeofences)} title="Geofence Zones">🔲</button>
          <button className={`map-ctrl-btn ${showHeatmap ? 'active' : ''}`} onClick={() => setShowHeatmap(!showHeatmap)} title="Activity Heatmap">🔥</button>
          <button className={`map-ctrl-btn ${showTrails ? 'active' : ''}`} onClick={() => setShowTrails(!showTrails)} title="Vehicle Trails">〰️</button>
        </div>
        <div className="map-legend">
          <div style={{fontWeight:600,marginBottom:4,color:'var(--text-primary)'}}>{t('Fleet Legend')}</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{background:MARKER_COLORS.tanker}}/> {t('Tankers')} ({counts.tanker})</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{background:MARKER_COLORS.bus}}/> {t('Buses')} ({counts.bus})</div>
          <div className="map-legend-item"><div className="map-legend-dot" style={{background:MARKER_COLORS.taxi}}/> {t('Taxis')} ({counts.taxi})</div>
          {showGeofences && <div style={{borderTop:'1px solid var(--border)',marginTop:4,paddingTop:4}}>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'#f59e0b'}}/> Depots</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'#ef4444'}}/> Restricted</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'#a855f7'}}/> Corridors</div>
          </div>}
        </div>
      </div>
      <div className="map-stats-bar">
        <div className="mstat"><span>{t('Tracking:')}</span><span className="mstat-val">{VEHICLE_POSITIONS.length}</span></div>
        <div className="mstat"><span>{t('Active:')}</span><span className="mstat-val" style={{color:'var(--green)'}}>{activeCount}</span></div>
        <div className="mstat"><span>{t('Idle:')}</span><span className="mstat-val" style={{color:'var(--amber)'}}>{VEHICLE_POSITIONS.length - activeCount}</span></div>
        <div className="mstat"><span>{t('Avg Speed:')}</span><span className="mstat-val">{Math.round(VEHICLE_POSITIONS.reduce((a,v) => a + v.speed, 0) / VEHICLE_POSITIONS.length)} km/h</span></div>
        <div className="mstat"><span>{t('Geofences:')}</span><span className="mstat-val">{showGeofences ? GEOFENCE_ZONES.length : 'Off'}</span></div>
        {selectedVehicle && <div className="mstat" style={{marginLeft:'auto'}}><span>Selected:</span><span className="mstat-val">{selectedVehicle.plate}</span></div>}
      </div>
    </div>
  );
}
