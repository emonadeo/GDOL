import Fastify from 'fastify';
import cors from 'fastify-cors';

import list from './list/route';
import changelog from './changelog/route';

const app = Fastify();

app.register(cors);

app.register(list);
app.register(changelog);

// Run the server
app.listen(3001, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
