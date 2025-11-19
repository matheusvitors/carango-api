import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "@/server";
import { carroRepository, usuarioRepository } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";
import { Carro, Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";
import { placaGenerator } from "@/utils/placa-generator";

const path = `/carros`;

describe("Get Carro - e2e Test", () => {

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

	const token = jwt.encode({ payload: { id: user.id } });

	beforeAll(async () => {
		await usuarioRepository.create(user);
		await carroRepository.create(carro);
	});

	it("should get the car", async () => {
		const response = await supertest(app)
			.get(`${path}/${carro.id}`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
	});

	it("should not find the car", async () => {
		const response = await supertest(app)
			.get(`${path}/xyz`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});

	it("should return 404 if usuarioId is different", async () => {
		const usertoken = jwt.encode({ payload: { id: 'jdnfksdnfknsjdf' } });

		const response = await supertest(app)
			.get(`${path}/${carro.id}`)
			.set({ authorization: `Bearer ${usertoken}` });

		expect(response.status).toEqual(404);
	});
});
