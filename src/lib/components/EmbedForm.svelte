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

	function removeComponent(index: number) {
		embed.removeComponent(index);
	}

	function updateComponent(index: number, field: string, value: any) {
		embed.updateComponent(index, field, value);
	}

	function addSelectOption(componentIndex: number) {
		embed.addSelectOption(componentIndex);
	}

	function updateSelectOption(componentIndex: number, optionIndex: number, field: string, value: any) {
		embed.updateSelectOption(componentIndex, optionIndex, field, value);
	}

	function removeSelectOption(componentIndex: number, optionIndex: number) {
		embed.removeSelectOption(componentIndex, optionIndex);
	}

	function updateEmbed(field: string, value: any) {
		embed.setField('embed', { ...$embed.embed, [field]: value });
	}

	function validateNumberInput(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/[^0-9]/g, '');
	}

	$: canAddMoreComponents = !$embed.components || $embed.components.length < 25;
</script>

<div class="text-[#dcddde]">
	<h2 class="text-2xl font-bold mb-4">Embed Details</h2>

	<div class="mb-4">
		<label class="block text-[#dcddde] text-sm font-bold mb-2" for="content">
			Content
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
			id="content"
			type="text"
			bind:value={$embed.content}
			on:input={(e) => embed.setField('content', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-[#dcddde] text-sm font-bold mb-2" for="title">
			Title
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
			id="title"
			type="text"
			bind:value={$embed.embed.title}
			on:input={(e) => updateEmbed('title', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<label class="block text-[#dcddde] text-sm font-bold mb-2" for="description">
			Description
		</label>
		<textarea
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
			id="description"
			bind:value={$embed.embed.description}
			on:input={(e) => updateEmbed('description', e.target.value)}
		></textarea>
	</div>

	<div class="mb-4">
		<label class="block text-[#dcddde] text-sm font-bold mb-2" for="color">
			Color
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
			id="color"
			type="color"
			bind:value={$embed.embed.color}
			on:input={(e) => updateEmbed('color', e.target.value)}
		>
	</div>

	<div class="mb-4">
		<h3 class="text-xl font-bold mb-2">Author</h3>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
			type="text"
			placeholder="Author Name"
			bind:value={$embed.embed.author.name}
			on:input={(e) => updateEmbed('author', { ...$embed.embed.author, name: e.target.value })}
		>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
			type="text"
			placeholder="Author URL"
			bind:value={$embed.embed.author.url}
			on:input={(e) => updateEmbed('author', { ...$embed.embed.author, url: e.target.value })}
		>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
			type="text"
			placeholder="Author Icon URL"
			bind:value={$embed.embed.author.icon_url}
			on:input={(e) => updateEmbed('author', { ...$embed.embed.author, icon_url: e.target.value })}
		>
	</div>

	<div class="mb-4">
		<h3 class="text-xl font-bold mb-2">Fields</h3>
		{#if $embed.embed.fields && $embed.embed.fields.length > 0}
			{#each $embed.embed.fields as field, i}
				<div class="mb-2 p-2 border border-[#40444b] rounded">
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
						type="text"
						placeholder="Field Name"
						bind:value={field.name}
						on:input={(e) => embed.updateField(i, 'name', e.target.value)}
					>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
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
						class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2"
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
	</div>

	<h3 class="text-xl font-bold mb-2 mt-4">Components</h3>
	{#if $embed.components && $embed.components.length > 0}
		<div class="flex flex-wrap gap-2 mb-4">
			{#each $embed.components as component, i}
				{#if component.IsSelect}
					<div class="w-full mb-4 p-4 border border-[#40444b] rounded">
						<div class="mb-2">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`component-${i}-id`}>
								ID
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`component-${i}-id`}
								type="number"
								bind:value={component.Id}
								on:input={(e) => {
                  validateNumberInput(e);
                  updateComponent(i, 'Id', parseInt(e.target.value));
                }}
							>
						</div>
						<div class="mb-2">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`component-${i}-name`}>
								Name
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`component-${i}-name`}
								type="text"
								bind:value={component.DisplayName}
								on:input={(e) => updateComponent(i, 'Name', e.target.value)}
							>
						</div>
						<div class="mb-2">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`component-${i}-min-options`}>
								Min Options
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`component-${i}-min-options`}
								type="number"
								bind:value={component.MinOptions}
								on:input={(e) => {
                  validateNumberInput(e);
                  updateComponent(i, 'MinOptions', parseInt(e.target.value));
                }}
							>
						</div>
						<div class="mb-2">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`component-${i}-max-options`}>
								Max Options
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`component-${i}-max-options`}
								type="number"
								bind:value={component.MaxOptions}
								on:input={(e) => {
                  validateNumberInput(e);
                  updateComponent(i, 'MaxOptions', parseInt(e.target.value));
                }}
							>
						</div>
						<h4 class="font-bold mt-2 mb-1">Options</h4>
						{#if component.Options && component.Options.length > 0}
							{#each component.Options as option, optionIndex}
								<div class="mb-2 p-2 border border-[#40444b] rounded">
									<input
										class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
										type="number"
										placeholder="Option ID"
										bind:value={option.Id}
										on:input={(e) => {
                      validateNumberInput(e);
                      updateSelectOption(i, optionIndex, 'Id', parseInt(e.target.value));
                    }}
									>
									<input
										class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
										type="text"
										placeholder="Option Name"
										bind:value={option.Name}
										on:input={(e) => updateSelectOption(i, optionIndex, 'Name', e.target.value)}
									>
									<input
										class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
										type="text"
										placeholder="Description"
										bind:value={option.Description}
										on:input={(e) => updateSelectOption(i, optionIndex, 'Description', e.target.value)}
									>
									<button
										class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
										on:click={() => removeSelectOption(i, optionIndex)}
									>
										Remove Option
									</button>
								</div>
							{/each}
						{/if}
						<button
							class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2"
							on:click={() => addSelectOption(i)}
						>
							Add Option
						</button>
					</div>
				{:else}
					<div class="mb-4 p-4 border border-[#40444b] rounded">
						<div class="mb-2">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`component-${i}-id`}>
								ID
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`component-${i}-id`}
								type="number"
								bind:value={component.Id}
								on:input={(e) => {
                  validateNumberInput(e);
                  updateComponent(i, 'Id', parseInt(e.target.value));
                }}
							>
						</div>
						<input
							class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
							type="text"
							placeholder="Button Label"
							bind:value={component.Options[0].Name}
							on:input={(e) => updateSelectOption(i, 0, 'Name', e.target.value)}
						>
						<select
							class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
							bind:value={component.style}
							on:change={(e) => updateComponent(i, 'style', parseInt(e.target.value))}
						>
							<option value={1}>Primary</option>
							<option value={2}>Secondary</option>
							<option value={3}>Success</option>
							<option value={4}>Danger</option>
						</select>
					</div>
				{/if}
				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
					on:click={() => removeComponent(i)}
				>
					Remove Component
				</button>
			{/each}
		</div>
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
		<p class="text-red-500 mt-2">Maximum number of components (25) reached.</p>
	{/if}
</div>