import { Request, Response, NextFunction } from "express"

export const requestLogger = async (request: Request, response: Response, next: NextFunction) => {

	const logText = `[${request.method}] - ${request.url} - ${request.ip} - ${new Date().toLocaleDateString('pt-BR', {hour: "2-digit", minute: '2-digit'})}${request.body !== undefined ? ' - [BODY]' + JSON.stringify(request.body): ''}}`

	console.info(logText);
	next();
}
