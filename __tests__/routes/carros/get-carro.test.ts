import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { carro, user, user2 } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";

const path = `/carros`;
const token = jwt.encode({ payload: { id: user.id } });

describe.skip("Get Carro - e2e Test", () => {
	it("should get the car", async () => {
		const response = await supertest(app)
			.get(`${path}/${carro.id}`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
	});

	it("should not find the car", async () => {
		const response = await supertest(app)
			.get(`${path}/xyz`)
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});

	it("should return 404 if usuarioId is different", async () => {
		const usertoken = jwt.encode({ payload: { id: user2.id } });

		const response = await supertest(app)
			.get(`${path}/${carro.id}`)
			.set({ authorization: `Bearer ${usertoken}` });

		expect(response.status).toEqual(404);
	});
});
