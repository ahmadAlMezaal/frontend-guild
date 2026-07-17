/**
 * SINGLETON — "there is only one tavern in town"
 *
 * Guarantees a class has exactly one instance and provides a global point of
 * access to it. Useful for genuinely-one-of-a-kind things: a config store, a
 * connection pool, a logger.
 *
 * The recipe has three ingredients:
 *   1. a private constructor, so nobody outside can call `new Tavern()`
 *   2. a private static field holding the one instance
 *   3. a static accessor that creates it on first use and reuses it forever
 *
 * A word of caution before you reach for it: a singleton is global state in a
 * trench coat. It makes testing harder (state leaks between tests) and hides
 * dependencies. Modern codebases often prefer plain module-level instances or
 * dependency injection — but you will meet this pattern everywhere, so it is
 * worth knowing cold.
 */
export class Tavern {
  static #instance: Tavern | undefined;

  #gold = 0;
  readonly name = "The Recursive Dragon";

  private constructor() {
    // Private: the only way in is through `Tavern.instance`.
  }

  static get instance(): Tavern {
    // Lazy initialisation: the tavern is built the first time anyone asks.
    Tavern.#instance ??= new Tavern();
    return Tavern.#instance;
  }

  earn(gold: number): void {
    this.#gold += gold;
  }

  get till(): number {
    return this.#gold;
  }
}
