export type User = {
	id: number;
	name: string;
	nationality?: string;
};

export type UserWithScore = User & {
	score: number;
};

export type UserWithScoreAndRank = UserWithScore & {
	rank: number;
};
