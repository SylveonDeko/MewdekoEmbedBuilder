import { writable } from 'svelte/store';
import type { ChatTriggers } from '$lib/types/chatTriggers';

function createChatTriggersStore() {
	const { subscribe, set, update } = writable<ChatTriggers[]>([]);

	return {
		subscribe,
		set: (triggers: ChatTriggers[]) => set(triggers),
		add: (trigger: ChatTriggers) => update(triggers => [...triggers, trigger]),
		remove: (id: number) => update(triggers => triggers.filter(t => t.id !== id)),
		update: (id: number, updates: Partial<ChatTriggers>) => update(triggers =>
			triggers.map(t => t.id === id ? { ...t, ...updates } : t)
		),
		clear: () => set([])
	};
}

export const chatTriggers = createChatTriggersStore();