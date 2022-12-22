import { Changelog as OAPIChangelog, Level } from 'src/generated/openapi';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconNoChange from 'src/assets/icons/changelog/no_change.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

export type ChangelogAction = OAPIChangelog['action'];

export type ExtractChangelogAction<T extends ChangelogAction> = T;

interface ChangelogBase {
	timestamp: Date;
	level: Level;
	before: Level[];
	after: Level[];
	reason?: string;
}

export interface ChangelogAdd extends ChangelogBase {
	action: ExtractChangelogAction<'add'>;
	to: number;
}

export interface ChangelogArchive extends ChangelogBase {
	action: ExtractChangelogAction<'archive'>;
	from: number;
}

export interface ChangelogMove extends ChangelogBase {
	action: ExtractChangelogAction<'move'>;
	from: number;
	to: number;
}

export type Changelog = ChangelogAdd | ChangelogArchive | ChangelogMove;

export function getChangelogIcon(changelog: Changelog) {
	switch (changelog.action) {
		case 'add':
			return iconAdd;
		case 'archive':
			return iconDelete;
		case 'move':
			if (changelog.to === changelog.from) return iconNoChange;
			return changelog.to > changelog.from ? iconLower : iconRaise;
	}
}
