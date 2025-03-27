
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, ChevronRight, ArrowLeft, Trash } from 'lucide-react';
import Map from './Map';

const RouteForm = ({ initialRoute = null, onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [routeData, setRouteData] = useState({
    name: initialRoute?.name || '',
    startDate: initialRoute?.startDate || '',
    stops: initialRoute?.stops || [],
    returnJourney: initialRoute?.returnJourney || false,
    returnStops: initialRoute?.returnStops || [],
  });
  
  const [currentLocation, setCurrentLocation] = useState(null);
  
  const steps = [
    { title: 'Basic Info', description: 'Set route name and departure date' },
    { title: 'Starting Point', description: 'Select the first stop of your journey' },
    { title: 'Add Stops', description: 'Add stops along your route' },
    { title: 'Return Journey', description: 'Optional: plan the return trip' },
    { title: 'Review', description: 'Confirm your route details' },
  ];
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRouteData({
      ...routeData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
  };
  
  const addStop = () => {
    if (!currentLocation) return;
    
    // If we're on step 1 (starting point), set it as first stop
    if (currentStep === 1) {
      setRouteData({
        ...routeData,
        stops: [currentLocation],
      });
      setCurrentStep(2);
    } 
    // If we're on step 2 (adding stops), add to existing stops
    else if (currentStep === 2) {
      setRouteData({
        ...routeData,
        stops: [...routeData.stops, currentLocation],
      });
    }
    // If we're on step 3 (return journey), add to return stops
    else if (currentStep === 3 && routeData.returnJourney) {
      setRouteData({
        ...routeData,
        returnStops: [...routeData.returnStops, currentLocation],
      });
    }
    
    setCurrentLocation(null);
  };
  
  const removeStop = (index, isReturnStop = false) => {
    if (isReturnStop) {
      const newReturnStops = [...routeData.returnStops];
      newReturnStops.splice(index, 1);
      setRouteData({ ...routeData, returnStops: newReturnStops });
    } else {
      const newStops = [...routeData.stops];
      newStops.splice(index, 1);
      setRouteData({ ...routeData, stops: newStops });
    }
  };
  
  const handleContinue = () => {
    // Validate current step
    if (currentStep === 0) {
      if (!routeData.name || !routeData.startDate) return;
    }
    
    if (currentStep === 1 && routeData.stops.length === 0) {
      return;
    }
    
    if (currentStep === 2 && routeData.stops.length < 2) {
      return;
    }
    
    // Move to next step or save if on last step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };
  
  const handleSave = () => {
    // Calculate durations and distances (mock implementation)
    const mockDuration = '12h 30m';
    const mockDistance = '950 km';
    
    const completeRoute = {
      ...routeData,
      id: initialRoute?.id || Date.now().toString(),
      duration: mockDuration,
      distance: mockDistance,
    };
    
    onSave(completeRoute);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-fade-in space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Route Name</label>
              <input
                type="text"
                name="name"
                value={routeData.name}
                onChange={handleInputChange}
                placeholder="e.g. Poland to Spain Trip"
                className="search-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Departure Date</label>
              <input
                type="date"
                name="startDate"
                value={routeData.startDate}
                onChange={handleInputChange}
                className="search-input"
                required
              />
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="animate-fade-in h-[calc(100vh-320px)]">
            <Map
              onLocationSelect={handleLocationSelect}
              interactive={true}
            />
            
            {currentLocation && (
              <div className="mt-4 p-4 glass-panel animate-scale-in">
                <h3 className="font-medium">Selected Location</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
                <button
                  onClick={addStop}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  Set as Starting Point
                </button>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="animate-fade-in h-[calc(100vh-320px)]">
            <Map
              onLocationSelect={handleLocationSelect}
              markers={routeData.stops}
              interactive={true}
            />
            
            <div className="mt-4 glass-panel p-4 divide-y divide-border">
              <h3 className="font-medium mb-2">Current Stops</h3>
              
              {routeData.stops.map((stop, index) => (
                <div key={index} className="py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full p-1">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stop.address.split(',')[0]}</p>
                      <p className="text-xs text-muted-foreground">{stop.address.split(',').slice(1).join(',').trim()}</p>
                    </div>
                  </div>
                  
                  {index > 0 && (
                    <button
                      onClick={() => removeStop(index)}
                      className="p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {currentLocation && (
                <div className="py-3">
                  <h3 className="font-medium mb-2">Add This Stop?</h3>
                  <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
                  <button
                    onClick={addStop}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    Add Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="returnJourney"
                name="returnJourney"
                checked={routeData.returnJourney}
                onChange={handleInputChange}
                className="rounded-sm"
              />
              <label htmlFor="returnJourney" className="font-medium">Plan Return Journey</label>
            </div>
            
            {routeData.returnJourney ? (
              <div className="h-[calc(100vh-360px)]">
                <Map
                  onLocationSelect={handleLocationSelect}
                  markers={[...routeData.stops.slice(-1), ...routeData.returnStops]}
                  interactive={true}
                />
                
                <div className="mt-4 glass-panel p-4 divide-y divide-border">
                  <h3 className="font-medium mb-2">Return Journey Stops</h3>
                  <div className="py-2 flex justify-between items-center opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 rounded-full p-1">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{routeData.stops[routeData.stops.length - 1]?.address.split(',')[0]}</p>
                        <p className="text-xs text-muted-foreground">Starting point of return</p>
                      </div>
                    </div>
                  </div>
                  
                  {routeData.returnStops.map((stop, index) => (
                    <div key={index} className="py-2 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-full p-1">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{stop.address.split(',')[0]}</p>
                          <p className="text-xs text-muted-foreground">{stop.address.split(',').slice(1).join(',').trim()}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeStop(index, true)}
                        className="p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {currentLocation && (
                    <div className="py-3">
                      <h3 className="font-medium mb-2">Add This Stop?</h3>
                      <p className="text-sm text-muted-foreground mb-3">{currentLocation.address}</p>
                      <button
                        onClick={addStop}
                        className="w-full bg-primary text-primary-foreground py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                        Add Return Stop
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 text-center">
                <p className="text-muted-foreground">No return journey planned.</p>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="animate-fade-in space-y-6 h-[calc(100vh-320px)] overflow-auto">
            <div className="glass-panel p-4">
              <h3 className="font-medium mb-2">Route Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{routeData.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Departure Date</p>
                  <p className="font-medium">{new Date(routeData.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Stops</p>
                  <p className="font-medium">{routeData.stops.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Return Journey</p>
                  <p className="font-medium">{routeData.returnJourney ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-4">
              <h3 className="font-medium mb-2">Journey Map</h3>
              <div className="h-52">
                <Map
                  markers={routeData.stops}
                  route={routeData.stops}
                  interactive={false}
                />
              </div>
            </div>
            
            <div className="glass-panel p-4">
              <h3 className="font-medium mb-2">Stops</h3>
              <div className="space-y-2">
                {routeData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 rounded-full p-1 shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{stop.address.split(',')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {stop.address.split(',').slice(1).join(',').trim()}
                      </p>
                    </div>
                    <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                      {index === 0 ? 'Start' : index === routeData.stops.length - 1 ? 'End' : `Stop ${index}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {routeData.returnJourney && routeData.returnStops.length > 0 && (
              <div className="glass-panel p-4">
                <h3 className="font-medium mb-2">Return Journey</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg opacity-70">
                    <div className="bg-primary/10 rounded-full p-1 shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {routeData.stops[routeData.stops.length - 1]?.address.split(',')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">Return starting point</p>
                    </div>
                    <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                      Start
                    </div>
                  </div>
                  
                  {routeData.returnStops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                      <div className="bg-primary/10 rounded-full p-1 shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{stop.address.split(',')[0]}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {stop.address.split(',').slice(1).join(',').trim()}
                        </p>
                      </div>
                      <div className="text-xs bg-accent px-2 py-0.5 rounded-full ml-auto shrink-0">
                        {index === routeData.returnStops.length - 1 ? 'End' : `Stop ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="glass-panel p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-semibold">
            {initialRoute ? 'Edit Route' : 'Create New Route'}
          </h2>
        </div>
        
        {/* Progress indicator */}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`h-1 rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
        
        <div className="mt-3">
          <h3 className="font-medium">{steps[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderStepContent()}
      </div>
      
      <div className="mt-4 glass-panel p-4">
        <button
          onClick={handleContinue}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
        >
          {currentStep === steps.length - 1 ? 'Save Route' : 'Continue'}
          {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default RouteForm;
