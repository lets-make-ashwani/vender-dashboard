import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { BarChart3, Users, UserCheck, Clock, UserCircle, Settings, Copy, Share2, QrCode, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Student List', path: '/students' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: LogOut, label: 'Logout', path: '/logout' }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todaysStudents: 0,
    monthlyStudents: 0,
    referral_code: 'Loading...'
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, '');
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, studentsRes] = await Promise.all([
          fetch(`${apiUrl}/api/vendor/stats`, { headers }),
          fetch(`${apiUrl}/api/student-leads`, { headers })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (studentsRes.ok) {
          const allStudents = await studentsRes.json();
          setRecentStudents(allStudents.slice(0, 5)); // Only show latest 5
        }
      } catch (error) { console.error("Error loading vendor data:", error); }
    };
    fetchData();
  }, []);

  const referralLink = `${window.location.origin}/enroll/${stats.referral_code}`;

  const monthlyData = [
    { month: 'Jan', students: 12 },
    { month: 'Feb', students: 18 },
    { month: 'Mar', students: 25 },
    { month: 'Apr', students: 32 },
    { month: 'May', students: 45 },
    { month: 'Jun', students: 58 }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(`Join Topper's Siksha Kendra through my referral link: ${referralLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnTelegram = () => {
    const message = encodeURIComponent(`Join Topper's Siksha Kendra through my referral link: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${referralLink}&text=${message}`, '_blank');
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" richColors />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Track your referrals and student enrollments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Referrals" value={stats.totalStudents} icon={Users} color="primary" />
        <StatCard title="Monthly Referrals" value={stats.monthlyStudents} icon={BarChart3} color="success" />
        <StatCard title="Today's Referrals" value={stats.todaysStudents} icon={Clock} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-6">Referral System</h3>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your Referral Code</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-primary-light border-2 border-primary rounded-[12px] px-4 py-3">
                  <p className="text-2xl font-bold text-primary text-center tracking-wider">{stats.referral_code}</p>
                </div>
                <Button variant="outline" onClick={() => copyToClipboard(stats.referral_code)}>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Referral Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-input-background border border-input rounded-[12px] px-4 py-3 text-foreground text-sm"
                />
                <Button variant="outline" onClick={() => copyToClipboard(referralLink)}>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Share Via</label>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="flex-1" onClick={shareOnWhatsApp}>
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1" onClick={shareOnTelegram}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
            </div>

            {showQR && (
              <div className="bg-card border-2 border-border rounded-[12px] p-6 text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-light to-accent rounded-[12px] flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">QR Code for {stats.referral_code}</p>
                <p className="text-xs text-muted-foreground mt-1">Students can scan this to register</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Enrollments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="students" fill="#FF6B00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Student Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Student Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Course</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.length === 0 ? (
                 <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No students referred yet.</td></tr>
              ) : recentStudents.map((student, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">{student.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-success/20 text-success rounded-[8px] text-sm font-semibold">
                      Enrolled
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const StudentList = () => {
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
      <h1 className="text-3xl font-bold text-foreground">All Students</h1>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Student Name</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Phone</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Class</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Course</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
                 <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No students referred yet.</td></tr>
            ) : students.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground">{student.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown'}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-success/20 text-success rounded-[8px] text-sm font-semibold">
                    Enrolled
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
)};

const Profile = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">Vendor Profile</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Vendor ID</p>
            <p className="text-foreground font-semibold">VND0123</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Referral Code</p>
            <p className="text-foreground font-semibold">SKR8Y4T2P9</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="text-foreground font-semibold">Rajesh Kumar</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground font-semibold">rajesh@example.com</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-foreground font-semibold">+91 98765 43210</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Address & Other Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="text-foreground font-semibold">123 Main Street, Sector 15</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">City</p>
            <p className="text-foreground font-semibold">New Delhi</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">State</p>
            <p className="text-foreground font-semibold">Delhi</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pincode</p>
            <p className="text-foreground font-semibold">110001</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Joining Date</p>
            <p className="text-foreground font-semibold">January 15, 2026</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Using href to trigger full app reload for Navbar
  }, [navigate]);
  return null;
};

export default function VendorDashboard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar items={sidebarItems} basePath="/vendor" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}
