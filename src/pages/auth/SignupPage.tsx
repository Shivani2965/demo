import React, { useState } from 'react';
import { DemoStore } from '../../services/demoStore';
import { User } from '../../types';
import {
  Zap,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

interface SignupPageProps {
  onSignupSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Information Technology');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const departments = [
    'Information Technology',
    'Computer Engineering',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Academic Affairs & Faculty',
    'Administrative Staff',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work or academic email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Please accept the campus IT acceptable use policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const newUser = DemoStore.registerUser(name, email, department);
        setIsLoading(false);
        setSuccessNotice(true);
        setTimeout(() => {
          onSignupSuccess(newUser);
        }, 1000);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Registration failed.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FFFAED] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-[#F8D2E8] text-[#171717] flex items-center justify-center mx-auto shadow-xs mb-3">
          <Zap className="w-7 h-7 fill-[#171717]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
          Create Employee Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#77736D]">
          Join PowerGrid Copilot for verified IT service desk remediation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-sm p-6 sm:p-8 space-y-5">
          <div className="p-3.5 rounded-2xl bg-[#F7F2E4] border border-[#EDE6D6] text-xs text-[#171717]">
            <span className="font-bold">Role Policy:</span> All public registrations default securely to <span className="font-bold">Employee</span> privileges.
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-[#F8D2E8]/40 border border-[#F8D2E8] text-[#68194B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-[#DDECCB] border border-[#CDE0B7] text-[#2D4E14] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#4B7926]" />
              <span>Account created! Opening PowerGrid Copilot...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[#171717] mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shivani Devanekar"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.mgm.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#171717] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#77736D]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77736D] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl text-[#171717] font-mono focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start text-xs text-[#77736D] cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#EDE6D6] text-[#171717] focus:ring-0"
              />
              <span className="ml-2">I accept the Campus IT Resource Acceptable Use Policy.</span>
            </label>

            <button
              type="submit"
              disabled={isLoading || successNotice}
              className="w-full py-3 px-4 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[#EDE6D6] text-center">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs font-semibold text-[#171717] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
