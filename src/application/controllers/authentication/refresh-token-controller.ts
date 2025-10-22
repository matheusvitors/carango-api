import { Repository } from "@/application/interfaces"
import { Usuario } from "@/core/models"
import { jwt } from "@/infra/adapters/jwt";
import { serverError } from "@/infra/adapters/response-wrapper";

interface RefreshTokenControllerParams {
	repository: Repository<Usuario, Usuario>;
	token: string;
}

export const refreshTokenController = async (params: RefreshTokenControllerParams) => {
	try {
		const { repository, token } = params;

		//verifica se o token é válido
		const data = jwt.verify(token);

		//extrai o id e verifica se o usuário existe

		//caso o usuário exista gere um novo access-token
	} catch (error) {
		console.error(error);
		return serverError(error)
	}
}
