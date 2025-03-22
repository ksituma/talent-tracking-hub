
import React, { useState } from 'react';
import { FormSteps } from '@/components/ui/FormStep';
import { PersonalInfoForm } from './PersonalInfoForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { ShortCoursesForm } from './ShortCoursesForm';
import { ProfessionalBodiesForm } from './ProfessionalBodiesForm';
import { PublicationsForm } from './PublicationsForm';
import { RefereesForm } from './RefereesForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const steps = [
  { id: 'personal', title: 'Personal' },
  { id: 'education', title: 'Education' },
  { id: 'experience', title: 'Experience' },
  { id: 'short-courses', title: 'Short Courses' },
  { id: 'professional-bodies', title: 'Professional Bodies' },
  { id: 'publications', title: 'Publications' },
  { id: 'referees', title: 'Referees' },
];

export function ApplicationForm() {
  const [activeStep, setActiveStep] = useState('personal');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    personal: {},
    education: [],
    experience: [],
    shortCourses: [],
    professionalBodies: [],
    publications: [],
    referees: [],
    termsAccepted: false,
  });

  const handleStepChange = (stepId: string) => {
    setActiveStep(stepId);
  };

  const handleStepComplete = (stepId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [stepId.replace('-', '')]: data,
    }));

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }

    const currentIndex = steps.findIndex((step) => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Terms and Conditions Required",
        description: "Please accept the terms and conditions to submit your application.",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting application:', formData);
    
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
      variant: "default",
    });
  };

  const renderActiveStep = () => {
    switch (activeStep) {
      case 'personal':
        return (
          <PersonalInfoForm
            onComplete={(data) => handleStepComplete('personal', data)}
            initialData={formData.personal}
          />
        );
      case 'education':
        return (
          <EducationForm
            onComplete={(data) => handleStepComplete('education', data)}
            initialData={formData.education}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            onComplete={(data) => handleStepComplete('experience', data)}
            initialData={formData.experience}
          />
        );
      case 'short-courses':
        return (
          <ShortCoursesForm
            onComplete={(data) => handleStepComplete('short-courses', data)}
            initialData={formData.shortCourses}
          />
        );
      case 'professional-bodies':
        return (
          <ProfessionalBodiesForm
            onComplete={(data) => handleStepComplete('professional-bodies', data)}
            initialData={formData.professionalBodies}
          />
        );
      case 'publications':
        return (
          <PublicationsForm
            onComplete={(data) => handleStepComplete('publications', data)}
            initialData={formData.publications}
          />
        );
      case 'referees':
        return (
          <RefereesForm
            onComplete={(data) => handleStepComplete('referees', data)}
            initialData={formData.referees}
            onTermsChange={(accepted) => 
              setFormData((prev) => ({ ...prev, termsAccepted: accepted }))
            }
            termsAccepted={formData.termsAccepted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Job Application Form</h1>
        <p className="text-sm text-gray-600">Please fill out all required fields to submit your application.</p>
      </div>

      <div className="mb-8 overflow-x-auto">
        <FormSteps
          steps={steps}
          activeStep={activeStep}
          completedSteps={completedSteps}
          onChange={handleStepChange}
          className="min-w-max"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {renderActiveStep()}
      </div>
      
      <div className="mt-8 flex justify-between">
        {activeStep !== 'personal' && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous: {steps[steps.findIndex((step) => step.id === activeStep) - 1]?.title}
          </Button>
        )}
        {activeStep !== 'referees' ? (
          <Button
            type="button"
            className="ml-auto flex items-center"
            onClick={() => {
              // This is just for the demo, normally this would validate the current step
              const currentIndex = steps.findIndex((step) => step.id === activeStep);
              if (currentIndex < steps.length - 1) {
                setActiveStep(steps[currentIndex + 1].id);
              }
            }}
          >
            Next: {steps[steps.findIndex((step) => step.id === activeStep) + 1]?.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="ml-auto flex items-center"
            onClick={handleSubmit}
          >
            Submit Application
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
