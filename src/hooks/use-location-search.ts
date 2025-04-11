
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type Location = {
  address: string;
  lat: number;
  lng: number;
};

export function useLocationSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Search for locations when searchTerm changes
    if (searchTerm && searchTerm.length > 1) {
      setIsSearching(true);
      console.log("Searching for:", searchTerm);
      // Simulate API delay
      const timeout = setTimeout(() => {
        const results = searchLocations(searchTerm);
        console.log("Search results:", results);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const searchLocations = (term: string): Location[] => {
    if (!term) return [];
    
    // Dictionary of some cities and their approximate coordinates
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
      'lodz': { lat: 51.7592, lng: 19.4560, country: 'Poland' },
      'helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
      'copenhagen': { lat: 55.6761, lng: 12.5683, country: 'Denmark' },
    };
    
    // Now we'll make the search much more permissive
    const searchLower = term.toLowerCase();
    const results: Location[] = [];
    
    // Check for partial matches in city names
    Object.entries(cities).forEach(([city, data]) => {
      if (city.includes(searchLower) || searchLower.includes(city)) {
        results.push({
          address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
          lat: data.lat,
          lng: data.lng
        });
      }
    });
    
    // If we still don't have results, check if the search term contains any part of city names
    if (results.length === 0) {
      Object.entries(cities).forEach(([city, data]) => {
        for (const part of city.split(' ')) {
          if (part.length > 2 && (searchLower.includes(part) || part.includes(searchLower))) {
            results.push({
              address: `${city.charAt(0).toUpperCase() + city.slice(1)}, ${data.country}`,
              lat: data.lat,
              lng: data.lng
            });
            break;
          }
        }
      });
    }
    
    console.log(`Search for "${term}" returned ${results.length} results`);
    return results;
  };

  const handleSelectSearchResult = (location: Location) => {
    if (!location) return;
    
    setSearchTerm(location.address);
    setSearchResults([]);
    setCurrentLocation(location);
    
    toast({
      title: "Location Selected",
      description: `Selected: ${location.address}`,
    });
  };

  const generateMockLocation = (term: string): Location | null => {
    if (!term) return null;
    
    // Dictionary of some cities and their approximate coordinates
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
      'lodz': { lat: 51.7592, lng: 19.4560, country: 'Poland' },
    };
    
    // Check if search term matches any of our mock cities
    const searchLower = term.toLowerCase();
    
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
    const capitalizedSearch = term
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return {
      address: `${capitalizedSearch}, Europe`,
      lat: randomLat,
      lng: randomLng
    };
  };

  const clearCurrentLocation = () => {
    setCurrentLocation(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    currentLocation,
    setCurrentLocation,
    handleSelectSearchResult,
    generateMockLocation,
    clearCurrentLocation
  };
}
