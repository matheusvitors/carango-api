import { AbastecimentoDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento, Carro } from "@/core/models";
import { abastecimentoValidator } from "@/core/validators";
import { unprocessableEntity, created, serverError, notFound, success } from "@/infra/adapters/response-wrapper";

interface EditAbastecimentoControllerParams {
	id: string;
	input: Omit<AbastecimentoDTO, 'carroId' | 'id'>;
	repository: Repository<Abastecimento, AbastecimentoDTO>;
}

export const editAbastecimentoController = async (params: EditAbastecimentoControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository, id } = params;

		const savedAbastecimento = await repository.get(id);

		if(!savedAbastecimento) {
			return notFound();
		}

		const abastecimento: AbastecimentoDTO = {
			id,
			carroId: savedAbastecimento.carroId,
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

		await repository.edit(abastecimento);
		return success();
	} catch (error) {
		return serverError(error);
	}
}
