<script lang="ts">
	import { embed } from '$lib/embedStore';

	function copyToClipboard() {
		navigator.clipboard.writeText(JSON.stringify($embed, null, 2));
	}
</script>

<div class="bg-[#2f3136] text-[#dcddde]">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-2xl font-bold">JSON Preview</h2>
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			on:click={copyToClipboard}
		>
			Copy JSON
		</button>
	</div>

	<pre class="bg-[#202225] p-4 rounded overflow-x-auto">
    <code>{JSON.stringify($embed, null, 2)}</code>
  </pre>
</div>