import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js';
import type { AccountInfo, Tweet } from '../types';

dotenv.config()

const supabaseUrl = 'https://fabxmporizzqflnftavs.supabase.co';
let supabase: any = null;

function getSupabase() {
  if (!supabase) {
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseKey) {
      throw new Error('SUPABASE_ANON_KEY environment variable is required');
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

export async function getTweetsPaginated(accountId: string): Promise<Tweet[]> {
  let allTweets: Tweet[] = [];
  const batchSize = 1000;
  let offset = 0;
  let done = false;

  while (!done) {
    const { data, error } = await getSupabase()
      .schema('public')
      .from('tweets')
      .select('full_text, created_at')
      .eq('account_id', accountId)
      .not('full_text', 'like', 'RT @%') // Exclude retweets
      .order('created_at', { ascending: true }) // Get oldest tweets first
      .range(offset, offset + batchSize - 1); // Fetch a batch of 1000

    if (error) {
      console.error("Error fetching tweets (paginated):", error);
      throw error;
    }

    console.log(`Got ${data.length} tweets`)

    if (data.length > 0) {
      allTweets = allTweets.concat(data); // Accumulate tweets
      offset += batchSize; // Move to the next batch
    }

    if (data.length < batchSize) {
      console.log(`Finished fetching tweets for ${accountId}`)
      done = true; // If we got less than the batch size, we are done
    }
  }

  return allTweets; // Return the accumulated results
}

export async function getAccountInfo(usernames: string[]): Promise<AccountInfo[]> {
  const { data, error } = await getSupabase()
    .from('account')
    .select('accountId:account_id, username, displayName:account_display_name')
    .in('username', usernames);

  if (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }

  const accounts = data as AccountInfo[];
  return accounts;
}

export async function getUnprocessedUsers(processedUserIds: string[]): Promise<AccountInfo[]> {
  const { data, error } = await getSupabase()
    .from('account')
    .select('accountId:account_id, username, displayName:account_display_name')
    .not('account_id', 'in', `(${processedUserIds.join(',')})`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching unprocessed users:", error);
    throw error;
  }

  return data as AccountInfo[];
}