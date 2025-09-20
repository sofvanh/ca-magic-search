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
    log(`Chunked tweets into ${chunkedTweets.length} chunks`)
    const chunkedSummaries = await getChunkedSummaries(chunkedTweets)
    log(`Generated summaries for ${chunkedSummaries.length} chunks`)
    const finalSummary = await getFinalSummary(chunkedSummaries)

    log(`Generated summary for ${username}`)
    summaries.push({ id: account.account_id, username, displayName: account.account_display_name, summary: finalSummary, tweetCount: tweets.length });

    if (debug) createLog(username, tweets, chunkedSummaries, finalSummary);
  }

  return summaries;
}

function chunkTweets(tweets: Tweet[]): Tweet[][] {
  const yearly = chunkTweetsByYear(tweets);
  const chunks: Tweet[][] = [];
  for (const chunk of yearly) {
    const chunked = chunkTweetsByChunkSize(chunk);
    chunks.push(...chunked);
  }
  return chunks;
}

function chunkTweetsByYear(tweets: Tweet[]): Tweet[][] {
  const grouped = Object.groupBy(tweets, (tweet) => new Date(tweet.created_at).getFullYear());
  const chunks = Object.values(grouped).map((tweets) => tweets!.slice(0, 20000));
  return chunks;
}

function chunkTweetsByChunkSize(tweets: Tweet[]): Tweet[][] {
  const numChunks = Math.ceil(tweets.length / 20000);
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