import { Database, HonoEnv } from '../deps.ts';

export interface GdolEnv extends HonoEnv {
	Variables: {
		db: Database;
	};
}
