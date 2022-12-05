import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import { ListData } from 'src/openapi';

export const routes: RouteDefinition[] = [
	{
		path: '/',
		component: lazy(() => import('./routes/layout')),
		children: [
			{
				path: '/',
				component: lazy(() => import('./routes/page')),
			},
			{
				path: '/list',
				component: lazy(() => import('./routes/list/layout')),
				children: [
					{
						path: '/',
						component: lazy(() => import('./routes/list/page')),
						data: ListData,
					},
					{
						path: '/settings',
						component: lazy(() => import('./routes/list/settings/page')),
					},
				],
			},
		],
	},
];