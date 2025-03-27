
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import DateGroup from '@/components/DateGroup';
import { useRoutes } from '@/hooks/useRoutes';

const Routes = () => {
  const { groupedRoutes, loading, error, deleteRoute } = useRoutes();
  
  const handleEdit = (id) => {
    window.location.href = `/routes/edit/${id}`;
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      await deleteRoute(id);
    }
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Routes</h1>
          <p className="text-muted-foreground">View and manage your transportation routes</p>
        </div>
        
        <Link
          to="/routes/new"
          className="glass-button px-4 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Route</span>
        </Link>
      </div>
      
      {loading ? (
        <div className="glass-panel p-12 flex justify-center">
          <div className="animate-pulse">Loading routes...</div>
        </div>
      ) : error ? (
        <div className="glass-panel p-6 bg-destructive/10 text-destructive">
          {error}
        </div>
      ) : groupedRoutes.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <h3 className="text-xl font-medium mb-2">No routes found</h3>
          <p className="text-muted-foreground mb-6">Create your first route to get started</p>
          <Link
            to="/routes/new"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Route</span>
          </Link>
        </div>
      ) : (
        <div>
          {groupedRoutes.map((group) => (
            <DateGroup
              key={group.date}
              date={group.date}
              routes={group.routes}
              onEditRoute={handleEdit}
              onDeleteRoute={handleDelete}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Routes;
