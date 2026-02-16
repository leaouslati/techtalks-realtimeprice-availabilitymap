// frontend/components/map.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Supermarket } from '@/services/api';

interface MapProps {
  supermarkets: Supermarket[];
  userLocation?: { lat: number; lng: number } | null;
}

// Define proper types for Google Maps objects
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;
type GoogleInfoWindow = google.maps.InfoWindow;
type GoogleLatLng = google.maps.LatLng;
type GoogleLatLngBounds = google.maps.LatLngBounds;
type GoogleSize = google.maps.Size;
type GoogleAnimation = google.maps.Animation;

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => GoogleMap;
        Marker: new (options: any) => GoogleMarker;
        InfoWindow: new (options: any) => GoogleInfoWindow;
        LatLng: new (lat: number, lng: number) => GoogleLatLng;
        LatLngBounds: new () => GoogleLatLngBounds;
        Size: new (width: number, height: number) => GoogleSize;
        Animation: {
          DROP: GoogleAnimation;
        };
      };
    };
  }
}

export default function Map({ supermarkets, userLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);

  // Initialize map - runs once
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps || map) return;

    const defaultLocation = userLocation || { lat: 40.7128, lng: -74.0060 };
    
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      mapTypeId: 'roadmap',
    });

    setMap(newMap);

    // Add user location marker if available
    if (userLocation) {
      new window.google.maps.Marker({
        position: userLocation,
        map: newMap,
        title: 'You are here',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when supermarkets change
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });

    // Create new markers
    const newMarkers = supermarkets.map(supermarket => {
      if (!supermarket.location) return null;

      const marker = new window.google.maps.Marker({
        position: {
          lat: supermarket.location.lat,
          lng: supermarket.location.lng,
        },
        map: map,
        title: supermarket.name,
        animation: window.google.maps.Animation.DROP,
      });

      // Info window content
      const infoContent = `
        <div style="padding: 12px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #333;">${supermarket.name}</h3>
          <p style="margin: 5px 0; color: #666;"><strong>📍 Address:</strong> ${supermarket.address}</p>
          ${supermarket.price ? `<p style="margin: 5px 0; color: #666;"><strong>💰 Price:</strong> $${supermarket.price}</p>` : ''}
          ${supermarket.available !== undefined ? `
            <p style="margin: 5px 0;">
              <strong>📦 Status:</strong> 
              <span style="color: ${supermarket.available ? '#28a745' : '#dc3545'};">
                ${supermarket.available ? '✅ In Stock' : '❌ Out of Stock'}
              </span>
            </p>
          ` : ''}
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    }).filter((marker): marker is GoogleMarker => marker !== null);

    markersRef.current = newMarkers;

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      if (userLocation) {
        bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
      }
      map.fitBounds(bounds);
    }
  }, [map, supermarkets, userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }} 
    />
  );
}