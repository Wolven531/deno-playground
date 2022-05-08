export interface INameService {
	getName: () => string;
	name: string;
	setName: (newName: string) => void;
}
