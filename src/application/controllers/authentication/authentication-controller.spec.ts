import { authenticationController } from "@/application/controllers/authentication/authentication-controller";
import { Usuario } from "@/core/models";
import { jwt } from "@/infra/adapters/jwt";
import { InMemoryRepository } from "@/infra/database/InMemoryRepository";
import { describe, it, expect, beforeAll} from "vitest";

describe("Authentication Controller", () => {

	const repository = new InMemoryRepository<Usuario, Usuario>()

	beforeAll(() => {
		repository.create({
			id: 'abc',
			nome: 'Teste',
			username: 'teste',
			password: '$2a$12$gdJ0ADYecEO2gz19ut3nv.lNJwrlShEufimUSn27vomZlhmRR8Tte',
			email: 'teste@teste.com'
		})
	})

	it("should authenticate the user", async () => {
		const result = await authenticationController({ repository, username: "teste", password: '123456' });
		const resultId = jwt.verify(result.body.content.token).payload.id;

		expect(result.status).toEqual(200);
		expect(resultId).toEqual('abc');
		expect(result.body.content.refreshToken.length).toBeGreaterThan(5);
	});

	it("should return 401 if password is wrong", async () => {
		const result = await authenticationController({ repository, username: "teste", password: "456" });
		expect(result.status).toEqual(401);
	});

	it("should return 404 if user not found", async () => {
		const result = await authenticationController({ repository, username: "dev", password: '123456' });
		expect(result.status).toEqual(404);
	});
});
