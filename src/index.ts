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

		/**
		 * Singleton Pattern
		 * Create a static instance
		 * Make constructor private so we cannot create an object outside the class.
		 */
		static instance: InMemoryDatabase = new InMemoryDatabase();

		private constructor(){}
		
		get(id: string): T {
			return this.db[id]
		}
		set(newValue: T): void {
			this.db[newValue.id] = newValue;
		}
	}
	return InMemoryDatabase;
}

const PokemonDB = createDatabase<Pokemon>();

//Cannot do this -> const pokemonDB = new PokemonDB();

PokemonDB.instance.set({
	id: 'bulbasaur',
	attack: 50,
	defense: 10
})

console.log(PokemonDB.instance.get('bulbasaur'));

