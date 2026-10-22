import React from 'react';
import { User, Ticket } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Wifi,
  Printer,
  KeyRound,
} from 'lucide-react';

interface EmployeeOverviewProps {
  user: User;
  tickets: Ticket[];
  onStartChat: (initialPrompt?: string) => void;
  onViewTickets: () => void;
  onOpenTicket: (ticket: Ticket) => void;
  onOpenKB: (category?: string) => void;
}

export const EmployeeOverview: React.FC<EmployeeOverviewProps> = ({
  user,
  tickets,
  onStartChat,
  onViewTickets,
  onOpenTicket,
  onOpenKB,
}) => {
  // Filter tickets for this employee
  const userTickets = tickets.filter(
    (t) => t.requesterEmail.toLowerCase() === user.email.toLowerCase() || t.requesterId === user.id
  );

  const openTickets = userTickets.filter((t) => ['Open', 'Assigned', 'In Progress'].includes(t.status));
  const pendingTickets = userTickets.filter((t) => t.status === 'Pending');
  const resolvedTickets = userTickets.filter((t) => ['Resolved', 'Closed'].includes(t.status));

  const recentTickets = [...userTickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-700/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI-Powered Self-Service Desk
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hello, {user.name.split(' ')[0]}
          </h2>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Need technical assistance with campus IT systems, hardware peripherals, network credentials, or VPN access? Ask our AI Copilot for immediate step-by-step troubleshooting.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartChat()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-indigo-900 font-semibold text-sm hover:bg-indigo-50 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Start Support Conversation
            </button>
            <button
              onClick={onViewTickets}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-950/60 text-white font-medium text-sm hover:bg-indigo-950/90 border border-indigo-500/40 transition-colors"
            >
              View My Tickets ({userTickets.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Open Tickets
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {openTickets.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Currently being reviewed or worked on</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Your Action
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingTickets.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Awaiting test confirmation or input</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Tickets
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {resolvedTickets.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Completed solutions with verified notes</p>
        </div>
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Quick Diagnostic Prompts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onStartChat('Printer jammed and print spooler unresponsive on Floor 3')}
            className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-xs mb-1">
              <Printer className="w-4 h-4" />
              <span>Printer / Spooler Issue</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              "Printer jammed and print spooler unresponsive on Floor 3"
            </p>
          </button>

          <button
            onClick={() => onStartChat('VPN disconnected with Error 412 gateway timeout')}
            className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="flex items-center gap-2 text-sky-600 font-medium text-xs mb-1">
              <Wifi className="w-4 h-4" />
              <span>VPN & Connectivity</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              "VPN disconnected with Error 412 gateway timeout"
            </p>
          </button>

          <button
            onClick={() => onStartChat('MFA token out of sync and password reset required')}
            className="text-left p-3.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="flex items-center gap-2 text-emerald-600 font-medium text-xs mb-1">
              <KeyRound className="w-4 h-4" />
              <span>SSO & Password Lockout</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              "MFA token out of sync and password reset required"
            </p>
          </button>
        </div>
      </div>

      {/* Recent Ticket Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Recent Ticket Activity</h3>
            <p className="text-xs text-slate-500">Track current status and engineer updates</p>
          </div>
          <button
            onClick={onViewTickets}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All tickets <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No active tickets found. Start a conversation with AI Copilot to log your first issue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {t.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{t.category}</td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {t.assignedToName || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenTicket(t)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
