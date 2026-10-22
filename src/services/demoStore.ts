/**
 * AI IT Helpdesk Copilot - Centralized Demo Data Service & Store
 * Features persistent state in localStorage, reactive subscriptions,
 * realistic SIH25195 enterprise dataset, and role-based demo sessions.
 */

import {
  User,
  UserRole,
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  KnowledgeArticle,
  AuditLogEntry,
  RoutingRule,
  SLAConfig,
} from '../types';
import { AIService } from './aiService';

// Standard Demo Credentials
export const DEMO_ACCOUNTS: Array<{
  email: string;
  password: string;
  user: User;
  roleBadge: string;
}> = [
  {
    email: 'employee@helpdesk.demo',
    password: 'Employee@123',
    roleBadge: 'Requester / Employee',
    user: {
      id: 'USR-EMP-01',
      name: 'Shivani Devanekar',
      email: 'employee@helpdesk.demo',
      role: 'employee',
      department: 'Information Technology (Final Year)',
      title: 'B.E. Student & Tech Researcher',
      activeStatus: 'active',
    },
  },
  {
    email: 'engineer@helpdesk.demo',
    password: 'Engineer@123',
    roleBadge: 'L2 Support Engineer',
    user: {
      id: 'USR-ENG-02',
      name: 'Vikram Malhotra',
      email: 'engineer@helpdesk.demo',
      role: 'engineer',
      department: 'IT Infrastructure & Operations',
      title: 'Senior Systems & Network Engineer',
      activeStatus: 'active',
    },
  },
  {
    email: 'admin@helpdesk.demo',
    password: 'Admin@123',
    roleBadge: 'Service Desk Manager',
    user: {
      id: 'USR-ADM-03',
      name: 'Dr. Rajesh Kulkarni',
      email: 'admin@helpdesk.demo',
      role: 'admin',
      department: 'IT Service Management & Academic Operations',
      title: 'Head of IT Services & Faculty Lead',
      activeStatus: 'active',
    },
  },
];

