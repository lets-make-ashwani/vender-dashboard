import { Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, Bell, BarChart3, Settings, UserCircle, GraduationCap, CheckCircle, XCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, ''); // Removes trailing slash if present
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);

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

const VendorManagement = () => (
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
            {Array.from({ length: 10 }).map((_, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="py-3 px-4 text-foreground">VND{String(idx + 1).padStart(4, '0')}</td>
                <td className="py-3 px-4 text-foreground">Vendor {idx + 1}</td>
                <td className="py-3 px-4 text-muted-foreground">vendor{idx + 1}@example.com</td>
                <td className="py-3 px-4 text-muted-foreground">+91 9876543{String(idx).padStart(3, '0')}</td>
                <td className="py-3 px-4 text-foreground">{Math.floor(Math.random() * 500) + 50}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-success/20 text-success rounded-[8px] text-sm font-semibold">
                    Active
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="ghost">Edit</Button>
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

const StudentManagement = () => (
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
            {Array.from({ length: 10 }).map((_, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="py-3 px-4 text-foreground">STU{String(idx + 1).padStart(5, '0')}</td>
                <td className="py-3 px-4 text-foreground">Student {idx + 1}</td>
                <td className="py-3 px-4 text-muted-foreground">Vendor {Math.floor(Math.random() * 10) + 1}</td>
                <td className="py-3 px-4 text-muted-foreground">JEE Advanced</td>
                <td className="py-3 px-4 text-muted-foreground">Class 12</td>
                <td className="py-3 px-4 text-muted-foreground">+91 9876543{String(idx).padStart(3, '0')}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-success/20 text-success rounded-[8px] text-sm font-semibold">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

export default function SuperAdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
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
