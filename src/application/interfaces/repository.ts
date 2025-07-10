export interface Repository<T,DTO> {
	list(): Promise<T[]>;
	get(id: string): Promise<T | null>;
	find?(field: any, value: any): Promise<T | null>
	filter?(params: any[]): Promise<T[] | null>
	create(data: DTO): Promise<void>;
	edit(data: DTO): Promise<T | null>;
	remove(id: string): Promise<void>;
	removeAll(): Promise<void>
}

