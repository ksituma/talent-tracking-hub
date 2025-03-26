
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { useSearchParams } from 'react-router-dom';

export default function JobApplication() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  return (
    <AppShell>
      <ApplicationForm jobId={jobId} />
    </AppShell>
  );
}
