import { Api } from 'src/generated/openapi';

export const api = new Api({
	baseUrl: import.meta.env.VITE_REST_URL,
});
