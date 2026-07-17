# @repo/design-patterns

Four classic design patterns implemented as one small RPG story:

| Pattern | File | In the story |
|---|---|---|
| Singleton | `src/singleton/tavern.ts` | There is only one tavern in town |
| Factory | `src/factory/monster-factory.ts` | The dungeon spawns level-appropriate monsters |
| Builder | `src/builder/character-builder.ts` | Character sheets, filled in step by step |
| Observer | `src/observer/town-crier.ts` | The town crier shouts; subscribers react |

Run the story:

```sh
pnpm --filter @repo/design-patterns demo
```

Each source file's header comment explains the pattern, where you meet it in
real code, and its trade-offs. The guided tour (with exercises) is
[`DESIGN-PATTERNS.md`](../../DESIGN-PATTERNS.md) at the repo root.
