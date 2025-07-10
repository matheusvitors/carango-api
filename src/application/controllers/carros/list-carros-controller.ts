

import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { serverError, success } from "@/infra/adapters/response-wrapper";

export const listCarrosController = async (repository: Repository<Carro, Carro>): Promise<ResponseData> => {
	try {
		const carros = await repository.list();
		return success(carros);
	} catch (error) {
		return serverError(error);
	}
}
