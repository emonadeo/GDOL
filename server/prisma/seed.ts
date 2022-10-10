import { Prisma, PrismaClient, ListLogAction } from '../src/generated/prisma/index.js';
import { mkdir, readFile, writeFile } from 'fs/promises';
import _axios from 'axios';
import { resolve } from 'path';
const axios = _axios.default;

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

interface DemonFull extends Demon {
	creators: Player[];
	records: Record[];
}

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

async function main() {
	console.log(`Start seeding...`);
	await mkdir(resolve('./src/generated/pointercrate'));
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
	// FETCH
	const resMain = await axios.get('https://pointercrate.com/api/v2/demons/listed?limit=75');
	const resExtended = await axios.get(
		'https://pointercrate.com/api/v2/demons/listed?limit=75&after=75'
	);
	const data: Demon[] = resMain.data.concat(resExtended.data);
	await writeFile(
		resolve(`./src/generated/pointercrate/_list.json`),
		JSON.stringify(data.map((d) => d.id)),
		'utf-8'
	);
	// LOAD
	// const data: number[] = JSON.parse(
	// 	await readFile('./src/generated/pointercrate/_list.json', 'utf-8')
	// );
	const list: Prisma.ListLogLevelCreateWithoutLogInput[] = await Promise.all(
		data.map(async (demon, index) => {
			// FETCH
			const res = await axios.get(`https://pointercrate.com/api/v2/demons/${demon.id}`);
			const fullDemon: DemonFull = res.data.data;
			await writeFile(
				resolve(`./src/generated/pointercrate/${demon.id}.json`),
				JSON.stringify(fullDemon),
				'utf-8'
			);
			// LOAD
			// const fullDemon: DemonFull = JSON.parse(
			// 	await readFile(`./src/generated/pointercrate/${demon}.json`, 'utf-8')
			// );
			const records: Record[] = fullDemon.records.sort((a, b) => (a.id = b.id));

			const ret: Prisma.ListLogLevelCreateWithoutLogInput = {
				index,
				level: {
					create: {
						name: fullDemon.name,
						user: {
							connectOrCreate: {
								where: {
									name: fullDemon.publisher.name,
								},
								create: {
									name: fullDemon.publisher.name,
								},
							},
						},
						verifier: {
							connectOrCreate: {
								where: {
									name: fullDemon.verifier.name,
								},
								create: {
									name: fullDemon.verifier.name,
								},
							},
						},
						creators: {
							connectOrCreate: fullDemon.creators.map((u) => ({
								where: {
									name: u.name,
								},
								create: {
									name: u.name,
								},
							})),
						},
						video: fullDemon.video || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
						levelId: fullDemon.level_id,
						requirement: fullDemon.requirement,
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
