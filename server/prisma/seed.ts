import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
	{
		name: 'Emonadeo',
	},
];

async function main() {
	console.log(`Start seeding...`);
	userData.forEach(async (u) => {
		const user = await prisma.user.create({
			data: u,
		});
		console.log(`Create user with id: ${user.id}`);
	});
	console.log(`Seeding finished.`);
}

main().finally(async () => {
	await prisma.$disconnect();
});
