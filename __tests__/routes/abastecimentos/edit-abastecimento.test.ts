import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user, abastecimentoId } from "__tests__/setup";

describe('Edit Abastecimento - Integration Test', () => {

	const path = '/carros'
	const token = jwt.encode({ payload: {id: user.id}});

	it('should edit a refueling', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.get(`${path}/abastecimentos/${abastecimentoId}`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(body.response.content.kmInicial).toEqual(110);

	});

	it('should return 422 if pass invalid two or more data on edit ', async () => {
		const response = await supertest(app)
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
		.put(`${path}/abastecimentos/${abastecimentoId}`)
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
