
import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { saveSettings, fetchSettings, sendEmail } from '@/utils/supabase-utils';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'TalentATS Inc.',
    systemEmail: 'recruitment@talentats.com',
    timezone: 'UTC+0',
    dateFormat: 'MM/DD/YYYY'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplicationAlerts: true,
    jobPostingExpiryAlerts: true
  });
  
  const [recruitmentSettings, setRecruitmentSettings] = useState({
    minYearsExperience: 2,
    minQualification: 'Bachelor\'s Degree',
    skillMatchThreshold: 70,
    automaticShortlisting: true
  });

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await fetchSettings();
        
        if (settings) {
          // Update general settings
          setGeneralSettings({
            companyName: settings.companyName || 'TalentATS Inc.',
            systemEmail: settings.systemEmail || 'recruitment@talentats.com',
            timezone: settings.timezone || 'UTC+0',
            dateFormat: settings.dateFormat || 'MM/DD/YYYY'
          });
          
          // Update notification settings
          setNotificationSettings({
            emailNotifications: settings.emailNotifications ?? true,
            newApplicationAlerts: settings.newApplicationAlerts ?? true,
            jobPostingExpiryAlerts: settings.jobPostingExpiryAlerts ?? true
          });
          
          // Update recruitment settings
          setRecruitmentSettings({
            minYearsExperience: settings.minYearsExperience ?? 2,
            minQualification: settings.minQualification || 'Bachelor\'s Degree',
            skillMatchThreshold: settings.skillMatchThreshold ?? 70,
            automaticShortlisting: settings.automaticShortlisting ?? true
          });
          
          console.log('Settings loaded successfully:', settings);
        } else {
          console.log('No settings found, using defaults');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationChange = (value) => {
    setRecruitmentSettings(prev => ({ ...prev, minQualification: value }));
  };

  const handleRecruitmentChange = (e) => {
    const { name, value } = e.target;
    setRecruitmentSettings(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleAutomaticShortlistingChange = (value) => {
    setRecruitmentSettings(prev => ({ ...prev, automaticShortlisting: value }));
  };

  const handleTestEmail = async () => {
    try {
      setIsLoading(true);
      await sendEmail({
        to: generalSettings.systemEmail,
        subject: 'Test Email from TalentATS',
        html: `
          <h1>Test Email from TalentATS</h1>
          <p>This is a test email to confirm your email settings are working correctly.</p>
          <p>Company: ${generalSettings.companyName}</p>
          <p>Timezone: ${generalSettings.timezone}</p>
          <p>Date Format: ${generalSettings.dateFormat}</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        `,
      });
      
      toast({
        title: "Test email sent",
        description: `Email has been sent to ${generalSettings.systemEmail}`
      });
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast({
        variant: "destructive",
        title: "Failed to send test email",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Combine all settings
      const combinedSettings = {
        ...generalSettings,
        ...notificationSettings,
        ...recruitmentSettings
      };
      
      await saveSettings(combinedSettings);
      
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully saved."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto py-6">
        <h2 className="text-2xl font-bold mb-6">System Settings</h2>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your basic system settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName"
                    value={generalSettings.companyName} 
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemEmail">System Email</Label>
                  <Input 
                    id="systemEmail" 
                    name="systemEmail"
                    type="email" 
                    value={generalSettings.systemEmail} 
                    onChange={handleGeneralChange}
                  />
                  <p className="text-sm text-gray-500">This email will be used for system notifications.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input 
                      id="timezone" 
                      name="timezone"
                      value={generalSettings.timezone} 
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Input 
                      id="dateFormat" 
                      name="dateFormat"
                      value={generalSettings.dateFormat} 
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTestEmail}
                    disabled={isLoading}
                  >
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure the email notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Enable or disable all email notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications} 
                    onCheckedChange={(value) => handleSwitchChange('emailNotifications', value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Application Alerts</p>
                    <p className="text-sm text-gray-500">Get an email when a new application is submitted</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.newApplicationAlerts} 
                    onCheckedChange={(value) => handleSwitchChange('newApplicationAlerts', value)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Posting Expiry Alerts</p>
                    <p className="text-sm text-gray-500">Get an email when a job posting is about to expire</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.jobPostingExpiryAlerts} 
                    onCheckedChange={(value) => handleSwitchChange('jobPostingExpiryAlerts', value)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recruitment">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Settings</CardTitle>
                <CardDescription>Configure your recruitment and shortlisting preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="minYearsExperience">Minimum Years of Experience</Label>
                  <Input 
                    id="minYearsExperience" 
                    name="minYearsExperience"
                    type="number" 
                    min="0"
                    value={recruitmentSettings.minYearsExperience} 
                    onChange={handleRecruitmentChange}
                  />
                  <p className="text-sm text-gray-500">Default minimum experience required for job postings</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQualification">Minimum Qualification</Label>
                  <Select 
                    value={recruitmentSettings.minQualification} 
                    onValueChange={handleQualificationChange}
                  >
                    <SelectTrigger id="minQualification">
                      <SelectValue placeholder="Select minimum qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Default minimum qualification for job postings</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillMatchThreshold">Skill Match Threshold (%)</Label>
                  <Input 
                    id="skillMatchThreshold" 
                    name="skillMatchThreshold"
                    type="number" 
                    min="0" 
                    max="100"
                    value={recruitmentSettings.skillMatchThreshold} 
                    onChange={handleRecruitmentChange}
                  />
                  <p className="text-sm text-gray-500">Required percentage of skills matching for automatic shortlisting</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Shortlisting</p>
                    <p className="text-sm text-gray-500">Automatically shortlist candidates that meet all criteria</p>
                  </div>
                  <Switch 
                    checked={recruitmentSettings.automaticShortlisting} 
                    onCheckedChange={handleAutomaticShortlistingChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
