
import React from 'react';
import { MapPin, Calendar, Clock, Edit, Trash } from 'lucide-react';
import { formatDistance } from 'date-fns';

const RouteCard = ({ route, onEdit, onDelete }) => {
  const { id, name, startDate, stops = [], duration, distance } = route;
  
  const formattedDate = new Date(startDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const isUpcoming = new Date(startDate) > new Date();
  const timeFromNow = formatDistance(new Date(startDate), new Date(), { addSuffix: true });
  
  // Default values for start/end locations when stops are missing
  const firstStopAddress = stops && stops.length > 0 
    ? stops[0].address.split(',')[0] 
    : 'Starting point';
    
  const lastStopAddress = stops && stops.length > 0 
    ? stops[stops.length - 1].address.split(',')[0] 
    : 'Destination';
  
  return (
    <div className="list-card group">
      <div className="flex justify-between items-start">
        <div>
          <div className="route-date-chip mb-2">{formattedDate}</div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{stops ? stops.length : 0} stops</span>
            <Clock className="h-3 w-3 ml-3 mr-1" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => onEdit(id)} 
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(id)} 
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-secondary/50 p-3 rounded-lg text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="ml-1 font-medium">{firstStopAddress}</span>
          </div>
          <span className="text-xs">Start</span>
        </div>
        
        {stops && stops.length > 2 && (
          <div className="my-2 pl-5 text-muted-foreground">
            + {stops.length - 2} stops in between
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-destructive" />
            <span className="ml-1 font-medium">{lastStopAddress}</span>
          </div>
          <span className="text-xs">End</span>
        </div>
      </div>
      
      {isUpcoming && (
        <div className="mt-2 text-xs text-muted-foreground">
          Departing {timeFromNow}
        </div>
      )}
    </div>
  );
};

export default RouteCard;
