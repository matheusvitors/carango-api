import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { abastecimentoRepository, carroRepository, usuarioRepository } from "../../setup";
import { Abastecimento, Carro, Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";
import { placaGenerator } from "@/utils/placa-generator";

const path = '/carros';

describe('List Abastecimentos - Integration Test', () => {
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

	const abastecimento: Abastecimento = {
		id: newID(),
		carroId: carro.id,
		kmInicial: 0,
		kmFinal: 50,
		litros: 5,
		precoCombustivel: 2.0,
		combustivel: "gasolina",
		tipoCombustivel: "comum",
		data: new Date(),
	}

	beforeAll(async () => {
		await usuarioRepository.create(user);
		await carroRepository.create(carro);
		await abastecimentoRepository.create(abastecimento);
	});

	const token = jwt.encode({ payload: {id: user.id}});

	it('should list refuelings of a car', async () => {
		const response = await supertest(app)
		.get(`${path}/${carro.id}/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).greaterThan(1);
	});
});
