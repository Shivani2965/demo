import React, { useState, useEffect, useRef } from 'react';
import { User, TicketCategory, TicketPriority, TroubleshootingStep, Ticket } from '../../types';
import { AIService, ClassificationResult, PrioritySuggestion, TroubleshootingSuggestion } from '../../services/aiService';
import { DemoStore } from '../../services/demoStore';
import {
  Zap,
  Send,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Paperclip,
  Copy,
  Check,
  RotateCcw,
  Download,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';

interface AIChatViewProps {
  user: User;
  initialPrompt?: string;
  onTicketCreated: (ticket: Ticket) => void;
  onViewTickets: () => void;
  onOpenKBArticle?: (articleId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  classification?: ClassificationResult;
  prioritySuggestion?: PrioritySuggestion;
  troubleshooting?: TroubleshootingSuggestion;
  commands?: string[];
  sourceRef?: { id: string; title: string };
  feedbackGiven?: 'up' | 'down';
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  user,
  initialPrompt,
  onTicketCreated,
  onViewTickets,
  onOpenKBArticle,
}) => {
  const [sessionId] = useState(() => `SES-${Math.floor(1000 + Math.random() * 9000)}`);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! I am PowerGrid Copilot, your autonomous IT troubleshooting assistant grounded in verified engineering runbooks. You can describe any IT difficulty in natural language—such as VPN connection failures, printer queue jams, software access locks, or authentication timeouts.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceRef: {
        id: 'KB-100',
        title: 'Campus IT Services Guide & SLA Directory',
      },
    },
  ]);

  const [inputText, setInputText] = useState(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepResults, setStepResults] = useState<Record<number, 'worked' | 'failed' | 'skipped'>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Resolution status & CSAT
  const [isResolved, setIsResolved] = useState(false);
  const [csatRating, setCsatRating] = useState<number | null>(null);

  // Escalate / Prefilled Ticket Modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>('Network & VPN');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('High');
  const [affectedService, setAffectedService] = useState('');
  const [createdTicketResult, setCreatedTicketResult] = useState<Ticket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);
    setStepResults({});
    setIsResolved(false);

    // AI Processing pipeline simulation
    setTimeout(() => {
      const classification = AIService.understandAndClassify(query);
      const priority = AIService.suggestPriority(query, classification.category);
      const troubleshooting = AIService.retrieveTroubleshootingSteps(query, classification.category);
      const artifacts = AIService.retrieveSimilarTicketsAndArticles(query, classification.category);

      let command: string | undefined;
      if (classification.category === 'Network & VPN') {
        command = 'ipconfig /flushdns && ipconfig /renew';
      } else if (classification.category === 'Printing & Peripherals') {
        command = 'net stop spooler && del /Q %systemroot%\\System32\\Spool\\Printers\\*.* && net start spooler';
      }

      const source = artifacts.suggestedArticles[0] || {
        id: 'KB-102',
        title: 'Enterprise IT Runbook Reference',
      };

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I identified the likely cause in our approved ${classification.category} runbooks. Let's walk through these verified troubleshooting steps to restore normal service.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        classification,
        prioritySuggestion: priority,
        troubleshooting,
        commands: command ? [command] : undefined,
        sourceRef: source,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);

      // Set default ticket modal values in case user escalates
      setTicketTitle(query.length > 55 ? `${query.slice(0, 52)}...` : query);
      setTicketDescription(query);
      setTicketCategory(classification.category);
      setTicketPriority(priority.priority);
      setAffectedService(classification.affectedService);
    }, 600);
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleStepAction = (stepId: number, status: 'worked' | 'failed' | 'skipped') => {
    setStepResults((prev) => ({ ...prev, [stepId]: status }));
  };

  const handleThisSolvedIt = () => {
    setIsResolved(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-res-${Date.now()}`,
        sender: 'ai',
        text: `Glad to hear this solved your issue! The resolution has been logged under self-service remediation. No engineering ticket was required.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleOpenEscalation = () => {
    setShowTicketModal(true);
  };

  const handleSubmitEscalatedTicket = (e: React.FormEvent) => {
    e.preventDefault();

    const history: TroubleshootingStep[] = Object.entries(stepResults).map(([stepId, result]) => ({
      step: `Diagnostic Step #${stepId}`,
      result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    const newTicket = DemoStore.createTicket({
      title: ticketTitle,
      description: ticketDescription,
      category: ticketCategory,
      priority: ticketPriority,
      affectedService: affectedService,
      troubleshootingHistory: history,
    });

    setCreatedTicketResult(newTicket);
    setShowTicketModal(false);
    onTicketCreated(newTicket);

    setMessages((prev) => [
      ...prev,
      {
        id: `ai-tkt-${Date.now()}`,
        sender: 'ai',
        text: `Support Ticket #${newTicket.id} has been opened and assigned to ${newTicket.assignedToName || 'the IT Engineering Queue'} under ${newTicket.slaHours}h SLA. You can track updates under "My Tickets".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'user' ? user.name : 'PowerGrid Copilot'}:\n${m.text}\n`)
      .join('\n----------------------------------------\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Copilot-Transcript-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `m-welcome-${Date.now()}`,
        sender: 'ai',
        text: `New troubleshooting session started. Describe your IT issue or question to begin.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setStepResults({});
    setIsResolved(false);
    setCreatedTicketResult(null);
  };

  const suggestedQueries = [
    'Reset account authentication',
    'Resolve VPN connectivity',
    'Floor 3 printer spooler error',
    'Fix Docker memory issues',
    'Troubleshoot email synchronisation',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto space-y-4">
      {/* 4.1 Page Heading */}
      <div className="shrink-0 space-y-2 pb-3 border-b border-[#EDE6D6]">
        {/* Status Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDECCB] text-[#2D4E14] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4B7926]" />
              Active & Grounded to Verified IT Knowledge
            </span>
            <span className="text-[11px] font-mono text-[#77736D] px-2 py-0.5 rounded-full bg-white border border-[#EDE6D6]">
              {sessionId}
            </span>
          </div>

          {/* Heading Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTranscript}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#F3EEDF] text-[#171717] border border-[#EDE6D6] text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#77736D]" />
              Export Transcript
            </button>
            <button
              onClick={handleNewChat}
              className="px-4 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            AI Assistant Copilot
          </h2>
          <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
            Autonomous IT troubleshooting and verified engineering workflow remediation.
          </p>
        </div>
      </div>

      {/* Conversation Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            // 4.2 Employee Message Container
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-2xl bg-[#F7F2E4] border border-[#EDE6D6] rounded-3xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-bold">
                      {user.name.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#171717]">{user.name}</span>
                      <span className="text-[11px] text-[#77736D] ml-2 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-wrap pl-9">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          }

          // 4.3 AI Response Panel
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="w-full max-w-3xl bg-[#F3EEDF] border border-[#EDE6D6] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                {/* Assistant Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#EDE6D6]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#EBDDF5] flex items-center justify-center text-[#171717] shadow-xs">
                      <Zap className="w-4 h-4 fill-[#171717]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#171717]">
                          PowerGrid Copilot
                        </span>
                        <span className="text-[10px] font-semibold text-[#77736D] bg-white px-2 py-0.5 rounded-full border border-[#EDE6D6]">
                          NLP · Verified Runbook
                        </span>
                      </div>
                      <span className="text-[11px] text-[#77736D] font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === msg.id ? { ...m, feedbackGiven: 'up' } : m))
                        );
                      }}
                      className={`p-1.5 rounded-full hover:bg-white text-[#77736D] transition-colors ${
                        msg.feedbackGiven === 'up' ? 'bg-white text-[#2D4E14]' : ''
                      }`}
                      aria-label="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === msg.id ? { ...m, feedbackGiven: 'down' } : m))
                        );
                      }}
                      className={`p-1.5 rounded-full hover:bg-white text-[#77736D] transition-colors ${
                        msg.feedbackGiven === 'down' ? 'bg-white text-[#68194B]' : ''
                      }`}
                      aria-label="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                  {msg.text}
                </p>

                {/* 4.4 Troubleshooting Steps: White rounded cards */}
                {msg.troubleshooting && (
                  <div className="space-y-3 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#77736D]">
                      Recommended Remediation Sequence:
                    </div>

                    <div className="space-y-2.5">
                      {msg.troubleshooting.steps.map((st) => {
                        const currentStatus = stepResults[st.id];
                        return (
                          <div
                            key={st.id}
                            className="bg-white rounded-2xl border border-[#EDE6D6] p-4 shadow-xs space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                {/* Numbered circular badge using Yellow #F6E58D */}
                                <div className="w-6 h-6 rounded-full bg-[#F6E58D] text-[#5C4D0A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  {st.id}
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#171717] text-xs sm:text-sm">
                                    {st.instruction}
                                  </h4>
                                  <p className="text-[#77736D] text-xs mt-0.5 leading-relaxed">
                                    {st.actionableDetail}
                                  </p>
                                </div>
                              </div>

                              {currentStatus && (
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${
                                    currentStatus === 'worked'
                                      ? 'bg-[#DDECCB] text-[#2D4E14]'
                                      : currentStatus === 'failed'
                                      ? 'bg-[#F8D2E8] text-[#68194B]'
                                      : 'bg-[#F3EEDF] text-[#77736D]'
                                  }`}
                                >
                                  {currentStatus}
                                </span>
                              )}
                            </div>

                            {/* Step outcome actions */}
                            <div className="flex items-center gap-2 pt-1 border-t border-[#EDE6D6]/60">
                              <span className="text-[11px] text-[#77736D] font-medium mr-1">
                                Checkpoint:
                              </span>
                              <button
                                onClick={() => handleStepAction(st.id, 'worked')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'worked'
                                    ? 'bg-[#DDECCB] text-[#2D4E14] border border-[#CDE0B7]'
                                    : 'bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] hover:bg-[#DDECCB]'
                                }`}
                              >
                                ✓ Worked
                              </button>
                              <button
                                onClick={() => handleStepAction(st.id, 'failed')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'failed'
                                    ? 'bg-[#F8D2E8] text-[#68194B] border border-[#EEB9D9]'
                                    : 'bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] hover:bg-[#F8D2E8]'
                                }`}
                              >
                                ✗ Failed
                              </button>
                              <button
                                onClick={() => handleStepAction(st.id, 'skipped')}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  currentStatus === 'skipped'
                                    ? 'bg-[#171717] text-white'
                                    : 'bg-[#FFFAED] text-[#77736D] border border-[#EDE6D6] hover:bg-[#F3EEDF]'
                                }`}
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dark Rounded Code Command Block (if applicable) */}
                {msg.commands && msg.commands.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736D]">
                      Verified Terminal Remediation Command:
                    </span>
                    {msg.commands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="bg-[#1B1B1B] text-[#FFFAED] rounded-2xl p-3.5 font-mono text-xs flex items-center justify-between gap-3 shadow-xs"
                      >
                        <code className="overflow-x-auto">{cmd}</code>
                        <button
                          onClick={() => handleCopyCommand(cmd, idx)}
                          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-[#DDECCB]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4.5 Verified Knowledge Sources */}
                {msg.sourceRef && (
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#EDE6D6]">
                    <button
                      onClick={() => onOpenKBArticle && onOpenKBArticle(msg.sourceRef!.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FFFAED] border border-[#EDE6D6] text-[#171717] font-medium transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#77736D]" />
                      <span>Verified Reference · {msg.sourceRef.id} · {msg.sourceRef.title}</span>
                    </button>
                  </div>
                )}

                {/* 4.6 Response Actions */}
                {msg.troubleshooting && (
                  <div className="pt-3 border-t border-[#EDE6D6] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Black primary button: This Solved It */}
                      <button
                        onClick={handleThisSolvedIt}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          isResolved
                            ? 'bg-[#DDECCB] text-[#2D4E14] border border-[#CDE0B7]'
                            : 'bg-[#080808] hover:bg-[#222222] text-white shadow-xs'
                        }`}
                      >
                        ✓ This Solved It
                      </button>

                      {/* White secondary button: Escalate to Engineer */}
                      <button
                        onClick={handleOpenEscalation}
                        className="px-4 py-2 rounded-full bg-white hover:bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        Escalate to Engineer
                      </button>
                    </div>

                    <span className="text-[11px] text-[#77736D]">
                      Unresolved? Click Escalate to open a prefilled ticket.
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 p-4 bg-[#F3EEDF] rounded-3xl border border-[#EDE6D6] text-xs text-[#77736D] max-w-md">
            <Zap className="w-4 h-4 text-[#171717] fill-[#171717] animate-pulse" />
            <span>PowerGrid Copilot is retrieving verified runbooks and formulating steps...</span>
          </div>
        )}

        {/* Resolved feedback banner */}
        {isResolved && (
          <div className="p-4 rounded-3xl bg-[#DDECCB] border border-[#CDE0B7] text-[#2D4E14] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#4B7926]" />
              <span>Issue resolved via self-service troubleshooting. Rate this solution:</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setCsatRating(star)}
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    csatRating === star ? 'bg-[#2D4E14] text-white' : 'bg-white/60 text-[#2D4E14]'
                  }`}
                >
                  {star}★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Successfully logged ticket notification card */}
        {createdTicketResult && (
          <div className="p-5 rounded-3xl bg-white border border-[#EDE6D6] text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#171717]">
                  Support Ticket #{createdTicketResult.id} Dispatched
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBDDF5] text-[#3E2459]">
                  SLA: {createdTicketResult.slaHours}h Target
                </span>
              </div>
              <button
                onClick={onViewTickets}
                className="px-3.5 py-1.5 rounded-full bg-[#080808] text-white font-semibold text-xs hover:bg-[#222222]"
              >
                Track in My Tickets →
              </button>
            </div>
            <p className="text-[#77736D]">
              Assigned to engineer {createdTicketResult.assignedToName || 'Support Queue'}. You can track progress or reply to inquiries in your ticket panel.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4.8 Suggested Queries */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto py-1">
        <span className="text-[11px] font-bold text-[#77736D] uppercase mr-1">
          Suggestions:
        </span>
        {suggestedQueries.map((query) => (
          <button
            key={query}
            onClick={() => handleSendMessage(query)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F3EEDF] text-[#171717] border border-[#EDE6D6] text-xs font-medium whitespace-nowrap transition-all shadow-xs"
          >
            {query}
          </button>
        ))}
      </div>

      {/* 4.9 Message Composer */}
      <div className="shrink-0 bg-white rounded-3xl border border-[#EDE6D6] p-2.5 shadow-xs space-y-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[#FFFAED] text-[#77736D] transition-colors"
            title="Attach file or screenshot"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Copilot anything or describe your IT issue..."
            className="flex-1 text-xs sm:text-sm bg-transparent border-0 text-[#171717] placeholder-[#77736D] focus:outline-none"
            disabled={isProcessing}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="w-9 h-9 rounded-full bg-[#080808] hover:bg-[#222222] text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-center text-[#77736D] pt-1 border-t border-[#EDE6D6]/50">
          Responses are grounded in approved IT documentation & verified runbooks.
        </div>
      </div>

      {/* Prefilled Ticket Modal from Conversation */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-xl w-full shadow-2xl border border-[#EDE6D6] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#EDE6D6] bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736D]">
                  Escalation Workflow
                </span>
                <h3 className="font-bold text-[#171717] text-base mt-0.5">
                  Create a Support Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFFAED] border border-[#EDE6D6] flex items-center justify-center text-[#77736D] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEscalatedTicket} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#171717]">Category</label>
                    <span className="text-[10px] font-semibold text-[#68194B] bg-[#F8D2E8] px-2 py-0.5 rounded-full">
                      AI Suggested
                    </span>
                  </div>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as TicketCategory)}
                    className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                  >
                    <option value="Printing & Peripherals">Printing & Peripherals</option>
                    <option value="Network & VPN">Network & VPN</option>
                    <option value="Security & Credentials">Security & Credentials</option>
                    <option value="Software & Access">Software & Access</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Email & Communication">Email & Communication</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#171717]">Suggested Priority</label>
                    <span className="text-[10px] font-semibold text-[#5C4D0A] bg-[#F6E58D] px-2 py-0.5 rounded-full">
                      AI Evaluated
                    </span>
                  </div>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as TicketPriority)}
                    className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                  >
                    <option value="Low">Low (24h SLA)</option>
                    <option value="Medium">Medium (8h SLA)</option>
                    <option value="High">High (4h SLA)</option>
                    <option value="Critical">Critical (1h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171717] mb-1">Affected Service</label>
                <input
                  type="text"
                  value={affectedService}
                  onChange={(e) => setAffectedService(e.target.value)}
                  className="w-full bg-white border border-[#EDE6D6] rounded-xl p-2.5 text-[#171717]"
                  placeholder="e.g. Cisco AnyConnect VPN / ERP Gateway"
                />
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#EDE6D6]">
                <span className="font-bold text-[#171717] block mb-1">
                  Attached Troubleshooting History:
                </span>
                <p className="text-[#77736D] text-[11px]">
                  {Object.keys(stepResults).length > 0
                    ? `Pre-populated with ${Object.keys(stepResults).length} step diagnostic outcomes from this Copilot conversation.`
                    : 'Initial diagnostic transcript attached for engineering triage.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDE6D6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 rounded-full bg-white border border-[#EDE6D6] text-[#171717] font-semibold hover:bg-[#F3EEDF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#080808] hover:bg-[#222222] text-white font-semibold shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
