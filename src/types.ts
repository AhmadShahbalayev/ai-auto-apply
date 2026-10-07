export type Status =
  | "Shortlisted"
  | "In progress"
  | "Applied"
  | "Blocked"
  | "Skipped"
  | "Uncertain submission"
  | "Rejected"
  | "Interview"
  | "Offer";

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  source?: string;
  sourceNote?: string;
  jobUrl: string;
  applicationUrl: string;
  locationEligibility: string;
  contract: string;
  pay: string;
  fit: string;
  status: Status;
  updatedAt: string;
  submittedAt: string | null;
  cv: string;
  confirmation: string;
  notes: string;
  nextAction: string;
  answers?: ApplicationAnswer[];
  answerHistoryNote?: string;
}

export interface ApplicationData {
  schemaVersion: number;
  candidate: string;
  timezone: string;
  preferences: {
    minimumMonthlyPay: { amount: number | null; currency: string };
    availability: string;
    noticePeriod: string;
    workAuthorization: string;
    focus: string;
    excludedEmployers: string[];
    browser: string;
    blockerWaitMinutes: number;
  };
  applications: Application[];
}
