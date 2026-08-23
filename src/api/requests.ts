import type {
  ServiceRequest,
  RequestFilters,
  PaginatedResponse,
  UploadResult,
} from '@/types';
import { apiClient, isMockEnabled } from './client';
import { ALL_REQUESTS, mockUploadResult } from './mockData';

const MOCK_DELAY = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRequests(filters: RequestFilters): Promise<PaginatedResponse<ServiceRequest>> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    let items = [...ALL_REQUESTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.citizenName.toLowerCase().includes(q) ||
          r.serviceType.toLowerCase().includes(q),
      );
    }
    if (filters.department && filters.department !== 'all') {
      items = items.filter((r) => r.department === filters.department);
    }
    if (filters.serviceType && filters.serviceType !== 'all') {
      items = items.filter((r) => r.serviceType === filters.serviceType);
    }
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      items = items.filter((r) => r.riskLevel === filters.riskLevel);
    }
    if (filters.currentStage && filters.currentStage !== 'all') {
      items = items.filter((r) => r.currentStage === filters.currentStage);
    }
    if (filters.priority && filters.priority !== 'all') {
      items = items.filter((r) => r.priority === filters.priority);
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((r) => r.status === filters.status);
    }
    if (filters.dateFrom) {
      items = items.filter((r) => new Date(r.requestDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      items = items.filter((r) => new Date(r.requestDate) <= new Date(filters.dateTo));
    }

    const sortKey = filters.sortBy as keyof ServiceRequest;
    items.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return filters.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      aVal = String(aVal);
      bVal = String(bVal);
      if (filters.sortDir === 'asc') return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });

    const total = items.length;
    const totalPages = Math.ceil(total / filters.pageSize);
    const start = (filters.page - 1) * filters.pageSize;
    const paged = items.slice(start, start + filters.pageSize);

    return {
      items: paged,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages,
      },
    };
  }

  return apiClient.get<PaginatedResponse<ServiceRequest>>(
    `/api/requests?${new URLSearchParams(filters as unknown as Record<string, string>).toString()}`,
  );
}

export async function getRequestById(id: string): Promise<ServiceRequest> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    const req = ALL_REQUESTS.find((r) => r.id === id);
    if (!req) throw { code: 'NOT_FOUND', message: `Request ${id} not found.` };
    return req;
  }
  return apiClient.get<ServiceRequest>(`/api/requests/${id}`);
}

export async function loadDemoData(): Promise<{ count: number }> {
  if (isMockEnabled()) {
    await delay(1200);
    return { count: ALL_REQUESTS.length };
  }
  return apiClient.post<{ count: number }>('/api/requests/demo');
}

export async function uploadCsv(file: File): Promise<UploadResult> {
  if (isMockEnabled()) {
    await delay(1500);
    return mockUploadResult(file);
  }
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.upload<UploadResult>('/api/requests/upload', formData);
}
