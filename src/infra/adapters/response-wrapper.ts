import { ResponseData } from "@/application/interfaces";

export const success = (content?: any): ResponseData => {
	return content ? { status: 200, body: {content} } : { status: 200 };
}

export const created = (): ResponseData => {
	return { status: 201 };
}

export const updated = (): ResponseData => {
	return { status: 204 };
}

export const unauthorized = (message?: any): ResponseData => {
	return message ?  { status: 401, body: { message } } : { status: 401 };
}

export const notFound = (message?: string): ResponseData => {
	return message ?  { status: 404, body: { message } } : { status: 404 };
}

export const forbbiden = (): ResponseData => {
	return { status: 403 };
}

export const conflict = (message?: string): ResponseData => {
	return message ?  { status: 409, body: { message } } : { status: 409 };
}

export const lengthRequired = (): ResponseData => {
	return { status: 411 };
}

export const unsupportMediaType = (): ResponseData => {
	return { status: 415 };
}

export const iAmTeaPot = (): ResponseData => {
	return { status: 418 };
}

export const unprocessableEntity = (errors: object): ResponseData => {
	return { status: 422, body: { errors } };
}

export const tooManyRequests = (): ResponseData => {
	return { status: 429 };
}

export const serverError = (error: any): ResponseData => {
	return { status: 500, body: { message: error.message } };
}

export const notImplemented = (): ResponseData => {
	return { status: 501 };
}
