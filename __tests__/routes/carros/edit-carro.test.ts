import { describe, it, expect } from "vitest";
import supertest from "supertest";
import { app } from "@/server";
import { carro, carro2, carro3, user } from "../../setup";
import { jwt } from "@/infra/adapters/jwt";

const path = `/carros`;
const token = jwt.encode({ payload: { id: user.id } });

describe("Edit Carro - e2e Test", () => {
	it("should edit a car", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: "BBB9876",
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(200);
	});

	it("should return 404 if carro is not found", async () => {
		const response = await supertest(app)
			.put(`${path}/xyz`)
			.send({
				placa: "BBB9876",
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});

	it("should return 404 if carro belongs to another user", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro3.id}`)
			.send({
				placa: "BBB9876",
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(404);
	});


	it("should return 422 if pass invalid two or more data on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: "BBB9876",
				modelo: "F",
				marca: "A",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual("A marca é obrigatória");
		expect(response.body.response.errors.modelo).toEqual("O modelo é obrigatório");
	});

	it("should return 422 if pass incorrect placa format on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: "BBB9876aa",
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual("A placa está com o formato incorreto!");
	});

	it("should return 409 if pass existent placa on edit", async () => {
		const response = await supertest(app)
			.put(`${path}/${carro2.id}`)
			.send({
				placa: carro.placa,
				modelo: "Fiat",
				marca: "Argo",
			})
			.set({ authorization: `Bearer ${token}` });

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual("Placa já existente!");
	});
});
