import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { app } from "@/server";
import { abastecimentoId, abastecimentoId2, user } from "../../setup";

describe('Delete Abastecimento - Integration Test', () => {

	const path = '/carros'

	const token = jwt.encode({ payload: {id: user.id}});

	it('should delete the abastecimento', async () => {
		const response = await supertest(app)
		.delete(`${path}/abastecimentos/${abastecimentoId}`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should not find the car on delete', async () => {
		const response = await supertest(app)
		.delete(`${path}/abastecimentos/999`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404);
	});
});
