# AI IT Helpdesk Copilot (PowerGrid Copilot)
### Smart Helpdesk Ticketing Solution for IT Services (SIH25195)

> **Academic Project:** Final-Year B.E. Information Technology  
> **Institution:** Mahatma Gandhi Mission's College of Engineering & Technology, Navi Mumbai  
> **Problem Statement ID:** SIH25195 (Smart Automation / IT Support Services)

---

## 1. Overview

**AI IT Helpdesk Copilot** (branded as **PowerGrid Copilot**) is an intelligent enterprise IT support solution that combines Natural Language Processing (NLP), Retrieval-Augmented Generation (RAG), and rule-based workflow automation. It enables employees to resolve technical issues through guided, step-by-step troubleshooting, access verified organizational runbooks, and escalate unresolved incidents into structured support tickets.

The system features three interconnected, role-based portals sharing a single synchronized data lifecycle:
1. **Employee Portal (Self-Service & AI Copilot)**
2. **IT Support Engineer Portal (Triage, AI Intelligence & Remediation)**
3. **Administrator / Operations Manager Portal (Analytics, RBAC & SLA Policy)**

---

## 2. Technology Stack

As defined in the project architecture specification:

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS (v4), Lucide React, Motion |
| **Design System** | Warm Ivory (`#FFFAED`), Near-Black Sidebar (`#1B1B1B`), Soft Beige Panels (`#F3EEDF`), Plus Jakarta Sans |
| **Backend Architecture** | Node.js, Express, TypeScript, RESTful API endpoints |
| **Database Architecture** | PostgreSQL with `pgvector` extension for embedding-based knowledge retrieval |
| **AI Architecture** | NLP classifier (intent & category prediction), priority inference engine, RAG runbook retrieval, cloud LLM integration |
| **Development Tools** | Vite, VS Code, Git, GitHub, Postman |

---

## 3. Demo Credentials (For Evaluation & Review)

The application includes predefined demonstration accounts with 1-click credential auto-fill on the sign-in screen:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@helpdesk.demo` | `Employee@123` | AI troubleshooting, personal ticket logging, KB search, CSAT feedback |
| **IT Engineer** | `engineer@helpdesk.demo` | `Engineer@123` | Queue management, SLA tracking, AI intelligence panel, KB runbook drafting |
| **Admin / Manager**| `admin@helpdesk.demo` | `Admin@123` | Global dashboard, ticket reassignment, priority overrides, RBAC, SLA policies, KB approvals |

*Note: For evaluation walkthroughs, you can also use the top demonstration banner to toggle between roles instantly without re-typing passwords.*

---

## 4. Setup and Run Instructions

### Prerequisites
- **Node.js**: Version `18.x` or `20.x` or later
- **npm**: Version `9.x` or later (or `pnpm` / `yarn`)

### 1. Clone the Repository
```bash
git clone https://github.com/Shivani2965/helpdesk-.git
cd helpdesk-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Copy the sample environment file to create your local `.env`:
```bash
cp .env.example .env
```

Default contents of `.env`:
```env
# GEMINI_API_KEY: Optional key for live Gemini cloud LLM inference
GEMINI_API_KEY=""

# APP_URL: Local development host URL
APP_URL="http://localhost:3000"
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will start on **`http://localhost:3000`** (or the port specified in your console).

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
The compiled assets will be output to the `dist/` folder.

### 6. Preview Production Build
```bash
npm run preview
```

### 7. Run Code Quality & Lint Checks
```bash
npm run lint
```
Runs the TypeScript compiler (`tsc --noEmit`) to verify zero type errors.

---

## 5. Project Directory Structure

```
├── .env.example               # Environment variables template
├── index.html                 # HTML entry point with Plus Jakarta Sans & metadata
├── metadata.json              # AI Studio project descriptors and capabilities
├── package.json               # Dependencies and execution scripts
├── tsconfig.json              # TypeScript compilation configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── public/                    # Static assets
└── src/
    ├── main.tsx               # React application mounting point
    ├── index.css              # Tailwind CSS imports & exact color tokens
    ├── App.tsx                # Central state orchestrator and role router
    ├── types/
    │   └── index.ts           # Comprehensive TypeScript interfaces
    ├── services/
    │   ├── aiService.ts       # 6-function replaceable AI service interface
    │   └── demoStore.ts       # Centralized reactive data store with localStorage persistence
    ├── components/
    │   └── common/
    │       ├── DemoBanner.tsx # Academic review banner with instant role switcher
    │       ├── Navbar.tsx     # Top navigation bar with search & scope filters
    │       ├── Sidebar.tsx    # Persistent near-black #1B1B1B sidebar with pill navigation
    │       └── StatusBadge.tsx# Accessible pastel status & priority badges
    └── pages/
        ├── auth/
        │   ├── LoginPage.tsx  # Sign-in page with 1-click role accounts
        │   └── SignupPage.tsx # Employee registration form with validation
        ├── employee/
        │   ├── AIChatView.tsx # Section 4: AI Assistant Copilot & troubleshooting
        │   ├── EmployeeTicketsView.tsx # Section 5: My Tickets list, drawer & CSAT
        │   ├── CreateTicketView.tsx    # Section 6: Manual & prefilled ticket creation
        │   └── ChatHistoryView.tsx     # Section 8: Searchable session transcripts
        ├── engineer/
        │   └── EngineerQueueView.tsx   # Section 12: Ticket queue & AI Intelligence panel
        ├── admin/
        │   ├── AdminDashboard.tsx      # Section 11: Operational metrics & KPI charts
        │   ├── AdminTicketsView.tsx    # Global ticket management & override modal
        │   ├── UserManagementView.tsx  # RBAC user role administration
        │   ├── ConfigurationView.tsx   # Routing rules & SLA matrix configuration
        │   ├── AuditLogView.tsx        # Chronological audit trail
        │   └── AdminKnowledgeView.tsx  # Engineer runbook draft approvals
        └── common/
            ├── KnowledgeBaseView.tsx   # Section 7: Verified runbooks & step-by-step guides
            └── ProfileSettingsView.tsx # Section 10: Profile preferences & availability status
```

