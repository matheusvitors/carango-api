import { describe, it, expect, afterAll, beforeAll, beforeEach, afterEach } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { usuarioRepository } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";
import { database } from "@/infra/database/client";
import { newID } from "@/infra/adapters/newID";
import { faker } from "@faker-js/faker";
import { Usuario } from "@/core/models";

describe("Get Usuario - e2e Test", () => {

	const user: Usuario = {
		id: newID(),
		nome: faker.person.fullName(),
		username: faker.internet.username(),
		password: faker.internet.password(),
		email: faker.internet.email(),
	}

	const token = jwt.encode({ payload: { id: user.id } });

	beforeAll(async () => {
		await usuarioRepository.removeAll();
		await usuarioRepository.create(user);
	});

	afterEach(async () => {
	});

	afterAll(async () => {
		await usuarioRepository.removeAll();
		await database.$disconnect();
	});

	it("should get a usuario", async () => {
		const response = await supertest(app)
			.get(`/users/${user.id}`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.id).toEqual(user.id);
	});

	it("should not find the usuario", async () => {
		const response = await supertest(app)
			.get(`/users/zyz`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(404);
	});
});
