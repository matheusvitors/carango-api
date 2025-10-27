import { Response } from "express";
import { ResponseData } from "@/application/interfaces";

interface RouteParams {
    response: Response;
    responseData: ResponseData
}

export const route = async ( {response, responseData}: RouteParams) => {

	try {
		if(responseData.body) {
			return response.status(responseData.status).json({response: responseData.body})
		} else {
			return response.status(responseData.status).end()
		}
	} catch (error) {
		console.error(error);
		return response.status(500).json({response: {error}})
	}

	// return responseData.body ? response.status(responseData.status).json({response: responseData.body}) : response.status(responseData.status).end();
}
