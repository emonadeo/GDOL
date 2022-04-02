import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
	{
		name: 'Gizbro',
	},
	{
		name: 'Cirtrax',
	},
];

const levelData: Prisma.LevelCreateInput[] = [
	{
		name: 'Chromatic Haze',
		user: {
			connect: { name: 'Cirtrax' },
		},
		verifier: {
			connect: { name: 'Gizbro' },
		},
		creators: {
			connect: [{ name: 'Gizbro' }, { name: 'Cirtrax' }],
		},
		video: 'https://youtu.be/J-qEOHy-IIA',
	},
];

async function main() {
	console.log(`Start seeding...`);
	userData.forEach(async (u) => {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(`Create user with name: ${user.name}`);
	});
	levelData.forEach(async (l) => {
		const level = await prisma.level.create({
			data: l,
		});
		console.log(`Create level with id: ${level.id}`);
	});
	console.log(`Seeding finished.`);
}

main().finally(async () => {
	await prisma.$disconnect();
});
