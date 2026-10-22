import React, { useState } from 'react';
import { User, KnowledgeArticle, TicketCategory } from '../../types';
import { DemoStore } from '../../services/demoStore';
import {
  Search,
  BookOpen,
  ThumbsUp,
  Eye,
  Clock,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface KnowledgeBaseViewProps {
  user: User;
  articles: KnowledgeArticle[];
  initialCategory?: string;
  onAskCopilot?: (topic: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  user,
  articles,
  initialCategory,
  onAskCopilot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Network and VPN',
    'Accounts and Access',
    'Email and Collaboration',
    'Hardware and Devices',
    'Software and Applications',
    'Security and Permissions',
  ];

  const visibleArticles = articles.filter((a) => {
    if (user.role === 'employee') return a.status === 'published';
    return true;
  });

  const filteredArticles = visibleArticles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      a.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 5));

    return matchesSearch && matchesCategory;
  });

  const handleVote = (id: string) => {
    if (votedArticles[id]) return;
    DemoStore.voteArticleHelpful(id);
    setVotedArticles((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 7.1 Page Heading */}
      <div className="pb-3 border-b border-[#EDE6D6]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
          Knowledge Base
        </h2>
        <p className="text-xs sm:text-sm text-[#77736D] mt-0.5">
          Find verified guides and solutions for common IT issues.
        </p>
      </div>

      {/* 7.2 Prominent Search Field */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#77736D] absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an issue, application, error code, or solution..."
          className="w-full pl-12 pr-4 py-3 bg-white text-xs sm:text-sm text-[#171717] placeholder-[#77736D] rounded-full border border-[#EDE6D6] focus:outline-none focus:ring-1 focus:ring-[#171717] shadow-xs"
        />
      </div>

      {/* 7.3 Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white text-[#77736D] border border-[#EDE6D6] hover:bg-[#F3EEDF] hover:text-[#171717]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 7.4 Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white rounded-3xl border border-[#EDE6D6] p-5 sm:p-6 shadow-xs hover:border-[#D8D0BE] transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F3EEDF] text-[#171717]">
                  {article.category}
                </span>
                <span className="text-[11px] font-mono text-[#77736D]">
                  {article.readTime} · {article.views} views
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#171717] line-clamp-1 hover:text-[#080808]">
                {article.title}
              </h3>
              <p className="text-xs text-[#77736D] line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EDE6D6] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#77736D]">Verified by {article.createdBy}</span>
              <div className="flex items-center gap-2">
                {onAskCopilot && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskCopilot(article.title);
                    }}
                    className="text-[11px] font-semibold text-[#171717] hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-[#77736D]" />
                    Ask Copilot
                  </button>
                )}
                <span className="font-semibold text-[#171717] flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFAED] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#EDE6D6] overflow-hidden flex flex-col max-h-[88vh]">
            <div className="p-6 border-b border-[#EDE6D6] bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736D] bg-[#F3EEDF] px-2.5 py-0.5 rounded-full">
                  {selectedArticle.category}
                </span>
                <h3 className="font-bold text-[#171717] text-base mt-1.5">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-[#FFFAED] border border-[#EDE6D6] flex items-center justify-center text-[#77736D] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <p className="text-[#171717] leading-relaxed bg-white p-4 rounded-2xl border border-[#EDE6D6]">
                {selectedArticle.content}
              </p>

              <div>
                <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wider mb-3">
                  Step-by-Step Instructions
                </h4>
                <div className="space-y-2.5">
                  {selectedArticle.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-2xl border border-[#EDE6D6] flex items-start gap-3 shadow-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F6E58D] text-[#5C4D0A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-[#171717] text-xs leading-relaxed">{st}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback and Ask Copilot button */}
              <div className="pt-4 border-t border-[#EDE6D6] flex items-center justify-between">
                <button
                  onClick={() => handleVote(selectedArticle.id)}
                  disabled={votedArticles[selectedArticle.id]}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#EDE6D6] text-xs font-semibold text-[#171717] hover:bg-[#F3EEDF]"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#77736D]" />
                  <span>
                    {votedArticles[selectedArticle.id]
                      ? 'Helpful (Voted)'
                      : `Helpful (${selectedArticle.helpfulCount})`}
                  </span>
                </button>

                {onAskCopilot && (
                  <button
                    onClick={() => {
                      onAskCopilot(selectedArticle.title);
                      setSelectedArticle(null);
                    }}
                    className="px-4 py-2 rounded-full bg-[#080808] text-white text-xs font-semibold hover:bg-[#222222]"
                  >
                    Ask Copilot About This →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
