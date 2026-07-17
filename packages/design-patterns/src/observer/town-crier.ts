/**
 * OBSERVER — "the town crier shouts; whoever subscribed, reacts"
 *
 * One-to-many notification without coupling: the publisher (subject) keeps a
 * list of listeners and calls them when something happens. It never knows who
 * they are or what they do — villagers come and go freely.
 *
 * This is the most load-bearing pattern in frontend land: DOM
 * `addEventListener`, RxJS, React's state subscriptions, Node's
 * EventEmitter — all Observer at heart.
 */

export interface TownEvents {
  "dragon-sighted": { location: string };
  "gold-found": { amount: number };
}

type Listener<E> = (event: E) => void;

export class TownCrier {
  // One listener list per event name, filled in lazily.
  #listeners: { [K in keyof TownEvents]?: Set<Listener<TownEvents[K]>> } = {};

  /** Subscribe. Returns an unsubscribe function — a tidy modern idiom. */
  on<K extends keyof TownEvents>(
    name: K,
    listener: Listener<TownEvents[K]>,
  ): () => void {
    // TypeScript cannot correlate a generic key with its mapped value type
    // when writing, so this one localised cast is required.
    const map = this.#listeners as Partial<
      Record<K, Set<Listener<TownEvents[K]>>>
    >;
    const set = (map[name] ??= new Set());
    set.add(listener);
    return () => set.delete(listener);
  }

  announce<K extends keyof TownEvents>(name: K, event: TownEvents[K]): void {
    // The crier has no idea who is listening — that ignorance is the point.
    this.#listeners[name]?.forEach((listener) => listener(event));
  }
}
