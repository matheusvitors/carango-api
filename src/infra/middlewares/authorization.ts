import { jwt } from "@/infra/adapters/jwt";
import { NextFunction, Request, Response } from "express";

export const authorization = async (request: Request, response: Response, next: NextFunction) => {

	try {
		const unprotectedPaths = ['/', '/login', '/auth/refresh-token'];
		if(unprotectedPaths.includes(request.path) || process.env.AUTHENTICATION === 'false') {
			return next();
		}

		const accessType = request.headers['authorization']?.split(' ')[0];
		const token = request.headers['authorization']?.split(' ')[1];

		if(!token || !accessType){
			return response.status(401).json({
				message: 'Nenhum token de acesso foi fornecido.'
			})
		}

		if(accessType !== 'Bearer') {
			return response.status(401).json({
				message: 'Tipo de acesso inválido.'
			})
		}

		jwt.verify(token);
		return next();

	} catch (error: any) {
		let status = 500;

		if(error.name === 'TokenExpiredError' ||
			error.name === 'JsonWebTokenError' ||
			error.name === 'NotBeforeError') {
			status = 401;
		}

		return response.status(status).json({
			message: 'Login não autorizado!'
		});
	}
}
