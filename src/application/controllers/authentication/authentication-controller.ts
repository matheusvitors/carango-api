import { Repository, ResponseData } from "@/application/interfaces";
import { Usuario } from "@/core/models";
import { verifyHash } from "@/infra/adapters/encryption";
import { jwt } from "@/infra/adapters/jwt";
import { notFound, serverError, success, unauthorized } from "@/infra/adapters/response-wrapper";

interface AuthenticationControllerParams {
	repository: Repository<Usuario, Usuario>;
	username: string;
	password: string;
}

export const authenticationController = async (params: AuthenticationControllerParams): Promise<ResponseData> => {

	try {

		const { repository, username, password } = params;
		const usuario = await repository.find!('username', username);

		if(!usuario) {
			return notFound('Usuário não encontrado.');
		}

		const isCorrectPassword = await verifyHash(password, usuario.password);

		if(!isCorrectPassword) {
			return unauthorized('Senha incorreta.')
		}

		const token = jwt.encode({payload: {auth: true, id: usuario.id}});
		const refreshToken = jwt.encode({payload: {id: usuario.id}, expiration: '7d'});
		return success({token, refreshToken});
	} catch (error) {
		console.error(error);
		return serverError(error)
	}

}
