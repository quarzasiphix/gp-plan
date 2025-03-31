
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FormStepHeaderProps {
  steps: { title: string; description: string }[];
  currentStep: number;
  onBack: () => void;
  isEditing: boolean;
}

const FormStepHeader = ({ 
  steps, 
  currentStep, 
  onBack, 
  isEditing 
}: FormStepHeaderProps) => {
  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-accent/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold">
          {isEditing ? 'Edit Route' : 'Create New Route'}
        </h2>
      </div>
      
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
  );
};

export default FormStepHeader;
