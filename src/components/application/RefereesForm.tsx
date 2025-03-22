
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Trash2, Phone, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

interface RefereeEntry {
  id: string;
  name: string;
  designation: string;
  organization: string;
  mobile: string;
  email: string;
}

interface RefereesFormProps {
  onComplete: (data: RefereeEntry[]) => void;
  initialData?: RefereeEntry[];
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export function RefereesForm({ 
  onComplete, 
  initialData = [],
  termsAccepted,
  onTermsChange
}: RefereesFormProps) {
  const [referees, setReferees] = useState<RefereeEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `referee-${Date.now()}`,
            name: '',
            designation: '',
            organization: '',
            mobile: '',
            email: '',
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [termsError, setTermsError] = useState('');

  const handleAddReferee = () => {
    setReferees((prev) => [
      ...prev,
      {
        id: `referee-${Date.now()}`,
        name: '',
        designation: '',
        organization: '',
        mobile: '',
        email: '',
      },
    ]);
  };

  const handleRemoveReferee = (id: string) => {
    setReferees((prev) => prev.filter((referee) => referee.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof RefereeEntry, value: any) => {
    setReferees((prev) =>
      prev.map((referee) => (referee.id === id ? { ...referee, [field]: value } : referee))
    );

    if (errors[id]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: '',
        },
      }));
    }
  };

  const handleTermsChange = (checked: boolean) => {
    onTermsChange(checked);
    if (checked) {
      setTermsError('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    referees.forEach((referee) => {
      const refereeErrors: Record<string, string> = {};

      if (!referee.name.trim()) {
        refereeErrors.name = 'Name of referee is required';
        isValid = false;
      }

      if (!referee.designation.trim()) {
        refereeErrors.designation = 'Designation is required';
        isValid = false;
      }

      if (!referee.organization.trim()) {
        refereeErrors.organization = 'Organization is required';
        isValid = false;
      }

      if (!referee.mobile.trim()) {
        refereeErrors.mobile = 'Mobile contact is required';
        isValid = false;
      }

      if (!referee.email.trim()) {
        refereeErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(referee.email)) {
        refereeErrors.email = 'Email is invalid';
        isValid = false;
      }

      if (Object.keys(refereeErrors).length > 0) {
        newErrors[referee.id] = refereeErrors;
      }
    });

    setErrors(newErrors);

    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(referees);
      toast({
        title: "Referees Information Saved",
        description: "Your referees information has been saved successfully.",
      });
    } else {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {referees.map((referee, index) => (
          <div
            key={referee.id}
            className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Referee #{index + 1}
              </h3>
              {referees.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveReferee(referee.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`name-${referee.id}`} className="form-label">
                  Name of Referee <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`name-${referee.id}`}
                  value={referee.name}
                  onChange={(e) => handleChange(referee.id, 'name', e.target.value)}
                  placeholder="Full name"
                  className={errors[referee.id]?.name ? 'border-red-500' : ''}
                />
                {errors[referee.id]?.name && (
                  <p className="form-error">{errors[referee.id].name}</p>
                )}
              </div>

              <div>
                <label htmlFor={`designation-${referee.id}`} className="form-label">
                  Designation of Referee <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`designation-${referee.id}`}
                  value={referee.designation}
                  onChange={(e) => handleChange(referee.id, 'designation', e.target.value)}
                  placeholder="e.g., Manager, Professor"
                  className={errors[referee.id]?.designation ? 'border-red-500' : ''}
                />
                {errors[referee.id]?.designation && (
                  <p className="form-error">{errors[referee.id].designation}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={`organization-${referee.id}`} className="form-label">
                Organization of Referee <span className="text-red-500">*</span>
              </label>
              <Input
                id={`organization-${referee.id}`}
                value={referee.organization}
                onChange={(e) => handleChange(referee.id, 'organization', e.target.value)}
                placeholder="Company/Institution name"
                className={errors[referee.id]?.organization ? 'border-red-500' : ''}
              />
              {errors[referee.id]?.organization && (
                <p className="form-error">{errors[referee.id].organization}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`mobile-${referee.id}`} className="form-label">
                  Mobile Contact of Referee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id={`mobile-${referee.id}`}
                    value={referee.mobile}
                    onChange={(e) => handleChange(referee.id, 'mobile', e.target.value)}
                    placeholder="+254 123 456 789"
                    className={`pl-10 ${errors[referee.id]?.mobile ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors[referee.id]?.mobile && (
                  <p className="form-error">{errors[referee.id].mobile}</p>
                )}
              </div>

              <div>
                <label htmlFor={`email-${referee.id}`} className="form-label">
                  Email of Referee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id={`email-${referee.id}`}
                    type="email"
                    value={referee.email}
                    onChange={(e) => handleChange(referee.id, 'email', e.target.value)}
                    placeholder="referee@example.com"
                    className={`pl-10 ${errors[referee.id]?.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors[referee.id]?.email && (
                  <p className="form-error">{errors[referee.id].email}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddReferee}
        className="flex items-center w-full justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Referee
      </Button>

      <div className="space-y-4 border-t pt-6 mt-6">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={handleTermsChange}
            className={termsError ? 'border-red-500' : ''}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Terms and Conditions <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500">
              I confirm that all information provided in this application is true and accurate to the best of my knowledge. I understand that any false statement may result in the rejection of my application or termination of employment.
            </p>
            {termsError && <p className="form-error">{termsError}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Submit Application
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
