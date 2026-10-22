import React, { useState } from 'react';
import { User, Ticket, TicketPriority } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { DemoStore } from '../../services/demoStore';
import { Search } from 'lucide-react';

interface AdminTicketsViewProps {
  user: User;
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket | null) => void;
}

export const AdminTicketsView: React.FC<AdminTicketsViewProps> = ({
  user,
  tickets,
  selectedTicket,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [newPriority, setNewPriority] = useState<TicketPriority>('High');
  const [overrideReason, setOverrideReason] = useState('');

  const registeredUsers = DemoStore.getRegisteredUsers();
  const engineersAndAdmins = registeredUsers.filter(
    (u) => u.role === 'engineer' || u.role === 'admin'
  );

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const targetUser = registeredUsers.find((u) => u.id === newAssigneeId);

    const updates: Partial<Ticket> = {
      priority: newPriority,
      confirmedPriority: newPriority,
    };

    if (targetUser) {
      updates.assignedToId = targetUser.id;
      updates.assignedToName = targetUser.name;
      if (selectedTicket.status === 'Open') {
        updates.status = 'Assigned';
      }
    }

    const updated = DemoStore.updateTicket(selectedTicket.id, updates);

    if (overrideReason.trim()) {
      DemoStore.addTicketComment(
        selectedTicket.id,
        `Admin Action [${user.name}]: Priority overridden to ${newPriority}${
          targetUser ? `, reassigned to ${targetUser.name}` : ''
        }. Reason: ${overrideReason}`,
        true
      );
    }

    onSelectTicket(updated);
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE6D6]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            All Campus Tickets
          </h2>
          <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
            Operational triage, reassignment matrix, and priority overrides.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-white border border-[#EDE6D6] text-[#171717] px-3.5 py-1.5 rounded-full">
          {tickets.length} Registered Tickets
        </span>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Requester, Title, or Assignee..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EDE6D6] text-xs">
          <span className="text-[#77736D] font-bold text-[11px] uppercase mr-1">Status:</span>
          {['All', 'Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'].map((st) => (
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
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Requester & Dept</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4 text-right">Actions</th>
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
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#171717]">{t.requesterName}</div>
                    <div className="text-[10px] text-[#77736D]">{t.department}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#77736D]">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#171717]">
                    {t.assignedToName || <span className="text-[#77736D] italic font-normal">Unassigned</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicket(t);
                        setNewAssigneeId(t.assignedToId || '');
                        setNewPriority(t.priority);
                        setShowOverrideModal(true);
                      }}
                      className="px-3 py-1 rounded-full bg-[#FFFAED] hover:bg-[#F3EEDF] border border-[#EDE6D6] text-xs font-semibold text-[#171717]"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {showOverrideModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-md w-full shadow-2xl border border-[#EDE6D6] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#EDE6D6] text-[#171717]">
                  Ticket #{selectedTicket.id}
                </span>
                <h3 className="font-bold text-[#171717] text-base mt-1">
                  Reassign & Priority Override
                </h3>
              </div>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#EDE6D6] flex items-center justify-center text-[#77736D]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-4">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Assign to Engineer</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                >
                  <option value="">Unassigned</option>
                  {engineersAndAdmins.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role === 'admin' ? 'Manager' : 'Engineer'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Override Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                >
                  <option value="Low">Low (24h SLA)</option>
                  <option value="Medium">Medium (8h SLA)</option>
                  <option value="High">High (4h SLA)</option>
                  <option value="Critical">Critical (1h SLA)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Audit Reason</label>
                <textarea
                  rows={2}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. VIP lab exam deadline today; escalated to Senior Engineer."
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-full bg-white border border-[#EDE6D6] text-[#171717] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white font-semibold shadow-xs"
                >
                  Apply & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
