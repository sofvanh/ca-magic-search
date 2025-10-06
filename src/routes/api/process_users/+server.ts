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

  const acceptHeader = request.headers.get('accept');
  if (acceptHeader?.includes('text/event-stream')) {
    return handleSSEProcessing(usernames);
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

async function handleSSEProcessing(usernames: string[]) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const totalUsers = usernames.length;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'start',
          total: totalUsers,
          current: 0
        })}\n\n`));

        for (let i = 0; i < usernames.length; i++) {
          const username = usernames[i];
          log(`Processing user ${i + 1}/${totalUsers}: ${username}`);

          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'progress',
              current: i,
              total: totalUsers,
              username: username
            })}\n\n`));

            const summary = (await generateSummaries([username]))[0];
            const embeddings = await getEmbedding(summary.summary);
            await storeUserSummary({
              userId: summary.id,
              username: summary.username,
              displayName: summary.displayName,
              summary: summary.summary,
              embedding: embeddings,
              tweetCount: summary.tweetCount,
            });
          } catch (error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              username: username,
              error: error instanceof Error ? error.message : 'Unknown error'
            })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          total: totalUsers
        })}\n\n`));

      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function GET() {
  return json({ success: true, message: 'API is working' });
}