// src/routes/api/process-users/+server.ts
import { json } from '@sveltejs/kit';
// import { storeUserSummary } from '$lib/firebase';
// import { generateSummary } from '$lib/openai';
import { generateSummaries } from '$lib/summaries';
import { log } from '$lib/logger';
import dotenv from 'dotenv';


dotenv.config();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST({ request }) {
  const { usernames, adminPassword } = await request.json();
  if (adminPassword !== ADMIN_PASSWORD) {
    return json({ success: false, error: 'Invalid admin password' });
  }

  console.log('usernames', usernames);

  const summaries = await generateSummaries(usernames);
  log(`Generated summaries for ${usernames.length} users`);

  console.log('summaries', summaries);

  return json({ success: true, summaries });
}

export async function GET() {
  return json({ success: true, message: 'API is working' });
}
