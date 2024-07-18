<script lang="ts">
	import { embed } from '$lib/embedStore';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	let activeSelectMenu: number | null = null;

	function getButtonStyle(style: number) {
		switch (style) {
			case 1: return 'bg-[#5865F2] hover:bg-[#4752C4]'; // Primary
			case 2: return 'bg-[#4F545C] hover:bg-[#686D73]'; // Secondary
			case 3: return 'bg-[#43B581] hover:bg-[#3CA374]'; // Success
			case 4: return 'bg-[#F04747] hover:bg-[#D84040]'; // Danger
			default: return 'bg-[#4F545C] hover:bg-[#686D73]'; // Default to Secondary
		}
	}

	function parseMarkdown(text: string): string {
		return DOMPurify.sanitize(marked(text));
	}

	function toggleSelectMenu(componentIndex: number) {
		if (activeSelectMenu === componentIndex) {
			activeSelectMenu = null;
		} else {
			activeSelectMenu = componentIndex;
		}
	}
</script>

<div class="text-white font-sans text-[16px]">
	{#if $embed.content}
		<div class="content mb-2">{@html parseMarkdown($embed.content)}</div>
	{/if}

	{#if $embed.embed}
		<div class="embed mb-4" style="border-left-color: {$embed.embed.color}; border-left-width: 4px;">
			{#if $embed.embed.author}
				<div class="author mb-2 flex items-center">
					{#if $embed.embed.author.icon_url}
						<img src={$embed.embed.author.icon_url} alt="Author Icon" class="w-6 h-6 rounded-full mr-2">
					{/if}
					{#if $embed.embed.author.url}
						<a href={$embed.embed.author.url} class="text-white hover:underline">{$embed.embed.author.name}</a>
					{:else}
						<span>{$embed.embed.author.name}</span>
					{/if}
				</div>
			{/if}

			{#if $embed.embed.title}
				<div class="title font-bold text-base mb-2">
					{#if $embed.embed.url}
						<a href={$embed.embed.url} class="text-[#00b0f4] hover:underline">{$embed.embed.title}</a>
					{:else}
						{$embed.embed.title}
					{/if}
				</div>
			{/if}

			{#if $embed.embed.description}
				<div class="description text-[0.875rem] leading-[1.125rem] whitespace-pre-wrap mb-4">
					{@html parseMarkdown($embed.embed.description)}
				</div>
			{/if}

			{#if $embed.embed.fields && $embed.embed.fields.length > 0}
				<div class="fields grid gap-2" style="grid-template-columns: repeat(auto-fit, minmax(0, 1fr));">
					{#each $embed.embed.fields as field}
						<div class={`field ${field.inline ? 'inline' : 'col-span-full'}`}>
							<div class="field-name font-bold text-[0.875rem]">{field.name}</div>
							<div class="field-value text-[0.875rem]">
								{@html parseMarkdown(field.value)}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if $embed.embed.image && $embed.embed.image.url}
				<div class="image mt-4">
					<img src={$embed.embed.image.url} alt="Embed Image" class="max-w-full rounded">
				</div>
			{/if}

			{#if $embed.embed.thumbnail && $embed.embed.thumbnail.url}
				<div class="thumbnail absolute top-0 right-0 mt-4 mr-4">
					<img src={$embed.embed.thumbnail.url} alt="Thumbnail" class="w-20 h-20 rounded">
				</div>
			{/if}

			{#if $embed.embed.footer || $embed.embed.timestamp}
				<div class="footer mt-2 flex items-center text-[0.75rem] text-[#72767d]">
					{#if $embed.embed.footer && $embed.embed.footer.icon_url}
						<img src={$embed.embed.footer.icon_url} alt="Footer Icon" class="w-5 h-5 rounded-full mr-2">
					{/if}
					{#if $embed.embed.footer && $embed.embed.footer.text}
						<span>{$embed.embed.footer.text}</span>
					{/if}
					{#if $embed.embed.timestamp}
						<span class="mx-1">•</span>
						<span>{new Date($embed.embed.timestamp).toLocaleString()}</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	{#if $embed.components && $embed.components.length > 0}
		<div class="components">
			{#each $embed.components as component, componentIndex}
				<div class="flex flex-wrap gap-2 mb-2">
					{#if !component.IsSelect}
						<button
							class={`px-4 py-2 rounded text-white text-sm font-medium ${getButtonStyle(component.style)}`}
							disabled={component.style === 2}
						>
							{#if component.emoji}
								<span class="mr-2">{component.emoji}</span>
							{/if}
							{component.Options[0]?.Name || 'Button'}
						</button>
					{:else}
						<div class="select-menu w-full relative">
							<div
								class="select-trigger border border-transparent cursor-pointer box-border grid grid-cols-[1fr_auto] items-center bg-[#2D3136] text-[#DCDDDE] rounded px-3 py-2"
								on:click={() => toggleSelectMenu(componentIndex)}
							>
								<span>{component.DisplayName || 'Select an option'}</span>
								<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
									<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
								</svg>
							</div>
							{#if activeSelectMenu === componentIndex}
								<div class="select-options absolute left-0 right-0 mt-1 bg-[#2D3136] rounded shadow-lg z-10">
									{#each component.Options as option}
										<div class="select-option cursor-pointer text-[#DCDDDE] grid grid-cols-[1fr_auto] items-center font-medium box-border hover:bg-[#36393f] px-3 py-2">
											{#if option.Emoji}
												<span class="mr-2">{option.Emoji}</span>
											{/if}
											{option.Name}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
    .embed {
        background-color: var(--primary-630);
        border-radius: 4px;
        padding: 8px 16px 16px 12px;
        position: relative;
    }

    .fields {
        margin-top: 8px;
    }

    .field {
        margin-top: 4px;
    }

    .field.inline {
        flex: 1;
        min-width: 150px;
        flex-basis: auto;
    }

    .select-menu {
        position: relative;
    }

    .select-options {
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
    }

    .select-trigger {
        transition: border 0.2s ease;
    }

    .select-trigger:hover {
        border-color: #040405;
    }

    :global(.embed h1, .content h1) {
        font-size: 2em;
        font-weight: bold;
        margin-top: 0.67em;
        margin-bottom: 0.67em;
    }

    :global(.embed h2, .content h2) {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 0.83em;
        margin-bottom: 0.83em;
    }

    :global(.embed h3, .content h3) {
        font-size: 1.17em;
        font-weight: bold;
        margin-top: 1em;
        margin-bottom: 1em;
    }

    :global(.embed h4, .content h4) {
        font-size: 1em;
        font-weight: bold;
        margin-top: 1.33em;
        margin-bottom: 1.33em;
    }

    :global(.embed h5, .content h5) {
        font-size: 0.83em;


        font-weight: bold;
        margin-top: 1.67em;
        margin-bottom: 1.67em;
    }

    :global(.embed h6, .content h6) {
        font-size: 0.67em;
        font-weight: bold;
        margin-top: 2.33em;
        margin-bottom: 2.33em;
    }

    :global(.embed strong, .content strong) {
        font-weight: bold;
    }

    :global(.embed em, .content em) {
        font-style: italic;
    }

    :global(.embed u, .content u) {
        text-decoration: underline;
    }

    :global(.embed s, .content s) {
        text-decoration: line-through;
    }

    :global(.embed ul, .content ul) {
        list-style-type: disc;
        padding-left: 1.5em;
    }

    :global(.embed ol, .content ol) {
        list-style-type: decimal;
        padding-left: 1.5em;
    }

    :global(.embed blockquote, .content blockquote) {
        border-left: 4px solid #4f545c;
        margin: 0;
        padding-left: 1em;
    }

    :global(.embed code, .content code) {
        background-color: #2f3136;
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: monospace;
    }

    :global(.embed pre, .content pre) {
        background-color: #2f3136;
        border-radius: 3px;
        padding: 0.5em;
        overflow-x: auto;
    }

    :global(.embed pre code, .content pre code) {
        background-color: transparent;
        padding: 0;
    }

    :global(.embed a, .content a) {
        color: #00b0f4;
        text-decoration: none;
    }

    :global(.embed a:hover, .content a:hover) {
        text-decoration: underline;
    }
</style>