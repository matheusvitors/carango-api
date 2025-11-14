import { describe, expect, it } from "vitest";
import { listUsuariosController } from "@/application/controllers/usuario/list-usuarios-controller";
import { Usuario } from "@/core/models";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";

describe.skip('Usuario List Controller', () => {
	const repository = new InMemoryRepository<Usuario>();

	it('should list users', async () => {
		const response = await listUsuariosController(repository);
		expect(response.status).toEqual(200)
	});

	it('should return 500 if have error server', async () => {
		//@ts-ignore
		const response = await listUsuariosController(null);
		expect(response.status).toEqual(500);
	});
});
