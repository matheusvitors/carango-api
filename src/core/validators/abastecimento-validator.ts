import z from "zod";
import { AbastecimentoDTO } from "@/application/dto";

export const abastecimentoValidator = (abastecimento: AbastecimentoDTO): object | boolean =>  {
	const abastecimentoScheme =z.object({
		id: z.string(),
		kmInicial: z.number(),
		kmFinal: z.number(),
		litros: z.number().gt(0, 'A quantidade de litros deve ser maior que zero'),
		precoCombustivel: z.number().gt(0, 'O preço do combustível deve ser maior que zero'),
		combustivel: z.string(),
		tipoCombustivel: z.string(),
		data: z.date()
	})

	const result = abastecimentoScheme.safeParse(abastecimento).error

	const errors: object = {};
	if(result){
		result.errors.forEach(error => {
			Object.assign(errors, {
				[error.path[0]]: error.message
			})
		})

		return errors;
	}

	return false;
}
