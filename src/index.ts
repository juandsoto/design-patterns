interface Pokemon {
	id: string;
	attack: number;
	defense: number;
}

interface BaseRecord {
	id: string;
}

interface Database<T extends BaseRecord> {
	get(id: string): T | undefined;
	set(newValue: T): void;
}

class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
	private db: Record<string,T> = {}
	get(id: string): T {
		return this.db[id]
	}
	set(newValue: T): void {
		this.db[newValue.id] = newValue;
	}
}

const pokemonDB = new InMemoryDatabase<Pokemon>();

pokemonDB.set({
	id: 'bulbasaur',
	attack: 50,
	defense: 10
})

console.log(pokemonDB.get('bulbasaur'));