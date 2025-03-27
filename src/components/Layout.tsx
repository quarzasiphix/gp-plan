
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, MapPin, Calendar, Plus } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, text: 'Home', path: '/' },
    { icon: MapPin, text: 'Routes', path: '/routes' },
    { icon: Calendar, text: 'Calendar', path: '/calendar' },
    { icon: Plus, text: 'New Route', path: '/routes/new' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-accent/20">
      <header className="glass-panel m-4 mb-0 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MapPin className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">PetWay</h1>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                ${location.pathname === item.path 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'hover:bg-accent/80'}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.text}</span>
            </Link>
          ))}
        </nav>
      </header>
      
      <main className="flex-grow p-4 overflow-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <nav className="md:hidden glass-panel m-4 mt-0 p-2 grid grid-cols-4 gap-1">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300
              ${location.pathname === item.path 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent/80'}`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
