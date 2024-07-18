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
	id: string;
	name: string;
	emoji?: string;
	description?: string;
}

interface NewEmbedComponent {
	displayName: string;
	id: number;
	style: number;
	url?: string;
	emoji?: string;
	isSelect: boolean;
	maxOptions?: number;
	minOptions?: number;
	options?: NewEmbedSelectOption[];
}

interface NewEmbed {
	content?: string;
	embed?: Embed;
	embeds?: Embed[];
	components?: NewEmbedComponent[][];
}

type EmbedStore = Writable<NewEmbed> & {
	setField: (field: keyof NewEmbed, value: any) => void;
	addField: () => void;
	updateField: (index: number, field: keyof Field, value: any) => void;
	removeField: (index: number) => void;
	addComponent: (isSelect: boolean) => void;
	removeComponent: (rowIndex: number, componentIndex: number) => void;
	updateComponent: (rowIndex: number, componentIndex: number, field: keyof NewEmbedComponent, value: any) => void;
	addSelectOption: (rowIndex: number, componentIndex: number) => void;
	updateSelectOption: (rowIndex: number, componentIndex: number, optionIndex: number, field: keyof NewEmbedSelectOption, value: any) => void;
	removeSelectOption: (rowIndex: number, componentIndex: number, optionIndex: number) => void;
	reset: () => void;
};

const defaultEmbed: NewEmbed = {
	content: '',
	embed: {
		title: '',
		description: '',
		color: '#000000',
		author: { name: '', icon_url: '', url: '' },
		footer: { text: '' },
		thumbnail: { url: '' },
		image: { url: '' },
		fields: []
	},
	components: []
};

function getNextAvailableId(components?: NewEmbedComponent[][]): number {
	if (!components || components.length === 0) {
		return 1;
	}
	const maxId = Math.max(...components.flat().map(c => c.id));
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
					displayName: 'New Select Menu',
					id: getNextAvailableId(embed.components),
					style: 1,
					isSelect: true,
					maxOptions: 1,
					minOptions: 1,
					options: []
				}
				: {
					displayName: 'New Button',
					id: getNextAvailableId(embed.components),
					style: 1,
					isSelect: false
				};

			const newComponents = [...(embed.components || [])];
			if (isSelect || newComponents.length === 0 || newComponents[newComponents.length - 1].length === 5) {
				newComponents.push([newComponent]);
			} else {
				newComponents[newComponents.length - 1].push(newComponent);
			}

			return { ...embed, components: newComponents };
		}),
		removeComponent: (rowIndex: number, componentIndex: number) => update(embed => {
			const newComponents = [...(embed.components || [])];
			newComponents[rowIndex] = newComponents[rowIndex].filter((_, i) => i !== componentIndex);
			if (newComponents[rowIndex].length === 0) {
				newComponents.splice(rowIndex, 1);
			}
			return { ...embed, components: newComponents };
		}),
		updateComponent: (rowIndex: number, componentIndex: number, field: keyof NewEmbedComponent, value: any) => update(embed => {
			const newComponents = [...(embed.components || [])];
			newComponents[rowIndex][componentIndex] = { ...newComponents[rowIndex][componentIndex], [field]: value };
			return { ...embed, components: newComponents };
		}),
		addSelectOption: (rowIndex: number, componentIndex: number) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[rowIndex][componentIndex];
			if (component.isSelect) {
				component.options = [
					...(component.options || []),
					{
						id: (component.options?.length || 0).toString(),
						name: 'New Option',
						description: 'Option description'
					}
				];
			}
			return { ...embed, components: newComponents };
		}),
		updateSelectOption: (rowIndex: number, componentIndex: number, optionIndex: number, field: keyof NewEmbedSelectOption, value: any) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[rowIndex][componentIndex];
			if (component.isSelect && component.options) {
				component.options[optionIndex] = { ...component.options[optionIndex], [field]: value };
			}
			return { ...embed, components: newComponents };
		}),
		removeSelectOption: (rowIndex: number, componentIndex: number, optionIndex: number) => update(embed => {
			const newComponents = [...(embed.components || [])];
			const component = newComponents[rowIndex][componentIndex];
			if (component.isSelect && component.options) {
				component.options = component.options.filter((_, i) => i !== optionIndex);
			}
			return { ...embed, components: newComponents };
		}),
		reset: () => set(defaultEmbed)
	};
};

export const embed = createEmbed();