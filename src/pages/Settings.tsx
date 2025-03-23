import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Bell, 
  Shield, 
  User, 
  Database,
  Filter,
  Download
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
  const [minExperience, setMinExperience] = useState<number>(2);
  const [minScore, setMinScore] = useState<number>(70);

  return (
    <AppShell>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-gray-600">Configure your recruitment system</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="shortlisting" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Shortlisting
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your basic system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="TalentATS Inc." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="system-email">System Email</Label>
                  <Input id="system-email" type="email" defaultValue="recruitment@talentats.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC+0" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input id="date-format" defaultValue="MM/DD/YYYY" />
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Application Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified when a new application is submitted
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Job Posting Expiry</Label>
                    <p className="text-sm text-gray-500">
                      Get alerts before job postings expire
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shortlisting">
            <Card>
              <CardHeader>
                <CardTitle>Shortlisting Criteria</CardTitle>
                <CardDescription>
                  Configure the criteria used to automatically shortlist candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Minimum Years of Experience</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[minExperience]} 
                      onValueChange={(values) => setMinExperience(values[0])}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{minExperience} years</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Candidates with less than the minimum years will not be shortlisted automatically
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Qualification Requirements</Label>
                  <Select defaultValue="bachelors">
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Minimum</SelectItem>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Minimum qualification required for automatic shortlisting
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Skill Match Score Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[minScore]} 
                      onValueChange={(values) => setMinScore(values[0])}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{minScore}%</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Candidates with skill match below this percentage will not be shortlisted
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Shortlisting</Label>
                    <p className="text-sm text-gray-500">
                      Automatically shortlist candidates based on criteria
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button>Save Criteria</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>
                  View and manage your database schema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-2">Current Schema</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-md">
                      <h4 className="font-medium">jobs</h4>
                      <p className="text-sm text-gray-600">Stores job listings</p>
                      <div className="mt-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-medium text-gray-700">
                          <span>Field</span>
                          <span>Type</span>
                          <span>Description</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600 mt-1">
                          <span>id</span>
                          <span>number</span>
                          <span>Primary key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>title</span>
                          <span>string</span>
                          <span>Job title</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>company</span>
                          <span>string</span>
                          <span>Company name</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded-md">
                      <h4 className="font-medium">candidates</h4>
                      <p className="text-sm text-gray-600">Stores candidate information</p>
                      <div className="mt-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-medium text-gray-700">
                          <span>Field</span>
                          <span>Type</span>
                          <span>Description</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600 mt-1">
                          <span>id</span>
                          <span>number</span>
                          <span>Primary key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>name</span>
                          <span>string</span>
                          <span>Full name</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>email</span>
                          <span>string</span>
                          <span>Contact email</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded-md">
                      <h4 className="font-medium">applications</h4>
                      <p className="text-sm text-gray-600">Stores job applications</p>
                      <div className="mt-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 font-medium text-gray-700">
                          <span>Field</span>
                          <span>Type</span>
                          <span>Description</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600 mt-1">
                          <span>id</span>
                          <span>number</span>
                          <span>Primary key</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>job_id</span>
                          <span>number</span>
                          <span>Foreign key to jobs</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-600">
                          <span>candidate_id</span>
                          <span>number</span>
                          <span>Foreign key to candidates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Schema
                  </Button>
                  <Button>View Full Schema</Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-md font-medium mb-2 text-blue-700">Deployment Guide</h3>
                  <p className="text-sm text-blue-600 mb-2">
                    To deploy this application with a database using Coolify:
                  </p>
                  <ol className="text-sm text-blue-600 list-decimal pl-5 space-y-1">
                    <li>Sign up for a Coolify account at <a href="https://coolify.io" target="_blank" rel="noopener noreferrer" className="underline">coolify.io</a></li>
                    <li>Set up a new Coolify server or connect to an existing one</li>
                    <li>Create a new PostgreSQL database resource in Coolify</li>
                    <li>Create a new application and connect it to your GitHub repository</li>
                    <li>Set the database connection string as an environment variable in your application settings</li>
                    <li>Deploy your application and database together</li>
                  </ol>
                  <Button variant="link" className="text-blue-700 p-0 h-auto mt-2">
                    View detailed deployment guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" defaultValue="Sarah Johnson" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input id="email-address" type="email" defaultValue="sarah.johnson@talentats.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" defaultValue="HR Manager" />
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Button>Update Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                  <Button>Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
