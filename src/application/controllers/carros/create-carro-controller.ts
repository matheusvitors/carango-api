import { Repository, ResponseData } from "@/application/interfaces";
import { conflict, created, serverError, unprocessableEntity } from "@/application/response-wrapper";
import { Carro } from "@/core/models";
import { carroValidator } from "@/core/validators";
import { newID } from "@/infra/adapters/newID";

interface CreateCarroControllerParams {
	input: Omit<Carro, 'id'>;
	repository: Repository<Carro>
}

export const createCarroController = async (params: CreateCarroControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository } = params;

		const carro: Carro = {
			id: newID(),
			placa: input.placa,
			modelo: input.modelo,
			marca: input.marca
		}

		const validationResult = await carroValidator(carro);

		if(validationResult.error){
			const errors: object = {};
			validationResult.error.errors.forEach(error => {
				Object.assign(errors, {
					[error.path[0]]: error.message
				})
			})

			return unprocessableEntity(errors)
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
