# AI IT Helpdesk Copilot (PowerGrid Copilot)
### Smart Helpdesk Ticketing Solution for IT Services (SIH25195)

> **Academic Project:** Final-Year B.E. Information Technology  
> **Institution:** Mahatma Gandhi Mission's College of Engineering & Technology, Navi Mumbai  
> **Problem Statement ID:** SIH25195 (Smart Automation / IT Support Services)

---

## Table of Contents
1. [Quickstart: Install & Run](#1-quickstart-install--run)
2. [Project Overview & Architecture](#2-project-overview--architecture)
3. [Structure of the Demo Services](#3-structure-of-the-demo-services)
   - [Centralized State & Demo Store (`demoStore.ts`)](#centralized-state--demo-store-demostorets)
   - [Replaceable AI Service Interface (`aiService.ts`)](#replaceable-ai-service-interface-aiservicets)
   - [Data Models & TypeScript Entities (`src/types/index.ts`)](#data-models--typescript-entities-srctypesindexts)
4. [Demo Accounts & Role Credentials](#4-demo-accounts--role-credentials)
5. [Guide for Project Review & Walkthrough](#5-guide-for-project-review--walkthrough)
6. [Design System & UI/UX Tokens](#6-design-system--uiux-tokens)
7. [Directory Structure](#7-directory-structure)

---

## 1. Quickstart: Install & Run

Follow these simple steps to run the application locally:

### Prerequisites
- **Node.js**: `v18.x`, `v20.x`, or higher installed (`node -v`)
- **npm**: `v9.x` or higher installed (`npm -v`)

### Step 1: Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

### Step 2: Environment Variables
Create your local environment file by copying the template:
```bash
cp .env.example .env
```
*(No external API keys are required for the review prototype; the built-in AI triage service and demo store run locally out-of-the-box).*

### Step 3: Start the Development Server
```bash
npm run dev
```
Once the dev server starts, open your browser and navigate to:
```
http://localhost:3000
```

### Additional Available Scripts
- `npm run build`: Compiles the production build into the `dist/` folder.
- `npm run preview`: Previews the compiled production build locally.
- `npm run lint`: Runs TypeScript static type checking (`tsc --noEmit`).

---

## 2. Project Overview & Architecture

**AI IT Helpdesk Copilot** (branded as **PowerGrid Copilot**) is an intelligent enterprise IT support solution designed for government utilities and large enterprises under Smart India Hackathon problem statement **SIH25195**.

### Three Core Architectural Pillars:
1. **Natural Language Processing (NLP)**: Understands user incident reports, extracts keywords, maps them to IT domains, and infers severity priority.
2. **Retrieval-Augmented Generation (RAG)**: Retrieves approved technical runbooks and historical resolutions to generate step-by-step diagnostic actions.
3. **Role-Based Workflow Automation**: Manages a shared ticket lifecycle across Employees, IT Engineers, and Administrators with SLA deadline tracking.

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI IT Helpdesk Copilot                          │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│  Employee Portal  │  IT Engineer Portal  │   Administrator Portal      │
│  - AI Copilot     │  - Queue Workload    │   - Operations Analytics    │
│  - Step Checkpoint│  - AI Intelligence   │   - Ticket Reassignment     │
│  - Ticket Logging │  - SLA Deadlines     │   - User Role (RBAC)        │
│  - CSAT Feedback  │  - KB Runbook Draft  │   - Routing & SLA Config    │
└─────────┬─────────┴──────────┬───────────┴──────────────┬──────────────┘
          │                    │                          │
          ▼                    ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Centralized Demo Store (demoStore.ts)                    │
│   - localStorage Persistence & Reactive Event Subscriptions            │
│   - Shared Ticket Lifecycle (Open → Assigned → In Progress → Resolved) │
│   - Audit Trail Recording & SLA Urgency Monitoring                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Replaceable AI Service Interface (aiService.ts)            │
│   1. understandAndClassify()        4. retrieveSimilarTickets()        │
│   2. suggestPriority()              5. generateResolutionDirection()   │
│   3. retrieveTroubleshootingSteps() 6. summarizeTicket()               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Structure of the Demo Services

The application isolates all backend data persistence, business logic, and AI inference into two modular TypeScript services located in `src/services/`. This ensures the frontend prototype can later be seamlessly connected to a live Node.js/Express REST API and PostgreSQL database without restructuring UI components.

### Centralized State & Demo Store (`demoStore.ts`)

The `DemoStore` singleton acts as an in-memory and persistent client-side data store using `localStorage`. It implements an Observer Pattern (`subscribe`/`notify`) so that whenever data changes (e.g. an employee logs a ticket or an engineer marks one resolved), all active views update reactively without a page reload.

#### Key Methods:
| Method | Purpose |
| :--- | :--- |
| `authenticate(email, pass)` | Validates credentials against demo accounts or registered users; initializes session. |
| `getCurrentUser()` / `setCurrentUser()` | Manages current session state and logs sign-in/out audit entries. |
| `getTickets()` | Retrieves all tickets, initializing with preloaded sample tickets if empty. |
| `getTicketById(id)` | Fetches a single ticket with full history, comments, and AI intelligence metadata. |
| `createTicket(payload)` | Runs automated AI classification, assigns unique ID (e.g., `HD-1042`), maps default routing rule, calculates SLA deadline, and appends to store. |
| `updateTicket(id, updates)` | Applies status transitions, category/priority overrides, or resolution notes. |
| `addTicketComment(id, message, isInternal)` | Appends public comments or engineering-only internal notes. |
| `rateTicketResolution(id, score, comment)` | Captures employee CSAT ratings (1–5 stars) for resolved tickets. |
| `getKnowledgeArticles()` | Retrieves approved runbooks and pending engineer drafts. |
| `createKnowledgeArticle(payload)` | Creates an article draft (status: `draft_pending_approval`) from a verified ticket resolution. |
| `updateKnowledgeArticleStatus(id, status)` | Admin action to approve or reject pending runbook drafts. |
| `getAuditLogs()` / `addAuditLog()` | Maintains an immutable chronological log of actions, actors, and targets. |
| `getRoutingRules()` / `getSLAConfigs()` | Reads and updates automated dispatch rules and SLA hour matrices. |
| `resetDemoData()` | Resets all entities to factory demo dataset with 1-click confirmation. |

---

### Replaceable AI Service Interface (`aiService.ts`)

Adheres strictly to the **six-function AI service specification** defined in the project architecture:

1. **`understandAndClassify(text: string)`**:
   - Performs NLP keyword and intent parsing.
   - Categorizes into: `Printing & Peripherals`, `Network & VPN`, `Security & Credentials`, `Software & Access`, `Hardware`, or `Email & Communication`.
   - Returns confidence score and affected service endpoint.

2. **`suggestPriority(text, category, scope)`**:
   - Evaluates operational impact, outage terms, and affected users.
   - Returns priority (`Critical`, `High`, `Medium`, `Low`) and a written rationale.

3. **`retrieveTroubleshootingSteps(text, category)`**:
   - Retrieves structured, step-by-step diagnostic procedures.
   - Supplies actionable checks, instructions, and terminal commands.

4. **`retrieveSimilarTicketsAndArticles(text, category)`**:
   - Simulates RAG vector similarity to historical incident resolutions and verified Knowledge Base IDs.

5. **`generateResolutionDirection(ticket)`**:
   - Formulates engineering guidance, root cause hypotheses, and recommended fixes for L2/L3 engineers.

6. **`summarizeTicket(ticket)`**:
   - Generates executive 2-line handover summaries for queues and shift reports.

---

### Data Models & TypeScript Entities (`src/types/index.ts`)

- **`User`**: `id`, `name`, `email`, `role ('employee' | 'engineer' | 'admin')`, `department`, `activeStatus`.
- **`Ticket`**:
  - `id`: Unique stable identifier (e.g. `HD-1041`)
  - `title`, `description`, `affectedService`
  - `category` vs. `aiSuggestedCategory` vs. `confirmedCategory` (preserves human override vs. AI proposal)
  - `priority` vs. `aiSuggestedPriority` vs. `confirmedPriority`
  - `status`: `'Open' | 'Assigned' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Escalated'`
  - `slaHours`, `slaDeadline`, `slaBreached`
  - `aiIntelligence`: Summary, root cause hypothesis, suggested resolution, similar past tickets
  - `comments`: Threaded comments with `isInternal` flag for engineer-only notes
  - `resolutionNotes`: Formal fix summary
  - `satisfactionRating`: 1–5 star CSAT score with feedback comment
- **`KnowledgeArticle`**: `id`, `title`, `category`, `steps`, `status ('published' | 'draft_pending_approval' | 'rejected')`, `helpfulCount`.
- **`AuditLogEntry`**: `timestamp`, `actorName`, `actorRole`, `action`, `targetType`, `targetId`, `details`.
- **`RoutingRule` & `SLAConfig`**: Category triggers, default assignees, and response/resolution hour targets.

---

## 4. Demo Accounts & Role Credentials

For university viva presentations and evaluation reviews, three public demonstration accounts are configured:

| Role Account | Email Address | Password | Intended Workflow |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@helpdesk.demo` | `Employee@123` | Self-service AI chat, diagnostic checkpoints, personal ticket tracking, CSAT rating |
| **IT Engineer** | `engineer@helpdesk.demo` | `Engineer@123` | Workload queue, SLA urgency sorting, AI Intelligence panel, ticket resolution, runbook drafting |
| **Admin / Manager** | `admin@helpdesk.demo` | `Admin@123` | Operational metrics, category distribution, user RBAC management, SLA policy, runbook approvals |

> **Pro-Tip for Evaluators:** Click any of the 3 role buttons on the login card to auto-fill credentials instantly, or use the role switcher on the top demo banner to switch personas in real-time.

---

## 5. Guide for Project Review & Walkthrough

Use this verified 16-step script to demonstrate the complete end-to-end system during your academic viva:

| Step | Action | What to Demonstrate & Explain |
| :---: | :--- | :--- |
| **1** | **Open App** | Show the clean sign-in screen matching the warm ivory and near-black design language. |
| **2** | **Sign In as Employee** | Click the **Employee** card (`employee@helpdesk.demo`) and sign in. |
| **3** | **Start AI Copilot** | The app opens to **AI Assistant Copilot**. Click the prompt pill `"Floor 3 printer spooler error"` or describe an issue. |
| **4** | **Step Checkpoints** | Show how AI provides step-by-step guidance in white cards. Click **✓ Worked** or **✗ Failed** on steps. |
| **5** | **Escalate to Ticket** | Click **No, Create Support Ticket**. Point out that the ticket title, description, category, and troubleshooting history are pre-filled by AI. Click **Submit Ticket**. |
| **6** | **Record Ticket ID** | Note the newly generated ticket ID (e.g. `HD-1042`). |
| **7** | **Switch to IT Engineer** | Use the top demo banner to switch to **IT Engineer** (`engineer@helpdesk.demo`). |
| **8** | **Locate Ticket in Queue** | Open **My Queue**. Point out that the newly created ticket appears with an active SLA countdown timer. |
| **9** | **AI Intelligence Panel** | Click **Triage & AI**. Highlight the clear separation between **AI Suggested** values and **Human Confirmed** values. |
| **10** | **Engineer Overrides** | Click **Accept AI Suggestion** or click **Change Priority**. Assign the ticket to yourself and mark **In Progress**. |
| **11** | **Resolve Ticket** | Click **✓ Mark Resolved**, enter official resolution notes, and confirm. |
| **12** | **Draft Runbook** | Click **Draft Knowledge Base Article** from the resolution. Note that the draft is marked as *Pending Admin Approval*. |
| **13** | **Switch to Employee** | Switch back to **Employee**. Open **My Tickets**, open the resolved ticket, read the resolution notes, and rate the resolution **5 stars**. |
| **14** | **Switch to Admin** | Switch to **Admin / Manager** (`admin@helpdesk.demo`). |
| **15** | **Verify Analytics & Approvals** | View the **Operations Dashboard**—KPI cards, category bar charts, and CSAT average reflect the resolved ticket. Open **Knowledge Base** to approve the engineer's draft runbook. |
| **16** | **Inspect Audit Trail** | Open **Audit Trail** to demonstrate an immutable, chronological record of every action, actor, timestamp, and target entity. |

---

## 6. Design System & UI/UX Tokens

The application follows the custom **PowerGrid Copilot** design specification:

- **Main Workspace Background:** `#FFFAED` (Warm ivory)
- **Sidebar Background:** `#1B1B1B` (Near-black panel with `rounded-3xl` corners and outer margins)
- **Active Navigation Pill:** Pure white pill (`bg-white text-[#171717] rounded-full`) with `#F8D2E8` pink notification pill
- **AI Conversation Panels:** `#F3EEDF` (Soft beige container)
- **Employee Message Panels:** `#F7F2E4` (Cream-beige container)
- **Primary Buttons:** High-contrast `#080808` rounded pills (`rounded-full`) with `#FFFFFF` text
- **Secondary Buttons:** White / cream rounded pills with subtle `#EDE6D6` hairline borders
- **Pastel Status Accents:**
  - Lavender (`#EBDDF5`): Assistant identity and *In Progress* tickets
  - Pink (`#F8D2E8`): Brand lightning icon and *Escalated* incidents
  - Yellow (`#F6E58D`): Step number badges and *Pending / Awaiting Action*
  - Pale Green (`#DDECCB`): Verified runbooks and *Resolved* status
- **Typography:** `Plus Jakarta Sans` for clean, approachable enterprise readability

---

## 7. Directory Structure

```
├── .env.example               # Environment variables template
├── index.html                 # HTML entry point with Plus Jakarta Sans & metadata
├── metadata.json              # AI Studio project descriptors and capabilities
├── package.json               # Dependencies and execution scripts
├── tsconfig.json              # TypeScript compilation configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── README.md                  # Comprehensive documentation and setup guide
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
