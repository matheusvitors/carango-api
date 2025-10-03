import { Request, Response, NextFunction } from "express";

const logger = (request: Request, start: number, data?: any) => {
	console.info('--------------------------------------')
	console.info(`[${new Date().toISOString()}] ${request.method} ${request.originalUrl} - Status: ${request.statusCode}`);
	data && console.info('[BODY]', data);
}

export const responseLogger = async (request: Request, response: Response, next: NextFunction) => {
	const start = Date.now()
	const originalSend = response.send;
	response.send = function (data) {
		logger(request, start, data)
		return originalSend.call(this, data);
	};

	const originalJson = response.json;
	response.json = function (body) {
		logger(request, start, body)
		return originalJson.call(this, body)
	}

	const originalEnd = response.end;
	response.json = function () {
		logger(request, start)
		return originalEnd.apply(this)
	}

	next();
};
