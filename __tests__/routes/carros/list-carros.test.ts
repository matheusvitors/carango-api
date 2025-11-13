import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { user } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";

describe("List Carros - e2e Test", () => {
	const token = jwt.encode({ payload: {id: user.id}});

	it("should list cars", async () => {
		const response = await supertest(app)
			.get(`/carros`)
			.set({ authorization: `Bearer ${token}` });

		// console.log(JSON.stringify(response.body, null, 2));

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).toEqual(2);
	});
});
