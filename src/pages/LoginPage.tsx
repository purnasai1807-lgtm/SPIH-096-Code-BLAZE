import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const { login, loginDemo, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login(email, password);
      navigate(from);
    } catch {
      // error is set in context
    }
  };

  const handleDemo = async () => {
    clearError();
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch {
      // handled in context
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">DelayGuard</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Predict SLA Breaches Before They Happen
            </h2>
            <p className="mt-4 text-lg text-brand-100 max-w-md">
              AI-powered SLA breach prediction and prevention for government offices and large organizations.
            </p>
            <div className="mt-8 space-y-3">
              {['Real-time risk prediction', 'Bottleneck detection', 'Actionable recommendations'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-brand-100">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-brand-200">© {new Date().getFullYear()} DelayGuard</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DelayGuard</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your DelayGuard account</p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@organization.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={validationErrors.email}
                icon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={validationErrors.password}
                  icon={<Lock className="w-4 h-4" />}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isLoading} icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}>
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400">or</span>
                </div>
              </div>

              <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleDemo} loading={isLoading}>
                Continue to Demo
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-slate-600">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
