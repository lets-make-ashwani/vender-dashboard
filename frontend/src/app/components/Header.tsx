import React from 'react';
import { Link } from 'react-router';
import { Logo } from './Logo';
import Button from './Button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Logo />
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Courses</Link>
          <Link to="/become-vendor" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Partner with Us</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">Login</Button>
          </Link>
          <Link to="/become-vendor">
            <Button size="sm">Become a Vendor</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}