import type { PageServerLoad } from './$types';
import { getEmbedding } from '$lib/server/openai';
import { searchUserSummaries } from '$lib/server/firebase/search';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q');

  if (!query) {
    return {
      query: null,
      results: [],
    };
  }

  const closestMatches = await search(query);
  const results = closestMatches.map(match => ({
    username: match.userSummary.username,
    displayName: match.userSummary.displayName,
    summary: match.userSummary.summary,
    distance: match.distance,
  }));

  return {
    query,
    results,
  };
};

async function search(query: string) {
  const embedding = await getEmbedding(query);
  const closestMatches = await searchUserSummaries(embedding);
  return closestMatches;
}