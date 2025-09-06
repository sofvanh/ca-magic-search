import { getAccountIdsToUsernames, getTweetsPaginated } from './community-archive-api'
import { generateSummary, mergeSummaries } from './openai'
import { log, storeLog } from './logger';
import type { Summary, Tweet } from './types';
import dotenv from 'dotenv';

dotenv.config();
const debug = process.env.DEBUG === 'true';


export async function generateSummaries(usernames: string[]): Promise<{ id: string, username: string, summary: string }[]> {
  const accounts = await getAccountIdsToUsernames(usernames);
  if (debug) log(`Found ${accounts.size} accounts to process`)

  const summaries: { id: string, username: string, summary: string }[] = [];
  for (const account of accounts.keys()) {

    // TODO Would be good if, if there's lots of tweets, we could be fetching tweets and generating summaries in parallel

    const username = accounts.get(account)!;
    if (debug) console.log(`Getting tweets for ${username}`)

    const tweets = await getTweetsPaginated(account);

    const chunkedTweets = chunkTweets(tweets);
    const chunkedSummaries = await getChunkedSummaries(chunkedTweets)
    const finalSummary = await getFinalSummary(chunkedSummaries)

    log(`Generated summary for ${username}`)
    summaries.push({ id: account, username, summary: finalSummary });

    if (debug) createLog(username, tweets, chunkedSummaries, finalSummary);
  }

  return summaries;
}

function chunkTweets(tweets: Tweet[]): Tweet[][] {
  const numChunks = Math.ceil(tweets.length / 30000);
  const chunkSize = Math.ceil(tweets.length / numChunks);
  const chunkedTweets: Tweet[][] = Array.from({ length: numChunks }, (_, i) =>
    tweets.slice(i * chunkSize, (i + 1) * chunkSize)
  );
  return chunkedTweets;
}

async function getChunkedSummaries(chunkedTweets: Tweet[][]): Promise<Summary[]> {
  const chunkedSummaries: Summary[] = [];
  for (const chunk of chunkedTweets) {
    const summary = await generateSummary(chunk);
    chunkedSummaries.push(summary);
  }
  return chunkedSummaries;
}

async function getFinalSummary(chunkedSummaries: Summary[]): Promise<string> {
  if (chunkedSummaries.length > 1) {
    return await mergeSummaries(chunkedSummaries);
  } else {
    return chunkedSummaries[0].summary;
  }
}

async function createLog(username: string, tweets: Tweet[], chunkedSummaries: Summary[], summary: string) {
  storeLog(
    `Generated summary for ${username}\n` +
    `Number of tweets: ${tweets.length}\n` +
    `Number of chunked summaries: ${chunkedSummaries.length}\n` +
    `Chunked summaries content:\n${chunkedSummaries.map(s => `${s.timeWindow}\n${s.summary}`).join('\n---\n')}\n\n\n` +
    `Final summary:\n${summary}`
  )
}