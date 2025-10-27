import { describe, it, expect } from "vitest";
;import supertest from "supertest";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { user } from "../setup";

describe('Usuario - Integration Test', () => {

	const token = jwt.encode({ payload: {id: 'abc'}});

	it('should list usuarios', async () => {
		const response = await supertest(app)
		.get("/users")
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.length).above(1);
	});

	it('should get a usuario', async () => {
		const response = await supertest(app).get(`/users/${user.id}`)
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.id).toEqual(user.id);
	});

	it('should not find the usuario', async () => {
		const response = await supertest(app).get(`/users/zyz`)
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(404);
	});
});
