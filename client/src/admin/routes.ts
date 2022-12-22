import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import { ListArchiveData, ListData, ListSettingsData } from 'src/openapi';

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
						path: '/archive',
						component: lazy(() => import('./routes/list/archive/page')),
						data: ListArchiveData,
					},
					{
						path: '/settings',
						component: lazy(() => import('./routes/list/settings/page')),
						data: ListSettingsData,
					},
				],
			},
		],
	},
];
