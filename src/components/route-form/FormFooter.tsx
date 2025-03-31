
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormFooterProps {
  onContinue: () => void;
  isLastStep: boolean;
  error?: string | null;
}

const FormFooter = ({ onContinue, isLastStep, error }: FormFooterProps) => {
  return (
    <div className="mt-4 glass-panel p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <button
        onClick={onContinue}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/90 active:scale-95"
        type="button"
      >
        {isLastStep ? 'Save Route' : 'Continue'}
        {!isLastStep && <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default FormFooter;
