// App Header / Navigation Component
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Box, Layers } from 'lucide-react';

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/vendors" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-soft">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">VendorHub</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <NavItem 
            to="/vendors" 
            icon={Layers}
            isActive={location.pathname.startsWith('/vendors')}
          >
            Vendors
          </NavItem>
        </nav>
      </div>
    </header>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ to, icon: Icon, children, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
