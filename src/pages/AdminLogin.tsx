
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Lock, User, Database, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | null>(null);
  const navigate = useNavigate();

  // Check database connection on component mount
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Function to check database connection
  const checkDatabaseConnection = async () => {
    setDbStatus('checking');
    try {
      // Try Supabase connection
      const { data, error } = await supabase.from('jobs').select('count').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        throw error;
      }
      setDbStatus('connected');
    } catch (error) {
      console.error('Database connection check failed:', error);
      
      // Try fallback to health API
      try {
        const response = await fetch('/health');
        if (response.ok) {
          const data = await response.json();
          if (data.database === 'connected') {
            setDbStatus('connected');
          } else {
            setDbStatus('error');
          }
        } else {
          setDbStatus('error');
        }
      } catch (fallbackError) {
        setDbStatus('error');
        console.error('Fallback check failed:', fallbackError);
      }
    }
  };

  // Check if already logged in
  const isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true';
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if we're using Supabase or the API
      if (dbStatus === 'connected') {
        // Try Supabase login first
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', username)
            .eq('password', password)
            .single();
          
          if (error || !data) {
            throw new Error('Invalid credentials');
          }
          
          // Store authentication state
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('token', 'supabase-auth-token');
          localStorage.setItem('userId', data.id);
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${data.firstname} ${data.lastname}!`,
          });
          navigate('/dashboard');
          return;
        } catch (supabaseError) {
          console.error('Supabase login failed, trying API:', supabaseError);
          // Fall back to API login
        }
        
        // Using real API if database is connected
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Authentication failed');
        }
        
        const data = await response.json();
        
        // Store authentication state
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        navigate('/dashboard');
      } else {
        // Fallback to hardcoded login while database connection is being set up
        if (username === 'admin' && password === 'kenyaDLC00') {
          // Mock API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Store authentication state - in production this would use JWT tokens
          localStorage.setItem('adminLoggedIn', 'true');
          
          toast({
            title: "Login Successful (Local Mode)",
            description: "Welcome to the admin dashboard. Note: You're using local authentication.",
          });
          navigate('/dashboard');
        } else {
          throw new Error("Invalid credentials");
        }
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard
          </CardDescription>
          {dbStatus && (
            <div className={`flex items-center justify-center mt-2 text-sm ${
              dbStatus === 'connected' ? 'text-green-500' : 
              dbStatus === 'error' ? 'text-red-500' : 'text-yellow-500'
            }`}>
              <Database className="h-4 w-4 mr-1" />
              {dbStatus === 'connected' ? (
                <span className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Database Connected</span>
              ) : dbStatus === 'error' ? (
                <span className="flex items-center"><XCircle className="h-3 w-3 mr-1" /> Database Connection Error</span>
              ) : (
                <span>Checking Database...</span>
              )}
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="admin"
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
