import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user } from "../../setup";
import supertest from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JsonWebTokenError, NotBeforeError, sign, TokenExpiredError } from "jsonwebtoken";
import { SECRET } from "@/infra/config/environment";

vi.mock("@/infra/adapters/jwt", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/infra/adapters/jwt")>();
	return {
		jwt: {
			...actual.jwt, // mantém comportamento real por padrão
			encode: vi.fn(actual.jwt.encode), // se quiser mockar
			verify: vi.fn(actual.jwt.verify),
		},
	};
});

describe.skip("Refresh Token - e2e Test", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	//deve retornar o novo access token
	it("should return a new access token", async () => {
		const token = sign({ id: user.id }, SECRET || "thisisascret", { expiresIn: "7d" });

		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(200);
		expect(response.body.response.content.access_token.length).toBeGreaterThan(5);
	});

	//deve retornar 401 caso o token seja inválido ou expirado
	it("should return 401 if refresh token is invalid", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new JsonWebTokenError("Invalid token");
		});

		const response = await supertest(app).post("/auth/refresh-token").send({ token: "token" });

		expect(response.status).toEqual(401);
	});

	it("should return 401 if refresh token is expired", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new TokenExpiredError("jwt expired", new Date(new Date().getTime() + 15 * 60 * 1000));
		});

		const response = await supertest(app).post("/auth/refresh-token").send({ token: "token" });

		expect(response.status).toEqual(401);
	});

	//deve retornar 401 caso o usuario não exista
	it("should return 401 if user not exist", async () => {
		const token = sign({ id: "0" }, SECRET || "thisisascret", { expiresIn: "7d" });

		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(401);
	});

	//deve retornar 401 se a expiração dele for antes da criação
	it("should return 401 case current time of expiration is before claim", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new NotBeforeError("jwt not active", new Date(new Date().getTime() - 15 * 60 * 1000));
		});

		const token = "abc";
		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(401);
	});

	//deve retornar 500 caso algo inesperado aconteça
	it("should throw an error when authorizing the user", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new Error();
		});

		const token = jwt.encode({ payload: { teste: true } });

		const response = await supertest(app).post("/auth/refresh-token").send({ refreshToken: token });

		expect(response.status).toEqual(500);
	});
});
