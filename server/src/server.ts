import dotenv from 'dotenv-flow';
import z from 'zod';
import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import pg from 'pg';
import { List } from './schema/list.ts';
import { findList } from './store/list.queries.ts';
import { log } from 'console';

// Environment
dotenv.config();

// Database
const client = new pg.Client({
	host: process.env.PGHOST,
	port: Number(process.env.PGPORT),
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
});

await client.connect();

const t = initTRPC.meta<OpenApiMeta>().create();

export const router = t.router({
	getList: t.procedure
		.meta({
			openapi: {
				method: 'GET',
				path: '/list',
				summary: 'Get Levels on List',
				description: 'Get all levels on the list ordered by rank',
			},
		})
		.input(z.void())
		.output(List)
		.query(async () => {
			const findListResult = await findList.run(undefined, client);
			const list = findListResult.map((lvl) => ({
				id: Number(lvl.id),
				name: lvl.name as string,
				gdId: Number(lvl.gd_id) || undefined,
				user: {
					id: Number(lvl.user_id),
					name: lvl.user_name!,
					nationality: lvl.user_nationality || undefined,
				},
				verifier: {
					id: Number(lvl.verifier_id),
					name: lvl.verifier_name!,
					nationality: lvl.verifier_nationality || undefined,
				},
				creators: lvl.creator_ids!.map((id, i) => ({
					id: Number(id),
					name: lvl.creator_names!.at(i)!,
					nationality: lvl.creator_nationalities!.at(i) || undefined,
				})),
				requirement: lvl.requirement || undefined,
				video: lvl.video || undefined,
			}));
			return list;
		}),
});

export type Router = typeof router;
