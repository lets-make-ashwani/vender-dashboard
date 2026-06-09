import React from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface PopularCourseCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  backgroundColor: string;
  accentColor: string;
  path: string;
}

export const PopularCourseCard: React.FC<PopularCourseCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  backgroundColor,
  accentColor,
  path,
}) => {
  return (
    <Link to={path} className="popular-card block transition-transform hover:-translate-y-1 hover:shadow-lg rounded-[24px] p-6" style={{ backgroundColor }}>
      {badge && (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
          {badge}
        </div>
      )}
      <div className="card-icon w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white shadow-sm" style={{ color: accentColor }}>
        {icon}
      </div>
      <div className="card-content">
        <h3 className="text-xl font-bold text-[#071b4d] mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="card-arrow absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm transition-colors hover:opacity-80" style={{ color: accentColor }}>
        <ArrowRight size={20} />
      </div>
    </Link>
  );
};