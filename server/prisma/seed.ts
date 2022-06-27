import { Prisma, PrismaClient } from '../src/generated/prisma';
import { readFileSync } from 'fs';
import { ListLogAction } from '@prisma/client';

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
	const data: Demon[] = JSON.parse(
		readFileSync('./prisma/pointercrate.json', { encoding: 'utf-8' })
	);
	const level = await prisma.level.create({
		data: {
			name: 'Placeholder',
			video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			user: {
				connectOrCreate: {
					where: {
						name: 'Placeholder',
					},
					create: {
						name: 'Placeholder',
					},
				},
			},
			verifier: {
				connectOrCreate: {
					where: {
						name: 'Placeholder',
					},
					create: {
						name: 'Placeholder',
					},
				},
			},
		},
	});
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
			action: ListLogAction.ADD,
			level: {
				connect: {
					id: level.id,
				},
			},
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
