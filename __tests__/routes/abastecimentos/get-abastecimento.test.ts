import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { user, abastecimentoId2 } from "../../setup";

describe.skip('Get Abastecimento - Integration Test', () => {

	const path = '/carros'
	const token = jwt.encode({ payload: {id: user.id}});

	it('should get the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/abastecimentos/${abastecimentoId2}`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should not find the refueling', async () => {
		const response = await supertest(app)
		.get(`${path}/abastecimentos/oigfg`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});
});
