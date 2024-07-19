<script lang="ts">
	import { embed } from '$lib/embedStore';
	import { fade } from 'svelte/transition';

	let jsonString = '';
	let copied = false;

	$: {
		jsonString = JSON.stringify({ Embeds: $embed.Embeds, components: $embed.components }, null, 2);
	}

	function updateJson() {
		embed.updateFromJson(jsonString);
	}

	async function copyToClipboard() {				
		try {
			await navigator.clipboard.writeText(jsonString);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}
</script>

<div class="bg-[#2f3136] p-4 rounded">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-2xl font-bold text-white">JSON Preview</h2>
		<div class="relative">
			<button
				on:click={copyToClipboard}
				class="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Copy JSON
			</button>
			{#if copied}
        <span
					transition:fade="{{ duration: 200 }}"
					class="absolute right-0 mt-2 px-2 py-1 bg-green-500 text-white text-sm rounded"
				>
          Copied!
        </span>
			{/if}
		</div>
	</div>
	<textarea
		class="w-full h-64 bg-[#40444b] text-white p-2 rounded"
		bind:value={jsonString}
		on:input={updateJson}
	></textarea>
</div>