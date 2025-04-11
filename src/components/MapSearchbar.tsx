
import React from 'react';
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
  // Ensure searchResults is always an array even if undefined is passed
  const results = Array.isArray(searchResults) ? searchResults : [];
  
  return (
    <div className="absolute top-2 left-0 right-0 mx-auto w-[95%] max-w-md z-10">
      <Command key="command-search" className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search for a city..."
          value={searchTerm || ''}
          onValueChange={(val) => setSearchTerm(val || '')}
        />
        {results.length > 0 && (
          <CommandList>
            {isSearching ? (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              <CommandGroup heading="Results">
                {results.map((location, index) => (
                  <CommandItem 
                    key={index} 
                    onSelect={() => onSelectLocation(location)}
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
        {searchTerm && searchTerm.length > 2 && results.length === 0 && !isSearching && (
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default MapSearchbar;
