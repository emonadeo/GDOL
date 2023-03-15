import { writeFile } from 'fs/promises';
import { generateOpenApiDocument } from 'trpc-openapi';

import { router } from './src/server.ts';

const doc = generateOpenApiDocument(router, {
	title: 'GDOL',
	version: '1.0.0',
	baseUrl: 'http://localhost:3000',
});

await writeFile('./dist/openapi.json', JSON.stringify(doc, undefined, '\t'));
