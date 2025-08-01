import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento } from "@/core/models";
import { notFound, serverError, success } from "@/infra/adapters/response-wrapper";

interface RemoveAbastecimentoControllerParams {
	repository: Repository<Abastecimento, Abastecimento>;
	id: string;
}

export const removeAbastecimentoController = async (params: RemoveAbastecimentoControllerParams): Promise<ResponseData> => {
	try {
		const { repository, id } = params;
		const abastecimento = await repository.get(id);
		if(!abastecimento){
			return notFound();
		}

		await repository.remove(id);
		return success();
	} catch (error) {
		return serverError(error);
	}
}
