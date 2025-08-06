import { AbastecimentoDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento } from "@/core/models";
import { serverError, success } from "@/infra/adapters/response-wrapper";

interface ListAbastecimentosControllerParams {
	repository: Repository<Abastecimento, AbastecimentoDTO>;
	carroId: string;
}

export const listAbastecimentosController = async (params: ListAbastecimentosControllerParams): Promise<ResponseData> => {
	try {
		const { repository, carroId } = params;
		const abastecimentos = await repository.filter!([{carroId}]);
		return success(abastecimentos);
	} catch (error) {
		return serverError(error);
	}
}
