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

const allTweets = await getTweetsPaginated()
console.log("Total tweets fetched:", allTweets.length);

const filename = `tweets_${Date.now()}.json`
writeFileSync(filename, JSON.stringify(allTweets, null, 2))
console.log(`Tweets saved to ${filename}`);

async function getTweetsPaginated() {
  let allTweets: any = [];
  let batchSize = 1000;
  let offset = 0;
  let done = false;

  while (!done) {
    const { data, error } = await supabase
      .schema('public')
      .from('tweets')
      .select('full_text, account_id')
      .range(offset, offset + batchSize - 1); // Fetch a batch of 1000

    if (error) {
      console.error("Error fetching tweets:", error);
      return { error };
    }

    if (data.length === 0 || offset >= 5000) {
      done = true; // If no data is returned, we are done
    } else {
      console.log(`Got ${data.length} tweets, fetching another page... (current progress: ${offset})`)
      allTweets = allTweets.concat(data); // Accumulate tweets
      offset += batchSize; // Move to the next batch
    }
  }

  // Group the tweets by author after fetching all data
  const groupedTweets = allTweets.reduce((acc: any, tweet: any) => {
    const authorId = tweet.account_id;
    if (!acc[authorId]) {
      acc[authorId] = [];
    }
    acc[authorId].push(tweet.full_text);
    return acc;
  }, {});

  return groupedTweets; // Return the accumulated results
}
