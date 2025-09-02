<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="flex items-center justify-between bg-stone-50">
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
</style>
