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
	<div class="mb-2 flex flex-row gap-4">
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
		<p class="text-sm text-stone-500">{(distance * 100).toFixed(2)}%</p>
	</div>

	{#if explanation}
		<p class="text-stone-500" in:slide out:slide>{explanation}</p>
	{:else if isLoading}
		<p class="text-stone-400 italic" in:slide out:slide>Loading explanation...</p>
	{:else}
		<button onclick={loadExplanation} out:slide>
			Load explanation <span aria-hidden="true">↓</span>
		</button>
	{/if}
</div>

<style>
	button {
		display: inline-flex;
		align-items: center;
		gap: 0.25em;
		padding: 0.25em 0.75em;
		/* border: 1px solid #d4d4d8; */
		border: none;
		border-radius: 0.375em;
		background: var(--color-stone-100);
		color: var(--color-stone-700);
		font-size: 0.95em;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}
	button:hover {
		background: var(--color-stone-200);
		border-color: var(--color-stone-300);
		color: var(--color-stone-700);
	}
</style>
