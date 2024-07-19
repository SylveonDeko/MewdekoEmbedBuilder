import { type Writable, writable } from 'svelte/store';

interface Author {
	name?: string;
	url?: string;
	icon_url?: string;
}

interface Thumbnail {
	url: string;
}

interface Image {
	url: string;
}

interface Footer {
	text: string;
	icon_url?: string;
}

interface Field {
	name: string;
	value: string;
	inline: boolean;
}

interface Embed {
	title?: string;
	description?: string;
	color?: string;
	timestamp?: string;
	url?: string;
	author?: Author;
	thumbnail?: Thumbnail;
	image?: Image;
	footer?: Footer;
	fields?: Field[];
}

interface NewEmbedSelectOption {
	Id: number;
	Name: string;
	Description: string;
	Emoji?: string;
}

interface NewEmbedComponent {
	Id: number;
	IsSelect: boolean;
	style?: number;
	DisplayName?: string;
	MaxOptions?: number;
	MinOptions?: number;
	Options: NewEmbedSelectOption[];
}

interface EmbedMessage {
	Embeds: Embed[];
	components?: NewEmbedComponent[];
}

type EmbedStore = Writable<EmbedMessage> & {
	addEmbed: () => void;
	removeEmbed: (index: number) => void;
	updateEmbed: (index: number, field: keyof Embed, value: any) => void;
	updateEmbedField: (embedIndex: number, fieldIndex: number, field: keyof Field, value: any) => void;
	addEmbedField: (embedIndex: number) => void;
	removeEmbedField: (embedIndex: number, fieldIndex: number) => void;
	addComponent: (newComponent: NewEmbedComponent) => void;
	removeComponent: (index: number) => void;
	updateComponent: (index: number, field: keyof NewEmbedComponent, value: any) => void;
	updateFromJson: (json: string) => void;
	addSelectOption: (componentIndex: number) => void;
	updateSelectOption: (componentIndex: number, optionIndex: number, field: keyof NewEmbedSelectOption, value: any) => void;
	removeSelectOption: (componentIndex: number, optionIndex: number) => void;
};

const defaultEmbedMessage: EmbedMessage = {
	Embeds: [{
		title: '',
		description: '',
		color: '#000000',
		author: { name: '', icon_url: '', url: '' },
		footer: { text: '' },
		thumbnail: { url: '' },
		image: { url: '' },
		fields: []
	}],
	components: []
};

function getNextAvailableId(components?: NewEmbedComponent[]): number {
	if (!components || components.length === 0) {
		return 1;
	}
	const maxId = Math.max(...components.map(c => c.Id));
	return maxId + 1;
}

export const createEmbed = (): EmbedStore => {
	const { subscribe, set, update } = writable<EmbedMessage>(defaultEmbedMessage);

	return {
		subscribe,
		set,
		update,
		addEmbed: () => update(message => {
			if (message.Embeds.length < 10) {
				return {
					...message,
					Embeds: [...message.Embeds, {
						title: '',
						description: '',
						color: '#000000',
						author: { name: '', icon_url: '', url: '' },
						footer: { text: '' },
						thumbnail: { url: '' },
						image: { url: '' },
						fields: []
					}]
				};
			}
			return message;
		}),
		removeEmbed: (index: number) => update(message => ({
			...message,
			Embeds: message.Embeds.filter((_, i) => i !== index)
		})),
		updateEmbed: (index: number, field: keyof Embed, value: any) => update(message => {
			const newEmbeds = [...message.Embeds];
			newEmbeds[index] = { ...newEmbeds[index], [field]: value };
			return { ...message, Embeds: newEmbeds };
		}),
		updateEmbedField: (embedIndex: number, fieldIndex: number, field: keyof Field, value: any) => update(message => {
			const newEmbeds = [...message.Embeds];
			const newFields = [...newEmbeds[embedIndex].fields || []];
			newFields[fieldIndex] = { ...newFields[fieldIndex], [field]: value };
			newEmbeds[embedIndex] = { ...newEmbeds[embedIndex], fields: newFields };
			return { ...message, Embeds: newEmbeds };
		}),
		addEmbedField: (embedIndex: number) => update(message => {
			const newEmbeds = [...message.Embeds];
			newEmbeds[embedIndex].fields = [...(newEmbeds[embedIndex].fields || []), { name: '', value: '', inline: false }];
			return { ...message, Embeds: newEmbeds };
		}),
		removeEmbedField: (embedIndex: number, fieldIndex: number) => update(message => {
			const newEmbeds = [...message.Embeds];
			newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields.filter((_, i) => i !== fieldIndex);
			return { ...message, Embeds: newEmbeds };
		}),
		addComponent: (newComponent: NewEmbedComponent) => update(embed => ({
			...embed,
			components: [...(embed.components || []), newComponent]
		})),
		removeComponent: (index: number) => update(embed => ({
			...embed,
			components: (embed.components || []).filter((_, i) => i !== index)
		})),
		updateComponent: (index: number, field: keyof NewEmbedComponent, value: any) => update(embed => {
			const newComponents = [...(embed.components || [])];
			newComponents[index] = { ...newComponents[index], [field]: value };
			return { ...embed, components: newComponents };
		}),
		addSelectOption: (componentIndex: number) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[componentIndex];
			const newOptionId = component.Options.length + 1;
			component.Options = [
				...component.Options,
				{
					Id: newOptionId,
					Name: `Option ${newOptionId}`,
					Description: `Description ${newOptionId}`
				}
			];
			return { ...embed, components: newComponents };
		}),
		updateSelectOption: (componentIndex: number, optionIndex: number, field: keyof NewEmbedSelectOption, value: any) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[componentIndex];
			if (component.Options) {
				component.Options[optionIndex] = { ...component.Options[optionIndex], [field]: value };
			}
			return { ...embed, components: newComponents };
		}),
		removeSelectOption: (componentIndex: number, optionIndex: number) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[componentIndex];
			if (component.Options) {
				component.Options = component.Options.filter((_, i) => i !== optionIndex);
			}
			return { ...embed, components: newComponents };
		}),
		updateFromJson: (json: string) => {
			try {
				const parsedJson = JSON.parse(json);
				set(parsedJson);
			} catch (error) {
				console.error('Invalid JSON:', error);
			}
		}
	};
};

export const embed = createEmbed();