import type { Timestamp } from 'firebase-admin/firestore';

export interface Tweet {
  full_text: string;
  created_at: string;
}

export interface SummaryInTime {
  summary: string;
  timeWindow: string;
}

export interface UserSummary {
  userId: string;
  username: string;
  summary: string;
  embedding: number[];  // 1536 dimensions from OpenAI
  tweetCount: number;
  createdAt: Timestamp;
}