import { Level } from './level.ts';

export type ChangelogLevel = Pick<Level, 'id' | 'name'>;

export type ChangelogAction = 'add' | 'archive' | 'move';

type ChangelogBase = {
	timestamp: string;
	level: ChangelogLevel;
	listBefore: ChangelogLevel[];
	listAfter: ChangelogLevel[];
	reason?: string;
};

export type ChangelogAdd = ChangelogBase & {
	action: 'add';
	to: number;
};

export type ChangelogArchive = ChangelogBase & {
	action: 'archive';
	from: number;
};

export type ChangelogMove = ChangelogBase & {
	action: 'move';
	from: number;
	to: number;
};

export type Changelog = ChangelogAdd | ChangelogArchive | ChangelogMove;
