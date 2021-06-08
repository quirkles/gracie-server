import {PrismaClient} from '@prisma/client';
import {encrypt} from '../src/api/encrypt';
const prisma = new PrismaClient();

async function main() {
	const roles = ['mum', 'dad', 'me', 'grand-dad', 'grandma', 'uncle', 'auntie', 'friend', 'no-relation'];
	await prisma.role.createMany({
		data: roles.map(role => ({name: role})),
		skipDuplicates: true
	});

	const userPostRoles = ['creator', 'contributor'];
	await prisma.userPostRole.createMany({
		data: userPostRoles.map(role => ({name: role})),
		skipDuplicates: true
	});

	const password = await encrypt(process.env.ALEX_PASSWORD as string);

	const alex = await prisma.user.create({
		data: {
			name: 'Alex',
			password,
			isAdmin: true,
			role: {
				connect: {
					name: 'dad'
				}
			}
		}
	});
	console.log(alex, 'Created seed user') //eslint-disable-line
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
