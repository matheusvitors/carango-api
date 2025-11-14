import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user, carro } from "../../setup";

describe.skip('Create Abastecimento - Integration Test', () => {

	const path = '/carros';
	const token = jwt.encode({ payload: { id: user.id } });

	it('should create a refueling', async () => {
		const response = await supertest(app)
		.post(`${path}/${carro.id}/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date()
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(201);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await supertest(app)
		.post(`${path}/${carro.id}/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 250,
			litros: 'a',
			precoCombustivel: 2.00,
			combustivel: "alcool",
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.data).toEqual('Data inválida');
		expect(response.body.response.errors.litros).toEqual('Invalid input: expected number, received string');
	});

	it('should return 404 if carro.id not found', async () => {
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
		.post(`${path}/${carro.id}/abastecimentos`)
		.send({
			kmInicial: 100,
			kmFinal: 50,
			litros: 20,
			precoCombustivel: 2.00,
			combustivel: "gasolina",
			tipoCombustivel: "comum",
			data: new Date()
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.combustivel).toEqual('O km final é menor que o km inicial');
	});

	it('should return 422 if litros is equal 0', async () => {
		const response = await supertest(app)
		.post(`${path}/${carro.id}/abastecimentos`)
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
		.post(`${path}/${carro.id}/abastecimentos`)
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
		expect(response.body.response.errors.precoCombustivel).toEqual('O preço do combustível deve ser maior que zero');
	});

	it('should return 422 if combustivel is different from gasolina or alcool', async () => {
		const response = await supertest(app)
		.post(`${path}/${carro.id}/abastecimentos`)
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
		.post(`${path}/${carro.id}/abastecimentos`)
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
});
