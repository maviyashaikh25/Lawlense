// Mock data for LawLens application

// Mock Documents
export const mockDocuments = [
  {
    id: "1",
    title: "Employment Agreement - John Smith",
    type: "Contract",
    uploadDate: "2024-01-15",
    status: "analyzed",
    pages: 12,
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Non-Disclosure Agreement - TechCorp",
    type: "NDA",
    uploadDate: "2024-01-14",
    status: "analyzed",
    pages: 8,
    size: "1.2 MB",
  },
  {
    id: "3",
    title: "Service Level Agreement - CloudServices",
    type: "Agreement",
    uploadDate: "2024-01-13",
    status: "processing",
    pages: 24,
    size: "4.1 MB",
  },
  {
    id: "4",
    title: "Privacy Policy Update 2024",
    type: "Policy",
    uploadDate: "2024-01-12",
    status: "analyzed",
    pages: 6,
    size: "0.8 MB",
  },
  {
    id: "5",
    title: "Vendor Compliance Report Q4",
    type: "Compliance",
    uploadDate: "2024-01-10",
    status: "pending",
    pages: 18,
    size: "3.2 MB",
  },
  {
    id: "6",
    title: "Software License Agreement - Enterprise",
    type: "Agreement",
    uploadDate: "2024-01-08",
    status: "analyzed",
    pages: 15,
    size: "2.8 MB",
  },
];

// Mock User
export const mockUser = {
  id: "user-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@lawfirm.com",
  plan: "pro",
  documentsUploaded: 47,
  queriesUsed: 156,
  joinedDate: "2023-09-15",
};

// Mock Chat Messages
export const mockChatMessages = [
  {
    id: "1",
    role: "user",
    content:
      "What are the key termination clauses in the employment agreement?",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Based on my analysis of the Employment Agreement, here are the key termination clauses:\n\n1. **At-Will Employment** (Section 4.1): Either party may terminate the agreement at any time with 30 days written notice.\n\n2. **Termination for Cause** (Section 4.2): Immediate termination is permitted for gross misconduct, breach of confidentiality, or criminal activity.\n\n3. **Severance** (Section 4.3): Upon termination without cause, employee is entitled to 3 months salary plus accrued benefits.\n\n4. **Non-Compete Period** (Section 4.4): 12-month non-compete clause becomes active upon termination.",
    timestamp: "2024-01-15T10:30:15Z",
  },
  {
    id: "3",
    role: "user",
    content: "Is the non-compete clause enforceable in California?",
    timestamp: "2024-01-15T10:32:00Z",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "**Important Legal Consideration:**\n\nNo, the non-compete clause would likely **not be enforceable in California**. Under California Business and Professions Code Section 16600, non-compete agreements are generally void and unenforceable, with very limited exceptions.\n\n**Exceptions that might apply:**\n- Sale of a business\n- Dissolution of a partnership\n- Dissolution of an LLC\n\nI recommend revising Section 4.4 if this agreement will be governed by California law. Would you like me to suggest alternative protective language that would be enforceable?",
    timestamp: "2024-01-15T10:32:20Z",
  },
];

// Mock Document Content for Viewer
export const mockDocumentContent = {
  id: "1",
  title: "Employment Agreement - John Smith",
  sections: [
    {
      id: "intro",
      title: "Introduction",
      content:
        'This Employment Agreement ("Agreement") is entered into as of January 1, 2024 ("Effective Date"), by and between TechCorp Inc., a Delaware corporation ("Company"), and John Smith ("Employee").',
    },
    {
      id: "employment",
      title: "1. Employment Terms",
      content:
        "The Company hereby employs Employee, and Employee hereby accepts employment with the Company, upon the terms and conditions set forth in this Agreement. Employee shall serve as Senior Software Engineer, reporting directly to the Chief Technology Officer.",
    },
    {
      id: "compensation",
      title: "2. Compensation",
      content:
        "Employee shall receive a base salary of $150,000 per year, payable in accordance with the Company's standard payroll practices. Employee shall be eligible for an annual bonus of up to 20% of base salary based on performance metrics established by the Company.",
    },
    {
      id: "benefits",
      title: "3. Benefits",
      content:
        "Employee shall be entitled to participate in all benefit plans and programs generally available to similarly situated employees of the Company, including health insurance, 401(k) plan with company matching, and paid time off of 20 days per year.",
    },
    {
      id: "termination",
      title: "4. Termination",
      content:
        "Either party may terminate this Agreement at any time with 30 days written notice. In the event of termination without cause by the Company, Employee shall be entitled to severance pay equal to three months base salary. Upon termination for any reason, Employee agrees not to compete with the Company for a period of 12 months.",
    },
    {
      id: "confidentiality",
      title: "5. Confidentiality",
      content:
        "Employee agrees to maintain strict confidentiality of all proprietary information, trade secrets, and confidential business information of the Company during and after employment. This obligation survives termination of this Agreement indefinitely.",
    },
  ],
};

