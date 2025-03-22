
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Index() {
  // For now, just redirect to the dashboard
  return <Navigate to="/dashboard" replace />;
}
