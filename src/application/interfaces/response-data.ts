import { HttpStatusCode } from "@/application/types";

export interface ResponseData {
	status: HttpStatusCode;
	body?: any;
}
