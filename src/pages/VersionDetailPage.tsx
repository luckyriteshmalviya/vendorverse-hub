// Version Detail Page - Full view/edit for a single version
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Code } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVendorById } from '@/store/slices/vendorSlice';
import { fetchVersionById, updateVersion } from '@/store/slices/versionSlice';
import { UpdateVersionPayload } from '@/types/api.types';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/shared/StatusBadge';
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
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function VersionDetailPage() {
  const { vendorId, versionId } = useParams<{ vendorId: string; versionId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedVendor } = useAppSelector((state) => state.vendors);
  const { selectedVersion, loading } = useAppSelector((state) => state.versions);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    versionNumber: '',
    description: '',
    pythonCode: '',
    status: 'draft' as 'draft' | 'published' | 'deprecated',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    if (vendorId && versionId) {
      dispatch(fetchVendorById(vendorId));
      dispatch(fetchVersionById({ vendorId, versionId }));
    }
  }, [dispatch, vendorId, versionId]);

  // Populate form when version loads
  useEffect(() => {
    if (selectedVersion) {
      setFormData({
        versionNumber: selectedVersion.versionNumber,
        description: selectedVersion.description || '',
        pythonCode: selectedVersion.pythonCode || '',
        status: selectedVersion.status,
      });
      setHasChanges(false);
    }
  }, [selectedVersion]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!vendorId || !versionId) return;

    setIsSaving(true);
    try {
      const payload: UpdateVersionPayload = {
        id: versionId,
        vendorId,
        ...formData,
      };
      await dispatch(updateVersion(payload)).unwrap();
      toast({
        title: 'Changes saved',
        description: 'Version has been updated successfully.',
      });
      setHasChanges(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusVariant = (status: string) => {
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

  const breadcrumbs = [
    { label: 'Vendors', href: '/vendors' },
    { label: selectedVendor?.name || 'Loading...', href: `/vendors/${vendorId}/versions` },
    { label: `v${formData.versionNumber || '...'}` },
  ];

  if (loading && !selectedVersion) {
    return (
      <AppLayout>
        <PageLoader message="Loading version details..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={`Version ${formData.versionNumber}`}
        breadcrumbs={breadcrumbs}
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Python Code Editor */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Python Code</h2>
            </div>
            <Textarea
              value={formData.pythonCode}
              onChange={(e) => handleChange('pythonCode', e.target.value)}
              placeholder="# Enter your Python code here..."
              className="min-h-[400px] font-mono text-sm bg-muted/50"
            />
          </div>
        </div>

        {/* Sidebar - Version Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-semibold">Version Info</h2>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
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

              {/* Version Number */}
              <div className="space-y-2">
                <Label htmlFor="versionNumber">Version Number</Label>
                <Input
                  id="versionNumber"
                  value={formData.versionNumber}
                  onChange={(e) => handleChange('versionNumber', e.target.value)}
                  placeholder="e.g., 1.0.0"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe this version..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          {selectedVersion && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-semibold">Metadata</h2>
              
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Current Status</dt>
                  <dd>
                    <StatusBadge variant={getStatusVariant(selectedVersion.status)}>
                      {selectedVersion.status}
                    </StatusBadge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="font-medium">
                    {format(new Date(selectedVersion.createdAt), 'MMM d, yyyy')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">
                    {format(new Date(selectedVersion.updatedAt), 'MMM d, yyyy')}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
