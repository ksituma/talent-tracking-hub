
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/common/DatePicker';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ExperienceEntry {
  id: string;
  organization: string;
  designation: string;
  jobGroup: string;
  startDate?: Date;
  endDate?: Date;
}

interface ExperienceFormProps {
  onComplete: (data: ExperienceEntry[]) => void;
  initialData?: ExperienceEntry[];
}

export function ExperienceForm({ onComplete, initialData = [] }: ExperienceFormProps) {
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `experience-${Date.now()}`,
            organization: '',
            designation: '',
            jobGroup: '',
            startDate: undefined,
            endDate: undefined,
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const totalExperience = useMemo(() => {
    let totalMonths = 0;

    experienceEntries.forEach((entry) => {
      if (entry.startDate) {
        const start = new Date(entry.startDate);
        const end = entry.endDate ? new Date(entry.endDate) : new Date();
        
        // Calculate months between these dates
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        
        if (months > 0) {
          totalMonths += months;
        }
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return `${years} years ${months} months`;
  }, [experienceEntries]);

  const handleAddEntry = () => {
    setExperienceEntries((prev) => [
      ...prev,
      {
        id: `experience-${Date.now()}`,
        organization: '',
        designation: '',
        jobGroup: '',
        startDate: undefined,
        endDate: undefined,
      },
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    setExperienceEntries((prev) => prev.filter((entry) => entry.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof ExperienceEntry, value: any) => {
    setExperienceEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
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

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    experienceEntries.forEach((entry) => {
      const entryErrors: Record<string, string> = {};

      if (!entry.organization.trim()) {
        entryErrors.organization = 'Organization is required';
        isValid = false;
      }

      if (!entry.designation.trim()) {
        entryErrors.designation = 'Designation is required';
        isValid = false;
      }

      if (!entry.jobGroup.trim()) {
        entryErrors.jobGroup = 'Job group is required';
        isValid = false;
      }

      if (!entry.startDate) {
        entryErrors.startDate = 'Start date is required';
        isValid = false;
      }

      if (entry.startDate && entry.endDate && entry.startDate > entry.endDate) {
        entryErrors.endDate = 'End date cannot be before start date';
        isValid = false;
      }

      if (Object.keys(entryErrors).length > 0) {
        newErrors[entry.id] = entryErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(experienceEntries);
      toast({
        title: "Experience Information Saved",
        description: "Your work experience information has been saved successfully.",
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
        {experienceEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Work Experience #{index + 1}
              </h3>
              {experienceEntries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`organization-${entry.id}`} className="form-label">
                  Organization <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`organization-${entry.id}`}
                  value={entry.organization}
                  onChange={(e) => handleChange(entry.id, 'organization', e.target.value)}
                  placeholder="Company Name"
                  className={errors[entry.id]?.organization ? 'border-red-500' : ''}
                />
                {errors[entry.id]?.organization && (
                  <p className="form-error">{errors[entry.id].organization}</p>
                )}
              </div>

              <div>
                <label htmlFor={`designation-${entry.id}`} className="form-label">
                  Designation <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`designation-${entry.id}`}
                  value={entry.designation}
                  onChange={(e) => handleChange(entry.id, 'designation', e.target.value)}
                  placeholder="Your Position"
                  className={errors[entry.id]?.designation ? 'border-red-500' : ''}
                />
                {errors[entry.id]?.designation && (
                  <p className="form-error">{errors[entry.id].designation}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={`jobGroup-${entry.id}`} className="form-label">
                Job Group <span className="text-red-500">*</span>
              </label>
              <Input
                id={`jobGroup-${entry.id}`}
                value={entry.jobGroup}
                onChange={(e) => handleChange(entry.id, 'jobGroup', e.target.value)}
                placeholder="e.g., A, B, C, D"
                className={errors[entry.id]?.jobGroup ? 'border-red-500' : ''}
              />
              {errors[entry.id]?.jobGroup && (
                <p className="form-error">{errors[entry.id].jobGroup}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DatePicker
                label="Start Date"
                required
                value={entry.startDate}
                onChange={(date) => handleChange(entry.id, 'startDate', date)}
                placeholder="Pick a date"
                error={errors[entry.id]?.startDate}
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />

              <DatePicker
                label="End Date"
                value={entry.endDate}
                onChange={(date) => handleChange(entry.id, 'endDate', date)}
                placeholder="Pick a date or leave blank if current job"
                error={errors[entry.id]?.endDate}
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Total Work Experience:</span> {totalExperience}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddEntry}
        className="flex items-center w-full justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Experience Entry
      </Button>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Short Courses
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
