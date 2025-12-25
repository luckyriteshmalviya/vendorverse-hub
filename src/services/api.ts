// Centralized API Service Layer
// This service handles all API calls with mock data for development

import { mockVendors, mockVersions } from './mockData';
import {
  Vendor,
  Version,
  CreateVendorPayload,
  UpdateVendorPayload,
  CreateVersionPayload,
  UpdateVersionPayload,
} from '@/types/api.types';

// Simulated network delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MOCK_DELAY = 500;

// In-memory storage for mutations during development
let vendors = [...mockVendors];
let versions = [...mockVersions];

// ============================================
// VENDOR API ENDPOINTS
// ============================================

export const vendorApi = {
  /**
   * Fetch all vendors
   */
  async getVendors(): Promise<Vendor[]> {
    await delay(MOCK_DELAY);
    return [...vendors];
  },

  /**
   * Fetch single vendor by ID
   */
  async getVendorById(id: string): Promise<Vendor | null> {
    await delay(MOCK_DELAY);
    return vendors.find(v => v.id === id) || null;
  },

  /**
   * Create a new vendor
   */
  async createVendor(payload: CreateVendorPayload): Promise<Vendor> {
    await delay(MOCK_DELAY);
    const newVendor: Vendor = {
      id: Date.now().toString(),
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vendors.push(newVendor);
    return newVendor;
  },

  /**
   * Update existing vendor
   */
  async updateVendor(payload: UpdateVendorPayload): Promise<Vendor> {
    await delay(MOCK_DELAY);
    const index = vendors.findIndex(v => v.id === payload.id);
    if (index === -1) {
      throw new Error('Vendor not found');
    }
    vendors[index] = {
      ...vendors[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return vendors[index];
  },

  /**
   * Delete vendor by ID
   */
  async deleteVendor(id: string): Promise<void> {
    await delay(MOCK_DELAY);
    vendors = vendors.filter(v => v.id !== id);
    // Also delete associated versions
    versions = versions.filter(v => v.vendorId !== id);
  },
};

// ============================================
// VERSION API ENDPOINTS
// ============================================

export const versionApi = {
  /**
   * Fetch all versions for a vendor
   */
  async getVersionsByVendor(vendorId: string): Promise<Version[]> {
    await delay(MOCK_DELAY);
    return versions.filter(v => v.vendorId === vendorId);
  },

  /**
   * Fetch single version by ID
   */
  async getVersionById(vendorId: string, versionId: string): Promise<Version | null> {
    await delay(MOCK_DELAY);
    return versions.find(v => v.id === versionId && v.vendorId === vendorId) || null;
  },

  /**
   * Create a new version
   */
  async createVersion(payload: CreateVersionPayload): Promise<Version> {
    await delay(MOCK_DELAY);
    const newVersion: Version = {
      id: `v-${Date.now()}`,
      ...payload,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    versions.push(newVersion);
    return newVersion;
  },

  /**
   * Update existing version
   */
  async updateVersion(payload: UpdateVersionPayload): Promise<Version> {
    await delay(MOCK_DELAY);
    const index = versions.findIndex(v => v.id === payload.id && v.vendorId === payload.vendorId);
    if (index === -1) {
      throw new Error('Version not found');
    }
    versions[index] = {
      ...versions[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return versions[index];
  },

  /**
   * Delete version by ID
   */
  async deleteVersion(vendorId: string, versionId: string): Promise<void> {
    await delay(MOCK_DELAY);
    versions = versions.filter(v => !(v.id === versionId && v.vendorId === vendorId));
  },
};
