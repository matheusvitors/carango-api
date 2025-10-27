import { Request, Response, Router } from "express";
import { route } from "@/infra/adapters/route";
import { authenticationController } from "@/application/controllers/authentication/authentication-controller";
import { usuarioPrismaRepository } from "@/infra/database/prisma";
import { refreshTokenController } from "@/application/controllers/authentication";

const router = Router();
const repository = usuarioPrismaRepository;

router.post('/login', async (request: Request, response: Response) => {
	const responseData = await authenticationController({
		repository,
		username: request.body.username,
		password: request.body.password,
	});
	route({ response, responseData });
});

router.post('/auth/refresh-token', async (request: Request, response: Response) => {
	const responseData = await refreshTokenController({
		repository,
		token: request.body.token
	});
	route({ response, responseData });
});

export { router as AuthenticationRoutes };
