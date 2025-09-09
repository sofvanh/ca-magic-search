import { Firestore } from '@google-cloud/firestore';
import type { UserSummary } from '$lib/types';
const vectorDb = new Firestore({ projectId: "sofvanh" });

export async function searchUserSummaries(queryEmbedding: number[], limit = 10): Promise<UserSummary[]> {
  const vectorQuery = vectorDb
    .collection('user-summaries')
    .findNearest({
      vectorField: 'embedding',
      queryVector: queryEmbedding,
      limit,
      distanceMeasure: 'COSINE'
    });

  const snapshot = await vectorQuery.get();
  return snapshot.docs.map(doc => doc.data() as UserSummary);
}