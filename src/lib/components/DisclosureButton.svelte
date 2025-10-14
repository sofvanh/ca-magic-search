<script lang="ts">
	const { label, isOpenAtStart = false, onOpen = undefined, children } = $props();
</script>

<details open={isOpenAtStart} class="group" ontoggle={onOpen}>
	<summary
		class="-mx-2 w-fit cursor-pointer rounded bg-stone-100 px-3 py-1 text-sm text-stone-700 hover:bg-stone-200"
		style="list-style: none;"
	>
		<span aria-hidden="true" class="inline-block transition-transform group-open:rotate-180">↓</span
		>
		{label}
	</summary>
	<div class="mt-2 text-sm text-stone-600">
		{@render children?.()}
	</div>
</details>
