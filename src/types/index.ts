/**
 * AI IT Helpdesk Copilot - Type Definitions
 * Smart India Hackathon SIH25195: Smart Helpdesk Ticketing Solution for IT Services
 */

export type UserRole = 'employee' | 'engineer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  activeStatus: 'active' | 'offline' | 'busy';
  title?: string;
}

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Pending'
  | 'Resolved'
  | 'Closed'
  | 'Escalated';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketCategory =
  | 'Hardware'
  | 'Software & Access'
  | 'Network & VPN'
  | 'Email & Communication'
  | 'Printing & Peripherals'
  | 'Security & Credentials';

export interface TroubleshootingStep {
  step: string;
  result: 'worked' | 'failed' | 'skipped';
  timestamp: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface AIIntelligence {
  summary: string;
  rootCauseHypothesis: string;
  suggestedResolution: string;
  confidenceScore: number;
  similarTickets: Array<{
    id: string;
    title: string;
    resolution: string;
  }>;
  suggestedKbArticles: Array<{
    id: string;
    title: string;
  }>;
  suggestionStatus: 'pending' | 'accepted' | 'rejected' | 'modified';
  originalAiCategory?: TicketCategory;
  originalAiPriority?: TicketPriority;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  department: string;

  // AI-suggested vs human-confirmed classification
  category: TicketCategory;
  aiSuggestedCategory: TicketCategory;
  confirmedCategory?: TicketCategory;

  priority: TicketPriority;
  aiSuggestedPriority: TicketPriority;
  confirmedPriority?: TicketPriority;

  status: TicketStatus;
  assignedToId?: string;
  assignedToName?: string;
  affectedService: string;

  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;

  slaHours: number;
  slaDeadline: string; // ISO string
  slaBreached: boolean;

  troubleshootingHistory?: TroubleshootingStep[];
  aiIntelligence: AIIntelligence;

  comments: TicketComment[];
  resolutionNotes?: string;
  satisfactionRating?: {
    score: number; // 1-5
    comment?: string;
    ratedAt: string;
  };
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: TicketCategory;
  tags: string[];
  readTime: string;
  summary: string;
  content: string;
  steps: string[];
  views: number;
  helpfulCount: number;
  status: 'published' | 'draft_pending_approval' | 'rejected';
  createdBy: string;
  createdAt: string;
  originatingTicketId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'ticket' | 'user' | 'kb' | 'config' | 'auth';
  targetId: string;
  details: string;
}

export interface RoutingRule {
  id: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignedTeam: string;
  defaultAssigneeId: string;
  defaultAssigneeName: string;
  slaHours: number;
}

export interface SLAConfig {
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeHours: number;
}
