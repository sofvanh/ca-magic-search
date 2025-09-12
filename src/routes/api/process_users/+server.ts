import { json } from '@sveltejs/kit';
import { storeUserSummary } from '$lib/server/firebase/firestore';
import { generateSummaries } from '$lib/server/summaries';
import { log } from '$lib/server/logger';
import dotenv from 'dotenv';
import { getEmbedding } from '$lib/server/openai';


dotenv.config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST({ request }) {
  const { usernames, adminPassword } = await request.json();
  if (adminPassword !== ADMIN_PASSWORD) {
    return json({ success: false, error: 'Invalid admin password' });
  }

  const summaries = await generateSummaries(usernames);
  log(`Generated summaries for ${usernames.length} users`);

  for (const summary of summaries) {
    const embeddings = await getEmbedding(summary.summary);
    await storeUserSummary({
      userId: summary.id,
      username: summary.username,
      displayName: summary.displayName,
      summary: summary.summary,
      embedding: embeddings,
      tweetCount: summary.tweetCount,
    });
    log(`Stored summary for ${summary.username}`);
  }

  log(`Stored ${summaries.length} summaries in Firebase`);

  return json({ success: true, summaries });
}

export async function GET() {
  return json({ success: true, message: 'API is working' });
}
