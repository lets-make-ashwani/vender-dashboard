import { Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, Bell, BarChart3, Settings, UserCircle, GraduationCap, CheckCircle, XCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { Toaster, toast } from 'sonner';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Vendor Management', path: '/vendors' },
  { icon: UserCheck, label: 'Student Management', path: '/students' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: UserCircle, label: 'Profile', path: '/profile' }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVendors: 0,
    totalStudents: 0,
    monthlyStudents: 0
  });
  const [pendingApps, setPendingApps] = useState<any[]>([]);

  const fetchDashboardData = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, ''); // Removes trailing slash if present
        
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [statsRes, appsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/stats`, { headers }),
          fetch(`${apiUrl}/api/admin/applications/pending`, { headers })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (appsRes.ok) setPendingApps(await appsRes.json());
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/applications/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(`Application ${action}d successfully`);
        fetchDashboardData(); // Refresh the list
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const monthlyData = [
    { month: 'Jan', students: 400, vendors: 20 },
    { month: 'Feb', students: 550, vendors: 35 },
    { month: 'Mar', students: 720, vendors: 48 },
    { month: 'Apr', students: 890, vendors: 62 },
    { month: 'May', students: 1100, vendors: 75 },
    { month: 'Jun', students: 1350, vendors: 92 }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with Siksha Kendra today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Vendors" value={stats.totalVendors} icon={Users} color="primary" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} color="success" />
        <StatCard title="Monthly Students" value={stats.monthlyStudents} icon={BookOpen} color="warning" />
        <StatCard title="Pending Requests" value={stats.pendingVendors} icon={Bell} color="secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Student Registrations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Line type="monotone" dataKey="students" stroke="#FF6B00" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Vendor Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="vendors" fill="#0B1B52" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Vendor Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Vendor Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">City</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', city: 'Delhi', status: 'Pending' },
                { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43211', city: 'Mumbai', status: 'Pending' },
                { name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 43212', city: 'Ahmedabad', status: 'Pending' }
              ].map((vendor, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">{vendor.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{vendor.email}</td>
                  <td className="py-3 px-4 text-muted-foreground">{vendor.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{vendor.city}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-warning/20 text-warning rounded-[8px] text-sm font-semibold">
                      {vendor.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary-light rounded-[8px] transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-[8px] transition-colors" title="Reject">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </button>
                      <button className="p-2 hover:bg-primary-light rounded-[8px] transition-colors" title="View">
                        <Eye className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const VendorManagement = () => {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, '');
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/admin/vendors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setVendors(await response.json());
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  return (
  <div className="p-6">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
      <Button>Add Vendor</Button>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Vendor Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Students Referred</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No active vendors found.</td>
                </tr>
            ) : vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground">{vendor.vendor_id}</td>
                <td className="py-3 px-4 text-foreground">{vendor.user?.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{vendor.user?.email}</td>
                <td className="py-3 px-4 text-muted-foreground">{vendor.user?.phone}</td>
                <td className="py-3 px-4 text-foreground">{vendor._count?.studentLeads || 0}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${vendor.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)};

const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, '');
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/student-leads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setStudents(await response.json());
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  return (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Student Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Vendor</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Course</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Class</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No students have enrolled yet.</td>
                </tr>
            ) : students.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-mono">...{student.id.slice(-5)}</td>
                <td className="py-3 px-4 text-foreground">{student.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.vendor?.user?.name || 'Direct Enrollment'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown Course'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-success/20 text-success rounded-[8px] text-sm font-semibold">
                    Enrolled
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)};

export default function SuperAdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <Sidebar items={sidebarItems} basePath="/admin" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/courses" element={<div className="p-6"><h1 className="text-3xl font-bold">Courses</h1></div>} />
          <Route path="/notifications" element={<div className="p-6"><h1 className="text-3xl font-bold">Notifications</h1></div>} />
          <Route path="/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1></div>} />
          <Route path="/profile" element={<div className="p-6"><h1 className="text-3xl font-bold">Profile</h1></div>} />
        </Routes>
      </main>
    </div>
  );
}
