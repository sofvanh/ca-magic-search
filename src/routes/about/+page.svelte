<div class="mx-auto my-12 prose flex flex-col p-4">
	<h1>About</h1>

	<p>
		<a
			href="https://x.com/sofvanh/status/1962519165513748601"
			target="_blank"
			rel="noopener noreferrer">More info</a
		>
	</p>

	<p>TODO finish this page :)</p>

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
		For every indexed user, we find all their authored tweets (not retweets or liked tweets) and
		generate a summary of the person based on the archive. Currently we're using GPT-4.1-mini.
	</p>

	<p>
		If think your account isn't represented properly, it's probably a prompting error, or
		GPT-4.1-mini isn't intelligent enough to capture your magic with sufficient subtleness. Reach
		out to @sofvanh if so.
	</p>

	<h2>Prompts</h2>

	<p>
		To see the prompts we use to generate the user summaries, see the <a
			href="https://github.com/sofvanh/ca-magic-search/blob/main/src/lib/server/openai.ts"
			>project source code</a
		>.
	</p>
</div>
