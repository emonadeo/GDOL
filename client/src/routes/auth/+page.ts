import { PUBLIC_REST_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { PageLoad } from './$types';

// TODO: Redirect URI
const discordOAuthUrl =
	'https://discord.com/api/oauth2/authorize?client_id=1040755745903358083&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth&response_type=code&scope=identify';

export const load: PageLoad = async function ({ url, fetch }) {
	const code = url.searchParams.get('code');

	if (!code) {
		// Redirect to discord OAuth if no code specified
		throw redirect(307, discordOAuthUrl);
	}

	// Exchange token
	const params = new URLSearchParams({ code });
	fetch(`${PUBLIC_REST_URL}/auth?${params}`);

	return {};
};
