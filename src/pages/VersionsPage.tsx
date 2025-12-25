// Version Listing Page
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, GitBranch } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVendorById } from '@/store/slices/vendorSlice';
import { fetchVersionsByVendor, createVersion, updateVersion, deleteVersion } from '@/store/slices/versionSlice';
import { Version, CreateVersionPayload, UpdateVersionPayload } from '@/types/api.types';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { VersionCard } from '@/components/versions/VersionCard';
import { VersionFormModal } from '@/components/versions/VersionFormModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function VersionsPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const dispatch = useAppDispatch();
  const { selectedVendor } = useAppSelector((state) => state.vendors);
  const { versions, loading, error } = useAppSelector((state) => state.versions);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [deletingVersion, setDeletingVersion] = useState<Version | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vendor and versions on mount
  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorById(vendorId));
      dispatch(fetchVersionsByVendor(vendorId));
    }
  }, [dispatch, vendorId]);

  // Handle create/edit
  const handleOpenCreate = () => {
    setEditingVersion(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (version: Version) => {
    setEditingVersion(version);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreateVersionPayload | UpdateVersionPayload) => {
    setIsSubmitting(true);
    try {
      if ('id' in data) {
        await dispatch(updateVersion(data)).unwrap();
        toast({
          title: 'Version updated',
          description: 'The version has been updated successfully.',
        });
      } else {
        await dispatch(createVersion(data)).unwrap();
        toast({
          title: 'Version created',
          description: 'The new version has been created successfully.',
        });
      }
      setIsFormOpen(false);
      setEditingVersion(null);
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
  const handleOpenDelete = (version: Version) => {
    setDeletingVersion(version);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVersion || !vendorId) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(deleteVersion({ vendorId, versionId: deletingVersion.id })).unwrap();
      toast({
        title: 'Version deleted',
        description: 'The version has been deleted successfully.',
      });
      setDeletingVersion(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete version. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const breadcrumbs = [
    { label: 'Vendors', href: '/vendors' },
    { label: selectedVendor?.name || 'Loading...' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title={`Versions`}
        description={selectedVendor ? `Manage versions for ${selectedVendor.name}` : 'Loading...'}
        breadcrumbs={breadcrumbs}
        action={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            New Version
          </Button>
        }
      />

      {/* Loading State */}
      {loading && versions.length === 0 && <PageLoader message="Loading versions..." />}

      {/* Empty State */}
      {!loading && versions.length === 0 && (
        <EmptyState
          icon={GitBranch}
          title="No versions yet"
          description="Create your first version for this vendor."
          action={
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Version
            </Button>
          }
        />
      )}

      {/* Version Grid */}
      {versions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {versions.map((version, index) => (
            <div 
              key={version.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <VersionCard
                version={version}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {vendorId && (
        <VersionFormModal
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          vendorId={vendorId}
          version={editingVersion}
          onSubmit={handleSubmit}
          loading={isSubmitting}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingVersion}
        onOpenChange={(open) => !open && setDeletingVersion(null)}
        title="Delete Version"
        description={`Are you sure you want to delete version "${deletingVersion?.versionNumber}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isSubmitting}
      />
    </AppLayout>
  );
}
