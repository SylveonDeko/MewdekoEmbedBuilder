<script lang="ts">
	import { embed } from '$lib/embedStore';
	import { writable } from 'svelte/store';

	function addEmbed() {
		embed.addEmbed();
	}

	function removeEmbed(index: number) {
		embed.removeEmbed(index);
	}

	function updateEmbed(index: number, field: string, value: any) {
		embed.updateEmbed(index, field, value);
	}

	function addField(embedIndex: number) {
		embed.addEmbedField(embedIndex);
	}

	function removeField(embedIndex: number, fieldIndex: number) {
		embed.removeEmbedField(embedIndex, fieldIndex);
	}

	function updateField(embedIndex: number, fieldIndex: number, field: string, value: any) {
		embed.updateEmbedField(embedIndex, fieldIndex, field, value);
	}

	function addComponent(isSelect: boolean) {
		const newComponent = {
			Id: getNextAvailableId($embed.components),
			IsSelect: isSelect,
			style: isSelect ? undefined : 1,
			DisplayName: isSelect ? 'Select Menu' : 'Button',
			Options: []
		};
		embed.addComponent(newComponent);
	}

	function removeComponent(index: number) {
		embed.removeComponent(index);
	}

	function updateComponent(index: number, field: string, value: any) {
		embed.updateComponent(index, field, value);
	}

	function addComponentOption(componentIndex: number) {
		embed.addSelectOption(componentIndex);
	}

	function updateComponentOption(componentIndex: number, optionIndex: number, field: string, value: any) {
		embed.updateSelectOption(componentIndex, optionIndex, field, value);
	}

	function removeComponentOption(componentIndex: number, optionIndex: number) {
		embed.removeSelectOption(componentIndex, optionIndex);
	}

	function getNextAvailableId(components?: any[]): number {
		if (!components || components.length === 0) {
			return 1;
		}
		const maxId = Math.max(...components.map(c => c.Id));
		return maxId + 1;
	}

	$: canAddMoreEmbeds = $embed.Embeds.length < 10;

	// Collapsible state
	let embedsOpen = writable(true);
	let componentsOpen = writable(true);
	let embedsCollapsed = writable({});
	let componentsCollapsed = writable({});

	function toggleSection(section) {
		section.update(n => !n);
	}

	function toggleEmbed(index) {
		embedsCollapsed.update(collapsed => ({
			...collapsed,
			[index]: !collapsed[index]
		}));
	}

	function toggleComponent(index) {
		componentsCollapsed.update(collapsed => ({
			...collapsed,
			[index]: !collapsed[index]
		}));
	}
</script>

