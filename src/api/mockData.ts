import type {
  ServiceRequest,
  DashboardStats,
  RiskDistributionItem,
  DepartmentAnalytics,
  Bottleneck,
  User,
  AuthResponse,
  UploadResult,
  RiskLevel,
  Priority,
  RequestStatus,
  RecommendationAction,
} from '@/types';

const DEPARTMENTS = [
  'Revenue',
  'Municipal Services',
  'Transport',
  'Public Works',
  'Health Services',
  'Licensing',
  'Water Services',
];

const SERVICE_TYPES: Record<string, string[]> = {
  Revenue: ['Property Tax Assessment', 'Tax Filing Review', 'Refund Processing', 'Audit Request'],
  'Municipal Services': ['Birth Certificate', 'Death Certificate', 'Marriage License', 'Address Change'],
  Transport: ['Vehicle Registration', 'License Renewal', 'Permit Application', 'Road Complaint'],
  'Public Works': ['Road Repair Request', 'Street Lighting', 'Drainage Issue', 'Park Maintenance'],
  'Health Services:': ['Health License', 'Sanitation Inspection', 'Food Permit', 'Vaccination Record'],
  Licensing: ['Business License', 'Trade Permit', 'Construction Permit', 'Event License'],
  'Water Services': ['New Connection', 'Billing Dispute', 'Leak Repair', 'Quality Test Request'],
};

const STAGES = [
  'Intake',
  'Document Verification',
  'Initial Review',
  'Departmental Review',
  'Approval',
  'Final Processing',
  'Dispatch',
];

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
  BREACHED: '#7c2d12',
};

const BOTTLENECK_STAGES = ['Document Verification', 'Departmental Review', 'Initial Review'];

const STAGE_DELAY_RATES: Record<string, number> = {
  'Document Verification': 35,
  'Departmental Review': 28,
  'Initial Review': 22,
  Intake: 12,
  Approval: 18,
  'Final Processing': 15,
  Dispatch: 8,
};

const STAGE_AVG_HOURS: Record<string, number> = {
  Intake: 2,
  'Document Verification': 6,
  'Initial Review': 8,
  'Departmental Review': 12,
  Approval: 5,
  'Final Processing': 4,
  Dispatch: 3,
};

const CITIZEN_NAMES = [
  'James Anderson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Johnson', 'David Kim',
  'Jessica Martinez', 'Robert Taylor', 'Lisa Wang', 'Daniel Brown', 'Maria Garcia',
  'Kevin O\'Brien', 'Aisha Patel', 'Thomas Wilson', 'Rachel Cohen', 'Christopher Lee',
  'Nicole Adams', 'Brian Thompson', 'Grace Park', 'Eric Davis', 'Olivia Murphy',
];

