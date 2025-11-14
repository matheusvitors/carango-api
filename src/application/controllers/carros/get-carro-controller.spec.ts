import { beforeAll, describe, expect, it } from "vitest";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { Carro } from "@/core/models";
import { getCarroController } from "@/application/controllers/carros";

describe.skip('Get List Controller', () => {
	const repository = new InMemoryRepository<Carro, Carro>();

	beforeAll(() => {
		repository.create({
			id: 'abc',
			nome: 'Teste',
			username: 'teste',
			password: '123',
			email: 'teste@teste.com'
		})
	})

	it('should get the user', async () => {
		const response = await getCarroController({repository, id: 'abc'});
		expect(response.status).toEqual(200)
	});

	it('should not find the user', async () => {
		const response = await getCarroController({repository, id: 'xyz'});
		expect(response.status).toEqual(404)
	});

	it('should return 500 if have error server', async () => {
		//@ts-ignore
		const response = await getCarroController(null);
		expect(response.status).toEqual(500);
	});
});
