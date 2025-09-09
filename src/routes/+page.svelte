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
	<h1 class="text-center text-2xl font-black">Who do you need right now?</h1>
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
			class="w-full p-4 pr-20!"
			placeholder="What are you searching for?"
			required
		/>
		<button class="absolute top-2 right-2 p-2!" aria-label="Search">Search</button>
	</form>

	<p class="text-center text-sm text-stone-500">
		Search the entire Community Archive for your niche need
	</p>
</div>
