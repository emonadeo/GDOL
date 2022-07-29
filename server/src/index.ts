import Fastify from 'fastify';
import cors from 'fastify-cors';

import list from './list/route';
import levels from './levels/route';
import changelog from './changelog/route';
import users from './users/route';

const app = Fastify();

app.register(cors);

app.register(list);
app.register(levels);
app.register(changelog);
app.register(users);

// Run the server
app.listen(3001, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
