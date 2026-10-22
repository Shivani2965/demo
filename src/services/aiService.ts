/**
 * AI IT Helpdesk Copilot - Replaceable AI Service Interface
 * Implements the 6 core AI capabilities specified in SIH25195 architecture:
 * 1. understandAndClassify
 * 2. suggestPriority
 * 3. retrieveTroubleshootingSteps
 * 4. retrieveSimilarTicketsAndArticles
 * 5. generateResolutionDirection
 * 6. summarizeTicket
 */

import { TicketCategory, TicketPriority, TroubleshootingStep, Ticket } from '../types';

export interface ClassificationResult {
  category: TicketCategory;
  confidence: number;
  affectedService: string;
  detectedKeywords: string[];
}

export interface PrioritySuggestion {
  priority: TicketPriority;
  confidence: number;
  rationale: string;
}

export interface TroubleshootingSuggestion {
  category: TicketCategory;
  title: string;
  overview: string;
  steps: Array<{
    id: number;
    instruction: string;
    actionableDetail: string;
  }>;
}

export interface SimilarArtifacts {
  similarTickets: Array<{
    id: string;
    title: string;
    resolution: string;
  }>;
  suggestedArticles: Array<{
    id: string;
    title: string;
  }>;
}

export class AIService {
  /**
   * 1. NLP-based issue understanding & category prediction
   */
  static understandAndClassify(text: string): ClassificationResult {
    const lower = text.toLowerCase();

    if (
      lower.includes('printer') ||
      lower.includes('printing') ||
      lower.includes('paper jam') ||
      lower.includes('toner') ||
      lower.includes('scanner') ||
      lower.includes('spooler')
    ) {
      return {
        category: 'Printing & Peripherals',
        confidence: 0.94,
        affectedService: 'Network Office Print Services',
        detectedKeywords: ['printer', 'paper jam', 'spooler', 'hardware peripheral'],
      };
    }

    if (
      lower.includes('vpn') ||
      lower.includes('wifi') ||
      lower.includes('internet') ||
      lower.includes('network') ||
      lower.includes('dns') ||
      lower.includes('firewall') ||
      lower.includes('connection dropped')
    ) {
      return {
        category: 'Network & VPN',
        confidence: 0.91,
        affectedService: 'GlobalProtect / Cisco AnyConnect VPN Gateway',
        detectedKeywords: ['vpn', 'gateway', 'network tunnel', 'remote access'],
      };
    }

    if (
      lower.includes('password') ||
      lower.includes('mfa') ||
      lower.includes('2fa') ||
      lower.includes('locked out') ||
      lower.includes('sso') ||
      lower.includes('credentials') ||
      lower.includes('login failed')
    ) {
      return {
        category: 'Security & Credentials',
        confidence: 0.96,
        affectedService: 'Active Directory / Okta Identity Provider',
        detectedKeywords: ['password reset', 'mfa token', 'account lockout', 'sso'],
      };
    }

    if (
      lower.includes('email') ||
      lower.includes('outlook') ||
      lower.includes('mailbox') ||
      lower.includes('teams') ||
      lower.includes('slack') ||
      lower.includes('inbox')
    ) {
      return {
        category: 'Email & Communication',
        confidence: 0.89,
        affectedService: 'Microsoft 365 Exchange Online',
        detectedKeywords: ['outlook', 'mailbox sync', 'exchange', 'communication'],
      };
    }

    if (
      lower.includes('laptop') ||
      lower.includes('screen') ||
      lower.includes('monitor') ||
      lower.includes('battery') ||
      lower.includes('charger') ||
      lower.includes('keyboard') ||
      lower.includes('overheating') ||
      lower.includes('blue screen') ||
      lower.includes('bsod')
    ) {
      return {
        category: 'Hardware',
        confidence: 0.88,
        affectedService: 'Employee Workstation Hardware',
        detectedKeywords: ['workstation', 'display', 'hardware diagnostic', 'power/battery'],
      };
    }

    // Default to Software & Access
    return {
      category: 'Software & Access',
      confidence: 0.82,
      affectedService: 'Enterprise Application Suite',
      detectedKeywords: ['software license', 'application crash', 'access permissions'],
    };
  }

  /**
   * 2. Priority suggestion based on impact, keywords, and affected users
   */
  static suggestPriority(
    text: string,
    category: TicketCategory,
    affectedScope: 'individual' | 'team' | 'entire_dept' = 'individual'
  ): PrioritySuggestion {
    const lower = text.toLowerCase();

    if (
      lower.includes('production') ||
      lower.includes('critical') ||
      lower.includes('entire team') ||
      lower.includes('security breach') ||
      lower.includes('ransomware') ||
      lower.includes('server down') ||
      affectedScope === 'entire_dept'
    ) {
      return {
        priority: 'Critical',
        confidence: 0.95,
        rationale: 'High operational impact or departmental block detected. Requires immediate engineer triage under 1-hour SLA.',
      };
    }

    if (
      lower.includes('urgent') ||
      lower.includes('cannot work') ||
      lower.includes('client meeting') ||
      lower.includes('deadline today') ||
      lower.includes('blocked') ||
      affectedScope === 'team' ||
      category === 'Network & VPN'
    ) {
      return {
        priority: 'High',
        confidence: 0.89,
        rationale: 'Substantial workflow impediment affecting daily deliverables or team-level connectivity.',
      };
    }

    if (
      lower.includes('slow') ||
      lower.includes('printer') ||
      lower.includes('intermittent') ||
      category === 'Printing & Peripherals' ||
      category === 'Hardware'
    ) {
      return {
        priority: 'Medium',
        confidence: 0.84,
        rationale: 'Standard service request or non-blocking hardware/peripheral difficulty with viable alternative workarounds.',
      };
    }

    return {
      priority: 'Low',
      confidence: 0.81,
      rationale: 'Standard inquiry, non-urgent credential maintenance, or informational documentation request.',
    };
  }

