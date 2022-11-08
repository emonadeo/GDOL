import type { PageLoad } from './$types';
import type { Record, UserFull } from '$lib/generated/openapi';

import { PUBLIC_REST_URL } from '$env/static/public';

export const load: PageLoad = async function ({ params, fetch }) {
	const res = await fetch(`${PUBLIC_REST_URL}/users/${params.name}`);

	if (!res.ok) {
		// TODO: Handle Error
	}

	const user = (await res.json()) as UserFull;
	// TODO: Sort records by level rank on server?
	// TODO: Don't use ids to sort, use ranks instead
	user.records.sort((a, b) => a.level.id - b.level.id);
	const recordsAndVerifications: Record[] = [
		...user.records,
		...user.levels_verified.map((lvl) => ({
			user: user,
			level: lvl,
			percentage: 100,
			timestamp: '',
		})),
	];
	return {
		user,
		recordsAndVerifications,
	};
};
