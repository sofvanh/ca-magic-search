import { getAccountIdsToUsernames, getTweetsPaginated } from './community-archive-api.mts'
import { generateSummary, mergeSummaries } from './openai.mts'
import { writeFile } from 'fs/promises';
import { log, storeLog } from './logger.mts';
import type { Summary, Tweet } from './types.mts';

const testAccounts = ['sofvanh', 'andrepology', 'exgenesis'];

const accounts = await getAccountIdsToUsernames();
for (const [id, username] of accounts.entries()) {
  if (!testAccounts.includes(username)) {
    accounts.delete(id);
  }
}

log(`Found ${accounts.size} accounts to process`)

const summaries = new Map<string, string>();

for (const account of accounts.keys()) {
  const username = accounts.get(account);
  console.log(`Getting tweets for ${username}`)

  // TODO Would be good if, if there's lots of tweets, we could be fetching tweets and generating summaries in parallel

  const tweets = await getTweetsPaginated(account);
  const chunkedTweets = chunkTweets(tweets);
  const chunkedSummaries: Summary[] = [];

  for (let i = 0; i < chunkedTweets.length; i++) {
    let chunk = chunkedTweets[i];
    storeLog(
      `Tweets for ${username} (chunk ${i + 1}):\n` +
      chunk.map((tweet, idx) => `[${i + idx}] ${tweet.created_at}: ${tweet.full_text}`)
        .join('\n\n\n')
    );
    const summary = await generateSummary(chunk);
    chunkedSummaries.push(summary);
  }
  if (chunkedSummaries.length > 1) {
    const summary = await mergeSummaries(chunkedSummaries);
    log(`Merged ${chunkedSummaries.length} summaries into one summary for ${username}`)
    summaries.set(account, summary);
  } else {
    log(`Generated summary for ${username}`)
    summaries.set(account, chunkedSummaries[0].summary);
  }

  storeLog(
    `Generated summary for ${username}\n` +
    `Number of tweets: ${tweets.length}\n` +
    `Number of chunked summaries: ${chunkedSummaries.length}\n` +
    `Chunked summaries content:\n${chunkedSummaries.map(s => `${s.timeWindow}\n${s.summary}`).join('\n---\n')}\n` +
    `Final summary:\n${summaries.get(account)}`
  )
}

const summariesObj: Record<string, string> = {};
for (const [account, summary] of summaries.entries()) {
  summariesObj[account] = summary;
}

// TODO: Embed summaries and store in a database
const timestamp = Date.now();
await writeFile(`summaries/${timestamp}.json`, JSON.stringify(summariesObj, null, 2));

function chunkTweets(tweets: Tweet[]): Tweet[][] {
  const numChunks = Math.ceil(tweets.length / 30000);
  const chunkSize = Math.ceil(tweets.length / numChunks);
  const chunkedTweets: Tweet[][] = Array.from({ length: numChunks }, (_, i) =>
    tweets.slice(i * chunkSize, (i + 1) * chunkSize)
  );
  return chunkedTweets;
}