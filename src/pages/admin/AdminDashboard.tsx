import React from 'react';
import { User, Ticket, KnowledgeArticle, AuditLogEntry } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  BarChart2,
  Users,
  AlertTriangle,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  tickets: Ticket[];
  articles: KnowledgeArticle[];
  auditLogs: AuditLogEntry[];
  onNavigateTab: (tabId: string) => void;
  onOpenTicket: (ticket: Ticket) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  tickets,
  articles,
  auditLogs,
  onNavigateTab,
  onOpenTicket,
}) => {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'Assigned').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  const breachedTickets = tickets.filter((t) => {
    const hoursLeft = (new Date(t.slaDeadline).getTime() - Date.now()) / (3600 * 1000);
    return t.slaBreached || (!t.resolvedAt && hoursLeft <= 0);
  }).length;

  const atRiskTickets = tickets.filter((t) => {
    const hoursLeft = (new Date(t.slaDeadline).getTime() - Date.now()) / (3600 * 1000);
    return !t.resolvedAt && hoursLeft > 0 && hoursLeft < 3;
  }).length;

  const categories = [
    'Hardware',
    'Software & Access',
    'Network & VPN',
    'Email & Communication',
    'Printing & Peripherals',
    'Security & Credentials',
  ];

  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: tickets.filter((t) => t.category === cat).length,
  }));

  const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  const engineers = [
    { name: 'Vikram Malhotra' },
    { name: 'Dr. Rajesh Kulkarni' },
  ];

  const engineerWorkload = engineers.map((eng) => ({
    name: eng.name,
    assigned: tickets.filter((t) => t.assignedToName === eng.name).length,
    inProgress: tickets.filter((t) => t.assignedToName === eng.name && t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.assignedToName === eng.name && t.status === 'Resolved').length,
  }));

  const ratedTickets = tickets.filter((t) => t.satisfactionRating && t.satisfactionRating.score > 0);
  const avgCsat =
    ratedTickets.length > 0
      ? (
          ratedTickets.reduce((acc, t) => acc + (t.satisfactionRating?.score || 0), 0) /
          ratedTickets.length
        ).toFixed(1)
      : '5.0';

  const pendingDrafts = articles.filter((a) => a.status === 'draft_pending_approval');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE6D6]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            IT Service Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
            Operational metrics, SLA compliance rates, category distribution, and engineer workload.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingDrafts.length > 0 && (
            <button
              onClick={() => onNavigateTab('kb')}
              className="px-3.5 py-1.5 rounded-full bg-[#F6E58D] text-[#5C4D0A] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#EAD77B] transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{pendingDrafts.length} Runbook Pending Approval</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('tickets')}
            className="px-4 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Manage All Tickets
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Total Tickets
          </span>
          <span className="text-2xl font-bold text-[#171717] font-mono mt-1 block">
            {totalTickets}
          </span>
          <span className="text-[11px] text-[#77736D] mt-1 block">Campus Helpdesk Logs</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Active / Open
          </span>
          <span className="text-2xl font-bold text-[#171717] font-mono mt-1 block">
            {openTickets}
          </span>
          <span className="text-[11px] text-[#77736D] mt-1 block">Awaiting Pickup</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-bold text-[#3E2459] font-mono mt-1 block">
            {inProgressTickets}
          </span>
          <span className="text-[11px] text-[#77736D] mt-1 block">Under Remediation</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-bold text-[#2D4E14] font-mono mt-1 block">
            {resolvedTickets}
          </span>
          <span className="text-[11px] text-[#2D4E14] mt-1 block font-semibold">
            {totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(0) : 100}% Resolved
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            SLA Risk / Breached
          </span>
          <span className="text-2xl font-bold text-[#68194B] font-mono mt-1 block">
            {breachedTickets + atRiskTickets}
          </span>
          <span className="text-[11px] text-[#68194B] mt-1 block font-bold">
            {breachedTickets} breached · {atRiskTickets} &lt;3h left
          </span>
        </div>
      </div>

      {/* Analytics Charts & Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE6D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#171717] text-sm">Tickets by Category</h3>
              <p className="text-xs text-[#77736D]">Distribution across technical support domains</p>
            </div>
            <BarChart2 className="w-4 h-4 text-[#77736D]" />
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map((item) => {
              const percentage = Math.round((item.count / (totalTickets || 1)) * 100);
              const barWidth = Math.round((item.count / maxCategoryCount) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#171717]">{item.category}</span>
                    <span className="font-mono text-[#77736D]">
                      {item.count} tickets ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFFAED] border border-[#EDE6D6] overflow-hidden">
                    <div
                      className="h-full bg-[#171717] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engineer Workload */}
        <div className="bg-white p-6 rounded-3xl border border-[#EDE6D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#171717] text-sm">Engineer Queue Workload</h3>
              <p className="text-xs text-[#77736D]">Assigned workload and resolution capacity</p>
            </div>
            <Users className="w-4 h-4 text-[#77736D]" />
          </div>

          <div className="space-y-3 pt-1">
            {engineerWorkload.map((eng) => (
              <div
                key={eng.name}
                className="p-4 rounded-2xl border border-[#EDE6D6] bg-[#FFFAED] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#171717]">{eng.name}</span>
                  <span className="font-mono font-bold text-[#171717]">
                    {eng.assigned} Assigned
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-white rounded-xl border border-[#EDE6D6] text-center">
                    <span className="text-[#77736D] block text-[10px]">In Progress</span>
                    <span className="font-bold text-[#3E2459] font-mono text-xs">{eng.inProgress}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#EDE6D6] text-center">
                    <span className="text-[#77736D] block text-[10px]">Resolved</span>
                    <span className="font-bold text-[#2D4E14] font-mono text-xs">{eng.resolved}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#EDE6D6] text-center">
                    <span className="text-[#77736D] block text-[10px]">Load Status</span>
                    <span className="font-bold text-[#171717] text-xs">
                      {eng.assigned > 4 ? 'High' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CSAT Rating */}
          <div className="p-4 rounded-2xl bg-[#F7F2E4] border border-[#EDE6D6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#5C4D0A] fill-[#F6E58D]" />
              <div>
                <span className="font-bold text-xs text-[#171717]">Employee CSAT Rating</span>
                <p className="text-[11px] text-[#77736D]">Average score from resolved support sessions</p>
              </div>
            </div>
            <div className="text-xl font-bold font-mono text-[#171717]">
              {avgCsat} / 5.0
            </div>
          </div>
        </div>
      </div>

      {/* Live Audit Log Preview */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EDE6D6] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#171717] text-sm">
              Live System Audit Log (SIH25195 Audit Trail)
            </h3>
            <p className="text-xs text-[#77736D]">
              Chronological records of ticket triage, status changes, and runbook authorizations
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-bold text-[#171717] hover:underline flex items-center gap-1"
          >
            Full Audit Trail <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EDE6D6] text-xs">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-4 hover:bg-[#FFFAED] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-[#77736D] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div>
                  <div className="font-medium text-[#171717]">
                    <span className="font-bold">{log.actorName}</span> ({log.actorRole}):{' '}
                    <span className="font-bold text-[#171717]">{log.action}</span>
                  </div>
                  <div className="text-[11px] text-[#77736D] mt-0.5">{log.details}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] shrink-0 uppercase font-semibold">
                {log.targetType} #{log.targetId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
