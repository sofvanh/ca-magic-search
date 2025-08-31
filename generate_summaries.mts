import { getAccountIdsToUsernames, getTweetsForUser } from './db.mts'
import { generateSummary } from './openai.mts'
import { writeFile } from 'fs/promises';

const testAccounts = ['c4ss1usl1f3', 'mkstra', 'scienceboi420'];

const accounts = await getAccountIdsToUsernames();
for (const [id, username] of accounts.entries()) {
  if (!testAccounts.includes(username)) {
    accounts.delete(id);
  }
}

const summaries = new Map<string, string>();

for (const account of accounts.keys()) {
  console.log(`Getting tweets for ${accounts.get(account)}`)
  const tweets = await getTweetsForUser(account);
  // TODO: Generate the summary in stages if there are too many tweets
  const summary = await generateSummary(tweets);
  summaries.set(account, summary);
}

const summariesObj: Record<string, string> = {};
for (const [account, summary] of summaries.entries()) {
  summariesObj[account] = summary;
}

// TODO: Embed summaries and store in a database
const timestamp = Date.now();
await writeFile(`summaries_${timestamp}.json`, JSON.stringify(summariesObj, null, 2));
