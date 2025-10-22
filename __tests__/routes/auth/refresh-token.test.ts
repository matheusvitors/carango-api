import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import supertest from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/infra/adapters/jwt", () => ({
	jwt: {
		encode: vi.fn(),
		verify: vi.fn(),
	}
}));

describe('Name of the group', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	//deve retornar o novo access token
	it('should return a new access token', () => {

	});

	//deve retornar 401 caso o token seja inválido ou expirado
	it('should return 401 if refresh token is invalid', () => {

	});

	//deve retornar 401 caso o usuario não exista
	it('should return 401 if user not exist', () => {

	});

	//deve retornar 401 se a expiração dele for antes da criação
	it('should return 401 case current time of expiration is before claim', () => {

	});

	//deve retornar 500 caso algo inesperado aconteça
	it('should throw an error when authorizing the user', async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new Error();
		})

		const token = jwt.encode({ payload: { teste: true }});

		const response = await supertest(app)
		.get('/auth/refresh-token')
		.send({ refreshToken: token})

		expect(response.status).toEqual(500);

	});

});
