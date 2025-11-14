import { beforeAll, describe, expect, it } from "vitest";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { Usuario } from "@/core/models";
import { getUsuarioController } from "@/application/controllers/usuario";

describe.skip('Get List Controller', () => {
	const repository = new InMemoryRepository<Usuario>();

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
		const response = await getUsuarioController({repository, id: 'abc'});
		expect(response.status).toEqual(200)
	});

	it('should not find the user', async () => {
		const response = await getUsuarioController({repository, id: 'xyz'});
		expect(response.status).toEqual(404)
	});

	it('should return 500 if have error server', async () => {
		//@ts-ignore
		const response = await getUsuarioController(null);
		expect(response.status).toEqual(500);
	});
});
