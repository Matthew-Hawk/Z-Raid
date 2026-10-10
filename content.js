/* Content only: edit the catalogs and encounter rows without changing the rules. */
window.ZContent = (() => {
  const characters = [
    {id:'rook',name:'Rook',role:'THE ENFORCER',description:'A former soldier. Built for a fight, less suited to quiet entrances.',health:100,combat:5,stealth:2,scavenging:2,color:'#deaa67'},
    {id:'echo',name:'Echo',role:'THE GHOST',description:'A rooftop courier. Quick and quiet, but cannot take many hits.',health:82,combat:2,stealth:5,scavenging:3,color:'#77c9c5'},
    {id:'patch',name:'Patch',role:'THE SCAVENGER',description:'A field medic. Finds what others miss, with little combat training.',health:90,combat:2,stealth:3,scavenging:5,color:'#b5d974'}
  ];
  const weapons = [
    {id:'bat',name:'Nail bat',description:'Reliable force. Heavy to carry.',bonuses:{combat:3,stealth:-1},specialty:'combat'},
    {id:'bow',name:'Recurve bow',description:'Silent range. Slower in a brawl.',bonuses:{combat:1,stealth:2},specialty:'stealth'},
    {id:'pistol',name:'Service pistol',description:'High stopping power. Shots draw attention.',bonuses:{combat:4,stealth:-2},specialty:'combat'},
    {id:'knife',name:'Utility knife',description:'Quiet and useful for opening caches.',bonuses:{stealth:1,scavenging:2},specialty:'scavenging'}
  ];
  const gear = [
    {id:'vest',name:'Armor vest',description:'Absorbs 3 damage per failed check. Restricts movement.',bonuses:{combat:1,stealth:-1},specialty:'combat',armor:3},
    {id:'boots',name:'Soft boots',description:'Move quietly through dangerous terrain.',bonuses:{stealth:2},specialty:'stealth'},
    {id:'kit',name:'Medical kit',description:'Recover 3 extra health on successful checks.',bonuses:{scavenging:1},specialty:'scavenging',healing:3},
    {id:'pack',name:'Field pack',description:'Find one extra supply on successful checks.',bonuses:{scavenging:2,combat:-1},specialty:'scavenging',supplies:1}
  ];
  // Row: question, Yes action/stat, No action/stat, Yes base, No base, Yes damage, No damage.
  const pools = {
    pharmacy:[
      ['Scratching comes from the storage room. Force the door?','Breach the door','combat','Search the service hatch','scavenging',48,50,14,13],
      ['A cabinet is tangled in alarm wire. Cut through it?','Disarm the wire','scavenging','Slip past the sensor','stealth',49,54,15,12],
      ['An infected pharmacist blocks the cold room. Fight?','Clear the cold room','combat','Crawl through a vent','stealth',50,48,16,13],
      ['A spilled chemical stains the stairwell. Cross it?','Identify a safe path','scavenging','Climb the exposed railing','stealth',55,49,13,15],
      ['A freezer still has power. Try to retrieve its contents?','Inspect the frozen vials','scavenging','Guard the humming corridor','combat',47,57,14,12],
      ['A locked ambulance holds supplies. Break the window?','Smash and clear the cab','combat','Pick the rear latch','scavenging',56,48,15,12],
      ['A shadow follows you between shelves. Set an ambush?','Face the stalker','combat','Lose it in the aisles','stealth',48,52,16,13],
      ['A ceiling panel hides a cache. Climb up?','Find stable footholds','stealth','Salvage the fallen shelves','scavenging',53,49,13,14],
      ['A radio broadcasts coordinates. Tune it?','Repair the receiver','scavenging','Silence the approaching dead','combat',50,52,14,16],
      ['A fallen shutter blocks the exit. Lift it?','Raise the shutter','combat','Squeeze through the loading bay','stealth',54,48,15,14]
    ],
    metro:[
      ['A horde sleeps inside the train. Walk through it?','Cross the carriage silently','stealth','Clear a path on the tracks','combat',48,55,14,16],
      ['A ticket booth contains a sealed case. Pry it open?','Force the reinforced lock','combat','Search the maintenance locker','scavenging',51,52,14,13],
      ['The platform lights flicker. Restore power?','Reconnect the switchboard','scavenging','Navigate in darkness','stealth',53,49,15,14],
      ['An infected guard has the tunnel key. Take it?','Overpower the guard','combat','Slip through the drainage pipe','stealth',50,50,17,14],
      ['A flooded passage offers a shortcut. Wade in?','Read the current and debris','scavenging','Climb the signal gantry','stealth',51,54,14,15],
      ['A trolley rattles toward you. Stop it?','Brace against the trolley','combat','Duck into a service alcove','stealth',57,47,15,14],
      ['A backpack hangs over the rail bed. Reach for it?','Lower yourself quietly','stealth','Search nearby rubble','scavenging',50,55,15,13],
      ['Something moves beneath the train. Investigate?','Sweep underneath','combat','Listen for another route','scavenging',52,50,16,14],
      ['An emergency gate is jammed. Force it?','Break the gate mechanism','combat','Scale the station wall','stealth',54,49,15,15],
      ['A tunnel map lies in a nest. Retrieve it?','Sneak into the nest','stealth','Reconstruct a route from signs','scavenging',47,54,16,13]
    ],
    checkpoint:[
      ['A sentry drone scans the yard. Disable it?','Strike the drone','combat','Move behind the barriers','stealth',49,53,17,14],
      ['A supply crate is booby trapped. Open it?','Defuse the trigger','scavenging','Check the exposed truck','stealth',48,55,16,14],
      ['An armored infected guards the lab. Attack?','Aim for weak points','combat','Find a maintenance entrance','scavenging',47,55,18,14],
      ['A searchlight sweeps the fence. Cut across?','Time the sweep','stealth','Break through the gate','combat',50,55,15,17],
      ['A generator is leaking fuel. Repair it?','Patch the fuel line','scavenging','Push through the dark bunker','combat',53,50,15,17],
      ['An officer carries a case. Follow them?','Trail the infected officer','stealth','Search the command tent','scavenging',49,54,15,14],
      ['The antenna is drawing a horde. Destroy it?','Bring down the antenna','combat','Escape through the trenches','stealth',55,49,17,15],
      ['A bunker hatch is frozen shut. Heat it?','Improvise a heating tool','scavenging','Climb the surveillance tower','stealth',51,53,15,16],
      ['A wounded infected lunges at you. Stand your ground?','Repel the lunge','combat','Evade between crates','stealth',54,49,17,14],
      ['The lab safe has backup power. Decode it?','Trace the safe circuit','scavenging','Recover the field research case','combat',48,56,16,17]
    ]
  };
  const locations = [
    {id:'pharmacy',name:'Mercy Pharmacy',label:'MEDICAL DISTRICT',description:'Cold rooms, tight aisles and contaminated stock.',hazards:{combat:3,stealth:1,scavenging:6},color:'#b5d974'},
    {id:'metro',name:'Hollow Metro',label:'UNDERGROUND',description:'Dark tunnels, sleeping hordes and flooded tracks.',hazards:{combat:5,stealth:6,scavenging:1},color:'#77c9c5'},
    {id:'checkpoint',name:'Checkpoint 09',label:'QUARANTINE ZONE',description:'Armored infected, surveillance and military salvage.',hazards:{combat:6,stealth:2,scavenging:4},color:'#deaa67'}
  ];
  // Pursuit is a lasting consequence of each route, even when its check succeeds.
  // Positive values attract infected; negative values shake them off. Neither
  // Yes nor No always means loud or quiet: the actual action determines it.
  const pursuit = {
    pharmacy:[[3,-1],[2,-2],[3,-1],[0,1],[1,2],[3,0],[2,-2],[-1,1],[2,3],[3,-1]],
    metro:[[-2,3],[3,1],[2,-1],[3,-2],[1,-1],[3,-2],[-1,1],[2,0],[3,-1],[-2,1]],
    checkpoint:[[3,-2],[1,-1],[3,1],[-2,3],[2,3],[-2,1],[4,-2],[1,-1],[3,-2],[2,3]]
  };
  locations.forEach(l => l.encounters = pools[l.id].map((r,i) => ({id:l.id+i,question:r[0],yes:{action:r[1],stat:r[2],base:r[5],damage:r[7]+10,supplies:2+(i%2),heal:i%3===0?4:0,noise:pursuit[l.id][i][0]},no:{action:r[3],stat:r[4],base:r[6],damage:r[8]+10,supplies:1+(i%2),heal:i%3===1?5:0,noise:pursuit[l.id][i][1]}})));
  return {characters,weapons,gear,locations};
})();
