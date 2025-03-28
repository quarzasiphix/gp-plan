
import { useState, useEffect } from 'react';
import { routeApi } from '../utils/routeApi';
import { toast } from '@/components/ui/use-toast';

export const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [groupedRoutes, setGroupedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all routes
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      console.log('Fetching routes...');
      const data = await routeApi.getRoutes();
      console.log('Routes fetched successfully:', data);
      setRoutes(data);
      setError(null);
    } catch (err) {
      console.error('Error loading routes:', err);
      const errorMessage = err.message || 'Failed to load routes';
      setError(errorMessage);
      
      // Check if it's a CORS error
      if (errorMessage.includes('CORS')) {
        toast({
          title: 'CORS Error',
          description: `Unable to connect to the API due to CORS restrictions. The application might need to use a proxy or have CORS enabled on the server.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'API Connection Error',
          description: `${errorMessage}. Please check your network connection and API settings.`,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch routes grouped by date
  const fetchGroupedRoutes = async () => {
    try {
      setLoading(true);
      console.log('Fetching grouped routes...');
      const data = await routeApi.getRoutesByDate();
      console.log('Grouped routes fetched successfully:', data);
      setGroupedRoutes(data);
      setError(null);
    } catch (err) {
      console.error('Error loading grouped routes:', err);
      const errorMessage = err.message || 'Failed to load routes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new route
  const createRoute = async (routeData) => {
    try {
      setLoading(true);
      const newRoute = await routeApi.createRoute(routeData);
      setRoutes(prevRoutes => [...prevRoutes, newRoute]);
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route created successfully!',
      });
      return newRoute;
    } catch (err) {
      console.error('Error creating route:', err);
      setError(err.message || 'Failed to create route');
      toast({
        title: 'Error',
        description: 'Failed to create route. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update an existing route
  const updateRoute = async (id, routeData) => {
    try {
      setLoading(true);
      const updatedRoute = await routeApi.updateRoute(id, routeData);
      setRoutes(prevRoutes => prevRoutes.map(route => route.id === id ? updatedRoute : route));
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route updated successfully!',
      });
      return updatedRoute;
    } catch (err) {
      console.error('Error updating route:', err);
      setError(err.message || 'Failed to update route');
      toast({
        title: 'Error',
        description: 'Failed to update route. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a route
  const deleteRoute = async (id) => {
    try {
      setLoading(true);
      await routeApi.deleteRoute(id);
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== id));
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route deleted successfully!',
      });
    } catch (err) {
      console.error('Error deleting route:', err);
      setError(err.message || 'Failed to delete route');
      toast({
        title: 'Error',
        description: 'Failed to delete route. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load routes on mount
  useEffect(() => {
    fetchRoutes();
    fetchGroupedRoutes();
  }, []);
  
  return {
    routes,
    groupedRoutes,
    loading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    refreshRoutes: fetchRoutes,
    refreshGroupedRoutes: fetchGroupedRoutes,
  };
};
