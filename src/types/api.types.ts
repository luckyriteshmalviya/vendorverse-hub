// API Types for Vendor Management System

export interface Vendor {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Version {
  id: string;
  vendorId: string;
  versionNumber: string;
  description?: string;
  pythonCode?: string;
  status: 'draft' | 'published' | 'deprecated';
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateVendorPayload {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface CreateVersionPayload {
  vendorId: string;
  versionNumber: string;
  description?: string;
  pythonCode?: string;
}

export interface UpdateVersionPayload {
  id: string;
  vendorId: string;
  versionNumber?: string;
  description?: string;
  pythonCode?: string;
  status?: 'draft' | 'published' | 'deprecated';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
