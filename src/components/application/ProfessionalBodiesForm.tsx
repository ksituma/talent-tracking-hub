
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/common/DatePicker';
import { FileUpload } from '@/components/common/FileUpload';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

interface ProfessionalBodyEntry {
  id: string;
  bodyName: string;
  membershipDate?: Date;
  certificate: File | null;
}

interface ProfessionalBodiesFormProps {
  onComplete: (data: ProfessionalBodyEntry[]) => void;
  initialData?: ProfessionalBodyEntry[];
}

export function ProfessionalBodiesForm({ onComplete, initialData = [] }: ProfessionalBodiesFormProps) {
  const [isMember, setIsMember] = useState(initialData.length > 0);
  const [professionalBodies, setProfessionalBodies] = useState<ProfessionalBodyEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `body-${Date.now()}`,
            bodyName: '',
            membershipDate: undefined,
            certificate: null,
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const professionalBodiesList = [
    'IEEE - Institute of Electrical and Electronics Engineers',
    'ACM - Association for Computing Machinery',
    'PMI - Project Management Institute',
    'ISACA - Information Systems Audit and Control Association',
    'AMA - American Management Association',
    'SHRM - Society for Human Resource Management',
    'ABA - American Bar Association',
    'AMA - American Medical Association',
    'CPA - Certified Public Accountants',
    'AICPA - American Institute of CPAs',
  ];

  const handleIsMemberChange = (value: string) => {
    const isMemVal = value === 'yes';
    setIsMember(isMemVal);
    
    if (!isMemVal) {
      setProfessionalBodies([]);
    } else if (professionalBodies.length === 0) {
      setProfessionalBodies([
        {
          id: `body-${Date.now()}`,
          bodyName: '',
          membershipDate: undefined,
          certificate: null,
        },
      ]);
    }
  };

  const handleAddBody = () => {
    setProfessionalBodies((prev) => [
      ...prev,
      {
        id: `body-${Date.now()}`,
        bodyName: '',
        membershipDate: undefined,
        certificate: null,
      },
    ]);
  };

  const handleRemoveBody = (id: string) => {
    setProfessionalBodies((prev) => prev.filter((body) => body.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof ProfessionalBodyEntry, value: any) => {
    setProfessionalBodies((prev) =>
      prev.map((body) => (body.id === id ? { ...body, [field]: value } : body))
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
    if (!isMember) {
      return true;
    }

    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    professionalBodies.forEach((body) => {
      const bodyErrors: Record<string, string> = {};

      if (!body.bodyName) {
        bodyErrors.bodyName = 'Professional body is required';
        isValid = false;
      }

      if (!body.membershipDate) {
        bodyErrors.membershipDate = 'Membership date is required';
        isValid = false;
      }

      if (Object.keys(bodyErrors).length > 0) {
        newErrors[body.id] = bodyErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(isMember ? professionalBodies : []);
      toast({
        title: "Professional Bodies Information Saved",
        description: "Your professional bodies information has been saved successfully.",
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
      <div>
        <div className="form-label">
          Are you a member of any professional body? <span className="text-red-500">*</span>
        </div>
        <RadioGroup
          value={isMember ? 'yes' : 'no'}
          onValueChange={handleIsMemberChange}
        >
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="member-yes" />
              <Label htmlFor="member-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="member-no" />
              <Label htmlFor="member-no">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {isMember && (
        <div className="space-y-6">
          {professionalBodies.map((body, index) => (
            <div
              key={body.id}
              className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-900">
                  Professional Body #{index + 1}
                </h3>
                {professionalBodies.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBody(body.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div>
                <label htmlFor={`bodyName-${body.id}`} className="form-label">
                  Professional Body <span className="text-red-500">*</span>
                </label>
                <Select
                  value={body.bodyName}
                  onValueChange={(value) => handleChange(body.id, 'bodyName', value)}
                >
                  <SelectTrigger
                    id={`bodyName-${body.id}`}
                    className={errors[body.id]?.bodyName ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select professional body" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalBodiesList.map((bodyName) => (
                      <SelectItem key={bodyName} value={bodyName}>
                        {bodyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[body.id]?.bodyName && (
                  <p className="form-error">{errors[body.id].bodyName}</p>
                )}
              </div>

              <DatePicker
                label="Membership Date"
                required
                value={body.membershipDate}
                onChange={(date) => handleChange(body.id, 'membershipDate', date)}
                placeholder="Pick a date"
                error={errors[body.id]?.membershipDate}
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />

              <FileUpload
                label="Membership Certificate"
                helperText="Upload your membership certificate (PDF, JPG, or PNG format)"
                onChange={(file) => handleChange(body.id, 'certificate', file)}
                value={body.certificate}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddBody}
            className="flex items-center w-full justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Professional Body
          </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Publications
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
