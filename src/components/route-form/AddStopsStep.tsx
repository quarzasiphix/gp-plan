
import React from 'react';
import { MapPin, Plus, Trash } from 'lucide-react';
import Map from '@/components/Map';
import { type Location } from '@/hooks/use-location-search';

interface AddStopsStepProps {
  stops: Location[];
  currentLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
}

const AddStopsStep = ({
  stops,
  currentLocation,
  onLocationSelect,
  onAddStop,
  onRemoveStop
}: AddStopsStepProps) => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="h-[calc(100vh-360px)] min-h-[300px]">
        <Map
          onLocationSelect={onLocationSelect}
          markers={stops}
          interactive={true}
          className="h-full"
        />
      </div>
      
      <div className="mt-4 glass-panel p-4 divide-y divide-border">
        <h3 className="font-medium mb-2">Current Stops</h3>
        
        {stops.length > 0 ? (
          stops.map((stop, index) => (
            <div key={index} className="py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-1">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stop.address.split(',')[0]}</p>
                  <p className="text-xs text-muted-foreground">{stop.address.split(',').slice(1).join(',').trim()}</p>
                </div>
              </div>
              
              {index > 0 && (
                <button
                  onClick={() => onRemoveStop(index)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                  aria-label="Remove stop"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="py-2 text-center text-muted-foreground">
            No stops added yet. Click on the map or search for locations.
          </div>
        )}
        
        {currentLocation && (
          <div className="py-3">
            <h3 className="font-medium mb-2">Add This Stop?</h3>
            <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
            <button
              onClick={onAddStop}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStopsStep;
