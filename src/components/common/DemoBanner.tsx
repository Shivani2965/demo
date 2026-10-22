import React, { useState } from 'react';
import { UserRole } from '../../types';
import { DemoStore, DEMO_ACCOUNTS } from '../../services/demoStore';
import { Sparkles, RotateCcw, Check, ArrowRightLeft } from 'lucide-react';

interface DemoBannerProps {
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ currentRole, onRoleSwitch }) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all tickets, knowledge base articles, and audit logs to factory demo dataset?')) {
      DemoStore.resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  const handleQuickSwitch = (role: UserRole) => {
    const target = DEMO_ACCOUNTS.find((a) => a.user.role === role);
    if (target) {
      DemoStore.setCurrentUser(target.user);
      onRoleSwitch(role);
    }
  };

  return (
    <aside
      aria-label="Academic project demonstration banner"
      className="bg-[#171717] text-[#EDE6D6] text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-black"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8D2E8] text-[#171717] font-semibold text-[11px]">
          <Sparkles className="w-3 h-3 fill-[#171717]" />
          SIH25195 Prototype
        </span>
        <span className="text-[#A09D98] hidden sm:inline text-[11px]">
          AI IT Helpdesk Copilot · Verified Engineering Remediation
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher Pill Bar */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 text-xs">
          <span className="text-[#A09D98] text-[11px] px-2 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3" />
            Role:
          </span>
          <button
            onClick={() => handleQuickSwitch('employee')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'employee'
                ? 'bg-white text-[#171717] shadow-xs'
                : 'text-[#EDE6D6] hover:text-white'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => handleQuickSwitch('engineer')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'engineer'
                ? 'bg-[#F6E58D] text-[#171717] shadow-xs'
                : 'text-[#EDE6D6] hover:text-white'
            }`}
          >
            IT Engineer
          </button>
          <button
            onClick={() => handleQuickSwitch('admin')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-[#EBDDF5] text-[#171717] shadow-xs'
                : 'text-[#EDE6D6] hover:text-white'
            }`}
          >
            Admin / Manager
          </button>
        </div>

        {/* Reset Demo Data */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          title="Reset dataset to initial state"
        >
          {resetSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#DDECCB]" />
              <span className="text-[#DDECCB]">Reset!</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
