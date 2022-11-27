import fzf from 'fuzzysort';

import type { PageLoad } from './$types';
import type { UserWithScore } from '$lib/generated/openapi';

import { PUBLIC_REST_URL } from '$env/static/public';

type UserAndRank = UserWithScore & { rank: number; fzfp: Fuzzysort.Prepared };

export const load: PageLoad = async function ({ url, fetch }) {
	// TODO: Use OpenAPI, improve caching
	const res = await fetch(`${PUBLIC_REST_URL}/users`);

	if (!res.ok) {
		// TODO: Handle Error
	}

	const data = (await res.json()) as any[];
	const users = data.map((u, i) => ({
		...u,
		rank: i + 1,
		fzfp: fzf.prepare(u.name), // Prepare for Fuzzysort (Better Performance)
	})) as UserAndRank[];

	return {
		pagination: {
			page: Number(url.searchParams.get('page')) || 1,
			perPage: Number(url.searchParams.get('perPage')) || 25,
		},
		users,
	};
};
