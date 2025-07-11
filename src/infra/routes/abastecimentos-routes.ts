import { Router, Request, Response } from "express";
import { route } from "@/infra/adapters/route";
import { extractUserId } from "@/utils";
import { abastecimentoPrismaRepository } from "@/infra/database/prisma";

const router = Router();
const repository = abastecimentoPrismaRepository;
const path = '/carros'

router.get(`${path}`, async (request: Request, response: Response) => {
	const responseData = await listCarrosController(repository);
	route({ response, responseData });
})

router.get(`${path}/:id`, async (request: Request, response: Response) => {
	const responseData = await getCarroController({
		repository,
		id: request.params.id
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

router.put(`${path}`, async (request: Request, response: Response) => {
	const responseData = await editCarroController({
		repository,
		input: {
			id: request.body.id,
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
