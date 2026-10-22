import React, { useState } from 'react';
import { User } from '../../types';
import {
  Search,
  Bell,
  Settings,
  Menu,
  LogOut,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  onSearchScope?: (scope: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onToggleSidebar,
  onSearchScope,
}) => {
  const [searchScope, setSearchScope] = useState<'All' | 'Tickets' | 'KB' | 'Runbooks'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Ticket #HD-1041 Updated',
      desc: 'Engineer Vikram Malhotra updated Floor 3 printer issue.',
      time: '12m ago',
    },
    {
      id: 'n2',
      title: 'Verified Runbook Added',
      desc: 'New troubleshooting steps for VPN Error 412 gateway timeout.',
      time: '1h ago',
    },
  ];

  return (
    <header className="h-16 bg-[#FFFAED] border-b border-[#EDE6D6] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full bg-white border border-[#EDE6D6] text-[#171717]"
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center/Left: Section 3.2 Wide rounded search field with scope filters */}
      <div className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask Copilot or search records..."
            className="w-full pl-9 pr-4 py-2 bg-white text-xs sm:text-sm text-[#171717] placeholder-[#77736D] rounded-full border border-[#EDE6D6] focus:outline-none focus:ring-1 focus:ring-[#171717] shadow-xs"
          />
        </div>

        {/* Small search-scope filter pills */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {(['Tickets', 'Knowledge Base', 'Runbooks'] as const).map((scope) => {
            const isSelected = searchScope === (scope === 'Knowledge Base' ? 'KB' : scope);
            return (
              <button
                key={scope}
                onClick={() => {
                  const val = scope === 'Knowledge Base' ? 'KB' : scope;
                  setSearchScope(val);
                  if (onSearchScope) onSearchScope(val);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white text-[#77736D] border border-[#EDE6D6] hover:bg-[#F3EEDF] hover:text-[#171717]'
                }`}
              >
                {scope}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Notifications, Settings, Circular Profile Icon */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-white border border-[#EDE6D6] flex items-center justify-center text-[#171717] hover:bg-[#F3EEDF] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F8D2E8] border border-[#171717]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EDE6D6] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#EDE6D6] flex items-center justify-between">
                <span className="text-xs font-bold text-[#171717]">Notifications</span>
                <span className="text-[11px] text-[#77736D]">2 new</span>
              </div>
              <div className="divide-y divide-[#EDE6D6]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#FFFAED] transition-colors text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#171717]">{n.title}</span>
                      <span className="text-[10px] text-[#77736D]">{n.time}</span>
                    </div>
                    <p className="text-[#77736D] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Circular Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#EBDDF5] text-[#171717] border border-[#EDE6D6] flex items-center justify-center font-bold text-xs shadow-xs">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#EDE6D6] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[#EDE6D6]">
                <p className="text-xs font-bold text-[#171717] truncate">{user.name}</p>
                <p className="text-[11px] text-[#77736D] truncate">{user.email}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#F8D2E8] text-[#171717]">
                  {user.role}
                </span>
              </div>

              <div className="p-1">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-xs text-[#171717] hover:bg-[#F3EEDF] rounded-xl flex items-center gap-2 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#77736D]" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
