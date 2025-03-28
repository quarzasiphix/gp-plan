
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RouteForm from '@/components/RouteForm';
import { useRoutes } from '@/hooks/useRoutes';
import { routeApi } from '@/utils/routeApi';
import { toast } from '@/components/ui/use-toast';

const EditRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRoute } = useRoutes();
  
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        console.log(`Fetching route data for ID: ${id}`);
        const data = await routeApi.getRoute(id);
        console.log("Retrieved route data:", data);
        setRoute(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching route data:", err);
        setError(err.message);
        toast({
          title: "Error Loading Route",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoute();
  }, [id]);
  
  const handleSave = async (routeData) => {
    try {
      await updateRoute(id, routeData);
      toast({
        title: "Success",
        description: "Route updated successfully!"
      });
      navigate('/routes');
    } catch (error) {
      console.error('Failed to update route:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update the route",
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    navigate('/routes');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <div className="glass-panel p-8 animate-pulse">Loading route data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <div className="glass-panel p-8 bg-destructive/10 text-destructive">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/routes')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Routes
          </button>
        </div>
      </div>
    );
  }
  
  // If we couldn't load the route, provide a fallback
  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <div className="glass-panel p-8 bg-warning/10">
          <h2 className="text-xl font-bold mb-2">Route Not Found</h2>
          <p>The requested route could not be loaded.</p>
          <button 
            onClick={() => navigate('/routes')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Routes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-accent/20">
      <RouteForm 
        initialRoute={route}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditRoute;
