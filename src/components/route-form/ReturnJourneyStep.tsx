
import React from 'react';
import { MapPin, Plus, Trash } from 'lucide-react';
import Map from '@/components/Map';
import { type Location } from '@/hooks/use-location-search';

interface ReturnJourneyStepProps {
  returnJourney: boolean;
  lastStop: Location | undefined;
  returnStops: Location[];
  currentLocation: Location | null;
  onReturnJourneyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationSelect: (location: Location) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
}

const ReturnJourneyStep = ({
  returnJourney,
  lastStop,
  returnStops,
  currentLocation,
  onReturnJourneyChange,
  onLocationSelect,
  onAddStop,
  onRemoveStop
}: ReturnJourneyStepProps) => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          id="returnJourney"
          name="returnJourney"
          checked={returnJourney}
          onChange={onReturnJourneyChange}
          className="rounded-sm"
        />
        <label htmlFor="returnJourney" className="font-medium">Plan Return Journey</label>
      </div>
      
      {returnJourney ? (
        <div className="h-[calc(100vh-360px)]">
          <Map
            onLocationSelect={onLocationSelect}
            markers={lastStop ? [lastStop, ...returnStops] : returnStops}
            interactive={true}
          />
          
          <div className="mt-4 glass-panel p-4 divide-y divide-border">
            <h3 className="font-medium mb-2">Return Journey Stops</h3>
            {lastStop && (
              <div className="py-2 flex justify-between items-center opacity-50">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-1">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lastStop.address.split(',')[0]}</p>
                    <p className="text-xs text-muted-foreground">Starting point of return</p>
                  </div>
                </div>
              </div>
            )}
            
            {returnStops.map((stop, index) => (
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
                
                <button
                  onClick={() => onRemoveStop(index)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {currentLocation && (
              <div className="py-3">
                <h3 className="font-medium mb-2">Add This Stop?</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
                <button
                  onClick={onAddStop}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  Add Return Stop
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 text-center">
          <p className="text-muted-foreground">No return journey planned.</p>
        </div>
      )}
    </div>
  );
};

export default ReturnJourneyStep;
