
import React from 'react';
import { useRouteForm } from './route-form/useRouteForm';
import FormStepHeader from './route-form/FormStepHeader';
import FormFooter from './route-form/FormFooter';
import BasicInfoStep from './route-form/BasicInfoStep';
import StartingPointStep from './route-form/StartingPointStep';
import AddStopsStep from './route-form/AddStopsStep';
import ReturnJourneyStep from './route-form/ReturnJourneyStep';
import ReviewStep from './route-form/ReviewStep';
import { type Location } from '@/hooks/use-location-search';

interface RouteFormProps {
  initialRoute?: any; // Using any to match existing code
  onSave: (routeData: any) => void;
  onCancel: () => void;
}

const RouteForm = ({ initialRoute = null, onSave, onCancel }: RouteFormProps) => {
  const {
    currentStep,
    routeData,
    date,
    currentLocation,
    steps,
    handleInputChange,
    setDate,
    handleLocationSelect,
    addStop,
    removeStop,
    handleContinue,
    handleBack,
    handleSave
  } = useRouteForm({ initialRoute, onSave });
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep 
            routeName={routeData.name} 
            date={date} 
            onNameChange={handleInputChange} 
            onDateChange={setDate} 
          />
        );
      case 1:
        return (
          <StartingPointStep 
            currentLocation={currentLocation}
            onLocationSelect={handleLocationSelect}
            onAddStop={addStop}
          />
        );
      case 2:
        return (
          <AddStopsStep 
            stops={routeData.stops}
            currentLocation={currentLocation}
            onLocationSelect={handleLocationSelect}
            onAddStop={addStop}
            onRemoveStop={(index) => removeStop(index)}
          />
        );
      case 3:
        return (
          <ReturnJourneyStep 
            returnJourney={routeData.returnJourney}
            lastStop={routeData.stops[routeData.stops.length - 1]}
            returnStops={routeData.returnStops}
            currentLocation={currentLocation}
            onReturnJourneyChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
            onAddStop={addStop}
            onRemoveStop={(index) => removeStop(index, true)}
          />
        );
      case 4:
        return (
          <ReviewStep 
            routeName={routeData.name}
            startDate={routeData.startDate}
            stops={routeData.stops}
            returnJourney={routeData.returnJourney}
            returnStops={routeData.returnStops}
          />
        );
      default:
        return null;
    }
  };
  
  const onBackWrapper = () => {
    const didHandleBack = handleBack();
    if (!didHandleBack) {
      onCancel();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <FormStepHeader 
        steps={steps} 
        currentStep={currentStep} 
        onBack={onBackWrapper} 
        isEditing={!!initialRoute}
      />
      
      <div className="flex-1 overflow-hidden">
        {renderStepContent()}
      </div>
      
      <FormFooter 
        onContinue={handleContinue} 
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
};

export default RouteForm;
