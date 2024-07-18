<script lang="ts">
	import { embed } from '$lib/embedStore';
	import { writable } from 'svelte/store';

	const isCollapsed = writable(false);

	function toggleCollapse() {
		isCollapsed.update(v => !v);
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(JSON.stringify($embed, null, 2));
	}
</script>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-2xl font-bold">JSON Preview</h2>
		<div>
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
				on:click={copyToClipboard}
			>
				Copy JSON
			</button>
			<button
				class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				on:click={toggleCollapse}
			>
				{$isCollapsed ? 'Expand' : 'Collapse'}
			</button>
		</div>
	</div>

	{#if !$isCollapsed}
    <pre class="bg-gray-100 p-4 rounded overflow-x-auto">
      <code>{JSON.stringify($embed, null, 2)}</code>
    </pre>
	{/if}
</div>