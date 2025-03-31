
import React from 'react';
import { MapPin } from 'lucide-react';
import { type Location } from '@/hooks/use-location-search';

interface MapMarkersProps {
  markers: Location[];
}

const MapMarkers = ({ markers = [] }: MapMarkersProps) => {
  // Ensure markers is always an array
  const markerData = Array.isArray(markers) ? markers : [];
  
  if (markerData.length === 0) return null;
  
  return (
    <>
      {markerData.map((marker, index) => (
        <div 
          key={index}
          className="absolute map-pin-drop"
          style={{ 
            left: `${30 + (index * 10) % 60}%`, 
            top: `${40 + (index % 5) * 10}%` 
          }}
        >
          <div className="relative">
            <MapPin className="h-8 w-8 text-primary drop-shadow-lg" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-xs p-1 rounded shadow-md whitespace-nowrap">
              {marker.address && marker.address.split(',')[0]}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MapMarkers;
