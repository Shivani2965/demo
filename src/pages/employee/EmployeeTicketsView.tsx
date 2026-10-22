import React, { useState } from 'react';
import { User, Ticket } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { DemoStore } from '../../services/demoStore';
import {
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Star,
  FileText,
  X,
} from 'lucide-react';

interface EmployeeTicketsViewProps {
  user: User;
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  onSelectTicket: (ticket: Ticket | null) => void;
  onOpenCreateTicket: () => void;
}

export const EmployeeTicketsView: React.FC<EmployeeTicketsViewProps> = ({
  user,
  tickets,
  selectedTicket,
  onSelectTicket,
  onOpenCreateTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [commentText, setCommentText] = useState('');
  const [csatRating, setCsatRating] = useState<number>(5);
  const [csatComment, setCsatComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Employee only sees their own tickets
  const myTickets = tickets.filter(
    (t) => t.requesterEmail.toLowerCase() === user.email.toLowerCase() || t.requesterId === user.id
  );

  const openTickets = myTickets.filter((t) => t.status === 'Open' || t.status === 'Assigned');
  const inProgressTickets = myTickets.filter((t) => t.status === 'In Progress');
  const awaitingTickets = myTickets.filter((t) => t.status === 'Pending');
  const resolvedTickets = myTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed');

  const filteredTickets = myTickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !commentText.trim()) return;

    const updated = DemoStore.addTicketComment(selectedTicket.id, commentText, false);
    onSelectTicket(updated);
    setCommentText('');
  };

  const handleRateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated = DemoStore.rateTicketResolution(selectedTicket.id, csatRating, csatComment);
    onSelectTicket(updated);
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 5.1 Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE6D6]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">My Tickets</h2>
          <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
            Track your requests and see the latest updates from IT support.
          </p>
        </div>

        <button
          onClick={onOpenCreateTicket}
          className="px-4 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Ticket
        </button>
      </div>

      {/* 5.2 Ticket Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider block">
            Open Tickets
          </span>
          <span className="text-2xl font-bold text-[#171717] font-mono mt-1 block">
            {openTickets.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-bold text-[#3E2459] font-mono mt-1 block">
            {inProgressTickets.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider block">
            Awaiting Your Response
          </span>
          <span className="text-2xl font-bold text-[#5C4D0A] font-mono mt-1 block">
            {awaitingTickets.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs">
          <span className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-bold text-[#2D4E14] font-mono mt-1 block">
            {resolvedTickets.length}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, title, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Open', 'In Progress', 'Pending', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#FFFAED] text-[#77736D] border border-[#EDE6D6] hover:text-[#171717]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 5.3 Ticket List */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-8 h-8 text-[#A09D98] mx-auto" />
            <h4 className="font-bold text-sm text-[#171717]">No tickets found</h4>
            <p className="text-xs text-[#77736D]">
              You have not created any tickets matching this criteria.
            </p>
            <button
              onClick={onOpenCreateTicket}
              className="px-4 py-2 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222]"
            >
              Create your first ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Issue Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D6] text-xs">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    className="hover:bg-[#FFFAED] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">{t.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#171717] max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#77736D]">{t.category}</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3.5 px-4 text-[#77736D] font-mono text-[11px]">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(t);
                        }}
                        className="px-3 py-1 rounded-full bg-[#FFFAED] hover:bg-[#F3EEDF] border border-[#EDE6D6] text-xs font-semibold text-[#171717]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Slide-Over */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-[#FFFAED] h-full w-full max-w-2xl shadow-2xl flex flex-col border-l border-[#EDE6D6] overflow-hidden">
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

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-[#EDE6D6]">
                <div>
                  <span className="text-[#77736D] block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-semibold text-[#171717] mt-0.5 block">{selectedTicket.category}</span>
                </div>
                <div>
                  <span className="text-[#77736D] block text-[10px] uppercase font-bold">Assigned</span>
                  <span className="font-semibold text-[#171717] mt-0.5 block">{selectedTicket.assignedToName || 'Awaiting Triage'}</span>
                </div>
                <div>
                  <span className="text-[#77736D] block text-[10px] uppercase font-bold">SLA Target</span>
                  <span className="font-semibold font-mono text-[#171717] mt-0.5 block">{selectedTicket.slaHours}h</span>
                </div>
                <div>
                  <span className="text-[#77736D] block text-[10px] uppercase font-bold">Logged On</span>
                  <span className="font-semibold font-mono text-[#171717] mt-0.5 block">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#77736D]">Issue Description</span>
                <p className="text-[#171717] leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Resolution Notes (if resolved) */}
              {selectedTicket.resolutionNotes && (
                <div className="bg-[#DDECCB] border border-[#CDE0B7] rounded-3xl p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#2D4E14]">
                    <CheckCircle2 className="w-4 h-4 text-[#4B7926]" />
                    <span>Official IT Resolution Notes</span>
                  </div>
                  <p className="text-[#2D4E14] leading-relaxed">{selectedTicket.resolutionNotes}</p>
                </div>
              )}

              {/* CSAT Rating Widget */}
              {selectedTicket.status === 'Resolved' && (
                <div className="bg-white p-5 rounded-3xl border border-[#EDE6D6] space-y-3">
                  <h4 className="font-bold text-[#171717]">Rate Helpdesk Resolution</h4>
                  {selectedTicket.satisfactionRating ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2D4E14]">
                      <CheckCircle2 className="w-4 h-4 text-[#4B7926]" />
                      <span>You rated this resolution: {selectedTicket.satisfactionRating.score}/5 Stars</span>
                    </div>
                  ) : (
                    <form onSubmit={handleRateResolution} className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => setCsatRating(score)}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                score <= csatRating
                                  ? 'text-[#F6E58D] fill-[#F6E58D]'
                                  : 'text-[#EDE6D6]'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-[#171717] ml-2">
                          {csatRating} of 5
                        </span>
                      </div>
                      <input
                        type="text"
                        value={csatComment}
                        onChange={(e) => setCsatComment(e.target.value)}
                        placeholder="Optional feedback comment..."
                        className="w-full text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-xl p-2"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-full bg-[#080808] text-white font-semibold text-xs hover:bg-[#222222]"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Comments */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase text-[#77736D]">
                  Conversation & Updates ({selectedTicket.comments.length})
                </span>
                <div className="space-y-2.5">
                  {selectedTicket.comments
                    .filter((c) => !c.isInternal)
                    .map((c) => (
                      <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-[#EDE6D6] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#171717]">{c.authorName} ({c.authorRole})</span>
                          <span className="text-[#77736D] font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-[#171717]">{c.message}</p>
                      </div>
                    ))}
                </div>

                {selectedTicket.status !== 'Closed' && (
                  <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Reply to the assigned engineer..."
                      className="flex-1 bg-white border border-[#EDE6D6] rounded-full px-4 py-2 text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 py-2 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222] disabled:opacity-40"
                    >
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
