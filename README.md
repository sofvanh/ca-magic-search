# Magic Search for X Community Archive

WIP. More info: https://x.com/sofvanh/status/1962519165513748601

## Dev info

### Start a development server (sveltekit)

`npm install` then `npm run dev`

### Build a production version

`npm run build`

Preview with `npm run preview`

### Data wrangling

Pull tweets and generate some summaries: `cd scripts-temp`, `npx ts-node generate-test-summaries.mts`

Env vars required for data wrangling:
- `SUPABASE_ANON_KEY` (See Community Archive docs)
- `OPENAI_API_KEY`