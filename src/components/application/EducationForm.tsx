
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/common/DatePicker';
import { FileUpload } from '@/components/common/FileUpload';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface EducationEntry {
  id: string;
  level: string;
  institution: string;
  fieldOfStudy: string;
  graduationDate?: Date;
  certificate: File | null;
}

interface EducationFormProps {
  onComplete: (data: EducationEntry[]) => void;
  initialData?: EducationEntry[];
}

export function EducationForm({ onComplete, initialData = [] }: EducationFormProps) {
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `education-${Date.now()}`,
            level: '',
            institution: '',
            fieldOfStudy: '',
            graduationDate: undefined,
            certificate: null,
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const educationLevels = [
    'High School Diploma',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate',
    'Vocational Certificate',
    'Professional License',
  ];

  const handleAddEntry = () => {
    setEducationEntries((prev) => [
      ...prev,
      {
        id: `education-${Date.now()}`,
        level: '',
        institution: '',
        fieldOfStudy: '',
        graduationDate: undefined,
        certificate: null,
      },
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    setEducationEntries((prev) => prev.filter((entry) => entry.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof EducationEntry, value: any) => {
    setEducationEntries((prev) =>
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

    educationEntries.forEach((entry) => {
      const entryErrors: Record<string, string> = {};

      if (!entry.level) {
        entryErrors.level = 'Education level is required';
        isValid = false;
      }

      if (!entry.institution.trim()) {
        entryErrors.institution = 'Institution is required';
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
      onComplete(educationEntries);
      toast({
        title: "Education Information Saved",
        description: "Your education information has been saved successfully.",
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
        {educationEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Education Entry #{index + 1}
              </h3>
              {educationEntries.length > 1 && (
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
                <label htmlFor={`level-${entry.id}`} className="form-label">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <Select
                  value={entry.level}
                  onValueChange={(value) => handleChange(entry.id, 'level', value)}
                >
                  <SelectTrigger
                    id={`level-${entry.id}`}
                    className={errors[entry.id]?.level ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[entry.id]?.level && (
                  <p className="form-error">{errors[entry.id].level}</p>
                )}
              </div>

              <div>
                <label htmlFor={`institution-${entry.id}`} className="form-label">
                  Institution <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`institution-${entry.id}`}
                  value={entry.institution}
                  onChange={(e) => handleChange(entry.id, 'institution', e.target.value)}
                  placeholder="University/College Name"
                  className={errors[entry.id]?.institution ? 'border-red-500' : ''}
                />
                {errors[entry.id]?.institution && (
                  <p className="form-error">{errors[entry.id].institution}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`fieldOfStudy-${entry.id}`} className="form-label">
                  Field of Study
                </label>
                <Input
                  id={`fieldOfStudy-${entry.id}`}
                  value={entry.fieldOfStudy}
                  onChange={(e) => handleChange(entry.id, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g., Computer Science"
                />
              </div>

              <DatePicker
                label="Graduation Date"
                value={entry.graduationDate}
                onChange={(date) => handleChange(entry.id, 'graduationDate', date)}
                placeholder="Pick a date"
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />
            </div>

            <FileUpload
              label="Certificate"
              helperText="Upload your certificate for this education level (PDF, JPG, or PNG format)"
              onChange={(file) => handleChange(entry.id, 'certificate', file)}
              value={entry.certificate}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddEntry}
        className="flex items-center w-full justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Education Entry
      </Button>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Experience
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
