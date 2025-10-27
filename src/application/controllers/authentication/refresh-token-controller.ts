import { Repository } from "@/application/interfaces"
import { Usuario } from "@/core/models"
import { jwt } from "@/infra/adapters/jwt";
import { iAmTeaPot, serverError, success, unauthorized } from "@/infra/adapters/response-wrapper";

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
		const usuario = await repository.get(data.id);

		if(!usuario) {
			return unauthorized();
		}

		const access_token = jwt.encode({payload: { id: usuario.id }, expiration: '7d'});

		//caso o usuário exista gere um novo access-token
		return success({ access_token });
	} catch (error: any) {
		if(error.name === 'TokenExpiredError' ||
			error.name === 'JsonWebTokenError' ||
			error.name === 'NotBeforeError') {
			return unauthorized();
		}

		return serverError(error);
	}
}
