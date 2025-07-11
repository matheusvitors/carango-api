import { AbastecimentoDTO } from "@/application/dto";
import { Abastecimento } from "@/core/models";

export const toAbastecimento = (input: AbastecimentoDTO): Abastecimento => {
	return {
		id: input.id,
		carroId: input.carroId,
		kmInicial: input.kmInicial,
		kmFinal: input.kmFinal,
		litros: input.litros,
		precoCombustivel: input.precoCombustivel,
		combustivel: input.combustivel === 'gasolina' ? 'gasolina' : 'alcool',
		tipoCombustivel: input.tipoCombustivel === 'comum' ? 'comum' : 'aditivada'
	}
}