---

## 6. End-to-End Walkthrough Demonstration Script (Viva / Evaluation)

Follow these 16 steps during a live project review:

1. **Sign In**: Open the app and click the **Employee** demo account card (`employee@helpdesk.demo`), then click **Sign In**.
2. **AI Troubleshooting**: The app opens directly to the **AI Assistant Copilot**. Click the prompt pill `"Floor 3 printer spooler error"` or type your own issue.
3. **Interactive Diagnostics**: Inspect the AI response panel with separate white step cards, yellow step badges, and dark code blocks. Click the **Worked** / **Failed** checkpoint buttons.
4. **Escalate to Ticket**: Click **No, Create Support Ticket** (or **Escalate to Engineer**). Inspect the prefilled form with AI-predicted category and priority. Click **Submit Ticket**.
5. **Verify Confirmation**: Note the generated ticket ID (e.g. `HD-1042`).
6. **Switch to IT Engineer**: Use the top banner to switch to **IT Engineer** (`engineer@helpdesk.demo`).
7. **Inspect Engineer Queue**: Locate the newly created ticket in the high-density queue with its SLA countdown timer.
8. **AI Ticket Intelligence Panel**: Click **Review & AI** to open the ticket drawer. Note the separation between **AI-Suggested** and **Human-Confirmed** fields.
9. **Engineer Actions**: Click **Accept AI Suggestion** (or modify category/priority), click **Assign to Myself**, and mark **In Progress**.
10. **Resolve Ticket**: Click **Mark Resolved**, enter resolution notes (e.g., *"Replaced roller sensor scrap and restarted print spooler daemon"*), and confirm.
11. **Draft Runbook**: Click **Draft Knowledge Base Article** from the resolution. Notice it is submitted as `draft_pending_approval`.
12. **Switch to Employee**: Switch back to **Employee**. Open **My Tickets**, find the resolved ticket, view the engineer's notes, and submit a **5-star CSAT rating**.
13. **Switch to Admin / Manager**: Switch to **Admin / Manager** (`admin@helpdesk.demo`).
14. **Operations Dashboard**: Observe the live KPI cards, category distribution chart, and engineer workload stats updated from the live ticket.
15. **Runbook Approval**: Navigate to **Knowledge Base** in the admin sidebar, review the engineer's draft, and click **Approve & Publish**.
16. **Audit Trail**: Open **Audit Trail** to inspect chronological logging of all actions with exact timestamps, actors, and targets.

---

## 7. UI/UX Design System Specification

The application implements the custom design tokens specified in the project guidelines:

- **Workspace Background:** `#FFFAED` (Warm ivory)
- **Navigation Sidebar:** `#1B1B1B` (Near-black panel with `rounded-3xl` corners and outer margins)
- **Active Navigation Pill:** White pill (`bg-white text-[#171717] rounded-full`) with `#F8D2E8` pink counter badges
- **Conversation Panels:** `#F3EEDF` (Soft beige containers)
- **User Message Panels:** `#F7F2E4` (Cream-beige containers)
- **Primary Buttons:** High-contrast `#080808` rounded pills with `#FFFFFF` text
- **Secondary Buttons:** White / cream rounded pills with `#EDE6D6` hairline borders
- **Pastel Accents:**
  - Lavender (`#EBDDF5`): Assistant identity and *In Progress* state
  - Pink (`#F8D2E8`): Brand lightning icon and *Escalated* state
  - Yellow (`#F6E58D`): Step number badges and *Pending / Awaiting Action* state
  - Pale Green (`#DDECCB`): Verified runbooks and *Resolved* state
- **Typography:** `Plus Jakarta Sans` for clean, approachable enterprise readability

---

## 8. Resetting Demo Data

To restore the original sample tickets, knowledge base articles, and audit logs during an evaluation:
- Click the **"Reset Data"** button located on the top academic demo banner.
- Confirm the dialog to instantly restore factory demo state.
