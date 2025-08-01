import { Carro } from "@/core/models/carro";
import z from "zod";

export const carroValidator = (carro: Carro): object | boolean =>  {
	const carroScheme =z.object({
		id: z.string(),
		placa: z.string().regex(new RegExp('\^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$'), 'A placa está com o formato incorreto!'),
		modelo: z.string().min(2, 'O modelo é obrigatório'),
		marca: z.string().min(2, 'A marca é obrigatória'),
	})

	const result = carroScheme.safeParse(carro)

	const errors: object = {};
	if(result.error){
		result.error.issues.forEach(error => {
			Object.assign(errors, {
				[error.path[0]]: error.message
			})
		})
		return errors;
	}

	return false;
}
