<script lang="ts">
	import type { SupabaseAccountInfo } from '$lib/types';

	let adminPassword = $state('');
	let step = $state(1); // 1: password, 2: user list, 3: processing, 4: complete
	let userList = $state<SupabaseAccountInfo[]>([]);
	let progress = $state(0);
	let currentUser = $state('');
	let result = $state('');
	let error = $state('');

	async function getUsersToProcess(event: SubmitEvent) {
		event.preventDefault();
		try {
			const response = await fetch('/api/get_new_users', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${adminPassword}`
				}
			});

			const data = await response.json();
			if (data.success) {
				userList = data.newUsers;
				step = 2;
				error = '';
			} else {
				error = data.error;
			}
		} catch (err) {
			error = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		}
	}

	async function startProcessing() {
		step = 3;
		progress = 0;
		currentUser = '';
		result = '';

		try {
			const response = await fetch('/api/process_users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'text/event-stream'
				},
				body: JSON.stringify({
					usernames: userList.map((user) => user.username),
					adminPassword
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			if (!reader) {
				throw new Error('No response body');
			}

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.slice(6));

							switch (data.type) {
								case 'start':
									progress = 0;
									break;

								case 'progress':
									progress = Math.round((data.current / data.total) * 100);
									currentUser = data.username;
									break;

								case 'complete':
									result = `Success! Processed ${data.total} users.`;
									step = 4;
									break;

								case 'error':
									if (data.username) {
										// Error for specific user, continue processing
										console.error(`Error processing ${data.username}: ${data.error}`);
									} else {
										// Fatal error, stop processing
										error = data.error;
										step = 1;
									}
									break;
							}
						} catch (parseError) {
							console.error('Error parsing SSE data:', parseError);
						}
					}
				}
			}
		} catch (err) {
			error = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
			step = 1;
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl p-4">
	<h1 class="my-12 text-2xl font-black">Process All New Users</h1>

	{#if error}
		<div class="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}

	{#if step === 1}
		<!-- Step 1: Admin Password -->
		<form onsubmit={getUsersToProcess} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label for="password">Admin Password:</label>
				<input id="password" type="password" bind:value={adminPassword} required />
			</div>

			<button type="submit" disabled={!adminPassword}> Get Users to Process </button>
		</form>
	{/if}

	{#if step === 2}
		<!-- Step 2: User List Confirmation -->
		<form onsubmit={startProcessing} class="flex flex-col gap-4">
			<h2 class="text-xl font-bold">Users to Process ({userList.length})</h2>
			<div class="max-h-60 overflow-y-auto rounded-md border border-stone-200 p-4">
				{#each userList as user}
					<div class="py-1">@{user.username} ({user.account_display_name})</div>
				{/each}
			</div>

			<button type="submit" class="rounded bg-green-600 px-4 py-2 text-white"> Proceed </button>
		</form>
	{/if}

	{#if step === 3}
		<!-- Step 3: Processing with Real-time Progress -->
		<div class="flex flex-col gap-4">
			<h2 class="text-xl font-bold">Processing Users...</h2>
			<div class="h-2.5 w-full rounded-full bg-gray-200">
				<div
					class="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
					style="width: {progress}%"
				></div>
			</div>
			<div class="flex justify-between text-sm text-gray-600">
				<span>{progress}% Complete</span>
				{#if currentUser}
					<span>Processing: {currentUser}</span>
				{/if}
			</div>
		</div>
	{/if}

	{#if step === 4}
		<!-- Step 4: Complete -->
		<div class="flex flex-col gap-4">
			<h2 class="text-xl font-bold text-lime-600">Processing Complete!</h2>
			<div class="rounded border border-lime-200 bg-lime-50 p-4">
				{result}
			</div>
		</div>
	{/if}
</div>
