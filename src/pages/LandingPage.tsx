import { Link } from 'react-router-dom';
import {
  Shield,
  Brain,
  GitBranch,
  Lightbulb,
  ListOrdered,
  Activity,
  ArrowRight,
  Check,
  Menu,
  X,
  TrendingDown,
  Eye,
  Zap,
  Target,
  FileSearch,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatCard } from '@/components/ui/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const riskData = [
  { name: 'LOW', value: 420, color: '#10b981' },
  { name: 'MEDIUM', value: 280, color: '#f59e0b' },
  { name: 'HIGH', value: 150, color: '#f97316' },
  { name: 'CRITICAL', value: 90, color: '#ef4444' },
  { name: 'BREACHED', value: 60, color: '#7c2d12' },
];

const deptData = [
  { name: 'Revenue', risk: 72 },
  { name: 'Transport', risk: 58 },
  { name: 'Municipal', risk: 45 },
  { name: 'Health', risk: 38 },
  { name: 'Licensing', risk: 31 },
];

const features = [
  {
    icon: Brain,
    title: 'SLA Risk Prediction',
    description: 'AI-powered models predict which requests are likely to breach SLA before it happens.',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    icon: Eye,
    title: 'Explainable Predictions',
    description: 'Every risk score comes with a clear, human-readable explanation of contributing factors.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: GitBranch,
    title: 'Bottleneck Detection',
    description: 'Automatically identifies which processing stages cause the most delays across departments.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Lightbulb,
    title: 'Recommended Actions',
    description: 'Get specific, actionable recommendations: escalate, expedite, reassign, or monitor.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: ListOrdered,
    title: 'Priority Ranking',
    description: 'Requests automatically ranked by breach risk so teams focus on what matters most.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: Activity,
    title: 'Real-Time Analytics',
    description: 'Live dashboards track SLA compliance, risk trends, and department performance.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
];

const steps = [
  {
    icon: FileSearch,
    title: 'Connect & Upload',
    description: 'Upload service request data via CSV or connect your existing system. DelayGuard ingests and normalizes it instantly.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our prediction engine analyzes each request against historical patterns, stage durations, and delay rates.',
  },
  {
    icon: Eye,
    title: 'Risk Prediction',
    description: 'Every request gets a risk score, risk level, and a plain-language explanation of why it is at risk.',
  },
  {
    icon: GitBranch,
    title: 'Bottleneck Detection',
    description: 'DelayGuard pinpoints the exact stages causing delays and quantifies their impact on SLA compliance.',
  },
  {
    icon: Zap,
    title: 'Take Action',
    description: 'Follow recommended actions to prevent breaches before they happen — escalate, expedite, or reassign.',
  },
];

const problemSteps = [
  { label: 'Thousands of requests', icon: FileSearch },
  { label: 'Manual monitoring', icon: Eye },
  { label: 'Hidden delays', icon: Clock },
  { label: 'SLA breach', icon: TrendingDown },
];

const solutionSteps = [
  { label: 'Analyze', icon: FileSearch },
  { label: 'Predict', icon: Brain },
  { label: 'Explain', icon: Eye },
  { label: 'Detect Bottleneck', icon: GitBranch },
  { label: 'Recommend Action', icon: Lightbulb },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">DelayGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#analytics" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Analytics</a>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 px-4 py-3 space-y-2 bg-white">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">How It Works</a>
            <a href="#analytics" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Analytics</a>
            <Link to="/login" className="block text-sm font-medium text-slate-600 py-2">Login</Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                AI-Powered SLA Breach Prevention
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Predict SLA Breaches{' '}
                <span className="text-brand-600">Before They Happen</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                AI-powered SLA breach prediction and prevention for government offices and large organizations. DelayGuard doesn't just tell you which requests are delayed — it predicts which will breach, explains why, and recommends what to do.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  No setup required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Demo data included
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="animate-scale-in">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">The Problem</h2>
            <p className="mt-3 text-slate-600 text-lg">Today, SLA breaches are detected after it's too late.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            {problemSteps.map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-red-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 text-center max-w-[120px]">{step.label}</p>
                </div>
                {i < problemSteps.length - 1 && (
                  <div className="text-slate-300 text-2xl">↓</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-slate-500 max-w-2xl mx-auto">
            Organizations process thousands of service requests with manual monitoring. Delays go unnoticed until the SLA deadline has already been breached.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">The DelayGuard Solution</h2>
            <p className="mt-3 text-slate-600 text-lg">Predict, explain, and prevent — before the breach.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {solutionSteps.map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 text-center max-w-[120px]">{step.label}</p>
                </div>
                {i < solutionSteps.length - 1 && (
                  <div className="text-brand-300 text-2xl">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Key Features</h2>
            <p className="mt-3 text-slate-600 text-lg">Everything you need to prevent SLA breaches</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-3 text-slate-600 text-lg">From data upload to breach prevention in five steps</p>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="analytics" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Dashboard Preview</h2>
            <p className="mt-3 text-slate-600 text-lg">Real-time visibility into your SLA compliance</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<FileSearch className="w-5 h-5" />} label="Total Requests" value="1,000" iconColor="text-brand-600" iconBg="bg-brand-50" />
            <StatCard icon={<TrendingDown className="w-5 h-5" />} label="At Risk" value="280" iconColor="text-amber-600" iconBg="bg-amber-50" accent="warning" />
            <StatCard icon={<Target className="w-5 h-5" />} label="Critical" value="90" iconColor="text-red-600" iconBg="bg-red-50" accent="danger" />
            <StatCard icon={<Activity className="w-5 h-5" />} label="SLA Compliance" value="94%" iconColor="text-emerald-600" iconBg="bg-emerald-50" accent="success" />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {riskData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Department Risk</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptData} margin={{ left: -10, right: 10, top: 10 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                  />
                  <Bar dataKey="risk" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-brand-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Shield className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Prevent SLA breaches before they happen.
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Join organizations using DelayGuard to stay ahead of SLA deadlines.
          </p>
          <Link to="/register" className="inline-block mt-8">
            <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
              Launch DelayGuard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-base font-bold text-white">DelayGuard</span>
              </div>
              <p className="text-sm">AI-powered SLA breach prediction and prevention platform.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#analytics" className="hover:text-white transition-colors">Analytics</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-center">
            © {new Date().getFullYear()} DelayGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  const urgentReq = {
    id: 'REQ-1042',
    department: 'Revenue',
    stage: 'Document Verification',
    riskScore: 86,
    riskLevel: 'CRITICAL' as const,
    slaRemaining: '5h',
  };

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-brand-200/40 to-emerald-200/30 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 text-center text-xs text-slate-500 font-medium">DelayGuard Dashboard</div>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">1,000</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-red-600">Critical</p>
              <p className="text-xl font-bold text-red-700">90</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-emerald-600">Compliance</p>
              <p className="text-xl font-bold text-emerald-700">94%</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{urgentReq.id}</p>
                <p className="text-xs text-slate-500">{urgentReq.department} · {urgentReq.stage}</p>
              </div>
              <RiskBadge level={urgentReq.riskLevel} />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '86%' }} />
              </div>
              <span className="text-sm font-bold text-red-600">{urgentReq.riskScore}%</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">SLA remaining: {urgentReq.slaRemaining} · Action: ESCALATE</p>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="risk" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
