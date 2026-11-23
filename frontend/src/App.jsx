import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LabLinkProvider } from './context/LabLinkContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import EquipmentList from './pages/EquipmentList';
import AiAssistant from './pages/AiAssistant';
import ProjectManagement from './pages/ProjectManagement';
import BookingCalendar from './pages/BookingCalendar';
import MyReservations from './pages/MyReservations';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyApprovalsPage from './pages/FacultyApprovalsPage';
import ConflictResolutionDashboard from './pages/ConflictResolutionDashboard';
import EquipmentManagement from './pages/EquipmentManagement';
import AdminDashboard from './pages/AdminDashboard';

function AppLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, don't show navbar and sidebar
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
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
