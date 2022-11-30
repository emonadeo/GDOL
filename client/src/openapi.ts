import { createResource, Resource } from 'solid-js';

// TODO: Generate using OpenAPI
export interface Level {
	rank: number;
	id: number;
	gd_id?: number;
	name: string;
	user: {
		id: number;
		name: string;
	};
	video?: string;
}

async function fetchList(): Promise<Level[]> {
	// TODO: Use OpenAPI
	const res = await fetch(`${import.meta.env.VITE_GDOL_URL}/list`);

	if (!res.ok) {
		// TODO: Show Error
		throw new Error(`Couldn't fetch list`);
	}

	const levels: Level[] = await res.json();
	return levels.map((lvl, i) => ({ ...lvl, rank: i + 1 }));
}

export function ListData(): Resource<Level[]> {
	const [list] = createResource(fetchList);
	return list;
}
