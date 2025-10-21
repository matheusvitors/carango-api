import { Response } from "express";
import { ResponseData } from "@/application/interfaces";

interface RouteParams {
    response: Response;
    responseData: ResponseData
}

export const route = async ( {response, responseData}: RouteParams) => {
	if(responseData.body) {
		return response.status(responseData.status).json({response: responseData.body})
	} else {
		return response.status(responseData.status).end()
	}

	// return responseData.body ? response.status(responseData.status).json({response: responseData.body}) : response.status(responseData.status).end();
}
