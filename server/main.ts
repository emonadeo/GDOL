import { Application } from 'oak';

const app = new Application();

app.use((ctx) => {
	ctx.response.body = 'Hello world!';
});

await app.listen({ port: 3001 });
