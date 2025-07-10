import { Repository } from "@/application/interfaces";
import { Usuario } from "@/core/models";
import { database } from "@/infra/database/client";

export const usuarioPrismaRepository: Repository<Usuario, Usuario> = {
	list: async (): Promise<Usuario[]> => {
		return await database.usuario.findMany();
	},
	get: async (id: string): Promise<Usuario | null> => {
		return await database.usuario.findUnique({ where: {id}});
	},
	find: async (field: keyof Usuario, value: any): Promise<Usuario | null> => {
		//TODO: fazer do jeito certo o find do user
		return await database.usuario.findUnique({where: {username: value}});
	},
	filter: async (params: any): Promise<Usuario[] | null> => {
		throw new Error("Function not implemented.");
	},
	create: async (data: Usuario): Promise<void> => {
		await database.usuario.create({ data })
	},
	edit: async (data: any): Promise<Usuario | null> => {
		throw new Error("Function not implemented.");
	},
	remove: async (id: string): Promise<void> => {
		await database.usuario.delete({ where: {id} })
	},
	removeAll: async (): Promise<void> => {
		await database.usuario.deleteMany({})
	}
}
