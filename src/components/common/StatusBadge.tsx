import React from 'react';
import { TicketStatus, TicketPriority } from '../../types';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  // Using exact palette from UI/UX design specification:
  // - Pale green #DDECCB for resolved
  // - Lavender #EBDDF5 for in progress
  // - Muted yellow #F6E58D for pending / awaiting action
  // - Soft cream / neutral for open
  const styles: Record<TicketStatus, { bg: string; text: string; dot: string; border: string }> = {
    Open: { bg: 'bg-white', text: 'text-[#171717]', dot: 'bg-[#171717]', border: 'border-[#EDE6D6]' },
    Assigned: { bg: 'bg-[#F7F2E4]', text: 'text-[#171717]', dot: 'bg-[#77736D]', border: 'border-[#EDE6D6]' },
    'In Progress': { bg: 'bg-[#EBDDF5]', text: 'text-[#3E2459]', dot: 'bg-[#6D3299]', border: 'border-[#DFCEEC]' },
    Pending: { bg: 'bg-[#F6E58D]', text: 'text-[#5C4D0A]', dot: 'bg-[#967C0E]', border: 'border-[#EAD77B]' },
    Resolved: { bg: 'bg-[#DDECCB]', text: 'text-[#2D4E14]', dot: 'bg-[#4B7926]', border: 'border-[#CDE0B7]' },
    Closed: { bg: 'bg-[#F3EEDF]', text: 'text-[#77736D]', dot: 'bg-[#A8A49D]', border: 'border-[#EDE6D6]' },
    Escalated: { bg: 'bg-[#F8D2E8]', text: 'text-[#68194B]', dot: 'bg-[#96256D]', border: 'border-[#EEB9D9]' },
  };

  const style = styles[status] || styles.Open;
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${padding} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const styles: Record<TicketPriority, { bg: string; text: string; border: string }> = {
    Low: { bg: 'bg-white', text: 'text-[#77736D]', border: 'border-[#EDE6D6]' },
    Medium: { bg: 'bg-[#F6E58D]', text: 'text-[#5C4D0A]', border: 'border-[#EAD77B]' },
    High: { bg: 'bg-[#F8D2E8]', text: 'text-[#68194B]', border: 'border-[#EEB9D9]' },
    Critical: { bg: 'bg-[#080808]', text: 'text-white', border: 'border-[#080808]' },
  };

  const style = styles[priority] || styles.Medium;
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${style.bg} ${style.text} ${style.border} ${padding} whitespace-nowrap`}
    >
      <span aria-hidden="true" className="text-[10px]">
        {priority === 'Critical' ? '●' : priority === 'High' ? '▲' : '▪'}
      </span>
      {priority}
    </span>
  );
};
