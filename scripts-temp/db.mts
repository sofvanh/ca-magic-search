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