const ASSIGNEES = [
  'Alex Morgan', 'Priya Sharma', 'James Wilson', 'Nina Patel', 'Carlos Diaz',
  'Sarah Lee', 'David Chen', 'Maya Johnson', null, null,
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function riskFromScore(score: number, breached: boolean): RiskLevel {
  if (breached) return 'BREACHED';
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

function statusFromScore(score: number, breached: boolean): RequestStatus {
  if (breached) return 'BREACHED';
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'AT_RISK';
  return 'ON_TRACK';
}

function priorityFromScore(score: number): Priority {
  if (score >= 80) return 'URGENT';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

function recommendationFromScore(
  score: number,
  hasBottleneck: boolean,
): { action: RecommendationAction; reason: string } {
  if (score >= 80) {
    return {
      action: 'ESCALATE',
      reason:
        'The request has high breach risk and is currently blocked at a bottleneck stage. Immediate escalation is required to prevent SLA breach.',
    };
  }
  if (score >= 60 && hasBottleneck) {
    return {
      action: 'EXPEDITE',
      reason:
        'The request is at risk due to a stage bottleneck. Expediting this request through the bottleneck can prevent a breach.',
    };
  }
  if (score >= 60) {
    return {
      action: 'ASSIGN',
      reason:
        'The request is at elevated risk. Assigning a dedicated case worker can help move it forward before the SLA deadline.',
    };
  }
  if (score >= 35) {
    return {
      action: 'MONITOR',
      reason:
        'The request shows moderate risk. Continue monitoring to ensure it progresses on schedule.',
    };
  }
  return {
    action: 'MONITOR',
    reason: 'The request is on track. No action required at this time.',
  };
}

function buildRiskFactors(
  stage: string,
  currentDuration: number,
  historicalAvg: number,
  delayRate: number,
  slaRemaining: number,
): { title: string; detail: string; weight: number }[] {
  const factors: { title: string; detail: string; weight: number }[] = [];

  if (currentDuration > historicalAvg) {
    factors.push({
      title: 'Extended Stage Duration',
      detail: `This request has remained in ${stage} for ${currentDuration} hours compared with a historical average of ${historicalAvg} hours.`,
      weight: 35,
    });
  }

  if (delayRate >= 25) {
    factors.push({
      title: 'High Historical Delay Rate',
      detail: `The ${stage} stage has a ${delayRate}% historical delay rate, indicating frequent bottlenecks at this step.`,
      weight: 25,
    });
  }

  if (slaRemaining <= 6) {
    factors.push({
      title: 'Limited SLA Time Remaining',
      detail: `Only ${slaRemaining} hours remain before the SLA deadline, leaving little room for further delays.`,
      weight: 25,
    });
  }

  if (currentDuration > historicalAvg * 1.5) {
    factors.push({
      title: 'Severely Exceeding Average',
      detail: `Current duration is ${Math.round((currentDuration / historicalAvg) * 100)}% of the historical average — a strong breach predictor.`,
      weight: 15,
    });
  }

  return factors.length > 0
    ? factors
    : [{ title: 'Normal Progression', detail: 'The request is progressing within expected parameters.', weight: 10 }];
}

export function generateRequests(count = 1000): ServiceRequest[] {
  const rng = seededRandom(42);
  const requests: ServiceRequest[] = [];

  for (let i = 0; i < count; i++) {
    const id = `REQ-${1000 + i}`;
    const department = pick(DEPARTMENTS, rng);
    const serviceTypes = SERVICE_TYPES[department] || SERVICE_TYPES['Revenue'];
    const serviceType = pick(serviceTypes, rng);
    const stage = pick(STAGES, rng);
    const historicalAvg = STAGE_AVG_HOURS[stage] || 6;
    const delayRate = STAGE_DELAY_RATES[stage] || 15;

    const isBottleneckStage = BOTTLENECK_STAGES.includes(stage);
    const hasBottleneck = isBottleneckStage && rng() > 0.4;

    const currentDuration = Math.round(historicalAvg + rng() * historicalAvg * 2);
    const slaTotal = 24 + Math.floor(rng() * 72);
    const slaRemaining = Math.max(0, slaTotal - currentDuration - Math.floor(rng() * 10));
    const breached = slaRemaining <= 0;

    let riskScore = 20 + rng() * 60;
    if (currentDuration > historicalAvg * 1.5) riskScore += 20;
    if (hasBottleneck) riskScore += 15;
    if (slaRemaining < 6) riskScore += 15;
    riskScore = Math.min(99, Math.round(riskScore));
    if (breached) riskScore = Math.max(riskScore, 90);

    const riskLevel = riskFromScore(riskScore, breached);
    const status = statusFromScore(riskScore, breached);
    const priority = priorityFromScore(riskScore);
    const rec = recommendationFromScore(riskScore, hasBottleneck);

    const daysAgo = Math.floor(rng() * 30);
    const requestDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const deadline = new Date(requestDate.getTime() + slaTotal * 60 * 60 * 1000);
    const slaConsumed = Math.round(((slaTotal - slaRemaining) / slaTotal) * 100);

    requests.push({
      id,
      department,
      serviceType,
      currentStage: stage,
      priority,
      status,
      riskScore,
      riskLevel,
      slaRemainingHours: slaRemaining,
      slaTotalHours: slaTotal,
      slaConsumedPercent: Math.min(100, slaConsumed),
      requestDate: requestDate.toISOString(),
      deadline: deadline.toISOString(),
      bottleneck: hasBottleneck ? stage : null,
      currentStageDurationHours: currentDuration,
      historicalAverageHours: historicalAvg,
      historicalDelayRate: delayRate,
      recommendation: {
        action: rec.action,
        reason: rec.reason,
        priority,
      },
      riskFactors: buildRiskFactors(stage, currentDuration, historicalAvg, delayRate, slaRemaining),
      citizenName: pick(CITIZEN_NAMES, rng),
      assignedTo: pick(ASSIGNEES, rng),
    });
  }

  // Inject REQ-1042 as the hero demo request
  const heroIdx = 42;
  const heroDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const heroSlaTotal = 48;
  requests[heroIdx] = {
    id: 'REQ-1042',
    department: 'Revenue',
    serviceType: 'Property Tax Assessment',
    currentStage: 'Document Verification',
    priority: 'HIGH',
    status: 'CRITICAL',
    riskScore: 86,
    riskLevel: 'CRITICAL',
    slaRemainingHours: 5,
    slaTotalHours: heroSlaTotal,
    slaConsumedPercent: 90,
    requestDate: heroDate.toISOString(),
    deadline: new Date(heroDate.getTime() + heroSlaTotal * 60 * 60 * 1000).toISOString(),
    bottleneck: 'Document Verification',
    currentStageDurationHours: 10,
    historicalAverageHours: 6,
    historicalDelayRate: 35,
    recommendation: {
      action: 'ESCALATE',
      reason:
        'The request has high breach risk and is currently blocked at a document verification bottleneck.',
      priority: 'HIGH',
    },
    riskFactors: [
      {
        title: 'Extended Stage Duration',
        detail:
          'This request has remained in Document Verification for 10 hours compared with a historical average of 6 hours.',
        weight: 35,
      },
      {
        title: 'High Historical Delay Rate',
        detail:
          'The Document Verification stage has a 35% historical delay rate, indicating frequent bottlenecks at this step.',
        weight: 25,
      },
      {
        title: 'Limited SLA Time Remaining',
        detail: 'Only 5 hours remain before the SLA deadline, leaving little room for further delays.',
        weight: 25,
      },
      {
        title: 'Severely Exceeding Average',
        detail: 'Current duration is 167% of the historical average — a strong breach predictor.',
        weight: 15,
      },
    ],
    citizenName: 'James Anderson',
    assignedTo: 'Alex Morgan',
  };

  return requests;
}

export const ALL_REQUESTS = generateRequests(1000);

export function getMockDashboardStats(): DashboardStats {
  const total = ALL_REQUESTS.length;
  let onTrack = 0,
    atRisk = 0,
    critical = 0,
    breached = 0,
    scoreSum = 0;

  for (const r of ALL_REQUESTS) {
    scoreSum += r.riskScore;
    if (r.status === 'ON_TRACK') onTrack++;
    else if (r.status === 'AT_RISK') atRisk++;
    else if (r.status === 'CRITICAL') critical++;
    else if (r.status === 'BREACHED') breached++;
  }

  return {
    totalRequests: total,
    onTrack,
    atRisk,
    critical,
    breached,
    slaCompliance: Math.round(((total - breached) / total) * 1000) / 10,
    avgRiskScore: Math.round(scoreSum / total),
    pendingReview: ALL_REQUESTS.filter((r) => r.assignedTo === null).length,
  };
}

export function getMockRiskDistribution(): RiskDistributionItem[] {
  const counts: Record<RiskLevel, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
    BREACHED: 0,
  };
  for (const r of ALL_REQUESTS) counts[r.riskLevel]++;

  return (Object.keys(counts) as RiskLevel[]).map((level) => ({
    level,
    count: counts[level],
    color: RISK_COLORS[level],
  }));
}

export function getMockDepartmentAnalytics(): DepartmentAnalytics[] {
  return DEPARTMENTS.map((dept) => {
    const deptReqs = ALL_REQUESTS.filter((r) => r.department === dept);
    const count = deptReqs.length;
    const avgRisk = Math.round(deptReqs.reduce((s, r) => s + r.riskScore, 0) / count);
    const delayed = deptReqs.filter(
      (r) => r.currentStageDurationHours > r.historicalAverageHours,
    ).length;
    const delayRate = Math.round((delayed / count) * 100);
    const breached = deptReqs.filter((r) => r.status === 'BREACHED').length;
    const slaCompliance = Math.round(((count - breached) / count) * 1000) / 10;

    return {
      department: dept,
      requestCount: count,
      averageRisk: avgRisk,
      delayRate,
      slaCompliance,
    };
  });
}

export function getMockBottlenecks(): Bottleneck[] {
  return STAGES.map((stage) => {
    const stageReqs = ALL_REQUESTS.filter((r) => r.currentStage === stage);
    const affected = stageReqs.filter((r) => r.bottleneck === stage).length;
    return {
      stage,
      delayRate: STAGE_DELAY_RATES[stage] || 15,
      affectedRequests: affected,
      avgProcessingTime: STAGE_AVG_HOURS[stage] || 6,
    };
  }).sort((a, b) => b.affectedRequests - a.affectedRequests);
}

export function getMockUrgentRequests(limit = 10): ServiceRequest[] {
  return [...ALL_REQUESTS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
}

export function getMockRiskTrends() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    low: 400 + i * 20 - Math.floor(i / 2) * 15,
    medium: 250 + i * 15,
    high: 120 + i * 10,
    critical: 60 + i * 5,
    breached: 20 + i * 3,
  }));
}

export function getMockSlaComplianceTrend() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    onTrack: 500 - i * 10,
    atRisk: 200 + i * 8,
    critical: 80 + i * 5,
    breached: 15 + i * 2,
    compliance: 94 - i * 0.5,
  }));
}

export function mockLogin(email: string): AuthResponse {
  return {
    token: 'mock-jwt-token-' + btoa(email).slice(0, 20),
    user: {
      id: 'u-001',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'Administrator',
      organization: 'City Government',
    },
  };
}

export function mockRegister(name: string, email: string): { success: boolean } {
  return { success: true };
}

export function mockUploadResult(file: File): UploadResult {
  const totalRows = 150;
  const invalidRows = 8;
  const errors = Array.from({ length: invalidRows }, (_, i) => ({
    row: 5 + i * 12,
    field: pick(['department', 'requestDate', 'serviceType', 'priority'], seededRandom(i + 1)),
    message: pick(
      [
        'Department is required',
        'Invalid date format',
        'Unknown service type',
        'Priority must be LOW, MEDIUM, HIGH, or URGENT',
        'Missing request ID',
      ],
      seededRandom(i + 2),
    ),
  }));

  return {
    totalRows,
    validRows: totalRows - invalidRows,
    invalidRows,
    errors,
  };
}
