import { Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/TKS.png" alt="Topper's Siksha Kendra Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold">
                Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span>
              </span>
            </div>
            <p className="text-secondary-foreground/80">
              Empowering students through smart learning with trusted educational partners.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-secondary-foreground/80 hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/login" className="text-secondary-foreground/80 hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>support@topperssikshakendra.com</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center text-secondary-foreground/80">
          <p>&copy; 2026 Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
