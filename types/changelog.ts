import { Level } from './level.ts';

export type ChangelogListLevel = Pick<Level, 'id' | 'name'>;

export type Changelog = {
	timestamp: number;
	action: 'add' | 'archive' | 'move';
	from?: number;
	to?: number;
	reason?: string;
	level: Level;
	list: ChangelogListLevel[];
};
