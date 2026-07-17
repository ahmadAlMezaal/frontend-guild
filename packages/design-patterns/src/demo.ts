/**
 * One tiny story that exercises all four patterns.
 * Run it with:  pnpm --filter @repo/design-patterns demo
 */
import { Tavern } from "./singleton/tavern.js";
import { spawnForDungeonLevel } from "./factory/monster-factory.js";
import { CharacterBuilder } from "./builder/character-builder.js";
import { TownCrier } from "./observer/town-crier.js";

console.log("=== BUILDER: assembling the party ===");
const hero = new CharacterBuilder()
  .named("Mildred")
  .ofClass("wizard")
  .wielding("Staff of Mostly Working Code")
  .accompaniedBy("a cat named Segfault")
  .whoSays("It works on my machine!")
  .build();
console.log(`${hero.name} the ${hero.className}, wielding ${hero.weapon},`);
console.log(`accompanied by ${hero.companion}. "${hero.catchphrase}"`);

const bard = new CharacterBuilder().named("Trevor").ofClass("bard").build();
console.log(`${bard.name} the ${bard.className} brought only his ${bard.weapon}.`);

console.log("\n=== OBSERVER: the town crier takes the stage ===");
const crier = new TownCrier();
const unsubscribe = crier.on("dragon-sighted", ({ location }) =>
  console.log(`${hero.name}: "A dragon at ${location}? Fetch my staff!"`),
);
crier.on("dragon-sighted", ({ location }) =>
  console.log(`${bard.name}: "A dragon at ${location}! I shall write a song!"`),
);
crier.on("gold-found", ({ amount }) =>
  console.log(`Tavern keeper: "${amount} gold? First round's NOT on the house."`),
);
crier.announce("dragon-sighted", { location: "the old mill" });

console.log("\n=== FACTORY: the dungeon spawns opposition ===");
for (const level of [1, 5, 9]) {
  const monster = spawnForDungeonLevel(level);
  console.log(
    `Level ${level} spawns a ${monster.kind} (${monster.hp} hp): ${monster.battleCry()}`,
  );
}

console.log("\n=== SINGLETON: everyone drinks at the same tavern ===");
Tavern.instance.earn(50); // Mildred pays her tab
Tavern.instance.earn(2); // Trevor pays what a bard can
const sameTavern = Tavern.instance;
console.log(`Is it the same tavern every time? ${Tavern.instance === sameTavern}`);
console.log(`${sameTavern.name} till holds ${sameTavern.till} gold.`);
crier.announce("gold-found", { amount: sameTavern.till });

console.log("\n=== EPILOGUE ===");
unsubscribe(); // Mildred stops listening — observers can leave freely
crier.announce("dragon-sighted", { location: "the cheese shop" });
console.log("(Mildred, unsubscribed, hears nothing and naps peacefully.)");
