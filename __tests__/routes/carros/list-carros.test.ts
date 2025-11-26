import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "@/server";
import { carroRepository, usuarioRepository } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";
import { Carro, Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";
import { placaGenerator } from "@/utils/placa-generator";

describe("List Carros - e2e Test", () => {
	const user: Usuario = {
		id: newID(),
		nome: faker.person.fullName(),
		username: faker.internet.username(),
		password: faker.internet.password(),
		email: faker.internet.email(),
	}

	const carro: Carro = {
		id: newID(),
		placa: placaGenerator(),
		modelo: faker.vehicle.model(),
		marca: faker.vehicle.manufacturer(),
		usuarioId: user.id,
	};

	beforeAll(async () => {
		await usuarioRepository.create(user);
		await carroRepository.create(carro);
	});

	const token = jwt.encode({ payload: {id: user.id}});

	it("should list cars", async () => {
		const response = await supertest(app)
			.get(`/carros`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).greaterThan(0);
	});

	it("should return a empty array if has no cars", async () => {
		const user0: Usuario = {
			id: newID(),
			nome: faker.person.fullName(),
			username: faker.internet.username(),
			password: faker.internet.password(),
			email: faker.internet.email(),
		}

		await usuarioRepository.create(user0);
		const token = jwt.encode({ payload: {id: user0.id}});

		const response = await supertest(app)
			.get(`/carros`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).toEqual(0);
	});
});
