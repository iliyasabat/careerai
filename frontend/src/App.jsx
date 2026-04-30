import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ATSScorePage from './pages/ATSScorePage';
import CuratorPage from './pages/CuratorPage';
import JobSearchPage from './pages/JobSearchPage';
import SkillGapPage from './pages/SkillGapPage';
import ColdEmailPage from './pages/ColdEmailPage';
import TrackerPage from './pages/TrackerPage';
import InterviewPage from './pages/InterviewPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/auth', element: <AuthPage /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'resume', element: <ResumeUploadPage /> },
      { path: 'ats', element: <ATSScorePage /> },
      { path: 'curator', element: <CuratorPage /> },
      { path: 'jobs', element: <JobSearchPage /> },
      { path: 'skills', element: <SkillGapPage /> },
      { path: 'email', element: <ColdEmailPage /> },
      { path: 'interview', element: <InterviewPage /> },
      { path: 'tracker', element: <TrackerPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