// Mock Clauses for Document Viewer
export const mockClauses = [
  {
    id: "c1",
    title: "At-Will Employment",
    content:
      "Either party may terminate this Agreement at any time with 30 days written notice.",
    riskLevel: "low",
    section: "Section 4.1",
  },
  {
    id: "c2",
    title: "Non-Compete Clause",
    content:
      "Employee agrees not to compete with the Company for a period of 12 months following termination.",
    riskLevel: "high",
    section: "Section 4.4",
  },
  {
    id: "c3",
    title: "Severance Package",
    content:
      "In the event of termination without cause, Employee shall be entitled to severance pay equal to three months base salary.",
    riskLevel: "low",
    section: "Section 4.3",
  },
  {
    id: "c4",
    title: "Confidentiality Obligation",
    content:
      "Employee agrees to maintain strict confidentiality of all proprietary information indefinitely.",
    riskLevel: "medium",
    section: "Section 5.1",
  },
  {
    id: "c5",
    title: "Intellectual Property Assignment",
    content:
      "All work product created during employment shall be the exclusive property of the Company.",
    riskLevel: "medium",
    section: "Section 6.2",
  },
];

// Mock Search Results
export const mockSearchResults = [
  {
    id: "s1",
    clauseText:
      "Either party may terminate this Agreement at any time with 30 days written notice to the other party.",
    documentName: "Employment Agreement - John Smith",
    documentId: "1",
    relevanceScore: 0.95,
  },
  {
    id: "s2",
    clauseText:
      "This Agreement may be terminated immediately upon material breach by either party.",
    documentName: "Non-Disclosure Agreement - TechCorp",
    documentId: "2",
    relevanceScore: 0.88,
  },
  {
    id: "s3",
    clauseText:
      "Upon termination of services, all confidential materials must be returned within 5 business days.",
    documentName: "Service Level Agreement - CloudServices",
    documentId: "3",
    relevanceScore: 0.82,
  },
];

// Mock Summary Data
export const mockSummary = {
  bullets: [
    "Employment agreement between TechCorp Inc. and John Smith as Senior Software Engineer",
    "Base salary of $150,000/year with up to 20% annual bonus",
    "Standard benefits including health insurance and 401(k) matching",
    "30-day notice required for termination by either party",
    "12-month non-compete clause (potentially unenforceable in some states)",
    "Indefinite confidentiality obligations regarding proprietary information",
  ],
  paragraph:
    "This Employment Agreement establishes a professional relationship between TechCorp Inc. and John Smith for the position of Senior Software Engineer. The agreement provides for an annual base salary of $150,000 with performance-based bonuses up to 20%. Standard employment benefits are included, along with 20 days of paid time off annually. The agreement contains standard provisions for termination with 30-day notice, a severance package of 3 months salary for termination without cause, and a 12-month non-compete clause that may face enforceability challenges in certain jurisdictions. Confidentiality obligations are perpetual and survive termination.",
};

// Dashboard Stats
export const mockDashboardStats = {
  totalDocuments: 47,
  aiQueriesUsed: 156,
  recentActivity: 12,
  storageUsed: "124 MB",
};
