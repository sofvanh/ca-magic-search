// Based on: https://github.com/TheExGenesis/community-archive/blob/main/scripts/get_all_tweets_paginated.mts
// Copied Aug 27 2025
// Since modified

import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const supabaseUrl = 'https://fabxmporizzqflnftavs.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)

const allTweets = await getTweetsPaginated();
console.log(`Found tweets for ${Object.keys(allTweets).length} authors.`);

const filename = `tweets_${Date.now()}.json`
writeFileSync(filename, JSON.stringify(allTweets, null, 2))
console.log(`Tweets saved to ${filename}`);

async function getTweetsPaginated(): Promise<Record<string, string[]>> {
  let allTweets: any = [];
  let batchSize = 1000;
  let offset = 0;
  let done = false;

  const accountIdsToUsernames = await getAccountIdsToUsernames();

  while (!done) {
    const { data, error } = await supabase
      .schema('public')
      .from('tweets')
      .select('full_text, account_id')
      .in('account_id', Array.from(accountIdsToUsernames.keys()))
      .range(offset, offset + batchSize - 1); // Fetch a batch of 1000

    if (error) {
      console.error("Error fetching tweets:", error);
      throw error;
    }

    if (data.length === 0 || offset >= 50000) {
      done = true; // If no data is returned, we are done
      console.log(`Done fetching tweets. ${offset} tweets fetched.`)
    } else {
      console.log(`Got ${data.length} tweets, fetching another page... (current progress: ${offset})`)
      allTweets = allTweets.concat(data); // Accumulate tweets
      offset += batchSize; // Move to the next batch
    }
  }

  // Group the tweets by author after fetching all data
  const groupedTweets: Record<string, string[]> = allTweets.reduce((acc: any, tweet: any) => {
    const author = accountIdsToUsernames.get(tweet.account_id) || `UNKNOWN_${tweet.account_id}`;
    if (!acc[author]) {
      acc[author] = [];
    }
    acc[author].push(tweet.full_text);
    return acc;
  }, {});

  return groupedTweets; // Return the accumulated results
}

async function getAccountIdsToUsernames(): Promise<Map<string, string>> {
  const { data: accounts, error: accountError } = await supabase
    .from('account')
    .select('account_id, username');

  if (accountError) {
    console.error("Error fetching accounts:", accountError);
    throw accountError;
  }

  const accountMap = new Map(accounts.map((account: any) => [account.account_id, account.username]));

  return accountMap;
}