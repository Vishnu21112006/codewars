import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LabLinkProvider } from './context/LabLinkContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { LoadingState } from './components/LoadingState';

// Lazy-loaded routes for optimal bundle efficiency and fast initial load
const LoginPage = lazy(() => import('./pages/LoginPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const EquipmentList = lazy(() => import('./pages/EquipmentList'));
const AiAssistant = lazy(() => import('./pages/AiAssistant'));
const ProjectManagement = lazy(() => import('./pages/ProjectManagement'));
const BookingCalendar = lazy(() => import('./pages/BookingCalendar'));
const MyReservations = lazy(() => import('./pages/MyReservations'));
const FacultyDashboard = lazy(() => import('./pages/FacultyDashboard'));
const FacultyApprovalsPage = lazy(() => import('./pages/FacultyApprovalsPage'));
const ConflictResolutionDashboard = lazy(() => import('./pages/ConflictResolutionDashboard'));
const EquipmentManagement = lazy(() => import('./pages/EquipmentManagement'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AppLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, don't show navbar and sidebar
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Suspense fallback={<LoadingState message="Loading portal..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Body */}
      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto min-h-[calc(100vh-4rem)]">
          <Suspense fallback={<LoadingState message="Loading campus laboratory module..." />}>
            <Routes>
              <Route path="/" element={<Navigate to="/student" replace />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/projects" element={<ProjectManagement />} />
              <Route path="/calendar" element={<BookingCalendar />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/approvals" element={<FacultyApprovalsPage />} />
              <Route path="/conflicts" element={<ConflictResolutionDashboard />} />
              <Route path="/equipment-manage" element={<EquipmentManagement />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <LabLinkProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LabLinkProvider>
  );
}

export default App;
