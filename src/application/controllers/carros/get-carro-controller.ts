import { Repository, ResponseData } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { notFound, serverError, success } from "@/infra/adapters/response-wrapper";

interface GetCarroControllerParams {
	repository: Repository<Carro, Carro>;
	usuarioId: string;
	id: string;
}

export const getCarroController = async (params: GetCarroControllerParams): Promise<ResponseData> => {
	try {
		const { repository, id, usuarioId } = params;
		const carro = await repository.get(id);

		if(!carro || carro?.usuarioId !== usuarioId){
			return notFound();
		}

		return success(carro);
	} catch (error) {
		return serverError(error);
	}
}
