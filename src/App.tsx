import React, { useState, useEffect } from 'react';
import { User, UserRole, Ticket, KnowledgeArticle, AuditLogEntry } from './types';
import { DemoStore } from './services/demoStore';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Employee Portal Views (Adhering to Sections 4, 5, 6, 7, 8, 10)
import { AIChatView } from './pages/employee/AIChatView';
import { EmployeeTicketsView } from './pages/employee/EmployeeTicketsView';
import { CreateTicketView } from './pages/employee/CreateTicketView';
import { ChatHistoryView } from './pages/employee/ChatHistoryView';

// Engineer Portal Views
import { EngineerQueueView } from './pages/engineer/EngineerQueueView';

// Admin Portal Views
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTicketsView } from './pages/admin/AdminTicketsView';
import { UserManagementView } from './pages/admin/UserManagementView';
import { ConfigurationView } from './pages/admin/ConfigurationView';
import { AuditLogView } from './pages/admin/AuditLogView';
import { AdminKnowledgeView } from './pages/admin/AdminKnowledgeView';

// Shared Common Views
import { KnowledgeBaseView } from './pages/common/KnowledgeBaseView';
import { ProfileSettingsView } from './pages/common/ProfileSettingsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(DemoStore.getCurrentUser());
  const [authView, setAuthView] = useState<'login' | 'signup' | null>(null);

  // Live persistent dataset
  const [tickets, setTickets] = useState<Ticket[]>(DemoStore.getTickets());
  const [articles, setArticles] = useState<KnowledgeArticle[]>(DemoStore.getKnowledgeArticles());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(DemoStore.getAuditLogs());

  // Navigation state: Default is 'chat' (AI Assistant) as specified in Section 4!
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Subscribe to central DemoStore for reactive updates
  useEffect(() => {
    const unsubscribe = DemoStore.subscribe(() => {
      setTickets([...DemoStore.getTickets()]);
      setArticles([...DemoStore.getKnowledgeArticles()]);
      setAuditLogs([...DemoStore.getAuditLogs()]);
      setCurrentUser(DemoStore.getCurrentUser());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUserChange = (newUser: User) => {
    setCurrentUser(newUser);
    setAuthView(null);
    setSelectedTicket(null);
    if (newUser.role === 'engineer') {
      setActiveTab('queue');
    } else if (newUser.role === 'admin') {
      setActiveTab('overview');
    } else {
      setActiveTab('chat');
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedTicket(null);
    if (role === 'engineer') {
      setActiveTab('queue');
    } else if (role === 'admin') {
      setActiveTab('overview');
    } else {
      setActiveTab('chat');
    }
  };

  const handleLogout = () => {
    DemoStore.setCurrentUser(null);
    setCurrentUser(null);
    setAuthView('login');
    setSelectedTicket(null);
  };

  if (!currentUser) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={handleUserChange}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleUserChange}
        onNavigateToSignup={() => setAuthView('signup')}
      />
    );
  }

  const role = currentUser.role;

  // Counts for sidebar badges
  const myOpenTicketsCount =
    role === 'employee'
      ? tickets.filter(
          (t) =>
            (t.requesterEmail.toLowerCase() === currentUser.email.toLowerCase() ||
              t.requesterId === currentUser.id) &&
            ['Open', 'Assigned', 'In Progress'].includes(t.status)
        ).length
      : tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  const pendingDraftsCount = articles.filter(
    (a) => a.status === 'draft_pending_approval'
  ).length;

  const renderContent = () => {
    // 1. Employee Portal Views
    if (role === 'employee') {
      switch (activeTab) {
        case 'chat':
          return (
            <AIChatView
              user={currentUser}
              initialPrompt={chatInitialPrompt}
              onTicketCreated={(newTicket) => {
                setSelectedTicket(newTicket);
              }}
              onViewTickets={() => {
                setActiveTab('tickets');
              }}
              onOpenKBArticle={() => {
                setActiveTab('kb');
              }}
            />
          );
        case 'tickets':
          return (
            <EmployeeTicketsView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              onOpenCreateTicket={() => setActiveTab('create_ticket')}
            />
          );
        case 'create_ticket':
          return (
            <CreateTicketView
              user={currentUser}
              onTicketCreated={(ticket) => {
                setSelectedTicket(ticket);
              }}
              onCancel={() => setActiveTab('chat')}
            />
          );
        case 'kb':
          return (
            <KnowledgeBaseView
              user={currentUser}
              articles={articles}
              onAskCopilot={(topic) => {
                setChatInitialPrompt(`Can you explain how to troubleshoot: "${topic}"?`);
                setActiveTab('chat');
              }}
            />
          );
        case 'history':
          return (
            <ChatHistoryView
              user={currentUser}
              tickets={tickets}
              onReopenChat={(prompt) => {
                setChatInitialPrompt(prompt);
                setActiveTab('chat');
              }}
              onCreateTicketFromChat={(title, desc) => {
                setActiveTab('create_ticket');
              }}
            />
          );
        case 'profile':
          return <ProfileSettingsView user={currentUser} onLogout={handleLogout} />;
        default:
          return (
            <AIChatView
              user={currentUser}
              initialPrompt={chatInitialPrompt}
              onTicketCreated={(newTicket) => {
                setSelectedTicket(newTicket);
              }}
              onViewTickets={() => {
                setActiveTab('tickets');
              }}
            />
          );
      }
    }

    // 2. IT Engineer Portal Views
    if (role === 'engineer') {
      switch (activeTab) {
        case 'queue':
          return (
            <EngineerQueueView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              viewMode="queue"
            />
          );
        case 'assigned':
          return (
            <EngineerQueueView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              viewMode="assigned"
            />
          );
        case 'ticket_history':
          return (
            <EngineerQueueView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              viewMode="history"
            />
          );
        case 'kb':
          return (
            <KnowledgeBaseView
              user={currentUser}
              articles={articles}
              onAskCopilot={(topic) => {
                setChatInitialPrompt(topic);
                setActiveTab('chat');
              }}
            />
          );
        case 'chat':
          return (
            <AIChatView
              user={currentUser}
              initialPrompt={chatInitialPrompt}
              onTicketCreated={(newTicket) => {
                setSelectedTicket(newTicket);
              }}
              onViewTickets={() => {
                setActiveTab('queue');
              }}
            />
          );
        case 'profile':
          return <ProfileSettingsView user={currentUser} onLogout={handleLogout} />;
        default:
          return (
            <EngineerQueueView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              viewMode="queue"
            />
          );
      }
    }

    // 3. Admin / Manager Portal Views
    if (role === 'admin') {
      switch (activeTab) {
        case 'overview':
          return (
            <AdminDashboard
              user={currentUser}
              tickets={tickets}
              articles={articles}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenTicket={(t) => {
                setSelectedTicket(t);
                setActiveTab('tickets');
              }}
            />
          );
        case 'tickets':
          return (
            <AdminTicketsView
              user={currentUser}
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
            />
          );
        case 'users':
          return <UserManagementView currentUser={currentUser} />;
        case 'config':
          return <ConfigurationView />;
        case 'kb':
          return <AdminKnowledgeView user={currentUser} articles={articles} />;
        case 'audit':
          return <AuditLogView auditLogs={auditLogs} />;
        case 'chat':
          return (
            <AIChatView
              user={currentUser}
              initialPrompt={chatInitialPrompt}
              onTicketCreated={(newTicket) => {
                setSelectedTicket(newTicket);
              }}
              onViewTickets={() => {
                setActiveTab('tickets');
              }}
            />
          );
        case 'profile':
          return <ProfileSettingsView user={currentUser} onLogout={handleLogout} />;
        default:
          return (
            <AdminDashboard
              user={currentUser}
              tickets={tickets}
              articles={articles}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenTicket={(t) => {
                setSelectedTicket(t);
                setActiveTab('tickets');
              }}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FFFAED] flex flex-col text-[#171717] antialiased">
      {/* Top Academic Demo Banner */}
      <DemoBanner currentRole={currentUser.role} onRoleSwitch={handleRoleSwitch} />

      {/* Persistent App Header (Navbar) */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onSearchScope={(scope) => {
          if (scope === 'Tickets') setActiveTab('tickets');
          if (scope === 'KB' || scope === 'Runbooks') setActiveTab('kb');
        }}
      />

      {/* Main Layout: Persistent Sidebar + Warm Ivory Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          role={currentUser.role}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            setSelectedTicket(null);
          }}
          openTicketsCount={myOpenTicketsCount}
          pendingDraftsCount={pendingDraftsCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* 3.3 Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
