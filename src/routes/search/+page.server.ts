import type { PageServerLoad } from './$types';
import { getEmbeddings } from '$lib/server/openai';
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
    // summary: match.summary,
    username: match.username,
    // displayName: match.displayName,
    explanation: "John managed a medical ship for walruses and speaks fluent chinese. He's also friends with Santa Claus."
  }));

  return {
    query,
    results,
  };
};

async function search(query: string) {
  const embedding = await getEmbeddings(query);
  const closestMatches = await searchUserSummaries(embedding);
  return closestMatches;
}