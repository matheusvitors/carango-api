import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { jwt } from "@/infra/adapters/jwt";
import { carro, user } from "../../setup";

const path = `/carros`;
const token = jwt.encode({ payload: { id: user.id } });

describe("Create Carro - e2e Test", () => {
	it("should create a car", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: "jjj1234",
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(201);
	});

	it("should return 422 if pass invalid two or more data ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: "jjj1235",
				modelo: "u",
				marca: "f",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual("A marca é obrigatória");
		expect(response.body.response.errors.modelo).toEqual("O modelo é obrigatório");
	});

	it("should return 422 if pass incorrect placa format ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: "1234",
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual("A placa está com o formato incorreto!");
	});

	it("should return 409 if pass existent placa ", async () => {
		const response = await supertest(app)
			.post(path)
			.send({
				placa: carro.placa,
				modelo: "uno",
				marca: "fiat",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual("Placa já existente!");
	});
});
