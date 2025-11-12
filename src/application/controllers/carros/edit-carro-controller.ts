import { Repository, ResponseData } from "@/application/interfaces"
import { Carro } from "@/core/models"
import { carroValidator } from "@/core/validators";
import { conflict, notFound, serverError, success, unprocessableEntity } from "@/infra/adapters/response-wrapper";

interface EditCarroControllerParams {
	repository: Repository<Carro, Carro>;
	input: Carro;
}

export const editCarroController = async (params: EditCarroControllerParams): Promise<ResponseData> => {
	try {
		const { input, repository } = params;

		const errors = carroValidator(input);

		if(errors){
			return unprocessableEntity(errors as object);
		}

		const savedCarro = await repository.get(input.id);
		console.log({savedCarro}, {input});

		if((input.usuarioId !== savedCarro?.usuarioId) || !savedCarro) {
			return notFound();
		}

		const result = await repository.find!('placa', input.placa);

		if(result && result.id !== input.id){
			return conflict('Placa já existente!');
		}

		await repository.edit(input);

		return success();
	} catch (error) {
		return serverError(error);
	}
}
