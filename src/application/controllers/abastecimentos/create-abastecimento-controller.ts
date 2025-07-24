import { AbastecimentoDTO } from "@/application/dto";
import { Repository, ResponseData } from "@/application/interfaces";
import { Abastecimento, Carro } from "@/core/models";
import { abastecimentoValidator } from "@/core/validators";
import { newID } from "@/infra/adapters/newID";
import { unprocessableEntity, conflict, created, serverError } from "@/infra/adapters/response-wrapper";

interface CreateAbastecimentoControllerParams {
	input: AbastecimentoDTO;
	repository: Repository<Abastecimento, AbastecimentoDTO>;
	carroRepository: Repository<Carro, Carro>;
}

export const createAbastecimentoController = async (params: CreateAbastecimentoControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository, carroRepository } = params;

		const abastecimento: AbastecimentoDTO = {
			id: newID(),
			carroId: input.carroId,
			kmInicial: input.kmInicial,
			kmFinal: input.kmFinal,
			litros: input.litros,
			precoCombustivel: input.precoCombustivel,
			combustivel: input.combustivel,
			tipoCombustivel: input.tipoCombustivel,
			data: input.data,
		}

		const result = await carroRepository.get(input.carroId);

		if(!result){
			return conflict('Carro não encontrado!');
		}

		const errors = abastecimentoValidator(abastecimento);

		if(errors){
			return unprocessableEntity(errors as object)
		}

		await repository.create(abastecimento);

		return created();

	} catch (error) {
		return serverError(error);
	}
}
