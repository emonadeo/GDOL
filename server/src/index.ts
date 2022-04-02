import Fastify from 'fastify';
import FastifyCors from 'fastify-cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = Fastify();
app.register(FastifyCors);

app.get('/users', async (_, res) => {
	const users = await prisma.user.findMany({
		include: {
			levels: true,
		},
	});
	res.send(users);
});

app.get('/levels', async (_, res) => {
	const levels = await prisma.level.findMany();
	res.send(levels);
});

app.get<{
	Params: LevelByIdParam;
}>('/levels/:id', async (req, res) => {
	const { id } = req.params;
	const level = await prisma.level.findUnique({
		where: { id: Number(id) },
		include: {
			creators: true,
			user: true,
			verifier: true,
		},
	});
	res.send(level);
});

// Run the server
app.listen(3001, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});

interface LevelByIdParam {
	id: string;
}
