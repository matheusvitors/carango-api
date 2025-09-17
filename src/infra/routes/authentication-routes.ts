import { Request, Response, Router } from "express";
import { route } from "@/infra/adapters/route";
import { authenticationController } from "@/application/controllers/authentication/authentication-controller";
import { usuarioPrismaRepository } from "@/infra/database/prisma";

const router = Router();
const repository = usuarioPrismaRepository;

router.post('/login', async (request: Request, response: Response) => {
	const responseData = await authenticationController({
		repository,
		username: request.body.username,
		password: request.body.password,
	});
	route({ response, responseData });
})

export { router as AuthenticationRoutes };
