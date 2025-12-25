// Vendor Form Modal Component
import { useEffect, useState } from 'react';
import { Vendor, CreateVendorPayload, UpdateVendorPayload } from '@/types/api.types';
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

interface VendorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor | null;
  onSubmit: (data: CreateVendorPayload | UpdateVendorPayload) => void;
  loading?: boolean;
}

export function VendorFormModal({
  open,
  onOpenChange,
  vendor,
  onSubmit,
  loading = false,
}: VendorFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!vendor;

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        code: vendor.code,
        description: vendor.description || '',
      });
    } else {
      setFormData({ name: '', code: '', description: '' });
    }
    setErrors({});
  }, [vendor, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Vendor code is required';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.code)) {
      newErrors.code = 'Code must contain only letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEditing && vendor) {
      onSubmit({
        id: vendor.id,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Vendor' : 'Create New Vendor'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the vendor information below.'
              : 'Fill in the details to create a new vendor.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Vendor Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Acme Corporation"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Vendor Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Vendor Code *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., ACME-001"
              className={errors.code ? 'border-destructive' : ''}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the vendor..."
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
              {loading ? 'Saving...' : isEditing ? 'Update Vendor' : 'Create Vendor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
