import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { usuarioRepository } from "../../setup";
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
		await usuarioRepository.create(user);
	});

	it("should list usuarios", async () => {
		const data = await usuarioRepository.list();

		const response = await supertest(app)
		.get("/users")
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.length).greaterThan(0);
	});
});
