(() => {
  'use strict';
  const C=ZContent,R=ZRules,app=document.querySelector('#app');let state=R.fresh();
  const stats=['combat','stealth','scavenging'];
  // Original SVG pixel sprites use integer rectangles, no external asset requests.
  function art(id,cls='') {
    let p='',color='#b5d974';const rect=(x,y,w,h,c)=>p+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    if(['rook','echo','patch','zombie'].includes(id)){
      color=C.characters.find(c=>c.id===id)?.color||'#83a15e';rect(12,27,11,2,'#080e12');rect(13,6,8,3,color);rect(12,9,10,6,id==='zombie'?'#779253':'#c99d7a');rect(14,12,2,1,'#17252c');rect(19,12,2,1,'#17252c');rect(11,16,12,8,color);rect(8,17,3,8,color);rect(23,17,3,8,color);rect(12,24,4,5,'#66707e');rect(19,24,4,5,'#66707e');rect(10,28,6,2,'#252e39');rect(19,28,6,2,'#252e39');rect(14,18,6,4,'#263840');if(id==='rook')rect(24,14,3,13,'#bca98b');if(id==='patch'){rect(15,18,2,5,'#e9eedc');rect(13,20,6,1,'#e9eedc');}if(id==='echo')rect(12,8,10,4,'#4b798a');
    } else if(['pharmacy','metro','checkpoint'].includes(id)){
      color=C.locations.find(l=>l.id===id).color;rect(0,0,32,32,'#182630');rect(2,8,28,22,'#35434a');rect(4,10,24,4,'#50605a');rect(5,17,7,8,'#101a21');rect(20,17,7,8,'#101a21');rect(14,17,4,13,color);rect(0,30,32,2,'#72785c');if(id==='pharmacy'){rect(14,3,4,9,color);rect(11,6,10,3,color);}if(id==='metro'){rect(9,3,14,5,color);rect(6,27,20,2,'#889694');}if(id==='checkpoint'){rect(2,3,2,27,'#a59071');rect(4,4,12,5,color);rect(2,24,28,3,'#b7a16b');}
    } else if(id==='fragment'||id==='victory'){rect(12,4,8,3,'#d8eed2');rect(13,7,6,4,'#8c9898');rect(10,11,12,17,'#77c9c5');rect(12,14,8,12,'#b5e866');rect(12,14,2,7,'#e7ffc5');if(id==='victory'){rect(3,6,3,3,'#b5d974');rect(26,16,3,3,'#b5d974');}}
    else if(id==='bat'){rect(9,21,3,9,'#99735a');rect(12,7,6,18,'#c1a173');rect(10,10,11,2,'#a7b6ba');rect(10,16,11,2,'#a7b6ba');}
    else if(id==='bow'){rect(19,5,3,22,'#d1ae79');rect(22,8,2,16,'#d1ae79');rect(12,6,1,21,'#dde4d1');rect(7,15,21,2,'#9eaca9');}
    else if(id==='pistol'){rect(5,9,22,6,'#95a7aa');rect(5,15,8,4,'#62747a');rect(6,19,5,10,'#9d7658');rect(21,10,6,2,'#ced7cf');}
    else if(id==='knife'){rect(16,3,5,16,'#c6dcdb');rect(14,19,10,3,'#8b9c96');rect(17,22,4,8,'#a18363');}
    else if(id==='vest'){rect(8,7,16,21,'#a48d65');rect(11,7,10,5,'#16232a');rect(7,13,18,3,'#c4b38c');rect(12,18,8,7,'#6d775e');}
    else if(id==='boots'){rect(6,9,7,15,'#78aaa1');rect(17,7,7,17,'#78aaa1');rect(6,24,12,5,'#9ebcaa');rect(17,24,12,5,'#9ebcaa');}
    else if(id==='kit'){rect(5,10,23,18,'#a98b68');rect(12,6,9,4,'#ccbd93');rect(14,13,5,12,'#dce1cc');rect(10,17,13,4,'#dce1cc');}
    else if(id==='pack'){rect(7,9,18,21,'#869c61');rect(11,5,10,5,'#b2bd85');rect(11,18,10,9,'#516c52');rect(7,12,18,3,'#d0bb85');}
    return `<svg class="pixel ${cls}" viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges">${p}</svg>`;
  }
  const label=s=>s[0].toUpperCase()+s.slice(1);
  const btn=(text,action,cls='primary')=>`<button class="${cls}" data-action="${action}">${text}</button>`;
  const progress=()=>`<div class="fragments">${[1,2,3].map(n=>`<span class="${state.completed>=n?'filled':''}">${art('fragment')}<small>0${n}</small></span>`).join('')}</div>`;
  function hud(){const c=R.item('characters',state.character);return `<div class="hud"><div>${art(c.id)}<div><b>${c.name}</b><span>HEALTH ${state.hp} / ${c.health}</span><meter min="0" max="${c.health}" value="${state.hp}" aria-label="Health"></meter></div></div><div><span>CURE FORMULA</span><b>${state.completed} / 3 fragments</b></div><div><span>RAID ${state.completed+1} / 3</span><b>${['Rising threat','High threat','Critical threat'][Math.min(2,state.completed)]}</b></div><div><span>SUPPLIES</span><b>${state.supplies}</b></div></div>`;}
  function card(x,type,selected){return `<button class="choice ${selected===x.id?'selected':''}" data-choice="${type}" data-id="${x.id}" aria-pressed="${selected===x.id}">${art(x.id)}<div><small>${x.role||x.label||`TIER ${state.tier+1}`}</small><h3>${x.name}</h3><p>${x.description}</p>${x.health?`<div class="tags">${x.health} HP · C ${x.combat} / S ${x.stealth} / SC ${x.scavenging}</div>`:x.bonuses?`<div class="tags">${stats.filter(s=>x.bonuses[s]||x.specialty===s&&state.tier).map(s=>{const v=(x.bonuses[s]||0)+(x.specialty===s?state.tier:0);return `${label(s)} ${v>=0?'+':''}${v}`;}).join(' · ')}</div>`:`<div class="tags">Hazards: C −${x.hazards.combat}% / S −${x.hazards.stealth}% / SC −${x.hazards.scavenging}%</div>`}</div><span class="selector">${selected===x.id?'✓':'+'}</span></button>`;}
  function render(){
    let html='';const s=state;
    if(s.phase==='title')html=`<section class="hero"><div class="hero-shade"></div><div class="hero-copy"><span class="eyebrow">TRANSMISSION 001 — THE LAST CHANCE</span><h1>Z<span>-</span>RAID<span class="dot">.</span></h1><h2>The dead took the world.<br>Take it back.</h2><p>Pick your survivor. Raid the ruins. Recover the cure.<br>Three fragments. One life. No second chances.</p><div class="actions">${btn('Start game →','new')}${btn('Read the field manual','help','secondary')}</div><div class="hero-facts"><span>03 SURVIVORS</span><span>03 RAID ZONES</span><span>01 LIFE</span></div></div><div class="hero-note"><span class="live">● SIGNAL DETECTED</span><p>“Do you think you can save the world?”</p></div></section><div class="intro-grid"><article><small>01 / PREPARE</small><h3>Choose your edge.</h3><p>Every survivor has a strength. Every loadout has a cost.</p></article><article><small>02 / SURVIVE</small><h3>Make the call.</h3><p>Five encounters. Yes or no. Live with the consequences.</p></article><article><small>03 / RESTORE</small><h3>Bring hope home.</h3><p>Collect three cure fragments before the dead collect you.</p></article></div>`;
    else if(s.phase==='characters')html=`<section class="page"><span class="eyebrow">01 / YOUR LAST SURVIVOR</span><h1>Who goes into the dark?</h1><p class="lead">This choice stays with you for the entire run.</p><div class="character-grid">${C.characters.map(c=>card(c,'character','')).join('')}</div><div class="notice">Combat: fight & breach · Stealth: hide & navigate · Scavenging: search & repair</div></section>`;
    else if(s.phase==='prepare')html=`<section class="page">${hud()}<span class="eyebrow">PREPARATION / RAID ${s.completed+1}</span><h1>Gear up. Get out. Get back.</h1><p class="lead">Choose your route and the tools that might keep you alive.</p><h2><span class="number">01</span> Raid location</h2><div class="location-grid">${C.locations.map(l=>card(l,'location',s.location)).join('')}</div><div class="equipment-grid"><section><h2><span class="number">02</span> Weapon</h2>${C.weapons.map(w=>card(w,'weapon',s.weapon)).join('')}</section><section><h2><span class="number">03</span> Gear</h2>${C.gear.map(g=>card(g,'gear',s.gear)).join('')}</section></div><div class="launch"><div><span class="eyebrow">EFFECTIVE CHECK STATS</span><p>${stats.map(t=>`${label(t)} <b>${R.item('characters',s.character)[t]+R.bonuses(s,t)}</b>`).join(' &nbsp; / &nbsp; ')}</p><small>Tier ${s.tier+1} equipment · ${s.completed*9}% difficulty penalty · health persists</small></div>${btn('Begin raid →','raid')}</div></section>`;
    else if(['raid','outcome'].includes(s.phase)){
      const l=R.item('locations',s.location),e=s.encounters[s.index];html=`<section class="page">${hud()}<div class="raid-layout"><aside class="raid-sidebar">${art(l.id,'scene')}<span class="eyebrow">${l.label}</span><h2>${l.name}</h2><p>${l.description}</p><hr><small>YOUR LOADOUT</small><p>${R.item('weapons',s.weapon).name}<br>${R.item('gear',s.gear).name}<br>Tier ${s.tier+1}</p><hr><small>RAID PROGRESS</small><div class="steps">${[0,1,2,3,4].map(i=>`<span class="${i<=s.index?'active':''}">${i+1}</span>`).join('')}</div></aside><article class="encounter"><span class="eyebrow">ENCOUNTER ${s.index+1} / 5 — STAY ALIVE</span>${art('zombie','enemy')}<h1>${e.question}</h1>${s.phase==='raid'?`<p class="lead">Make your call. Both routes carry risk.</p><div class="decision-grid">${['yes','no'].map(a=>{const x=e[a];return `<button class="decision" data-action="${a}"><strong>${label(a)} <span>→</span></strong><b>${x.action}</b><small>Success: +${x.supplies+(R.item('gear',s.gear).supplies||0)} supplies${x.heal||R.item('gear',s.gear).healing?`, up to +${x.heal+(R.item('gear',s.gear).healing||0)+(R.item('gear',s.gear).healing?s.tier:0)} HP`:''}<br>Failure: ${Math.max(1,x.damage+s.completed*4-(R.item('gear',s.gear).armor||0)-(R.item('gear',s.gear).armor?s.tier:0))} damage</small></button>`;}).join('')}</div><p class="odds-note">Trust your survivor and your gear. Neither route guarantees survival.</p>`:`<div class="outcome ${s.last.success?'good':'bad'}" role="status"><span class="eyebrow">${s.last.success?'✓ CHECK SUCCEEDED':'✕ CHECK FAILED'}</span><h2>${s.last.action}</h2><p>${s.last.success?'You secure the route and recover useful supplies.':'The dead close in. You escape, but the mistake costs you.'}</p><p><b>${s.last.damage?`−${s.last.damage} health`:`+${s.last.supplies} supplies · +${s.last.healing} health`}</b></p></div>${btn(s.index===4?'Return to camp →':'Continue →','next')}`}</article></div></section>`;
    } else if(s.phase==='summary')html=`<section class="result page">${art('fragment','result-art')}<span class="eyebrow">TRANSMISSION RECEIVED / RAID COMPLETE</span><h1>You made it back.</h1><p class="lead">One more piece of the cure. One less reason to give up.</p>${progress()}<div class="result-panel"><p><b>${s.completed} / 3 cure fragments recovered</b></p><p>Camp recovery: +${s.recovery} health. ${s.usedSupplies} supplies consumed.<br>Current health: ${s.hp} / ${R.item('characters',s.character).health}.</p><p>All weapons and gear upgraded to tier ${s.tier+1}.<br>Each gains +1 in its specialty. Next raid: −${s.completed*9}% odds and +${s.completed*4} base damage.</p></div>${btn('Prepare next raid →','prepare')}</section>`;
    else if(s.phase==='death')html=`<section class="result page death">${art('zombie','result-art')}<span class="eyebrow">SIGNAL LOST / SURVIVOR DOWN</span><h1>The dark won this time.</h1><p class="lead">${R.item('characters',s.deathProgress.character).name} fell on raid ${s.deathProgress.completed+1}, encounter ${s.deathProgress.encounter}.</p><div class="result-panel"><h2>${s.deathProgress.completed} / 3 fragments recovered</h2><p>Final check: ${s.last.action}. Took ${s.last.damage} damage.</p><p>Your cure fragments, equipment upgrades and raid progress are lost. A new survivor starts from zero.</p></div>${btn('New run →','new')}</section>`;
    else if(s.phase==='victory')html=`<section class="result page">${art('victory','result-art')}<span class="eyebrow">FORMULA COMPLETE / HOPE RESTORED</span><h1>The world gets another day.</h1><p class="lead">${R.item('characters',s.character).name} survived all fifteen encounters.<br>Three fragments. One cure. A future worth fighting for.</p>${progress()}<div class="result-panel"><h2>✓ Cure assembled</h2><p>The first batch leaves camp at dawn. Somewhere beyond the barricades, the world begins to heal.</p><p>Final health: ${s.hp}. All three raids completed.</p></div>${btn('Play again →','new')}</section>`;
    app.innerHTML=html;app.focus({preventScroll:true});
  }
  // Debounce physical clicks across screen changes. Engine phase guards also
  // reject duplicate resolutions and rewards, including programmatic repeats.
  let lastActionTime=0;
  app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const now=performance.now();if(now-lastActionTime<280)return;lastActionTime=now;
    if(b.dataset.choice){const type=b.dataset.choice;if(type==='character')R.selectCharacter(state,b.dataset.id);else if(state.phase==='prepare')state[type]=b.dataset.id;render();return;}
    const a=b.dataset.action;if(a==='help'){showHelp();return;}if(a==='new'){state=R.fresh();state.phase='characters';}else if(a==='raid')R.startRaid(state);else if(a==='yes'||a==='no')R.resolve(state,a);else if(a==='next')R.next(state);else if(a==='prepare'&&state.phase==='summary')state.phase='prepare';render();window.scrollTo({top:0,behavior:'instant'});
  });
  const dialog=document.querySelector('#instructions');function showHelp(){dialog.showModal();}document.querySelector('#help').onclick=showHelp;document.querySelector('#close-help').onclick=()=>dialog.close();document.querySelector('#crt').onclick=e=>{const on=document.body.classList.toggle('crt');e.target.textContent=`CRT: ${on?'ON':'OFF'}`;e.target.setAttribute('aria-pressed',String(on));};
  // Motion preferences persist independently of the run. Reduced-motion always
  // uses the original still image; hiding a GIF alone would not pause its frames.
  const motionButton=document.querySelector('#motion');
  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled=true;
  try { motionEnabled=localStorage.getItem('zraid-motion')!=='off'; } catch (_) {}
  function syncMotion(){
    const reduced=motionPreference.matches;
    const on=motionEnabled&&!reduced;
    document.body.classList.toggle('motion-off',!on);
    motionButton.textContent=reduced?'Motion: Reduced':`Motion: ${on?'ON':'OFF'}`;
    motionButton.setAttribute('aria-pressed',String(on));
    motionButton.disabled=reduced;
  }
  motionButton.onclick=()=>{
    motionEnabled=!motionEnabled;
    try {localStorage.setItem('zraid-motion',motionEnabled?'on':'off');} catch (_) {}
    syncMotion();
  };
  motionPreference.addEventListener('change',syncMotion);
  syncMotion();
  render();
})();
