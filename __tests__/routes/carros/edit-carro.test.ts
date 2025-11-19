import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { carroRepository, usuarioRepository } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";
import { Carro, Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";
import { placaGenerator } from "@/utils/placa-generator";
import { faker } from "@faker-js/faker";

const path = `/carros`;

describe("Edit Carro - e2e Test", () => {

	const user: Usuario = {
		id: newID(),
		nome: faker.person.fullName(),
		username: faker.internet.username(),
		password: faker.internet.password(),
		email: faker.internet.email(),
	}

	const user2: Usuario = {
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

	const carro2: Carro = {
		id: newID(),
		placa: placaGenerator(),
		modelo: faker.vehicle.model(),
		marca: faker.vehicle.manufacturer(),
		usuarioId: user2.id,
	};

	beforeAll(async () => {
		await usuarioRepository.create(user);
		await usuarioRepository.create(user2);
		await carroRepository.create(carro);
		await carroRepository.create(carro2);
	});

	const token = jwt.encode({ payload: {id: user.id}});

	it("should edit a car", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro.id}`)
			.send({
				placa: placaGenerator(),
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
	});

	it("should return 404 if carro is not found", async () => {
		const response = await supertest(app)
			.put(`${path}/xyz`)
			.send({
				placa: placaGenerator(),
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});

	it("should return 404 if carro belongs to another user", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: placaGenerator(),
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});


	it("should return 422 if pass invalid two or more data on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: placaGenerator(),
				modelo: "F",
				marca: "A",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual("A marca é obrigatória");
		expect(response.body.response.errors.modelo).toEqual("O modelo é obrigatório");
	});

	it("should return 422 if pass incorrect placa format on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: "BBB9876aa",
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual("A placa está com o formato incorreto!");
	});

	it("should return 409 if pass existent placa on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro.id}`)
			.send({
				placa: carro2.placa,
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual("Placa já existente!");
	});
});
