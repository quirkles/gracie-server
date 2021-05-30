import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const roles = ['mum', 'dad', 'me', 'grand-dad', 'grandma', 'uncle', 'auntie', 'friend'];
	await prisma.role.createMany({
		data: roles.map(role => ({name: role})),
		skipDuplicates: true
	});
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
