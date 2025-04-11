
// Route API service using Supabase backend
import { routesTable } from '../integrations/supabase/client';
import { formatRouteData, formatDataForApi } from './formatters';

// API service with improved error handling
export const routeApi = {
  // Get all routes
  getRoutes: async () => {
    try {
      console.log('Fetching routes from Supabase');
      const data = await routesTable.getAll();
      console.log('Routes fetched successfully:', data);
      
      // Convert each route to the format expected by the frontend
      const formattedRoutes = data.map(route => formatRouteData(route));
      
      return formattedRoutes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },
  
  // Get route by ID
  getRoute: async (id) => {
    try {
      console.log(`Fetching route ${id} from Supabase`);
      
      const data = await routesTable.getById(id);
      console.log('Route fetched successfully:', data);
      
      // Ensure stops array exists
      if (!data.stops) {
        console.log('No stops data found in route, initializing with empty array');
        data.stops = [];
      }
      
      if (!data.return_stops) {
        console.log('No return stops data found in route, initializing with empty array');
        data.return_stops = [];
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
      
      const data = await routesTable.create(formattedData);
      console.log('Route created successfully:', data);
      
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
      console.log(`Updating route ${id} with data:`, formattedData);
      
      const data = await routesTable.update(id, formattedData);
      console.log('Route updated successfully:', data);
      
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
      await routesTable.delete(id);
      console.log(`Route ${id} deleted successfully`);
      
      return true;
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
