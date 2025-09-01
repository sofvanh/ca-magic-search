import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function generateSummary(tweets: string[]): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Generate a summary of the person based on their tweets. The summary should be up to 10000 characters (~ 10 paragraphs) long and as high-signal as possible. The summary should describe things that are even a little bit apparent from the person's tweets, including interests, skills, profession, experiences, values, vibe, aesthetic, personality, location, opinions and preferences, etc. Make the summary EXTREMELY CONCISE, like writing for an extremely busy executive, but make sure you keep all the information that's actually interesting and unique about the individual. Trim all fluff like "In summary, ..." or "Based on the tweets..." or "The individual is ..." or "They exhibit ..." You can just write, "Engaged in x, y, z", "active in x...", "Likely works in y..." etc.
    
    Tweets: ${tweets.join('\n')}
    `
  });

  console.log(`${response.usage?.input_tokens} input tokens for ${tweets.length} tweets, ${response.usage?.output_tokens} output tokens`);
  console.log(`${response.output_text.length} characters in summary`);
  console.log(`Average tokens per tweet: ${(response.usage?.input_tokens ?? 0) / tweets.length}`);

  return response.output_text;
}

export async function mergeSummaries(summaries: string[]): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `Merge the following ${summaries.length} summaries of the same person, bringing all the information together into one summary of the exact same style and tone. The summary should not exceed 10000 characters (~ 10 paragraphs).
    
    Summaries: ${summaries.join('\n\n\n\n')}
    `
  });

  return response.output_text;
}