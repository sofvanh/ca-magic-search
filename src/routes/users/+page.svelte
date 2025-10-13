<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();

	let searchQuery = $state(page.url.searchParams.get('q') || '');
	let isLoading = $state(false);

	async function handleSearch(e: Event) {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		isLoading = true;
		await goto(`/users?q=${encodeURIComponent(searchQuery)}`, {
			keepFocus: true,
			noScroll: true
		});
		isLoading = false;
	}
</script>

<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
	<h1 class="text-2xl font-semibold tracking-wider">Search by username</h1>
	<p class="">Find out how Magic Search sees you</p>

	<form class="relative w-full" onsubmit={handleSearch}>
		<input
			bind:value={searchQuery}
			name="q"
			type="text"
			class="focus:shadow-3xl w-full p-4 pr-20! shadow-lg shadow-lime-500/20! transition-all! duration-300 focus:shadow-2xl! focus:shadow-lime-500/50!"
			placeholder="username"
			required
			disabled={isLoading}
		/>
		<button class="absolute top-2 right-2 p-2!" aria-label="Search" disabled={isLoading}>
			{isLoading ? '...' : 'Search'}
		</button>
	</form>

	{#if !data.results}
		<p class="text-sm text-stone-500">Finds matching usernames and their summaries</p>
	{/if}

	{#if isLoading}
		<div class="flex items-center gap-2 text-stone-500">
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-lime-500 border-t-transparent"
			></div>
			<span>Searching...</span>
		</div>
	{/if}

	{#if data.results}
		<p class="mb-2 text-stone-500">
			Found {data.results.length} result{data.results.length === 1 ? '' : 's'}
		</p>
		{#each data.results as result}
			<div class="w-full rounded-md border border-stone-200 p-4">
				<div class="mb-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
					{#if result.displayName}
						<h2 class="text-lg font-semibold">{result.displayName}</h2>
					{/if}
					<a
						href={`https://x.com/${result.username}`}
						target="_blank"
						class="mr-auto rounded-md bg-lime-100 px-2 py-1 text-lime-700 transition-all duration-200 hover:bg-lime-200 hover:text-lime-800"
					>
						@{result.username}
					</a>
				</div>

				<p class="my-2 text-sm text-stone-500">
					{result.tweetCount} tweets • Generated {new Date(result.createdAt).toLocaleDateString()}
				</p>

				<details class="group">
					<summary
						class="-mx-2 w-fit cursor-pointer rounded bg-stone-100 px-3 py-1 text-sm text-stone-700 hover:bg-stone-200"
						style="list-style: none;"
					>
						<span aria-hidden="true" class="inline-block transition-transform group-open:rotate-180"
							>↓</span
						>
						Summary
					</summary>
					<p class="mt-2 text-sm whitespace-pre-line text-stone-600">{result.summary}</p>
				</details>
			</div>
		{/each}
	{/if}
</div>
