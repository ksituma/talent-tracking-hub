
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/common/DatePicker';
import { ArrowRight, Plus, Trash2, Link } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

interface PublicationEntry {
  id: string;
  title: string;
  publicationDate?: Date;
  url: string;
}

interface PublicationsFormProps {
  onComplete: (data: PublicationEntry[]) => void;
  initialData?: PublicationEntry[];
}

export function PublicationsForm({ onComplete, initialData = [] }: PublicationsFormProps) {
  const [hasPublications, setHasPublications] = useState(initialData.length > 0);
  const [publications, setPublications] = useState<PublicationEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `pub-${Date.now()}`,
            title: '',
            publicationDate: undefined,
            url: '',
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const handleHasPublicationsChange = (value: string) => {
    const hasPubVal = value === 'yes';
    setHasPublications(hasPubVal);
    
    if (!hasPubVal) {
      setPublications([]);
    } else if (publications.length === 0) {
      setPublications([
        {
          id: `pub-${Date.now()}`,
          title: '',
          publicationDate: undefined,
          url: '',
        },
      ]);
    }
  };

  const handleAddPublication = () => {
    setPublications((prev) => [
      ...prev,
      {
        id: `pub-${Date.now()}`,
        title: '',
        publicationDate: undefined,
        url: '',
      },
    ]);
  };

  const handleRemovePublication = (id: string) => {
    setPublications((prev) => prev.filter((pub) => pub.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof PublicationEntry, value: any) => {
    setPublications((prev) =>
      prev.map((pub) => (pub.id === id ? { ...pub, [field]: value } : pub))
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
    if (!hasPublications) {
      return true;
    }

    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    publications.forEach((pub) => {
      const pubErrors: Record<string, string> = {};

      if (!pub.title.trim()) {
        pubErrors.title = 'Publication title is required';
        isValid = false;
      }

      if (!pub.publicationDate) {
        pubErrors.publicationDate = 'Publication date is required';
        isValid = false;
      }

      if (pub.url && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(pub.url)) {
        pubErrors.url = 'Please enter a valid URL';
        isValid = false;
      }

      if (Object.keys(pubErrors).length > 0) {
        newErrors[pub.id] = pubErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(hasPublications ? publications : []);
      toast({
        title: "Publications Information Saved",
        description: "Your publications information has been saved successfully.",
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
          Do you have any publications? <span className="text-red-500">*</span>
        </div>
        <RadioGroup
          value={hasPublications ? 'yes' : 'no'}
          onValueChange={handleHasPublicationsChange}
        >
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="publications-yes" />
              <Label htmlFor="publications-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="publications-no" />
              <Label htmlFor="publications-no">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {hasPublications && (
        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div
              key={pub.id}
              className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-900">
                  Publication #{index + 1}
                </h3>
                {publications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePublication(pub.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div>
                <label htmlFor={`title-${pub.id}`} className="form-label">
                  Publication Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`title-${pub.id}`}
                  value={pub.title}
                  onChange={(e) => handleChange(pub.id, 'title', e.target.value)}
                  placeholder="Enter publication title"
                  className={errors[pub.id]?.title ? 'border-red-500' : ''}
                />
                {errors[pub.id]?.title && (
                  <p className="form-error">{errors[pub.id].title}</p>
                )}
              </div>

              <DatePicker
                label="Publication Date"
                required
                value={pub.publicationDate}
                onChange={(date) => handleChange(pub.id, 'publicationDate', date)}
                placeholder="Pick a date"
                error={errors[pub.id]?.publicationDate}
                fromYear={1970}
                toYear={new Date().getFullYear()}
              />

              <div>
                <label htmlFor={`url-${pub.id}`} className="form-label">
                  Publication URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id={`url-${pub.id}`}
                    value={pub.url}
                    onChange={(e) => handleChange(pub.id, 'url', e.target.value)}
                    placeholder="https://example.com/publication"
                    className={`pl-10 ${errors[pub.id]?.url ? 'border-red-500' : ''}`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter a URL link to your publication (optional)
                </p>
                {errors[pub.id]?.url && (
                  <p className="form-error">{errors[pub.id].url}</p>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddPublication}
            className="flex items-center w-full justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Publication
          </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Referees
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
