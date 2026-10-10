// Compare fixed-answer strategies with informed choices. No dependencies.
const fs=require('fs'),vm=require('vm');
const env={window:{}};vm.createContext(env);for(const f of ['content.js','engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),env);
const C=env.window.ZContent,R=env.window.ZRules;
const seed=value=>()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
const count=Number(process.argv[2]||600),summary={};
for(const policy of ['yes','no','random','informed']){
  const rows=[];
  for(const c of C.characters)for(const w of C.weapons)for(const g of C.gear){
    const rng=seed(2086);let wins=0;
    for(let n=0;n<count;n++){
      const s=R.fresh();s.phase='characters';R.selectCharacter(s,c.id);s.weapon=w.id;s.gear=g.id;
      while(s.phase!=='death'&&s.phase!=='victory'){
        s.location=C.locations[(n+s.completed)%3].id;R.startRaid(s,rng);
        while(s.phase==='raid'){
          const e=s.encounters[s.index];
          // This policy sees hidden checks and estimates immediate health cost,
          // supplies, healing and the future cost of attracting more infected.
          const score=x=>{const p=R.chance(s,x)/100;return (1-p)*(R.damage?R.damage(s,x):x.damage+s.completed*4)-p*(x.heal+(R.item('gear',s.gear).healing||0)+x.supplies*.8)+(x.noise||0)*1.7;};
          const answer=policy==='random'?(rng()<.5?'yes':'no'):policy==='informed'?(score(e.yes)<=score(e.no)?'yes':'no'):policy;
          R.resolve(s,answer,rng);if(s.phase==='outcome')R.next(s);
        }
        if(s.phase==='summary')s.phase='prepare';
      }
      if(s.phase==='victory')wins++;
    }
    rows.push({character:c.name,weapon:w.name,gear:g.name,win:Math.round(wins/count*1000)/10});
  }
  rows.sort((a,b)=>a.win-b.win);
  summary[policy]={mean:Math.round(rows.reduce((n,r)=>n+r.win,0)/rows.length*10)/10,min:rows[0],max:rows.at(-1)};
}
console.log(JSON.stringify({runs:count*48*4,summary},null,2));
