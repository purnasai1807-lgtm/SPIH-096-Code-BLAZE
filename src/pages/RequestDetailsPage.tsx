import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileText,
  Clock,
  Calendar,
  User,
  GitBranch,
  Zap,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Shield,
  CheckCircle,
  CircleAlert,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RiskMeter } from '@/components/ui/RiskMeter';
import { LoadingSkeleton, CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState, EmptyState } from '@/components/ui/States';
import { getRequestById } from '@/api/requests';
import { STATUS_LABELS } from '@/constants/filters';
import type { RecommendationAction } from '@/types';

const actionConfig: Record<RecommendationAction, { color: string; bg: string; icon: typeof Zap }> = {
  MONITOR: { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
  ASSIGN: { color: 'text-amber-600', bg: 'bg-amber-50', icon: User },
  ESCALATE: { color: 'text-red-600', bg: 'bg-red-50', icon: Zap },
  REASSIGN: { color: 'text-orange-600', bg: 'bg-orange-50', icon: User },
  EXPEDITE: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Zap },
};

export function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading, isError, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequestById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 w-48 skeleton rounded" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <CardSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState
          title="Request not found"
          message={`We couldn't find request ${id}. It may have been removed or the ID is invalid.`}
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout>
        <EmptyState title="No request selected" message="Go back to the requests list to select a request." />
      </DashboardLayout>
    );
  }

  const action = actionConfig[request.recommendation.action];
  const ActionIcon = action.icon;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/requests')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Requests
          </Button>
          <Link to="/requests">
            <Button variant="outline" size="sm">All Requests</Button>
          </Link>
        </div>

        {/* Hero Request Banner */}
        <div className={`rounded-2xl border-2 p-6 ${
          request.riskLevel === 'CRITICAL' ? 'border-red-200 bg-red-50' :
          request.riskLevel === 'HIGH' ? 'border-orange-200 bg-orange-50' :
          request.riskLevel === 'BREACHED' ? 'border-red-900 bg-red-950' :
          'border-slate-200 bg-white'
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl font-bold ${request.riskLevel === 'BREACHED' ? 'text-red-100' : 'text-slate-900'}`}>
                  {request.id}
                </h1>
                <RiskBadge level={request.riskLevel} />
              </div>
              <p className={`text-sm ${request.riskLevel === 'BREACHED' ? 'text-red-200' : 'text-slate-600'}`}>
                {request.department} · {request.serviceType} · {request.currentStage}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <RiskMeter score={request.riskScore} level={request.riskLevel} size="md" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Information */}
            <SectionCard title="Request Information" icon={<FileText className="w-5 h-5" />}>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Request ID" value={request.id} />
                <InfoRow label="Department" value={request.department} />
                <InfoRow label="Service Type" value={request.serviceType} />
                <InfoRow label="Current Stage" value={request.currentStage} />
                <InfoRow label="Priority" value={request.priority} />
                <InfoRow label="Status" value={STATUS_LABELS[request.status] || request.status} />
                <InfoRow label="Request Date" value={new Date(request.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                <InfoRow label="Citizen" value={request.citizenName} />
              </div>
            </SectionCard>

            {/* SLA Section */}
            <SectionCard title="SLA" icon={<Clock className="w-5 h-5" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InfoRow label="Deadline" value={new Date(request.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                  <InfoRow label="Time Remaining" value={`${request.slaRemainingHours}h`} />
                  <InfoRow label="SLA Consumed" value={`${request.slaConsumedPercent}%`} />
                  <InfoRow label="SLA Status" value={STATUS_LABELS[request.status] || request.status} />
                </div>
                {/* SLA Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>SLA Progress</span>
                    <span>{request.slaConsumedPercent}% consumed</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        request.slaConsumedPercent >= 90 ? 'bg-red-500' :
                        request.slaConsumedPercent >= 75 ? 'bg-orange-500' :
                        request.slaConsumedPercent >= 50 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${request.slaConsumedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Prediction Section */}
            <SectionCard title="Prediction" icon={<TrendingUp className="w-5 h-5" />}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <RiskMeter score={request.riskScore} level={request.riskLevel} size="lg" />
                <div className="flex-1 space-y-3 w-full">
                  <InfoRow label="Risk Score" value={`${request.riskScore}%`} />
                  <InfoRow label="Risk Level" value={request.riskLevel} />
                  <InfoRow label="Current Stage Duration" value={`${request.currentStageDurationHours} hours`} />
                  <InfoRow label="Historical Average" value={`${request.historicalAverageHours} hours`} />
                  <InfoRow label="Historical Delay Rate" value={`${request.historicalDelayRate}%`} />
                </div>
              </div>
            </SectionCard>

            {/* WHY? Section */}
            <SectionCard title="Why is this at risk?" icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-3">
                {request.riskFactors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {factor.weight}%
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{factor.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{factor.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right column: 1/3 width */}
          <div className="space-y-6">
            {/* Bottleneck Card */}
            <SectionCard title="Bottleneck" icon={<GitBranch className="w-5 h-5" />}>
              {request.bottleneck ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <GitBranch className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{request.bottleneck}</p>
                      <p className="text-xs text-slate-500">Identified bottleneck stage</p>
                    </div>
                  </div>
                  <InfoRow label="Stage" value={request.bottleneck} />
                  <InfoRow label="Delay Rate" value={`${request.historicalDelayRate}%`} />
                  <InfoRow label="Affected Requests" value="142" />
                </div>
              ) : (
                <p className="text-sm text-slate-500">No bottleneck detected for this request.</p>
              )}
            </SectionCard>

            {/* Recommended Action */}
            <SectionCard title="Recommended Action" icon={<Lightbulb className="w-5 h-5" />}>
              <div className={`p-4 rounded-xl ${action.bg} border border-slate-200`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${action.bg} ${action.color} flex items-center justify-center`}>
                    <ActionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Action</p>
                    <p className={`text-lg font-bold ${action.color}`}>{request.recommendation.action}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">Reason</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{request.recommendation.reason}</p>
                </div>
              </div>
              <Button
                variant={request.recommendation.action === 'ESCALATE' ? 'danger' : 'primary'}
                className="w-full mt-4"
                icon={<Zap className="w-4 h-4" />}
              >
                {request.recommendation.action === 'ESCALATE' ? 'Escalate Now' : 'Apply Recommendation'}
              </Button>
            </SectionCard>

            {/* Quick Summary */}
            <SectionCard title="Summary" icon={<Shield className="w-5 h-5" />}>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned to</span>
                  <span className="font-medium text-slate-900">{request.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SLA Total</span>
                  <span className="font-medium text-slate-900">{request.slaTotalHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SLA Remaining</span>
                  <span className={`font-bold ${request.slaRemainingHours <= 6 ? 'text-red-600' : 'text-slate-900'}`}>
                    {request.slaRemainingHours}h
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
        <div className="text-brand-600">{icon}</div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
