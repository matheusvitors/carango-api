import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { app } from "@/server";

describe('Abastecimento - Integration Test', () => {

	const repository = abastecimentoPrismaRepository;
	const carroRepository = carroPrismaRepository;
	const usuarioRepository = usuarioPrismaRepository;

	const token = jwt.encode({ payload: {id: 'www'}});
	const path = '/carro'

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
			tipoCombustivel: "comum"
		})

		await repository.create({
			id: "456",
			carroId: "def",
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})

	})

	afterAll(async () => {
		await repository.removeAll();
		await carroRepository.removeAll();
		await usuarioPrismaRepository.removeAll();
	})

	it('should list refuelings of a car', async () => {
		const response = await supertest(app)
		.get(`${path}/abc/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).toEqual(2);
	});

	it('should get the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/abc/abastecimentos/456`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should not find the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/abc/abastecimentos/oigfg`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});

	it('should create a refueling', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({

		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(201);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({

		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual('A marca é obrigatória');
		expect(response.body.response.errors.modelo).toEqual('O modelo é obrigatório');
	});

	it('should return 404 if carroId not found', () => {

	});

	it('should return 422 if km final is less than km inicial', () => {

	});

	it('should return 422 if litros is equal 0', () => {

	});

	it('should return 422 if precoCombustivel is equal 0', () => {

	});

	it('should return 422 if combustivel is different from gasolina or alcool', () => {

	});

	it('should return 422 if tipoCombustivel is different from comum or aditivada', () => {

	});

	it('should edit a refueling', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos`)
		.send({

		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos`)
		.send({
			id: 'abc',
			placa: "BBB9876",
			modelo: "F",
			marca: "A",
			usuarioId: 'www'
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual('A marca é obrigatória');
		expect(response.body.response.errors.modelo).toEqual('O modelo é obrigatório');
	});

	it('should return 404 if carroId not found on edit', () => {

	});

	it('should return 422 if km final is less than km inicial on edit', () => {

	});

	it('should return 422 if litros is equal 0 on edit', () => {

	});

	it('should return 422 if precoCombustivel is equal 0 on edit', () => {

	});

	it('should return 422 if combustivel is different from gasolina or alcool on edit', () => {

	});

	it('should return 422 if tipoCombustivel is different from comum or aditivada on edit', () => {

	});

	it('should delete the car', async () => {
		const response = await supertest(app)
		.delete(`${path}/abc/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200)
	});

	it('should not find the car on delete', async () => {
		const response = await supertest(app)
		.delete(`${path}/abc/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});

});
