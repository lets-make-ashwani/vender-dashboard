import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import { Logo } from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[76px]">
          <Logo />

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
