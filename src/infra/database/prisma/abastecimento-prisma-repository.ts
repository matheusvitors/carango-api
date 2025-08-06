import { AbastecimentoDTO } from "@/application/dto";
import { FilterParams, Repository } from "@/application/interfaces";
import { Abastecimento } from "@/core/models";
import { database } from "@/infra/database/client";
import { transform } from "@/utils/transformers";
import { Prisma } from "@prisma/client";

export const abastecimentoPrismaRepository: Repository<Abastecimento, Abastecimento> = {
	list: async (): Promise<Abastecimento[]> => {
		try {
			const data = await database.abastecimento.findMany();
			const abastecimentos: Abastecimento[] = data.map(abastecimento => transform.toAbastecimento(abastecimento));
			return abastecimentos;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	get: async (id: string): Promise<Abastecimento | null> => {
		try {
			const data = await database.abastecimento.findUnique({
				where: {id},
			})

			if(!data) {
				return null;
			}

			return transform.toAbastecimento(data);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	find: async (field: keyof Abastecimento, value: any): Promise<Abastecimento | null> => {
		const data = await database.abastecimento.findFirst({ where: {[field]: value}});

		if(!data) {
			return null;
		}

		return transform.toAbastecimento(data);
	},

	filter: async (params: FilterParams<AbastecimentoDTO>[]): Promise<Abastecimento[] | null> => {
		const where: Prisma.AbastecimentoWhereInput  = params.reduce(
			(obj, item) => Object.assign(obj, { [item.field]: item.value }), {});

		try {
			const data = await database.abastecimento.findMany({
				where,
				orderBy: [
					{ data: 'desc'},
				]
			});

			const abastecimentos: Abastecimento[] = data.map(abastecimento => {
				return transform.toAbastecimento(abastecimento);
			})

			return abastecimentos;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	create: async (input: Abastecimento): Promise<void> => {
		try {
			const { carroId, ...rest } = input;

			await database.abastecimento.create({
				data: {
					...rest,
					carro: {connect: { id: carroId }}
				}
			});

		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	edit: async (input: Abastecimento): Promise<Abastecimento | null> => {
		try {
			const { carroId, ...rest } = input;
			const result = await database.abastecimento.update({
				data: {
					...rest,
					carro: {connect: { id: carroId }}
				},
				where: {
					id: input.id
				}
			});
			return transform.toAbastecimento(result);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	remove: async (id: string): Promise<void> => {
		try {
			await database.abastecimento.delete({where: {id}})
		} catch (error) {
			console.error(error);
			throw error;
		}
	},

	removeAll: async () => {
		try {
			await database.abastecimento.deleteMany({})
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
