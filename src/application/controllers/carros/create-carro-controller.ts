import { ValidationError } from "@/application/errors";
import { Repository, ResponseData } from "@/application/interfaces";
import { serverError, unprocessableEntity } from "@/application/response-wrapper";
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
		console.log('ERROR',validationResult.error?.errors);

		if(validationResult.error){
			const errors = [];
			validationResult.error.errors.forEach(error => {
				errors.push({
					[error.path[0]]: error.message
				})
			})

			return unprocessableEntity()
		}


		return serverError(null);
	} catch (error) {
		return serverError(error);
	}
}
