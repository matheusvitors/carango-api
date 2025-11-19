import { beforeAll, describe, expect, it } from "vitest";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { Carro } from "@/core/models";
import { listCarrosController } from "@/application/controllers/carros";

describe.skip('Carro List Controller', () => {
	const repository = new InMemoryRepository<Carro>();

	beforeAll(() => {
		repository.create({
			id: 'abc',
			placa: 'placa',
			modelo: 'modelo',
			marca: 'marca',
		})
	})

	it('should list users', async () => {
		const response = await listCarrosController(repository);
		expect(response.status).toEqual(200);
		expect(response.body.content.length).toEqual(1);
	});

	it('should return 500 if have error server', async () => {
		//@ts-ignore
		const response = await listCarrosController(null);
		expect(response.status).toEqual(500);
	});
});
