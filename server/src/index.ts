import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = Fastify({
	logger: true,
});

app.get('/users', (req, res) => {});
app.get('/levels', (req, res) => {});

// Run the server
app.listen(3000, (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
