/* Pure rules, shared by the browser and the verification simulation. */
window.ZRules = (() => {
  const C = window.ZContent;
  const item = (type,id) => C[type].find(x=>x.id===id);
  const fresh = () => ({character:null,location:'pharmacy',weapon:'bat',gear:'vest',hp:0,completed:0,tier:0,supplies:0,encounters:[],index:0,phase:'title',last:null});
  function bonuses(s,stat) { return ['weapons','gear'].reduce((sum,type)=> { const it=item(type,type==='weapons'?s.weapon:s.gear); return sum+(it.bonuses[stat]||0)+(it.specialty===stat?s.tier:0); },0); }
  // A stat point and equipment point each add five percentage points. Each later
  // raid costs nine points; specialty upgrades counteract only part of that cost.
  function chance(s,choice) { const c=item('characters',s.character),l=item('locations',s.location);return Math.max(10,Math.min(90,choice.base+c[choice.stat]*5+bonuses(s,choice.stat)*5+Math.min(3,s.supplies)-l.hazards[choice.stat]-s.completed*9)); }
  function selectCharacter(s,id) { if(s.phase!=='characters')return false; const c=item('characters',id);if(!c)return false;s.character=id;s.hp=c.health;s.phase='prepare';return true; }
  function startRaid(s,rng=Math.random) {if(s.phase!=='prepare')return false;const pool=[...item('locations',s.location).encounters];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}s.encounters=pool.slice(0,5);s.index=0;s.phase='raid';s.last=null;return true;}
  function resolve(s,answer,rng=Math.random) {
    if(s.phase!=='raid'||!['yes','no'].includes(answer))return null;
    const a=s.encounters[s.index][answer],odds=chance(s,a),roll=rng()*100,success=roll<odds,g=item('gear',s.gear),max=item('characters',s.character).health;
    const damage=success?0:Math.max(1,a.damage+s.completed*4-(g.armor||0)-(g.armor?s.tier:0));
    const healing=success?Math.min(max-s.hp,a.heal+(g.healing||0)+(g.healing?s.tier:0)):0;
    const supplies=success?a.supplies+(g.supplies||0):0;
    s.hp=Math.max(0,Math.min(max,s.hp-damage+healing));s.supplies+=supplies;
    s.last={success,odds,roll,damage,healing,supplies,action:a.action};
    s.phase=s.hp===0?'death':'outcome';
    if(s.phase==='death'){s.deathProgress={completed:s.completed,encounter:s.index+1,character:s.character};s.completed=0;s.tier=0;s.supplies=0;}
    return s.last;
  }
  function next(s) {
    if(s.phase!=='outcome')return false;
    if(s.index<4){s.index++;s.phase='raid';return true;}
    // Only this transition grants fragments. Phase guards prevent duplicate rewards.
    s.completed++;s.tier=s.completed;
    const max=item('characters',s.character).health,recovery=Math.min(max-s.hp,12+Math.min(10,s.supplies)*2);
    s.hp+=recovery;s.recovery=recovery;s.usedSupplies=s.supplies;s.supplies=0;s.phase=s.completed===3?'victory':'summary';return true;
  }
  return {fresh,item,bonuses,chance,selectCharacter,startRaid,resolve,next};
})();
