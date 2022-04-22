import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface Player {
	id: number;
	name: string;
	banned: boolean;
}

interface Demon {
	name: string;
	position?: number;
	id: number;
	publisher: Player;
	verifier: Player;
	video?: string;
}

async function main() {
	console.log(`Start seeding...`);
	const { data } = (await axios.get('https://pointercrate.com/api/v2/demons/listed')) as {
		data: Demon[];
	};
	data.forEach(async (demon) => {
		const level = await prisma.level.create({
			data: {
				name: demon.name,
				user: {
					connectOrCreate: {
						where: {
							name: demon.publisher.name,
						},
						create: {
							name: demon.publisher.name,
						},
					},
				},
				verifier: {
					connectOrCreate: {
						where: {
							name: demon.verifier.name,
						},
						create: {
							name: demon.verifier.name,
						},
					},
				},
				video: demon.video || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			},
		});
		console.log(`Create level with id: ${level.id}`);
	});
	console.log(`Seeding finished.`);
}

main().finally(async () => {
	await prisma.$disconnect();
});
