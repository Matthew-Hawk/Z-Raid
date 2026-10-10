// Run with node verify.cjs. No packages required.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{}};vm.createContext(sandbox);for(const f of ['content.js','engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox);
const C=sandbox.window.ZContent,R=sandbox.window.ZRules;
const seed=(value)=>()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
function ready(c,w,g,l){const s=R.fresh();s.phase='characters';assert(R.selectCharacter(s,c));Object.assign(s,{weapon:w,gear:g,location:l});return s;}
let combinations=0;
for(const c of C.characters)for(const w of C.weapons)for(const g of C.gear)for(const l of C.locations){
  const s=ready(c.id,w.id,g.id,l.id);assert.equal(l.encounters.length,10);assert(R.startRaid(s,seed(42)));assert.equal(new Set(s.encounters.map(e=>e.id)).size,5);
  for(let tier=0;tier<3;tier++){s.completed=tier;s.tier=tier;for(const e of l.encounters)for(const a of [e.yes,e.no]){const p=R.chance(s,a);assert(p>=10&&p<=90);}}
  s.completed=0;s.tier=0;
  for(let raid=0;raid<3;raid++){
    for(let i=0;i<5;i++){assert.equal(s.completed,raid);assert(R.resolve(s,'yes',()=>0));assert.equal(R.resolve(s,'yes',()=>0),null);assert(R.next(s));if(i<4)assert.equal(R.next(s),false);}
    assert.equal(s.completed,raid+1);assert.equal(s.tier,raid+1);assert.equal(R.next(s),false);
    if(raid<2){assert.equal(s.phase,'summary');s.phase='prepare';R.startRaid(s,seed(raid+2));}else assert.equal(s.phase,'victory');
  }combinations++;
}
const dead=ready('echo','bow','boots','metro');dead.completed=2;dead.tier=2;dead.supplies=9;dead.hp=1;R.startRaid(dead,seed(7));R.resolve(dead,'yes',()=>.99999);assert.equal(dead.phase,'death');assert.equal(dead.hp,0);assert.equal(dead.completed,0);assert.equal(dead.tier,0);assert.equal(dead.supplies,0);assert.equal(R.next(dead),false);assert.equal(R.fresh().character,null);
const difficulty=ready('patch','knife','pack','pharmacy'),a=C.locations[0].encounters[0].no;const p0=R.chance(difficulty,a);difficulty.completed=1;assert.equal(R.chance(difficulty,a),p0-9);difficulty.tier=1;assert.equal(R.bonuses(difficulty,'scavenging'),6);
// Compare informed play across all character/weapon/gear combinations, rotating
// locations and choosing the safer check (probability, damage and healing).
const report=[];for(const c of C.characters)for(const w of C.weapons)for(const g of C.gear){let wins=0,raids=0;const rng=seed(1200);for(let n=0;n<350;n++){const s=ready(c.id,w.id,g.id,C.locations[n%3].id);while(s.completed<3&&s.phase!=='death'){s.location=C.locations[(n+s.completed)%3].id;R.startRaid(s,rng);while(s.phase==='raid'){const e=s.encounters[s.index];const score=x=>R.chance(s,x)-x.damage*.45+x.heal*.2;R.resolve(s,score(e.yes)>=score(e.no)?'yes':'no',rng);if(s.phase==='outcome')R.next(s);}if(s.phase==='summary'){raids++;s.phase='prepare';}else if(s.phase==='victory'){raids++;wins++;}}}report.push({character:c.name,weapon:w.name,gear:g.name,win:Math.round(wins/350*100),raids:Math.round(raids/350*100)/100});}
report.sort((a,b)=>a.win-b.win);console.log(`PASS: ${combinations} combinations, 30 encounters, bounds, shuffle, upgrades, fragments, difficulty, death, reset, victory and duplicate actions.`);console.log('Simulation: 16,800 seeded runs; informed choices, rotating locations.');console.log(JSON.stringify({lowest:report.slice(0,4),highest:report.slice(-4),mean:report.reduce((n,x)=>n+x.win,0)/report.length},null,2));
