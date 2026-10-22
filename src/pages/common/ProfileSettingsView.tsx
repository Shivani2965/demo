import React, { useState } from 'react';
import { User } from '../../types';
import { DemoStore } from '../../services/demoStore';
import { CheckCircle2, Shield, Bell, Moon, User as UserIcon } from 'lucide-react';

interface ProfileSettingsViewProps {
  user: User;
  onLogout: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ user, onLogout }) => {
  const [activeStatus, setActiveStatus] = useState(user.activeStatus);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [ticketUpdates, setTicketUpdates] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    DemoStore.setCurrentUser({
      ...user,
      activeStatus,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">Settings & Profile</h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Manage your account profile, notification preferences, and session options.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-[#DDECCB] border border-[#CDE0B7] text-[#2D4E14] text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4B7926]" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EBDDF5] text-[#171717] border border-[#EDE6D6] flex items-center justify-center font-bold text-xl shadow-xs">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#171717] text-lg">{user.name}</h3>
              <span className="text-[11px] font-bold uppercase px-3 py-0.5 rounded-full bg-[#F3EEDF] text-[#171717]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#77736D] font-mono mt-0.5">{user.email}</p>
            <p className="text-xs text-[#77736D] font-medium mt-1">{user.department}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDE6D6] text-xs">
          <div>
            <label className="block font-bold text-[#171717] mb-1.5">User ID</label>
            <input
              type="text"
              readOnly
              value={user.id}
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-2.5 font-mono text-[#77736D]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">Job Title</label>
            <input
              type="text"
              readOnly
              value={user.title || `${user.role.toUpperCase()} Member`}
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-2.5 text-[#77736D]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">Availability Status</label>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as any)}
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-2.5 text-[#171717]"
            >
              <option value="active">🟢 Online & Active</option>
              <option value="busy">🟡 In Meeting / Busy</option>
              <option value="offline">⚪ Offline</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">System Reference</label>
            <input
              type="text"
              readOnly
              value="SIH25195 PowerGrid Copilot"
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-2.5 text-[#77736D]"
            />
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="pt-4 border-t border-[#EDE6D6] space-y-3">
          <h4 className="font-bold text-xs uppercase text-[#77736D]">Notification Preferences</h4>
          <div className="space-y-2 text-xs">
            <label className="flex items-center text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-[#EDE6D6] text-[#171717]"
              />
              <span className="ml-2 font-medium">Email notifications when Copilot updates an issue</span>
            </label>
            <label className="flex items-center text-[#171717] cursor-pointer">
              <input
                type="checkbox"
                checked={ticketUpdates}
                onChange={(e) => setTicketUpdates(e.target.checked)}
                className="w-4 h-4 rounded border-[#EDE6D6] text-[#171717]"
              />
              <span className="ml-2 font-medium">Real-time alerts for engineer responses on tickets</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#EDE6D6] flex items-center justify-between">
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-[#68194B] hover:underline"
          >
            Log Out of Session
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
