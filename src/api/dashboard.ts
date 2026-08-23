import type {
  DashboardStats,
  RiskDistributionItem,
  DepartmentAnalytics,
  Bottleneck,
  ServiceRequest,
} from '@/types';
import { apiClient, isMockEnabled } from './client';
import {
  getMockDashboardStats,
  getMockRiskDistribution,
  getMockDepartmentAnalytics,
  getMockBottlenecks,
  getMockUrgentRequests,
} from './mockData';

const MOCK_DELAY = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockDashboardStats();
  }
  return apiClient.get<DashboardStats>('/api/dashboard/stats');
}

export async function getRiskDistribution(): Promise<RiskDistributionItem[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockRiskDistribution();
  }
  return apiClient.get<RiskDistributionItem[]>('/api/dashboard/risk-distribution');
}

export async function getDepartmentAnalytics(): Promise<DepartmentAnalytics[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockDepartmentAnalytics();
  }
  return apiClient.get<DepartmentAnalytics[]>('/api/dashboard/department-analytics');
}

export async function getBottlenecks(): Promise<Bottleneck[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockBottlenecks();
  }
  return apiClient.get<Bottleneck[]>('/api/dashboard/bottlenecks');
}

export async function getUrgentRequests(limit = 10): Promise<ServiceRequest[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockUrgentRequests(limit);
  }
  return apiClient.get<ServiceRequest[]>(`/api/dashboard/urgent?limit=${limit}`);
}
