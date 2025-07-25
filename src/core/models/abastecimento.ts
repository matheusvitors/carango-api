export interface Abastecimento {
	id: string;
	carroId: string;
	kmInicial: number;
	kmFinal: number;
	litros: number;
	precoCombustivel: number;
	combustivel: Combustivel;
	tipoCombustivel?: TipoCombustivel;
	data: Date;
}

export const combustiveis = ['gasolina', 'alcool'] as const;
export type Combustivel = typeof combustiveis[number];

export const tipoCombustivel = ['comum', 'aditivada'] as const;
export type TipoCombustivel = typeof tipoCombustivel[number];
