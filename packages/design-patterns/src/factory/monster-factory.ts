/**
 * FACTORY — "the dungeon spawns monsters; you don't ask which `new` it called"
 *
 * A factory centralises object creation behind one function. Callers say
 * *what* they want (or describe the situation), not *how* to construct it.
 *
 * Why bother?
 *   - Callers depend on the `Monster` interface, never on concrete classes —
 *     adding a new monster touches one file, not every call site.
 *   - Creation logic (which monster suits which dungeon level, stat scaling)
 *     lives in one place instead of being copy-pasted around.
 */

export interface Monster {
  readonly kind: string;
  readonly hp: number;
  battleCry(): string;
}

class Slime implements Monster {
  readonly kind = "Slime";
  readonly hp = 10;
  battleCry(): string {
    return "*wet squelching noises*";
  }
}

class Goblin implements Monster {
  readonly kind = "Goblin";
  readonly hp = 30;
  battleCry(): string {
    return "Yoink! Shiny things are MY things!";
  }
}

class Dragon implements Monster {
  readonly kind = "Dragon";
  readonly hp = 300;
  battleCry(): string {
    return "I hoard gold AND unresolved promises.";
  }
}

export type MonsterKind = "slime" | "goblin" | "dragon";

/** Simple factory: name what you want, receive a Monster. */
export function createMonster(kind: MonsterKind): Monster {
  switch (kind) {
    case "slime":
      return new Slime();
    case "goblin":
      return new Goblin();
    case "dragon":
      return new Dragon();
    default: {
      // Exhaustiveness check: adding a MonsterKind without a case here
      // becomes a compile error rather than a runtime surprise.
      const unreachable: never = kind;
      throw new Error(`Unknown monster kind: ${String(unreachable)}`);
    }
  }
}

/**
 * The factory really earns its keep when creation involves *decisions*.
 * Callers describe the situation; the factory picks the concrete class.
 */
export function spawnForDungeonLevel(level: number): Monster {
  if (level < 3) return createMonster("slime");
  if (level < 8) return createMonster("goblin");
  return createMonster("dragon");
}
