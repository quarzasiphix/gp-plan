
import { RouteData, RouteInsert, RouteUpdate } from '@/integrations/supabase/client';

// Helper to format routes data from Supabase for frontend use
export const formatRouteData = (route: RouteData) => {
  // Create a structured object for the frontend
  return {
    id: route.id,
    name: route.name,
    startDate: route.start_date,
    duration: route.duration || '',
    distance: route.distance || '',
    returnJourney: route.return_journey === true || route.return_journey === 1,
    stops: Array.isArray(route.stops) ? route.stops.map(stop => ({
      address: stop.address,
      lat: parseFloat(stop.lat),
      lng: parseFloat(stop.lng)
    })) : [],
    returnStops: Array.isArray(route.return_stops) ? route.return_stops.map(stop => ({
      address: stop.address,
      lat: parseFloat(stop.lat),
      lng: parseFloat(stop.lng)
    })) : []
  };
};

// Format data for Supabase API submission
export const formatDataForApi = (routeData: any): RouteInsert => {
  // Ensure all stops have proper format
  const processedStops = Array.isArray(routeData.stops) ? routeData.stops.map(stop => ({
    address: stop.address,
    lat: stop.lat,
    lng: stop.lng
  })) : [];
  
  const processedReturnStops = Array.isArray(routeData.returnStops) ? routeData.returnStops.map(stop => ({
    address: stop.address,
    lat: stop.lat,
    lng: stop.lng
  })) : [];

  // Prepare data for Supabase
  return {
    name: routeData.name,
    start_date: routeData.startDate,
    duration: routeData.duration || '',
    distance: routeData.distance || '',
    return_journey: routeData.returnJourney === true,
    stops: processedStops,
    return_stops: processedReturnStops
  };
};
