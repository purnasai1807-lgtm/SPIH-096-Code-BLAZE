import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Database,
  Upload,
  X,
  GitBranch,
  Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState, EmptyState } from '@/components/ui/States';
import { useToast } from '@/components/Toast';
import { getRequests, loadDemoData } from '@/api/requests';
import {
  DEPARTMENTS,
  SERVICE_TYPES,
  RISK_LEVELS,
  PRIORITIES,
  STATUSES,
  STAGES,
  STATUS_LABELS,
} from '@/constants/filters';
import type { RequestFilters, ServiceRequest } from '@/types';

const defaultFilters: RequestFilters = {
  search: '',
  department: 'all',
  serviceType: 'all',
  riskLevel: 'all',
  currentStage: 'all',
  priority: 'all',
  status: 'all',
  dateFrom: '',
  dateTo: '',
  page: 1,
  pageSize: 20,
  sortBy: 'riskScore',
  sortDir: 'desc',
};

export function RequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [filters, setFilters] = useState<RequestFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['requests', { ...filters, search: debouncedSearch }],
    queryFn: () => getRequests({ ...filters, search: debouncedSearch }),
  });

  const demoMutation = useMutation({
    mutationFn: loadDemoData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      showToast('Demo data loaded successfully.', 'success');
    },
    onError: () => showToast('Failed to load demo data.', 'error'),
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== 'all') count++;
    if (filters.serviceType !== 'all') count++;
    if (filters.riskLevel !== 'all') count++;
    if (filters.currentStage !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  const updateFilter = (key: keyof RequestFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleSort = (col: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: col,
      sortDir: prev.sortBy === col && prev.sortDir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const clearFilters = () => {
    setFilters({ ...defaultFilters, search: filters.search });
  };

  const columns = [
    { key: 'id', label: 'Request ID', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'serviceType', label: 'Service Type', sortable: false },
    { key: 'currentStage', label: 'Stage', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'slaRemainingHours', label: 'SLA Remaining', sortable: true },
    { key: 'riskScore', label: 'Risk Score', sortable: true },
    { key: 'riskLevel', label: 'Risk Level', sortable: true },
    { key: 'bottleneck', label: 'Bottleneck', sortable: false },
  ];

  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sortBy !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return filters.sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-brand-600" /> : <ArrowDown className="w-3.5 h-3.5 text-brand-600" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor and manage all service requests with AI-powered risk predictions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => demoMutation.mutate()}
              loading={demoMutation.isPending}
              icon={!demoMutation.isPending ? <Database className="w-4 h-4" /> : undefined}
            >
              Load Demo Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/upload')}
              icon={<Upload className="w-4 h-4" />}
            >
              Upload CSV
            </Button>
          </div>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Request ID..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-100 text-brand-700 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} icon={<X className="w-4 h-4" />}>
              Clear
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <FilterSelect
                label="Department"
                value={filters.department}
                onChange={(v) => updateFilter('department', v)}
                options={DEPARTMENTS}
              />
              <FilterSelect
                label="Service Type"
                value={filters.serviceType}
                onChange={(v) => updateFilter('serviceType', v)}
                options={SERVICE_TYPES}
              />
              <FilterSelect
                label="Risk Level"
                value={filters.riskLevel}
                onChange={(v) => updateFilter('riskLevel', v)}
                options={RISK_LEVELS}
              />
              <FilterSelect
                label="Current Stage"
                value={filters.currentStage}
                onChange={(v) => updateFilter('currentStage', v)}
                options={STAGES}
              />
              <FilterSelect
                label="Priority"
                value={filters.priority}
                onChange={(v) => updateFilter('priority', v)}
                options={PRIORITIES}
              />
              <FilterSelect
                label="Status"
                value={filters.status}
                onChange={(v) => updateFilter('status', v)}
                options={STATUSES}
                labelMap={STATUS_LABELS}
              />
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-5">
              <TableSkeleton rows={10} cols={columns.length + 1} />
            </div>
          ) : isError ? (
            <ErrorState
              title="Failed to load requests"
              message="We couldn't load the service requests. Please try again."
              onRetry={() => refetch()}
            />
          ) : data && data.items.length === 0 ? (
            <EmptyState
              title="No requests found"
              message={activeFilterCount > 0 ? 'Try adjusting your filters or search query.' : 'Load demo data to see requests here.'}
              icon={<Search className="w-7 h-7" />}
              action={
                activeFilterCount > 0 ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
                ) : (
                  <Button size="sm" onClick={() => demoMutation.mutate()} loading={demoMutation.isPending} icon={<Database className="w-4 h-4" />}>
                    Load Demo Data
                  </Button>
                )
              }
            />
          ) : data ? (
            <>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className={`py-3 px-4 font-semibold ${col.sortable ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                          onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                        >
                          <div className="flex items-center gap-1.5">
                            {col.label}
                            {col.sortable && <SortIcon col={col.key} />}
                          </div>
                        </th>
                      ))}
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((req: ServiceRequest) => (
                      <tr
                        key={req.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/requests/${req.id}`)}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{req.id}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{req.department}</td>
                        <td className="py-3 px-4 text-slate-600 max-w-[160px] truncate">{req.serviceType}</td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{req.currentStage}</td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={req.priority} />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`flex items-center gap-1 text-xs font-medium ${req.slaRemainingHours <= 6 ? 'text-red-600' : req.slaRemainingHours <= 12 ? 'text-amber-600' : 'text-slate-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {req.slaRemainingHours}h
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold tabular-nums ${req.riskScore >= 80 ? 'text-red-600' : req.riskScore >= 60 ? 'text-orange-600' : req.riskScore >= 35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {req.riskScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge level={req.riskLevel} />
                        </td>
                        <td className="py-3 px-4">
                          {req.bottleneck ? (
                            <span className="flex items-center gap-1 text-xs text-orange-600">
                              <GitBranch className="w-3.5 h-3.5" />
                              {req.bottleneck}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/requests/${req.id}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            aria-label={`View details for ${req.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                total={data.pagination.total}
                pageSize={data.pagination.pageSize}
                onPageChange={(p) => updateFilter('page', p)}
                onPageSizeChange={(s) => updateFilter('pageSize', s)}
              />
            </>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labelMap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      >
        <option value="all">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelMap?.[opt] || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-blue-50 text-blue-600',
    HIGH: 'bg-orange-50 text-orange-600',
    URGENT: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${colors[priority] || 'bg-slate-100 text-slate-600'}`}>
      {priority}
    </span>
  );
}