  /**
   * 3. Knowledge retrieval & step-by-step troubleshooting suggestions
   */
  static retrieveTroubleshootingSteps(
    text: string,
    category: TicketCategory
  ): TroubleshootingSuggestion {
    const lower = text.toLowerCase();

    if (category === 'Printing & Peripherals' || lower.includes('printer')) {
      return {
        category: 'Printing & Peripherals',
        title: 'Network Printer Queue & Spooler Diagnostic',
        overview: 'Follow these 3 verified steps to check connectivity and clear stuck print jobs.',
        steps: [
          {
            id: 1,
            instruction: 'Clear Local Print Queue and Restart Spooler',
            actionableDetail: 'Press Win+R, type "services.msc", find "Print Spooler", click Restart. Delete any pending jobs in C:\\Windows\\System32\\spool\\PRINTERS.',
          },
          {
            id: 2,
            instruction: 'Verify Physical Tray & IP Ping',
            actionableDetail: 'Confirm Tray 2 has paper and no blinking amber error LED. Open cmd and type "ping 10.20.4.15" to test internal print server reachability.',
          },
          {
            id: 3,
            instruction: 'Re-add Printer via Company Self-Service Portal',
            actionableDetail: 'Open the MGM IT Portal -> Printers -> "Floor 3 HP LaserJet Enterprise" and click "Connect Driver".',
          },
        ],
      };
    }

    if (category === 'Network & VPN' || lower.includes('vpn')) {
      return {
        category: 'Network & VPN',
        title: 'Enterprise VPN Gateway Re-authentication',
        overview: 'Troubleshoot SSL handshake failures, DNS leaks, and captive portal conflicts.',
        steps: [
          {
            id: 1,
            instruction: 'Toggle VPN Adapter and Check Network Gateway',
            actionableDetail: 'Disconnect from VPN, disable Wi-Fi for 10 seconds, reconnect to your local network, and re-launch Cisco AnyConnect / GlobalProtect.',
          },
          {
            id: 2,
            instruction: 'Flush DNS Cache and Release DHCP Lease',
            actionableDetail: 'Run Command Prompt as Administrator and execute: "ipconfig /flushdns" followed by "ipconfig /renew".',
          },
          {
            id: 3,
            instruction: 'Verify Gateway Endpoint and Certificate',
            actionableDetail: 'Ensure your gateway is configured to "vpn.enterprise.sih.gov.in" and that your corporate user certificate is not expired in certmgr.msc.',
          },
        ],
      };
    }

    if (category === 'Security & Credentials' || lower.includes('password') || lower.includes('mfa')) {
      return {
        category: 'Security & Credentials',
        title: 'Corporate SSO & Authenticator Resynchronization',
        overview: 'Resolve multi-factor token drift, account lockout timer, and self-service password reset.',
        steps: [
          {
            id: 1,
            instruction: 'Perform Time-Sync on Authenticator App',
            actionableDetail: 'Open Google Authenticator or Microsoft Authenticator -> Settings -> Time correction for codes -> Sync now.',
          },
          {
            id: 2,
            instruction: 'Use Self-Service SSPR Portal via Trusted Device',
            actionableDetail: 'Navigate in an Incognito window to https://identity.sih.gov.in/sspr using your secondary registered mobile verification number.',
          },
          {
            id: 3,
            instruction: 'Check Account Lockout Status',
            actionableDetail: 'If you attempted incorrect passwords 5 times, your Active Directory account automatically enters a 15-minute security cooldown.',
          },
        ],
      };
    }

    // Default / Software troubleshooting
    return {
      category: category,
      title: 'Standard Application Diagnostic Routine',
      overview: 'Isolate software cache corruption, credential tokens, and service availability.',
      steps: [
        {
          id: 1,
          instruction: 'End Orphaned Background Processes',
          actionableDetail: 'Open Task Manager (Ctrl+Shift+Esc), locate the affected application, and select "End task".',
        },
        {
          id: 2,
          instruction: 'Clear Application Cache and Temporary Work Files',
          actionableDetail: 'Press Win+R, type "%temp%" and delete temporary runtime files, then restart the application.',
        },
        {
          id: 3,
          instruction: 'Verify Corporate License Activation',
          actionableDetail: 'Check your sign-in status in the top right profile of the application and verify SSO token validity.',
        },
      ],
    };
  }

