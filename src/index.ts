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

/**
 * Factory Pattern
 * This function returns a class of whatever type we want.
 */

function createDatabase<T extends BaseRecord>(){
	class InMemoryDatabase implements Database<T> {
		private db: Record<string,T> = {}
		get(id: string): T {
			return this.db[id]
		}
		set(newValue: T): void {
			this.db[newValue.id] = newValue;
		}
	}
	/**
	 * Singleton
	 */
	const db = new InMemoryDatabase();

	return db;
}

/**
 * PokemonDB is a pokemon database class
 */
const PokemonDB = createDatabase<Pokemon>();
const pokemonDB = new PokemonDB();

pokemonDB.set({
	id: 'bulbasaur',
	attack: 50,
	defense: 10
})

console.log(pokemonDB.get('bulbasaur'));

