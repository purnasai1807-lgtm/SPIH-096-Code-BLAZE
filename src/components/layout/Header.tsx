import { Menu, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-semibold text-slate-900">DelayGuard</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">AI-Powered SLA Breach Prediction & Prevention</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI Prediction Active
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.organization || 'City Government'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
