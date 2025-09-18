import { PrismaClient } from "@prisma/client";
import { uuidv7 } from "uuidv7";

const prisma = new PrismaClient();

async function main() {
	await prisma.usuario.upsert({
		where: { username: process.env.NICKNAME },
		update: {},
		create: {
			id: uuidv7(),
			nome: process.env.NOME || 'dev',
			username: process.env.NICKNAME || 'dev',
			password: process.env.PASSWORD || '123',
			email: process.env.EMAIL || 'dev@dev.com',
		}
	})
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error('seeder', e);
		await prisma.$disconnect();
		process.exit(1)
	})
