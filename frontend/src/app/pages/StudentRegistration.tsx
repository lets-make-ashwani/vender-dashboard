import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Logo } from '../components/Logo';
import { Skeleton } from '../components/ui/skeleton';

export default function StudentRegistration() {
  const { referralCode } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [isFetchingCourses, setIsFetchingCourses] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    board: '',
    class: '',
    schoolName: '',
    parentName: '',
    parentContact: '',
    course: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsFetchingCourses(true);
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const apiUrl = rawApiUrl.replace(/\/$/, '');
        const response = await fetch(`${apiUrl}/api/courses`);
        if (response.ok) {
          setCourses(await response.json());
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setIsFetchingCourses(false);
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
        board: formData.board,
        class: formData.class,
        school_name: formData.schoolName,
        parent_name: formData.parentName,
        parent_phone: formData.parentContact,
        course_id: formData.course,
        referral_code: referralCode || undefined
      };

      const response = await fetch(`${apiUrl}/api/student-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to submit registration');
        } else {
          throw new Error('Server returned HTML instead of JSON. Ensure your POST /api/student-leads route is publicly accessible in the backend.');
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'mobile' || name === 'parentContact') {
      // Allow only numeric input and limit to 10 digits
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue.slice(0, 10) }));
    } else if (name === 'board') {
      // If they change their board, reset their selected class and course to enforce the correct order
      setFormData(prev => ({ ...prev, [name]: value, class: '', course: '' }));
    } else if (name === 'class') {
      // If they change their class, reset their selected course to avoid mismatches
      setFormData(prev => ({ ...prev, [name]: value, course: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Only show active courses, and filter them based on the selected class
  const activeCourses = courses.filter(c => c.status === 'ACTIVE');
  const filteredCourses = activeCourses.filter(c => formData.class ? c.class === formData.class : true);

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
          <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-light to-accent py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Student Registration</h1>
          <p className="text-lg text-muted-foreground">Join thousands of students on their learning journey</p>
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
                  placeholder="9876543210"
                  maxLength={10}
                  minLength={10}
                  pattern="\d{10}"
                  title="Mobile number must be exactly 10 digits"
                />
            <Input
              label="School Name"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
              placeholder="Enter your school name"
            />
            <div>
              <label className="block mb-2 text-foreground">Board</label>
              <select
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-input-background border border-input rounded-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>
                <div>
                  <label className="block mb-2 text-foreground">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                disabled={!formData.board}
                className={`w-full px-4 py-3 bg-input-background border border-input rounded-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${!formData.board ? 'opacity-50 cursor-not-allowed bg-muted' : ''}`}
                  >
                <option value="">{formData.board ? 'Select Class' : 'Select Board First'}</option>
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
                  placeholder="9876543210"
                  maxLength={10}
                  minLength={10}
                  pattern="\d{10}"
                  title="Parent contact must be exactly 10 digits"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-foreground">Select Course</label>
              {isFetchingCourses ? (
                <Skeleton className="w-full h-[50px] rounded-[12px]" />
              ) : (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a course</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              )}
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
