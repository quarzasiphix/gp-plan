
import React from 'react';
import { Plus } from 'lucide-react';
import Map from '@/components/Map';
import { type Location } from '@/hooks/use-location-search';

interface StartingPointStepProps {
  currentLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  onAddStop: () => void;
}

const StartingPointStep = ({
  currentLocation,
  onLocationSelect,
  onAddStop
}: StartingPointStepProps) => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="h-[calc(100vh-360px)] min-h-[300px]">
        <Map
          onLocationSelect={(location) => {
            console.log("StartingPointStep - location selected:", location);
            onLocationSelect(location);
          }}
          interactive={true}
          markers={currentLocation ? [currentLocation] : []}
          className="h-full"
        />
      </div>
      
      {currentLocation && (
        <div className="mt-4 p-4 glass-panel animate-scale-in">
          <h3 className="font-medium">Selected Location</h3>
          <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
          <button
            onClick={() => {
              console.log("Set as Starting Point clicked");
              onAddStop();
            }}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Set as Starting Point
          </button>
        </div>
      )}
    </div>
  );
};

export default StartingPointStep;
