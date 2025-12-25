// Status Badge Component
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        active: 'bg-success/10 text-success',
        inactive: 'bg-muted text-muted-foreground',
        draft: 'bg-warning/10 text-warning',
        published: 'bg-primary/10 text-primary',
        deprecated: 'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'active',
    },
  }
);

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
