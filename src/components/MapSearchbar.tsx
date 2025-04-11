
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { type Location } from '@/hooks/use-location-search';

interface MapSearchbarProps {
  onSelectLocation: (location: Location) => void;
}

const MapSearchbar = ({ onSelectLocation }: MapSearchbarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // Search locations effect
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    setIsSearching(true);
    setIsResultsVisible(true);

    // Simulate API delay
    const timeout = setTimeout(() => {
      const results = searchLocations(searchTerm);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = () => {
      setIsResultsVisible(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const searchLocations = (term: string): Location[] => {
    const cities: Record<string, { lat: number; lng: number; country: string }> = {
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
      'lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
      'helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
      'stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
      'budapest': { lat: 47.4979, lng: 19.0402, country: 'Hungary' },
    };

    // Convert search term to lowercase
    const lowerTerm = term.toLowerCase().trim();
    
    // Find cities that match the search term
    const results: Location[] = [];
    
    Object.entries(cities).forEach(([city, data]) => {
      if (city.includes(lowerTerm) || data.country.toLowerCase().includes(lowerTerm)) {
        results.push({
          address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
          lat: data.lat,
          lng: data.lng
        });
      }
    });
    
    // If no results, return some default cities
    if (results.length === 0) {
      return Object.entries(cities).slice(0, 5).map(([city, data]) => ({
        address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
        lat: data.lat,
        lng: data.lng
      }));
    }
    
    return results.slice(0, 5); // Limit to 5 results
  };

  const handleSelectLocation = (location: Location, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectLocation(location);
    setSearchTerm('');
    setIsResultsVisible(false);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (searchTerm.length >= 2) {
      setIsResultsVisible(true);
    }
  };

  return (
    <div className="relative w-full z-10" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="bg-background w-full py-2 pl-10 pr-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search for a location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleInputClick}
        />
      </div>
      
      {isResultsVisible && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background rounded-lg shadow-lg border overflow-hidden max-h-[200px] overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((location, index) => (
                <li 
                  key={`location-${index}`}
                  className="p-2 cursor-pointer hover:bg-accent transition-colors flex items-center"
                  onClick={(e) => handleSelectLocation(location, e)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{location.address}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No locations found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSearchbar;