<div class="text-[#dcddde]">
	<h2 class="text-2xl font-bold mb-4">Embed Editor</h2>

	<!-- Embeds Section -->
	<div class="mb-8">
		<button class="w-full text-left font-bold py-2 px-4 rounded bg-[#40444b]" on:click={() => toggleSection(embedsOpen)}>
			Embeds {$embedsOpen ? '▼' : '►'}
		</button>
		{#if $embedsOpen}
			{#each $embed.Embeds as embedItem, embedIndex}
				<div class="mt-4 p-4 border border-[#40444b] rounded">
					<button class="w-full text-left font-bold mb-2" on:click={() => toggleEmbed(embedIndex)}>
						Embed {embedIndex + 1} {$embedsCollapsed[embedIndex] ? '►' : '▼'}
					</button>
					{#if !$embedsCollapsed[embedIndex]}
						<div class="mb-4">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`title-${embedIndex}`}>
								Title
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`title-${embedIndex}`}
								type="text"
								bind:value={embedItem.title}
								on:input={(e) => updateEmbed(embedIndex, 'title', e.target.value)}
							>
						</div>

						<div class="mb-4">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`description-${embedIndex}`}>
								Description
							</label>
							<textarea
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`description-${embedIndex}`}
								bind:value={embedItem.description}
								on:input={(e) => updateEmbed(embedIndex, 'description', e.target.value)}
							></textarea>
						</div>

						<div class="mb-4">
							<label class="block text-[#dcddde] text-sm font-bold mb-2" for={`color-${embedIndex}`}>
								Color
							</label>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
								id={`color-${embedIndex}`}
								type="color"
								bind:value={embedItem.color}
								on:input={(e) => updateEmbed(embedIndex, 'color', e.target.value)}
							>
						</div>

						<div class="mb-4">
							<h4 class="text-lg font-bold mb-2">Fields</h4>
							{#if embedItem.fields && embedItem.fields.length > 0}
								{#each embedItem.fields as field, fieldIndex}
									<div class="mb-4 p-2 border border-[#40444b] rounded">
										<input
											class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
											type="text"
											placeholder="Field Name"
											bind:value={field.name}
											on:input={(e) => updateField(embedIndex, fieldIndex, 'name', e.target.value)}
										>
										<input
											class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
											type="text"
											placeholder="Field Value"
											bind:value={field.value}
											on:input={(e) => updateField(embedIndex, fieldIndex, 'value', e.target.value)}
										>
										<label class="inline-flex items-center">
											<input
												type="checkbox"
												class="form-checkbox"
												bind:checked={field.inline}
												on:change={(e) => updateField(embedIndex, fieldIndex, 'inline', e.target.checked)}
											>
											<span class="ml-2">Inline</span>
										</label>
										<button
											class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2"
											on:click={() => removeField(embedIndex, fieldIndex)}
										>
											Remove Field
										</button>
									</div>
								{/each}
							{/if}
							<button
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								on:click={() => addField(embedIndex)}
							>
								Add Field
							</button>
						</div>

						<button
							class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							on:click={() => removeEmbed(embedIndex)}
						>
							Remove Embed
						</button>
					{/if}
				</div>
			{/each}
			{#if canAddMoreEmbeds}
				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
					on:click={addEmbed}
				>
					Add Embed
				</button>
			{/if}
		{/if}
	</div>

	<!-- Components Section -->
	<div class="mb-8">
		<button class="w-full text-left font-bold py-2 px-4 rounded bg-[#40444b]" on:click={() => toggleSection(componentsOpen)}>
			Components {$componentsOpen ? '▼' : '►'}
		</button>
		{#if $componentsOpen}
			{#if $embed.components}
				{#each $embed.components as component, index}
					<div class="mt-4 p-4 border border-[#40444b] rounded">
						<button class="w-full text-left font-bold mb-2" on:click={() => toggleComponent(index)}>
							{component.IsSelect ? 'Select Menu' : 'Button'} {index + 1} {$componentsCollapsed[index] ? '►' : '▼'}
						</button>
						{#if !$componentsCollapsed[index]}
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
								type="text"
								placeholder="Id"
								bind:value={component.Id}
								on:input={(e) => updateComponent(index, 'Id', e.target.value)}
							>
							<input
								class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
								type="text"
								placeholder="Display Name"
								bind:value={component.DisplayName}
								on:input={(e) => updateComponent(index, 'DisplayName', e.target.value)}
							>
							{#if !component.IsSelect}
								<select
									class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
									bind:value={component.style}
									on:change={(e) => updateComponent(index, 'style', parseInt(e.target.value))}
								>
									<option value={1}>Primary</option>
									<option value={2}>Secondary</option>
									<option value={3}>Success</option>
									<option value={4}>Danger</option>
								</select>
							{:else}
								<div class="mb-2">
									<label class="block text-[#dcddde] text-sm font-bold mb-2">
										Min Options
									</label>
									<input
										class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
										type="number"
										bind:value={component.MinOptions}
										on:input={(e) => updateComponent(index, 'MinOptions', parseInt(e.target.value))}
									>
								</div>
								<div class="mb-2">
									<label class="block text-[#dcddde] text-sm font-bold mb-2">
										Max Options
									</label>
									<input
										class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline"
										type="number"
										bind:value={component.MaxOptions}
										on:input={(e) => updateComponent(index, 'MaxOptions', parseInt(e.target.value))}
									>
								</div>
								<div class="mb-4">
									<h4 class="text-lg font-bold mb-2">Options</h4>
									{#if component.Options && component.Options.length > 0}
										{#each component.Options as option, optionIndex}
											<div class="mb-2 p-2 border border-[#40444b] rounded">
												<input
													class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
													type="text"
													placeholder="Option Id"
													bind:value={option.Id}
													on:input={(e) => updateComponentOption(index, optionIndex, 'Id', e.target.value)}
												>
												<input
													class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
													type="text"
													placeholder="Option Name"
													bind:value={option.Name}
													on:input={(e) => updateComponentOption(index, optionIndex, 'Name', e.target.value)}
												>
												<input
													class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
													type="text"
													placeholder="Option Description"
													bind:value={option.Description}
													on:input={(e) => updateComponentOption(index, optionIndex, 'Description', e.target.value)}
												>
												<input
													class="shadow appearance-none border rounded w-full py-2 px-3 text-[#dcddde] bg-[#40444b] leading-tight focus:outline-none focus:shadow-outline mb-2"
													type="text"
													placeholder="Option Emoji (optional)"
													bind:value={option.Emoji}
													on:input={(e) => updateComponentOption(index, optionIndex, 'Emoji', e.target.value)}
												>
												<button
													class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
													on:click={() => removeComponentOption(index, optionIndex)}
												>
													Remove Option
												</button>
											</div>
										{/each}
									{/if}
									<button
										class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2"
										on:click={() => addComponentOption(index)}
									>
										Add Option
									</button>
								</div>
							{/if}
							<button
								class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
								on:click={() => removeComponent(index)}
							>
								Remove Component
							</button>
						{/if}
					</div>
				{/each}
			{/if}
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 mt-4"
				on:click={() => addComponent(false)}
			>
				Add Button
			</button>
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
				on:click={() => addComponent(true)}
			>
				Add Select Menu
			</button>
		{/if}
	</div>
</div>

<style>
    :global(body) {
        background-color: #36393f;
        color: #dcddde;
    }

    input[type="text"],
    input[type="number"],
    textarea,
    select {
        background-color: #40444b;
        color: #dcddde;
        border: 1px solid #202225;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    textarea:focus,
    select:focus {
        border-color: #7289da;
        outline: none;
    }

    button {
        transition: background-color 0.2s;
    }

    button:hover {
        filter: brightness(1.1);
    }

    .form-checkbox {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 1.25em;
        height: 1.25em;
        border: 1px solid #72767d;
        border-radius: 3px;
        outline: none;
        transition: all 0.2s ease-out;
        position: relative;
        cursor: pointer;
    }

    .form-checkbox:checked {
        background-color: #7289da;
        border-color: #7289da;
    }

    .form-checkbox:checked::after {
        content: '\2714';
        font-size: 1em;
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>