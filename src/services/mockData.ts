// Mock data for development
import { Vendor, Version } from '@/types/api.types';

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    code: 'ACME-001',
    description: 'Leading provider of enterprise solutions',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'TechFlow Systems',
    code: 'TFS-002',
    description: 'Cloud infrastructure and DevOps specialists',
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
  },
  {
    id: '3',
    name: 'DataStream Inc',
    code: 'DSI-003',
    description: 'Real-time data processing platform',
    status: 'active',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
  {
    id: '4',
    name: 'CloudNine Solutions',
    code: 'CNS-004',
    description: 'Multi-cloud management services',
    status: 'inactive',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Neural Networks Ltd',
    code: 'NNL-005',
    description: 'AI and machine learning platform',
    status: 'active',
    createdAt: '2024-03-01T07:00:00Z',
    updatedAt: '2024-03-22T09:15:00Z',
  },
];

export const mockVersions: Version[] = [
  // Acme Corporation versions
  {
    id: 'v1-1',
    vendorId: '1',
    versionNumber: '1.0.0',
    description: 'Initial release with core features',
    pythonCode: `# Acme Integration v1.0.0
def process_data(input_data):
    """Process incoming data from Acme systems."""
    result = transform(input_data)
    return validate(result)`,
    status: 'deprecated',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'v1-2',
    vendorId: '1',
    versionNumber: '1.1.0',
    description: 'Added performance improvements and bug fixes',
    pythonCode: `# Acme Integration v1.1.0
def process_data(input_data):
    """Enhanced data processing with caching."""
    cached = cache_lookup(input_data)
    if cached:
        return cached
    result = transform(input_data)
    cache_store(input_data, result)
    return validate(result)`,
    status: 'published',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
  },
  {
    id: 'v1-3',
    vendorId: '1',
    versionNumber: '2.0.0',
    description: 'Major release with new API structure',
    pythonCode: `# Acme Integration v2.0.0
class AcmeProcessor:
    def __init__(self, config):
        self.config = config
        
    def process(self, data):
        return self._transform(data)`,
    status: 'draft',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
  // TechFlow versions
  {
    id: 'v2-1',
    vendorId: '2',
    versionNumber: '1.0.0',
    description: 'TechFlow integration baseline',
    pythonCode: `# TechFlow Integration
def sync_infrastructure():
    return fetch_cloud_state()`,
    status: 'published',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
  },
  // DataStream versions
  {
    id: 'v3-1',
    vendorId: '3',
    versionNumber: '1.0.0',
    description: 'Stream processing pipeline',
    pythonCode: `# DataStream Pipeline
async def process_stream(stream):
    async for event in stream:
        yield transform(event)`,
    status: 'published',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
];
