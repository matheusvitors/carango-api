import { AbastecimentoDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento, Carro } from "@/core/models";
import { abastecimentoValidator } from "@/core/validators";
import { unprocessableEntity, created, serverError, notFound } from "@/infra/adapters/response-wrapper";

interface EditAbastecimentoControllerParams {
	input: AbastecimentoDTO;
	repository: Repository<Abastecimento, AbastecimentoDTO>;
}

export const editAbastecimentoController = async (params: EditAbastecimentoControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository } = params;

		const abastecimento: AbastecimentoDTO = {
			id: input.id,
			carroId: input.carroId,
			kmInicial: input.kmInicial,
			kmFinal: input.kmFinal,
			litros: input.litros,
			precoCombustivel: input.precoCombustivel,
			combustivel: input.combustivel,
			tipoCombustivel: input.tipoCombustivel,
			data: input.data,
		}

		const errors = abastecimentoValidator(abastecimento);

		if(errors){
			return unprocessableEntity(errors as object);
		}

		await repository.create(abastecimento);
		return created();
	} catch (error) {
		return serverError(error);
	}
}
