import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { app } from "@/server";

describe('Edit Abastecimento - Integration Test', () => {

	const repository = abastecimentoPrismaRepository;
	const carroRepository = carroPrismaRepository;
	const usuarioRepository = usuarioPrismaRepository;

	const token = jwt.encode({ payload: {id: 'www'}});
	const path = '/carros'

	beforeAll(async () => {
		await usuarioRepository.create({
			id: 'www',
			nome: 'Fulano',
			username: 'fulanus',
			email: 'fulanus@test.com',
			password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
		});

		await carroRepository.create({
			id: 'abc',
			placa: "AAA1234",
			modelo: "M3",
			marca: "BMW",
			usuarioId: 'www'
		});

		await carroRepository.create({
			id: 'def',
			placa: "ZZZ6543",
			modelo: "Uno",
			marca: "Fiat",
			usuarioId: 'www'
		});

		await repository.create({
			id: "123",
			carroId: "abc",
			kmInicial: 0,
			kmFinal: 50,
			litros: 5,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})

		await repository.create({
			id: "456",
			carroId: "def",
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})

	})

	afterAll(async () => {
		await repository.removeAll();
		await carroRepository.removeAll();
		await usuarioPrismaRepository.removeAll();
	})

	it('should edit a refueling', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 110,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		const { body } = await supertest(app)
		.get(`${path}/abastecimentos/123`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(body.response.content.kmInicial).toEqual(110);

	});

	it('should return 422 if pass invalid two or more data on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 'a',
			precoCombustivel: 2.00,
			combustivel: "alcool"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.data).toEqual('Data inválida');
		expect(response.body.response.errors.litros).toEqual('Invalid input: expected number, received string');
	});

	it('should return 404 if abastecimento not found on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/xyz`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404);
	});

	it('should return 422 if km final is less than km inicial on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 50,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O km final é menor que o km inicial');
	});

	it('should return 422 if litros is equal 0 on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 0,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.litros).toEqual('A quantidade de litros deve ser maior que zero');
	});

	it('should return 422 if precoCombustivel is equal 0 on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel:0,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.precoCombustivel).toEqual('O preço do combustível deve ser maior que zero');
	});

	it('should return 422 if combustivel is different from gasolina or alcool on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel: 1,
			combustivel: "água",
			tipoCombustivel: "comum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O combustível é inválido');
	});

	it('should return 422 if tipoCombustivel is different from comum or aditivada on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/123`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel:0,
			combustivel: "gasolina",
			tipoCombustivel: "incomum",
			data: new Date('2025-01-01')
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.tipoCombustivel).toEqual('O tipo do combustível é inválido');
	});

});
