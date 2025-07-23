import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento } from "@/core/models";
import { notFound, serverError, success } from "@/infra/adapters/response-wrapper";

interface GetAbastecimentoControllerParams {
	repository: Repository<Abastecimento, Abastecimento>;
	id: string;
}

export const getAbastecimentoController = async (params: GetAbastecimentoControllerParams): Promise<ResponseData> => {
	try {
		const { repository, id } = params;
		const abastecimento = await repository.get(id);
		if(!abastecimento){
			return notFound();
		}

		return success(abastecimento);
	} catch (error) {
		return serverError(error);
	}
}
