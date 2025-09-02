import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js';

dotenv.config()

const supabaseUrl = 'https://fabxmporizzqflnftavs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

export async function getTweetsForUser(account_id: string): Promise<string[]> {
  const { data, error } = await supabase
    .schema('public')
    .from('tweets')
    .select('full_text')
    .eq('account_id', account_id)

  if (error) {
    console.error("Error fetching tweets:", error);
    throw error;
  }

  return data.map((tweet) => tweet.full_text)
}

export async function getTweetsPaginated(accountId: string): Promise<string[]> {
  let allTweets: string[] = [];
  let batchSize = 1000;
  let offset = 0;
  let done = false;

  while (!done) {
    const { data, error } = await supabase
      .schema('public')
      .from('tweets')
      .select('full_text')
      .eq('account_id', accountId)
      .not('full_text', 'like', 'RT @%') // Exclude retweets
      .range(offset, offset + batchSize - 1); // Fetch a batch of 1000

    if (error) {
      console.error("Error fetching tweets (paginated):", error);
      throw error;
    }

    console.log(`Got ${data.length} tweets`)

    if (data.length > 0) {
      allTweets = allTweets.concat(data.map((tweet) => tweet.full_text)); // Accumulate tweets
      offset += batchSize; // Move to the next batch
    }

    if (data.length < batchSize) {
      console.log(`Finished fetching tweets for ${accountId}`)
      done = true; // If we got less than the batch size, we are done
    }
  }

  return allTweets; // Return the accumulated results
}

export async function getAccountIdsToUsernames(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from('account')
    .select('account_id, username')

  if (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }

  const accountMap = new Map(data.map((account: any) => [account.account_id, account.username]));

  return accountMap;
}