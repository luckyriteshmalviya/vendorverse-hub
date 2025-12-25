// Version Card Component
import { Version } from '@/types/api.types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

interface VersionCardProps {
  version: Version;
  onEdit: (version: Version) => void;
  onDelete: (version: Version) => void;
}

export function VersionCard({ version, onEdit, onDelete }: VersionCardProps) {
  const navigate = useNavigate();
  const { vendorId } = useParams();

  const handleNavigateToDetail = () => {
    navigate(`/vendors/${vendorId}/versions/${version.id}`);
  };

  const getStatusVariant = (status: Version['status']) => {
    switch (status) {
      case 'published':
        return 'published';
      case 'draft':
        return 'draft';
      case 'deprecated':
        return 'deprecated';
      default:
        return 'active';
    }
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
            <DropdownMenuItem onClick={() => onEdit(version)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(version)}
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
          <h3 className="font-semibold font-mono text-foreground">v{version.versionNumber}</h3>
          <StatusBadge variant={getStatusVariant(version.status)}>
            {version.status}
          </StatusBadge>
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {format(new Date(version.updatedAt), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Description */}
      {version.description && (
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {version.description}
        </p>
      )}

      {/* Navigate to Detail */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNavigateToDetail}
        className="w-full justify-between"
      >
        View Details
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
