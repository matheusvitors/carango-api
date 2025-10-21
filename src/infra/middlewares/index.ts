import cors from "cors";
import { json, urlencoded } from "express";
import { authorization } from "@/infra/middlewares/authorization";
import { security } from "@/infra/middlewares/security";
import { requestLogger } from "@/infra/middlewares/requests-logger";

export const middlewares = [
	json(),
	urlencoded({extended: false}),
	cors(),
	security,
	authorization,
	requestLogger,
]
