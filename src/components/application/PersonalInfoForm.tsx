
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/common/DatePicker';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PersonalInfoFormProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

export function PersonalInfoForm({ onComplete, initialData = {} }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    middleName: initialData.middleName || '',
    lastName: initialData.lastName || '',
    address: initialData.address || '',
    gender: initialData.gender || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : undefined,
    ethnicity: initialData.ethnicity || '',
    homeCountry: initialData.homeCountry || '',
    disability: initialData.disability || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name: string, date?: Date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.ethnicity) {
      newErrors.ethnicity = 'Ethnicity is required';
    }
    
    if (!formData.homeCountry) {
      newErrors.homeCountry = 'Home country is required';
    }
    
    if (!formData.disability) {
      newErrors.disability = 'This field is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
      toast({
        title: "Personal Information Saved",
        description: "Your personal information has been saved successfully.",
      });
    } else {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  // Ethnicities list for dropdown
  const ethnicities = [
    'African', 'Asian', 'Caucasian', 'Hispanic/Latino', 
    'Middle Eastern', 'Native American', 'Pacific Islander', 'Other'
  ];

  // Countries list for dropdown
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
        <div>
          <label htmlFor="firstName" className="form-label">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="middleName" className="form-label">
            Middle Name
          </label>
          <Input
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="David"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="form-label">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="form-label">
          Physical Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && <p className="form-error">{errors.address}</p>}
      </div>

      <div>
        <div className="form-label">
          Gender <span className="text-red-500">*</span>
        </div>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleSelectChange('gender', value)}
        >
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="gender-other" />
              <Label htmlFor="gender-other">Other</Label>
            </div>
          </div>
        </RadioGroup>
        {errors.gender && <p className="form-error">{errors.gender}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="form-label">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+254 123 456 789"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DatePicker
          label="Date of Birth"
          required
          value={formData.dateOfBirth}
          onChange={(date) => handleDateChange('dateOfBirth', date)}
          placeholder="Pick a date"
          error={errors.dateOfBirth}
          fromYear={1950}
          toYear={new Date().getFullYear() - 16}
        />

        <div>
          <label htmlFor="ethnicity" className="form-label">
            Ethnicity <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.ethnicity}
            onValueChange={(value) => handleSelectChange('ethnicity', value)}
          >
            <SelectTrigger 
              id="ethnicity"
              className={errors.ethnicity ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select your ethnicity" />
            </SelectTrigger>
            <SelectContent>
              {ethnicities.map((ethnicity) => (
                <SelectItem key={ethnicity} value={ethnicity.toLowerCase()}>
                  {ethnicity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ethnicity && <p className="form-error">{errors.ethnicity}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="homeCountry" className="form-label">
          Home Country <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.homeCountry}
          onValueChange={(value) => handleSelectChange('homeCountry', value)}
        >
          <SelectTrigger 
            id="homeCountry"
            className={errors.homeCountry ? 'border-red-500' : ''}
          >
            <SelectValue placeholder="Select your home country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country.toLowerCase()}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.homeCountry && <p className="form-error">{errors.homeCountry}</p>}
      </div>

      <div>
        <div className="form-label">
          Are you living with a disability? <span className="text-red-500">*</span>
        </div>
        <RadioGroup
          value={formData.disability}
          onValueChange={(value) => handleSelectChange('disability', value)}
        >
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="disability-yes" />
              <Label htmlFor="disability-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="disability-no" />
              <Label htmlFor="disability-no">No</Label>
            </div>
          </div>
        </RadioGroup>
        {errors.disability && <p className="form-error">{errors.disability}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Education
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
