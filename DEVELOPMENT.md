# Z-Raid

An original 8-bit zombie survival game. Pick a character, raid the ruins, choose your gear, and try to return alive. Recover three cure fragments to save the world. One life per run.

## Play locally

Open `index.html` directly in a modern browser. No installation, build, backend or database is needed. For a local HTTP preview, run `python -m http.server 8080` in this folder and visit http://localhost:8080.

Use mouse, touch, or Tab and Enter/Space. Start Game → choose one of three survivors → choose a location, weapon and gear → Begin Raid. Every encounter offers explicit Yes and No actions. Check stats, odds and random rolls are hidden from players; probability calculations still run behind the scenes. Continue after each result. Five encounters survived earn one fragment; three successful raids trigger victory. Your character stays fixed, while route and equipment can change at camp.

## Rules and balance

- Combat handles fighting and force; stealth handles concealment and navigation; scavenging handles searching and repairs.
- Internal check odds = base + character stat × 4 + equipment bonus × 5 + min(2, supplies) − location hazard − completed raids × 10 − pursuit × 2 − encounter index, clamped to 10–85%. A uniform random roll below those odds succeeds. Check odds and rolls are hidden from players.
- Each location has 10 encounters. Fisher–Yates shuffle draws 5 without replacement per raid. Both responses use independent checks and rewards. No is never a guaranteed safe escape.
- Every route has an authored pursuit consequence, from −2 to +4. This applies on success as well as failure; a failed check adds one extra pursuit. Pursuit stays between 0 and 8. Loud and quiet actions appear under both Yes and No, so neither answer is always the quiet route. Players see route hints, the pursuit tracker and the result. Later decisions inherit the consequences of earlier ones.
- Failure costs the displayed damage: encounter base + 5 per completed raid + floor(pursuit / 2) − vest armor (including upgrades). Successful checks award supplies and sometimes healing. Medical kits add healing; field packs add supplies. All health changes are capped. Zero health causes immediate death.
- Camp restores 8 + 2 × min(6, supplies) health (maximum 20), capped at character maximum, consumes all supplies and clears pursuit. Supplies add up to 2 percentage points of morale during the raid. Pursuit also starts at zero each raid.
- Every success upgrades the existing four weapons and four gear items by +1 in their specialty. Vest armor and kit healing also gain +1. No new item types are added. Difficulty still rises; upgrades are most useful for specialized checks.
- Death clears fragments, upgrade tier and supplies immediately. New Run recreates the whole run state, including selections, health and encounter progress. Reloading also starts fresh; there is no saved run.
- No strategy guarantees survival. Pair complementary equipment, consider the action and its failure damage, and balance supply collection against attracting the horde. Even a successful loud route can make subsequent encounters harder.

## Static hosting / Cloudflare Pages

Upload `index.html`, `styles.css`, `content.js`, `engine.js`, `game.js`, and `assets/` together. On Cloudflare Pages select framework **None**, leave build command empty, and set output directory to the repository root (`.`). No secrets, server functions or dependencies are needed. All file references are relative, so subdirectory hosting works too. Google Fonts is optional; built-in monospace fallbacks keep the game readable offline.

## Project structure

- `index.html`: semantic application shell and accessible field-manual dialog.
- `styles.css`: responsive retro interface, typography and optional CRT scanlines.
- `content.js`: three characters, three locations, eight equipment items and 30 encounters.
- `engine.js`: centralized probability, health, upgrades, shuffled encounter selection and guarded state transitions.
- `game.js`: screens, interaction, inline original pixel SVG portraits, location scenes, weapons, gear, zombies, fragments and ending artwork.
- `assets/title.png`: generated pixel-art ruined-city backdrop, created with the built-in image tool. Prompt: “Original cohesive 8-bit scene: ruined city street at night, abandoned pharmacy on left, barricaded military checkpoint in distance, toxic green lights, three small survivors seen from behind facing a shadowy zombie horde. Crisp chunky pixel clusters, limited charcoal navy, muted teal, acidic lime, amber palette. Wide cinematic composition, no text, logos or watermark.”
- `assets/title-loop.gif`: 48-frame, six-second infinite loop of the title art with animated ground fog, rain/ash and slowly pulsing lights (960 × 384, about 1.9 MB). `tools/animate_hero.py` reproduces it with Pillow. No runtime dependency is required.
- The title menu also has gentle ambient glow, signal breathing, and hover/focus movement. The header's Motion toggle persists your preference locally. Turning it off or enabling reduced motion loads the original still PNG and disables these animations. CRT remains a separate setting.
- `motion-check.cjs`: development browser verification for animation, hover, motion controls and mobile layout.
- `verify.cjs`: dependency-free rule verification. Run `node verify.cjs`.
- `balance.cjs`: compare fixed Yes, fixed No, random and informed choices across all 48 loadouts and rotating locations. Run `node balance.cjs 600` for 115,200 seeded runs. The informed policy sees internal odds and estimates immediate health, rewards and future pursuit cost; it is an idealized benchmark, not a prediction of human win rates.
- A fixed ambient layer adds drifting pixel motes, slow teal/green fog and a faint quarantine grid behind every screen. It does not use gameplay RNG, intercept input, or depend on CRT. Motion OFF and reduced motion disable its animations.

## Verification results

All 144 character/location/weapon/gear combinations passed rule checks, including probability bounds at different pursuit levels, unique draws, upgrades, fragments only on living raid completion, rising difficulty, immediate death, reset, third-raid victory, and duplicate-action guards. Targeted checks verify that successful loud actions increase pursuit and worsen later checks/damage, quiet actions reduce it, pressure is capped and resets, camp recovery caps at 20, and both answers include loud and quiet routes.

The previous balance won about 52% with all-Yes and 76% with informed choices. After pursuit, reduced recovery and tougher checks, a 115,200-run comparison produced average win rates of **8.3% all-Yes, 15.4% all-No, 10.6% random, and 31.8% informed**. Informed results ranged from 10–55% across loadouts; every loadout remained able to win. Fixed-answer strategies can still win through luck; adapting choices is substantially more effective. These are simulation estimates, not a substitute for player feedback.

Headless Edge verified the actual desktop and 390px mobile interface: loadout changes, all 15 encounter transitions, victory, death, fresh run, dialog and keyboard controls, no horizontal overflow and no JavaScript errors. Preview screenshots are in `assets/preview-*.png`. `browser-check.cjs` is the development browser check and uses this workstation's bundled Playwright; for another machine, replace its require path with an installed Playwright package. The game itself has no package dependency.

No placeholder artwork. All catalog and ending icons are original SVG pixel drawings, and all art is bundled or inline. CRT is off by default and disabled under reduced motion. This first version has no audio, persistent save or multiplayer.
