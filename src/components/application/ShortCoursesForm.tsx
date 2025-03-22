
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/common/DatePicker';
import { FileUpload } from '@/components/common/FileUpload';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ShortCourseEntry {
  id: string;
  courseName: string;
  completionDate?: Date;
  certificate: File | null;
}

interface ShortCoursesFormProps {
  onComplete: (data: ShortCourseEntry[]) => void;
  initialData?: ShortCourseEntry[];
}

export function ShortCoursesForm({ onComplete, initialData = [] }: ShortCoursesFormProps) {
  const [shortCourses, setShortCourses] = useState<ShortCourseEntry[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: `course-${Date.now()}`,
            courseName: '',
            completionDate: undefined,
            certificate: null,
          },
        ]
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const handleAddCourse = () => {
    setShortCourses((prev) => [
      ...prev,
      {
        id: `course-${Date.now()}`,
        courseName: '',
        completionDate: undefined,
        certificate: null,
      },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    setShortCourses((prev) => prev.filter((course) => course.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleChange = (id: string, field: keyof ShortCourseEntry, value: any) => {
    setShortCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, [field]: value } : course))
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

    shortCourses.forEach((course) => {
      const courseErrors: Record<string, string> = {};

      if (!course.courseName.trim()) {
        courseErrors.courseName = 'Course name is required';
        isValid = false;
      }

      if (!course.completionDate) {
        courseErrors.completionDate = 'Completion date is required';
        isValid = false;
      }

      if (Object.keys(courseErrors).length > 0) {
        newErrors[course.id] = courseErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onComplete(shortCourses);
      toast({
        title: "Short Courses Information Saved",
        description: "Your short courses information has been saved successfully.",
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
        {shortCourses.map((course, index) => (
          <div
            key={course.id}
            className="bg-gray-50 rounded-lg p-6 space-y-6 border border-gray-200 animate-scale-in"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Short Course #{index + 1}
              </h3>
              {shortCourses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCourse(course.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div>
              <label htmlFor={`courseName-${course.id}`} className="form-label">
                Course Name <span className="text-red-500">*</span>
              </label>
              <Input
                id={`courseName-${course.id}`}
                value={course.courseName}
                onChange={(e) => handleChange(course.id, 'courseName', e.target.value)}
                placeholder="e.g., Project Management Fundamentals"
                className={errors[course.id]?.courseName ? 'border-red-500' : ''}
              />
              {errors[course.id]?.courseName && (
                <p className="form-error">{errors[course.id].courseName}</p>
              )}
            </div>

            <DatePicker
              label="Completion Date"
              required
              value={course.completionDate}
              onChange={(date) => handleChange(course.id, 'completionDate', date)}
              placeholder="Pick a date"
              error={errors[course.id]?.completionDate}
              fromYear={1970}
              toYear={new Date().getFullYear()}
            />

            <FileUpload
              label="Certificate"
              helperText="Upload your certificate for this course (PDF, JPG, or PNG format)"
              onChange={(file) => handleChange(course.id, 'certificate', file)}
              value={course.certificate}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddCourse}
        className="flex items-center w-full justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Short Course
      </Button>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center">
          Next: Professional Bodies
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
