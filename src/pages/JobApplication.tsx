
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { useSearchParams, Navigate } from 'react-router-dom';

export default function JobApplication() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  // Redirect to jobs listing if no jobId is provided
  if (!jobId) {
    return <Navigate to="/" />;
  }

  return (
    <AppShell>
      <ApplicationForm jobId={jobId} />
    </AppShell>
  );
}
