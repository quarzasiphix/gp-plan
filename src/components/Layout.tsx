
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, MapPin, Calendar, Plus, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: Home, text: 'Home', path: '/' },
    { icon: MapPin, text: 'Routes', path: '/routes' },
    { icon: Calendar, text: 'Calendar', path: '/calendar' },
    { icon: Plus, text: 'New Route', path: '/routes/new' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-accent/20">
      <header className={`glass-panel ${isMobile ? 'm-2 mb-0 p-2' : 'm-4 mb-0 p-4'} flex justify-between items-center`}>
        <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-all">
            <MapPin className="text-white h-4 w-4" />
          </div>
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold group-hover:text-primary transition-colors`}>PetWay</h1>
        </Link>
        
        {/* Desktop Navigation */}
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
        
        {/* Mobile Burger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-accent/50">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-panel w-64 p-4">
              <div className="mt-8 flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                      ${location.pathname === item.path 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-accent/80'}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.text}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <main className={`flex-grow ${isMobile ? 'p-2' : 'p-4'} overflow-y-auto`}>
        {children}
      </main>
      
      {/* Updated Mobile Bottom Navigation */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 z-10">
        <nav className="glass-panel m-2 mt-0 p-1 grid grid-cols-4 gap-1 rounded-xl">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center ${isMobile ? 'p-1.5' : 'p-2'} rounded-lg transition-all duration-300
                ${location.pathname === item.path 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent/80'}`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-[10px] mt-0.5">{item.text}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
