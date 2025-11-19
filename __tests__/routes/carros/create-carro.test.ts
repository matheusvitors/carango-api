import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { carroRepository, usuarioRepository } from "../../setup";
import { Carro, Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";
import { placaGenerator } from "@/utils/placa-generator";

const path = `/carros`;

describe("Create Carro - e2e Test", () => {

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

	it("should create a car", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: placaGenerator(),
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(201);
	});

	it("should return 422 if pass invalid two or more data ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: "jjj1235",
				modelo: "u",
				marca: "f",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual("A marca é obrigatória");
		expect(response.body.response.errors.modelo).toEqual("O modelo é obrigatório");
	});

	it("should return 422 if pass incorrect placa format ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: "1234",
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual("A placa está com o formato incorreto!");
	});

	it("should return 409 if pass existent placa ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: carro.placa,
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual("Placa já existente!");
	});
});
