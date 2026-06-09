import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, Users, Clock, UserCircle, Settings, Copy, Share2, QrCode, LogOut, IndianRupee, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { toast, Toaster } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Student List', path: '/students' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: LogOut, label: 'Logout', path: '/logout' }
];

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viewStudent = location.state?.student;

  if (!viewStudent) return <Navigate to="/vendor/students" replace />;

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-full">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2 shrink-0">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Student Details</h1>
      </div>

      <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-border/60 bg-muted/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-5 text-left">
            <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center text-3xl font-bold border border-success/20 shadow-sm">
              {viewStudent?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 m-0">
                {viewStudent?.name}
                <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-bold ${viewStudent?.status === 'APPROVED' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                  {viewStudent?.status || 'PENDING'}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Enrollment ID: {viewStudent.enrollment_id || '-'} &bull; Enrolled {new Date(viewStudent.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-muted/10 border border-border/60 rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><UserCircle className="w-5 h-5 text-primary" /> Student Profile</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewStudent.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewStudent.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Address:</span> <span className="font-medium text-right max-w-[200px]">{viewStudent.address || '-'}</span></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-muted/10 border border-border/60 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><BookOpen className="w-5 h-5 text-success" /> Academic Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Course:</span> <span className="font-medium text-right max-w-[200px]">{viewStudent.course?.title || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Class:</span> <span className="font-medium">{viewStudent.class || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">School:</span> <span className="font-medium text-right max-w-[200px]">{viewStudent.school_name || '-'}</span></div>
                </div>
              </div>
              <div className="bg-muted/10 border border-border/60 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><Users className="w-5 h-5 text-warning" /> Parent Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Parent Name:</span> <span className="font-medium">{viewStudent.parent_name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Parent Phone:</span> <span className="font-medium">{viewStudent.parent_phone || '-'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todaysStudents: 0,
    monthlyStudents: 0,
    referral_code: 'Loading...'
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
          
          // Generate dynamic chart data based on student enrollments
          const currentYear = new Date().getFullYear();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const counts = new Array(12).fill(0);
          
          let earnings = 0;
          allStudents.forEach((student: any) => {
            if (student.status === 'APPROVED') {
              earnings += (student.vendor?.commission_rate || 0);
            }
            const date = new Date(student.created_at);
            if (date.getFullYear() === currentYear) {
              counts[date.getMonth()] += 1;
            }
          });
          
          const currentMonth = new Date().getMonth();
          setChartData(months.slice(0, currentMonth + 1).map((month, idx) => ({ month, students: counts[idx] })));
          setTotalEarnings(earnings);
        }
      } catch (error) { console.error("Error loading vendor data:", error); } 
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const referralLink = `${window.location.origin}/enroll/${stats.referral_code}`;

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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <StatCard title="Total Referrals" value={stats.totalStudents} icon={Users} color="primary" />
            <StatCard title="Monthly Referrals" value={stats.monthlyStudents} icon={BarChart3} color="success" />
            <StatCard title="Today's Referrals" value={stats.todaysStudents} icon={Clock} color="warning" />
            <StatCard title="Total Earnings" value={`₹${totalEarnings}`} icon={IndianRupee} color="success" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-6">Referral System</h3>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your Referral Code</label>
              <div className="flex gap-2">
                {isLoading ? (
                  <Skeleton className="h-14 w-full rounded-[12px]" />
                ) : (
                  <>
                    <div className="flex-1 bg-primary-light border-2 border-primary rounded-[12px] px-4 py-3">
                      <p className="text-2xl font-bold text-primary text-center tracking-wider">{stats.referral_code}</p>
                    </div>
                    <Button variant="outline" onClick={() => copyToClipboard(stats.referral_code)}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Referral Link</label>
              <div className="flex gap-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-full rounded-[12px]" />
                ) : (
                  <>
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-input-background border border-input rounded-[12px] px-4 py-3 text-foreground text-sm"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard(referralLink)}>
                      <Copy className="w-5 h-5" />
                    </Button>
                  </>
                )}
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
          {isLoading ? (
            <Skeleton className="w-full h-[300px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="students" fill="#FF6B00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[120px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[120px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                  </tr>
                ))
              ) : recentStudents.length === 0 ? (
                 <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No students referred yet.</td></tr>
              ) : recentStudents.map((student, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="py-3 px-4">
                    <button onClick={() => navigate(`/vendor/students/${student.id}`, { state: { student } })} className="text-primary font-medium hover:underline text-left focus:outline-none">
                      {student.name}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                  <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${student.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {student.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/vendor/students/${student.id}`, { state: { student } })}>Details</Button>
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

const StudentList = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[120px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[120px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                </tr>
              ))
            ) : students.length === 0 ? (
                 <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No students referred yet.</td></tr>
            ) : students.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <button onClick={() => navigate(`/vendor/students/${student.id}`, { state: { student } })} className="text-primary font-medium hover:underline text-left focus:outline-none">
                    {student.name}
                  </button>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{student.email}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown'}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${student.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    {student.status || 'PENDING'}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/vendor/students/${student.id}`, { state: { student } })}>Details</Button>
                </td>
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
    <div className="flex min-h-[calc(100vh-77px)] bg-background">
      <Sidebar items={sidebarItems} basePath="/vendor" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}
