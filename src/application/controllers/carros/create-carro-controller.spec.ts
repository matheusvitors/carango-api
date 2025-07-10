import { createCarroController } from "@/application/controllers/carros/create-carro-controller";
import { Carro } from "@/core/models";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { beforeAll, describe, expect, it } from "vitest";

describe('Create Carro Controller', () => {

	const repository = new InMemoryRepository<Carro, Carro>();

	beforeAll(() => {
		repository.create({
			id: 'abc',
			placa: 'jjj1234',
			modelo: 'palio',
			marca: 'fiat',
		})
	})

	it('should create a car', async () => {
		const response = await createCarroController({
			input: {
				placa: 'jac9876',
				modelo: 'uno',
				marca: 'fiat',
		}, repository});

		expect(response.status).toEqual(201);
		expect(repository.data.length).toEqual(2);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await createCarroController({
			input: {
				placa: 'jac9876',
				modelo: 'u',
				marca: 'f',
		}, repository});

		expect(response.status).toEqual(422);
		expect(response.body.errors.marca).toEqual('A marca é obrigatória');
		expect(response.body.errors.modelo).toEqual('O modelo é obrigatório');
	});

	it('should return 422 if pass incorrect placa format ', async () => {
		const response = await createCarroController({
			input: {
				placa: '321321321',
				modelo: 'uno',
				marca: 'fiat',
		}, repository});

		expect(response.status).toEqual(422);
		expect(response.body.errors.placa).toEqual('A placa está com o formato incorreto!');
	});

	it('should return 409 if pass existent placa ', async () => {
		const response = await createCarroController({
			input: {
				placa: 'jjj1234',
				modelo: 'uno',
				marca: 'fiat',
		}, repository});

		expect(response.status).toEqual(409);
		expect(response.body.message).toEqual('Placa já existente!');
	});

	it('should return 500 if throw exception ', async () => {
		//@ts-ignore
		const response = await createCarroController(null);
		expect(response.status).toEqual(500);
	});
});
