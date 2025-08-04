import { describe, beforeAll, it, expect, afterAll } from "vitest";
;import supertest from "supertest";
import { app } from "@/server";
import { usuarioPrismaRepository } from "@/infra/database/prisma";
import { database } from "@/infra/database/client";
import { SECRET } from "@/infra/config/environment";
import { jwt } from "@/infra/adapters/jwt";

describe.skip('Usuario - Integration Test', () => {

	const repository = usuarioPrismaRepository;
	const token = jwt.encode({ payload: {id: 'abc'}});

	beforeAll(async () => {
		await database.usuario.deleteMany({});
		await repository.create({
			id: 'abc',
			nome: 'Fulano',
			username: 'fulanus',
			email: 'fulanus@test.com',
			password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
		})
		await repository.create({
			id: 'efg',
			nome: 'Siclano',
			username: 'siclanus',
			email: 'siclanus@test.com',
			password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
		})
	});

	afterAll(async () => {
		await database.usuario.deleteMany({});
	})

	it('should list usuarios', async () => {
		const response = await supertest(app)
		.get("/users")
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.length).toEqual(2);
	});

	it('should get a usuario', async () => {
		const response = await supertest(app).get(`/users/efg`)
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(200);
		expect(response.body.response.content.id).toEqual('efg');
	});

	it('should not find the usuario', async () => {
		const response = await supertest(app).get(`/users/zyz`)
		.set({ authorization: `Bearer ${token}` });

		expect(response.statusCode).toEqual(404);
	});

	it.skip('should throw a error when get usuario', async () => {
		const response = await supertest(app).get("/users/abc")
		.set({ authorization: `Bearer ${token}` });
		expect(response.statusCode).toEqual(500);
	});

	// it('should create a usuario', async () => {
	// 	const response = await supertest(app)
	// 	.post("/usuarios/new")
	// 	.send({
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(201);
	// });

	// it('should return error 422 when invalid information is send', async () => {
	// 	const response = await supertest(app)
	// 	.post("/usuarios/new")
	// 	.send({
	// 		name: '',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(422);

	// });

	// it('should throw a error when create usuario', async () => {
	// 	const response = await supertest(app)
	// 	.post("/usuarios/new")
	// 	.send({
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})
	// 	expect(response.statusCode).toEqual(500);
	// });

	// it('should edit a usuario', async () => {
	// 	const response = await supertest(app)
	// 	.put("/usuarios")
	// 	.send({
	// 		id:'abc',
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(204);
	// });

	// it('should return error 404 when id is not send', async () => {
	// 	const response = await supertest(app)
	// 	.put("/usuarios")
	// 	.send({
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(404);
	// });

	// it('should return error 404 when try to update usuario', async () => {
	// 	const response = await supertest(app)
	// 	.put("/usuarios")
	// 	.send({
	// 		id:'123',
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(404);
	// });

	// it('should return error 422 when invalid information is send', async () => {
	// 	const response = await supertest(app)
	// 	.put("/usuarios")
	// 	.send({
	// 		id:'abc',
	// 		name: '',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})

	// 	expect(response.statusCode).toEqual(422);

	// });

	// it('should throw a error when edit usuario', async () => {
	// 	const response = await supertest(app)
	// 	.put("/usuarios")
	// 	.send({
	// 		id:'abc',
	// 		name: 'Fulano',
	// 		usuarioname: 'fulanus',
	// 		email: 'fulanus@test.com',
	// 		password: '$2a$12$cEjURlg2xvV.jpIibYfDUe1V4GvkeITtVTnUmEfAXbagxvfKhd3Fq'
	// 	})
	// 	expect(response.statusCode).toEqual(500);
	// });

	// it('should remove a usuario', async () => {
	// 	const response = await supertest(app).delete(`/usuarios/abc`);
	// 	expect(response.statusCode).toEqual(200);
	// });

	// it('should return error 404 when try delete the usuario', async () => {
	// 	const response = await supertest(app).delete(`/usuarios/123`);
	// 	expect(response.statusCode).toEqual(404);
	// });

	// it('should return error 422 when id is not send', async () => {
	// 	const response = await supertest(app).delete(`/usuarios/abc`);
	// 	expect(response.statusCode).toEqual(500);
	// });

});
