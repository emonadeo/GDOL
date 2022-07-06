import { Prisma, PrismaClient } from '../src/generated/prisma';
import { readFileSync } from 'fs';
import { ListLogAction } from '@prisma/client';
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
	requirement: number;
	level_id: number;
}

async function main() {
	console.log(`Start seeding...`);
	const res = await axios.get('https://pointercrate.com/api/v2/demons/listed');
	const data: Demon[] = res.data;
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
			requirement: 100,
			levelId: 1,
		},
	});
	const list: Prisma.ListLogLevelCreateWithoutLogInput[] = await Promise.all(
		data.map(async (demon, index) => {
			const res = await axios.get('https://pointercrate.com/api/v1/records/', {
				params: {
					demon_id: demon.id,
				},
			});
			const records: Record[] = res.data.sort((a: Demon, b: Demon) => (a.id = b.id));

			const ret: Prisma.ListLogLevelCreateWithoutLogInput = {
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
						levelId: demon.level_id,
						requirement: demon.requirement,
						records: {
							create: records.map((r) => ({
								percentage: r.progress,
								user: {
									connectOrCreate: {
										where: {
											name: r.player.name,
										},
										create: {
											name: r.player.name,
										},
									},
								},
								video: r.video,
							})),
						},
					},
				},
			};

			return ret;
		})
	);
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

interface Record {
	id: number;
	progress: number;
	video: string;
	status: string;
	demon: {
		id: number;
		position: number;
		name: string;
	};
	player: {
		id: number;
		name: string;
		banned: boolean;
	};
}
