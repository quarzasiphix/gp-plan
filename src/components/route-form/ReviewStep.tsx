
import React from 'react';
import { MapPin } from 'lucide-react';
import Map from '@/components/Map';
import { type Location } from '@/hooks/use-location-search';

interface ReviewStepProps {
  routeName: string;
  startDate: string;
  stops: Location[];
  returnJourney: boolean;
  returnStops: Location[];
}

const ReviewStep = ({
  routeName,
  startDate,
  stops,
  returnJourney,
  returnStops
}: ReviewStepProps) => {
  return (
    <div className="animate-fade-in space-y-6 h-[calc(100vh-320px)] overflow-auto">
      <div className="glass-panel p-4">
        <h3 className="font-medium mb-2">Route Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{routeName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Departure Date</p>
            <p className="font-medium">{new Date(startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Stops</p>
            <p className="font-medium">{stops.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Return Journey</p>
            <p className="font-medium">{returnJourney ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-4">
        <h3 className="font-medium mb-2">Journey Map</h3>
        <div className="h-52">
          <Map
            markers={stops}
            route={stops}
            interactive={false}
            onLocationSelect={() => {}}
          />
        </div>
      </div>
      
      <div className="glass-panel p-4">
        <h3 className="font-medium mb-2">Stops</h3>
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
              <div className="bg-primary/10 rounded-full p-1 shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{stop.address.split(',')[0]}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {stop.address.split(',').slice(1).join(',').trim()}
                </p>
              </div>
              <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                {index === 0 ? 'Start' : index === stops.length - 1 ? 'End' : `Stop ${index}`}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {returnJourney && returnStops.length > 0 && (
        <div className="glass-panel p-4">
          <h3 className="font-medium mb-2">Return Journey</h3>
          <div className="space-y-2">
            {stops.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg opacity-70">
                <div className="bg-primary/10 rounded-full p-1 shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {stops[stops.length - 1]?.address.split(',')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">Return starting point</p>
                </div>
                <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                  Start
                </div>
              </div>
            )}
            
            {returnStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                <div className="bg-primary/10 rounded-full p-1 shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{stop.address.split(',')[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stop.address.split(',').slice(1).join(',').trim()}
                  </p>
                </div>
                <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                  {index === returnStops.length - 1 ? 'End' : `Stop ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