// Initial Realistic Seed Tickets
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'HD-1041',
    title: 'Department Network Printer LaserJet 400 Offline and Jammed',
    description:
      'The shared network printer on Lab Floor 3 is showing paper jam error code 13.02.00, and print jobs sent from Linux and Windows workstations are queued indefinitely.',
    requesterId: 'USR-EMP-01',
    requesterName: 'Shivani Devanekar',
    requesterEmail: 'employee@helpdesk.demo',
    department: 'Information Technology (Final Year)',
    category: 'Printing & Peripherals',
    aiSuggestedCategory: 'Printing & Peripherals',
    confirmedCategory: 'Printing & Peripherals',
    priority: 'Medium',
    aiSuggestedPriority: 'Medium',
    confirmedPriority: 'Medium',
    status: 'In Progress',
    assignedToId: 'USR-ENG-02',
    assignedToName: 'Vikram Malhotra',
    affectedService: 'Network Office Print Services',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    slaHours: 8,
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    slaBreached: false,
    troubleshootingHistory: [
      {
        step: 'Checked physical paper tray 2 for obstructions',
        result: 'worked',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        step: 'Restarted local workstation print spooler',
        result: 'failed',
        timestamp: new Date(Date.now() - 3.8 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    aiIntelligence: {
      summary: 'Printer paper jam code 13.02 on Lab Floor 3; local spooler restarted without clear queue response.',
      rootCauseHypothesis: 'Tray 2 paper sensor obstruction combined with locked network spooler socket on 10.20.4.15.',
      suggestedResolution: 'Physically clear rear roller path, purge server-side job queue via cups/print-mgmt, restart printer firmware.',
      confidenceScore: 0.94,
      similarTickets: [
        { id: 'HD-0892', title: 'Floor 3 Network Printer Spooler Freezing on PDF Batches', resolution: 'Restarted spooler service and updated PCL6 generic driver.' },
        { id: 'HD-0954', title: 'HP LaserJet Tray 2 roller jammed with cardstock', resolution: 'Cleaned pickup rollers and tested 50 pages.' },
      ],
      suggestedKbArticles: [
        { id: 'KB-101', title: 'Connecting to Network Printers & Clearing Stuck Spooler Jobs' },
        { id: 'KB-104', title: 'Supported Paper Weights and Clearing Jammed Feeder Trays' },
      ],
      suggestionStatus: 'accepted',
    },
    comments: [
      {
        id: 'c-1',
        authorId: 'USR-EMP-01',
        authorName: 'Shivani Devanekar',
        authorRole: 'employee',
        message: 'Several students need to print project reports for today review session. Kindly prioritize.',
        timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'c-2',
        authorId: 'USR-ENG-02',
        authorName: 'Vikram Malhotra',
        authorRole: 'engineer',
        message: 'On site now. Inspected rear duplex unit and pulled out a torn scrap. Running internal print diagnostic.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInternal: false,
      },
    ],
  },
  {
    id: 'HD-1038',
    title: 'Enterprise VPN Client Fails Handshake with Error 412',
    description:
      'Attempting to connect to GlobalProtect remote campus VPN from off-campus broadband fails after entering MFA credential with gateway timeout.',
    requesterId: 'USR-EMP-04',
    requesterName: 'Aarav Sharma',
    requesterEmail: 'aarav.sharma@helpdesk.demo',
    department: 'Computer Engineering',
    category: 'Network & VPN',
    aiSuggestedCategory: 'Network & VPN',
    confirmedCategory: 'Network & VPN',
    priority: 'High',
    aiSuggestedPriority: 'High',
    confirmedPriority: 'High',
    status: 'Open',
    assignedToId: 'USR-ENG-02',
    assignedToName: 'Vikram Malhotra',
    affectedService: 'GlobalProtect / Cisco AnyConnect VPN Gateway',
    createdAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    slaHours: 4,
    slaDeadline: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
    slaBreached: false,
    troubleshootingHistory: [
      {
        step: 'Flushed DNS and renewed DHCP lease',
        result: 'failed',
        timestamp: new Date(Date.now() - 1.4 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    aiIntelligence: {
      summary: 'Off-campus user experiencing VPN Error 412 gateway timeout during SSL handshake.',
      rootCauseHypothesis: 'Client device root certificate expiration or MTU fragmentation over ISP router.',
      suggestedResolution: 'Verify client certificate validity in certmgr.msc and adjust client MTU size to 1340.',
      confidenceScore: 0.91,
      similarTickets: [
        { id: 'HD-0781', title: 'GlobalProtect VPN error: Connection terminated by gateway', resolution: 'Re-enrolled corporate device root certificate.' },
      ],
      suggestedKbArticles: [
        { id: 'KB-102', title: 'Enterprise VPN Setup, Gateway Endpoints & SSL Certificate Renewal' },
      ],
      suggestionStatus: 'pending',
    },
    comments: [
      {
        id: 'c-3',
        authorId: 'USR-EMP-04',
        authorName: 'Aarav Sharma',
        authorRole: 'employee',
        message: 'Need VPN access to query the PostgreSQL research cluster.',
        timestamp: new Date(Date.now() - 1.2 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'HD-1029',
    title: 'PostgreSQL Database Access Denied for Final Year Lab Cluster',
    description:
      'Permission denied error 28000 when authenticating to research db host pg-lab-01.mgmt.internal using department credentials.',
    requesterId: 'USR-EMP-01',
    requesterName: 'Shivani Devanekar',
    requesterEmail: 'employee@helpdesk.demo',
    department: 'Information Technology (Final Year)',
    category: 'Software & Access',
    aiSuggestedCategory: 'Software & Access',
    confirmedCategory: 'Software & Access',
    priority: 'High',
    aiSuggestedPriority: 'High',
    confirmedPriority: 'High',
    status: 'Resolved',
    assignedToId: 'USR-ENG-02',
    assignedToName: 'Vikram Malhotra',
    affectedService: 'PostgreSQL Research DB Cluster',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    slaHours: 4,
    slaDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    slaBreached: false,
    resolutionNotes:
      'Whitelisted project subnet IP in pg_hba.conf and granted read-write role to sih_project_group with pgvector extension enabled.',
    satisfactionRating: {
      score: 5,
      comment: 'Very fast resolution! Our team was able to proceed with database indexing tests.',
      ratedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    aiIntelligence: {
      summary: 'Database connection authentication failed with error 28000 on pg-lab-01.',
      rootCauseHypothesis: 'Subnet access restriction in pg_hba.conf or missing role grant.',
      suggestedResolution: 'Add pg_hba entry for CIDR block and re-grant connection role.',
      confidenceScore: 0.89,
      similarTickets: [],
      suggestedKbArticles: [
        { id: 'KB-105', title: 'Standard IT Software Catalog & License Provisioning Workflow' },
      ],
      suggestionStatus: 'accepted',
    },
    comments: [
      {
        id: 'c-4',
        authorId: 'USR-ENG-02',
        authorName: 'Vikram Malhotra',
        authorRole: 'engineer',
        message: 'Updated pg_hba.conf rules and refreshed daemon. Please verify credentials.',
        timestamp: new Date(Date.now() - 6.5 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'c-5',
        authorId: 'USR-EMP-01',
        authorName: 'Shivani Devanekar',
        authorRole: 'employee',
        message: 'Tested connection via psql and pgAdmin. Working perfectly now!',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'HD-1033',
    title: 'Microsoft 365 Exchange Mailbox Sync Loop on Outlook Desktop',
    description:
      'Employee mailbox keeps asking for password in recurring loop despite entering correct credentials.',
    requesterId: 'USR-EMP-05',
    requesterName: 'Priya Iyer',
    requesterEmail: 'priya.iyer@helpdesk.demo',
    department: 'Electronics & Telecommunication',
    category: 'Email & Communication',
    aiSuggestedCategory: 'Email & Communication',
    confirmedCategory: 'Email & Communication',
    priority: 'Medium',
    aiSuggestedPriority: 'Medium',
    confirmedPriority: 'Medium',
    status: 'Pending',
    assignedToId: 'USR-ENG-02',
    assignedToName: 'Vikram Malhotra',
    affectedService: 'Microsoft 365 Exchange Online',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    slaHours: 8,
    slaDeadline: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    slaBreached: true,
    aiIntelligence: {
      summary: 'Outlook desktop recurring password authentication loop.',
      rootCauseHypothesis: 'Corrupted Modern Authentication ADAL/WAM token cache in Windows Credential Manager.',
      suggestedResolution: 'Clear Office16 credentials from Credential Manager and run SaRA diagnostic tool.',
      confidenceScore: 0.88,
      similarTickets: [
        { id: 'HD-0998', title: 'Account lockout loop caused by outdated credentials', resolution: 'Cleared generic credentials in Windows Credential Manager.' },
      ],
      suggestedKbArticles: [
        { id: 'KB-108', title: 'Clearing Stale Credentials in Windows Credential Manager' },
      ],
      suggestionStatus: 'accepted',
    },
    comments: [
      {
        id: 'c-6',
        authorId: 'USR-ENG-02',
        authorName: 'Vikram Malhotra',
        authorRole: 'engineer',
        message: 'Waiting for employee to test in Outlook Web App before resetting credentials.',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
  {
    id: 'HD-1025',
    title: 'Server Room Core Switch Power Supply Redundancy Warning',
    description:
      'SNMP trap alert received from Cisco Catalyst 9300 core switch in Datacenter Rack B-04. Secondary PSU 2 failed self-test.',
    requesterId: 'USR-ENG-02',
    requesterName: 'Vikram Malhotra',
    requesterEmail: 'engineer@helpdesk.demo',
    department: 'IT Infrastructure & Operations',
    category: 'Hardware',
    aiSuggestedCategory: 'Hardware',
    confirmedCategory: 'Hardware',
    priority: 'Critical',
    aiSuggestedPriority: 'Critical',
    confirmedPriority: 'Critical',
    status: 'Escalated',
    assignedToId: 'USR-ADM-03',
    assignedToName: 'Dr. Rajesh Kulkarni',
    affectedService: 'Campus Core Networking Backbone',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaHours: 1,
    slaDeadline: new Date(Date.now() - 35 * 3600 * 1000).toISOString(),
    slaBreached: true,
    aiIntelligence: {
      summary: 'Core switch redundant power supply PSU-2 hardware failure.',
      rootCauseHypothesis: 'Internal capacitor blowout on secondary hot-swap power module.',
      suggestedResolution: 'Dispatch replacement 715W AC module under Cisco Smart Net Total Care contract.',
      confidenceScore: 0.96,
      similarTickets: [],
      suggestedKbArticles: [],
      suggestionStatus: 'accepted',
    },
    comments: [
      {
        id: 'c-7',
        authorId: 'USR-ADM-03',
        authorName: 'Dr. Rajesh Kulkarni',
        authorRole: 'admin',
        message: 'Escalated to vendor hardware replacement engineer. RMA #774102 dispatching today.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  },
];

// Initial Knowledge Base Articles
const INITIAL_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-101',
    title: 'Connecting to Network Printers & Clearing Stuck Spooler Jobs',
    category: 'Printing & Peripherals',
    tags: ['Printer', 'Spooler', 'Paper Jam', 'Windows 11'],
    readTime: '3 min read',
    summary: 'Step-by-step instructions on connecting to campus network printers and clearing frozen print queues.',
    content:
      'Learn how to clear stuck print jobs without restarting your workstation, and configure the default campus print server bindings.',
    steps: [
      'Press Windows Key + R, enter "services.msc" and press Enter.',
      'Scroll to "Print Spooler", right-click and click "Stop".',
      'Navigate to "C:\\Windows\\System32\\spool\\PRINTERS" and delete all temp files.',
      'Return to services window, right-click "Print Spooler" and click "Start".',
      'Print a single test page to verify smooth job delivery.',
    ],
    views: 412,
    helpfulCount: 68,
    status: 'published',
    createdBy: 'Vikram Malhotra',
    createdAt: '2026-09-12',
  },
  {
    id: 'KB-102',
    title: 'Enterprise VPN Setup, Gateway Endpoints & SSL Certificate Renewal',
    category: 'Network & VPN',
    tags: ['VPN', 'Remote Access', 'GlobalProtect', 'Security'],
    readTime: '4 min read',
    summary: 'Standard configuration guide for off-campus secure tunneling to campus servers and digital libraries.',
    content:
      'Detailed procedure to configure the Cisco / GlobalProtect VPN client with multi-factor authentication tokens.',
    steps: [
      'Install the official campus VPN client package from IT software portal.',
      'Enter the primary portal URL: "vpn.enterprise.sih.gov.in".',
      'Authenticate with your corporate email and Active Directory password.',
      'Approve the push notification prompt on your registered Microsoft Authenticator app.',
      'Once connected, verify your assigned 10.x.x.x IP address via cmd "ipconfig".',
    ],
    views: 680,
    helpfulCount: 114,
    status: 'published',
    createdBy: 'Dr. Rajesh Kulkarni',
    createdAt: '2026-08-20',
  },
  {
    id: 'KB-103',
    title: 'Self-Service Password Reset (SSPR) & MFA Token Resynchronization',
    category: 'Security & Credentials',
    tags: ['Password', 'MFA', 'SSO', 'Account Lock'],
    readTime: '2 min read',
    summary: 'How to unlock your corporate account and resynchronize hardware/software OTP codes.',
    content:
      'Resolve authentication failures independently through the self-service identity gateway without waiting for IT desk triage.',
    steps: [
      'Visit the SSPR portal at https://identity.sih.gov.in/sspr from any trusted phone or browser.',
      'Enter your full institutional email address and solve the security captcha.',
      'Select your secondary verification method (SMS OTP or authenticator prompt).',
      'Choose a new password meeting the 12-character complexity requirements.',
      'Allow 2-3 minutes for the password to synchronize across all domain controllers.',
    ],
    views: 890,
    helpfulCount: 142,
    status: 'published',
    createdBy: 'Vikram Malhotra',
    createdAt: '2026-07-15',
  },
  {
    id: 'KB-104',
    title: 'Supported Paper Weights and Clearing Jammed Feeder Trays',
    category: 'Printing & Peripherals',
    tags: ['Hardware', 'Paper Jam', 'Maintenance'],
    readTime: '3 min read',
    summary: 'Guidelines on paper specifications to avoid mechanical jams in departmental high-volume printers.',
    content: 'Understand paper tray limits and proper extraction techniques to avoid tearing sensor flags.',
    steps: [
      'Only load standard 75 to 80 GSM paper in Tray 2.',
      'Ensure the paper guide slides snugly against the stack without buckling.',
      'In case of a jam, open Door A gently and pull the paper along the natural feed path.',
      'Never use sharp pens or metal scissors to dislodge paper fragments.',
    ],
    views: 240,
    helpfulCount: 39,
    status: 'published',
    createdBy: 'Vikram Malhotra',
    createdAt: '2026-09-01',
  },
  {
    id: 'KB-105',
    title: 'Resolution Guide: Clearing Stale Modern Auth Credentials in Windows',
    category: 'Email & Communication',
    tags: ['Outlook', 'Credentials', 'Exchange', 'SSO'],
    readTime: '3 min read',
    summary: 'Engineer draft based on resolution of repeated Outlook authentication loops.',
    content:
      'Draft knowledge article created from verified resolution on ticket HD-1033. Describes registry key cleanup and Credential Vault reset.',
    steps: [
      'Close all Microsoft 365 desktop applications.',
      'Open Windows Control Panel -> User Accounts -> Credential Manager -> Windows Credentials.',
      'Under Generic Credentials, remove all items with "MicrosoftOffice16_Data" or "msteams".',
      'Reboot workstation and sign back into Outlook with fresh modern auth prompt.',
    ],
    views: 18,
    helpfulCount: 4,
    status: 'draft_pending_approval',
    createdBy: 'Vikram Malhotra',
    createdAt: '2026-10-21',
    originatingTicketId: 'HD-1033',
  },
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: new Date(Date.now() - 3.8 * 3600 * 1000).toISOString(),
    actorId: 'USR-EMP-01',
    actorName: 'Shivani Devanekar',
    actorRole: 'employee',
    action: 'Created Ticket',
    targetType: 'ticket',
    targetId: 'HD-1041',
    details: 'Submitted ticket after AI troubleshooting session failed to resolve printer paper jam.',
  },
  {
    id: 'aud-2',
    timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    actorId: 'USR-ENG-02',
    actorName: 'Vikram Malhotra',
    actorRole: 'engineer',
    action: 'Accepted AI Suggestion & Assigned',
    targetType: 'ticket',
    targetId: 'HD-1041',
    details: 'Accepted AI suggested category (Printing & Peripherals) and priority (Medium). Assigned ticket to self.',
  },
  {
    id: 'aud-3',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    actorId: 'USR-ENG-02',
    actorName: 'Vikram Malhotra',
    actorRole: 'engineer',
    action: 'Resolved Ticket',
    targetType: 'ticket',
    targetId: 'HD-1029',
    details: 'Configured pg_hba.conf subnet access and marked ticket resolved with resolution notes.',
  },
  {
    id: 'aud-4',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    actorId: 'USR-EMP-01',
    actorName: 'Shivani Devanekar',
    actorRole: 'employee',
    action: 'Submitted CSAT Rating',
    targetType: 'ticket',
    targetId: 'HD-1029',
    details: 'Rated ticket resolution 5/5 stars with positive feedback comment.',
  },
  {
    id: 'aud-5',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actorId: 'USR-ADM-03',
    actorName: 'Dr. Rajesh Kulkarni',
    actorRole: 'admin',
    action: 'Escalated Ticket & Vendor RMA',
    targetType: 'ticket',
    targetId: 'HD-1025',
    details: 'Escalated switch PSU failure to Cisco RMA #774102 under emergency maintenance protocol.',
  },
];

// Initial Routing Rules
const INITIAL_ROUTING_RULES: RoutingRule[] = [
  {
    id: 'RR-1',
    category: 'Hardware',
    priority: 'Critical',
    assignedTeam: 'Infrastructure & Data Center Ops',
    defaultAssigneeId: 'USR-ENG-02',
    defaultAssigneeName: 'Vikram Malhotra',
    slaHours: 1,
  },
  {
    id: 'RR-2',
    category: 'Network & VPN',
    priority: 'High',
    assignedTeam: 'Network Engineering Team',
    defaultAssigneeId: 'USR-ENG-02',
    defaultAssigneeName: 'Vikram Malhotra',
    slaHours: 4,
  },
  {
    id: 'RR-3',
    category: 'Security & Credentials',
    priority: 'High',
    assignedTeam: 'Identity & Access Management',
    defaultAssigneeId: 'USR-ENG-02',
    defaultAssigneeName: 'Vikram Malhotra',
    slaHours: 2,
  },
  {
    id: 'RR-4',
    category: 'Printing & Peripherals',
    priority: 'Medium',
    assignedTeam: 'Campus End-User Support',
    defaultAssigneeId: 'USR-ENG-02',
    defaultAssigneeName: 'Vikram Malhotra',
    slaHours: 8,
  },
  {
    id: 'RR-5',
    category: 'Software & Access',
    priority: 'Medium',
    assignedTeam: 'Application & Database Services',
    defaultAssigneeId: 'USR-ENG-02',
    defaultAssigneeName: 'Vikram Malhotra',
    slaHours: 8,
  },
];

// Initial SLA Targets
const INITIAL_SLA_CONFIGS: SLAConfig[] = [
  { priority: 'Critical', responseTimeMinutes: 15, resolutionTimeHours: 1 },
  { priority: 'High', responseTimeMinutes: 30, resolutionTimeHours: 4 },
  { priority: 'Medium', responseTimeMinutes: 60, resolutionTimeHours: 8 },
  { priority: 'Low', responseTimeMinutes: 120, resolutionTimeHours: 24 },
];

const STORAGE_KEYS = {
  USER: 'ai_helpdesk_current_user',
  TICKETS: 'ai_helpdesk_tickets_v1',
  ARTICLES: 'ai_helpdesk_articles_v1',
  AUDIT_LOGS: 'ai_helpdesk_audit_logs_v1',
  ROUTING: 'ai_helpdesk_routing_rules_v1',
  SLA: 'ai_helpdesk_sla_config_v1',
  USERS: 'ai_helpdesk_registered_users_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Listener callback error', e);
    }
  });
}

export const DemoStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Current authenticated user session
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    // Default to employee for convenience if unset
    return DEMO_ACCOUNTS[0].user;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      this.addAuditLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'User Sign In',
        targetType: 'auth',
        targetId: user.id,
        details: `Signed into role ${user.role} (${user.email}).`,
      });
    } else {
      const prev = this.getCurrentUser();
      if (prev) {
        this.addAuditLog({
          actorId: prev.id,
          actorName: prev.name,
          actorRole: prev.role,
          action: 'User Sign Out',
          targetType: 'auth',
          targetId: prev.id,
          details: `Session cleared for ${prev.name}.`,
        });
      }
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    notify();
  },

  // Authenticate demo credentials
  authenticate(email: string, pass: string): { success: boolean; user?: User; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === trimmedEmail && a.password === pass
    );

    if (account) {
      this.setCurrentUser(account.user);
      return { success: true, user: account.user };
    }

    // Check newly registered demo users
    const registered = this.getRegisteredUsers().find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (registered && pass.length >= 6) {
      this.setCurrentUser(registered);
      return { success: true, user: registered };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please click one of the quick demo role buttons below.',
    };
  },

  // Registered users list
  getRegisteredUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEMO_ACCOUNTS.map((a) => a.user);
  },

  registerUser(name: string, email: string, department: string): User {
    const newUser: User = {
      id: `USR-EMP-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'employee', // Always default to employee for security
      department: department.trim() || 'General Operations',
      title: 'Department Team Member',
      activeStatus: 'active',
    };

    const users = this.getRegisteredUsers();
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.addAuditLog({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: 'employee',
      action: 'Account Created',
      targetType: 'user',
      targetId: newUser.id,
      details: `New employee registered from ${newUser.department}.`,
    });

    notify();
    return newUser;
  },

  updateUserRole(userId: string, newRole: UserRole) {
    const current = this.getCurrentUser();
    if (current?.role !== 'admin') {
      throw new Error('Only administrators may modify user role assignments.');
    }

    const users = this.getRegisteredUsers().map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If current user modified own role, update session
    if (current.id === userId) {
      this.setCurrentUser({ ...current, role: newRole });
    }

    this.addAuditLog({
      actorId: current.id,
      actorName: current.name,
      actorRole: current.role,
      action: 'Role Modified',
      targetType: 'user',
      targetId: userId,
      details: `Changed role to ${newRole}.`,
    });

    notify();
  },

  // Tickets CRUD
  getTickets(): Ticket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  },

  getTicketById(id: string): Ticket | undefined {
    return this.getTickets().find((t) => t.id === id);
  },

  createTicket(payload: {
    title: string;
    description: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    affectedService?: string;
    troubleshootingHistory?: Ticket['troubleshootingHistory'];
  }): Ticket {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[0].user;

    // Run AI classification & priority suggestions
    const classification = AIService.understandAndClassify(
      `${payload.title} ${payload.description}`
    );
    const category = payload.category || classification.category;

    const prioritySuggestion = AIService.suggestPriority(
      `${payload.title} ${payload.description}`,
      category
    );
    const priority = payload.priority || prioritySuggestion.priority;

    const similar = AIService.retrieveSimilarTicketsAndArticles(
      payload.description,
      category
    );

    const nextIdNum = 1042 + this.getTickets().length - INITIAL_TICKETS.length;
    const ticketId = `HD-${nextIdNum}`;

    const slaHours = priority === 'Critical' ? 1 : priority === 'High' ? 4 : priority === 'Medium' ? 8 : 24;

    const newTicket: Ticket = {
      id: ticketId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      department: currentUser.department,

      category: category,
      aiSuggestedCategory: classification.category,

      priority: priority,
      aiSuggestedPriority: prioritySuggestion.priority,

      status: 'Open',
      affectedService: payload.affectedService || classification.affectedService,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      slaHours: slaHours,
      slaDeadline: new Date(Date.now() + slaHours * 3600 * 1000).toISOString(),
      slaBreached: false,

      troubleshootingHistory: payload.troubleshootingHistory || [],
      aiIntelligence: {
        summary: `${currentUser.name} reported ${category.toLowerCase()} issue: ${payload.title}.`,
        rootCauseHypothesis: `Potential issue with ${payload.affectedService || classification.affectedService}.`,
        suggestedResolution: `Follow standard diagnostic runbook for ${category}. Check connectivity and access tokens.`,
        confidenceScore: classification.confidence,
        similarTickets: similar.similarTickets,
        suggestedKbArticles: similar.suggestedArticles,
        suggestionStatus: 'pending',
        originalAiCategory: classification.category,
        originalAiPriority: prioritySuggestion.priority,
      },
      comments: [
        {
          id: `c-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          message: payload.description,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    // Auto-routing based on rules
    const rules = this.getRoutingRules();
    const matchingRule = rules.find((r) => r.category === category);
    if (matchingRule) {
      newTicket.assignedToId = matchingRule.defaultAssigneeId;
      newTicket.assignedToName = matchingRule.defaultAssigneeName;
      newTicket.status = 'Assigned';
    }

    const tickets = [newTicket, ...this.getTickets()];
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));

    this.addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Created Ticket',
      targetType: 'ticket',
      targetId: newTicket.id,
      details: `Created "${newTicket.title}" [${newTicket.category} / ${newTicket.priority}]`,
    });

    notify();
    return newTicket;
  },

  updateTicket(id: string, updates: Partial<Ticket>): Ticket {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[0].user;
    const tickets = this.getTickets();
    let updatedTicket: Ticket | undefined;

    const newTickets = tickets.map((t) => {
      if (t.id === id) {
        updatedTicket = {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // If resolving, record resolvedAt
        if (updates.status === 'Resolved' && !t.resolvedAt) {
          updatedTicket.resolvedAt = new Date().toISOString();
        }

        return updatedTicket;
      }
      return t;
    });

    if (!updatedTicket) throw new Error(`Ticket ${id} not found`);

    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(newTickets));

    const changeSummary = Object.keys(updates)
      .map((k) => `${k}: ${(updates as any)[k]}`)
      .join(', ');

    this.addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Updated Ticket',
      targetType: 'ticket',
      targetId: id,
      details: `Modified: ${changeSummary}`,
    });

    notify();
    return updatedTicket;
  },

  addTicketComment(
    ticketId: string,
    message: string,
    isInternal: boolean = false
  ): Ticket {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[0].user;
    const comment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternal,
    };

    const tickets = this.getTickets();
    let updated: Ticket | undefined;

    const newTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        updated = {
          ...t,
          updatedAt: new Date().toISOString(),
          comments: [...t.comments, comment],
        };
        return updated;
      }
      return t;
    });

    if (!updated) throw new Error(`Ticket ${ticketId} not found`);

    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(newTickets));

    this.addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: isInternal ? 'Added Internal Note' : 'Added Comment',
      targetType: 'ticket',
      targetId: ticketId,
      details: message.slice(0, 80) + (message.length > 80 ? '...' : ''),
    });

    notify();
    return updated;
  },

  rateTicketResolution(
    ticketId: string,
    score: number,
    comment?: string
  ): Ticket {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[0].user;
    return this.updateTicket(ticketId, {
      satisfactionRating: {
        score,
        comment,
        ratedAt: new Date().toISOString(),
      },
    });
  },

  // Knowledge Base
  getKnowledgeArticles(): KnowledgeArticle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  },

  createKnowledgeArticle(payload: {
    title: string;
    category: TicketCategory;
    summary: string;
    content: string;
    steps: string[];
    originatingTicketId?: string;
  }): KnowledgeArticle {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[1].user;
    const nextId = `KB-${100 + this.getKnowledgeArticles().length + 1}`;

    const newArticle: KnowledgeArticle = {
      id: nextId,
      title: payload.title.trim(),
      category: payload.category,
      tags: [payload.category, 'Troubleshooting', 'Runbook'],
      readTime: '3 min read',
      summary: payload.summary.trim(),
      content: payload.content.trim(),
      steps: payload.steps,
      views: 1,
      helpfulCount: 0,
      status: currentUser.role === 'admin' ? 'published' : 'draft_pending_approval',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
      originatingTicketId: payload.originatingTicketId,
    };

    const articles = [newArticle, ...this.getKnowledgeArticles()];
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));

    this.addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Created KB Draft',
      targetType: 'kb',
      targetId: newArticle.id,
      details: `Created article "${newArticle.title}" (Status: ${newArticle.status})`,
    });

    notify();
    return newArticle;
  },

  updateKnowledgeArticleStatus(
    id: string,
    status: 'published' | 'draft_pending_approval' | 'rejected'
  ) {
    const currentUser = this.getCurrentUser() || DEMO_ACCOUNTS[2].user;
    const articles = this.getKnowledgeArticles().map((a) => {
      if (a.id === id) return { ...a, status };
      return a;
    });

    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));

    this.addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `KB ${status === 'published' ? 'Approved' : 'Status Updated'}`,
      targetType: 'kb',
      targetId: id,
      details: `Updated KB article ${id} to ${status}.`,
    });

    notify();
  },

  voteArticleHelpful(id: string) {
    const articles = this.getKnowledgeArticles().map((a) => {
      if (a.id === id) return { ...a, helpfulCount: a.helpfulCount + 1 };
      return a;
    });
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    notify();
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  },

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...logs.slice(0, 150)];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  },

  // Routing Rules
  getRoutingRules(): RoutingRule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTING);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.ROUTING, JSON.stringify(INITIAL_ROUTING_RULES));
    return INITIAL_ROUTING_RULES;
  },

  updateRoutingRule(rule: RoutingRule) {
    const rules = this.getRoutingRules().map((r) => (r.id === rule.id ? rule : r));
    localStorage.setItem(STORAGE_KEYS.ROUTING, JSON.stringify(rules));
    notify();
  },

  // SLA Configs
  getSLAConfigs(): SLAConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SLA);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.SLA, JSON.stringify(INITIAL_SLA_CONFIGS));
    return INITIAL_SLA_CONFIGS;
  },

  updateSLAConfig(config: SLAConfig) {
    const configs = this.getSLAConfigs().map((c) =>
      c.priority === config.priority ? config : c
    );
    localStorage.setItem(STORAGE_KEYS.SLA, JSON.stringify(configs));
    notify();
  },

  // Reset all data to factory demo state
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ROUTING);
    localStorage.removeItem(STORAGE_KEYS.SLA);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.ROUTING, JSON.stringify(INITIAL_ROUTING_RULES));
    localStorage.setItem(STORAGE_KEYS.SLA, JSON.stringify(INITIAL_SLA_CONFIGS));
    notify();
  },
};
