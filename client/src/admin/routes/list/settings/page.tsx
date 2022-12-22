import { useRouteData } from '@solidjs/router';
import { Component } from 'solid-js';
import { ListSettingsData } from 'src/openapi';

import './page.scss';

const Page: Component = function () {
	const settings = useRouteData<typeof ListSettingsData>();

	return <></>;
};

export default Page;
