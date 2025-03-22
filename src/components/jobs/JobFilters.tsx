
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface JobFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
}

export interface JobFilters {
  search: string;
  location: string;
  type: string;
  skills: string[];
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    type: '',
    skills: [],
  });
  
  const [skillInput, setSkillInput] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Remote', 'Chicago, IL', 'Austin, TX'];

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAddSkill = () => {
    if (skillInput && !filters.skills.includes(skillInput)) {
      const newSkills = [...filters.skills, skillInput];
      setFilters({ ...filters, skills: newSkills });
      onFilterChange({ ...filters, skills: newSkills });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = filters.skills.filter(s => s !== skill);
    setFilters({ ...filters, skills: newSkills });
    onFilterChange({ ...filters, skills: newSkills });
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      location: '',
      type: '',
      skills: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h2 className="font-semibold text-lg mb-4">Filter Jobs</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search job titles or keywords"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any location</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any type</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="skills">Skills</Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              placeholder="Add a skill (e.g. React, Python)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" onClick={handleAddSkill} variant="secondary">
              Add
            </Button>
          </div>
          
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
