import { afterAll, beforeAll } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { newID } from "@/infra/adapters/newID";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { placaGenerator } from "@/utils/placa-generator";
import { Carro, Usuario } from "@/core/models";
import { TEST_TYPE } from "@/infra/config/environment";
import { database } from "@/infra/database/client";
import { afterEach, beforeEach } from "node:test";


export const abastecimentoId = newID();
export const abastecimentoId2 = newID();

export const user: Usuario = {
	id: newID(),
	nome: faker.person.fullName(),
	username: faker.internet.username(),
	password: faker.internet.password(),
	email: faker.internet.email(),
};

export const user2: Usuario = {
	id: newID(),
	nome: faker.person.fullName(),
	username: faker.internet.username(),
	password: faker.internet.password(),
	email: faker.internet.email(),
};

export const carro: Carro = {
	id: newID(),
	placa: placaGenerator(),
	modelo: faker.vehicle.model(),
	marca: faker.vehicle.manufacturer(),
	usuarioId: user.id,
};

export const carro2: Carro = {
	id: newID(),
	placa: placaGenerator(),
	modelo: faker.vehicle.model(),
	marca: faker.vehicle.manufacturer(),
	usuarioId: user.id,
};

if(TEST_TYPE === 'e2e') {
	const repository = abastecimentoPrismaRepository;
	const carroRepository = carroPrismaRepository;
	const usuarioRepository = usuarioPrismaRepository;

	(async () => {
		console.log('setuping database...');

		await usuarioRepository.removeAll();
		await carroRepository.removeAll();
		await repository.removeAll();

		await usuarioRepository.create(user);

		await carroRepository.create(carro);
		await carroRepository.create(carro2);

		await repository.create({
			id: abastecimentoId,
			carroId: carro.id,
			kmInicial: 0,
			kmFinal: 50,
			litros: 5,
			precoCombustivel: 2.0,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date(),
		});

		await repository.create({
			id: abastecimentoId2,
			carroId: carro2.id,
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.0,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date(),
		});

	})()

	afterAll(async () => {
		await database.$disconnect()
	})
}
