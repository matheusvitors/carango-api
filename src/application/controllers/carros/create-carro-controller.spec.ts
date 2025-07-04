import { createCarroController } from "@/application/controllers/carros/create-carro-controller";
import { Carro } from "@/core/models";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { beforeAll, describe, expect, it } from "vitest";

describe('Create Carro Controller', () => {

	const repository = new InMemoryRepository<Carro>();

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

		expect(response.status).toEqual(200);
		expect(repository.data.length).toEqual(2);
	});

	it('should return 422 if pass invalid data ', async () => {
		const response = await createCarroController({
			input: {
				placa: 'jac9876',
				modelo: 'u',
				marca: 'f',
		}, repository});

		expect(response.status).toEqual(422);
		expect(response.body.content.message).toEqual('O modelo é obrigatório');
	});

	it('should return 422 if pass incorrect placa format ', async () => {
		const response = await createCarroController({
			input: {
				placa: '321321321',
				modelo: 'uno',
				marca: 'fiat',
		}, repository});

		expect(response.status).toEqual(422);
		expect(response.body.content.message).toEqual('A placa está com o formato incorreto!');
	});

	it('should return 409 if pass existent placa ', async () => {
		const response = await createCarroController({
			input: {
				placa: 'jjj1234',
				modelo: 'uno',
				marca: 'fiat',
		}, repository});

		expect(response.status).toEqual(409);
		expect(response.body.content.message).toEqual('Placa cadastrada anteriormente!');
	});

	it('should return 500 if throw exception ', async () => {
		//@ts-ignore
		const response = await createCarroController(null);
		expect(response.status).toEqual(500);
	});
});
