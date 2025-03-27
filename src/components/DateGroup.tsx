
import React from 'react';
import { Calendar } from 'lucide-react';
import RouteCard from './RouteCard';

const DateGroup = ({ date, routes, onEditRoute, onDeleteRoute }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  return (
    <div className="animate-fade-in mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{formattedDate}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onEdit={onEditRoute}
            onDelete={onDeleteRoute}
          />
        ))}
      </div>
    </div>
  );
};

export default DateGroup;
