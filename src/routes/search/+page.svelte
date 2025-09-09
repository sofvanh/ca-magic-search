<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 p-4">
	<h1 class="text-2xl font-black">Search results for "{data.query}"</h1>

	{#each data.results as result}
		<a href={`https://x.com/${result.username}`} target="_blank">
			<div class="w-full rounded-md border border-stone-200 p-4">
				<div class="flex flex-row gap-4 align-bottom">
					<!-- <h2 class="text-lg font-semibold">{result.displayName}</h2> -->
					<h2 class="text-lime-600">@{result.username}</h2>
					<p class="ml-auto text-sm text-stone-500">80%</p>
				</div>
				<p class="text-stone-500">{result.explanation}</p>
				<!-- <p>{result.summary.length > 200 ? result.summary.slice(0, 200) + '…' : result.summary}</p> -->
			</div>
		</a>
	{/each}
</div>
