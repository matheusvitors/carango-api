export interface AbastecimentoDTO {
	id?: string;
	carroId: string;
	kmInicial: number;
	kmFinal: number;
	litros: number;
	precoCombustivel: number;
	combustivel: string;
	tipoCombustivel?: string | null;
	data: Date;
}

