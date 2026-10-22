import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { Search } from 'lucide-react';

interface AuditLogViewProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.targetId.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || log.targetType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-2 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          System Audit Trail
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Chronological event logs tracking ticket lifecycle, priority overrides, and runbook authorizations.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, or target ID..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'ticket', 'user', 'kb', 'auth'].map((tp) => (
            <button
              key={tp}
              onClick={() => setFilterType(tp)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filterType === tp
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-[#FFFAED] text-[#77736D] border border-[#EDE6D6] hover:text-[#171717]'
              }`}
            >
              {tp === 'all' ? 'All Events' : tp}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F2E4] border-b border-[#EDE6D6] text-[11px] font-bold text-[#77736D] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D6] text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFFAED] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#77736D] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#171717] block">{log.actorName}</span>
                    <span className="text-[10px] uppercase font-bold text-[#77736D]">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#171717]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] uppercase font-semibold">
                      {log.targetType} #{log.targetId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#77736D] max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
