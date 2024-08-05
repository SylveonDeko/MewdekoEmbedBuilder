

export enum RequirePrefixType {
	None,
	Global,
	GuildOrGlobal,
	GuildOrNone,
	Custom
}

export enum CtRoleGrantType {
	Sender,
	Mentioned,
	Both
}

export enum CtApplicationCommandType {
	None,
	Slash,
	Message,
	User
}

export enum ChatTriggerType {
	Message = 1,
	Interaction = 2,
	Button = 4
}

export interface ChatTriggers {
	id: number;
	useCount: number;
	isRegex: boolean;
	ownerOnly: boolean;
	guildId: string | null;
	response: string | null;
	trigger: string | null;
	prefixType: RequirePrefixType;
	customPrefix: string | null;
	autoDeleteTrigger: boolean;
	reactToTrigger: boolean;
	noRespond: boolean;
	dmResponse: boolean;
	containsAnywhere: boolean;
	allowTarget: boolean;
	reactions: string | null;
	grantedRoles: string | null;
	removedRoles: string | null;
	roleGrantType: CtRoleGrantType;
	validTriggerTypes: ChatTriggerType;
	applicationCommandId: string;
	applicationCommandName: string | null;
	applicationCommandDescription: string | null;
	applicationCommandType: CtApplicationCommandType;
	ephemeralResponse: boolean;
	crosspostingChannelId: string;
	crosspostingWebhookUrl: string | null;

	// Computed property in C#, we'll make it a method in TypeScript
	getRealName(): string;
	getReactions(): string[];
	isGlobal(): boolean;
}