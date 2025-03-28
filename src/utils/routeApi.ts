
// Real API service for routes
const API_BASE_URL = 'https://gp.quarza.online/api/routes';

// Helper to format routes data for frontend use
const formatRouteData = (route) => {
  // Extract return journey stops if needed
  const returnStops = route.stops
    ? route.stops.filter(stop => stop.is_return_journey).sort((a, b) => a.stop_order - b.stop_order)
    : [];
  
  // Extract regular stops
  const regularStops = route.stops 
    ? route.stops.filter(stop => !stop.is_return_journey).sort((a, b) => a.stop_order - b.stop_order)
    : [];
  
  return {
    id: route.id,
    name: route.name,
    startDate: route.start_date,
    duration: route.duration || '',
    distance: route.distance || '',
    returnJourney: route.return_journey,
    stops: regularStops.map(stop => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng
    })),
    returnStops: returnStops.map(stop => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng
    }))
  };
};

// Format data for API submission
const formatDataForApi = (routeData) => {
  // Combine regular and return stops with proper flags
  const allStops = [
    ...routeData.stops.map((stop, index) => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng,
      stop_order: index + 1,
      is_return_journey: false
    })),
    ...(routeData.returnJourney ? routeData.returnStops.map((stop, index) => ({
      address: stop.address,
      lat: stop.lat,
      lng: stop.lng,
      stop_order: index + 1,
      is_return_journey: true
    })) : [])
  ];

  return {
    name: routeData.name,
    start_date: routeData.startDate,
    duration: routeData.duration,
    distance: routeData.distance,
    return_journey: routeData.returnJourney,
    stops: allStops
  };
};

// API service
export const routeApi = {
  // Get all routes
  getRoutes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.map(formatRouteData);
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },
  
  // Get route by ID
  getRoute: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return formatRouteData(data);
    } catch (error) {
      console.error(`Error fetching route ${id}:`, error);
      throw error;
    }
  },
  
  // Create new route
  createRoute: async (routeData) => {
    try {
      const formattedData = formatDataForApi(routeData);
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return formatRouteData(data);
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },
  
  // Update existing route
  updateRoute: async (id, routeData) => {
    try {
      const formattedData = formatDataForApi(routeData);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return formatRouteData(data);
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      throw error;
    }
  },
  
  // Delete route
  deleteRoute: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      throw error;
    }
  },
  
  // Group routes by date
  getRoutesByDate: async () => {
    try {
      const routes = await routeApi.getRoutes();
      
      // Group by date
      const groupedRoutes = {};
      
      routes.forEach(route => {
        const date = route.startDate;
        if (!groupedRoutes[date]) {
          groupedRoutes[date] = [];
        }
        groupedRoutes[date].push(route);
      });
      
      // Convert to array format for easier rendering
      return Object.entries(groupedRoutes).map(([date, routes]) => ({
        date,
        routes,
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error grouping routes by date:', error);
      throw error;
    }
  },
};
