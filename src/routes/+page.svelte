<script lang="ts">
	import EmbedForm from '$lib/components/EmbedForm.svelte';
	import EmbedPreview from '$lib/components/EmbedPreview.svelte';
	import JsonPreview from '$lib/components/JsonPreview.svelte';
	import { writable } from 'svelte/store';

	const isJsonCollapsed = writable(false);
</script>

<div class="flex h-screen bg-gray-100">
	<div class="w-1/2 flex flex-col">
		<div class="flex-grow overflow-auto p-4" style="height: {$isJsonCollapsed ? 'calc(100% - 50px)' : '50%'}">
			<EmbedForm />
		</div>
		<div class="flex-shrink-0 overflow-auto p-4" style="height: {$isJsonCollapsed ? '50px' : '50%'}">
			<JsonPreview bind:isCollapsed={$isJsonCollapsed} />
		</div>
	</div>
	<div class="w-1/2 bg-[#36393f] p-4 overflow-auto">
		<EmbedPreview />
	</div>
</div>