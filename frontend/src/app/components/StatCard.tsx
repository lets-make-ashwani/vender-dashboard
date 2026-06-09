import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'secondary';
}

export default function StatCard({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary',
    success: 'bg-green-100 text-success',
    warning: 'bg-orange-100 text-warning',
    secondary: 'bg-blue-100 text-secondary'
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {trend && (
            <p className="text-sm text-success">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
