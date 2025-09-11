import { getAccountInfo, getTweetsPaginated } from './community-archive-api'
import { generateSummary, mergeSummaries } from './openai'
import { log, storeLog } from './logger';
import type { SummaryInTime, Tweet } from '../types';
import dotenv from 'dotenv';

dotenv.config();
const debug = process.env.DEBUG === 'true';


export async function generateSummaries(usernames: string[]): Promise<{ id: string, username: string, displayName: string, summary: string, tweetCount: number }[]> {
  const accounts = await getAccountInfo(usernames);
  if (debug) log(`Found ${accounts.length} accounts to process`)

  const summaries: { id: string, username: string, displayName: string, summary: string, tweetCount: number }[] = [];
  for (const account of accounts) {

    // TODO Would be good if, if there's lots of tweets, we could be fetching tweets and generating summaries in parallel

    const username = account.username;
    if (debug) console.log(`Getting tweets for ${username}`)

    const tweets = await getTweetsPaginated(account.account_id);

    const chunkedTweets = chunkTweets(tweets);
    const chunkedSummaries = await getChunkedSummaries(chunkedTweets)
    const finalSummary = await getFinalSummary(chunkedSummaries)

    log(`Generated summary for ${username}`)
    summaries.push({ id: account.account_id, username, displayName: account.account_display_name, summary: finalSummary, tweetCount: tweets.length });

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

async function getChunkedSummaries(chunkedTweets: Tweet[][]): Promise<SummaryInTime[]> {
  const chunkedSummaries: SummaryInTime[] = [];
  for (const chunk of chunkedTweets) {
    const summary = await generateSummary(chunk);
    chunkedSummaries.push(summary);
  }
  return chunkedSummaries;
}

async function getFinalSummary(chunkedSummaries: SummaryInTime[]): Promise<string> {
  if (chunkedSummaries.length > 1) {
    return await mergeSummaries(chunkedSummaries);
  } else {
    return chunkedSummaries[0].summary;
  }
}

async function createLog(username: string, tweets: Tweet[], chunkedSummaries: SummaryInTime[], summary: string) {
  storeLog(
    `Generated summary for ${username}\n` +
    `Number of tweets: ${tweets.length}\n` +
    `Number of chunked summaries: ${chunkedSummaries.length}\n` +
    `Chunked summaries content:\n${chunkedSummaries.map(s => `${s.timeWindow}\n${s.summary}`).join('\n---\n')}\n\n\n` +
    `Final summary:\n${summary}`
  )
}