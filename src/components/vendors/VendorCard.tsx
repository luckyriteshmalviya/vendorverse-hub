// Vendor Card Component
import { useNavigate } from 'react-router-dom';
import { Vendor } from '@/types/api.types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  const navigate = useNavigate();

  const handleNavigateToVersions = () => {
    navigate(`/vendors/${vendor.id}/versions`);
  };

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:shadow-medium hover:border-primary/20">
      {/* Actions Menu */}
      <div className="absolute right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(vendor)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(vendor)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{vendor.name}</h3>
          <StatusBadge variant={vendor.status}>
            {vendor.status}
          </StatusBadge>
        </div>
        <p className="text-sm font-mono text-muted-foreground">{vendor.code}</p>
      </div>

      {/* Description */}
      {vendor.description && (
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {vendor.description}
        </p>
      )}

      {/* Navigate to Versions */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNavigateToVersions}
        className="w-full justify-between"
      >
        View Versions
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
