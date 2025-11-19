import { afterAll } from "vitest";
import { abastecimentoPrismaRepository, carroPrismaRepository, usuarioPrismaRepository } from "@/infra/database/prisma";
import { TEST_TYPE } from "@/infra/config/environment";
import { database } from "@/infra/database/client";

export const abastecimentoRepository = abastecimentoPrismaRepository;
export const carroRepository = carroPrismaRepository;
export const usuarioRepository = usuarioPrismaRepository;

if(TEST_TYPE === 'e2e') {

	afterAll(async () => {
		await database.$disconnect()
	})
}
