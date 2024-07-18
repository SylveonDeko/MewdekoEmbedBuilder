<script lang="ts">
	import { embed } from '$lib/embedStore';

	function addField() {
		embed.addField();
	}

	function removeField(index: number) {
		embed.removeField(index);
	}

	function addButton() {
		embed.addComponent(false);
	}

	function addSelectMenu() {
		embed.addComponent(true);
	}

	function removeComponent(rowIndex: number, componentIndex: number) {
		embed.removeComponent(rowIndex, componentIndex);
	}

	function updateComponent(rowIndex: number, componentIndex: number, field: string, value: any) {
		embed.updateComponent(rowIndex, componentIndex, field, value);
	}

	function addSelectOption(rowIndex: number, componentIndex: number) {
		embed.addSelectOption(rowIndex, componentIndex);
	}

	function updateSelectOption(rowIndex: number, componentIndex: number, optionIndex: number, field: string, value: any) {
		embed.updateSelectOption(rowIndex, componentIndex, optionIndex, field, value);
	}

	function removeSelectOption(rowIndex: number, componentIndex: number, optionIndex: number) {
		embed.removeSelectOption(rowIndex, componentIndex, optionIndex);
	}

	function updateEmbed(field: string, value: any) {
		embed.setField('embed', { ...$embed.embed, [field]: value });
	}

	function updateAuthor(field: string, value: string) {
		embed.setField('embed', {
			...$embed.embed,
			author: {
				...$embed.embed.author,
				[field]: value
			}
		});
	}

	function updateFooter(field: string, value: string) {
		embed.setField('embed', {
			...$embed.embed,
			footer: {
				...$embed.embed.footer,
				[field]: value
			}
		});
	}

	function updateThumbnail(value: string) {
		embed.setField('embed', {
			...$embed.embed,
			thumbnail: {
				url: value
			}
		});
	}

	function updateImage(value: string) {
		embed.setField('embed', {
			...$embed.embed,
			image: {
				url: value
			}
		});
	}

	$: canAddMoreComponents = !$embed.components || $embed.components.length < 5;
</script>

