import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function StudentRegistration() {
  const { referralCode } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    class: '',
    schoolName: '',
    parentName: '',
    parentContact: '',
    course: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, '');
        const response = await fetch(`${apiUrl}/api/courses`);
        if (response.ok) {
          setCourses(await response.json());
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        address: formData.address,
        class: formData.class,
        course_id: formData.course,
        referral_code: referralCode || undefined
      };

      const response = await fetch(`${apiUrl}/api/student-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit registration');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-light to-accent flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Registration Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for registering with Topper's Siksha Kendra. We have received your application and will contact you shortly.
          </p>
          <div className="bg-primary-light p-4 rounded-[12px] mb-6">
            <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
            <p className="text-2xl font-bold text-primary">{referralCode}</p>
          </div>
          <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-light to-accent py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/TKS.png" alt="Topper's Siksha Kendra Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-foreground">
              Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Student Registration</h1>
          <p className="text-lg text-muted-foreground">Join thousands of students on their learning journey</p>
          {referralCode && (
            <div className="mt-4 inline-block bg-card px-4 py-2 rounded-[12px] border border-border">
              <p className="text-sm text-muted-foreground">Referral Code: <span className="font-bold text-primary">{referralCode}</span></p>
            </div>
          )}
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-[8px]">
                {error}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
                <Input
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
                <div>
                  <label className="block mb-2 text-foreground">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Class</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your complete address"
              />
            </div>

            <div>
              <Input
                label="School Name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                placeholder="Enter your school name"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Parent Name"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                  placeholder="Parent/Guardian name"
                />
                <Input
                  label="Parent Contact"
                  name="parentContact"
                  type="tel"
                  value={formData.parentContact}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Select Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-input-background border border-input rounded-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose a course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Registration'}
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By submitting this form, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
