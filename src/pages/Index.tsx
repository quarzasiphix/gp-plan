import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Plus, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import { useRoutes } from '@/hooks/useRoutes';
import RouteCard from '@/components/RouteCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const { groupedRoutes, loading, error, deleteRoute } = useRoutes();
  
  // Get upcoming routes (first 3)
  const upcomingRoutes = groupedRoutes
    .flatMap(group => group.routes)
    .filter(route => {
      const startDate = new Date(route.startDate);
      return startDate >= new Date();
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);
  
  console.log('Upcoming routes:', upcomingRoutes);
  
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">PetWay Planner</h1>
        <p className="text-muted-foreground">Plan and manage your pet transportation routes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 h-[300px] md:h-[400px] mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Route Overview</h2>
            </div>
            <Map 
              markers={groupedRoutes.flatMap(group => group.routes.flatMap(route => route.stops || []))}
              interactive={false} 
              onLocationSelect={() => {}} // Add empty handler to satisfy the prop requirement
            />
          </div>
          
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Routes</h2>
              <Link 
                to="/routes" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                View all routes <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-pulse">Loading routes...</div>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            ) : upcomingRoutes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No upcoming routes found</p>
                <Link 
                  to="/routes/new" 
                  className="inline-flex items-center mt-4 text-primary hover:underline"
                >
                  Create your first route <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingRoutes.map(route => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/routes/new" 
                className="glass-button w-full py-4 px-4 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="font-medium">Create New Route</h3>
                  <p className="text-xs text-muted-foreground">Plan a new transport journey</p>
                </div>
              </Link>
              
              <Link 
                to="/routes" 
                className="glass-button w-full py-4 px-4 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="font-medium">View All Routes</h3>
                  <p className="text-xs text-muted-foreground">Browse and manage routes</p>
                </div>
              </Link>
              
              <Link 
                to="/calendar" 
                className="glass-button w-full py-4 px-4 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3 text-left">
                  <h3 className="font-medium">Calendar View</h3>
                  <p className="text-xs text-muted-foreground">See routes on calendar</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Route Statistics</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Routes</h3>
                <p className="text-3xl font-bold">
                  {groupedRoutes.reduce((acc, group) => acc + group.routes.length, 0)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Routes</h3>
                <p className="text-3xl font-bold">{upcomingRoutes.length}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Distance</h3>
                <p className="text-3xl font-bold">
                  {groupedRoutes
                    .flatMap(group => group.routes)
                    .reduce((acc, route) => acc + parseInt(route.distance.replace(/,/g, '')), 0)
                    .toLocaleString()} km
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
