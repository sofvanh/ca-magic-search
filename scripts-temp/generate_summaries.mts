import { getAccountIdsToUsernames, getTweetsForUser } from './db.mts'
import { generateSummary, mergeSummaries } from './openai.mts'
import { writeFile } from 'fs/promises';

const testAccounts = ['c4ss1usl1f3'];

const accounts = await getAccountIdsToUsernames();
for (const [id, username] of accounts.entries()) {
  if (!testAccounts.includes(username)) {
    accounts.delete(id);
  }
}

const summaries = new Map<string, string>();

for (const account of accounts.keys()) {
  console.log(`Getting tweets for ${accounts.get(account)}`)
  const tweets = await getTweetsForUser(account); // TODO This is only getting 1k at a time. Need to edit
  const chunkedSummaries: string[] = [];
  for (let i = 0; i < tweets.length; i += 25000) {
    const summary = await generateSummary(tweets.slice(i, i + 25000));
    chunkedSummaries.push(summary);
  }
  const summary = await mergeSummaries(chunkedSummaries);
  summaries.set(account, summary);
}

const summariesObj: Record<string, string> = {};
for (const [account, summary] of summaries.entries()) {
  summariesObj[account] = summary;
}

// TODO: Embed summaries and store in a database
const timestamp = Date.now();
await writeFile(`summaries_${timestamp}.json`, JSON.stringify(summariesObj, null, 2));
