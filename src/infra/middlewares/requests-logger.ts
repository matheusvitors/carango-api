import { NODE_ENV } from "@/infra/config/environment";
import { Request, Response, NextFunction } from "express";

export const requestLogger = async (request: Request, response: Response, next: NextFunction) => {
	const start = Date.now();

	response.on('finish', () => {
		const duration = Date.now() - start;
		console.info(`[${request.method}] - ${new Date().toLocaleDateString('pt-BR', {hour: "2-digit", minute: '2-digit'})} - ${request.ip} - ${request.url} - ${response.statusCode} - ${duration}ms`);
		NODE_ENV === 'development' && request.body && console.info(`<REQUEST BODY>' ${JSON.stringify(request.body)}`)
		console.info('-------------------------------------')
	})

	const originalJson = response.json;
	response.json = function (body) {
		NODE_ENV === 'development' && body && console.info(`<RESPONSE BODY>' ${JSON.stringify(body)}`)
		return originalJson.call(this, body)
	}

	return next();
};
