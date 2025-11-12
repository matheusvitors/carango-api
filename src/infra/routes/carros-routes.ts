import { Router, Request, Response } from "express";
import { route } from "@/infra/adapters/route";
import { carroPrismaRepository } from "@/infra/database/prisma";
import { createCarroController, editCarroController, getCarroController, listCarrosController, removeCarroController } from "@/application/controllers/carros";
import { extractUserId } from "@/utils";

const router = Router();
const repository = carroPrismaRepository;
const path = '/carros'

router.get(`${path}`, async (request: Request, response: Response) => {
	const responseData = await listCarrosController({
		repository,
		usuarioId: extractUserId(request.headers['authorization']?.split(' ')[1])
	});
	route({ response, responseData });
})

router.get(`${path}/:id`, async (request: Request, response: Response) => {
	const responseData = await getCarroController({
		repository,
		id: request.params.id,
		usuarioId: extractUserId(request.headers['authorization']?.split(' ')[1])
	});
	route({ response, responseData });
})

router.post(`${path}`, async (request: Request, response: Response) => {
	const responseData = await createCarroController({
		repository,
		input: {
			placa: request.body.placa,
			marca: request.body.marca,
			modelo: request.body.modelo,
			usuarioId: extractUserId(request.headers['authorization']?.split(' ')[1])
		}
	});
	route({ response, responseData });
})

router.put(`${path}/:id`, async (request: Request, response: Response) => {
	const responseData = await editCarroController({
		repository,
		input: {
			id: request.params.id,
			placa: request.body.placa,
			marca: request.body.marca,
			modelo: request.body.modelo,
			usuarioId: extractUserId(request.headers['authorization']?.split(' ')[1])
		}
	});
	route({ response, responseData });
})

router.delete(`${path}/:id`, async (request: Request, response: Response) => {
	const responseData = await removeCarroController({
		repository,
		id: request.params.id
	});
	route({ response, responseData });
})

export { router as carroRoutes }
