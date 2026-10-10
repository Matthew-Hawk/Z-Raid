(() => {
  'use strict';
  const C=ZContent,R=ZRules,art=ZArt,app=document.querySelector('#app');
  let state=R.fresh(),ui={character:'rook',step:0};
  const stats=['combat','stealth','scavenging'],stages=['Location','Weapon','Gear','Review'];
  const manual=[
    ['The mission','Choose a survivor for the whole run. Survive five encounters per raid to earn a cure fragment. Collect three fragments to save the world.','One life. Zero health clears fragments, upgrades and supplies. Reloading also starts fresh.'],
    ['Know your survivor','Combat helps with fights and forced entry. Stealth helps with hiding and navigation. Scavenging helps with searches and repairs.','Weapons and gear change these strengths. Specialize or pick complementary tools. Your survivor is fixed; your route and loadout can change at camp.'],
    ['Make the call','Yes and No describe specific actions. Both can succeed or fail. Your stats, equipment, location and raid difficulty shape the hidden checks.','Better stats never guarantee survival. Use the action, possible rewards and damage to judge the route.'],
    ['Watch pursuit','Loud routes draw infected even on success. Quiet routes break the trail. Failures also attract attention.','Pursuit runs from 0 to 8. More pursuit makes later checks tougher and injuries worse. Neither Yes nor No is always quiet. Pursuit clears at camp.'],
    ['Camp & upgrades','Camp restores 8 health plus 2 per supply, using at most 6 supplies: up to 20 health, capped at your maximum. All supplies are consumed.','Each completed raid upgrades all eight items by +1 in their specialty. Vest armor and kit healing improve too. Later raids are more dangerous.'],
    ['Controls & display','Use touch, mouse, or Tab and Enter/Space. Browse the choices, read the selected item, then continue. Back lets you revise your loadout.','Motion toggles animation. CRT adds scanlines. Reduced-motion settings stop animation automatically. Runs are not saved.']
  ];
  const label=s=>s[0].toUpperCase()+s.slice(1);
  const btn=(text,action,cls='primary')=>`<button class="${cls}" data-action="${action}">${text}</button>`;
  const heading=(kicker,title,subtitle='')=>`<div class="screen-heading"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>`;
  const hint=x=>x.noise>0?'Loud · draws pursuit':x.noise<0?'Quiet · breaks the trail':'Steady · holds pursuit';
  function hud(){const c=R.item('characters',state.character);return `<section class="hud" aria-label="Run status"><div class="survivor-status">${art(c.id)}<div><b>${c.name} · ${state.hp}/${c.health} HP</b><meter min="0" max="${c.health}" value="${state.hp}" aria-label="Health"></meter></div></div><div><span>CURE</span><b>${state.completed}/3 fragments</b></div><div><span>RAID ${state.completed+1}/3</span><b>${['Rising','High','Critical'][Math.min(2,state.completed)]} threat</b></div><div><span>SUPPLIES</span><b>${state.supplies}</b></div><div class="pursuit-tracker"><span>PURSUIT</span><b>${state.pressure<=1?'Quiet':state.pressure<=4?'Stirring':'Hunted'} · ${state.pressure}/8</b></div></section>`;}
  const fragments=()=>`<div class="fragments" aria-label="${state.completed} of 3 fragments">${[1,2,3].map(n=>`<span class="${state.completed>=n?'filled':''}">${art('fragment')}<small>0${n}</small></span>`).join('')}</div>`;
  function detail(x){
    const tags=x.health?`${x.health} HP · Combat ${x.combat} · Stealth ${x.stealth} · Scavenge ${x.scavenging}`:x.bonuses?stats.filter(t=>x.bonuses[t]||x.specialty===t).map(t=>{const n=(x.bonuses[t]||0)+(x.specialty===t?state.tier:0);return `${label(t)} ${n>=0?'+':''}${n}`;}).join(' · '):`Hazards: Combat ${x.hazards.combat} · Stealth ${x.hazards.stealth} · Scavenge ${x.hazards.scavenging}`;
    const note=x.health?'Combat: fight · Stealth: hide · Scavenge: search':x.armor?`Absorbs ${x.armor+state.tier} damage per failed check.`:x.healing?`Adds ${x.healing+state.tier} healing to successful checks.`:'';
    return `<article class="selected-detail">${art(x.id,'portrait')}<div><span class="eyebrow">${x.role||x.label||`EQUIPMENT TIER ${state.tier+1}`}</span><h2>${x.name}</h2><p>${x.description}</p><div class="tags">${tags}</div>${note?`<p class="detail-note">${note}</p>`:''}</div></article>`;
  }
  // A master/detail layout keeps every option reachable without long card stacks.
  function selector(catalog,type,selected){return `<div class="selection-layout"><div class="option-list" role="group" aria-label="Choose ${type}">${catalog.map(x=>`<button class="choice ${x.id===selected?'selected':''}" data-choice="${type}" data-id="${x.id}" aria-pressed="${x.id===selected}">${art(x.id)}<b>${x.name}</b><span>${x.id===selected?'✓':'+'}</span></button>`).join('')}</div>${detail(catalog.find(x=>x.id===selected))}</div>`;}
  function preparation(){
    const types=['location','weapon','gear'],type=types[ui.step];
    const titles=['Choose your raid zone.','Choose your weapon.','Choose your gear.','Ready to leave camp?'];
    const subtitles=['Different ruins. Different threats.','Match your weapon to your survivor.','One item. Make it count.','Check your route and loadout.'];
    const nav=`<nav class="prep-steps" aria-label="Preparation steps">${stages.map((name,i)=>`<button data-step="${i}" ${i===ui.step?'aria-current="step"':''}><span>0${i+1}</span> ${name}</button>`).join('')}</nav>`;
    const c=R.item('characters',state.character);
    const review=`<div class="review-panel"><div class="loadout-review">${types.map(t=>{const x=R.item(t==='location'?'locations':t==='weapon'?'weapons':'gear',state[t]);return `<div>${art(x.id)}<span><small>${label(t)}</small><b>${x.name}</b></span></div>`;}).join('')}</div><div class="review-stats"><span class="eyebrow">EFFECTIVE STATS</span><p>${stats.map(t=>`${label(t)} <b>${c[t]+R.bonuses(state,t)}</b>`).join(' · ')}</p><p>Tier ${state.tier+1} equipment · ${state.hp}/${c.health} HP</p><p class="detail-note">Five encounters. Health carries through the raid. Pursuit begins at zero.</p></div></div>`;
    const content=ui.step===3?review:selector(C[type==='location'?'locations':type==='weapon'?'weapons':'gear'],type,state[type]);
    return `<section class="screen prep-screen">${hud()}${nav}${heading(`PREPARE / RAID ${state.completed+1}`,titles[ui.step],subtitles[ui.step])}${content}<div class="screen-actions">${ui.step?btn('← Back','prep-back','secondary'):'<span class="action-note">Your survivor stays with you.</span>'}${ui.step===3?btn('Begin raid →','raid'):btn(`Next: ${stages[ui.step+1]} →`,'prep-next')}</div></section>`;
  }
  function narration(x){return `<div class="story-tabs" role="group" aria-label="Result details"><button data-story="0" aria-pressed="${!ui.storyPage}">What happened</button><button data-story="1" aria-pressed="${!!ui.storyPage}">Gear & pursuit</button></div><div class="story-copy"><p>${ui.storyPage?x.narrative.context:x.narrative.scene}</p>${ui.storyPage?'':`<p>${x.narrative.reason}</p>`}</div>`;}
  function raid(){
    const s=state,l=R.item('locations',s.location),e=s.encounters[s.index],g=R.item('gear',s.gear);
    const context=`<div class="raid-context"><b>${l.name} · ${s.storyline.name}</b><span>${R.item('weapons',s.weapon).name} · ${g.name} · T${s.tier+1}</span></div>`;
    let content;
    if(s.phase==='raid')content=`${heading(`ENCOUNTER ${s.index+1}/5`,e.question)}<div class="decision-grid">${['yes','no'].map(answer=>{const x=e[answer],heal=x.heal+(g.healing||0)+(g.healing?s.tier:0);return `<button class="decision" data-action="${answer}"><strong>${label(answer)} <span>→</span></strong><b>${x.action}</b><span class="pursuit">${hint(x)}</span><small>Gain ${x.supplies+(g.supplies||0)} supplies${heal?` · heal up to ${heal}`:''}<br>Risk ${R.damage(s,x)} damage</small></button>`;}).join('')}</div><p class="odds-note">${s.index===0?s.storyline.mission:'Both routes carry risk. Neither guarantees survival.'}</p>`;
    else{const x=s.last;content=`<div class="outcome ${x.success?'good':'bad'}" role="status">${heading(`ENCOUNTER ${s.index+1}/5 · ${x.success?'✓ SUCCESS':'✕ FAILED'}`,x.action)}${narration(x)}<div class="outcome-reward">${x.damage?`−${x.damage} health`:`+${x.supplies} supplies · +${x.healing} health`}</div></div><div class="screen-actions single">${btn(s.index===4?'Return to camp →':'Continue →','next')}</div>`;}
    return `<section class="screen raid-screen">${hud()}${context}<div class="raid-body">${content}</div></section>`;
  }
  function ending(){const s=state;let icon,kicker,title,text,info,action;
    if(s.phase==='summary'){icon='fragment';kicker='RAID COMPLETE';title='You made it back.';text=s.storyline.ending;info=`<b>${s.completed}/3 cure fragments recovered</b><p>Camp: +${s.recovery} HP · ${s.usedSupplies} supplies consumed.</p><p>Health ${s.hp}/${R.item('characters',s.character).health} · pursuit cleared.</p><p>Tier ${s.tier+1} unlocked for all equipment.<br>+1 specialty · improved vest armor & kit healing.</p><p class="detail-note">Next raid: tougher checks and +${s.completed*5} base damage.</p>`;action=btn('Prepare next raid →','prepare');}
    else if(s.phase==='death'){icon='zombie';kicker='SIGNAL LOST';title='The dark won this time.';text=`${R.item('characters',s.deathProgress.character).name} fell on raid ${s.deathProgress.completed+1}, encounter ${s.deathProgress.encounter}.`;info=`<b>${s.deathProgress.completed}/3 fragments recovered</b>${narration(s.last)}<p>${s.last.damage} damage · Fragments and upgrades lost.</p>`;action=btn('New run →','new');}
    else{icon='victory';kicker='FORMULA COMPLETE';title='The world gets another day.';text=`${R.item('characters',s.character).name} survived all fifteen encounters.`;info=`<b>✓ Cure assembled</b><p>${s.storyline.ending}</p><p>The first batch leaves camp at dawn.</p><p>Final health: ${s.hp} · all three raids completed.</p>`;action=btn('Play again →','new');}
    return `<section class="screen result">${art(icon,'result-art')}${heading(kicker,title,text)}${s.phase!=='death'?fragments():''}<div class="result-panel">${info}</div><div class="screen-actions single">${action}</div></section>`;
  }
  function render(){
    app.dataset.phase=state.phase;
    if(state.phase==='title')app.innerHTML=`<section class="hero"><div class="hero-shade"></div><div class="hero-copy"><span class="eyebrow">TRANSMISSION 001 / THE LAST CHANCE</span><h1>Z<span>-</span>RAID<span class="dot">.</span></h1><h2>The dead took the world.<br>Take it back.</h2><p>Pick your survivor. Raid the ruins. Recover the cure.<br>Three fragments. One life.</p><div class="actions">${btn('Start game →','new')}${btn('How to play','help','secondary')}</div><div class="hero-facts"><span>03 SURVIVORS</span><span>03 RAID ZONES</span><span>01 LIFE</span></div></div><div class="hero-note"><span class="live">● SIGNAL DETECTED</span><p>“Do you think you can save the world?”</p></div></section>`;
    else if(state.phase==='characters')app.innerHTML=`<section class="screen character-screen">${heading('01 / YOUR SURVIVOR','Who goes into the dark?','One choice for the entire run.')}${selector(C.characters,'character',ui.character)}<div class="screen-actions"><span class="action-note">Select a portrait to compare.</span>${btn(`Choose ${R.item('characters',ui.character).name} →`,'choose-character')}</div></section>`;
    else if(state.phase==='prepare')app.innerHTML=preparation();
    else if(['raid','outcome'].includes(state.phase))app.innerHTML=raid();
    else app.innerHTML=ending();
    app.focus({preventScroll:true});
  }
  // Debounce transitions; the rules also guard duplicate resolutions and rewards.
  let lastActionTime=0;
  app.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;const now=performance.now();if(now-lastActionTime<280)return;lastActionTime=now;
    if(b.dataset.story!==undefined&&['outcome','death'].includes(state.phase))ui.storyPage=Number(b.dataset.story);
    else if(b.dataset.choice){if(b.dataset.choice==='character'&&state.phase==='characters')ui.character=b.dataset.id;else if(state.phase==='prepare')state[b.dataset.choice]=b.dataset.id;}
    else if(b.dataset.step!==undefined&&state.phase==='prepare')ui.step=Number(b.dataset.step);
    else{const a=b.dataset.action;if(a==='help'){showHelp();return;}if(a==='new'){state=R.fresh();state.phase='characters';ui={character:'rook',step:0};}else if(a==='choose-character')R.selectCharacter(state,ui.character);else if(a==='prep-next'&&state.phase==='prepare')ui.step=Math.min(3,ui.step+1);else if(a==='prep-back'&&state.phase==='prepare')ui.step=Math.max(0,ui.step-1);else if(a==='raid'&&ui.step===3)R.startRaid(state);else if(['yes','no'].includes(a)){ui.storyPage=0;R.resolve(state,a);}else if(a==='next')R.next(state);else if(a==='prepare'&&state.phase==='summary'){state.phase='prepare';ui.step=0;}}
    render();
  });
  const dialog=document.querySelector('#instructions');let manualPage=0;
  function renderManual(){const p=manual[manualPage];document.querySelector('#manual-content').innerHTML=`<span class="eyebrow">FIELD MANUAL ${manualPage+1}/${manual.length}</span><h2 id="manual-title">${p[0]}</h2><p>${p[1]}</p><p>${p[2]}</p>`;document.querySelector('#manual-prev').disabled=manualPage===0;document.querySelector('#manual-next').disabled=manualPage===manual.length-1;document.querySelector('#manual-count').textContent=`${manualPage+1} / ${manual.length}`;}
  function showHelp(){manualPage=0;renderManual();dialog.showModal();}
  document.querySelector('#help').onclick=showHelp;document.querySelector('#close-help').onclick=()=>dialog.close();
  document.querySelector('#manual-prev').onclick=()=>{manualPage=Math.max(0,manualPage-1);renderManual();};document.querySelector('#manual-next').onclick=()=>{manualPage=Math.min(manual.length-1,manualPage+1);renderManual();};
  document.querySelector('#crt').onclick=e=>{const on=document.body.classList.toggle('crt');e.target.textContent=`CRT: ${on?'ON':'OFF'}`;e.target.setAttribute('aria-pressed',String(on));};
  const ambient=document.querySelector('#ambient');for(let i=0;i<22;i++){const mote=document.createElement('span');mote.className='mote';mote.style.cssText=`--x:${(i*43+7)%100}%;--y:${(i*29+11)%100}%;--duration:${18+i%7*3}s;--delay:-${i*2.7}s`;ambient.appendChild(mote);}
  const motionButton=document.querySelector('#motion'),motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');let motionEnabled=true;
  try{motionEnabled=localStorage.getItem('zraid-motion')!=='off';}catch(_){}
  function syncMotion(){const reduced=motionPreference.matches,on=motionEnabled&&!reduced;document.body.classList.toggle('motion-off',!on);motionButton.textContent=reduced?'Motion: Reduced':`Motion: ${on?'ON':'OFF'}`;motionButton.setAttribute('aria-pressed',String(on));motionButton.disabled=reduced;}
  motionButton.onclick=()=>{motionEnabled=!motionEnabled;try{localStorage.setItem('zraid-motion',motionEnabled?'on':'off');}catch(_){}syncMotion();};motionPreference.addEventListener('change',syncMotion);syncMotion();render();
})();
