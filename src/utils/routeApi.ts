
// Route API service
import { fetchWithCORS, getApiUrl } from './apiUtils';
import { formatRouteData, formatDataForApi } from './formatters';

// API service with improved error handling
export const routeApi = {
  // Get all routes
  getRoutes: async () => {
    try {
      console.log('Fetching routes from:', getApiUrl());
      const response = await fetchWithCORS(getApiUrl(), {
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
      // The PHP API expects routes.php/{id} format
      console.log(`Fetching route ${id} from: ${getApiUrl(id)}`);
      
      const response = await fetchWithCORS(getApiUrl(id), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Route API response status:', response.status);
      const responseText = await response.text();
      console.log('Raw API response text:', responseText);
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        
        // Check if we're getting HTML instead of JSON (common error)
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          throw new Error(`API returned HTML instead of JSON. This usually means the API endpoint URL is incorrect or the API is not responding properly.`);
        }
        
        throw new Error(`API returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }
      
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
      console.log('POST URL:', getApiUrl());
      
      const response = await fetchWithCORS(getApiUrl(), {
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
      
      const response = await fetchWithCORS(getApiUrl(id), {
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
      const response = await fetchWithCORS(getApiUrl(id), {
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
