import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function RootLayout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
