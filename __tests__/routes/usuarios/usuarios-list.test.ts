import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { user, usuarioRepository } from "../../setup";
import { database } from "@/infra/database/client";
import { newID } from "@/infra/adapters/newID";
import { faker } from "@faker-js/faker";
import { Usuario } from "@/core/models";

describe("List Usuarios - e2e Test", () => {
	const user: Usuario = {
		id: newID(),
		nome: faker.person.fullName(),
		username: faker.internet.username(),
		password: faker.internet.password(),
		email: faker.internet.email(),
	}

	const token = jwt.encode({ payload: { id: user.id } });

	beforeAll(async () => {
		console.log('init before all');

		const data = await usuarioRepository.list();
		console.log({data: data.length});

		if(data.length > 0) {
			console.log('cleaning db...');

			await database.usuario.deleteMany();
		}
		await usuarioRepository.create(user);
		const data2 = await usuarioRepository.list();
		console.log('finish before all', 'data2', data2.length);

	});

	afterEach(async () => {
	});

	afterAll(async () => {
		await usuarioRepository.removeAll();
		await database.$disconnect();
	});

	it("should list usuarios", async () => {
		const data = await usuarioRepository.list();
		console.log({data: data.length});

		const response = await supertest(app)
			.get("/users")
			.set({ authorization: `Bearer ${token}` });

		console.log('body', response.body.response.content);


		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.length).toEqual(1);
	});
});
