import dotenv from 'dotenv';
import OpenAI from "openai";
import type { SummaryInTime, Tweet } from '../types.js';
import { log } from "./logger"


function SUMMARY_INSTRUCTION({ timeWindow, tweets }: { timeWindow: string, tweets: Tweet[] }) {
  const TWEET_LIMIT = Number(process.env.TWEET_LIMIT) || 20000;
  return `Generate a summary of the person based on their tweets. The summary should be up to 10000 characters (~ 10 paragraphs) long and as high-signal as possible. The summary should describe things that are even a little bit apparent from the person's tweets, including interests, skills, profession, experiences, values, vibe, aesthetic, personality, location, opinions and preferences, etc. Make the summary EXTREMELY CONCISE, like writing for an extremely busy executive, but make sure you keep all the information that's actually interesting and unique about the individual. Trim all fluff like "In summary, ..." or "Based on the tweets..." or "The individual is ..." or "They exhibit ..." You can just write, "Engaged in x, y, z", "active in x...", "Likely works in y..." etc. Prioritise overall trends and signals. Don't hype up the individual, just describe them as they are. If the list of tweets happens to be short / there's not much content, you can make the summary shorter.

    These tweets were posted between ${timeWindow}.
    Tweet count: ${tweets.length} (out of a maximum of ${TWEET_LIMIT})
    Tweets: ${tweets.map(t => t.full_text).join('\n')}
    `;
}

function MERGE_INSTRUCTION({ summaries }: { summaries: SummaryInTime[] }) {
  return `Merge the following ${summaries.length} summaries of the same person over time, bringing all the information together into one summary of the exact same style and tone. The summary should not exceed 10000 characters (~ 10 paragraphs). Take note of the time window of each summary; Today is ${new Date().toISOString().split('T')[0]}. More recent information is more important and should be given more weight. Note also the number of tweets in each summary. Weigh the importance of each summary based on the number of tweets.

    This was the instruction that was used to generate the summaries, please stick to it:

    ${SUMMARY_INSTRUCTION({ timeWindow: "[time window]", tweets: [] })}
    
    Summaries: 
    
    
    ${summaries.map(s => `${s.timeWindow}\nTweet count: ${s.tweetCount}\n\n${s.summary}`).join('\n\n\n\n')}
    `;
}

dotenv.config();

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

export async function generateSummary(tweets: Tweet[]): Promise<SummaryInTime> {
  log(`Generating summary for ${tweets.length} tweets`);
  const start = Date.now();

  const firstDate = tweets[0]?.created_at;
  const lastDate = tweets[tweets.length - 1]?.created_at;
  const timeWindow = `${firstDate} - ${lastDate}`;
  const response = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: SUMMARY_INSTRUCTION({ timeWindow, tweets }),
  });

  const seconds = ((Date.now() - start) / 1000).toFixed(1);
  log(`Finished summary for ${tweets.length} tweets (${seconds} s)`);

  return { summary: response.output_text, timeWindow, tweetCount: tweets.length };
}

export async function mergeSummaries(summaries: SummaryInTime[]): Promise<string> {
  const response = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: MERGE_INSTRUCTION({ summaries }),
  });

  return response.output_text;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function explainSearchResult(summary: string, query: string): Promise<string> {
  const response = await getClient().responses.create({
    model: "gpt-4.1-mini",
    input: `For the following query, give a very concise explanation (1-2 sentences) of how it matches with the user summary. Don't name the query, or say "The query" or "The user summary"; cut all fluff and just give the explanation:

    Query: ${query}
    User summary: ${summary}
    `,
  });
  console.log(`${response.usage?.output_tokens} output tokens, ${response.output_text.length} characters in explanation`);
  return response.output_text;
}