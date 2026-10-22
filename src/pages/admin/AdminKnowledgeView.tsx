import React from 'react';
import { KnowledgeArticle, User } from '../../types';
import { DemoStore } from '../../services/demoStore';
import { AlertTriangle, Check, X } from 'lucide-react';

interface AdminKnowledgeViewProps {
  user: User;
  articles: KnowledgeArticle[];
}

export const AdminKnowledgeView: React.FC<AdminKnowledgeViewProps> = ({ user, articles }) => {
  const pendingDrafts = articles.filter((a) => a.status === 'draft_pending_approval');
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const handleApprove = (id: string) => {
    DemoStore.updateKnowledgeArticleStatus(id, 'published');
  };

  const handleReject = (id: string) => {
    DemoStore.updateKnowledgeArticleStatus(id, 'rejected');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-2 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Knowledge Base Management & Approvals
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Review engineer-drafted runbooks and authorize publication to the employee portal.
        </p>
      </div>

      {/* Pending Drafts Section */}
      <div className="bg-[#F7F2E4] border border-[#EDE6D6] rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#5C4D0A]" />
            <h3 className="font-bold text-[#171717] text-sm">
              Pending Runbook Drafts ({pendingDrafts.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#77736D]">
            Manager Authorization Required
          </span>
        </div>

        {pendingDrafts.length === 0 ? (
          <p className="text-xs text-[#77736D] italic">
            No drafts currently awaiting review. When engineers resolve a ticket and click "Draft Knowledge Base Article", it appears here for validation.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white p-5 rounded-2xl border border-[#EDE6D6] shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#171717] bg-[#F3EEDF] px-2.5 py-0.5 rounded-full uppercase">
                      {draft.category}
                    </span>
                    <h4 className="font-bold text-[#171717] text-sm mt-1">{draft.title}</h4>
                    <p className="text-[#77736D] text-[11px] mt-0.5">
                      Drafted by {draft.createdBy} on {draft.createdAt} · Originating Ticket:{' '}
                      <span className="font-mono font-bold">{draft.originatingTicketId || 'N/A'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(draft.id)}
                      className="px-4 py-1.5 rounded-full bg-[#080808] hover:bg-[#222222] text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(draft.id)}
                      className="px-4 py-1.5 rounded-full bg-white hover:bg-[#FFFAED] text-[#171717] border border-[#EDE6D6] font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>

                <p className="text-[#171717] leading-relaxed bg-[#FFFAED] p-3 rounded-xl border border-[#EDE6D6]">
                  {draft.summary}
                </p>

                {draft.steps && draft.steps.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-[#77736D] block text-[11px]">
                      Documented Resolution Steps:
                    </span>
                    {draft.steps.map((st, i) => (
                      <div key={i} className="text-[#171717] pl-2 border-l-2 border-[#F6E58D]">
                        {i + 1}. {st}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published Articles List */}
      <div className="bg-white rounded-3xl border border-[#EDE6D6] shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-[#171717] text-sm">
          Published Knowledge Runbooks ({publishedArticles.length})
        </h3>

        <div className="divide-y divide-[#EDE6D6] text-xs">
          {publishedArticles.map((art) => (
            <div key={art.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#77736D] text-[11px]">
                    {art.id}
                  </span>
                  <span className="font-bold text-[#171717]">{art.title}</span>
                </div>
                <div className="text-[11px] text-[#77736D] mt-0.5">
                  {art.category} · {art.views} Views · {art.helpfulCount} Helpful Votes · Author: {art.createdBy}
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#2D4E14] bg-[#DDECCB] px-3 py-0.5 rounded-full">
                Published
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
