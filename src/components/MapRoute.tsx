
import React from 'react';
import { type Location } from '@/hooks/use-location-search';

interface MapRouteProps {
  route: Location[];
}

const MapRoute = ({ route = [] }: MapRouteProps) => {
  // Ensure route is always an array
  const routeData = Array.isArray(route) ? route : [];
  
  if (routeData.length === 0) return null;
  
  return (
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
  );
};

export default MapRoute;
