
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocationSearch, type Location } from '@/hooks/use-location-search';
import MapSearchbar from './MapSearchbar';
import MapMarkers from './MapMarkers';
import MapRoute from './MapRoute';

interface MapProps {
  onLocationSelect: (location: Location) => void;
  markers?: Location[];
  route?: Location[];
  interactive?: boolean;
  className?: string;
}

// Map component with enhanced functionality
const Map = ({
  onLocationSelect,
  markers = [],
  route = [],
  interactive = true,
  className = "",
}: MapProps) => {
  const isMobile = useIsMobile();
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    currentLocation,
    setCurrentLocation,
    handleSelectSearchResult,
    generateMockLocation
  } = useLocationSearch();

  const handleSelectSearchResult = (location: Location) => {
    if (!location) return;
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for location:', searchTerm);
    
    if (!searchTerm) {
      toast({
        title: "Search Error",
        description: "Please enter a location to search",
        variant: "destructive"
      });
      return;
    }
    
    // For now, let's use a more realistic mock search result based on the search term
    if (searchTerm && onLocationSelect) {
      // Generate a mock location based on the search term
      const mockLocation = generateMockLocation(searchTerm);
      if (mockLocation) {
        onLocationSelect(mockLocation);
        
        toast({
          title: "Location Found",
          description: `Found: ${mockLocation.address}`,
        });
      }
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (!interactive || !onLocationSelect) return;
    
    console.log('Map clicked');
    
    // For demonstration, get a semi-random location, but ensure different locations on each click
    const randomCities = [
      { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
      { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
      { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
      { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
      { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
      { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
      { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
      { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
      { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
      { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
      { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
    ];
    
    // Get a "random" city but use the click position to select it
    // This ensures different clicks will select different cities
    const clickX = e.clientX || 0;
    const clickY = e.clientY || 0;
    const cityIndex = (clickX + clickY) % randomCities.length;
    const city = randomCities[cityIndex];
    
    // Add a small random variation to make it seem like a precise click
    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;
    
    const mockLocation = {
      address: `${city.name}, ${city.country}`,
      lat: city.lat + latVariation,
      lng: city.lng + lngVariation,
    };
    
    onLocationSelect(mockLocation);
    
    toast({
      title: "Location Selected",
      description: `Selected: ${mockLocation.address}`,
    });
  };

  return (
    <div className={`relative ${isMobile ? 'h-[70vh]' : 'h-full'} ${className}`}>
      {interactive && (
        <MapSearchbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelectLocation={handleSelectSearchResult}
        />
      )}
      
      <div 
        className="map-container bg-accent/30 h-full rounded-lg overflow-hidden"
        onClick={handleMapClick}
      >
        {/* This is a placeholder for the actual map */}
        <div className="flex items-center justify-center h-full bg-[url('/lovable-uploads/35ae8898-e6d0-4a1c-a11e-0ee42bdcda81.png')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-accent/10"></div>
          
          {/* User instructions */}
          {interactive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-500/70 text-white p-4 rounded-lg max-w-xs text-center">
                <p>Click on the map to select a location or use the search bar above</p>
              </div>
            </div>
          )}
          
          {/* Render markers and route */}
          <MapMarkers markers={markers} />
          <MapRoute route={route} />
        </div>
      </div>
    </div>
  );
};

export default Map;
