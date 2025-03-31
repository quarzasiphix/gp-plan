
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

// Map component with enhanced functionality
const Map = ({
  onLocationSelect,
  markers = [],
  route = [],
  interactive = true,
  className = "",
}) => {
  const mapRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useIsMobile();
  
  // In a real implementation, we would use the Google Maps API
  // This is just a placeholder visualization
  
  useEffect(() => {
    // Initialize map (in a real implementation)
    const initMap = () => {
      if (!mapRef.current) return;
      
      console.log('Map initialized');
      // Here we would initialize Google Maps
    };
    
    // Mock API initialization
    const script = document.createElement('script');
    script.onload = initMap;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Search for locations when searchTerm changes
    if (searchTerm.length > 2) {
      setIsSearching(true);
      // Simulate API delay
      const timeout = setTimeout(() => {
        const results = searchLocations(searchTerm);
        setSearchResults(results || []);
        setIsSearching(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchLocations = (term) => {
    // Dictionary of some cities and their approximate coordinates
    const cities = {
      'warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
      'berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
      'paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
      'london': { lat: 51.5074, lng: -0.1278, country: 'UK' },
      'madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
      'rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
      'vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
      'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
      'brussels': { lat: 50.8503, lng: 4.3517, country: 'Belgium' },
      'prague': { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
      'barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain' },
      'lodz': { lat: 51.7592, lng: 19.4560, country: 'Poland' },
    };
    
    // Filter cities based on the search term
    const searchLower = term.toLowerCase();
    const results = [];
    
    for (const [city, data] of Object.entries(cities)) {
      if (city.includes(searchLower)) {
        results.push({
          address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
          lat: data.lat,
          lng: data.lng
        });
      }
    }
    
    return results;
  };

  const handleSelectSearchResult = (location) => {
    setSearchTerm(location.address);
    setSearchResults([]);
    
    if (onLocationSelect) {
      onLocationSelect(location);
      
      toast({
        title: "Location Selected",
        description: `Selected: ${location.address}`,
      });
    }
  };

  const handleSearch = (e) => {
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
      onLocationSelect(mockLocation);
      
      toast({
        title: "Location Found",
        description: `Found: ${mockLocation.address}`,
      });
    }
  };

  const generateMockLocation = (searchTerm) => {
    // Dictionary of some cities and their approximate coordinates
    const cities = {
      'warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
      'berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
      'paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
      'london': { lat: 51.5074, lng: -0.1278, country: 'UK' },
      'madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
      'rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
      'vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
      'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
      'brussels': { lat: 50.8503, lng: 4.3517, country: 'Belgium' },
      'prague': { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
      'barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain' },
      'lodz': { lat: 51.7592, lng: 19.4560, country: 'Poland' },
    };
    
    // Check if search term matches any of our mock cities
    const searchLower = searchTerm.toLowerCase();
    
    // Find a matching city
    for (const [city, data] of Object.entries(cities)) {
      if (searchLower.includes(city)) {
        return {
          address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
          lat: data.lat,
          lng: data.lng
        };
      }
    }
    
    // If no match, create a random location based on central Europe coordinates
    const randomLat = 50 + (Math.random() - 0.5) * 10;
    const randomLng = 10 + (Math.random() - 0.5) * 20;
    
    // Create a capitalized version of the search term
    const capitalizedSearch = searchTerm
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return {
      address: `${capitalizedSearch}, Europe`,
      lat: randomLat,
      lng: randomLng
    };
  };

  const handleMapClick = (e) => {
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
        <div className="absolute top-2 left-0 right-0 mx-auto w-[95%] max-w-md z-10">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search for a city..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {searchResults && searchResults.length > 0 && (
              <CommandList>
                {isSearching ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : (
                  <CommandGroup heading="Results">
                    {searchResults.map((location, index) => (
                      <CommandItem 
                        key={index} 
                        onSelect={() => handleSelectSearchResult(location)}
                        className="flex items-center cursor-pointer"
                      >
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {location.address}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
            {searchTerm.length > 2 && searchResults && searchResults.length === 0 && (
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
              </CommandList>
            )}
          </Command>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="map-container bg-accent/30 h-full rounded-lg overflow-hidden"
        onClick={handleMapClick}
      >
        {/* This is a placeholder for the actual map */}
        <div className="flex items-center justify-center h-full bg-[url('/lovable-uploads/35ae8898-e6d0-4a1c-a11e-0ee42bdcda81.png')] bg-no-repeat bg-cover relative">
          <div className="absolute inset-0 bg-accent/10"></div>
          
          {/* User instructions */}
          {interactive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-500/70 text-white p-4 rounded-lg max-w-xs text-center">
                <p>Click on the map to select a location or use the search bar above</p>
              </div>
            </div>
          )}
          
          {/* Render markers */}
          {markers && markers.map((marker, index) => (
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
                  {marker.address.split(',')[0]}
                </div>
              </div>
            </div>
          ))}
          
          {/* Placeholder for routes - would use actual polylines in real implementation */}
          {route && route.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M100,200 L300,180 L500,250 L700,170"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                className="route-line"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
