import { ChangelogListLevel, Changelog as Cl } from '@gdol/node';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconNoChange from 'src/assets/icons/changelog/no_change.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

// TODO: Move to @gdol/api/types
export type ChangelogAction = Cl['action'];

export type ExtractChangelogAction<T extends ChangelogAction> = T;

type ChangelogBase = {
	timestamp: Date;
	level: ChangelogListLevel;
	before: ChangelogListLevel[];
	after: ChangelogListLevel[];
	reason: string | undefined;
};

export type ChangelogAdd = ChangelogBase & {
	action: ExtractChangelogAction<'add'>;
	to: number;
};

export type ChangelogArchive = ChangelogBase & {
	action: ExtractChangelogAction<'archive'>;
	from: number;
};

export type ChangelogMove = ChangelogBase & {
	action: ExtractChangelogAction<'move'>;
	from: number;
	to: number;
};

export type Changelog = ChangelogAdd | ChangelogArchive | ChangelogMove;

export function getChangelogIcon(changelog: Changelog): string {
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
