<script lang="ts">
	let usernames = $state('');
	let adminPassword = $state('');
	let processing = $state(false);
	let result = $state('');

	async function processUsers(event: SubmitEvent) {
		event.preventDefault();
		processing = true;
		result = '';

		try {
			const usernameList = usernames
				.split('\n')
				.map((u) => u.trim())
				.filter((u) => u.length > 0);

			const response = await fetch('/api/process_users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					usernames: usernameList,
					adminPassword
				})
			});

			const data = await response.json();
			result = data.success
				? `Success! Received ${data.summaries ? Object.keys(data.summaries).length : 0} summaries. Here are the summaries: ` +
					JSON.stringify(data.summaries, null, 2)
				: `Error: ${data.error}`;
		} catch (error) {
			result = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			processing = false;
		}
	}
</script>

<form onsubmit={processUsers} class="mx-auto w-full max-w-2xl">
	<h1 class="my-12 text-2xl font-black">Process User Archives</h1>

	<div class="flex flex-col gap-2">
		<label for="usernames">Usernames (one per line):</label>
		<textarea id="usernames" bind:value={usernames} rows="5" placeholder="username" required
		></textarea>

		<label for="password">Admin Password:</label>
		<input id="password" type="password" bind:value={adminPassword} required />

		<button type="submit" disabled={processing}>
			{processing ? 'Processing...' : 'Fetch tweets and generate summaries'}
		</button>
	</div>

	{#if result}
		<div class="result">{result}</div>
	{/if}
</form>
