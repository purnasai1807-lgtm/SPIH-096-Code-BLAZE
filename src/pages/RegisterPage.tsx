import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: ValidationErrors = {};
    if (!name) errors.name = 'Name is required';
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters';
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      // error is set in context
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account created!</h1>
          <p className="text-sm text-slate-500 mt-2">
            Your DelayGuard account has been created successfully. Redirecting you to login...
          </p>
          <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full animate-pulse-soft" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">DelayGuard</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Start preventing SLA breaches today
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-md">
              Join organizations using DelayGuard to predict, explain, and prevent service request delays.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'No setup required — demo data included',
                'AI-powered risk predictions with explanations',
                'Real-time bottleneck detection across departments',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-brand-600/20 flex items-center justify-center text-xs text-brand-400">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} DelayGuard</p>
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
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Get started with DelayGuard in minutes</p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Anderson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={validationErrors.name}
                icon={<User className="w-4 h-4" />}
                autoComplete="name"
              />
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={validationErrors.password}
                  icon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
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
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={validationErrors.confirmPassword}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
              />

              <Button type="submit" size="lg" className="w-full" loading={isLoading} icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Sign in
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
