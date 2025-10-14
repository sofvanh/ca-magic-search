<div class="mx-auto my-12 prose flex flex-col p-4">
	<h1>About</h1>

	<p>
		Magic Search started as an exploration of the idea of "live markets", specifically live job
		markets; where rather than having to market yourself as something simple and legible (such as
		"software engineer"), you could instead become visible as your full self, with all your talents
		and interests on display, without having to even think about the comms of it all. Ideally this
		would lead to more meaningful, valuable, and idiosyncratic collaborations and opportunities.
	</p>

	<p>
		I'm interested in safeguarding job security for humans in the future, because I worry about
		large-scale unrest as a result of displacement of humans by AI, and I'm concerned what will
		happen when humans are no longer incetivised to strive for personal progress
		(self-actualisation), and governments no longer incentivised to invest in their population.
	</p>

	<p>
		I go into some background in this
		<a
			href="https://x.com/sofvanh/status/1962519165513748601"
			target="_blank"
			rel="noopener noreferrer">tweet thread</a
		>. The idea of "live markets" emerged from the
		<a
			href="https://www.lesswrong.com/s/aMz2JMvgXrLBkq4h3"
			target="_blank"
			rel="noopener noreferrer">Live Theory</a
		> research group.
	</p>

	<p>
		Magic Seach was built as part of the AI for Human Reasoning fellowship by the Future of Life
		Foundation.
	</p>

	<h2>Data</h2>

	<p>
		All our data is sourced from the <a href="https://www.community-archive.org/"
			>Community Archive</a
		>, a database of 270+ tweet archives submitted by X users. Anyone can upload their own X
		archive.
	</p>

	<p>
		If you want your account to show up in the Magic Search results, you can upload your archive and
		support the project!
	</p>

	<h2>Data processing</h2>

	<p>
		For every indexed user, we fetch all their authored tweets and generate a summary of the person
		based on the archive. Currently we're using GPT-4.1-mini. Username, display name, and bio, as
		well as retweets and liked tweets, are excluded from the generation of the summary.
	</p>

	<p>
		If think your account isn't represented properly, it's probably a prompting error, or
		GPT-4.1-mini isn't intelligent enough to capture your magic with sufficient subtleness. Reach
		out to me if so.
	</p>

	<p>
		To see the prompts we use to generate the user summaries, see the <a
			href="https://github.com/sofvanh/ca-magic-search/blob/main/src/lib/server/openai.ts"
			>project source code</a
		>.
	</p>

	<h2>I want my user in/out/changed!</h2>

	<p>
		Reach out to me via <a href="https://x.com/sofvanh" target="_blank" rel="noopener noreferrer"
			>Twitter</a
		> or email (hello at sofiavanhanen dot fi). Indexing new users currently happens manually, so even
		if you add your archive to Community Archive today, it won't show up here until I run the script
		for it. If you're unhappy with the representation of your user, I'd like to hear about it; I can
		remove you from the index, or we can work on the prompts so that your magic is captured more accurately.
	</p>
</div>
