import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { notFound, serverError, success } from "@/infra/adapters/response-wrapper";

interface RemoveCarroControllerParams {
	repository: Repository<Carro, Carro>;
	id: string;
}

export const removeCarroController = async (params: RemoveCarroControllerParams): Promise<ResponseData> => {
	try {
		const { repository, id } = params;
		const carro = await repository.get(id);

		if(!carro){
			return notFound();
		}

		await repository.remove(id);

		return success(carro);
	} catch (error) {
		return serverError(error);
	}
}
