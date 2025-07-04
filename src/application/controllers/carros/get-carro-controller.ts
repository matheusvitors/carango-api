import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { notFound, serverError, success } from "@/infra/adapters/response-wrapper";

interface GetCarroControllerParams {
	repository: Repository<Carro>;
	id: string;
}

export const getCarroController = async (params: GetCarroControllerParams): Promise<ResponseData> => {
	try {
		const { repository, id } = params;
		const carro = await repository.get(id);
		if(!carro){
			return notFound();
		}

		return success(carro);
	} catch (error) {
		return serverError(error);
	}
}
