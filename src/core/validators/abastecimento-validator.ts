import z from "zod";
import { AbastecimentoDTO } from "@/application/dto";
import { combustiveis, Combustivel, TipoCombustivel, tipoCombustivel } from "@/core/models";

export const abastecimentoValidator = (abastecimento: AbastecimentoDTO): object | boolean =>  {
	const abastecimentoScheme = z.object({
		id: z.string(),
		kmInicial: z.number(),
		kmFinal: z.number(),
		litros: z.number().gt(0, 'A quantidade de litros deve ser maior que zero'),
		precoCombustivel: z.number().gt(0, 'O preço do combustível deve ser maior que zero'),
		combustivel: z.string(),
		tipoCombustivel: z.string().nullable(),
		data: z.date("Data inválida")
	})

	const result = abastecimentoScheme.safeParse(abastecimento)

	const errors: object = {};
	if(result.error){
		result.error.issues.forEach(error => {
			Object.assign(errors, {
				[error.path[0]]: error.message
			})
		})
	}

	if(abastecimento.kmFinal < abastecimento.kmInicial){
		Object.assign(errors, {combustivel: 'O km final é menor que o km inicial'})
	}

	if(!combustiveis.includes(abastecimento.combustivel as Combustivel)){
		Object.assign(errors, {combustivel: 'O combustível é inválido'})
	}

	if(!tipoCombustivel.includes(abastecimento.tipoCombustivel as TipoCombustivel)){
		Object.assign(errors, {tipoCombustivel: 'O tipo do combustível é inválido'})
	}

	if(Object.keys(errors).length > 0) {
		return errors;
	}

	return false;
}
