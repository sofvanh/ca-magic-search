<script>
	import { onMount } from 'svelte';

	const projects = [
		'learning about longevity',
		'cofounding an ML startup',
		'entering the jhanas',
		'building AGI alignment tools',
		'consciousness research in 2025',
		'aesthetic nomad vibes',
		'creating meditation apps for teens',
		'trauma-sensitive coaching',
		'making it big on X as an introvert',
		'understanding the opposite sex',
		'painting an impressionist mural'
	];

	let currentIndex = 0;
	let isAnimating = false;

	onMount(() => {
		const interval = setInterval(() => {
			isAnimating = true;
			setTimeout(() => {
				currentIndex = (currentIndex + 1) % projects.length;
				isAnimating = false;
			}, 500);
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<div class="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 p-4">
	<h1 class="text-center text-2xl font-semibold tracking-wider">Who do you need right now?</h1>
	<p class="text-center">
		Find the best person for
		<span
			class="fade-in-out inline-block rounded-md bg-lime-100 px-2 py-1 transition-all duration-1000"
			class:opacity-0={isAnimating}
			class:scale-95={isAnimating}
			class:translate-y-2={isAnimating}
		>
			{projects[currentIndex]}
		</span>
	</p>

	<form class="relative w-full" action="/search">
		<input
			name="q"
			type="text"
			class="focus:shadow-3xl w-full p-4 pr-20! shadow-lg shadow-lime-500/20! transition-all! duration-300 focus:shadow-2xl! focus:shadow-lime-500/50!"
			placeholder="What are you searching for?"
			required
		/>
		<button class="absolute top-2 right-2 p-2!" aria-label="Search">Search</button>
	</form>

	<p class="text-center text-sm text-stone-500">
		Search the entire <a
			href="https://www.community-archive.org/"
			target="_blank"
			rel="noopener noreferrer"
			class="text-lime-700 underline hover:text-lime-900">Community Archive</a
		> for your niche need
	</p>
	<p class="text-center text-sm text-stone-500">
		Curious how it works? Look up users in the <a
			href="/users"
			class="text-lime-700 underline hover:text-lime-900">username search</a
		> and see behind the scenes
	</p>
</div>
