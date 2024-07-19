<script lang="ts">
	import { embed } from '$lib/embedStore';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { writable } from 'svelte/store';

	const openSelectMenu = writable<number | null>(null);

	function parseMarkdown(text: string): string {
		let parsedText = marked(text);
		parsedText = parseEmojis(parsedText);
		parsedText = parseMentions(parsedText);
		return DOMPurify.sanitize(parsedText);
	}

	function parseEmojis(text: string): string {
		// Parse custom emojis
		const customEmojiPattern = /<:(.*?):(\\d+)>/g;
		text = text.replace(customEmojiPattern, (match, name, id) =>
			`<img class="inline-emoji" src="https://cdn.discordapp.com/emojis/${id}.png" alt="${name}" title="${name}">`
		);

		// Parse Unicode emojis (this is a basic implementation, you might want to use a library for more comprehensive parsing)
		const unicodeEmojiPattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
		text = text.replace(unicodeEmojiPattern, (match) =>
			`<span class="emoji">${match}</span>`
		);

		return text;
	}

	function parseMentions(text: string): string {
		const userMentionPattern = /<@!?(\d+)>/g;
		const channelMentionPattern = /<#(\d+)>/g;
		const roleMentionPattern = /<@&(\d+)>/g;

		// Replace user mentions
		text = text.replace(userMentionPattern, '<span class="mention user-mention">@User</span>');
		// Replace channel mentions
		text = text.replace(channelMentionPattern, '<span class="mention channel-mention">#channel</span>');
		// Replace role mentions
		text = text.replace(roleMentionPattern, '<span class="mention role-mention">@Role</span>');

		return text;
	}

	function getButtonStyle(style: number) {
		switch (style) {
			case 1: return 'bg-[#5865F2] hover:bg-[#4752C4]'; // Primary
			case 2: return 'bg-[#4F545C] hover:bg-[#686D73]'; // Secondary
			case 3: return 'bg-[#43B581] hover:bg-[#3CA374]'; // Success
			case 4: return 'bg-[#F04747] hover:bg-[#D84040]'; // Danger
			default: return 'bg-[#4F545C] hover:bg-[#686D73]'; // Default to Secondary
		}
	}

	function toggleSelectMenu(index: number) {
		openSelectMenu.update(current => current === index ? null : index);
	}
</script>

<div class="text-white font-sans text-[16px]">
	{#each $embed.Embeds as embedItem, embedIndex}
		<div class="embed mb-4" style="border-left-color: {embedItem.color}; border-left-width: 4px;">
			{#if embedItem.author}
				<div class="author mb-2 flex items-center">
					{#if embedItem.author.icon_url}
						<img src={embedItem.author.icon_url} alt="Author Icon" class="w-6 h-6 rounded-full mr-2">
					{/if}
					{#if embedItem.author.url}
						<a href={embedItem.author.url} class="text-white hover:underline">{embedItem.author.name}</a>
					{:else}
						<span>{embedItem.author.name}</span>
					{/if}
				</div>
			{/if}

			{#if embedItem.title}
				<div class="title font-bold text-base mb-2">
					{#if embedItem.url}
						<a href={embedItem.url} class="text-[#00b0f4] hover:underline">{embedItem.title}</a>
					{:else}
						{embedItem.title}
					{/if}
				</div>
			{/if}

			{#if embedItem.description}
				<div class="description text-[0.875rem] leading-[1.125rem] whitespace-pre-wrap mb-4">
					{@html parseMarkdown(embedItem.description)}
				</div>
			{/if}

			{#if embedItem.fields && embedItem.fields.length > 0}
				<div class="fields grid gap-2" style="grid-template-columns: repeat(auto-fit, minmax(0, 1fr));">
					{#each embedItem.fields as field}
						<div class={`field ${field.inline ? 'inline' : 'col-span-full'}`}>
							<div class="field-name font-bold text-[0.875rem]">{@html parseMarkdown(field.name)}</div>
							<div class="field-value text-[0.875rem]">{@html parseMarkdown(field.value)}</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if embedItem.image && embedItem.image.url}
				<div class="image mt-4">
					<img src={embedItem.image.url} alt="Embed Image" class="max-w-full rounded">
				</div>
			{/if}

			{#if embedItem.thumbnail && embedItem.thumbnail.url}
				<div class="thumbnail absolute top-0 right-0 mt-4 mr-4">
					<img src={embedItem.thumbnail.url} alt="Thumbnail" class="w-20 h-20 rounded">
				</div>
			{/if}

			{#if embedItem.footer || embedItem.timestamp}
				<div class="footer mt-2 flex items-center text-[0.75rem] text-[#72767d]">
					{#if embedItem.footer && embedItem.footer.icon_url}
						<img src={embedItem.footer.icon_url} alt="Footer Icon" class="w-5 h-5 rounded-full mr-2">
					{/if}
					{#if embedItem.footer && embedItem.footer.text}
						<span>{@html parseMarkdown(embedItem.footer.text)}</span>
					{/if}
					{#if embedItem.timestamp}
						<span class="mx-1">•</span>
						<span>{new Date(embedItem.timestamp).toLocaleString()}</span>
					{/if}
				</div>
			{/if}
		</div>
	{/each}

	{#if $embed.components && $embed.components.length > 0}
		<div class="components grid grid-cols-5 gap-2">
			{#each $embed.components as component, componentIndex}
				{#if component.IsSelect}
					<div class="select-menu col-span-5 relative mb-2">
						<div
							class="select-trigger border border-transparent cursor-pointer box-border grid grid-cols-[1fr_auto] items-center bg-[#2D3136] text-[#DCDDDE] rounded px-3 py-2"
							on:click={() => toggleSelectMenu(componentIndex)}
						>
							<span>{component.DisplayName || 'Select an option'}</span>
							<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
								<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
							</svg>
						</div>
						{#if $openSelectMenu === componentIndex}
							<div class="select-options absolute top-full left-0 w-full bg-[#2D3136] mt-1 rounded shadow-lg z-10">
								{#each component.Options as option}
									<div class="option px-3 py-2 hover:bg-[#3C4047] cursor-pointer">
										{@html parseEmojis(option.Emoji || '')}
										<span class="option-name font-bold">{option.Name}</span>
										<span class="option-description block text-sm text-[#72767d]">{option.Description}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<button
						class={`px-4 py-2 rounded text-white text-sm font-medium ${getButtonStyle(component.style)}`}
						disabled={component.style === 2}
					>
						{@html parseEmojis(component.DisplayName || 'Button')}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
    .embed {
        background-color: #303030;
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

    .inline-emoji {
        display: inline-block;
        width: 1.375em;
        height: 1.375em;
        vertical-align: bottom;
    }

    .emoji {
        display: inline-block;
        font-size: 1.375em;
        line-height: 1;
    }

    .mention {
        background-color: rgba(88, 101, 242, 0.3);
        color: #dee0fc;
        border-radius: 3px;
        padding: 0 2px;
        font-weight: 500;
    }

    .user-mention, .role-mention {
        color: #dee0fc;
    }

    .channel-mention {
        color: #7289da;
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