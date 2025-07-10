import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { carroValidator } from "@/core/validators";
import { newID } from "@/infra/adapters/newID";
import { unprocessableEntity, conflict, created, serverError } from "@/infra/adapters/response-wrapper";

interface CreateCarroControllerParams {
	input: Omit<Carro, 'id'>;
	repository: Repository<Carro, Carro>
}

export const createCarroController = async (params: CreateCarroControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository } = params;

		const carro: Carro = {
			id: newID(),
			placa: input.placa,
			modelo: input.modelo,
			marca: input.marca,
			usuarioId: input.usuarioId
		}

		const errors = await carroValidator(carro);

		if(errors){
			return unprocessableEntity(errors as object)
		}

		const result = await repository.find!('placa', carro.placa);

		if(result){
			return conflict('Placa já existente!');
		}

		await repository.create(carro);

		return created();

	} catch (error) {
		return serverError(error);
	}
}
