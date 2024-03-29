import { Changelog } from '@gdol/node';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconNoChange from 'src/assets/icons/changelog/no_change.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

export function getChangelogIcon(changelog: Changelog): string {
	switch (changelog.action) {
		case 'add':
			return iconAdd.src;
		case 'archive':
			return iconDelete.src;
		case 'move':
			if (changelog.to === changelog.from) return iconNoChange.src;
			return changelog.to > changelog.from ? iconLower.src : iconRaise.src;
	}
}
