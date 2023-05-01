import { User } from './user.ts';

export type Level = {
	id: number;
	name: string;
	gd_id?: number;
	user: User;
	verifier: User;
	creators: User[];
	video?: string;
	requirement?: number;
};

export type LevelWithRank = Level & {
	rank: number;
};
