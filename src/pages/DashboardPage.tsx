import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  CircleAlert,
  OctagonAlert,
  Gauge,
  ArrowRight,
  GitBranch,
  Zap,
  Database,
  Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Button } from '@/components/ui/Button';
import { CardSkeleton, ChartSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/States';
import { useToast } from '@/components/Toast';
import {
  getDashboardStats,
  getRiskDistribution,
  getDepartmentAnalytics,
  getBottlenecks,
  getUrgentRequests,
} from '@/api/dashboard';
import { loadDemoData } from '@/api/requests';
import { STATUS_LABELS } from '@/constants/filters';
import type { ServiceRequest } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: riskDist, isLoading: riskLoading, isError: riskError, refetch: refetchRisk } = useQuery({
    queryKey: ['risk-distribution'],
    queryFn: getRiskDistribution,
  });

  const { data: deptAnalytics, isLoading: deptLoading, isError: deptError, refetch: refetchDept } = useQuery({
    queryKey: ['department-analytics'],
    queryFn: getDepartmentAnalytics,
  });

  const { data: bottlenecks, isLoading: bnLoading, isError: bnError, refetch: refetchBn } = useQuery({
    queryKey: ['bottlenecks'],
    queryFn: getBottlenecks,
  });

  const { data: urgentReqs, isLoading: urgentLoading, isError: urgentError, refetch: refetchUrgent } = useQuery({
    queryKey: ['urgent-requests'],
    queryFn: () => getUrgentRequests(10),
  });

  const demoMutation = useMutation({
    mutationFn: loadDemoData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['risk-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['department-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['bottlenecks'] });
      queryClient.invalidateQueries({ queryKey: ['urgent-requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      showToast('Demo data loaded successfully. 1,000 service requests are now available.', 'success');
    },
    onError: () => {
      showToast('Failed to load demo data. Please try again.', 'error');
    },
  });

  const slaGaugeData = stats
    ? [{ name: 'Compliance', value: stats.slaCompliance, fill: stats.slaCompliance >= 90 ? '#10b981' : stats.slaCompliance >= 75 ? '#f59e0b' : '#ef4444' }]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor SLA compliance, identify risks, and take action before breaches occur.
            </p>
          </div>
          <Button
            onClick={() => demoMutation.mutate()}
            loading={demoMutation.isPending}
            icon={!demoMutation.isPending ? <Database className="w-4 h-4" /> : undefined}
          >
            {demoMutation.isPending ? 'Loading demo data...' : 'Load Demo Data'}
          </Button>
        </div>

        {/* KPI Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : statsError ? (
          <ErrorState
            title="Failed to load dashboard"
            message="We couldn't load your dashboard statistics. Please try again."
            onRetry={() => refetchStats()}
          />
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Total Requests"
              value={stats.totalRequests.toLocaleString()}
              iconColor="text-brand-600"
              iconBg="bg-brand-50"
            />
            <StatCard
              icon={<CheckCircle className="w-5 h-5" />}
              label="On Track"
              value={stats.onTrack.toLocaleString()}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
              accent="success"
              change={Math.round((stats.onTrack / stats.totalRequests) * 100)}
              changeLabel="of total"
            />
            <StatCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="At Risk"
              value={stats.atRisk.toLocaleString()}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              accent="warning"
              change={Math.round((stats.atRisk / stats.totalRequests) * 100)}
              changeLabel="of total"
            />
            <StatCard
              icon={<CircleAlert className="w-5 h-5" />}
              label="Critical"
              value={stats.critical.toLocaleString()}
              iconColor="text-red-600"
              iconBg="bg-red-50"
              accent="danger"
              change={Math.round((stats.critical / stats.totalRequests) * 100)}
              changeLabel="of total"
            />
            <StatCard
              icon={<OctagonAlert className="w-5 h-5" />}
              label="Breached"
              value={stats.breached.toLocaleString()}
              iconColor="text-red-900"
              iconBg="bg-red-100"
              accent="danger"
              change={Math.round((stats.breached / stats.totalRequests) * 100)}
              changeLabel="of total"
            />
            <StatCard
              icon={<Gauge className="w-5 h-5" />}
              label="SLA Compliance"
              value={`${stats.slaCompliance}%`}
              iconColor="text-brand-600"
              iconBg="bg-brand-50"
            />
          </div>
        ) : null}

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Distribution Donut */}
          <ChartCard title="Risk Distribution" subtitle="Requests by risk level">
            {riskLoading ? (
              <ChartSkeleton />
            ) : riskError ? (
              <ErrorState message="Failed to load risk distribution" onRetry={() => refetchRisk()} />
            ) : riskDist ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={riskDist}
                      dataKey="count"
                      nameKey="level"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {riskDist.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full mt-2">
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

          {/* SLA Compliance Gauge */}
          <ChartCard title="SLA Compliance" subtitle="Overall compliance rate">
            {statsLoading ? (
              <ChartSkeleton />
            ) : stats ? (
              <div className="flex flex-col items-center justify-center h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="100%"
                    data={slaGaugeData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#f1f5f9' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="-mt-32 text-center pointer-events-none">
                  <p className="text-3xl font-bold text-slate-900">{stats.slaCompliance}%</p>
                  <p className="text-xs text-slate-500 mt-1">Compliant</p>
                </div>
                <div className="mt-20 flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">On Track: {stats.onTrack}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-slate-600">Breached: {stats.breached}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </ChartCard>

          {/* Department Performance Bar */}
          <ChartCard title="Department Risk" subtitle="Average risk by department">
            {deptLoading ? (
              <ChartSkeleton />
            ) : deptError ? (
              <ErrorState message="Failed to load department analytics" onRetry={() => refetchDept()} />
            ) : deptAnalytics ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptAnalytics} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <YAxis
                    type="number"
                    dataKey="department"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                    tickFormatter={(v: number) => {
                      const d = deptAnalytics.find((d) => d.requestCount === v || d.department === deptAnalytics[v]?.department);
                      return String(v);
                    }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  />
                  <Bar dataKey="averageRisk" fill="#059669" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </ChartCard>
        </div>

        {/* Department Performance Table */}
        <ChartCard title="Department Performance" subtitle="SLA compliance and delay rates by department">
          {deptLoading ? (
            <LoadingSkeleton lines={5} />
          ) : deptError ? (
            <ErrorState message="Failed to load department data" onRetry={() => refetchDept()} />
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
                      <td className="py-3 pr-4 font-medium text-slate-900">{dept.department}</td>
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

        {/* Bottlenecks + Urgent Requests */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bottlenecks */}
          <ChartCard title="Bottlenecks" subtitle="Stages causing the most delays">
            {bnLoading ? (
              <LoadingSkeleton lines={4} />
            ) : bnError ? (
              <ErrorState message="Failed to load bottlenecks" onRetry={() => refetchBn()} />
            ) : bottlenecks ? (
              <div className="space-y-3">
                {bottlenecks.slice(0, 5).map((bn, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{bn.stage}</p>
                      <p className="text-xs text-slate-500">{bn.affectedRequests} affected requests</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-orange-600 tabular-nums">{bn.delayRate}%</p>
                      <p className="text-xs text-slate-400">delay rate</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </ChartCard>

          {/* Urgent Requests */}
          <ChartCard
            title="Urgent Requests"
            subtitle="Top 10 by risk score — requires immediate action"
            action={
              <Link to="/requests">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  View all
                </Button>
              </Link>
            }
          >
            {urgentLoading ? (
              <LoadingSkeleton lines={5} />
            ) : urgentError ? (
              <ErrorState message="Failed to load urgent requests" onRetry={() => refetchUrgent()} />
            ) : urgentReqs ? (
              <div className="space-y-2">
                {urgentReqs.slice(0, 5).map((req: ServiceRequest) => (
                  <Link
                    key={req.id}
                    to={`/requests/${req.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{req.id}</p>
                        <RiskBadge level={req.riskLevel} />
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {req.department} · {req.currentStage}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-red-600 tabular-nums">{req.riskScore}%</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {req.slaRemainingHours}h left
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
