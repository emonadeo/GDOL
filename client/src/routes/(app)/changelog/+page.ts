import type { PageLoad } from './$types';
import type { Changelog } from '$lib/generated/openapi';

import { PUBLIC_REST_URL } from '$env/static/public';

export const load: PageLoad = async function ({ fetch }) {
	const res = await fetch(`${PUBLIC_REST_URL}/changelog`);

	if (!res.ok) {
		// TODO: Handle Error
	}

	return {
		changelog: (await res.json()) as Changelog[],
	};
};
