
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
      const data = await routeApi.getRoutes();
      setRoutes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load routes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch routes grouped by date
  const fetchGroupedRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeApi.getRoutesByDate();
      setGroupedRoutes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load routes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new route
  const createRoute = async (routeData) => {
    try {
      setLoading(true);
      const newRoute = await routeApi.createRoute(routeData);
      setRoutes([...routes, newRoute]);
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route created successfully!',
      });
      return newRoute;
    } catch (err) {
      setError(err.message);
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
      setRoutes(routes.map(route => route.id === id ? updatedRoute : route));
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route updated successfully!',
      });
      return updatedRoute;
    } catch (err) {
      setError(err.message);
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
      setRoutes(routes.filter(route => route.id !== id));
      fetchGroupedRoutes(); // Refresh grouped routes
      toast({
        title: 'Success',
        description: 'Route deleted successfully!',
      });
    } catch (err) {
      setError(err.message);
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
