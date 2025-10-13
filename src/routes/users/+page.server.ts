import { searchUsersByUsername } from '$lib/server/firebase/firestore';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const searchQuery = formData.get('q') as string;
    
    if (!searchQuery) {
      return { results: [] };
    }
    
    const results = await searchUsersByUsername(searchQuery);
    
    return { results };
  }
};