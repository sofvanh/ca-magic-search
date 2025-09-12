<script lang="ts">
	import { slide } from 'svelte/transition';
	const { username, displayName, summary, distance, query } = $props();

	let explanation: string | null = $state(null);
	let isLoading: boolean = $state(false);

	async function loadExplanation() {
		console.log('Loading explanation for', username);
		isLoading = true;

		try {
			const response = await fetch('/api/explain_result', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					summary,
					query
				})
			});
			const data = await response.json();
			explanation = data.explanation;
			console.log('Loaded explanation for', username);
		} catch (error) {
			console.error('Failed to load explanation:', error);
			explanation = 'Explanation unavailable';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="w-full rounded-md border border-stone-200 p-4">
	<div class="flex flex-row justify-between gap-2">
		<div class="mb-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
			{#if displayName}
				<h2 class="text-lg font-semibold">{displayName}</h2>
			{/if}
			<a
				href={`https://x.com/${username}`}
				target="_blank"
				class="mr-auto rounded-md bg-lime-100 px-2 py-1 text-lime-700 transition-all duration-200 hover:bg-lime-200 hover:text-lime-800"
			>
				@{username}
			</a>
		</div>
		<p class="text-sm text-stone-500">{(distance * 100).toFixed(2)}%</p>
	</div>

	{#if explanation}
		<p class="text-sm text-stone-500" in:slide|global out:slide|global>
			{explanation}
		</p>
	{:else if isLoading}
		<p class="text-sm text-stone-400 italic" in:slide|global out:slide|global>Loading...</p>
	{:else}
		<button in:slide|global out:slide|global onclick={loadExplanation} class="text-sm!">
			<span aria-hidden="true">↓</span>
			Details
		</button>
	{/if}
</div>

<style>
	button {
		display: block;
		padding: 0.25em 0.75em;
		border: none;
		background: var(--color-stone-100);
		color: var(--color-stone-700);
	}
	button:hover {
		background: var(--color-stone-200);
		color: var(--color-stone-700);
	}
</style>
