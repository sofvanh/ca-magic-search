<script lang="ts">
	import type { PageProps } from './$types';
	import SearchResult from '$lib/components/SearchResult.svelte';

	const { data }: PageProps = $props();
</script>

<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 p-4">
	<h1 class="text-2xl font-black">Search results for "{data.query}"</h1>

	{#each data.results as result}
		<SearchResult
			username={result.username}
			displayName={result.displayName}
			summary={result.summary}
			distance={result.distance}
			query={data.query}
		/>
	{/each}
</div>
