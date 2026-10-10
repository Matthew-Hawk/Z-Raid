# Z-Raid

An original 8-bit zombie survival game. Pick a character, raid the ruins, choose your gear, and try to return alive. Recover three cure fragments to save the world. One life per run.

## Play locally

Open `index.html` directly in a modern browser. No installation, build, backend or database is needed. For a local HTTP preview, run `python -m http.server 8080` in this folder and visit http://localhost:8080.

Use mouse, touch, or Tab and Enter/Space. Start Game → choose one of three survivors → choose a location, weapon and gear → Begin Raid. Every encounter offers explicit Yes and No actions and odds. Continue after each result. Five encounters survived earn one fragment; three successful raids trigger victory. Your character stays fixed, while route and equipment can change at camp.

## Rules and balance

- Combat handles fighting and force; stealth handles concealment and navigation; scavenging handles searching and repairs.
- Check odds = base + character stat × 5 + equipment bonus × 5 + min(3, supplies) − location hazard − completed raids × 9, clamped to 10–90%. A uniform random roll below those odds succeeds.
- Each location has 10 encounters. Fisher–Yates shuffle draws 5 without replacement per raid. Both responses use independent checks and rewards. No is never a guaranteed safe escape.
- Failure costs the shown damage, plus 4 per completed raid, less vest armor. Successful checks award supplies and sometimes healing. Medical kits add healing; field packs add supplies. All health changes are capped. Zero health causes immediate death.
- Camp restores 12 + 2 × min(10, supplies) health, capped at character maximum, and consumes all supplies. Supplies also add up to 3 percentage points of morale during the raid.
- Every success upgrades the existing four weapons and four gear items by +1 in their specialty. Vest armor and kit healing also gain +1. No new item types are added. Difficulty still rises; upgrades are most useful for specialized checks.
- Death clears fragments, upgrade tier and supplies immediately. New Run recreates the whole run state, including selections, health and encounter progress. Reloading also starts fresh; there is no saved run.
- The odds do not guarantee survival. A plausible strategy is to pair complementary equipment, consider both failure damage and odds, and collect supplies for camp recovery.

## Static hosting / Cloudflare Pages

Upload `index.html`, `styles.css`, `content.js`, `engine.js`, `game.js`, and `assets/` together. On Cloudflare Pages select framework **None**, leave build command empty, and set output directory to the repository root (`.`). No secrets, server functions or dependencies are needed. All file references are relative, so subdirectory hosting works too. Google Fonts is optional; built-in monospace fallbacks keep the game readable offline.

## Project structure

- `index.html`: semantic application shell and accessible field-manual dialog.
- `styles.css`: responsive retro interface, typography and optional CRT scanlines.
- `content.js`: three characters, three locations, eight equipment items and 30 encounters.
- `engine.js`: centralized probability, health, upgrades, shuffled encounter selection and guarded state transitions.
- `game.js`: screens, interaction, inline original pixel SVG portraits, location scenes, weapons, gear, zombies, fragments and ending artwork.
- `assets/title.png`: generated pixel-art ruined-city backdrop, created with the built-in image tool. Prompt: “Original cohesive 8-bit scene: ruined city street at night, abandoned pharmacy on left, barricaded military checkpoint in distance, toxic green lights, three small survivors seen from behind facing a shadowy zombie horde. Crisp chunky pixel clusters, limited charcoal navy, muted teal, acidic lime, amber palette. Wide cinematic composition, no text, logos or watermark.”
- `verify.cjs`: dependency-free rule verification and seeded balance simulation. Run `node verify.cjs`.

## Verification results

All 144 character/location/weapon/gear combinations passed rule checks, including probability bounds, unique draws, upgrades, fragments only on living raid completion, rising difficulty, immediate death, reset, third-raid victory, and duplicate-action guards. A seeded 16,800-run simulation with informed decisions and rotating locations won about 76% overall (54–93% across loadouts). The initial 97% result prompted an increase in failure damage. This is an initial balance estimate, not a substitute for player feedback.

Headless Edge verified the actual desktop and 390px mobile interface: loadout changes, all 15 encounter transitions, victory, death, fresh run, dialog and keyboard controls, no horizontal overflow and no JavaScript errors. Preview screenshots are in `assets/preview-*.png`. `browser-check.cjs` is the development browser check and uses this workstation's bundled Playwright; for another machine, replace its require path with an installed Playwright package. The game itself has no package dependency.

No placeholder artwork. All catalog and ending icons are original SVG pixel drawings, and all art is bundled or inline. CRT is off by default and disabled under reduced motion. This first version has no audio, persistent save or multiplayer.
