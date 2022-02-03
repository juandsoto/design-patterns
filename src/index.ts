import { loader, RecordHandler } from "./loader";
/**
 * Observer Pattern
 */
type Listener<EventType> = (ev: EventType) => void;

interface Observer<EventType> {
  // this is called closure -> (listener) => () => void
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
}

function createObserver<EventType>(): Observer<EventType> {
  let listeners: Listener<EventType>[] = [];
  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach(listener => listener(event));
    },
  };
}

/**
 * Observer Pattern
 */
interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}
/**
 * Observer Pattern
 */
interface AfterSetEvent<T> {
  value: T;
}

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

  /**
   * Observer Pattern
   */
  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;

  /**
   * Visitor Pattern
   */
  visit(visitor: (item: T) => void): void;
}

/**
 * Factory Pattern
 * This function returns a class of whatever type we want.
 */

function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    /**
     * Singleton Pattern
     * Create a static instance
     * Make constructor private so we cannot create an object outside the class.
     */
    static instance: InMemoryDatabase = new InMemoryDatabase();
    private constructor() {}

    /**
     * Observer Pattern
     */
    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }
    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }
    /**
     * Visitor Pattern
     */

    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    /**
     * Strategy Pattern
     */
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined,
      };

      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.max = score;
          f.item = item;
        }
        return f;
      }, found);

      return found.item;
    }

    get(id: string): T {
      return this.db[id];
    }
    set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue,
      });
    }
  }
  return InMemoryDatabase;
}

const PokemonDB = createDatabase<Pokemon>();

/**
 * Adaptor Pattern
 */
class PokemonDBAdapter implements RecordHandler<Pokemon> {
  addRecord(record: Pokemon): void {
    PokemonDB.instance.set(record);
  }
}

//code runs after adding a new pokemon
const unsubscribe = PokemonDB.instance.onAfterAdd(({ value }) =>
  console.log("new pokemon added: ", value)
);

/**
 * Adaptor Pattern
 */
loader("./data.json", new PokemonDBAdapter());

PokemonDB.instance.set({
  id: "bulbasaur",
  attack: 50,
  defense: 10,
});
//this call removes the listener
unsubscribe();

PokemonDB.instance.set({
  id: "squirtle",
  attack: 40,
  defense: 30,
});
/**
 * Visitor Pattern
 * Just like using foreach
 */
// PokemonDB.instance.visit(item => {
//   console.log(item.id);
// });
/**
 * Strategy Pattern
 */
// const bestDefensive = PokemonDB.instance.selectBest(pokemon => pokemon.defense);
// const bestAttack = PokemonDB.instance.selectBest(pokemon => pokemon.attack);

// console.log(`Best defensive -> ${bestDefensive?.id}`);
// console.log(`Best attack -> ${bestAttack?.id}`);
