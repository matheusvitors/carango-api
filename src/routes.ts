import { Router, Request, Response } from "express";
import project from '../package.json';
import * as appRoutes from '@/infra/routes';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
	response.status(200).send({
		name: 'Carango',
		teste: 1,
		version: project.version
	});
});

routes.get('/test', async (request: Request, response: Response) => {
	response.status(200).send({
		message: 'Test!'
	});
});

routes.use(Object.values(appRoutes))

export { routes }
