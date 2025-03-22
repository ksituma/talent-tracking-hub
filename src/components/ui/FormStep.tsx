
import React from 'react';
import { cn } from '@/lib/utils';

interface FormStepProps {
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

export function FormStep({ title, description, isActive, isCompleted, onClick }: FormStepProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-1 items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-blue-50 text-blue-600" 
          : isCompleted 
            ? "text-green-600 hover:bg-green-50" 
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border">
        {isCompleted ? (
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <span className={cn(
            "text-xs font-semibold",
            isActive ? "text-blue-600" : "text-gray-500"
          )}>
            {title.charAt(0)}
          </span>
        )}
      </div>
      <span className="truncate">{title}</span>
    </button>
  );
}

interface FormStepsProps {
  steps: {
    id: string;
    title: string;
    description?: string;
  }[];
  activeStep: string;
  completedSteps: string[];
  onChange: (stepId: string) => void;
  className?: string;
}

export function FormSteps({ steps, activeStep, completedSteps, onChange, className }: FormStepsProps) {
  return (
    <nav className={cn("flex rounded-lg bg-white p-1 shadow-sm", className)}>
      {steps.map((step) => (
        <FormStep
          key={step.id}
          title={step.title}
          description={step.description}
          isActive={step.id === activeStep}
          isCompleted={completedSteps.includes(step.id)}
          onClick={() => onChange(step.id)}
        />
      ))}
    </nav>
  );
}
