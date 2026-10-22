import React, { useState } from 'react';
import { User, TicketCategory, TicketPriority, Ticket } from '../../types';
import { AIService } from '../../services/aiService';
import { DemoStore } from '../../services/demoStore';
import { Sparkles, Paperclip, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreateTicketViewProps {
  user: User;
  onTicketCreated: (ticket: Ticket) => void;
  onCancel: () => void;
}

export const CreateTicketView: React.FC<CreateTicketViewProps> = ({
  user,
  onTicketCreated,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Software & Access');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [affectedService, setAffectedService] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: TicketCategory;
    priority: TicketPriority;
    confidence: number;
  } | null>(null);

  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);

  // Trigger NLP classification as user types
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.trim().length > 15) {
      const classification = AIService.understandAndClassify(text);
      const prio = AIService.suggestPriority(text, classification.category);
      setAiSuggestion({
        category: classification.category,
        priority: prio.priority,
        confidence: classification.confidence,
      });
      // Optionally auto-set category if untouched
      setCategory(classification.category);
      setPriority(prio.priority);
      if (!affectedService) {
        setAffectedService(classification.affectedService);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket = DemoStore.createTicket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      affectedService: affectedService.trim() || 'General Enterprise Service',
    });

    setSubmittedTicket(newTicket);
    onTicketCreated(newTicket);
  };

  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#DDECCB] text-[#2D4E14] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-[#4B7926]" />
        </div>
        <h2 className="text-2xl font-bold text-[#171717]">
          Ticket #{submittedTicket.id} Submitted Successfully
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] max-w-md mx-auto leading-relaxed">
          Your request has been routed to {submittedTicket.assignedToName || 'IT Support'} with a {submittedTicket.slaHours}h SLA target.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => onCancel()}
            className="px-5 py-2.5 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222] shadow-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 6.1 Page Heading */}
      <div className="pb-3 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Create a Support Ticket
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Tell us what went wrong so the IT team can help you resolve it.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] p-6 sm:p-8 shadow-xs space-y-5">
        {aiSuggestion && (
          <div className="p-4 rounded-2xl bg-[#F7F2E4] border border-[#EDE6D6] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#171717]" />
              <span className="text-[#171717]">
                Suggested category:{' '}
                <span className="font-bold">{aiSuggestion.category}</span> · Suggested priority:{' '}
                <span className="font-bold">{aiSuggestion.priority}</span>
              </span>
            </div>
            <span className="text-[11px] text-[#77736D] font-mono">
              {(aiSuggestion.confidence * 100).toFixed(0)}% Match
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#171717] mb-1.5">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cannot connect to off-campus VPN gateway"
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe symptoms, exact error messages or codes, operating system, and steps you already tried..."
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#171717] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              >
                <option value="Network & VPN">Network & VPN</option>
                <option value="Security & Credentials">Security & Credentials</option>
                <option value="Printing & Peripherals">Printing & Peripherals</option>
                <option value="Software & Access">Software & Access</option>
                <option value="Hardware">Hardware</option>
                <option value="Email & Communication">Email & Communication</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#171717] mb-1.5">Priority / Impact</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              >
                <option value="Low">Low (General guidance / 24h SLA)</option>
                <option value="Medium">Medium (Workaround available / 8h SLA)</option>
                <option value="High">High (Impacting daily work / 4h SLA)</option>
                <option value="Critical">Critical (Complete work stoppage / 1h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#171717] mb-1.5">Affected Application or Service</label>
            <input
              type="text"
              value={affectedService}
              onChange={(e) => setAffectedService(e.target.value)}
              placeholder="e.g. GlobalProtect / Cisco VPN / Active Directory"
              className="w-full bg-[#FFFAED] border border-[#EDE6D6] rounded-2xl p-3 text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFAED] border border-[#EDE6D6] text-xs font-semibold text-[#171717] hover:bg-[#F3EEDF] transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5 text-[#77736D]" />
              Attach Screenshot or Log File
            </button>
          </div>

          {/* Submission Buttons */}
          <div className="pt-4 border-t border-[#EDE6D6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full bg-white border border-[#EDE6D6] text-xs font-semibold text-[#171717] hover:bg-[#F3EEDF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#080808] hover:bg-[#222222] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
