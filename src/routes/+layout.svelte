<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="fixed top-0 right-0 left-0 z-10 flex items-center justify-between bg-stone-50">
	<a href="/" class="flex flex-col items-center px-4 py-2">
		<h1 class="text-2xl font-black tracking-wider">Magic Search</h1>
		<p class="text-xs">For Community Archive</p>
	</a>
	<nav class="flex items-center gap-4 px-4 py-2">
		<a href="/">Home</a>
		<a href="/about">About</a>
		<a href="/contact">Data</a>
	</nav>
</header>

<div class="flex min-h-dvh flex-col pt-16">
	<main class="flex flex-1 flex-col">{@render children?.()}</main>

	<footer class="flex flex-col items-center justify-center bg-stone-50 px-4 py-8 text-sm">
		<p class="px-4 py-2">
			Created by <a href="https://sofiavanhanen.fi" target="_blank" rel="noopener noreferrer"
				>Sofia Vanhanen</a
			>
			|
			<a href="https://x.com/sofvanh" target="_blank" rel="noopener noreferrer">@sofvanh</a>
		</p>
		<p>
			Data from the <a
				href="https://www.community-archive.org/"
				target="_blank"
				rel="noopener noreferrer">Community Archive</a
			>
		</p>
	</footer>
</div>

<style>
	header a {
		color: var(--color-lime-600);
		transition:
			color 0.5s,
			text-decoration-color 0.5s;
		text-underline-offset: 4px;
		text-decoration-color: transparent;
	}
	footer a {
		color: var(--color-lime-600);
		text-decoration: underline;
		transition: color 0.2s;
	}
	header a:hover,
	footer a:hover {
		color: var(--color-lime-800);
		text-decoration: underline;
	}
	:global(textarea),
	:global(input) {
		font-family: inherit;
		font-size: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-stone-300, #d6d3d1);
		padding: 1rem;
		background: #fff;
		color: inherit;
		transition: border-color 0.2s;
	}
	:global(textarea:focus),
	:global(input:focus) {
		outline: none;
		border-color: var(--color-lime-600);
		box-shadow: 0 0 0 2px var(--color-lime-100);
	}
	:global(button) {
		font-family: inherit;
		font-size: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-lime-600);
		padding: 0.75rem 1.5rem;
		background: var(--color-lime-600);
		color: #fff;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s,
			color 0.2s;
	}
	:global(button:disabled) {
		opacity: 0.6;
		cursor: not-allowed;
	}
	:global(button:hover):not(:disabled),
	:global(button:focus):not(:disabled) {
		background: var(--color-lime-800);
		border-color: var(--color-lime-800);
	}
</style>
