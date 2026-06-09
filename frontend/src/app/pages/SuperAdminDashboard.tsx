import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, UserCheck, Bell, BarChart3, Settings, UserCircle, GraduationCap, CheckCircle, XCircle, Eye, LogOut, Calendar, Clock, IndianRupee, Wallet, Copy, Percent, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Toaster, toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Vendor Management', path: '/vendors' },
  { icon: UserCheck, label: 'Student Management', path: '/students' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: LogOut, label: 'Logout', path: '/logout' }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingVendors: 0,
    totalStudents: 0,
    monthlyStudents: 0,
    chartData: []
  });
  const [pendingApps, setPendingApps] = useState<any[]>([]);
  const [viewApp, setViewApp] = useState<any>(null);
  const [newVendorCreds, setNewVendorCreds] = useState<any>(null);
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject', payload?: any) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/applications/${id}/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: payload ? JSON.stringify(payload) : undefined
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with Topper'<span className="text-primary">s</span> Siksha <span className="text-primary">Kendra</span> today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <StatCard title="Total Vendors" value={stats.totalVendors} icon={Users} color="primary" />
            <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} color="success" />
            <StatCard title="Monthly Students" value={stats.monthlyStudents} icon={BookOpen} color="warning" />
            <StatCard title="Pending Requests" value={stats.pendingVendors} icon={Bell} color="secondary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Student Registrations</h3>
          {isLoading ? (
            <Skeleton className="w-full h-[300px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#FF6B00" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Vendor Growth</h3>
          {isLoading ? (
            <Skeleton className="w-full h-[300px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="vendors" fill="#0B1B52" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Vendor Applications</h3>
          {pendingApps.length > 0 && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
              {pendingApps.length} Pending
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Vendor</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Contact Info</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Location</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-4"><Skeleton className="h-10 w-[150px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-10 w-[150px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-8 w-[200px]" /></td>
                  </tr>
                ))
              ) : pendingApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-success/50 mb-3" />
                      <p>All caught up! No pending vendor applications.</p>
                    </div>
                  </td>
                </tr>
              ) : pendingApps.map((vendor: any) => (
                <tr key={vendor.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{vendor.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{vendor.email}</span>
                      <span className="text-xs text-muted-foreground">{vendor.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{vendor.city}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-xs font-bold uppercase tracking-wider">
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setConfirmApproveId(vendor.id)} 
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-md text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(vendor.id, 'reject')} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => setViewApp(vendor)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!viewApp} onOpenChange={(open) => !open && setViewApp(null)}>
        <DialogContent className="max-w-[1200px] w-[90vw] h-[90vh] p-0 flex flex-col gap-0 overflow-hidden bg-background border-border/50">
          <div className="px-6 py-5 border-b border-border/60 bg-card flex flex-row items-center justify-between z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-4 text-left">
               <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border border-primary/20 shadow-sm">
                 {viewApp?.name?.charAt(0).toUpperCase() || 'V'}
               </div>
               <div>
                 <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3 m-0">
                   {viewApp?.name}
                   <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-bold bg-warning/15 text-warning">
                     PENDING
                   </span>
                 </DialogTitle>
                 <p className="text-sm text-muted-foreground font-medium mt-1">
                   Vendor Application Details
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-3 pr-8">
               <Button variant="danger" onClick={() => { handleAction(viewApp.id, 'reject'); setViewApp(null); }} className="shadow-sm">
                 <XCircle className="w-4 h-4 mr-2" /> Reject
               </Button>
               <Button className="bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-sm" onClick={() => { setConfirmApproveId(viewApp.id); setViewApp(null); }}>
                 <CheckCircle className="w-4 h-4 mr-2" /> Approve
               </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-muted/10">
            {viewApp && (
              <div className="space-y-8 w-full max-w-[1152px] mx-auto pb-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
                      <UserCircle className="w-5 h-5 text-primary" /> Personal Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewApp.name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{viewApp.email}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{viewApp.phone}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Aadhaar No:</span> <span className="font-medium">{viewApp.aadhaar_number}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">PAN No:</span> <span className="font-medium">{viewApp.pan_number}</span></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
                        <Wallet className="w-5 h-5 text-success" /> Banking Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{viewApp.bank_name}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Branch:</span> <span className="font-medium">{viewApp.branch_name}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Account No:</span> <span className="font-medium">{viewApp.account_number}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">IFSC:</span> <span className="font-medium">{viewApp.ifsc_code}</span></div>
                      </div>
                    </div>
                    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
                        <Copy className="w-5 h-5 text-warning" /> Address Details
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {viewApp.address},<br/>{viewApp.city}, {viewApp.state} - {viewApp.pincode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2 border-b border-border/60 pb-3">
                    <Eye className="w-5 h-5 text-primary" /> Uploaded Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {viewApp.aadhaar_front && (
                      <div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(viewApp.aadhaar_front)}>
                        <p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Aadhaar (Front)</p>
                        <div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden">
                          <img src={viewApp.aadhaar_front} alt="Aadhaar Front" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>
                    )}
                    {viewApp.aadhaar_back && (
                      <div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(viewApp.aadhaar_back)}>
                        <p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Aadhaar (Back)</p>
                        <div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden">
                          <img src={viewApp.aadhaar_back} alt="Aadhaar Back" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>
                    )}
                    {viewApp.pan_image && (
                      <div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(viewApp.pan_image)}>
                        <p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">PAN Card</p>
                        <div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden">
                          <img src={viewApp.pan_image} alt="PAN Card" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>
                    )}
                    {viewApp.passbook_image && (
                      <div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(viewApp.passbook_image)}>
                        <p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Bank Passbook</p>
                        <div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden">
                          <img src={viewApp.passbook_image} alt="Passbook" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmApproveId} onOpenChange={(open) => { if(!open) { setConfirmApproveId(null); setCommissionRate(''); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Vendor Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2 text-sm">
            <p className="text-foreground text-base">
              Are you sure you want to approve this application?
            </p>
            <p className="text-muted-foreground">
              This action will create a new vendor account, generate secure login credentials, and automatically send an approval email to the applicant. Please set their referral commission below.
            </p>
            <div className="mt-4">
              <Input 
                label="Commission Per Referral (₹)" 
                type="number" 
                value={commissionRate} 
                onChange={(e) => setCommissionRate(e.target.value)} 
                placeholder="e.g. 500" 
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => { setConfirmApproveId(null); setCommissionRate(''); }}>Cancel</Button>
              <Button type="button" onClick={() => {
                if (confirmApproveId && commissionRate) {
                  handleAction(confirmApproveId, 'approve', { commission_rate: commissionRate });
                  setConfirmApproveId(null);
                  setCommissionRate('');
                } else if (!commissionRate) {
                  toast.error('Please enter a commission rate');
                }
              }}>Yes, Approve Vendor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!fullScreenImage} onOpenChange={(open) => !open && setFullScreenImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document View</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex justify-center">
            <img src={fullScreenImage || ''} alt="Full Document View" className="max-w-full max-h-[75vh] object-contain rounded" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const VendorManagement = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newVendorCreds, setNewVendorCreds] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVendors = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this vendor? Their student enrollments will be kept but unlinked.')) return;
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Vendor deleted successfully');
        fetchVendors(); // Refresh the table
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete vendor');
      }
    } catch (err) {
      toast.error('Error deleting vendor');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/vendors/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success('Vendor added successfully!');
        setNewVendorCreds(data.credentials);
        setIsAddOpen(false);
        setFormData({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
        fetchVendors(); // Refresh the table
      } else {
        toast.error(data.message || 'Failed to add vendor');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
  <div className="p-6">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Vendor Management</h1>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/become-vendor`)}>
          Share Application Link
        </Button>
        <Button onClick={() => setIsAddOpen(true)}>Add Vendor Manually</Button>
      </div>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[60px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[150px]" /></td>
                </tr>
              ))
            ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No active vendors found.</td>
                </tr>
            ) : vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground">{vendor.vendor_id}</td>
                <td className="py-3 px-4">
                  <button onClick={() => navigate(`/admin/vendors/${vendor.id}`, { state: { vendor, tab: 'performance' } })} className="text-primary font-medium hover:underline text-left focus:outline-none">
                    {vendor.user?.name}
                  </button>
                </td>
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
                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/vendors/${vendor.id}`, { state: { vendor, tab: 'details' } })}>Details</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteVendor(vendor.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <Input 
              label="Phone" 
              name="phone" 
              type="tel"
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
              required 
              maxLength={10}
              minLength={10}
              pattern="\d{10}"
              title="Phone number must be exactly 10 digits"
            />
            <Input label="Address" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
            <Input label="City" name="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
            <Input label="State" name="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Vendor'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={!!newVendorCreds} onOpenChange={(open) => !open && setNewVendorCreds(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vendor Created Successfully!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4 text-sm">
          <p className="text-muted-foreground">Share these credentials with the new vendor so they can log in.</p>
          <div className="bg-muted p-4 rounded-[8px] space-y-2">
            <p><strong>Email:</strong> {newVendorCreds?.email}</p>
            <p><strong>Password:</strong> {newVendorCreds?.password}</p>
          </div>
          <Button className="w-full" onClick={() => copyToClipboard(newVendorCreds?.messageToForward || '')}>
            Copy Message to Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)};

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const viewStudent = location.state?.student;

  if (!viewStudent) return <Navigate to="/admin/students" replace />;

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
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><Users className="w-5 h-5 text-warning" /> Parent & Vendor</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Parent Name:</span> <span className="font-medium">{viewStudent.parent_name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Parent Phone:</span> <span className="font-medium">{viewStudent.parent_phone || '-'}</span></div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Referred By:</span> <span className="font-medium text-[#0B1B52] bg-[#0B1B52]/10 px-2 py-0.5 rounded">{viewStudent.vendor?.user?.name || 'Direct Enrollment'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialVendor = location.state?.vendor;
  const initialTab = location.state?.tab || 'performance';

  const [vendorData, setVendorData] = useState<any>(initialVendor);
  const [activeTab, setActiveTab] = useState<'performance' | 'details'>(initialTab);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [editCommissionValue, setEditCommissionValue] = useState(initialVendor?.commission_rate?.toString() || '0');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  if (!vendorData) return <Navigate to="/admin/vendors" replace />;

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this vendor? Their student enrollments will be kept but unlinked.')) return;
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Vendor deleted successfully');
        navigate('/admin/vendors');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete vendor');
      }
    } catch (err) {
      toast.error('Error deleting vendor');
    }
  };

  const handleUpdateCommission = async (id: string) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/vendors/${id}/commission`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ commission_rate: editCommissionValue })
      });
      
      if (response.ok) {
        toast.success('Commission rate updated successfully');
        setIsEditingCommission(false);
        setVendorData({ ...vendorData, commission_rate: parseFloat(editCommissionValue) || 0 });
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update commission');
      }
    } catch (error) {
      toast.error('Error updating commission');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Performance Calculations
  const vendorStudents = vendorData.studentLeads || [];
  const totalReferred = vendorStudents.length;
  const approvedCount = vendorStudents.filter((s: any) => s.status === 'APPROVED').length;
  const pendingCount = vendorStudents.filter((s: any) => s.status !== 'APPROVED').length;
  const totalEarnings = approvedCount * (vendorData.commission_rate || 0);
  const conversionRate = totalReferred > 0 ? ((approvedCount / totalReferred) * 100).toFixed(1) : '0.0';
  
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = new Array(12).fill(0);
  
  let monthlyStudents = 0;
  let todaysStudents = 0;
  const today = new Date();
  
  vendorStudents.forEach((student: any) => {
    const date = new Date(student.created_at);
    if (date.getFullYear() === currentYear) {
      counts[date.getMonth()] += 1;
      if (date.getMonth() === today.getMonth()) {
        monthlyStudents += 1;
      }
    }
    if (date.toDateString() === today.toDateString()) {
      todaysStudents += 1;
    }
  });
  
  const currentMonth = new Date().getMonth();
  const vendorChartData = months.slice(0, currentMonth + 1).map((month, idx) => ({ month, students: counts[idx] }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto flex flex-col h-full">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2 shrink-0">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Vendor Details</h1>
      </div>

      <div className="flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-border/60 bg-muted/10 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-5 text-left">
             <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border border-primary/20 shadow-sm">
               {vendorData?.user?.name?.charAt(0).toUpperCase() || 'V'}
             </div>
             <div>
               <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 m-0">
                 {vendorData?.user?.name}
                 <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-bold ${vendorData?.status === 'ACTIVE' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                   {vendorData?.status}
                 </span>
               </h2>
               <p className="text-sm text-muted-foreground font-medium mt-1">
                 Vendor ID: {vendorData?.vendor_id} &bull; Joined {new Date(vendorData?.created_at).toLocaleDateString()}
               </p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="danger" onClick={() => handleDeleteVendor(vendorData.id)} className="shadow-sm">
               <XCircle className="w-4 h-4 mr-2" /> Delete Vendor
             </Button>
          </div>
        </div>

        {/* TABS */}
        <div className="px-8 pt-4 border-b border-border/60 flex gap-6 bg-card shrink-0">
          <button onClick={() => setActiveTab('performance')} className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'performance' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            Performance Dashboard
          </button>
          <button onClick={() => setActiveTab('details')} className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            Basic Information
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-8 flex-1 overflow-y-auto bg-muted/5">
          {activeTab === 'performance' ? (
            <div className="space-y-6 w-full max-w-full mx-auto pb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm relative overflow-hidden"><div className="flex justify-between items-start mb-2"><p className="text-sm font-medium text-muted-foreground">Total Referrals</p><div className="bg-primary/10 p-2 rounded-lg text-primary"><Users className="w-4 h-4" /></div></div><p className="text-3xl font-bold text-foreground">{totalReferred}</p></div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm relative overflow-hidden"><div className="flex justify-between items-start mb-2"><p className="text-sm font-medium text-muted-foreground">Monthly Referrals</p><div className="bg-[#0B1B52]/10 p-2 rounded-lg text-[#0B1B52]"><Calendar className="w-4 h-4" /></div></div><p className="text-3xl font-bold text-foreground">{monthlyStudents}</p></div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm relative overflow-hidden"><div className="flex justify-between items-start mb-2"><p className="text-sm font-medium text-muted-foreground">Today's Leads</p><div className="bg-warning/10 p-2 rounded-lg text-warning"><Clock className="w-4 h-4" /></div></div><p className="text-3xl font-bold text-foreground">{todaysStudents}</p></div>
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm relative overflow-hidden"><div className="flex justify-between items-start mb-2"><p className="text-sm font-medium text-muted-foreground">Approved Admissions</p><div className="bg-success/10 p-2 rounded-lg text-success"><CheckCircle className="w-4 h-4" /></div></div><p className="text-3xl font-bold text-foreground">{approvedCount}</p></div>
                <div className="bg-gradient-to-br from-card to-[#10B981]/5 border border-[#10B981]/40 rounded-xl p-5 shadow-sm relative overflow-hidden"><div className="flex justify-between items-start mb-2"><p className="text-sm font-medium text-[#10B981]">Total Earnings</p><div className="bg-[#10B981]/15 p-2 rounded-lg text-[#10B981]"><IndianRupee className="w-4 h-4" /></div></div><p className="text-3xl font-bold text-foreground">₹{totalEarnings.toLocaleString('en-IN')}</p></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2 bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                  <h4 className="font-semibold mb-6 text-foreground flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Growth & Performance</h4>
                  {totalReferred === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[260px] bg-muted/20 rounded-xl border-2 border-dashed border-border/60"><BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" /><p className="text-muted-foreground font-semibold text-lg">No Performance Data</p><p className="text-sm text-muted-foreground mb-6">This vendor hasn't generated any referrals yet.</p><Button variant="outline" size="sm" onClick={() => copyToClipboard(`${window.location.origin}/enroll/${vendorData.referral_code}`)}><Copy className="w-4 h-4 mr-2" /> Share Referral Link</Button></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={vendorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} /><XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} /><Bar dataKey="students" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={50} /></BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="col-span-1 space-y-6">
                  <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                    <h4 className="font-semibold text-foreground mb-5 flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Earnings Overview</h4>
                    <div className="space-y-5 z-10 relative">
                      <div className="flex justify-between items-end"><span className="text-sm text-muted-foreground font-medium">Total Payout</span><span className="text-2xl font-bold text-success tracking-tight">₹{totalEarnings.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between items-end"><span className="text-sm text-muted-foreground font-medium">Commission Rate</span><span className="text-sm font-bold bg-muted px-2 py-1 rounded-md">₹{vendorData.commission_rate || 0} / admit</span></div>
                      <div className="w-full h-px bg-border/60 my-2"></div>
                      <div className="flex justify-between items-end"><span className="text-sm text-muted-foreground font-medium">Conversion Rate</span><span className="text-lg font-bold text-primary flex items-center"><Percent className="w-4 h-4 mr-0.5" />{conversionRate}%</span></div>
                      <div className="w-full bg-muted rounded-full h-2.5 mt-2 overflow-hidden border border-border/40"><div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(Number(conversionRate), 100)}%` }}></div></div>
                    </div>
                  </div>
                  <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-muted-foreground">Vendor Link</h4>
                    <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-lg border border-border/60"><input type="text" readOnly value={`${window.location.origin}/enroll/${vendorData.referral_code}`} className="bg-transparent border-none outline-none text-xs w-full text-muted-foreground px-2 font-mono" /><Button size="sm" variant="outline" className="shrink-0 h-8" onClick={() => copyToClipboard(`${window.location.origin}/enroll/${vendorData.referral_code}`)}>Copy</Button></div>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-border/60 bg-muted/10 flex justify-between items-center"><h4 className="font-semibold text-foreground">Referred Students List</h4><span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{vendorStudents.length} Enrollments</span></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30"><tr className="border-b border-border"><th className="text-left py-4 px-6 font-semibold text-foreground">Student Name</th><th className="text-left py-4 px-6 font-semibold text-foreground">Phone</th><th className="text-left py-4 px-6 font-semibold text-foreground">Class & Course</th><th className="text-left py-4 px-6 font-semibold text-foreground">Status</th><th className="text-left py-4 px-6 font-semibold text-foreground">Date</th></tr></thead>
                    <tbody>
                      {vendorStudents.length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center"><div className="flex flex-col items-center justify-center"><Users className="w-10 h-10 text-muted-foreground/30 mb-3" /><p className="text-muted-foreground font-medium">No students found</p><p className="text-sm text-muted-foreground/70">When this vendor refers students, they will appear here.</p></div></td></tr>
                      ) : vendorStudents.map((student: any, idx: number) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors"><td className="py-4 px-6 text-foreground font-medium">{student.name}</td><td className="py-4 px-6 text-muted-foreground">{student.phone}</td><td className="py-4 px-6"><p className="text-foreground">{student.course?.title || 'Unknown'}</p><p className="text-xs text-muted-foreground mt-0.5">{student.class || '-'}</p></td><td className="py-4 px-6"><span className={`px-2 py-1 rounded-[6px] text-xs font-semibold ${student.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{student.status || 'PENDING'}</span></td><td className="py-4 px-6 text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 w-full max-w-[1152px] mx-auto pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm"><h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><UserCircle className="w-5 h-5 text-primary" /> Personal Details</h4><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Vendor ID:</span> <span className="font-medium">{vendorData.vendor_id}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Referral Code:</span> <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{vendorData.referral_code}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{vendorData.user?.email}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{vendorData.user?.phone}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Aadhaar No:</span> <span className="font-medium">{vendorData.aadhaar_number}</span></div><div className="flex justify-between"><span className="text-muted-foreground">PAN No:</span> <span className="font-medium">{vendorData.pan_number}</span></div></div></div>
                <div className="space-y-6">
                  <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><Wallet className="w-5 h-5 text-success" /> Banking Details</h4>
                    <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Bank:</span> <span className="font-medium">{vendorData.bank_name}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Branch:</span> <span className="font-medium">{vendorData.branch_name}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Account No:</span> <span className="font-medium">{vendorData.account_number}</span></div><div className="flex justify-between"><span className="text-muted-foreground">IFSC:</span> <span className="font-medium">{vendorData.ifsc_code}</span></div><div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40"><span className="text-muted-foreground">Commission Rate:</span>{isEditingCommission ? (<div className="flex items-center gap-2"><input type="number" value={editCommissionValue} onChange={(e) => setEditCommissionValue(e.target.value)} className="w-20 px-2 py-1 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" /><Button size="sm" onClick={() => handleUpdateCommission(vendorData.id)}>Save</Button><Button size="sm" variant="outline" onClick={() => setIsEditingCommission(false)}>Cancel</Button></div>) : (<div className="flex items-center gap-2"><span className="font-bold text-success bg-success/10 px-2 py-1 rounded">₹{vendorData.commission_rate || 0} / admit</span><button onClick={() => { setEditCommissionValue(vendorData.commission_rate?.toString() || '0'); setIsEditingCommission(true); }} className="text-primary text-xs font-medium hover:underline">Edit</button></div>)}</div></div>
                  </div>
                  <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm"><h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 border-b border-border/60 pb-3"><Copy className="w-5 h-5 text-warning" /> Address Details</h4><p className="text-sm text-foreground leading-relaxed">{vendorData.address},<br/>{vendorData.city}, {vendorData.state} - {vendorData.pincode}</p></div>
                </div>
              </div>
              <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl flex gap-3"><Settings className="w-5 h-5 text-warning shrink-0" /><p className="text-sm text-warning-foreground"><strong>Note about Passwords:</strong> For security reasons, vendor passwords are encrypted (hashed) in the database and cannot be viewed by anyone, including Super Admins. If a vendor loses their password, they must use the "Forgot Password" flow to reset it.</p></div>
              <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2 border-b border-border/60 pb-3"><Eye className="w-5 h-5 text-primary" /> Uploaded Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {vendorData.aadhaar_front && (<div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(vendorData.aadhaar_front)}><p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Aadhaar (Front)</p><div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden"><img src={vendorData.aadhaar_front} alt="Aadhaar Front" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" /></div></div>)}
                  {vendorData.aadhaar_back && (<div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(vendorData.aadhaar_back)}><p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Aadhaar (Back)</p><div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden"><img src={vendorData.aadhaar_back} alt="Aadhaar Back" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" /></div></div>)}
                  {vendorData.pan_image && (<div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(vendorData.pan_image)}><p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">PAN Card</p><div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden"><img src={vendorData.pan_image} alt="PAN Card" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" /></div></div>)}
                  {vendorData.passbook_image && (<div className="border border-border/60 rounded-lg p-3 bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => setFullScreenImage(vendorData.passbook_image)}><p className="text-xs text-center mb-3 font-medium text-muted-foreground group-hover:text-primary transition-colors">Bank Passbook</p><div className="aspect-[4/3] bg-black/5 rounded flex items-center justify-center overflow-hidden"><img src={vendorData.passbook_image} alt="Passbook" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" /></div></div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!fullScreenImage} onOpenChange={(open) => !open && setFullScreenImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Document View</DialogTitle></DialogHeader>
          <div className="mt-2 flex justify-center"><img src={fullScreenImage || ''} alt="Full Document View" className="max-w-full max-h-[75vh] object-contain rounded" /></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/admin/students/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast.success('Student status updated');
        fetchStudents();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Enrollment ID', 'Student Name', 'Email', 'Phone', 'Class', 'Course', 'Vendor', 'Status', 'Enrolled Date'];
    
    const csvRows = students.map(student => {
      return [
        student.enrollment_id || 'N/A',
        `"${student.name || ''}"`,
        `"${student.email || ''}"`,
        `"${student.phone || ''}"`,
        `"${student.class || ''}"`,
        `"${student.course?.title || 'Unknown Course'}"`,
        `"${student.vendor?.user?.name || 'Direct Enrollment'}"`,
        `"${student.status || 'PENDING'}"`,
        `"${new Date(student.created_at).toLocaleDateString()}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
  <div className="p-6">
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
      <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" /> Export CSV
      </Button>
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[120px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[100px]" /></td>
                  <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                </tr>
              ))
            ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">No students have enrolled yet.</td>
                </tr>
            ) : students.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-mono">{student.enrollment_id || 'N/A'}</td>
                <td className="py-3 px-4">
                  <button onClick={() => navigate(`/admin/students/${student.id}`, { state: { student } })} className="text-primary font-medium hover:underline text-left focus:outline-none">
                    {student.name}
                  </button>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{student.vendor?.user?.name || 'Direct Enrollment'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.course?.title || 'Unknown Course'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.class || '-'}</td>
                <td className="py-3 px-4 text-muted-foreground">{student.phone}</td>
                <td className="py-3 px-4">
                  <select
                    value={student.status || 'PENDING'}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className={`px-2 py-1 rounded-[8px] text-sm font-semibold border-0 outline-none cursor-pointer ${
                      student.status === 'APPROVED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/students/${student.id}`, { state: { student } })}>Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

  </div>
)};

const CourseManagement = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: 0, category: '', class: '', status: 'ACTIVE'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const response = await fetch(`${apiUrl}/api/courses`);
      if (response.ok) setCourses(await response.json());
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({...formData, price: Number(formData.price)})
      });
      
      if (response.ok) {
        toast.success('Course added successfully!');
        setIsAddOpen(false);
        setFormData({ title: '', slug: '', description: '', price: 0, category: '', class: '', status: 'ACTIVE' });
        fetchCourses();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add course');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Course deleted');
        fetchCourses();
      } else {
        toast.error('Failed to delete course');
      }
    } catch (err) {
      toast.error('Error deleting course');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Courses Management</h1>
        <Button onClick={() => setIsAddOpen(true)}>Add Course</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Title</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Enrollments</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[150px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-6 w-[60px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-8 w-[80px]" /></td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No courses found.</td>
                  </tr>
              ) : courses.map((course) => (
                <tr key={course.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{course.title}</td>
                <td className="py-3 px-4 text-muted-foreground">{course.class || '-'}</td>
                  <td className="py-3 px-4 text-muted-foreground">{course.category}</td>
                  <td className="py-3 px-4 text-foreground">₹{course.price}</td>
                <td className="py-3 px-4 text-foreground font-semibold">{course._count?.studentLeads || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-[8px] text-sm font-semibold ${course.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="danger" onClick={() => handleDelete(course.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <Input label="Slug" name="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required placeholder="e.g., math-10" />
              <Input label="Category" name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
              <Input label="Price (₹)" type="number" name="price" value={formData.price as any} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required min={0} />
            </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-foreground">Class</label>
            <select
              name="class"
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Class</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>
            <Input label="Description" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Course'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Using href to trigger full app reload for Navbar
  }, [navigate]);
  return null;
};

export default function SuperAdminDashboard() {
  return (
    <div className="flex min-h-[calc(100vh-77px)] bg-background">
      <Toaster position="top-right" richColors />
      <Sidebar items={sidebarItems} basePath="/admin" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/vendors/:id" element={<VendorDetailsPage />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/students/:id" element={<StudentDetailsPage />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}
