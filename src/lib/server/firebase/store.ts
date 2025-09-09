import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const app = getApps().length === 0
  ? initializeApp({
    projectId: "sofvanh"
  })
  : getApps()[0];

export const db = getFirestore(app);

export async function storeUserSummary(data: {
  userId: string;
  username: string;
  summary: string;
  embedding: number[];
  tweetCount: number;
}) {
  const docRef = db.collection('user-summaries').doc(data.userId);

  await docRef.set({
    userId: data.userId,
    username: data.username,
    summary: data.summary,
    embedding: FieldValue.vector(data.embedding),
    tweetCount: data.tweetCount,
    createdAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}