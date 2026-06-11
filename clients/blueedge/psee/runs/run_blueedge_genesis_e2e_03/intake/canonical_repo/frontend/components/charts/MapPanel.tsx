// MapPanel — Lightweight inline Leaflet map for fleet page contexts
// Session 26: supports markers, routes, zones, heatmap points

import React, { useEffect, useRef, useState } from 'react';

interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  icon?: string;
  popup?: string;
}

interface MapRoute {
  points: [number, number][];
  color?: string;
  label?: string;
  dashed?: boolean;
}

interface MapZone {
  lat: number;
  lng: number;
  radius: number;
  color?: string;
  label?: string;
}

interface MapPanelProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  zones?: MapZone[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  title?: string;
  showControls?: boolean;
  className?: string;
}

const DUBAI_CENTER: [number, number] = [25.2048, 55.2708];

export default function MapPanel({
  markers = [], routes = [], zones = [],
  center = DUBAI_CENTER, zoom = 11, height = 280,
  title, showControls = false, className = '',
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (typeof (window as any).L === 'undefined') return;
    const L = (window as any).L;

    const map = L.map(mapRef.current, {
      zoomControl: showControls,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView(center, zoom);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const tileUrl = isLight
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);
    mapInstanceRef.current = map;
    setReady(true);

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Draw layers when ready
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !ready) return;
    const L = (window as any).L;

    // Zones
    zones.forEach(z => {
      const circle = L.circle([z.lat, z.lng], {
        radius: z.radius,
        color: z.color || '#06d6d6',
        fillColor: z.color || '#06d6d6',
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(map);
      if (z.label) circle.bindTooltip(z.label, { permanent: false, direction: 'top' });
    });

    // Routes
    routes.forEach(r => {
      L.polyline(r.points, {
        color: r.color || '#3b82f6',
        weight: 3,
        opacity: 0.8,
        dashArray: r.dashed ? '8,6' : '',
      }).addTo(map);
      if (r.label && r.points.length > 1) {
        const mid = r.points[Math.floor(r.points.length / 2)];
        L.marker(mid, {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:${r.color || '#3b82f6'};color:#fff;font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;white-space:nowrap;font-family:DM Sans,sans-serif">${r.label}</div>`,
            iconSize: [0, 0],
          }),
        }).addTo(map);
      }
    });

    // Markers
    markers.forEach(m => {
      const c = m.color || '#06d6d6';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${c};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:2px solid rgba(255,255,255,0.8);box-shadow:0 2px 6px rgba(0,0,0,0.3)">${m.icon || '●'}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (m.popup) marker.bindPopup(m.popup);
      else if (m.label) marker.bindTooltip(m.label, { permanent: false, direction: 'top' });
    });

  }, [ready, markers.length, routes.length, zones.length]);

  return (
    <div className={`chart-card ${className}`}>
      {title && <h4>{title}</h4>}
      <div
        ref={mapRef}
        style={{
          height,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--border, rgba(30,42,74,0.6))',
        }}
      />
    </div>
  );
}
