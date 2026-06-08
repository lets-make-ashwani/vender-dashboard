import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import CourseListing from './pages/CourseListing';
import CourseDetails from './pages/CourseDetails';
import StudentRegistration from './pages/StudentRegistration';
import VendorRegistration from './pages/VendorRegistration';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CourseListing />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/enroll/:referralCode" element={<StudentRegistration />} />
          <Route path="/become-vendor" element={<VendorRegistration />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/*" 
            element={
              <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}