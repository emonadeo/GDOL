import { PUBLIC_REST_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async function ({ params, fetch }) {
	// TODO: Use OpenAPI, improve caching
	const res = await fetch(`${PUBLIC_REST_URL}/list/${params.rank}`);

	if (!res.ok) {
		// TODO: Handle Error
	}

	const level = await res.json();

	// TODO: Use OpenAPI, improve caching
	const resRecords = await fetch(`${PUBLIC_REST_URL}/levels/${level.id}/records`);
	if (!resRecords.ok) {
		// TODO: Handle Error
	}

	const records = await resRecords.json();

	return {
		rank: Number(params.rank),
		level,
		records,
	};
};
