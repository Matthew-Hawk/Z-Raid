// Run with node verify.cjs. No packages required.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:{}};vm.createContext(sandbox);for(const f of ['content.js','engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox);
const C=sandbox.window.ZContent,R=sandbox.window.ZRules;
const seed=(value)=>()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
function ready(c,w,g,l){const s=R.fresh();s.phase='characters';assert(R.selectCharacter(s,c));Object.assign(s,{weapon:w,gear:g,location:l});return s;}
let combinations=0;
for(const c of C.characters)for(const w of C.weapons)for(const g of C.gear)for(const l of C.locations){
  const s=ready(c.id,w.id,g.id,l.id);assert.equal(l.encounters.length,10);assert(R.startRaid(s,seed(42)));assert.equal(new Set(s.encounters.map(e=>e.id)).size,5);
  for(let tier=0;tier<3;tier++){s.completed=tier;s.tier=tier;for(const e of l.encounters)for(const a of [e.yes,e.no])for(const pressure of [0,4,8]){s.pressure=pressure;const p=R.chance(s,a);assert(p>=10&&p<=85);}}
  s.completed=0;s.tier=0;
  for(let raid=0;raid<3;raid++){
    for(let i=0;i<5;i++){assert.equal(s.completed,raid);assert(R.resolve(s,'yes',()=>0));assert.equal(R.resolve(s,'yes',()=>0),null);assert(R.next(s));if(i<4)assert.equal(R.next(s),false);}
    assert.equal(s.completed,raid+1);assert.equal(s.tier,raid+1);assert.equal(R.next(s),false);
    if(raid<2){assert.equal(s.phase,'summary');s.phase='prepare';R.startRaid(s,seed(raid+2));}else assert.equal(s.phase,'victory');
  }combinations++;
}
const dead=ready('echo','bow','boots','metro');dead.completed=2;dead.tier=2;dead.supplies=9;dead.hp=1;R.startRaid(dead,seed(7));R.resolve(dead,'yes',()=>.99999);assert.equal(dead.phase,'death');assert.equal(dead.hp,0);assert.equal(dead.completed,0);assert.equal(dead.tier,0);assert.equal(dead.supplies,0);assert.equal(R.next(dead),false);assert.equal(R.fresh().character,null);
const difficulty=ready('patch','knife','pack','pharmacy'),a=C.locations[0].encounters[0].no;const p0=R.chance(difficulty,a);difficulty.completed=1;assert.equal(R.chance(difficulty,a),p0-10);difficulty.tier=1;assert.equal(R.bonuses(difficulty,'scavenging'),6);
const pursuit=ready('rook','bat','vest','pharmacy');R.startRaid(pursuit,seed(1));pursuit.encounters=[C.locations[0].encounters[0],C.locations[0].encounters[1]];
const followup=pursuit.encounters[1].no,quietOdds=R.chance(pursuit,followup),quietDamage=R.damage(pursuit,followup);
R.resolve(pursuit,'yes',()=>0);assert.equal(pursuit.pressure,3);assert.equal(pursuit.last.noiseChange,3);R.next(pursuit);assert(R.chance(pursuit,followup)<quietOdds);assert(R.damage(pursuit,followup)>quietDamage);
R.resolve(pursuit,'no',()=>0);assert.equal(pursuit.pressure,1);assert.equal(pursuit.last.noiseChange,-2);
pursuit.phase='raid';pursuit.index=0;pursuit.pressure=7;R.resolve(pursuit,'yes',()=>.99999);assert.equal(pursuit.pressure,8);
pursuit.phase='prepare';R.startRaid(pursuit,seed(2));assert.equal(pursuit.pressure,0);pursuit.supplies=100;assert.equal(R.recovery(pursuit),20);
assert(C.locations.every(l=>l.encounters.some(e=>e.yes.noise<0)&&l.encounters.some(e=>e.no.noise>0)),'Neither answer should always be the quiet route');
console.log(`PASS: ${combinations} combinations, 30 encounters, bounds, shuffle, upgrades, fragments, difficulty, death, reset, victory, pursuit effects/caps, recovery limits and duplicate actions. Run node balance.cjs for strategy comparisons.`);
