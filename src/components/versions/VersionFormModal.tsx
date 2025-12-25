// Version Form Modal Component
import { useEffect, useState } from 'react';
import { Version, CreateVersionPayload, UpdateVersionPayload } from '@/types/api.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VersionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  version?: Version | null;
  onSubmit: (data: CreateVersionPayload | UpdateVersionPayload) => void;
  loading?: boolean;
}

export function VersionFormModal({
  open,
  onOpenChange,
  vendorId,
  version,
  onSubmit,
  loading = false,
}: VersionFormModalProps) {
  const [formData, setFormData] = useState({
    versionNumber: '',
    description: '',
    status: 'draft' as Version['status'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!version;

  useEffect(() => {
    if (version) {
      setFormData({
        versionNumber: version.versionNumber,
        description: version.description || '',
        status: version.status,
      });
    } else {
      setFormData({ versionNumber: '', description: '', status: 'draft' });
    }
    setErrors({});
  }, [version, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.versionNumber.trim()) {
      newErrors.versionNumber = 'Version number is required';
    } else if (!/^\d+\.\d+\.\d+$/.test(formData.versionNumber)) {
      newErrors.versionNumber = 'Version must be in format X.Y.Z (e.g., 1.0.0)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEditing && version) {
      onSubmit({
        id: version.id,
        vendorId,
        ...formData,
      });
    } else {
      onSubmit({
        vendorId,
        ...formData,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Version' : 'Create New Version'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the version information below.'
              : 'Fill in the details to create a new version.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Version Number */}
          <div className="space-y-2">
            <Label htmlFor="versionNumber">Version Number *</Label>
            <Input
              id="versionNumber"
              value={formData.versionNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, versionNumber: e.target.value }))}
              placeholder="e.g., 1.0.0"
              className={errors.versionNumber ? 'border-destructive' : ''}
            />
            {errors.versionNumber && (
              <p className="text-sm text-destructive">{errors.versionNumber}</p>
            )}
          </div>

          {/* Status (only for editing) */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Version['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this version..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Version' : 'Create Version'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
