import Fastify from 'fastify';
import cors from 'fastify-cors';

import list from './list/route';

const app = Fastify();

app.register(cors);

app.register(list);

// Run the server
app.listen(3001, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
