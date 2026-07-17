# A guided tour of the design patterns package

Part three of this repo's learning journey (after `LEARNING.md` and
`MICROFRONTENDS.md`). The code lives in `packages/design-patterns` — four
classic patterns told as one small RPG story. Run it:

```sh
pnpm --filter @repo/design-patterns demo
```

Design patterns are **named, reusable solutions to recurring design
problems** — vocabulary as much as technique. Saying "make it a builder"
transmits a whole design in three words. The classics come from the 1994
"Gang of Four" book, which grouped them into *creational* (how objects get
made), *structural* (how objects compose), and *behavioural* (how objects
talk). We implement three creational ones and the most important behavioural
one:

| Pattern | File | One-liner |
|---|---|---|
| Singleton | `src/singleton/tavern.ts` | Exactly one instance, globally reachable |
| Factory | `src/factory/monster-factory.ts` | Callers ask *what*, not *how* to construct |
| Builder | `src/builder/character-builder.ts` | Assemble complex objects step by step |
| Observer | `src/observer/town-crier.ts` | Publish events; subscribers react, decoupled |

## Singleton — the tavern

Private constructor + static instance + lazy accessor. `Tavern.instance` is
the same object no matter where you ask from — the demo proves it with `===`
and a shared till. **Real-world sightings:** config stores, connection pools,
loggers. **Health warning (in the source too):** it is global state in a
trench coat; it couples code to a concrete class and makes tests leak into
each other. Know it, use it sparingly — plain module exports or dependency
injection are the modern defaults.

## Factory — the dungeon spawner

Callers hold a `Monster` interface and never see `new Goblin()`. Two flavours
shown: `createMonster(kind)` (name what you want) and
`spawnForDungeonLevel(level)` (describe the situation, let the factory
decide). Note the `never` trick in the `switch` — adding a monster kind
without handling it becomes a *compile* error. **Real-world sightings:**
`Array.from`, ORM `repository.create()`, UI component factories, anything
called `create*`.

## Builder — the character sheet

Solves the telescoping-constructor problem: instead of
`new Character("Mildred", "wizard", undefined, true, null)`, you chain named
steps and finish with `build()`, which validates once and returns a frozen
object. Each step `return this` — that's the whole fluent-chain mechanism.
**Real-world sightings:** `URLSearchParams`, query builders (Knex, Prisma's
fluent API), test-data builders.

## Observer — the town crier

`crier.on("dragon-sighted", fn)` subscribes; `announce()` notifies everyone;
the returned function unsubscribes (watch Mildred nap through the epilogue).
The publisher never knows who is listening — that ignorance is the whole
point. **Real-world sightings:** this is frontend's load-bearing pattern —
`addEventListener`, Node's `EventEmitter`, RxJS, React state subscriptions.
The typed `TownEvents` map is a bonus lesson: event name and payload type are
checked together, and it forced a genuinely instructive TypeScript cast
(explained in the source).

## Things to try

1. Add a `"troll"` to `MonsterKind` but *not* to the `switch` — enjoy the
   compile error, then fix it.
2. Give `CharacterBuilder` a `.withSpell()` step that only compiles for
   wizards (hint: split the builder into per-class types).
3. Add a `"quest-completed"` event to `TownEvents` and have the tavern
   subscribe to collect celebration gold.
4. Refactor `Tavern` from a singleton class to a plain exported instance
   (`export const tavern = new Tavern()`) and consider what was gained and
   lost — modules are singletons already.

## The fourth wall

This package is also monorepo practice: it appeared by creating a folder with
a `package.json` — `pnpm-workspace.yaml` picked it up, Turborepo added its
`lint`/`check-types` scripts to the task graph, and nothing else needed
configuring.
