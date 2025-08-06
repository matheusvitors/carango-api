import RandExp from "randexp"

export const placaGenerator = (): string => {
	return new RandExp('\^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$').gen().toUpperCase();
}
