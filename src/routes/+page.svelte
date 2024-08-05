<script lang="ts">
	import EmbedForm from '$lib/components/EmbedForm.svelte';
	import EmbedPreview from '$lib/components/EmbedPreview.svelte';
	import JsonPreview from '$lib/components/JsonPreview.svelte';
	import type { DiscordUser } from "$lib/types/discord";
	import { page } from '$app/stores';
	import { userAdminGuilds } from "$lib/stores/adminGuildsStore";

	let activeTab: 'form' | 'json' = 'form';
	let menuOpen = false;

	$: user = $page.data.user as DiscordUser | undefined;

	function handleMenuOpen() {
		menuOpen = true;
		document.body.addEventListener('click', handleMenuClose);
	}

	function handleMenuClose(event: MouseEvent) {
		if (!(event.target as Element).closest('.user-menu')) {
			menuOpen = false;
			document.body.removeEventListener('click', handleMenuClose);
		}
	}
</script>

<div class="flex flex-col h-screen bg-[#36393f]">
	<header class="bg-[#202225] p-4 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-white">Embed Builder</h1>
		{#if !user}
			<a href="/api/discord/login" class="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
				Login with Discord
			</a>
		{:else}
			<div class="flex items-center relative user-menu">
				<button class="flex items-center space-x-2" on:click|stopPropagation={handleMenuOpen}>
					{#if user.avatar && user.avatar.startsWith("a_")}
						<img src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.gif"
								 alt={user.username}
								 class="rounded-full bg-gray-600 h-8 w-8" />
					{:else if user.avatar}
						<img src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.png"
								 alt={user.username}
								 class="rounded-full bg-gray-600 h-8 w-8" />
					{/if}
					<span class="text-white">{user.username}</span>
				</button>
				{#if menuOpen}
					<div
						class="absolute right-0 mt-2 w-48 bg-[#2f3136] rounded-md p-2 flex flex-col space-y-3 items-center z-50 shadow-lg"
						style="top: 100%;"
					>
						<div class="flex flex-col items-center w-full">
							<h1 class="font-bold text-md text-white">{user.username}</h1>
							{#if user.discriminator !== "0"}
								<h1 class="font-bold text-sm text-gray-400">#{user.discriminator}</h1>
							{/if}
						</div>
						<div class="text-white text-sm">Manageable Guilds: {$userAdminGuilds.length}</div>

						<button class="w-full px-3 py-1 rounded-full bg-[#40444b] text-sm font-bold text-white text-center hover:bg-[#4f545c] transition-colors"
						href="/api/discord/logout"
						>
						Logout
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</header>

	<div class="flex flex-col md:flex-row flex-grow">
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
				<div class="p-4 h-[calc(50vh-3rem)] md:h-[calc(100vh-10rem)] overflow-auto">
					{#if activeTab === 'form'}
						<EmbedForm />
					{:else}
						<JsonPreview />
					{/if}
				</div>
			</div>
		</div>
		<div class="w-full md:w-1/2 bg-[#36393f] p-2">
			<div class="bg-[#2f3136] h-[calc(50vh-1rem)] md:h-[calc(100vh-5rem)] rounded-lg p-4 overflow-auto">
				<EmbedPreview />
			</div>
		</div>
	</div>
</div>

<style>
    :global(body) {
        background-color: #36393f;
        color: #dcddde;
    }
</style>