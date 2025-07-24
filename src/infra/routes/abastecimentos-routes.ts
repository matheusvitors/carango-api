import { Router, Request, Response } from "express";
import { route } from "@/infra/adapters/route";
import { abastecimentoPrismaRepository, carroPrismaRepository } from "@/infra/database/prisma";
import { createAbastecimentoController, getAbastecimentoController, listAbastecimentosController } from "@/application/controllers/abastecimentos";

const router = Router();
const repository = abastecimentoPrismaRepository;
const carroRepository = carroPrismaRepository;
const path = '/carros'

router.get(`${path}/:carroId/abastecimentos`, async (request: Request, response: Response) => {
	const responseData = await listAbastecimentosController({repository, carroId: request.params.carroId});
	route({ response, responseData });
})

router.get(`${path}/abastecimentos/:id`, async (request: Request, response: Response) => {
	const responseData = await getAbastecimentoController({
		repository,
		id: request.params.id
	});
	route({ response, responseData });
})

router.post(`${path}/:carroId/abastecimentos`, async (request: Request, response: Response) => {
	const responseData = await createAbastecimentoController({
		repository,
		carroRepository,
		input: {
			carroId: request.params.carroId,
			kmInicial: request.body.kmInicial,
			kmFinal: request.body.kmFinal,
			litros: request.body.litros,
			precoCombustivel: request.body.precoCombustivel,
			combustivel: request.body.combustivel,
			tipoCombustivel: request.body.tipoCombustivel,
			data: new Date(request.body.data),
		}
	});
	route({ response, responseData });
})

// router.put(`${path}`, async (request: Request, response: Response) => {
// 	const responseData = await editCarroController({
// 		repository,
// 		input: {
// 			id: request.body.id,
// 			placa: request.body.placa,
// 			marca: request.body.marca,
// 			modelo: request.body.modelo,
// 			usuarioId: extractUserId(request.headers['authorization']?.split(' ')[1])
// 		}
// 	});
// 	route({ response, responseData });
// })

// router.delete(`${path}/:id`, async (request: Request, response: Response) => {
// 	const responseData = await removeCarroController({
// 		repository,
// 		id: request.params.id
// 	});
// 	route({ response, responseData });
// })

export { router as abastecimentosRoutes }
