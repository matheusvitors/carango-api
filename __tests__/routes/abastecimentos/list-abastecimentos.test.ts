import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user, carro } from "__tests__/setup";

describe('List Abastecimentos - Integration Test', () => {

	const path = '/carros';
	const token = jwt.encode({ payload: {id: user.id}});

	it('should list refuelings of a car', async () => {
		const response = await supertest(app)
		.get(`${path}/${carro.id}/abastecimentos`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).toEqual(2);
	});

});
