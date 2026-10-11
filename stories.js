/* Narrative content is separate from rules. Each route has an authored success
   and failure; failures still lead onward if alive. No narration consumes RNG. */
window.ZStories = (() => {
  const C = window.ZContent;
  // Beat: original encounter index, story question, Yes success/failure,
  // No success/failure. Numeric effects remain those of the original encounter.
  const arcs = {
    pharmacy: [
      {id:'cold-chain',name:'Cold Chain',mission:'Recover the research before the last freezer thaws.',ending:'The thawing vials and cold-room records yield a cure fragment at camp.',beats:[
        [0,'The cold-room log is behind a scratching storage door. Force it?',
          'The latch tears free; the cold-room log lies beside the fallen shelves.',
          'The latch snaps back into your arm; through the gap, you spot the cold-room signs.',
          'A loose service hatch leads behind the shelves to the cold-room log.',
          'The hatch gives way under your grip; its jagged edge cuts you beside the cold-room signs.'],
        [1,'Cold-room markings lead to a wired cabinet. Cut through it?',
          'You separate the alarm lead from the cabinet lock and uncover a freezer key.',
          'The wire springs taut, cutting your hand; the alarm exposes a route behind the cabinet.',
          'You skirt the sensor and read the freezer number from the cabinet label.',
          'A shelf shifts as you pass the sensor; infected hands catch you before the cold-room corridor.'],
        [2,'An infected pharmacist stands at the marked cold room. Fight?',
          'The pharmacist falls away from the door, leaving the cold room within reach.',
          'The pharmacist catches your forearm; the impact knocks the cold-room door ajar.',
          'The vent carries you over the pharmacist and into the cold-room stairwell.',
          'A vent grille drops beneath you; you land hard on the cold-room stairs.'],
        [3,'Spilled chemicals cover the stairs to the freezer. Cross them?',
          'You follow the clean edges of the steps and reach the freezer landing.',
          'A slick step sends you into the chemical spill; the landing is just beyond it.',
          'You move along the railing above the spill and reach the freezer landing.',
          'The railing bends under you, scraping your leg against the freezer landing.'],
        [4,'The research freezer is still humming. Retrieve its contents?',
          'You separate usable vials from broken stock and seal the research records for camp.',
          'A cracked vial burns your hand; you preserve its label and records for camp instead.',
          'You hold the corridor long enough to secure the records beside the freezer.',
          'Infected burst through the corridor; you take a wound protecting the records for camp.']
      ]},
      {id:'last-dispatch',name:'Last Dispatch',mission:'Follow a missing medic’s last transmission.',ending:'The missing medic’s journal contains a formula fragment the camp can use.',beats:[
        [5,'A missing medic’s ambulance holds the first clue. Break its window?',
          'The glass gives way; a dispatch slip directs you to the pharmacy radio.',
          'Glass bites into your wrist; through the broken pane, you read the radio call sign.',
          'The rear latch opens onto a dispatch slip bearing the pharmacy radio call sign.',
          'The latch traps your fingers; a dispatch slip visible inside still names the radio.'],
        [8,'The pharmacy radio repeats the medic’s call sign. Tune it?',
          'The receiver clears: the medic hid a journal above aisle seven.',
          'The receiver sparks against your hand; a final burst still names aisle seven.',
          'You clear the dead from the radio desk and hear the aisle-seven message.',
          'The dead reach the desk first; their blows land as the aisle-seven message repeats.'],
        [6,'A shadow follows you toward aisle seven. Set an ambush?',
          'You catch the stalker between shelves and clear the way to the medic’s hiding place.',
          'The stalker lunges before your trap is ready, driving you toward aisle seven.',
          'You lose the stalker behind a row of shelving and reach aisle seven unseen.',
          'The stalker hears a shelf rattle and strikes as you turn into aisle seven.'],
        [7,'The medic’s journal is above a ceiling panel. Climb up?',
          'You reach the panel and slide the journal into your coat before the ceiling shifts.',
          'The ceiling drops onto your shoulder; the journal falls beside you in the debris.',
          'You work through the collapsed shelves and pull the journal from the fallen panel.',
          'A hidden shelf nail opens your palm as you pull the journal from the debris.'],
        [9,'Journal secured, you find the exit shutter down. Lift it?',
          'The shutter rises enough to carry the medic’s journal out into the street.',
          'The shutter slams onto your shoulder; a gap beneath it is your last way out.',
          'You slip through the loading bay with the medic’s journal held clear of the debris.',
          'The loading-bay frame catches you, leaving a deep cut on the last stretch home.']
      ]}
    ],
    metro: [
      {id:'sealed-carriage',name:'Sealed Carriage',mission:'Find the research shipment trapped beneath the city.',ending:'The sealed shipment’s records become a cure fragment back at camp.',beats:[
        [1,'A ticket-booth case lists a research carriage. Pry it open?',
          'The lock breaks; the manifest names a carriage beyond the dark platform.',
          'The lock springs into your knuckles; the cracked case still reveals the carriage number.',
          'A maintenance locker holds a duplicate manifest and the platform power diagram.',
          'The locker door falls against your arm; the diagram inside still marks the platform.'],
        [2,'The shipment platform is dark. Restore its flickering lights?',
          'The switchboard steadies, revealing a guard beside the tunnel gate.',
          'The board discharges through your hand; its flash reveals the tunnel gate.',
          'You trace the platform edge in darkness and reach the tunnel gate quietly.',
          'Your next step finds a broken platform edge; the fall bruises you near the gate.'],
        [3,'An infected guard holds the shipment tunnel key. Take it?',
          'You pin the guard and take the key to the research carriage tunnel.',
          'The guard bites through your sleeve; your struggle knocks the tunnel gate open.',
          'The drainage pipe leads around the gate and into the carriage tunnel.',
          'The pipe narrows around broken metal, cutting you before the carriage tunnel.'],
        [0,'The research carriage is full of sleeping dead. Walk through?',
          'You pass between still bodies and secure the shipment records at the far door.',
          'A sleeper wakes beneath you and strikes as you pull the shipment records clear.',
          'You clear the trackside dead and reach the shipment records through the side door.',
          'The trackside horde closes around you as you drag the shipment records clear.'],
        [4,'Records secured, a flooded passage leads out. Wade through?',
          'You read the current and carry the shipment records across without soaking them.',
          'Submerged debris catches your leg; you hold the shipment records above the water.',
          'The signal gantry carries you above the flood and toward the station exit.',
          'A gantry rung breaks, bruising your ribs as you protect the shipment records.']
      ]},
      {id:'signal-dark',name:'Signal in the Dark',mission:'Trace a courier’s cache through the abandoned rail line.',ending:'The courier’s cache holds a research copy that completes another cure fragment.',beats:[
        [9,'A courier’s marked map lies in an infected nest. Retrieve it?',
          'You lift the map from the nest; its mark points to a pack over the rails.',
          'A body stirs beneath the map and claws you; its courier mark is still legible.',
          'You reconstruct the courier route from wall signs pointing toward the rail bed.',
          'A loose sign falls onto your arm; behind it, the rail-bed direction is exposed.'],
        [6,'The courier’s pack hangs above the rail bed. Reach for it?',
          'You lower yourself to the pack and find a note about a cache beneath the train.',
          'The strap slips and you hit the rail bed; the note spills out beside you.',
          'A second courier note in the rubble points to the underside of the train.',
          'Broken ballast cuts your hand; beneath it, a courier note identifies the train.'],
        [7,'The courier cache is under a moving shadow. Investigate?',
          'You drive the infected out from under the train and take the sealed cache.',
          'The infected catches your leg as you pull the courier cache from beneath the train.',
          'You follow the sound along the carriage and reach the cache from the opposite side.',
          'The sound echoes the wrong way; a hidden infected strikes as you pull the cache clear.'],
        [5,'Cache secured, a trolley rolls down the exit track. Stop it?',
          'You brace the trolley against a sleeper, clearing the route to the emergency gate.',
          'The trolley crushes against your hip; it rolls past toward the emergency gate.',
          'A service alcove shelters you as the trolley rattles toward the emergency gate.',
          'Loose masonry falls into the alcove as the trolley passes, cutting your shoulder.'],
        [8,'The courier’s escape gate is jammed. Force it?',
          'The gate mechanism breaks, opening a route home with the courier cache.',
          'The mechanism lashes back into your arm; the impact leaves a narrow way through.',
          'You scale the station wall and lower the courier cache onto the street side.',
          'The wall’s loose coping cuts your leg on the final climb toward the street.']
      ]}
    ],
    checkpoint: [
      {id:'vault-nine',name:'Vault Nine',mission:'Recover the quarantine lab’s sealed formula records.',ending:'The lab records yield a verified formula fragment once you reach camp.',beats:[
        [3,'Vault Nine lies beyond a sweeping searchlight. Cut across?',
          'You cross between sweeps and reach the drone-patrolled yard unseen.',
          'The beam catches movement; an infected sentry strikes before you reach the yard.',
          'You break the gate latch and enter the drone-patrolled yard directly.',
          'The latch tears loose into your arm as you push into the drone-patrolled yard.'],
        [0,'A drone scans the yard on the way to Vault Nine. Disable it?',
          'The drone drops, giving you time to reach the lab supply crates.',
          'The drone turns on you; a broken rotor cuts your shoulder beside the supply crates.',
          'You move behind the barriers and reach the lab supply crates outside its scan.',
          'A barrier shifts beneath your weight; the drone’s alarm brings infected to the crates.'],
        [1,'A trapped supply crate holds the lab access tool. Open it?',
          'You disarm the trigger and take an access tool for the lab entrance.',
          'The trigger snaps into your wrist; the sprung lid exposes the lab entrance markings.',
          'The truck holds a spare access tool, letting you approach the lab another way.',
          'An infected trapped in the truck rakes your arm as you find the lab approach.'],
        [2,'An armored infected blocks the Vault Nine entrance. Attack?',
          'You strike between armor plates and reach the lab’s powered safe.',
          'The armor turns your strike; a heavy blow drives you against the open lab door.',
          'A maintenance entrance brings you behind the infected and into the safe room.',
          'The service panel collapses into your shoulder beside the safe room entrance.'],
        [9,'The formula safe still has backup power. Decode it?',
          'The safe releases its records; you seal them for the journey back to camp.',
          'The circuit burns your fingers; a printed backup beside the safe preserves the research.',
          'You recover the field-research case, a portable copy of the safe’s records.',
          'The case is pinned under debris; you take a wound freeing its research copy.']
      ]},
      {id:'last-officer',name:'The Last Officer',mission:'Follow the officer who hid the field laboratory records.',ending:'The officer’s field notes provide a formula fragment for the camp laboratory.',beats:[
        [5,'An infected officer carries a marked case. Follow them?',
          'You trail the officer to a bunker; the case markings match its generator label.',
          'The officer turns and strikes; its torn case tag still identifies the bunker generator.',
          'The command tent holds the officer’s log, with directions to the bunker generator.',
          'A tent pole falls across your ribs; the scattered officer’s log still names the bunker.'],
        [4,'The officer’s bunker generator leaks fuel. Repair it?',
          'The fuel line holds, restoring light over the bunker hatch.',
          'A hot fuel spurt burns your hand; its flare reveals the bunker hatch.',
          'You push through the unlit approach and locate the bunker hatch by its steel frame.',
          'An infected steps out of the dark and hits you against the bunker hatch.'],
        [7,'The marked bunker hatch is frozen shut. Heat it?',
          'The improvised heater loosens the hatch, exposing the officer’s field notes inside.',
          'The heated latch burns your palm; you reach through the shifted hatch for the field notes.',
          'From the tower you spot a rear opening and recover the officer’s field notes.',
          'A tower brace breaks under you; you crawl through the rear opening for the field notes.'],
        [8,'Notes secured, an infected lunges across your escape route. Stand firm?',
          'You repel the lunge and reach the trenches beneath the broadcasting antenna.',
          'The lunge drives a sharp claw into your arm before you reach the trenches.',
          'You evade between the crates and reach the trenches without facing the lunge.',
          'A crate corner catches your hip; the infected strikes as you turn toward the trenches.'],
        [6,'The antenna draws a horde around the exit. Destroy it?',
          'The antenna falls silent, opening a gap to carry the officer’s notes home.',
          'The antenna crashes toward you; its impact wounds you but opens a gap in the horde.',
          'You follow the trenches beneath the horde’s sightline with the officer’s notes.',
          'The horde spills into a trench; you take a wound shielding the officer’s notes.']
      ]}
    ]
  };
  for (const location of C.locations) {
    location.storylines = arcs[location.id].map((arc, arcIndex) => ({
      id: arc.id, name: arc.name, mission: arc.mission, ending: arc.ending,
      encounters: arc.beats.map((row, beatIndex) => {
        const source = location.encounters[row[0]];
        return {...source, scene: arcIndex * 5 + beatIndex, question: row[1], yes: {...source.yes, story: {success:row[2],failure:row[3]}}, no: {...source.no, story: {success:row[4],failure:row[5]}}};
      })
    }));
  }
  // Strengths do not promise success; specialist failures cite an obstacle,
  // rather than pretending the character lacks the skill they excel at.
  const traits = {
    rook: {
      combat:['Rook’s soldier’s instincts find the opening before the dead can react.','Even Rook’s trained stance cannot absorb the sudden impact.'],
      stealth:['Rook steadies his heavy frame and places each step with care.','Rook’s broad frame brushes debris, betraying his position.'],
      scavenging:['Rook slows down and follows the markings instead of forcing the mechanism.','Rook’s force-first habits miss a small warning in the damaged fittings.']
    },
    echo: {
      combat:['Echo uses speed and leverage to turn a brief opening into a way through.','Echo’s light frame gives ground when the obstacle pushes back.'],
      stealth:['Echo’s courier footwork finds a quiet line through the danger.','Even Echo’s careful footing cannot avoid the loose surface shifting beneath it.'],
      scavenging:['Echo notices a useful detail in the wreckage and works quickly.','Echo’s hurried hands overlook a damaged edge until it catches.']
    },
    patch: {
      combat:['Patch keeps a measured distance and acts when the danger is exposed.','Patch’s medical training offers little leverage against the sudden force.'],
      stealth:['Patch watches the gaps and moves only when the route is clear.','Patch hesitates at the wrong moment, leaving an opening for danger.'],
      scavenging:['Patch’s practiced eye spots the damaged parts before touching them.','Even Patch’s trained eye misses damage concealed beneath the surface.']
    }
  };
  const equipment = {
    bat:{combat:['The nail bat’s weight gives the move extra force.','The nail bat catches against the obstacle before the move is complete.'],stealth:['You keep the nail bat close so its nails clear the debris.','The nail bat’s protruding nails snag loose debris.'],scavenging:['The bat stays tucked away while you work with your hands.','The long bat handle crowds your reach near the damaged fittings.']},
    bow:{combat:['The bow’s reach helps you keep space around the move.','The bow is awkward when the danger crowds in close.'],stealth:['The quiet bow stays clear of the narrow route.','The bow limb brushes a hidden obstruction.'],scavenging:['The bow stays slung clear of your working hand.','The slung bow shifts as you reach into the wreckage.']},
    pistol:{combat:['You keep the service pistol ready as you commit to the opening.','The service pistol offers little room to act at this angle.'],stealth:['You hold the pistol holster still while moving.','The pistol’s hard holster knocks against the surroundings.'],scavenging:['You secure the pistol before examining the fittings.','The pistol holster catches while you reach past the fittings.']},
    knife:{combat:['The knife lets you work close to the opening.','The short knife leaves little reach against this danger.'],stealth:['The small knife stays clear of the tight route.','Even the compact knife cannot stop loose debris betraying you.'],scavenging:['The utility knife helps expose the hidden fittings.','The knife slips against a damaged fitting.']},
    vest:{combat:['The armor vest steadies you against the obstacle.','The armor vest takes part of the impact, but cannot stop it all.'],stealth:['You control the stiff vest while moving carefully.','The stiff armor vest restricts your movement in the tight route.'],scavenging:['The vest protects you while examining the wreckage.','The rigid vest limits your reach into the wreckage.']},
    boots:{combat:['The soft boots help you keep your footing.','The boots lose purchase on the damaged surface.'],stealth:['The soft boots muffle each careful step.','A shifting surface gives you away despite the soft boots.'],scavenging:['The soft boots keep your footing steady while searching.','A loose surface shifts beneath the soft boots as you reach.']},
    kit:{combat:['The medical kit stays secured while you act.','The medical kit cannot prevent the sudden impact.'],stealth:['You hold the medical kit tight so its tools do not rattle.','A tool rattles inside the medical kit as you move.'],scavenging:['The medical kit’s tools help you examine the damaged parts.','A hidden edge catches before the medical tools can expose it.']},
    pack:{combat:['You shift the field pack out of the way before acting.','The field pack’s weight pulls you off balance.'],stealth:['You tighten the field pack’s straps to stop them dragging.','A field pack strap catches against the surroundings.'],scavenging:['The field pack keeps your salvage tools within reach.','The field pack snags while you reach for the hidden fittings.']}
  };
  function describe(s, choice, result, before) {
    const outcome = result.success ? 0 : 1;
    const candidates = [C.weapons.find(x=>x.id===s.weapon),C.gear.find(x=>x.id===s.gear)];
    // Cite equipment with a real relevant bonus/drawback first, not an unrelated
    // gunshot or a supposed deficiency contradicted by the selected loadout.
    const point = item => (item.bonuses[choice.stat]||0)+(item.specialty===choice.stat?s.tier:0);
    candidates.sort((a,b)=>result.success?point(b)-point(a):point(a)-point(b));
    const item = candidates[0];
    const pressure = before.pressure>=5 ? 'The horde at your back leaves little time to recover.' : before.pressure>=2 ? 'Nearby infected were already following the disturbance.' : 'The approach began quietly.';
    const shift = result.noiseChange>0?'The disturbance pulls the horde closer.':result.noiseChange<0?'You leave part of the pursuing horde behind.':'Pursuit stays steady.';
    return {
      scene: choice.story[result.success?'success':'failure'],
      reason: traits[s.character][choice.stat][outcome],
      context: `${equipment[item.id][choice.stat][outcome]} ${pressure} ${s.hp===0?'The wound is fatal; the research never reaches camp.':shift}`,
      fatal: s.hp===0
    };
  }
  return {describe};
})();
