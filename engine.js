/* Pure rules, shared by the browser and the verification simulation. */
window.ZRules = (() => {
  const C = window.ZContent;
  const item = (type,id) => C[type].find(x=>x.id===id);
  const fresh = () => ({character:null,location:'pharmacy',weapon:'bat',gear:'vest',hp:0,completed:0,tier:0,supplies:0,pressure:0,encounters:[],index:0,phase:'title',last:null});
  function bonuses(s,stat) { return ['weapons','gear'].reduce((sum,type)=> { const it=item(type,type==='weapons'?s.weapon:s.gear); return sum+(it.bonuses[stat]||0)+(it.specialty===stat?s.tier:0); },0); }
  // Four points per stat and five per equipment point; upgrades offset the
  // ten-point raid penalty. Existing pursuit costs two points per level.
  // These odds stay internal. Players see actions and qualitative consequences.
  function chance(s,choice) { const c=item('characters',s.character),l=item('locations',s.location);return Math.max(10,Math.min(85,choice.base+c[choice.stat]*4+bonuses(s,choice.stat)*5+Math.min(2,s.supplies)-l.hazards[choice.stat]-s.completed*10-s.pressure*2-s.index)); }
  function damage(s,choice) {const g=item('gear',s.gear);return Math.max(1,choice.damage+s.completed*5+Math.floor(s.pressure/2)-(g.armor||0)-(g.armor?s.tier:0));}
  const recovery = s => 8+Math.min(6,s.supplies)*2;
  function selectCharacter(s,id) { if(s.phase!=='characters')return false; const c=item('characters',id);if(!c)return false;s.character=id;s.hp=c.health;s.phase='prepare';return true; }
  function startRaid(s,rng=Math.random) {if(s.phase!=='prepare')return false;const pool=[...item('locations',s.location).encounters];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}s.encounters=pool.slice(0,5);s.index=0;s.pressure=0;s.phase='raid';s.last=null;return true;}
  function resolve(s,answer,rng=Math.random) {
    if(s.phase!=='raid'||!['yes','no'].includes(answer))return null;
    const a=s.encounters[s.index][answer],odds=chance(s,a),roll=rng()*100,success=roll<odds,g=item('gear',s.gear),max=item('characters',s.character).health;
    const injury=success?0:damage(s,a);
    const healing=success?Math.min(max-s.hp,a.heal+(g.healing||0)+(g.healing?s.tier:0)):0;
    const supplies=success?a.supplies+(g.supplies||0):0;
    s.hp=Math.max(0,Math.min(max,s.hp-injury+healing));s.supplies+=supplies;
    const before=s.pressure;
    // Quiet actions still help on a failure, but the mishap attracts one level.
    s.pressure=Math.max(0,Math.min(8,s.pressure+(a.noise||0)+(success?0:1)));
    s.last={success,odds,roll,damage:injury,healing,supplies,action:a.action,noiseChange:s.pressure-before};
    s.phase=s.hp===0?'death':'outcome';
    if(s.phase==='death'){s.deathProgress={completed:s.completed,encounter:s.index+1,character:s.character};s.completed=0;s.tier=0;s.supplies=0;s.pressure=0;}
    return s.last;
  }
  function next(s) {
    if(s.phase!=='outcome')return false;
    if(s.index<4){s.index++;s.phase='raid';return true;}
    // Only this transition grants fragments. Phase guards prevent duplicate rewards.
    s.completed++;s.tier=s.completed;
    const max=item('characters',s.character).health,healed=Math.min(max-s.hp,recovery(s));
    s.hp+=healed;s.recovery=healed;s.usedSupplies=s.supplies;s.supplies=0;s.pressure=0;s.phase=s.completed===3?'victory':'summary';return true;
  }
  return {fresh,item,bonuses,chance,damage,recovery,selectCharacter,startRaid,resolve,next};
})();
