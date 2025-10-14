import type { Timestamp } from 'firebase-admin/firestore';

export interface Tweet {
  full_text: string;
  created_at: string;
}

export interface SummaryInTime {
  summary: string;
  timeWindow: string;
  tweetCount: number;
}

export interface UserSummary {
  userId: string;
  username: string;
  displayName: string | null;
  summary: string;
  embedding: number[];  // 1536 dimensions from OpenAI
  tweetCount: number;
  createdAt: Timestamp;
}

export interface AccountInfo {
  accountId: string;
  username: string;
  displayName: string;
}

export interface UserSummaryDisplay {
  userId: string;
  username: string;
  displayName: string | null;
  summary: string;
  tweetCount: number;
  createdAt: string;
}