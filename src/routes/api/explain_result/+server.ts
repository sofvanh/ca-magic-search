import { json } from '@sveltejs/kit';
import { explainSearchResult } from '$lib/server/openai';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { summary, query } = await request.json();

    const explanation = await explainSearchResult(summary, query);

    return json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
};