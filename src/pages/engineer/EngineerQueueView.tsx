import React, { useState } from 'react';
import { User, Ticket, TicketStatus, TicketPriority, TicketCategory } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { DemoStore } from '../../services/demoStore';
import {
  Search,
  Clock,
  CheckCircle2,
  Zap,
  ArrowUpDown,
  BookOpen,
  Send,
  ShieldAlert,
  Edit3,
  Check,
  X,
  PlusCircle,
  FileText,
} from 'lucide-react';

interface EngineerQueueViewProps {
  user: User;
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket | null) => void;
  viewMode?: 'queue' | 'assigned' | 'history';
}

export const EngineerQueueView: React.FC<EngineerQueueViewProps> = ({
  user,
  tickets,
  selectedTicket,
  onSelectTicket,
  viewMode = 'queue',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [slaFilter, setSlaFilter] = useState<'All' | 'at_risk' | 'breached'>('All');
  const [sortBy, setSortBy] = useState<'sla' | 'created'>('sla');

  // Detail panel action state
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDraftKbModal, setShowDraftKbModal] = useState(false);

  // Manual override states in AI intelligence panel
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [overrideCategory, setOverrideCategory] = useState<TicketCategory>('Hardware');
  const [overridePriority, setOverridePriority] = useState<TicketPriority>('Medium');

  // KB draft form state
  const [draftKbTitle, setDraftKbTitle] = useState('');
  const [draftKbSummary, setDraftKbSummary] = useState('');
  const [draftKbSteps, setDraftKbSteps] = useState('');
  const [draftKbSuccess, setDraftKbSuccess] = useState(false);

  // Workload summary calculations
  const assignedToMe = tickets.filter(
    (t) => t.assignedToId === user.id || t.assignedToName === user.name
  );
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const atRiskCount = tickets.filter(
    (t) => !t.resolvedAt && (new Date(t.slaDeadline).getTime() - Date.now() < 3 * 3600 * 1000)
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  let baseTickets = tickets;
  if (viewMode === 'assigned') {
    baseTickets = assignedToMe;
  } else if (viewMode === 'history') {
    baseTickets = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status));
  }

  const filteredTickets = baseTickets
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.affectedService.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      let matchesSLA = true;
      const hoursRemaining = (new Date(t.slaDeadline).getTime() - Date.now()) / (3600 * 1000);
      if (slaFilter === 'at_risk') {
        matchesSLA = !t.resolvedAt && hoursRemaining < 3 && hoursRemaining > 0;
      } else if (slaFilter === 'breached') {
        matchesSLA = t.slaBreached || (!t.resolvedAt && hoursRemaining <= 0);
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesSLA;
    })
    .sort((a, b) => {
      if (sortBy === 'sla') {
        return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAssignToMe = (ticket: Ticket) => {
    const updated = DemoStore.updateTicket(ticket.id, {
      assignedToId: user.id,
      assignedToName: user.name,
      status: ticket.status === 'Open' ? 'Assigned' : ticket.status,
    });
    onSelectTicket(updated);
  };

  const handleStatusChange = (ticket: Ticket, newStatus: TicketStatus) => {
    const updated = DemoStore.updateTicket(ticket.id, { status: newStatus });
    onSelectTicket(updated);
  };

  const handleAcceptAISuggestion = (ticket: Ticket) => {
    const updated = DemoStore.updateTicket(ticket.id, {
      confirmedCategory: ticket.aiSuggestedCategory,
      confirmedPriority: ticket.aiSuggestedPriority,
      category: ticket.aiSuggestedCategory,
      priority: ticket.aiSuggestedPriority,
      aiIntelligence: {
        ...ticket.aiIntelligence,
        suggestionStatus: 'accepted',
      },
    });
    onSelectTicket(updated);
  };

  const handleRejectAISuggestion = (ticket: Ticket) => {
    const updated = DemoStore.updateTicket(ticket.id, {
      aiIntelligence: {
        ...ticket.aiIntelligence,
        suggestionStatus: 'rejected',
      },
    });
    onSelectTicket(updated);
  };

  const handleSaveCategoryOverride = (ticket: Ticket) => {
    const updated = DemoStore.updateTicket(ticket.id, {
      category: overrideCategory,
      confirmedCategory: overrideCategory,
      aiIntelligence: {
        ...ticket.aiIntelligence,
        suggestionStatus: 'modified',
      },
    });
    setEditingCategory(false);
    onSelectTicket(updated);
  };

  const handleSavePriorityOverride = (ticket: Ticket) => {
    const updated = DemoStore.updateTicket(ticket.id, {
      priority: overridePriority,
      confirmedPriority: overridePriority,
      aiIntelligence: {
        ...ticket.aiIntelligence,
        suggestionStatus: 'modified',
      },
    });
    setEditingPriority(false);
    onSelectTicket(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !commentText.trim()) return;

    const updated = DemoStore.addTicketComment(
      selectedTicket.id,
      commentText,
      isInternalComment
    );
    onSelectTicket(updated);
    setCommentText('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !resolutionNotes.trim()) return;

    const updated = DemoStore.updateTicket(selectedTicket.id, {
      status: 'Resolved',
      resolutionNotes: resolutionNotes.trim(),
    });

    onSelectTicket(updated);
    setShowResolveModal(false);
    setResolutionNotes('');
  };

  const handleCreateDraftKb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !draftKbTitle.trim()) return;

    DemoStore.createKnowledgeArticle({
      title: draftKbTitle.trim(),
      category: selectedTicket.category,
      summary: draftKbSummary.trim(),
      content: `Standardized operational guide formulated from resolution on ${selectedTicket.id} (${selectedTicket.title}).`,
      steps: draftKbSteps
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      originatingTicketId: selectedTicket.id,
    });

    setDraftKbSuccess(true);
    setTimeout(() => {
      setDraftKbSuccess(false);
      setShowDraftKbModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Workload Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Assigned to Me
          </span>
          <span className="text-2xl font-bold text-[#171717] font-mono mt-1 block">
            {assignedToMe.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Unassigned Open
          </span>
          <span className="text-2xl font-bold text-[#171717] font-mono mt-1 block">
            {openCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-bold text-[#3E2459] font-mono mt-1 block">
            {inProgressCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            SLA At Risk (&lt;3h)
          </span>
          <span className="text-2xl font-bold text-[#68194B] font-mono mt-1 block">
            {atRiskCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider block">
            Resolved Today
          </span>
          <span className="text-2xl font-bold text-[#2D4E14] font-mono mt-1 block">
            {resolvedCount}
          </span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Ticket ID, Requester, or Issue keywords..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="text-[#77736D]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'sla' | 'created')}
              className="bg-[#FFFAED] border border-[#EDE6D6] rounded-full px-3 py-1 text-xs text-[#171717]"
            >
              <option value="sla">SLA Urgency (Earliest Deadline)</option>
              <option value="created">Created Date (Newest First)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EDE6D6] text-xs">
          <span className="text-[#77736D] font-bold text-[11px] uppercase mr-1">Status:</span>
          {['All', 'Open', 'Assigned', 'In Progress', 'Pending', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-[#FFFAED] text-[#77736D] border border-[#EDE6D6] hover:text-[#171717]'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="text-[#EDE6D6] mx-1">|</span>

          <span className="text-[#77736D] font-bold text-[11px] uppercase mr-1">Urgency:</span>
          <button
            onClick={() => setSlaFilter('All')}
            className={`px-2.5 py-0.5 rounded-full text-xs ${
              slaFilter === 'All' ? 'bg-[#171717] text-white' : 'text-[#77736D]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSlaFilter('at_risk')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              slaFilter === 'at_risk' ? 'bg-[#F6E58D] text-[#5C4D0A]' : 'bg-[#F6E58D]/40 text-[#5C4D0A]'
            }`}
          >
            ⚠️ &lt;3h Left
          </button>
          <button
            onClick={() => setSlaFilter('breached')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              slaFilter === 'breached' ? 'bg-[#F8D2E8] text-[#68194B]' : 'bg-[#F8D2E8]/40 text-[#68194B]'
            }`}
          >
            🛑 Breached
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#77736D]">
            No tickets currently match the selected queue filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Title & Requester</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4 text-right">Triage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D6] text-xs">
                {filteredTickets.map((t) => {
                  const hoursLeft = (new Date(t.slaDeadline).getTime() - Date.now()) / (3600 * 1000);
                  const isBreached = t.slaBreached || (!t.resolvedAt && hoursLeft <= 0);
                  const isUrgent = !t.resolvedAt && hoursLeft > 0 && hoursLeft < 3;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      className="hover:bg-[#FFFAED] cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">{t.id}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#171717] truncate">{t.title}</div>
                        <div className="text-[11px] text-[#77736D] truncate">
                          {t.requesterName} · {t.department}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#77736D]">{t.category}</td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {t.resolvedAt ? (
                          <span className="text-[#2D4E14] font-semibold">Resolved</span>
                        ) : isBreached ? (
                          <span className="text-[#68194B] font-semibold">Breached</span>
                        ) : isUrgent ? (
                          <span className="text-[#5C4D0A] font-semibold">{hoursLeft.toFixed(1)}h left</span>
                        ) : (
                          <span className="text-[#77736D]">{hoursLeft.toFixed(1)}h left</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {t.assignedToName ? (
                          <span className="font-semibold text-[#171717]">{t.assignedToName}</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignToMe(t);
                            }}
                            className="px-2.5 py-1 rounded-full bg-[#FFFAED] hover:bg-[#F3EEDF] border border-[#EDE6D6] text-[11px] font-bold text-[#171717]"
                          >
                            Assign Me
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicket(t);
                          }}
                          className="px-3 py-1 rounded-full bg-[#FFFAED] hover:bg-[#F3EEDF] border border-[#EDE6D6] text-xs font-semibold text-[#171717]"
                        >
                          Triage & AI
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Engineer Detail Slide-Over with AI Ticket Intelligence Panel */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-[#FFFAED] h-full w-full max-w-3xl shadow-2xl flex flex-col border-l border-[#EDE6D6] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#EDE6D6] bg-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#171717] text-sm">
                    {selectedTicket.id}
                  </span>
                  <StatusBadge status={selectedTicket.status} />
                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
                <h3 className="font-bold text-[#171717] text-base mt-1 line-clamp-1">
                  {selectedTicket.title}
                </h3>
              </div>
              <button
                onClick={() => onSelectTicket(null)}
                className="w-8 h-8 rounded-full bg-[#FFFAED] border border-[#EDE6D6] flex items-center justify-center text-[#77736D] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* AI TICKET INTELLIGENCE PANEL: Soft Beige #F3EEDF Panel with White Cards */}
              <div className="bg-[#F3EEDF] rounded-3xl border border-[#EDE6D6] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EBDDF5] flex items-center justify-center text-[#171717] shadow-xs">
                      <Zap className="w-4 h-4 fill-[#171717]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#171717]">
                        AI Ticket Intelligence Panel
                      </h4>
                      <p className="text-[11px] text-[#77736D]">
                        NLP Classification, SLA evaluation & Runbook matching
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-white border border-[#EDE6D6] text-[#171717]">
                    Confidence: {(selectedTicket.aiIntelligence.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Suggested Summary */}
                <div className="bg-white rounded-2xl border border-[#EDE6D6] p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#77736D]">
                    AI Suggested Summary:
                  </span>
                  <p className="text-[#171717] leading-relaxed">
                    {selectedTicket.aiIntelligence.summary}
                  </p>
                </div>

                {/* AI Suggested vs Confirmed Values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl border border-[#EDE6D6] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#77736D]">Category</span>
                      {selectedTicket.confirmedCategory ? (
                        <span className="text-[10px] font-bold text-[#2D4E14] bg-[#DDECCB] px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#5C4D0A] bg-[#F6E58D] px-2 py-0.5 rounded-full">
                          AI Suggested
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm text-[#171717]">{selectedTicket.category}</div>
                    <div className="text-[11px] text-[#77736D]">
                      AI Evaluated: {selectedTicket.aiSuggestedCategory}
                    </div>

                    {editingCategory ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <select
                          value={overrideCategory}
                          onChange={(e) => setOverrideCategory(e.target.value as TicketCategory)}
                          className="bg-[#FFFAED] border border-[#EDE6D6] rounded-lg p-1 text-xs"
                        >
                          <option value="Printing & Peripherals">Printing & Peripherals</option>
                          <option value="Network & VPN">Network & VPN</option>
                          <option value="Security & Credentials">Security & Credentials</option>
                          <option value="Software & Access">Software & Access</option>
                          <option value="Hardware">Hardware</option>
                          <option value="Email & Communication">Email & Communication</option>
                        </select>
                        <button
                          onClick={() => handleSaveCategoryOverride(selectedTicket)}
                          className="px-2.5 py-1 rounded-full bg-[#080808] text-white text-[11px] font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setOverrideCategory(selectedTicket.category);
                          setEditingCategory(true);
                        }}
                        className="text-[11px] font-bold text-[#171717] underline"
                      >
                        Change Category
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#EDE6D6] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#77736D]">Priority</span>
                      {selectedTicket.confirmedPriority ? (
                        <span className="text-[10px] font-bold text-[#2D4E14] bg-[#DDECCB] px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#5C4D0A] bg-[#F6E58D] px-2 py-0.5 rounded-full">
                          AI Suggested
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm text-[#171717]">{selectedTicket.priority} Priority</div>
                    <div className="text-[11px] text-[#77736D]">
                      AI Evaluated: {selectedTicket.aiSuggestedPriority}
                    </div>

                    {editingPriority ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        <select
                          value={overridePriority}
                          onChange={(e) => setOverridePriority(e.target.value as TicketPriority)}
                          className="bg-[#FFFAED] border border-[#EDE6D6] rounded-lg p-1 text-xs"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                        <button
                          onClick={() => handleSavePriorityOverride(selectedTicket)}
                          className="px-2.5 py-1 rounded-full bg-[#080808] text-white text-[11px] font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setOverridePriority(selectedTicket.priority);
                          setEditingPriority(true);
                        }}
                        className="text-[11px] font-bold text-[#171717] underline"
                      >
                        Change Priority
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggested Resolution Direction */}
                <div className="bg-white rounded-2xl border border-[#EDE6D6] p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#2D4E14]">
                    AI Suggested Resolution Direction:
                  </span>
                  <p className="text-[#171717] leading-relaxed">
                    {selectedTicket.aiIntelligence.suggestedResolution}
                  </p>
                </div>

                {/* Decision Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#EDE6D6]">
                  <button
                    onClick={() => handleAcceptAISuggestion(selectedTicket)}
                    className="px-4 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept AI Suggestion
                  </button>
                  <button
                    onClick={() => handleRejectAISuggestion(selectedTicket)}
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  {selectedTicket.aiIntelligence.suggestionStatus === 'accepted' && (
                    <span className="text-[#2D4E14] text-xs font-bold ml-2">
                      ✓ Confirmed by Engineer
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="bg-white rounded-3xl border border-[#EDE6D6] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#77736D]">
                    Engineer Workflow Actions
                  </span>
                  <span className="text-[11px] text-[#77736D] font-mono">
                    Deadline: {new Date(selectedTicket.slaDeadline).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedTicket.assignedToId !== user.id && (
                    <button
                      onClick={() => handleAssignToMe(selectedTicket)}
                      className="px-4 py-2 rounded-full bg-[#080808] text-white font-semibold text-xs hover:bg-[#222222]"
                    >
                      Assign to Me
                    </button>
                  )}

                  {selectedTicket.status !== 'In Progress' && selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange(selectedTicket, 'In Progress')}
                      className="px-4 py-2 rounded-full bg-[#EBDDF5] text-[#3E2459] border border-[#DFCEEC] font-semibold text-xs hover:bg-[#E2CEF0]"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => setShowResolveModal(true)}
                      className="px-4 py-2 rounded-full bg-[#DDECCB] text-[#2D4E14] border border-[#CDE0B7] font-semibold text-xs hover:bg-[#D2E5BD]"
                    >
                      ✓ Mark Resolved
                    </button>
                  )}

                  {selectedTicket.status !== 'Escalated' && (
                    <button
                      onClick={() => handleStatusChange(selectedTicket, 'Escalated')}
                      className="px-4 py-2 rounded-full bg-[#F8D2E8] text-[#68194B] border border-[#EEB9D9] font-semibold text-xs hover:bg-[#F2BEDD]"
                    >
                      Escalate to Tier 3
                    </button>
                  )}

                  {selectedTicket.status === 'Resolved' && (
                    <button
                      onClick={() => {
                        setDraftKbTitle(`Runbook: ${selectedTicket.title}`);
                        setDraftKbSummary(selectedTicket.resolutionNotes || selectedTicket.description);
                        setDraftKbSteps(
                          '1. Verify physical power and network socket.\n2. Purge stuck spooler jobs.\n3. Validate with 50-sheet test print.'
                        );
                        setShowDraftKbModal(true);
                      }}
                      className="px-4 py-2 rounded-full bg-[#FFFAED] border border-[#EDE6D6] text-[#171717] font-semibold text-xs hover:bg-[#F3EEDF]"
                    >
                      Draft Knowledge Base Article
                    </button>
                  )}
                </div>
              </div>

              {/* Requester Profile */}
              <div className="bg-white rounded-3xl border border-[#EDE6D6] p-5">
                <span className="text-[10px] font-bold uppercase text-[#77736D] block mb-2">
                  Requester Details
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-[#77736D]">Name</span>
                    <span className="font-bold text-[#171717] block">{selectedTicket.requesterName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77736D]">Department</span>
                    <span className="font-bold text-[#171717] block">{selectedTicket.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77736D]">Email</span>
                    <span className="font-bold font-mono text-[#171717] truncate block">{selectedTicket.requesterEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77736D]">Service</span>
                    <span className="font-bold text-[#171717] truncate block">{selectedTicket.affectedService}</span>
                  </div>
                </div>
              </div>

              {/* Comments & Activity */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-[#77736D]">
                  Comments & Internal Notes ({selectedTicket.comments.length})
                </span>

                <div className="space-y-2.5">
                  {selectedTicket.comments.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl border ${
                        c.isInternal
                          ? 'bg-[#F6E58D]/30 border-[#EAD77B]'
                          : 'bg-white border-[#EDE6D6]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#171717]">
                          {c.authorName} ({c.authorRole}) {c.isInternal && '· Internal Note'}
                        </span>
                        <span className="text-[#77736D] font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-[#171717]">{c.message}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment */}
                <form onSubmit={handleAddComment} className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      isInternalComment
                        ? 'Write internal note for engineering team...'
                        : 'Reply to employee with instructions...'
                    }
                    className="w-full bg-white border border-[#EDE6D6] rounded-2xl p-3 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-xs text-[#77736D] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="w-4 h-4 rounded border-[#EDE6D6] text-[#171717]"
                      />
                      <span className="ml-2">Mark as Internal Note</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 py-2 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222] disabled:opacity-40"
                    >
                      Post Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-md w-full shadow-2xl border border-[#EDE6D6] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#171717] text-base">
                Resolve Ticket #{selectedTicket.id}
              </h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#EDE6D6] flex items-center justify-center text-[#77736D]"
              >
                ✕
              </button>
            </div>

            <p className="text-[#77736D]">
              Record the verified troubleshooting steps and remediation outcome. This will be visible to the employee and referenced for automated runbook drafting.
            </p>

            <form onSubmit={handleConfirmResolve} className="space-y-4">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Resolution Notes</label>
                <textarea
                  rows={4}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Cleared Tray 2 roller scrap, restarted print spooler, verified test pages."
                  className="w-full bg-white border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-full bg-white border border-[#EDE6D6] text-[#171717] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#080808] text-white font-semibold hover:bg-[#222222]"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Draft KB Modal */}
      {showDraftKbModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-lg w-full shadow-2xl border border-[#EDE6D6] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#171717] text-base">
                Draft Knowledge Base Article
              </h3>
              <button
                onClick={() => setShowDraftKbModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#EDE6D6] flex items-center justify-center text-[#77736D]"
              >
                ✕
              </button>
            </div>

            <p className="text-[#77736D]">
              Drafts will be submitted for manager approval before publication in the employee Knowledge Base.
            </p>

            {draftKbSuccess ? (
              <div className="p-4 rounded-2xl bg-[#DDECCB] text-[#2D4E14] font-bold">
                ✓ Draft submitted for Administrator approval!
              </div>
            ) : (
              <form onSubmit={handleCreateDraftKb} className="space-y-3">
                <div>
                  <label className="block font-bold text-[#171717] mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={draftKbTitle}
                    onChange={(e) => setDraftKbTitle(e.target.value)}
                    className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171717] mb-1">Summary</label>
                  <textarea
                    rows={2}
                    required
                    value={draftKbSummary}
                    onChange={(e) => setDraftKbSummary(e.target.value)}
                    className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171717] mb-1">Steps (one per line)</label>
                  <textarea
                    rows={3}
                    required
                    value={draftKbSteps}
                    onChange={(e) => setDraftKbSteps(e.target.value)}
                    className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717] font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDraftKbModal(false)}
                    className="px-4 py-2 rounded-full bg-white border border-[#EDE6D6] text-[#171717] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#080808] text-white font-semibold hover:bg-[#222222]"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
