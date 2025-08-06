import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user, carro } from "__tests__/setup";
import { DATABASE_URL } from "@/infra/config/environment";

describe('List Abastecimentos - Integration Test', () => {
	console.log('db url', DATABASE_URL);

	const path = '/carros';
	const token = jwt.encode({ payload: {id: user.id}});

	it('should list refuelings of a car', async () => {
		const response = await supertest(app)
		.get(`${path}/${carro.id}/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).above(1);
	});
});
