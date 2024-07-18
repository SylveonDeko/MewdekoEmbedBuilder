import { writable, type Writable } from 'svelte/store';

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
	DisplayName: string;
	IsSelect: boolean;
	MaxOptions?: number;
	MinOptions?: number;
	Options: NewEmbedSelectOption[];
}

interface NewEmbed {
	content?: string;
	embed?: Embed;
	components?: NewEmbedComponent[];
}

type EmbedStore = Writable<NewEmbed> & {
	setField: (field: keyof NewEmbed, value: any) => void;
	addField: () => void;
	updateField: (index: number, field: keyof Field, value: any) => void;
	removeField: (index: number) => void;
	addComponent: (isSelect: boolean) => void;
	removeComponent: (index: number) => void;
	updateComponent: (index: number, field: keyof NewEmbedComponent, value: any) => void;
	addSelectOption: (componentIndex: number) => void;
	updateSelectOption: (componentIndex: number, optionIndex: number, field: keyof NewEmbedSelectOption, value: any) => void;
	removeSelectOption: (componentIndex: number, optionIndex: number) => void;
	reset: () => void;
};

const defaultEmbed: NewEmbed = {
	content: '',
	embed: {
		title: '',
		description: '',
		color: '#000000',
		author: {
			name: '',
			url: '',
			icon_url: ''
		},
		thumbnail: {
			url: ''
		},
		image: {
			url: ''
		},
		footer: {
			text: '',
			icon_url: ''
		},
		fields: []
	},
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
	const { subscribe, set, update } = writable<NewEmbed>(defaultEmbed);

	return {
		subscribe,
		set,
		update,
		setField: (field: keyof NewEmbed, value: any) => update(embed => ({ ...embed, [field]: value })),
		addField: () => update(embed => ({
			...embed,
			embed: {
				...embed.embed,
				fields: [...(embed.embed?.fields || []), { name: '', value: '', inline: false }]
			}
		})),
		updateField: (index: number, field: keyof Field, value: any) => update(embed => {
			const newFields = [...(embed.embed?.fields || [])];
			newFields[index] = { ...newFields[index], [field]: value };
			return { ...embed, embed: { ...embed.embed, fields: newFields } };
		}),
		removeField: (index: number) => update(embed => ({
			...embed,
			embed: {
				...embed.embed,
				fields: (embed.embed?.fields || []).filter((_, i) => i !== index)
			}
		})),
		addComponent: (isSelect: boolean) => update(embed => {
			const newComponent: NewEmbedComponent = isSelect
				? {
					Id: getNextAvailableId(embed.components),
					DisplayName: "Default",
					IsSelect: true,
					MaxOptions: 1,
					MinOptions: 1,
					Options: [
						{ Id: 1, Name: "Option 1", Description: "Description 1" }
					]
				}
				: {
					Id: getNextAvailableId(embed.components),
					DisplayName: "Default",
					IsSelect: false,
					Options: [
						{ Id: 1, Name: "Button 1", Description: "Description 1" }
					]
				};

			return {
				...embed,
				components: [...(embed.components || []), newComponent]
			};
		}),
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
		reset: () => set(defaultEmbed)
	};
};

export const embed = createEmbed();