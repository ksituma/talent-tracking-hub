
import React from 'react';
import { PublicShell } from '@/components/layout/PublicShell';
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
    <PublicShell>
      <ApplicationForm jobId={jobId} />
    </PublicShell>
  );
}
