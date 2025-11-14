import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { carro2, user } from "../../setup";

const path = `/carros`;
const token = jwt.encode({ payload: { id: user.id } });

describe.skip('Delete Carro - e2e Test', () => {
	it('should delete the car', async () => {
		const response = await supertest(app)
		.delete(`${path}/${carro2.id}`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200)
	});

	it('should not find the car on delete', async () => {
		const response = await supertest(app)
		.delete(`${path}/xyz`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});
});
