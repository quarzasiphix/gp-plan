
import React, { useId } from 'react';
import { MapPin } from 'lucide-react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { type Location } from '@/hooks/use-location-search';

interface MapSearchbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchResults: Location[];
  isSearching: boolean;
  onSelectLocation: (location: Location) => void;
}

const MapSearchbar = ({
  searchTerm,
  setSearchTerm,
  searchResults = [],
  isSearching,
  onSelectLocation
}: MapSearchbarProps) => {
  // Create a stable ID for the Command component
  const commandId = useId();
  
  // Ensure searchResults is always an array even if undefined is passed
  const results = Array.isArray(searchResults) ? searchResults : [];
  
  // Handle selection from search results
  const handleSelect = (location: Location) => {
    console.log("MapSearchbar - location selected:", location);
    onSelectLocation(location);
    // Clear search term after selection to close the results dropdown
    setTimeout(() => setSearchTerm(''), 100);
  };
  
  return (
    <div className="absolute top-2 left-0 right-0 mx-auto w-[95%] max-w-md z-10">
      <Command key={`command-search-${commandId}`} className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search for a location..."
          value={searchTerm}
          onValueChange={(value) => {
            console.log("Search input changed:", value);
            setSearchTerm(value);
          }}
        />
        {(searchTerm.length > 0 || results.length > 0) && (
          <CommandList>
            {isSearching ? (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <CommandGroup heading="Results">
                {results.map((location, index) => (
                  <CommandItem 
                    key={`location-${index}-${location.lat}-${location.lng}`}
                    onSelect={() => handleSelect(location)}
                    className="flex items-center cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {location.address}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No results found. Try another search term.</CommandEmpty>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default MapSearchbar;
