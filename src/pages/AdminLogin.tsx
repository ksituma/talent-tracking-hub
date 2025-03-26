
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { loginUser } from '@/utils/supabase-utils';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First try to use Supabase
      const data = await loginUser(username, password);
      
      // Store login state and user data
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.user.firstName} ${data.user.lastName}! You are now signed in.`,
      });
      
      navigate('/dashboard');
    } catch (supabaseError) {
      console.error('Supabase login failed, trying fallback:', supabaseError);
      
      // Fallback to the backend server
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const data = await response.json();
        
        // Store login state and token
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.user.firstName} ${data.user.lastName}! You are now signed in.`,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Invalid username or password.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Talent ATS</h1>
          <p className="text-gray-600">Admin Dashboard Login</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email/Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <div>
              Default admin credentials: admin@ats.com / situm@2014
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
