import { getAccountIdsToUsernames, getTweetsPaginated } from './community-archive-api.mts'
import { generateSummary, mergeSummaries } from './openai.mts'
import { writeFile } from 'fs/promises';
import { log, storeLog } from './logger.mts';

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

  // TODO Should take the times of tweets into account

  const tweets = await getTweetsPaginated(account);
  const chunkedSummaries: string[] = [];
  for (let i = 0; i < tweets.length; i += 25000) {
    storeLog(
      `Tweets for ${username} (chunk ${i / 25000 + 1}):\n` +
      tweets.slice(i, i + 25000)
        .map((tweet, idx) => `[${i + idx}] ${tweet}`)
        .join('\n\n\n')
    );
    const summary = await generateSummary(tweets.slice(i, i + 25000));
    chunkedSummaries.push(summary);
  }
  if (chunkedSummaries.length > 1) {
    const summary = await mergeSummaries(chunkedSummaries);
    log(`Merged ${chunkedSummaries.length} summaries into one summary for ${username}`)
    summaries.set(account, summary);
  } else {
    log(`Generated summary for ${username}`)
    summaries.set(account, chunkedSummaries[0]);
  }

  storeLog(
    `Generated summary for ${username}\n` +
    `Number of tweets: ${tweets.length}\n` +
    `Chunked summaries:\n${chunkedSummaries.join('\n---\n')}\n` +
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
