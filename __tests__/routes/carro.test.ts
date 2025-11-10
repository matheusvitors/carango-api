import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { jwt } from "@/infra/adapters/jwt";
import { carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { app } from "@/server";

describe.skip('Carro - Integration Test', () => {

	const repository = carroPrismaRepository;
	const usuarioRepository = usuarioPrismaRepository;
	const token = jwt.encode({ payload: {id: 'www'}});
	const path = '/carros'

	beforeAll(async () => {
		await usuarioRepository.create({
			id: 'www',
			nome: 'Fulano',
			username: 'fulanus',
			email: 'fulanus@test.com',
			password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
		});

		await repository.create({
			id: 'abc',
			placa: "AAA1234",
			modelo: "M3",
			marca: "BMW",
			usuarioId: 'www'
		});

		await repository.create({
			id: 'def',
			placa: "ZZZ6543",
			modelo: "Uno",
			marca: "Fiat",
			usuarioId: 'www'
		});
	})

	afterAll(async () => {
		await repository.removeAll();
		await usuarioRepository.removeAll();
	})

	it('should list cars', async () => {
		const response = await supertest(app)
		.get(path)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
		expect(response.body.response.content.length).above(2);
	});

	it('should get the car', async () => {
		const response = await supertest(app)
		.get(`${path}/abc`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200)
	});

	it('should not find the car', async () => {
		const response = await supertest(app)
		.get(`${path}/xyz`)
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(404)
	});

	it('should create a car', async () => {
		const response = await supertest(app)
		.post(path)
		.send({
			placa: 'jjj1234',
			modelo: 'uno',
			marca: 'fiat',
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(201);
	});

	it('should return 422 if pass invalid two or more data ', async () => {
		const response = await supertest(app)
		.post(path)
		.send({
			placa: 'jjj1235',
			modelo: 'u',
			marca: 'f',
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual('A marca é obrigatória');
		expect(response.body.response.errors.modelo).toEqual('O modelo é obrigatório');
	});

	it('should return 422 if pass incorrect placa format ', async () => {
		const response = await supertest(app)
		.post(path)
		.send({
			placa: '1234',
			modelo: 'uno',
			marca: 'fiat',
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual('A placa está com o formato incorreto!');
	});

	it('should return 409 if pass existent placa ', async () => {
		const response = await supertest(app)
		.post(path)
		.send({
			placa: 'AAA1234',
			modelo: 'uno',
			marca: 'fiat',
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual('Placa já existente!');
	});

	it('should edit a car', async () => {
		const response = await supertest(app)
		.put(path)
		.send({
			id: 'abc',
			placa: "BBB9876",
			modelo: "Fiat",
			marca: "Argo",
			usuarioId: 'www'
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(200);
	});

	it('should return 422 if pass invalid two or more data on edit', async () => {
		const response = await supertest(app)
		.put(path)
		.send({
			id: 'abc',
			placa: "BBB9876",
			modelo: "F",
			marca: "A",
			usuarioId: 'www'
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.marca).toEqual('A marca é obrigatória');
		expect(response.body.response.errors.modelo).toEqual('O modelo é obrigatório');
	});

	it('should return 422 if pass incorrect placa format on edit', async () => {
		const response = await supertest(app)
		.put(path)
		.send({
			id: 'abc',
			placa: "BBB9876aa",
			modelo: "Fiat",
			marca: "Argo",
			usuarioId: 'www'
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(422);
		expect(response.body.response.errors.placa).toEqual('A placa está com o formato incorreto!');
	});

	it('should return 409 if pass existent placa on edit', async () => {
		const response = await supertest(app)
		.put(path)
		.send({
			id: 'abc',
			placa: "ZZZ6543",
			modelo: "Fiat",
			marca: "Argo",
			usuarioId: 'www'
		})
		.set({ authorization: `Bearer ${token}`});

		expect(response.status).toEqual(409);
		expect(response.body.response.message).toEqual('Placa já existente!');
	});

	it('should delete the car', async () => {
		const response = await supertest(app)
		.delete(`${path}/abc`)
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
