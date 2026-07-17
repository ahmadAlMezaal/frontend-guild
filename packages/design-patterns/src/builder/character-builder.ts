/**
 * BUILDER — "a character sheet is filled in step by step, then laminated"
 *
 * When an object has many optional parts, a constructor turns into
 * `new Character("Mildred", "wizard", undefined, true, null, 7)` — the famous
 * telescoping-constructor problem, where every call site is a quiz about
 * argument order. A builder replaces that with named, chainable steps, and a
 * final `build()` that validates and returns an immutable result.
 *
 * You already use this pattern daily without noticing: URLSearchParams,
 * query builders like Knex, test-data builders, fluent config APIs.
 */

export interface Character {
  readonly name: string;
  readonly className: "warrior" | "wizard" | "bard";
  readonly weapon: string;
  readonly companion?: string;
  readonly catchphrase?: string;
}

export class CharacterBuilder {
  #name?: string;
  #className?: Character["className"];
  #weapon = "sturdy stick"; // sensible default — builders shine at these
  #companion?: string;
  #catchphrase?: string;

  named(name: string): this {
    this.#name = name;
    return this; // returning `this` is what makes the chain work
  }

  ofClass(className: Character["className"]): this {
    this.#className = className;
    return this;
  }

  wielding(weapon: string): this {
    this.#weapon = weapon;
    return this;
  }

  accompaniedBy(companion: string): this {
    this.#companion = companion;
    return this;
  }

  whoSays(catchphrase: string): this {
    this.#catchphrase = catchphrase;
    return this;
  }

  /** Validation happens once, here — not scattered across call sites. */
  build(): Character {
    if (!this.#name) throw new Error("Every hero needs a name.");
    if (!this.#className) throw new Error(`${this.#name} needs a class.`);

    return Object.freeze({
      name: this.#name,
      className: this.#className,
      weapon: this.#weapon,
      companion: this.#companion,
      catchphrase: this.#catchphrase,
    });
  }
}
