<script lang="ts">
	import "../app.css";
	import { onDestroy } from "svelte";
	import type { DiscordGuild } from "../lib/types/discordGuild";
	import { userAdminGuilds } from "../lib/stores/adminGuildsStore";

	export let data;
	let unsubscribe;


	$: {
		unsubscribe = data?.user && userAdminGuilds.subscribe(async () => {
			try {
				const response = await fetch("/api/guilds");
				const guilds: DiscordGuild[] = await response.json();

				// Filter out guilds where the user is not an admin
				const filteredGuilds = guilds.filter(guild => (guild.permissions & 0x8) === 0x8);

				// Update the store value
				userAdminGuilds.set(filteredGuilds);
			} catch (e) {
				console.error(e);
			}
		});
	}

	onDestroy(() => {
		unsubscribe?.();
	});

</script>

<svelte:head>
	<meta content="#938018" name="theme-color">
	<meta content="website" property="og:type">
	<meta content="Mewdeko - Embed Builder" name="twitter:title">
	<meta content="summary_large_image" name="twitter:card">
	<meta name="keywords"
				content="Mewdeko, Mewdeko Bot, Mewdeko Discord Bot, Mewdeko Discord, Mewdeko D, free discord bot, free bot, anime themed discord bot, mewdeko.tech, mewdeko website, mewdeko dashboard, mewdeko commands, mewdeko donate, mewdeko paypal, mewdeko discord, mewdeko help" />
	<link href="img/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" type="image/png">
	<link href="img/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png">
	<link href="img/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png">
	<link href="img/apple-touch-icon.png" rel="icon" sizes="180x180" type="image/png">
	<link href="img/android-chrome-192x192.png" rel="icon" sizes="192x192" type="image/png">
</svelte:head>

<main>
	<slot />
</main>
