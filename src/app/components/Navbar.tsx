import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/TKS.png" alt="Topper's Siksha Kendra Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-foreground">
              Topper<span className="text-primary">'s</span> Siksha <span className="text-primary">Kendra</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {token ? (
              <Link to={role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {token ? (
              <Link to={role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'} onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
