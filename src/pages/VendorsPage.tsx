// Vendors Page - Main listing of all vendors
import { useEffect, useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVendors, createVendor, updateVendor, deleteVendor } from '@/store/slices/vendorSlice';
import { Vendor, CreateVendorPayload, UpdateVendorPayload } from '@/types/api.types';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { VendorCard } from '@/components/vendors/VendorCard';
import { VendorFormModal } from '@/components/vendors/VendorFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

export default function VendorsPage() {
  const dispatch = useAppDispatch();
  const { vendors, loading, error } = useAppSelector((state) => state.vendors);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vendors on mount
  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  // Filter vendors by search
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create/edit
  const handleOpenCreate = () => {
    setEditingVendor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreateVendorPayload | UpdateVendorPayload) => {
    setIsSubmitting(true);
    try {
      if ('id' in data) {
        await dispatch(updateVendor(data)).unwrap();
        toast({
          title: 'Vendor updated',
          description: 'The vendor has been updated successfully.',
        });
      } else {
        await dispatch(createVendor(data)).unwrap();
        toast({
          title: 'Vendor created',
          description: 'The new vendor has been created successfully.',
        });
      }
      setIsFormOpen(false);
      setEditingVendor(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleOpenDelete = (vendor: Vendor) => {
    setDeletingVendor(vendor);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVendor) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(deleteVendor(deletingVendor.id)).unwrap();
      toast({
        title: 'Vendor deleted',
        description: 'The vendor has been deleted successfully.',
      });
      setDeletingVendor(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete vendor. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <AppLayout>
      <PageHeader
        title="Vendors"
        description="Manage your vendor integrations and configurations"
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            New Vendor
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && vendors.length === 0 && <PageLoader message="Loading vendors..." />}

      {/* Empty State */}
      {!loading && vendors.length === 0 && (
        <EmptyState
          icon={Package}
          title="No vendors yet"
          description="Get started by creating your first vendor integration."
          action={
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Vendor
            </Button>
          }
        />
      )}

      {/* No Search Results */}
      {!loading && vendors.length > 0 && filteredVendors.length === 0 && (
        <EmptyState
          icon={Search}
          title="No matching vendors"
          description="Try adjusting your search query to find what you're looking for."
        />
      )}

      {/* Vendor Grid */}
      {filteredVendors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {filteredVendors.map((vendor, index) => (
            <div 
              key={vendor.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <VendorCard
                vendor={vendor}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <VendorFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vendor={editingVendor}
        onSubmit={handleSubmit}
        loading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingVendor}
        onOpenChange={(open) => !open && setDeletingVendor(null)}
        title="Delete Vendor"
        description={`Are you sure you want to delete "${deletingVendor?.name}"? This will also delete all associated versions. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isSubmitting}
      />
    </AppLayout>
  );
}
