import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, Bell, BarChart3, Settings, UserCircle, GraduationCap, CheckCircle, XCircle, Eye, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Toaster, toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

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
    monthlyStudents: 0
  });
  const [pendingApps, setPendingApps] = useState<any[]>([]);
  const [viewApp, setViewApp] = useState<any>(null);
  const [newVendorCreds, setNewVendorCreds] = useState<any>(null);

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
        if (action === 'approve' && data.credentials) {
          setNewVendorCreds(data.credentials);
        }
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
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span> today.
        </p>
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
              {pendingApps.length === 0 ? (
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
                        onClick={() => handleAction(vendor.id, 'approve')} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 hover:bg-success text-success hover:text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(vendor.id, 'reject')} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => setViewApp(vendor)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-md text-sm font-medium transition-colors"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Application Details</DialogTitle>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Name:</strong> {viewApp.name}</p>
                <p><strong>Email:</strong> {viewApp.email}</p>
                <p><strong>Phone:</strong> {viewApp.phone}</p>
                <p><strong>Address:</strong> {viewApp.address}, {viewApp.city}, {viewApp.state} - {viewApp.pincode}</p>
                <p><strong>Aadhaar Number:</strong> {viewApp.aadhaar_number}</p>
                <p><strong>PAN Number:</strong> {viewApp.pan_number}</p>
                <p><strong>Bank:</strong> {viewApp.bank_name} ({viewApp.branch_name})</p>
                <p><strong>Account No:</strong> {viewApp.account_number}</p>
                <p><strong>IFSC:</strong> {viewApp.ifsc_code}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Uploaded Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded p-2">
                    <p className="text-xs text-center mb-2 font-medium">Aadhaar (Front)</p>
                    <img src={viewApp.aadhaar_front} alt="Aadhaar Front" className="w-full h-auto object-contain rounded" />
                  </div>
                  <div className="border rounded p-2">
                    <p className="text-xs text-center mb-2 font-medium">Aadhaar (Back)</p>
                    <img src={viewApp.aadhaar_back} alt="Aadhaar Back" className="w-full h-auto object-contain rounded" />
                  </div>
                  <div className="border rounded p-2">
                    <p className="text-xs text-center mb-2 font-medium">PAN Card</p>
                    <img src={viewApp.pan_image} alt="PAN Card" className="w-full h-auto object-contain rounded" />
                  </div>
                  <div className="border rounded p-2">
                    <p className="text-xs text-center mb-2 font-medium">Bank Passbook</p>
                    <img src={viewApp.passbook_image} alt="Passbook" className="w-full h-auto object-contain rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!newVendorCreds} onOpenChange={(open) => !open && setNewVendorCreds(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vendor Approved Successfully!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-sm">
            <p className="text-warning-foreground bg-warning/10 p-3 rounded-[8px] border border-warning/20">
              <strong>For Testing Purposes:</strong> Here are the newly generated login credentials for this vendor. You can use these to test the Vendor Dashboard.
            </p>
            <div className="bg-muted p-4 rounded-[8px] space-y-2">
              <p><strong>Email:</strong> {newVendorCreds?.email}</p>
              <p><strong>Password:</strong> {newVendorCreds?.password}</p>
            </div>
            <Button className="w-full" onClick={() => { navigator.clipboard.writeText(`Email: ${newVendorCreds?.email} | Password: ${newVendorCreds?.password}`); toast.success('Copied to clipboard!'); }}>
              Copy Credentials
            </Button>
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
  const [viewVendor, setViewVendor] = useState<any>(null);
  const [newVendorCreds, setNewVendorCreds] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

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
                    <Button size="sm" variant="outline" onClick={() => setViewVendor(vendor)}>Details</Button>
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
            <Input label="Phone" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
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

    <Dialog open={!!viewVendor} onOpenChange={(open) => !open && setViewVendor(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
        </DialogHeader>
        {viewVendor && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Vendor ID:</strong> {viewVendor.vendor_id}</p>
              <p><strong>Referral Code:</strong> {viewVendor.referral_code}</p>
              <p><strong>Name:</strong> {viewVendor.user?.name}</p>
              <p><strong>Email:</strong> {viewVendor.user?.email}</p>
              <p><strong>Phone:</strong> {viewVendor.user?.phone}</p>
              <p><strong>Address:</strong> {viewVendor.address}, {viewVendor.city}, {viewVendor.state} - {viewVendor.pincode}</p>
              <p><strong>Aadhaar Number:</strong> {viewVendor.aadhaar_number}</p>
              <p><strong>PAN Number:</strong> {viewVendor.pan_number}</p>
              <p><strong>Bank:</strong> {viewVendor.bank_name} ({viewVendor.branch_name})</p>
              <p><strong>Account No:</strong> {viewVendor.account_number}</p>
              <p><strong>IFSC:</strong> {viewVendor.ifsc_code}</p>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 p-4 rounded-[8px]">
               <p className="text-sm text-warning-foreground">
                 <strong>Note about Passwords:</strong> For security reasons, vendor passwords are encrypted (hashed) in the database and cannot be viewed by anyone, including Super Admins. If a vendor loses their password, they must use the "Forgot Password" flow to reset it.
               </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Uploaded Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {viewVendor.aadhaar_front && (
                  <div className="border rounded p-2"><p className="text-xs text-center mb-2 font-medium">Aadhaar (Front)</p><img src={viewVendor.aadhaar_front} alt="Aadhaar Front" className="w-full h-auto object-contain rounded" /></div>
                )}
                {viewVendor.aadhaar_back && (
                  <div className="border rounded p-2"><p className="text-xs text-center mb-2 font-medium">Aadhaar (Back)</p><img src={viewVendor.aadhaar_back} alt="Aadhaar Back" className="w-full h-auto object-contain rounded" /></div>
                )}
                {viewVendor.pan_image && (
                  <div className="border rounded p-2"><p className="text-xs text-center mb-2 font-medium">PAN Card</p><img src={viewVendor.pan_image} alt="PAN Card" className="w-full h-auto object-contain rounded" /></div>
                )}
                {viewVendor.passbook_image && (
                  <div className="border rounded p-2"><p className="text-xs text-center mb-2 font-medium">Bank Passbook</p><img src={viewVendor.passbook_image} alt="Passbook" className="w-full h-auto object-contain rounded" /></div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
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

const CourseManagement = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: 0, category: '', status: 'ACTIVE'
  });

  const fetchCourses = async () => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      const response = await fetch(`${apiUrl}/api/courses`);
      if (response.ok) setCourses(await response.json());
    } catch (error) {
      console.error("Error fetching courses:", error);
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
        setFormData({ title: '', slug: '', description: '', price: 0, category: '', status: 'ACTIVE' });
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No courses found.</td>
                  </tr>
              ) : courses.map((course) => (
                <tr key={course.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{course.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{course.category}</td>
                  <td className="py-3 px-4 text-foreground">₹{course.price}</td>
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
    navigate('/login');
  }, [navigate]);
  return null;
};

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
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  );
}
