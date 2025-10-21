import { Request, Response, NextFunction } from "express"
import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
	points: process.env.NODE_ENV === 'test' ? 1000 : 10,
	duration: 5
})

export const security =  async (request: Request, response: Response, next: NextFunction) => {
	try {
		if(!request.ip) {
			throw new Error('Empty ip');
		}
		await limiter.consume(request.ip, 1);
		next();
	} catch (error) {
		return response.status(429).json({
			message: 'Too many requests.',
			code: 429
		})
	}
}
