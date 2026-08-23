export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'BREACHED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RequestStatus = 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'BREACHED' | 'COMPLETED';
export type RecommendationAction = 'MONITOR' | 'ASSIGN' | 'ESCALATE' | 'REASSIGN' | 'EXPEDITE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

export interface BottleneckInfo {
  stage: string;
  delayRate: number;
  affectedRequests: number;
}

export interface Recommendation {
  action: RecommendationAction;
  reason: string;
  priority: Priority;
}

export interface RiskFactor {
  title: string;
  detail: string;
  weight: number;
}

export interface ServiceRequest {
  id: string;
  department: string;
  serviceType: string;
  currentStage: string;
  priority: Priority;
  status: RequestStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  slaRemainingHours: number;
  slaTotalHours: number;
  slaConsumedPercent: number;
  requestDate: string;
  deadline: string;
  bottleneck: string | null;
  currentStageDurationHours: number;
  historicalAverageHours: number;
  historicalDelayRate: number;
  recommendation: Recommendation;
  riskFactors: RiskFactor[];
  citizenName: string;
  assignedTo: string | null;
}

export interface DashboardStats {
  totalRequests: number;
  onTrack: number;
  atRisk: number;
  critical: number;
  breached: number;
  slaCompliance: number;
  avgRiskScore: number;
  pendingReview: number;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
  color: string;
}

export interface DepartmentAnalytics {
  department: string;
  requestCount: number;
  averageRisk: number;
  delayRate: number;
  slaCompliance: number;
}

export interface Bottleneck {
  stage: string;
  delayRate: number;
  affectedRequests: number;
  avgProcessingTime: number;
}

export interface UploadResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: UploadError[];
}

export interface UploadError {
  row: number;
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RequestFilters {
  search: string;
  department: string;
  serviceType: string;
  riskLevel: string;
  currentStage: string;
  priority: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}
