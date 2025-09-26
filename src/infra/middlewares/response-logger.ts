import { Request, Response, NextFunction } from "express";

export const responseLogger = async (request: Request, response: Response, next: NextFunction) => {
	// Guarda a função original
	const originalSend = response.send;

	// Sobrescreve res.send()
	response.send = function (data) {
		// Faz o log da response
		console.log('--------------------------------------')
		console.log(`[${new Date().toISOString()}] ${request.method} ${request.originalUrl} - Status: ${request.statusCode}`);
		console.log("Response Body:", data);

		// Chama a função original
		return originalSend.call(this, data);
	};

	next();
};