<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
	<h2 class="text-2xl font-bold mb-4">Embed Details</h2>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="title">
			Title
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="title"
			type="text"
			bind:value={$embed.embed.title}
			on:input={(e) => updateEmbed('title', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="description">
			Description
		</label>
		<textarea
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="description"
			bind:value={$embed.embed.description}
			on:input={(e) => updateEmbed('description', e.target.value)}
		></textarea>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="color">
			Color
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="color"
			type="color"
			bind:value={$embed.embed.color}
			on:input={(e) => updateEmbed('color', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="author_name">
			Author Name
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="author_name"
			type="text"
			bind:value={$embed.embed.author.name}
			on:input={(e) => updateAuthor('name', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="author_icon_url">
			Author Icon URL
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="author_icon_url"
			type="text"
			bind:value={$embed.embed.author.icon_url}
			on:input={(e) => updateAuthor('icon_url', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="footer_text">
			Footer Text
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="footer_text"
			type="text"
			bind:value={$embed.embed.footer.text}
			on:input={(e) => updateFooter('text', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="footer_icon_url">
			Footer Icon URL
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="footer_icon_url"
			type="text"
			bind:value={$embed.embed.footer.icon_url}
			on:input={(e) => updateFooter('icon_url', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="thumbnail_url">
			Thumbnail URL
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="thumbnail_url"
			type="text"
			bind:value={$embed.embed.thumbnail.url}
			on:input={(e) => updateThumbnail(e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="image_url">
			Image URL
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			id="image_url"
			type="text"
			bind:value={$embed.embed.image.url}
			on:input={(e) => updateImage(e.target.value)}
		>
	</div>

	<h3 class="text-xl font-bold mb-2">Fields</h3>
	{#if $embed.embed?.fields && $embed.embed.fields.length > 0}
		{#each $embed.embed.fields as field, i}
			<div class="mb-4 p-4 border rounded">
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
					type="text"
					placeholder="Field Name"
					bind:value={field.name}
					on:input={(e) => embed.updateField(i, 'name', e.target.value)}
				>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
					type="text"
					placeholder="Field Value"
					bind:value={field.value}
					on:input={(e) => embed.updateField(i, 'value', e.target.value)}
				>
				<label class="inline-flex items-center">
					<input
						type="checkbox"
						class="form-checkbox"
						bind:checked={field.inline}
						on:change={(e) => embed.updateField(i, 'inline', e.target.checked)}
					>
					<span class="ml-2">Inline</span>
				</label>
				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
					on:click={() => removeField(i)}
				>
					Remove Field
				</button>
			</div>
		{/each}
	{/if}
	<button
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
		on:click={addField}
	>
		Add Field
	</button>

	<h3 class="text-xl font-bold mb-2 mt-4">Components</h3>
	{#if $embed.components && $embed.components.length > 0}
		{#each $embed.components as row, rowIndex}
			<div class="mb-4 p-4 border rounded">
				{#each row as component, componentIndex}
					<div class="mb-4 p-4 border rounded">
						<input
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
							type="text"
							placeholder="Display Name"
							bind:value={component.displayName}
							on:input={(e) => updateComponent(rowIndex, componentIndex, 'displayName', e.target.value)}
						>
						{#if !component.isSelect}
							<select
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
								bind:value={component.style}
								on:change={(e) => updateComponent(rowIndex, componentIndex, 'style', parseInt(e.target.value))}
							>
								<option value={1}>Primary</option>
								<option value={2}>Secondary</option>
								<option value={3}>Success</option>
								<option value={4}>Danger</option>
							</select>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
								type="number"
								placeholder="ID"
								bind:value={component.id}
								on:input={(e) => updateComponent(rowIndex, componentIndex, 'id', parseInt(e.target.value))}
							>
						{:else}
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
								type="number"
								placeholder="Min Options"
								bind:value={component.minOptions}
								on:input={(e) => updateComponent(rowIndex, componentIndex, 'minOptions', parseInt(e.target.value))}
							>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
								type="number"
								placeholder="Max Options"
								bind:value={component.maxOptions}
								on:input={(e) => updateComponent(rowIndex, componentIndex, 'maxOptions', parseInt(e.target.value))}
							>
							<h4 class="font-bold mt-2 mb-1">Options</h4>
							{#if component.options && component.options.length > 0}
								{#each component.options as option, optionIndex}
									<div class="mb-2 p-2 border rounded">
										<input
											class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
											type="text"
											placeholder="Option Name"
											bind:value={option.name}
											on:input={(e) => updateSelectOption(rowIndex, componentIndex, optionIndex, 'name', e.target.value)}
										>
										<input
											class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
											type="text"
											placeholder="Option Description"
											bind:value={option.description}
											on:input={(e) => updateSelectOption(rowIndex, componentIndex, optionIndex, 'description', e.target.value)}
										>
										<input
											class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
											type="text"
											placeholder="Option Emoji"
											bind:value={option.emoji}
											on:input={(e) => updateSelectOption(rowIndex, componentIndex, optionIndex, 'emoji', e.target.value)}
										>
										<button
											class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
											on:click={() => removeSelectOption(rowIndex, componentIndex, optionIndex)}
										>
											Remove Option
										</button>
									</div>
								{/each}
							{/if}
							<button
								class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2"
								on:click={() => addSelectOption(rowIndex, componentIndex)}
							>
								Add Option
							</button>
						{/if}
						<button
							class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
							on:click={() => removeComponent(rowIndex, componentIndex)}
						>
							Remove Component
						</button>
					</div>
				{/each}
			</div>
		{/each}
	{/if}
	{#if canAddMoreComponents}
		<div class="flex space-x-2">
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				on:click={addButton}
			>
				Add Button
			</button>
			<button
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				on:click={addSelectMenu}
			>
				Add Select Menu
			</button>
		</div>
	{:else}
		<p class="text-red-500 mt-2">Maximum number of component rows (5) reached.</p>
	{/if}
</div>