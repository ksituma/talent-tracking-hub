
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import JobApplication from "./pages/JobApplication";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Initialize jobs data if not already present
  if (!localStorage.getItem('talent_ats_jobs')) {
    const defaultJobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        postedDate: '2023-06-15',
        closingDate: '2023-07-15',
        description: 'Looking for a senior software engineer with expertise in React, Node.js, and cloud technologies.',
        requirements: ['5+ years of experience', 'React', 'Node.js', 'AWS', 'CI/CD'],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
        featured: true,
        logo: '/lovable-uploads/c527b9f6-c10f-40f4-b84c-67261743d4c4.png',
        yearsOfExperience: 5,
        minQualification: 'Bachelor\'s Degree'
      },
      {
        id: 2,
        title: 'UI/UX Designer',
        company: 'Creative Solutions',
        location: 'Remote',
        type: 'Contract',
        salary: '$80,000 - $100,000',
        postedDate: '2023-06-20',
        closingDate: '2023-07-20',
        description: 'Seeking a talented UI/UX designer to create beautiful, intuitive interfaces for our products.',
        requirements: ['3+ years of experience', 'Figma', 'Adobe XD', 'User Research'],
        skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping'],
        featured: false,
        yearsOfExperience: 3,
        minQualification: 'Bachelor\'s Degree'
      },
      {
        id: 3,
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        postedDate: '2023-06-18',
        closingDate: '2023-07-18',
        description: 'Join our data science team to build machine learning models and analyze large datasets.',
        requirements: ['Masters/PhD in relevant field', 'Python', 'Machine Learning', 'SQL'],
        skills: ['Python', 'TensorFlow', 'SQL', 'Data Visualization', 'Machine Learning'],
        featured: false,
        yearsOfExperience: 4,
        minQualification: 'Master\'s Degree'
      },
      {
        id: 4,
        title: 'Product Manager',
        company: 'Product Visionaries',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$110,000 - $140,000',
        postedDate: '2023-06-22',
        closingDate: '2023-07-22',
        description: 'Lead product development initiatives from conception to launch.',
        requirements: ['4+ years in product management', 'Agile methodologies', 'Technical background'],
        skills: ['Product Strategy', 'User Stories', 'Roadmapping', 'Agile', 'Market Research'],
        featured: true,
        yearsOfExperience: 4,
        minQualification: 'Bachelor\'s Degree'
      },
    ];
    localStorage.setItem('talent_ats_jobs', JSON.stringify(defaultJobs));
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/candidates" element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            } />
            <Route path="/stats" element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/application/new" element={<JobApplication />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
