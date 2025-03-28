
// Data formatting utilities for the route API

// Helper to format routes data for frontend use
export const formatRouteData = (route) => {
  // Make sure the stops array exists
  const stopsArray = Array.isArray(route.stops) ? route.stops : [];
  
  // Extract return journey stops if needed
  const returnStops = stopsArray
    .filter(stop => stop.is_return_journey === 1)
    .sort((a, b) => a.stop_order - b.stop_order);
  
  // Extract regular stops
  const regularStops = stopsArray
    .filter(stop => stop.is_return_journey === 0)
    .sort((a, b) => a.stop_order - b.stop_order);
  
  return {
    id: route.id,
    name: route.name,
    startDate: route.start_date,
    duration: route.duration || '',
    distance: route.distance || '',
    returnJourney: route.return_journey === 1 || route.return_journey === "1" || route.return_journey === true,
    stops: regularStops.map(stop => ({
      address: stop.address,
      lat: parseFloat(stop.lat),
      lng: parseFloat(stop.lng)
    })),
    returnStops: returnStops.map(stop => ({
      address: stop.address,
      lat: parseFloat(stop.lat),
      lng: parseFloat(stop.lng)
    }))
  };
};

// Format data for API submission
export const formatDataForApi = (routeData) => {
  // Combine regular and return stops with proper flags
  const allStops = [
    ...routeData.stops.map((stop, index) => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng,
      stop_order: index + 1,
      is_return_journey: 0
    })),
    ...(routeData.returnJourney ? routeData.returnStops.map((stop, index) => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng,
      stop_order: index + 1,
      is_return_journey: 1
    })) : [])
  ];

  // PHP API expects return_journey as an integer (0 or 1)
  return {
    name: routeData.name,
    start_date: routeData.startDate,
    duration: routeData.duration,
    distance: routeData.distance,
    return_journey: routeData.returnJourney ? 1 : 0,
    stops: allStops
  };
};
