
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteForm from '@/components/RouteForm';
import { useRoutes } from '@/hooks/useRoutes';
import { toast } from '@/components/ui/use-toast';

const NewRoute = () => {
  const navigate = useNavigate();
  const { createRoute } = useRoutes();
  
  // Error boundary effect
  useEffect(() => {
    console.log('NewRoute component mounted');
    return () => {
      console.log('NewRoute component unmounted');
    };
  }, []);
  
  const handleSave = async (routeData) => {
    try {
      console.log('Creating new route with data:', routeData);
      await createRoute(routeData);
      toast({
        title: "Success",
        description: "Route created successfully!",
      });
      navigate('/routes');
    } catch (error) {
      console.error('Failed to create route:', error);
      toast({
        title: "Error",
        description: "Failed to create route. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancel = () => {
    navigate('/routes');
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-accent/20">
      <RouteForm 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default NewRoute;
