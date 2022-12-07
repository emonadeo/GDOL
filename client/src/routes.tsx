import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

import { routes as adminRoutes } from 'src/admin/routes';

import { ChangelogData, LevelByRankData, ListData, UsersData } from 'src/openapi';

export const routes: RouteDefinition[] = [
	{
		path: '/admin',
		children: adminRoutes,
	},
	{
		path: '/',
		component: lazy(() => import('src/routes/layout')),
		children: [
			{
				path: '/changelog',
				component: lazy(() => import('src/routes/changelog/page')),
				data: ChangelogData,
			},
			{
				path: '/list',
				children: [
					{
						path: '/',
						component: lazy(() => import('src/routes/list/page')),
						data: ListData,
					},
					{
						path: '/:rank',
						component: lazy(() => import('src/routes/list/rank/page')),
						data: LevelByRankData,
					},
				],
			},
			{
				path: '/leaderboard',
				component: lazy(() => import('src/routes/leaderboard/page')),
				data: UsersData,
			},
			// Debug
			{
				path: '/debug',
				component: lazy(() => import('src/routes/debug/page')),
			},
		],
	},
];
