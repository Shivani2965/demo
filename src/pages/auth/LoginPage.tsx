import React, { useState } from 'react';
import { DEMO_ACCOUNTS, DemoStore } from '../../services/demoStore';
import { User } from '../../types';
import {
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Wrench,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
}) => {
  const [email, setEmail] = useState('employee@helpdesk.demo');
  const [password, setPassword] = useState('Employee@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<'employee' | 'engineer' | 'admin'>('employee');

  const handleFillDemo = (role: 'employee' | 'engineer' | 'admin') => {
    setSelectedDemoRole(role);
    const acc = DEMO_ACCOUNTS.find((a) => a.user.role === role);
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = DemoStore.authenticate(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#FFFAED] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Brand Header matching Section 2 & 3 */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-[#F8D2E8] text-[#171717] flex items-center justify-center mx-auto shadow-xs mb-3">
          <Zap className="w-7 h-7 fill-[#171717]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
          PowerGrid Copilot
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#77736D]">
          Autonomous IT Troubleshooting & Engineering Support
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-sm p-6 sm:p-8 space-y-6">
          {/* Quick 1-Click Role Accounts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                Select Demo Role
              </span>
              <span className="text-[11px] text-[#171717] font-semibold bg-[#F3EEDF] px-2.5 py-0.5 rounded-full">
                1-Click Quick Fill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                const Icon =
                  acc.user.role === 'admin'
                    ? ShieldCheck
                    : acc.user.role === 'engineer'
                    ? Wrench
                    : UserCheck;

                return (
                  <button
                    key={acc.user.role}
                    type="button"
                    onClick={() => handleFillDemo(acc.user.role)}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all text-xs ${
                      isSelected
                        ? 'border-[#171717] bg-[#F7F2E4] text-[#171717] shadow-xs'
                        : 'border-[#EDE6D6] bg-white text-[#77736D] hover:bg-[#FFFAED]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className="w-4 h-4 text-[#171717]" />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />}
                    </div>
                    <span className="font-bold capitalize text-[#171717]">
                      {acc.user.role === 'admin'
                        ? 'Admin'
                        : acc.user.role === 'engineer'
                        ? 'IT Engineer'
                        : 'Employee'}
                    </span>
                    <span className="text-[10px] text-[#77736D] mt-0.5 truncate">
                      {acc.user.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-[#F8D2E8]/40 border border-[#F8D2E8] text-[#68194B] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#68194B]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#171717] mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-xs sm:text-sm text-[#171717] placeholder-[#77736D] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  placeholder="name@helpdesk.demo"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-[#171717]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                  className="text-xs text-[#77736D] hover:text-[#171717]"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-xs sm:text-sm text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#77736D] hover:text-[#171717]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {forgotPasswordNotice && (
              <div className="p-3.5 rounded-2xl bg-[#F3EEDF] border border-[#EDE6D6] text-xs text-[#171717]">
                Demo Notice: Use the predefined credentials above (e.g. <code>Employee@123</code>, <code>Engineer@123</code>, or <code>Admin@123</code>).
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#77736D]">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#EDE6D6] text-[#171717] focus:ring-0"
                />
                <span className="ml-2">Remember session</span>
              </label>

              <span>
                Target Portal:{' '}
                <span className="font-bold text-[#171717] capitalize">{selectedDemoRole}</span>
              </span>
            </div>

            {/* Black Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {selectedDemoRole}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <div className="pt-4 border-t border-[#EDE6D6] text-center text-xs text-[#77736D]">
            New employee?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-bold text-[#171717] underline ml-1"
            >
              Register Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
