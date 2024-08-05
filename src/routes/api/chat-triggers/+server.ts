	import { json } from '@sveltejs/kit';
	import { MEWDEKO_API_URL, MEWDEKO_API_KEY } from '$env/static/private';

	export async function GET({ url }) {
		const guildId = url.searchParams.get('guildId');

		if (!guildId) {
			return json({ error: 'Guild ID is required' }, { status: 400 });
		}

		try {
			const response = await fetch(`${MEWDEKO_API_URL}/chattriggers/${guildId}`, {
				headers: {
					'X-API-Key': MEWDEKO_API_KEY
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return json(data);
		} catch (error) {
			console.error('Error fetching chat triggers:', error);
			return json({ error: 'Failed to fetch chat triggers' }, { status: 500 });
		}
	}