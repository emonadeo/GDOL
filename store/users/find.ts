import { Database } from '../../deps.ts';
import { round } from '../../score.ts';
import { UserWithScoreAndRank } from '../../types/mod.ts';

const query = await (await fetch(new URL('./find.sql', import.meta.url))).text();

type RawUserWithScoreAndRank = {
	id: number;
	name: string;
	nationality: string | null;
	score: number;
	rank: number;
};

function userFromRaw(user: RawUserWithScoreAndRank): UserWithScoreAndRank {
	return {
		id: user.id,
		name: user.name,
		nationality: user.nationality ?? undefined,
		score: round(user.score),
		rank: user.rank,
	};
}

export function find(db: Database): UserWithScoreAndRank[] {
	return db.prepare(query).all<RawUserWithScoreAndRank>().map(userFromRaw);
}
