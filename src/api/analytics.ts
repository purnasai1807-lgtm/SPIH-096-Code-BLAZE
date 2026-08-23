import type {
  DepartmentAnalytics,
  Bottleneck,
  RiskDistributionItem,
} from '@/types';
import { apiClient, isMockEnabled } from './client';
import {
  getMockDepartmentAnalytics,
  getMockBottlenecks,
  getMockRiskDistribution,
  getMockRiskTrends,
  getMockSlaComplianceTrend,
} from './mockData';

const MOCK_DELAY = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAnalyticsRiskDistribution(): Promise<RiskDistributionItem[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockRiskDistribution();
  }
  return apiClient.get<RiskDistributionItem[]>('/api/analytics/risk-distribution');
}

export async function getAnalyticsDepartmentAnalytics(): Promise<DepartmentAnalytics[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockDepartmentAnalytics();
  }
  return apiClient.get<DepartmentAnalytics[]>('/api/analytics/departments');
}

export async function getAnalyticsBottlenecks(): Promise<Bottleneck[]> {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockBottlenecks();
  }
  return apiClient.get<Bottleneck[]>('/api/analytics/bottlenecks');
}

export async function getRiskTrends() {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockRiskTrends();
  }
  return apiClient.get('/api/analytics/risk-trends');
}

export async function getSlaComplianceTrend() {
  if (isMockEnabled()) {
    await delay(MOCK_DELAY);
    return getMockSlaComplianceTrend();
  }
  return apiClient.get('/api/analytics/sla-compliance-trend');
}
