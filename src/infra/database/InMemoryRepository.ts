import { FilterParams, Repository } from "@/application/interfaces";

interface Entity {
	id: string | number;
}

export class InMemoryRepository<T extends Entity, DTO extends Entity> implements Repository<T, DTO> {
	public data: T[] = [];

	constructor(data?: T[]) {
		if (data) {
			this.data = data;
		}
	}

	async list(): Promise<T[]> {
		return this.data;
	}

	async get(id: string): Promise<T | null> {
		return this.data.find((entity) => entity.id === id) || null;
	}

	async find(field: keyof T, value: any): Promise<T | null> {
		return this.data.find((entity) => entity[field] === value) || null;
	}

	async filter(params: FilterParams<T>[]): Promise<T[] | null> {
		const result = this.data.filter((objeto) => {
			return params.every((condicao) => {
				const fieldValue = condicao.field
					.toString()
					.split(".")
					.reduce((value: any, key) => (value ? value[key] : undefined), objeto);

				// Verifica se o value é uma string e faz a filtragem por igualdade
				if (typeof condicao.value !== "object") {
					return fieldValue === condicao.value;
				}

				// Verifica se o value é um objeto com lte e gte para filtragem de intervalo de datas
				if (condicao.value && typeof condicao.value === "object" && "lte" in condicao.value && "gte" in condicao.value) {
					const fieldDate = new Date(fieldValue);
					return fieldDate >= new Date(condicao.value.gte) && fieldDate <= new Date(condicao.value.lte);
				}

				return false;
			});
		});

		return result.length > 0 ? result : null;
	}

	async create(entity: any): Promise<void> {
		this.data.push(entity);
	}

	async edit(entity: any): Promise<T | null> {
		const index = this.data.findIndex((e) => e.id === entity.id);
		if (index !== -1) {
			this.data[index] = entity;
			return entity;
		}
		return null;
	}

	async editField(id: string, field: keyof T, value: any): Promise<T | null> {
		const index = this.data.findIndex((e) => e.id === id);
		if (index !== -1) {
			this.data[index][field] = value;
			return this.data[index];
		}
		return null;
	}

	async remove(id: string): Promise<void> {
		const index = this.data.findIndex((e) => e.id === id);
		if (index !== -1) {
			this.data.splice(index, 1);
		}
	}

	async removeAll(): Promise<void> {
		this.data = []
	}
}
