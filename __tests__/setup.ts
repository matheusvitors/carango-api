import { beforeAll } from "vitest";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { newID } from "@/infra/adapters/newID";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { placaGenerator } from "@/utils/placa-generator";
import { Carro, Usuario } from "@/core/models";
import { TEST_TYPE } from "@/infra/config/environment";

export const abastecimentoId = newID();
export const abastecimentoId2 = newID();

export const user: Usuario = {
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


	beforeAll(async () => {
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
	});
}