  /**
   * 4. Retrieve similar past tickets and Knowledge Base articles
   */
  static retrieveSimilarTicketsAndArticles(text: string, category: TicketCategory): SimilarArtifacts {
    if (category === 'Printing & Peripherals' || text.toLowerCase().includes('printer')) {
      return {
        similarTickets: [
          {
            id: 'HD-0892',
            title: 'Floor 3 Network Printer Spooler Freezing on PDF Batches',
            resolution: 'Restarted spooler service and updated PCL6 generic driver to v4.2.1.',
          },
          {
            id: 'HD-0954',
            title: 'HP LaserJet Tray 2 roller jammed with cardstock',
            resolution: 'Cleared mechanical debris, cleaned pickup rollers with isopropyl, tested 50 test sheets.',
          },
        ],
        suggestedArticles: [
          { id: 'KB-101', title: 'Connecting to Network Printers & Clearing Stuck Spooler Jobs' },
          { id: 'KB-104', title: 'Supported Paper Weights and Clearing Jammed Feeder Trays' },
        ],
      };
    }

    if (category === 'Network & VPN' || text.toLowerCase().includes('vpn')) {
      return {
        similarTickets: [
          {
            id: 'HD-0781',
            title: 'GlobalProtect VPN error: Connection terminated by gateway',
            resolution: 'Re-enrolled corporate device root certificate and switched MTU to 1350.',
          },
          {
            id: 'HD-0912',
            title: 'Remote user cannot resolve internal intranet DNS after waking from sleep',
            resolution: 'Flushed client DNS and configured static DNS suffix list in network adapter.',
          },
        ],
        suggestedArticles: [
          { id: 'KB-102', title: 'Enterprise VPN Setup, Gateway Endpoints & SSL Certificate Renewal' },
          { id: 'KB-107', title: 'Troubleshooting DNS & Captive Portal Issues on Remote Wi-Fi' },
        ],
      };
    }

    if (category === 'Security & Credentials' || text.toLowerCase().includes('password')) {
      return {
        similarTickets: [
          {
            id: 'HD-0845',
            title: 'MFA token out of sync after timezone change during business travel',
            resolution: 'Triggered manual MFA re-seed via Microsoft Entra ID admin console.',
          },
          {
            id: 'HD-0998',
            title: 'Account lockout loop caused by outdated credentials saved in Windows Credential Vault',
            resolution: 'Cleared generic credentials in Windows Credential Manager and restarted.',
          },
        ],
        suggestedArticles: [
          { id: 'KB-103', title: 'Self-Service Password Reset (SSPR) & MFA Token Resynchronization' },
          { id: 'KB-108', title: 'Clearing Stale Credentials in Windows Credential Manager' },
        ],
      };
    }

    return {
      similarTickets: [
        {
          id: 'HD-0865',
          title: 'Application crash with code 0xc0000005 on Windows 11',
          resolution: 'Reinstalled Microsoft Visual C++ Redistributable packages and updated display driver.',
        },
      ],
      suggestedArticles: [
        { id: 'KB-105', title: 'Standard IT Software Catalog & License Provisioning Workflow' },
        { id: 'KB-106', title: 'Reporting Security Incidents & Device Loss Protocol' },
      ],
    };
  }

  /**
   * 5. Generate resolution direction for IT Engineers
   */
  static generateResolutionDirection(ticket: Ticket): string {
    const cat = ticket.category;
    if (cat === 'Printing & Peripherals') {
      return 'Check the remote print server logs for queue stalls on IP 10.20.4.15. If the user tried restarting the local spooler without success, reset the port binding in Print Management or deploy the updated HP Universal Print Driver v7.1 via SCCM/Intune.';
    }
    if (cat === 'Network & VPN') {
      return 'Inspect Palo Alto / Cisco ASA VPN logs for user radius authentication failures or certificate mismatches. If the client MTU is causing packet fragmentation over home broadband, issue an override script to set MTU to 1340.';
    }
    if (cat === 'Security & Credentials') {
      return 'Verify if account is flagged as "Locked Out" in Active Directory Users & Computers (ADUC). Check event ID 4740 on Domain Controller 01 to locate the caller workstation. Unlock the account and prompt temporary password generation with force-change on first login.';
    }
    if (cat === 'Hardware') {
      return 'Review workstation hardware telemetry via Dell Command / Lenovo Vantage. If thermal throttling or battery swelling is indicated, schedule an on-site hardware swap with an identical configured loaner unit.';
    }
    return 'Verify user permissions in the security group matrix. If the issue is persistent across reboots, perform a clean reinstall of the client suite with temporary local administrator elevation.';
  }

  /**
   * 6. Ticket Summarization for handovers and queue cards
   */
  static summarizeTicket(ticket: Ticket): string {
    return `${ticket.requesterName} (${ticket.department}) reported ${ticket.category.toLowerCase()} issue regarding "${ticket.title}". Affected service: ${ticket.affectedService}. Priority evaluated as ${ticket.priority}. Current status: ${ticket.status}.`;
  }
}
