
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { type Location } from '@/hooks/use-location-search';
import { format } from "date-fns";

interface RouteData {
  name: string;
  startDate: string;
  stops: Location[];
  returnJourney: boolean;
  returnStops: Location[];
  id?: string;
  duration?: string;
  distance?: string;
}

interface UseRouteFormProps {
  initialRoute: RouteData | null;
  onSave: (routeData: RouteData) => void;
}

export const useRouteForm = ({ initialRoute, onSave }: UseRouteFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [routeData, setRouteData] = useState<RouteData>({
    name: initialRoute?.name || '',
    startDate: initialRoute?.startDate || '',
    stops: initialRoute?.stops || [],
    returnJourney: initialRoute?.returnJourney || false,
    returnStops: initialRoute?.returnStops || [],
  });
  
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [date, setDate] = useState<Date | undefined>(() => {
    if (initialRoute?.startDate) {
      try {
        return new Date(initialRoute.startDate);
      } catch (e) {
        console.error("Failed to parse initial date:", e);
        return undefined;
      }
    }
    return undefined;
  });
  
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setRouteData(prev => ({
        ...prev,
        startDate: formattedDate
      }));
    }
  }, [date]);
  
  const steps = [
    { title: 'Basic Info', description: 'Set route name and departure date' },
    { title: 'Starting Point', description: 'Select the first stop of your journey' },
    { title: 'Add Stops', description: 'Add stops along your route' },
    { title: 'Return Journey', description: 'Optional: plan the return trip' },
    { title: 'Review', description: 'Confirm your route details' },
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRouteData({
      ...routeData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleLocationSelect = (location: Location) => {
    console.log("Location selected:", location);
    setCurrentLocation(location);
    // Clear any validation errors when a location is selected
    setValidationError(null);
  };
  
  const addStop = () => {
    if (!currentLocation) {
      setValidationError("Please select a location first");
      return;
    }
    
    if (currentStep === 1) {
      setRouteData({
        ...routeData,
        stops: [currentLocation],
      });
      console.log("Starting point added, moving to next step");
      setCurrentStep(2);
      setValidationError(null);
    } 
    else if (currentStep === 2) {
      setRouteData({
        ...routeData,
        stops: [...routeData.stops, currentLocation],
      });
      console.log("Stop added to journey");
      setValidationError(null);
    }
    else if (currentStep === 3 && routeData.returnJourney) {
      setRouteData({
        ...routeData,
        returnStops: [...routeData.returnStops, currentLocation],
      });
      console.log("Stop added to return journey");
      setValidationError(null);
    }
    
    setCurrentLocation(null);
  };
  
  const removeStop = (index: number, isReturnStop = false) => {
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
  
  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!routeData.name || !routeData.startDate) {
          setValidationError("Please provide a route name and departure date");
          return false;
        }
        break;
      case 1:
        if (routeData.stops.length === 0) {
          setValidationError("Please select a starting point for your journey");
          return false;
        }
        break;
      case 2:
        if (routeData.stops.length < 2) {
          setValidationError("Please add at least one additional stop to your journey");
          return false;
        }
        break;
      default:
        break;
    }
    setValidationError(null);
    return true;
  };
  
  const handleContinue = () => {
    console.log("Continue button clicked, current step:", currentStep);
    
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      console.log("Moving to next step");
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Final step, saving route");
      handleSave();
    }
  };
  
  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Let the parent component handle the cancel action
      return false;
    }
    return true;
  };
  
  const handleSave = () => {
    const completeRoute = {
      ...routeData,
      id: initialRoute?.id || Date.now().toString(),
    };
    
    console.log("Saving route:", completeRoute);
    onSave(completeRoute);
  };

  return {
    currentStep,
    routeData,
    date,
    currentLocation,
    steps,
    validationError,
    handleInputChange,
    setDate,
    handleLocationSelect,
    addStop,
    removeStop,
    handleContinue,
    handleBack,
    handleSave
  };
};
