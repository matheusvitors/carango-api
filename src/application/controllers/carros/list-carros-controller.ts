import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { serverError, success } from "@/infra/adapters/response-wrapper";

interface ListCarrosControllerParams {
	usuarioId: string;
	repository: Repository<Carro, Carro>;
}

export const listCarrosController = async (params: ListCarrosControllerParams): Promise<ResponseData> => {
	try {
		const { repository, usuarioId } = params;
		const carros = await repository.filter!([{usuarioId}]);
		return success(carros);
	} catch (error) {
		console.error(error)
		return serverError(error);
	}
}
