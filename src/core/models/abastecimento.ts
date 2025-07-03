export interface Abastecimento {
	id: string;
	carroId: string;
	kmInicial: number;
	kmFinal?: number;
	litros?: number;
	precoCombustivel: number;
	combustivel: Combustivel;
	tipoCombustivel: TipoCombustivel;
}

export type Combustivel = 'gasolina' | 'alcool';
export type TipoCombustivel = 'comum' | 'aditivada';
