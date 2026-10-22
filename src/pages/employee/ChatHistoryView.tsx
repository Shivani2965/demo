import React, { useState } from 'react';
import { User, Ticket } from '../../types';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';

interface ChatHistoryViewProps {
  user: User;
  tickets: Ticket[];
  onReopenChat: (prompt: string) => void;
  onCreateTicketFromChat: (title: string, desc: string) => void;
}

interface ChatSessionRecord {
  id: string;
  title: string;
  date: string;
  lastActivity: string;
  ticketId?: string;
  isResolved: boolean;
  transcript: string;
}

export const ChatHistoryView: React.FC<ChatHistoryViewProps> = ({
  user,
  tickets,
  onReopenChat,
  onCreateTicketFromChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [selectedSession, setSelectedSession] = useState<ChatSessionRecord | null>(null);

  // Realistic historical sessions
  const sessions: ChatSessionRecord[] = [
    {
      id: 'SES-8492',
      title: 'Department Network Printer LaserJet 400 Offline and Jammed',
      date: 'Today',
      lastActivity: '12m ago',
      ticketId: 'HD-1041',
      isResolved: false,
      transcript:
        'Employee: Printer on Floor 3 is jammed with error 13.02.\nPowerGrid Copilot: Recommended clearing Tray 2 and spooler reset.\nCheckpoint: Steps failed; escalated to support ticket HD-1041.',
    },
    {
      id: 'SES-8341',
      title: 'Enterprise VPN Client Fails Handshake with Error 412',
      date: 'Yesterday',
      lastActivity: '1d ago',
      ticketId: 'HD-1038',
      isResolved: false,
      transcript:
        'Employee: Cannot connect to remote VPN gateway from off-campus.\nPowerGrid Copilot: Suggested flushing DNS cache and checking device root certificates.',
    },
    {
      id: 'SES-8210',
      title: 'PostgreSQL Database Access Denied for Final Year Lab Cluster',
      date: 'Oct 20, 2026',
      lastActivity: '2d ago',
      ticketId: 'HD-1029',
      isResolved: true,
      transcript:
        'Employee: Authentication error 28000 on pg-lab-01.\nPowerGrid Copilot: Guided user through pg_hba whitelist verification and connection strings.\nOutcome: Resolved by engineer configuration.',
    },
    {
      id: 'SES-8015',
      title: 'Self-Service Password Reset (SSPR) for Institutional Portal',
      date: 'Oct 18, 2026',
      lastActivity: '4d ago',
      isResolved: true,
      transcript:
        'Employee: Locked out after 5 invalid attempts.\nPowerGrid Copilot: Provided direct SSPR link and MFA re-sync procedure.\nOutcome: Resolved via self-service troubleshooting.',
    },
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.transcript.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterState === 'all' ||
      (filterState === 'resolved' && s.isResolved) ||
      (filterState === 'unresolved' && !s.isResolved);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 8.1 Page Heading */}
      <div className="pb-3 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Chat History
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Return to previous conversations and continue troubleshooting.
        </p>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#EDE6D6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#77736D] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts by title or error..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFAED] border border-[#EDE6D6] rounded-full text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'resolved', 'unresolved'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterState(mode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filterState === mode
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#FFFAED] text-[#77736D] border border-[#EDE6D6] hover:text-[#171717]'
              }`}
            >
              {mode} Issues
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List: White list items against the cream workspace */}
      <div className="space-y-3">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className="bg-white rounded-3xl border border-[#EDE6D6] p-5 shadow-xs hover:border-[#D8D0BE] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#77736D]">
                  {session.id}
                </span>
                {session.isResolved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#DDECCB] text-[#2D4E14]">
                    <CheckCircle2 className="w-3 h-3 text-[#4B7926]" />
                    Resolved
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6E58D] text-[#5C4D0A]">
                    <Clock className="w-3 h-3 text-[#967C0E]" />
                    Unresolved / Ticket Opened
                  </span>
                )}
                {session.ticketId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBDDF5] text-[#3E2459]">
                    Ticket #{session.ticketId}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-[#171717] hover:text-[#080808]">
                {session.title}
              </h4>
              <p className="text-xs text-[#77736D] line-clamp-1">{session.transcript}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#77736D] font-mono">{session.date}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReopenChat(session.title);
                }}
                className="px-4 py-1.5 rounded-full bg-[#FFFAED] hover:bg-[#F3EEDF] border border-[#EDE6D6] text-xs font-semibold text-[#171717] flex items-center gap-1"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-lg w-full shadow-2xl border border-[#EDE6D6] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-[#EDE6D6] bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#77736D]">
                  {selectedSession.id}
                </span>
                <h3 className="font-bold text-[#171717] text-base mt-0.5">
                  {selectedSession.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="w-8 h-8 rounded-full bg-[#FFFAED] border border-[#EDE6D6] flex items-center justify-center text-[#77736D] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#EDE6D6] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#77736D]">
                  Recorded Transcript
                </span>
                <p className="text-[#171717] whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedSession.transcript}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => onReopenChat(selectedSession.title)}
                  className="px-4 py-2 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222]"
                >
                  Reopen in AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
