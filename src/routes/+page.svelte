<script lang="ts">
	import EmbedForm from '$lib/components/EmbedForm.svelte';
	import EmbedPreview from '$lib/components/EmbedPreview.svelte';
	import JsonPreview from '$lib/components/JsonPreview.svelte';

	let activeTab: 'form' | 'json' = 'form';
</script>

<div class="flex flex-col md:flex-row h-screen bg-[#36393f]">
	<div class="w-full md:w-1/2 flex flex-col p-2">
		<div class="bg-[#2f3136] rounded-lg overflow-hidden flex-grow">
			<div class="flex bg-[#202225] text-[#dcddde]">
				<button
					class="px-4 py-2 focus:outline-none {activeTab === 'form' ? 'bg-[#2f3136] font-bold' : 'hover:bg-[#40444b]'}"
					on:click={() => activeTab = 'form'}
				>
					Embed Form
				</button>
				<button
					class="px-4 py-2 focus:outline-none {activeTab === 'json' ? 'bg-[#2f3136] font-bold' : 'hover:bg-[#40444b]'}"
					on:click={() => activeTab = 'json'}
				>
					JSON Preview
				</button>
			</div>
			<div class="p-4 h-[calc(50vh-3rem)] md:h-[calc(100vh-6rem)] overflow-auto">
				{#if activeTab === 'form'}
					<EmbedForm />
				{:else}
					<JsonPreview />
				{/if}
			</div>
		</div>
	</div>
	<div class="w-full md:w-1/2 bg-[#36393f] p-2">
		<div class="bg-[#2f3136] h-[calc(50vh-1rem)] md:h-full rounded-lg p-4 overflow-auto">
			<EmbedPreview />
		</div>
	</div>
</div>

<style>
    :global(body) {
        background-color: #36393f;
        color: #dcddde;
    }
</style>