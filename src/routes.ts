import { Router, Request, Response } from "express";
import project from '../package.json';
import * as appRoutes from '@/infra/routes';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
	response.status(200).send({
		name: 'Carango',
		version: project.version
	});
});

routes.get('/test', async (request: Request, response: Response) => {
	response.status(200).send({
		message: 'Test!',
		randomNumber: Math.random()
	});
});

routes.use(Object.values(appRoutes))

export { routes }
