import { useState } from 'react';
import { CheckCircle, Clock, Upload } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Logo } from '../components/Logo';

export default function VendorRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar_number: '',
    pan_number: '',
    aadhaar_front: '',
    aadhaar_back: '',
    pan_image: '',
    bank_name: '',
    branch_name: '',
    account_number: '',
    ifsc_code: '',
    passbook_image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = rawApiUrl.replace(/\/$/, '');
      
      const response = await fetch(`${apiUrl}/api/auth/apply-vendor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to submit application');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setFormData({ ...formData, [name]: reader.result as string });
        reader.readAsDataURL(file);
      }
    } else if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue.slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-light to-accent flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-warning rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-warning-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest in becoming a Topper's Siksha Kendra vendor. Your application is currently under review.
          </p>
          <div className="bg-primary-light p-6 rounded-[12px] mb-6">
            <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
            <ul className="text-left space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Our team will review your application within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>You will receive an email notification about your approval status</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Once approved, you can access your vendor dashboard and start referring students</span>
              </li>
            </ul>
          </div>
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
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Become a Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span> Vendor
          </h1>
          <p className="text-lg text-muted-foreground">Join our network of trusted educational partners</p>
        </div>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vendor Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Unlimited Referrals</p>
                <p className="text-sm text-muted-foreground">Generate unlimited student referral codes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Track Enrollments</p>
                <p className="text-sm text-muted-foreground">Monitor all student enrollments in real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Dashboard Access</p>
                <p className="text-sm text-muted-foreground">Complete vendor dashboard with analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">QR Code System</p>
                <p className="text-sm text-muted-foreground">Generate QR codes for easy student registration</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-[8px]">
                {error}
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Vendor Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    minLength={10}
                    pattern="\d{10}"
                    title="Phone number must be exactly 10 digits"
                  />
                </div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password (minimum 6 characters)"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Address Details</h3>
              <div className="space-y-4">
                <Input
                  label="Complete Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House/Building, Street, Area"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State"
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="123456"
                    pattern="\d{6}"
                    title="Pincode must be exactly 6 digits"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Identity Verification (Compulsory)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Aadhaar Card Number"
                    name="aadhaar_number"
                    value={formData.aadhaar_number}
                    onChange={handleChange}
                    required
                    placeholder="1234 5678 9012"
                    maxLength={12}
                    minLength={12}
                    pattern="\d{12}"
                    title="Aadhaar must be exactly 12 digits"
                  />
                  <Input
                    label="PAN Card Number"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleChange}
                    required
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    minLength={10}
                    pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"
                    title="PAN must be in format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)"
                    className="uppercase"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="relative border-2 border-dashed border-border rounded-[12px] p-6 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file" name="aadhaar_front" accept="image/*" required onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none">
                      {formData.aadhaar_front ? (
                        <img src={formData.aadhaar_front} alt="Aadhaar Front" className="h-20 mx-auto object-contain rounded shadow-sm" />
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary">Click to upload</span>
                          <p className="text-xs text-muted-foreground mt-1">Aadhaar Front Photo</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative border-2 border-dashed border-border rounded-[12px] p-6 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file" name="aadhaar_back" accept="image/*" required onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none">
                      {formData.aadhaar_back ? (
                        <img src={formData.aadhaar_back} alt="Aadhaar Back" className="h-20 mx-auto object-contain rounded shadow-sm" />
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary">Click to upload</span>
                          <p className="text-xs text-muted-foreground mt-1">Aadhaar Back Photo</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative border-2 border-dashed border-border rounded-[12px] p-6 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file" name="pan_image" accept="image/*" required onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none">
                      {formData.pan_image ? (
                        <img src={formData.pan_image} alt="PAN Card" className="h-20 mx-auto object-contain rounded shadow-sm" />
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary">Click to upload</span>
                          <p className="text-xs text-muted-foreground mt-1">PAN Card Photo</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Images must be clear and readable. Max size 5MB each.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Bank Account Details (Compulsory)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                    placeholder="State Bank of India"
                  />
                  <Input
                    label="Branch Name"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleChange}
                    required
                    placeholder="Connaught Place"
                  />
                  <Input
                    label="Account Number"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                    placeholder="123456789012"
                  />
                  <Input
                    label="IFSC Code"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    required
                    placeholder="SBIN0000001"
                    maxLength={11}
                    minLength={11}
                    pattern="[a-zA-Z]{4}0[a-zA-Z0-9]{6}"
                    title="IFSC Code must be 11 characters, with the 5th character as 0 (e.g., SBIN0000001)"
                    className="uppercase"
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-foreground">Bank Passbook / Cancelled Cheque Photo</label>
                  <div className="relative border-2 border-dashed border-border rounded-[12px] p-6 text-center hover:bg-muted/50 transition-colors mt-2">
                    <input
                      type="file" name="passbook_image" accept="image/*" required onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none">
                      {formData.passbook_image ? (
                        <img src={formData.passbook_image} alt="Bank Passbook" className="h-20 mx-auto object-contain rounded shadow-sm" />
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary">Click to upload</span>
                          <p className="text-xs text-muted-foreground mt-1">Passbook / Cancelled Cheque Photo</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                {loading ? 'Uploading & Submitting...' : 'Submit Application'}
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By submitting this application, you agree to our Vendor Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
