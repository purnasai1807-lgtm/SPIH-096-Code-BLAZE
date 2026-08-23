interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className = '', lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-lg skeleton" />
        <div className="w-12 h-5 rounded skeleton" />
      </div>
      <div className="h-7 w-20 skeleton rounded mb-2" />
      <div className="h-4 w-32 skeleton rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4 pb-3 border-b border-slate-200" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 skeleton rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 skeleton rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-full max-w-xs">
        <div className="h-48 w-48 mx-auto skeleton rounded-full" />
        <div className="flex justify-center gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-12 skeleton rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
