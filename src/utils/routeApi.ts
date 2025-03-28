
// Real API service for routes
const API_BASE_URL = 'https://gp.quarza.online/api/routes.php';

// Helper to format routes data for frontend use
const formatRouteData = (route) => {
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
const formatDataForApi = (routeData) => {
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

// Use a CORS proxy if needed
const fetchWithCORS = async (url: string, options: RequestInit = {}) => {
  // Try direct first
  try {
    console.log(`Attempting direct fetch to: ${url}`);
    const response = await fetch(url, options);
    if (response.ok) return response;
    
    // If direct fetch failed with CORS error, throw to try proxy
    throw new Error('Direct fetch failed');
  } catch (directError) {
    console.log('Direct fetch failed, trying with CORS proxy');
    
    // Try with CORS proxy
    try {
      // Use a CORS proxy
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const proxyUrl = `${corsProxyUrl}${url}`;
      
      console.log(`Trying with CORS proxy: ${proxyUrl}`);
      
      const proxyResponse = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options.headers,
          'Origin': window.location.origin
        }
      });
      
      if (!proxyResponse.ok) {
        const errorText = await proxyResponse.text();
        throw new Error(`Proxy API error: ${proxyResponse.status} - ${errorText || 'No error details provided'}`);
      }
      
      return proxyResponse;
    } catch (proxyError) {
      console.error('Both direct and proxy fetch attempts failed:', proxyError);
      throw new Error(`CORS Error: Unable to connect to the API. Please ensure you have CORS permissions or use a proxy. Details: ${proxyError.message}`);
    }
  }
};

// API service with improved error handling
export const routeApi = {
  // Get all routes
  getRoutes: async () => {
    try {
      console.log('Fetching routes from:', API_BASE_URL);
      const response = await fetchWithCORS(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response Status:', response.status);
      
      const data = await response.json();
      console.log('API Response Data:', data);
      
      // Check if the response is an array (expected)
      if (!Array.isArray(data)) {
        console.error('Unexpected API response format:', data);
        if (data.error) {
          throw new Error(`API Error: ${data.error}`);
        }
        throw new Error('Unexpected API response format');
      }
      
      return data.map(route => {
        // Routes from the list endpoint don't include stops
        return formatRouteData({...route, stops: []});
      });
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },
  
  // Get route by ID
  getRoute: async (id) => {
    try {
      console.log(`Fetching route ${id} from: ${API_BASE_URL}/${id}`);
      const response = await fetchWithCORS(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Single route API response:', data);
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      
      // Ensure stops array exists and process it
      if (!data.stops) {
        data.stops = [];
      }
      
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
      console.log('Creating route with data:', formattedData);
      console.log('POST URL:', API_BASE_URL);
      
      const response = await fetchWithCORS(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      const data = await response.json();
      console.log('Create route response:', data);
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      
      // If we just get an ID back, fetch the complete route
      if (data.id) {
        return await routeApi.getRoute(data.id);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  },
  
  // Update existing route
  updateRoute: async (id, routeData) => {
    try {
      const formattedData = formatDataForApi(routeData);
      console.log(`Updating route ${id} with data:`, formattedData);
      
      const response = await fetchWithCORS(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      const data = await response.json();
      console.log('Update route response:', data);
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      
      return formatRouteData(data);
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      throw error;
    }
  },
  
  // Delete route
  deleteRoute: async (id) => {
    try {
      console.log(`Deleting route ${id}`);
      const response = await fetchWithCORS(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      
      return data;
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
