<script lang="ts">
	import { slide } from 'svelte/transition';
	const { username, displayName, summary, distance, query } = $props();

	let explanation: string | null = $state(null);
	let isLoading: boolean = $state(false);
	let showTooltip: boolean = $state(false);

	async function loadExplanation() {
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
				class="mr-auto h-fit rounded-md bg-lime-100 px-2 py-1 text-lime-700 transition-all duration-200 hover:bg-lime-200 hover:text-lime-800"
			>
				@{username}
			</a>
		</div>
		<div class="relative inline-block">
			<span
				class="cursor-help text-sm text-stone-500"
				onmouseenter={() => (showTooltip = true)}
				onmouseleave={() => (showTooltip = false)}
				onclick={() => (showTooltip = !showTooltip)}
				onkeydown={(e) => e.key === 'Enter' && (showTooltip = !showTooltip)}
				role="button"
				tabindex="0"
			>
				{(distance * 100).toFixed(2)}%
			</span>
			{#if showTooltip}
				<div
					class="absolute top-full right-0 z-10 mt-1 w-48 rounded-md bg-stone-800 px-2 py-1 text-xs text-white shadow-lg"
				>
					Semantic similarity between the query and the user
				</div>
			{/if}
		</div>
	</div>

	{#if explanation}
		<div class="text-sm text-stone-500" in:slide|global out:slide|global>
			<p>
				{explanation}
			</p>
			<a
				href={`/users?q=${username}`}
				class="mt-2 block text-lime-600 hover:text-lime-700 hover:underline"
			>
				View full user summary
			</a>
		</div>
	{:else if isLoading}
		<div class="flex items-center gap-2 text-stone-500" in:slide|global out:slide|global>
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-lime-500 border-t-transparent"
			></div>
			<span>Generating...</span>
		</div>
	{:else}
		<button in:slide|global out:slide|global onclick={loadExplanation} class="text-sm!">
			<span aria-hidden="true">↓</span>
			How are they relevant?
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
