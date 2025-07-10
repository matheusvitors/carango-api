import { Repository } from "@/application/interfaces";
import { Carro } from "@/core/models";
import { database } from "@/infra/database/client";

export const carroPrismaRepository: Repository<Carro, Carro> = {
	list: async (): Promise<Carro[]> => {
		try {
			return await database.carro.findMany();
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	get: async (id: string): Promise<Carro | null> => {
		try {
			const data = await database.carro.findUnique({
				where: {id},
			})

			if(!data) {
				return null;
			}

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	find: async (field: keyof Carro, value: any): Promise<Carro | null> => {
		const data = await database.carro.findFirst({ where: {[field]: value}});

		if(!data) {
			return null;
		}

		return data;
	},

	filter: async (params: any): Promise<Carro[] | null> => {
		throw new Error("Function not implemented.");
	},

	create: async (input: Carro): Promise<void> => {
		try {
			const { usuarioId, ...rest } = input;

			await database.carro.create({
				data: {
					...rest,
					usuario: {connect: { id: usuarioId }}
				}
			});

		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	edit: async (input: Carro): Promise<Carro | null> => {
		try {
			const { usuarioId, ...rest } = input;
			const result = await database.carro.update({
				data: {
					...rest,
					usuario: {connect: {id: usuarioId }}
				},
				include: { usuario: true },
				where: {
					id: input.id
				}
			});
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	remove: async (id: string): Promise<void> => {
		try {
			await database.carro.delete({where: {id}})
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	removeAll: async () => {
		try {
			await database.carro.deleteMany({})
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
