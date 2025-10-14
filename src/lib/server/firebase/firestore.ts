import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { UserSummary, UserSummaryDisplay } from '$lib/types';

const app = getApps().length === 0
  ? initializeApp({
    projectId: "sofvanh"
  })
  : getApps()[0];

const db = getFirestore(app);

export async function storeUserSummary(data: {
  userId: string;
  username: string;
  displayName: string;
  summary: string;
  embedding: number[];
  tweetCount: number;
}) {
  const docRef = db.collection('user-summaries').doc(data.userId);

  await docRef.set({
    userId: data.userId,
    username: data.username,
    displayName: data.displayName,
    summary: data.summary,
    embedding: FieldValue.vector(data.embedding),
    tweetCount: data.tweetCount,
    createdAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

export async function searchUserSummaries(queryEmbedding: number[], limit = 20): Promise<{ distance: number, userSummary: UserSummary }[]> {
  const vectorQuery = db
    .collection('user-summaries')
    .findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      limit,
      distanceMeasure: 'DOT_PRODUCT',
      distanceResultField: 'distance'
    });

  const snapshot = await vectorQuery.get();
  return snapshot.docs.map(doc => ({ distance: doc.get('distance'), userSummary: doc.data() as UserSummary }));
}

export async function getUsers(): Promise<UserSummary[]> {
  const snapshot = await db.collection('user-summaries').get();
  return snapshot.docs.map(doc => doc.data() as UserSummary);
}

export async function searchUsersByUsername(query: string): Promise<UserSummaryDisplay[]> {
  const snapshot = await db.collection('user-summaries').get();
  let cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.startsWith('@')) {
    cleanQuery = cleanQuery.slice(1);
  }
  
  return snapshot.docs
    .filter(doc => doc.data().username.toLowerCase().includes(cleanQuery))
    .map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        username: data.username,
        displayName: data.displayName,
        summary: data.summary,
        tweetCount: data.tweetCount,
        createdAt: data.createdAt.toDate().toISOString()
      };
    });
}