import { REST_URL } from 'src/env';
import { Api } from 'src/generated/openapi';

export const api = new Api({
	baseUrl: REST_URL,
});
