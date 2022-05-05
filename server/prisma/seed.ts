import { Prisma, PrismaClient } from '@prisma/client';
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
	const res = await axios.get('https://pointercrate.com/api/v2/demons/listed');
	const data: Demon[] = res.data;
	const list: Prisma.ListLogLevelCreateWithoutLogInput[] = data.map((demon, index) => ({
		index,
		level: {
			create: {
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
		},
	}));
	await prisma.listLog.create({
		data: {
			list: {
				create: list,
			},
		},
	});
	console.log(`Seeding finished.`);
}

main().finally(async () => {
	await prisma.$disconnect();
});
