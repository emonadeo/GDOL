import { useRouteData } from '@solidjs/router';
import { Component, createEffect } from 'solid-js';
import { ListSettingsData } from 'src/openapi';

import './page.scss';

const Page: Component = function () {
	const settings = useRouteData<typeof ListSettingsData>();

	// TODO: Remove Debug
	createEffect(() => {
		console.log(settings());
	});

	return <></>;
};

export default Page;
