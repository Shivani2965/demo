import React from 'react';
import { UserRole } from '../../types';
import {
  MessageSquare,
  Ticket,
  BookOpen,
  History,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Sliders,
  Users,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  openTicketsCount?: number;
  pendingDraftsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badgePink?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  openTicketsCount = 0,
  pendingDraftsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onLogout,
}) => {
  // Navigation structure adhering strictly to Section 3.1 & Section 12 of UI/UX Specification:
  // General: AI Assistant, My Tickets, Knowledge Base, Chat History
  // Tools: Create Ticket, Analytics, Settings (plus role additions for Engineer & Admin)
  const employeeGeneralNav: NavItem[] = [
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'tickets', label: 'My Tickets', icon: Ticket, count: openTicketsCount, badgePink: true },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    { id: 'history', label: 'Chat History', icon: History },
  ];

  const employeeToolsNav: NavItem[] = [
    { id: 'create_ticket', label: 'Create Ticket', icon: PlusCircle },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const engineerGeneralNav: NavItem[] = [
    { id: 'queue', label: 'My Queue', icon: Layers, count: openTicketsCount, badgePink: true },
    { id: 'assigned', label: 'All Assigned', icon: Ticket },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen, count: pendingDraftsCount },
    { id: 'ticket_history', label: 'Ticket History', icon: History },
  ];

  const engineerToolsNav: NavItem[] = [
    { id: 'chat', label: 'AI Assistant Test', icon: MessageSquare },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const adminGeneralNav: NavItem[] = [
    { id: 'overview', label: 'Operations Dashboard', icon: BarChart3 },
    { id: 'tickets', label: 'All Tickets', icon: Ticket, count: openTicketsCount, badgePink: true },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen, count: pendingDraftsCount },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
  ];

  const adminToolsNav: NavItem[] = [
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'config', label: 'Routing & SLA', icon: Sliders },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const generalNav =
    role === 'employee' ? employeeGeneralNav : role === 'engineer' ? engineerGeneralNav : adminGeneralNav;
  const toolsNav =
    role === 'employee' ? employeeToolsNav : role === 'engineer' ? engineerToolsNav : adminToolsNav;

  const handleSelect = (id: string) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const renderNavButton = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
          isActive
            ? 'bg-white text-[#171717] shadow-sm font-semibold'
            : 'text-[#A09D98] hover:text-white hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#171717]' : 'text-[#8E8B85]'}`} />
          <span className="truncate">{item.label}</span>
        </div>

        {item.count !== undefined && item.count > 0 && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              isActive
                ? 'bg-[#F8D2E8] text-[#171717]'
                : item.badgePink
                ? 'bg-[#F8D2E8]/20 text-[#F8D2E8] border border-[#F8D2E8]/40'
                : 'bg-white/10 text-white'
            }`}
          >
            {item.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Outer wrapper to create the subtle surrounding margin around the dark panel */}
      <div className="p-3 lg:p-3 shrink-0">
        <aside
          className={`fixed lg:sticky top-3 z-40 lg:z-10 h-[calc(100vh-1.5rem)] w-64 bg-[#1B1B1B] text-white rounded-3xl p-5 flex flex-col justify-between shadow-xl border border-white/5 transition-transform duration-200 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Section: Brand & Navigation */}
          <div className="space-y-6 overflow-y-auto pr-1">
            {/* Brand section matching Section 3.1:
                - Circular pink lightning-style icon
                - Product name: PowerGrid Copilot
                - Small secondary label: IT Support */}
            <div className="flex items-center gap-3 px-1 pt-1">
              <div className="w-10 h-10 rounded-full bg-[#F8D2E8] flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-5 h-5 text-[#171717] fill-[#171717]" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-tight leading-tight">
                  PowerGrid Copilot
                </h1>
                <p className="text-[11px] text-[#A09D98] font-medium">IT Support System</p>
              </div>
            </div>

            {/* General Navigation Group */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider px-3 mb-2">
                General
              </div>
              {generalNav.map(renderNavButton)}
            </div>

            {/* Tools Navigation Group */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider px-3 mb-2">
                Tools
              </div>
              {toolsNav.map(renderNavButton)}
            </div>
          </div>

          {/* Bottom Section: Separated Logout Action & Role Indicator */}
          <div className="pt-4 mt-auto border-t border-white/10 space-y-3">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-[#A09D98]">Portal Role</span>
              <span className="font-semibold text-[#F8D2E8] capitalize">{role}</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs text-[#A09D98] hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4 text-[#77736D]" />
                <span>Log out</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};
