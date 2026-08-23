import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Activity, TrendingUp, GitBranch, Building2, Gauge } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/ui/ChartCard';
import { StatCard } from '@/components/ui/StatCard';
import { CardSkeleton, ChartSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/States';
import {
  getAnalyticsRiskDistribution,
  getAnalyticsDepartmentAnalytics,
  getAnalyticsBottlenecks,
  getRiskTrends,
  getSlaComplianceTrend,
} from '@/api/analytics';

const riskColors: Record<string, string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
  BREACHED: '#7c2d12',
};

export function AnalyticsPage() {
  const { data: riskDist, isLoading: riskLoading, isError: riskError, refetch: refetchRisk } = useQuery({
    queryKey: ['analytics-risk-distribution'],
    queryFn: getAnalyticsRiskDistribution,
  });

  const { data: deptAnalytics, isLoading: deptLoading, isError: deptError, refetch: refetchDept } = useQuery({
    queryKey: ['analytics-departments'],
    queryFn: getAnalyticsDepartmentAnalytics,
  });

  const { data: bottlenecks, isLoading: bnLoading, isError: bnError, refetch: refetchBn } = useQuery({
    queryKey: ['analytics-bottlenecks'],
    queryFn: getAnalyticsBottlenecks,
  });

  const { data: riskTrends, isLoading: trendsLoading, isError: trendsError, refetch: refetchTrends } = useQuery({
    queryKey: ['analytics-risk-trends'],
    queryFn: getRiskTrends,
  });

  const { data: slaTrend, isLoading: slaLoading, isError: slaError, refetch: refetchSla } = useQuery({
    queryKey: ['analytics-sla-trend'],
    queryFn: getSlaComplianceTrend,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Deep insights into SLA compliance, risk trends, and department performance.
          </p>
        </div>

        {/* SLA Compliance Overview Cards */}
        {slaLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : slaTrend ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              label="On Track"
              value={(slaTrend as Array<{ onTrack: number }>)[0]?.onTrack || 0}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
              accent="success"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="At Risk"
              value={(slaTrend as Array<{ atRisk: number }>)[0]?.atRisk || 0}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              accent="warning"
            />
            <StatCard
              icon={<Gauge className="w-5 h-5" />}
              label="Critical"
              value={(slaTrend as Array<{ critical: number }>)[0]?.critical || 0}
              iconColor="text-red-600"
              iconBg="bg-red-50"
              accent="danger"
            />
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              label="Breached"
              value={(slaTrend as Array<{ breached: number }>)[0]?.breached || 0}
              iconColor="text-red-900"
              iconBg="bg-red-100"
              accent="danger"
            />
          </div>
        ) : null}

        {/* SLA Compliance Trend Chart */}
        <ChartCard title="SLA Compliance Trend" subtitle="Weekly SLA compliance over time">
          {slaLoading ? (
            <ChartSkeleton />
          ) : slaError ? (
            <ErrorState message="Failed to load SLA compliance trend" onRetry={() => refetchSla()} />
          ) : slaTrend ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={slaTrend as Array<Record<string, number | string>>} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                <Area
                  type="monotone"
                  dataKey="compliance"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#complianceGrad)"
                  name="SLA Compliance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </ChartCard>

        {/* Risk Trends */}
        <ChartCard title="Risk Trends" subtitle="Request volume by risk level over the past week">
          {trendsLoading ? (
            <ChartSkeleton />
          ) : trendsError ? (
            <ErrorState message="Failed to load risk trends" onRetry={() => refetchTrends()} />
          ) : riskTrends ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrends as Array<Record<string, number | string>>} margin={{ left: -10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} name="Low" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} name="Medium" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} name="High" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="breached" stroke="#7c2d12" strokeWidth={2} name="Breached" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : null}
        </ChartCard>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <ChartCard title="Risk Distribution" subtitle="Current distribution across all risk levels">
            {riskLoading ? (
              <ChartSkeleton />
            ) : riskError ? (
              <ErrorState message="Failed to load risk distribution" onRetry={() => refetchRisk()} />
            ) : riskDist ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDist}
                      dataKey="count"
                      nameKey="level"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {riskDist.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 w-full mt-3">
                  {riskDist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.level}</span>
                      <span className="text-slate-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </ChartCard>

          {/* Department Risk Comparison */}
          <ChartCard title="Department Risk Comparison" subtitle="Average risk score by department">
            {deptLoading ? (
              <ChartSkeleton />
            ) : deptError ? (
              <ErrorState message="Failed to load department data" onRetry={() => refetchDept()} />
            ) : deptAnalytics ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptAnalytics} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                  <Bar dataKey="averageRisk" fill="#2563eb" radius={[4, 4, 0, 0]} name="Avg Risk %" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </ChartCard>
        </div>

        {/* Department Analytics Table */}
        <ChartCard title="Department Analytics" subtitle="Comprehensive department performance breakdown">
          {deptLoading ? (
            <LoadingSkeleton lines={5} />
          ) : deptError ? (
            <ErrorState message="Failed to load department analytics" onRetry={() => refetchDept()} />
          ) : deptAnalytics ? (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500 uppercase tracking-wider">
                    <th className="py-3 pr-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold text-right">Requests</th>
                    <th className="py-3 px-4 font-semibold text-right">Avg Risk</th>
                    <th className="py-3 px-4 font-semibold text-right">Delay Rate</th>
                    <th className="py-3 px-4 font-semibold text-right">SLA Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {deptAnalytics.map((dept, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{dept.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{dept.requestCount}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold tabular-nums ${dept.averageRisk >= 60 ? 'text-red-600' : dept.averageRisk >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {dept.averageRisk}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{dept.delayRate}%</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${dept.slaCompliance >= 90 ? 'bg-emerald-500' : dept.slaCompliance >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${dept.slaCompliance}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700 tabular-nums w-12 text-right">{dept.slaCompliance}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </ChartCard>

        {/* Bottleneck Analytics */}
        <ChartCard title="Bottleneck Analytics" subtitle="Processing stages with highest delay rates">
          {bnLoading ? (
            <LoadingSkeleton lines={4} />
          ) : bnError ? (
            <ErrorState message="Failed to load bottleneck data" onRetry={() => refetchBn()} />
          ) : bottlenecks ? (
            <div className="space-y-3">
              {bottlenecks.map((bn, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{bn.stage}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-500">Avg processing: {bn.avgProcessingTime}h</span>
                      <span className="text-xs text-slate-500">{bn.affectedRequests} affected</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${bn.delayRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-orange-600 tabular-nums w-12 text-right">{bn.delayRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
