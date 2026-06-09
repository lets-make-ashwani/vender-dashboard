import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-card rounded-[18px] p-6 shadow-[0_2px_8px_var(--shadow)] border border-border ${hover ? 'hover:shadow-[0_4px_16px_var(--shadow)] transition-shadow duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
