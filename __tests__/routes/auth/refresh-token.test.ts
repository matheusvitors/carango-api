import supertest from "supertest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { JsonWebTokenError, NotBeforeError, sign, TokenExpiredError } from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { usuarioRepository } from "../../setup";
import { SECRET } from "@/infra/config/environment";
import { Usuario } from "@/core/models";
import { newID } from "@/infra/adapters/newID";

vi.mock("@/infra/adapters/jwt", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/infra/adapters/jwt")>();
	return {
		jwt: {
			...actual.jwt,
			encode: vi.fn(actual.jwt.encode),
			verify: vi.fn(actual.jwt.verify),
		},
	};
});

describe("Refresh Token - e2e Test", () => {
		const user: Usuario = {
		id: newID(),
		nome: faker.person.fullName(),
		username: faker.internet.username(),
		password: faker.internet.password(),
		email: faker.internet.email(),
	}


	beforeAll(async () => {
		await usuarioRepository.create(user);
	});


	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should return a new access token", async () => {
		const token = sign({ id: user.id }, SECRET || "thisisascret", { expiresIn: "7d" });

		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(200);
		expect(response.body.response.content.access_token.length).toBeGreaterThan(5);
	});

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
	it("should return 401 if user not exist", async () => {
		const token = sign({ id: "0" }, SECRET || "thisisascret", { expiresIn: "7d" });

		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(401);
	});

	it("should return 401 case current time of expiration is before claim", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new NotBeforeError("jwt not active", new Date(new Date().getTime() - 15 * 60 * 1000));
		});

		const token = "abc";
		const response = await supertest(app).post("/auth/refresh-token").send({ token });

		expect(response.status).toEqual(401);
	});

	it("should throw an error when authorizing the user", async () => {
		vi.mocked(jwt.verify).mockImplementation(() => {
			throw new Error();
		});

		const token = jwt.encode({ payload: { teste: true } });

		const response = await supertest(app).post("/auth/refresh-token").send({ refreshToken: token });

		expect(response.status).toEqual(500);
	});
});
