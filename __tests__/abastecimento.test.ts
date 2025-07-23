import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { app } from "@/server";

describe.skip('Abastecimento - Integration Test', () => {

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


	it('should get the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/123/abastecimentos/456`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should not find the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/zzz/abastecimentos/oigfg`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});

	it('should create a refueling', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(201);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "água",
			tipoCombustivel: "incomum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O combustível é inválido');
		expect(response.body.response.errors.tipoCombustivel).toEqual('O tipo do combustível é inválido');
	});

	it('should return 404 if carroId not found', async () => {
		const response = await supertest(app)
		.post(`${path}/zzz/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404);
	});

	it('should return 422 if km final is less than km inicial', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 50,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O km final é menor que o km inicial');
	});

	it('should return 422 if litros is equal 0', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 0,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.litros).toEqual('A quantidade de litros deve ser maior que zero');
	});

	it('should return 422 if precoCombustivel is equal 0', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel:0,
			combustivel: "gasolina",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.litros).toEqual('O preço do combustível deve ser maior que zero');
	});

	it('should return 422 if combustivel is different from gasolina or alcool', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel: 1,
			combustivel: "água",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O combustível é inválido');
	});

	it('should return 422 if tipoCombustivel is different from comum or aditivada', async () => {
		const response = await supertest(app)
		.post(`${path}/abc/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 10,
			precoCombustivel:0,
			combustivel: "gasolina",
			tipoCombustivel: "incomum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.tipoCombustivel).toEqual('O tipo do combustível é inválido');
	});

	it('should edit a refueling', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "alcool",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should return 422 if pass invalid two or more data on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "água",
			tipoCombustivel: "incomum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O combustível é inválido');
		expect(response.body.response.errors.tipoCombustivel).toEqual('O tipo do combustível é inválido');
	});

	it('should return 404 if carroId not found on edit', async () => {
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


		expect(response.status).toEqual(404);
	});

	it('should return 422 if km final is less than km inicial on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 50,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "alcool",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O km final é menor que o km inicial');
	});

	it('should return 422 if litros is equal 0 on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 0,
			precoCombustivel: 2.00,
			combustivel: "alcool",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.litros).toEqual('A quantidade de litros deve ser maior que zero');
	});

	it('should return 422 if precoCombustivel is equal 0 on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 0,
			combustivel: "alcool",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.litros).toEqual('O preço do combustível deve ser maior que zero');

	});

	it('should return 422 if combustivel is different from gasolina or alcool on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "água",
			tipoCombustivel: "comum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O combustível é inválido');
	});

	it('should return 422 if tipoCombustivel is different from comum or aditivada on edit', async () => {
		const response = await supertest(app)
		.put(`${path}/abc/abastecimentos/456`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "alcool",
			tipoCombustivel: "incomum"
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.tipoCombustivel).toEqual('O tipo do combustível é inválido');
	});

	it('should delete the car', async () => {
		const response = await supertest(app)
		.delete(`${path}/abc/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should not find the car on delete', async () => {
		const response = await supertest(app)
		.delete(`${path}/abc/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404);
	});
});
