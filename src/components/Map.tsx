
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { type Location } from '@/hooks/use-location-search';
import MapSearchbar from './MapSearchbar';

interface MapProps {
  onLocationSelect: (location: Location) => void;
  markers?: Location[];
  route?: Location[];
  interactive?: boolean;
  className?: string;
}

const Map = ({
  onLocationSelect,
  markers = [],
  route = [],
  interactive = true,
  className = "",
}: MapProps) => {
  const [currentSearchLocation, setCurrentSearchLocation] = useState<Location | null>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    // Get click position
    const mapContainer = e.currentTarget;
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage positions
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    // Dictionary of cities based on map regions (simplified)
    const regions = [
      { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, x: 40, y: 50 },
      { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, x: 45, y: 35 },
      { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, x: 55, y: 30 },
      { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, x: 55, y: 55 },
      { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, x: 35, y: 30 },
      { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, x: 45, y: 55 },
      { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, x: 48, y: 28 },
      { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, x: 60, y: 35 },
      { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, x: 60, y: 40 },
      { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, x: 65, y: 30 },
    ];
    
    // Find closest region to click
    let closestRegion = regions[0];
    let minDistance = 100000;
    
    for (const region of regions) {
      const distance = Math.sqrt(
        Math.pow(percentX - region.x, 2) + Math.pow(percentY - region.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }
    
    // Add a small random variation to make it seem like a precise click
    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;
    
    const mockLocation = {
      address: `${closestRegion.name}, ${closestRegion.country}`,
      lat: closestRegion.lat + latVariation,
      lng: closestRegion.lng + lngVariation,
    };
    
    console.log("Map click selected location:", mockLocation);
    onLocationSelect(mockLocation);
  };

  const handleSearchResult = (location: Location) => {
    console.log("Search result selected:", location);
    setCurrentSearchLocation(null);
    onLocationSelect(location);
  };

  // Render markers
  const renderMarkers = () => {
    if (!markers || markers.length === 0) return null;
    
    return markers.map((marker, index) => (
      <div 
        key={`marker-${index}-${marker.lat}-${marker.lng}`}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        style={{ 
          left: `${30 + (index * 10)}%`, 
          top: `${40 + (index * 5)}%` 
        }}
      >
        <div className="relative animate-bounce-slow">
          <MapPin className="h-8 w-8 text-primary drop-shadow-lg" />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-xs p-1 rounded shadow-md whitespace-nowrap max-w-40 truncate">
            {marker.address.split(',')[0]}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={`relative ${className} w-full h-full min-h-[300px]`}>
      {interactive && (
        <MapSearchbar
          onSelectLocation={handleSearchResult}
        />
      )}
      
      <div 
        className="map-container bg-accent/30 h-full w-full rounded-lg overflow-hidden mt-2"
        onClick={handleMapClick}
      >
        {/* Map background and content */}
        <div className="flex items-center justify-center h-full bg-[url('/lovable-uploads/ddd5eb8a-fb3c-48b1-bd26-8811fad4bfd2.png')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-background/5"></div>
          
          {/* User instructions */}
          {interactive && markers.length === 0 && !currentSearchLocation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/70 text-foreground p-4 rounded-lg max-w-xs text-center shadow-lg">
                <p>Click on the map to select a location or use the search bar above</p>
              </div>
            </div>
          )}
          
          {/* Render markers */}
          {renderMarkers()}
          
          {/* Render route line if needed */}
          {route && route.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M${30 + (0 * 10)},${40 + (0 * 5)} ${markers.slice(1).map((_, i) => 
                  `L${30 + ((i+1) * 10)},${40 + ((i+1) * 5)}`).join(' ')}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
