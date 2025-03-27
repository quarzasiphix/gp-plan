
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RouteForm from '@/components/RouteForm';
import { useRoutes } from '@/hooks/useRoutes';

const NewRoute = () => {
  const navigate = useNavigate();
  const { createRoute } = useRoutes();
  
  const handleSave = async (routeData) => {
    try {
      await createRoute(routeData);
      navigate('/routes');
    } catch (error) {
      console.error('Failed to create route:', error);
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
