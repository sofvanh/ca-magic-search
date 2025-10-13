import { searchUsersByUsername } from '$lib/server/firebase/firestore';

export async function load({ url }) {
  const searchQuery = url.searchParams.get('q');
  
  if (!searchQuery) {
    return { results: null };
  }
  
  const results = await searchUsersByUsername(searchQuery);
  
  return { results };
}