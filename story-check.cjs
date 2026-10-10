// Exhaustive narrative integrity checks, without browser dependencies.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const env={window:{}};vm.createContext(env);
for(const f of ['content.js','stories.js','engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),env);
const C=env.window.ZContent,R=env.window.ZRules;
let cases=0;
for(const l of C.locations){
  assert.equal(l.storylines.length,2);
  assert.equal(new Set(l.storylines.flatMap(a=>a.encounters.map(e=>e.id))).size,10);
  for(const [route,arc] of l.storylines.entries()){
    const chosen=R.fresh();Object.assign(chosen,{phase:'prepare',location:l.id});let calls=0;
    assert(R.startRaid(chosen,()=>{calls++;return route?.99999:0;}));assert.equal(calls,1);assert.equal(chosen.storyline.id,arc.id);
    assert.deepEqual(chosen.encounters.map(e=>e.id),arc.encounters.map(e=>e.id));
    for(const [i,e] of arc.encounters.entries())for(const answer of ['yes','no']){
      const original=l.encounters.find(x=>x.id===e.id)[answer],choice=e[answer];
      for(const field of ['base','stat','damage','supplies','heal','noise','action'])assert.equal(choice[field],original[field]);
      assert(choice.story.success&&choice.story.failure&&choice.story.success!==choice.story.failure);
      for(const c of C.characters)for(const w of C.weapons)for(const g of C.gear)for(const success of [true,false]){
        const s=R.fresh();Object.assign(s,{phase:'prepare',location:l.id,character:c.id,weapon:w.id,gear:g.id,hp:c.health,tier:2,completed:2});R.startRaid(s,()=>route?.99999:0);
        s.index=i;s.pressure=7;let rolls=0;
        const x=R.resolve(s,answer,()=>{rolls++;return success?0:.99999;});assert.equal(rolls,1);
        assert.equal(x.success,success);assert.equal(x.narrative.scene,choice.story[success?'success':'failure']);
        assert(x.narrative.reason.includes(c.name));assert(x.narrative.context.includes('horde at your back'));
        assert(!/undefined|NaN|%/.test(Object.values(x.narrative).join(' ')));cases++;
      }
      const fatal=R.fresh();Object.assign(fatal,{phase:'prepare',location:l.id,character:'rook',weapon:'bat',gear:'vest',hp:1});R.startRaid(fatal,()=>route?.99999:0);fatal.index=i;
      R.resolve(fatal,answer,()=>.99999);assert.equal(fatal.phase,'death');assert(fatal.last.narrative.fatal);assert(fatal.last.narrative.context.includes('fatal'));
    }
  }
}
assert.equal(R.fresh().storyline,null);
console.log(`PASS: six ordered arcs, 120 scene outcomes, ${cases} character/loadout results, unchanged numeric effects, one selection/roll, pursuit snapshot and fatal narration.`);
